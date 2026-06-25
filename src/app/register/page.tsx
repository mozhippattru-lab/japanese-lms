'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle, Building2 } from 'lucide-react'

type CollegeOpt = { id: string; name: string; join_code: string | null }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [showPw, setShowPw] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [colleges, setColleges] = useState<CollegeOpt[]>([])
  const [collegeId, setCollegeId] = useState('')
  const [lockedCollege, setLockedCollege] = useState<CollegeOpt | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('colleges').select('id, name, join_code').eq('status', 'Active').order('name')
      .then(({ data }) => {
        const list = (data || []) as CollegeOpt[]
        setColleges(list)
        const code = new URLSearchParams(window.location.search).get('college')
        if (code) {
          const match = list.find(c => c.join_code === code)
          if (match) { setLockedCollege(match); setCollegeId(match.id); setForm(f => ({ ...f, role: 'student' })) }
        }
      })
  }, [])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) { setError('Please agree to the Privacy Policy and Terms to continue.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.name, role: form.role } },
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: form.name, email: form.email, role: form.role })
      if (form.role === 'student' && collegeId) {
        try {
          await fetch('/api/college/join', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ college_id: collegeId }),
          })
        } catch { /* non-fatal */ }
      }
      router.push(`/dashboard/${form.role}`)
    }
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }
  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', fontFamily: 'inherit', color: '#1d1d1f', background: '#fff', outline: 'none' }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'Inter, sans-serif',
    }}>
      {/* Unified split card */}
      <div style={{
        display: 'flex', maxWidth: '820px', width: '100%',
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 32px 100px rgba(0,0,0,0.5)',
        alignItems: 'stretch',
      }}>

        {/* ── Left: fist panel ── */}
        <div className="login-img-panel" style={{
          flex: '0 0 300px', background: '#0d1228',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px 28px', gap: '16px',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/12.png"
            alt=""
            aria-hidden="true"
            style={{ width: '100%', maxWidth: '240px', height: 'auto', filter: 'invert(1)', opacity: 0.9 }}
          />
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
        <div style={{ flex: 1, background: '#fff', padding: '40px 36px', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 4px', color: 'var(--navy)', letterSpacing: '-0.02em' }}>Create your account</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 22px' }}>Fill in your details to get started</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '10px', marginBottom: '18px', fontSize: '13px' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />{error}
            </div>
          )}

          {lockedCollege && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px' }}>
              <Building2 size={18} color="#d97706" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '13px', color: '#92400e' }}>
                Joining as a student of <strong>{lockedCollege.name}</strong>. You&rsquo;ll be added to your college&rsquo;s class automatically.
              </div>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '13px' }}>
              <label style={labelStyle}>Full Name</label>
              <input className="input-field" style={inp} type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Tanaka Yuki" autoComplete="name" />
            </div>

            <div style={{ marginBottom: '13px' }}>
              <label style={labelStyle}>Email Address</label>
              <input className="input-field" style={inp} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" autoComplete="email" />
            </div>

            <div style={{ marginBottom: '13px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  style={{ ...inp, paddingRight: '44px' }}
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required placeholder="Min. 6 characters" minLength={6}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide' : 'Show'}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: '2px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!lockedCollege && (
              <div style={{ marginBottom: '13px' }}>
                <label style={labelStyle}>I am a</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {!lockedCollege && form.role === 'student' && colleges.length > 0 && (
              <div style={{ marginBottom: '13px' }}>
                <label style={labelStyle}>College (optional)</label>
                <select value={collegeId} onChange={e => setCollegeId(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  <option value="">— I&rsquo;m not from a college —</option>
                  {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            {/* Privacy / Terms agreement */}
            <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '20px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: '2px', width: '15px', height: '15px', accentColor: 'var(--red)', flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6 }}>
                I agree to the{' '}
                <Link href="/privacy" target="_blank" style={{ color: 'var(--red)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
                {' '}and{' '}
                <Link href="/terms" target="_blank" style={{ color: 'var(--red)', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>.
                {' '}We collect your name and email to manage your course enrollment and send you class updates.
              </span>
            </label>

            <button
              type="submit" disabled={loading || !agreed}
              style={{
                width: '100%', padding: '13px',
                background: (loading || !agreed) ? '#d1d5db' : 'var(--red)',
                color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px',
                fontWeight: '700', cursor: (loading || !agreed) ? 'not-allowed' : 'pointer',
                transition: 'all 150ms ease', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
                boxShadow: (loading || !agreed) ? 'none' : '0 4px 14px rgba(232,64,64,0.28)',
              }}
              onMouseEnter={e => { if (!loading && agreed) { (e.currentTarget as HTMLButtonElement).style.background = '#d63030'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (!loading && agreed) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--red)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none' } }}
            >
              {loading ? <><span className="spinner" />Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#9ca3af' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--red)', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`.login-img-panel { display: flex !important; } @media (max-width: 580px) { .login-img-panel { display: none !important; } }`}</style>
    </div>
  )
}
