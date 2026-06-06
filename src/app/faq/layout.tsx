import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Частые вопросы — Tarjuman Edu | FAQ',
  description: 'Ответы на частые вопросы о поступлении в университеты Саудовской Аравии и ОАЭ: документы, сроки, стоимость, требования, процесс подачи заявки.',
  alternates: {
    canonical: 'https://tarjumanedu.com/faq',
  },
  openGraph: {
    title: 'FAQ — Tarjuman Edu',
    description: 'Ответы на частые вопросы о поступлении в университеты Саудовской Аравии и ОАЭ.',
    url: 'https://tarjumanedu.com/faq',
  },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
