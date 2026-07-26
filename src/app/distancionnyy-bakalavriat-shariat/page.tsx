import type { Metadata } from 'next'
import DistanceShariaClient from './DistanceShariaClient'

export const metadata: Metadata = {
  title: 'Дистанционный бакалавриат Шариата — Исламский университет Медины | Tarjuman Edu',
  description: 'Поступление на дистанционную программу бакалавриата Шариата в Исламском университете Медины (IUM) для иностранных студентов. Бесплатный грант от Вакфа короля Абдаллы. Приём на 1448 г.х. Помощь с документами от Tarjuman Edu.',
  keywords: [
    'дистанционный бакалавриат шариат',
    'IUM дистанционное обучение',
    'Исламский университет Медины онлайн',
    'бакалавриат шариата дистанционно',
    'islamic university madinah distance learning',
    'IUM online bachelor sharia',
    'поступление дистанционно Медина',
    'грант вакф короля Абдаллы',
  ],
  alternates: { canonical: 'https://tarjumanedu.com/distancionnyy-bakalavriat-shariat' },
  openGraph: {
    title: 'Дистанционный бакалавриат Шариата — IUM | Tarjuman Edu',
    description: 'Онлайн-программа бакалавриата Шариата в Исламском университете Медины. Бесплатный грант, приём на 1448 г.х. Помощь с документами.',
    url: 'https://tarjumanedu.com/distancionnyy-bakalavriat-shariat',
  },
}

export default function Page() {
  return <DistanceShariaClient />
}
