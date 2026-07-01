'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

async function requireAdmin() {
  const me = await getSessionUser()
  return me && me.role === 'admin' ? me : null
}

export async function getBatchRoster(batchId: string): Promise<any[]> {
  if (!(await requireAdmin())) return []
  const rows = await sql`
    select p.id, p.full_name, p.email, p.jlpt_level, p.phone
    from student_batches sb join profiles p on p.id = sb.student_id
    where sb.batch_id = ${batchId} order by p.full_name
  `
  return rows as any[]
}

export async function createCollegeQuick(name: string, joinCode: string): Promise<{ error: string | null; id: string | null }> {
  if (!(await requireAdmin())) return { error: 'Not authorized', id: null }
  try {
    const [col] = await sql`insert into colleges (name, join_code, status) values (${name}, ${joinCode}, 'Active') returning id`
    return { error: null, id: col.id }
  } catch (e) {
    return { error: (e as Error).message, id: null }
  }
}

export async function createBatch(b: Record<string, any>): Promise<{ error: string | null; batch: any }> {
  if (!(await requireAdmin())) return { error: 'Not authorized', batch: null }
  try {
    const [row] = await sql`
      insert into batches (name, jlpt_level, time_slot, days, teacher_id, teacher_name, capacity, enrolled, status, start_date, mode, college_id, meeting_link)
      values (${b.name}, ${b.jlpt_level}, ${b.time_slot}, ${b.days}, ${b.teacher_id ?? null}, ${b.teacher_name ?? null},
        ${b.capacity}, ${b.enrolled ?? 0}, ${b.status}, ${b.start_date ?? null}, ${b.mode}, ${b.college_id ?? null}, ${b.meeting_link ?? null})
      returning *
    `
    return { error: null, batch: row }
  } catch (e) {
    return { error: (e as Error).message, batch: null }
  }
}

export async function updateBatch(id: string, b: Record<string, any>): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`
      update batches set name = ${b.name}, jlpt_level = ${b.jlpt_level}, time_slot = ${b.time_slot}, days = ${b.days},
        teacher_id = ${b.teacher_id ?? null}, teacher_name = ${b.teacher_name ?? null}, capacity = ${b.capacity},
        status = ${b.status}, start_date = ${b.start_date ?? null}, mode = ${b.mode},
        college_id = ${b.college_id ?? null}, meeting_link = ${b.meeting_link ?? null}
      where id = ${id}
    `
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteBatch(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`delete from batches where id = ${id}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
