import { sql } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import MessagesClient from '@/components/MessagesClient'
import { loadMessagingData } from '@/lib/messages'
import { DashStyles } from '@/components/DashboardKit'

export default async function StudentMessagesPage() {
  const user = await requireRole('student')
  const [profile] = await sql`select * from profiles where id = ${user.id} limit 1`

  const { contacts, messages, parties } = await loadMessagingData(user.id, 'student')

  return (
    <div className="dash-shell">
      <Sidebar role="student" userName={profile?.full_name || user.email || 'Student'} />
      <main className="dash-main">
        <DashStyles />
        <MessagesClient
          me={{ id: user.id, role: 'student', name: profile?.full_name || user.email || 'Student' }}
          contacts={contacts}
          messages={messages}
          parties={parties}
        />
      </main>
    </div>
  )
}
