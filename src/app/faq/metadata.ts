import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'FAQ — Часто задаваемые вопросы о поступлении | TARJUMAN EDU',
  description: 'Ответы на 24 вопроса о поступлении в университеты Саудовской Аравии и ОАЭ: документы, сроки, стипендии, требования, оплата, возврат.',
  keywords: ['faq поступление Саудовская Аравия','вопросы поступление ОАЭ','стипендия Саудовская Аравия','документы для университета','сроки поступления','как поступить в арабский университет'],
  alternates: { canonical: `${U}/faq` },
  openGraph: { title:'FAQ | TARJUMAN EDU — Поступление в Саудовскую Аравию и ОАЭ', description:'24 ответа на самые важные вопросы о поступлении, документах, сроках и стипендиях.', url:`${U}/faq`, type:'website', images:[{url:`${U}/og-image.png`,width:640,height:640}] },
  twitter: { card:'summary', title:'FAQ | TARJUMAN EDU', description:'Ответы на вопросы о поступлении в университеты Саудовской Аравии и ОАЭ.' },
}
