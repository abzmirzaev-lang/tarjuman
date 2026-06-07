export const BOT_TOKEN    = process.env.TELEGRAM_SUPPORT_BOT_TOKEN!
export const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!
export const API           = `https://api.telegram.org/bot${BOT_TOKEN}`
export const MANAGER_TG    = 'TARJUMAN_EDU'
export const SITE_URL      = 'https://tarjumanedu.com'

export type Lang   = 'ru' | 'uz' | 'en'
export type Status = 'new' | 'in_progress' | 'waiting' | 'done'

export const STATUS_LABELS: Record<Status, string> = {
  new:         '🆕 Новый',
  in_progress: '🔄 В работе',
  waiting:     '⏳ Ожидание',
  done:        '✅ Завершён',
}

export const STATUS_NEXT: Record<Status, Status> = {
  new:         'in_progress',
  in_progress: 'waiting',
  waiting:     'done',
  done:        'new',
}
