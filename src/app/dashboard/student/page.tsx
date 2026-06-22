import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import { BookOpen, CalendarCheck, ClipboardList, Target } from 'lucide-react'

const UPCOMING = [
  { time: 'Today, 6:00 PM',    title: 'N4 Grammar — て-form',  teacher: 'Sensei Priya' },
  { time: 'Tomorrow, 9:00 AM', title: 'N4 Vocabulary Set 12',   teacher: 'Sensei Ravi'  },
  { time: 'Wed, 6:00 PM',      title: 'JLPT Mock Practice',     teacher: 'Sensei Priya' },
]

const PROGRESS = [
  { skill: 'Vocabulary', pct: 72, color: '#e84040' },
  { skill: 'Grammar',    pct: 58, color: '#2d7dd2' },
  { skill: 'Reading',    pct: 64, color: '#22c55e' },
  { skill: 'Listening',  pct: 45, color: '#f59e0b' },
]

const ASSIGNMENTS = [
  { title: 'N4 Kanji Practice Sheet',       due: 'Due Tomorrow', urgent: true  },
  { title: 'Reading Comprehension #8',       due: 'Due in 3 days', urgent: false },
  { title: 'Grammar Worksheet — Lesson 12', due: 'Due in 5 days', urgent: false },
]

const SCORES = [
  { test: 'N4 Mock Exam #3',     score: 68, max: 100, date: 'Jun 10' },
  { test: 'Vocabulary Quiz #12', score: 18, max: 20,  date: 'Jun 8'  },
  { test: 'Grammar Test #7',     score: 14, max: 20,  date: 'Jun 5'  },
]

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #ececef',
}
const eyebrow: React.CSSProperties = {
  fontSize: '10px', fontWeight: '600', color: '#9ca3af',
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px',
}
const cardTitle: React.CSSProperties = {
  fontSize: '14px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.01em',
}

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  const name = profile?.full_name || user.email || 'Student'
  const firstName = name.split(' ')[0]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="student" userName={name} />

      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>
            おはようございます, {firstName}
          </h1>
          <p style={{ color: '#6e6e73', margin: '3px 0 0', fontSize: '13px' }}>
            Welcome back to your Japanese learning journey.
          </p>
        </div>

        {/* KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <StatCard icon={<BookOpen      size={16} />} label="Current Level" value="N4"     color="#e84040" sub="Intermediate" trend="neutral" />
          <StatCard icon={<CalendarCheck size={16} />} label="Attendance"    value="87%"    color="#22c55e" sub="this month"   trend="up"      />
          <StatCard icon={<ClipboardList size={16} />} label="Assignments"   value="3"      color="#f59e0b" sub="pending"      trend="down"    />
          <StatCard icon={<Target        size={16} />} label="Mock Score"    value="68/100" color="#2d7dd2" sub="last test"    trend="neutral" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          {/* Upcoming Classes */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '16px' }}>
              <div style={eyebrow}>Schedule</div>
              <h2 style={cardTitle}>Upcoming Classes</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {UPCOMING.map((c, i) => (
                <div key={i} style={{ padding: '11px 13px', background: '#fafafa', borderRadius: '9px', borderLeft: '3px solid var(--red)' }}>
                  <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '3px' }}>{c.time}</div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>{c.title}</div>
                  <div style={{ fontSize: '11px', color: '#6e6e73', marginTop: '1px' }}>{c.teacher}</div>
                </div>
              ))}
            </div>
          </div>

          {/* JLPT Progress */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '16px' }}>
              <div style={eyebrow}>Performance</div>
              <h2 style={cardTitle}>JLPT Progress</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {PROGRESS.map(({ skill, pct, color }) => (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#1d1d1f' }}>{skill}</span>
                    <span style={{ fontSize: '12px', color, fontWeight: '600' }}>{pct}%</span>
                  </div>
                  <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Assignments */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '16px' }}>
              <div style={eyebrow}>Tasks</div>
              <h2 style={cardTitle}>Pending Assignments</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ASSIGNMENTS.map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px', background: '#fafafa', borderRadius: '9px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>{a.title}</div>
                    <div style={{ fontSize: '11px', color: a.urgent ? '#dc2626' : '#9ca3af', marginTop: '2px', fontWeight: a.urgent ? '600' : '400' }}>{a.due}</div>
                  </div>
                  <button style={{ padding: '6px 14px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>Submit</button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Scores */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '16px' }}>
              <div style={eyebrow}>Results</div>
              <h2 style={cardTitle}>Recent Test Scores</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SCORES.map((t, i) => {
                const pct = t.score / t.max
                const sc = pct > 0.7 ? '#22c55e' : pct > 0.5 ? '#f59e0b' : '#e84040'
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < SCORES.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>{t.test}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{t.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                      <span style={{ fontSize: '17px', fontWeight: '700', color: sc, letterSpacing: '-0.02em' }}>{t.score}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>/{t.max}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
