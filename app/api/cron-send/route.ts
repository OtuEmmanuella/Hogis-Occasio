import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// This cron job no longer SENDS — it just ENQUEUES pending notifications
// then immediately triggers the first batch via /api/process-batch
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const today = new Date()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const todayStr = `${mm}-${dd}` // e.g. "04-01"

    console.log('[Cron] Checking holidays for:', todayStr)

    // Find holidays that match today and are auto-send enabled
    const { data: holidays, error: hErr } = await supabaseAdmin
      .from('holidays')
      .select('*')
      .eq('date_mm_dd', todayStr)
      .eq('auto_send', true)

    if (hErr) {
      console.error('[Cron] Holiday query error:', hErr)
      return NextResponse.json({ error: hErr.message }, { status: 500 })
    }

    if (!holidays || holidays.length === 0) {
      console.log('[Cron] No holidays today.')
      return NextResponse.json({ message: 'No holidays today', queued: 0 })
    }

    let totalQueued = 0

    for (const holiday of holidays) {
      console.log('[Cron] Queueing holiday:', holiday.name)

      // Fetch all active guests
      const { data: guests, error: gErr } = await supabaseAdmin
        .from('guests')
        .select('id, email, phone, notify_email, notify_sms')
        .eq('is_active', true)

      if (gErr || !guests || guests.length === 0) {
        console.error('[Cron] No guests found for holiday:', holiday.name)
        continue
      }

      // Insert one queue row per guest per channel
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

      // Batch-insert in chunks of 500 to avoid payload limits
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

    // Kick off the first batch — fire and forget (don't await)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'
    fetch(`${baseUrl}/api/process-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    }).catch((e) => console.error('[Cron] Failed to trigger first batch:', e))

    return NextResponse.json({ success: true, queued: totalQueued })
  } catch (err: any) {
    console.error('[Cron] Unhandled error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}