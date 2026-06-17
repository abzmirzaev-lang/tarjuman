import type { Metadata } from 'next'
import AIUPage from './AIUPage'

export const metadata: Metadata = {
  title: 'Albukhary International University (AIU) — Поступление в Малайзию | Tarjuman Edu',
  description:
    'Поступление в Albukhary International University (AIU), Малайзия. Полная стипендия: бесплатное обучение, проживание и питание. Помощь с документами от Tarjuman Education.',
  keywords: [
    'Albukhary International University',
    'AIU Malaysia',
    'AIU поступление',
    'университет Малайзия стипендия',
    'бесплатное обучение Малайзия',
    'учёба в Малайзии',
    'AIU scholarship',
    'albukhary university admission',
    'малайзия университет для узбекистанцев',
    'полная стипендия Малайзия',
    'AIU Malaysia scholarship CIS',
    'поступить в Малайзию',
    'tarjuman education малайзия',
  ],
  alternates: { canonical: 'https://tarjumanedu.com/albukhary-international-university' },
  openGraph: {
    title: 'Albukhary International University (AIU) — Полная стипендия | Tarjuman Edu',
    description:
      'Поступление в AIU, Малайзия. Полная стипендия: обучение + проживание + питание. Помощь Tarjuman Education от документов до оффера.',
    url: 'https://tarjumanedu.com/albukhary-international-university',
    type: 'website',
    images: [
      {
        url: 'https://tarjumanedu.com/og-aiu.jpg',
        width: 1200,
        height: 630,
        alt: 'Albukhary International University Malaysia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIU Malaysia — Полная стипендия | Tarjuman Edu',
    description: 'Бесплатное обучение + проживание + питание в AIU Малайзия. Подайте заявку через Tarjuman Education.',
  },
}

export default function Page() {
  return <AIUPage />
}
