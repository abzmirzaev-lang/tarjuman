import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import TelegramButton from '@/components/TelegramButton'
import Footer from '@/components/Footer'

const APP_URL = 'https://tarjumanedu.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'TARJUMAN — Поступление в университеты Саудовской Аравии, ОАЭ, Катара и Турции',
    template: '%s | TARJUMAN',
  },
  description: 'Профессиональная помощь в поступлении в университеты Саудовской Аравии, ОАЭ, Катара, Кувейта и Турции. Перевод документов, подача заявок, оформление визы. Более 26 университетов-партнёров.',
  keywords: [
    'поступление в университет Саудовской Аравии',
    'поступление в университет ОАЭ',
    'поступление в университет Катара',
    'поступление в университет Кувейта',
    'поступление в университет Турции',
    'учёба в Саудовской Аравии',
    'учёба в ОАЭ для узбекистанцев',
    'учёба в Турции для узбекистанцев',
    'исламское образование за рубежом',
    'университеты Саудовской Аравии для узбекистанцев',
    'перевод документов для поступления',
    'Университет Короля Абдулазиза',
    'Исламский университет Медина',
    'tarjuman',
    'TARJUMAN поступление',
    'поступление в арабские университеты',
    'study in saudi arabia',
    'study in uae foreign students',
    'study in qatar',
    'study in kuwait',
    'study in turkey uzbekistan',
    'oliy talim saudiya arabistoni',
    'chet elda oliy talim',
    'arab universitetlari',
    'stipendiya saudiya arabistoni',
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
    title: 'TARJUMAN — Поступление в университеты Саудовской Аравии, ОАЭ, Катара и Турции',
    description: 'Профессиональная помощь в поступлении в университеты СА, ОАЭ, Катара, Кувейта и Турции. Перевод, заявки, виза.',
    url: APP_URL,
    siteName: 'TARJUMAN',
    type: 'website',
    locale: 'ru_RU',
    images: [{
      url: '/og-image.png',
      width: 640,
      height: 640,
      alt: 'TARJUMAN — Образование в Арабских Странах',
    }],
  },
  twitter: {
    card: 'summary',
    title: 'TARJUMAN — Поступление в университеты Саудовской Аравии, ОАЭ, Катара и Турции',
    description: 'Профессиональная помощь в поступлении в университеты СА, ОАЭ, Катара, Кувейта и Турции.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    google: 'CdcVagxqE94kWR5GCDlQqmsGIZQTf4YubNWu21y4TzE',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'TARJUMAN',
  url: APP_URL,
  logo: `${APP_URL}/og-image.png`,
  description: 'Профессиональная помощь в поступлении в университеты Саудовской Аравии, ОАЭ, Катара, Кувейта и Турции.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: 'https://t.me/tarjuman_help_bot',
    availableLanguage: ['Russian', 'Uzbek', 'English'],
  },
  areaServed: ['UZ', 'KZ', 'TJ', 'KG', 'TM', 'AZ', 'RU', 'UA', 'BY'],
  serviceArea: ['SA', 'AE', 'QA', 'KW', 'TR'],
  sameAs: ['https://t.me/TARJUMAN_KSA'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta name="cryptomus" content="801d9f3b" />
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
