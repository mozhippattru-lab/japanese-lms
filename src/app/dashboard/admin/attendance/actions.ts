'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

async function requireAdmin() {
  const me = await getSessionUser()
  return me && me.role === 'admin' ? me : null
}

export async function loadBatchDetail(batchId: string): Promise<{ students: any[]; sessions: any[] }> {
  if (!(await requireAdmin())) return { students: [], sessions: [] }
  const students = await sql`
    select p.id, p.full_name, p.email, p.jlpt_level, p.phone, p.batch
    from student_batches sb join profiles p on p.id = sb.student_id
    where sb.batch_id = ${batchId} and sb.status = 'Active' order by p.full_name
  `
  const sessions = await sql`select * from attendance_sessions where batch_id = ${batchId} order by session_date desc limit 30`
  return { students: students as any[], sessions: sessions as any[] }
}

export async function loadEnrollableStudents(): Promise<any[]> {
  if (!(await requireAdmin())) return []
  const rows = await sql`select id, full_name, email, jlpt_level, phone, batch from profiles where role = 'student' order by full_name`
  return rows as any[]
}

export async function enrollStudent(batchId: string, studentId: string, newCount: number) {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`
      insert into student_batches (student_id, batch_id, status) values (${studentId}, ${batchId}, 'Active')
      on conflict (student_id, batch_id) do update set status = 'Active'
    `
    await sql`update batches set enrolled = ${newCount} where id = ${batchId}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function removeStudent(batchId: string, studentId: string, newCount: number) {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`update student_batches set status = 'Dropped' where student_id = ${studentId} and batch_id = ${batchId}`
    await sql`update batches set enrolled = ${newCount} where id = ${batchId}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function loadSessionForDate(batchId: string, date: string): Promise<{ session: any | null; records: any[] }> {
  if (!(await requireAdmin())) return { session: null, records: [] }
  const [session] = await sql`select * from attendance_sessions where batch_id = ${batchId} and session_date = ${date} limit 1`
  if (!session) return { session: null, records: [] }
  const records = await sql`select student_id, status from attendance_records where session_id = ${session.id}`
  return { session, records: records as any[] }
}

export async function saveAttendanceSession(params: {
  batchId: string; date: string; topic: string | null; records: { student_id: string; status: string }[]
}): Promise<{ error: string | null; session: any }> {
  const me = await requireAdmin()
  if (!me) return { error: 'Not authorized', session: null }
  const { batchId, date, topic, records } = params
  const present = records.filter(r => r.status === 'Present').length
  const absent = records.filter(r => r.status === 'Absent').length
  const late = records.filter(r => r.status === 'Late').length
  try {
    let session: any
    await sql.begin(async (tx) => {
      const [s] = await tx`
        insert into attendance_sessions (batch_id, session_date, topic, total_present, total_absent, total_late, created_by)
        values (${batchId}, ${date}, ${topic}, ${present}, ${absent}, ${late}, ${me.id})
        on conflict (batch_id, session_date) do update set topic = excluded.topic,
          total_present = excluded.total_present, total_absent = excluded.total_absent, total_late = excluded.total_late
        returning *
      `
      session = s
      await tx`delete from attendance_records where session_id = ${session.id}`
      for (const r of records) {
        await tx`insert into attendance_records (session_id, student_id, batch_id, status)
                 values (${session.id}, ${r.student_id}, ${batchId}, ${r.status})`
      }
    })
    return { error: null, session }
  } catch (e) {
    return { error: (e as Error).message, session: null }
  }
}
