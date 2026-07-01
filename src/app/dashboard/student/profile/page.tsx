import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import ProfileClient from '@/components/ProfileClient'
import { DashStyles } from '@/components/DashboardKit'

export default async function StudentProfilePage() {
  const user = await requireRole('student')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

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
