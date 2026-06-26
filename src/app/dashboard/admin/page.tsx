import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Sidebar from '@/components/Sidebar'
import { DashStyles, CardHead, Kpi } from '@/components/DashboardKit'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Motion'
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp, Target } from 'lucide-react'

const LEVEL_META = [
  { level: 'N5', label: 'Beginner',     color: '#22c55e' },
  { level: 'N4', label: 'Elementary',   color: '#2d7dd2' },
  { level: 'N3', label: 'Intermediate', color: '#c2974b' },
  { level: 'N2', label: 'Upper-Int.',   color: '#e84040' },
  { level: 'N1', label: 'Advanced',     color: '#8b5cf6' },
]
const AVATAR_COLORS = ['#1a1f3c', '#2d7dd2', '#8b5cf6', '#22c55e']

function fmtInr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

function relativeDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === now.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // All admin data via service role (bypasses RLS)
  const db = createAdminClient()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  // Kick off the role check and all dashboard data in parallel — they don't
  // depend on each other, so we avoid a sequential round-trip to Supabase.
  const profilePromise = supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  const dataPromise = Promise.all([
    db.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('status', 'active'),
    db.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher').eq('status', 'active'),
    db.from('batches').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    db.from('leads').select('*', { count: 'exact', head: true }),
    db.from('courses').select('*', { count: 'exact', head: true }).eq('is_active', true),
    db.from('profiles').select('jlpt_level').eq('role', 'student').eq('status', 'active'),
    db.from('profiles').select('full_name, jlpt_level, created_at').eq('role', 'student').order('created_at', { ascending: false }).limit(4),
    db.from('invoices').select('amount, status'),
    db.from('profiles').select('created_at').eq('role', 'student').gte('created_at', sixMonthsAgo.toISOString()),
  ])

  const { data: profile } = await profilePromise
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const name = profile?.full_name || user.email || 'Admin'
  const firstName = name.split(' ')[0]
  const monthYear = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const [
    { count: studentCount },
    { count: teacherCount },
    { count: batchCount },
    { count: leadsCount },
    { count: courseCount },
    { data: allStudents },
    { data: recentStudents },
    { data: invoices },
    { data: monthlyStudents },
  ] = await dataPromise

  // Students by level
  const levelCounts = LEVEL_META.map(lm => ({
    ...lm,
    count: (allStudents || []).filter(s => s.jlpt_level === lm.level).length,
  }))
  const maxLevel = Math.max(...levelCounts.map(l => l.count), 1)

  // Recent enrollments
  const recentEnrollments = (recentStudents || []).map((s, i) => ({
    name: s.full_name || 'Student',
    level: s.jlpt_level || '—',
    date: relativeDate(s.created_at),
    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  }))

  // Fee collection
  const feeCollected = (invoices || []).filter(i => i.status === 'Paid').reduce((s, i) => s + (i.amount || 0), 0)
  const feePending   = (invoices || []).filter(i => i.status === 'Pending').reduce((s, i) => s + (i.amount || 0), 0)
  const feeOverdue   = (invoices || []).filter(i => i.status === 'Overdue').reduce((s, i) => s + (i.amount || 0), 0)
  const feeTotal = feeCollected + feePending + feeOverdue || 1
  const FEES = [
    { label: 'Collected', amount: fmtInr(feeCollected), pct: Math.round((feeCollected / feeTotal) * 100), color: '#22c55e' },
    { label: 'Pending',   amount: fmtInr(feePending),   pct: Math.round((feePending / feeTotal) * 100),   color: '#c2974b' },
    { label: 'Overdue',   amount: fmtInr(feeOverdue),   pct: Math.round((feeOverdue / feeTotal) * 100),   color: '#e84040' },
  ]

  // Monthly enrollment chart (last 6 months)
  const MONTHS: string[] = []
  const ENROLLMENT_DATA: number[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i)
    MONTHS.push(d.toLocaleDateString('en-IN', { month: 'short' }))
    const monthStr = d.toISOString().slice(0, 7)
    ENROLLMENT_DATA.push((monthlyStudents || []).filter(s => s.created_at?.slice(0, 7) === monthStr).length)
  }
  const maxEnroll = Math.max(...ENROLLMENT_DATA, 1)

  // KPI strings
  const revenue = fmtInr(feeCollected)

  return (
    <div className="dash-shell">
      <Sidebar role="admin" userName={name} />
      <main className="dash-main">
        <DashStyles />

        <Reveal>
          <header className="dash-header">
            <div>
              <p className="dash-eyebrow">管理ダッシュボード · Admin</p>
              <h1 className="dash-title">おかえりなさい、<span>{firstName}</span></h1>
              <p className="dash-subtitle">An overview of மொழிப்பற்று Japanese Language School.</p>
            </div>
            <div className="dash-datechip">
              <span className="dash-datechip-jp">日</span>
              <span className="dash-datechip-sub">{monthYear}</span>
            </div>
          </header>
        </Reveal>

        <Stagger className="dash-kpis">
          <StaggerItem><Kpi label="Students" value={String(studentCount ?? 0)} sub="active"        icon={<Users size={18} />}         color="#e84040" /></StaggerItem>
          <StaggerItem><Kpi label="Teachers" value={String(teacherCount ?? 0)} sub="active"        icon={<GraduationCap size={18} />} color="#2d7dd2" /></StaggerItem>
          <StaggerItem><Kpi label="Courses"  value={String(courseCount ?? 0)}  sub="N5–N3"         icon={<BookOpen size={18} />}      color="#8b5cf6" /></StaggerItem>
          <StaggerItem><Kpi label="Batches"  value={String(batchCount ?? 0)}   sub="running"       icon={<Calendar size={18} />}      color="#22c55e" /></StaggerItem>
          <StaggerItem><Kpi label="Revenue"  value={revenue}                   sub="fees collected" icon={<TrendingUp size={18} />}   color="#c2974b" /></StaggerItem>
          <StaggerItem><Kpi label="Leads"    value={String(leadsCount ?? 0)}   sub="total"         icon={<Target size={18} />}        color="#e84040" /></StaggerItem>
        </Stagger>

        <Reveal delay={0.12} className="dash-grid-32">
          {/* Enrollment trend */}
          <section className="dash-card">
            <CardHead jp="入学傾向" title="Monthly Enrollments" />
            <div className="dash-chart">
              {[0, 50, 100].map(pct => (
                <div key={pct} style={{ position: 'absolute', left: 0, right: 0, bottom: `${pct}%`, borderTop: '1px solid var(--line-warm)' }} />
              ))}
              {ENROLLMENT_DATA.map((val, i) => {
                const on = i === ENROLLMENT_DATA.length - 1
                return (
                  <div key={MONTHS[i]} className="dash-chart-col">
                    <span className={`dash-chart-val${on ? ' on' : ''}`}>{val}</span>
                    <div className={`dash-chart-bar${on ? ' on' : ''}`} style={{ height: `${(val / maxEnroll) * 100}%` }} />
                  </div>
                )
              })}
            </div>
            <div className="dash-chart-x">{MONTHS.map(m => <span key={m}>{m}</span>)}</div>
            <div className="dash-foot">{studentCount ?? 0} active students across {courseCount ?? 0} courses</div>
          </section>

          {/* Students by level */}
          <section className="dash-card">
            <CardHead jp="レベル別" title="Students by Level" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {levelCounts.map(({ level, label, count, color }) => (
                <div key={level}>
                  <div className="dash-barrow">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="dash-chip" style={{ color: '#fff', background: color }}>{level}</span>
                      <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{label}</span>
                    </span>
                    <span style={{ fontFamily: 'var(--display)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{count}</span>
                  </div>
                  <div className="dash-bar"><div className="dash-bar-fill" style={{ width: `${(count / maxLevel) * 100}%`, background: color }} /></div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.2} className="dash-grid">
          {/* Recent enrollments */}
          <section className="dash-card">
            <CardHead jp="最近の入学" title="Recent Enrollments" href="/dashboard/admin/students" />
            {recentEnrollments.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '13px', padding: '12px 0' }}>No students enrolled yet.</p>
            ) : (
              <div>
                {recentEnrollments.map((s, i) => (
                  <div key={i} className="dash-divrow">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                      <div className="dash-avatar" style={{ background: s.color }}>{s.name.charAt(0)}</div>
                      <div>
                        <div className="dash-row-title">{s.name}</div>
                        <div className="dash-row-sub">JLPT {s.level}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: s.date === 'Today' ? '#16a34a' : '#a39e93' }}>{s.date}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Fee collection */}
          <section className="dash-card">
            <CardHead jp="授業料" title="Fee Collection" href="/dashboard/admin/finance" />
            {feeTotal === 1 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '13px', padding: '12px 0' }}>No invoices recorded yet.</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '16px' }}>
                  {FEES.map(({ label, amount, pct, color }) => (
                    <div key={label}>
                      <div className="dash-barrow">
                        <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>{label}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{amount}</span>
                      </div>
                      <div className="dash-bar"><div className="dash-bar-fill" style={{ width: `${pct}%`, background: color }} /></div>
                    </div>
                  ))}
                </div>
                <div className="dash-total"><span>Total invoiced</span><span>{fmtInr(feeTotal)}</span></div>
              </>
            )}
          </section>
        </Reveal>
      </main>
    </div>
  )
}
