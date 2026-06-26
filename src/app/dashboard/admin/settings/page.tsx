import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { DashStyles } from '@/components/DashboardKit'
import SettingsClient, { type AppSettings } from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const db = createAdminClient()
  const [
    { data: settings },
    { count: students },
    { count: teachers },
    { count: batches },
  ] = await Promise.all([
    db.from('app_settings').select('*').eq('id', 'default').single(),
    db.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student').eq('status', 'Active'),
    db.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher').eq('status', 'Active'),
    db.from('batches').select('id', { count: 'exact', head: true }).eq('status', 'Active'),
  ])

  return (
    <div className="dash-shell">
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main className="dash-main">
        <DashStyles />
        <SettingsClient
          initial={(settings || { id: 'default' }) as AppSettings}
          counts={{ students: students || 0, teachers: teachers || 0, batches: batches || 0 }}
          adminEmail={profile?.email || user.email || ''}
        />
      </main>
    </div>
  )
}
