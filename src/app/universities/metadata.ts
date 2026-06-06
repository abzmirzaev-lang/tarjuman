import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'Университеты Саудовской Аравии и ОАЭ | TARJUMAN EDU',
  description: 'Полный список университетов-партнёров: Исламский университет Медины, King Saud University, Al Qasimia University, университеты ОАЭ. Подайте заявку онлайн.',
  keywords: ['университеты Саудовской Аравии','университеты ОАЭ','Al Qasimia University','Исламский университет Медины','King Saud University','поступить университет Саудовская Аравия','список университетов ОАЭ','учёба арабских странах'],
  alternates: { canonical: `${U}/universities` },
  openGraph: { title:'Университеты Саудовской Аравии и ОАЭ | TARJUMAN', description:'12+ ведущих университетов: КСА, ОАЭ, Катар. Al Qasimia, IUM, KSU, KAU. Подайте заявку онлайн.', url:`${U}/universities`, type:'website', images:[{url:`${U}/og-image.png`,width:640,height:640}] },
  twitter: { card:'summary', title:'Университеты КСА и ОАЭ | TARJUMAN', description:'Al Qasimia University, Исламский университет Медины, KSU, KAU и другие.' },
}
