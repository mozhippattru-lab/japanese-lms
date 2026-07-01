'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function admin() {
  const me = await getSessionUser()
  return me && me.role === 'admin' ? me : null
}

export async function listPosts(): Promise<any[]> {
  if (!(await admin())) return []
  const rows = await sql`select id, title, slug, status, tags, published_at, updated_at from posts order by updated_at desc`
  return rows as any[]
}

export async function getPost(id: string): Promise<any> {
  if (!(await admin())) return null
  const [row] = await sql`select * from posts where id = ${id} limit 1`
  return row || null
}

export async function slugTaken(slug: string, exceptId: string | null): Promise<boolean> {
  if (!(await admin())) return true
  const rows = exceptId
    ? await sql`select 1 from posts where slug = ${slug} and id <> ${exceptId} limit 1`
    : await sql`select 1 from posts where slug = ${slug} limit 1`
  return rows.length > 0
}

export async function savePost(p: Record<string, any>): Promise<{ error: string | null; post: any }> {
  const me = await admin()
  if (!me) return { error: 'Not authorized', post: null }
  if (!p.title?.trim() || !p.slug?.trim()) return { error: 'Title and slug are required', post: null }
  const publishedAt = p.status === 'published' ? (p.published_at ?? new Date().toISOString()) : null
  const tags: string[] = Array.isArray(p.tags) ? p.tags : []
  try {
    let post: any
    if (p.id) {
      const [row] = await sql`
        update posts set title = ${p.title}, slug = ${p.slug}, excerpt = ${p.excerpt ?? null},
          cover_image = ${p.cover_image ?? null}, body_html = ${p.body_html ?? null},
          meta_title = ${p.meta_title ?? null}, meta_description = ${p.meta_description ?? null},
          tags = ${tags}, status = ${p.status}, published_at = ${publishedAt}, updated_at = now()
        where id = ${p.id} returning *
      `
      post = row
    } else {
      const [row] = await sql`
        insert into posts (title, slug, excerpt, cover_image, body_html, meta_title, meta_description, tags, status, author_id, published_at)
        values (${p.title}, ${p.slug}, ${p.excerpt ?? null}, ${p.cover_image ?? null}, ${p.body_html ?? null},
          ${p.meta_title ?? null}, ${p.meta_description ?? null}, ${tags}, ${p.status}, ${me.id}, ${publishedAt})
        returning *
      `
      post = row
    }
    revalidatePath('/blog')
    revalidatePath(`/blog/${p.slug}`)
    return { error: null, post }
  } catch (e) {
    return { error: (e as Error).message, post: null }
  }
}

export async function deletePost(id: string, slug: string): Promise<{ error: string | null }> {
  if (!(await admin())) return { error: 'Not authorized' }
  try {
    await sql`delete from posts where id = ${id}`
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
