'use client'
export { metadata } from './metadata'
import { useLanguage } from '@/hooks/useLanguage'
import { useState } from 'react'
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
    uz: ['Hujjatlarni arabchaga tarjima', '6 soat ichida topshirish', "Ustuvor ko'rib chiqish", 'Shaxsiy menejer', 'Cheksiz chat', 'Qabul keyin yordam'],
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
    { n: '02', title: 'Загрузите документы', desc: 'Паспорт, диплом, фото — прямо в личном кабинете' },
    { n: '03', title: 'Мы работаем',         desc: 'Переводим, оформляем, подаём заявку в университет' },
    { n: '04', title: 'Вы зачислены',        desc: 'Получите официальное письмо о зачислении' },
  ] : lang === 'uz' ? [
    { n: '01', title: 'Tarifni tanlang',      desc: "To'lov onlayn — karta, Apple Pay yoki Telegram orqali" },
    { n: '02', title: 'Hujjatlarni yuklang',  desc: "Pasport, diplom, foto — shaxsiy kabinetda to'g'ridan" },
    { n: '03', title: 'Biz ishlaymiz',        desc: "Tarjima qilamiz, rasmiylashtiramiz, universitetga topshiramiz" },
    { n: '04', title: 'Siz qabul qilindingiz', desc: "Rasmiy qabul xatini olasiz" },
  ] : [
    { n: '01', title: 'Choose a plan',       desc: 'Pay online — card, Apple Pay, or via Telegram' },
    { n: '02', title: 'Upload documents',    desc: 'Passport, diploma, photo — right in your dashboard' },
    { n: '03', title: 'We do the work',      desc: 'We translate, prepare, and submit your application' },
    { n: '04', title: 'You are enrolled',    desc: 'Receive an official admission letter' },
  ]

  const heroTitle = lang === 'ru' ? 'Простые и прозрачные тарифы'
    : lang === 'uz' ? "Oddiy va shaffof tariflar"
    : 'Simple and transparent pricing'

  const heroSub = lang === 'ru' ? 'Без скрытых платежей. Платите один раз — мы делаем всё остальное.'
    : lang === 'uz' ? "Yashirin to'lovlarsiz. Bir marta to'lang — biz qolganini qilamiz."
    : 'No hidden fees. Pay once — we do the rest.'

  const tableTitle = lang === 'ru' ? 'Сравнение тарифов' : lang === 'uz' ? "Tariflarni solishtirish" : 'Plan comparison'
  const stepsTitle = lang === 'ru' ? 'Как это работает' : lang === 'uz' ? "Bu qanday ishlaydi" : 'How it works'
  const ctaTitle   = lang === 'ru' ? 'Готовы начать?' : lang === 'uz' ? "Boshlashga tayyormisiz?" : 'Ready to start?'
  const ctaSub     = lang === 'ru' ? 'Подайте заявку прямо сейчас — это займёт 5 минут'
    : lang === 'uz' ? "Hoziroq ariza bering — bu 5 daqiqa oladi"
    : 'Apply right now — it takes 5 minutes'
  const ctaBtn     = lang === 'ru' ? 'Подать заявку' : lang === 'uz' ? "Ariza berish" : 'Apply now'
  const popularLabel = lang === 'ru' ? 'Популярный' : lang === 'uz' ? "Mashhur" : 'Popular'
  const perApp     = lang === 'ru' ? '/ за заявку' : lang === 'uz' ? "/ ariza uchun" : '/ per application'

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">

        {/* Hero */}
        <div className="bg-ink text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">
              {lang === 'ru' ? 'Тарифы' : lang === 'uz' ? 'Tariflar' : 'Pricing'}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">{heroTitle}</h1>
            <p className="text-white/60 text-base sm:text-lg">{heroSub}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            {PLANS.map(({ key, hero }, i) => {
              const pkg  = PACKAGES[key]
              const feats = FEATURES[key][lang]
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'relative rounded-2xl p-6 flex flex-col',
                    hero
                      ? 'bg-ink text-white shadow-2xl ring-2 ring-brand-400'
                      : 'bg-white border border-border shadow-sm'
                  )}
                >
                  {hero && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-400 text-ink text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {popularLabel}
                    </div>
                  )}
                  <div className="mb-4">
                    <p className={cn('text-xs font-semibold uppercase tracking-wider mb-1', hero ? 'text-brand-400' : 'text-brand-500')}>
                      {lang === 'ru' ? pkg.name_ru : lang === 'uz' ? pkg.name_uz ?? pkg.name_en : pkg.name_en}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className={cn('text-4xl font-bold', hero ? 'text-white' : 'text-ink')}>${pkg.priceUSD}</span>
                      <span className={cn('text-sm mb-1', hero ? 'text-white/60' : 'text-muted')}>{perApp}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 flex-1 mb-6">
                    {feats.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className={cn('w-4 h-4 shrink-0 mt-0.5', hero ? 'text-brand-400' : 'text-brand-500')} />
                        <span className={hero ? 'text-white/80' : 'text-muted'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/apply"
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                      hero
                        ? 'bg-brand-400 text-ink hover:bg-brand-300'
                        : 'bg-ink text-white hover:bg-ink/80'
                    )}
                  >
                    {ctaBtn}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Comparison Table */}
          <div>
            <h2 className="text-2xl font-bold text-ink mb-6 text-center">{tableTitle}</h2>
            <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted font-medium w-1/2">
                      {lang === 'ru' ? 'Функция' : lang === 'uz' ? 'Funksiya' : 'Feature'}
                    </th>
                    {PLANS.map(({ key, hero }) => (
                      <th key={key} className={cn('p-4 text-center font-bold', hero ? 'bg-ink text-white' : 'text-ink')}>
                        {lang === 'ru' ? PACKAGES[key].name_ru : lang === 'uz' ? PACKAGES[key].name_uz ?? PACKAGES[key].name_en : PACKAGES[key].name_en}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row, i) => (
                    <tr key={row.ru} className={cn('border-b border-border last:border-0', i % 2 === 0 ? 'bg-white' : 'bg-surface')}>
                      <td className="p-4 text-muted">{lang === 'ru' ? row.ru : lang === 'uz' ? row.uz : row.en}</td>
                      {[row.basic, row.standard, row.vip].map((val, j) => (
                        <td key={j} className={cn('p-4 text-center', PLANS[j].hero ? 'bg-ink/5' : '')}>
                          <CellIcon value={val} isHero={PLANS[j].hero} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-2xl font-bold text-ink mb-8 text-center">{stepsTitle}</h2>
            <div className="grid sm:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-400/20 text-brand-600 font-bold text-sm flex items-center justify-center mx-auto mb-3">{s.n}</div>
                  <p className="font-semibold text-ink text-sm mb-1">{s.title}</p>
                  <p className="text-xs text-muted">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <ShieldCheck className="w-5 h-5 text-brand-500" />
            {lang === 'ru' ? 'Безопасная оплата · Данные защищены · Политика возврата'
              : lang === 'uz' ? "Xavfsiz to'lov · Ma'lumotlar himoyalangan · Qaytarish siyosati"
              : 'Secure payment · Data protected · Refund policy'}
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-ink text-white p-10 text-center">
            <h3 className="text-2xl font-bold mb-2">{ctaTitle}</h3>
            <p className="text-white/60 mb-8 text-base">{ctaSub}</p>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-400 text-ink font-bold rounded-xl text-base hover:bg-brand-300 transition-colors"
            >
              {ctaBtn}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
