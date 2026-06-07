import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  // Check admin secret
  const key = request.headers.get('x-admin-key')
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subject, html, text } = await request.json() as {
    subject: string
    html: string
    text?: string
  }

  if (!subject || !html) {
    return NextResponse.json({ error: 'subject and html are required' }, { status: 400 })
  }

  // Get all users from auth.users via service role
  const { data: users, error } = await supabase
    .from('users')
    .select('email, full_name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const emails = users ?? []
  let sent = 0
  let failed = 0
  const errors: string[] = []

  // Send in batches of 10 to avoid rate limits
  for (let i = 0; i < emails.length; i += 10) {
    const batch = emails.slice(i, i + 10)
    await Promise.allSettled(
      batch.map(async (user) => {
        if (!user.email) return
        try {
          const personalHtml = html.replace(/{{name}}/g, user.full_name || 'Пользователь')
          const personalText = (text || '').replace(/{{name}}/g, user.full_name || 'Пользователь')
          await sendEmail({
            to: user.email,
            subject,
            html: personalHtml,
            text: personalText,
          })
          sent++
        } catch (e: any) {
          failed++
          errors.push(`${user.email}: ${e.message}`)
        }
      })
    )
    // Small delay between batches
    if (i + 10 < emails.length) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  return NextResponse.json({
    total: emails.length,
    sent,
    failed,
    errors: errors.slice(0, 10),
  })
}
