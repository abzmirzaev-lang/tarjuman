import type { Metadata } from 'next'

const U = 'https://tarjumanedu.com'

export const metadata: Metadata = {
  title: 'Анкета — Подача в университеты Саудовской Аравии | TARJUMAN EDU',
  description: 'Заполните анкету на поступление в университеты Саудовской Аравии за один шаг: контакты, мотивационное письмо, выбор университетов и пакета услуг TARJUMAN.',
  keywords: ['анкета поступление Саудовская Аравия', 'подать заявку университет Саудовская Аравия', 'TARJUMAN Саудовская Аравия'],
  alternates: { canonical: `${U}/apply-saudi` },
  openGraph: {
    title: 'Анкета — Подача в университеты Саудовской Аравии | TARJUMAN EDU',
    description: 'Заполните анкету на поступление в университеты Саудовской Аравии за один шаг.',
    url: `${U}/apply-saudi`,
    type: 'website',
    images: [{ url: `${U}/og-image.png`, width: 640, height: 640 }],
  },
  robots: { index: true, follow: true },
}

export default function ApplySaudiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
