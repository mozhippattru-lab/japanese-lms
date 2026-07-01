import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import { DashStyles } from '@/components/DashboardKit'
import SettingsClient, { type AppSettings } from './SettingsClient'

export default async function SettingsPage() {
  const user = await requireRole('admin')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const [settingsRows, studentRows, teacherRows, batchRows] = await Promise.all([
    sql`select * from app_settings where id = 'default' limit 1`,
    sql`select count(*)::int as count from profiles where role = 'student' and status = 'Active'`,
    sql`select count(*)::int as count from profiles where role = 'teacher' and status = 'Active'`,
    sql`select count(*)::int as count from batches where status = 'Active'`,
  ])

  return (
    <div className="dash-shell">
      <Sidebar role="admin" userName={profile?.full_name || user.email || 'Admin'} />
      <main className="dash-main">
        <DashStyles />
        <SettingsClient
          initial={(settingsRows[0] || { id: 'default' }) as AppSettings}
          counts={{ students: studentRows[0]?.count || 0, teachers: teacherRows[0]?.count || 0, batches: batchRows[0]?.count || 0 }}
          adminEmail={profile?.email || user.email || ''}
        />
      </main>
    </div>
  )
}
