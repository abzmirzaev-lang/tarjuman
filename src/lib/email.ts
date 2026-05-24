import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

interface EmailOptions {
  to:      string
  subject: string
  html:    string
  text?:   string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  await sgMail.send({
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL ?? 'noreply@tarjuman.com',
      name:  process.env.SENDGRID_FROM_NAME  ?? 'TARJUMAN',
    },
    subject,
    html,
    text: text ?? html.replace(/<[^>]+>/g, ' '),
  })
}
