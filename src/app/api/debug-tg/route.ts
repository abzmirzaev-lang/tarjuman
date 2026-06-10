import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const token = process.env.TELEGRAM_BOT_TOKEN
  const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID

  // Get the most recent application
  const { data: app, error: appErr } = await supabase
    .from('applications')
    .select('id, full_name, phone, telegram, country, service_package, user_id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!app) {
    return NextResponse.json({ error: 'No applications found', appErr })
  }

  // Get user's telegram_chat_id
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('id, email, telegram_chat_id')
    .eq('id', app.user_id)
    .single()

  // Try sending admin message directly
  let adminResult = 'skipped'
  if (token && adminChat) {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChat,
        text: `DEBUG TEST\nApp: ${app.id.slice(0, 8)}\nName: ${app.full_name}\nUser ID: ${app.user_id}\nUser chat_id: ${user?.telegram_chat_id ?? 'null'}`,
      }),
    })
    const d = await r.json()
    adminResult = d.ok ? 'sent' : `error: ${d.description}`
  }

  // Try sending client message if they have chat_id
  let clientResult = 'no telegram_chat_id'
  if (token && user?.telegram_chat_id) {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: user.telegram_chat_id,
        text: `DEBUG TEST: ваша заявка ${app.id.slice(0, 8)} найдена`,
      }),
    })
    const d = await r.json()
    clientResult = d.ok ? 'sent' : `error: ${d.description}`
  }

  return NextResponse.json({
    app: { id: app.id.slice(0, 8), name: app.full_name, user_id: app.user_id },
    user: user ? { id: user.id, email: user.email, telegram_chat_id: user.telegram_chat_id } : { error: userErr?.message },
    adminMessageResult: adminResult,
    clientMessageResult: clientResult,
  })
}
