-- ================================================================
-- HOGIS OCCASIO — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- GUESTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,                         -- E.164 format e.g. +2348012345678
  group_name TEXT DEFAULT 'General',  -- e.g. 'VIP', 'Staff', 'Customers'
  notify_email BOOLEAN DEFAULT TRUE,
  notify_sms BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',           -- e.g. ARRAY['vip', 'partner']
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- HOLIDAYS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  country_code TEXT DEFAULT 'NG',
  type TEXT DEFAULT 'national' CHECK (type IN ('national', 'religious', 'cultural', 'custom')),
  emoji TEXT DEFAULT '🎉',
  is_active BOOLEAN DEFAULT TRUE,
  message_template TEXT,              -- Custom message, NULL = use default
  send_days_before INTEGER DEFAULT 0, -- 0 = day-of, 1 = day before, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- NOTIFICATION LOGS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  holiday_id UUID REFERENCES holidays(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  message_preview TEXT,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- NOTIFICATION SCHEDULES (for automated sending)
-- ================================================================
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  holiday_id UUID REFERENCES holidays(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  total_guests INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ================================================================
-- SETTINGS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_group ON guests(group_name);
CREATE INDEX IF NOT EXISTS idx_guests_active ON guests(is_active);
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);
CREATE INDEX IF NOT EXISTS idx_holidays_active ON holidays(is_active);
CREATE INDEX IF NOT EXISTS idx_logs_guest ON notification_logs(guest_id);
CREATE INDEX IF NOT EXISTS idx_logs_holiday ON notification_logs(holiday_id);
CREATE INDEX IF NOT EXISTS idx_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(scheduled_for);

-- ================================================================
-- ROW LEVEL SECURITY (enable for production)
-- ================================================================
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- For now: allow all (tighten in production with auth)
CREATE POLICY "Allow all" ON guests FOR ALL USING (true);
CREATE POLICY "Allow all" ON holidays FOR ALL USING (true);
CREATE POLICY "Allow all" ON notification_logs FOR ALL USING (true);
CREATE POLICY "Allow all" ON schedules FOR ALL USING (true);
CREATE POLICY "Allow all" ON app_settings FOR ALL USING (true);

-- ================================================================
-- SEED DEFAULT HOLIDAYS (Nigeria + International)
-- ================================================================
INSERT INTO holidays (name, date, country_code, type, emoji, message_template) VALUES
  ('New Year''s Day',         '2025-01-01', 'NG',   'national',  '🎆', NULL),
  ('Valentine''s Day',        '2025-02-14', 'INTL', 'cultural',  '❤️', NULL),
  ('International Women''s Day','2025-03-08','INTL', 'cultural', '👩', NULL),
  ('Workers'' Day',           '2025-05-01', 'NG',   'national',  '⚒️', NULL),
  ('Democracy Day',           '2025-06-12', 'NG',   'national',  '🇳🇬', NULL),
  ('Eid al-Adha',             '2025-06-17', 'NG',   'religious', '🕌', NULL),
  ('Independence Day',        '2025-10-01', 'NG',   'national',  '🦅', NULL),
  ('Halloween',               '2025-10-31', 'INTL', 'cultural',  '🎃', NULL),
  ('Christmas Day',           '2025-12-25', 'NG',   'religious', '🎄', NULL),
  ('Boxing Day',              '2025-12-26', 'NG',   'national',  '🎁', NULL),
  ('New Year''s Eve',         '2025-12-31', 'INTL', 'cultural',  '🥂', NULL)
ON CONFLICT DO NOTHING;

-- ================================================================
-- FUNCTION: Auto-update updated_at
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
