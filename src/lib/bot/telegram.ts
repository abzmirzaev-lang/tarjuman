import { API } from './config'

export async function sendMessage(
  chat_id: number | string,
  text: string,
  reply_markup?: object
) {
  await fetch(`${API}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true, reply_markup }),
  })
}

export async function sendPhoto(
  chat_id: number | string,
  photo: string,
  caption?: string,
  reply_markup?: object
) {
  await fetch(`${API}/sendPhoto`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id, photo, caption, parse_mode: 'HTML', reply_markup }),
  })
}

export async function answerCallbackQuery(callback_query_id: string, text?: string) {
  await fetch(`${API}/answerCallbackQuery`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ callback_query_id, text }),
  })
}

export async function editMessageReplyMarkup(
  chat_id: number | string,
  message_id: number,
  reply_markup: object
) {
  await fetch(`${API}/editMessageReplyMarkup`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ chat_id, message_id, reply_markup }),
  })
}
