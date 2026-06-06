import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'О нас — Tarjuman Edu | Агентство поступления в арабские университеты',
  description: 'Tarjuman Edu помогает студентам из СНГ поступить в университеты Саудовской Аравии и ОАЭ. Перевод документов, подача заявки, сопровождение. 43 заявки обработано.',
  keywords: ['поступление в Саудовскую Аравию','агентство арабские университеты','помощь поступление Саудовская Аравия','поступление ОАЭ студентам СНГ','образование Саудовская Аравия узбекистан','Tarjuman Edu о нас'],
  alternates: { canonical: `${U}/about` },
  openGraph: { title:'О нас | TARJUMAN EDU', description:'Профессиональная команда по поступлению в университеты Саудовской Аравии и ОАЭ. 43 заявки, 12+ партнёров.', url:`${U}/about`, type:'website', images:[{url:`${U}/og-image.png`,width:640,height:640}] },
  twitter: { card:'summary', title:'О нас | TARJUMAN EDU', description:'Агентство поступления в университеты Саудовской Аравии и ОАЭ.' },
}
