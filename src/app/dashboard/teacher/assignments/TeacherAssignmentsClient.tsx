'use client'
import { useState, useMemo } from 'react'
import { createAssignment, updateAssignment, deleteAssignment } from './actions'
import {
  FileText, Plus, Calendar, Users, CheckCircle2, Clock, ClipboardList,
  Trash2, Pencil, GraduationCap,
} from 'lucide-react'
import Modal from '@/components/Modal'
import ToastContainer, { useToast } from '@/components/Toast'
import StatCard, { StatGrid } from '@/components/StatCard'

type Batch = { id: string; name: string; jlpt_level: string; enrolled: number }
type Assignment = {
  id: string; title: string; description: string | null; instructions: string | null
  batch_id: string; jlpt_level: string | null; type: string; max_points: number
  due_date: string | null; status: string; created_at: string
  batch_name: string; batch_enrolled: number; sub_total: number; sub_graded: number
}

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const STATUS_COLORS: Record<string, string> = {
  Published: '#22c55e', Draft: '#9ca3af', Closed: '#e84040',
}

function fmtDate(d: string | null) {
  if (!d) return 'No due date'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const emptyForm = {
  title: '', description: '', instructions: '', batch_id: '',
  type: 'Assignment', max_points: 100, due_date: '', status: 'Published',
}

export default function TeacherAssignmentsClient({
  batches, initialAssignments,
}: { teacherId?: string; batches: Batch[]; initialAssignments: Assignment[] }) {
  const { toasts, toast, remove } = useToast()
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Assignment | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [filterType, setFilterType] = useState<'All' | 'Assignment' | 'Test'>('All')

  const stats = useMemo(() => {
    const total = assignments.length
    const published = assignments.filter(a => a.status === 'Published').length
    const submissions = assignments.reduce((s, a) => s + a.sub_total, 0)
    const toGrade = assignments.reduce((s, a) => s + (a.sub_total - a.sub_graded), 0)
    return { total, published, submissions, toGrade }
  }, [assignments])

  const filtered = filterType === 'All' ? assignments : assignments.filter(a => a.type === filterType)

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, batch_id: batches[0]?.id || '' })
    setShowForm(true)
  }
  function openEdit(a: Assignment) {
    setEditing(a)
    setForm({
      title: a.title, description: a.description || '', instructions: a.instructions || '',
      batch_id: a.batch_id, type: a.type, max_points: a.max_points,
      due_date: a.due_date || '', status: a.status,
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim()) { toast('Title is required', 'error'); return }
    if (!form.batch_id) { toast('Select a batch', 'error'); return }
    setSaving(true)
    const batch = batches.find(b => b.id === form.batch_id)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      instructions: form.instructions.trim() || null,
      batch_id: form.batch_id,
      jlpt_level: batch?.jlpt_level || null,
      type: form.type,
      max_points: Number(form.max_points) || 100,
      due_date: form.due_date || null,
      status: form.status,
    }

    if (editing) {
      const { error } = await updateAssignment(editing.id, payload)
      if (error) { toast(error, 'error'); setSaving(false); return }
      setAssignments(prev => prev.map(a => a.id === editing.id ? {
        ...a, ...payload, batch_name: batch?.name || a.batch_name, batch_enrolled: batch?.enrolled || a.batch_enrolled,
      } : a))
      toast('Assignment updated', 'success')
    } else {
      const { assignment: data, error } = await createAssignment(payload)
      if (error || !data) { toast(error || 'Create failed', 'error'); setSaving(false); return }
      setAssignments(prev => [{
        ...(data as Assignment),
        batch_name: batch?.name || '—', batch_enrolled: batch?.enrolled || 0,
        sub_total: 0, sub_graded: 0,
      }, ...prev])
      toast('Assignment created', 'success')
    }
    setSaving(false)
    setShowForm(false)
  }

  async function handleDelete(a: Assignment) {
    if (!confirm(`Delete "${a.title}"? This removes all its submissions too.`)) return
    const { error } = await deleteAssignment(a.id)
    if (error) { toast(error, 'error'); return }
    setAssignments(prev => prev.filter(x => x.id !== a.id))
    toast('Assignment deleted', 'success')
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Assignments &amp; Tests</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Create work for your batches and track submissions</p>
        </div>
        <button onClick={openCreate} disabled={batches.length === 0}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 20px', background: batches.length ? 'var(--red)' : '#d1d5db', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: batches.length ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
          <Plus size={16} /> Create
        </button>
      </div>

      {batches.length === 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#9a3412' }}>
          You have no batches assigned yet. An admin needs to assign a batch to you before you can create assignments.
        </div>
      )}

      {/* KPI cards */}
      <StatGrid>
        {[
          { label: 'Total', value: stats.total, icon: <ClipboardList size={18} />, color: '#2d7dd2' },
          { label: 'Published', value: stats.published, icon: <CheckCircle2 size={18} />, color: '#22c55e' },
          { label: 'Submissions', value: stats.submissions, icon: <FileText size={18} />, color: '#8b5cf6' },
          { label: 'To grade', value: stats.toGrade, icon: <Clock size={18} />, color: '#e84040' },
        ].map(s => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </StatGrid>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['All', 'Assignment', 'Test'] as const).map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              border: filterType === t ? '1px solid var(--navy)' : '1px solid #e5e7eb',
              background: filterType === t ? 'var(--navy)' : '#fff', color: filterType === t ? '#fff' : '#6b7280' }}>
            {t === 'All' ? 'All' : t === 'Test' ? 'Tests' : 'Assignments'}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
          <ClipboardList size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p style={{ fontSize: '14px' }}>No {filterType !== 'All' ? filterType.toLowerCase() + 's' : 'assignments'} yet. Click <strong>Create</strong> to add one.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map(a => {
            const lc = LEVEL_COLORS[a.jlpt_level || ''] || '#9ca3af'
            const pending = a.sub_total - a.sub_graded
            return (
              <div key={a.id} style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '12px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: a.type === 'Test' ? '#fef2f2' : '#eff6ff', color: a.type === 'Test' ? '#e84040' : '#2d7dd2' }}>{a.type}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: `${lc}18`, color: lc }}>{a.jlpt_level}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: `${STATUS_COLORS[a.status]}18`, color: STATUS_COLORS[a.status] }}>{a.status}</span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', margin: '2px 0' }}>{a.title}</h3>
                    {a.description && <p style={{ fontSize: '13px', color: '#6e6e73', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.description}</p>}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap', fontSize: '12px', color: '#6b7280' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><GraduationCap size={13} /> {a.batch_name}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Calendar size={13} /> {fmtDate(a.due_date)}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FileText size={13} /> {a.max_points} pts</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Users size={13} /> {a.sub_total}/{a.batch_enrolled} submitted</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {pending > 0 && (
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: '#fef2f2', color: '#e84040' }}>{pending} to grade</span>
                    )}
                    <button onClick={() => openEdit(a)} title="Edit" style={iconBtn}><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(a)} title="Delete" style={{ ...iconBtn, color: '#e84040' }}><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Assignment' : 'Create Assignment'} onClose={() => setShowForm(false)} wide>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field label="Title">
              <input value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} placeholder="e.g. N5 Kanji Worksheet 3" style={inp} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Type">
                <select value={form.type} onChange={e => setForm(s => ({ ...s, type: e.target.value }))} style={inp}>
                  <option value="Assignment">Assignment</option>
                  <option value="Test">Test</option>
                </select>
              </Field>
              <Field label="Batch">
                <select value={form.batch_id} onChange={e => setForm(s => ({ ...s, batch_id: e.target.value }))} style={inp}>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.jlpt_level})</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <Field label="Max points">
                <input type="number" value={form.max_points} onChange={e => setForm(s => ({ ...s, max_points: Number(e.target.value) }))} style={inp} />
              </Field>
              <Field label="Due date">
                <input type="date" value={form.due_date} onChange={e => setForm(s => ({ ...s, due_date: e.target.value }))} style={inp} />
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={e => setForm(s => ({ ...s, status: e.target.value }))} style={inp}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed</option>
                </select>
              </Field>
            </div>
            <Field label="Short description">
              <input value={form.description} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} placeholder="One-line summary shown in the list" style={inp} />
            </Field>
            <Field label="Instructions (optional)">
              <textarea value={form.instructions} onChange={e => setForm(s => ({ ...s, instructions: e.target.value }))} placeholder="Detailed instructions students will see when they open it" rows={4} style={{ ...inp, resize: 'vertical' }} />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button onClick={() => setShowForm(false)} style={btnGhost}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={btnPrimary}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create'}</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

const iconBtn: React.CSSProperties = { width: '32px', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fff', color: '#6b7280', cursor: 'pointer' }
const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontFamily: 'inherit', color: '#1d1d1f', background: '#fff', outline: 'none' }
const btnPrimary: React.CSSProperties = { padding: '10px 20px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
const btnGhost: React.CSSProperties = { padding: '10px 20px', background: '#fff', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{label}</span>
      {children}
    </label>
  )
}
