'use server'
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export async function gradeSubmission(submissionId: string, points: number, feedback: string | null) {
  const me = await getSessionUser()
  if (!me || (me.role !== 'teacher' && me.role !== 'admin')) return { error: 'Not authorized', graded_at: null }
  try {
    const graded_at = new Date().toISOString()
    await sql`
      update assignment_submissions
      set points = ${points}, feedback = ${feedback}, status = 'Graded', graded_at = ${graded_at}, graded_by = ${me.id}
      where id = ${submissionId}
    `
    return { error: null, graded_at }
  } catch (e) {
    return { error: (e as Error).message, graded_at: null }
  }
}
