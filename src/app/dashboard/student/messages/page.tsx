import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MessagesClient from '@/components/MessagesClient'
import { loadMessagingData } from '@/lib/messages'
import { DashStyles } from '@/components/DashboardKit'

export default async function StudentMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'student') redirect(`/dashboard/${profile?.role || 'student'}`)

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
