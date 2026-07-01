/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import TeacherAttendanceClient from './TeacherAttendanceClient'
import { DashStyles } from '@/components/DashboardKit'

export default async function TeacherAttendancePage() {
  const user = await requireRole('teacher')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const batches = await sql`
    select id, name, jlpt_level, time_slot, days, enrolled, capacity, status
    from batches where teacher_id = ${user.id} order by created_at desc
  `

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main className="dash-main">
        <DashStyles />
        <TeacherAttendanceClient batches={batches as any[]} />
      </main>
    </div>
  )
}
