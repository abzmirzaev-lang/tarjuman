import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_SUPPORT_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!
const API = `https://api.telegram.org/bot${BOT_TOKEN}`

// ── Helpers ──────────────────────────────────────────────
async function sendMessage(chat_id: number | string, text: string, reply_markup?: any) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text, parse_mode: 'HTML', reply_markup }),
  })
}

async function answerCallbackQuery(callback_query_id: string, text?: string) {
  await fetch(`${API}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id, text }),
  })
}

// ── Главное меню ─────────────────────────────────────────
const mainMenu = {
  inline_keyboard: [
    [{ text: '💰 Сколько стоит?',        callback_data: 'faq_price' }],
    [{ text: '📄 Какие документы нужны?', callback_data: 'faq_docs' }],
    [{ text: '⏰ Сколько времени займёт?', callback_data: 'faq_time' }],
    [{ text: '🎓 Какие университеты?',    callback_data: 'faq_unis' }],
    [{ text: '💳 Как оплатить?',          callback_data: 'faq_payment' }],
    [{ text: '🌍 Для каких стран?',       callback_data: 'faq_countries' }],
    [{ text: '📞 Связаться с менеджером', callback_data: 'contact_manager' }],
  ],
}

const backMenu = {
  inline_keyboard: [[{ text: '◀️ Назад в меню', callback_data: 'main_menu' }]],
}

// ── FAQ ответы ────────────────────────────────────────────
const FAQ: Record<string, { text: string }> = {
  faq_price: {
    text: `💰 <b>Стоимость наших пакетов:</b>\n\n` +
      `📦 <b>Базовый — $29</b>\n` +
      `Перевод и подача документов\n\n` +
      `⭐ <b>Стандарт — $99</b>\n` +
      `Полное сопровождение + виза\n\n` +
      `👑 <b>VIP — $199</b>\n` +
      `Всё включено + личный менеджер\n\n` +
      `Подробнее на <a href="https://tarjuman.vercel.app/#pricing">сайте</a>`,
  },
  faq_docs: {
    text: `📄 <b>Обязательные документы:</b>\n\n` +
      `• Паспорт\n` +
      `• Фото 3×4\n` +
      `• Диплом / аттестат\n` +
      `• Медицинская справка\n` +
      `• Справка об отсутствии судимости\n\n` +
      `<b>Дополнительно (если есть):</b>\n` +
      `• Сертификат IELTS\n` +
      `• Сертификат по арабскому языку\n` +
      `• Рекомендательное письмо\n\n` +
      `Мы поможем с переводом всех документов!`,
  },
  faq_time: {
    text: `⏰ <b>Сроки поступления:</b>\n\n` +
      `📝 Подготовка документов — <b>1–2 недели</b>\n` +
      `📬 Подача в университет — <b>1–2 недели</b>\n` +
      `✅ Ответ от университета — <b>2–4 недели</b>\n` +
      `🛂 Оформление визы — <b>2–4 недели</b>\n\n` +
      `⏱ Итого: <b>2–3 месяца</b> от начала до отъезда\n\n` +
      `Рекомендуем начинать за 4–6 месяцев до желаемой даты.`,
  },
  faq_unis: {
    text: `🎓 <b>Университеты Саудовской Аравии:</b>\n\n` +
      `• Университет короля Абдулазиза (Джидда)\n` +
      `• Университет короля Сауда (Эр-Рияд)\n` +
      `• Исламский университет (Медина)\n` +
      `• Университет имама Мухаммада (Эр-Рияд)\n` +
      `• Университет Умм-аль-Кура (Мекка)\n\n` +
      `🇦🇪 <b>ОАЭ:</b>\n` +
      `• Университет ОАЭ (Аль-Айн)\n` +
      `• Американский университет Шарджи\n\n` +
      `Полный список на <a href="https://tarjuman.vercel.app">сайте</a>`,
  },
  faq_payment: {
    text: `💳 <b>Способы оплаты:</b>\n\n` +
      `• 💵 Банковский перевод\n` +
      `• 🏦 UzCard / Humo (Узбекистан)\n` +
      `• 💰 USDT (криптовалюта) — скоро\n` +
      `• 💳 Карта Visa/MasterCard — скоро\n\n` +
      `После подачи заявки наш менеджер свяжется с вами и расскажет детали оплаты.\n\n` +
      `💡 Оплата после подтверждения принятия документов!`,
  },
  faq_countries: {
    text: `🌍 <b>Мы работаем с гражданами:</b>\n\n` +
      `🇺🇿 Узбекистан\n` +
      `🇰🇿 Казахстан\n` +
      `🇹🇯 Таджикистан\n` +
      `🇰🇬 Кыргызстан\n` +
      `🇹🇲 Туркменистан\n` +
      `🇦🇿 Азербайджан\n` +
      `🇷🇺 Россия\n` +
      `🇺🇦 Украина\n` +
      `🇧🇾 Беларусь\n` +
      `И других стран СНГ\n\n` +
      `Помогаем всем мусульманам, желающим получить исламское образование!`,
  },
}

// ── Webhook handler ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Обычное сообщение
    if (body.message) {
      const msg = body.message
      const chatId = msg.chat.id
      const text = msg.text || ''
      const firstName = msg.from?.first_name || 'Пользователь'

      if (text === '/start') {
        await sendMessage(
          chatId,
          `👋 Привет, <b>${firstName}</b>!\n\n` +
          `Я бот агентства <b>TARJUMAN</b> 🕌\n` +
          `Помогаю студентам из СНГ поступить в университеты Саудовской Аравии и ОАЭ.\n\n` +
          `Выберите вопрос или напишите свой:`,
          mainMenu
        )
      } else {
        // Если написал произвольный текст — показываем меню
        await sendMessage(
          chatId,
          `Выберите вопрос из меню или нажмите «Связаться с менеджером» — мы ответим лично:`,
          mainMenu
        )
      }
    }

    // Нажатие на кнопку
    if (body.callback_query) {
      const cb = body.callback_query
      const chatId = cb.message.chat.id
      const data = cb.data
      const firstName = cb.from?.first_name || 'Пользователь'
      const username = cb.from?.username ? `@${cb.from.username}` : 'нет username'

      await answerCallbackQuery(cb.id)

      if (data === 'main_menu') {
        await sendMessage(chatId, 'Выберите вопрос:', mainMenu)
      } else if (data === 'contact_manager') {
        // Уведомляем пользователя
        await sendMessage(
          chatId,
          `✅ <b>Запрос отправлен!</b>\n\n` +
          `Наш менеджер свяжется с вами в ближайшее время.\n\n` +
          `Также можете написать нам напрямую:\n` +
          `📱 <a href="https://t.me/TARJUMAN_KSA">@TARJUMAN_KSA</a>`,
          backMenu
        )
        // Уведомляем администратора
        await sendMessage(
          ADMIN_CHAT_ID,
          `📞 <b>Новый запрос на связь!</b>\n\n` +
          `👤 Имя: ${firstName}\n` +
          `🆔 Username: ${username}\n` +
          `🔗 Chat ID: ${chatId}\n\n` +
          `Напишите им: <a href="tg://user?id=${chatId}">открыть чат</a>`
        )
      } else if (FAQ[data]) {
        await sendMessage(chatId, FAQ[data].text, backMenu)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ ok: false })
  }
}
