'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Clock, CheckCircle2, Calendar, GraduationCap, Award, Upload, AlertCircle,
} from 'lucide-react'
import Modal from '@/components/Modal'
import ToastContainer, { useToast } from '@/components/Toast'
import StatCard, { StatGrid } from '@/components/StatCard'
import type { StudentWorkItem } from './load'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}

function fmtDate(d: string | null) {
  if (!d) return 'No due date'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
function isOverdue(d: string | null) {
  if (!d) return false
  return new Date(d) < new Date(new Date().toDateString())
}

export default function StudentWorkClient({
  kind, studentId, initialItems,
}: { kind: 'Assignment' | 'Test'; studentId: string; initialItems: StudentWorkItem[] }) {
  const { toasts, toast, remove } = useToast()
  const [items, setItems] = useState<StudentWorkItem[]>(initialItems)
  const [active, setActive] = useState<StudentWorkItem | null>(null)
  const [answer, setAnswer] = useState('')
  const [saving, setSaving] = useState(false)

  const noun = kind === 'Test' ? 'test' : 'assignment'
  const Noun = kind === 'Test' ? 'Test' : 'Assignment'

  const stats = useMemo(() => {
    const pending = items.filter(i => !i.submission_id).length
    const submitted = items.filter(i => i.submission_id && i.sub_status !== 'Graded').length
    const graded = items.filter(i => i.sub_status === 'Graded')
    const avg = graded.length
      ? Math.round(graded.reduce((s, i) => s + ((i.points || 0) / i.max_points) * 100, 0) / graded.length)
      : null
    return { pending, submitted, graded: graded.length, avg }
  }, [items])

  function open(item: StudentWorkItem) {
    setActive(item)
    setAnswer(item.content || '')
  }

  async function handleSubmit() {
    if (!active) return
    if (!answer.trim()) { toast('Write your answer before submitting', 'error'); return }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      assignment_id: active.id,
      student_id: studentId,
      content: answer.trim(),
      status: 'Submitted',
      submitted_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('assignment_submissions')
      .upsert(payload, { onConflict: 'assignment_id,student_id' })
      .select()
      .single()
    if (error) { toast(error.message, 'error'); setSaving(false); return }
    const sub = data as { id: string; submitted_at: string }
    setItems(prev => prev.map(i => i.id === active.id ? {
      ...i, submission_id: sub.id, sub_status: 'Submitted', content: answer.trim(), submitted_at: sub.submitted_at,
    } : i))
    toast(`${Noun} submitted`, 'success')
    setSaving(false)
    setActive(null)
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>{kind === 'Test' ? 'Tests' : 'Assignments'}</h1>
        <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>{kind === 'Test' ? 'Take your tests and review your scores' : 'Complete your homework and track your grades'}</p>
      </div>

      {/* KPI */}
      <StatGrid>
        {[
          { label: 'To do', value: stats.pending, icon: <Clock size={18} />, color: '#e84040' },
          { label: 'Submitted', value: stats.submitted, icon: <Upload size={18} />, color: '#2d7dd2' },
          { label: 'Graded', value: stats.graded, icon: <CheckCircle2 size={18} />, color: '#22c55e' },
          { label: 'Average', value: stats.avg != null ? `${stats.avg}%` : '—', icon: <Award size={18} />, color: '#8b5cf6' },
        ].map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </StatGrid>

      {items.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
          <FileText size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p style={{ fontSize: '14px' }}>No {noun}s yet. Your teacher will post {noun}s for your batch here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map(i => {
            const lc = LEVEL_COLORS[i.jlpt_level || ''] || '#9ca3af'
            const graded = i.sub_status === 'Graded'
            const submitted = !!i.submission_id
            const overdue = !submitted && isOverdue(i.due_date)
            const pct = graded ? Math.round(((i.points || 0) / i.max_points) * 100) : 0
            return (
              <div key={i.id} style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '12px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: `${lc}18`, color: lc }}>{i.jlpt_level}</span>
                    {overdue && <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: '#fef2f2', color: '#e84040', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={11} /> Overdue</span>}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', margin: '2px 0' }}>{i.title}</h3>
                  {i.description && <p style={{ fontSize: '13px', color: '#6e6e73', margin: '2px 0 0' }}>{i.description}</p>}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap', fontSize: '12px', color: '#6b7280' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><GraduationCap size={13} /> {i.batch_name}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Calendar size={13} /> Due {fmtDate(i.due_date)}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FileText size={13} /> {i.max_points} pts</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  {graded ? (
                    <>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: pct >= 40 ? '#22c55e' : '#e84040' }}>{i.points}/{i.max_points}</span>
                      <button onClick={() => open(i)} style={{ padding: '7px 14px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>View feedback</button>
                    </>
                  ) : submitted ? (
                    <>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: '#eff6ff', color: '#2d7dd2' }}>Submitted</span>
                      <button onClick={() => open(i)} style={{ padding: '7px 14px', background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Edit answer</button>
                    </>
                  ) : (
                    <button onClick={() => open(i)} style={{ padding: '9px 18px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Upload size={14} /> {kind === 'Test' ? 'Start' : 'Submit'}</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {active && (
        <Modal title={active.title} onClose={() => setActive(null)} wide>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px', color: '#6b7280' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><GraduationCap size={13} /> {active.batch_name}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Calendar size={13} /> Due {fmtDate(active.due_date)}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FileText size={13} /> {active.max_points} pts</span>
            </div>

            {active.instructions && (
              <div>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Instructions</span>
                <div style={{ background: '#f9fafb', border: '1px solid #f0f0f2', borderRadius: '9px', padding: '12px 14px', fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap' }}>{active.instructions}</div>
              </div>
            )}

            {active.sub_status === 'Graded' ? (
              <>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#166534', marginBottom: '4px' }}>Your Score</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#16a34a' }}>{active.points}<span style={{ fontSize: '18px', color: '#22c55e' }}>/{active.max_points}</span></div>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Teacher feedback</span>
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '9px', padding: '12px 14px', fontSize: '14px', color: active.feedback ? '#1d1d1f' : '#9ca3af', whiteSpace: 'pre-wrap' }}>{active.feedback || 'No written feedback.'}</div>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Your answer</span>
                  <div style={{ background: '#f9fafb', border: '1px solid #f0f0f2', borderRadius: '9px', padding: '12px 14px', fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap' }}>{active.content || '—'}</div>
                </div>
              </>
            ) : (
              <>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Your answer</span>
                  <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={7} placeholder="Type your answer here…"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontFamily: 'inherit', color: '#1d1d1f', outline: 'none', resize: 'vertical' }} />
                </label>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button onClick={() => setActive(null)} style={{ padding: '10px 20px', background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                  <button onClick={handleSubmit} disabled={saving} style={{ padding: '10px 20px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{saving ? 'Submitting…' : active.submission_id ? 'Update answer' : 'Submit'}</button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
