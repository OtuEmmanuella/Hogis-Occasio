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

async function sendEmail(to: string, name: string, subject: string, message: string) {
  const transporter = getTransporter()
  const fromEmail = process.env.GMAIL_USER!

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f4f4f5; font-family: 'Segoe UI', system-ui, sans-serif; color: #18181b; }
    .container { max-width: 560px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #010409, #0d1117); padding: 32px; text-align: center; }
    .logo-powered { font-size: 10px; color: rgba(0,245,255,0.5); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 6px; }
    .logo-main { font-size: 28px; font-weight: 900; color: white; letter-spacing: 3px; }
    .logo-sub { font-size: 10px; color: rgba(0,245,255,0.6); letter-spacing: 6px; margin-top: 2px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 16px; color: #52525b; margin-bottom: 20px; }
    .message-box { background: #f8fafc; border-left: 4px solid #00c8ff; border-radius: 8px; padding: 24px; margin: 20px 0; }
    .message { font-size: 16px; line-height: 1.75; color: #18181b; }
    .divider { height: 1px; background: #e4e4e7; margin: 24px 0; }
    .sign-off { font-size: 14px; color: #71717a; }
    .sign-off strong { color: #0d1117; }
    .footer { background: #f4f4f5; padding: 20px 32px; text-align: center; }
    .footer-text { font-size: 11px; color: #a1a1aa; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-powered">POWERED BY</div>
      <div class="logo-main">HOGIS</div>
      <div class="logo-sub">OCCASIO</div>
    </div>
    <div class="body">
      <p class="greeting">Hello <strong>${name}</strong>,</p>
      <div class="message-box">
        <p class="message">${message.replace(/\n/g, '<br>')}</p>
      </div>
      <div class="divider"></div>
      <p class="sign-off">
        With warm wishes,<br>
        <strong>The Hogis Family</strong>
      </p>
    </div>
    <div class="footer">
      <p class="footer-text">
        Sent via Hogis Occasio &mdash; Smart Holiday Notifications<br>
        &copy; ${new Date().getFullYear()} Hogis Group. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`

  console.log('[Gmail] Sending to:', to, '| from:', fromEmail)
  const info = await transporter.sendMail({
    from: `"Hogis Occasio" <${fromEmail}>`,
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

    // eBulkSMS returns STATUS_CODE 1801 for success
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

    let sent = 0
    let failed = 0
    const logs: any[] = []

    for (const guest of guests) {
      const personalMsg = personalizeMessage(message, guest.name.split(' ')[0])

      if (channels.email && guest.notify_email && guest.email) {
        let status = 'sent'
        let errorMsg = null
        try {
          await sendEmail(guest.email, guest.name, subject, personalMsg)
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