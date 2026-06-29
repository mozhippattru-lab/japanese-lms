'use client'
import { useState } from 'react'
import ToastContainer, { useToast } from '@/components/Toast'
import {
  Building2, Clock, Users, GraduationCap, CalendarDays, Save,
  ShieldOff, Bell, IndianRupee, Lock, Unlock, AlertTriangle,
  BookOpen, UserX, RefreshCw,
} from 'lucide-react'

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
  // Access control
  student_login_blocked?: boolean | null
  teacher_login_blocked?: boolean | null
  new_registrations_open?: boolean | null
  maintenance_mode?: boolean | null
  blocked_message?: string | null
  // Notifications
  whatsapp_notifications?: boolean | null
  email_notifications?: boolean | null
  fee_reminders_enabled?: boolean | null
  fee_reminder_days?: number | null
  // Finance
  late_fee_pct?: number | null
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
    tagline: initial.tagline ?? 'Japanese Language School',
    address: initial.address ?? '',
    phone: initial.phone ?? '',
    email: initial.email ?? '',
    registration_no: initial.registration_no ?? '',
    working_start: initial.working_start ?? '09:00 AM',
    working_end: initial.working_end ?? '07:00 PM',
    currency: initial.currency ?? '₹',
    academic_year: initial.academic_year ?? '',
    student_login_blocked: initial.student_login_blocked ?? false,
    teacher_login_blocked: initial.teacher_login_blocked ?? false,
    new_registrations_open: initial.new_registrations_open ?? true,
    maintenance_mode: initial.maintenance_mode ?? false,
    blocked_message: initial.blocked_message ?? '',
    whatsapp_notifications: initial.whatsapp_notifications ?? true,
    email_notifications: initial.email_notifications ?? true,
    fee_reminders_enabled: initial.fee_reminders_enabled ?? false,
    fee_reminder_days: initial.fee_reminder_days ?? 3,
    late_fee_pct: initial.late_fee_pct ?? 0,
  })
  const [saving, setSaving] = useState(false)

  const set = (k: keyof AppSettings, v: string | boolean | number) => setS(p => ({ ...p, [k]: v }))
  const toggle = (k: keyof AppSettings) => setS(p => ({ ...p, [k]: !p[k] }))

  async function save() {
    setSaving(true)
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    })
    const data = await res.json()
    if (!res.ok) { toast(data.error || 'Failed to save', 'error'); setSaving(false); return }
    toast('Settings saved', 'success')
    setSaving(false)
  }

  const anyBlocked = s.student_login_blocked || s.teacher_login_blocked || s.maintenance_mode

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'var(--display)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '0.04em', margin: '0 0 6px' }}>設定 · Settings</p>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Settings</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '13px', marginTop: '6px' }}>Institute configuration, access control and preferences</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {anyBlocked && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
              <ShieldOff size={13} /> Access restricted
            </div>
          )}
          <button onClick={save} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 20px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

        {/* Institute Details */}
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

        {/* Access Control */}
        <Card icon={<ShieldOff size={16} />} title="Access Control">
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', lineHeight: 1.5 }}>
            Blocked users see a message and cannot access their dashboard. Admin is never blocked.
          </div>

          <Toggle
            label="Block student logins"
            sublabel="Students cannot log in or access the dashboard"
            icon={<GraduationCap size={15} />}
            checked={!!s.student_login_blocked}
            onChange={() => toggle('student_login_blocked')}
            danger
          />
          <Toggle
            label="Block teacher logins"
            sublabel="Teachers cannot log in or access the dashboard"
            icon={<UserX size={15} />}
            checked={!!s.teacher_login_blocked}
            onChange={() => toggle('teacher_login_blocked')}
            danger
          />
          <Toggle
            label="Close new registrations"
            sublabel="New students cannot register on the website"
            icon={<Lock size={15} />}
            checked={!s.new_registrations_open}
            onChange={() => set('new_registrations_open', !s.new_registrations_open)}
            danger
          />
          <Toggle
            label="Maintenance mode"
            sublabel="All non-admin users see a maintenance message"
            icon={<RefreshCw size={15} />}
            checked={!!s.maintenance_mode}
            onChange={() => toggle('maintenance_mode')}
            danger
          />

          <Field label="Custom blocked message (shown to blocked users)">
            <textarea
              value={s.blocked_message || ''}
              onChange={e => set('blocked_message', e.target.value)}
              rows={2}
              placeholder="e.g. Access is temporarily paused. Please contact your teacher."
              style={{ ...inp, resize: 'vertical', fontSize: '13px' }}
            />
          </Field>
        </Card>

        {/* Notifications */}
        <Card icon={<Bell size={16} />} title="Notifications">
          <Toggle
            label="WhatsApp notifications"
            sublabel="Send fee reminders and alerts via WhatsApp"
            icon={<span style={{ fontSize: '14px' }}>💬</span>}
            checked={!!s.whatsapp_notifications}
            onChange={() => toggle('whatsapp_notifications')}
          />
          <Toggle
            label="Email notifications"
            sublabel="Send receipts, reminders and alerts via email"
            icon={<span style={{ fontSize: '14px' }}>✉️</span>}
            checked={!!s.email_notifications}
            onChange={() => toggle('email_notifications')}
          />
          <Toggle
            label="Automatic fee reminders"
            sublabel="Send reminder X days before due date"
            icon={<IndianRupee size={15} />}
            checked={!!s.fee_reminders_enabled}
            onChange={() => toggle('fee_reminders_enabled')}
          />
          {s.fee_reminders_enabled && (
            <Field label="Days before due date to send reminder">
              <input
                type="number" min={1} max={30}
                value={s.fee_reminder_days ?? 3}
                onChange={e => set('fee_reminder_days', Number(e.target.value))}
                style={{ ...inp, width: '100px' }}
              />
            </Field>
          )}
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
        </Card>

        {/* Finance */}
        <Card icon={<IndianRupee size={16} />} title="Finance">
          <Field label="Late fee penalty (%)">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number" min={0} max={100} step={0.5}
                value={s.late_fee_pct ?? 0}
                onChange={e => set('late_fee_pct', Number(e.target.value))}
                style={{ ...inp, width: '100px' }}
              />
              <span style={{ fontSize: '13px', color: '#6b7280' }}>% of overdue amount, added per month</span>
            </div>
          </Field>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '9px', padding: '10px 13px', fontSize: '12px', color: '#166534' }}>
            Set to 0 to disable late fees. Applied automatically on invoices past their due date.
          </div>
        </Card>

        {/* System */}
        <Card icon={<Users size={16} />} title="System">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: <GraduationCap size={15} />, label: 'Active Students', value: counts.students, color: '#22c55e' },
              { icon: <BookOpen size={15} />, label: 'Active Teachers', value: counts.teachers, color: '#2d7dd2' },
              { icon: <CalendarDays size={15} />, label: 'Active Batches', value: counts.batches, color: '#f59e0b' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', background: '#f9fafb', border: '1px solid #f0f0f2', borderRadius: '9px' }}>
                <span style={{ color: r.color, display: 'flex' }}>{r.icon}</span>
                <span style={{ flex: 1, fontSize: '13px', color: '#374151' }}>{r.label}</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#1d1d1f' }}>{r.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 13px', background: s.student_login_blocked ? '#fef2f2' : '#f9fafb', border: `1px solid ${s.student_login_blocked ? '#fecaca' : '#f0f0f2'}`, borderRadius: '9px' }}>
              {s.student_login_blocked ? <Lock size={14} color="#dc2626" /> : <Unlock size={14} color="#22c55e" />}
              <span style={{ fontSize: '13px', color: s.student_login_blocked ? '#dc2626' : '#374151', fontWeight: s.student_login_blocked ? 600 : 400 }}>
                Student access — {s.student_login_blocked ? 'BLOCKED' : 'Open'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 13px', background: s.teacher_login_blocked ? '#fef2f2' : '#f9fafb', border: `1px solid ${s.teacher_login_blocked ? '#fecaca' : '#f0f0f2'}`, borderRadius: '9px' }}>
              {s.teacher_login_blocked ? <Lock size={14} color="#dc2626" /> : <Unlock size={14} color="#22c55e" />}
              <span style={{ fontSize: '13px', color: s.teacher_login_blocked ? '#dc2626' : '#374151', fontWeight: s.teacher_login_blocked ? 600 : 400 }}>
                Teacher access — {s.teacher_login_blocked ? 'BLOCKED' : 'Open'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Signed in as <strong>{adminEmail}</strong></div>
          </div>
        </Card>

      </div>
    </>
  )
}

/* ── shared sub-components ───────────────────────────────────── */

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
  borderRadius: '9px', fontSize: '14px', fontFamily: 'inherit',
  color: '#1d1d1f', background: '#fff', outline: 'none', boxSizing: 'border-box',
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ececef', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--navy)' }}>
        <span style={{ display: 'flex' }}>{icon}</span>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1d1d1f', margin: 0 }}>{title}</h2>
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

function Toggle({ label, sublabel, icon, checked, onChange, danger }: {
  label: string; sublabel: string; icon: React.ReactNode
  checked: boolean; onChange: () => void; danger?: boolean
}) {
  const activeColor = danger ? '#dc2626' : '#22c55e'
  return (
    <div
      onClick={onChange}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
        background: checked && danger ? '#fef2f2' : checked ? '#f0fdf4' : '#f9fafb',
        border: `1px solid ${checked && danger ? '#fecaca' : checked ? '#bbf7d0' : '#f0f0f2'}`,
        transition: 'all 150ms ease', userSelect: 'none',
      }}
    >
      <span style={{ color: checked ? activeColor : '#9ca3af', display: 'flex', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: checked && danger ? '#dc2626' : '#1d1d1f' }}>{label}</div>
        <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '1px' }}>{sublabel}</div>
      </div>
      {/* pill toggle */}
      <div style={{
        width: '36px', height: '20px', borderRadius: '10px', flexShrink: 0,
        background: checked ? activeColor : '#d1d5db',
        position: 'relative', transition: 'background 200ms ease',
      }}>
        <div style={{
          position: 'absolute', top: '2px',
          left: checked ? '18px' : '2px',
          width: '16px', height: '16px', borderRadius: '50%',
          background: '#fff', transition: 'left 200ms ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  )
}
