-- Add telegram_chat_id to users for bot notifications
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT UNIQUE;
