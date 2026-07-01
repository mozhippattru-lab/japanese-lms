'use server'
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export async function loadBatchStudents(batchId: string) {
  const me = await getSessionUser()
  if (!me) return []
  const rows = await sql`
    select p.id, p.full_name, p.email
    from student_batches sb join profiles p on p.id = sb.student_id
    where sb.batch_id = ${batchId} and sb.status = 'Active'
    order by p.full_name
  `
  return rows as unknown as { id: string; full_name: string | null; email: string | null }[]
}

export async function saveAttendance(params: {
  batchId: string; sessionDate: string; topic: string | null
  records: { student_id: string; status: string }[]
}) {
  const me = await getSessionUser()
  if (!me || (me.role !== 'teacher' && me.role !== 'admin')) return { error: 'Not authorized' }
  const { batchId, sessionDate, topic, records } = params
  const present = records.filter(r => r.status === 'Present').length
  const absent = records.filter(r => r.status === 'Absent').length
  const late = records.filter(r => r.status === 'Late').length
  try {
    await sql.begin(async (tx) => {
      const [session] = await tx`
        insert into attendance_sessions (batch_id, session_date, topic, total_present, total_absent, total_late, created_by)
        values (${batchId}, ${sessionDate}, ${topic}, ${present}, ${absent}, ${late}, ${me.id})
        on conflict (batch_id, session_date)
        do update set topic = excluded.topic, total_present = excluded.total_present,
          total_absent = excluded.total_absent, total_late = excluded.total_late
        returning id
      `
      await tx`delete from attendance_records where session_id = ${session.id}`
      for (const r of records) {
        await tx`insert into attendance_records (session_id, student_id, batch_id, status)
                 values (${session.id}, ${r.student_id}, ${batchId}, ${r.status})`
      }
    })
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
