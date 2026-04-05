import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─────────────────────────────────────────────
// CONFIG — tune these to stay under 25s / batch
// ─────────────────────────────────────────────
const BATCH_SIZE = 5       // guests per invocation
const MAX_RUNTIME_MS = 7000 // stop looping at 22s, leave 3s to respond safely

function getTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD env vars missing')
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

  <!-- HEADER -->
  <div style="background:linear-gradient(160deg,#1a1a1a 0%,#2d2d2d 60%,#1a1a1a 100%);text-align:center;">
    <div style="background:linear-gradient(90deg,#8b6914,#c9a227,#f0d060,#c9a227,#8b6914);height:4px;"></div>
    <div style="padding:28px 40px 24px;">
      <div style="font-size:9px;color:#c9a227;letter-spacing:6px;margin-bottom:6px;">✦ ✦ ✦</div>
      <div style="font-size:36px;font-weight:700;color:#f0d060;letter-spacing:8px;line-height:1;">HOGIS</div>
      <div style="font-size:11px;color:#c9a227;letter-spacing:10px;margin-top:3px;margin-bottom:10px;">GROUP</div>
      <div style="font-size:10px;color:#9a9a8a;letter-spacing:3px;font-style:italic;">Affordable Luxury</div>
    </div>
    <div style="background:linear-gradient(90deg,#8b6914,#c9a227,#f0d060,#c9a227,#8b6914);height:3px;"></div>
  </div>

  <!-- SEASONAL BANNER -->
  <div style="background:linear-gradient(135deg,#f9f4e8,#fdf8ee,#f9f4e8);padding:20px 40px 16px;text-align:center;border-bottom:1px solid #e8ddb5;">
    <div style="font-size:32px;margin-bottom:6px;">${holidayEmoji}</div>
    <div style="font-size:22px;color:#7a5c00;letter-spacing:2px;font-weight:700;">Happy ${holidayName}!</div>
    <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#c9a227,transparent);margin:10px auto 0;"></div>
  </div>

  <!-- MESSAGE BODY -->
  <div style="padding:36px 44px 30px;background:#fafaf8;">
    <p style="font-size:16px;color:#3a3228;margin:0 0 18px;line-height:1.5;">
      Dear <strong style="color:#7a5c00;">${name}</strong>,
    </p>
    <div style="background:#ffffff;border-left:4px solid #c9a227;border-radius:0 8px 8px 0;padding:22px 24px;margin:0 0 24px;border:1px solid #ede8d5;">
      <p style="font-size:16px;color:#2a2318;line-height:1.85;margin:0;">${message.replace(/\n/g, '<br>')}</p>
    </div>
    <div style="border-top:1px solid #e8ddb5;padding-top:20px;">
      <p style="font-size:14px;color:#5a4a2a;margin:0 0 2px;">With warm regards,</p>
      <p style="font-size:15px;color:#7a5c00;font-weight:700;margin:0;letter-spacing:1px;">The Hogis Family</p>
    </div>
  </div>

  <!-- GOLD DIVIDER -->
  <div style="background:linear-gradient(90deg,#8b6914,#c9a227,#f0d060,#c9a227,#8b6914);height:3px;"></div>

  <!-- BRANCHES -->
  <div style="background:#1e1e1e;padding:30px 36px;">
    <div style="text-align:center;margin-bottom:22px;">
      <div style="font-size:9px;color:#c9a227;letter-spacing:5px;margin-bottom:6px;">OUR HOTELS</div>
      <div style="width:40px;height:1px;background:#c9a227;margin:0 auto;"></div>
    </div>
    <div style="border:1px solid #3a3020;border-radius:6px;padding:16px 18px;margin-bottom:12px;background:#252010;">
      <div style="font-size:10px;color:#c9a227;letter-spacing:3px;margin-bottom:4px;">✦ LUXURY</div>
      <div style="font-size:15px;color:#f0d060;font-weight:700;margin-bottom:4px;">Hogis Luxury Suites</div>
      <div style="font-size:12px;color:#9a9080;margin-bottom:10px;">7 Akim Close, Marian, Calabar</div>
      <div style="border-top:1px solid #3a3020;padding-top:10px;font-size:12px;">
        <a href="tel:+2348099903335" style="color:#c9a227;text-decoration:none;">📞 +234 809 990 3335</a> &nbsp;|&nbsp;
        <a href="mailto:info@hogisluxurysuites.com" style="color:#9a9080;text-decoration:none;">info@hogisluxurysuites.com</a> &nbsp;|&nbsp;
        <a href="https://hogisluxurysuites.com" style="color:#c9a227;text-decoration:none;">hogisluxurysuites.com</a>
      </div>
    </div>
    <div style="border:1px solid #3a3020;border-radius:6px;padding:16px 18px;margin-bottom:12px;background:#1e1c14;">
      <div style="font-size:10px;color:#c9a227;letter-spacing:3px;margin-bottom:4px;">✦ ROYALE</div>
      <div style="font-size:15px;color:#f0d060;font-weight:700;margin-bottom:4px;">Hogis Royale Apartments &amp; Suites</div>
      <div style="font-size:12px;color:#9a9080;margin-bottom:10px;">6 Bishop Moynagh Ave, State Housing Estate, Calabar</div>
      <div style="border-top:1px solid #3a3020;padding-top:10px;font-size:12px;">
        <a href="tel:+2347073536464" style="color:#c9a227;text-decoration:none;">📞 +234 707 353 6464</a> &nbsp;|&nbsp;
        <a href="mailto:hogisroyaleandapartment@gmail.com" style="color:#9a9080;text-decoration:none;">hogisroyaleandapartment@gmail.com</a> &nbsp;|&nbsp;
        <a href="https://hogisroyale.com" style="color:#c9a227;text-decoration:none;">hogisroyale.com</a>
      </div>
    </div>
    <div style="border:1px solid #3a3020;border-radius:6px;padding:16px 18px;background:#1e1c14;">
      <div style="font-size:10px;color:#c9a227;letter-spacing:3px;margin-bottom:4px;">✦ KINGSCOURT</div>
      <div style="font-size:15px;color:#f0d060;font-weight:700;margin-bottom:4px;">Hogis Kingscourt</div>
      <div style="font-size:12px;color:#9a9080;margin-bottom:10px;">1 Akim Close, Marian, Calabar</div>
      <div style="border-top:1px solid #3a3020;padding-top:10px;font-size:12px;">
        <a href="https://hogisgroup.com" style="color:#c9a227;text-decoration:none;">🌐 hogisgroup.com</a>
      </div>
    </div>
  </div>

  <!-- GOLD DIVIDER -->
  <div style="background:linear-gradient(90deg,#8b6914,#c9a227,#f0d060,#c9a227,#8b6914);height:2px;"></div>

  <!-- FOOTER -->
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
    if (!username) throw new Error('EBULKSMS_USERNAME not configured')
    if (!apiKey) throw new Error('EBULKSMS_API_KEY not configured')

    const senderId = process.env.EBULKSMS_SENDER_ID || 'Hogis'
    const formattedPhone = to.replace(/^\+/, '')

    const payload = {
      SMS: {
        auth: { username, apikey: apiKey },
        message: { sender: senderId, messagetext: message, flash: '0' },
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
    const statusText = body?.SMS?.STATUS?.STATUS_TEXT
    if (statusCode && statusCode !== '1801') throw new Error(`eBulkSMS failed: ${statusText}`)
    return body

  } else if (provider === 'africastalking') {
    const apiKey = process.env.AFRICASTALKING_API_KEY
    const username = process.env.AFRICASTALKING_USERNAME
    if (!apiKey || !username) throw new Error("Africa's Talking credentials missing")

    const formattedPhone = to.replace(/^\+/, '')
    const params = new URLSearchParams({ username, to: formattedPhone, message })

    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: { 'apiKey': apiKey, 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: params.toString(),
    })
    const rawBody = await res.text()
    let body: any = null
    try { body = JSON.parse(rawBody) } catch { throw new Error(`Africa's Talking error: ${rawBody}`) }
    if (!res.ok) throw new Error(`Africa's Talking error: ${JSON.stringify(body)}`)
    const recipients = body?.SMSMessageData?.Recipients
    if (!recipients?.length) throw new Error(`Africa's Talking rejected: no recipients`)
    if (recipients[0].status !== 'Success') throw new Error(`Africa's Talking failed: ${recipients[0].status}`)
    return body
  }

  throw new Error(`Unknown SMS provider: ${provider}`)
}

function personalizeMessage(template: string, name: string): string {
  return template.replace(/\{\{name\}\}/g, name).replace(/\{name\}/g, name)
}

// ─────────────────────────────────────────────────────────────────
// POST /api/process-batch
// Called by the cron, then self-chains until the queue is drained.
// Each invocation handles BATCH_SIZE items and stays under 25s.
// ─────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  let sent = 0
  let failed = 0
  let processed = 0

  try {
    while (Date.now() - startTime < MAX_RUNTIME_MS) {
      // Claim a batch atomically — mark them 'processing' so no other invocation picks the same rows
      const { data: batch, error: fetchErr } = await supabaseAdmin
        .from('notification_queue')
        .select(`
          id,
          channel,
          holiday_id,
          guest_id,
          holidays ( id, name, emoji, message_template ),
          guests ( id, name, email, phone, notify_email, notify_sms )
        `)
        .eq('status', 'pending')
        .limit(BATCH_SIZE)

      if (fetchErr) {
        console.error('[ProcessBatch] Fetch error:', fetchErr)
        break
      }

      if (!batch || batch.length === 0) {
        console.log('[ProcessBatch] Queue empty — done.')
        break
      }

      // Mark this batch as 'processing' immediately to prevent double-send
      const batchIds = batch.map((r: any) => r.id)
      await supabaseAdmin
        .from('notification_queue')
        .update({ status: 'processing', started_at: new Date().toISOString() })
        .in('id', batchIds)

      // Send each item
      for (const item of batch) {
        const holiday = (item as any).holidays
        const guest = (item as any).guests

        if (!holiday || !guest) {
          await supabaseAdmin
            .from('notification_queue')
            .update({ status: 'failed', error_message: 'Missing holiday or guest record', finished_at: new Date().toISOString() })
            .eq('id', item.id)
          failed++
          continue
        }

        const holidayName: string = holiday.name
        const holidayEmoji: string = holiday.emoji || '🎉'
        const messageTemplate = holiday.message_template || `Happy ${holidayName}! Warm wishes from the Hogis family!`
        const firstName = guest.name.split(' ')[0]
        const personalMsg = personalizeMessage(messageTemplate, firstName)
        const subject = `${holidayEmoji} Happy ${holidayName} from Hogis!`

        let success = false
        let errorMsg: string | null = null

        try {
          if (item.channel === 'email' && guest.email) {
            await sendEmail(guest.email, guest.name, subject, personalMsg, holidayName, holidayEmoji)
            success = true
          } else if (item.channel === 'sms' && guest.phone) {
            const stripEmojis = (str: string) =>
              str.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u2764\u2665]/gu, '').replace(/\s+/g, ' ').trim()
            const smsMsg = stripEmojis(personalMsg).substring(0, 459)
            await sendSMS(guest.phone, smsMsg)
            success = true
          } else {
            errorMsg = 'No contact info for channel'
          }
        } catch (err: any) {
          errorMsg = err.message
          console.error(`[ProcessBatch] ${item.channel} FAILED for guest ${guest.id}:`, err.message)
        }

        // Update queue row status
        await supabaseAdmin
          .from('notification_queue')
          .update({
            status: success ? 'sent' : 'failed',
            error_message: errorMsg,
            finished_at: new Date().toISOString(),
          })
          .eq('id', item.id)

        // Write to notification_logs (same table the manual send uses)
        await supabaseAdmin.from('notification_logs').insert({
          guest_id: guest.id,
          holiday_id: holiday.id,
          channel: item.channel,
          status: success ? 'sent' : 'failed',
          message_preview: personalMsg.substring(0, 100),
          sent_at: success ? new Date().toISOString() : null,
          error_message: errorMsg,
        })

        if (success) sent++
        else failed++
        processed++
      }
    }

    // Check if there are still pending items left — if so, fire the next batch
    const { count } = await supabaseAdmin
      .from('notification_queue')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')

    const remaining = count ?? 0
    console.log(`[ProcessBatch] Done. sent=${sent} failed=${failed} remaining=${remaining}`)

    if (remaining > 0) {
      // Self-chain: trigger the next batch (fire and forget)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'
      fetch(`${baseUrl}/api/process-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        },
      }).catch((e) => console.error('[ProcessBatch] Failed to chain next batch:', e))
    }

    return NextResponse.json({ success: true, sent, failed, processed, remaining })
  } catch (err: any) {
    console.error('[ProcessBatch] Unhandled error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}