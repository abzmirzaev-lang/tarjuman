'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check, X, ArrowRight, ShieldCheck, Zap, Star,
  FileText, Languages, Clock, Bell, HeartHandshake,
  MessageCircle, Crown, Sparkles, Users, RotateCcw,
  BadgeCheck, ChevronDown, ChevronUp,
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PACKAGES } from '@/types'
import type { AppLanguage, ServicePackage } from '@/types'
import { cn } from '@/lib/utils'

/* ─── Feature definitions ────────────────────────────────────────────────── */
type Cell = true | false | string

interface Feature {
  icon: React.ElementType
  ru: string; uz: string; en: string
  basic: Cell; standard: Cell; vip: Cell
  highlight?: boolean
}

const FEATURES: Feature[] = [
  { icon: FileText,     ru: 'Подача документов',          uz: 'Hujjat topshirish',       en: 'Document submission',       basic: true,      standard: true,      vip: true },
  { icon: Languages,    ru: 'Перевод на арабский',        uz: 'Arabchaga tarjima',        en: 'Arabic translation',        basic: false,     standard: true,      vip: true,    highlight: true },
  { icon: BadgeCheck,   ru: 'Проверка документов',        uz: "Hujjatlarni tekshirish",   en: 'Document review',           basic: false,     standard: true,      vip: true },
  { icon: Clock,        ru: 'Срок подачи',                uz: 'Topshirish muddati',       en: 'Submission time',           basic: '48 ч',    standard: '1–3 дня', vip: '12–24 ч', highlight: true },
  { icon: Bell,         ru: 'Telegram-уведомления',       uz: 'Telegram bildirish',       en: 'Telegram notifications',    basic: true,      standard: true,      vip: true },
  { icon: Zap,          ru: 'Онлайн-трекинг статуса',    uz: 'Onlayn holat kuzatuvi',    en: 'Online status tracking',    basic: true,      standard: true,      vip: true },
  { icon: HeartHandshake, ru: 'Поддержка после зачисления', uz: 'Qabul keyin yordam',    en: 'Post-enrollment support',   basic: false,     standard: true,      vip: true },
  { icon: Crown,        ru: 'Приоритетная обработка',     uz: "Ustuvor ko'rib chiqish",   en: 'Priority processing',       basic: false,     standard: false,     vip: true,    highlight: true },
  { icon: Users,        ru: 'Персональный менеджер',      uz: 'Shaxsiy menejer',          en: 'Personal manager',          basic: false,     standard: false,     vip: true },
  { icon: MessageCircle, ru: 'Безлимитный чат',           uz: 'Cheksiz chat',             en: 'Unlimited chat',            basic: false,     standard: false,     vip: true },
  { icon: RotateCcw,    ru: 'Гарантия возврата',          uz: 'Qaytarish kafolati',       en: 'Money-back guarantee',      basic: true,      standard: true,      vip: true },
]

const PLANS: { key: ServicePackage; popular: boolean; icon: React.ElementType; gradient: string; accentBg: string }[] = [
  { key: 'SUBMISSION', popular: false, icon: FileText,  gradient: 'from-slate-700 to-slate-900',  accentBg: 'bg-slate-50' },
  { key: 'STANDARD',   popular: true,  icon: Sparkles,  gradient: 'from-brand-500 to-brand-700',  accentBg: 'bg-brand-50' },
  { key: 'VIP',        popular: false, icon: Crown,     gradient: 'from-amber-500 to-orange-600', accentBg: 'bg-amber-50' },
]

const PLAN_FEATURES: Record<ServicePackage, { icon: React.ElementType; ru: string; en: string; uz: string }[]> = {
  SUBMISSION: [
    { icon: FileText,      ru: 'Подача готового пакета',       en: 'Ready package submission',      uz: 'Tayyor paketni topshirish' },
    { icon: Zap,           ru: 'Онлайн-трекинг статуса',       en: 'Online status tracking',        uz: 'Onlayn holat kuzatuvi' },
    { icon: Bell,          ru: 'Telegram-уведомления',         en: 'Telegram notifications',        uz: 'Telegram bildirishnomalar' },
    { icon: RotateCcw,     ru: 'Гарантия возврата',            en: 'Money-back guarantee',          uz: 'Qaytarish kafolati' },
  ],
  STANDARD: [
    { icon: Languages,     ru: 'Перевод на арабский',          en: 'Arabic translation',            uz: 'Arabchaga tarjima' },
    { icon: BadgeCheck,    ru: 'Проверка всех документов',     en: 'Full document review',          uz: "Barcha hujjatlarni tekshirish" },
    { icon: Clock,         ru: 'Подача за 1–3 дня',            en: 'Submission in 1–3 days',        uz: '1–3 kun ichida topshirish' },
    { icon: HeartHandshake, ru: 'Поддержка после зачисления',  en: 'Post-enrollment support',       uz: 'Qabul keyin yordam' },
    { icon: Zap,           ru: 'Онлайн-трекинг статуса',       en: 'Online status tracking',        uz: 'Onlayn holat kuzatuvi' },
    { icon: Bell,          ru: 'Telegram-уведомления',         en: 'Telegram notifications',        uz: 'Telegram bildirishnomalar' },
  ],
  VIP: [
    { icon: Crown,         ru: 'Приоритетная обработка',       en: 'Priority processing',           uz: "Ustuvor ko'rib chiqish" },
    { icon: Languages,     ru: 'Перевод на арабский',          en: 'Arabic translation',            uz: 'Arabchaga tarjima' },
    { icon: Clock,         ru: 'Подача за 12–24 часа',         en: 'Submission in 12–24 hours',     uz: '12–24 soat ichida topshirish' },
    { icon: Users,         ru: 'Персональный менеджер',        en: 'Personal manager',              uz: 'Shaxsiy menejer' },
    { icon: MessageCircle, ru: 'Безлимитный чат 24/7',         en: 'Unlimited chat 24/7',           uz: 'Cheksiz chat 24/7' },
    { icon: HeartHandshake, ru: 'Сопровождение до визы',       en: 'Support until visa',            uz: 'Vizagacha yordam' },
  ],
}

/* ─── Cell renderer ──────────────────────────────────────────────────────── */
function Cell({ value, isPopular }: { value: Cell; isPopular: boolean }) {
  if (value === true)  return <div className="flex justify-center"><div className={cn('w-5 h-5 rounded-full flex items-center justify-center', isPopular ? 'bg-brand-400' : 'bg-brand-100')}><Check className={cn('w-3 h-3', isPopular ? 'text-ink' : 'text-brand-600')} /></div></div>
  if (value === false) return <X className="w-4 h-4 text-border mx-auto" />
  return <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', isPopular ? 'bg-brand-400/20 text-brand-700' : 'bg-surface text-muted')}>{value}</span>
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function PricingPage() {
  const [lang, setLang] = useLanguage()
  const [tableOpen, setTableOpen] = useState(false)

  const L = lang as AppLanguage
  const tr = (obj: { ru: string; en: string; uz: string }) => L === 'uz' ? obj.uz : L === 'en' ? obj.en : obj.ru

  const ui = {
    badge:   tr({ ru: 'Тарифы', en: 'Pricing', uz: 'Tariflar' }),
    title:   tr({ ru: 'Выберите свой тариф', en: 'Choose your plan', uz: 'Tarifingizni tanlang' }),
    sub:     tr({ ru: 'Фиксированная цена. Без скрытых платежей. Без сюрпризов.', en: 'Fixed price. No hidden fees. No surprises.', uz: "Belgilangan narx. Yashirin to'lovlarsiz. Kutilmagan narsalarsiz." }),
    popular: tr({ ru: 'Популярный', en: 'Most popular', uz: 'Mashhur' }),
    perApp:  tr({ ru: '/ за заявку', en: '/ per application', uz: '/ ariza uchun' }),
    apply:   tr({ ru: 'Начать сейчас', en: 'Get started', uz: 'Boshlash' }),
    compare: tr({ ru: 'Сравнить все тарифы', en: 'Compare all plans', uz: 'Barcha tariflarni solishtirish' }),
    hideCompare: tr({ ru: 'Скрыть сравнение', en: 'Hide comparison', uz: 'Yashirish' }),
    feature: tr({ ru: 'Что включено', en: 'What\'s included', uz: 'Nima kiradi' }),
    tableHead: tr({ ru: 'Функция', en: 'Feature', uz: 'Funksiya' }),
    ctaTitle: tr({ ru: 'Готовы поступить?', en: 'Ready to enroll?', uz: 'Qabulga tayyormisiz?' }),
    ctaSub:  tr({ ru: 'Подайте заявку за 5 минут — мы возьмём всё в свои руки.', en: 'Apply in 5 minutes — we\'ll handle everything.', uz: '5 daqiqada ariza bering — biz hamma narsani o\'z zimmamizga olamiz.' }),
    ctaBtn:  tr({ ru: 'Подать заявку', en: 'Apply now', uz: 'Ariza berish' }),
    trust:   tr({ ru: 'Безопасная оплата · Возврат средств · Данные защищены', en: 'Secure payment · Money-back · Data protected', uz: "Xavfsiz to'lov · Qaytarish · Ma'lumotlar himoyasi" }),
    social:  tr({ ru: '120+ студентов уже поступили', en: '120+ students already enrolled', uz: "120+ talaba allaqachon qabul bo'ldi" }),
    notSure: tr({ ru: 'Не уверены, что выбрать?', en: 'Not sure which plan?', uz: 'Qaysi tarifni tanlashni bilmaysizmi?' }),
    consult: tr({ ru: 'Бесплатная консультация', en: 'Free consultation', uz: 'Bepul maslahat' }),
  }

  const planName = (key: ServicePackage) =>
    L === 'ru' ? PACKAGES[key].name_ru : L === 'uz' ? PACKAGES[key].name_uz : PACKAGES[key].name_en

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-[#F7F8FA]">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div className="bg-ink text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-violet-900/10 pointer-events-none" />
          <div className="absolute -top-32 right-0 w-96 h-96 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold uppercase tracking-widest mb-5">
                {ui.badge}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">{ui.title}</h1>
              <p className="text-white/60 text-base sm:text-lg mb-6">{ui.sub}</p>

              {/* Social proof */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-sm">
                <div className="flex -space-x-1.5">
                  {['🇺🇿','🇰🇿','🇹🇯','🇰🇬'].map((f, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs">{f}</div>
                  ))}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 fill-brand-400 text-brand-400" />)}
                </div>
                <span className="text-white/80 font-medium">{ui.social}</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">

          {/* ── PRICING CARDS ──────────────────────────────────────────── */}
          <div className="grid sm:grid-cols-3 gap-5 items-start">
            {PLANS.map(({ key, popular, icon: Icon, gradient, accentBg }, i) => {
              const pkg   = PACKAGES[key]
              const feats = PLAN_FEATURES[key]
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'relative rounded-3xl flex flex-col overflow-hidden',
                    popular
                      ? 'shadow-2xl shadow-brand-500/20 ring-2 ring-brand-400 scale-[1.02]'
                      : 'border border-border shadow-sm bg-white'
                  )}
                >
                  {/* Popular badge */}
                  {popular && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center">
                      <div className="bg-brand-400 text-ink text-[11px] font-black uppercase tracking-widest px-5 py-1.5 rounded-b-2xl shadow-lg">
                        ⚡ {ui.popular}
                      </div>
                    </div>
                  )}

                  {/* Card header */}
                  <div className={cn('p-6 pt-8', popular ? 'bg-ink text-white' : 'bg-white')}>
                    {popular && <div className="h-5 mb-2" />}

                    <div className="flex items-center gap-3 mb-5">
                      <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center', popular ? 'bg-brand-400/20' : accentBg)}>
                        <Icon className={cn('w-5 h-5', popular ? 'text-brand-400' : 'text-ink')} />
                      </div>
                      <div>
                        <p className={cn('text-xs font-bold uppercase tracking-widest', popular ? 'text-brand-400' : 'text-muted')}>
                          {planName(key)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-1">
                      <span className={cn('text-5xl font-black', popular ? 'text-white' : 'text-ink')}>${pkg.priceUSD}</span>
                      <span className={cn('text-sm ml-2', popular ? 'text-white/50' : 'text-muted')}>{ui.perApp}</span>
                    </div>

                    {key === 'STANDARD' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-brand-400/15 text-brand-400 text-xs font-semibold px-3 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        {L === 'ru' ? 'Лучший выбор для большинства' : L === 'uz' ? "Ko'pchilik uchun eng yaxshi tanlov" : 'Best choice for most'}
                      </div>
                    )}
                    {key === 'VIP' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-400/15 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full">
                        <Crown className="w-3 h-3" />
                        {L === 'ru' ? 'Максимальный результат' : L === 'uz' ? 'Maksimal natija' : 'Maximum results'}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className={cn('h-px', popular ? 'bg-white/10' : 'bg-border')} />

                  {/* Features */}
                  <div className={cn('p-6 flex-1 flex flex-col', popular ? 'bg-ink' : 'bg-white')}>
                    <p className={cn('text-xs font-bold uppercase tracking-wider mb-4', popular ? 'text-white/40' : 'text-muted')}>
                      {ui.feature}
                    </p>
                    <ul className="space-y-3 flex-1 mb-6">
                      {feats.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-3">
                          <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center shrink-0', popular ? 'bg-brand-400/15' : 'bg-brand-50')}>
                            <f.icon className={cn('w-3.5 h-3.5', popular ? 'text-brand-400' : 'text-brand-600')} />
                          </div>
                          <span className={cn('text-sm', popular ? 'text-white/80' : 'text-muted')}>{tr({ ru: f.ru, en: f.en, uz: f.uz })}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/apply">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-colors',
                          popular
                            ? 'bg-brand-400 text-ink hover:bg-brand-300 shadow-lg shadow-brand-400/30'
                            : 'bg-ink text-white hover:bg-ink/80'
                        )}
                      >
                        {ui.apply}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* ── NOT SURE CTA ───────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted">
            <span>{ui.notSure}</span>
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              <MessageCircle className="w-4 h-4" />
              {ui.consult}
            </Link>
          </div>

          {/* ── COMPARISON TABLE ───────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setTableOpen(v => !v)}
              className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-border hover:border-brand-300 transition-colors"
            >
              <span className="font-bold text-ink">{tableOpen ? ui.hideCompare : ui.compare}</span>
              {tableOpen ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
            </button>

            {tableOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-white rounded-2xl border border-border overflow-hidden shadow-sm"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-muted font-medium w-2/5">{ui.tableHead}</th>
                        {PLANS.map(({ key, popular }) => (
                          <th key={key} className={cn('p-4 text-center w-1/5', popular ? 'bg-brand-50' : '')}>
                            <div className="flex flex-col items-center gap-1">
                              {popular && <span className="text-[10px] bg-brand-400 text-ink font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{ui.popular}</span>}
                              <span className={cn('font-bold', popular ? 'text-brand-700' : 'text-ink')}>{planName(key)}</span>
                              <span className="text-muted font-normal text-xs">${PACKAGES[key].priceUSD}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {FEATURES.map((row, i) => (
                        <tr key={i} className={cn('border-b border-border last:border-0 group', row.highlight ? 'bg-brand-50/30' : i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}>
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center shrink-0">
                                <row.icon className="w-3.5 h-3.5 text-muted" />
                              </div>
                              <span className={cn('text-ink', row.highlight ? 'font-semibold' : '')}>{tr({ ru: row.ru, en: row.en, uz: row.uz })}</span>
                            </div>
                          </td>
                          {[
                            { val: row.basic,    popular: false },
                            { val: row.standard, popular: true  },
                            { val: row.vip,      popular: false },
                          ].map(({ val, popular }, j) => (
                            <td key={j} className={cn('p-4 text-center', popular ? 'bg-brand-50/60' : '')}>
                              <Cell value={val} isPopular={popular} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── TRUST STRIP ────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-4 text-sm text-muted">
            {[
              { icon: ShieldCheck, text: tr({ ru: 'Безопасная оплата', en: 'Secure payment', uz: "Xavfsiz to'lov" }) },
              { icon: RotateCcw,   text: tr({ ru: 'Гарантия возврата', en: 'Money-back guarantee', uz: 'Qaytarish kafolati' }) },
              { icon: BadgeCheck,  text: tr({ ru: 'Проверено 120+ студентами', en: 'Trusted by 120+ students', uz: '120+ talaba tomonidan ishonilgan' }) },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-brand-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* ── CTA ────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-ink text-white p-10 sm:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-black mb-3">{ui.ctaTitle}</h3>
              <p className="text-white/60 mb-8 text-base max-w-md mx-auto">{ui.ctaSub}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/apply">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-400 text-ink font-black rounded-2xl text-base hover:bg-brand-300 transition-colors shadow-xl shadow-brand-400/20"
                  >
                    {ui.ctaBtn} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl text-base hover:bg-white/20 transition-colors"
                  >
                    {ui.consult}
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
