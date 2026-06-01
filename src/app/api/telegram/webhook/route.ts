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

async function sendPhoto(chat_id: number | string, photo: string, caption?: string) {
  await fetch(`${API}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, photo, caption, parse_mode: 'HTML' }),
  })
}

async function answerCallbackQuery(callback_query_id: string, text?: string) {
  await fetch(`${API}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id, text }),
  })
}

// ── Язык пользователя (кэш в памяти + Supabase) ──────────
const langCache: Record<number, string> = {}

async function getUserLang(chatId: number): Promise<string> {
  if (langCache[chatId]) return langCache[chatId]
  const { data } = await supabase
    .from('telegram_users')
    .select('lang')
    .eq('chat_id', chatId)
    .single()
  const lang = data?.lang || 'ru'
  langCache[chatId] = lang
  return lang
}

async function setUserLang(chatId: number, lang: string) {
  langCache[chatId] = lang
  await supabase
    .from('telegram_users')
    .upsert({ chat_id: chatId, lang }, { onConflict: 'chat_id' })
}

// ── Переводы ─────────────────────────────────────────────
type Lang = 'ru' | 'uz' | 'en'

const T = {
  ru: {
    welcome_new: (name: string) =>
      `🌙 Assalomu alaykum, <b>${name}</b>!\n\n` +
      `Я бот агентства <b>TARJUMAN</b> — помогаем студентам из СНГ поступить в университеты Саудовской Аравии, ОАЭ, Катара, Кувейта и Турции. 🎓\n\n` +
      `<b>Что мы делаем:</b>\n` +
      `• Переводим и готовим документы\n` +
      `• Подаём заявки в арабские вузы\n` +
      `• Ведём вас от заявки до зачисления\n\n` +
      `Выберите вопрос 👇`,
    welcome_app: (name: string) =>
      `✅ <b>Заявка подтверждена!</b>\n\nПривет, <b>${name}</b>! 👋\n\n` +
      `Ваша заявка в TARJUMAN принята. Мы уже начали работу.\n\n` +
      `📋 <b>Что дальше:</b>\n` +
      `1. Наш менеджер проверит ваши документы\n` +
      `2. Свяжется с вами для уточнения деталей\n` +
      `3. Подаст заявку в выбранный университет\n\n` +
      `⏱ Обычно это занимает <b>1–3 рабочих дня</b>.\n\nЕсли есть вопросы — напишите сюда!`,
    choose: 'Выберите вопрос:',
    fallback: 'Выберите вопрос из меню ниже или нажмите «Связаться с менеджером» 👇',
    menu: {
      price:    '💰 Сколько стоит?',
      docs:     '📄 Какие документы нужны?',
      unis:     '🎓 Какие университеты?',
      payment:  '💳 Как оплатить?',
      apply:    '📝 Подать заявку',
      contact:  '📞 Связаться с менеджером',
      back:     '◀️ Назад в меню',
      lang:     '🌐 Сменить язык',
    },
    faq_price:
      `━━━━━━━━━━━━━━━━━━━\n        💎 ТАРИФЫ TARJUMAN\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `📦 <b>БАЗОВЫЙ — $29</b>\n├ Подача готовых переведённых документов\n└ Поддержка после принятия\n\n` +
      `⭐ <b>СТАНДАРТ — $69</b>\n├ Перевод документов\n├ Подача в течение 24 часов\n└ Поддержка после принятия\n\n` +
      `👑 <b>VIP — $99</b>\n├ Перевод документов\n├ Подача в течение 6 часов\n├ Поддержка после принятия\n└ Безлимитный чат с менеджером\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n✅ Оплата только после одобрения документов\n\n` +
      `📝 <a href="https://tarjumanedu.com/apply">Подать заявку</a>  •  🌐 <a href="https://tarjumanedu.com/#pricing">Подробнее</a>`,
    faq_docs:
      `━━━━━━━━━━━━━━━━━━━\n     📋 СПИСОК ДОКУМЕНТОВ\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `<b>Обязательные:</b>\n├ 🛂 Паспорт\n├ 🖼 Фото 3×4 (белый фон)\n├ 🎓 Диплом или аттестат\n├ 🏥 Медицинская справка\n└ 📜 Справка об отсутствии судимости\n\n` +
      `<b>Дополнительные (если есть):</b>\n├ 📗 Сертификат IELTS / TOEFL\n├ 🕌 Сертификат по арабскому\n└ ✉️ Рекомендательное письмо\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n💡 Мы берём на себя перевод всех документов\n\n` +
      `📝 <a href="https://tarjumanedu.com/apply">Начать оформление</a>`,
    faq_unis:
      `━━━━━━━━━━━━━━━━━━━\n       🎓 НАШИ УНИВЕРСИТЕТЫ\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `🇸🇦 <b>Саудовская Аравия:</b>\n├ Университет Короля Абдулазиза — Джидда\n├ Университет Короля Сауда — Эр-Рияд\n├ Исламский университет — Медина\n├ Университет Имама Мухаммада — Эр-Рияд\n└ Университет Умм-аль-Кура — Мекка\n\n` +
      `🇦🇪 <b>ОАЭ:</b>\n├ Университет ОАЭ — Аль-Айн\n└ Американский университет Шарджи\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n🌐 <a href="https://tarjumanedu.com/universities">Полный список на сайте</a>`,
    faq_payment:
      `━━━━━━━━━━━━━━━━━━━\n       💳 СПОСОБЫ ОПЛАТЫ\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `├ 🏦 UzCard / Humo\n├ 💵 Банковский перевод (SWIFT)\n├ 💰 USDT / крипто\n└ 💳 Visa / MasterCard\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n✅ Платите только после подтверждения документов\n⚡ Менеджер пришлёт реквизиты после проверки заявки`,
    contact_user:
      `━━━━━━━━━━━━━━━━━━━\n     📞 СВЯЗЬ С МЕНЕДЖЕРОМ\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `✅ Ваш запрос принят!\n\nМенеджер свяжется с вами в течение <b>1 часа</b> (9:00–21:00 UTC+5).\n\n` +
      `Написать прямо сейчас:\n👤 <a href="https://t.me/TARJUMAN_KSA">@TARJUMAN_KSA</a>\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n🌐 <a href="https://tarjumanedu.com">tarjumanedu.com</a>`,
  },

  uz: {
    welcome_new: (name: string) =>
      `🌙 Assalomu alaykum, <b>${name}</b>!\n\n` +
      `Men <b>TARJUMAN</b> agentligining botiman — MDH talabalarga Saudiya Arabistoni, BAA, Qatar, Quvayt va Turkiya universitetlariga kirish imkonini beramiz. 🎓\n\n` +
      `<b>Biz nima qilamiz:</b>\n` +
      `• Hujjatlarni tarjima va tayyorlash\n` +
      `• Arab universitetlariga ariza topshirish\n` +
      `• Arizadan qabulga qadar yordam\n\n` +
      `Savolingizni tanlang 👇`,
    welcome_app: (name: string) =>
      `✅ <b>Ariza tasdiqlandi!</b>\n\nSalom, <b>${name}</b>! 👋\n\n` +
      `TARJUMAN'ga arizangiz qabul qilindi. Biz ishni boshladik.\n\n` +
      `📋 <b>Keyingi qadamlar:</b>\n` +
      `1. Menejerimiz hujjatlaringizni tekshiradi\n` +
      `2. Tafsilotlarni aniqlashtirish uchun siz bilan bog'lanadi\n` +
      `3. Tanlagan universitetingizga ariza topshiradi\n\n` +
      `⏱ Odatda bu <b>1–3 ish kuni</b> davom etadi.\n\nSavollar bo'lsa — shu yerga yozing!`,
    choose: 'Savolingizni tanlang:',
    fallback: 'Quyidagi menyudan savol tanlang yoki "Menejer bilan bog\'lanish" tugmasini bosing 👇',
    menu: {
      price:    '💰 Narxi qancha?',
      docs:     '📄 Qanday hujjatlar kerak?',
      unis:     '🎓 Qaysi universitetlar?',
      payment:  '💳 Qanday to\'lash mumkin?',
      apply:    '📝 Ariza topshirish',
      contact:  '📞 Menejer bilan bog\'lanish',
      back:     '◀️ Menyuga qaytish',
      lang:     '🌐 Tilni o\'zgartirish',
    },
    faq_price:
      `━━━━━━━━━━━━━━━━━━━\n        💎 TARJUMAN TARIFLARI\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `📦 <b>ASOSIY — $29</b>\n├ Tayyor tarjima qilingan hujjatlarni topshirish\n└ Qabul keyin yordam\n\n` +
      `⭐ <b>STANDART — $69</b>\n├ Hujjatlarni tarjima qilish\n├ 24 soat ichida topshirish\n└ Qabul keyin yordam\n\n` +
      `👑 <b>VIP — $99</b>\n├ Hujjatlarni tarjima qilish\n├ 6 soat ichida topshirish\n├ Qabul keyin yordam\n└ Menejer bilan cheksiz chat\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n✅ To'lov faqat hujjatlar tasdiqlangandan keyin\n\n` +
      `📝 <a href="https://tarjumanedu.com/apply">Ariza topshirish</a>  •  🌐 <a href="https://tarjumanedu.com/#pricing">Batafsil</a>`,
    faq_docs:
      `━━━━━━━━━━━━━━━━━━━\n     📋 HUJJATLAR RO'YXATI\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `<b>Majburiy:</b>\n├ 🛂 Pasport\n├ 🖼 3×4 rasm (oq fon)\n├ 🎓 Diplom yoki attestat\n├ 🏥 Tibbiy ma'lumotnoma\n└ 📜 Sudlanmaganlik ma'lumotnomasi\n\n` +
      `<b>Qo'shimcha (agar mavjud bo'lsa):</b>\n├ 📗 IELTS / TOEFL sertifikati\n├ 🕌 Arab tili sertifikati\n└ ✉️ Tavsiya xati\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n💡 Barcha hujjatlar tarjimasini biz amalga oshiramiz\n\n` +
      `📝 <a href="https://tarjumanedu.com/apply">Rasmiylashtirish boshlash</a>`,
    faq_unis:
      `━━━━━━━━━━━━━━━━━━━\n       🎓 BIZNING UNIVERSITETLAR\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `🇸🇦 <b>Saudiya Arabistoni:</b>\n├ Qirol Abdulaziz Universiteti — Jidda\n├ Qirol Saud Universiteti — Ar-Riyod\n├ Islom Universiteti — Madina\n├ Imom Muhammad Universiteti — Ar-Riyod\n└ Umm ul-Qura Universiteti — Makka\n\n` +
      `🇦🇪 <b>BAA:</b>\n├ BAA Universiteti — Al-Ayn\n└ Sharjah Amerikan Universiteti\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n🌐 <a href="https://tarjumanedu.com/universities">Saytda to'liq ro'yxat</a>`,
    faq_payment:
      `━━━━━━━━━━━━━━━━━━━\n       💳 TO'LOV USULLARI\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `├ 🏦 UzCard / Humo\n├ 💵 Bank o'tkazmasi (SWIFT)\n├ 💰 USDT / kripto\n└ 💳 Visa / MasterCard\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n✅ Hujjatlar tasdiqlangandan keyingina to'lov\n⚡ Menejer tekshiruvdan so'ng rekvizitlarni yuboradi`,
    contact_user:
      `━━━━━━━━━━━━━━━━━━━\n     📞 MENEJER BILAN BOG'LANISH\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `✅ So'rovingiz qabul qilindi!\n\nMenejer <b>1 soat</b> ichida siz bilan bog'lanadi (9:00–21:00 UTC+5).\n\n` +
      `Hoziroq yozish:\n👤 <a href="https://t.me/TARJUMAN_KSA">@TARJUMAN_KSA</a>\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n🌐 <a href="https://tarjumanedu.com">tarjumanedu.com</a>`,
  },

  en: {
    welcome_new: (name: string) =>
      `🌙 Assalamu Alaikum, <b>${name}</b>!\n\n` +
      `I'm the bot of <b>TARJUMAN</b> agency — we help students from CIS countries get admitted to universities in Saudi Arabia, UAE, Qatar, Kuwait and Turkey. 🎓\n\n` +
      `<b>What we do:</b>\n` +
      `• Translate and prepare documents\n` +
      `• Submit applications to Arab universities\n` +
      `• Guide you from application to enrollment\n\n` +
      `Choose a question 👇`,
    welcome_app: (name: string) =>
      `✅ <b>Application confirmed!</b>\n\nHello, <b>${name}</b>! 👋\n\n` +
      `Your application to TARJUMAN has been received. We've already started.\n\n` +
      `📋 <b>What's next:</b>\n` +
      `1. Our manager will review your documents\n` +
      `2. Contact you to clarify details\n` +
      `3. Submit to your chosen university\n\n` +
      `⏱ This usually takes <b>1–3 business days</b>.\n\nAny questions — just message us here!`,
    choose: 'Choose a question:',
    fallback: 'Choose a question from the menu below or tap "Contact manager" 👇',
    menu: {
      price:    '💰 How much does it cost?',
      docs:     '📄 What documents are needed?',
      unis:     '🎓 Which universities?',
      payment:  '💳 How to pay?',
      apply:    '📝 Apply now',
      contact:  '📞 Contact manager',
      back:     '◀️ Back to menu',
      lang:     '🌐 Change language',
    },
    faq_price:
      `━━━━━━━━━━━━━━━━━━━\n        💎 TARJUMAN PLANS\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `📦 <b>BASIC — $29</b>\n├ Submission of ready translated documents\n└ Support after acceptance\n\n` +
      `⭐ <b>STANDARD — $69</b>\n├ Document translation\n├ Submission within 24 hours\n└ Support after acceptance\n\n` +
      `👑 <b>VIP — $99</b>\n├ Document translation\n├ Submission within 6 hours\n├ Support after acceptance\n└ Unlimited chat with manager\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n✅ Payment only after documents are approved\n\n` +
      `📝 <a href="https://tarjumanedu.com/apply">Apply now</a>  •  🌐 <a href="https://tarjumanedu.com/#pricing">Learn more</a>`,
    faq_docs:
      `━━━━━━━━━━━━━━━━━━━\n     📋 DOCUMENTS LIST\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `<b>Required:</b>\n├ 🛂 Passport\n├ 🖼 3×4 photo (white background)\n├ 🎓 Diploma or school certificate\n├ 🏥 Medical certificate\n└ 📜 Criminal record certificate\n\n` +
      `<b>Optional (if available):</b>\n├ 📗 IELTS / TOEFL certificate\n├ 🕌 Arabic language certificate\n└ ✉️ Recommendation letter\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n💡 We handle all document translations\n\n` +
      `📝 <a href="https://tarjumanedu.com/apply">Start application</a>`,
    faq_unis:
      `━━━━━━━━━━━━━━━━━━━\n       🎓 OUR UNIVERSITIES\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `🇸🇦 <b>Saudi Arabia:</b>\n├ King Abdulaziz University — Jeddah\n├ King Saud University — Riyadh\n├ Islamic University — Madinah\n├ Imam Muhammad University — Riyadh\n└ Umm Al-Qura University — Makkah\n\n` +
      `🇦🇪 <b>UAE:</b>\n├ UAE University — Al Ain\n└ American University of Sharjah\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n🌐 <a href="https://tarjumanedu.com/universities">Full list on website</a>`,
    faq_payment:
      `━━━━━━━━━━━━━━━━━━━\n       💳 PAYMENT METHODS\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `├ 🏦 UzCard / Humo\n├ 💵 Bank transfer (SWIFT)\n├ 💰 USDT / crypto\n└ 💳 Visa / MasterCard\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n✅ Pay only after your documents are confirmed\n⚡ Manager will send payment details after review`,
    contact_user:
      `━━━━━━━━━━━━━━━━━━━\n     📞 CONTACT MANAGER\n━━━━━━━━━━━━━━━━━━━\n\n` +
      `✅ Your request has been received!\n\nA manager will contact you within <b>1 hour</b> (9:00–21:00 UTC+5).\n\n` +
      `Write now:\n👤 <a href="https://t.me/TARJUMAN_KSA">@TARJUMAN_KSA</a>\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n🌐 <a href="https://tarjumanedu.com">tarjumanedu.com</a>`,
  },
}

function getMainMenu(lang: Lang) {
  const m = T[lang].menu
  return {
    inline_keyboard: [
      [{ text: m.price,   callback_data: 'faq_price' }],
      [{ text: m.docs,    callback_data: 'faq_docs' }],
      [{ text: m.unis,    callback_data: 'faq_unis' }],
      [{ text: m.payment, callback_data: 'faq_payment' }],
      [{ text: m.apply,   url: 'https://tarjumanedu.com/apply' }],
      [{ text: m.contact, callback_data: 'contact_manager' }],
      [{ text: m.lang,    callback_data: 'change_lang' }],
    ],
  }
}

function getBackMenu(lang: Lang) {
  return {
    inline_keyboard: [[{ text: T[lang].menu.back, callback_data: 'main_menu' }]],
  }
}

const langSelectMenu = {
  inline_keyboard: [
    [{ text: '🇷🇺 Русский', callback_data: 'set_lang_ru' }],
    [{ text: '🇺🇿 O\'zbek',  callback_data: 'set_lang_uz' }],
    [{ text: '🇬🇧 English', callback_data: 'set_lang_en' }],
  ],
}

// ── Webhook handler ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Обычное сообщение
    if (body.message) {
      const msg = body.message
      const chatId: number = msg.chat.id
      const text = msg.text || ''
      const firstName = msg.from?.first_name || 'Friend'
      const tgLang = msg.from?.language_code || 'ru'

      if (text?.startsWith('/start')) {
        const param = text.split(' ')[1]

        if (param) {
          // Deep link после подачи заявки
          await supabase
            .from('applications')
            .update({ telegram_chat_id: chatId })
            .eq('id', param)

          const lang = await getUserLang(chatId) as Lang
          await sendMessage(chatId, T[lang].welcome_app(firstName), getMainMenu(lang))
        } else {
          // Новый пользователь — выбор языка
          const detectedLang = tgLang?.startsWith('uz') ? 'uz' : tgLang?.startsWith('en') ? 'en' : 'ru'
          await setUserLang(chatId, detectedLang)
          await sendPhoto(chatId, 'https://tarjumanedu.com/og-image.png')
          await sendMessage(
            chatId,
            `🌐 <b>Выберите язык / Tilni tanlang / Choose language:</b>`,
            langSelectMenu
          )
        }
      } else if (text === '/lang') {
        await sendMessage(chatId, `🌐 <b>Выберите язык / Tilni tanlang / Choose language:</b>`, langSelectMenu)
      } else {
        const lang = await getUserLang(chatId) as Lang
        await sendMessage(chatId, T[lang].fallback, getMainMenu(lang))
      }
    }

    // Нажатие на кнопку
    if (body.callback_query) {
      const cb = body.callback_query
      const chatId: number = cb.message.chat.id
      const data = cb.data
      const firstName = cb.from?.first_name || 'Friend'
      const username = cb.from?.username ? `@${cb.from.username}` : 'no username'

      await answerCallbackQuery(cb.id)

      // Выбор языка
      if (data.startsWith('set_lang_')) {
        const newLang = data.replace('set_lang_', '') as Lang
        await setUserLang(chatId, newLang)
        await sendMessage(chatId, T[newLang].welcome_new(firstName), getMainMenu(newLang))
        return NextResponse.json({ ok: true })
      }

      const lang = await getUserLang(chatId) as Lang

      if (data === 'change_lang') {
        await sendMessage(chatId, `🌐 <b>Выберите язык / Tilni tanlang / Choose language:</b>`, langSelectMenu)
      } else if (data === 'main_menu') {
        await sendMessage(chatId, T[lang].choose, getMainMenu(lang))
      } else if (data === 'faq_price') {
        await sendMessage(chatId, T[lang].faq_price, getBackMenu(lang))
      } else if (data === 'faq_docs') {
        await sendMessage(chatId, T[lang].faq_docs, getBackMenu(lang))
      } else if (data === 'faq_unis') {
        await sendMessage(chatId, T[lang].faq_unis, getBackMenu(lang))
      } else if (data === 'faq_payment') {
        await sendMessage(chatId, T[lang].faq_payment, getBackMenu(lang))
      } else if (data === 'contact_manager') {
        await sendMessage(chatId, T[lang].contact_user, getBackMenu(lang))
        await sendMessage(
          ADMIN_CHAT_ID,
          `📞 <b>Новый запрос на связь!</b>\n\n` +
          `👤 Имя: ${firstName}\n🆔 Username: ${username}\n🔗 Chat ID: ${chatId}\n🌐 Язык: ${lang}\n\n` +
          `Напишите им: <a href="tg://user?id=${chatId}">открыть чат</a>`
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ ok: false })
  }
}
