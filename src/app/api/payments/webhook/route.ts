import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const { applicationId, userId, package: pkg } = session.metadata!

    try {
      // 1. Mark payment as PAID
      await supabaseAdmin
        .from('payments')
        .update({
          status:            'PAID',
          paid_at:           new Date().toISOString(),
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          method: session.payment_method_types?.[0] === 'card' ? 'STRIPE_CARD' : 'STRIPE_APPLE_PAY',
        })
        .eq('stripe_session_id', session.id)

      // 2. Advance application status to PAID
      await supabaseAdmin
        .from('applications')
        .update({ status: 'PAID' })
        .eq('id', applicationId)
        .eq('status', 'REGISTERED')

      // 3. Get user info for notifications
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('email, telegram, full_name')
        .eq('id', userId)
        .single()

      // 4. Trigger notifications
      if (user) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/payment-success`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'x-internal-key': process.env.ADMIN_SECRET_KEY! },
          body:    JSON.stringify({
            email:         user.email,
            telegram:      user.telegram,
            name:          user.full_name,
            applicationId,
            package:       pkg,
          }),
        }).catch(console.error)
      }

      console.log(`✅ Payment processed: ${applicationId}`)
    } catch (err) {
      console.error('Webhook processing error:', err)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent
    const { applicationId } = intent.metadata
    if (applicationId) {
      await supabaseAdmin
        .from('payments')
        .update({ status: 'FAILED' })
        .eq('stripe_payment_intent', intent.id)
    }
  }

  return NextResponse.json({ received: true })
}
