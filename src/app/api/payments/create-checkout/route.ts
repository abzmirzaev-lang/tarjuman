import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PACKAGES } from '@/types'
import type { ServicePackage } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PRICE_IDS: Record<ServicePackage, string | undefined> = {
  SUBMISSION: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC,
  STANDARD:   process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
  VIP:        process.env.NEXT_PUBLIC_STRIPE_PRICE_VIP,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { applicationId, package: pkg } = await request.json() as {
      applicationId: string
      package: ServicePackage
    }

    // Verify application belongs to user
    const { data: app, error: appErr } = await supabase
      .from('applications')
      .select('id, status')
      .eq('id', applicationId)
      .eq('user_id', session.user.id)
      .single()

    if (appErr || !app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const packageInfo = PACKAGES[pkg]
    const priceId     = PRICE_IDS[pkg]

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      ...(priceId
        ? { line_items: [{ price: priceId, quantity: 1 }] }
        : {
            line_items: [{
              price_data: {
                currency: 'usd',
                unit_amount: packageInfo.priceUSD * 100,
                product_data: {
                  name: `TARJUMAN — ${packageInfo.name_en}`,
                  description: packageInfo.features_en.join(', '),
                },
              },
              quantity: 1,
            }]
          }
      ),
      customer_email: session.user.email!,
      metadata: {
        applicationId,
        userId:  session.user.id,
        package: pkg,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&app=${applicationId}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/apply?cancelled=1`,
      locale: 'ru',
      payment_intent_data: {
        metadata: { applicationId, userId: session.user.id, package: pkg },
      },
    })

    // Create pending payment record
    await supabase.from('payments').insert({
      application_id:    applicationId,
      user_id:           session.user.id,
      stripe_session_id: checkoutSession.id,
      amount:            packageInfo.priceUSD,
      currency:          'USD',
      method:            'STRIPE_CARD',
      status:            'PENDING',
      package:           pkg,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
