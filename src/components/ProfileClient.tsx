'use client'
import { useState } from 'react'
import { updateOwnProfile } from '@/components/profile-actions'
import { resizeImageToDataUrl } from '@/lib/image'
import Avatar from '@/components/Avatar'
import ToastContainer, { useToast } from '@/components/Toast'
import { Camera, Trash2 } from 'lucide-react'

export type ProfileData = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  jlpt_level: string | null
  status: string | null
  avatar_url: string | null
}

const levelColor: Record<string, string> = { N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6' }

export default function ProfileClient({ profile }: { profile: ProfileData }) {
  const { toasts, toast, remove } = useToast()
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [phone, setPhone] = useState(profile.phone || '')
  const [avatar, setAvatar] = useState<string | null>(profile.avatar_url)
  const [saving, setSaving] = useState(false)
  const [photoBusy, setPhotoBusy] = useState(false)

  const bg = levelColor[profile.jlpt_level || ''] || 'var(--navy)'

  async function handleSave() {
    if (!fullName.trim()) { toast('Name cannot be empty', 'error'); return }
    setSaving(true)
    const { error } = await updateOwnProfile({ full_name: fullName.trim(), phone: phone.trim() || null, avatar_url: avatar })
    if (error) { toast(error, 'error'); setSaving(false); return }
    toast('Profile saved', 'success')
    setSaving(false)
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={remove} />

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>My Profile</h1>
        <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Update your photo and personal details</p>
      </div>

      <div style={{ maxWidth: '560px', background: '#fff', border: '1px solid #ececef', borderRadius: '14px', padding: '24px' }}>
        {/* Photo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
          <Avatar url={avatar} name={fullName || profile.email} size={84} bg={bg} fontSize={32} />
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 15px', background: 'var(--navy)', color: '#fff', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: photoBusy ? 'wait' : 'pointer', fontFamily: 'inherit' }}>
                <Camera size={15} /> {photoBusy ? 'Processing…' : 'Choose from gallery'}
                <input type="file" accept="image/*" disabled={photoBusy} style={{ display: 'none' }} onChange={async e => {
                  const f = e.target.files?.[0]; if (!f) return
                  setPhotoBusy(true)
                  try { setAvatar(await resizeImageToDataUrl(f)) }
                  catch (err) { toast((err as Error).message, 'error') }
                  setPhotoBusy(false); e.target.value = ''
                }} />
              </label>
              {avatar && (
                <button type="button" onClick={() => setAvatar(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', background: '#fef2f2', color: '#e84040', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}><Trash2 size={14} /> Remove</button>
              )}
            </div>
            <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>Square images look best. Saved as a small thumbnail.</p>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ display: 'block' }}>
            <span style={lbl}>Full Name</span>
            <input value={fullName} onChange={e => setFullName(e.target.value)} style={inp} />
          </label>
          <label style={{ display: 'block' }}>
            <span style={lbl}>Phone</span>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 …" style={inp} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <label style={{ display: 'block' }}>
              <span style={lbl}>Email</span>
              <input value={profile.email || ''} disabled style={{ ...inp, background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }} />
            </label>
            <label style={{ display: 'block' }}>
              <span style={lbl}>{profile.role === 'teacher' ? 'Specialization' : 'JLPT Level'}</span>
              <input value={profile.jlpt_level || '—'} disabled style={{ ...inp, background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }} />
            </label>
          </div>
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Email and {profile.role === 'teacher' ? 'specialization' : 'level / batch'} are managed by your institute admin.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '11px 22px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </div>
    </>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }
const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontFamily: 'inherit', color: '#1d1d1f', background: '#fff', outline: 'none' }
