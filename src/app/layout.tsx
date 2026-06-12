import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import TelegramButton from '@/components/TelegramButton'
import Footer from '@/components/Footer'

import { PRICES } from '@/lib/pricing'

const APP_URL = 'https://tarjumanedu.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Tarjuman Edu — Поступление в Саудовскую Аравию и ОАЭ | Перевод документов',
    template: '%s | TARJUMAN EDU',
  },
  description: 'Tarjuman Edu — профессиональная помощь студентам из СНГ при поступлении в университеты Саудовской Аравии и ОАЭ. Перевод документов на арабский, подача заявки, сопровождение до зачисления. Al Qasimia University, IUM, KSU, KAU.',
  keywords: [
    'поступление в Саудовскую Аравию',
    'поступление в университет Саудовской Аравии',
    'подача документов в Саудовскую Аравию',
    'подача документов в Саудию',
    'учёба в Саудовской Аравии',
    'учёба в ОАЭ для узбекистанцев',
    'стипендия Саудовская Аравия',
    'Al Qasimia University поступление',
    'Al Qasimia University',
    'университеты ОАЭ поступление',
    'Исламский университет Медины',
    'Islamic University of Madinah',
    'King Saud University поступление',
    'перевод документов на арабский',
    'помощь поступление арабские университеты',
    'агентство поступление Саудовская Аравия',
    'Тарджуман Эду',
    'tarjuman edu',
    'study in saudi arabia cis students',
    'study in uae for uzbekistan students',
    'oliy talim saudiya arabistoni',
    'stipendiya saudiya arabistoni',
    'arab universitetlari qabul',
    'hujjat topshirish saudiya arabistoni',
    'saudiya arabistoni universiteti',
    'BAA universiteti qabul',
    'arab universiteti stipendiya',
    'study in saudi arabia from uzbekistan',
    'study in uae from cis',
    'apply saudi arabia university',
    'saudi arabia university admission',
    'document translation arabic',
    'islamic university madinah apply',
    'al qasimia university admission',
  ],
  authors: [{ name: 'Tarjuman Edu', url: APP_URL }],
  creator: 'Tarjuman Edu',
  publisher: 'Tarjuman Edu',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'icon', url: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  },
  openGraph: {
    title: 'Tarjuman Edu — Поступление в Саудовскую Аравию и ОАЭ',
    description: 'Перевод документов, подача заявки, сопровождение до зачисления. Al Qasimia University, IUM, KSU, KAU и другие.',
    url: APP_URL,
    siteName: 'Tarjuman Edu',
    type: 'website',
    locale: 'ru_RU',
    images: [{
      url: `${APP_URL}/og-image-large.png`,
      width: 1200,
      height: 630,
      alt: 'Tarjuman Edu — Поступление в университеты Арабского мира',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarjuman Edu — Поступление в Саудовскую Аравию и ОАЭ',
    description: 'Перевод документов, подача заявки, сопровождение до зачисления. Al Qasimia, IUM, KSU, KAU.',
    images: [`${APP_URL}/og-image-large.png`],
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      'ru':      `${APP_URL}/postupit-v-saudovskuyu-araviyu`,
      'uz':      `${APP_URL}/saudiya-arabistoniga-kirish`,
      'en':      `${APP_URL}/study-in-saudi-arabia`,
      'x-default': APP_URL,
    },
  },
  verification: {
    google: 'CdcVagxqE94kWR5GCDlQqmsGIZQTf4YubNWu21y4TzE',
  },
  category: 'education',
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Как поступить в университет Саудовской Аравии?',
        acceptedAnswer: { '@type': 'Answer', text: 'Tarjuman Edu помогает с переводом документов, подачей заявки и сопровождением до зачисления в университеты Саудовской Аравии и ОАЭ. Процесс занимает от 2 до 6 месяцев.' },
      },
      {
        '@type': 'Question',
        name: 'Сколько стоит помощь при поступлении в университет Саудовской Аравии?',
        acceptedAnswer: { '@type': 'Answer', text: `Стоимость услуг Tarjuman Edu начинается от $${PRICES.SUBMISSION} за подачу документов. Тариф Стандарт — $${PRICES.STANDARD}, VIP с полным сопровождением — $${PRICES.VIP}.` },
      },
      {
        '@type': 'Question',
        name: 'Какие документы нужны для поступления в Саудовскую Аравию?',
        acceptedAnswer: { '@type': 'Answer', text: 'Для поступления нужны: диплом или аттестат, перевод на арабский язык, паспорт, фото, медицинская справка. Мы помогаем с переводом и нотариальным заверением всех документов.' },
      },
      {
        '@type': 'Question',
        name: "Saudiya Arabistonidagi universitetlarga qanday hujjat topshirish mumkin?",
        acceptedAnswer: { '@type': 'Answer', text: `Tarjuman Edu Saudiya Arabistoni va BAA universitetlariga hujjat topshirishda yordam beradi: tarjima, ariza, kuzatib borish. Xizmat narxi $${PRICES.SUBMISSION} dan boshlanadi.` },
      },
      {
        '@type': 'Question',
        name: 'How to apply to a university in Saudi Arabia?',
        acceptedAnswer: { '@type': 'Answer', text: `Tarjuman Edu helps CIS students apply to universities in Saudi Arabia and UAE: document translation, application submission, and guidance until enrollment. Starting from $${PRICES.SUBMISSION}.` },
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'ProfessionalService'],
    '@id': `${APP_URL}/#organization`,
    name: 'Tarjuman Edu',
    alternateName: 'TARJUMAN',
    url: APP_URL,
    logo: { '@type': 'ImageObject', url: `${APP_URL}/logo.png`, width: 512, height: 512 },
    image: `${APP_URL}/og-image.png`,
    foundingDate: '2025',
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', url: 'https://t.me/tarjumanedu', availableLanguage: ['Russian', 'Uzbek', 'English'] },
      { '@type': 'ContactPoint', contactType: 'customer support', email: 'support@tarjumanedu.com' },
    ],
    areaServed: [
      { '@type': 'Country', name: 'Uzbekistan' },
      { '@type': 'Country', name: 'Kazakhstan' },
      { '@type': 'Country', name: 'Tajikistan' },
      { '@type': 'Country', name: 'Kyrgyzstan' },
      { '@type': 'Country', name: 'Russia' },
      { '@type': 'Country', name: 'Azerbaijan' },
    ],
    sameAs: ['https://t.me/tarjumanedu'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: [
        { '@type': 'Offer', name: 'Submission', price: String(PRICES.SUBMISSION), priceCurrency: 'USD', url: `${APP_URL}/pricing` },
        { '@type': 'Offer', name: 'Standard',   price: String(PRICES.STANDARD),   priceCurrency: 'USD', url: `${APP_URL}/pricing` },
        { '@type': 'Offer', name: 'VIP',        price: String(PRICES.VIP),        priceCurrency: 'USD', url: `${APP_URL}/pricing` },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${APP_URL}/#website`,
    url: APP_URL,
    name: 'Tarjuman Edu',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${APP_URL}/universities?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',         item: APP_URL },
      { '@type': 'ListItem', position: 2, name: 'Universities', item: `${APP_URL}/universities` },
      { '@type': 'ListItem', position: 3, name: 'Pricing',      item: `${APP_URL}/pricing` },
      { '@type': 'ListItem', position: 4, name: 'FAQ',          item: `${APP_URL}/faq` },
    ],
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="cryptomus" content="801d9f3b" />
        <link rel="alternate" hrefLang="ru" href="https://tarjumanedu.com" />
        <link rel="alternate" hrefLang="uz" href="https://tarjumanedu.com" />
        <link rel="alternate" hrefLang="en" href="https://tarjumanedu.com" />
        <link rel="alternate" hrefLang="x-default" href="https://tarjumanedu.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=1200&q=80"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Footer />
        <Toaster position="top-right" richColors />
        <TelegramButton />
      </body>
    </html>
  )
}
tInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Toaster position="top-center" richColors />
        <TelegramButton />
        {children}
        <Footer />
      </body>
    </html>
  )
}
