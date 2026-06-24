import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { DashStyles, CardHead, Kpi } from '@/components/DashboardKit'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Motion'
import {
  Users, GraduationCap, BookOpen, Calendar, TrendingUp, Target,
} from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const ENROLLMENT_DATA = [18, 22, 19, 28, 24, 31]
const MAX_VAL = Math.max(...ENROLLMENT_DATA)

const LEVELS = [
  { level: 'N5', label: 'Beginner',     count: 62, color: '#22c55e' },
  { level: 'N4', label: 'Elementary',   count: 74, color: '#2d7dd2' },
  { level: 'N3', label: 'Intermediate', count: 33, color: '#c2974b' },
  { level: 'N2', label: 'Upper-Int.',   count: 14, color: '#e84040' },
  { level: 'N1', label: 'Advanced',     count: 3,  color: '#8b5cf6' },
]
const MAX_LEVEL = Math.max(...LEVELS.map(l => l.count))

const RECENT = [
  { name: 'Divya Menon', course: 'N4', batch: 'Evening',   date: 'Today'     },
  { name: 'Arjun Nair',  course: 'N5', batch: 'Morning',   date: 'Today'     },
  { name: 'Sneha Patel', course: 'N3', batch: 'Weekend',   date: 'Yesterday' },
  { name: 'Karan Bose',  course: 'N4', batch: 'Afternoon', date: 'Jun 12'    },
]

const FEES = [
  { label: 'Collected', amount: '₹1,84,000', pct: 77, color: '#22c55e' },
  { label: 'Pending',   amount: '₹42,000',   pct: 18, color: '#c2974b' },
  { label: 'Overdue',   amount: '₹12,000',   pct: 5,  color: '#e84040' },
]

const AVATAR_COLORS = ['#1a1f3c', '#2d7dd2', '#8b5cf6', '#22c55e']

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const name = profile?.full_name || user.email || 'Admin'
  const firstName = name.split(' ')[0]
  const monthYear = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

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
              <p className="dash-subtitle">An overview of மொழிப்பற்று Japanese Language Center.</p>
            </div>
            <div className="dash-datechip">
              <span className="dash-datechip-jp">日</span>
              <span className="dash-datechip-sub">{monthYear}</span>
            </div>
          </header>
        </Reveal>

        {/* KPIs */}
        <Stagger className="dash-kpis">
          <StaggerItem><Kpi label="Students" value="186"   sub="+12 this month" icon={<Users size={18} />}         color="#e84040" /></StaggerItem>
          <StaggerItem><Kpi label="Teachers" value="8"      sub="3 active now"   icon={<GraduationCap size={18} />} color="#2d7dd2" /></StaggerItem>
          <StaggerItem><Kpi label="Courses"  value="5"      sub="N5–N1"          icon={<BookOpen size={18} />}      color="#8b5cf6" /></StaggerItem>
          <StaggerItem><Kpi label="Batches"  value="11"     sub="running"        icon={<Calendar size={18} />}      color="#22c55e" /></StaggerItem>
          <StaggerItem><Kpi label="Revenue"  value="₹2.4L"  sub="+18%"           icon={<TrendingUp size={18} />}    color="#c2974b" /></StaggerItem>
          <StaggerItem><Kpi label="Leads"    value="34"     sub="+8 new"         icon={<Target size={18} />}        color="#e84040" /></StaggerItem>
        </Stagger>

        {/* Charts */}
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
                    <div className={`dash-chart-bar${on ? ' on' : ''}`} style={{ height: `${(val / MAX_VAL) * 100}%` }} />
                  </div>
                )
              })}
            </div>
            <div className="dash-chart-x">{MONTHS.map(m => <span key={m}>{m}</span>)}</div>
            <div className="dash-foot">+29% growth from January to June {new Date().getFullYear()}</div>
          </section>

          {/* Students by level */}
          <section className="dash-card">
            <CardHead jp="レベル別" title="Students by Level" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {LEVELS.map(({ level, label, count, color }) => (
                <div key={level}>
                  <div className="dash-barrow">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="dash-chip" style={{ color: '#fff', background: color }}>{level}</span>
                      <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{label}</span>
                    </span>
                    <span style={{ fontFamily: 'var(--display)', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{count}</span>
                  </div>
                  <div className="dash-bar"><div className="dash-bar-fill" style={{ width: `${(count / MAX_LEVEL) * 100}%`, background: color }} /></div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Bottom row */}
        <Reveal delay={0.2} className="dash-grid">
          {/* Recent enrollments */}
          <section className="dash-card">
            <CardHead jp="最近の入学" title="Recent Enrollments" href="/dashboard/admin/students" />
            <div>
              {RECENT.map((s, i) => (
                <div key={i} className="dash-divrow">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <div className="dash-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>{s.name.charAt(0)}</div>
                    <div>
                      <div className="dash-row-title">{s.name}</div>
                      <div className="dash-row-sub">JLPT {s.course} · {s.batch}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: s.date === 'Today' ? '#16a34a' : '#a39e93' }}>{s.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Fee collection */}
          <section className="dash-card">
            <CardHead jp="授業料" title="Fee Collection — June" href="/dashboard/admin/finance" />
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
            <div className="dash-total"><span>Total expected</span><span>₹2,38,000</span></div>
          </section>
        </Reveal>
      </main>
    </div>
  )
}
