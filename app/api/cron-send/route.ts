import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Verify this is a legitimate cron call
function isAuthorized(req: NextRequest): boolean {
  const secret = req.headers.get('x-cron-secret')
  return secret === process.env.CRON_SECRET
}

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })
}

function stripEmojis(str: string): string {
  return str
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u2764\u2665]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function personalizeMessage(template: string, name: string): string {
  return template.replace(/\{\{name\}\}/g, name).replace(/\{name\}/g, name)
}

async function sendEmail(to: string, name: string, subject: string, message: string) {
  const transporter = getTransporter()
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#f4f4f5;font-family:'Segoe UI',system-ui,sans-serif;color:#18181b}
    .container{max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
    .header{background:linear-gradient(135deg,#010409,#0d1117);padding:32px;text-align:center}
    .logo-main{font-size:28px;font-weight:900;color:white;letter-spacing:3px}
    .logo-sub{font-size:10px;color:rgba(0,245,255,0.6);letter-spacing:6px;margin-top:2px}
    .body{padding:36px 32px}
    .greeting{font-size:16px;color:#52525b;margin-bottom:20px}
    .message-box{background:#f8fafc;border-left:4px solid #00c8ff;border-radius:8px;padding:24px;margin:20px 0}
    .message{font-size:16px;line-height:1.75;color:#18181b}
    .footer{background:#f4f4f5;padding:20px 32px;text-align:center}
    .footer-text{font-size:11px;color:#a1a1aa;line-height:1.6}
  </style></head><body>
  <div class="container">
    <div class="header"><div class="logo-main">HOGIS</div><div class="logo-sub">GROUP</div></div>
    <div class="body">
      <p class="greeting">Hello <strong>${name}</strong>,</p>
      <div class="message-box"><p class="message">${message.replace(/\n/g, '<br>')}</p></div>
      <p style="font-size:14px;color:#71717a;margin-top:24px">With warm wishes,<br><strong>The Hogis Family</strong></p>
    </div>
    <div class="footer"><p class="footer-text">Sent via Hogis Occasio &mdash; Smart Holiday Notifications<br>&copy; ${new Date().getFullYear()} Hogis Group. All rights reserved.</p></div>
  </div></body></html>`

  return transporter.sendMail({
    from: `"Hogis Group" <${process.env.GMAIL_USER}>`,
    to, subject, html,
  })
}

async function sendSMS(to: string, message: string) {
  const username = process.env.EBULKSMS_USERNAME
  const apiKey = process.env.EBULKSMS_API_KEY
  if (!username || !apiKey) throw new Error('eBulkSMS credentials not configured')

  const formattedPhone = to.replace(/^\+/, '')
  const payload = {
    SMS: {
      auth: { username, apikey: apiKey },
      message: { sender: process.env.EBULKSMS_SENDER_ID || 'Hogis', messagetext: message, flash: '0' },
      recipients: { gsm: [{ msidn: formattedPhone }] },
    },
  }

  const res = await fetch('https://api.ebulksms.com/sendsms.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const rawText = await res.text()
  let body: any = null
  try { body = JSON.parse(rawText) } catch { throw new Error(`eBulkSMS error: ${rawText}`) }
  if (!res.ok) throw new Error(`eBulkSMS error: ${JSON.stringify(body)}`)

  const statusCode = body?.SMS?.STATUS?.STATUS_CODE
  if (statusCode && statusCode !== '1801') {
    throw new Error(`eBulkSMS failed: ${body?.SMS?.STATUS?.STATUS_TEXT}`)
  }
  return body
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get today's date in Nigeria timezone (WAT = UTC+1)
  const today = new Date()
  today.setHours(today.getHours() + 1) // WAT
  const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD

  console.log('[CronSend] Running for date:', todayStr)

  // Find all active holidays for today
  const { data: holidays, error: hErr } = await supabaseAdmin
    .from('holidays')
    .select('*')
    .eq('date', todayStr)
    .eq('is_active', true)

  if (hErr) {
    console.error('[CronSend] Holiday fetch error:', hErr)
    return NextResponse.json({ error: hErr.message }, { status: 500 })
  }

  if (!holidays || holidays.length === 0) {
    console.log('[CronSend] No holidays today')
    return NextResponse.json({ message: 'No holidays today', date: todayStr })
  }

  console.log(`[CronSend] Found ${holidays.length} holiday(s) today:`, holidays.map((h: any) => h.name))

  // Get all active guests
  const { data: guests, error: gErr } = await supabaseAdmin
    .from('guests')
    .select('*')
    .eq('is_active', true)

  if (gErr || !guests || guests.length === 0) {
    console.log('[CronSend] No active guests')
    return NextResponse.json({ message: 'No active guests', date: todayStr })
  }

  let totalSent = 0
  let totalFailed = 0
  const results: any[] = []

  for (const holiday of holidays) {
    const message = holiday.message_template ||
      `Happy ${holiday.name}! Warm wishes from the Hogis family!`
    const subject = `${holiday.emoji} Happy ${holiday.name} from Hogis!`

    let holidaySent = 0
    let holidayFailed = 0
    const logs: any[] = []

    for (const guest of guests) {
      const personalMsg = personalizeMessage(message, guest.name.split(' ')[0])

      // Send email
      if (guest.notify_email && guest.email) {
        let status = 'sent'
        let errorMsg = null
        try {
          await sendEmail(guest.email, guest.name, subject, personalMsg)
          holidaySent++
          console.log('[CronSend] Email sent to:', guest.email)
        } catch (err: any) {
          status = 'failed'
          errorMsg = err.message
          holidayFailed++
          console.error('[CronSend] Email FAILED:', guest.email, err.message)
        }
        logs.push({
          guest_id: guest.id, holiday_id: holiday.id, channel: 'email', status,
          message_preview: personalMsg.substring(0, 100),
          sent_at: status === 'sent' ? new Date().toISOString() : null,
          error_message: errorMsg,
        })
      }

      // Send SMS
      if (guest.notify_sms && guest.phone) {
        let status = 'sent'
        let errorMsg = null
        try {
          const smsMsg = stripEmojis(personalMsg).substring(0, 459)
          await sendSMS(guest.phone, smsMsg)
          holidaySent++
          console.log('[CronSend] SMS sent to:', guest.phone)
        } catch (err: any) {
          status = 'failed'
          errorMsg = err.message
          holidayFailed++
          console.error('[CronSend] SMS FAILED:', guest.phone, err.message)
        }
        logs.push({
          guest_id: guest.id, holiday_id: holiday.id, channel: 'sms', status,
          message_preview: personalMsg.substring(0, 100),
          sent_at: status === 'sent' ? new Date().toISOString() : null,
          error_message: errorMsg,
        })
      }
    }

    // Log everything to DB
    if (logs.length > 0) {
      const { error: logErr } = await supabaseAdmin.from('notification_logs').insert(logs)
      if (logErr) console.error('[CronSend] Log insert error:', logErr)
    }

    totalSent += holidaySent
    totalFailed += holidayFailed
    results.push({ holiday: holiday.name, sent: holidaySent, failed: holidayFailed })
    console.log(`[CronSend] ${holiday.name} — sent: ${holidaySent}, failed: ${holidayFailed}`)
  }

  return NextResponse.json({
    success: true,
    date: todayStr,
    holidays: holidays.map((h: any) => h.name),
    totalSent,
    totalFailed,
    results,
  })
}