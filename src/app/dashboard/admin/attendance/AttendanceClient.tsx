'use client'
import { useState } from 'react'
import {
  loadBatchDetail, loadEnrollableStudents, enrollStudent as enrollStudentAction,
  removeStudent as removeStudentAction, loadSessionForDate, saveAttendanceSession,
} from './actions'
import {
  Calendar, CheckCircle2, Users, Plus, ClipboardList, Check,
  ArrowLeft, Clock, CalendarDays, History, ClipboardCheck,
} from 'lucide-react'
import DataToolbar from '@/components/DataToolbar'

type Batch = {
  id: string; name: string; jlpt_level: string; teacher_name: string | null
  enrolled: number; status: string; time_slot: string; days: string
}
type Student = { id: string; full_name: string | null; email: string | null; jlpt_level?: string | null; phone?: string | null; batch?: string | null }
type Session = {
  id: string; batch_id: string; session_date: string; topic: string | null
  total_present: number; total_absent: number; total_late: number; created_at: string
}
type AttStatus = 'Present' | 'Absent' | 'Late'
type View = 'batches' | 'detail' | 'mark'

const levelColor: Record<string, string> = { N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6' }
const statusColor: Record<AttStatus, string> = { Present: '#22c55e', Absent: '#e84040', Late: '#f59e0b' }
const statusBg: Record<AttStatus, string> = { Present: '#f0fdf4', Absent: '#fef2f2', Late: '#fffbeb' }

const inputStyle = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
  borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#f9fafb',
  color: '#1a1f3c', fontWeight: 500, boxSizing: 'border-box' as const,
} as const

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' })
}

export default function AttendanceClient({ initialBatches }: { initialBatches: Batch[] }) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches)
  const [view, setView] = useState<View>('batches')
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null)

  // Detail view
  const [enrolled, setEnrolled] = useState<Student[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [detailLoading, setDetailLoading] = useState(false)

  // Enroll modal
  const [showEnroll, setShowEnroll] = useState(false)
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [enrollSearch, setEnrollSearch] = useState('')
  const [enrolling, setEnrolling] = useState(false)

  // Mark view
  const [markDate, setMarkDate] = useState(todayStr())
  const [markTopic, setMarkTopic] = useState('')
  const [attMap, setAttMap] = useState<Record<string, AttStatus>>({})
  const [saving, setSaving] = useState(false)

  // ── Open batch detail ──────────────────────────────────────────────
  async function openDetail(batch: Batch) {
    setActiveBatch(batch)
    setView('detail')
    setDetailLoading(true)
    const { students, sessions } = await loadBatchDetail(batch.id)
    setEnrolled(students)
    setSessions(sessions)
    setDetailLoading(false)
  }

  // ── Open enroll modal ──────────────────────────────────────────────
  async function openEnrollModal() {
    setShowEnroll(true)
    setEnrollSearch('')
    const data = await loadEnrollableStudents()
    const enrolledIds = new Set(enrolled.map(s => s.id))
    setAllStudents((data as Student[]).filter((s: Student) => !enrolledIds.has(s.id)))
  }

  async function enrollStudent(student: Student) {
    if (!activeBatch) return
    setEnrolling(true)
    const newCount = (activeBatch.enrolled || 0) + 1
    await enrollStudentAction(activeBatch.id, student.id, newCount)
    setEnrolled(prev => [...prev, student])
    setAllStudents(prev => prev.filter(s => s.id !== student.id))
    setBatches(prev => prev.map(b => b.id === activeBatch.id ? { ...b, enrolled: newCount } : b))
    setActiveBatch(prev => prev ? { ...prev, enrolled: newCount } : prev)
    setEnrolling(false)
  }

  async function removeStudent(studentId: string) {
    if (!activeBatch || !confirm('Remove this student from the batch?')) return
    const newCount = Math.max(0, (activeBatch.enrolled || 0) - 1)
    await removeStudentAction(activeBatch.id, studentId, newCount)
    setEnrolled(prev => prev.filter(s => s.id !== studentId))
    setBatches(prev => prev.map(b => b.id === activeBatch.id ? { ...b, enrolled: newCount } : b))
    setActiveBatch(prev => prev ? { ...prev, enrolled: newCount } : prev)
  }

  // ── Open mark view ─────────────────────────────────────────────────
  async function openMark() {
    if (!activeBatch) return
    const date = todayStr()
    setMarkDate(date)
    setMarkTopic('')

    const { session: existing, records } = await loadSessionForDate(activeBatch.id, date)

    const defaultMap: Record<string, AttStatus> = {}
    for (const s of enrolled) defaultMap[s.id] = 'Present'

    if (existing) {
      setMarkTopic(existing.topic || '')
      for (const r of records) defaultMap[r.student_id] = r.status as AttStatus
    }
    setAttMap(defaultMap)
    setView('mark')
  }

  // ── Save attendance ────────────────────────────────────────────────
  async function saveAttendance() {
    if (!activeBatch) return
    setSaving(true)

    const records = enrolled.map(s => ({ student_id: s.id, status: attMap[s.id] || 'Present' }))
    const { session } = await saveAttendanceSession({
      batchId: activeBatch.id, date: markDate, topic: markTopic || null, records,
    })

    if (session) {
      setSessions(prev => {
        const exists = prev.find(x => x.id === session.id)
        return exists ? prev.map(x => x.id === session.id ? session : x) : [session, ...prev]
      })
    }
    setSaving(false)
    setView('detail')
  }

  // ══════════════════════════════════════════════════════════════════
  // VIEW: MARK ATTENDANCE
  // ══════════════════════════════════════════════════════════════════
  if (view === 'mark' && activeBatch) {
    const pCount = Object.values(attMap).filter(s => s === 'Present').length
    const aCount = Object.values(attMap).filter(s => s === 'Absent').length
    const lCount = Object.values(attMap).filter(s => s === 'Late').length

    return (
      <>
        <button onClick={() => setView('detail')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6e6e73', fontSize: '13px', fontWeight: '500', padding: 0, marginBottom: '20px', fontFamily: 'inherit' }}>
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: '24px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Take Attendance</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>{activeBatch.name} · {activeBatch.jlpt_level}</p>
          </div>
          <button onClick={saveAttendance} disabled={saving || enrolled.length === 0} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', background: saving ? '#9ca3af' : '#22c55e',
            color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px',
            fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
            {saving ? 'Saving…' : <><Check size={15} /> Save Attendance</>}
          </button>
        </div>

        {/* Date + Topic */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #ececef', display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Session Date</label>
            <input type="date" value={markDate} onChange={e => setMarkDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Topic / Notes (optional)</label>
            <input value={markTopic} onChange={e => setMarkTopic(e.target.value)} placeholder="e.g. Lesson 3 — て-form verbs" style={inputStyle} />
          </div>
        </div>

        {/* Student list */}
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ececef' }}>
          {/* Summary bar */}
          <div style={{ display: 'flex', gap: '24px', padding: '14px 20px', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
            {[['Present', pCount, '#22c55e'], ['Absent', aCount, '#e84040'], ['Late', lCount, '#f59e0b']].map(([label, count, color]) => (
              <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: color as string, fontWeight: '700' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color as string, display: 'inline-block' }} />
                {count} {label}
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#9ca3af' }}>{enrolled.length} students total</div>
          </div>

          {enrolled.map((student, idx) => {
            const status: AttStatus = attMap[student.id] || 'Present'
            return (
              <div key={student.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 20px',
                borderBottom: idx < enrolled.length - 1 ? '1px solid #f9fafb' : 'none',
                background: statusBg[status] + '50',
              }}>
                <div style={{ width: '38px', height: '38px', background: levelColor[activeBatch.jlpt_level] + '20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: levelColor[activeBatch.jlpt_level], flexShrink: 0 }}>
                  {(student.full_name || student.email || '?').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}>{student.full_name || '—'}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{student.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['Present', 'Absent', 'Late'] as AttStatus[]).map(s => (
                    <button key={s} onClick={() => setAttMap(m => ({ ...m, [student.id]: s }))} style={{
                      padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                      border: `2px solid ${status === s ? statusColor[s] : '#e5e7eb'}`,
                      background: status === s ? statusColor[s] : '#f9fafb',
                      color: status === s ? '#fff' : '#9ca3af',
                      transition: 'all 0.15s',
                    }}>
                      {s === 'Present' ? 'P' : s === 'Absent' ? 'A' : 'L'}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // VIEW: BATCH DETAIL
  // ══════════════════════════════════════════════════════════════════
  if (view === 'detail' && activeBatch) {
    const filtered = allStudents.filter(s =>
      (s.full_name || '').toLowerCase().includes(enrollSearch.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(enrollSearch.toLowerCase())
    )

    return (
      <>
        <button onClick={() => setView('batches')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6e6e73', fontSize: '13px', fontWeight: '500', padding: 0, marginBottom: '20px', fontFamily: 'inherit' }}>
          <ArrowLeft size={15} /> Back to Attendance
        </button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ background: (levelColor[activeBatch.jlpt_level] || '#e84040') + '20', color: levelColor[activeBatch.jlpt_level] || '#e84040', fontSize: '12px', fontWeight: '700', padding: '3px 12px', borderRadius: '20px' }}>
                {activeBatch.jlpt_level}
              </span>
              <h1 style={{ fontFamily: 'var(--display)', fontSize: '24px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>{activeBatch.name}</h1>
            </div>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '13px', margin: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {activeBatch.time_slot || '—'}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CalendarDays size={13} /> {activeBatch.days || '—'}</span>
            </p>
          </div>
          <button onClick={openMark} disabled={enrolled.length === 0} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px',
            background: enrolled.length === 0 ? '#e5e7eb' : 'var(--red)',
            color: enrolled.length === 0 ? '#9ca3af' : '#fff',
            border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
            cursor: enrolled.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
            <ClipboardList size={15} /> Take Attendance
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Enrolled Students */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}><Users size={15} style={{ color: '#9ca3af' }} /> Enrolled Students ({enrolled.length})</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DataToolbar
                  title={`${activeBatch.name} — Class Roster`}
                  subtitle={`${activeBatch.jlpt_level} · ${activeBatch.time_slot || ''}`}
                  columns={[{ key: 'sno', label: 'S.No' }, { key: 'name', label: 'Student' }, { key: 'email', label: 'Email' }, { key: 'level', label: 'Level' }, { key: 'phone', label: 'Phone' }]}
                  rows={enrolled.map((s, i) => ({ sno: i + 1, name: s.full_name || '—', email: s.email || '', level: s.jlpt_level || '', phone: s.phone || '' }))}
                />
                <button onClick={openEnrollModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 13px', background: '#1a1f3c', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Plus size={13} /> Enroll
                </button>
              </div>
            </div>

            {detailLoading ? (
              <div style={{ background: '#fff', borderRadius: '10px', padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Loading…</div>
            ) : enrolled.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '10px', padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', lineHeight: 1.6 }}>
                No students enrolled yet.<br />Click "+ Enroll" to add students to this batch.
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ececef' }}>
                {enrolled.map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: i < enrolled.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                    <div style={{ width: '34px', height: '34px', background: '#1a1f3c15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#1a1f3c', flexShrink: 0 }}>
                      {(s.full_name || s.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.full_name || 'No name'}</span>
                        {s.jlpt_level && <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 7px', borderRadius: '20px', flexShrink: 0, background: (levelColor[s.jlpt_level] || '#9ca3af') + '20', color: levelColor[s.jlpt_level] || '#9ca3af' }}>{s.jlpt_level}</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}</div>
                    </div>
                    <button onClick={() => removeStudent(s.id)} style={{ padding: '3px 9px', background: '#fef2f2', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', color: '#e84040', flexShrink: 0 }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Session History */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}><History size={15} style={{ color: '#9ca3af' }} /> Session History ({sessions.length})</h2>
              {sessions.length > 0 && (
                <DataToolbar
                  title={`${activeBatch.name} — Attendance Sessions`}
                  columns={[{ key: 'date', label: 'Date' }, { key: 'topic', label: 'Topic' }, { key: 'present', label: 'Present' }, { key: 'absent', label: 'Absent' }, { key: 'late', label: 'Late' }, { key: 'rate', label: 'Rate %' }]}
                  rows={sessions.map(s => {
                    const total = s.total_present + s.total_absent + s.total_late
                    return { date: fmtDate(s.session_date), topic: s.topic || '', present: s.total_present, absent: s.total_absent, late: s.total_late, rate: total ? `${Math.round((s.total_present / total) * 100)}%` : '0%' }
                  })}
                />
              )}
            </div>
            {sessions.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '10px', padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', lineHeight: 1.6 }}>
                No sessions recorded yet.<br />Click "Take Attendance" to mark the first session.
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ececef' }}>
                {sessions.map((sess, i) => {
                  const total = sess.total_present + sess.total_absent + sess.total_late
                  const pct = total > 0 ? Math.round((sess.total_present / total) * 100) : 0
                  const pctColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#e84040'
                  return (
                    <div key={sess.id} style={{ padding: '14px 16px', borderBottom: i < sessions.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1d1d1f' }}>{fmtDate(sess.session_date)}</div>
                          {sess.topic && <div style={{ fontSize: '11px', color: '#6e6e73', marginTop: '2px' }}>{sess.topic}</div>}
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: pctColor }}>{pct}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                        <span style={{ color: '#22c55e', fontWeight: '600' }}>{sess.total_present} present</span>
                        <span style={{ color: '#e84040', fontWeight: '600' }}>{sess.total_absent} absent</span>
                        {sess.total_late > 0 && <span style={{ color: '#f59e0b', fontWeight: '600' }}>{sess.total_late} late</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Enroll Modal */}
        {showEnroll && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '460px', maxHeight: '75vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 0' }}>
                <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1f3c' }}>Enroll Student into {activeBatch.name}</h2>
                <button onClick={() => setShowEnroll(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af' }}>×</button>
              </div>
              <div style={{ padding: '14px 20px' }}>
                <input autoFocus value={enrollSearch} onChange={e => setEnrollSearch(e.target.value)} placeholder="Search by name or email…" style={inputStyle} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
                {filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '13px' }}>
                    {enrollSearch ? 'No students match your search' : 'All students are already enrolled'}
                  </div>
                ) : filtered.map(s => {
                  const lvl = s.jlpt_level || null
                  const matches = lvl && lvl === activeBatch.jlpt_level
                  return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ width: '32px', height: '32px', background: (levelColor[lvl || ''] || '#9ca3af') + '20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: levelColor[lvl || ''] || '#6b7280', flexShrink: 0 }}>
                      {(s.full_name || s.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1f3c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.full_name || 'No name'}</span>
                        {lvl && <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 7px', borderRadius: '20px', flexShrink: 0, background: (levelColor[lvl] || '#9ca3af') + '20', color: levelColor[lvl] || '#9ca3af' }}>{lvl}</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.email}{lvl && !matches ? ` · ${lvl} student` : ''}
                      </div>
                    </div>
                    <button onClick={() => enrollStudent(s)} disabled={enrolling} style={{ padding: '5px 14px', background: '#1a1f3c', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#fff', flexShrink: 0 }}>
                      Enroll
                    </button>
                  </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // VIEW: BATCH LIST
  // ══════════════════════════════════════════════════════════════════
  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontFamily: 'var(--display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.04em', margin: '0 0 6px' }}>出席 · Attendance</p>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Attendance</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '6px' }}>Track class attendance by batch</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Batches', value: batches.length, icon: <Calendar size={16} />, color: '#e84040' },
          { label: 'Active Batches', value: batches.filter(b => b.status === 'Active').length, icon: <CheckCircle2 size={16} />, color: '#22c55e' },
          { label: 'Total Enrolled', value: batches.reduce((s, b) => s + (b.enrolled || 0), 0), icon: <Users size={16} />, color: '#2d7dd2' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #ececef', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#6e6e73', fontWeight: '500' }}>{label}</span>
              <span style={{ color, display: 'flex', alignItems: 'center' }}>{icon}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: '600', color: '#1d1d1f', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
          </div>
        ))}
      </div>

      {batches.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '56px', textAlign: 'center', color: '#9ca3af' }}>
          <Calendar size={36} style={{ margin: '0 auto 16px', display: 'block', color: '#d1d5db' }} strokeWidth={1.5} />
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#6e6e73' }}>No batches yet</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Create batches first from the Batches page</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {batches.map(batch => (
            <div key={batch.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ececef', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#d1d5db')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ececef')}>
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: (levelColor[batch.jlpt_level] || '#e84040') + '20', color: levelColor[batch.jlpt_level] || '#e84040', fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>{batch.jlpt_level}</span>
                  <span style={{ fontSize: '11px', color: batch.status === 'Active' ? '#22c55e' : '#9ca3af', fontWeight: '600' }}>{batch.status}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1d1d1f', marginBottom: '10px', letterSpacing: '-0.01em' }}>{batch.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6e6e73', marginBottom: '5px' }}><Clock size={13} style={{ color: '#9ca3af' }} /> {batch.time_slot || '—'}</div>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6e6e73' }}><CalendarDays size={13} style={{ color: '#9ca3af' }} /> {batch.days || '—'}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6e6e73' }}><Users size={13} style={{ color: '#9ca3af' }} /> {batch.enrolled || 0} students</span>
                </div>
                <button onClick={() => openDetail(batch)} style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#1d1d1f', transition: 'all 0.15s', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1a1f3c'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#1a1f3c' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1d1d1f'; e.currentTarget.style.borderColor = '#e5e7eb' }}>
                  <ClipboardCheck size={14} /> Manage Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
