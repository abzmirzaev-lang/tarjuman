import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'Al Qasimia University — Поступление, документы, требования | TARJUMAN',
  description: 'Поступление в Al Qasimia University (ОАЭ, Шарджа) через Tarjuman Edu. Требования к документам, сроки, стоимость обучения. Подайте заявку онлайн.',
  keywords: ['Al Qasimia University','Al Qasimia University поступление','университет Шарджа','поступление в ОАЭ','Al Qasimia University требования','университеты ОАЭ для иностранцев','Джамиа аль-Касимия'],
  alternates: { canonical: `${U}/universities/al-qasimia` },
  openGraph: { title:'Al Qasimia University — Поступление | TARJUMAN', description:'Полная информация о поступлении в Al Qasimia University (Шарджа, ОАЭ). Документы, сроки, стоимость.', url:`${U}/universities/al-qasimia`, type:'website', images:[{url:`${U}/al-qasimia.jpg`,width:1200,height:630}] },
  twitter: { card:'summary_large_image', title:'Al Qasimia University | TARJUMAN', description:'Поступление в Al Qasimia University — Шарджа, ОАЭ.' },
}
