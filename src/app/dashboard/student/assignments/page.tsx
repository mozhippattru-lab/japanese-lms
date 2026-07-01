import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import StudentWorkClient from './StudentWorkClient'
import { loadStudentWork } from './load'
import { DashStyles } from '@/components/DashboardKit'

export default async function StudentAssignmentsPage() {
  const user = await requireRole('student')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const items = await loadStudentWork(user.id, 'Assignment')

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main className="dash-main">
        <DashStyles />
        <StudentWorkClient kind="Assignment" studentId={user.id} initialItems={items} />
      </main>
    </div>
  )
}
