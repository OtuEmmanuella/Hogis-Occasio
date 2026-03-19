import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function formatPhone(raw: string): string | null {
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('234') && digits.length === 13) return `+${digits}`
  if (digits.startsWith('0') && digits.length === 11) return `+234${digits.slice(1)}`
  if (digits.length === 10) return `+234${digits}`
  return `+${digits}`
}

export async function POST(req: NextRequest) {
  try {
    const { guests } = await req.json()
    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json({ error: 'No guests provided' }, { status: 400 })
    }

    const rows = guests
      .filter((g: any) => g.name && g.name.trim())
      .map((g: any) => ({
        name: g.name.trim(),
        email: g.email?.trim() || null,
        phone: g.phone ? formatPhone(g.phone.trim()) : null,
        group_name: g.group_name?.trim() || 'General',
        notify_email: !!(g.email?.trim()),
        notify_sms: !!(g.phone?.trim()),
        is_active: true,
      }))

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid guests after filtering' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.from('guests').insert(rows).select()
    if (error) {
      console.error('[ImportGuests] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[ImportGuests] Imported:', data?.length)
    return NextResponse.json({ success: true, imported: data?.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}