import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Sidebar from '@/components/Sidebar'
import { DashStyles, CardHead, Kpi } from '@/components/DashboardKit'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Motion'
import { Users, GraduationCap, ClipboardList, Calendar } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e', inactive: '#a39e93', completed: '#2d7dd2',
}

export default async function TeacherDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  const name = profile?.full_name || user.email || 'Teacher'
  const firstName = name.split(' ')[0]
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  // Teacher's batches and related data
  const db = createAdminClient()
  const [
    { data: myBatches },
    { data: pendingSubmissions },
  ] = await Promise.all([
    db.from('batches').select('id, name, level, status, time_slot, schedule').eq('teacher_id', user.id),
    db.from('submissions').select('id, student_id, assignment_id, status, created_at').eq('status', 'pending').limit(5),
  ])

  const activeBatches = (myBatches || []).filter(b => b.status === 'active')

  // Student count across teacher's batches
  let studentCount = 0
  if (activeBatches.length > 0) {
    const batchIds = activeBatches.map(b => b.id)
    const { count } = await db.from('profiles').select('*', { count: 'exact', head: true }).in('batch_id', batchIds).eq('status', 'active')
    studentCount = count ?? 0
  }

  // Pending grade count — submissions linked to assignments in teacher's batches
  const pendingGradeCount = pendingSubmissions?.length ?? 0

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={name} />
      <main className="dash-main">
        <DashStyles />

        <Reveal>
          <header className="dash-header">
            <div>
              <p className="dash-eyebrow">先生ダッシュボード · Teacher</p>
              <h1 className="dash-title">ようこそ、<span>{firstName}</span> 先生</h1>
              <p className="dash-subtitle">Your classes, students and grading at a glance.</p>
            </div>
            <div className="dash-datechip">
              <span className="dash-datechip-jp">先生</span>
              <span className="dash-datechip-sub">{today}</span>
            </div>
          </header>
        </Reveal>

        <Stagger className="dash-kpis">
          <StaggerItem><Kpi label="My Students"    value={String(studentCount)}      sub="in my batches"   icon={<Users size={18} />}         color="#2d7dd2" /></StaggerItem>
          <StaggerItem><Kpi label="My Batches"     value={String(activeBatches.length)} sub="active"       icon={<GraduationCap size={18} />} color="#e84040" /></StaggerItem>
          <StaggerItem><Kpi label="Pending Grades" value={String(pendingGradeCount)} sub="to review"       icon={<ClipboardList size={18} />} color="#c2974b" /></StaggerItem>
          <StaggerItem><Kpi label="Total Batches"  value={String((myBatches || []).length)} sub="assigned" icon={<Calendar size={18} />}      color="#22c55e" /></StaggerItem>
        </Stagger>

        <Reveal delay={0.12} className="dash-grid">
          {/* My batches */}
          <section className="dash-card">
            <CardHead jp="クラス" title="My Batches" href="/dashboard/teacher/classes" />
            {(!myBatches || myBatches.length === 0) ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '13px', padding: '12px 0' }}>No batches assigned yet.</p>
            ) : (
              <div className="dash-list">
                {myBatches.map((b) => {
                  const sc = STATUS_COLORS[b.status] ?? '#a39e93'
                  return (
                    <div key={b.id} className="dash-row accent" style={{ ['--c' as string]: sc }}>
                      <div>
                        <div className="dash-row-title">{b.name}</div>
                        <div className="dash-row-sub">JLPT {b.level}{b.time_slot ? ` · ${b.time_slot}` : ''}{b.schedule ? ` · ${b.schedule}` : ''}</div>
                      </div>
                      <span className="dash-chip" style={{ color: sc, background: sc + '18', textTransform: 'capitalize' }}>{b.status}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Pending submissions */}
          <section className="dash-card">
            <CardHead jp="採点" title="Pending Submissions" href="/dashboard/teacher/grading" />
            {(!pendingSubmissions || pendingSubmissions.length === 0) ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '13px', padding: '12px 0' }}>No pending submissions.</p>
            ) : (
              <div className="dash-list">
                {pendingSubmissions.map((s) => (
                  <div key={s.id} className="dash-row">
                    <div>
                      <div className="dash-row-title">Submission #{s.id.slice(0, 6)}</div>
                      <div className="dash-row-sub">{new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                    </div>
                    <button className="dash-btn dash-btn-navy">Grade</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Batch overview table */}
          <section className="dash-card dash-span2">
            <CardHead jp="バッチ概要" title="Batch Overview" href="/dashboard/teacher/classes" />
            {(!myBatches || myBatches.length === 0) ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '13px', padding: '12px 0' }}>No batches to show.</p>
            ) : (
              <div className="dash-tablewrap">
                <table className="dash-table">
                  <thead>
                    <tr>{['Batch', 'Level', 'Schedule', 'Time', 'Status'].map(h => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {myBatches.map((b) => {
                      const sc = STATUS_COLORS[b.status] ?? '#a39e93'
                      return (
                        <tr key={b.id}>
                          <td style={{ fontWeight: 600 }}>{b.name}</td>
                          <td>{b.level}</td>
                          <td>{b.schedule || '—'}</td>
                          <td>{b.time_slot || '—'}</td>
                          <td><span className="dash-chip" style={{ background: sc + '18', color: sc, textTransform: 'capitalize' }}>{b.status}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </Reveal>
      </main>
    </div>
  )
}
