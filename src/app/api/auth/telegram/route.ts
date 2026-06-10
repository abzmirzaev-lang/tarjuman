/**
 * GET /api/auth/telegram
 * Telegram Login Widget redirects here with user data in query params.
 * We verify the hash, then sign the user in via Supabase magic-link or create account.
 */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const hash = searchParams.get('hash')
  if (!hash) return NextResponse.redirect(new URL('/login?error=no_hash', req.url))

  // Verify Telegram hash
  const botToken = process.env.TELEGRAM_SUPPORT_BOT_TOKEN!
  const secretKey = crypto.createHash('sha256').update(botToken).digest()

  const params = Object.fromEntries(searchParams.entries())
  delete params.hash

  const checkString = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('\n')

  const expectedHash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex')

  if (expectedHash !== hash) {
    return NextResponse.redirect(new URL('/login?error=invalid_hash', req.url))
  }

  // Check auth_date is not too old (5 min)
  const authDate = parseInt(searchParams.get('auth_date') || '0', 10)
  if (Date.now() / 1000 - authDate > 300) {
    return NextResponse.redirect(new URL('/login?error=expired', req.url))
  }

  const telegramId = searchParams.get('id')!
  const firstName  = searchParams.get('first_name') || ''
  const lastName   = searchParams.get('last_name') || ''
  const username   = searchParams.get('username') || ''
  const photoUrl   = searchParams.get('photo_url') || ''

  // Use telegram ID as synthetic email
  const email = `tg_${telegramId}@telegram.tarjumanedu.com`
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  // Upsert user in public.users via service role
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single()

  let userId: string

  if (existingUser) {
    userId = existingUser.id
  } else {
    // Create auth user + public.users entry
    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName, avatar_url: photoUrl, telegram: username },
    })
    if (error || !authUser.user) {
      return NextResponse.redirect(new URL('/login?error=create_failed', req.url))
    }
    userId = authUser.user.id
  }

  // Create magic session link and redirect
  const { data: link, error: linkErr } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tarjumanedu.com'}/auth/confirm` },
  })

  if (linkErr || !link?.properties?.action_link) {
    return NextResponse.redirect(new URL('/login?error=link_failed', req.url))
  }

  return NextResponse.redirect(link.properties.action_link)
}
