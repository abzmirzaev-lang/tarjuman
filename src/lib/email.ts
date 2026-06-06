interface EmailOptions {
  to:      string
  subject: string
  html:    string
  text?:   string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping email')
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    'TARJUMAN <info@tarjumanedu.com>',
      to:      [to],
      subject,
      html,
      text:    text ?? html.replace(/<[^>]+>/g, ' '),
      reply_to: 'support@tarjumanedu.com',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error('[email] Resend error: ' + err)
  }
}
