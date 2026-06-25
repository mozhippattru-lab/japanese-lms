'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { School, Eye, EyeOff, AlertCircle, Building2 } from 'lucide-react'

type CollegeOpt = { id: string; name: string; join_code: string | null }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [colleges, setColleges] = useState<CollegeOpt[]>([])
  const [collegeId, setCollegeId] = useState('')
  const [lockedCollege, setLockedCollege] = useState<CollegeOpt | null>(null)

  // Load active colleges + detect ?college=CODE join link
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
      // Tag + auto-enroll into the college if chosen
      if (form.role === 'student' && collegeId) {
        try {
          await fetch('/api/college/join', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ college_id: collegeId }),
          })
        } catch { /* non-fatal: profile still created */ }
      }
      router.push(`/dashboard/${form.role}`)
    }
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--red)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 8px 32px rgba(232,64,64,0.4)' }}>
            <School size={30} color="#fff" strokeWidth={2} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.02em' }}>日本語スクール</h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Create your account</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px', color: 'var(--navy)' }}>Get started</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 24px' }}>Fill in your details to create an account</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fef2f2', color: '#dc2626', padding: '11px 14px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />{error}
            </div>
          )}

          {lockedCollege && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px' }}>
              <Building2 size={18} color="#d97706" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '13px', color: '#92400e' }}>
                You&rsquo;re joining as a student of <strong>{lockedCollege.name}</strong>. Complete sign-up and you&rsquo;ll be added to your college&rsquo;s class automatically.
              </div>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Full Name</label>
              <input className="input-field" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Tanaka Yuki" autoComplete="name" />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email Address</label>
              <input className="input-field" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" autoComplete="email" />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-field"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required placeholder="Min. 6 characters" minLength={6}
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide' : 'Show'}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: '2px', transition: 'color 150ms ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!lockedCollege && (
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>I am a</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', outline: 'none', background: '#fff', color: 'var(--navy)', fontFamily: 'inherit', cursor: 'pointer', transition: 'border-color 150ms, box-shadow 150ms' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,64,64,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {!lockedCollege && form.role === 'student' && colleges.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>College (optional)</label>
                <select value={collegeId} onChange={e => setCollegeId(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', outline: 'none', background: '#fff', color: 'var(--navy)', fontFamily: 'inherit', cursor: 'pointer' }}
                >
                  <option value="">— I&rsquo;m not from a college —</option>
                  {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#9ca3af' : 'var(--red)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 150ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 14px rgba(232,64,64,0.28)' }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = '#d63030'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--red)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none' } }}
            >
              {loading ? <><span className="spinner" />Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#9ca3af' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--red)', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
