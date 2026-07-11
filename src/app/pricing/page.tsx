'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useStudentCount } from '@/hooks/useStudentCount'
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
  const studentCount = useStudentCount()

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
    social:  tr({ ru: `${studentCount} студентов уже подали заявку`, en: `${studentCount} students already applied`, uz: `${studentCount} talaba ariza topshirdi` }),
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
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white/10 border border-white/15 rounded-full text-sm">
                <div className="flex -space-x-1.5">
                  {['uz','kz','tj','kg'].map((code, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white/40 overflow-hidden shadow-sm">
                      <img src={`https://flagcdn.com/w40/${code}.png`} alt="" className="w-full h-full object-cover" />
                    </div>
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
                      <div className="inline-flex items-center gap-1 bg-brand-400 text-ink text-[11px] font-black uppercase tracking-widest px-5 py-1.5 rounded-b-2xl shadow-lg">
                        <Zap className="w-3 h-3" /> {ui.popular}
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

                    {key === 'SUBMISSION' && (
                      <p className={cn('text-xs mt-0.5', popular ? 'text-white/40' : 'text-muted')}>
                        {tr({ ru: 'Вы переводите сами', en: 'You translate yourself', uz: 'O\'zingiz tarjima qilasiz' })}
                      </p>
                    )}

                    {/* Feature list */}
                    <ul className="mt-6 space-y-2.5">
                      {feats.map((f, fi) => {
                        const FIcon = f.icon
                        return (
                          <li key={fi} className="flex items-start gap-2.5">
                            <div className={cn('w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5', popular ? 'bg-brand-400/20' : 'bg-brand-50')}>
                              <FIcon className={cn('w-3 h-3', popular ? 'text-brand-400' : 'text-brand-600')} />
                            </div>
                            <span className={cn('text-sm leading-snug', popular ? 'text-white/80' : 'text-ink/70')}>
                              {L === 'ru' ? f.ru : L === 'uz' ? f.uz : f.en}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className={cn('p-6 mt-auto', popular ? 'bg-ink border-t border-white/10' : 'bg-white border-t border-border')}>
                    <Link href={`/apply?package=${key}`}>
                      <button className={cn(
                        'w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 active:scale-[0.98]',
                        popular
                          ? 'bg-brand-400 text-ink hover:bg-brand-300'
                          : 'bg-ink text-white hover:bg-ink/80'
                      )}>
                        {ui.apply} <ArrowRight className="inline w-4 h-4 ml-1" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* ── COMPARISON TABLE ───────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <button
              onClick={() => setTableOpen(o => !o)}
              className="w-full flex items-center justify-between px-6 py-5 hover:bg-surface transition-colors"
            >
              <span className="font-bold text-ink">{tableOpen ? ui.hideCompare : ui.compare}</span>
              {tableOpen ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
            </button>

            {tableOpen && (
              <div className="overflow-x-auto border-t border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface">
                      <th className="text-left px-6 py-3.5 font-semibold text-muted w-1/2">{ui.tableHead}</th>
                      {PLANS.map(({ key, popular }) => (
                        <th key={key} className={cn('px-4 py-3.5 text-center font-bold text-xs uppercase tracking-wider', popular ? 'text-brand-600' : 'text-muted')}>
                          {planName(key)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {FEATURES.map((feat, fi) => (
                      <tr key={fi} className={feat.highlight ? 'bg-brand-50/40' : 'hover:bg-surface/50'}>
                        <td className="px-6 py-3.5 font-medium text-ink flex items-center gap-2">
                          <feat.icon className="w-4 h-4 text-muted flex-shrink-0" />
                          {L === 'ru' ? feat.ru : L === 'uz' ? feat.uz : feat.en}
                        </td>
                        {PLANS.map(({ key, popular }) => (
                          <td key={key} className="px-4 py-3.5 text-center">
                            <Cell value={feat[({ SUBMISSION: 'basic', STANDARD: 'standard', VIP: 'vip' } as const)[key as 'SUBMISSION' | 'STANDARD' | 'VIP']]} isPopular={popular} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── TRUST STRIP ────────────────────────────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted">
            {[ShieldCheck, Zap, Star].map((Icon, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-brand-500" />
                <span>{[
                  tr({ ru: 'Безопасная оплата', en: 'Secure payment', uz: "Xavfsiz to'lov" }),
                  tr({ ru: 'Быстрая обработка', en: 'Fast processing', uz: 'Tez ishlov' }),
                  tr({ ru: `${studentCount} студентов уже подали`, en: `${studentCount} students already applied`, uz: `${studentCount} talaba ariza topshirdi` }),
                ][i]}</span>
              </div>
            ))}
          </div>

          {/* ── CTA ────────────────────────────────────────────────────────── */}
          <div className="bg-ink rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-transparent to-violet-900/20 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-black mb-3">{ui.ctaTitle}</h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">{ui.ctaSub}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/apply">
                  <button className="px-8 py-3.5 bg-brand-400 text-ink font-bold rounded-2xl hover:bg-brand-300 transition-colors active:scale-[0.98]">
                    {ui.ctaBtn} <ArrowRight className="inline w-4 h-4 ml-1" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-colors">
                    {ui.consult}
                  </button>
                </Link>
              </div>
              <p className="mt-6 text-white/30 text-xs">{ui.notSure} <Link href="/contact" className="underline hover:text-white/60">{ui.consult.toLowerCase()}</Link></p>
              <p className="mt-3 text-white/20 text-xs max-w-md mx-auto">
                {tr({ ru: 'Tarjuman Edu оказывает консультационные, переводческие и организационные услуги. Решение о зачислении принимается университетом.', en: 'Tarjuman Edu provides consulting, translation and organizational services. Admission decisions are made by the university.', uz: 'Tarjuman Edu konsultatsiya, tarjima va tashkiliy xizmatlar ko\'rsatadi. Qabul qarori universitet tomonidan qabul qilinadi.' })}
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
