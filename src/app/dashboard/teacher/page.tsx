import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { DashStyles, CardHead, Kpi } from '@/components/DashboardKit'
import { Users, GraduationCap, ClipboardList, Calendar } from 'lucide-react'

const SCHEDULE = [
  { time: '9:00 AM', batch: 'N5 — Morning Batch',   students: 14, status: 'Completed' },
  { time: '2:00 PM', batch: 'N4 — Afternoon Batch',  students: 18, status: 'Ongoing'   },
  { time: '6:00 PM', batch: 'N4 — Evening Batch',    students: 16, status: 'Upcoming'  },
]

const SUBMISSIONS = [
  { student: 'Ananya S.',  assignment: 'N4 Kanji Sheet',       submitted: '2h ago'    },
  { student: 'Rohan M.',   assignment: 'Grammar Worksheet 12',  submitted: '5h ago'    },
  { student: 'Preethi K.', assignment: 'Reading Comp #8',       submitted: 'Yesterday' },
]

const ATTENDANCE_ROWS = [
  ['N5 Morning',   '13/14', '14/14', '12/14', '14/14', '13/14', '92%'],
  ['N4 Afternoon', '16/18', '17/18', '15/18', '18/18', '17/18', '91%'],
  ['N4 Evening',   '14/16', '15/16', '13/16', '16/16', '14/16', '89%'],
  ['N3 Weekend',   '—',     '—',     '—',     '—',     '11/12', '91%'],
]

const STATUS_COLORS: Record<string, string> = {
  Completed: '#22c55e', Ongoing: '#e84040', Upcoming: '#c2974b',
}

export default async function TeacherDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  const name = profile?.full_name || user.email || 'Teacher'
  const firstName = name.split(' ')[0]
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={name} />
      <main className="dash-main">
        <DashStyles />

        <header className="dash-header">
          <div>
            <p className="dash-eyebrow">先生ダッシュボード · Teacher</p>
            <h1 className="dash-title">ようこそ、<span>{firstName}</span> 先生</h1>
            <p className="dash-subtitle">Your classes, students and grading at a glance.</p>
          </div>
          <div className="dash-datechip">
            <span className="dash-datechip-jp">先生</span>
            <span className="dash-datechip-sub">{today}</span>
          </div>
        </header>

        <section className="dash-kpis">
          <Kpi label="Students"       value="48" sub="all batches" icon={<Users size={18} />}         color="#2d7dd2" />
          <Kpi label="Batches"        value="4"  sub="active"      icon={<GraduationCap size={18} />} color="#e84040" />
          <Kpi label="Pending Grades" value="12" sub="to grade"    icon={<ClipboardList size={18} />} color="#c2974b" />
          <Kpi label="Classes Today"  value="3"  sub="next 6 PM"   icon={<Calendar size={18} />}      color="#22c55e" />
        </section>

        <div className="dash-grid">
          {/* Schedule */}
          <section className="dash-card">
            <CardHead jp="本日の授業" title="Today's Classes" href="/dashboard/teacher/classes" />
            <div className="dash-list">
              {SCHEDULE.map((c, i) => {
                const sc = STATUS_COLORS[c.status]
                return (
                  <div key={i} className="dash-row accent" style={{ ['--c' as string]: sc }}>
                    <div>
                      <div className="dash-row-title">{c.batch}</div>
                      <div className="dash-row-sub">{c.time} · {c.students} students</div>
                    </div>
                    <span className="dash-chip" style={{ color: sc, background: sc + '18' }}>{c.status}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Submissions */}
          <section className="dash-card">
            <CardHead jp="採点" title="Pending Submissions" href="/dashboard/teacher/grading" />
            <div className="dash-list">
              {SUBMISSIONS.map((a, i) => (
                <div key={i} className="dash-row">
                  <div>
                    <div className="dash-row-title">{a.student}</div>
                    <div className="dash-row-sub">{a.assignment} · {a.submitted}</div>
                  </div>
                  <button className="dash-btn dash-btn-navy">Grade</button>
                </div>
              ))}
            </div>
          </section>

          {/* Attendance table */}
          <section className="dash-card dash-span2">
            <CardHead jp="週間出席" title="Batch Attendance This Week" href="/dashboard/teacher/attendance" />
            <div className="dash-tablewrap">
              <table className="dash-table">
                <thead>
                  <tr>{['Batch', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Avg'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {ATTENDANCE_ROWS.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={j === 0 ? { fontWeight: 600 } : undefined}>
                          {j === 6
                            ? <span className="dash-chip" style={{ background: '#eefaf1', color: '#16a34a' }}>{cell}</span>
                            : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
