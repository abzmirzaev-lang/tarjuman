import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BOT_TOKEN = process.env.TELEGRAM_SUPPORT_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!
const API = `https://api.telegram.org/bot${BOT_TOKEN}`

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    [{ text: '🎓 Какие университеты?',    callback_data: 'faq_unis' }],
    [{ text: '💳 Как оплатить?',          callback_data: 'faq_payment' }],
    [{ text: '📝 Подать заявку',          url: 'https://tarjumanedu.com/apply' }],
    [{ text: '📞 Связаться с менеджером', callback_data: 'contact_manager' }],
  ],
}

const backMenu = {
  inline_keyboard: [[{ text: '◀️ Назад в меню', callback_data: 'main_menu' }]],
}

// ── FAQ ответы ────────────────────────────────────────────
const FAQ: Record<string, { text: string }> = {
  faq_price: {
    text:
      `━━━━━━━━━━━━━━━━━━━\n` +
      `        💎 ТАРИФЫ TARJUMAN\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `📦 <b>БАЗОВЫЙ — $29</b>\n` +
      `├ Перевод документов\n` +
      `└ Подача заявки в университет\n\n` +
      `⭐ <b>СТАНДАРТ — $69</b>\n` +
      `├ Всё из базового\n` +
      `├ Полное сопровождение\n` +
      `└ Помощь с оформлением визы\n\n` +
      `👑 <b>VIP — $99</b>\n` +
      `├ Всё из стандарта\n` +
      `├ Личный менеджер 24/7\n` +
      `└ Приоритетная обработка\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `✅ Оплата только после одобрения документов\n\n` +
      `📝 <a href="https://tarjumanedu.com/apply">Подать заявку</a>  •  🌐 <a href="https://tarjumanedu.com/#pricing">Подробнее</a>`,
  },
  faq_docs: {
    text:
      `━━━━━━━━━━━━━━━━━━━\n` +
      `     📋 СПИСОК ДОКУМЕНТОВ\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `<b>Обязательные:</b>\n` +
      `├ 🛂 Паспорт\n` +
      `├ 🖼 Фото 3×4 (белый фон)\n` +
      `├ 🎓 Диплом или аттестат\n` +
      `├ 🏥 Медицинская справка\n` +
      `└ 📜 Справка об отсутствии судимости\n\n` +
      `<b>Дополнительные (если есть):</b>\n` +
      `├ 📗 Сертификат IELTS / TOEFL\n` +
      `├ 🕌 Сертификат по арабскому языку\n` +
      `└ ✉️ Рекомендательное письмо\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `💡 Мы берём на себя перевод всех документов\n\n` +
      `📝 <a href="https://tarjumanedu.com/apply">Начать оформление</a>`,
  },
  faq_time: {
    text:
      `━━━━━━━━━━━━━━━━━━━\n` +
      `       ⏱ СРОКИ ПОСТУПЛЕНИЯ\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `📝 Подготовка документов  →  <b>1–2 нед.</b>\n` +
      `📬 Подача в университет   →  <b>1–2 нед.</b>\n` +
      `✅ Ответ от университета  →  <b>2–4 нед.</b>\n` +
      `🛂 Оформление визы        →  <b>2–4 нед.</b>\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `🗓 Итого: <b>2–3 месяца</b> от заявки до отъезда\n\n` +
      `💡 Рекомендуем начинать за 4–6 месяцев до желаемой даты поступления`,
  },
  faq_unis: {
    text:
      `━━━━━━━━━━━━━━━━━━━\n` +
      `       🎓 НАШИ УНИВЕРСИТЕТЫ\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `🇸🇦 <b>Саудовская Аравия:</b>\n` +
      `├ Университет Короля Абдулазиза — Джидда\n` +
      `├ Университет Короля Сауда — Эр-Рияд\n` +
      `├ Исламский университет — Медина\n` +
      `├ Университет Имама Мухаммада — Эр-Рияд\n` +
      `└ Университет Умм-аль-Кура — Мекка\n\n` +
      `🇦🇪 <b>ОАЭ:</b>\n` +
      `├ Университет ОАЭ — Аль-Айн\n` +
      `└ Американский университет Шарджи\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `🌐 <a href="https://tarjumanedu.com">Полный список на сайте</a>`,
  },
  faq_payment: {
    text:
      `━━━━━━━━━━━━━━━━━━━\n` +
      `       💳 СПОСОБЫ ОПЛАТЫ\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `├ 🏦 UzCard / Humo\n` +
      `├ 💵 Банковский перевод (SWIFT)\n` +
      `├ 💰 USDT / крипто\n` +
      `└ 💳 Visa / MasterCard\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `✅ Платите только после того, как мы подтвердим все документы\n` +
      `⚡ Менеджер пришлёт реквизиты сразу после проверки заявки`,
  },
  faq_countries: {
    text:
      `━━━━━━━━━━━━━━━━━━━\n` +
      `        🌍 ГЕОГРАФИЯ РАБОТЫ\n` +
      `━━━━━━━━━━━━━━━━━━━\n\n` +
      `🇺🇿 Узбекистан   🇰🇿 Казахстан\n` +
      `🇹🇯 Таджикистан  🇰🇬 Кыргызстан\n` +
      `🇹🇲 Туркменистан 🇦🇿 Азербайджан\n` +
      `🇷🇺 Россия       🇧🇾 Беларусь\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `Работаем со всеми мусульманами, стремящимися получить образование в арабских странах 🕌`,
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

      if (text?.startsWith('/start')) {
        const param = text.split(' ')[1] // app ID если есть

        if (param) {
          // Клиент пришёл по deep link после подачи заявки
          await supabase
            .from('applications')
            .update({ telegram_chat_id: chatId })
            .eq('id', param)

          await sendMessage(
            chatId,
            `✅ <b>Заявка подтверждена!</b>\n\n` +
            `Привет, <b>${firstName}</b>! 👋\n\n` +
            `Ваша заявка в TARJUMAN принята. Мы уже начали работу.\n\n` +
            `📋 <b>Что дальше:</b>\n` +
            `1. Наш менеджер проверит ваши документы\n` +
            `2. Свяжется с вами для уточнения деталей\n` +
            `3. Подаст заявку в выбранный университет\n\n` +
            `⏱ Обычно это занимает <b>1–3 рабочих дня</b>.\n\n` +
            `Если есть вопросы — напишите сюда, мы ответим!`,
            mainMenu
          )
        } else {
          await sendMessage(
            chatId,
            `🌙 Assalomu alaykum, <b>${firstName}</b>!\n\n` +
            `Я бот агентства <b>TARJUMAN</b> — помогаем студентам из СНГ поступить в университеты Саудовской Аравии и ОАЭ. 🎓\n\n` +
            `<b>Что мы делаем:</b>\n` +
            `• Переводим и готовим документы\n` +
            `• Подаём заявки в арабские вузы\n` +
            `• Ведём вас от заявки до зачисления\n\n` +
            `Выберите вопрос 👇`,
            mainMenu
          )
        }
      } else {
        // Если написал произвольный текст — показываем меню
        await sendMessage(
          chatId,
          `Выберите вопрос из меню ниже или нажмите «Связаться с менеджером» — ответим лично в течение часа 👇`,
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
          `━━━━━━━━━━━━━━━━━━━\n` +
          `     📞 СВЯЗЬ С МЕНЕДЖЕРОМ\n` +
          `━━━━━━━━━━━━━━━━━━━\n\n` +
          `✅ Ваш запрос принят!\n\n` +
          `Менеджер свяжется с вами в течение <b>1 часа</b> в рабочее время (9:00–21:00 UTC+5).\n\n` +
          `Написать прямо сейчас:\n` +
          `👤 <a href="https://t.me/TARJUMAN_KSA">@TARJUMAN_KSA</a>\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `🌐 <a href="https://tarjumanedu.com">tarjumanedu.com</a>`,
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
