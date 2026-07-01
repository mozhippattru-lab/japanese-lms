/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import TeacherAssignmentsClient from './TeacherAssignmentsClient'
import { DashStyles } from '@/components/DashboardKit'

export default async function TeacherAssignmentsPage() {
  const user = await requireRole('teacher')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const batches = await sql`select id, name, jlpt_level, enrolled from batches where teacher_id = ${user.id} order by created_at desc`

  const assignments = await sql`
    select id, title, description, instructions, batch_id, jlpt_level, type, max_points, due_date, status, created_at
    from assignments where teacher_id = ${user.id} order by created_at desc
  `

  const assignmentIds = assignments.map(a => a.id)
  let subCounts: Record<string, { total: number; graded: number }> = {}
  if (assignmentIds.length > 0) {
    const subs = await sql`select assignment_id, status from assignment_submissions where assignment_id = any(${assignmentIds})`
    subCounts = subs.reduce((acc, s) => {
      const c = acc[s.assignment_id] || { total: 0, graded: 0 }
      c.total += 1
      if (s.status === 'Graded') c.graded += 1
      acc[s.assignment_id] = c
      return acc
    }, {} as Record<string, { total: number; graded: number }>)
  }

  const batchMap = new Map(batches.map(b => [b.id, b]))
  const enriched = assignments.map(a => ({
    ...a,
    batch_name: batchMap.get(a.batch_id)?.name || '—',
    batch_enrolled: batchMap.get(a.batch_id)?.enrolled || 0,
    sub_total: subCounts[a.id]?.total || 0,
    sub_graded: subCounts[a.id]?.graded || 0,
  }))

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main className="dash-main">
        <DashStyles />
        <TeacherAssignmentsClient
          teacherId={user.id}
          batches={batches as any[]}
          initialAssignments={enriched as any[]}
        />
      </main>
    </div>
  )
}
