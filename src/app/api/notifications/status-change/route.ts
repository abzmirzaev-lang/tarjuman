import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SUPPORT_BOT = process.env.TELEGRAM_SUPPORT_BOT_TOKEN!
const API = `https://api.telegram.org/bot${SUPPORT_BOT}`

async function sendTelegram(chat_id: number, text: string) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' }),
  })
}

const STATUS_MESSAGES: Record<string, { emoji: string; ru: string }> = {
  PAID: {
    emoji: '💳',
    ru: 'Ваша оплата подтверждена! Мы начинаем работу над вашей заявкой.',
  },
  IN_PROGRESS: {
    emoji: '⚙️',
    ru: 'Ваши документы приняты в работу. Мы переводим и проверяем их.',
  },
  UNDER_REVIEW: {
    emoji: '🔍',
    ru: 'Ваши документы проходят финальную проверку перед отправкой в университет.',
  },
  SUBMITTED: {
    emoji: '📬',
    ru: 'Ваша заявка отправлена в университет! Ожидайте ответ в течение 2–4 недель.',
  },
  COMPLETED: {
    emoji: '🎉',
    ru: 'Поздравляем! Ваша заявка успешно завершена. Добро пожаловать в университет!',
  },
  REJECTED: {
    emoji: '❌',
    ru: 'К сожалению, по вашей заявке пришёл отказ. Свяжитесь с нашим менеджером для обсуждения дальнейших шагов.',
  },
}

export async function POST(req: NextRequest) {
  try {
    const { applicationId, newStatus } = await req.json()

    const { data: app } = await supabase
      .from('applications')
      .select('id, full_name, telegram_chat_id, service_package')
      .eq('id', applicationId)
      .single()

    if (!app?.telegram_chat_id) {
      return NextResponse.json({ ok: false, reason: 'no telegram_chat_id' })
    }

    const msg = STATUS_MESSAGES[newStatus]
    if (!msg) return NextResponse.json({ ok: false, reason: 'unknown status' })

    await sendTelegram(
      app.telegram_chat_id,
      `${msg.emoji} <b>Статус заявки обновлён</b>\n\n` +
      `👤 ${app.full_name}\n\n` +
      `${msg.ru}\n\n` +
      `Если есть вопросы — напишите нам здесь.`
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Status notification error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
