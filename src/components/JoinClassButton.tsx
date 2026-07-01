'use client'

import { useEffect, useState } from 'react'
import { Video, Clock, PencilLine, Check, X } from 'lucide-react'
import { updateBatchMeetingLink } from '@/components/class-actions'
import { getClassState, parseSlot, isJoinable, type ClassState } from '@/lib/schedule'

type Props = {
  link?: string | null
  timeSlot?: string | null
  days?: string | string[] | null
  batchId?: string
  canEdit?: boolean
  joinLabel?: string // "Join Class" (student) or "Start Class" (teacher)
}

function startLabel(timeSlot?: string | null) {
  const r = parseSlot(timeSlot)
  if (!r) return null
  const h = Math.floor(r.startMin / 60), m = r.startMin % 60
  const ap = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 === 0 ? 12 : h % 12
  return `${hr}:${String(m).padStart(2, '0')} ${ap}`
}

export default function JoinClassButton({ link, timeSlot, days, batchId, canEdit, joinLabel = 'Join Class' }: Props) {
  const [state, setState] = useState<ClassState | null>(null)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(link || '')
  const [savedLink, setSavedLink] = useState(link || '')
  const [saving, setSaving] = useState(false)

  // Re-evaluate the live window on mount and every 30s (avoids SSR/CSR mismatch).
  useEffect(() => {
    const tick = () => setState(getClassState(timeSlot, days))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [timeSlot, days])

  async function save() {
    setSaving(true)
    const clean = value.trim()
    const { error } = await updateBatchMeetingLink(batchId!, clean || null)
    setSaving(false)
    if (error) { alert('Could not save the link: ' + error); return }
    setSavedLink(clean)
    setEditing(false)
  }

  const pill: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700,
    padding: '8px 14px', borderRadius: '99px', border: 'none', cursor: 'default', whiteSpace: 'nowrap',
  }

  if (editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <input
          value={value} onChange={e => setValue(e.target.value)} placeholder="Paste Zoom / Meet / Teams link"
          style={{ flex: 1, minWidth: '180px', padding: '8px 11px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
        />
        <button onClick={save} disabled={saving} style={{ ...pill, background: '#22c55e', color: '#fff', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          <Check size={13} /> {saving ? 'Saving…' : 'Save'}
        </button>
        <button onClick={() => { setValue(savedLink); setEditing(false) }} style={{ ...pill, background: '#f3f4f6', color: '#6b7280', cursor: 'pointer' }}>
          <X size={13} />
        </button>
      </div>
    )
  }

  const joinable = state != null && isJoinable(state) && !!savedLink
  const editBtn = canEdit ? (
    <button onClick={() => setEditing(true)} style={{ ...pill, background: '#f3f4f6', color: '#374151', cursor: 'pointer' }}>
      <PencilLine size={13} /> {savedLink ? 'Edit link' : 'Add link'}
    </button>
  ) : null

  // Joinable now
  if (joinable) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <a href={savedLink} target="_blank" rel="noopener noreferrer" style={{ ...pill, background: '#e84040', color: '#fff', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 12px rgba(232,64,64,0.3)' }}>
          <Video size={14} /> {joinLabel}
        </a>
        {editBtn}
      </div>
    )
  }

  // Not joinable — explain why
  let label = 'Not scheduled today'
  if (state === 'live' || state === 'soon') label = 'Link not added yet'
  else if (state === 'upcoming') label = `Starts ${startLabel(timeSlot) || 'later'}`
  else if (state === 'ended') label = 'Class ended'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      <span style={{ ...pill, background: '#f3f4f6', color: '#9ca3af' }}>
        <Clock size={13} /> {label}
      </span>
      {editBtn}
    </div>
  )
}
