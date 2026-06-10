import { NextRequest, NextResponse } from 'next/server'
import { sendTelegram } from '@/lib/telegram'

const ADMIN_CHAT = process.env.TELEGRAM_ADMIN_CHAT_ID

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, phone, telegram, country, pkg, citizenship, education_level, university_name, notes } = body

    if (!full_name || !phone || !country || !pkg) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const countryLabel = country === 'SA' ? '🇸🇦 Саудовская Аравия' : country === 'AE' ? '🇦🇪 ОАЭ' : country
    const pkgLabel: Record<string, string> = { SUBMISSION: 'Базовый — $39', STANDARD: 'Стандарт — $79', VIP: 'VIP — $99' }

    const msg =
      `🌐 *Новая заявка (гость)*\n\n` +
      `👤 Имя: *${full_name}*\n` +
      `📱 Телефон: ${phone}\n` +
      `✈️ Telegram: ${telegram ? `@${telegram.replace('@', '')}` : '—'}\n` +
      `🌍 Страна: ${countryLabel}\n` +
      `🎓 Образование: ${education_level || '—'}\n` +
      `🏛 Университет: ${university_name || '—'}\n` +
      `📦 Тариф: ${pkgLabel[pkg] || pkg}\n` +
      `📝 Заметки: ${notes || '—'}\n\n` +
      `⚡️ Без аккаунта — свяжитесь вручную`

    await sendTelegram(msg, undefined, ADMIN_CHAT)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('guest apply error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
