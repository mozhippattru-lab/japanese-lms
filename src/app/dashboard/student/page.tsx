import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { DashStyles, CardHead, Kpi } from '@/components/DashboardKit'
import { BookOpen, CalendarCheck, ClipboardList, Target, Clock } from 'lucide-react'

const UPCOMING = [
  { time: 'Today · 6:00 PM',    title: 'N4 Grammar — て-form',  teacher: 'Sensei Priya' },
  { time: 'Tomorrow · 9:00 AM', title: 'N4 Vocabulary Set 12',  teacher: 'Sensei Ravi'  },
  { time: 'Wed · 6:00 PM',      title: 'JLPT Mock Practice',    teacher: 'Sensei Priya' },
]

const PROGRESS = [
  { skill: 'Vocabulary', jp: '語彙',  pct: 72, color: '#e84040' },
  { skill: 'Grammar',    jp: '文法',  pct: 58, color: '#2d7dd2' },
  { skill: 'Reading',    jp: '読解',  pct: 64, color: '#22c55e' },
  { skill: 'Listening',  jp: '聴解',  pct: 45, color: '#c2974b' },
]

const ASSIGNMENTS = [
  { title: 'N4 Kanji Practice Sheet',       due: 'Due tomorrow',  urgent: true  },
  { title: 'Reading Comprehension #8',      due: 'Due in 3 days', urgent: false },
  { title: 'Grammar Worksheet — Lesson 12', due: 'Due in 5 days', urgent: false },
]

const SCORES = [
  { test: 'N4 Mock Exam #3',     score: 68, max: 100, date: 'Jun 10' },
  { test: 'Vocabulary Quiz #12', score: 18, max: 20,  date: 'Jun 8'  },
  { test: 'Grammar Test #7',     score: 14, max: 20,  date: 'Jun 5'  },
]

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

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={name} />
      <main className="dash-main">
        <DashStyles />

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

        <section className="dash-kpis">
          <Kpi label="Current Level" value={level}    sub="your level"  icon={<BookOpen size={18} />}      color="#e84040" />
          <Kpi label="Attendance"    value="87%"      sub="this month"  icon={<CalendarCheck size={18} />} color="#22c55e" />
          <Kpi label="Assignments"   value="3"        sub="pending"     icon={<ClipboardList size={18} />} color="#c2974b" />
          <Kpi label="Mock Score"    value="68/100"   sub="last test"   icon={<Target size={18} />}        color="#2d7dd2" />
        </section>

        <div className="dash-grid">
          {/* Upcoming */}
          <section className="dash-card">
            <CardHead jp="授業" title="Upcoming Classes" href="/dashboard/student/classes" />
            <div className="dash-list">
              {UPCOMING.map((c, i) => (
                <div key={i} className="dash-row accent" style={{ display: 'block' }}>
                  <div className="dash-row-meta"><Clock size={12} /> {c.time}</div>
                  <div className="dash-row-title">{c.title}</div>
                  <div className="dash-row-sub">{c.teacher}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Progress */}
          <section className="dash-card">
            <CardHead jp="進捗" title="JLPT Progress" href="/dashboard/student/progress" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {PROGRESS.map(({ skill, jp, pct, color }) => (
                <div key={skill}>
                  <div className="dash-barrow">
                    <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 500 }}>
                      <i style={{ fontFamily: 'var(--display)', fontStyle: 'normal', color: 'var(--ink-soft)', fontSize: '12px', marginRight: '5px' }}>{jp}</i>{skill}
                    </span>
                    <span className="dash-pct" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="dash-bar"><div className="dash-bar-fill" style={{ width: `${pct}%`, background: color }} /></div>
                </div>
              ))}
            </div>
          </section>

          {/* Assignments */}
          <section className="dash-card">
            <CardHead jp="課題" title="Pending Assignments" href="/dashboard/student/assignments" />
            <div className="dash-list">
              {ASSIGNMENTS.map((a, i) => (
                <div key={i} className="dash-row">
                  <div>
                    <div className="dash-row-title">{a.title}</div>
                    <div className="dash-row-sub" style={a.urgent ? { color: '#dc2626', fontWeight: 600 } : undefined}>{a.due}</div>
                  </div>
                  <button className="dash-btn dash-btn-red">Submit</button>
                </div>
              ))}
            </div>
          </section>

          {/* Scores */}
          <section className="dash-card">
            <CardHead jp="成績" title="Recent Test Scores" href="/dashboard/student/tests" />
            <div>
              {SCORES.map((t, i) => {
                const pct = t.score / t.max
                const sc = pct > 0.7 ? '#22c55e' : pct > 0.5 ? '#c2974b' : '#e84040'
                return (
                  <div key={i} className="dash-divrow">
                    <div>
                      <div className="dash-row-title">{t.test}</div>
                      <div className="dash-row-sub">{t.date}</div>
                    </div>
                    <div className="dash-num"><span style={{ color: sc }}>{t.score}</span><small>/{t.max}</small></div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
