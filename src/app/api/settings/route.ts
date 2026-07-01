import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const me = await getSessionUser()
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (me.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const b = await req.json()
  try {
    await sql`
      insert into app_settings (
        id, institute_name_ta, institute_name_en, tagline, address, phone, email,
        registration_no, working_start, working_end, currency, academic_year,
        student_login_blocked, teacher_login_blocked, new_registrations_open, maintenance_mode, blocked_message,
        whatsapp_notifications, email_notifications, fee_reminders_enabled, fee_reminder_days, late_fee_pct, updated_at
      ) values (
        'default', ${b.institute_name_ta ?? null}, ${b.institute_name_en ?? null}, ${b.tagline ?? null}, ${b.address ?? null}, ${b.phone ?? null}, ${b.email ?? null},
        ${b.registration_no ?? null}, ${b.working_start ?? '09:00 AM'}, ${b.working_end ?? '07:00 PM'}, ${b.currency ?? '₹'}, ${b.academic_year ?? null},
        ${b.student_login_blocked ?? false}, ${b.teacher_login_blocked ?? false}, ${b.new_registrations_open ?? true}, ${b.maintenance_mode ?? false}, ${b.blocked_message ?? null},
        ${b.whatsapp_notifications ?? true}, ${b.email_notifications ?? true}, ${b.fee_reminders_enabled ?? false}, ${b.fee_reminder_days ?? 3}, ${b.late_fee_pct ?? 0}, now()
      )
      on conflict (id) do update set
        institute_name_ta = excluded.institute_name_ta,
        institute_name_en = excluded.institute_name_en,
        tagline = excluded.tagline,
        address = excluded.address,
        phone = excluded.phone,
        email = excluded.email,
        registration_no = excluded.registration_no,
        working_start = excluded.working_start,
        working_end = excluded.working_end,
        currency = excluded.currency,
        academic_year = excluded.academic_year,
        student_login_blocked = excluded.student_login_blocked,
        teacher_login_blocked = excluded.teacher_login_blocked,
        new_registrations_open = excluded.new_registrations_open,
        maintenance_mode = excluded.maintenance_mode,
        blocked_message = excluded.blocked_message,
        whatsapp_notifications = excluded.whatsapp_notifications,
        email_notifications = excluded.email_notifications,
        fee_reminders_enabled = excluded.fee_reminders_enabled,
        fee_reminder_days = excluded.fee_reminder_days,
        late_fee_pct = excluded.late_fee_pct,
        updated_at = now()
    `
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
