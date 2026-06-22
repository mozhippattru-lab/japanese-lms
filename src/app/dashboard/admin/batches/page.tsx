import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import BatchesClient from './BatchesClient'

export default async function BatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const { data: batches } = await supabase
    .from('batches')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: teachers } = await supabase
    .from('profiles')
    .select('id, full_name, email, jlpt_level, phone')
    .eq('role', 'teacher')

  const { data: colleges } = await supabase
    .from('colleges')
    .select('id, name, category')
    .eq('status', 'Active')
    .order('name')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ivory)' }}>
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <BatchesClient initialBatches={batches || []} teachers={teachers || []} colleges={colleges || []} />
      </main>
    </div>
  )
}
