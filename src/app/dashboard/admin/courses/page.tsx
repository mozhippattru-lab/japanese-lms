import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import CoursesClient from './CoursesClient'
import { DashStyles } from '@/components/DashboardKit'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function CoursesPage() {
  const user = await requireRole('admin')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const courses = await sql`select * from courses order by created_at desc`

  return (
    <div className="dash-shell">
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main className="dash-main">
        <DashStyles />
        <CoursesClient initialCourses={courses as any[]} />
      </main>
    </div>
  )
}
