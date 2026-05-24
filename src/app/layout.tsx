import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'TARJUMAN — Поступление в университеты Саудовской Аравии и ОАЭ',
  description: 'Профессиональная помощь в поступлении в арабские университеты. Перевод документов, подача заявок, поддержка при получении визы.',
  keywords: ['university', 'saudi arabia', 'uae', 'admission', 'translation', 'CIS students'],
  openGraph: {
    title: 'TARJUMAN — Study in Saudi Arabia & UAE',
    description: 'Premium admission agency for CIS students',
    type: 'website',
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
      </body>
    </html>
  )
}
