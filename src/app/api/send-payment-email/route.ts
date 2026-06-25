import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { studentName, studentEmail, amount, invoiceId, paymentMethod } = await req.json()

  if (!studentEmail) return NextResponse.json({ ok: false, error: 'No email' }, { status: 400 })

  const emailUser = process.env.EMAIL_USER
  const emailPass = process.env.EMAIL_PASS

  // If email not configured, skip silently (don't break payment flow)
  if (!emailUser || !emailPass) {
    console.warn('Email not configured — skipping congratulation email.')
    return NextResponse.json({ ok: true, skipped: true })
  }

  const donationAmount = Math.round(Number(amount) * 0.25)
  const courseFee = Math.round(Number(amount) * 0.75)
  const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: emailUser, pass: emailPass },
  })

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #f6f1e7; font-family: Inter, Arial, sans-serif; }
    .wrap { max-width: 580px; margin: 32px auto; background: #fff; border-radius: 12px;
      overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #161a33; padding: 36px 40px; text-align: center; }
    .logo { width: 52px; height: 52px; border-radius: 10px; background: #e24138;
      color: #fff; font-size: 26px; font-weight: 700; display: inline-flex;
      align-items: center; justify-content: center; margin-bottom: 14px; }
    .brand { color: #fff; font-size: 22px; font-weight: 700; margin: 0 0 4px; }
    .brand-sub { color: rgba(255,255,255,0.5); font-size: 13px; }
    .body { padding: 40px; }
    .greeting { font-size: 22px; font-weight: 700; color: #161a33; margin: 0 0 16px; }
    .text { font-size: 15px; line-height: 1.7; color: #5b564f; margin: 0 0 20px; }
    .success-badge { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;
      padding: 18px 22px; display: flex; align-items: center; gap: 14px; margin: 24px 0; }
    .check { width: 42px; height: 42px; border-radius: 50%; background: #22c55e;
      color: #fff; font-size: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .success-text strong { display: block; font-size: 15px; color: #15803d; font-weight: 700; margin-bottom: 3px; }
    .success-text span { font-size: 13px; color: #4ade80; }
    .donation-box { background: linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%);
      border: 1.5px solid #fecaca; border-radius: 10px; padding: 24px; margin: 24px 0; }
    .donation-title { font-size: 16px; font-weight: 700; color: #dc2626; margin: 0 0 16px;
      display: flex; align-items: center; gap: 8px; }
    .fee-row { display: flex; justify-content: space-between; padding: 10px 0;
      border-bottom: 1px dashed #fecaca; font-size: 14px; color: #5b564f; }
    .fee-row:last-child { border-bottom: none; font-weight: 700; color: #161a33; }
    .fee-row .highlight { color: #dc2626; font-weight: 700; }
    .wheelchair-note { background: #eff6ff; border-radius: 8px; padding: 16px 18px; margin: 20px 0;
      font-size: 14px; color: #1d4ed8; line-height: 1.65; }
    .cta { text-align: center; margin: 32px 0; }
    .cta-btn { background: #e24138; color: #fff; text-decoration: none; padding: 14px 32px;
      border-radius: 6px; font-weight: 700; font-size: 15px; display: inline-block; }
    .footer { background: #111425; padding: 28px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.45); font-size: 12.5px; margin: 0 0 6px; line-height: 1.6; }
    .footer-brand { color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">本</div>
      <div class="brand">மொழிப்பற்று · Mozhippattru</div>
      <div class="brand-sub">Japanese Language School · 日本語学校</div>
    </div>
    <div class="body">
      <p class="greeting">Dear ${studentName || 'Student'},</p>
      <p class="text">
        Thank you for enrolling with <strong>Mozhippattru Japanese Academy</strong>.
        Your payment has been received successfully. We&apos;re excited to have you on
        this Japanese language journey! 🎌
      </p>

      <div class="success-badge">
        <div class="check">✓</div>
        <div class="success-text">
          <strong>Payment Confirmed · ${invoiceId ? `Invoice #${invoiceId.slice(0, 8).toUpperCase()}` : 'Payment Received'}</strong>
          <span>Paid via ${paymentMethod || 'online'} · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div class="donation-box">
        <div class="donation-title">❤️ Your Contribution Breakdown</div>
        <div class="fee-row">
          <span>Total Amount Paid</span>
          <span>${inr(Number(amount))}</span>
        </div>
        <div class="fee-row">
          <span class="highlight">♿ 25% Wheelchair Donation Fund</span>
          <span class="highlight">${inr(donationAmount)}</span>
        </div>
        <div class="fee-row">
          <span>Your Course Fee</span>
          <span>${inr(courseFee)}</span>
        </div>
      </div>

      <div class="wheelchair-note">
        ♿ <strong>Because of your enrollment</strong>, ${inr(donationAmount)} has been contributed to our
        Electric Wheelchair Donation Fund. You are helping someone with a physical disability regain
        independence and mobility. Thank you for learning while making a positive impact on society.
      </div>

      <p class="text">
        Our team will reach out to you shortly with your batch details, class schedule,
        and access to the student portal. If you have any questions, feel free to reply to this email.
      </p>

      <div class="cta">
        <a href="https://mozhippattru.org/login" class="cta-btn">Access Student Portal →</a>
      </div>

      <p class="text" style="font-size:13px;color:#9ca3af;margin:0;">
        Regards,<br />
        <strong style="color:#161a33;">Mozhippattru Japanese Academy</strong><br />
        மொழிப்பற்று · Japanese Language School
      </p>
    </div>
    <div class="footer">
      <p class="footer-brand">மொழிப்பற்று · Mozhippattru · 日本語学校</p>
      <p>Japanese Language School · Online &amp; In-class · India</p>
      <p>mozhippattru@gmail.com · mozhippattru.org</p>
    </div>
  </div>
</body>
</html>`

  try {
    await transporter.sendMail({
      from: `"Mozhippattru Japanese Academy" <${emailUser}>`,
      to: studentEmail,
      subject: 'Thank You for Supporting Education & Mobility 🎌',
      html,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ ok: false, error: 'Email failed' }, { status: 500 })
  }
}
