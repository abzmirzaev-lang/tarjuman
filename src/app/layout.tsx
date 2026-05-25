import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import TelegramButton from '@/components/TelegramButton'

export const metadata: Metadata = {
  title: 'TARJUMAN — Поступление в университеты Саудовской Аравии и ОАЭ',
  description: 'Профессиональная помощь в поступлении в арабские университеты. Перевод документов, подача заявок, поддержка при получении визы.',
  keywords: ['university', 'saudi arabia', 'uae', 'admission', 'translation', 'CIS students'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'TARJUMAN — Study in Saudi Arabia & UAE',
    description: 'Premium admission agency for CIS students',
    type: 'website',
    images: [{ url: '/icon-512.png', width: 512, height: 512 }],
  },
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
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors />

        <TelegramButton />
      </body>
    </html>
  )
}
