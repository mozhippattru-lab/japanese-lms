import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { DashStyles, CardHead, Kpi } from '@/components/DashboardKit'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Motion'
import { BookOpen, CalendarCheck, ClipboardList, Target, Clock } from 'lucide-react'

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  const name = profile?.full_name || user.email || 'Student'
  const firstName = name.split(' ')[0]
  const level = profile?.jlpt_level || 'N5'
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  // Fetch real student data (RLS scoped to own rows)
  const [
    { data: attendanceRows },
    { data: pendingSubmissions },
    { data: assignments },
  ] = await Promise.all([
    supabase.from('attendance_records').select('status').eq('student_id', user.id),
    supabase.from('assignment_submissions').select('id').eq('student_id', user.id).is('graded_at', null),
    supabase.from('assignments').select('id, title, due_date').order('due_date', { ascending: true }).limit(5),
  ])

  // Mock test scores are not tracked in the database yet — show as empty.
  const testScores: { test_name: string; score: number; max_score: number; test_date: string }[] = []

  // Attendance %
  const total = attendanceRows?.length ?? 0
  const present = attendanceRows?.filter(r => r.status === 'Present').length ?? 0
  const attendancePct = total > 0 ? `${Math.round((present / total) * 100)}%` : '—'

  // Pending assignments
  const pendingCount = pendingSubmissions?.length ?? 0

  // Last mock score
  const lastScore = testScores[0]
  const lastScoreStr = lastScore ? `${lastScore.score}/${lastScore.max_score}` : '—'

  // Format due date
  function dueSoon(dateStr: string | null) {
    if (!dateStr) return 'No due date'
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'Overdue'
    if (diff === 0) return 'Due today'
    if (diff === 1) return 'Due tomorrow'
    return `Due in ${diff} days`
  }

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={name} />
      <main className="dash-main">
        <DashStyles />

        <Reveal>
          <header className="dash-header">
            <div>
              <p className="dash-eyebrow">学生ダッシュボード · Student</p>
              <h1 className="dash-title">おかえりなさい、<span>{firstName}</span></h1>
              <p className="dash-subtitle">Let&apos;s continue your journey to fluent Japanese.</p>
            </div>
            <div className="dash-datechip">
              <span className="dash-datechip-jp">{level}</span>
              <span className="dash-datechip-sub">{today}</span>
            </div>
          </header>
        </Reveal>

        <Stagger className="dash-kpis">
          <StaggerItem><Kpi label="Current Level" value={level}          sub="your level"  icon={<BookOpen size={18} />}      color="#e84040" /></StaggerItem>
          <StaggerItem><Kpi label="Attendance"    value={attendancePct}  sub={`${present}/${total} classes`} icon={<CalendarCheck size={18} />} color="#22c55e" /></StaggerItem>
          <StaggerItem><Kpi label="Assignments"   value={String(pendingCount)} sub="pending" icon={<ClipboardList size={18} />} color="#c2974b" /></StaggerItem>
          <StaggerItem><Kpi label="Mock Score"    value={lastScoreStr}   sub="last test"   icon={<Target size={18} />}        color="#2d7dd2" /></StaggerItem>
        </Stagger>

        <Reveal delay={0.12} className="dash-grid">
          {/* Upcoming assignments */}
          <section className="dash-card">
            <CardHead jp="課題" title="Upcoming Assignments" href="/dashboard/student/assignments" />
            {(!assignments || assignments.length === 0) ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '13px', padding: '12px 0' }}>No assignments yet.</p>
            ) : (
              <div className="dash-list">
                {assignments.map((a) => {
                  const label = dueSoon(a.due_date)
                  const urgent = label === 'Due today' || label === 'Due tomorrow' || label === 'Overdue'
                  return (
                    <div key={a.id} className="dash-row">
                      <div>
                        <div className="dash-row-title">{a.title}</div>
                        <div className="dash-row-sub" style={urgent ? { color: '#dc2626', fontWeight: 600 } : undefined}>{label}</div>
                      </div>
                      <button className="dash-btn dash-btn-red">Submit</button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Test scores */}
          <section className="dash-card">
            <CardHead jp="成績" title="Recent Test Scores" href="/dashboard/student/tests" />
            {(!testScores || testScores.length === 0) ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '13px', padding: '12px 0' }}>No test scores yet.</p>
            ) : (
              <div>
                {testScores.map((t, i) => {
                  const pct = t.score / t.max_score
                  const sc = pct > 0.7 ? '#22c55e' : pct > 0.5 ? '#c2974b' : '#e84040'
                  return (
                    <div key={i} className="dash-divrow">
                      <div>
                        <div className="dash-row-title">{t.test_name}</div>
                        <div className="dash-row-sub">{new Date(t.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                      </div>
                      <div className="dash-num"><span style={{ color: sc }}>{t.score}</span><small>/{t.max_score}</small></div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Attendance summary */}
          <section className="dash-card dash-span2">
            <CardHead jp="出席" title="Attendance Summary" href="/dashboard/student/attendance" />
            {total === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '13px', padding: '12px 0' }}>No attendance records yet.</p>
            ) : (
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: '42px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
                    {attendancePct}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>attendance rate</span>
                </div>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div className="dash-barrow" style={{ marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Present</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e' }}>{present}</span>
                  </div>
                  <div className="dash-bar"><div className="dash-bar-fill" style={{ width: `${total > 0 ? (present / total) * 100 : 0}%`, background: '#22c55e' }} /></div>
                  <div className="dash-barrow" style={{ marginTop: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Absent</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#e84040' }}>{total - present}</span>
                  </div>
                  <div className="dash-bar"><div className="dash-bar-fill" style={{ width: `${total > 0 ? ((total - present) / total) * 100 : 0}%`, background: '#e84040' }} /></div>
                </div>
              </div>
            )}
          </section>
        </Reveal>
      </main>
    </div>
  )
}
