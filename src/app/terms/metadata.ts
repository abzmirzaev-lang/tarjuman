import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'Условия использования | TARJUMAN EDU',
  description: 'Условия использования сервиса Tarjuman Edu — права и обязанности сторон, порядок оказания услуг, ограничения ответственности.',
  alternates: { canonical: `${U}/terms` },
  openGraph: { title:'Условия использования | TARJUMAN EDU', description:'Условия использования сервиса Tarjuman Edu.', url:`${U}/terms` },
  robots: { index: true, follow: false },
}
