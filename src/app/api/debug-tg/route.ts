import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID

  // Check telegram_chat_id column
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: colCheck, error: colErr } = await supabase
    .from('users')
    .select('telegram_chat_id')
    .limit(1)

  const columnExists = !colErr
  const columnError = colErr?.message || null

  // Check how many users have telegram_chat_id set
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .not('telegram_chat_id', 'is', null)

  return NextResponse.json({
    TELEGRAM_BOT_TOKEN: token ? `set (ends ...${token.slice(-4)})` : 'NOT SET',
    TELEGRAM_ADMIN_CHAT_ID: adminChat || 'NOT SET',
    telegram_chat_id_column_exists: columnExists,
    telegram_chat_id_column_error: columnError,
    users_with_telegram_chat_id: count ?? 0,
  })
}
