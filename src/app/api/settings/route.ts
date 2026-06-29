import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const db = createAdminClient()
  const { error } = await db.from('app_settings').upsert({
    id: 'default',
    institute_name_ta: body.institute_name_ta ?? null,
    institute_name_en: body.institute_name_en ?? null,
    tagline: body.tagline ?? null,
    address: body.address ?? null,
    phone: body.phone ?? null,
    email: body.email ?? null,
    registration_no: body.registration_no ?? null,
    working_start: body.working_start ?? '09:00 AM',
    working_end: body.working_end ?? '07:00 PM',
    currency: body.currency ?? '₹',
    academic_year: body.academic_year ?? null,
    // Access control
    student_login_blocked: body.student_login_blocked ?? false,
    teacher_login_blocked: body.teacher_login_blocked ?? false,
    new_registrations_open: body.new_registrations_open ?? true,
    maintenance_mode: body.maintenance_mode ?? false,
    blocked_message: body.blocked_message ?? null,
    // Notifications
    whatsapp_notifications: body.whatsapp_notifications ?? true,
    email_notifications: body.email_notifications ?? true,
    fee_reminders_enabled: body.fee_reminders_enabled ?? false,
    fee_reminder_days: body.fee_reminder_days ?? 3,
    // Finance
    late_fee_pct: body.late_fee_pct ?? 0,
    updated_at: new Date().toISOString(),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
