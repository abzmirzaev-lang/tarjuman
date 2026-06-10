import { NextRequest, NextResponse } from 'next/server'
import { sendTelegram } from '@/lib/telegram'

const PACKAGES_LABEL: Record<string, string> = {
  SUBMISSION: 'Базовый — $39',
  STANDARD:   'Стандарт — $79',
  VIP:        'VIP — $99',
}

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-internal-key')
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name, telegram, phone, country, pkg, applicationId } = await req.json()
  const countryLabel = country === 'SA' ? '🇸🇦 Саудовская Аравия' : country === 'AE' ? '🇦🇪 ОАЭ' : country

  await sendTelegram(
    `📋 *Новая заявка на сайте!*\n\n` +
    `👤 Имя: *${name}*\n` +
    `📱 Телефон: ${phone || '—'}\n` +
    `✈️ Telegram: ${telegram ? `@${telegram.replace('@', '')}` : '—'}\n` +
    `🌍 Страна: ${countryLabel}\n` +
    `📦 Тариф: ${PACKAGES_LABEL[pkg] || pkg}\n` +
    `🆔 ID: \`${applicationId?.slice(0, 8)}\`\n\n` +
    `👉 [Открыть в админке](https://tarjumanedu.com/admin)`,
    undefined,
    process.env.TELEGRAM_ADMIN_CHAT_ID
  ).catch(console.error)

  return NextResponse.json({ ok: true })
}
