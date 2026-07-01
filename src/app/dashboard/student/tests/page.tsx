import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import StudentWorkClient from '../assignments/StudentWorkClient'
import { loadStudentWork } from '../assignments/load'
import { DashStyles } from '@/components/DashboardKit'

export default async function StudentTestsPage() {
  const user = await requireRole('student')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const items = await loadStudentWork(user.id, 'Test')

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main className="dash-main">
        <DashStyles />
        <StudentWorkClient kind="Test" studentId={user.id} initialItems={items} />
      </main>
    </div>
  )
}
