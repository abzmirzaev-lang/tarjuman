import { NextRequest, NextResponse } from 'next/server'
import { sendEmail }    from '@/lib/email'
import { sendTelegram } from '@/lib/telegram'
import { PACKAGES } from '@/types'
import type { ServicePackage } from '@/types'

export async function POST(request: NextRequest) {
  // Internal-only endpoint
  const key = request.headers.get('x-internal-key')
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { email, telegram, name, applicationId, package: pkg } = await request.json()
  const pack = PACKAGES[pkg as ServicePackage]

  // Email
  if (email) {
    await sendEmail({
      to:      email,
      subject: '✅ Оплата получена — TARJUMAN',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#F8FAF9;">
          <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #E2E8F0;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
              <div style="width:36px;height:36px;background:#6FAF9B;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;">T</div>
              <span style="font-weight:700;font-size:18px;color:#0F172A;">TARJUMAN</span>
            </div>
            <h1 style="color:#0F172A;font-size:24px;margin:0 0 8px;">Оплата успешно получена! 🎉</h1>
            <p style="color:#64748B;margin:0 0 24px;">Здравствуйте, ${name ?? 'уважаемый клиент'}!</p>
            <div style="background:#F0F9F6;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="margin:0 0 8px;"><strong>Пакет:</strong> ${pack.name_ru}</p>
              <p style="margin:0 0 8px;"><strong>Сумма:</strong> $${pack.priceUSD}</p>
              <p style="margin:0;"><strong>ID заявки:</strong> ${applicationId.slice(0, 8)}…</p>
            </div>
            <p style="color:#64748B;font-size:14px;margin-bottom:20px;">
              Наш менеджер свяжется с вами в течение 24 часов.
              Отслеживайте статус в вашем <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#6FAF9B;">личном кабинете</a>.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
               style="display:inline-block;background:#6FAF9B;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;">
              Перейти в кабинет →
            </a>
          </div>
          <p style="color:#94A3B8;font-size:12px;text-align:center;margin-top:20px;">© 2024 TARJUMAN</p>
        </div>
      `,
    }).catch(console.error)
  }

  // Telegram
  if (telegram) {
    const handle = telegram.replace('@', '')
    await sendTelegram(
      `🎉 *Оплата успешно получена!*\n\nПакет: *${pack.name_ru}* ($${pack.priceUSD})\n\nНаш менеджер свяжется с вами в течение 24 часов. Отслеживайте статус на [tarjuman.com/dashboard](${process.env.NEXT_PUBLIC_APP_URL}/dashboard)`,
      handle
    ).catch(console.error)
  }

  // Notify admin
  if (process.env.TELEGRAM_ADMIN_CHAT_ID) {
    await sendTelegram(
      `💰 *Новая оплата!*\n\nКлиент: ${name}\nПакет: ${pack.name_ru} ($${pack.priceUSD})\nEmail: ${email}`,
      undefined,
      process.env.TELEGRAM_ADMIN_CHAT_ID
    ).catch(console.error)
  }

  return NextResponse.json({ ok: true })
}
