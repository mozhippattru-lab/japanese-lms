import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ProfileClient from '@/components/ProfileClient'
import { DashStyles } from '@/components/DashboardKit'

export default async function StudentProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main className="dash-main">
        <DashStyles />
        <ProfileClient profile={{
          id: user.id,
          full_name: profile?.full_name ?? null,
          email: profile?.email ?? user.email ?? null,
          phone: profile?.phone ?? null,
          role: profile?.role ?? 'student',
          jlpt_level: profile?.jlpt_level ?? null,
          status: profile?.status ?? null,
          avatar_url: profile?.avatar_url ?? null,
        }} />
      </main>
    </div>
  )
}
