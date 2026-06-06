import { Webhooks } from '@polar-sh/nextjs'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onOrderPaid: async (payload) => {
    const order    = payload.data
    const meta     = order.metadata as Record<string, string> | undefined
    const appId    = meta?.applicationId
    const userId   = meta?.userId
    const pkg      = meta?.package

    if (!appId || !userId) {
      console.error('Polar webhook: missing metadata', meta)
      return
    }

    // 1. Сохранить/обновить запись оплаты
    const { error: payErr } = await supabaseAdmin
      .from('payments')
      .upsert(
        {
          application_id:    appId,
          user_id:           userId,
          stripe_session_id: order.id,   // reuse column for Polar order ID
          amount:            order.amount / 100,
          currency:          order.currency.toUpperCase(),
          method:            'POLAR',
          status:            'PAID',
          paid_at:           new Date().toISOString(),
          package:           pkg ?? null,
        },
        { onConflict: 'stripe_session_id' }
      )

    if (payErr) {
      console.error('Polar webhook: payment upsert error', payErr)
      return
    }

    // 2. Обновить статус заявки → PAID
    await supabaseAdmin
      .from('applications')
      .update({ status: 'PAID' })
      .eq('id', appId)
      .eq('status', 'REGISTERED')

    // 3. Отправить уведомление пользователю
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email, telegram, full_name')
      .eq('id', userId)
      .single()

    if (user) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/payment-success`, {
        method:  'POST',
        headers: {
          'Content-Type':   'application/json',
          'x-internal-key': process.env.ADMIN_SECRET_KEY!,
        },
        body: JSON.stringify({
          email:         user.email,
          telegram:      user.telegram,
          name:          user.full_name,
          applicationId: appId,
          package:       pkg,
        }),
      }).catch(console.error)
    }

    console.log(`✅ Polar payment processed: ${appId}`)
  },
})
