'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

async function requireAdmin() {
  const me = await getSessionUser()
  return me && me.role === 'admin' ? me : null
}

export async function createCollege(p: Record<string, any>): Promise<{ error: string | null; college: any }> {
  if (!(await requireAdmin())) return { error: 'Not authorized', college: null }
  try {
    const [row] = await sql`
      insert into colleges (name, category, city, contact_person, contact_phone, contact_email, payment_type, payment_amount, join_code, status, notes)
      values (${p.name}, ${p.category}, ${p.city ?? null}, ${p.contact_person ?? null}, ${p.contact_phone ?? null}, ${p.contact_email ?? null},
        ${p.payment_type}, ${p.payment_amount ?? 0}, ${p.join_code}, ${p.status}, ${p.notes ?? null})
      returning *
    `
    return { error: null, college: row }
  } catch (e) {
    return { error: (e as Error).message, college: null }
  }
}

export async function updateCollege(id: string, p: Record<string, any>): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`
      update colleges set name = ${p.name}, category = ${p.category}, city = ${p.city ?? null},
        contact_person = ${p.contact_person ?? null}, contact_phone = ${p.contact_phone ?? null}, contact_email = ${p.contact_email ?? null},
        payment_type = ${p.payment_type}, payment_amount = ${p.payment_amount ?? 0}, status = ${p.status}, notes = ${p.notes ?? null}
      where id = ${id}
    `
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteCollege(id: string): Promise<{ error: string | null }> {
  if (!(await requireAdmin())) return { error: 'Not authorized' }
  try {
    await sql`delete from colleges where id = ${id}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function logCollegePayment(p: Record<string, any>): Promise<{ error: string | null; payment: any }> {
  if (!(await requireAdmin())) return { error: 'Not authorized', payment: null }
  try {
    const [row] = await sql`
      insert into college_payments (college_id, batch_id, amount, period_month, payment_date, payment_method, reference_number, status, notes)
      values (${p.college_id}, ${p.batch_id ?? null}, ${p.amount}, ${p.period_month ?? null}, ${p.payment_date},
        ${p.payment_method}, ${p.reference_number ?? null}, ${p.status}, ${p.notes ?? null})
      returning *
    `
    return { error: null, payment: row }
  } catch (e) {
    return { error: (e as Error).message, payment: null }
  }
}
