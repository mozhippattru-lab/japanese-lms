import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(request: Request) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: 'https://mozhippattru.org/reset-password' },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const resetUrl = data.properties.action_link

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Mozhippattru Japanese School <noreply@mail.mozhippattru.org>',
      to: email,
      subject: 'Reset your password — Mozhippattru',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h2 style="color:#1a1f3c;margin:0 0 12px">Reset your password</h2>
          <p style="color:#6b7280;line-height:1.6;margin:0 0 24px">
            We received a request to reset the password for your Mozhippattru account.
            Click the button below to choose a new password.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#e84040;color:#fff;text-decoration:none;padding:13px 28px;border-radius:10px;font-weight:700;font-size:15px">
            Reset password
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;line-height:1.6">
            If you didn't request this, you can safely ignore this email. The link expires in 24 hours.
          </p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    return NextResponse.json({ error: `Email send failed: ${body}` }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
