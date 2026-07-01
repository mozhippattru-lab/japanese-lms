import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import MessagesClient from '@/components/MessagesClient'
import { loadMessagingData } from '@/lib/messages'
import { DashStyles } from '@/components/DashboardKit'

export default async function TeacherMessagesPage() {
  const user = await requireRole('teacher')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const { contacts, messages, parties } = await loadMessagingData(user.id, 'teacher')

  return (
    <div className="dash-shell">
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main className="dash-main">
        <DashStyles />
        <MessagesClient
          me={{ id: user.id, role: 'teacher', name: profile?.full_name || user.email || 'Teacher' }}
          contacts={contacts}
          messages={messages}
          parties={parties}
        />
      </main>
    </div>
  )
}
