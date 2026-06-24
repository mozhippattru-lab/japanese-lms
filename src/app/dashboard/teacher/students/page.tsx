import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { DashStyles } from '@/components/DashboardKit'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}

export default async function TeacherStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  // Get teacher's batches
  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, jlpt_level')
    .eq('teacher_id', user.id)

  const batchIds = batches?.map(b => b.id) || []

  // Get enrolled students across those batches
  const { data: enrollments } = batchIds.length
    ? await supabase
        .from('student_batches')
        .select('id, batch_id, enrolled_at, student_id')
        .in('batch_id', batchIds)
        .eq('status', 'Active')
    : { data: [] }

  const studentIds = [...new Set(enrollments?.map(e => e.student_id) || [])]
  const { data: studentProfiles } = studentIds.length
    ? await supabase
        .from('profiles')
        .select('id, full_name, email, phone, jlpt_level, status')
        .in('id', studentIds)
    : { data: [] }

  // Build a map of batch id → batch info
  const batchMap = Object.fromEntries((batches || []).map(b => [b.id, b]))

  // Augment enrollments with student profiles and batch info
  const rows = (enrollments || []).map(e => ({
    ...e,
    student: studentProfiles?.find(s => s.id === e.student_id),
    batch: batchMap[e.batch_id],
  })).filter(r => r.student)

  // Group by batch for the batch filter display
  const batchGroups: Record<string, typeof rows> = {}
  rows.forEach(r => {
    if (!batchGroups[r.batch_id]) batchGroups[r.batch_id] = []
    batchGroups[r.batch_id].push(r)
  })

  const uniqueStudentCount = studentIds.length

  const card: React.CSSProperties = { background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden' }

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main className="dash-main">

        <DashStyles />

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>My Students</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>
            {uniqueStudentCount} student{uniqueStudentCount !== 1 ? 's' : ''} across {batches?.length || 0} batch{batches?.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {batches?.length === 0 ? (
          <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No batches assigned to you yet.
          </div>
        ) : rows.length === 0 ? (
          <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No students enrolled in your batches yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(batches || []).map(batch => {
              const batchRows = batchGroups[batch.id] || []
              if (batchRows.length === 0) return null
              const levelColor = LEVEL_COLORS[batch.jlpt_level] || '#9ca3af'
              return (
                <div key={batch.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: levelColor, flexShrink: 0 }} />
                    <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{batch.name}</h2>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: levelColor, background: levelColor + '18', padding: '2px 8px', borderRadius: '99px' }}>{batch.jlpt_level}</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{batchRows.length} student{batchRows.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={card}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                          {['Student', 'Email', 'Phone', 'Level', 'Status', 'Enrolled'].map(h => (
                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {batchRows.map((r, i) => {
                          const s = r.student!
                          const lc = LEVEL_COLORS[s.jlpt_level] || '#9ca3af'
                          const sc = s.status === 'Active' ? '#22c55e' : s.status === 'Inactive' ? '#9ca3af' : '#f59e0b'
                          return (
                            <tr key={r.id} style={{ borderBottom: i < batchRows.length - 1 ? '1px solid #f9fafb' : 'none' }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: lc + '22', border: `2px solid ${lc}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: lc, fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                                    {(s.full_name || s.email || '?').charAt(0).toUpperCase()}
                                  </div>
                                  <span style={{ fontWeight: '600', color: 'var(--navy)' }}>{s.full_name || '—'}</span>
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px', color: '#6b7280' }}>{s.email || '—'}</td>
                              <td style={{ padding: '12px 16px', color: '#6b7280' }}>{s.phone || '—'}</td>
                              <td style={{ padding: '12px 16px' }}>
                                {s.jlpt_level
                                  ? <span style={{ fontSize: '11px', fontWeight: '700', color: lc, background: lc + '18', padding: '2px 9px', borderRadius: '99px' }}>{s.jlpt_level}</span>
                                  : '—'}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '600', color: sc, background: sc + '18', padding: '2px 9px', borderRadius: '99px' }}>{s.status || '—'}</span>
                              </td>
                              <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '12px' }}>
                                {r.enrolled_at ? new Date(r.enrolled_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                              </td>
                            </tr>
                          )
                        })}
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
