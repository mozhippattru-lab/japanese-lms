'use client'
import { useState } from 'react'
import { Printer, Sheet, Share2, Check } from 'lucide-react'
import { downloadCSV, printData, shareData, type Column, type Row } from '@/lib/export'

type Props = {
  title: string                 // used for file name, print header, share title
  columns: Column[]             // [{ key, label }]
  rows: Row[]                   // display-ready rows (values already formatted)
  fileName?: string             // optional override for the export file name
  subtitle?: string             // optional line under the print title (e.g. active filters)
  shareUrl?: string             // optional explicit URL to share
}

function TBtn({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 13px',
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer',
        fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'inherit', transition: 'all 130ms',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb' }}
    >
      {children}
    </button>
  )
}

export default function DataToolbar({ title, columns, rows, fileName, subtitle, shareUrl }: Props) {
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const disabled = rows.length === 0

  async function onShare() {
    const res = await shareData({
      title,
      text: `${title} — ${rows.length} record(s) from 日本語スクール`,
      url: shareUrl,
    })
    if (res === 'copied') { setShareState('copied'); setTimeout(() => setShareState('idle'), 1500) }
  }

  return (
    <div style={{ display: 'inline-flex', gap: '8px', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <TBtn title="Print" onClick={() => printData(title, columns, rows, subtitle)}>
        <Printer size={14} /> Print
      </TBtn>
      <TBtn title="Export to Excel (CSV)" onClick={() => downloadCSV(fileName || title.toLowerCase().replace(/\s+/g, '-'), columns, rows)}>
        <Sheet size={14} /> Excel
      </TBtn>
      <TBtn title="Share" onClick={onShare}>
        {shareState === 'copied' ? <><Check size={14} color="#22c55e" /> Copied</> : <><Share2 size={14} /> Share</>}
      </TBtn>
    </div>
  )
}
