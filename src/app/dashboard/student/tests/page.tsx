import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import StudentWorkClient from '../assignments/StudentWorkClient'
import { loadStudentWork } from '../assignments/load'

export default async function StudentTestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  const items = await loadStudentWork(supabase, user.id, 'Test')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>
        <StudentWorkClient kind="Test" studentId={user.id} initialItems={items} />
      </main>
    </div>
  )
}
