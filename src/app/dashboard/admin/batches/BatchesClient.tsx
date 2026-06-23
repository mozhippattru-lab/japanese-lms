'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar, CheckCircle2, Users, BarChart3, Plus,
  Clock, CalendarDays, GraduationCap, CalendarClock,
} from 'lucide-react'
import StatCard, { StatGrid } from '@/components/StatCard'

type Batch = {
  id: string
  name: string
  jlpt_level: string
  time_slot: string
  days: string
  teacher_id: string | null
  teacher_name: string | null
  capacity: number
  enrolled: number
  status: string
  start_date: string | null
  created_at: string
  mode?: string | null
  college_id?: string | null
}

type Teacher = { id: string; full_name: string | null; email: string | null; jlpt_level?: string | null; phone?: string | null }
type College = { id: string; name: string; category: string | null }

const MODES = ['Office', 'Online', 'College'] as const
const modeColor: Record<string, string> = { Office: '#2d7dd2', Online: '#8b5cf6', College: '#f59e0b' }

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function DayPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const selected = value ? value.split(',').map(d => d.trim()) : []
  const toggle = (day: string) => {
    const next = selected.includes(day) ? selected.filter(d => d !== day) : [...selected, day]
    onChange(WEEKDAYS.filter(d => next.includes(d)).join(', '))
  }
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {WEEKDAYS.map(day => {
        const active = selected.includes(day)
        return (
          <button key={day} type="button" onClick={() => toggle(day)} style={{
            flex: 1, padding: '8px 0', borderRadius: '8px',
            border: `2px solid ${active ? '#e84040' : '#e5e7eb'}`,
            background: active ? '#e84040' : '#f9fafb',
            color: active ? '#fff' : '#6b7280',
            fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            transition: 'all 0.15s',
            boxShadow: active ? '0 2px 8px rgba(232,64,64,0.3)' : 'none'
          }}>
            {day}
          </button>
        )
      })}
    </div>
  )
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']
const AMPM = ['AM', 'PM']

function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parts = value.match(/^(\d{2}):(\d{2}) (AM|PM)$/)
  const hr = parts?.[1] || '06'
  const min = parts?.[2] || '00'
  const ap = parts?.[3] || 'PM'
  const update = (h: string, m: string, a: string) => onChange(`${h}:${m} ${a}`)
  const selStyle = { flex: 1, minWidth: 0, padding: '10px 6px', textAlign: 'center' as const, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: '#1a1f3c', background: '#fff', outline: 'none', cursor: 'pointer', appearance: 'none' as const, textAlignLast: 'center' as const }
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center', flex: 1, background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '2px 4px' }}>
      <select value={hr} onChange={e => update(e.target.value, min, ap)} style={selStyle}>
        {HOURS.map(h => <option key={h}>{h}</option>)}
      </select>
      <span style={{ color: '#cbd5e1', fontWeight: '700' }}>:</span>
      <select value={min} onChange={e => update(hr, e.target.value, ap)} style={selStyle}>
        {MINUTES.map(m => <option key={m}>{m}</option>)}
      </select>
      <select value={ap} onChange={e => update(hr, min, e.target.value)} style={{ ...selStyle, color: ap === 'AM' ? '#2d7dd2' : '#e84040', fontWeight: 800 }}>
        {AMPM.map(a => <option key={a}>{a}</option>)}
      </select>
    </div>
  )
}

function TimePicker({ startTime, endTime, onChangeStart, onChangeEnd }: { startTime: string; endTime: string; onChangeStart: (v: string) => void; onChangeEnd: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <TimeSelect value={startTime} onChange={onChangeStart} />
      <span style={{ color: '#9ca3af', fontSize: '16px', fontWeight: '600', flexShrink: 0 }}>→</span>
      <TimeSelect value={endTime} onChange={onChangeEnd} />
    </div>
  )
}

const levelColor: Record<string, string> = { N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6' }
const statusColor: Record<string, string> = { Active: '#22c55e', Upcoming: '#2d7dd2', Completed: '#9ca3af', Paused: '#f59e0b' }

// ── Schedule-clash helpers ─────────────────────────────────────────────
// Only Active/Upcoming batches occupy a slot — a Paused/Completed batch frees it.
const OCCUPYING = ['Active', 'Upcoming']
// Institute working hours: classes run 9:00 AM – 7:00 PM.
const WORK_WINDOW: [number, number] = [9 * 60, 19 * 60]
function timeToMin(t?: string | null): number | null {
  if (!t) return null
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return null
  let h = parseInt(m[1], 10) % 12
  if (/pm/i.test(m[3])) h += 12
  return h * 60 + parseInt(m[2], 10)
}
function slotToRange(slot?: string | null): [number, number] | null {
  if (!slot) return null
  const parts = slot.split(/[–-]/).map(s => s.trim()).filter(Boolean)
  if (parts.length !== 2) return null
  const a = timeToMin(parts[0]), b = timeToMin(parts[1])
  return a != null && b != null ? [a, b] : null
}
function daySet(d?: string | null): Set<string> {
  return new Set((d || '').split(',').map(x => x.trim()).filter(Boolean))
}

const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#f9fafb', color: '#1a1f3c', fontWeight: 500 } as const

function modeBtn(active: boolean, color: string): React.CSSProperties {
  return {
    flex: 1, padding: '10px 0', borderRadius: '8px', border: `2px solid ${active ? color : '#e5e7eb'}`,
    background: active ? color : '#f9fafb', color: active ? '#fff' : '#6b7280',
    fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
  }
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
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
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  )
}

const emptyForm = { name: '', jlpt_level: 'N5', start_time: '09:00 AM', end_time: '11:00 AM', days: '', teacher_id: '', capacity: 20, status: 'Active', start_date: '', mode: 'Office', college_id: '', new_college_name: '' }
const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()

export default function BatchesClient({ initialBatches, teachers, colleges }: { initialBatches: Batch[]; teachers: Teacher[]; colleges: College[] }) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches)
  const [showAdd, setShowAdd] = useState(false)
  const [editBatch, setEditBatch] = useState<Batch | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [viewBatch, setViewBatch] = useState<Batch | null>(null)
  const [roster, setRoster] = useState<{ id: string; full_name: string | null; email: string | null; jlpt_level: string | null; phone: string | null }[]>([])
  const [rosterLoading, setRosterLoading] = useState(false)

  const totalEnrolled = batches.reduce((sum, b) => sum + (b.enrolled || 0), 0)
  const totalCapacity = batches.reduce((sum, b) => sum + (b.capacity || 0), 0)
  const activeBatches = batches.filter(b => b.status === 'Active').length

  async function openView(batch: Batch) {
    setViewBatch(batch)
    setRoster([])
    setRosterLoading(true)
    const supabase = createClient()
    const { data: enr } = await supabase.from('student_batches').select('student_id').eq('batch_id', batch.id)
    const ids = (enr || []).map(e => e.student_id)
    if (ids.length > 0) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, full_name, email, jlpt_level, phone')
        .in('id', ids)
        .order('full_name')
      setRoster(profs || [])
    }
    setRosterLoading(false)
  }

  // Auto-detail card for the currently selected teacher
  function renderTeacherInfo(teacherId: string | null) {
    if (!teacherId) return null
    const t = teachers.find(x => x.id === teacherId)
    if (!t) return null
    const teaching = batches.filter(b => b.teacher_id === t.id)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8f7f4', border: '1px solid #ececef', borderRadius: '10px', padding: '12px 14px', marginTop: '-6px', marginBottom: '14px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, background: (levelColor[t.jlpt_level || ''] || '#1a1f3c') + '20', color: levelColor[t.jlpt_level || ''] || '#1a1f3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px' }}>
          {(t.full_name || t.email || '?').charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1f3c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.full_name || 'Teacher'}</div>
          <div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.email}{t.phone ? ` · ${t.phone}` : ''}</div>
        </div>
        {t.jlpt_level && <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 9px', borderRadius: '20px', flexShrink: 0, background: (levelColor[t.jlpt_level] || '#9ca3af') + '20', color: levelColor[t.jlpt_level] || '#9ca3af' }}>{t.jlpt_level}</span>}
        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, flexShrink: 0 }}>{teaching.length} batch{teaching.length !== 1 ? 'es' : ''}</span>
      </div>
    )
  }

  // Returns the conflicting batch if this teacher is already booked on an
  // overlapping day + time (ignoring discontinued batches), else null.
  function findConflict(teacherId: string | null, daysStr: string, startMin: number | null, endMin: number | null, excludeId: string | null) {
    if (!teacherId || startMin == null || endMin == null) return null
    const myDays = daySet(daysStr)
    if (myDays.size === 0) return null
    for (const b of batches) {
      if (b.id === excludeId) continue
      if (b.teacher_id !== teacherId) continue
      if (!OCCUPYING.includes(b.status)) continue
      const bDays = daySet(b.days)
      let sharesDay = false
      for (const d of myDays) if (bDays.has(d)) { sharesDay = true; break }
      if (!sharesDay) continue
      const r = slotToRange(b.time_slot)
      if (!r) continue
      if (startMin < r[1] && r[0] < endMin) return b // intervals overlap
    }
    return null
  }

  // Validate end-after-start + teacher clash. Returns false to abort.
  function scheduleOK(teacherId: string | null, teacherName: string | undefined, daysStr: string, startMin: number | null, endMin: number | null, excludeId: string | null) {
    if (startMin != null && endMin != null && endMin <= startMin) {
      alert('End time must be after the start time.')
      return false
    }
    if ((startMin != null && startMin < WORK_WINDOW[0]) || (endMin != null && endMin > WORK_WINDOW[1])) {
      if (!confirm('⚠️ Outside working hours\n\nClasses normally run 9:00 AM – 7:00 PM. This batch falls outside that window.\n\nSchedule it anyway?')) return false
    }
    const clash = findConflict(teacherId, daysStr, startMin, endMin, excludeId)
    if (clash) {
      return confirm(
        `⚠️ Schedule clash\n\n${teacherName || 'This teacher'} already teaches "${clash.name}" (${clash.jlpt_level}) on ${clash.days || '—'} at ${clash.time_slot || '—'}, which overlaps these days and time.\n\nCreate anyway?`
      )
    }
    return true
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const teacher = teachers.find(t => t.id === form.teacher_id)
    if (!scheduleOK(form.teacher_id || null, teacher?.full_name || undefined, form.days, timeToMin(form.start_time), timeToMin(form.end_time), null)) return
    setLoading(true)
    const supabase = createClient()

    // If "Add new college…" was chosen, create the college first and use its id.
    let collegeId: string | null = form.mode === 'College' ? (form.college_id || null) : null
    if (form.mode === 'College' && form.college_id === '__new__') {
      const name = form.new_college_name.trim()
      if (!name) { setLoading(false); return }
      const { data: col, error: colErr } = await supabase
        .from('colleges')
        .insert({ name, join_code: genCode(), status: 'Active' })
        .select('id')
        .single()
      if (colErr || !col) { setLoading(false); alert(colErr?.message || 'Could not create college'); return }
      collegeId = col.id
    }

    const newBatch = {
      name: form.name,
      jlpt_level: form.jlpt_level,
      time_slot: form.start_time && form.end_time ? `${form.start_time} – ${form.end_time}` : '',
      days: form.days,
      teacher_id: form.teacher_id || null,
      teacher_name: teacher?.full_name || null,
      capacity: Number(form.capacity),
      enrolled: 0,
      status: form.status,
      start_date: form.start_date || null,
      mode: form.mode,
      college_id: collegeId,
    }
    const { data } = await supabase.from('batches').insert(newBatch).select().single()
    if (data) setBatches(prev => [data, ...prev])
    setShowAdd(false)
    setForm(emptyForm)
    setLoading(false)
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editBatch) return
    const teacher = teachers.find(t => t.id === editBatch.teacher_id)
    const r = slotToRange(editBatch.time_slot)
    if (!scheduleOK(editBatch.teacher_id || null, teacher?.full_name || undefined, editBatch.days || '', r?.[0] ?? null, r?.[1] ?? null, editBatch.id)) return
    setLoading(true)
    const supabase = createClient()
    const updates = {
      name: editBatch.name,
      jlpt_level: editBatch.jlpt_level,
      time_slot: editBatch.time_slot,
      days: editBatch.days,
      teacher_id: editBatch.teacher_id,
      teacher_name: teacher?.full_name || editBatch.teacher_name,
      capacity: editBatch.capacity,
      status: editBatch.status,
      start_date: editBatch.start_date,
      mode: editBatch.mode || 'Office',
      college_id: editBatch.mode === 'College' ? (editBatch.college_id || null) : null,
    }
    await supabase.from('batches').update(updates).eq('id', editBatch.id)
    setBatches(prev => prev.map(b => b.id === editBatch.id ? { ...b, ...updates } : b))
    setEditBatch(null)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this batch?')) return
    const supabase = createClient()
    await supabase.from('batches').delete().eq('id', id)
    setBatches(prev => prev.filter(b => b.id !== id))
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Batches</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Manage class groups and schedules</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} /> New Batch
        </button>
      </div>

      {/* Summary Cards */}
      <StatGrid>
        {[
          { label: 'Total Batches', value: batches.length, icon: <Calendar size={18} />, color: '#e84040' },
          { label: 'Active Batches', value: activeBatches, icon: <CheckCircle2 size={18} />, color: '#22c55e' },
          { label: 'Total Enrolled', value: totalEnrolled, icon: <Users size={18} />, color: '#2d7dd2' },
          { label: 'Total Capacity', value: totalCapacity, icon: <BarChart3 size={18} />, color: '#f59e0b' },
        ].map(({ label, value, icon, color }) => (
          <StatCard key={label} label={label} value={value} icon={icon} color={color} />
        ))}
      </StatGrid>

      {/* Batch Cards Grid */}
      {batches.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '56px', textAlign: 'center', color: '#9ca3af' }}>
          <Calendar size={36} style={{ margin: '0 auto 16px', display: 'block', color: '#d1d5db' }} strokeWidth={1.5} />
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#6e6e73' }}>No batches yet</p>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Click &ldquo;New Batch&rdquo; to create your first class group</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {batches.map(batch => {
            const fillPct = batch.capacity > 0 ? Math.min(100, Math.round((batch.enrolled / batch.capacity) * 100)) : 0
            const fillColor = fillPct >= 90 ? '#e84040' : fillPct >= 70 ? '#f59e0b' : '#22c55e'
            return (
              <div key={batch.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #ececef', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#d1d5db')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ececef')}>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ background: (levelColor[batch.jlpt_level] || '#e84040') + '18', color: levelColor[batch.jlpt_level] || '#e84040', fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>{batch.jlpt_level}</span>
                      <span style={{ background: (modeColor[batch.mode || 'Office'] || '#6b7280') + '18', color: modeColor[batch.mode || 'Office'] || '#6b7280', fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px' }}>{batch.mode || 'Office'}</span>
                      <span style={{ background: (statusColor[batch.status] || '#9ca3af') + '18', color: statusColor[batch.status] || '#9ca3af', fontSize: '11px', fontWeight: '600', padding: '2px 10px', borderRadius: '20px' }}>{batch.status}</span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.01em' }}>{batch.name}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openView(batch)} style={{ padding: '5px 10px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#374151', fontWeight: 600 }}>View</button>
                    <button onClick={() => setEditBatch({ ...batch })} style={{ padding: '5px 10px', background: '#eff6ff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#2d7dd2' }}>Edit</button>
                    <button onClick={() => handleDelete(batch.id)} style={{ padding: '5px 10px', background: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#e84040' }}>×</button>
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { icon: <Clock size={13} />, text: batch.time_slot },
                    { icon: <CalendarDays size={13} />, text: batch.days },
                    { icon: <GraduationCap size={13} />, text: batch.teacher_name || 'No teacher assigned' },
                    { icon: <CalendarClock size={13} />, text: batch.start_date ? new Date(batch.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : 'TBD' },
                  ].map(({ icon, text }, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6e6e73' }}>
                      <span style={{ color: '#9ca3af', display: 'flex', flexShrink: 0 }}>{icon}</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Capacity bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Seats filled</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: fillColor }}>{batch.enrolled}/{batch.capacity}</span>
                  </div>
                  <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${fillPct}%`, background: fillColor, borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewBatch && (
        <Modal title={viewBatch.name} onClose={() => setViewBatch(null)}>
          {/* badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ background: (levelColor[viewBatch.jlpt_level] || '#e84040') + '18', color: levelColor[viewBatch.jlpt_level] || '#e84040', fontSize: '11px', fontWeight: 700, padding: '3px 11px', borderRadius: '20px' }}>{viewBatch.jlpt_level}</span>
            <span style={{ background: (modeColor[viewBatch.mode || 'Office'] || '#6b7280') + '18', color: modeColor[viewBatch.mode || 'Office'] || '#6b7280', fontSize: '11px', fontWeight: 700, padding: '3px 11px', borderRadius: '20px' }}>{viewBatch.mode || 'Office'}</span>
            <span style={{ background: (statusColor[viewBatch.status] || '#9ca3af') + '18', color: statusColor[viewBatch.status] || '#9ca3af', fontSize: '11px', fontWeight: 600, padding: '3px 11px', borderRadius: '20px' }}>{viewBatch.status}</span>
            {viewBatch.mode === 'College' && viewBatch.college_id && (
              <span style={{ background: '#fffbeb', color: '#92400e', fontSize: '11px', fontWeight: 600, padding: '3px 11px', borderRadius: '20px' }}>
                {colleges.find(c => c.id === viewBatch.college_id)?.name || 'College'}
              </span>
            )}
          </div>

          {/* detail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
            {[
              { icon: <Clock size={14} />, label: 'Timing', text: viewBatch.time_slot || 'TBD' },
              { icon: <CalendarDays size={14} />, label: 'Days', text: viewBatch.days || 'TBD' },
              { icon: <GraduationCap size={14} />, label: 'Teacher', text: viewBatch.teacher_name || 'No teacher assigned' },
              { icon: <CalendarClock size={14} />, label: 'Start date', text: viewBatch.start_date ? new Date(viewBatch.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD' },
            ].map(({ icon, label, text }) => (
              <div key={label} style={{ background: '#f9fafb', border: '1px solid #f0f0f2', borderRadius: '10px', padding: '11px 13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>{icon} {label}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>{text}</div>
              </div>
            ))}
          </div>

          {/* capacity */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Seats filled</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1d1d1f' }}>{viewBatch.enrolled}/{viewBatch.capacity}</span>
            </div>
            <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${viewBatch.capacity ? Math.min(100, Math.round((viewBatch.enrolled / viewBatch.capacity) * 100)) : 0}%`, background: '#22c55e', borderRadius: '3px' }} />
            </div>
          </div>

          {/* roster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
            <Users size={15} style={{ color: '#9ca3af' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1d1d1f' }}>Enrolled Students ({roster.length})</h3>
          </div>
          {rosterLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>Loading roster…</div>
          ) : roster.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', background: '#f9fafb', borderRadius: '10px' }}>No students enrolled yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', maxHeight: '260px', overflowY: 'auto' }}>
              {roster.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 11px', background: '#fff', border: '1px solid #f0f0f2', borderRadius: '9px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: (levelColor[s.jlpt_level || ''] || '#1a1f3c') + '20', color: levelColor[s.jlpt_level || ''] || '#1a1f3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                    {(s.full_name || s.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.full_name || 'Student'}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}{s.phone ? ` · ${s.phone}` : ''}</div>
                  </div>
                  {s.jlpt_level && <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 9px', borderRadius: '20px', flexShrink: 0, background: (levelColor[s.jlpt_level] || '#9ca3af') + '20', color: levelColor[s.jlpt_level] || '#9ca3af' }}>{s.jlpt_level}</span>}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <Modal title="Create New Batch" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd}>
            <Field label="Batch Mode">
              <div style={{ display: 'flex', gap: '8px' }}>
                {MODES.map(m => (
                  <button type="button" key={m} onClick={() => setForm(f => ({ ...f, mode: m }))} style={modeBtn(form.mode === m, modeColor[m])}>{m}</button>
                ))}
              </div>
            </Field>
            {form.mode === 'College' && (
              <>
                <Field label="College">
                  <select style={inputStyle} required value={form.college_id} onChange={e => setForm(f => ({ ...f, college_id: e.target.value, new_college_name: '' }))}>
                    <option value="">— Select college —</option>
                    {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    <option value="__new__">＋ Add new college…</option>
                  </select>
                </Field>
                {form.college_id === '__new__' && (
                  <Field label="New College Name">
                    <input style={inputStyle} required autoFocus value={form.new_college_name} onChange={e => setForm(f => ({ ...f, new_college_name: e.target.value }))} placeholder="e.g. Sastra University" />
                  </Field>
                )}
              </>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '14px' }}>
              <Field label="Batch Name"><input style={inputStyle} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. N4 Evening Batch A" /></Field>
              <Field label="Level"><select style={inputStyle} value={form.jlpt_level} onChange={e => setForm(f => ({ ...f, jlpt_level: e.target.value }))}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select></Field>
            </div>
            <Field label="Class Timing"><TimePicker startTime={form.start_time} endTime={form.end_time} onChangeStart={v => setForm(f => ({ ...f, start_time: v }))} onChangeEnd={v => setForm(f => ({ ...f, end_time: v }))} /></Field>
            <Field label="Class Days"><DayPicker value={form.days} onChange={v => setForm(f => ({ ...f, days: v }))} /></Field>
            <Field label="Assign Teacher"><select style={inputStyle} value={form.teacher_id} onChange={e => setForm(f => ({ ...f, teacher_id: e.target.value }))}><option value="">— No teacher yet —</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.full_name || t.email}</option>)}</select></Field>
            {renderTeacherInfo(form.teacher_id)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <Field label="Max Capacity"><input style={inputStyle} type="number" min={1} max={100} value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} /></Field>
              <Field label="Start Date"><input style={inputStyle} type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></Field>
              <Field label="Status"><select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>{['Active','Upcoming','Paused','Completed'].map(s => <option key={s}>{s}</option>)}</select></Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: 'var(--red)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Creating...' : 'Create Batch'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editBatch && (
        <Modal title="Edit Batch" onClose={() => setEditBatch(null)}>
          <form onSubmit={handleUpdate}>
            <Field label="Batch Mode">
              <div style={{ display: 'flex', gap: '8px' }}>
                {MODES.map(m => (
                  <button type="button" key={m} onClick={() => setEditBatch(b => b ? { ...b, mode: m } : b)} style={modeBtn((editBatch.mode || 'Office') === m, modeColor[m])}>{m}</button>
                ))}
              </div>
            </Field>
            {editBatch.mode === 'College' && (
              <Field label="College">
                <select style={inputStyle} value={editBatch.college_id || ''} onChange={e => setEditBatch(b => b ? { ...b, college_id: e.target.value } : b)}>
                  <option value="">— Select college —</option>
                  {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '14px' }}>
              <Field label="Batch Name"><input style={inputStyle} required value={editBatch.name} onChange={e => setEditBatch(b => b ? { ...b, name: e.target.value } : b)} /></Field>
              <Field label="Level"><select style={inputStyle} value={editBatch.jlpt_level} onChange={e => setEditBatch(b => b ? { ...b, jlpt_level: e.target.value } : b)}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select></Field>
            </div>
            <Field label="Class Timing"><TimePicker startTime={editBatch.time_slot?.split(' – ')[0] || '06:00 PM'} endTime={editBatch.time_slot?.split(' – ')[1] || '08:00 PM'} onChangeStart={v => setEditBatch(b => b ? { ...b, time_slot: `${v} – ${b.time_slot?.split(' – ')[1] || '08:00 PM'}` } : b)} onChangeEnd={v => setEditBatch(b => b ? { ...b, time_slot: `${b.time_slot?.split(' – ')[0] || '06:00 PM'} – ${v}` } : b)} /></Field>
            <Field label="Class Days"><DayPicker value={editBatch.days || ''} onChange={v => setEditBatch(b => b ? { ...b, days: v } : b)} /></Field>
            <Field label="Assign Teacher"><select style={inputStyle} value={editBatch.teacher_id || ''} onChange={e => setEditBatch(b => b ? { ...b, teacher_id: e.target.value } : b)}><option value="">— No teacher yet —</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.full_name || t.email}</option>)}</select></Field>
            {renderTeacherInfo(editBatch.teacher_id)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <Field label="Max Capacity"><input style={inputStyle} type="number" min={1} max={100} value={editBatch.capacity} onChange={e => setEditBatch(b => b ? { ...b, capacity: Number(e.target.value) } : b)} /></Field>
              <Field label="Start Date"><input style={inputStyle} type="date" value={editBatch.start_date || ''} onChange={e => setEditBatch(b => b ? { ...b, start_date: e.target.value } : b)} /></Field>
              <Field label="Status"><select style={inputStyle} value={editBatch.status} onChange={e => setEditBatch(b => b ? { ...b, status: e.target.value } : b)}>{['Active','Upcoming','Paused','Completed'].map(s => <option key={s}>{s}</option>)}</select></Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setEditBatch(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: '#2d7dd2', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: '#fff' }}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
