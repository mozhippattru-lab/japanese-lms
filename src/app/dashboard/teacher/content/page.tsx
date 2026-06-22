import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { BookOpen, Video, FileText, Headphones, ClipboardCheck, Target } from 'lucide-react'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const LESSON_ICONS: Record<string, React.ReactNode> = {
  Video: <Video size={13} />, Reading: <FileText size={13} />, Audio: <Headphones size={13} />,
  Quiz: <ClipboardCheck size={13} />, Practice: <Target size={13} />,
}

export default async function TeacherContentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  // Get levels from teacher's batches
  const { data: batches } = await supabase.from('batches').select('jlpt_level').eq('teacher_id', user.id)
  const levels = [...new Set(batches?.map(b => b.jlpt_level).filter(Boolean) || [])]

  // Get courses for those levels
  const { data: courses } = levels.length
    ? await supabase
        .from('courses')
        .select(`id, title, jlpt_level, description, duration_weeks, status, enrolled_count,
          course_modules(id, title, order_index, lessons(id, title, lesson_type, duration_minutes, order_index))`)
        .in('jlpt_level', levels)
        .order('jlpt_level')
    : await supabase
        .from('courses')
        .select(`id, title, jlpt_level, description, duration_weeks, status, enrolled_count,
          course_modules(id, title, order_index, lessons(id, title, lesson_type, duration_minutes, order_index))`)
        .order('jlpt_level')

  const totalLessons = courses?.reduce((s, c) => {
    return s + (c.course_modules || []).reduce((ms: number, m: { lessons: unknown[] }) => ms + (m.lessons?.length || 0), 0)
  }, 0) || 0

  const card: React.CSSProperties = { background: '#fff', borderRadius: '12px', border: '1px solid #ececef' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Content Library</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>
            {courses?.length || 0} course{courses?.length !== 1 ? 's' : ''} · {totalLessons} lessons
          </p>
        </div>

        {!courses || courses.length === 0 ? (
          <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No courses available yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courses.map(course => {
              const lc = LEVEL_COLORS[course.jlpt_level] || '#9ca3af'
              const modules: Array<{ id: string; title: string; order_index: number; lessons: Array<{ id: string; title: string; lesson_type: string; duration_minutes: number | null; order_index: number }> }> =
                (course.course_modules || []).slice().sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index)
              const totalCourseLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0)
              const totalMinutes = modules.reduce((s, m) => s + (m.lessons || []).reduce((ls: number, l: { duration_minutes: number | null }) => ls + (l.duration_minutes || 0), 0), 0)

              return (
                <div key={course.id} style={card}>
                  {/* Course Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: lc + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={20} color={lc} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{course.title}</h3>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: lc, background: lc + '18', padding: '2px 9px', borderRadius: '99px' }}>{course.jlpt_level}</span>
                        {course.status !== 'Active' && (
                          <span style={{ fontSize: '10px', color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: '99px' }}>{course.status}</span>
                        )}
                      </div>
                      {course.description && (
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.description}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexShrink: 0, textAlign: 'right' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)' }}>{modules.length}</div>
                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>modules</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)' }}>{totalCourseLessons}</div>
                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>lessons</div>
                      </div>
                      {totalMinutes > 0 && (
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)' }}>{Math.round(totalMinutes / 60)}h</div>
                          <div style={{ fontSize: '10px', color: '#9ca3af' }}>content</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modules */}
                  {modules.length > 0 && (
                    <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {modules.map(mod => {
                        const lessons = (mod.lessons || []).slice().sort((a, b) => a.order_index - b.order_index)
                        return (
                          <details key={mod.id} style={{ borderRadius: '8px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                            <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', cursor: 'pointer', background: '#f9fafb', fontSize: '13px', fontWeight: '600', color: '#374151', listStyle: 'none', userSelect: 'none' }}>
                              <span>{mod.title}</span>
                              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</span>
                            </summary>
                            {lessons.length > 0 && (
                              <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '4px', background: '#fff' }}>
                                {lessons.map(lesson => (
                                  <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid #f9fafb' }}>
                                    <span style={{ color: '#9ca3af', display: 'flex', flexShrink: 0 }}>{LESSON_ICONS[lesson.lesson_type] || <FileText size={13} />}</span>
                                    <span style={{ flex: 1, fontSize: '12px', color: '#374151' }}>{lesson.title}</span>
                                    {lesson.duration_minutes && (
                                      <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0 }}>{lesson.duration_minutes} min</span>
                                    )}
                                    <span style={{ fontSize: '10px', color: '#9ca3af', background: '#f3f4f6', padding: '2px 7px', borderRadius: '99px', flexShrink: 0 }}>{lesson.lesson_type}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </details>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
