import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import TelegramButton from '@/components/TelegramButton'
import Footer from '@/components/Footer'

const APP_URL = 'https://tarjumanedu.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Tarjuman Edu — Postuplenie v Saudovskuyu Araviyu i OAE | Perevod dokumentov',
    template: '%s | TARJUMAN EDU',
  },
  description: 'Tarjuman Edu — professionalnaya pomosh studentam iz SNG pri postuplenii v universitety Saudovskoy Aravii i OAE. Perevod dokumentov na arabskiy, podacha zayavki, soprovozhdenie do zachisleniya. Al Qasimia University, IUM, KSU, KAU.',
  keywords: [
    'postuplenie v Saudovskuyu Araviyu',
    'postuplenie v universitet Saudovskoy Aravii',
    'stipendiya Saudovskaya Araviya',
    'Al Qasimia University postuplenie',
    'Al Qasimia University',
    'universitety OAE',
    'postuplenie v universitet OAE',
    'Islamskiy universitet Mediny',
    'Islamic University of Madinah',
    'King Saud University postuplenie',
    'ucheba v Saudovskoy Aravii',
    'ucheba v OAE dlya uzbekistantsev',
    'perevod dokumentov na arabskiy',
    'pomosh postuplenie arabskie universitety',
    'agentstvo postuplenie Saudovskaya Araviya',
    'tarjuman edu',
    'TARJUMAN postuplenie',
    'study in saudi arabia cis students',
    'study in uae for uzbekistan students',
    'oliy talim saudiya arabistoni',
    'stipendiya saudiya arabistoni',
    'arab universitetlari qabul',
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
    title: 'Tarjuman Edu — Postuplenie v Saudovskuyu Araviyu i OAE',
    description: 'Perevod dokumentov, podacha zayavki, soprovozhdenie. Al Qasimia University, IUM, KSU, KAU i drugie. 120+ zayavok obrabotano.',
    url: APP_URL,
    siteName: 'Tarjuman Edu',
    type: 'website',
    locale: 'ru_RU',
    images: [{
      url: `${APP_URL}/og-image.png`,
      width: 640,
      height: 640,
      alt: 'Tarjuman Edu',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarjuman Edu — Postuplenie v Saudovskuyu Araviyu i OAE',
    description: 'Perevod dokumentov, podacha zayavki, soprovozhdenie. Al Qasimia, IUM, KSU, KAU.',
    images: [`${APP_URL}/og-image.png`],
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    google: 'CdcVagxqE94kWR5GCDlQqmsGIZQTf4YubNWu21y4TzE',
  },
  category: 'education',
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'ProfessionalService'],
    '@id': `${APP_URL}/#organization`,
    name: 'Tarjuman Edu',
    alternateName: 'TARJUMAN',
    url: APP_URL,
    logo: { '@type': 'ImageObject', url: `${APP_URL}/logo.png`, width: 512, height: 512 },
    image: `${APP_URL}/og-image.png`,
    foundingDate: '2022',
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'customer support', url: 'https://t.me/TARJUMAN_KSA', availableLanguage: ['Russian', 'Uzbek', 'English'] },
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
    sameAs: ['https://t.me/TARJUMAN_KSA'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: [
        { '@type': 'Offer', name: 'Submission', price: '49', priceCurrency: 'USD', url: `${APP_URL}/pricing` },
        { '@type': 'Offer', name: 'Standard',   price: '99', priceCurrency: 'USD', url: `${APP_URL}/pricing` },
        { '@type': 'Offer', name: 'VIP',        price: '199', priceCurrency: 'USD', url: `${APP_URL}/pricing` },
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
