import type { Metadata } from 'next'
import GrantPageClient from './GrantPageClient'
import { GRANT_FAQ } from '@/data/saudiFullGrant'

const U = 'https://tarjumanedu.com'
const PATH = '/polnyy-grant-v-saudovskuyu-araviyu'

export const metadata: Metadata = {
  title: 'Полный грант в Саудовской Аравии — Учись в университетах Саудовской Аравии | TARJUMAN',
  description:
    'Полный грант на обучение в университетах Саудовской Аравии: бесплатное обучение, виза, перелёт, общежитие, стипендия 840 SAR и медицинская страховка. Выберите до 25 факультетов в разных университетах в одной заявке.',
  keywords: [
    'грант в Саудовскую Аравию',
    'бесплатное обучение в Саудовской Аравии',
    'университеты Саудовской Аравии',
    'грант Саудовская Аравия',
    'стипендия Саудовская Аравия',
    'учись в Саудовской Аравии',
    'Study in Saudi Arabia',
    'полный грант в Саудовской Аравии',
    'поступление в Саудовскую Аравию',
    'обучение в Саудовской Аравии бесплатно',
  ],
  alternates: { canonical: `${U}${PATH}` },
  openGraph: {
    title: 'Полный грант в Саудовской Аравии — Учись в университетах Саудовской Аравии | TARJUMAN',
    description:
      'Бесплатное обучение, виза, перелёт, общежитие, стипендия 840 SAR и медицинская страховка. До 25 факультетов в одной заявке.',
    url: `${U}${PATH}`,
    type: 'website',
    images: [{ url: `${U}/og-image.png`, width: 640, height: 640 }],
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GRANT_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GrantPageClient />
    </>
  )
}
