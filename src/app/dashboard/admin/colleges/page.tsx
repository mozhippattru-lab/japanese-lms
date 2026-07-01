import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import CollegesClient from './CollegesClient'
import { DashStyles } from '@/components/DashboardKit'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function CollegesPage() {
  const user = await requireRole('admin')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const [colleges, students, batches, payments] = await Promise.all([
    sql`select * from colleges order by created_at desc`,
    sql`select id, college_id from profiles where role = 'student' and college_id is not null`,
    sql`select id, name, jlpt_level, college_id, enrolled from batches where mode = 'College'`,
    sql`select * from college_payments order by payment_date desc`,
  ])

  const studentCount: Record<string, number> = {}
  for (const s of students) if (s.college_id) studentCount[s.college_id] = (studentCount[s.college_id] || 0) + 1
  const batchCount: Record<string, number> = {}
  for (const b of batches) if (b.college_id) batchCount[b.college_id] = (batchCount[b.college_id] || 0) + 1
  const paidSum: Record<string, number> = {}
  for (const p of payments) if (p.college_id) paidSum[p.college_id] = (paidSum[p.college_id] || 0) + Number(p.amount || 0)

  const enriched = colleges.map(c => ({
    ...c,
    student_count: studentCount[c.id] || 0,
    batch_count: batchCount[c.id] || 0,
    paid_total: paidSum[c.id] || 0,
  }))

  return (
    <div className="dash-shell">
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main className="dash-main">
        <DashStyles />
        <CollegesClient
          initialColleges={enriched as any[]}
          batches={batches as any[]}
          initialPayments={payments as any[]}
        />
      </main>
    </div>
  )
}
