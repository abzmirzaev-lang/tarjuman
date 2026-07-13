/**
 * REST API for receiving leads from the website.
 * POST /api/leads
 * Body: { name, email?, phone?, university?, source?, telegram_chat_id? }
 * Header: x-api-key: <ADMIN_SECRET_KEY>
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyAdminNewUser } from '@/lib/bot/handlers/admin'
import { upsertUser, upsertLead } from '@/lib/bot/database'
import { sendMessage } from '@/lib/bot/telegram'
import { ADMIN_CHAT_ID, STATUS_LABELS } from '@/lib/bot/config'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  // Auth
  const apiKey = req.headers.get('x-api-key')
  if (apiKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, email, phone, university, source = 'site', telegram_chat_id } = body

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  // Save application to DB
  const { data: application, error } = await supabase
    .from('applications')
    .insert({ name, email, phone, university, source, telegram_chat_id })
    .select()
    .single()

  if (error) {
    console.error('leads API error:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // If user came via Telegram, create a lead
  if (telegram_chat_id) {
    await upsertUser({
      chat_id:    telegram_chat_id,
      first_name: name,
      source,
    })
    await upsertLead(telegram_chat_id, source)

    // Notify user via bot
    await sendMessage(
      telegram_chat_id,
      `✅ <b>Arizangiz qabul qilindi!</b>\n\nMenejerimiz tez orada siz bilan bog'lanadi.\n\n⏱ 1–3 ish kuni ichida.`
    )
  }

  // Notify admin
  await sendMessage(
    ADMIN_CHAT_ID,
    `🌐 <b>Yangi ariza (sayt)!</b>\n\n` +
    `👤 Ism: <b>${name}</b>\n` +
    `📧 Email: ${email || '—'}\n` +
    `📱 Tel: ${phone || '—'}\n` +
    `🎓 Universitet: ${university || '—'}\n` +
    `📌 Manba: ${source}\n` +
    `🔗 TG: ${telegram_chat_id ? `<code>${telegram_chat_id}</code>` : '—'}`
  )

  return NextResponse.json({ ok: true, id: application.id })
}

// ── GET /api/leads — simple stats for dashboard ─────────────
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (apiKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: stats } = await supabase.from('lead_stats').select().limit(30)
  const { count: total } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
  const { count: done } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'done')

  return NextResponse.json({ total, done, daily: stats })
}
