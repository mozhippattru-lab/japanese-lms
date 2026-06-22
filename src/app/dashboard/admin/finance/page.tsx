import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import FinanceClient from './FinanceClient'

export default async function FinancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const [
    { data: invoices },
    { data: fees },
    { data: students },
    { data: batches },
    { data: enrollments },
    { data: colleges },
    { data: collegePayments },
  ] = await Promise.all([
    supabase.from('invoices').select('*').order('created_at', { ascending: false }),
    supabase.from('fee_structures').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, full_name, email, jlpt_level, phone, batch, status').eq('role', 'student').order('full_name'),
    supabase.from('batches').select('id, name, jlpt_level').eq('status', 'Active').order('name'),
    supabase.from('student_batches').select('student_id, batch_id, batches(name, jlpt_level)').eq('status', 'Active'),
    supabase.from('colleges').select('id, name, category, payment_type, payment_amount, status').order('name'),
    supabase.from('college_payments').select('*').order('payment_date', { ascending: false }),
  ])

  // Map each student to their first active batch enrollment
  const enrollMap: Record<string, { batch_id: string; batch_name: string | null; batch_level: string | null }> = {}
  for (const e of enrollments || []) {
    if (enrollMap[e.student_id]) continue
    const b = e.batches as unknown as { name: string | null; jlpt_level: string | null } | null
    enrollMap[e.student_id] = { batch_id: e.batch_id, batch_name: b?.name ?? null, batch_level: b?.jlpt_level ?? null }
  }
  const enrichedStudents = (students || []).map(s => ({
    ...s,
    batch_id: enrollMap[s.id]?.batch_id ?? null,
    batch_name: enrollMap[s.id]?.batch_name ?? null,
    batch_level: enrollMap[s.id]?.batch_level ?? null,
  }))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ivory)' }}>
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <FinanceClient
          initialInvoices={invoices || []}
          initialFees={fees || []}
          students={enrichedStudents}
          batches={batches || []}
          colleges={colleges || []}
          collegePayments={collegePayments || []}
        />
      </main>
    </div>
  )
}
