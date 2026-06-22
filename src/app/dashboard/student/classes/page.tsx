import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { Clock, Calendar, Users } from 'lucide-react'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getNextClassDays(days: string | string[] | null, count = 5): string[] {
  if (!days) return []
  const dayList = Array.isArray(days) ? days : String(days).split(',').map(d => d.trim())
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const targetDays = dayList.map(d => dayMap[d]).filter(d => d !== undefined)
  if (targetDays.length === 0) return []

  const dates: string[] = []
  const d = new Date()
  let iterations = 0
  while (dates.length < count && iterations < 60) {
    if (targetDays.includes(d.getDay())) {
      dates.push(d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }))
    }
    d.setDate(d.getDate() + 1)
    iterations++
  }
  return dates
}

export default async function StudentClassesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  const { data: enrollments } = await supabase
    .from('student_batches')
    .select('id, batch:batches(id, name, jlpt_level, time_slot, days, status, teacher_name, enrolled, capacity)')
    .eq('student_id', user.id)
    .eq('status', 'Active')

  type BatchInfo = { id: string; name: string; jlpt_level: string; time_slot: string | null; days: string | string[] | null; status: string; teacher_name: string | null; enrolled: number; capacity: number }
  const batches = (enrollments || [])
    .map(e => e.batch as unknown as BatchInfo | null)
    .filter(Boolean)

  // Build a flat schedule for the next 7 days
  const today = new Date()
  const next7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  const schedule = next7.map(d => {
    const dayName = DAY_ABBR[d.getDay()]
    const dateStr = d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short' })
    const isToday = d.toDateString() === today.toDateString()
    const classes = batches.filter(b => {
      if (!b || b.status !== 'Active') return false
      const days = b.days
      const dayList = Array.isArray(days) ? days : String(days || '').split(',').map(x => x.trim())
      return dayList.includes(dayName)
    })
    return { dateStr, isToday, classes, dayName }
  }).filter(d => d.classes.length > 0)

  const card: React.CSSProperties = { background: '#fff', borderRadius: '12px', border: '1px solid #ececef' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Live Classes</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Your upcoming class schedule for the next 7 days</p>
        </div>

        {batches.length === 0 ? (
          <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            You are not enrolled in any active batches yet.
          </div>
        ) : schedule.length === 0 ? (
          <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No classes scheduled in the next 7 days.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {schedule.map(({ dateStr, isToday, classes }) => (
              <div key={dateStr}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '13px', fontWeight: '700', color: isToday ? 'var(--red)' : '#374151', margin: 0 }}>{dateStr}</h2>
                  {isToday && <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--red)', background: 'rgba(232,64,64,0.1)', padding: '2px 8px', borderRadius: '99px' }}>TODAY</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {classes.map(b => {
                    if (!b) return null
                    const lc = LEVEL_COLORS[b.jlpt_level] || '#9ca3af'
                    return (
                      <div key={b.id} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderLeft: `4px solid ${lc}` }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{b.name}</h3>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: lc, background: lc + '18', padding: '2px 8px', borderRadius: '99px' }}>{b.jlpt_level}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            {b.time_slot && (
                              <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={11} color="#9ca3af" />{b.time_slot}
                              </span>
                            )}
                            {b.teacher_name && (
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>Sensei {b.teacher_name}</span>
                            )}
                            <span style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Users size={11} color="#9ca3af" />{b.enrolled} students
                            </span>
                          </div>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9ca3af' }}>
                            <Calendar size={12} />
                            {b.days ? (Array.isArray(b.days) ? b.days.join(', ') : b.days) : ''}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enrolled Batches Summary */}
        {batches.length > 0 && (
          <div style={{ marginTop: '28px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>All Enrolled Batches</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
              {batches.map(b => {
                if (!b) return null
                const lc = LEVEL_COLORS[b.jlpt_level] || '#9ca3af'
                const nextDates = getNextClassDays(b.days, 3)
                return (
                  <div key={b.id} style={{ ...card, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{b.name}</h3>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: lc, background: lc + '18', padding: '2px 8px', borderRadius: '99px' }}>{b.jlpt_level}</span>
                    </div>
                    {b.time_slot && <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '3px' }}>{b.time_slot}</div>}
                    {nextDates.length > 0 && (
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>Next: {nextDates.slice(0, 2).join(' · ')}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
