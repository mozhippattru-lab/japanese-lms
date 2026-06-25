'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

const PETALS = [
  { left: '8%',  delay: '0s',    dur: '7s',  size: 9,  drift: 25 },
  { left: '15%', delay: '1.2s',  dur: '9s',  size: 7,  drift: -20 },
  { left: '22%', delay: '3s',    dur: '8s',  size: 11, drift: 30 },
  { left: '30%', delay: '0.5s',  dur: '10s', size: 8,  drift: -15 },
  { left: '38%', delay: '2s',    dur: '6s',  size: 6,  drift: 20 },
  { left: '45%', delay: '4s',    dur: '8.5s',size: 10, drift: -25 },
  { left: '52%', delay: '1s',    dur: '7.5s',size: 7,  drift: 18 },
  { left: '60%', delay: '3.5s',  dur: '9s',  size: 9,  drift: -30 },
  { left: '67%', delay: '0.8s',  dur: '8s',  size: 6,  drift: 22 },
  { left: '74%', delay: '2.5s',  dur: '11s', size: 12, drift: -18 },
  { left: '80%', delay: '1.5s',  dur: '7s',  size: 8,  drift: 28 },
  { left: '88%', delay: '3.8s',  dur: '9.5s',size: 7,  drift: -22 },
  { left: '5%',  delay: '5s',    dur: '8s',  size: 10, drift: 15 },
  { left: '93%', delay: '4.5s',  dur: '7.5s',size: 8,  drift: -28 },
  { left: '55%', delay: '6s',    dur: '10s', size: 6,  drift: 20 },
  { left: '42%', delay: '7s',    dur: '8s',  size: 9,  drift: -15 },
  { left: '71%', delay: '5.5s',  dur: '9s',  size: 7,  drift: 25 },
  { left: '27%', delay: '6.5s',  dur: '11s', size: 11, drift: -20 },
]

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
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── Cherry blossom night background ── */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(180deg, #050210 0%, #0e0720 18%, #1c0d35 36%, #30104a 52%, #4a1040 68%, #2a0c2e 84%, #120818 100%)',
      }}>
        {/* Moon */}
        <div style={{
          position: 'absolute', top: '8%', right: '12%',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 38%, #fffde8 0%, #fef9c3 40%, #fef08a 100%)',
          boxShadow: '0 0 40px 20px rgba(254,249,195,0.18), 0 0 80px 40px rgba(254,240,138,0.09)',
        }} />

        {/* Left tree silhouette */}
        <svg aria-hidden="true" viewBox="0 0 260 520" style={{ position: 'absolute', bottom: 0, left: '-10px', height: '72%', width: 'auto', opacity: 0.92 }} fill="#1a0828">
          {/* trunk */}
          <rect x="115" y="280" width="30" height="240" rx="8" />
          {/* main branches */}
          <path d="M130 300 Q60 240 10 200 Q50 220 100 250 Q70 180 30 140 Q80 180 120 230 Q100 160 80 100 Q120 160 128 240 Q140 160 160 100 Q140 160 130 230 Q170 180 210 140 Q180 190 165 250 Q200 220 240 200 Q200 240 155 295 Z" />
          {/* flower clusters */}
          <circle cx="15"  cy="190" r="28" fill="#3d1540" /><circle cx="40"  cy="170" r="22" fill="#4a1848" /><circle cx="25"  cy="155" r="18" fill="#3d1540" />
          <circle cx="75"  cy="130" r="24" fill="#4a1848" /><circle cx="55"  cy="115" r="20" fill="#3d1540" /><circle cx="95"  cy="110" r="22" fill="#4a1848" />
          <circle cx="120" cy="95"  r="26" fill="#3d1540" /><circle cx="100" cy="80"  r="22" fill="#4a1848" /><circle cx="135" cy="78"  r="20" fill="#3d1540" />
          <circle cx="160" cy="105" r="24" fill="#4a1848" /><circle cx="180" cy="120" r="20" fill="#3d1540" /><circle cx="200" cy="135" r="22" fill="#4a1848" />
          <circle cx="220" cy="165" r="26" fill="#3d1540" /><circle cx="238" cy="190" r="20" fill="#4a1848" />
          {/* pink bloom overlay */}
          <circle cx="15"  cy="190" r="25" fill="#c06090" opacity="0.35" /><circle cx="40"  cy="170" r="19" fill="#d070a0" opacity="0.35" />
          <circle cx="75"  cy="130" r="21" fill="#c06090" opacity="0.35" /><circle cx="95"  cy="110" r="19" fill="#d070a0" opacity="0.35" />
          <circle cx="120" cy="95"  r="23" fill="#c06090" opacity="0.35" /><circle cx="160" cy="105" r="21" fill="#d070a0" opacity="0.35" />
          <circle cx="220" cy="165" r="23" fill="#c06090" opacity="0.35" /><circle cx="238" cy="190" r="18" fill="#d070a0" opacity="0.35" />
        </svg>

        {/* Right tree silhouette */}
        <svg aria-hidden="true" viewBox="0 0 220 480" style={{ position: 'absolute', bottom: 0, right: '-10px', height: '65%', width: 'auto', opacity: 0.88 }} fill="#1a0828">
          <rect x="95" y="270" width="26" height="210" rx="7" />
          <path d="M108 280 Q50 225 5 185 Q45 210 90 240 Q55 170 20 120 Q70 168 105 225 Q90 145 75 85 Q110 150 110 225 Q125 140 145 80 Q130 155 118 230 Q155 168 190 120 Q165 178 140 245 Q185 210 215 185 Q185 228 135 278 Z" />
          <circle cx="8"   cy="178" r="24" fill="#3d1540" /><circle cx="32"  cy="158" r="20" fill="#4a1848" />
          <circle cx="65"  cy="118" r="22" fill="#3d1540" /><circle cx="85"  cy="100" r="20" fill="#4a1848" />
          <circle cx="108" cy="82"  r="24" fill="#3d1540" /><circle cx="130" cy="90"  r="20" fill="#4a1848" />
          <circle cx="155" cy="110" r="22" fill="#3d1540" /><circle cx="185" cy="140" r="20" fill="#4a1848" />
          <circle cx="210" cy="175" r="22" fill="#3d1540" />
          <circle cx="8"   cy="178" r="21" fill="#d070a0" opacity="0.35" /><circle cx="65"  cy="118" r="19" fill="#c06090" opacity="0.35" />
          <circle cx="108" cy="82"  r="21" fill="#d070a0" opacity="0.35" /><circle cx="155" cy="110" r="19" fill="#c06090" opacity="0.35" />
          <circle cx="210" cy="175" r="19" fill="#d070a0" opacity="0.35" />
        </svg>

        {/* Ground glow */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', background: 'linear-gradient(0deg, rgba(180,60,120,0.18) 0%, transparent 100%)' }} />

        {/* Falling petals */}
        {PETALS.map((p, i) => (
          <div key={i} className="sakura-petal" style={{
            left: p.left,
            width: p.size + 'px', height: p.size + 'px',
            animationDelay: p.delay, animationDuration: p.dur,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ['--drift' as any]: p.drift + 'px',
          }} />
        ))}
      </div>

      {/* ── Card (z-index above background) ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', maxWidth: '780px', width: '100%',
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 32px 100px rgba(0,0,0,0.7)',
      }}>

        {/* ── Left: fist panel ── */}
        <div className="login-img-panel" style={{
          flex: '0 0 300px', background: 'rgba(13,18,40,0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px 28px', gap: '16px',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/12.png" alt="" aria-hidden="true"
            style={{ width: '100%', maxWidth: '240px', height: 'auto', filter: 'invert(1)', opacity: 0.9 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
            <div style={{
              width: '40px', height: '40px', background: 'var(--red)', borderRadius: '10px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(232,64,64,0.4)',
              fontFamily: 'var(--display)', fontWeight: 700, fontSize: '20px', color: '#fff',
            }}>本</div>
            <div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '18px', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.3 }}>மொழிப்பற்று</div>
              <div style={{ fontSize: '9px', color: 'var(--gold-soft)', letterSpacing: '0.09em', textTransform: 'uppercase', marginTop: '4px' }}>Japanese Language School</div>
            </div>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', padding: '44px 40px' }}>

          <p style={{ fontFamily: 'var(--display)', fontSize: '13px', color: '#c06080', letterSpacing: '0.04em', margin: '0 0 4px' }}>おかえりなさい</p>
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
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email Address</label>
              <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
            </div>

            <div style={{ marginBottom: '26px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password" style={{ paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: '2px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#9ca3af' : 'var(--red)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 150ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 14px rgba(232,64,64,0.28)' }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = '#d63030'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--red)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none' } }}
              onMouseDown={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)' }}>
              {loading ? <><span className="spinner" />Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#9ca3af' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--red)', fontWeight: '700', textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>

      <style>{`
        .login-img-panel { display: flex !important; }
        @media (max-width: 580px) { .login-img-panel { display: none !important; } }

        .sakura-petal {
          position: absolute;
          top: -20px;
          border-radius: 150% 0 150% 0;
          background: radial-gradient(circle at 40% 40%, #ffccd5, #f472b6);
          opacity: 0.85;
          animation: sakura-fall linear infinite;
          transform-origin: center center;
        }
        @keyframes sakura-fall {
          0%   { transform: translateY(-30px) translateX(0px) rotate(0deg); opacity: 0.9; }
          25%  { transform: translateY(25vh) translateX(var(--drift)) rotate(90deg); opacity: 0.8; }
          50%  { transform: translateY(50vh) translateX(0px) rotate(180deg); opacity: 0.7; }
          75%  { transform: translateY(75vh) translateX(calc(var(--drift) * -0.5)) rotate(270deg); opacity: 0.5; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
