import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'Тарифы и цены | TARJUMAN EDU — Помощь в поступлении',
  description: 'Прозрачные тарифы: Submission $49, Standard $99, VIP $199. Перевод документов, подача заявки, персональный менеджер. Без скрытых платежей.',
  keywords: ['стоимость поступления','тарифы Tarjuman Edu','цена помощи поступление','перевод документов арабский','стоимость заявки университет'],
  alternates: { canonical: `${U}/pricing` },
  openGraph: { title:'Тарифы | TARJUMAN EDU', description:'Submission $49 · Standard $99 · VIP $199. Фиксированная цена, без скрытых платежей.', url:`${U}/pricing`, type:'website', images:[{url:`${U}/og-image.png`,width:640,height:640}] },
  twitter: { card:'summary', title:'Тарифы | TARJUMAN EDU', description:'Submission $49, Standard $99, VIP $199. Помощь в поступлении в арабские университеты.' },
}
