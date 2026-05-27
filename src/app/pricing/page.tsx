'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PACKAGES } from '@/types'
import type { AppLanguage, ServicePackage } from '@/types'
import { translations } from '@/i18n'
import { cn } from '@/lib/utils'

const FEATURES: Record<ServicePackage, Record<AppLanguage, string[]>> = {
  SUBMISSION: {
    ru: ['Подача готовых документов', 'Онлайн-трекинг статуса', 'Telegram-уведомления', 'Ответ в течение 48 ч'],
    uz: ['Tayyor hujjatlarni topshirish', 'Onlayn holat kuzatuvi', 'Telegram bildirishnomalar', '48 soat ichida javob'],
    en: ['Submission of ready documents', 'Online status tracking', 'Telegram notifications', 'Reply within 48 h'],
  },
  STANDARD: {
    ru: ['Перевод документов на арабский', 'Подача в течение 24 часов', 'Онлайн-трекинг статуса', 'Telegram-уведомления', 'Поддержка после зачисления'],
    uz: ['Hujjatlarni arabchaga tarjima', '24 soat ichida topshirish', 'Onlayn holat kuzatuvi', 'Telegram bildirishnomalar', 'Qabul keyin yordam'],
    en: ['Arabic document translation', 'Submission within 24 h', 'Online status tracking', 'Telegram notifications', 'Post-enrollment support'],
  },
  VIP: {
    ru: ['Перевод документов на арабский', 'Подача в течение 6 часов', 'Приоритетная обработка', 'Персональный менеджер', 'Безлимитный чат', 'Поддержка после зачисления'],
    uz: ['Hujjatlarni arabchaga tarjima', '6 soat ichida topshirish', 'Ustuvor ko\'rib chiqish', 'Shaxsiy menejer', 'Cheksiz chat', 'Qabul keyin yordam'],
    en: ['Arabic document translation', 'Submission within 6 h', 'Priority processing', 'Personal manager', 'Unlimited chat', 'Post-enrollment support'],
  },
}

type Cell = true | false | string
const TABLE_ROWS: { ru: string; uz: string; en: string; basic: Cell; standard: Cell; vip: Cell }[] = [
  { ru: 'Подача документов',          uz: 'Hujjat topshirish',    en: 'Document submission',     basic: true,   standard: true,   vip: true  },
  { ru: 'Перевод на арабский',        uz: 'Arabchaga tarjima',    en: 'Arabic translation',      basic: false,  standard: true,   vip: true  },
  { ru: 'Срок подачи',                uz: 'Topshirish muddati',   en: 'Submission time',         basic: '48 ч', standard: '24 ч', vip: '6 ч' },
  { ru: 'Онлайн-трекинг',             uz: 'Onlayn kuzatuv',      en: 'Online tracking',         basic: true,   standard: true,   vip: true  },
  { ru: 'Telegram-уведомления',       uz: 'Telegram bildirish',  en: 'Telegram notifications',  basic: true,   standard: true,   vip: true  },
  { ru: 'Поддержка после зачисления', uz: 'Qabul keyin yordam',  en: 'Post-enrollment support', basic: false,  standard: true,   vip: true  },
  { ru: 'Персональный менеджер',      uz: 'Shaxsiy menejer',     en: 'Personal manager',        basic: false,  standard: false,  vip: true  },
  { ru: 'Безлимитный чат',            uz: 'Cheksiz chat',        en: 'Unlimited chat',          basic: false,  standard: false,  vip: true  },
]

function CellIcon({ value, isHero }: { value: Cell; isHero: boolean }) {
  if (value === true)  return <Check className={cn('w-4 h-4 mx-auto', isHero ? 'text-[#D4A943]' : 'text-brand-500')} />
  if (value === false) return <span className="text-ink/20 text-lg leading-none">—</span>
  return <span className={cn('text-[11px] font-bold tracking-wider', isHero ? 'text-[#D4A943]' : 'text-brand-600')}>{value}</span>
}

const PLANS: { key: ServicePackage; hero: boolean }[] = [
  { key: 'SUBMISSION', hero: false },
  { key: 'STANDARD',   hero: true  },
  { key: 'VIP',        hero: false },
]

export default function PricingPage() {
  const [lang, setLang] = useLanguage()
  const t = translations[lang]

  const steps = lang === 'ru' ? [
    { n: '01', title: 'Выберите тариф',      desc: 'Оплата онлайн — карта, Apple Pay или через Telegram' },
    { n: '02', title: 'Загрузите документы', desc: 'Паспорт, диплом, фото — прямо в личном кабинете' 