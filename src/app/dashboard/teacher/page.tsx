import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import { Users, GraduationCap, ClipboardList, Calendar } from 'lucide-react'

const SCHEDULE = [
  { time: '9:00 AM', batch: 'N5 — Morning Batch',  students: 14, status: 'Completed' },
  { time: '2:00 PM', batch: 'N4 — Afternoon Batch', students: 18, status: 'Ongoing'   },
  { time: '6:00 PM', batch: 'N4 — Evening Batch',   students: 16, status: 'Upcoming'  },
]

const ASSIGNMENTS = [
  { student: 'Ananya S.',  assignment: 'N4 Kanji Sheet',      submitted: '2h ago'   },
  { student: 'Rohan M.',   assignment: 'Grammar Worksheet 12', submitted: '5h ago'   },
  { student: 'Preethi K.', assignment: 'Reading Comp #8',      submitted: 'Yesterday' },
]

const ATTENDANCE_ROWS = [
  ['N5 Morning',   '13/14', '14/14', '12/14', '14/14', '13/14', '92%'],
  ['N4 Afternoon', '16/18', '17/18', '15/18', '18/18', '17/18', '91%'],
  ['N4 Evening',   '14/16', '15/16', '13/16', '16/16', '14/16', '89%'],
  ['N3 Weekend',   '—',     '—',     '—',     '—',     '11/12', '91%'],
]

const STATUS_COLORS: Record<string, string> = {
  Completed: '#22c55e', Ongoing: '#e84040', Upcoming: '#f59e0b',
}

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

export default async function TeacherDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  const name = profile?.full_name || user.email || 'Teacher'
  const firstName = name.split(' ')[0]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="teacher" userName={name} />

      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>
              Welcome, {firstName} Sensei
            </h1>
            <p style={{ color: '#6e6e73', margin: '3px 0 0', fontSize: '13px' }}>
              Manage your classes, students, and content below.
            </p>
          </div>
          <span style={{ fontSize: '13px', color: '#6e6e73', fontWeight: '500' }}>June 20, 2026</span>
        </div>

        {/* KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <StatCard icon={<Users         size={16} />} label="Students"       value="48" color="#2d7dd2" sub="all batches" trend="neutral" />
          <StatCard icon={<GraduationCap size={16} />} label="Batches"        value="4"  color="#e84040" sub="active"      trend="neutral" />
          <StatCard icon={<ClipboardList size={16} />} label="Pending Grades" value="12" color="#f59e0b" sub="to grade"    trend="down"    />
          <StatCard icon={<Calendar      size={16} />} label="Classes Today"  value="3"  color="#22c55e" sub="next 6PM"    trend="neutral" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          {/* Today's Schedule */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '16px' }}>
              <div style={eyebrow}>Schedule</div>
              <h2 style={cardTitle}>Today&apos;s Classes</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SCHEDULE.map((c, i) => {
                const sc = STATUS_COLORS[c.status]
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px', background: '#fafafa', borderRadius: '9px', borderLeft: `3px solid ${sc}` }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>{c.batch}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>{c.time} &middot; {c.students} students</div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '600', color: sc, background: sc + '18', padding: '3px 9px', borderRadius: '99px' }}>{c.status}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Grade Assignments */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '16px' }}>
              <div style={eyebrow}>Grading</div>
              <h2 style={cardTitle}>Pending Submissions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ASSIGNMENTS.map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px', background: '#fafafa', borderRadius: '9px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>{a.student}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>{a.assignment} &middot; {a.submitted}</div>
                  </div>
                  <button style={{ padding: '6px 14px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'inherit' }}>Grade</button>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Table */}
          <div style={{ ...cardStyle, gridColumn: 'span 2' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={eyebrow}>Weekly Report</div>
              <h2 style={cardTitle}>Batch Attendance This Week</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Batch', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Avg'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#9ca3af', fontWeight: '600', borderBottom: '1px solid #f3f4f6', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ATTENDANCE_ROWS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < ATTENDANCE_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '10px 12px', color: '#1d1d1f', fontWeight: j === 0 ? '500' : '400', fontSize: '12px' }}>
                          {j === 6 ? <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '99px', fontWeight: '600', fontSize: '11px' }}>{cell}</span> : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
