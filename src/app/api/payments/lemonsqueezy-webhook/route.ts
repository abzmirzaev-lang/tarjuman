import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  // Verify signature
  const secret    = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  const signature = request.headers.get('x-signature')

  if (secret && signature) {
    const hmac     = createHmac('sha256', secret).update(rawBody).digest('hex')
    if (hmac !== signature) {
      console.error('LemonSqueezy webhook: invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventName = payload?.meta?.event_name

  // Handle order_created (payment completed)
  if (eventName === 'order_created') {
    const status = payload?.data?.attributes?.status
    if (status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const custom        = payload?.meta?.custom_data ?? {}
    const applicationId = custom.applicationId
    const userId        = custom.userId
    const pkg           = custom.package
    const orderId       = String(payload?.data?.id ?? '')

    if (!applicationId || !userId) {
      console.error('LemonSqueezy webhook: missing custom data', custom)
      return NextResponse.json({ error: 'Missing custom data' }, { status: 400 })
    }

    try {
      // 1. Save payment record
      await supabase.from('payments').upsert({
        application_id:    applicationId,
        user_id:           userId,
        cis_transaction_id: orderId,
        amount:            payload?.data?.attributes?.total / 100 ?? 0,
        currency:          'USD',
        method:            'OTHER',
        status:            'PAID',
        package:           pkg,
        paid_at:           new Date().toISOString(),
      }, { onConflict: 'application_id' })

      // 2. Update application status to PAID
      await supabase
        .from('applications')
        .update({ status: 'PAID' })
        .eq('id', applicationId)
        .eq('status', 'REGISTERED')

      // 3. Notify (reuse payment-success notification)
      const { data: user } = await supabase
        .from('users')
        .select('email, telegram, full_name')
        .eq('id', userId)
        .single()

      if (user) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/payment-success`, {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'x-internal-key': process.env.ADMIN_SECRET_KEY ?? '',
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

      console.log(`✅ LemonSqueezy payment: ${applicationId}`)
    } catch (err) {
      console.error('LemonSqueezy webhook processing error:', err)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
