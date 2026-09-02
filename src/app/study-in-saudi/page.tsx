import type { Metadata } from 'next'
import StudyInSaudiClient from './StudyInSaudiClient'

const U = 'https://tarjumanedu.com'
const PATH = '/study-in-saudi'

export const metadata: Metadata = {
  title: 'Study in Saudi — Грант на обучение в Саудовской Аравии | TARJUMAN EDU',
  description:
    'Узнайте, как иностранным студентам поступить в государственные университеты Саудовской Аравии через Study in Saudi. Университеты, специальности, грант, документы и помощь TARJUMAN EDU.',
  keywords: [
    'Study in Saudi',
    'грант в Саудовскую Аравию',
    'обучение в Саудовской Аравии',
    'университеты Саудовской Аравии',
    'бесплатное обучение Саудовская Аравия',
    'стипендия Саудовская Аравия',
    'поступление в Саудовскую Аравию',
  ],
  alternates: { canonical: `${U}${PATH}` },
  openGraph: {
    title: 'Study in Saudi — Грант на обучение в Саудовской Аравии | TARJUMAN EDU',
    description:
      'Узнайте, как иностранным студентам поступить в государственные университеты Саудовской Аравии через Study in Saudi. Университеты, специальности, грант, документы и помощь TARJUMAN EDU.',
    url: `${U}${PATH}`,
    type: 'website',
    images: [{ url: `${U}/og-image.png`, width: 640, height: 640 }],
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <StudyInSaudiClient />
}
