'use client'
import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Search, Plus, Eye, Pencil, X, AlertCircle, Eye as EyeIcon, EyeOff,
  Phone, Mail, Calendar, ChevronRight, UserCheck, UserX, Clock,
  TrendingUp, Users, Flame, CheckCircle2,
  Footprints, Globe, MessageCircle, UsersRound, Smartphone, PhoneCall, Pin,
} from 'lucide-react'
import type { ReactNode } from 'react'
import Modal from '@/components/Modal'
import ToastContainer, { useToast } from '@/components/Toast'
import DataToolbar from '@/components/DataToolbar'

// ─── Types ───────────────────────────────────────────────────────────────────

type Lead = {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  source: string
  interested_level: string
  status: string
  notes: string | null
  follow_up_date: string | null
  converted_at: string | null
  converted_student_id: string | null
  created_at: string
  updated_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = ['New', 'Contacted', 'Interested', 'Enrolled', 'Lost'] as const
const SOURCES  = ['Walk-in', 'Website', 'WhatsApp', 'Referral', 'Social Media', 'Phone Call', 'Other']
const LEVELS   = ['N5', 'N4', 'N3', 'N2', 'N1']

const statusColor: Record<string, string> = {
  New:        '#2d7dd2',
  Contacted:  '#f59e0b',
  Interested: '#e84040',
  Enrolled:   '#22c55e',
  Lost:       '#9ca3af',
}
const statusBg: Record<string, string> = {
  New:        '#eff6ff',
  Contacted:  '#fffbeb',
  Interested: '#fef2f2',
  Enrolled:   '#f0fdf4',
  Lost:       '#f9fafb',
}
const levelColor: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const sourceIcon: Record<string, ReactNode> = {
  'Walk-in': <Footprints size={13} />, Website: <Globe size={13} />,
  WhatsApp: <MessageCircle size={13} />, Referral: <UsersRound size={13} />,
  'Social Media': <Smartphone size={13} />, 'Phone Call': <PhoneCall size={13} />,
  Other: <Pin size={13} />,
}
function SourceTag({ source }: { source: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ color: '#9ca3af', display: 'flex' }}>{sourceIcon[source] || <Pin size={13} />}</span>
      {source}
    </span>
  )
}

const NEXT_STATUS: Record<string, string> = {
  New: 'Contacted', Contacted: 'Interested', Interested: 'Enrolled',
}

const fmtDate  = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtShort = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
const today    = () => new Date().toISOString().slice(0, 10)
const isOverdue = (lead: Lead) =>
  lead.follow_up_date && lead.follow_up_date < today() && lead.status !== 'Enrolled' && lead.status !== 'Lost'

// ─── Shared sub-components (must be outside main component) ──────────────────

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
  width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
  borderRadius: '9px', fontSize: '14px', color: 'var(--navy)', background: '#fff',
  outline: 'none', transition: 'border-color 150ms, box-shadow 150ms',
  fontFamily: 'inherit', boxSizing: 'border-box',
}
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }

function Btn({
  children, onClick, variant = 'ghost', disabled, type = 'button', style: s, full,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  disabled?: boolean
  type?: 'button' | 'submit'
  style?: React.CSSProperties
  full?: boolean
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
    padding: '10px 18px', borderRadius: '9px', border: 'none', fontFamily: 'inherit',
    fontSize: '14px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1, transition: 'all 150ms ease', whiteSpace: 'nowrap',
    width: full ? '100%' : undefined,
  }
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--red)', color: '#fff', boxShadow: '0 2px 8px rgba(232,64,64,0.22)' },
    secondary: { background: '#eff6ff', color: '#2d7dd2' },
    ghost: { background: '#f3f4f6', color: '#374151' },
    danger: { background: '#fef2f2', color: '#e84040' },
    success: { background: '#f0fdf4', color: '#16a34a' },
  }
  const hoverMap: Record<string, string> = {
    primary: '#d63030', secondary: '#dbeafe', ghost: '#e5e7eb', danger: '#fee2e2', success: '#dcfce7',
  }
  return (
    <button
      type={type} disabled={disabled} onClick={onClick}
      style={{ ...base, ...variants[variant], ...s }}
      onMouseEnter={e => {
        if (disabled) return
        const el = e.currentTarget
        el.style.background = hoverMap[variant]
        if (variant === 'primary') el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        if (disabled) return
        const el = e.currentTarget
        el.style.background = (variants[variant].background as string)
        el.style.transform = 'none'
      }}
      onMouseDown={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)' }}
      onMouseUp={e => {
        if (!disabled && variant !== 'primary') (e.currentTarget as HTMLButtonElement).style.transform = 'none'
      }}
    >
      {children}
    </button>
  )
}

function ActionBtn({ children, onClick, color }: { children: React.ReactNode; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 11px', borderRadius: '7px', border: 'none', background: color + '12', color, fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'background 130ms ease', minHeight: '32px', fontFamily: 'inherit' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = color + '22' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = color + '12' }}
    >
      {children}
    </button>
  )
}

function StatusPill({ status }: { status: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: statusColor[status] + '18', color: statusColor[status] }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor[status] }} />
      {status}
    </span>
  )
}

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        style={{ ...inputStyle, paddingRight: '44px' }}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Temporary password (min. 6 chars)"
        minLength={6}
        required
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
      >
        {show ? <EyeOff size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
  full_name: '', email: '', phone: '', source: 'Walk-in',
  interested_level: 'N5', status: 'New', notes: '', follow_up_date: '',
}

export default function CRMClient({ initialLeads }: { initialLeads: Lead[] }) {
  const { toasts, toast, remove } = useToast()
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  const [showAdd, setShowAdd]     = useState(false)
  const [viewLead, setViewLead]   = useState<Lead | null>(null)
  const [editLead, setEditLead]   = useState<Lead | null>(null)
  const [convertLead, setConvertLead] = useState<Lead | null>(null)

  const [form, setForm]   = useState({ ...EMPTY_FORM })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [convertPw, setConvertPw] = useState('')

  // ── Derived ──
  const filtered = useMemo(() => leads.filter(l => {
    const q = search.toLowerCase()
    const matchQ = !q || l.full_name.toLowerCase().includes(q) || (l.email?.toLowerCase().includes(q) ?? false) || (l.phone?.includes(q) ?? false)
    return matchQ
      && (!filterStatus || l.status === filterStatus)
      && (!filterSource || l.source === filterSource)
      && (!filterLevel  || l.interested_level === filterLevel)
  }), [leads, search, filterStatus, filterSource, filterLevel])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    STATUSES.forEach(s => { c[s] = leads.filter(l => l.status === s).length })
    return c
  }, [leads])

  const thisMonthEnrolled = useMemo(() => {
    const m = new Date().toISOString().slice(0, 7)
    return leads.filter(l => l.status === 'Enrolled' && l.converted_at?.startsWith(m)).length
  }, [leads])

  const conversionRate = leads.length > 0 ? Math.round((counts['Enrolled'] / leads.length) * 100) : 0

  // ── Handlers ──
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const payload = {
      full_name: form.full_name, email: form.email || null, phone: form.phone || null,
      source: form.source, interested_level: form.interested_level,
      status: form.status, notes: form.notes || null,
      follow_up_date: form.follow_up_date || null,
    }
    const { data, error: err } = await supabase.from('leads').insert(payload).select().single()
    if (err) { setError(err.message); setLoading(false); return }
    setLeads(prev => [data, ...prev])
    setShowAdd(false); setForm({ ...EMPTY_FORM })
    toast('Lead added', 'success')
    setLoading(false)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editLead) return
    setLoading(true)
    const supabase = createClient()
    const payload = {
      full_name: editLead.full_name, email: editLead.email, phone: editLead.phone,
      source: editLead.source, interested_level: editLead.interested_level,
      status: editLead.status, notes: editLead.notes,
      follow_up_date: editLead.follow_up_date,
    }
    const { error: err } = await supabase.from('leads').update(payload).eq('id', editLead.id)
    if (!err) {
      setLeads(prev => prev.map(l => l.id === editLead.id ? { ...l, ...payload } : l))
      toast('Lead updated', 'success')
    }
    setEditLead(null); setLoading(false)
  }

  async function advanceStatus(lead: Lead) {
    const next = NEXT_STATUS[lead.status]
    if (!next) return
    const supabase = createClient()
    const update: Partial<Lead> = { status: next }
    if (next === 'Enrolled') update.converted_at = new Date().toISOString()
    await supabase.from('leads').update(update).eq('id', lead.id)
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, ...update } : l))
    if (viewLead?.id === lead.id) setViewLead(l => l ? { ...l, ...update } : l)
    toast(`Moved to ${next}`, 'success')
  }

  async function markLost(lead: Lead) {
    if (!confirm(`Mark "${lead.full_name}" as Lost?`)) return
    const supabase = createClient()
    await supabase.from('leads').update({ status: 'Lost' }).eq('id', lead.id)
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Lost' } : l))
    if (viewLead?.id === lead.id) setViewLead(l => l ? { ...l, status: 'Lost' } : l)
    toast('Lead marked as Lost', 'info')
  }

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault()
    if (!convertLead) return
    setLoading(true); setError('')
    // Create the student via the secure server route (admin stays logged in)
    const res = await fetch('/api/admin/create-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: convertLead.full_name,
        email: convertLead.email,
        phone: convertLead.phone,
        password: convertPw,
        jlpt_level: convertLead.interested_level,
        status: 'Active',
      }),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error || 'Failed to convert lead'); setLoading(false); return }
    const studentId = json.student?.id
    const supabase = createClient()
    const convertedAt = new Date().toISOString()
    await supabase.from('leads').update({
      status: 'Enrolled', converted_at: convertedAt, converted_student_id: studentId,
    }).eq('id', convertLead.id)
    setLeads(prev => prev.map(l => l.id === convertLead!.id ? { ...l, status: 'Enrolled', converted_at: convertedAt, converted_student_id: studentId } : l))
    toast(`${convertLead.full_name} is now a student!`, 'success')
    setConvertLead(null); setConvertPw(''); setLoading(false)
  }

  async function deleteLead(id: string, name: string) {
    if (!confirm(`Delete lead "${name}"? This cannot be undone.`)) return
    const supabase = createClient()
    await supabase.from('leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
    toast('Lead deleted', 'info')
  }

  function openEdit(l: Lead) { setEditLead({ ...l }); setViewLead(null) }
  function openConvert(l: Lead) { setConvertLead(l); setViewLead(null); setConvertPw(''); setError('') }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>CRM &amp; Leads</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Track prospects from enquiry to enrolment</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DataToolbar
            title="Leads"
            subtitle={[filterStatus, filterSource, filterLevel, search && `Search "${search}"`].filter(Boolean).join(' · ') || undefined}
            columns={[
              { key: 'name', label: 'Lead' }, { key: 'phone', label: 'Phone' }, { key: 'email', label: 'Email' },
              { key: 'source', label: 'Source' }, { key: 'level', label: 'Level' }, { key: 'status', label: 'Status' },
              { key: 'followup', label: 'Follow-up' }, { key: 'added', label: 'Added' },
            ]}
            rows={filtered.map(l => ({
              name: l.full_name, phone: l.phone || '', email: l.email || '', source: l.source,
              level: l.interested_level, status: l.status,
              followup: l.follow_up_date ? fmtDate(l.follow_up_date) : '', added: fmtShort(l.created_at),
            }))}
          />
          <Btn variant="primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Lead</Btn>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Leads',     value: leads.length,        icon: <Users size={16} />,       color: '#2d7dd2' },
          { label: 'Hot Prospects',   value: counts['Interested'], icon: <Flame size={16} />,       color: '#e84040' },
          { label: 'Enrolled / Month',value: thisMonthEnrolled,   icon: <CheckCircle2 size={16} />, color: '#22c55e' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, icon: <TrendingUp size={16} />,  color: '#8b5cf6' },
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

      {/* ── Pipeline Strip ── */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', border: '1px solid #ececef', display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginRight: '6px', whiteSpace: 'nowrap' }}>PIPELINE</span>
        {STATUSES.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {i > 0 && <ChevronRight size={14} color="#d1d5db" />}
            <button
              onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 14px',
                borderRadius: '99px', border: `1.5px solid ${filterStatus === s ? statusColor[s] : '#e5e7eb'}`,
                background: filterStatus === s ? statusColor[s] : statusBg[s],
                cursor: 'pointer', transition: 'all 150ms', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '700', color: filterStatus === s ? '#fff' : statusColor[s] }}>{s}</span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: filterStatus === s ? 'rgba(255,255,255,0.85)' : statusColor[s], background: filterStatus === s ? 'rgba(255,255,255,0.2)' : statusColor[s] + '20', padding: '1px 7px', borderRadius: '99px' }}>
                {counts[s]}
              </span>
            </button>
          </div>
        ))}
        {filterStatus && (
          <button onClick={() => setFilterStatus('')} style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input className="input-field" placeholder="Search name, email, phone…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '38px' }} />
        </div>
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)} style={{ ...selectStyle, width: '150px', flex: 'none' }}>
          <option value="">All Sources</option>
          {SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ ...selectStyle, width: '130px', flex: 'none' }}>
          <option value="">All Levels</option>
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
        {(search || filterSource || filterLevel || filterStatus) && (
          <Btn onClick={() => { setSearch(''); setFilterSource(''); setFilterLevel(''); setFilterStatus('') }}><X size={14} /> Clear</Btn>
        )}
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
              {['Lead', 'Contact', 'Source', 'Level', 'Status', 'Follow-up', 'Added', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#9ca3af', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '64px 20px', textAlign: 'center' }}>
                  <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                    {search || filterStatus || filterSource || filterLevel
                      ? 'No leads match your filters.'
                      : 'No leads yet. Click "+ Add Lead" to capture your first prospect.'}
                  </div>
                </td>
              </tr>
            ) : filtered.map((l, i) => {
              const overdue = isOverdue(l)
              return (
                <tr
                  key={l.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f9fafb' : 'none', transition: 'background 120ms', background: overdue ? '#fffbeb' : 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = overdue ? '#fef9c3' : '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = overdue ? '#fffbeb' : 'transparent')}
                >
                  {/* Name */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: statusColor[l.status] + '22', border: `2px solid ${statusColor[l.status]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusColor[l.status], fontWeight: '700', fontSize: '13px' }}>
                        {l.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1d1d1f' }}>{l.full_name}</div>
                        {overdue && <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}><Clock size={10} />Follow-up overdue</div>}
                      </div>
                    </div>
                  </td>
                  {/* Contact */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {l.phone && <span style={{ color: '#374151', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={11} color="#9ca3af" />{l.phone}</span>}
                      {l.email && <span style={{ color: '#6b7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={11} color="#9ca3af" />{l.email}</span>}
                      {!l.phone && !l.email && <span style={{ color: '#9ca3af' }}>—</span>}
                    </div>
                  </td>
                  {/* Source */}
                  <td style={{ padding: '13px 16px', color: '#6e6e73', fontSize: '12px' }}>
                    <SourceTag source={l.source} />
                  </td>
                  {/* Level */}
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: levelColor[l.interested_level] + '18', color: levelColor[l.interested_level] }}>
                      {l.interested_level}
                    </span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: '13px 16px' }}><StatusPill status={l.status} /></td>
                  {/* Follow-up */}
                  <td style={{ padding: '13px 16px' }}>
                    {l.follow_up_date
                      ? <span style={{ fontSize: '12px', color: overdue ? '#f59e0b' : '#374151', fontWeight: overdue ? '700' : '400', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} color={overdue ? '#f59e0b' : '#9ca3af'} />{fmtDate(l.follow_up_date)}
                        </span>
                      : <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>}
                  </td>
                  {/* Added */}
                  <td style={{ padding: '13px 16px', color: '#9ca3af', fontSize: '12px' }}>{fmtShort(l.created_at)}</td>
                  {/* Actions */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <ActionBtn onClick={() => setViewLead(l)} color="#6b7280"><Eye size={13} />View</ActionBtn>
                      <ActionBtn onClick={() => openEdit(l)} color="#2d7dd2"><Pencil size={13} />Edit</ActionBtn>
                      {l.status !== 'Enrolled' && l.status !== 'Lost' && NEXT_STATUS[l.status] && (
                        <ActionBtn onClick={() => advanceStatus(l)} color="#22c55e">
                          <ChevronRight size={13} />{NEXT_STATUS[l.status]}
                        </ActionBtn>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid #f3f4f6', color: '#9ca3af', fontSize: '12px' }}>
            Showing {filtered.length} of {leads.length} leads
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ADD LEAD MODAL
      ══════════════════════════════════════════════════════════════ */}
      {showAdd && (
        <Modal title="Add New Lead" onClose={() => { setShowAdd(false); setError(''); setForm({ ...EMPTY_FORM }) }}>
          {error && <div style={{ display: 'flex', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '9px', marginBottom: '16px', fontSize: '13px' }}><AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />{error}</div>}
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Full Name" required>
                <input style={inputStyle} required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Suzuki Kenji"
                  onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
              </Field>
              <Field label="Phone">
                <input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210"
                  onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
              </Field>
            </div>
            <Field label="Email">
              <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="lead@email.com"
                onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <Field label="Source">
                <select style={selectStyle} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Interested Level">
                <select style={selectStyle} value={form.interested_level} onChange={e => setForm(f => ({ ...f, interested_level: e.target.value }))}>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select style={selectStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.filter(s => s !== 'Enrolled').map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Follow-up Date">
              <input style={inputStyle} type="date" value={form.follow_up_date} onChange={e => setForm(f => ({ ...f, follow_up_date: e.target.value }))}
                onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
            </Field>
            <Field label="Notes">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any remarks, preferences, or context…"
                onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--red)'; (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = '#e5e7eb'; (e.target as HTMLTextAreaElement).style.boxShadow = 'none' }} />
            </Field>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn style={{ flex: 1 }} onClick={() => { setShowAdd(false); setForm({ ...EMPTY_FORM }) }}>Cancel</Btn>
              <Btn variant="primary" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? <><span className="spinner" />Adding…</> : <><Plus size={15} />Add Lead</>}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════
          VIEW LEAD MODAL
      ══════════════════════════════════════════════════════════════ */}
      {viewLead && (
        <Modal title="Lead Details" onClose={() => setViewLead(null)} wide>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px', paddingBottom: '20px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0, background: statusColor[viewLead.status] + '18', border: `2.5px solid ${statusColor[viewLead.status]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusColor[viewLead.status], fontWeight: '800', fontSize: '22px' }}>
              {viewLead.full_name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 6px' }}>{viewLead.full_name}</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <StatusPill status={viewLead.status} />
                <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: levelColor[viewLead.interested_level] + '18', color: levelColor[viewLead.interested_level] }}>
                  {viewLead.interested_level}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: '#f3f4f6', color: '#6b7280', fontWeight: '600' }}>
                  <span style={{ display: 'flex' }}>{sourceIcon[viewLead.source] || <Pin size={13} />}</span> {viewLead.source}
                </span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {[
              { label: 'Phone', value: viewLead.phone || '—', icon: <Phone size={13} color="#9ca3af" /> },
              { label: 'Email', value: viewLead.email || '—', icon: <Mail size={13} color="#9ca3af" /> },
              { label: 'Follow-up', value: viewLead.follow_up_date ? fmtDate(viewLead.follow_up_date) : '—', icon: <Calendar size={13} color={isOverdue(viewLead) ? '#f59e0b' : '#9ca3af'} /> },
              { label: 'Added', value: fmtShort(viewLead.created_at), icon: <Clock size={13} color="#9ca3af" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ background: '#f9fafb', borderRadius: '9px', padding: '11px 13px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '1px', flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: label === 'Follow-up' && isOverdue(viewLead) ? '#f59e0b' : 'var(--navy)' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {viewLead.notes && (
            <div style={{ background: '#f9fafb', borderRadius: '9px', padding: '13px 14px', marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Notes</div>
              <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{viewLead.notes}</p>
            </div>
          )}

          {/* Pipeline progression */}
          {viewLead.status !== 'Enrolled' && viewLead.status !== 'Lost' && (
            <div style={{ background: '#f9fafb', borderRadius: '9px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Pipeline Actions</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {NEXT_STATUS[viewLead.status] && (
                  <Btn variant="success" onClick={() => advanceStatus(viewLead)}>
                    <ChevronRight size={15} /> Move to {NEXT_STATUS[viewLead.status]}
                  </Btn>
                )}
                {viewLead.status === 'Interested' && viewLead.email && (
                  <Btn variant="primary" onClick={() => openConvert(viewLead)}>
                    <UserCheck size={15} /> Convert to Student
                  </Btn>
                )}
                <Btn variant="danger" onClick={() => markLost(viewLead)}>
                  <UserX size={15} /> Mark Lost
                </Btn>
              </div>
            </div>
          )}

          {viewLead.status === 'Enrolled' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '9px', padding: '13px 14px', marginBottom: '16px' }}>
              <CheckCircle2 size={18} color="#22c55e" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#16a34a' }}>Enrolled</div>
                {viewLead.converted_at && <div style={{ fontSize: '12px', color: '#4ade80' }}>Converted on {fmtShort(viewLead.converted_at)}</div>}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <Btn style={{ flex: 1 }} onClick={() => openEdit(viewLead)}><Pencil size={15} />Edit Lead</Btn>
            <Btn variant="danger" onClick={() => { deleteLead(viewLead.id, viewLead.full_name); setViewLead(null) }}>Delete</Btn>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EDIT LEAD MODAL
      ══════════════════════════════════════════════════════════════ */}
      {editLead && (
        <Modal title="Edit Lead" onClose={() => setEditLead(null)}>
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Full Name" required>
                <input style={inputStyle} required value={editLead.full_name} onChange={e => setEditLead(l => l ? { ...l, full_name: e.target.value } : l)}
                  onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
              </Field>
              <Field label="Phone">
                <input style={inputStyle} value={editLead.phone || ''} onChange={e => setEditLead(l => l ? { ...l, phone: e.target.value } : l)}
                  onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
              </Field>
            </div>
            <Field label="Email">
              <input style={inputStyle} type="email" value={editLead.email || ''} onChange={e => setEditLead(l => l ? { ...l, email: e.target.value } : l)}
                onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <Field label="Source">
                <select style={selectStyle} value={editLead.source} onChange={e => setEditLead(l => l ? { ...l, source: e.target.value } : l)}>
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Level">
                <select style={selectStyle} value={editLead.interested_level} onChange={e => setEditLead(l => l ? { ...l, interested_level: e.target.value } : l)}>
                  {LEVELS.map(lv => <option key={lv}>{lv}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select style={selectStyle} value={editLead.status} onChange={e => setEditLead(l => l ? { ...l, status: e.target.value } : l)}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Follow-up Date">
              <input style={inputStyle} type="date" value={editLead.follow_up_date || ''} onChange={e => setEditLead(l => l ? { ...l, follow_up_date: e.target.value } : l)}
                onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }} />
            </Field>
            <Field label="Notes">
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={editLead.notes || ''} onChange={e => setEditLead(l => l ? { ...l, notes: e.target.value } : l)}
                onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--red)'; (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = '#e5e7eb'; (e.target as HTMLTextAreaElement).style.boxShadow = 'none' }} />
            </Field>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn style={{ flex: 1 }} onClick={() => setEditLead(null)}>Cancel</Btn>
              <Btn variant="secondary" type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? <><span className="spinner spinner-dark" />Saving…</> : 'Save Changes'}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CONVERT TO STUDENT MODAL
      ══════════════════════════════════════════════════════════════ */}
      {convertLead && (
        <Modal title="Convert to Student" onClose={() => { setConvertLead(null); setConvertPw(''); setError('') }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f9fafb', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0, background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '18px' }}>
              {convertLead.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--navy)', fontSize: '15px' }}>{convertLead.full_name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{convertLead.email} · {convertLead.interested_level}</div>
            </div>
          </div>

          {error && <div style={{ display: 'flex', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '9px', marginBottom: '16px', fontSize: '13px' }}><AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />{error}</div>}

          <form onSubmit={handleConvert}>
            <Field label="Set Temporary Password" required>
              <PasswordInput value={convertPw} onChange={setConvertPw} />
            </Field>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '9px', padding: '11px 13px', marginBottom: '20px', fontSize: '12px', color: '#166534' }}>
              <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                Creates a student account for <strong>{convertLead.full_name}</strong> ({convertLead.interested_level}) using <strong>{convertLead.email}</strong>. They can log in immediately, and you stay signed in.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Btn style={{ flex: 1 }} onClick={() => { setConvertLead(null); setConvertPw('') }}>Cancel</Btn>
              <Btn variant="primary" type="submit" disabled={loading || !convertPw || !convertLead.email} style={{ flex: 1 }}>
                {loading ? <><span className="spinner" />Creating…</> : <><UserCheck size={15} />Create Student Account</>}
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
