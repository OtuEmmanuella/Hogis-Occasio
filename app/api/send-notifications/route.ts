import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD missing from .env.local')
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
}

// ── Two new params: holidayName + holidayEmoji ──────────────────────────────
async function sendEmail(
  to: string,
  name: string,
  subject: string,
  message: string,
  holidayName: string,
  holidayEmoji: string
) {
  const transporter = getTransporter()
  const fromEmail = process.env.GMAIL_USER!

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#e8e4dc;font-family:'Georgia',serif;">
<div style="background:#e8e4dc;padding:32px 16px;">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #c9b87a;">

  <!-- ══ HEADER ══ -->
  <div style="background:linear-gradient(160deg,#1a1a1a 0%,#2d2d2d 60%,#1a1a1a 100%);text-align:center;">
    <div style="background:linear-gradient(90deg,#8b6914,#c9a227,#f0d060,#c9a227,#8b6914);height:4px;"></div>
    <div style="padding:28px 40px 24px;position:relative;">
      <div style="font-size:9px;color:#c9a227;letter-spacing:6px;margin-bottom:6px;">✦ ✦ ✦</div>
      <div style="font-size:36px;font-weight:700;color:#f0d060;letter-spacing:8px;line-height:1;">HOGIS</div>
      <div style="font-size:11px;color:#c9a227;letter-spacing:10px;margin-top:3px;margin-bottom:10px;">GROUP</div>
      <div style="font-size:10px;color:#9a9a8a;letter-spacing:3px;font-style:italic;">Affordable Luxury &middot;</div>
    </div>
    <div style="background:linear-gradient(90deg,#8b6914,#c9a227,#f0d060,#c9a227,#8b6914);height:3px;"></div>
  </div>

  <!-- ══ SEASONAL BANNER ══ -->
  <div style="background:linear-gradient(135deg,#f9f4e8,#fdf8ee,#f9f4e8);padding:20px 40px 16px;text-align:center;border-bottom:1px solid #e8ddb5;">
    <div style="font-size:32px;margin-bottom:6px;">${holidayEmoji}</div>
    <div style="font-size:22px;color:#7a5c00;letter-spacing:2px;font-weight:700;">Happy ${holidayName}!</div>
    <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#c9a227,transparent);margin:10px auto 0;"></div>
  </div>

  <!-- ══ MESSAGE BODY ══ -->
  <div style="padding:36px 44px 30px;background:#fafaf8;">
    <p style="font-size:16px;color:#3a3228;margin:0 0 18px;line-height:1.5;">
      Dear <strong style="color:#7a5c00;">${name}</strong>,
    </p>
    <div style="background:#ffffff;border-left:4px solid #c9a227;border-radius:0 8px 8px 0;padding:22px 24px;margin:0 0 24px;border:1px solid #ede8d5;border-left:4px solid #c9a227;">
      <p style="font-size:16px;color:#2a2318;line-height:1.85;margin:0;">
        ${message.replace(/\n/g, '<br>')}
      </p>
    </div>
    <div style="border-top:1px solid #e8ddb5;padding-top:20px;">
      <p style="font-size:14px;color:#5a4a2a;margin:0 0 2px;">With warm regards,</p>
      <p style="font-size:15px;color:#7a5c00;font-weight:700;margin:0;letter-spacing:1px;">The Hogis Family</p>
    </div>
  </div>

  <!-- ══ GOLD DIVIDER ══ -->
  <div style="background:linear-gradient(90deg,#8b6914,#c9a227,#f0d060,#c9a227,#8b6914);height:3px;"></div>

  <!-- ══ BRANCHES ══ -->
  <div style="background:#1e1e1e;padding:30px 36px;">
    <div style="text-align:center;margin-bottom:22px;">
      <div style="font-size:9px;color:#c9a227;letter-spacing:5px;margin-bottom:6px;">OUR HOTELS</div>
      <div style="width:40px;height:1px;background:#c9a227;margin:0 auto;"></div>
    </div>

    <!-- Luxury Suites -->
    <div style="border:1px solid #3a3020;border-radius:6px;padding:16px 18px;margin-bottom:12px;background:#252010;">
      <div style="font-size:10px;color:#c9a227;letter-spacing:3px;margin-bottom:4px;">✦ LUXURY</div>
      <div style="font-size:15px;color:#f0d060;font-weight:700;margin-bottom:4px;">Hogis Luxury Suites</div>
      <div style="font-size:12px;color:#9a9080;margin-bottom:10px;">7 Akim Close, Marian, Calabar</div>
      <div style="border-top:1px solid #3a3020;padding-top:10px;font-size:12px;">
        <a href="tel:+2348099903335" style="color:#c9a227;text-decoration:none;">📞 +234 809 990 3335</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="mailto:info@hogisluxurysuites.com" style="color:#9a9080;text-decoration:none;">info@hogisluxurysuites.com</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="https://hogisluxurysuites.com" style="color:#c9a227;text-decoration:none;">hogisluxurysuites.com</a>
      </div>
    </div>

    <!-- Royale -->
    <div style="border:1px solid #3a3020;border-radius:6px;padding:16px 18px;margin-bottom:12px;background:#1e1c14;">
      <div style="font-size:10px;color:#c9a227;letter-spacing:3px;margin-bottom:4px;">✦ ROYALE</div>
      <div style="font-size:15px;color:#f0d060;font-weight:700;margin-bottom:4px;">Hogis Royale Apartments &amp; Suites</div>
      <div style="font-size:12px;color:#9a9080;margin-bottom:10px;">6 Bishop Moynagh Ave, State Housing Estate, Calabar</div>
      <div style="border-top:1px solid #3a3020;padding-top:10px;font-size:12px;">
        <a href="tel:+2347073536464" style="color:#c9a227;text-decoration:none;">📞 +234 707 353 6464</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="mailto:hogisroyaleandapartment@gmail.com" style="color:#9a9080;text-decoration:none;">hogisroyaleandapartment@gmail.com</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="https://hogisroyale.com" style="color:#c9a227;text-decoration:none;">hogisroyale.com</a>
      </div>
    </div>

    <!-- Kingscourt -->
    <div style="border:1px solid #3a3020;border-radius:6px;padding:16px 18px;background:#1e1c14;">
      <div style="font-size:10px;color:#c9a227;letter-spacing:3px;margin-bottom:4px;">✦ KINGSCOURT</div>
      <div style="font-size:15px;color:#f0d060;font-weight:700;margin-bottom:4px;">Hogis Kingscourt</div>
      <div style="font-size:12px;color:#9a9080;margin-bottom:10px;">1 Akim Close, Marian, Calabar</div>
      <div style="border-top:1px solid #3a3020;padding-top:10px;font-size:12px;">
        <a href="https://hogisgroup.com" style="color:#c9a227;text-decoration:none;">🌐 hogisgroup.com</a>
      </div>
    </div>
  </div>

  <!-- ══ GOLD DIVIDER ══ -->
  <div style="background:linear-gradient(90deg,#8b6914,#c9a227,#f0d060,#c9a227,#8b6914);height:2px;"></div>

  <!-- ══ FOOTER ══ -->
  <div style="background:#141414;padding:20px 36px;text-align:center;">
    <div style="margin-bottom:14px;">
      <a href="https://hogisgroup.com" style="font-size:11px;color:#9a9080;text-decoration:none;margin:0 12px;letter-spacing:1px;">hogisgroup.com</a>
      <span style="color:#c9a227;font-size:8px;">✦</span>
      <a href="https://www.instagram.com/hogisgroup/" style="font-size:11px;color:#9a9080;text-decoration:none;margin:0 12px;letter-spacing:1px;">@hogisgroup</a>
    </div>
    <div style="margin-bottom:14px;">
      <a href="https://www.instagram.com/hogisgroup/" style="background:#2a200a;border:1px solid #c9a227;border-radius:4px;padding:6px 14px;font-size:11px;color:#c9a227;text-decoration:none;letter-spacing:1px;margin:0 5px;">Instagram</a>
      <a href="https://hogisgroup.com" style="background:#2a200a;border:1px solid #c9a227;border-radius:4px;padding:6px 14px;font-size:11px;color:#c9a227;text-decoration:none;letter-spacing:1px;margin:0 5px;">Book a Stay</a>
    </div>
    <div style="font-size:10px;color:#4a4840;line-height:1.7;">
      &copy; ${new Date().getFullYear()} Hogis Group &middot; All Rights Reserved<br>
      Sent via Hogis Occasio &mdash; Smart Holiday Notifications
    </div>
  </div>

</div>
</div>
</body>
</html>`

  console.log('[Gmail] Sending to:', to, '| from:', fromEmail)
  const info = await transporter.sendMail({
    from: `"Hogis Group" <${fromEmail}>`,
    to,
    subject,
    html,
  })
  console.log('[Gmail] Message sent:', info.messageId)
  return info
}


async function sendSMS(to: string, message: string) {
  const provider = process.env.SMS_PROVIDER || 'ebulksms'

  // ── eBulkSMS (default) ──────────────────────────────────────────
  if (provider === 'ebulksms') {
    const username = process.env.EBULKSMS_USERNAME
    const apiKey = process.env.EBULKSMS_API_KEY
    if (!username) throw new Error('EBULKSMS_USERNAME not configured')
    if (!apiKey) throw new Error('EBULKSMS_API_KEY not configured')

    const senderId = process.env.EBULKSMS_SENDER_ID || 'Hogis'
    const formattedPhone = to.replace(/^\+/, '') // 2349067359156 not +2349067359156

    const payload = {
      SMS: {
        auth: { username, apikey: apiKey },
        message: { sender: senderId, messagetext: message, flash: '0' },
        recipients: { gsm: [{ msidn: formattedPhone }] },
      },
    }

    console.log('[eBulkSMS] Sending to:', formattedPhone, '| sender:', senderId)

    const res = await fetch('https://api.ebulksms.com/sendsms.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const rawText = await res.text()
    console.log('[eBulkSMS] Status:', res.status, '| Raw:', rawText)

    let body: any = null
    try { body = JSON.parse(rawText) } catch { throw new Error(`eBulkSMS error: ${rawText}`) }

    if (!res.ok) throw new Error(`eBulkSMS HTTP error ${res.status}: ${JSON.stringify(body)}`)

    const statusCode = body?.SMS?.STATUS?.STATUS_CODE
    const statusText = body?.SMS?.STATUS?.STATUS_TEXT
    if (statusCode && statusCode !== '1801') {
      throw new Error(`eBulkSMS failed: ${statusText || JSON.stringify(body)}`)
    }

    console.log('[eBulkSMS] ✅ SMS sent successfully | Balance:', body?.SMS?.BALANCE)
    return body

  // ── Africa's Talking (fallback) ─────────────────────────────────
  } else if (provider === 'africastalking') {
    const apiKey = process.env.AFRICASTALKING_API_KEY
    const username = process.env.AFRICASTALKING_USERNAME
    if (!apiKey) throw new Error("Africa's Talking API key not configured")
    if (!username) throw new Error("Africa's Talking username not configured")

    const formattedPhone = to.replace(/^\+/, '')
    const params = new URLSearchParams({ username, to: formattedPhone, message })

    console.log('[AfricasTalking] Sending to:', formattedPhone)

    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'apiKey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    })

    const rawBody = await res.text()
    console.log('[AfricasTalking] Status:', res.status, '| Raw:', rawBody)

    let body: any = null
    try { body = JSON.parse(rawBody) } catch { throw new Error(`Africa's Talking error: ${rawBody}`) }
    if (!res.ok) throw new Error(`Africa's Talking error: ${JSON.stringify(body)}`)

    const recipients = body?.SMSMessageData?.Recipients
    if (!recipients || recipients.length === 0) {
      throw new Error(`Africa's Talking rejected: ${body?.SMSMessageData?.Message || 'No recipients'}`)
    }

    const recipient = recipients[0]
    if (recipient.status !== 'Success') throw new Error(`Africa's Talking failed: ${recipient.status}`)

    console.log('[AfricasTalking] ✅ Success | Cost:', recipient.cost)
    return body
  }

  throw new Error(`Unknown SMS provider: ${provider}`)
}


function personalizeMessage(template: string, name: string): string {
  return template.replace(/\{\{name\}\}/g, name).replace(/\{name\}/g, name)
}

export async function POST(req: NextRequest) {
  try {
    const { holidayId, groups, guestIds, channels, customMessage } = await req.json()

    console.log('[SendNotifications] Request:', { holidayId, groups, guestIds, channels })
    console.log('[SendNotifications] GMAIL_USER set:', !!process.env.GMAIL_USER)
    console.log('[SendNotifications] AT username:', process.env.AFRICASTALKING_USERNAME)

    const { data: holiday, error: hErr } = await supabaseAdmin
      .from('holidays')
      .select('*')
      .eq('id', holidayId)
      .single()

    if (hErr || !holiday) {
      console.error('[SendNotifications] Holiday not found:', hErr)
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 })
    }

    console.log('[SendNotifications] Holiday:', holiday.name)

    let query = supabaseAdmin.from('guests').select('*').eq('is_active', true)
    if (guestIds && guestIds.length > 0) {
      query = query.in('id', guestIds)
    } else if (groups && groups.length > 0) {
      query = query.in('group_name', groups)
    }

    const { data: guests, error: gErr } = await query

    if (gErr) {
      console.error('[SendNotifications] Error fetching guests:', gErr)
      return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 })
    }

    if (!guests || guests.length === 0) {
      return NextResponse.json({ error: 'No active guests found', sent: 0, failed: 0, total: 0 })
    }

    console.log('[SendNotifications] Guests found:', guests.length)

    const message = customMessage || holiday.message_template || `Happy ${holiday.name}! Warm wishes from the Hogis family!`
    const subject = `${holiday.emoji} Happy ${holiday.name} from Hogis!`

    // ── Pull these out once so they're available everywhere below ──
    const holidayName: string = holiday.name
    const holidayEmoji: string = holiday.emoji || '🎉'

    let sent = 0
    let failed = 0
    const logs: any[] = []

    for (const guest of guests) {
      const personalMsg = personalizeMessage(message, guest.name.split(' ')[0])

      if (channels.email && guest.notify_email && guest.email) {
        let status = 'sent'
        let errorMsg = null
        try {
          // ── Pass holidayName + holidayEmoji into sendEmail ──
          await sendEmail(guest.email, guest.name, subject, personalMsg, holidayName, holidayEmoji)
          sent++
          console.log('[SendNotifications] Email sent to:', guest.email)
        } catch (err: any) {
          status = 'failed'
          errorMsg = err.message
          failed++
          console.error('[SendNotifications] Email FAILED:', guest.email, '|', err.message)
        }
        logs.push({
          guest_id: guest.id,
          holiday_id: holiday.id,
          channel: 'email',
          status,
          message_preview: personalMsg.substring(0, 100),
          sent_at: status === 'sent' ? new Date().toISOString() : null,
          error_message: errorMsg,
        })
      }

      if (channels.sms && guest.notify_sms && guest.phone) {
        let status = 'sent'
        let errorMsg = null
        try {
          // Strip emojis — they force UCS-2 encoding which cuts SMS to 70 chars
          // and shows as ? or garbled signs on Nigerian phones
          const stripEmojis = (str: string) =>
            str.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u2764\u2665]/gu, '').replace(/\s+/g, ' ').trim()
          // 459 chars = 3 SMS parts (each 153 chars) — full message gets through
          const smsMsg = stripEmojis(personalMsg).substring(0, 459)
          await sendSMS(guest.phone, smsMsg)
          sent++
          console.log('[SendNotifications] SMS sent to:', guest.phone)
        } catch (err: any) {
          status = 'failed'
          errorMsg = err.message
          failed++
          console.error('[SendNotifications] SMS FAILED:', guest.phone, '|', err.message)
        }
        logs.push({
          guest_id: guest.id,
          holiday_id: holiday.id,
          channel: 'sms',
          status,
          message_preview: personalMsg.substring(0, 100),
          sent_at: status === 'sent' ? new Date().toISOString() : null,
          error_message: errorMsg,
        })
      }
    }

    if (logs.length > 0) {
      const { error: logErr } = await supabaseAdmin.from('notification_logs').insert(logs)
      if (logErr) console.error('[SendNotifications] Log insert error:', logErr)
    }

    console.log('[SendNotifications] Done — sent:', sent, 'failed:', failed)
    return NextResponse.json({ success: true, sent, failed, total: sent + failed, holiday: holiday.name })

  } catch (err: any) {
    console.error('[SendNotifications] Unhandled error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}