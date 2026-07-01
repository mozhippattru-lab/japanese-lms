import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'

// Dispatcher: sends a logged-in user to their role dashboard.
export default async function DashboardIndex() {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  redirect(`/dashboard/${user.role || 'student'}`)
}
