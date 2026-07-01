'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { wrap, card, eyebrow, title, sub, label, errBox, iconCircle, btn, authFieldCss } from '../forgot-password/page'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState<'checking' | 'ok' | 'invalid'>('checking')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  // Read the one-time token from the emailed link. Its validity is checked
  // server-side on submit.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    if (t) { setToken(t); setReady('ok') } else { setReady('invalid') }
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setStatus('error'); return }
    setStatus('loading'); setError('')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'Could not reset password.'); setStatus('error'); return
    }
    setStatus('done')
    setTimeout(() => router.push('/login'), 1800)
  }

  return (
    <div style={wrap}>
      <div style={card}>
        {ready === 'checking' ? (
          <p style={{ ...sub, textAlign: 'center', margin: 0 }}>Verifying your reset link…</p>
        ) : ready === 'invalid' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...iconCircle, background: '#fef2f2', color: '#dc2626' }}><AlertCircle size={30} /></div>
            <h1 style={title}>Link expired or invalid</h1>
            <p style={sub}>This reset link is no longer valid. Please request a new one.</p>
            <Link href="/forgot-password" style={{ color: '#e84040', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>Request a new link</Link>
          </div>
        ) : status === 'done' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={iconCircle}><CheckCircle2 size={30} /></div>
            <h1 style={title}>Password updated</h1>
            <p style={sub}>You can now sign in with your new password. Redirecting…</p>
          </div>
        ) : (
          <>
            <p style={eyebrow}>ようこそ</p>
            <h1 style={title}>Set a new password</h1>
            <p style={sub}>Choose a strong password you don&apos;t use elsewhere.</p>

            {status === 'error' && (
              <div style={errBox}><AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} /> {error}</div>
            )}

            <form onSubmit={submit}>
              <label style={label}>New password</label>
              <div style={{ position: 'relative', marginBottom: '18px' }}>
                <input className="input-field" type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password"
                  style={{ paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="submit" disabled={status === 'loading'} style={btn(status === 'loading')}>
                {status === 'loading' ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
      <style>{authFieldCss}</style>
    </div>
  )
}
