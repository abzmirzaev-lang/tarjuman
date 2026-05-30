import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PACKAGES } from '@/types'
import type { ServicePackage } from '@/types'
import { notifyAdmin } from '@/lib/telegram'
import { createHash } from 'crypto'

const md5 = (str: string) => createHash('md5').update(str).digest('hex')

function cryptomusSign(body: object, apiKey: string): string {
  const json = JSON.stringify(body).replace(/\//mg, '\\/')
  return md5(Buffer.from(json).toString('base64') + apiKey)
}

export async function POST(request: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    let session = null
    if (token) {
      const { data } = await supabase.auth.getUser(token)
      if (data.user) session = { user: data.user }
    }

    if (!session) {
      const routeClient = createRouteHandlerClient({ cookies })
      const { data } = await routeClient.auth.getSession()
      if (data.session) session = data.session
    }

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
      .select('id, status, full_name, phone, telegram, citizenship')
      .eq('id', applicationId)
      .eq('user_id', session.user.id)
      .single()

    if (appErr || !app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const packageInfo = PACKAGES[pkg]

    // ── CRYPTOMUS ──────────────────────────────────────────────────────────
    if (process.env.CRYPTOMUS_MERCHANT_ID && process.env.CRYPTOMUS_PAYMENT_API_KEY) {
      const merchantId = process.env.CRYPTOMUS_MERCHANT_ID
      const apiKey     = process.env.CRYPTOMUS_PAYMENT_API_KEY

      // order_id must be unique alpha_dash string — use applicationId (UUID has dashes, valid)
      const body = {
        amount:          String(packageInfo.priceUSD),
        currency:        'USD',
        order_id:        applicationId,
        url_success:     `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&app=${applicationId}`,
        url_return:      `${process.env.NEXT_PUBLIC_APP_URL}/apply?cancelled=1`,
        url_callback:    `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/cryptomus-webhook`,
        additional_data: `${session.user.id}|${pkg}`,
        lifetime:        7200, // 2 hours
        is_payment_multiple: false,
      }

      const sign = cryptomusSign(body, apiKey)

      const res = await fetch('https://api.cryptomus.com/v1/payment', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'merchant':     merchantId,
          'sign':         sign,
        },
        body: JSON.stringify(body),
      })

      const result = await res.json()

      if (result.state !== 0) {
        console.error('Cryptomus error:', result)
        return NextResponse.json({ error: result.message || 'Payment error' }, { status: 400 })
      }

      // Save pending payment record
      await supabase.from('payments').insert({
        application_id:    applicationId,
        user_id:           session.user.id,
        stripe_session_id: result.result.uuid,   // reusing column for cryptomus uuid
        amount:            packageInfo.priceUSD,
        currency:          'USD',
        method:            'CRYPTOMUS',
        status:            'PENDING',
        package:           pkg,
      })

      return NextResponse.json({ url: result.result.url })
    }

    // ── LEMON SQUEEZY ────────────────────────────────────────────────────────
    if (process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_STORE_ID) {
      const variantId = {
        SUBMISSION: process.env.LEMONSQUEEZY_VARIANT_SUBMISSION,
        STANDARD:   process.env.LEMONSQUEEZY_VARIANT_STANDARD,
        VIP:        process.env.LEMONSQUEEZY_VARIANT_VIP,
      }[pkg]

      if (!variantId) {
        return NextResponse.json({ error: 'Variant not configured' }, { status: 500 })
      }

      const lsRes = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
          'Content-Type':  'application/vnd.api+json',
          'Accept':        'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email:  session.user.email,
                custom: {
                  applicationId: applicationId,
                  userId:        session.user.id,
                  package:       pkg,
                },
              },
              product_options: {
                redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&app=${applicationId}`,
              },
              checkout_options: {
                embed: false,
                media: false,
                logo:  true,
              },
            },
            relationships: {
              store:   { data: { type: 'stores',   id: process.env.LEMONSQUEEZY_STORE_ID } },
              variant: { data: { type: 'variants', id: variantId } },
            },
          },
        }),
      })

      const lsData = await lsRes.json()

      if (!lsRes.ok) {
        console.error('LemonSqueezy error:', lsData)
        return NextResponse.json({ error: 'Payment service error' }, { status: 400 })
      }

      const checkoutUrl = lsData.data?.attributes?.url
      if (!checkoutUrl) {
        return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 })
      }

      await supabase.from('payments').insert({
        application_id: applicationId,
        user_id:        session.user.id,
        amount:         packageInfo.priceUSD,
        currency:       'USD',
        method:         'OTHER',
        status:         'PENDING',
        package:        pkg,
      })

      return NextResponse.json({ url: checkoutUrl })
    }

    // ── STRIPE ──────────────────────────────────────────────────────────────
    if (process.env.STRIPE_SECRET_KEY) {
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' })
      const priceId = {
        SUBMISSION: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC,
        STANDARD:   process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
        VIP:        process.env.NEXT_PUBLIC_STRIPE_PRICE_VIP,
      }[pkg]

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
        metadata: { applicationId, userId: session.user.id, package: pkg },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&app=${applicationId}`,
        cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/apply?cancelled=1`,
        locale: 'ru',
        payment_intent_data: {
          metadata: { applicationId, userId: session.user.id, package: pkg },
        },
      })

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
    }

    // ── РУЧНАЯ ОПЛАТА (fallback) ──────────────────────────────────────────
    await notifyAdmin(
      `🆕 *Новая заявка!*\n\n` +
      `👤 *Имя:* ${app.full_name}\n` +
      `📱 *Телефон:* ${app.phone}\n` +
      `✈️ *Гражданство:* ${app.citizenship}\n` +
      `📦 *Пакет:* ${packageInfo.name_ru} — $${packageInfo.priceUSD}\n` +
      `🆔 *ID заявки:* ${applicationId}\n\n` +
      `💳 Ожидает ручной оплаты`
    )
    return NextResponse.json({ url: null, manual: true })

  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
