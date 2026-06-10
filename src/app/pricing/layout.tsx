import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Тарифы — Tarjuman Edu | Стоимость услуг',
  description: 'Тарифы Tarjuman Edu на помощь при поступлении в университеты Саудовской Аравии и ОАЭ. Подача документов, перевод, сопровождение. Цены от $39.',
  alternates: {
    canonical: 'https://tarjumanedu.com/pricing',
  },
  openGraph: {
    title: 'Тарифы — Tarjuman Edu',
    description: 'Стоимость услуг по поступлению в университеты Саудовской Аравии и ОАЭ. От $39.',
    url: 'https://tarjumanedu.com/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
