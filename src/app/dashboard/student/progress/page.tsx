import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { TrendingUp, Award, Target, BookOpen, Headphones, FileText, ClipboardCheck } from 'lucide-react'

const LEVEL_COLORS: Record<string, string> = {
  N5: '#22c55e', N4: '#2d7dd2', N3: '#f59e0b', N2: '#e84040', N1: '#8b5cf6',
}

const SKILLS = [
  { skill: 'Vocabulary', pct: 72, color: '#e84040', icon: <BookOpen size={14} /> },
  { skill: 'Grammar',    pct: 58, color: '#2d7dd2', icon: <FileText size={14} /> },
  { skill: 'Reading',    pct: 64, color: '#22c55e', icon: <BookOpen size={14} /> },
  { skill: 'Listening',  pct: 45, color: '#f59e0b', icon: <Headphones size={14} /> },
  { skill: 'Writing',    pct: 50, color: '#8b5cf6', icon: <ClipboardCheck size={14} /> },
]

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']

export default async function StudentProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  const currentLevel = profile?.jlpt_level || 'N5'
  const levelIndex = LEVELS.indexOf(currentLevel)
  const lc = LEVEL_COLORS[currentLevel] || '#22c55e'

  const card: React.CSSProperties = { background: '#fff', borderRadius: '12px', border: '1px solid #ececef', padding: '20px' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1d1d1f', margin: 0, letterSpacing: '-0.02em' }}>My Progress</h1>
          <p style={{ color: '#6e6e73', fontSize: '13px', marginTop: '3px' }}>Track your JLPT journey and skill development</p>
        </div>

        {/* Level Journey */}
        <div style={{ ...card, marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>JLPT Journey</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            {LEVELS.map((level, i) => {
              const lIdx = LEVELS.indexOf(level)
              const passed = lIdx < levelIndex
              const current = lIdx === levelIndex
              const future = lIdx > levelIndex
              const color = LEVEL_COLORS[level]
              return (
                <div key={level} style={{ display: 'flex', alignItems: 'center', flex: i < LEVELS.length - 1 ? '1' : undefined }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
                    <div style={{
                      width: current ? '48px' : '36px',
                      height: current ? '48px' : '36px',
                      borderRadius: '50%',
                      background: future ? '#f3f4f6' : color + (passed ? '30' : ''),
                      border: `2.5px solid ${future ? '#e5e7eb' : color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: future ? '#d1d5db' : color,
                      fontWeight: '800', fontSize: current ? '13px' : '11px',
                      boxShadow: current ? `0 0 0 4px ${color}20` : 'none',
                      transition: 'all 300ms',
                    }}>
                      {passed ? '✓' : level}
                    </div>
                    {current && <span style={{ fontSize: '10px', fontWeight: '700', color, background: color + '18', padding: '2px 8px', borderRadius: '99px' }}>Current</span>}
                    {!current && <span style={{ fontSize: '10px', color: future ? '#d1d5db' : '#9ca3af', fontWeight: '500' }}>{passed ? 'Done' : 'Next'}</span>}
                  </div>
                  {i < LEVELS.length - 1 && (
                    <div style={{ flex: 1, height: '2px', background: lIdx < levelIndex ? color : '#e5e7eb', margin: '0 4px', marginBottom: '20px' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

          {/* Skill Breakdown */}
          <div style={card}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Performance</div>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 16px', letterSpacing: '-0.01em' }}>Skill Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SKILLS.map(({ skill, pct, color, icon }) => (
                <div key={skill}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#374151' }}>
                      <span style={{ color, display: 'flex' }}>{icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>{skill}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color }}>{pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: '#fffbeb', borderRadius: '9px', fontSize: '12px', color: '#92400e', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Target size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
              Focus on Listening and Grammar to boost your overall {currentLevel} score.
            </div>
          </div>

          {/* Mock Test Scores */}
          <div style={card}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Results</div>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 16px', letterSpacing: '-0.01em' }}>Recent Test Scores</h2>
            {[
              { test: `${currentLevel} Mock Exam #3`, score: 68, max: 100, date: 'Jun 10' },
              { test: 'Vocabulary Quiz #12',           score: 18, max: 20,  date: 'Jun 8' },
              { test: 'Grammar Test #7',               score: 14, max: 20,  date: 'Jun 5' },
              { test: 'Kanji Recognition #5',          score: 22, max: 30,  date: 'Jun 1' },
            ].map((t, i, arr) => {
              const pct = t.score / t.max
              const sc = pct >= 0.8 ? '#22c55e' : pct >= 0.6 ? '#f59e0b' : '#e84040'
              return (
                <div key={t.test} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>{t.test}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{t.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: sc, letterSpacing: '-0.02em' }}>{t.score}</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>/{t.max}</span>
                  </div>
                </div>
              )
            })}
            <div style={{ marginTop: '12px', textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: '8px', fontSize: '11px', color: '#9ca3af' }}>
              Full test history and analytics coming soon
            </div>
          </div>

          {/* JLPT Level Overview */}
          <div style={{ ...card, gridColumn: 'span 2' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Current Level</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: lc + '18', border: `3px solid ${lc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: lc }}>{currentLevel}</span>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 4px' }}>
                  {currentLevel === 'N5' ? 'Basic Japanese' :
                   currentLevel === 'N4' ? 'Elementary Japanese' :
                   currentLevel === 'N3' ? 'Intermediate Japanese' :
                   currentLevel === 'N2' ? 'Upper Intermediate Japanese' : 'Advanced Japanese'}
                </h2>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 10px' }}>
                  {currentLevel === 'N5' ? 'Understand basic Japanese used in everyday situations' :
                   currentLevel === 'N4' ? 'Understand basic Japanese encountered in everyday situations' :
                   currentLevel === 'N3' ? 'Understand Japanese used in everyday situations to a certain degree' :
                   currentLevel === 'N2' ? 'Understand Japanese used in everyday situations and in a variety of circumstances' :
                   'Understand Japanese used in a variety of circumstances at a high level'}
                </p>
                {levelIndex < LEVELS.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
                    <Award size={14} color={lc} />
                    Next milestone: <strong style={{ color: LEVEL_COLORS[LEVELS[levelIndex + 1]] }}>{LEVELS[levelIndex + 1]}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
