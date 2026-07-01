'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

async function ok() {
  const me = await getSessionUser()
  return me && me.role === 'admin'
}

export async function loadCourseContent(courseId: string): Promise<{ modules: any[]; lessons: any[] }> {
  if (!(await ok())) return { modules: [], lessons: [] }
  const modules = await sql`select * from course_modules where course_id = ${courseId} order by order_index`
  const lessons = await sql`select * from lessons where course_id = ${courseId} order by order_index`
  return { modules: modules as any[], lessons: lessons as any[] }
}

export async function createCourse(p: Record<string, any>): Promise<{ error: string | null; row: any }> {
  if (!(await ok())) return { error: 'Not authorized', row: null }
  try {
    const [row] = await sql`
      insert into courses (title, jlpt_level, description, duration_weeks, status, enrolled_count)
      values (${p.title}, ${p.jlpt_level}, ${p.description ?? null}, ${p.duration_weeks}, ${p.status}, 0) returning *
    `
    return { error: null, row }
  } catch (e) { return { error: (e as Error).message, row: null } }
}

export async function updateCourse(id: string, p: Record<string, any>) {
  if (!(await ok())) return { error: 'Not authorized' }
  try {
    await sql`update courses set title = ${p.title}, jlpt_level = ${p.jlpt_level}, description = ${p.description ?? null}, duration_weeks = ${p.duration_weeks}, status = ${p.status} where id = ${id}`
    return { error: null }
  } catch (e) { return { error: (e as Error).message } }
}

export async function deleteCourse(id: string) {
  if (!(await ok())) return { error: 'Not authorized' }
  try { await sql`delete from courses where id = ${id}`; return { error: null } }
  catch (e) { return { error: (e as Error).message } }
}

export async function createModule(courseId: string, title: string, orderIndex: number): Promise<{ error: string | null; row: any }> {
  if (!(await ok())) return { error: 'Not authorized', row: null }
  try {
    const [row] = await sql`insert into course_modules (course_id, title, order_index) values (${courseId}, ${title}, ${orderIndex}) returning *`
    return { error: null, row }
  } catch (e) { return { error: (e as Error).message, row: null } }
}

export async function updateModule(id: string, title: string) {
  if (!(await ok())) return { error: 'Not authorized' }
  try { await sql`update course_modules set title = ${title} where id = ${id}`; return { error: null } }
  catch (e) { return { error: (e as Error).message } }
}

export async function deleteModule(id: string) {
  if (!(await ok())) return { error: 'Not authorized' }
  try { await sql`delete from course_modules where id = ${id}`; return { error: null } }
  catch (e) { return { error: (e as Error).message } }
}

export async function createLesson(p: Record<string, any>): Promise<{ error: string | null; row: any }> {
  if (!(await ok())) return { error: 'Not authorized', row: null }
  try {
    const [row] = await sql`
      insert into lessons (module_id, course_id, title, lesson_type, duration_minutes, order_index, content_url)
      values (${p.module_id}, ${p.course_id}, ${p.title}, ${p.lesson_type}, ${p.duration_minutes}, ${p.order_index}, ${p.content_url ?? null}) returning *
    `
    return { error: null, row }
  } catch (e) { return { error: (e as Error).message, row: null } }
}

export async function updateLesson(id: string, p: Record<string, any>) {
  if (!(await ok())) return { error: 'Not authorized' }
  try {
    await sql`update lessons set title = ${p.title}, lesson_type = ${p.lesson_type}, duration_minutes = ${p.duration_minutes}, content_url = ${p.content_url ?? null} where id = ${id}`
    return { error: null }
  } catch (e) { return { error: (e as Error).message } }
}

export async function deleteLesson(id: string) {
  if (!(await ok())) return { error: 'Not authorized' }
  try { await sql`delete from lessons where id = ${id}`; return { error: null } }
  catch (e) { return { error: (e as Error).message } }
}
