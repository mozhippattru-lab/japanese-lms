'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, MailCheck, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading'); setError('')
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'Something went wrong. Please try again.'); setStatus('error'); return
    }
    setStatus('sent')
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <Link href="/login" style={back}><ArrowLeft size={14} /> Back to sign in</Link>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={iconCircle}><MailCheck size={30} /></div>
            <h1 style={title}>Check your email</h1>
            <p style={sub}>
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset your password.
              It may take a minute — please check your spam folder too.
            </p>
          </div>
        ) : (
          <>
            <p style={eyebrow}>ようこそ</p>
            <h1 style={title}>Forgot your password?</h1>
            <p style={sub}>Enter your email and we&apos;ll send you a link to set a new one.</p>

            {status === 'error' && (
              <div style={errBox}><AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} /> {error}</div>
            )}

            <form onSubmit={submit}>
              <label style={label}>Email address</label>
              <input className="input-field" type="email" required value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"
                style={input} />
              <button type="submit" disabled={status === 'loading'} style={btn(status === 'loading')}>
                {status === 'loading' ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
      </div>
      <style>{authFieldCss}</style>
    </div>
  )
}

// ── shared auth styles ──
export const wrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'linear-gradient(180deg, #f6f1e7 0%, #efe7d8 100%)', fontFamily: 'Inter, sans-serif' }
export const card: React.CSSProperties = { width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '16px', padding: '36px 32px', boxShadow: '0 24px 60px rgba(40,32,20,0.18)', border: '1px solid rgba(40,32,20,0.08)' }
export const back: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#6b7280', textDecoration: 'none', fontWeight: 600, marginBottom: '20px' }
export const eyebrow: React.CSSProperties = { fontFamily: "'Shippori Mincho', serif", fontSize: '13px', color: '#c06080', margin: '0 0 4px' }
export const title: React.CSSProperties = { fontSize: '22px', fontWeight: 800, color: '#1a1f3c', margin: '0 0 6px', letterSpacing: '-0.02em' }
export const sub: React.CSSProperties = { fontSize: '13.5px', color: '#6b7280', lineHeight: 1.6, margin: '0 0 22px' }
export const label: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 700, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }
export const input: React.CSSProperties = { marginBottom: '18px' }
export const errBox: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px' }
export const iconCircle: React.CSSProperties = { width: '64px', height: '64px', borderRadius: '50%', background: '#eefaf1', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }
export const btn = (loading: boolean): React.CSSProperties => ({ width: '100%', padding: '13px', background: loading ? '#9ca3af' : '#e84040', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 14px rgba(232,64,64,0.28)' })
export const authFieldCss = `.input-field{width:100%;padding:12px 13px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:14px;font-family:inherit;color:#1a1f3c;background:#fff;outline:none;transition:border-color 150ms,box-shadow 150ms;}.input-field:focus{border-color:#e84040;box-shadow:0 0 0 3px rgba(232,64,64,0.1);}`
