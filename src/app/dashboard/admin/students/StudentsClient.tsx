'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Search, Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Eye as EyeIcon, EyeOff, GraduationCap } from 'lucide-react'
import Modal from '@/components/Modal'
import ToastContainer, { useToast } from '@/components/Toast'
import DataToolbar from '@/components/DataToolbar'
import Avatar from '@/components/Avatar'
import StatCard, { StatGrid } from '@/components/StatCard'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

type Student = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  created_at: string
  jlpt_level?: string | null
  batch?: string | null
  status?: string | null
  avatar_url?: string | null
  roll_number?: string | null
  aadhar_number?: string | null
  address?: string | null
  photo_url?: string | null
}

type Invoice = {
  id: string; amount: number; due_date: string; status: string; description: string | null; created_at: string
}

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
const BATCHES = ['Morning', 'Afternoon', 'Evening', 'Weekend']
const STATUS = ['Active', 'Trial', 'Inactive', 'Completed']

const levelColor: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const statusColor: Record<string, string> = {
  Active: '#22c55e', Trial: '#2d7dd2', Inactive: '#9ca3af', Completed: '#8b5cf6',
}
const INV_COLOR: Record<string, string> = { Pending: '#f59e0b', Paid: '#22c55e', Overdue: '#e84040', Cancelled: '#9ca3af' }

const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN')
const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

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
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...s }}
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
      onMouseUp={e => { if (!disabled && variant === 'primary') (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; else if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'none' }}
    >
      {children}
    </button>
  )
}

function ActionBtn({ children, onClick, color }: { children: React.ReactNode; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '6px 11px', borderRadius: '7px', border: 'none',
        background: color + '12', color, fontSize: '12px', fontWeight: '500',
        cursor: 'pointer', transition: 'all 130ms ease', minHeight: '32px',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = color + '22' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = color + '12' }}
    >
      {children}
    </button>
  )
}

function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        className="input-field"
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Min. 6 characters'}
        minLength={6}
        required
        style={{ paddingRight: '44px' }}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
          display: 'flex', alignItems: 'center', padding: '2px',
          transition: 'color 150ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
      >
        {show ? <EyeOff size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  )
}

export default function StudentsClient({ initialStudents }: { initialStudents: Student[] }) {
  const router = useRouter()
  const { toasts, toast, remove } = useToast()
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [viewStudent, setViewStudent] = useState<Student | null>(null)
  const [editStudent, setEditStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [studentInvoices, setStudentInvoices] = useState<Invoice[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(false)

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '',
    jlpt_level: 'N5', batch: 'Morning', status: 'Active',
    aadhar_number: '', address: '', photo_url: '',
  })

  const filtered = useMemo(() => students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || (s.full_name?.toLowerCase().includes(q) ?? false) || (s.email?.toLowerCase().includes(q) ?? false) || (s.phone?.includes(q) ?? false)
    const matchLevel = !filterLevel || s.jlpt_level === filterLevel
    const matchStatus = !filterStatus || s.status === filterStatus
    return matchSearch && matchLevel && matchStatus
  }), [students, search, filterLevel, filterStatus])

  async function openView(s: Student) {
    setViewStudent(s)
    setStudentInvoices([])
    setInvoicesLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('invoices').select('id, amount, due_date, status, description, created_at').eq('student_id', s.id).order('created_at', { ascending: false }).limit(10)
    setStudentInvoices(data || [])
    setInvoicesLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/create-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error || 'Failed to add student'); setLoading(false); return }
    setStudents(prev => [json.student, ...prev])
    setShowAdd(false)
    setForm({ full_name: '', email: '', phone: '', password: '', jlpt_level: 'N5', batch: 'Morning', status: 'Active', aadhar_number: '', address: '', photo_url: '' })
    toast('Student added successfully', 'success')
    setLoading(false)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editStudent) return
    setLoading(true)
    const supabase = createClient()
    const updates = { full_name: editStudent.full_name, phone: editStudent.phone, jlpt_level: editStudent.jlpt_level, batch: editStudent.batch, status: editStudent.status }
    await supabase.from('profiles').update(updates).eq('id', editStudent.id)
    setStudents(prev => prev.map(s => s.id === editStudent.id ? { ...s, ...updates } : s))
    setEditStudent(null)
    setLoading(false)
    toast('Student updated', 'success')
  }

  async function handleDelete(id: string) {
    if (!confirm('Mark this student as Inactive?')) return
    const supabase = createClient()
    await supabase.from('profiles').update({ status: 'Inactive' }).eq('id', id)
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'Inactive' } : s))
    toast('Student deactivated', 'info')
  }

  function openEdit(s: Student) { setEditStudent({ ...s }); setViewStudent(null) }

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '9px',
    fontSize: '14px', color: 'var(--navy)', background: '#fff', outline: 'none',
    transition: 'border-color 150ms', fontFamily: 'inherit', cursor: 'pointer',
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <p style={{ fontFamily: 'var(--display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.04em', margin: '0 0 6px' }}>学生 · Students</p>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Students</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '6px' }}>{students.length} students enrolled</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DataToolbar
            title="Students"
            subtitle={[filterLevel && `Level ${filterLevel}`, filterStatus, search && `Search "${search}"`].filter(Boolean).join(' · ') || undefined}
            columns={[
              { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' },
              { key: 'level', label: 'Level' }, { key: 'batch', label: 'Batch' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' },
            ]}
            rows={filtered.map(s => ({
              name: s.full_name || '—', email: s.email || '', phone: s.phone || '',
              level: s.jlpt_level || '', batch: s.batch || '', status: s.status || '',
              joined: new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            }))}
          />
          <Btn variant="primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Add Student
          </Btn>
        </div>
      </div>

      {/* Level stats */}
      <StatGrid>
        {LEVELS.map(l => {
          const count = students.filter(s => s.jlpt_level === l).length
          return (
            <StatCard
              key={l}
              label={`${l} students`}
              value={count}
              icon={<GraduationCap size={18} strokeWidth={2.2} />}
              color={levelColor[l]}
              active={filterLevel === l}
              onClick={() => setFilterLevel(filterLevel === l ? '' : l)}
            />
          )
        })}
      </StatGrid>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input
            className="input-field"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...selectStyle, width: '140px', flex: 'none' }}>
          <option value="">All Status</option>
          {STATUS.map(s => <option key={s}>{s}</option>)}
        </select>
        {(search || filterLevel || filterStatus) && (
          <Btn onClick={() => { setSearch(''); setFilterLevel(''); setFilterStatus('') }}>
            <X size={14} /> Clear
          </Btn>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid var(--line-warm)', overflow: 'hidden', boxShadow: '0 2px 12px rgba(40,32,20,0.04)' }}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {['Roll No.', 'Student', 'Email', 'Phone', 'Level', 'Batch', 'Status', 'Joined', 'Actions'].map(h => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9} style={{ padding: '56px 20px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: '14px' }}>
                  {search || filterLevel || filterStatus ? 'No students match your filters.' : 'No students yet. Click "Add Student" to get started.'}
                </TableCell>
              </TableRow>
            ) : filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: 'var(--red)', background: '#fef2f2', padding: '3px 8px', borderRadius: '6px' }}>
                    {s.roll_number || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <div onClick={() => openView(s)} title="View profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <Avatar url={s.avatar_url} name={s.full_name || s.email} size={34} bg={levelColor[s.jlpt_level || 'N5'] || 'var(--red)'} />
                    <span className="row-name" style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.full_name || '—'}</span>
                  </div>
                </TableCell>
                <TableCell style={{ color: 'var(--ink-soft)' }}>{s.email || '—'}</TableCell>
                <TableCell style={{ color: 'var(--ink-soft)' }}>{s.phone || '—'}</TableCell>
                <TableCell>
                  {s.jlpt_level ? <span className="badge" style={{ background: levelColor[s.jlpt_level] + '18', color: levelColor[s.jlpt_level] }}>{s.jlpt_level}</span> : '—'}
                </TableCell>
                <TableCell style={{ color: 'var(--ink-soft)' }}>{s.batch || '—'}</TableCell>
                <TableCell>
                  {s.status ? <span className="badge" style={{ background: (statusColor[s.status] || '#9ca3af') + '18', color: statusColor[s.status] || '#9ca3af' }}>{s.status}</span> : '—'}
                </TableCell>
                <TableCell style={{ color: '#a39e93', fontSize: '12px' }}>
                  {new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <ActionBtn onClick={() => openEdit(s)} color="#2d7dd2"><Pencil size={13} />Edit</ActionBtn>
                    <ActionBtn onClick={() => handleDelete(s.id)} color="#e84040"><Trash2 size={13} /></ActionBtn>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length > 0 && (
          <div style={{ padding: '11px 16px', borderTop: '1px solid var(--line-warm)', color: 'var(--ink-soft)', fontSize: '12px' }}>
            Showing {filtered.length} of {students.length} students
          </div>
        )}
      </div>

      {/* ADD STUDENT MODAL */}
      {showAdd && (
        <Modal title="Add New Student" onClose={() => { setShowAdd(false); setError('') }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '9px', marginBottom: '16px', fontSize: '13px' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              {error}
            </div>
          )}
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Full Name" required>
                <input className="input-field" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Tanaka Yuki" />
              </Field>
              <Field label="Phone">
                <input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
              </Field>
            </div>
            <Field label="Email Address" required>
              <input className="input-field" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="student@email.com" />
            </Field>
            <Field label="Password" required>
              <PasswordInput value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="Temporary password (min. 6 chars)" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <Field label="JLPT Level">
                <select style={selectStyle} value={form.jlpt_level} onChange={e => setForm(f => ({ ...f, jlpt_level: e.target.value }))}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
              </Field>
              <Field label="Batch">
                <select style={selectStyle} value={form.batch} onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}>{BATCHES.map(b => <option key={b}>{b}</option>)}</select>
              </Field>
              <Field label="Status">
                <select style={selectStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>{STATUS.map(s => <option key={s}>{s}</option>)}</select>
              </Field>
            </div>
            <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '4px', paddingTop: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>KYC & Enrollment Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Aadhaar Number">
                  <input className="input-field" value={form.aadhar_number} onChange={e => setForm(f => ({ ...f, aadhar_number: e.target.value }))} placeholder="XXXX XXXX XXXX" maxLength={14} />
                </Field>
                <Field label="Photo URL">
                  <input className="input-field" value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} placeholder="https://… (passport photo)" />
                </Field>
              </div>
              <Field label="Address">
                <textarea className="input-field" rows={2} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Door no., Street, City, State, PIN" style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '14px' }} />
              </Field>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '9px 13px', fontSize: '12px', color: '#92400e' }}>
                <span>🎫</span>
                <span>Roll number will be auto-assigned as <strong>MGL0301</strong>, <strong>MGL0302</strong>… on save.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <Btn style={{ flex: 1 }} onClick={() => { setShowAdd(false); setError('') }}>Cancel</Btn>
              <Btn variant="primary" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? <><span className="spinner" />Adding…</> : <><Plus size={15} />Add Student</>}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW STUDENT MODAL */}
      {viewStudent && (
        <Modal title="Student Profile" onClose={() => setViewStudent(null)}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ margin: '0 auto 12px', width: '68px' }}>
              <Avatar url={viewStudent.avatar_url} name={viewStudent.full_name || viewStudent.email} size={68} bg={levelColor[viewStudent.jlpt_level || 'N5'] || 'var(--red)'} fontSize={26} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 4px' }}>{viewStudent.full_name || 'Unknown'}</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>{viewStudent.email}</p>
          </div>

          {viewStudent.roll_number && (
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 800, color: 'var(--red)', background: '#fef2f2', padding: '5px 16px', borderRadius: '8px', letterSpacing: '0.08em' }}>
                {viewStudent.roll_number}
              </span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {[
              { label: 'Phone', value: viewStudent.phone || '—' },
              { label: 'JLPT Level', value: viewStudent.jlpt_level || '—' },
              { label: 'Batch', value: viewStudent.batch || '—' },
              { label: 'Status', value: viewStudent.status || '—' },
              { label: 'Joined', value: new Date(viewStudent.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
              { label: 'Aadhaar', value: viewStudent.aadhar_number ? '••••  ••••  ' + viewStudent.aadhar_number.slice(-4) : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#f9fafb', borderRadius: '9px', padding: '10px 13px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--navy)' }}>{value}</div>
              </div>
            ))}
          </div>

          {viewStudent.address && (
            <div style={{ background: '#f9fafb', borderRadius: '9px', padding: '10px 13px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</div>
              <div style={{ fontSize: '13px', color: 'var(--navy)', lineHeight: 1.5 }}>{viewStudent.address}</div>
            </div>
          )}

          {/* Fee Status */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fee Status</div>
            {invoicesLoading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px' }}>Loading…</div>
            ) : studentInvoices.length === 0 ? (
              <div style={{ background: '#f9fafb', borderRadius: '9px', padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No invoices yet</div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {(['Paid', 'Pending', 'Overdue'] as const).map(status => {
                    const total = studentInvoices.filter(i => i.status === status).reduce((s, i) => s + Number(i.amount), 0)
                    const count = studentInvoices.filter(i => i.status === status).length
                    if (count === 0) return null
                    return (
                      <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', background: INV_COLOR[status] + '12', border: `1px solid ${INV_COLOR[status]}25` }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: INV_COLOR[status] }}>{status}</span>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: INV_COLOR[status] }}>{fmt(total)}</span>
                        <span style={{ fontSize: '10px', color: INV_COLOR[status], opacity: 0.7 }}>({count})</span>
                      </div>
                    )
                  })}
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '9px', overflow: 'hidden' }}>
                  {studentInvoices.map((inv, i) => (
                    <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 13px', borderBottom: i < studentInvoices.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.description || 'Fee payment'}</div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Due {fmtDate(inv.due_date)}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--navy)' }}>{fmt(Number(inv.amount))}</div>
                        <span className="badge" style={{ fontSize: '10px', background: INV_COLOR[inv.status] + '18', color: INV_COLOR[inv.status] }}>{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <Btn variant="primary" style={{ width: '100%' }} onClick={() => openEdit(viewStudent)}>
            <Pencil size={15} /> Edit Student
          </Btn>
        </Modal>
      )}

      {/* EDIT STUDENT MODAL */}
      {editStudent && (
        <Modal title="Edit Student" onClose={() => setEditStudent(null)}>
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <Avatar url={editStudent.avatar_url} name={editStudent.full_name || editStudent.email} size={64} bg={levelColor[editStudent.jlpt_level || 'N5'] || 'var(--red)'} fontSize={26} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Full Name" required>
                <input className="input-field" value={editStudent.full_name || ''} onChange={e => setEditStudent(s => s ? { ...s, full_name: e.target.value } : s)} />
              </Field>
              <Field label="Phone">
                <input className="input-field" value={editStudent.phone || ''} onChange={e => setEditStudent(s => s ? { ...s, phone: e.target.value } : s)} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <Field label="JLPT Level">
                <select style={selectStyle} value={editStudent.jlpt_level || ''} onChange={e => setEditStudent(s => s ? { ...s, jlpt_level: e.target.value } : s)}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
              </Field>
              <Field label="Batch">
                <select style={selectStyle} value={editStudent.batch || ''} onChange={e => setEditStudent(s => s ? { ...s, batch: e.target.value } : s)}>{BATCHES.map(b => <option key={b}>{b}</option>)}</select>
              </Field>
              <Field label="Status">
                <select style={selectStyle} value={editStudent.status || ''} onChange={e => setEditStudent(s => s ? { ...s, status: e.target.value } : s)}>{STATUS.map(st => <option key={st}>{st}</option>)}</select>
              </Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Btn style={{ flex: 1 }} onClick={() => setEditStudent(null)}>Cancel</Btn>
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
