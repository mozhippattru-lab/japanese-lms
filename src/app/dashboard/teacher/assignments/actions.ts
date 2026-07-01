'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

type Payload = {
  title: string; description: string | null; instructions: string | null
  batch_id: string; jlpt_level: string | null; type: string; max_points: number
  due_date: string | null; status: string
}

async function requireTeacher() {
  const me = await getSessionUser()
  if (!me || (me.role !== 'teacher' && me.role !== 'admin')) return null
  return me
}

export async function createAssignment(p: Payload): Promise<{ error: string | null; assignment: any }> {
  const me = await requireTeacher()
  if (!me) return { error: 'Not authorized', assignment: null }
  try {
    const [row] = await sql`
      insert into assignments (title, description, instructions, batch_id, jlpt_level, type, max_points, due_date, status, teacher_id)
      values (${p.title}, ${p.description}, ${p.instructions}, ${p.batch_id}, ${p.jlpt_level}, ${p.type}, ${p.max_points}, ${p.due_date || null}, ${p.status}, ${me.id})
      returning *
    `
    return { error: null, assignment: row }
  } catch (e) {
    return { error: (e as Error).message, assignment: null }
  }
}

export async function updateAssignment(id: string, p: Payload): Promise<{ error: string | null }> {
  const me = await requireTeacher()
  if (!me) return { error: 'Not authorized' }
  try {
    await sql`
      update assignments set title = ${p.title}, description = ${p.description}, instructions = ${p.instructions},
        batch_id = ${p.batch_id}, jlpt_level = ${p.jlpt_level}, type = ${p.type}, max_points = ${p.max_points},
        due_date = ${p.due_date || null}, status = ${p.status}
      where id = ${id}
    `
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

export async function deleteAssignment(id: string): Promise<{ error: string | null }> {
  const me = await requireTeacher()
  if (!me) return { error: 'Not authorized' }
  try {
    await sql`delete from assignments where id = ${id}`
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
