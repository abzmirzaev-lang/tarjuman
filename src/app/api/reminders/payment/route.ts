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

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REPORT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  // Находим неоплаченные заявки старше 24 часов у которых есть telegram_chat_id
  const { data: apps } = await supabase
    .from('applications')
    .select('id, full_name, telegram_chat_id, service_package, created_at')
    .eq('status', 'REGISTERED')
    .eq('reminder_sent', false)
    .lt('created_at', twentyFourHoursAgo)
    .not('telegram_chat_id', 'is', null)

  if (!apps || apps.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 })
  }

  let sent = 0
  for (const app of apps) {
    await sendTelegram(
      app.telegram_chat_id,
      `⏰ <b>Напоминание об оплате</b>\n\n` +
      `Привет, <b>${app.full_name}</b>!\n\n` +
      `Ваша заявка в TARJUMAN ожидает оплаты уже более 24 часов.\n\n` +
      `💳 Для завершения оформления перейдите в личный кабинет и выберите удобный способ оплаты.\n\n` +
      `🔗 <a href="https://tarjumanedu.com/dashboard">Перейти к оплате</a>\n\n` +
      `Если у вас есть вопросы — напишите нам здесь, мы поможем! 🕌`
    )

    // Помечаем что напоминание отправлено
    await supabase
      .from('applications')
      .update({ reminder_sent: true })
      .eq('id', app.id)

    sent++
  }

  return NextResponse.json({ ok: true, sent })
}
