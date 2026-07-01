'use server'
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// Teachers/admins set the meeting link for a batch.
export async function updateBatchMeetingLink(batchId: string, link: string | null) {
  const me = await getSessionUser()
  if (!me || (me.role !== 'teacher' && me.role !== 'admin')) return { error: 'Not authorized' }
  try {
    await sql`update batches set meeting_link = ${link} where id = ${batchId}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
