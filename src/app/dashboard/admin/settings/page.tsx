import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import SettingsClient, { type AppSettings } from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/dashboard/${profile?.role || 'student'}`)

  const { data: settings } = await supabase.from('app_settings').select('*').eq('id', 'default').single()

  // Quick counts for the read-only "system" panel
  const [{ count: students }, { count: teachers }, { count: batches }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('batches').select('id', { count: 'exact', head: true }),
  ])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ivory)' }}>
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        <SettingsClient
          initial={(settings || { id: 'default' }) as AppSettings}
          counts={{ students: students || 0, teachers: teachers || 0, batches: batches || 0 }}
          adminEmail={profile?.email || user.email || ''}
        />
      </main>
    </div>
  )
}
