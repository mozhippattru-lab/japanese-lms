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
          padding: '22px 24px 0',
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--navy)', margin: 0 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: '8px',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: '#6b7280',
              transition: 'background 150ms ease', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f3f4f6')}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: '18px 24px 24px' }}>{children}</div>
      </div>
    </div>
  )
}
