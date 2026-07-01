import 'server-only'
import { sql } from '@/lib/db'

export { slugify } from '@/lib/slug'

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  body_html: string | null
  meta_title: string | null
  meta_description: string | null
  tags: string[]
  status: string
  author_id: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export async function getPublishedPosts(): Promise<Post[]> {
  const rows = await sql`
    select * from posts where status = 'published'
    order by published_at desc nulls last, created_at desc
  `
  return rows as unknown as Post[]
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const [row] = await sql`select * from posts where slug = ${slug} and status = 'published' limit 1`
  return (row as unknown as Post) || null
}
