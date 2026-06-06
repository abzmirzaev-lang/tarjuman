import type { Metadata } from 'next'
const U = 'https://tarjumanedu.com'
export const metadata: Metadata = {
  title: 'Политика возврата | TARJUMAN EDU',
  description: 'Политика возврата средств Tarjuman Edu — условия возврата, сроки, порядок обращения.',
  alternates: { canonical: `${U}/refund` },
  openGraph: { title:'Политика возврата | TARJUMAN EDU', description:'Условия и порядок возврата средств в Tarjuman Edu.', url:`${U}/refund` },
  robots: { index: true, follow: false },
}
