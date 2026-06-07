import { sendMessage, sendPhoto } from '../telegram'
import { T } from '../translations'
import { mainMenu, backMenu, contactMenu, langSelectMenu } from '../keyboards'
import {
  upsertUser, upsertLead, getUserLang, setUserLang, logMessage
} from '../database'
import type { Lang } from '../config'
import { SITE_URL } from '../config'

// ── /start ──────────────────────────────────────────────────

export async function handleStart(msg: any) {
  const chatId: number    = msg.chat.id
  const firstName: string = msg.from?.first_name || 'Friend'
  const username          = msg.from?.username ?? null
  const tgLang            = msg.from?.language_code || 'ru'
  const param             = (msg.text as string).split(' ')[1]

  // Detect language
  const detectedLang: Lang = tgLang?.startsWith('uz')
    ? 'uz' : tgLang?.startsWith('en') ? 'en' : 'ru'

  // Save user to CRM
  await upsertUser({
    chat_id:    chatId,
    first_name: firstName,
    username,
    lang:       detectedLang,
    source:     param ? 'site' : 'bot',
  })

  if (param) {
    // Deep link from website — link application
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    await supabase.from('applications').update({ telegram_chat_id: chatId }).eq('id', param)
    await upsertLead(chatId, 'site')

    const lang = await getUserLang(chatId)
    await sendMessage(chatId, T[lang].welcome_app(firstName), mainMenu(lang))
    await notifyAdmin(chatId, firstName, username, lang, 'site')
  } else {
    // New user from bot
    await setUserLang(chatId, detectedLang)
    await upsertLead(chatId, 'bot')
    await sendPhoto(chatId, `${SITE_URL}/og-image.png`)
    await sendMessage(
      chatId,
      `🌐 <b>Выберите язык / Tilni tanlang / Choose language:</b>`,
      langSelectMenu
    )
  }
}

// ── Regular message ──────────────────────────────────────────

export async function handleText(msg: any) {
  const chatId: number = msg.chat.id
  const text: string   = msg.text || ''
  const lang           = await getUserLang(chatId)

  await logMessage(chatId, 'in', text)

  if (text === '/lang') {
    await sendMessage(chatId, `🌐 <b>Выберите язык / Tilni tanlang / Choose language:</b>`, langSelectMenu)
    return
  }

  await sendMessage(chatId, T[lang].fallback, mainMenu(lang))
}

// ── Callback queries ─────────────────────────────────────────

export async function handleUserCallback(cb: any) {
  const chatId: number    = cb.message.chat.id
  const data: string      = cb.data
  const firstName: string = cb.from?.first_name || 'Friend'
  const username          = cb.from?.username ? `@${cb.from.username}` : 'no username'

  // Language selection
  if (data.startsWith('set_lang_')) {
    const newLang = data.replace('set_lang_', '') as Lang
    await setUserLang(chatId, newLang)
    await upsertUser({ chat_id: chatId, first_name: firstName, username: cb.from?.username, lang: newLang })
    await sendMessage(chatId, T[newLang].welcome_new(firstName), mainMenu(newLang))
    return true
  }

  const lang = await getUserLang(chatId)

  const faqMap: Record<string, string> = {
    faq_price:   T[lang].faq_price,
    faq_docs:    T[lang].faq_docs,
    faq_unis:    T[lang].faq_unis,
    faq_payment: T[lang].faq_payment,
  }

  if (data === 'change_lang') {
    await sendMessage(chatId, `🌐 <b>Выберите язык / Tilni tanlang / Choose language:</b>`, langSelectMenu)
  } else if (data === 'main_menu') {
    await sendMessage(chatId, T[lang].choose, mainMenu(lang))
  } else if (faqMap[data]) {
    await sendMessage(chatId, faqMap[data], backMenu(lang))
  } else if (data === 'contact_manager') {
    await sendMessage(chatId, T[lang].contact_user, contactMenu(lang))
    await notifyAdmin(chatId, firstName, username, lang, 'bot')
  } else {
    return false // not handled
  }

  return true
}

// ── Notify admin about new contact ───────────────────────────

async function notifyAdmin(
  chatId: number,
  firstName: string,
  username: string,
  lang: string,
  source: string
) {
  const { ADMIN_CHAT_ID, STATUS_LABELS } = await import('../config')
  const { getLeadByChatId } = await import('../database')
  const { leadActionsMenu } = await import('../keyboards')

  const lead   = await getLeadByChatId(chatId)
  const status = lead?.status ?? 'new'

  await sendMessage(
    ADMIN_CHAT_ID,
    `📞 <b>Новый запрос на связь!</b>\n\n` +
    `👤 Имя: <b>${firstName}</b>\n` +
    `🆔 Username: ${username}\n` +
    `🔗 Chat ID: <code>${chatId}</code>\n` +
    `🌐 Язык: ${lang}  |  Источник: ${source}\n` +
    `📊 Статус: ${STATUS_LABELS[status as keyof typeof STATUS_LABELS]}`,
    leadActionsMenu(chatId, status as any)
  )
}
