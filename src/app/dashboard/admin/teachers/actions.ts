'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

async function requireAdmin() {
  const me = await getSessionUser()
  return me && me.role === 'admin' ? me : null
}

export async function getTeacherBatches(teacherId: string): Promise<any[]> {
  if (!(await requireAdmin())) return []
  const rows = await sql`
    select id, name, jlpt_level, time_slot, status, enrolled, capacity, days from batches
    where teacher_id = ${teacherId} order by created_at desc
  `
  return rows as any[]
}

export async function updateTeacher(id: string, u: Record<string, any>) {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`update profiles set full_name = ${u.full_name ?? null}, phone = ${u.phone ?? null}, jlpt_level = ${u.jlpt_level ?? null}, status = ${u.status ?? null} where id = ${id}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deactivateTeacher(id: string) {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`update profiles set status = 'Inactive' where id = ${id}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
