'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Plus, Eye, Pencil, Trash2, X, AlertCircle, Eye as EyeIcon, EyeOff } from 'lucide-react'
import Modal from '@/components/Modal'
import ToastContainer, { useToast } from '@/components/Toast'

type Teacher = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  jlpt_level?: string | null
  status?: string | null
  created_at: string
}

type Batch = {
  id: string; name: string; jlpt_level: string
  time_slot: string | null; status: string; enrolled: number; capacity: number
}

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
const STATUS_OPTIONS = ['Active', 'On Leave', 'Inactive']

const levelColor: Record<string, string> = { N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6' }
const statusColor: Record<string, string> = { Active: '#22c55e', 'On Leave': '#f59e0b', Inactive: '#9ca3af' }
const batchStatusColor: Record<string, string> = { Active: '#22c55e', Upcoming: '#2d7dd2', Completed: '#9ca3af', Paused: '#f59e0b' }

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}{required && <span style={{ color: 'var(--red)', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '9px',
  fontSize: '14px', color: 'var(--navy)', background: '#fff', outline: 'none',
  transition: 'border-color 150ms, box-shadow 150ms', fontFamily: 'inherit', boxSizing: 'border-box',
}
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }

function Btn({ children, onClick, variant = 'ghost', disabled, type = 'button', style: s }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; disabled?: boolean; type?: 'button' | 'submit'; style?: React.CSSProperties
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '10px 18px', borderRadius: '9px', border: 'none', fontFamily: 'inherit',
    fontSize: '14px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1, transition: 'all 150ms ease', whiteSpace: 'nowrap',
  }
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--red)', color: '#fff', boxShadow: '0 2px 8px rgba(232,64,64,0.2)' },
    secondary: { background: '#eff6ff', color: '#2d7dd2' },
    ghost: { background: '#f3f4f6', color: '#374151' },
    danger: { background: '#fef2f2', color: '#e84040' },
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...s }}
      onMouseEnter={e => {
        if (disabled) return
        const el = e.currentTarget
        if (variant === 'primary') { el.style.background = '#d63030'; el.style.transform = 'translateY(-1px)' }
        else if (variant === 'secondary') { el.style.background = '#dbeafe' }
        else if (variant === 'ghost') { el.style.background = '#e5e7eb' }
        else if (variant === 'danger') { el.style.background = '#fee2e2' }
      }}
      onMouseLeave={e => {
        if (disabled) return
        const el = e.currentTarget
        if (variant === 'primary') { el.style.background = 'var(--red)'; el.style.transform = 'none' }
        else if (variant === 'secondary') { el.style.background = '#eff6ff' }
        else if (variant === 'ghost') { el.style.background = '#f3f4f6' }
        else if (variant === 'danger') { el.style.background = '#fef2f2' }
      }}
      onMouseDown={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
      onMouseUp={e => { if (!disabled && variant !== 'primary') (e.currentTarget as HTMLButtonElement).style.transform = 'none' }}
    >
      {children}
    </button>
  )
}

function ActionBtn({ children, onClick, color }: { children: React.ReactNode; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 11px', borderRadius: '7px', border: 'none', background: color + '12', color, fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'all 130ms ease', minHeight: '32px', fontFamily: 'inherit' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = color + '22' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = color + '12' }}>
      {children}
    </button>
  )
}

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input style={{ ...inputStyle, paddingRight: '44px' }} type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder="Min. 6 characters" minLength={6} required />
      <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide' : 'Show'} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: '2px', transition: 'color 150ms' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
        {show ? <EyeOff size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  )
}

export default function TeachersClient({ initialTeachers }: { initialTeachers: Teacher[] }) {
  const { toasts, toast, remove } = useToast()
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [viewTeacher, setViewTeacher] = useState<Teacher | null>(null)
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [teacherBatches, setTeacherBatches] = useState<Batch[]>([])
  const [batchesLoading, setBatchesLoading] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', jlpt_level: 'N3', status: 'Active' })

  const filtered = useMemo(() => teachers.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || (t.full_name?.toLowerCase().includes(q) ?? false) || (t.email?.toLowerCase().includes(q) ?? false) || (t.phone?.includes(q) ?? false)
    return matchSearch && (!filterStatus || t.status === filterStatus) && (!filterLevel || t.jlpt_level === filterLevel)
  }), [teachers, search, filterStatus, filterLevel])

  async function openView(t: Teacher) {
    setViewTeacher(t); setTeacherBatches([]); setBatchesLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('batches').select('id, name, jlpt_level, time_slot, status, enrolled, capacity').eq('teacher_id', t.id).order('created_at', { ascending: false })
    setTeacherBatches(data || []); setBatchesLoading(false)
  }

  function openEdit(t: Teacher) { setEditTeacher({ ...t }); setViewTeacher(null) }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: authErr } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.full_name, role: 'teacher' } } })
    if (authErr) { setError(authErr.message); setLoading(false); return }
    if (data.user) {
      const newProfile = { id: data.user.id, full_name: form.full_name, email: form.email, phone: form.phone, role: 'teacher', jlpt_level: form.jlpt_level, status: form.status }
      await supabase.from('profiles').upsert(newProfile)
      setTeachers(prev => [{ ...newProfile, created_at: new Date().toISOString() }, ...prev])
      setShowAdd(false)
      setForm({ full_name: '', email: '', phone: '', password: '', jlpt_level: 'N3', status: 'Active' })
      toast('Teacher account created', 'success')
    }
    setLoading(false)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault(); if (!editTeacher) return; setLoading(true)
    const supabase = createClient()
    const updates = { full_name: editTeacher.full_name, phone: editTeacher.phone, jlpt_level: editTeacher.jlpt_level, status: editTeacher.status }
    await supabase.from('profiles').update(updates).eq('id', editTeacher.id)
    setTeachers(prev => prev.map(t => t.id === editTeacher.id ? { ...t, ...updates } : t))
    setEditTeacher(null); setLoading(false)
    toast('Teacher updated', 'success')
  }

  async function handleDeactivate(id: string) {
    if (!confirm('Deactivate this teacher?')) return
    const supabase = createClient()
    await supabase.from('profiles').update({ status: 'Inactive' }).eq('id', id)
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: 'Inactive' } : t))
    toast('Teacher deactivated', 'info')
  }

  const totalActive = teachers.filter(t => t.status === 'Active').length
  const onLeave = teachers.filter(t => t.status === 'On Leave').length

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Teachers</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>{teachers.length} teacher{teachers.length !== 1 ? 's' : ''} on staff</p>
        </div>
        <Btn variant="primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Teacher</Btn>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '14px 20px', display: 'flex', gap: '22px', border: '1px solid #ececef', flexWrap: 'wrap' }}>
          {[{ label: 'Total', value: teachers.length, color: 'var(--navy)' }, { label: 'Active', value: totalActive, color: '#22c55e' }, { label: 'On Leave', value: onLeave, color: '#f59e0b' }].map(({ label, value, color }, i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: i < arr.length - 1 ? '22px' : '0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color, letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>{label}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: '1px', height: '36px', background: '#f3f4f6' }} />}
            </div>
          ))}
        </div>
        {LEVELS.map(l => {
          const count = teachers.filter(t => t.jlpt_level === l).length
          if (count === 0) return null
          return (
            <div key={l} style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ececef' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: levelColor[l] }} />
              <span style={{ fontSize: '13px', fontWeight: '700', color: levelColor[l] }}>{l}</span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{count}</span>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input className="input-field" placeholder="Search name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '38px' }} />
        </div>
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ ...selectStyle, width: '140px', flex: 'none' }}>
          <option value="">All Levels</option>
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...selectStyle, width: '140px', flex: 'none' }}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        {(search || filterLevel || filterStatus) && (
          <Btn onClick={() => { setSearch(''); setFilterLevel(''); setFilterStatus('') }}><X size={14} /> Clear</Btn>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
              {['Teacher', 'Email', 'Phone', 'Specialization', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                {search || filterLevel || filterStatus ? 'No teachers match your filters.' : 'No teachers yet. Click "Add Teacher" to get started.'}
              </td></tr>
            ) : filtered.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f9fafb' : 'none', transition: 'background 120ms' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, background: levelColor[t.jlpt_level || 'N3'] || '#2d7dd2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                      {(t.full_name || t.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--navy)' }}>{t.full_name || '—'}</span>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', color: '#6b7280' }}>{t.email || '—'}</td>
                <td style={{ padding: '13px 16px', color: '#6b7280' }}>{t.phone || '—'}</td>
                <td style={{ padding: '13px 16px' }}>
                  {t.jlpt_level ? <span className="badge" style={{ background: levelColor[t.jlpt_level] + '18', color: levelColor[t.jlpt_level] }}>{t.jlpt_level}</span> : '—'}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  {t.status ? <span className="badge" style={{ background: (statusColor[t.status] || '#9ca3af') + '18', color: statusColor[t.status] || '#9ca3af' }}>{t.status}</span> : '—'}
                </td>
                <td style={{ padding: '13px 16px', color: '#9ca3af', fontSize: '12px' }}>
                  {new Date(t.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <ActionBtn onClick={() => openView(t)} color="#6b7280"><Eye size={13} />View</ActionBtn>
                    <ActionBtn onClick={() => openEdit(t)} color="#2d7dd2"><Pencil size={13} />Edit</ActionBtn>
                    <ActionBtn onClick={() => handleDeactivate(t.id)} color="#e84040"><Trash2 size={13} /></ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #f3f4f6', color: '#9ca3af', fontSize: '12px' }}>
            Showing {filtered.length} of {teachers.length} teachers
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <Modal title="Add New Teacher" onClose={() => { setShowAdd(false); setError('') }}>
          {error && <div style={{ display: 'flex', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '9px', marginBottom: '16px', fontSize: '13px' }}><AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />{error}</div>}
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Full Name" required><input style={inputStyle} required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Nakamura Sensei" /></Field>
              <Field label="Phone"><input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" /></Field>
            </div>
            <Field label="Email Address" required><input style={inputStyle} type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="teacher@school.com" /></Field>
            <Field label="Temporary Password" required><PasswordInput value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Specialization">
                <select style={selectStyle} value={form.jlpt_level} onChange={e => setForm(f => ({ ...f, jlpt_level: e.target.value }))}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
              </Field>
              <Field label="Status">
                <select style={selectStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select>
              </Field>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '9px', padding: '10px 13px', marginBottom: '18px', fontSize: '12px', color: '#92400e' }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
              Creating a teacher account briefly signs you out. You will be redirected to log back in.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn style={{ flex: 1 }} onClick={() => { setShowAdd(false); setError('') }}>Cancel</Btn>
              <Btn variant="primary" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? <><span className="spinner" />Creating…</> : <><Plus size={15} />Add Teacher</>}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW MODAL */}
      {viewTeacher && (
        <Modal title="Teacher Profile" onClose={() => setViewTeacher(null)}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', margin: '0 auto 12px', background: levelColor[viewTeacher.jlpt_level || 'N3'] || '#2d7dd2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '26px' }}>
              {(viewTeacher.full_name || viewTeacher.email || '?').charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 4px' }}>{viewTeacher.full_name || 'Unknown'}</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 6px' }}>{viewTeacher.email}</p>
            {viewTeacher.status && <span className="badge" style={{ background: (statusColor[viewTeacher.status] || '#9ca3af') + '18', color: statusColor[viewTeacher.status] || '#9ca3af' }}>{viewTeacher.status}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {[{ label: 'Phone', value: viewTeacher.phone || '—' }, { label: 'Specialization', value: viewTeacher.jlpt_level || '—' }, { label: 'Joined', value: new Date(viewTeacher.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) }].map(({ label, value }) => (
              <div key={label} style={{ background: '#f9fafb', borderRadius: '9px', padding: '10px 13px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy)' }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Batches</div>
            {batchesLoading ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>Loading…</div>
            ) : teacherBatches.length === 0 ? (
              <div style={{ background: '#f9fafb', borderRadius: '9px', padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No batches assigned yet</div>
            ) : (
              <div style={{ background: '#f9fafb', borderRadius: '9px', overflow: 'hidden' }}>
                {teacherBatches.map((b, i) => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderBottom: i < teacherBatches.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: levelColor[b.jlpt_level] || '#9ca3af', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>{b.time_slot || 'No timing set'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <span className="badge" style={{ background: levelColor[b.jlpt_level] + '18', color: levelColor[b.jlpt_level] }}>{b.jlpt_level}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{b.enrolled}/{b.capacity}</span>
                      <span className="badge" style={{ background: (batchStatusColor[b.status] || '#9ca3af') + '18', color: batchStatusColor[b.status] || '#9ca3af' }}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Btn variant="primary" style={{ width: '100%' }} onClick={() => openEdit(viewTeacher)}><Pencil size={15} /> Edit Teacher</Btn>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editTeacher && (
        <Modal title="Edit Teacher" onClose={() => setEditTeacher(null)}>
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Full Name" required><input style={inputStyle} value={editTeacher.full_name || ''} onChange={e => setEditTeacher(t => t ? { ...t, full_name: e.target.value } : t)} /></Field>
              <Field label="Phone"><input style={inputStyle} value={editTeacher.phone || ''} onChange={e => setEditTeacher(t => t ? { ...t, phone: e.target.value } : t)} /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Specialization">
                <select style={selectStyle} value={editTeacher.jlpt_level || 'N3'} onChange={e => setEditTeacher(t => t ? { ...t, jlpt_level: e.target.value } : t)}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
              </Field>
              <Field label="Status">
                <select style={selectStyle} value={editTeacher.status || 'Active'} onChange={e => setEditTeacher(t => t ? { ...t, status: e.target.value } : t)}>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select>
              </Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Btn style={{ flex: 1 }} onClick={() => setEditTeacher(null)}>Cancel</Btn>
              <Btn variant="secondary" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? <><span className="spinner spinner-dark" />Saving…</> : 'Save Changes'}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
