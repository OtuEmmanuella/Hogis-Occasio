import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Falls back to anon key on client side — service role only works server-side
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey
)

export type Guest = {
  id: string
  name: string
  email: string | null
  phone: string | null
  group_name: string | null
  notify_email: boolean
  notify_sms: boolean
  is_active: boolean
  created_at: string
  tags: string[]
}

export type Holiday = {
  id: string
  name: string
  date: string
  country_code: string
  type: 'national' | 'religious' | 'cultural' | 'custom'
  emoji: string
  is_active: boolean
  message_template: string | null
}

export type NotificationLog = {
  id: string
  guest_id: string
  holiday_id: string
  channel: 'email' | 'sms'
  status: 'pending' | 'sent' | 'failed'
  sent_at: string | null
  error_message: string | null
  message_preview: string
  guest?: Guest
  holiday?: Holiday
}
