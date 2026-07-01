'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

async function ok() {
  const me = await getSessionUser()
  return me && me.role === 'admin'
}

export async function createInvoice(p: Record<string, any>): Promise<{ error: string | null; row: any }> {
  if (!(await ok())) return { error: 'Not authorized', row: null }
  try {
    const [row] = await sql`
      insert into invoices (student_id, batch_id, fee_structure_id, amount, due_date, status, description)
      values (${p.student_id}, ${p.batch_id ?? null}, ${p.fee_structure_id ?? null}, ${p.amount}, ${p.due_date}, 'Pending', ${p.description ?? null})
      returning *
    `
    return { error: null, row }
  } catch (e) { return { error: (e as Error).message, row: null } }
}

export async function recordPayment(p: Record<string, any>): Promise<{ error: string | null }> {
  if (!(await ok())) return { error: 'Not authorized' }
  try {
    await sql.begin(async (tx) => {
      await tx`
        insert into payments (invoice_id, student_id, amount, payment_method, payment_date, reference_number, notes)
        values (${p.invoice_id}, ${p.student_id}, ${p.amount}, ${p.payment_method}, ${p.payment_date}, ${p.reference_number ?? null}, ${p.notes ?? null})
      `
      await tx`update invoices set status = 'Paid' where id = ${p.invoice_id}`
    })
    return { error: null }
  } catch (e) { return { error: (e as Error).message } }
}

export async function setInvoiceStatus(id: string, status: string) {
  if (!(await ok())) return { error: 'Not authorized' }
  try { await sql`update invoices set status = ${status} where id = ${id}`; return { error: null } }
  catch (e) { return { error: (e as Error).message } }
}

export async function createFee(p: Record<string, any>): Promise<{ error: string | null; row: any }> {
  if (!(await ok())) return { error: 'Not authorized', row: null }
  try {
    const [row] = await sql`
      insert into fee_structures (name, jlpt_level, amount, frequency, description, is_active)
      values (${p.name}, ${p.jlpt_level ?? null}, ${p.amount}, ${p.frequency}, ${p.description ?? null}, true) returning *
    `
    return { error: null, row }
  } catch (e) { return { error: (e as Error).message, row: null } }
}

export async function updateFee(id: string, p: Record<string, any>) {
  if (!(await ok())) return { error: 'Not authorized' }
  try {
    await sql`update fee_structures set name = ${p.name}, jlpt_level = ${p.jlpt_level ?? null}, amount = ${p.amount}, frequency = ${p.frequency}, description = ${p.description ?? null} where id = ${id}`
    return { error: null }
  } catch (e) { return { error: (e as Error).message } }
}

export async function deleteFee(id: string) {
  if (!(await ok())) return { error: 'Not authorized' }
  try { await sql`delete from fee_structures where id = ${id}`; return { error: null } }
  catch (e) { return { error: (e as Error).message } }
}

export async function toggleFee(id: string, active: boolean) {
  if (!(await ok())) return { error: 'Not authorized' }
  try { await sql`update fee_structures set is_active = ${active} where id = ${id}`; return { error: null } }
  catch (e) { return { error: (e as Error).message } }
}

export async function createExpense(p: Record<string, any>): Promise<{ error: string | null; row: any }> {
  if (!(await ok())) return { error: 'Not authorized', row: null }
  try {
    const [row] = await sql`
      insert into expenses (title, category, amount, expense_date, payment_method, notes)
      values (${p.title}, ${p.category}, ${p.amount}, ${p.expense_date}, ${p.payment_method}, ${p.notes ?? null}) returning *
    `
    return { error: null, row }
  } catch (e) { return { error: (e as Error).message, row: null } }
}

export async function deleteExpense(id: string) {
  if (!(await ok())) return { error: 'Not authorized' }
  try { await sql`delete from expenses where id = ${id}`; return { error: null } }
  catch (e) { return { error: (e as Error).message } }
}
