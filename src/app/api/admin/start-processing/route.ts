import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json()

    // Get application
    const { data: app } = await supabase
      .from('applications')
      .select('id, full_name, user_id, status, service_package, country')
      .eq('id', applicationId)
      .single()

    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    if (app.status !== 'PAID') return NextResponse.json({ error: 'Application is not in PAID status' }, { status: 400 })

    // Update status
    const { error } = await supabase
      .from('applications')
      .update({ status: 'IN_PROGRESS' })
      .eq('id', applicationId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Insert status history
    await supabase.from('status_history').insert({
      application_id: applicationId,
      old_status: 'PAID',
      new_status: 'IN_PROGRESS',
      note: 'Обработка начата администратором',
    })

    // Get user email
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', app.user_id)
      .single()

    if (user?.email) {
      const countryName = app.country === 'SA' ? 'Саудовской Аравии' : 'ОАЭ'
      await sendEmail({
        to: user.email,
        subject: '⚙️ Ваша заявка принята в работу — TARJUMAN',
        html: `
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:#0a0a0a;padding:28px 40px;">
          <p style="margin:0;color:#D4A943;font-size:22px;font-weight:800;letter-spacing:1px;">TARJUMAN</p>
          <p style="margin:4px 0 0;color:#ffffff80;font-size:12px;">Поступление в университеты Арабского мира</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 8px;font-size:13px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Обновление статуса</p>
          <h1 style="margin:0 0 20px;font-size:26px;font-weight:800;color:#0a0a0a;">Ваши документы в работе ⚙️</h1>
          <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">Здравствуйте, <strong>${app.full_name}</strong>!</p>
          <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.7;">
            Мы получили ваши документы и приступили к их обработке. Наши специалисты занимаются
            переводом и подготовкой пакета документов для подачи в университеты <strong>${countryName}</strong>.
          </p>
          <!-- Status box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;margin:0 0 28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.5px;">Текущий статус</p>
              <p style="margin:6px 0 0;font-size:18px;font-weight:800;color:#15803d;">⚙️ В обработке</p>
            </td></tr>
          </table>
          <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.7;">
            Когда перевод и подготовка документов будут завершены — мы немедленно вам сообщим.
            Готовые переведённые документы появятся в вашем личном кабинете.
          </p>
          <!-- CTA -->
          <p style="margin:28px 0 0;text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://tarjuman.vercel.app'}/dashboard"
               style="display:inline-block;background:#D4A943;color:#0a0a0a;font-weight:800;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">
              Открыть личный кабинет
            </a>
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#aaa;">
            © 2025 TARJUMAN · <a href="mailto:tarjumanedu@gmail.com" style="color:#D4A943;text-decoration:none;">tarjumanedu@gmail.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }).catch(err => console.error('Email send error:', err))
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('start-processing error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
