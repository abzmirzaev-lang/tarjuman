import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'Контакты | TARJUMAN EDU — Консультация бесплатно',
  description: 'Свяжитесь с TARJUMAN EDU: Telegram, WhatsApp, Email. Бесплатная консультация по поступлению в университеты Саудовской Аравии, ОАЭ, Турции.',
  keywords: ['контакты Tarjuman Edu','консультация поступление','связаться с агентством','telegram поступление университет'],
  alternates: { canonical: `${U}/contact` },
  openGraph: { title:'Контакты | TARJUMAN EDU', description:'Telegram, WhatsApp, Email. Бесплатная консультация по поступлению.', url:`${U}/contact`, type:'website', images:[{url:`${U}/og-image.png`,width:640,height:640}] },
}
