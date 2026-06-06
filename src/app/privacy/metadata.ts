import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'Политика конфиденциальности | TARJUMAN EDU',
  description: 'Политика конфиденциальности Tarjuman Edu — как мы собираем, храним и защищаем ваши персональные данные.',
  alternates: { canonical: `${U}/privacy` },
  openGraph: { title:'Политика конфиденциальности | TARJUMAN EDU', description:'Политика обработки персональных данных сервиса Tarjuman Edu.', url:`${U}/privacy` },
  robots: { index: true, follow: false },
}
