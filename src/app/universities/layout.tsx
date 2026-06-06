import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Университеты Саудовской Аравии и ОАЭ — Tarjuman Edu',
  description: 'Список университетов Саудовской Аравии и ОАЭ для поступления: Al Qasimia University, Исламский университет Медины, KSU, KAU и другие. Условия приёма, специальности, документы.',
  alternates: {
    canonical: 'https://tarjumanedu.com/universities',
  },
  openGraph: {
    title: 'Университеты Саудовской Аравии и ОАЭ — Tarjuman Edu',
    description: 'Al Qasimia University, Исламский университет Медины, KSU, KAU и другие. Условия приёма и документы.',
    url: 'https://tarjumanedu.com/universities',
  },
}

export default function UniversitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
