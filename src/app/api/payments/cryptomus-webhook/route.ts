import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

const md5 = (str: string) => createHash('md5').update(str).digest('hex')

function verifySign(data: Record<string, any>, apiKey: string): boolean {
  const { sign, ...body } = data
  if (!sign) return false
  const json = JSON.stringify(body).replace(/\//mg, '\\/')
  const expected = md5(Buffer.from(json).toString('base64') + apiKey)
  return expected === sign
}

export async function POST(request: NextRequest) {
  let data: Record<string, any>

  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── Verify signature ────────────────────────────────────────────────────
  const apiKey = process.env.CRYPTOMUS_PAYMENT_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key configured' }, { status: 500 })
  }

  if (!verifySign(data, apiKey)) {
    console.error('Cryptomus webhook: invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { status, order_id, uuid, payment_amount_usd, additional_data } = data

  console.log(`Cryptomus webhook: order_id=${order_id} status=${status}`)

  // ── Only process successful payments ───────────────────────────────────
  if (!['paid', 'paid_over'].includes(status)) {
    return NextResponse.json({ received: true })
  }

  const applicationId = order_id

  // Parse userId and package from additional_data ("userId|pkg")
  const [userId, pkg] = (additional_data || '').split('|')

  try {
    // 1. Mark payment as PAID
    await supabaseAdmin
      .from('payments')
      .update({
        status:   'PAID',
        paid_at:  new Date().toISOString(),
        method:   'CRYPTOMUS',
      })
      .eq('stripe_session_id', uuid) // cryptomus uuid stored here

    // 2. Advance application to PAID
    await supabaseAdmin
      .from('applications')
      .update({ status: 'PAID' })
      .eq('id', applicationId)
      .in('status', ['REGISTERED', 'PENDING'])

    // 3. Notify admin + user
    if (userId) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('email, telegram, full_name')
        .eq('id', userId)
        .single()

      if (user) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/payment-success`, {
          method:  'POST',
          headers: {
            'Content-Type':    'application/json',
            'x-internal-key':  process.env.ADMIN_SECRET_KEY!,
          },
          body: JSON.stringify({
            email:         user.email,
            telegram:      user.telegram,
            name:          user.full_name,
            applicationId,
            package:       pkg,
          }),
        }).catch(console.error)
      }
    }

    console.log(`✅ Cryptomus payment processed: ${applicationId}`)
    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('Cryptomus webhook processing error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
