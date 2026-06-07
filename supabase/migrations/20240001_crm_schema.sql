-- ═══════════════════════════════════════════
--   TARJUMAN CRM — Supabase Schema
-- ═══════════════════════════════════════════

-- 1. Expand telegram_users
ALTER TABLE IF EXISTS telegram_users
  ADD COLUMN IF NOT EXISTS first_name  text,
  ADD COLUMN IF NOT EXISTS username    text,
  ADD COLUMN IF NOT EXISTS source      text DEFAULT 'bot',
  ADD COLUMN IF NOT EXISTS last_seen   timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_at  timestamptz DEFAULT now();

-- If the table doesn't exist yet, create it
CREATE TABLE IF NOT EXISTS telegram_users (
  chat_id     bigint PRIMARY KEY,
  first_name  text,
  username    text,
  lang        text DEFAULT 'ru',
  source      text DEFAULT 'bot',
  last_seen   timestamptz DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

-- 2. Leads (one per user)
CREATE TABLE IF NOT EXISTS leads (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id     bigint REFERENCES telegram_users(chat_id) ON DELETE CASCADE,
  status      text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'waiting', 'done')),
  tags        text[] DEFAULT '{}',
  notes       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS leads_chat_id_idx ON leads(chat_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Admin sessions (for reply conversation state)
CREATE TABLE IF NOT EXISTS admin_sessions (
  admin_chat_id   bigint PRIMARY KEY,
  state           text,         -- 'waiting_reply' | 'waiting_note'
  target_chat_id  bigint,
  created_at      timestamptz DEFAULT now()
);

-- 4. Messages log
CREATE TABLE IF NOT EXISTS messages_log (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id     bigint,
  direction   text CHECK (direction IN ('in', 'out')),
  text        text,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_log_chat_id_idx ON messages_log(chat_id);
CREATE INDEX IF NOT EXISTS messages_log_created_at_idx ON messages_log(created_at);

-- 5. Daily stats view
CREATE OR REPLACE VIEW lead_stats AS
SELECT
  date_trunc('day', created_at) AS day,
  count(*)                       AS total,
  count(*) FILTER (WHERE status = 'new')         AS new_count,
  count(*) FILTER (WHERE status = 'in_progress') AS in_progress_count,
  count(*) FILTER (WHERE status = 'done')        AS done_count
FROM leads
GROUP BY 1
ORDER BY 1 DESC;
