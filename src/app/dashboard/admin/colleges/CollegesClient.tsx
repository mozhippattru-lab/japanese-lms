'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Building2, Plus, Users, Wallet, FileText, MapPin, Phone, Mail, User,
  Link as LinkIcon, Check, Copy, Pencil, Trash2, X, Receipt, CalendarDays,
} from 'lucide-react'
import Modal from '@/components/Modal'
import ToastContainer, { useToast } from '@/components/Toast'
import StatCard, { StatGrid } from '@/components/StatCard'

type College = {
  id: string; name: string; category: string | null; city: string | null
  contact_person: string | null; contact_phone: string | null; contact_email: string | null
  payment_type: string | null; payment_amount: number | null; join_code: string | null
  status: string | null; notes: string | null; created_at: string
  student_count: number; batch_count: number; paid_total: number
}
type Batch = { id: string; name: string; jlpt_level: string; college_id: string | null; enrolled: number }
type Payment = {
  id: string; college_id: string | null; batch_id: string | null; amount: number
  period_month: string | null; payment_date: string | null; payment_method: string | null
  reference_number: string | null; status: string | null; notes: string | null; created_at: string
}

const CATEGORIES = ['Engineering', 'Arts & Science', 'Commerce', 'Medical', 'Polytechnic', 'Other']
const PAYMENT_TYPES = ['Monthly', 'Fixed', 'Per Session']
const METHODS = ['Bank Transfer', 'Cheque', 'UPI', 'Cash', 'Card']
const STATUS = ['Active', 'Inactive']

const catColor: Record<string, string> = {
  Engineering: '#2d7dd2', 'Arts & Science': '#8b5cf6', Commerce: '#f59e0b',
  Medical: '#e84040', Polytechnic: '#22c55e', Other: '#6b7280',
}
const fmt = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN')
const fmtDate = (d: string) => new Date(d + (d.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
const todayStr = () => new Date().toISOString().slice(0, 10)
const thisMonth = () => new Date().toISOString().slice(0, 7)
const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()

const emptyForm = {
  name: '', category: 'Engineering', city: '', contact_person: '', contact_phone: '',
  contact_email: '', payment_type: 'Monthly', payment_amount: '', status: 'Active', notes: '',
}
const emptyPay = { amount: '', period_month: thisMonth(), payment_date: todayStr(), payment_method: 'Bank Transfer', reference_number: '', notes: '', batch_id: '' }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '9px',
  fontSize: '14px', color: 'var(--navy)', background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}{required && <span style={{ color: 'var(--red)', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export default function CollegesClient({ initialColleges, batches, initialPayments }: {
  initialColleges: College[]; batches: Batch[]; initialPayments: Payment[]
}) {
  const { toasts, toast, remove } = useToast()
  const [colleges, setColleges] = useState<College[]>(initialColleges)
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [filterCat, setFilterCat] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editCollege, setEditCollege] = useState<College | null>(null)
  const [payCollege, setPayCollege] = useState<College | null>(null)
  const [viewCollege, setViewCollege] = useState<College | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [pf, setPf] = useState(emptyPay)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const totalStudents = colleges.reduce((s, c) => s + c.student_count, 0)
  const totalRevenue = colleges.reduce((s, c) => s + c.paid_total, 0)
  const activeCount = colleges.filter(c => c.status === 'Active').length

  const filtered = useMemo(
    () => filterCat ? colleges.filter(c => c.category === filterCat) : colleges,
    [colleges, filterCat]
  )
  const usedCategories = useMemo(() => CATEGORIES.filter(cat => colleges.some(c => c.category === cat)), [colleges])

  function joinLink(c: College) { return `${origin}/register?college=${c.join_code || ''}` }
  function copyLink(c: College) {
    navigator.clipboard?.writeText(joinLink(c))
    setCopied(c.id)
    toast('Join link copied', 'success')
    setTimeout(() => setCopied(null), 1500)
  }

  async function addCollege(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const payload = {
      name: form.name, category: form.category, city: form.city || null,
      contact_person: form.contact_person || null, contact_phone: form.contact_phone || null,
      contact_email: form.contact_email || null, payment_type: form.payment_type,
      payment_amount: form.payment_amount ? Number(form.payment_amount) : 0,
      join_code: genCode(), status: form.status, notes: form.notes || null,
    }
    const { data, error } = await supabase.from('colleges').insert(payload).select().single()
    if (error) { toast(error.message, 'error'); setLoading(false); return }
    setColleges(prev => [{ ...data, student_count: 0, batch_count: 0, paid_total: 0 }, ...prev])
    setShowAdd(false); setForm(emptyForm); setLoading(false)
    toast('College added', 'success')
  }

  async function updateCollege(e: React.FormEvent) {
    e.preventDefault()
    if (!editCollege) return
    setLoading(true)
    const supabase = createClient()
    const updates = {
      name: editCollege.name, category: editCollege.category, city: editCollege.city,
      contact_person: editCollege.contact_person, contact_phone: editCollege.contact_phone,
      contact_email: editCollege.contact_email, payment_type: editCollege.payment_type,
      payment_amount: Number(editCollege.payment_amount || 0), status: editCollege.status, notes: editCollege.notes,
    }
    await supabase.from('colleges').update(updates).eq('id', editCollege.id)
    setColleges(prev => prev.map(c => c.id === editCollege.id ? { ...c, ...updates } : c))
    setEditCollege(null); setLoading(false)
    toast('College updated', 'success')
  }

  async function deleteCollege(c: College) {
    if (!confirm(`Delete "${c.name}"? Student links and college batches will be unlinked.`)) return
    const supabase = createClient()
    await supabase.from('colleges').delete().eq('id', c.id)
    setColleges(prev => prev.filter(x => x.id !== c.id))
    toast('College deleted', 'info')
  }

  async function logPayment(e: React.FormEvent) {
    e.preventDefault()
    if (!payCollege) return
    setLoading(true)
    const supabase = createClient()
    const payload = {
      college_id: payCollege.id, batch_id: pf.batch_id || null, amount: Number(pf.amount),
      period_month: pf.period_month || null, payment_date: pf.payment_date,
      payment_method: pf.payment_method, reference_number: pf.reference_number || null,
      status: 'Paid', notes: pf.notes || null,
    }
    const { data, error } = await supabase.from('college_payments').insert(payload).select().single()
    if (error) { toast(error.message, 'error'); setLoading(false); return }
    setPayments(prev => [data, ...prev])
    setColleges(prev => prev.map(c => c.id === payCollege.id ? { ...c, paid_total: c.paid_total + Number(pf.amount) } : c))
    setPayCollege(null); setPf(emptyPay); setLoading(false)
    toast('Payment recorded', 'success')
  }

  const collegeBatches = (id: string) => batches.filter(b => b.college_id === id)
  const collegePayments = (id: string) => payments.filter(p => p.college_id === id)

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <p style={{ fontFamily: 'var(--display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.04em', margin: '0 0 6px' }}>大学 · Colleges</p>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Colleges</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '6px' }}>Institutional partners — batches paid by contract, not per student</p>
        </div>
        <button onClick={() => { setShowAdd(true); setForm(emptyForm) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(232,64,64,0.2)' }}>
          <Plus size={16} /> Add College
        </button>
      </div>

      {/* KPI cards */}
      <StatGrid>
        {[
          { label: 'Total Colleges', value: String(colleges.length), sub: `${activeCount} active`, icon: <Building2 size={18} />, color: '#2d7dd2' },
          { label: 'College Students', value: String(totalStudents), icon: <Users size={18} />, color: '#8b5cf6' },
          { label: 'Contract Revenue', value: fmt(totalRevenue), icon: <Wallet size={18} />, color: '#22c55e' },
          { label: 'College Batches', value: String(batches.length), icon: <FileText size={18} />, color: '#e84040' },
        ].map(({ label, value, sub, icon, color }) => (
          <StatCard key={label} label={label} value={value} sub={sub} icon={icon} color={color} />
        ))}
      </StatGrid>

      {/* Category filter */}
      {usedCategories.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <button onClick={() => setFilterCat('')} style={chip(filterCat === '', '#1a1f3c')}>All ({colleges.length})</button>
          {usedCategories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(filterCat === cat ? '' : cat)} style={chip(filterCat === cat, catColor[cat] || '#6b7280')}>
              {cat} ({colleges.filter(c => c.category === cat).length})
            </button>
          ))}
        </div>
      )}

      {/* College cards */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--line-warm)', padding: '56px', textAlign: 'center', color: '#9ca3af' }}>
          <Building2 size={36} style={{ margin: '0 auto 16px', display: 'block', color: '#d1d5db' }} strokeWidth={1.5} />
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#6e6e73' }}>No colleges yet</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Add a college, then share its join link so students can register themselves.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '16px' }}>
          {filtered.map(c => {
            const cc = catColor[c.category || 'Other'] || '#6b7280'
            return (
              <div key={c.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid var(--line-warm)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '4px', background: cc }} />
                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f', margin: 0, letterSpacing: '-0.01em' }}>{c.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 9px', borderRadius: '20px', background: cc + '18', color: cc }}>{c.category || 'Other'}</span>
                        {c.city && <span style={{ fontSize: '11px', color: '#9ca3af', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} />{c.city}</span>}
                        <span style={{ fontSize: '10px', fontWeight: 700, color: c.status === 'Active' ? '#22c55e' : '#9ca3af' }}>{c.status === 'Active' ? '● Active' : '○ Inactive'}</span>
                      </div>
                    </div>
                  </div>

                  {/* contact */}
                  {(c.contact_person || c.contact_phone) && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', lineHeight: 1.7 }}>
                      {c.contact_person && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={12} color="#9ca3af" />{c.contact_person}</div>}
                      {c.contact_phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} color="#9ca3af" />{c.contact_phone}</div>}
                    </div>
                  )}

                  {/* stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { label: 'Students', value: String(c.student_count) },
                      { label: 'Batches', value: String(c.batch_count) },
                      { label: 'Paid', value: fmt(c.paid_total) },
                    ].map(s => (
                      <div key={s.label} style={{ background: '#f9fafb', borderRadius: '8px', padding: '8px 10px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1d1d1f', marginTop: '2px' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* payment terms */}
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                    Contract: <strong style={{ color: '#1a1f3c' }}>{fmt(Number(c.payment_amount || 0))}</strong> · {c.payment_type || 'Monthly'}
                  </div>

                  {/* join link */}
                  <button onClick={() => copyLink(c)} style={{ display: 'flex', alignItems: 'center', gap: '7px', width: '100%', padding: '8px 11px', background: '#f8f7f4', border: '1px dashed #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', color: '#6b7280', fontFamily: 'inherit', marginBottom: '12px', textAlign: 'left' }}>
                    {copied === c.id ? <Check size={13} color="#22c55e" /> : <LinkIcon size={13} />}
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{joinLink(c)}</span>
                    {copied === c.id ? <span style={{ color: '#22c55e', fontWeight: 700 }}>Copied</span> : <Copy size={12} />}
                  </button>

                  {/* actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button onClick={() => setPayCollege(c)} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '8px', background: '#f0fdf4', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#16a34a', fontWeight: 700, fontFamily: 'inherit' }}><Wallet size={13} /> Log Payment</button>
                    <button onClick={() => setViewCollege(c)} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 11px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#374151', fontWeight: 600, fontFamily: 'inherit' }}><Receipt size={13} /></button>
                    <button onClick={() => setEditCollege({ ...c })} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 11px', background: '#eff6ff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#2d7dd2', fontFamily: 'inherit' }}><Pencil size={13} /></button>
                    <button onClick={() => deleteCollege(c)} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 11px', background: '#fef2f2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#e84040', fontFamily: 'inherit' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(showAdd || editCollege) && (
        <Modal title={editCollege ? 'Edit College' : 'Add College'} onClose={() => { setShowAdd(false); setEditCollege(null) }} wide>
          <form onSubmit={editCollege ? updateCollege : addCollege}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <Field label="College Name" required>
                <input style={inputStyle} required value={editCollege ? editCollege.name : form.name} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, name: e.target.value } : c) : setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. PSG College of Technology" />
              </Field>
              <Field label="Category">
                <select style={selectStyle} value={editCollege ? (editCollege.category || '') : form.category} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, category: e.target.value } : c) : setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="City"><input style={inputStyle} value={editCollege ? (editCollege.city || '') : form.city} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, city: e.target.value } : c) : setForm(f => ({ ...f, city: e.target.value }))} placeholder="Coimbatore" /></Field>
              <Field label="Contact Person"><input style={inputStyle} value={editCollege ? (editCollege.contact_person || '') : form.contact_person} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, contact_person: e.target.value } : c) : setForm(f => ({ ...f, contact_person: e.target.value }))} placeholder="HOD / Coordinator" /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Contact Phone"><input style={inputStyle} value={editCollege ? (editCollege.contact_phone || '') : form.contact_phone} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, contact_phone: e.target.value } : c) : setForm(f => ({ ...f, contact_phone: e.target.value }))} placeholder="+91 …" /></Field>
              <Field label="Contact Email"><input style={inputStyle} type="email" value={editCollege ? (editCollege.contact_email || '') : form.contact_email} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, contact_email: e.target.value } : c) : setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="office@college.edu" /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <Field label="Payment Type">
                <select style={selectStyle} value={editCollege ? (editCollege.payment_type || 'Monthly') : form.payment_type} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, payment_type: e.target.value } : c) : setForm(f => ({ ...f, payment_type: e.target.value }))}>
                  {PAYMENT_TYPES.map(p => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Contract Amount (₹)"><input style={inputStyle} type="number" min={0} value={editCollege ? String(editCollege.payment_amount ?? '') : form.payment_amount} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, payment_amount: Number(e.target.value) } : c) : setForm(f => ({ ...f, payment_amount: e.target.value }))} placeholder="e.g. 40000" /></Field>
              <Field label="Status">
                <select style={selectStyle} value={editCollege ? (editCollege.status || 'Active') : form.status} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, status: e.target.value } : c) : setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Notes"><input style={inputStyle} value={editCollege ? (editCollege.notes || '') : form.notes} onChange={e => editCollege ? setEditCollege(c => c ? { ...c, notes: e.target.value } : c) : setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any contract details…" /></Field>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button type="button" onClick={() => { setShowAdd(false); setEditCollege(null) }} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: 'var(--red)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#fff' }}>{loading ? 'Saving…' : editCollege ? 'Save Changes' : 'Add College'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* LOG PAYMENT MODAL */}
      {payCollege && (
        <Modal title={`Log Payment — ${payCollege.name}`} onClose={() => { setPayCollege(null); setPf(emptyPay) }}>
          <form onSubmit={logPayment}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Amount (₹)" required><input style={inputStyle} type="number" min={1} required value={pf.amount} onChange={e => setPf(f => ({ ...f, amount: e.target.value }))} placeholder={String(payCollege.payment_amount || '')} /></Field>
              <Field label="For Month"><input style={inputStyle} type="month" value={pf.period_month} onChange={e => setPf(f => ({ ...f, period_month: e.target.value }))} /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Payment Date" required><input style={inputStyle} type="date" required value={pf.payment_date} onChange={e => setPf(f => ({ ...f, payment_date: e.target.value }))} /></Field>
              <Field label="Method">
                <select style={selectStyle} value={pf.payment_method} onChange={e => setPf(f => ({ ...f, payment_method: e.target.value }))}>{METHODS.map(m => <option key={m}>{m}</option>)}</select>
              </Field>
            </div>
            {collegeBatches(payCollege.id).length > 0 && (
              <Field label="Batch (optional)">
                <select style={selectStyle} value={pf.batch_id} onChange={e => setPf(f => ({ ...f, batch_id: e.target.value }))}>
                  <option value="">— All / general —</option>
                  {collegeBatches(payCollege.id).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
            )}
            <Field label="Reference No."><input style={inputStyle} value={pf.reference_number} onChange={e => setPf(f => ({ ...f, reference_number: e.target.value }))} placeholder="Txn / Cheque no." /></Field>
            <Field label="Notes"><input style={inputStyle} value={pf.notes} onChange={e => setPf(f => ({ ...f, notes: e.target.value }))} /></Field>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button type="button" onClick={() => { setPayCollege(null); setPf(emptyPay) }} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', background: '#22c55e', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#fff', fontFamily: 'inherit' }}>{loading ? 'Saving…' : <><Check size={15} /> Record Payment</>}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW PAYMENTS MODAL */}
      {viewCollege && (
        <Modal title={`${viewCollege.name} — Payment History`} onClose={() => setViewCollege(null)} wide>
          {collegePayments(viewCollege.id).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#9ca3af', fontSize: '13px' }}>No payments recorded yet.</div>
          ) : (
            <div style={{ background: '#f9fafb', borderRadius: '10px', overflow: 'hidden' }}>
              {collegePayments(viewCollege.id).map((p, i, arr) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f2' : 'none' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CalendarDays size={15} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1f3c' }}>{fmt(Number(p.amount))} <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>· {p.payment_method}</span></div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{p.period_month ? `For ${p.period_month}` : ''}{p.payment_date ? ` · Paid ${fmtDate(p.payment_date)}` : ''}{p.reference_number ? ` · ${p.reference_number}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  )
}

function chip(active: boolean, color: string): React.CSSProperties {
  return {
    padding: '7px 14px', borderRadius: '99px', border: `1.5px solid ${active ? color : '#e5e7eb'}`,
    background: active ? color : '#fff', color: active ? '#fff' : '#6b7280',
    fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
  }
}
