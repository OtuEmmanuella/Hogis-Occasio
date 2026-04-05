import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BATCH_SIZE = 5
const MAX_RUNTIME_MS = 20000 // 20 seconds — leave room before Netlify's 26s limit

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const bearer = req.headers.get('authorization')
  const xSecret = req.headers.get('x-cron-secret')
  return bearer === `Bearer ${secret}` || xSecret === secret
}

function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) throw new Error('GMAIL credentials missing')
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
}

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
  const year = new Date().getFullYear()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ebe0;font-family:Georgia,serif;">

<div style="background:#f0ebe0;padding:24px 12px;">
<div style="max-width:600px;margin:0 auto;">

  <!-- TOP GOLD BAR -->
  <div style="height:5px;background:linear-gradient(90deg,#6b4f00,#c9a227,#f5d060,#e8bc30,#c9a227,#6b4f00);border-radius:2px 2px 0 0;"></div>

  <!-- HEADER -->
  <div style="background:linear-gradient(175deg,#111008 0%,#1e1a08 50%,#111008 100%);text-align:center;padding:36px 32px 28px;">
    <div style="display:inline-block;border:1px solid #c9a227;padding:4px 20px;margin-bottom:16px;">
      <span style="font-size:9px;color:#c9a227;letter-spacing:5px;text-transform:uppercase;">Established in Excellence</span>
    </div>
    <div style="font-size:42px;font-weight:700;color:#f5d060;letter-spacing:10px;line-height:1;margin-bottom:4px;text-shadow:0 0 30px rgba(201,162,39,0.3);">HOGIS</div>
    <div style="font-size:12px;color:#c9a227;letter-spacing:12px;margin-bottom:12px;">G R O U P</div>
    <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,#c9a227,transparent);margin:0 auto 10px;"></div>
    <div style="font-size:10px;color:#8a7a50;letter-spacing:3px;font-style:italic;">Affordable Luxury · Calabar, Nigeria</div>
  </div>

  <!-- HOLIDAY BANNER -->
  <div style="background:linear-gradient(135deg,#fdf8ed,#fef9f0,#fdf8ed);padding:28px 40px 24px;text-align:center;border-left:1px solid #ddd0a0;border-right:1px solid #ddd0a0;">
    <div style="font-size:44px;margin-bottom:10px;line-height:1;">${holidayEmoji}</div>
    <div style="font-size:10px;color:#a08040;letter-spacing:5px;margin-bottom:6px;text-transform:uppercase;">Warm Greetings From</div>
    <div style="font-size:24px;color:#6b4f00;font-weight:700;letter-spacing:2px;margin-bottom:4px;">The Hogis Family</div>
    <div style="font-size:14px;color:#9a7a30;font-style:italic;margin-bottom:14px;">on the occasion of ${holidayName}</div>
    <div style="width:100px;height:2px;background:linear-gradient(90deg,transparent,#c9a227,transparent);margin:0 auto;"></div>
  </div>

  <!-- MESSAGE BODY -->
  <div style="background:#ffffff;padding:40px 44px 36px;border-left:1px solid #ddd0a0;border-right:1px solid #ddd0a0;">

    <!-- Decorative top rule -->
    <div style="display:flex;align-items:center;margin-bottom:28px;">
      <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#ddd0a0);"></div>
      <div style="margin:0 12px;color:#c9a227;font-size:14px;">✦</div>
      <div style="flex:1;height:1px;background:linear-gradient(90deg,#ddd0a0,transparent);"></div>
    </div>

    <p style="font-size:17px;color:#3a2e1a;margin:0 0 20px;line-height:1.5;">
      Dear <strong style="color:#6b4f00;">${name}</strong>,
    </p>

    <!-- Message card -->
    <div style="background:linear-gradient(135deg,#fdfaf3,#fef9ee);border:1px solid #e8d898;border-left:5px solid #c9a227;border-radius:0 8px 8px 0;padding:26px 28px;margin-bottom:32px;position:relative;">
      <div style="position:absolute;top:-1px;left:-5px;width:5px;height:20px;background:#f5d060;border-radius:2px 0 0 0;"></div>
      <p style="font-size:16px;color:#2a2010;line-height:1.9;margin:0;">${message.replace(/\n/g, '<br>')}</p>
    </div>

    <!-- Sign-off -->
    <div style="border-top:1px solid #ede8d0;padding-top:22px;">
      <p style="font-size:13px;color:#7a6840;margin:0 0 4px;letter-spacing:1px;">With warm regards,</p>
      <p style="font-size:17px;color:#6b4f00;font-weight:700;margin:0 0 2px;letter-spacing:2px;">The Hogis Family</p>
      <p style="font-size:11px;color:#a09060;margin:0;letter-spacing:1px;font-style:italic;">Hogis Group Hotels · Calabar</p>
    </div>

    <!-- Decorative bottom rule -->
    <div style="display:flex;align-items:center;margin-top:28px;">
      <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#ddd0a0);"></div>
      <div style="margin:0 12px;color:#c9a227;font-size:14px;">✦</div>
      <div style="flex:1;height:1px;background:linear-gradient(90deg,#ddd0a0,transparent);"></div>
    </div>
  </div>

  <!-- GOLD DIVIDER -->
  <div style="height:4px;background:linear-gradient(90deg,#6b4f00,#c9a227,#f5d060,#e8bc30,#c9a227,#6b4f00);"></div>

  <!-- OUR HOTELS -->
  <div style="background:#131107;padding:32px 28px 24px;">

    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:9px;color:#c9a227;letter-spacing:6px;text-transform:uppercase;margin-bottom:8px;">Our Hotels</div>
      <div style="width:50px;height:1px;background:linear-gradient(90deg,transparent,#c9a227,transparent);margin:0 auto;"></div>
    </div>

    <!-- Hogis Luxury Suites -->
    <div style="border:1px solid #2a2408;background:#1c1a08;border-radius:6px;padding:18px 20px;margin-bottom:12px;">
      <div style="display:flex;align-items:flex-start;margin-bottom:10px;">
        <div style="flex:1;">
          <div style="font-size:9px;color:#c9a227;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;">Luxury</div>
          <div style="font-size:16px;color:#f5d060;font-weight:700;margin-bottom:3px;">Hogis Luxury Suites</div>
          <div style="font-size:12px;color:#7a6840;">7 Akim Close, Marian, Calabar</div>
        </div>
      </div>
      <div style="border-top:1px solid #2a2408;padding-top:10px;font-size:12px;color:#9a8850;">
        <a href="tel:+2348099903335" style="color:#c9a227;text-decoration:none;margin-right:14px;">&#128222; +234 809 990 3335</a>
        <a href="mailto:info@hogisluxurysuites.com" style="color:#9a8850;text-decoration:none;margin-right:14px;">info@hogisluxurysuites.com</a>
        <a href="https://hogisluxurysuites.com" style="color:#c9a227;text-decoration:none;">hogisluxurysuites.com</a>
      </div>
    </div>

    <!-- Hogis Royale -->
    <div style="border:1px solid #2a2408;background:#1a1806;border-radius:6px;padding:18px 20px;margin-bottom:12px;">
      <div style="margin-bottom:10px;">
        <div style="font-size:9px;color:#c9a227;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;">Royale</div>
        <div style="font-size:16px;color:#f5d060;font-weight:700;margin-bottom:3px;">Hogis Royale Apartments &amp; Suites</div>
        <div style="font-size:12px;color:#7a6840;">6 Bishop Moynagh Ave, State Housing Estate, Calabar</div>
      </div>
      <div style="border-top:1px solid #2a2408;padding-top:10px;font-size:12px;">
        <a href="tel:+2347073536464" style="color:#c9a227;text-decoration:none;margin-right:14px;">&#128222; +234 707 353 6464</a>
        <a href="mailto:hogisroyaleandapartment@gmail.com" style="color:#9a8850;text-decoration:none;margin-right:14px;">hogisroyaleandapartment@gmail.com</a>
        <a href="https://hogisroyale.com" style="color:#c9a227;text-decoration:none;">hogisroyale.com</a>
      </div>
    </div>

    <!-- Hogis Kingscourt -->
    <div style="border:1px solid #2a2408;background:#1a1806;border-radius:6px;padding:18px 20px;">
      <div style="margin-bottom:10px;">
        <div style="font-size:9px;color:#c9a227;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;">Kingscourt</div>
        <div style="font-size:16px;color:#f5d060;font-weight:700;margin-bottom:3px;">Hogis Kingscourt</div>
        <div style="font-size:12px;color:#7a6840;">1 Akim Close, Marian, Calabar</div>
      </div>
      <div style="border-top:1px solid #2a2408;padding-top:10px;font-size:12px;">
        <a href="https://hogisgroup.com" style="color:#c9a227;text-decoration:none;margin-right:14px;">&#127760; hogisgroup.com</a>
        <a href="mailto:hogisgrouphotels@gmail.com" style="color:#9a8850;text-decoration:none;">hogisgrouphotels@gmail.com</a>
      </div>
    </div>

  </div>

  <!-- BOTTOM GOLD BAR -->
  <div style="height:4px;background:linear-gradient(90deg,#6b4f00,#c9a227,#f5d060,#e8bc30,#c9a227,#6b4f00);"></div>

  <!-- FOOTER -->
  <div style="background:#0d0c04;padding:22px 28px;text-align:center;border-radius:0 0 4px 4px;">
    <div style="margin-bottom:14px;">
      <a href="https://www.instagram.com/hogisgroup/" style="display:inline-block;background:#1e1a06;border:1px solid #c9a227;border-radius:4px;padding:7px 16px;font-size:11px;color:#c9a227;text-decoration:none;letter-spacing:1px;margin:0 5px;">Instagram</a>
      <a href="https://hogisgroup.com" style="display:inline-block;background:#1e1a06;border:1px solid #c9a227;border-radius:4px;padding:7px 16px;font-size:11px;color:#c9a227;text-decoration:none;letter-spacing:1px;margin:0 5px;">Book a Stay</a>
      <a href="https://hogisgroup.com" style="display:inline-block;background:#1e1a06;border:1px solid #c9a227;border-radius:4px;padding:7px 16px;font-size:11px;color:#c9a227;text-decoration:none;letter-spacing:1px;margin:0 5px;">hogisgroup.com</a>
    </div>
    <div style="font-size:10px;color:#3a3420;line-height:1.8;">
      &copy; ${year} Hogis Group &middot; All Rights Reserved &middot; Calabar, Cross River State, Nigeria<br>
      <span style="color:#2a2410;">Sent via Hogis Occasio &mdash; Smart Holiday Notification System</span>
    </div>
  </div>

</div>
</div>

</body>
</html>`

  await transporter.sendMail({
    from: `"Hogis Group" <${fromEmail}>`,
    to,
    subject,
    html,
  })
}

async function sendSMS(to: string, message: string) {
  const provider = process.env.SMS_PROVIDER || 'ebulksms'

  if (provider === 'ebulksms') {
    const username = process.env.EBULKSMS_USERNAME
    const apiKey = process.env.EBULKSMS_API_KEY
    if (!username || !apiKey) throw new Error('eBulkSMS credentials missing')

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
    if (!res.ok) throw new Error(`eBulkSMS HTTP error ${res.status}`)
    const statusCode = body?.SMS?.STATUS?.STATUS_CODE
    if (statusCode && statusCode !== '1801') throw new Error(`eBulkSMS failed: ${body?.SMS?.STATUS?.STATUS_TEXT}`)
    return body
  }

  throw new Error(`Unknown SMS provider: ${provider}`)
}

function personalizeMessage(template: string, name: string): string {
  return template.replace(/\{\{name\}\}/g, name).replace(/\{name\}/g, name)
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  let sent = 0
  let failed = 0
  let processed = 0

  try {
    while (Date.now() - startTime < MAX_RUNTIME_MS) {
      // Fetch next batch of pending items
      const { data: batch, error: fetchErr } = await supabaseAdmin
        .from('notification_queue')
        .select(`
          id, channel, holiday_id, guest_id,
          holidays ( id, name, emoji, message_template ),
          guests ( id, name, email, phone, notify_email, notify_sms )
        `)
        .eq('status', 'pending')
        .limit(BATCH_SIZE)

      if (fetchErr) { console.error('[ProcessBatch] Fetch error:', fetchErr); break }
      if (!batch || batch.length === 0) { console.log('[ProcessBatch] Queue empty.'); break }

      // Immediately mark as processing to prevent double-send
      const batchIds = batch.map((r: any) => r.id)
      await supabaseAdmin
        .from('notification_queue')
        .update({ status: 'processing', started_at: new Date().toISOString() })
        .in('id', batchIds)

      for (const item of batch) {
        const holiday = (item as any).holidays
        const guest = (item as any).guests

        if (!holiday || !guest) {
          await supabaseAdmin.from('notification_queue')
            .update({ status: 'failed', error_message: 'Missing record', finished_at: new Date().toISOString() })
            .eq('id', item.id)
          failed++
          continue
        }

        const firstName = guest.name.split(' ')[0]
        const messageTemplate = holiday.message_template || `Happy ${holiday.name}! Warm wishes from the Hogis family!`
        const personalMsg = personalizeMessage(messageTemplate, firstName)
        const subject = `Happy ${holiday.name} from Hogis Group`

        let success = false
        let errorMsg: string | null = null

        try {
          if (item.channel === 'email' && guest.email) {
            await sendEmail(guest.email, guest.name, subject, personalMsg, holiday.name, holiday.emoji || '🎉')
            success = true
          } else if (item.channel === 'sms' && guest.phone) {
            const stripEmojis = (str: string) =>
              str.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u2764\u2665]/gu, '')
                .replace(/\s+/g, ' ').trim()
            await sendSMS(guest.phone, stripEmojis(personalMsg).substring(0, 459))
            success = true
          } else {
            errorMsg = 'No contact info for this channel'
          }
        } catch (err: any) {
          errorMsg = err.message
          console.error(`[ProcessBatch] ${item.channel} FAILED for ${guest.name}:`, err.message)
        }

        // Update queue row
        await supabaseAdmin.from('notification_queue')
          .update({ status: success ? 'sent' : 'failed', error_message: errorMsg, finished_at: new Date().toISOString() })
          .eq('id', item.id)

        // Log to notification_logs
        await supabaseAdmin.from('notification_logs').insert({
          guest_id: guest.id,
          holiday_id: holiday.id,
          channel: item.channel,
          status: success ? 'sent' : 'failed',
          message_preview: personalMsg.substring(0, 100),
          sent_at: success ? new Date().toISOString() : null,
          error_message: errorMsg,
        })

        if (success) sent++; else failed++
        processed++
      }
    }

    // Check remaining and self-chain if needed
    const { count } = await supabaseAdmin
      .from('notification_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')

    const remaining = count ?? 0
    console.log(`[ProcessBatch] Done. sent=${sent} failed=${failed} remaining=${remaining}`)

    if (remaining > 0) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hogis-occasio.netlify.app'
      fetch(`${baseUrl}/api/process-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.CRON_SECRET}` },
      }).catch((e) => console.error('[ProcessBatch] Chain error:', e))
    }

    return NextResponse.json({ success: true, sent, failed, processed, remaining })

  } catch (err: any) {
    console.error('[ProcessBatch] Unhandled error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}