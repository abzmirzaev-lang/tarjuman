import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendBotMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

const STATUS_MESSAGES: Record<string, { emoji: string; ru: string }> = {
  PAID:         { emoji: '💳', ru: 'Ваша оплата подтверждена! Мы начинаем работу над вашей заявкой.' },
  IN_PROGRESS:  { emoji: '⚙️', ru: 'Ваши документы приняты в работу. Мы переводим и проверяем их.' },
  UNDER_REVIEW: { emoji: '🔍', ru: 'Ваши документы проходят финальную проверку перед отправкой в университет.' },
  SUBMITTED:    { emoji: '📬', ru: 'Ваша заявка отправлена в университет! Ожидайте ответ в течение 2–4 недель.' },
  COMPLETED:    { emoji: '🎉', ru: 'Поздравляем! Ваша заявка успешно завершена.' },
  REJECTED:     { emoji: '❌', ru: 'К сожалению, по вашей заявке пришёл отказ. Свяжитесь с менеджером.' },
}

export async function POST(req: NextRequest) {
  try {
    const { applicationId, newStatus } = await req.json()

    // Get application + user's telegram_chat_id via join
    const { data: app } = await supabase
      .from('applications')
      .select('id, full_name, user_id, service_package')
      .eq('id', applicationId)
      .single()

    if (!app) return NextResponse.json({ ok: false, reason: 'app not found' })

    // Get telegram_chat_id from users table
    const { data: user } = await supabase
      .from('users')
      .select('telegram_chat_id')
      .eq('id', app.user_id)
      .single()

    const chatId = user?.telegram_chat_id
    if (!chatId) return NextResponse.json({ ok: false, reason: 'no telegram_chat_id for user' })

    const msg = STATUS_MESSAGES[newStatus]
    if (!msg) return NextResponse.json({ ok: false, reason: 'unknown status' })

    await sendBotMessage(
      chatId,
      `${msg.emoji} Статус заявки обновлён\n\n` +
      `${app.full_name}\n\n` +
      `${msg.ru}\n\n` +
      `https://tarjumanedu.com/dashboard`
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Status notification error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}