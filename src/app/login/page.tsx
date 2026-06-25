'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      router.push(`/dashboard/${profile?.role || 'student'}`)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'Inter, sans-serif',
    }}>
      {/* Unified split card */}
      <div style={{
        display: 'flex', maxWidth: '780px', width: '100%',
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 32px 100px rgba(0,0,0,0.5)',
      }}>

        {/* ── Left: fist panel ── */}
        <div className="login-img-panel" style={{
          flex: '0 0 260px', background: '#0d1228',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '40px 24px', gap: '24px',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/12.png"
            alt=""
            aria-hidden="true"
            style={{ width: '100%', maxWidth: '200px', height: 'auto', filter: 'invert(1)', opacity: 0.9 }}
          />
          {/* Brand below fist */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '36px', height: '36px', background: 'var(--red)', borderRadius: '10px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(232,64,64,0.4)',
                fontFamily: 'var(--display)', fontWeight: 700, fontSize: '18px', color: '#fff',
              }}>学</div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '17px', color: '#fff', letterSpacing: '-0.01em' }}>மொழிப்பற்று</div>
            </div>
            <div style={{ fontSize: '9px', color: 'var(--gold-soft)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Japanese Language Center</div>
          </div>
        </div>

        {/* ── Right: form only ── */}
        <div style={{ flex: 1, background: '#fff', padding: '44px 40px' }}>

          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: 'var(--navy)', letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 26px' }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Email Address
              </label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: '26px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: '2px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', background: loading ? '#9ca3af' : 'var(--red)',
                color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px',
                fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 150ms ease', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(232,64,64,0.28)',
              }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = '#d63030'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--red)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none' } }}
              onMouseDown={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)' }}
            >
              {loading ? <><span className="spinner" />Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#9ca3af' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--red)', fontWeight: '700', textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>

      <style>{`.login-img-panel { display: flex !important; } @media (max-width: 580px) { .login-img-panel { display: none !important; } }`}</style>
    </div>
  )
}
