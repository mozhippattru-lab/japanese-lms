import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { BookOpen, Clock, Users, Video, FileText, Headphones, ClipboardCheck, Target } from 'lucide-react'
import { DashStyles } from '@/components/DashboardKit'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const LESSON_ICONS: Record<string, React.ReactNode> = {
  Video: <Video size={12} />, Reading: <FileText size={12} />, Audio: <Headphones size={12} />,
  Quiz: <ClipboardCheck size={12} />, Practice: <Target size={12} />,
}

export default async function StudentCoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  // Get enrolled batches
  const { data: enrollments } = await supabase
    .from('student_batches')
    .select('id, batch_id, enrolled_at, batch:batches(id, name, jlpt_level, time_slot, days, status, teacher_name, enrolled, capacity)')
    .eq('student_id', user.id)
    .eq('status', 'Active')

  // Get courses for student's level
  const level = profile?.jlpt_level
  const { data: courses } = level
    ? await supabase
        .from('courses')
        .select(`id, title, jlpt_level, description, duration_weeks, enrolled_count,
          course_modules(id, title, order_index, lessons(id, title, lesson_type, duration_minutes))`)
        .eq('jlpt_level', level)
        .eq('status', 'Active')
        .order('title')
    : { data: [] }

  const card: React.CSSProperties = { background: '#fff', borderRadius: '12px', border: '1px solid #ececef' }
  const eyebrow: React.CSSProperties = { fontSize: '10px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '3px' }

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main className="dash-main">

        <DashStyles />

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>My Courses</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>
            {enrollments?.length || 0} enrolled batch{enrollments?.length !== 1 ? 'es' : ''}
            {level ? ` · ${level} course material` : ''}
          </p>
        </div>

        {/* Enrolled Batches */}
        {enrollments && enrollments.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={eyebrow}>My Batches</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginTop: '8px' }}>
              {enrollments.map(e => {
                type B = { id: string; name: string; jlpt_level: string; time_slot: string | null; days: string | string[] | null; status: string; teacher_name: string | null; enrolled: number; capacity: number }
                const b = e.batch as unknown as B | null
                if (!b) return null
                const lc = LEVEL_COLORS[b.jlpt_level] || '#9ca3af'
                return (
                  <div key={e.id} style={{ ...card, overflow: 'hidden' }}>
                    <div style={{ height: '3px', background: lc }} />
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{b.name}</h3>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: lc, background: lc + '18', padding: '2px 9px', borderRadius: '99px' }}>{b.jlpt_level}</span>
                      </div>
                      {b.teacher_name && <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Sensei {b.teacher_name}</div>}
                      {b.time_slot && <div style={{ fontSize: '12px', color: '#9ca3af' }}>{b.time_slot}</div>}
                      {b.days && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px' }}>{Array.isArray(b.days) ? b.days.join(', ') : b.days}</div>}
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
                        Enrolled {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Courses for level */}
        {courses && courses.length > 0 ? (
          <div>
            <div style={eyebrow}>{level} Course Material</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              {courses.map(course => {
                const lc = LEVEL_COLORS[course.jlpt_level] || '#9ca3af'
                const modules: Array<{ id: string; title: string; order_index: number; lessons: Array<{ id: string; title: string; lesson_type: string; duration_minutes: number | null }> }> =
                  (course.course_modules || []).slice().sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
                const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0)
                const totalMins = modules.reduce((s, m) => s + (m.lessons || []).reduce((ls: number, l: { duration_minutes: number | null }) => ls + (l.duration_minutes || 0), 0), 0)

                return (
                  <div key={course.id} style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: modules.length > 0 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: lc + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={18} color={lc} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 3px' }}>{course.title}</h3>
                        {course.description && <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{course.description}</p>}
                      </div>
                      <div style={{ display: 'flex', gap: '14px', flexShrink: 0 }}>
                        {totalLessons > 0 && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy)' }}>{totalLessons}</div>
                            <div style={{ fontSize: '10px', color: '#9ca3af' }}>lessons</div>
                          </div>
                        )}
                        {totalMins > 0 && (
                          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} color="#9ca3af" />
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{Math.round(totalMins / 60)}h</span>
                          </div>
                        )}
                        {course.enrolled_count > 0 && (
                          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={12} color="#9ca3af" />
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{course.enrolled_count}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {modules.length > 0 && (
                      <div style={{ padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {modules.map((mod, mi) => {
                          const lessons = (mod.lessons || [])
                          return (
                            <div key={mod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '8px', background: '#f9fafb' }}>
                              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: lc + '18', color: lc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{mi + 1}</span>
                              <span style={{ flex: 1, fontSize: '13px', fontWeight: '500', color: '#374151' }}>{mod.title}</span>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                                {Object.entries(
                                  lessons.reduce((acc: Record<string, number>, l: { lesson_type: string }) => {
                                    acc[l.lesson_type] = (acc[l.lesson_type] || 0) + 1
                                    return acc
                                  }, {})
                                ).map(([type, count]) => (
                                  <span key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#9ca3af' }}>
                                    {LESSON_ICONS[type]}{count}
                                  </span>
                                ))}
                                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          !enrollments?.length && (
            <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              {level ? `No ${level} courses available yet.` : 'No courses found. Your JLPT level may not be set.'}
            </div>
          )
        )}
      </main>
    </div>
  )
}
