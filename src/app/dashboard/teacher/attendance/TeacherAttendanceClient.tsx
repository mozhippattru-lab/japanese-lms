'use client'
import { useState } from 'react'
import { loadBatchStudents, saveAttendance } from './actions'
import { ArrowLeft, Users, CheckCircle2, XCircle, Clock } from 'lucide-react'
import ToastContainer, { useToast } from '@/components/Toast'

type Batch = {
  id: string; name: string; jlpt_level: string
  time_slot: string | null; days: string | string[] | null
  enrolled: number; capacity: number; status: string
}
type Student = { id: string; full_name: string | null; email: string | null }
type AttendanceStatus = 'Present' | 'Absent' | 'Late'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const STATUS_COLORS: Record<string, string> = {
  Active: '#22c55e', Upcoming: '#2d7dd2', Completed: '#9ca3af', Paused: '#f59e0b',
}

function today() { return new Date().toISOString().slice(0, 10) }

export default function TeacherAttendanceClient({ batches }: { batches: Batch[] }) {
  const { toasts, toast, remove } = useToast()
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({})
  const [sessionDate, setSessionDate] = useState(today())
  const [topic, setTopic] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function openBatch(batch: Batch) {
    setSelectedBatch(batch)
    setAttendance({})
    setTopic('')
    setSessionDate(today())
    setLoadingStudents(true)

    const profiles = await loadBatchStudents(batch.id)
    if (profiles.length > 0) {
      setStudents(profiles)
      const defaultAtt: Record<string, AttendanceStatus> = {}
      profiles.forEach(s => { defaultAtt[s.id] = 'Present' })
      setAttendance(defaultAtt)
    } else {
      setStudents([])
    }
    setLoadingStudents(false)
  }

  async function handleSubmit() {
    if (!selectedBatch || students.length === 0) return
    setSubmitting(true)

    const records = students.map(s => ({ student_id: s.id, status: attendance[s.id] || 'Absent' }))
    const { error } = await saveAttendance({
      batchId: selectedBatch.id, sessionDate, topic: topic || null, records,
    })
    if (error) { toast('Failed to save session', 'error'); setSubmitting(false); return }

    toast('Attendance saved!', 'success')
    setSubmitting(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px',
    fontSize: '13px', color: 'var(--navy)', background: '#fff', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  }

  const presentCount = Object.values(attendance).filter(s => s === 'Present').length
  const absentCount = Object.values(attendance).filter(s => s === 'Absent').length
  const lateCount = Object.values(attendance).filter(s => s === 'Late').length

  // ── Batch List View ─────────────────────────────────────────────────────────
  if (!selectedBatch) {
    return (
      <>
        <ToastContainer toasts={toasts} onRemove={remove} />
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Attendance</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Select a batch to mark or review attendance</p>
        </div>

        {batches.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No batches assigned to you yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {batches.map(b => {
              const lc = LEVEL_COLORS[b.jlpt_level] || '#9ca3af'
              const sc = STATUS_COLORS[b.status] || '#9ca3af'
              return (
                <button key={b.id} onClick={() => openBatch(b)} style={{
                  background: '#fff', borderRadius: '12px', border: '1px solid #ececef',
                  padding: '0', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  transition: 'box-shadow 150ms, border-color 150ms', overflow: 'hidden',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLButtonElement).style.borderColor = lc + '60' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#ececef' }}>
                  <div style={{ height: '3px', background: lc }} />
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{b.name}</h3>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: sc, background: sc + '15', padding: '3px 9px', borderRadius: '99px', flexShrink: 0 }}>{b.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: lc, background: lc + '18', padding: '2px 9px', borderRadius: '99px' }}>{b.jlpt_level}</span>
                      <span style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={11} />{b.enrolled}/{b.capacity} students</span>
                    </div>
                    {b.time_slot && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>{b.time_slot}</div>}
                    <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--red)', fontWeight: '600' }}>Mark Attendance →</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </>
    )
  }

  // ── Attendance Marking View ──────────────────────────────────────────────────
  const lc = LEVEL_COLORS[selectedBatch.jlpt_level] || '#9ca3af'

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => setSelectedBatch(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', color: '#374151', transition: 'background 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')} onMouseLeave={e => (e.currentTarget.style.background = '#f3f4f6')}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{selectedBatch.name}</h1>
          <span style={{ fontSize: '11px', fontWeight: '700', color: lc }}>{selectedBatch.jlpt_level}</span>
          {selectedBatch.time_slot && <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '8px' }}>{selectedBatch.time_slot}</span>}
        </div>
      </div>

      {/* Session Fields */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '18px', marginBottom: '14px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '0 0 160px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session Date</label>
          <input type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)} style={{ ...inputStyle, width: '160px' }} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Topic Covered</label>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. N4 Grammar — て-form" style={inputStyle} />
        </div>
      </div>

      {/* Summary Bar */}
      {students.length > 0 && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '14px 18px', marginBottom: '14px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Summary:</span>
          {[{ label: 'Present', value: presentCount, color: '#22c55e' }, { label: 'Absent', value: absentCount, color: '#e84040' }, { label: 'Late', value: lateCount, color: '#f59e0b' }].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
              <span style={{ fontSize: '13px', fontWeight: '700', color }}>{value}</span>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={handleSubmit} disabled={submitting || students.length === 0} style={{
              background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px',
              padding: '10px 22px', fontSize: '13px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1, fontFamily: 'inherit', transition: 'background 150ms',
            }}>
              {submitting ? 'Saving…' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}

      {/* Student List */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden' }}>
        {loadingStudents ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Loading students…</div>
        ) : students.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No students enrolled in this batch yet.</div>
        ) : students.map((s, i) => {
          const st = attendance[s.id] || 'Present'
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderBottom: i < students.length - 1 ? '1px solid #f3f4f6' : 'none', transition: 'background 100ms' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: lc + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: lc, fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
                {(s.full_name || s.email || '?').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.full_name || s.email || 'Unknown'}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>{s.email || ''}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {(['Present', 'Late', 'Absent'] as const).map(status => {
                  const color = status === 'Present' ? '#22c55e' : status === 'Late' ? '#f59e0b' : '#e84040'
                  const icon = status === 'Present' ? <CheckCircle2 size={13} /> : status === 'Late' ? <Clock size={13} /> : <XCircle size={13} />
                  const active = st === status
                  return (
                    <button key={status} onClick={() => setAttendance(a => ({ ...a, [s.id]: status }))} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '6px 12px', borderRadius: '8px', border: `1.5px solid ${active ? color : '#e5e7eb'}`,
                      background: active ? color + '18' : 'transparent',
                      color: active ? color : '#9ca3af',
                      fontSize: '12px', fontWeight: active ? '700' : '500',
                      cursor: 'pointer', transition: 'all 120ms', fontFamily: 'inherit',
                    }}>
                      {icon} {status}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
