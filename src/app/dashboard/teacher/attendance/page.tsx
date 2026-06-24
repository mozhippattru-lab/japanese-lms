import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TeacherAttendanceClient from './TeacherAttendanceClient'
import { DashStyles } from '@/components/DashboardKit'

export default async function TeacherAttendancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  const { data: batches } = await supabase
    .from('batches')
    .select('id, name, jlpt_level, time_slot, days, enrolled, capacity, status')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main className="dash-main">
        <DashStyles />
        <TeacherAttendanceClient batches={batches || []} />
      </main>
    </div>
  )
}
