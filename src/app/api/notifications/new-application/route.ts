import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendTelegram } from '@/lib/telegram'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const PKG_LABEL: Record<string, string> = {
  SUBMISSION: 'Базовый — $39',
  STANDARD:   'Стандарт — $79',
  VIP:        'VIP — $99',
}

// In-memory dedup: prevent sending the same notification twice within 10 minutes
const notifiedIds = new Map<string, number>()

export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  try {
    const { applicationId } = await req.json()
    if (!applicationId) return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })

    // Dedup check — skip if already notified within 10 minutes
    const lastNotified = notifiedIds.get(applicationId)
    const now = Date.now()
    if (lastNotified && now - lastNotified < 10 * 60 * 1000) {
      return NextResponse.json({ ok: true, skipped: 'duplicate' })
    }
    notifiedIds.set(applicationId, now)

    // Cleanup old entries
    for (const [id, ts] of notifiedIds) {
      if (now - ts > 10 * 60 * 1000) notifiedIds.delete(id)
    }

    // Fetch application + user
    const { data: app } = await supabase
      .from('applications')
      .select('id, full_name, phone, telegram, country, service_package, user_id, created_at')
      .eq('id', applicationId)
      .single()

    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Extra guard: only notify if application was created within last 5 minutes
    const createdAt = new Date(app.created_at).getTime()
    if (now - createdAt > 5 * 60 * 1000) {
      return NextResponse.json({ ok: true, skipped: 'too_old' })
    }

    const { data: user } = await supabase
      .from('users')
      .select('telegram_chat_id')
      .eq('id', app.user_id)
      .single()

    const countryLabel = app.country === 'SA' ? '🇸🇦 Саудовская Аравия' : '🇦🇪 ОАЭ'

    // 1. Уведомить клиента
    if (user?.telegram_chat_id) {
      await sendTelegram(
        `✅ Заявка принята!\n\n` +
        `Здравствуйте, ${app.full_name}!\n\n` +
        `Ваша заявка на поступление успешно отправлена.\n\n` +
        `Тариф: ${PKG_LABEL[app.service_package] || app.service_package}\n` +
        `Направление: ${countryLabel}\n\n` +
        `Наш менеджер свяжется с вами в течение 24 часов.\n\n` +
        `Отслеживать статус: https://tarjumanedu.com/dashboard`,
        undefined,
        String(user.telegram_chat_id)
      ).catch(console.error)
    }

    // 2. Уведомить администратора
    await sendTelegram(
      `📋 Новая заявка!\n\n` +
      `Имя: ${app.full_name}\n` +
      `Телефон: ${app.phone || '—'}\n` +
      `Telegram: ${app.telegram ? `@${app.telegram.replace('@', '')}` : '—'}\n` +
      `Страна: ${countryLabel}\n` +
      `Тариф: ${PKG_LABEL[app.service_package] || app.service_package}\n` +
      `ID: ${app.id.slice(0, 8)}\n\n` +
      `https://tarjumanedu.com/admin`,
      undefined,
      process.env.TELEGRAM_ADMIN_CHAT_ID
    ).catch(console.error)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('new-application notification error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
