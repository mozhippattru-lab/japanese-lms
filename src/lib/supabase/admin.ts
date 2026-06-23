import { createClient } from '@supabase/supabase-js'

// Service-role client — SERVER ONLY. Never import into a client component.
// Used to resolve cross-user data (e.g. messaging contacts) where per-user
// RLS would otherwise hide rows.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}
