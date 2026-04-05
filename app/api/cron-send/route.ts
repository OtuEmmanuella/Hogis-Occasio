import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Accepts BOTH header formats:
// cron-job.org sends:  x-cron-secret: hogis-cron-2026-secret
// process-batch sends: Authorization: Bearer hogis-cron-2026-secret
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const xSecret = req.headers.get('x-cron-secret')
  const bearer = req.headers.get('authorization')
  return xSecret === secret || bearer === `Bearer ${secret}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    console.error('[Cron] Unauthorized request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get today's date in Nigeria WAT (UTC+1)
    const now = new Date()
    now.setHours(now.getHours() + 1)
    const todayStr = now.toISOString().split('T')[0] // YYYY-MM-DD e.g. 2026-04-05

    console.log('[Cron] Running for date:', todayStr)

    // Find active holidays for today
    const { data: holidays, error: hErr } = await supabaseAdmin
      .from('holidays')
      .select('*')
      .eq('date', todayStr)
      .eq('is_active', true)

    if (hErr) {
      console.error('[Cron] Holiday query error:', hErr)
      return NextResponse.json({ error: hErr.message }, { status: 500 })
    }

    if (!holidays || holidays.length === 0) {
      console.log('[Cron] No holidays today:', todayStr)
      return NextResponse.json({ message: 'No holidays today', date: todayStr, queued: 0 })
    }

    console.log('[Cron] Holidays found:', holidays.map((h: any) => h.name))

    // Fetch all active guests once
    const { data: guests, error: gErr } = await supabaseAdmin
      .from('guests')
      .select('id, email, phone, notify_email, notify_sms')
      .eq('is_active', true)

    if (gErr || !guests || guests.length === 0) {
      console.log('[Cron] No active guests found')
      return NextResponse.json({ message: 'No active guests', date: todayStr })
    }

    let totalQueued = 0

    for (const holiday of holidays) {
      console.log('[Cron] Queuing:', holiday.name)

      // Clear any leftover pending/processing rows for this holiday
      // (in case cron ran before and failed mid-way)
      await supabaseAdmin
        .from('notification_queue')
        .delete()
        .eq('holiday_id', holiday.id)
        .in('status', ['pending', 'processing'])

      // Build queue rows — one per guest per channel
      const queueRows: any[] = []
      for (const guest of guests) {
        if (guest.notify_email && guest.email) {
          queueRows.push({
            holiday_id: holiday.id,
            guest_id: guest.id,
            channel: 'email',
            status: 'pending',
          })
        }
        if (guest.notify_sms && guest.phone) {
          queueRows.push({
            holiday_id: holiday.id,
            guest_id: guest.id,
            channel: 'sms',
            status: 'pending',
          })
        }
      }

      // Insert in chunks of 500
      const CHUNK = 500
      for (let i = 0; i < queueRows.length; i += CHUNK) {
        const { error: qErr } = await supabaseAdmin
          .from('notification_queue')
          .insert(queueRows.slice(i, i + CHUNK))
        if (qErr) console.error('[Cron] Queue insert error:', qErr)
      }

      totalQueued += queueRows.length
      console.log(`[Cron] Queued ${queueRows.length} items for: ${holiday.name}`)
    }

    // Fire first batch — don't await, just kick it off
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hogis-occasio.netlify.app'
    fetch(`${baseUrl}/api/process-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    }).catch((e) => console.error('[Cron] Failed to trigger first batch:', e))

    return NextResponse.json({
      success: true,
      date: todayStr,
      holidays: holidays.map((h: any) => h.name),
      queued: totalQueued,
    })

  } catch (err: any) {
    console.error('[Cron] Unhandled error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}