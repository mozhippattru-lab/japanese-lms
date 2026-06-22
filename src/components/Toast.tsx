'use client'
import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  type: ToastType
  message: string
}

type Props = {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

const icons = {
  success: <CheckCircle size={16} color="#22c55e" />,
  error:   <XCircle    size={16} color="#e84040" />,
  info:    <Info       size={16} color="#2d7dd2" />,
}

export default function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastCard key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastCard({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  const [exiting, setExiting] = useState(false)

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onRemove(toast.id), 200)
  }, [toast.id, onRemove])

  useEffect(() => {
    const t = setTimeout(dismiss, 4000)
    return () => clearTimeout(t)
  }, [dismiss])

  return (
    <div className={`toast toast-${toast.type}${exiting ? ' toast-exit' : ''}`} role="alert" aria-live="polite">
      {icons[toast.type]}
      <span style={{ flex: 1, color: '#1a1f3c', lineHeight: 1.4 }}>{toast.message}</span>
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px', display: 'flex', alignItems: 'center', borderRadius: '4px', flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, toast, remove }
}
