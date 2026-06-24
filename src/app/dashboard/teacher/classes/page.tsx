import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { Users, Clock, Calendar } from 'lucide-react'
import { DashStyles } from '@/components/DashboardKit'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const STATUS_COLORS: Record<string, string> = {
  Active: '#22c55e', Upcoming: '#2d7dd2', Completed: '#9ca3af', Paused: '#f59e0b',
}

export default async function TeacherClassesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  const { data: batches } = await supabase
    .from('batches')
    .select('*')
    .eq('teacher_id', user.id)
    .order('start_date', { ascending: false })

  const activeBatches = batches?.filter(b => b.status === 'Active') || []
  const totalStudents = batches?.reduce((s, b) => s + (b.enrolled || 0), 0) || 0

  const card: React.CSSProperties = { background: '#fff', borderRadius: '12px', border: '1px solid #ececef' }

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main className="dash-main">

        <DashStyles />

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>My Classes</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>{batches?.length || 0} batch{batches?.length !== 1 ? 'es' : ''} assigned to you</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ ...card, padding: '14px 20px', display: 'flex', gap: '22px' }}>
            {[
              { label: 'Total Batches', value: batches?.length || 0, color: 'var(--navy)' },
              { label: 'Active', value: activeBatches.length, color: '#22c55e' },
              { label: 'Students', value: totalStudents, color: '#2d7dd2' },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: i < arr.length - 1 ? '22px' : '0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color, letterSpacing: '-0.02em' }}>{value}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>{label}</div>
                </div>
                {i < arr.length - 1 && <div style={{ width: '1px', height: '36px', background: '#f3f4f6' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Batch Cards */}
        {!batches || batches.length === 0 ? (
          <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No batches assigned to you yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {batches.map(b => {
              const fillPct = b.capacity > 0 ? Math.round((b.enrolled / b.capacity) * 100) : 0
              const levelColor = LEVEL_COLORS[b.jlpt_level] || '#9ca3af'
              const statusColor = STATUS_COLORS[b.status] || '#9ca3af'
              return (
                <div key={b.id} style={{ ...card, overflow: 'hidden' }}>
                  <div style={{ height: '4px', background: levelColor }} />
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{b.name}</h3>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: levelColor, background: levelColor + '18', padding: '2px 9px', borderRadius: '99px' }}>{b.jlpt_level}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: statusColor, background: statusColor + '15', padding: '4px 10px', borderRadius: '99px', flexShrink: 0 }}>{b.status}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                      {b.time_slot && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#6b7280' }}>
                          <Clock size={12} color="#9ca3af" />{b.time_slot}
                        </div>
                      )}
                      {b.days && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#6b7280' }}>
                          <Calendar size={12} color="#9ca3af" />
                          {Array.isArray(b.days) ? b.days.join(', ') : b.days}
                        </div>
                      )}
                      {b.start_date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#6b7280' }}>
                          <span style={{ color: '#9ca3af', fontSize: '11px' }}>Started</span>
                          {new Date(b.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6b7280' }}>
                          <Users size={12} color="#9ca3af" />{b.enrolled} / {b.capacity} students
                        </div>
                        <span style={{ fontSize: '11px', color: fillPct >= 90 ? '#e84040' : '#9ca3af' }}>{fillPct}%</span>
                      </div>
                      <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${fillPct}%`, background: fillPct >= 90 ? '#e84040' : fillPct >= 70 ? '#f59e0b' : levelColor, borderRadius: '2px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
