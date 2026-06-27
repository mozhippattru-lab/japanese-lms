import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Mozhippattru Japanese School <japanese.school@mozhippattru.org>'

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
