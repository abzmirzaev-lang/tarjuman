import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail }    from '@/lib/email'
import { sendTelegram } from '@/lib/telegram'
import { STATUS_LABELS } from '@/types'
import type { ApplicationStatus } from '@/types'

const STATUS_MSG_RU: Record<ApplicationStatus, string> = {
  REGISTERED:   'Ваша заявка зарегистрирована',
  PAID:         'Оплата подтверждена. Обработка начнётся в ближайшее время',
  IN_PROGRESS:  'Ваши документы находятся в обработке',
  UNDER_REVIEW: 'Ваша заявка находится на проверке в университете',
  SUBMITTED:    '🎉 Документы успешно поданы в университет!',
  COMPLETED:    '✅ Процесс поступления завершён. Поздравляем!',
  REJECTED:     'К сожалению, ваша заявка была отклонена. Свяжитесь с нами.',
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    // Admin check
    const { data: adminUser } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', session?.user.id ?? '')
      .single()

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { applicationId, newStatus } = await request.json()

    // Get application + user
    const { data: app } = await supabaseAdmin
      .from('applications')
      .select('*, users(email, telegram, full_name)')
      .eq('id', applicationId)
      .single()

    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const user    = (app as any).users
    const msg     = STATUS_MSG_RU[newStatus as ApplicationStatus]
    const label   = STATUS_LABELS[newStatus as ApplicationStatus]?.ru ?? newStatus

    // Email
    if (user?.email) {
      await sendEmail({
        to:      user.email,
        subject: `Обновление статуса заявки — ${label}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
            <div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #E2E8F0;">
              <h1 style="color:#0F172A;font-size:20px;">Статус изменён: <span style="color:#6FAF9B;">${label}</span></h1>
              <p style="color:#64748B;">${msg}</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                 style="display:inline-block;background:#6FAF9B;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:16px;">
                Открыть кабинет →
              </a>
            </div>
          </div>
        `,
      }).catch(console.error)
    }

    // Telegram
    if (user?.telegram) {
      await sendTelegram(
        `📋 *Статус заявки обновлён*\n\nНовый статус: *${label}*\n${msg}\n\n[Открыть кабинет](${process.env.NEXT_PUBLIC_APP_URL}/dashboard)`,
        user.telegram
      ).catch(console.error)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
