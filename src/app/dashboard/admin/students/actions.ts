'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

async function requireAdmin() {
  const me = await getSessionUser()
  return me && me.role === 'admin' ? me : null
}

export async function getStudentInvoices(studentId: string): Promise<any[]> {
  if (!(await requireAdmin())) return []
  const rows = await sql`
    select id, amount, due_date, status, description, created_at from invoices
    where student_id = ${studentId} order by created_at desc limit 10
  `
  return rows as any[]
}

export async function updateStudent(id: string, u: Record<string, any>) {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`
      update profiles set full_name = ${u.full_name ?? null}, phone = ${u.phone ?? null}, jlpt_level = ${u.jlpt_level ?? null},
        batch = ${u.batch ?? null}, status = ${u.status ?? null}
      where id = ${id}
    `
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deactivateStudent(id: string) {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`update profiles set status = 'Inactive' where id = ${id}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
