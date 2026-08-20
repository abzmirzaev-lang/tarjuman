import type { Metadata } from 'next'
import React from 'react'

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

// Display serif for this page's headline/price typography only — the rest of
// the site keeps Inter (tailwind.config.ts). Loaded here (not next/font) so
// it doesn't affect the global bundle size.
export default function ApplySaudiLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap"
      />
      {children}
    </React.Fragment>
  )
}
