import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Mozhippattru Japanese School <noreply@mail.mozhippattru.org>'

export async function sendPaymentConfirmation({
  to,
  studentName,
  amount,
  invoiceId,
  date,
}: {
  to: string
  studentName: string
  amount: number
  invoiceId: string
  date: string
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Payment Received — Mozhippattru Japanese School',
    html: `
      <div style="font-family:Georgia,serif;max-width:540px;margin:0 auto;padding:32px;color:#1a2340;">
        <h2 style="color:#1a2340;margin-bottom:4px;">Payment Confirmed</h2>
        <p style="color:#7a6a4a;font-size:14px;margin-top:0;">${date}</p>
        <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;">
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>We have received your payment of <strong>₹${amount.toLocaleString('en-IN')}</strong> for invoice <code>${invoiceId}</code>.</p>
        <p>Thank you for your continued trust in Mozhippattru Japanese Language School. Keep up the great work in your Japanese learning journey!</p>
        <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;">
        <p style="font-size:12px;color:#9a8a6a;">
          Mozhippattru Japanese Language School<br>
          +91 90928 82957 · japanese.school@mozhippattru.org
        </p>
      </div>
    `,
  })
}

export async function sendPasswordReset({ to, url }: { to: string; url: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset your password — Mozhippattru Japanese School',
    html: `
      <div style="font-family:Georgia,serif;max-width:540px;margin:0 auto;padding:32px;color:#1a2340;">
        <h2 style="color:#1a2340;margin-bottom:4px;">Reset your password</h2>
        <hr style="border:none;border-top:1px solid #e8e0d0;margin:20px 0;">
        <p>We received a request to reset your Mozhippattru account password. Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${url}" style="display:inline-block;background:#e84040;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;">Reset password</a>
        </p>
        <p style="font-size:13px;color:#7a6a4a;">If the button doesn't work, copy this link into your browser:<br><a href="${url}" style="color:#2d7dd2;word-break:break-all;">${url}</a></p>
        <p style="font-size:13px;color:#7a6a4a;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
        <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;">
        <p style="font-size:12px;color:#9a8a6a;">
          Mozhippattru Japanese Language School<br>
          +91 90928 82957 · japanese.school@mozhippattru.org
        </p>
      </div>
    `,
  })
}

export async function sendWelcome({
  to,
  studentName,
}: {
  to: string
  studentName: string
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to Mozhippattru Japanese School — ようこそ！',
    html: `
      <div style="font-family:Georgia,serif;max-width:540px;margin:0 auto;padding:32px;color:#1a2340;">
        <h2 style="color:#1a2340;">ようこそ、${studentName}さん！</h2>
        <p>Welcome to <strong>Mozhippattru Japanese Language School</strong>. We are delighted to have you with us.</p>
        <p>Your account is ready. You can log in at any time to view your classes, assignments, and progress.</p>
        <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;">
        <p style="font-size:12px;color:#9a8a6a;">
          Mozhippattru Japanese Language School<br>
          +91 90928 82957 · japanese.school@mozhippattru.org
        </p>
      </div>
    `,
  })
}
