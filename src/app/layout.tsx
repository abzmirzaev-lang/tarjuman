import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import TelegramButton from '@/components/TelegramButton'
import Footer from '@/components/Footer'

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
      url: `${APP_URL}/og-image.png`,
      width: 640,
      height: 640,
      alt: 'Tarjuman Edu',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarjuman Edu — Поступление в Саудовскую Аравию и ОАЭ',
    description: 'Перевод документов, подача заявки, сопровождение до зачисления. Al Qasimia, IUM, KSU, KAU.',
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
    foundingDate: '2025',
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
        <li