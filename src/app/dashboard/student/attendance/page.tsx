/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import { CheckCircle2, XCircle, Clock, CalendarCheck } from 'lucide-react'
import { DashStyles } from '@/components/DashboardKit'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const STATUS_ICON: Record<string, React.ReactNode> = {
  Present: <CheckCircle2 size={14} color="#22c55e" />,
  Absent:  <XCircle size={14} color="#e84040" />,
  Late:    <Clock size={14} color="#f59e0b" />,
}
const STATUS_COLOR: Record<string, string> = {
  Present: '#22c55e', Absent: '#e84040', Late: '#f59e0b',
}

export default async function StudentAttendancePage() {
  const user = await requireRole('student')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  // Get attendance records for this student
  const records = await sql`
    select id, status, session_id, batch_id from attendance_records
    where student_id = ${user.id} order by created_at desc limit 100
  `

  let sessions: Array<{ id: string; session_date: string; topic: string | null }> = []
  let batchList: Array<{ id: string; name: string; jlpt_level: string }> = []

  if (records.length > 0) {
    const sessionIds = [...new Set(records.map(r => r.session_id))]
    const batchIds = [...new Set(records.map(r => r.batch_id))]

    const [sessData, batchData] = await Promise.all([
      sql`select id, session_date, topic from attendance_sessions where id = any(${sessionIds})`,
      sql`select id, name, jlpt_level from batches where id = any(${batchIds})`,
    ])
    sessions = sessData as unknown as typeof sessions
    batchList = batchData as unknown as typeof batchList
  }

  const rows: any[] = records.map(r => ({
    ...r,
    session: sessions.find(s => s.id === r.session_id),
    batch: batchList.find(b => b.id === r.batch_id),
  })).filter(r => r.session).sort((a, b) =>
    (b.session?.session_date || '').localeCompare(a.session?.session_date || '')
  )

  const total = rows.length
  const present = rows.filter(r => r.status === 'Present').length
  const absent = rows.filter(r => r.status === 'Absent').length
  const late = rows.filter(r => r.status === 'Late').length
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0

  // Group by batch
  const byBatch: Record<string, typeof rows> = {}
  rows.forEach(r => {
    const key = r.batch_id
    if (!byBatch[key]) byBatch[key] = []
    byBatch[key].push(r)
  })

  const card: React.CSSProperties = { background: '#fff', borderRadius: '12px', border: '1px solid #ececef' }

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main className="dash-main">

        <DashStyles />

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>My Attendance</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>{total} sessions recorded</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Sessions', value: total, icon: <CalendarCheck size={15} />, color: '#2d7dd2' },
            { label: 'Present', value: present, icon: <CheckCircle2 size={15} />, color: '#22c55e' },
            { label: 'Absent', value: absent, icon: <XCircle size={15} />, color: '#e84040' },
            { label: 'Attendance Rate', value: `${rate}%`, icon: <Clock size={15} />, color: rate >= 75 ? '#22c55e' : rate >= 60 ? '#f59e0b' : '#e84040' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ ...card, padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6e6e73', fontWeight: '500' }}>{label}</span>
                <span style={{ color, display: 'flex' }}>{icon}</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#1d1d1f', letterSpacing: '-0.02em' }}>{value}</div>
            </div>
          ))}
        </div>

        {rows.length === 0 ? (
          <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No attendance records found yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {Object.entries(byBatch).map(([batchId, batchRows]) => {
              const batch = batchList.find(b => b.id === batchId)
              if (!batch) return null
              const lc = LEVEL_COLORS[batch.jlpt_level] || '#9ca3af'
              const bPresent = batchRows.filter(r => r.status === 'Present').length
              const bTotal = batchRows.length
              const bRate = bTotal > 0 ? Math.round((bPresent / bTotal) * 100) : 0
              return (
                <div key={batchId}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: lc, flexShrink: 0 }} />
                    <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{batch.name}</h2>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: lc, background: lc + '18', padding: '2px 8px', borderRadius: '99px' }}>{batch.jlpt_level}</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: 'auto' }}>{bPresent}/{bTotal} present · <strong style={{ color: bRate >= 75 ? '#22c55e' : '#e84040' }}>{bRate}%</strong></span>
                  </div>

                  {/* Rate bar */}
                  <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '2px', marginBottom: '10px' }}>
                    <div style={{ height: '100%', width: `${bRate}%`, background: bRate >= 75 ? '#22c55e' : bRate >= 60 ? '#f59e0b' : '#e84040', borderRadius: '2px' }} />
                  </div>

                  <div style={{ ...card, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                          {['Date', 'Topic', 'Status'].map(h => (
                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {batchRows.map((r, i) => (
                          <tr key={r.id} style={{ borderBottom: i < batchRows.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                            <td style={{ padding: '11px 16px', color: '#374151', fontWeight: '500', whiteSpace: 'nowrap' }}>
                              {r.session?.session_date
                                ? new Date(r.session.session_date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
                                : '—'}
                            </td>
                            <td style={{ padding: '11px 16px', color: '#6b7280', fontSize: '12px' }}>{r.session?.topic || <span style={{ color: '#d1d5db' }}>—</span>}</td>
                            <td style={{ padding: '11px 16px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '600', color: STATUS_COLOR[r.status] || '#9ca3af' }}>
                                {STATUS_ICON[r.status]}
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
