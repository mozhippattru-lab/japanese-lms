'use client'
import { useState, useMemo } from 'react'
import { gradeSubmission } from './actions'
import { ClipboardCheck, CheckCircle2, Clock, FileText, User } from 'lucide-react'
import Modal from '@/components/Modal'
import ToastContainer, { useToast } from '@/components/Toast'
import StatCard, { StatGrid } from '@/components/StatCard'

type Submission = {
  id: string; assignment_id: string; assignment_title: string; assignment_type: string
  jlpt_level: string; max_points: number
  student_id: string; student_name: string; content: string
  status: string; points: number | null; feedback: string
  submitted_at: string; graded_at: string | null
}

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TeacherGradingClient({
  initialSubmissions,
}: { teacherId?: string; initialSubmissions: Submission[] }) {
  const { toasts, toast, remove } = useToast()
  const [subs, setSubs] = useState<Submission[]>(initialSubmissions)
  const [tab, setTab] = useState<'pending' | 'graded'>('pending')
  const [active, setActive] = useState<Submission | null>(null)
  const [points, setPoints] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)

  const pending = useMemo(() => subs.filter(s => s.status !== 'Graded'), [subs])
  const graded = useMemo(() => subs.filter(s => s.status === 'Graded'), [subs])
  const list = tab === 'pending' ? pending : graded

  function openGrade(s: Submission) {
    setActive(s)
    setPoints(s.points != null ? String(s.points) : '')
    setFeedback(s.feedback || '')
  }

  async function handleGrade() {
    if (!active) return
    const pts = Number(points)
    if (points === '' || isNaN(pts)) { toast('Enter a score', 'error'); return }
    if (pts < 0 || pts > active.max_points) { toast(`Score must be 0–${active.max_points}`, 'error'); return }
    setSaving(true)
    const { error, graded_at } = await gradeSubmission(active.id, pts, feedback.trim() || null)
    if (error || !graded_at) { toast(error || 'Grading failed', 'error'); setSaving(false); return }
    setSubs(prev => prev.map(s => s.id === active.id ? { ...s, points: pts, feedback: feedback.trim(), status: 'Graded', graded_at } : s))
    toast('Graded', 'success')
    setSaving(false)
    setActive(null)
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Grading</h1>
        <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Review student submissions and assign scores</p>
      </div>

      {/* KPI */}
      <StatGrid>
        {[
          { label: 'Awaiting grade', value: pending.length, icon: <Clock size={18} />, color: '#e84040' },
          { label: 'Graded', value: graded.length, icon: <CheckCircle2 size={18} />, color: '#22c55e' },
          { label: 'Total submissions', value: subs.length, icon: <FileText size={18} />, color: '#2d7dd2' },
        ].map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </StatGrid>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {([['pending', `To grade (${pending.length})`], ['graded', `Graded (${graded.length})`]] as const).map(([k, lbl]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              border: tab === k ? '1px solid var(--navy)' : '1px solid #e5e7eb',
              background: tab === k ? 'var(--navy)' : '#fff', color: tab === k ? '#fff' : '#6b7280' }}>{lbl}</button>
        ))}
      </div>

      {list.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
          <ClipboardCheck size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p style={{ fontSize: '14px' }}>{tab === 'pending' ? 'Nothing waiting to be graded. 🎉' : 'No graded submissions yet.'}</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '12px', overflow: 'hidden' }}>
          {list.map((s, i) => {
            const lc = LEVEL_COLORS[s.jlpt_level] || '#9ca3af'
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderTop: i === 0 ? 'none' : '1px solid #f3f4f6' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', flexShrink: 0 }}><User size={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{s.student_name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                    <span>{s.assignment_title}</span>
                    <span style={{ color: lc, fontWeight: 700 }}>{s.jlpt_level}</span>
                    <span>· submitted {fmtDate(s.submitted_at)}</span>
                  </div>
                </div>
                {s.status === 'Graded' ? (
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e', marginRight: '6px' }}>{s.points}/{s.max_points}</span>
                ) : (
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: '#fef2f2', color: '#e84040' }}>Pending</span>
                )}
                <button onClick={() => openGrade(s)}
                  style={{ padding: '8px 16px', background: s.status === 'Graded' ? '#fff' : 'var(--navy)', color: s.status === 'Graded' ? '#374151' : '#fff', border: s.status === 'Graded' ? '1px solid #e5e7eb' : 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {s.status === 'Graded' ? 'Review' : 'Grade'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {active && (
        <Modal title="Grade Submission" onClose={() => setActive(null)} wide>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f9fafb', border: '1px solid #f0f0f2', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{active.student_name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{active.assignment_title} · {active.assignment_type} · {active.jlpt_level} · max {active.max_points} pts</div>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Student&apos;s answer</span>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '9px', padding: '12px 14px', fontSize: '14px', color: active.content ? '#1d1d1f' : '#9ca3af', whiteSpace: 'pre-wrap', minHeight: '60px', maxHeight: '240px', overflowY: 'auto' }}>
                {active.content || 'No written answer submitted.'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px', alignItems: 'end' }}>
              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Score (out of {active.max_points})</span>
                <input type="number" value={points} onChange={e => setPoints(e.target.value)} min={0} max={active.max_points} placeholder="0"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '16px', fontWeight: 700, fontFamily: 'inherit', color: '#1d1d1f', outline: 'none' }} />
              </label>
            </div>

            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Feedback (optional)</span>
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} placeholder="What the student did well and what to improve…"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontFamily: 'inherit', color: '#1d1d1f', outline: 'none', resize: 'vertical' }} />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setActive(null)} style={{ padding: '10px 20px', background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleGrade} disabled={saving} style={{ padding: '10px 20px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{saving ? 'Saving…' : 'Save grade'}</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
