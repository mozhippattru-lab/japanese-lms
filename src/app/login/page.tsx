'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { School, Eye, EyeOff, AlertCircle } from 'lucide-react'

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
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--red)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 32px rgba(232,64,64,0.4)' }}>
            <School size={30} color="#fff" strokeWidth={2} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.02em' }}>日本語センター</h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Japanese Language Center</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px', color: 'var(--navy)' }}>Welcome back</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: '2px', transition: 'color 150ms ease' }}
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
    </div>
  )
}
