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

    // Update status to COMPLETED
    const { error } = await supabase
      .from('applications')
      .update({ status: 'COMPLETED', completed_at: new Date().toISOString() })
      .eq('id', applicationId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Insert status history
    await supabase.from('status_history').insert({
      application_id: applicationId,
      old_status: app.status,
      new_status: 'COMPLETED',
      note: 'Обработка завершена администратором, документы загружены',
    })

    // Get user email
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', app.user_id)
      .single()

    if (user?.email) {
      const countryName = app.country === 'SA' ? 'Саудовской Аравии' : 'ОАЭ'
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://tarjuman.vercel.app'}/dashboard`
      await sendEmail({
        to: user.email,
        subject: '🎉 Ваши документы готовы — TARJUMAN',
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
          <p style="margin:0 0 8px;font-size:13px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Заявка завершена</p>
          <h1 style="margin:0 0 20px;font-size:26px;font-weight:800;color:#0a0a0a;">Ваши документы готовы! 🎉</h1>
          <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">Здравствуйте, <strong>${app.full_name}</strong>!</p>
          <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.7;">
            Отличные новости! Мы завершили работу над вашими документами для поступления в университеты
            <strong>${countryName}</strong>. Все переведённые документы уже загружены в ваш личный кабинет.
          </p>
          <!-- Status box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde047;border-radius:12px;margin:0 0 28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#854d0e;text-transform:uppercase;letter-spacing:0.5px;">Статус заявки</p>
              <p style="margin:6px 0 0;font-size:18px;font-weight:800;color:#a16207;">🎉 Завершено</p>
            </td></tr>
          </table>
          <!-- What to do -->
          <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#0a0a0a;">Что делать дальше:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
            ${[
              ['1', 'Войдите в личный кабинет', 'Перейдите на сайт и откройте раздел «Документы»'],
              ['2', 'Скачайте переведённые документы', 'Все готовые документы доступны для скачивания'],
              ['3', 'Свяжитесь с нами при вопросах', 'Напишите на tarjumanedu@gmail.com — мы всегда на связи'],
            ].map(([n, title, desc]) => `
            <tr><td style="padding:8px 0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:32px;height:32px;background:#D4A943;border-radius:50%;text-align:center;vertical-align:middle;font-weight:800;font-size:13px;color:#0a0a0a;">${n}</td>
                <td style="padding-left:12px;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#0a0a0a;">${title}</p>
                  <p style="margin:2px 0 0;font-size:12px;color:#777;">${desc}</p>
                </td>
              </tr></table>
            </td></tr>`).join('')}
          </table>
          <!-- CTA -->
          <p style="margin:0;text-align:center;">
            <a href="${dashboardUrl}"
               style="display:inline-block;background:#D4A943;color:#0a0a0a;font-weight:800;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">
              Скачать документы →
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
    console.error('complete-processing error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
