import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const { applicationId, studysaudiLogin, studysaudiPassword } = await req.json()

    // Get application
    const { data: app } = await supabase
      .from('applications')
      .select('id, full_name, user_id, status, service_package, country')
      .eq('id', applicationId)
      .single()

    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    // Update status to SUBMITTED
    const { error } = await supabase
      .from('applications')
      .update({ status: 'SUBMITTED', completed_at: new Date().toISOString() })
      .eq('id', applicationId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Insert status history
    await supabase.from('status_history').insert({
      application_id: applicationId,
      old_status: app.status,
      new_status: 'SUBMITTED',
      note: 'Документы подготовлены и отправлены администратором',
    })

    // Get user email
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', app.user_id)
      .single()

    if (user?.email) {
      const countryName = app.country === 'SA' ? 'Саудовской Аравии' : 'ОАЭ'
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://tarjumanedu.com'}/dashboard`
      const hasCredentials = studysaudiLogin && studysaudiPassword
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
          <p style="margin:0 0 8px;font-size:13px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Заявка подана</p>
          <h1 style="margin:0 0 20px;font-size:26px;font-weight:800;color:#0a0a0a;">Ваши документы готовы! 🎉</h1>
          <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.7;">Здравствуйте, <strong>${app.full_name}</strong>!</p>
          <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.7;">
            Отличные новости! Мы завершили работу над вашими документами для поступления в университеты
            <strong>${countryName}</strong>. Переведённые документы загружены в ваш личный кабинет.
          </p>

          ${hasCredentials ? `
          <!-- StudyInSaudi credentials -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #86efac;border-radius:14px;margin:0 0 28px;">
            <tr><td style="padding:24px 28px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.5px;">🔑 Данные для входа на портал</p>
              <p style="margin:0 0 20px;font-size:13px;color:#4ade80;">studyinsaudi.com</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #bbf7d0;">
                    <p style="margin:0;font-size:12px;color:#16a34a;font-weight:600;">ЛОГИН</p>
                    <p style="margin:4px 0 0;font-size:16px;font-weight:800;color:#14532d;">${studysaudiLogin}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <p style="margin:0;font-size:12px;color:#16a34a;font-weight:600;">ПАРОЛЬ</p>
                    <p style="margin:4px 0 0;font-size:16px;font-weight:800;color:#14532d;">${studysaudiPassword}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;text-align:center;">
                <a href="https://studyinsaudi.com" style="display:inline-block;background:#16a34a;color:#ffffff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
                  Войти на studyinsaudi.com →
                </a>
              </p>
            </td></tr>
          </table>
          ` : ''}

          <!-- Translated docs -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #93c5fd;border-radius:12px;margin:0 0 28px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.5px;">📄 Переведённые документы</p>
              <p style="margin:6px 0 0;font-size:14px;color:#1d4ed8;">Доступны в личном кабинете TARJUMAN для скачивания</p>
            </td></tr>
          </table>

          <!-- CTA -->
          <p style="margin:0;text-align:center;">
            <a href="${dashboardUrl}"
               style="display:inline-block;background:#D4A943;color:#0a0a0a;font-weight:800;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;">
              Открыть личный кабинет →
            </a>
          </p>
          <p style="margin:20px 0 0;font-size:13px;color:#999;text-align:center;">
            Есть вопросы? Напишите нам: <a href="mailto:support@tarjumanedu.com" style="color:#D4A943;">support@tarjumanedu.com</a>
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#aaa;">
            © 2025 TARJUMAN · <a href="mailto:support@tarjumanedu.com" style="color:#D4A943;text-decoration:none;">support@tarjumanedu.com</a>
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
