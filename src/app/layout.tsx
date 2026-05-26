import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import TelegramButton from '@/components/TelegramButton'

const APP_URL = 'https://tarjuman.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'TARJUMAN — Поступление в университеты Саудовской Аравии и ОАЭ',
    template: '%s | TARJUMAN',
  },
  description: 'Профессиональная помощь в поступлении в университеты Саудовской Аравии и ОАЭ. Перевод документов, подача заявок, оформление визы. Более 26 университетов-партнёров.',
  keywords: [
    'поступление в университет Саудовской Аравии',
    'поступление в университет ОАЭ',
    'учёба в Саудовской Аравии',
    'исламское образование за рубежом',
    'университеты Саудовской Аравии для узбекистанцев',
    'перевод документов для поступления',
    'Университет Короля Абдулазиза',
    'Исламский университет Медина',
    'tarjuman',
    'поступление в арабские университеты',
    'study in saudi arabia',
    'study in uae foreign students',
  ],
  authors: [{ name: 'TARJUMAN', url: APP_URL }],
  creator: 'TARJUMAN',
  publisher: 'TARJUMAN',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
    title: 'TARJUMAN — Поступление в университеты Саудовской Аравии и ОАЭ',
    description: 'Профессиональная помощь в поступлении в университеты. Перевод документов, подача заявок, оформление визы. Более 26 университетов-партнёров.',
    url: APP_URL,
    siteName: 'TARJUMAN',
    type: 'website',
    locale: 'ru_RU',
    images: [{
      url: '/icon-512.png',
      width: 512,
      height: 512,
      alt: 'TARJUMAN — Образование в Саудовской Аравии и ОАЭ',
    }],
  },
  twitter: {
    card: 'summary',
    title: 'TARJUMAN — Поступление в университеты Саудовской Аравии и ОАЭ',
    description: 'Профессиональная помощь в поступлении в арабские университеты. Перевод, заявки, виза.',
    images: ['/icon-512.png'],
  },
  alternates: {
    canonical: APP_URL,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'TARJUMAN',
  url: APP_URL,
  logo: `${APP_URL}/icon-512.png`,
  description: 'Профессиональная помощь в поступлении в университеты Саудовской Аравии и ОАЭ.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: 'https://t.me/tarjuman_help_bot',
    availableLanguage: ['Russian', 'Uzbek', 'English'],
  },
  areaServed: ['UZ', 'KZ', 'TJ', 'KG', 'TM', 'AZ', 'RU', 'UA', 'BY'],
  sameAs: ['https://t.me/TARJUMAN_KSA'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors />
        <TelegramButton />
      </body>
    </html>
  )
}
