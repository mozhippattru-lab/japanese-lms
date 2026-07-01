/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import TeacherGradingClient from './TeacherGradingClient'
import { DashStyles } from '@/components/DashboardKit'

export default async function TeacherGradingPage() {
  const user = await requireRole('teacher')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const assignments = await sql`select id, title, type, max_points, batch_id, jlpt_level from assignments where teacher_id = ${user.id}`
  const assignmentIds = assignments.map(a => a.id)

  let submissions: Record<string, any>[] = []
  if (assignmentIds.length > 0) {
    submissions = await sql`
      select id, assignment_id, student_id, content, status, points, feedback, submitted_at, graded_at
      from assignment_submissions where assignment_id = any(${assignmentIds}) order by submitted_at asc
    ` as unknown as Record<string, any>[]
  }

  const studentIds = [...new Set(submissions.map(s => s.student_id as string))]
  const studentMap = new Map<string, string>()
  if (studentIds.length > 0) {
    const students = await sql`select id, full_name, email from profiles where id = any(${studentIds})`
    students.forEach(s => studentMap.set(s.id, s.full_name || s.email || 'Student'))
  }

  const aMap = new Map(assignments.map(a => [a.id, a]))
  const enriched = submissions.map(s => {
    const a = aMap.get(s.assignment_id as string)
    return {
      id: s.id as string,
      assignment_id: s.assignment_id as string,
      assignment_title: a?.title || '—',
      assignment_type: a?.type || 'Assignment',
      jlpt_level: a?.jlpt_level || '',
      max_points: a?.max_points || 100,
      student_id: s.student_id as string,
      student_name: studentMap.get(s.student_id as string) || 'Student',
      content: (s.content as string) || '',
      status: s.status as string,
      points: (s.points as number) ?? null,
      feedback: (s.feedback as string) || '',
      submitted_at: s.submitted_at as string,
      graded_at: (s.graded_at as string) || null,
    }
  })

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main className="dash-main">
        <DashStyles />
        <TeacherGradingClient teacherId={user.id} initialSubmissions={enriched as any[]} />
      </main>
    </div>
  )
}
