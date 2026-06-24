import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import DataToolbar from '@/components/DataToolbar'
import { Users, DollarSign, CalendarCheck, TrendingUp } from 'lucide-react'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`
  return `₹${n}`
}

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const now = new Date()

  const [
    { data: students },
    { data: payments },
    { data: invoices },
    { data: sessions },
    { data: batches },
    { data: collegePayments },
  ] = await Promise.all([
    supabase.from('profiles').select('id, jlpt_level, status, created_at, college_id').eq('role', 'student'),
    supabase.from('payments').select('id, amount, payment_date'),
    supabase.from('invoices').select('id, amount, status'),
    supabase.from('attendance_sessions').select('id, batch_id, total_present, total_absent, total_late, session_date').order('session_date', { ascending: false }),
    supabase.from('batches').select('id, name, jlpt_level, enrolled, capacity, status, mode'),
    supabase.from('college_payments').select('id, amount, payment_date'),
  ])

  const totalStudents = students?.length || 0
  const activeStudents = students?.filter(s => s.status === 'Active').length || 0
  const studentRevenue = payments?.reduce((s, p) => s + (p.amount || 0), 0) || 0
  const collegeRevenue = collegePayments?.reduce((s, p) => s + (p.amount || 0), 0) || 0
  const totalRevenue = studentRevenue + collegeRevenue
  const collegeStudents = students?.filter(s => s.college_id).length || 0
  const pendingRevenue = invoices?.filter(i => i.status === 'Pending').reduce((s, i) => s + (i.amount || 0), 0) || 0
  const totalSessions = sessions?.length || 0
  const avgAttendance = totalSessions > 0
    ? Math.round(sessions!.reduce((s, sess) => {
        const t = (sess.total_present || 0) + (sess.total_absent || 0) + (sess.total_late || 0)
        return s + (t > 0 ? (sess.total_present / t) * 100 : 0)
      }, 0) / totalSessions)
    : 0

  const byLevel: Record<string, number> = {}
  students?.forEach(s => { if (s.jlpt_level) byLevel[s.jlpt_level] = (byLevel[s.jlpt_level] || 0) + 1 })
  const maxByLevel = Math.max(...Object.values(byLevel), 1)

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      key: d.toISOString().slice(0, 7),
      label: d.toLocaleDateString('en-IN', { month: 'short' }),
      count: 0,
      amount: 0,
    }
  })
  students?.forEach(s => {
    if (!s.created_at) return
    const slot = months.find(m => m.key === s.created_at.slice(0, 7))
    if (slot) slot.count++
  })
  payments?.forEach(p => {
    if (!p.payment_date) return
    const slot = months.find(m => m.key === p.payment_date.slice(0, 7))
    if (slot) slot.amount += p.amount || 0
  })
  collegePayments?.forEach(p => {
    if (!p.payment_date) return
    const slot = months.find(m => m.key === p.payment_date.slice(0, 7))
    if (slot) slot.amount += p.amount || 0
  })
  const maxCount = Math.max(...months.map(m => m.count), 1)
  const maxAmount = Math.max(...months.map(m => m.amount), 1)

  const batchStats = (batches || []).map(b => {
    const bs = sessions?.filter(s => s.batch_id === b.id) || []
    const present = bs.reduce((s, sess) => s + (sess.total_present || 0), 0)
    const total = bs.reduce((s, sess) => s + (sess.total_present || 0) + (sess.total_absent || 0) + (sess.total_late || 0), 0)
    return { ...b, rate: total > 0 ? Math.round(present / total * 100) : 0, sessionCount: bs.length }
  }).filter(b => b.sessionCount > 0).sort((a, b) => b.rate - a.rate)

  const invoiceStatusMap: Record<string, { count: number; amount: number }> = {}
  invoices?.forEach(i => {
    if (!invoiceStatusMap[i.status]) invoiceStatusMap[i.status] = { count: 0, amount: 0 }
    invoiceStatusMap[i.status].count++
    invoiceStatusMap[i.status].amount += i.amount || 0
  })

  const card: React.CSSProperties = { background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #ececef' }
  const eyebrow: React.CSSProperties = { fontSize: '10px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ivory)' }}>
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: 'var(--display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.04em', margin: '0 0 6px' }}>報告 · Reports</p>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Reports</h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '6px' }}>Key metrics across students, finance, and attendance</p>
          </div>
          <DataToolbar
            title="Batch Performance Report"
            subtitle={`${totalStudents} students · ${fmt(totalRevenue)} revenue · ${avgAttendance}% avg attendance`}
            columns={[
              { key: 'batch', label: 'Batch' }, { key: 'level', label: 'Level' },
              { key: 'sessions', label: 'Sessions' }, { key: 'rate', label: 'Attendance %' },
            ]}
            rows={batchStats.map(b => ({ batch: b.name, level: b.jlpt_level, sessions: b.sessionCount, rate: `${b.rate}%` }))}
          />
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'Total Students', value: totalStudents, sub: `${activeStudents} active · ${collegeStudents} from colleges`, icon: <Users size={16} />, color: '#2d7dd2' },
            { label: 'Revenue Collected', value: fmt(totalRevenue), sub: `${fmt(studentRevenue)} fees · ${fmt(collegeRevenue)} college`, icon: <DollarSign size={16} />, color: '#22c55e' },
            { label: 'Total Sessions', value: totalSessions, sub: 'classes held', icon: <CalendarCheck size={16} />, color: '#e84040' },
            { label: 'Avg Attendance', value: `${avgAttendance}%`, sub: 'across all batches', icon: <TrendingUp size={16} />, color: '#8b5cf6' },
          ].map(({ label, value, sub, icon, color }) => (
            <div key={label} style={{ ...card, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6e6e73', fontWeight: '500' }}>{label}</span>
                <span style={{ color, display: 'flex' }}>{icon}</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#1d1d1f', letterSpacing: '-0.02em' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>

          {/* Students by Level */}
          <div style={card}>
            <div style={eyebrow}>Breakdown</div>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 16px', letterSpacing: '-0.01em' }}>Students by JLPT Level</h2>
            {Object.keys(byLevel).length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', padding: '24px 0' }}>No student data yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['N5', 'N4', 'N3', 'N2', 'N1'].map(level => {
                  const count = byLevel[level] || 0
                  const pct = Math.round((count / maxByLevel) * 100)
                  return (
                    <div key={level}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>{level}</span>
                        <span style={{ fontSize: '12px', color: LEVEL_COLORS[level], fontWeight: '700' }}>{count} students</span>
                      </div>
                      <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: LEVEL_COLORS[level], borderRadius: '3px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Monthly Enrollment */}
          <div style={card}>
            <div style={eyebrow}>Trend</div>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 16px', letterSpacing: '-0.01em' }}>New Enrollments (6 Months)</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
              {months.map(m => (
                <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>{m.count > 0 ? m.count : ''}</span>
                  <div style={{
                    width: '100%', background: 'var(--red)', borderRadius: '4px 4px 0 0',
                    height: `${Math.max((m.count / maxCount) * 90, m.count > 0 ? 6 : 2)}%`,
                    minHeight: '2px', opacity: m.count === 0 ? 0.15 : 1,
                  }} />
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          {/* Monthly Revenue */}
          <div style={card}>
            <div style={eyebrow}>Finance</div>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 16px', letterSpacing: '-0.01em' }}>Revenue Collected (6 Months)</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
              {months.map(m => (
                <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '10px', fontWeight: '600', color: '#374151' }}>{m.amount > 0 ? (m.amount >= 1000 ? `${(m.amount / 1000).toFixed(0)}k` : m.amount) : ''}</span>
                  <div style={{
                    width: '100%', background: '#22c55e', borderRadius: '4px 4px 0 0',
                    height: `${Math.max((m.amount / maxAmount) * 85, m.amount > 0 ? 6 : 2)}%`,
                    minHeight: '2px', opacity: m.amount === 0 ? 0.15 : 1,
                  }} />
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>{m.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f3f4f6', flexWrap: 'wrap' }}>
              {Object.entries(invoiceStatusMap).map(([status, { count, amount }]) => {
                const colors: Record<string, string> = { Paid: '#22c55e', Pending: '#f59e0b', Overdue: '#e84040', Cancelled: '#9ca3af' }
                return (
                  <div key={status}>
                    <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{status}</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: colors[status] || '#374151' }}>{fmt(amount)}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>{count} invoice{count !== 1 ? 's' : ''}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Batch Attendance */}
          <div style={card}>
            <div style={eyebrow}>Attendance</div>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 16px', letterSpacing: '-0.01em' }}>Batch Attendance Rates</h2>
            {batchStats.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', padding: '24px 0' }}>No attendance sessions recorded yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {batchStats.slice(0, 6).map(b => {
                  const rateColor = b.rate >= 80 ? '#22c55e' : b.rate >= 60 ? '#f59e0b' : '#e84040'
                  return (
                    <div key={b.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: LEVEL_COLORS[b.jlpt_level] || '#9ca3af', flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>{b.name}</span>
                          <span style={{ fontSize: '10px', color: '#9ca3af' }}>{b.sessionCount} sessions</span>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: rateColor }}>{b.rate}%</span>
                      </div>
                      <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${b.rate}%`, background: rateColor, borderRadius: '3px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
