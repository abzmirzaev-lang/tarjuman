import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_BOT = process.env.TELEGRAM_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID!
const API = `https://api.telegram.org/bot${ADMIN_BOT}`

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REPORT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)

  const { data: apps } = await supabase.from('applications').select('*')
  const { data: payments } = await supabase.from('payments').select('*').eq('status', 'PAID')

  const total       = apps?.length ?? 0
  const newApps     = apps?.filter(a => new Date(a.created_at) > threeDaysAgo).length ?? 0
  const paid        = apps?.filter(a => a.status !== 'REGISTERED').length ?? 0
  const completed   = apps?.filter(a => a.status === 'COMPLETED').length ?? 0
  const pending     = apps?.filter(a => a.status === 'REGISTERED').length ?? 0
  const revenue     = payments?.reduce((s, p) => s + Number(p.amount), 0) ?? 0
  const newRevenue  = payments?.filter(p => new Date(p.created_at) > threeDaysAgo)
                               .reduce((s, p) => s + Number(p.amount), 0) ?? 0

  const text =
    `📊 <b>Отчёт TARJUMAN — за 3 дня</b>\n` +
    `📅 ${now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}\n\n` +
    `<b>За последние 3 дня:</b>\n` +
    `📋 Новых заявок: <b>${newApps}</b>\n` +
    `💰 Новый доход: <b>$${newRevenue}</b>\n\n` +
    `<b>Всего за всё время:</b>\n` +
    `📁 Всего заявок: <b>${total}</b>\n` +
    `💳 Оплачено: <b>${paid}</b>\n` +
    `✅ Завершено: <b>${completed}</b>\n` +
    `⏳ Ожидают обработки: <b>${pending}</b>\n` +
    `💵 Общий доход: <b>$${revenue}</b>\n\n` +
    `🔗 <a href="https://tarjuman.vercel.app/admin">Открыть панель</a>`

  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text, parse_mode: 'HTML' }),
  })

  return NextResponse.json({ ok: true })
}
