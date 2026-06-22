import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { MessageSquare, CheckCircle2 } from 'lucide-react'

export default async function StudentMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  const PREVIEW = [
    { from: 'Sensei Nakamura', time: '2h ago',    msg: 'Great work on the grammar test! Keep it up.' },
    { from: 'Admin Office',    time: 'Yesterday',  msg: 'Your fee receipt for June has been generated.' },
    { from: 'Sensei Priya',    time: '2 days ago', msg: 'Don\'t forget to submit your reading assignment.' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Messages</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Direct communication with teachers and admin</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a1f3c 0%, #2d3461 100%)', borderRadius: '14px', padding: '24px 28px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(232,64,64,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MessageSquare size={24} color="#e84040" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Messaging Centre</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Message your teachers directly, receive announcements, and stay in sync with the school.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '5px 12px', borderRadius: '99px', border: '1px solid rgba(245,158,11,0.3)', flexShrink: 0 }}>Coming Soon</span>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', overflow: 'hidden', marginBottom: '20px', opacity: 0.45, pointerEvents: 'none' }}>
          {PREVIEW.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 18px', borderBottom: i < PREVIEW.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#6b7280', fontSize: '14px', flexShrink: 0 }}>
                {m.from.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1d1d1f' }}>{m.from}</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{m.time}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.msg}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>What&apos;s coming</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Direct messaging with your teacher',
              'Class-wide announcements from admin',
              'Assignment submission notifications',
              'Fee reminders and receipt notifications',
            ].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#6b7280' }}>
                <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0 }} />{f}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
