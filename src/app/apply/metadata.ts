import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'Подать заявку на поступление | TARJUMAN EDU',
  description: 'Заполните анкету за 5 минут — загрузите документы и выберите университет Саудовской Аравии или ОАЭ. Начните процесс поступления прямо сейчас.',
  keywords: ['подать заявку университет','заявка поступление Саудовская Аравия','онлайн заявка арабский университет','поступить Саудовская Аравия онлайн'],
  alternates: { canonical: `${U}/apply` },
  openGraph: { title:'Подать заявку | TARJUMAN EDU', description:'Заполните анкету за 5 минут. Мы займёмся переводом и подачей документов.', url:`${U}/apply`, type:'website', images:[{url:`${U}/og-image.png`,width:640,height:640}] },
  robots: { index: true, follow: true },
}
