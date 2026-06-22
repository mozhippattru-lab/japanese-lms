import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TeacherAssignmentsClient from './TeacherAssignmentsClient'

export default async function TeacherAssignmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, jlpt_level, enrolled')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, title, description, instructions, batch_id, jlpt_level, type, max_points, due_date, status, created_at')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  const assignmentIds = (assignments || []).map(a => a.id)
  let subCounts: Record<string, { total: number; graded: number }> = {}
  if (assignmentIds.length > 0) {
    const { data: subs } = await supabase
      .from('assignment_submissions')
      .select('assignment_id, status')
      .in('assignment_id', assignmentIds)
    subCounts = (subs || []).reduce((acc, s) => {
      const c = acc[s.assignment_id] || { total: 0, graded: 0 }
      c.total += 1
      if (s.status === 'Graded') c.graded += 1
      acc[s.assignment_id] = c
      return acc
    }, {} as Record<string, { total: number; graded: number }>)
  }

  const batchMap = new Map((batches || []).map(b => [b.id, b]))
  const enriched = (assignments || []).map(a => ({
    ...a,
    batch_name: batchMap.get(a.batch_id)?.name || '—',
    batch_enrolled: batchMap.get(a.batch_id)?.enrolled || 0,
    sub_total: subCounts[a.id]?.total || 0,
    sub_graded: subCounts[a.id]?.graded || 0,
  }))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>
        <TeacherAssignmentsClient
          teacherId={user.id}
          batches={batches || []}
          initialAssignments={enriched}
        />
      </main>
    </div>
  )
}
