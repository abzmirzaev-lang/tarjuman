import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const hash = searchParams.get('hash')
  if (!hash) return NextResponse.redirect(new URL('/login?error=no_hash', req.url))

  // Verify Telegram hash
  const botToken = process.env.TELEGRAM_BOT_TOKEN!
  const secretKey = crypto.createHash('sha256').update(botToken).digest()
  const params = Object.fromEntries(searchParams.entries())
  delete params.hash

  const checkString = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('\n')
  const expectedHash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex')

  if (expectedHash !== hash) return NextResponse.redirect(new URL('/login?error=invalid_hash', req.url))

  const authDate = parseInt(searchParams.get('auth_date') || '0', 10)
  if (Date.now() / 1000 - authDate > 300) return NextResponse.redirect(new URL('/login?error=expired', req.url))

  const telegramId = parseInt(searchParams.get('id')!, 10)
  const firstName  = searchParams.get('first_name') || ''
  const lastName   = searchParams.get('last_name') || ''
  const username   = searchParams.get('username') || ''
  const photoUrl   = searchParams.get('photo_url') || ''
  const fullName   = [firstName, lastName].filter(Boolean).join(' ')
  const email      = `tg_${telegramId}@telegram.tarjumanedu.com`

  // Find existing user by telegram_chat_id or email
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, email')
    .or(`email.eq.${email},telegram_chat_id.eq.${telegramId}`)
    .single()

  let isNewUser = false

  if (!existingUser) {
    isNewUser = true
    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName, avatar_url: photoUrl, telegram: username },
    })
    if (error || !authUser.user) return NextResponse.redirect(new URL('/login?error=create_failed', req.url))

    // Save telegram_chat_id
    await supabase.from('users').update({ telegram_chat_id: telegramId, telegram: username || null })
      .eq('id', authUser.user.id)
  } else {
    // Update chat_id if missing
    await supabase.from('users').update({ telegram_chat_id: telegramId, telegram: username || null })
      .eq('id', existingUser.id)
  }

  // Send welcome message to client
  await sendBotMessage(
    telegramId,
    isNewUser
      ? `👋 Добро пожаловать в TARJUMAN!\n\nВы успешно зарегистрировались через Telegram.\n\nТеперь вы можете подать заявку: https://tarjumanedu.com/apply`
      : `👋 С возвращением!\n\nВы снова вошли в TARJUMAN.\n\nhttps://tarjumanedu.com/dashboard`
  )

  // Generate magic link
  const { data: link, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tarjumanedu.com'}/auth/confirm` },
  })

  if (linkErr || !link?.properties?.action_link) return NextResponse.redirect(new URL('/login?error=link_failed', req.url))

  return NextResponse.redirect(link.properties.action_link)
}
