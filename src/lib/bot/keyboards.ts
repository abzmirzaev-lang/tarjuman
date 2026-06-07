import type { Lang, Status } from './config'
import { STATUS_LABELS, STATUS_NEXT, MANAGER_TG, SITE_URL } from './config'
import { T } from './translations'

// ── User keyboards ──────────────────────────────────────────

export function mainMenu(lang: Lang) {
  const m = T[lang].menu
  return {
    inline_keyboard: [
      [{ text: m.price,   callback_data: 'faq_price' }],
      [{ text: m.docs,    callback_data: 'faq_docs' }],
      [{ text: m.unis,    callback_data: 'faq_unis' }],
      [{ text: m.payment, callback_data: 'faq_payment' }],
      [{ text: m.apply,   url: `${SITE_URL}/apply` }],
      [{ text: m.contact, callback_data: 'contact_manager' }],
      [{ text: m.lang,    callback_data: 'change_lang' }],
    ],
  }
}

export function backMenu(lang: Lang) {
  return {
    inline_keyboard: [[{ text: T[lang].menu.back, callback_data: 'main_menu' }]],
  }
}

export function contactMenu(lang: Lang) {
  return {
    inline_keyboard: [
      [{ text: '💬 Написать менеджеру / Menejerga yozish / Write to manager', url: `https://t.me/${MANAGER_TG}` }],
      [{ text: T[lang].menu.back, callback_data: 'main_menu' }],
    ],
  }
}

export const langSelectMenu = {
  inline_keyboard: [
    [{ text: '🇷🇺 Русский', callback_data: 'set_lang_ru' }],
    [{ text: '🇺🇿 O\'zbek',  callback_data: 'set_lang_uz' }],
    [{ text: '🇬🇧 English', callback_data: 'set_lang_en' }],
  ],
}

// ── Admin keyboards ──────────────────────────────────────────

export function leadActionsMenu(chatId: number, status: Status) {
  const nextStatus = STATUS_NEXT[status]
  return {
    inline_keyboard: [
      [
        { text: '✏️ Ответить', callback_data: `reply:${chatId}` },
        { text: `→ ${STATUS_LABELS[nextStatus]}`, callback_data: `status:${chatId}:${nextStatus}` },
      ],
      [
        { text: '📝 Заметка', callback_data: `note:${chatId}` },
        { text: '✅ Завершить', callback_data: `status:${chatId}:done` },
      ],
      [{ text: '👤 Профиль клиента', callback_data: `profile:${chatId}` }],
    ],
  }
}

export function cancelMenu() {
  return {
    inline_keyboard: [[{ text: '❌ Отмена', callback_data: 'cancel_state' }]],
  }
}
