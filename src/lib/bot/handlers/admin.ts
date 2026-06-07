import { sendMessage } from '../telegram'
import { ADMIN_CHAT_ID, STATUS_LABELS, STATUS_NEXT } from '../config'
import type { Status } from '../config'
import { leadActionsMenu, cancelMenu } from '../keyboards'
import {
  getClients, getClientCount, getLeadByChatId, updateLeadStatus, updateLeadNotes,
  setAdminState, getAdminState, clearAdminState, logMessage, getUserLang,
} from '../database'

function isAdmin(chatId: number | string): boolean {
  return String(chatId) === String(ADMIN_CHAT_ID)
}

// ── Admin commands ───────────────────────────────────────────

export async function handleAdminCommand(msg: any): Promise<boolean> {
  const chatId: number = msg.chat.id
  if (!isAdmin(chatId)) return false

  const text: string = msg.text || ''

  if (text.startsWith('/clients')) {
    await cmdClients(chatId)
    return true
  }

  if (text.startsWith('/client ')) {
    const targetId = parseInt(text.split(' ')[1])
    if (!isNaN(targetId)) { await cmdClientProfile(chatId, targetId); return true }
  }

  if (text.startsWith('/stats')) {
    await cmdStats(chatId)
    return true
  }

  return false
}

// ── Admin reply / note state ─────────────────────────────────

export async function handleAdminMessage(msg: any): Promise<boolean> {
  const chatId: number = msg.chat.id
  if (!isAdmin(chatId)) return false

  const session = await getAdminState(chatId)
  if (!session) return false

  const text: string = msg.text || ''

  if (session.state === 'waiting_reply') {
    const targetId: number = session.target_chat_id
    const lang = await getUserLang(targetId)
    await sendMessage(targetId, `💬 <b>Менеджер TARJUMAN:</b>\n\n${text}`)
    await logMessage(targetId, 'out', text)
    await clearAdminState(chatId)
    await sendMessage(chatId, `✅ Сообщение отправлено клиенту <code>${targetId}</code>`)
    return true
  }

  if (session.state === 'waiting_note') {
    await updateLeadNotes(session.target_chat_id, text)
    await clearAdminState(chatId)
    await sendMessage(chatId, `✅ Заметка сохранена для клиента <code>${session.target_chat_id}</code>`)
    return true
  }

  return false
}

// ── Admin callbacks ──────────────────────────────────────────

export async function handleAdminCallback(cb: any): Promise<boolean> {
  const chatId: number = cb.message.chat.id
  if (!isAdmin(chatId)) return false

  const data: string = cb.data

  if (data === 'cancel_state') {
    await clearAdminState(chatId)
    await sendMessage(chatId, '❌ Действие отменено.')
    return true
  }

  if (data.startsWith('reply:')) {
    const targetId = parseInt(data.split(':')[1])
    await setAdminState(chatId, 'waiting_reply', targetId)
    await sendMessage(
      chatId,
      `✏️ Напишите сообщение для клиента <code>${targetId}</code>:`,
      cancelMenu()
    )
    return true
  }

  if (data.startsWith('note:')) {
    const targetId = parseInt(data.split(':')[1])
    await setAdminState(chatId, 'waiting_note', targetId)
    await sendMessage(
      chatId,
      `📝 Введите заметку для клиента <code>${targetId}</code>:`,
      cancelMenu()
    )
    return true
  }

  if (data.startsWith('status:')) {
    const [, targetIdStr, newStatus] = data.split(':')
    const targetId = parseInt(targetIdStr)
    await updateLeadStatus(targetId, newStatus as Status)
    await sendMessage(
      chatId,
      `✅ Статус клиента <code>${targetId}</code> → ${STATUS_LABELS[newStatus as Status]}`,
      leadActionsMenu(targetId, newStatus as Status)
    )
    return true
  }

  if (data.startsWith('profile:')) {
    const targetId = parseInt(data.split(':')[1])
    await cmdClientProfile(chatId, targetId)
    return true
  }

  return false
}

// ── Commands implementation ──────────────────────────────────

async function cmdClients(adminChatId: number) {
  const [clients, total] = await Promise.all([getClients(10), getClientCount()])

  if (!clients.length) {
    await sendMessage(adminChatId, '📭 Клиентов пока нет.')
    return
  }

  const lines = clients.map((c: any, i: number) => {
    const status = c.leads?.[0]?.status ?? 'new'
    const uname  = c.username ? `@${c.username}` : 'нет username'
    return `${i + 1}. <b>${c.first_name}</b> | ${uname} | <code>${c.chat_id}</code>\n   📊 ${STATUS_LABELS[status as Status]} | 🌐 ${c.lang}`
  })

  await sendMessage(
    adminChatId,
    `👥 <b>Клиенты TARJUMAN</b> (всего: ${total})\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    lines.join('\n\n') +
    `\n\n💡 /client [chat_id] — подробный профиль`
  )
}

async function cmdClientProfile(adminChatId: number, targetId: number) {
  const lead = await getLeadByChatId(targetId)

  if (!lead) {
    await sendMessage(adminChatId, `❌ Клиент <code>${targetId}</code> не найден.`)
    return
  }

  const status  = lead.status as Status
  const created = new Date(lead.created_at).toLocaleDateString('ru-RU')
  const updated = new Date(lead.updated_at).toLocaleDateString('ru-RU')

  await sendMessage(
    adminChatId,
    `👤 <b>Профиль клиента</b>\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    `🔗 Chat ID: <code>${targetId}</code>\n` +
    `📊 Статус: ${STATUS_LABELS[status]}\n` +
    `🏷 Теги: ${lead.tags?.join(', ') || 'нет'}\n` +
    `📝 Заметка: ${lead.notes || 'нет'}\n` +
    `📅 Создан: ${created}\n` +
    `🔄 Обновлён: ${updated}`,
    leadActionsMenu(targetId, status)
  )
}

async function cmdStats(adminChatId: number) {
  const { getLeadStats } = await import('../database')
  const stats = await getLeadStats()

  if (!stats.length) {
    await sendMessage(adminChatId, '📊 Статистика пока недоступна.')
    return
  }

  const lines = stats.map((s: any) => {
    const day = new Date(s.day).toLocaleDateString('ru-RU')
    return `📅 ${day}: всего ${s.total} | ✅ ${s.done_count} | 🔄 ${s.in_progress_count} | 🆕 ${s.new_count}`
  })

  await sendMessage(
    adminChatId,
    `📈 <b>Статистика заявок (7 дней)</b>\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    lines.join('\n')
  )
}

// ── Notify admin of new user ─────────────────────────────────

export async function notifyAdminNewUser(
  chatId: number,
  firstName: string,
  username: string,
  lang: string,
  source: string,
  status: Status = 'new'
) {
  await sendMessage(
    ADMIN_CHAT_ID,
    `🆕 <b>Новый клиент!</b>\n\n` +
    `👤 <b>${firstName}</b>  |  ${username}\n` +
    `🔗 Chat ID: <code>${chatId}</code>\n` +
    `🌐 Язык: ${lang}  |  Источник: ${source}\n` +
    `📊 Статус: ${STATUS_LABELS[status]}`,
    leadActionsMenu(chatId, status)
  )
}

export async function notifyAdminContactRequest(
  chatId: number,
  firstName: string,
  username: string,
  lang: string
) {
  const lead   = await getLeadByChatId(chatId)
  const status = (lead?.status ?? 'new') as Status

  await sendMessage(
    ADMIN_CHAT_ID,
    `📞 <b>Запрос на связь!</b>\n\n` +
    `👤 <b>${firstName}</b>  |  ${username}\n` +
    `🔗 Chat ID: <code>${chatId}</code>\n` +
    `🌐 Язык: ${lang}\n` +
    `📊 Статус: ${STATUS_LABELS[status]}`,
    leadActionsMenu(chatId, status)
  )
}
