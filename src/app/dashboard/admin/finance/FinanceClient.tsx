'use client'
import { useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  CheckCircle2, Clock, AlertTriangle, Receipt, Plus, Check,
  LayoutDashboard, DollarSign, Banknote, Smartphone, Landmark,
  CreditCard, FileText, TriangleAlert, Building2, Wallet,
} from 'lucide-react'

import DataToolbar from '@/components/DataToolbar'
import StatCard, { StatGrid } from '@/components/StatCard'
import { printReceipt, printBankStatement, type StatementRow } from '@/lib/receipt'

type Tab = 'overview' | 'invoices' | 'fees' | 'colleges' | 'report'

type Invoice = {
  id: string; student_id: string; batch_id: string | null; fee_structure_id: string | null
  amount: number; due_date: string; status: string; description: string | null; created_at: string
}
type FeeStructure = {
  id: string; name: string; jlpt_level: string | null; amount: number
  frequency: string; description: string | null; is_active: boolean; created_at: string
}
type Student = {
  id: string; full_name: string | null; email: string | null
  jlpt_level: string | null; phone: string | null; batch: string | null; status: string | null
  batch_id: string | null; batch_name: string | null; batch_level: string | null
}
type Batch = { id: string; name: string; jlpt_level: string }
type College = { id: string; name: string; category: string | null; payment_type: string | null; payment_amount: number | null; status: string | null }
type CollegePayment = {
  id: string; college_id: string | null; amount: number; period_month: string | null
  payment_date: string | null; payment_method: string | null; reference_number: string | null
}
type Payment = {
  id: string; invoice_id: string | null; student_id: string; amount: number
  payment_method: string | null; payment_date: string | null; reference_number: string | null; notes: string | null
}

const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque']
const PM_ICONS: Record<string, ReactNode> = {
  Cash: <Banknote size={14} />, UPI: <Smartphone size={14} />,
  'Bank Transfer': <Landmark size={14} />, Card: <CreditCard size={14} />,
  Cheque: <FileText size={14} />,
}
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
const FREQUENCIES = ['Monthly', 'Quarterly', 'One-time']
const STATUS_COLOR: Record<string, string> = { Pending: '#f59e0b', Paid: '#22c55e', Overdue: '#e84040', Cancelled: '#9ca3af' }
const LEVEL_COLOR: Record<string, string> = { N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6' }

const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN')
const fmtDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
const todayStr = () => new Date().toISOString().slice(0, 10)

const inputStyle = {
  width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px',
  fontSize: '14px', outline: 'none', background: '#f9fafb', color: '#1a1f3c',
  fontWeight: 500, boxSizing: 'border-box' as const,
} as const

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: wide ? '620px' : '500px', maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1f3c' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#9ca3af' }}>×</button>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  )
}

function TabBar({ tab, setTab }: { tab: string; setTab: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string; icon: ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={14} /> },
    { key: 'invoices', label: 'Invoices', icon: <Receipt size={14} /> },
    { key: 'fees', label: 'Fee Structures', icon: <DollarSign size={14} /> },
    { key: 'colleges', label: 'College Billing', icon: <Building2 size={14} /> },
    { key: 'report', label: 'Report', icon: <Landmark size={14} /> },
  ]
  return (
    <div style={{ display: 'flex', gap: '4px', background: '#f0f0f2', borderRadius: '10px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => setTab(t.key)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          padding: '8px 16px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          background: tab === t.key ? '#fff' : 'transparent',
          color: tab === t.key ? '#1d1d1f' : '#9ca3af',
          boxShadow: tab === t.key ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.15s', fontFamily: 'inherit',
        }}>{t.icon} {t.label}</button>
      ))}
    </div>
  )
}

const emptyCF = { studentId: '', batchId: '', feeId: '', amount: '', dueDate: '', description: '' }
const emptyFF = { name: '', jlpt_level: '', amount: '', frequency: 'Monthly', description: '' }
const emptyPF = { amount: '', method: 'Cash', date: todayStr(), reference: '', notes: '' }

export default function FinanceClient({ initialInvoices, initialFees, students, batches, colleges, collegePayments, payments }: {
  initialInvoices: Invoice[]
  initialFees: FeeStructure[]
  students: Student[]
  batches: Batch[]
  colleges: College[]
  collegePayments: CollegePayment[]
  payments: Payment[]
}) {
  const [tab, setTab] = useState<Tab>('overview')
  const monthStart = new Date(); monthStart.setDate(1)
  const [repFrom, setRepFrom] = useState(monthStart.toISOString().slice(0, 10))
  const [repTo, setRepTo] = useState(todayStr())
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [fees, setFees] = useState<FeeStructure[]>(initialFees)
  const [loading, setLoading] = useState(false)

  // Invoice state
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [cf, setCf] = useState(emptyCF)
  const [payingInv, setPayingInv] = useState<Invoice | null>(null)
  const [pf, setPf] = useState(emptyPF)

  // Fee state
  const [showAddFee, setShowAddFee] = useState(false)
  const [editFee, setEditFee] = useState<FeeStructure | null>(null)
  const [ff, setFf] = useState(emptyFF)

  // Lookups
  const studentMap = Object.fromEntries(students.map(s => [s.id, s]))
  const invoiceMap = Object.fromEntries(initialInvoices.map(i => [i.id, i]))

  const paymentByInvoice: Record<string, Payment> = {}
  for (const p of payments) if (p.invoice_id) paymentByInvoice[p.invoice_id] = p

  // Print a receipt for a paid invoice (uses the real payment if recorded)
  function openInvoiceReceipt(inv: Invoice) {
    const p = paymentByInvoice[inv.id]
    if (p) { openReceipt(p); return }
    const st = studentMap[inv.student_id]
    printReceipt({
      receiptNo: inv.id.slice(0, 8).toUpperCase(), date: fmtDate(todayStr()),
      studentName: st?.full_name || st?.email || 'Student', level: st?.jlpt_level || null,
      batch: st?.batch_name || st?.batch || null, description: inv.description || 'Fee payment',
      amount: Number(inv.amount), method: 'Cash', reference: null,
    })
  }

  // Print a cheque-style fee receipt for a student payment
  function openReceipt(p: Payment) {
    const st = studentMap[p.student_id]
    const inv = p.invoice_id ? invoiceMap[p.invoice_id] : null
    printReceipt({
      receiptNo: p.id.slice(0, 8).toUpperCase(),
      date: p.payment_date ? fmtDate(p.payment_date) : fmtDate(todayStr()),
      studentName: st?.full_name || st?.email || 'Student',
      level: st?.jlpt_level || null,
      batch: st?.batch_name || st?.batch || null,
      description: inv?.description || 'Fee payment',
      amount: Number(p.amount),
      method: p.payment_method || 'Cash',
      reference: p.reference_number || null,
    })
  }

  // Stats
  const studentCollected = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + Number(i.amount), 0)
  const collegeCollected = collegePayments.reduce((s, p) => s + Number(p.amount || 0), 0)
  const totalCollected = studentCollected + collegeCollected
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + Number(i.amount), 0)
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + Number(i.amount), 0)
  const collegeMap = Object.fromEntries(colleges.map(c => [c.id, c]))

  // Filtered invoices
  const filtered = invoices.filter(inv => {
    const st = studentMap[inv.student_id]
    const name = (st?.full_name || st?.email || '').toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || (inv.description || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  function onFeeSelect(feeId: string) {
    const fee = fees.find(f => f.id === feeId)
    setCf(c => ({ ...c, feeId, amount: fee ? String(fee.amount) : c.amount }))
  }

  // Auto-fill batch, fee & amount from the selected student's profile + enrollment
  function onStudentSelect(studentId: string) {
    const s = studentMap[studentId]
    if (!s) { setCf(c => ({ ...c, studentId })); return }
    const level = s.jlpt_level
    // batch: prefer the student's enrolled batch, else a batch matching their level
    const batchId = (s.batch_id && batches.some(b => b.id === s.batch_id))
      ? s.batch_id
      : (batches.find(b => b.jlpt_level === level)?.id ?? '')
    // fee: first active template matching the student's level
    const fee = fees.find(f => f.is_active && f.jlpt_level === level)
    setCf(c => ({
      ...c,
      studentId,
      batchId,
      feeId: fee?.id ?? '',
      amount: fee ? String(fee.amount) : c.amount,
      description: c.description || (level ? `${level} tuition fee` : c.description),
    }))
  }

  const selectedStudent = cf.studentId ? studentMap[cf.studentId] : null

  // ── Invoice CRUD ─────────────────────────────────────────────────
  async function createInvoice(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('invoices').insert({
      student_id: cf.studentId,
      batch_id: cf.batchId || null,
      fee_structure_id: cf.feeId || null,
      amount: Number(cf.amount),
      due_date: cf.dueDate,
      status: 'Pending',
      description: cf.description || null,
    }).select().single()
    if (data) setInvoices(prev => [data, ...prev])
    setShowCreate(false)
    setCf(emptyCF)
    setLoading(false)
  }

  async function recordPayment(e: React.FormEvent) {
    e.preventDefault()
    if (!payingInv) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('payments').insert({
      invoice_id: payingInv.id,
      student_id: payingInv.student_id,
      amount: Number(pf.amount),
      payment_method: pf.method,
      payment_date: pf.date,
      reference_number: pf.reference || null,
      notes: pf.notes || null,
    })
    await supabase.from('invoices').update({ status: 'Paid' }).eq('id', payingInv.id)
    setInvoices(prev => prev.map(i => i.id === payingInv.id ? { ...i, status: 'Paid' } : i))
    setPayingInv(null)
    setPf(emptyPF)
    setLoading(false)
  }

  async function cancelInvoice(id: string) {
    if (!confirm('Cancel this invoice?')) return
    const supabase = createClient()
    await supabase.from('invoices').update({ status: 'Cancelled' }).eq('id', id)
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'Cancelled' } : i))
  }

  async function markOverdue(id: string) {
    const supabase = createClient()
    await supabase.from('invoices').update({ status: 'Overdue' }).eq('id', id)
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'Overdue' } : i))
  }

  // ── Fee CRUD ─────────────────────────────────────────────────────
  async function addFee(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('fee_structures').insert({
      name: ff.name,
      jlpt_level: ff.jlpt_level || null,
      amount: Number(ff.amount),
      frequency: ff.frequency,
      description: ff.description || null,
      is_active: true,
    }).select().single()
    if (data) setFees(prev => [data, ...prev])
    setShowAddFee(false)
    setFf(emptyFF)
    setLoading(false)
  }

  async function updateFee(e: React.FormEvent) {
    e.preventDefault()
    if (!editFee) return
    setLoading(true)
    const supabase = createClient()
    const updates = { name: editFee.name, jlpt_level: editFee.jlpt_level, amount: editFee.amount, frequency: editFee.frequency, description: editFee.description }
    await supabase.from('fee_structures').update(updates).eq('id', editFee.id)
    setFees(prev => prev.map(f => f.id === editFee.id ? { ...f, ...updates } : f))
    setEditFee(null)
    setLoading(false)
  }

  async function deleteFee(id: string) {
    if (!confirm('Delete this fee structure?')) return
    const supabase = createClient()
    await supabase.from('fee_structures').delete().eq('id', id)
    setFees(prev => prev.filter(f => f.id !== id))
  }

  async function toggleFeeActive(fee: FeeStructure) {
    const supabase = createClient()
    await supabase.from('fee_structures').update({ is_active: !fee.is_active }).eq('id', fee.id)
    setFees(prev => prev.map(f => f.id === fee.id ? { ...f, is_active: !f.is_active } : f))
  }

  const pageHeader = (
    <div style={{ marginBottom: '24px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Finance</h1>
      <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Manage fees, invoices, and payments</p>
    </div>
  )

  // ══════════════════════════════════════════════════════════════════
  // OVERVIEW TAB
  // ══════════════════════════════════════════════════════════════════
  if (tab === 'overview') {
    const recent = invoices.slice(0, 8)
    return (
      <>
        {pageHeader}
        <TabBar tab={tab} setTab={setTab} />

        <StatGrid>
          {[
            { label: 'Total Collected', value: fmt(totalCollected), icon: <CheckCircle2 size={18} />, color: '#22c55e' },
            { label: 'Pending', value: fmt(totalPending), icon: <Clock size={18} />, color: '#f59e0b' },
            { label: 'Overdue', value: fmt(totalOverdue), icon: <AlertTriangle size={18} />, color: '#e84040' },
            { label: 'Total Invoices', value: String(invoices.length), icon: <Receipt size={18} />, color: '#2d7dd2' },
          ].map(({ label, value, icon, color }) => (
            <StatCard key={label} label={label} value={value} icon={icon} color={color} />
          ))}
        </StatGrid>

        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ececef' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}>Recent Invoices</h2>
            <button onClick={() => setTab('invoices')} style={{ fontSize: '13px', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500', fontFamily: 'inherit' }}>View all →</button>
          </div>
          {recent.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No invoices yet — create one from the Invoices tab</div>
          ) : recent.map((inv, i) => {
            const st = studentMap[inv.student_id]
            return (
              <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', borderBottom: i < recent.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                <div style={{ width: '36px', height: '36px', background: '#1a1f3c15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#1a1f3c', flexShrink: 0 }}>
                  {(st?.full_name || st?.email || '?').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1d1d1f' }}>{st?.full_name || st?.email || 'Unknown'}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{inv.description || 'Fee payment'} · Due {fmtDate(inv.due_date)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>{fmt(Number(inv.amount))}</div>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: STATUS_COLOR[inv.status] + '18', color: STATUS_COLOR[inv.status] }}>{inv.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // REPORT TAB — bank-statement-style ledger by date range
  // ══════════════════════════════════════════════════════════════════
  if (tab === 'report') {
    type Txn = { date: string; ref: string; desc: string; party: string; method: string; credit: number; payment?: Payment }
    const all: Txn[] = []
    for (const p of payments) {
      if (!p.payment_date) continue
      const st = studentMap[p.student_id]
      const inv = p.invoice_id ? invoiceMap[p.invoice_id] : null
      all.push({ date: p.payment_date, ref: p.reference_number || '', desc: inv?.description || 'Student fee', party: st?.full_name || st?.email || 'Student', method: p.payment_method || 'Cash', credit: Number(p.amount), payment: p })
    }
    for (const cp of collegePayments) {
      if (!cp.payment_date) continue
      const c = cp.college_id ? collegeMap[cp.college_id] : null
      all.push({ date: cp.payment_date, ref: cp.reference_number || '', desc: 'College contract' + (cp.period_month ? ` · ${cp.period_month}` : ''), party: c?.name || 'College', method: cp.payment_method || '—', credit: Number(cp.amount) })
    }
    all.sort((a, b) => a.date.localeCompare(b.date))

    const opening = all.filter(t => t.date < repFrom).reduce((s, t) => s + t.credit, 0)
    const inRange = all.filter(t => t.date >= repFrom && t.date <= repTo)
    let running = opening
    const ledger = inRange.map(t => { running += t.credit; return { ...t, balance: running } })
    const totalCredit = inRange.reduce((s, t) => s + t.credit, 0)
    const closing = opening + totalCredit

    const stmtRows: StatementRow[] = ledger.map(t => ({ date: fmtDate(t.date), ref: t.ref, desc: t.desc, party: t.party, method: t.method, credit: t.credit, balance: t.balance }))

    const presets: { label: string; from: () => string; to: () => string }[] = [
      { label: 'This month', from: () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10) }, to: () => todayStr() },
      { label: 'Last month', from: () => { const d = new Date(); d.setMonth(d.getMonth() - 1, 1); return d.toISOString().slice(0, 10) }, to: () => { const d = new Date(); d.setDate(0); return d.toISOString().slice(0, 10) } },
      { label: 'This year', from: () => { const d = new Date(); return new Date(d.getFullYear(), 0, 1).toISOString().slice(0, 10) }, to: () => todayStr() },
    ]

    return (
      <>
        {pageHeader}
        <TabBar tab={tab} setTab={setTab} />

        {/* Date range controls */}
        <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '5px' }}>From</label>
            <input type="date" value={repFrom} max={repTo} onChange={e => setRepFrom(e.target.value)} style={{ ...inputStyle, width: 'auto', background: '#fff' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '5px' }}>To</label>
            <input type="date" value={repTo} min={repFrom} max={todayStr()} onChange={e => setRepTo(e.target.value)} style={{ ...inputStyle, width: 'auto', background: '#fff' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {presets.map(p => {
              const on = repFrom === p.from() && repTo === p.to()
              return (
                <button key={p.label} onClick={() => { setRepFrom(p.from()); setRepTo(p.to()) }} style={{
                  padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${on ? 'var(--navy)' : '#e5e7eb'}`,
                  background: on ? 'var(--navy)' : '#f9fafb',
                  color: on ? '#fff' : '#374151',
                }}>{p.label}</button>
              )
            })}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <DataToolbar
              title="Account Statement"
              subtitle={`${fmtDate(repFrom)} to ${fmtDate(repTo)}`}
              columns={[{ key: 'date', label: 'Date' }, { key: 'ref', label: 'Reference' }, { key: 'desc', label: 'Description' }, { key: 'party', label: 'Party' }, { key: 'method', label: 'Mode' }, { key: 'credit', label: 'Credit' }, { key: 'balance', label: 'Balance' }]}
              rows={ledger.map(t => ({ date: fmtDate(t.date), ref: t.ref || '—', desc: t.desc, party: t.party, method: t.method, credit: fmt(t.credit), balance: fmt(t.balance) }))}
            />
            <button onClick={() => printBankStatement({ from: fmtDate(repFrom), to: fmtDate(repTo), rows: stmtRows, opening, closing, totalCredit, count: inRange.length })}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Landmark size={15} /> Print Statement
            </button>
          </div>
        </div>

        <StatGrid>
          {[
            { label: 'Opening Balance', value: fmt(opening), icon: <Wallet size={18} />, color: '#9ca3af' },
            { label: 'Credited (period)', value: fmt(totalCredit), icon: <CheckCircle2 size={18} />, color: '#22c55e' },
            { label: 'Transactions', value: String(inRange.length), icon: <Receipt size={18} />, color: '#2d7dd2' },
            { label: 'Closing Balance', value: fmt(closing), icon: <Landmark size={18} />, color: '#1a1f3c' },
          ].map(({ label, value, icon, color }) => <StatCard key={label} label={label} value={value} icon={icon} color={color} />)}
        </StatGrid>

        {/* Ledger */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                {['Date', 'Reference', 'Description', 'Mode', 'Credit', 'Balance', ''].map((h, i) => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: i >= 4 && i < 6 ? 'right' : 'left', color: '#9ca3af', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledger.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No transactions in this period.</td></tr>
              ) : ledger.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap', color: '#6b7280' }}>{fmtDate(t.date)}</td>
                  <td style={{ padding: '11px 14px', color: '#9ca3af', fontSize: '12px' }}>{t.ref || '—'}</td>
                  <td style={{ padding: '11px 14px' }}><div style={{ fontWeight: 600, color: '#1d1d1f' }}>{t.desc}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{t.party}</div></td>
                  <td style={{ padding: '11px 14px', color: '#6b7280' }}>{t.method}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 700, color: '#16a34a', whiteSpace: 'nowrap' }}>{fmt(t.credit)}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 600, color: '#1d1d1f', whiteSpace: 'nowrap' }}>{fmt(t.balance)}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                    {t.payment && <button onClick={() => openReceipt(t.payment!)} style={{ padding: '5px 10px', background: '#eff6ff', color: '#2d7dd2', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Receipt</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // INVOICES TAB
  // ══════════════════════════════════════════════════════════════════
  if (tab === 'invoices') {
    return (
      <>
        {pageHeader}
        <TabBar tab={tab} setTab={setTab} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student…" style={{ ...inputStyle, maxWidth: '220px', padding: '9px 14px' }} />
            <div style={{ display: 'flex', gap: '3px', background: '#f3f4f6', borderRadius: '8px', padding: '3px' }}>
              {['All', 'Pending', 'Paid', 'Overdue', 'Cancelled'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding: '5px 11px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  background: statusFilter === s ? '#fff' : 'transparent',
                  color: statusFilter === s ? (STATUS_COLOR[s] || '#1a1f3c') : '#9ca3af',
                  boxShadow: statusFilter === s ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DataToolbar
              title="Invoices"
              subtitle={[statusFilter !== 'All' && statusFilter, search && `Search "${search}"`].filter(Boolean).join(' · ') || undefined}
              columns={[
                { key: 'student', label: 'Student' }, { key: 'email', label: 'Email' }, { key: 'level', label: 'Level' },
                { key: 'batch', label: 'Batch' }, { key: 'description', label: 'Description' },
                { key: 'amount', label: 'Amount' }, { key: 'due', label: 'Due Date' }, { key: 'status', label: 'Status' },
              ]}
              rows={filtered.map(inv => {
                const st = studentMap[inv.student_id]
                return {
                  student: st?.full_name || 'Unknown', email: st?.email || '', level: st?.jlpt_level || '',
                  batch: st?.batch_name || st?.batch || '', description: inv.description || '',
                  amount: fmt(Number(inv.amount)), due: fmtDate(inv.due_date), status: inv.status,
                }
              })}
            />
            <button onClick={() => { setShowCreate(true); setCf(emptyCF) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={15} /> Create Invoice
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ececef' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 100px 110px 90px 130px', gap: '10px', padding: '12px 20px', background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
            {['Student', 'Description', 'Amount', 'Due Date', 'Status', 'Action'].map(h => (
              <div key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No invoices found</div>
          ) : filtered.map((inv, i) => {
            const st = studentMap[inv.student_id]
            const canPay = inv.status === 'Pending' || inv.status === 'Overdue'
            return (
              <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 100px 110px 90px 130px', gap: '10px', padding: '13px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #f9fafb' : 'none', alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st?.full_name || 'Unknown'}</span>
                    {st?.jlpt_level && (
                      <span style={{ fontSize: '9px', fontWeight: 700, padding: '1px 7px', borderRadius: '20px', flexShrink: 0, background: (LEVEL_COLOR[st.jlpt_level] || '#9ca3af') + '20', color: LEVEL_COLOR[st.jlpt_level] || '#9ca3af' }}>{st.jlpt_level}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st?.batch_name || st?.email}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#6e6e73', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.description || '—'}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>{fmt(Number(inv.amount))}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{fmtDate(inv.due_date)}</div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '20px', background: STATUS_COLOR[inv.status] + '18', color: STATUS_COLOR[inv.status] }}>{inv.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {canPay && (
                    <button onClick={() => { setPayingInv(inv); setPf({ ...emptyPF, amount: String(inv.amount) }) }}
                      style={{ padding: '4px 10px', background: '#f0fdf4', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#22c55e', fontWeight: '700' }}>
                      Pay
                    </button>
                  )}
                  {inv.status === 'Paid' && (
                    <button onClick={() => openInvoiceReceipt(inv)}
                      style={{ padding: '4px 10px', background: '#eff6ff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#2d7dd2', fontWeight: '700' }}>
                      Receipt
                    </button>
                  )}
                  {inv.status === 'Pending' && (
                    <button onClick={() => markOverdue(inv.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 8px', background: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#e84040' }} title="Mark Overdue">
                      <TriangleAlert size={13} />
                    </button>
                  )}
                  {canPay && (
                    <button onClick={() => cancelInvoice(inv.id)}
                      style={{ padding: '4px 8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#9ca3af' }} title="Cancel">
                      ×
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Create Invoice Modal */}
        {showCreate && (
          <Modal title="Create Invoice" onClose={() => setShowCreate(false)} wide>
            <form onSubmit={createInvoice}>
              <Field label="Student *">
                <select style={inputStyle} required value={cf.studentId} onChange={e => onStudentSelect(e.target.value)}>
                  <option value="">— Select student —</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.full_name || s.email}</option>)}
                </select>
              </Field>

              {/* Auto-filled student details */}
              {selectedStudent && (
                <div style={{ background: '#f8f7f4', border: '1px solid #ececef', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                      background: (LEVEL_COLOR[selectedStudent.jlpt_level || ''] || '#1a1f3c') + '20',
                      color: LEVEL_COLOR[selectedStudent.jlpt_level || ''] || '#1a1f3c',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px',
                    }}>
                      {(selectedStudent.full_name || selectedStudent.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1f3c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedStudent.full_name || 'Unknown'}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedStudent.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[
                      { label: 'Level', value: selectedStudent.jlpt_level || '—', color: LEVEL_COLOR[selectedStudent.jlpt_level || ''] },
                      { label: 'Batch', value: selectedStudent.batch_name || selectedStudent.batch || 'Not enrolled' },
                      { label: 'Status', value: selectedStudent.status || '—' },
                      { label: 'Phone', value: selectedStudent.phone || '—' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ background: '#fff', border: '1px solid #f0f0f2', borderRadius: '8px', padding: '6px 10px', flex: '1 1 auto', minWidth: '90px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: color || '#1a1f3c' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Batch (optional)">
                  <select style={inputStyle} value={cf.batchId} onChange={e => setCf(c => ({ ...c, batchId: e.target.value }))}>
                    <option value="">— No batch —</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </Field>
                <Field label="Fee Template (optional)">
                  <select style={inputStyle} value={cf.feeId} onChange={e => onFeeSelect(e.target.value)}>
                    <option value="">— Custom amount —</option>
                    {fees.filter(f => f.is_active).map(f => <option key={f.id} value={f.id}>{f.name} — {fmt(f.amount)}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Amount (₹) *">
                  <input style={inputStyle} type="number" min={1} required value={cf.amount} onChange={e => setCf(c => ({ ...c, amount: e.target.value }))} placeholder="e.g. 3000" />
                </Field>
                <Field label="Due Date *">
                  <input style={inputStyle} type="date" required value={cf.dueDate} onChange={e => setCf(c => ({ ...c, dueDate: e.target.value }))} />
                </Field>
              </div>
              <Field label="Description (optional)">
                <input style={inputStyle} value={cf.description} onChange={e => setCf(c => ({ ...c, description: e.target.value }))} placeholder="e.g. N4 Monthly Fee — July 2025" />
              </Field>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: 'var(--red)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Creating…' : 'Create Invoice'}</button>
              </div>
            </form>
          </Modal>
        )}

        {/* Record Payment Modal */}
        {payingInv && (
          <Modal title="Record Payment" onClose={() => setPayingInv(null)} wide>
            <div style={{ background: '#f8f7f4', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1f3c' }}>{studentMap[payingInv.student_id]?.full_name || 'Student'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {studentMap[payingInv.student_id]?.jlpt_level && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: (LEVEL_COLOR[studentMap[payingInv.student_id]!.jlpt_level!] || '#1a1f3c') + '20', color: LEVEL_COLOR[studentMap[payingInv.student_id]!.jlpt_level!] || '#1a1f3c' }}>{studentMap[payingInv.student_id]!.jlpt_level}</span>
                  )}
                  {(studentMap[payingInv.student_id]?.batch_name || studentMap[payingInv.student_id]?.batch) && (
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{studentMap[payingInv.student_id]?.batch_name || studentMap[payingInv.student_id]?.batch}</span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{payingInv.description || 'Fee payment'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1f3c' }}>{fmt(Number(payingInv.amount))}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Due {fmtDate(payingInv.due_date)}</div>
              </div>
            </div>
            <form onSubmit={recordPayment}>
              <Field label="Payment Amount (₹) *">
                <input style={inputStyle} type="number" min={1} required value={pf.amount} onChange={e => setPf(f => ({ ...f, amount: e.target.value }))} />
              </Field>
              <Field label="Payment Method">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PAYMENT_METHODS.map(m => {
                    const active = pf.method === m
                    return (
                      <button key={m} type="button" onClick={() => setPf(f => ({ ...f, method: m }))} style={{
                        display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                        border: `2px solid ${active ? '#1a1f3c' : '#e5e7eb'}`,
                        background: active ? '#1a1f3c' : '#f9fafb',
                        color: active ? '#fff' : '#6b7280',
                        transition: 'all 0.15s',
                      }}>
                        {PM_ICONS[m]} <span>{m}</span>
                      </button>
                    )
                  })}
                </div>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Payment Date *">
                  <input style={inputStyle} type="date" required value={pf.date} onChange={e => setPf(f => ({ ...f, date: e.target.value }))} />
                </Field>
                <Field label="Reference No. (optional)">
                  <input style={inputStyle} value={pf.reference} onChange={e => setPf(f => ({ ...f, reference: e.target.value }))} placeholder="UPI ID / Txn ID / Cheque No." />
                </Field>
              </div>
              <Field label="Notes (optional)">
                <input style={inputStyle} value={pf.notes} onChange={e => setPf(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional notes…" />
              </Field>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setPayingInv(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ flex: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', background: '#22c55e', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff', fontFamily: 'inherit' }}>{loading ? 'Saving…' : <><Check size={15} /> Confirm Payment</>}</button>
              </div>
            </form>
          </Modal>
        )}
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // COLLEGE BILLING TAB
  // ══════════════════════════════════════════════════════════════════
  if (tab === 'colleges') {
    const month = new Date().toISOString().slice(0, 7)
    const thisMonthTotal = collegePayments.filter(p => p.period_month === month || (p.payment_date || '').startsWith(month)).reduce((s, p) => s + Number(p.amount || 0), 0)
    const paidByCollege: Record<string, number> = {}
    const lastByCollege: Record<string, string> = {}
    for (const p of collegePayments) {
      if (!p.college_id) continue
      paidByCollege[p.college_id] = (paidByCollege[p.college_id] || 0) + Number(p.amount || 0)
      if (p.payment_date && (!lastByCollege[p.college_id] || p.payment_date > lastByCollege[p.college_id])) lastByCollege[p.college_id] = p.payment_date
    }
    return (
      <>
        {pageHeader}
        <TabBar tab={tab} setTab={setTab} />

        <StatGrid>
          {[
            { label: 'Contract Revenue', value: fmt(collegeCollected), icon: <Wallet size={18} />, color: '#22c55e' },
            { label: 'This Month', value: fmt(thisMonthTotal), icon: <CheckCircle2 size={18} />, color: '#2d7dd2' },
            { label: 'Colleges', value: String(colleges.length), icon: <Building2 size={18} />, color: '#8b5cf6' },
            { label: 'Payments Logged', value: String(collegePayments.length), icon: <Receipt size={18} />, color: '#f59e0b' },
          ].map(({ label, value, icon, color }) => (
            <StatCard key={label} label={label} value={value} icon={icon} color={color} />
          ))}
        </StatGrid>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}>Colleges — Contract vs Collected</h2>
            <DataToolbar
              title="College Billing"
              columns={[
                { key: 'college', label: 'College' }, { key: 'category', label: 'Category' }, { key: 'type', label: 'Payment Type' },
                { key: 'contract', label: 'Contract' }, { key: 'collected', label: 'Collected' }, { key: 'last', label: 'Last Payment' },
              ]}
              rows={colleges.map(c => ({
                college: c.name, category: c.category || '', type: c.payment_type || 'Monthly',
                contract: fmt(Number(c.payment_amount || 0)), collected: fmt(paidByCollege[c.id] || 0),
                last: lastByCollege[c.id] ? fmtDate(lastByCollege[c.id]) : '',
              }))}
            />
          </div>
          {colleges.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No colleges yet. Add colleges from the Colleges page.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.2fr', gap: '10px', padding: '0' }}>
              <div style={{ display: 'contents' }}>
                {['College', 'Type', 'Contract', 'Collected', 'Last Payment'].map(h => (
                  <div key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 20px', background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>{h}</div>
                ))}
              </div>
              {colleges.map(c => (
                <div key={c.id} style={{ display: 'contents' }}>
                  <div style={{ padding: '13px 20px', borderBottom: '1px solid #f9fafb', fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>{c.name}{c.category ? <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 400 }}> · {c.category}</span> : ''}</div>
                  <div style={{ padding: '13px 20px', borderBottom: '1px solid #f9fafb', fontSize: '12px', color: '#6b7280' }}>{c.payment_type || 'Monthly'}</div>
                  <div style={{ padding: '13px 20px', borderBottom: '1px solid #f9fafb', fontSize: '13px', color: '#1d1d1f' }}>{fmt(Number(c.payment_amount || 0))}</div>
                  <div style={{ padding: '13px 20px', borderBottom: '1px solid #f9fafb', fontSize: '13px', fontWeight: 700, color: '#22c55e' }}>{fmt(paidByCollege[c.id] || 0)}</div>
                  <div style={{ padding: '13px 20px', borderBottom: '1px solid #f9fafb', fontSize: '12px', color: '#9ca3af' }}>{lastByCollege[c.id] ? fmtDate(lastByCollege[c.id]) : '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}>Recent College Payments</h2>
          </div>
          {collegePayments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>No college payments recorded yet.</div>
          ) : collegePayments.slice(0, 12).map((p, i, arr) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 20px', borderBottom: i < Math.min(arr.length, 12) - 1 ? '1px solid #f9fafb' : 'none' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Building2 size={15} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>{collegeMap[p.college_id || '']?.name || 'College'}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{p.period_month ? `For ${p.period_month}` : ''}{p.payment_method ? ` · ${p.payment_method}` : ''}{p.reference_number ? ` · ${p.reference_number}` : ''}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1d1d1f' }}>{fmt(Number(p.amount))}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{p.payment_date ? fmtDate(p.payment_date) : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  // ══════════════════════════════════════════════════════════════════
  // FEE STRUCTURES TAB
  // ══════════════════════════════════════════════════════════════════
  return (
    <>
      {pageHeader}
      <TabBar tab={tab} setTab={setTab} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={() => { setShowAddFee(true); setFf(emptyFF) }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} /> Add Fee Structure
        </button>
      </div>

      {fees.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '56px', textAlign: 'center', color: '#9ca3af' }}>
          <DollarSign size={36} style={{ margin: '0 auto 16px', display: 'block', color: '#d1d5db' }} strokeWidth={1.5} />
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#6e6e73' }}>No fee structures yet</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Add fee templates to quickly fill invoices</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {fees.map(fee => (
            <div key={fee.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #ececef', opacity: fee.is_active ? 1 : 0.55 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {fee.jlpt_level && (
                    <span style={{ background: (LEVEL_COLOR[fee.jlpt_level] || '#e84040') + '20', color: LEVEL_COLOR[fee.jlpt_level] || '#e84040', fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>{fee.jlpt_level}</span>
                  )}
                  <span style={{ background: '#f3f4f6', color: '#6b7280', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '20px' }}>{fee.frequency}</span>
                </div>
                <button onClick={() => toggleFeeActive(fee)} style={{ padding: '3px 10px', background: fee.is_active ? '#f0fdf4' : '#f3f4f6', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '10px', fontWeight: '700', color: fee.is_active ? '#22c55e' : '#9ca3af', flexShrink: 0 }}>
                  {fee.is_active ? '● Active' : '○ Inactive'}
                </button>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1d1d1f', marginBottom: '4px', letterSpacing: '-0.01em' }}>{fee.name}</div>
              {fee.description && <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px' }}>{fee.description}</div>}
              <div style={{ fontSize: '26px', fontWeight: '700', color: '#1d1d1f', marginBottom: '14px', letterSpacing: '-0.03em' }}>{fmt(Number(fee.amount))}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditFee({ ...fee })} style={{ flex: 1, padding: '7px', background: '#eff6ff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', color: '#2d7dd2', fontWeight: '600' }}>Edit</button>
                <button onClick={() => deleteFee(fee.id)} style={{ padding: '7px 12px', background: '#fef2f2', border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', color: '#e84040' }}>×</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Fee Modal */}
      {showAddFee && (
        <Modal title="Add Fee Structure" onClose={() => setShowAddFee(false)}>
          <form onSubmit={addFee}>
            <Field label="Name *">
              <input style={inputStyle} autoFocus required value={ff.name} onChange={e => setFf(f => ({ ...f, name: e.target.value }))} placeholder="e.g. N4 Monthly Fee" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="JLPT Level (optional)">
                <select style={inputStyle} value={ff.jlpt_level} onChange={e => setFf(f => ({ ...f, jlpt_level: e.target.value }))}>
                  <option value="">— All levels —</option>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Frequency">
                <select style={inputStyle} value={ff.frequency} onChange={e => setFf(f => ({ ...f, frequency: e.target.value }))}>
                  {FREQUENCIES.map(fr => <option key={fr}>{fr}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Amount (₹) *">
              <input style={inputStyle} type="number" min={1} required value={ff.amount} onChange={e => setFf(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 3000" />
            </Field>
            <Field label="Description (optional)">
              <input style={inputStyle} value={ff.description} onChange={e => setFf(f => ({ ...f, description: e.target.value }))} placeholder="Brief description…" />
            </Field>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowAddFee(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: 'var(--red)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Adding…' : 'Add Fee Structure'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Fee Modal */}
      {editFee && (
        <Modal title="Edit Fee Structure" onClose={() => setEditFee(null)}>
          <form onSubmit={updateFee}>
            <Field label="Name *">
              <input style={inputStyle} autoFocus required value={editFee.name} onChange={e => setEditFee(f => f ? { ...f, name: e.target.value } : f)} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <Field label="JLPT Level">
                <select style={inputStyle} value={editFee.jlpt_level || ''} onChange={e => setEditFee(f => f ? { ...f, jlpt_level: e.target.value } : f)}>
                  <option value="">— All levels —</option>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Frequency">
                <select style={inputStyle} value={editFee.frequency} onChange={e => setEditFee(f => f ? { ...f, frequency: e.target.value } : f)}>
                  {FREQUENCIES.map(fr => <option key={fr}>{fr}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Amount (₹) *">
              <input style={inputStyle} type="number" min={1} required value={editFee.amount} onChange={e => setEditFee(f => f ? { ...f, amount: Number(e.target.value) } : f)} />
            </Field>
            <Field label="Description">
              <input style={inputStyle} value={editFee.description || ''} onChange={e => setEditFee(f => f ? { ...f, description: e.target.value } : f)} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setEditFee(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: '#2d7dd2', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
