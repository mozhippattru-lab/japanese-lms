'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

type Props = {
  title: string
  onClose: () => void
  children: React.ReactNode
  wide?: boolean
  maxWidth?: string
}

export default function Modal({ title, onClose, children, wide, maxWidth }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: '20px',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content"
        style={{
          background: '#fff', borderRadius: '16px', width: '100%',
          maxWidth: maxWidth || (wide ? '620px' : '520px'),
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px 16px', borderBottom: '1px solid var(--line-warm)',
        }}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '19px', fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'var(--paper-2)', border: 'none', borderRadius: '8px',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-soft)',
              transition: 'all 150ms ease', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e6dcc7'; e.currentTarget.style.color = 'var(--ink)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper-2)'; e.currentTarget.style.color = 'var(--ink-soft)' }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  )
}
