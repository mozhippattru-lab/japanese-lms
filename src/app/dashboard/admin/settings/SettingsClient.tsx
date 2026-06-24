'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ToastContainer, { useToast } from '@/components/Toast'
import { Building2, Clock, Users, GraduationCap, CalendarDays, Save } from 'lucide-react'

export type AppSettings = {
  id: string
  institute_name_ta?: string | null
  institute_name_en?: string | null
  tagline?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  registration_no?: string | null
  working_start?: string | null
  working_end?: string | null
  currency?: string | null
  academic_year?: string | null
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINS = ['00', '15', '30', '45']
const TIMES = HOURS.flatMap(h => MINS.flatMap(m => [`${h}:${m} AM`, `${h}:${m} PM`]))
  .sort((a, b) => to24(a) - to24(b))
function to24(t: string) { const m = t.match(/(\d+):(\d+) (AM|PM)/)!; let h = +m[1] % 12; if (m[3] === 'PM') h += 12; return h * 60 + +m[2] }

export default function SettingsClient({ initial, counts, adminEmail }: {
  initial: AppSettings
  counts: { students: number; teachers: number; batches: number }
  adminEmail: string
}) {
  const { toasts, toast, remove } = useToast()
  const [s, setS] = useState<AppSettings>({
    id: 'default',
    institute_name_ta: initial.institute_name_ta ?? 'மொழிப்பற்று',
    institute_name_en: initial.institute_name_en ?? 'Mozhippattru',
    tagline: initial.tagline ?? 'Japanese Language Center',
    address: initial.address ?? '',
    phone: initial.phone ?? '',
    email: initial.email ?? '',
    registration_no: initial.registration_no ?? '',
    working_start: initial.working_start ?? '09:00 AM',
    working_end: initial.working_end ?? '07:00 PM',
    currency: initial.currency ?? '₹',
    academic_year: initial.academic_year ?? '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: keyof AppSettings, v: string) => setS(p => ({ ...p, [k]: v }))

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('app_settings').update({
      institute_name_ta: s.institute_name_ta, institute_name_en: s.institute_name_en, tagline: s.tagline,
      address: s.address || null, phone: s.phone || null, email: s.email || null, registration_no: s.registration_no || null,
      working_start: s.working_start, working_end: s.working_end, currency: s.currency, academic_year: s.academic_year || null,
      updated_at: new Date().toISOString(),
    }).eq('id', 'default')
    if (error) { toast(error.message, 'error'); setSaving(false); return }
    toast('Settings saved', 'success')
    setSaving(false)
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'var(--display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.04em', margin: '0 0 6px' }}>設定 · Settings</p>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Settings</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '6px' }}>Institute details and preferences — used across receipts and reports</p>
        </div>
        <button onClick={save} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 20px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', maxWidth: '900px' }}>
        {/* Institute details */}
        <Card icon={<Building2 size={16} />} title="Institute Details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Name (Tamil)"><input value={s.institute_name_ta || ''} onChange={e => set('institute_name_ta', e.target.value)} style={inp} /></Field>
            <Field label="Name (English)"><input value={s.institute_name_en || ''} onChange={e => set('institute_name_en', e.target.value)} style={inp} /></Field>
          </div>
          <Field label="Tagline"><input value={s.tagline || ''} onChange={e => set('tagline', e.target.value)} style={inp} /></Field>
          <Field label="Address"><textarea value={s.address || ''} onChange={e => set('address', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Phone"><input value={s.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+91 …" style={inp} /></Field>
            <Field label="Email"><input value={s.email || ''} onChange={e => set('email', e.target.value)} style={inp} /></Field>
          </div>
          <Field label="Registration / GST No."><input value={s.registration_no || ''} onChange={e => set('registration_no', e.target.value)} style={inp} /></Field>
        </Card>

        {/* Preferences */}
        <Card icon={<Clock size={16} />} title="Preferences">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Working hours — start">
              <select value={s.working_start || ''} onChange={e => set('working_start', e.target.value)} style={inp}>{TIMES.map(t => <option key={t}>{t}</option>)}</select>
            </Field>
            <Field label="Working hours — end">
              <select value={s.working_end || ''} onChange={e => set('working_end', e.target.value)} style={inp}>{TIMES.map(t => <option key={t}>{t}</option>)}</select>
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Currency symbol"><input value={s.currency || ''} onChange={e => set('currency', e.target.value)} style={inp} /></Field>
            <Field label="Academic year"><input value={s.academic_year || ''} onChange={e => set('academic_year', e.target.value)} placeholder="2026–27" style={inp} /></Field>
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '9px', padding: '10px 13px', fontSize: '12px', color: '#92400e', marginTop: '4px' }}>
            Working hours guide batch scheduling and teacher availability. Classes run within this window.
          </div>
        </Card>

        {/* System (read-only) */}
        <Card icon={<Users size={16} />} title="System">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: <GraduationCap size={15} />, label: 'Students', value: counts.students },
              { icon: <Users size={15} />, label: 'Teachers', value: counts.teachers },
              { icon: <CalendarDays size={15} />, label: 'Batches', value: counts.batches },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', background: '#f9fafb', border: '1px solid #f0f0f2', borderRadius: '9px' }}>
                <span style={{ color: '#9ca3af', display: 'flex' }}>{r.icon}</span>
                <span style={{ flex: 1, fontSize: '13px', color: '#374151' }}>{r.label}</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f' }}>{r.value}</span>
              </div>
            ))}
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Signed in as <strong>{adminEmail}</strong></div>
          </div>
        </Card>
      </div>
    </>
  )
}

const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontFamily: 'inherit', color: '#1d1d1f', background: '#fff', outline: 'none' }

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '14px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--navy)' }}>
        <span style={{ display: 'flex' }}>{icon}</span>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1d1d1f' }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{label}</span>
      {children}
    </label>
  )
}
