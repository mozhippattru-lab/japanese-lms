import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BlockedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role === 'admin') redirect('/dashboard/admin')

  const db = createAdminClient()
  const { data: settings } = await db.from('app_settings').select('blocked_message, maintenance_mode, student_login_blocked, teacher_login_blocked').eq('id', 'default').single()

  const message = settings?.blocked_message || 'Access is temporarily paused. Please contact your teacher for more information.'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #fdf8f4 0%, #f5f0e8 100%)',
      fontFamily: 'Inter, sans-serif', padding: '24px',
    }}>
      <div style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: '#fef2f2', border: '2px solid #fecaca',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '32px',
        }}>🔒</div>

        <div style={{ fontFamily: 'var(--display, serif)', fontSize: '12px', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
          {settings?.maintenance_mode ? 'Maintenance Mode' : 'Access Restricted'}
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1d1d1f', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
          {settings?.maintenance_mode ? 'We\'ll be back soon' : 'Dashboard access paused'}
        </h1>

        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, margin: '0 0 28px', padding: '0 8px' }}>
          {message}
        </p>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Contact</div>
          <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.8 }}>
            📞 +91 90928 82957<br />
            ✉️ japanese.school@mozhippattru.org
          </div>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button type="submit" style={{
            padding: '12px 28px', background: 'var(--red, #e84040)', color: '#fff',
            border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Sign out
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'none' }}>← Back to homepage</Link>
        </div>
      </div>
    </div>
  )
}
