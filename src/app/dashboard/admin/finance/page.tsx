import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import FinanceClient from './FinanceClient'
import { DashStyles } from '@/components/DashboardKit'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function FinancePage() {
  const user = await requireRole('admin')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const [invoices, fees, students, batches, enrollments, colleges, collegePayments, payments, expenses] = await Promise.all([
    sql`select * from invoices order by created_at desc`,
    sql`select * from fee_structures order by created_at desc`,
    sql`select id, full_name, email, jlpt_level, phone, batch, status from profiles where role = 'student' order by full_name`,
    sql`select id, name, jlpt_level from batches where status = 'Active' order by name`,
    sql`select sb.student_id, sb.batch_id, b.name as batch_name, b.jlpt_level as batch_level
        from student_batches sb left join batches b on b.id = sb.batch_id
        where sb.status = 'Active'`,
    sql`select id, name, category, payment_type, payment_amount, status from colleges order by name`,
    sql`select * from college_payments order by payment_date desc`,
    sql`select id, invoice_id, student_id, amount, payment_method, payment_date, reference_number, notes from payments order by payment_date desc`,
    sql`select * from expenses order by expense_date desc`,
  ])

  // Map each student to their first active batch enrollment
  const enrollMap: Record<string, { batch_id: string; batch_name: string | null; batch_level: string | null }> = {}
  for (const e of enrollments) {
    if (enrollMap[e.student_id]) continue
    enrollMap[e.student_id] = { batch_id: e.batch_id, batch_name: e.batch_name ?? null, batch_level: e.batch_level ?? null }
  }
  const enrichedStudents = students.map(s => ({
    ...s,
    batch_id: enrollMap[s.id]?.batch_id ?? null,
    batch_name: enrollMap[s.id]?.batch_name ?? null,
    batch_level: enrollMap[s.id]?.batch_level ?? null,
  }))

  return (
    <div className="dash-shell">
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main className="dash-main">
        <DashStyles />
        <FinanceClient
          initialInvoices={invoices as any[]}
          initialFees={fees as any[]}
          students={enrichedStudents as any[]}
          batches={batches as any[]}
          colleges={colleges as any[]}
          collegePayments={collegePayments as any[]}
          payments={payments as any[]}
          initialExpenses={expenses as any[]}
        />
      </main>
    </div>
  )
}
