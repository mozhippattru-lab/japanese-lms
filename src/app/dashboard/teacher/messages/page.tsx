import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MessagesClient from '@/components/MessagesClient'
import { loadMessagingData } from '@/lib/messages'

export default async function TeacherMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect(`/dashboard/${profile?.role || 'student'}`)

  const { contacts, messages, parties } = await loadMessagingData(user.id, 'teacher')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa' }}>
      <Sidebar role="teacher" userName={profile?.full_name || user.email || 'Teacher'} />
      <main style={{ marginLeft: '260px', flex: 1, padding: '28px 32px' }}>
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
