/**
 * TARJUMAN — Telegram Notification Service
 *
 * Supports two modes:
 * 1. sendTelegram(text, username)    — sends a DM via bot to @username (user must have started the bot first)
 * 2. sendTelegram(text, undefined, chatId) — sends to a known chat/group ID (e.g. admin channel)
 */

const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_CHAT  = process.env.TELEGRAM_ADMIN_CHAT_ID
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`

export async function sendTelegram(
  text:     string,
  username?: string,      // @username of recipient (must have started the bot)
  chatId?:   string,      // numeric chat ID (admin channel / group)
) {
  if (!BOT_TOKEN) return

  const target = chatId ?? username

  if (!target) {
    console.warn('sendTelegram: no target provided')
    return
  }

  const payload = {
    chat_id:    target,
    text,
    parse_mode: 'Markdown' as const,
    disable_web_page_preview: true,
  }

  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })

  const data = await res.json()
  if (!data.ok) {
    console.error('Telegram API error:', data.description)
  }
  return data
}

/**
 * Notify admin channel of any important event
 */
export async function notifyAdmin(text: string) {
  if (!ADMIN_CHAT) return
  return sendTelegram(text, undefined, ADMIN_CHAT)
}
