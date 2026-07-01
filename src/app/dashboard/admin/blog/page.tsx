/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireRole } from '@/lib/auth'
import { sql } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import { DashStyles } from '@/components/DashboardKit'
import BlogClient from './BlogClient'

export default async function BlogAdminPage() {
  const user = await requireRole('admin')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  // Resilient if the posts table hasn't been created yet.
  let posts: any[] = []
  let tableMissing = false
  try {
    posts = (await sql`select id, title, slug, status, tags, published_at, updated_at from posts order by updated_at desc`) as any[]
  } catch {
    tableMissing = true
  }

  return (
    <div className="dash-shell">
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main className="dash-main">
        <DashStyles />
        <BlogClient initialPosts={posts} tableMissing={tableMissing} />
      </main>
    </div>
  )
}
