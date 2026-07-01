import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import BatchesClient from './BatchesClient'
import { DashStyles } from '@/components/DashboardKit'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function BatchesPage() {
  const user = await requireRole('admin')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const [batches, teachers, colleges] = await Promise.all([
    sql`select * from batches order by created_at desc`,
    sql`select id, full_name, email, jlpt_level, phone from profiles where role = 'teacher'`,
    sql`select id, name, category from colleges where status = 'Active' order by name`,
  ])

  return (
    <div className="dash-shell">
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main className="dash-main">
        <DashStyles />
        <BatchesClient initialBatches={batches as any[]} teachers={teachers as any[]} colleges={colleges as any[]} />
      </main>
    </div>
  )
}
