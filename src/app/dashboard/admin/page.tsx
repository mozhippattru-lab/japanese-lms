import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import {
  Users, GraduationCap, BookOpen, Calendar,
  TrendingUp, Target, ArrowRight,
} from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const ENROLLMENT_DATA = [18, 22, 19, 28, 24, 31]
const MAX_VAL = Math.max(...ENROLLMENT_DATA)

const LEVELS = [
  { level: 'N5', label: 'Beginner',    count: 62, color: '#22c55e' },
  { level: 'N4', label: 'Elementary',   count: 74, color: '#2d7dd2' },
  { level: 'N3', label: 'Intermediate', count: 33, color: '#f59e0b' },
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
  { label: 'Collected', amount: '₹1,84,000', pct: 77, color: '#1a1f3c' },
  { label: 'Pending',   amount: '₹42,000',   pct: 18, color: '#f59e0b' },
  { label: 'Overdue',   amount: '₹12,000',   pct: 5,  color: '#e84040' },
]

const AVATAR_COLORS = ['#1a1f3c', '#2d7dd2', '#8b5cf6', '#22c55e']

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid #ececef',
}
const eyebrow: React.CSSProperties = {
  fontSize: '10px', fontWeight: '600', color: '#9ca3af',
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px',
}
const cardTitle: React.CSSProperties = {
  fontSize: '14px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.01em',
}
const link: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '3px',
  fontSize: '12px', color: 'var(--red)', textDecoration: 'none', fontWeight: '500',
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const firstName = (profile?.full_name || user.email || 'Admin').split(' ')[0]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />

      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>
              Welcome back, {firstName}
            </h1>
            <p style={{ color: '#6e6e73', margin: '3px 0 0', fontSize: '13px' }}>
              Here&apos;s an overview of the Japanese Language Center.
            </p>
          </div>
          <span style={{ fontSize: '13px', color: '#6e6e73', fontWeight: '500' }}>June 2026</span>
        </div>

        {/* ── KPI Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <StatCard icon={<Users         size={16} />} label="Students"  value="186"   color="#e84040" sub="+12"   trend="up"      />
          <StatCard icon={<GraduationCap size={16} />} label="Teachers"  value="8"     color="#2d7dd2" sub="3 active" trend="neutral" />
          <StatCard icon={<BookOpen      size={16} />} label="Courses"   value="5"     color="#8b5cf6" sub="N5–N1" trend="neutral" />
          <StatCard icon={<Calendar      size={16} />} label="Batches"   value="11"    color="#22c55e" sub="running" trend="neutral" />
          <StatCard icon={<TrendingUp    size={16} />} label="Revenue"   value="₹2.4L" color="#f59e0b" sub="+18%"  trend="up"      />
          <StatCard icon={<Target        size={16} />} label="Leads"     value="34"    color="#e84040" sub="+8"    trend="up"      />
        </div>

        {/* ── Charts Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '12px', marginBottom: '12px' }}>

          {/* Enrollment Trend */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '18px' }}>
              <div style={eyebrow}>Enrollment Trend</div>
              <h2 style={cardTitle}>Monthly Enrollments</h2>
            </div>

            <div style={{ position: 'relative', height: '110px', marginBottom: '6px' }}>
              {[0, 50, 100].map(pct => (
                <div key={pct} style={{ position: 'absolute', left: 0, right: 0, bottom: `${pct}%`, borderTop: '1px solid #f3f4f6' }} />
              ))}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                {ENROLLMENT_DATA.map((val, i) => {
                  const isActive = i === ENROLLMENT_DATA.length - 1
                  return (
                    <div key={MONTHS[i]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '10px', fontWeight: isActive ? '600' : '400', color: isActive ? '#1d1d1f' : '#9ca3af', marginBottom: '4px' }}>{val}</div>
                      <div style={{ width: '100%', height: `${(val / MAX_VAL) * 100}%`, background: isActive ? 'var(--navy)' : '#e5e7eb', borderRadius: '4px 4px 0 0' }} />
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {MONTHS.map((m, i) => (
                <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: i === 5 ? '#1d1d1f' : '#9ca3af', fontWeight: i === 5 ? '600' : '400' }}>{m}</div>
              ))}
            </div>
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f3f4f6', fontSize: '11px', color: '#6e6e73' }}>
              +29% growth from January to June 2026
            </div>
          </div>

          {/* Students by Level */}
          <div style={cardStyle}>
            <div style={{ marginBottom: '16px' }}>
              <div style={eyebrow}>Distribution</div>
              <h2 style={cardTitle}>Students by Level</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {LEVELS.map(({ level, label, count, color }) => (
                <div key={level}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#fff', background: color, padding: '1px 6px', borderRadius: '99px' }}>{level}</span>
                      <span style={{ fontSize: '11px', color: '#6e6e73' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#1d1d1f' }}>{count}</span>
                  </div>
                  <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${(count / MAX_LEVEL) * 100}%`, background: color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          {/* Recent Enrollments */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={eyebrow}>Activity</div>
                <h2 style={cardTitle}>Recent Enrollments</h2>
              </div>
              <a href="/dashboard/admin/students" style={link}>View all <ArrowRight size={12} /></a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {RECENT.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < RECENT.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', background: AVATAR_COLORS[i % AVATAR_COLORS.length], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>{s.name}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>JLPT {s.course} &middot; {s.batch}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: s.date === 'Today' ? '#16a34a' : '#9ca3af' }}>{s.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Collection */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={eyebrow}>Finance</div>
                <h2 style={cardTitle}>Fee Collection — June</h2>
              </div>
              <a href="/dashboard/admin/finance" style={link}>Details <ArrowRight size={12} /></a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '16px' }}>
              {FEES.map(({ label, amount, pct, color }) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: '#6e6e73' }}>{label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1d1d1f' }}>{amount}</span>
                  </div>
                  <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '11px 14px', background: '#fafafa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#6e6e73' }}>Total Expected</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#1d1d1f', letterSpacing: '-0.02em' }}>₹2,38,000</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
