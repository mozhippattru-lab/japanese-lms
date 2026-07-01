'use server'
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// Submit (or update) the current student's answer for an assignment/test.
export async function submitWork(assignmentId: string, content: string) {
  const me = await getSessionUser()
  if (!me) return { error: 'Not authenticated', submission: null }
  try {
    const [sub] = await sql`
      insert into assignment_submissions (assignment_id, student_id, content, status, submitted_at)
      values (${assignmentId}, ${me.id}, ${content}, 'Submitted', now())
      on conflict (assignment_id, student_id)
      do update set content = excluded.content, status = 'Submitted', submitted_at = now()
      returning id, submitted_at
    `
    return { error: null, submission: sub as { id: string; submitted_at: string } }
  } catch (e) {
    return { error: (e as Error).message, submission: null }
  }
}
