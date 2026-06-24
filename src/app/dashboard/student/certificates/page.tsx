import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { Award, CheckCircle2, Download } from 'lucide-react'
import { DashStyles } from '@/components/DashboardKit'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']

export default async function StudentCertificatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  const currentLevel = profile?.jlpt_level || 'N5'
  const levelIndex = LEVELS.indexOf(currentLevel)

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main className="dash-main">

        <DashStyles />

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>Certificates</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Your course completions and JLPT achievements</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a1f3c 0%, #2d3461 100%)', borderRadius: '14px', padding: '24px 28px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={24} color="#f59e0b" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '0 0 4px' }}>Certificates &amp; Achievements</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
              Earn certificates upon completing levels and passing mock exams. Download and share your achievements.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '5px 12px', borderRadius: '99px', border: '1px solid rgba(245,158,11,0.3)', flexShrink: 0 }}>Coming Soon</span>
        </div>

        {/* Placeholder cert cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {LEVELS.slice(0, levelIndex + 1).map(level => {
            const lc = LEVEL_COLORS[level]
            const isLatest = level === currentLevel
            return (
              <div key={level} style={{
                background: '#fff', borderRadius: '14px', border: `2px solid ${isLatest ? lc : '#ececef'}`,
                padding: '20px', opacity: isLatest ? 1 : 0.55, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '60px', height: '60px', borderRadius: '50%', background: lc + '15' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: lc + '18', border: `2px solid ${lc}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={20} color={lc} />
                  </div>
                  {isLatest && <span style={{ fontSize: '10px', fontWeight: '700', color: lc, background: lc + '18', padding: '3px 9px', borderRadius: '99px' }}>Current</span>}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: lc, margin: '0 0 3px' }}>{level}</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 14px' }}>
                  {level === 'N5' ? 'Basic Japanese' :
                   level === 'N4' ? 'Elementary Japanese' :
                   level === 'N3' ? 'Intermediate Japanese' :
                   level === 'N2' ? 'Upper Intermediate' : 'Advanced Japanese'} · Course Completion
                </p>
                <button disabled style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#f3f4f6', color: '#9ca3af', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'not-allowed', fontFamily: 'inherit' }}>
                  <Download size={13} />Download Certificate
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>What&apos;s coming</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Downloadable PDF certificates with QR verification',
              'Level completion badges for your profile',
              'Share certificates on LinkedIn and social media',
              'Official JLPT exam pass acknowledgements',
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
