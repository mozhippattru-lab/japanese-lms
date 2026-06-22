import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import CollegesClient from './CollegesClient'

export default async function CollegesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const [
    { data: colleges },
    { data: students },
    { data: batches },
    { data: payments },
  ] = await Promise.all([
    supabase.from('colleges').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, college_id').eq('role', 'student').not('college_id', 'is', null),
    supabase.from('batches').select('id, name, jlpt_level, college_id, enrolled').eq('mode', 'College'),
    supabase.from('college_payments').select('*').order('payment_date', { ascending: false }),
  ])

  // counts per college
  const studentCount: Record<string, number> = {}
  for (const s of students || []) if (s.college_id) studentCount[s.college_id] = (studentCount[s.college_id] || 0) + 1
  const batchCount: Record<string, number> = {}
  for (const b of batches || []) if (b.college_id) batchCount[b.college_id] = (batchCount[b.college_id] || 0) + 1
  const paidSum: Record<string, number> = {}
  for (const p of payments || []) if (p.college_id) paidSum[p.college_id] = (paidSum[p.college_id] || 0) + Number(p.amount || 0)

  const enriched = (colleges || []).map(c => ({
    ...c,
    student_count: studentCount[c.id] || 0,
    batch_count: batchCount[c.id] || 0,
    paid_total: paidSum[c.id] || 0,
  }))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ivory)' }}>
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <CollegesClient
          initialColleges={enriched}
          batches={batches || []}
          initialPayments={payments || []}
        />
      </main>
    </div>
  )
}
