'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

async function requireAdmin() {
  const me = await getSessionUser()
  return me && me.role === 'admin' ? me : null
}

export async function createLead(p: Record<string, any>): Promise<{ error: string | null; lead: any }> {
  if (!(await requireAdmin())) return { error: 'Not authorized', lead: null }
  try {
    const [row] = await sql`
      insert into leads (full_name, email, phone, source, interested_level, status, notes, follow_up_date)
      values (${p.full_name}, ${p.email ?? null}, ${p.phone ?? null}, ${p.source}, ${p.interested_level},
        ${p.status}, ${p.notes ?? null}, ${p.follow_up_date ?? null})
      returning *
    `
    return { error: null, lead: row }
  } catch (e) {
    return { error: (e as Error).message, lead: null }
  }
}

export async function updateLead(id: string, p: Record<string, any>): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`
      update leads set full_name = ${p.full_name}, email = ${p.email ?? null}, phone = ${p.phone ?? null},
        source = ${p.source}, interested_level = ${p.interested_level}, status = ${p.status},
        notes = ${p.notes ?? null}, follow_up_date = ${p.follow_up_date ?? null}
      where id = ${id}
    `
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function setLeadStatus(id: string, status: string, convertedAt?: string | null, convertedStudentId?: string | null): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    if (convertedStudentId) {
      await sql`update leads set status = ${status}, converted_at = ${convertedAt ?? null}, converted_student_id = ${convertedStudentId} where id = ${id}`
    } else if (convertedAt) {
      await sql`update leads set status = ${status}, converted_at = ${convertedAt} where id = ${id}`
    } else {
      await sql`update leads set status = ${status} where id = ${id}`
    }
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteLead(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`delete from leads where id = ${id}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
