import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'О нас — Tarjuman Edu | Команда и миссия',
  description: 'Tarjuman Edu — команда специалистов по поступлению в университеты Саудовской Аравии и ОАЭ. Переводчики, консультанты, менеджеры с опытом работы с арабскими вузами.',
  alternates: {
    canonical: 'https://tarjumanedu.com/about',
  },
  openGraph: {
    title: 'О нас — Tarjuman Edu',
    description: 'Команда специалистов по поступлению в университеты Саудовской Аравии и ОАЭ.',
    url: 'https://tarjumanedu.com/about',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
