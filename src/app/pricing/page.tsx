'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PACKAGES } from '@/types'
import type { AppLanguage, ServicePackage } from '@/types'
import { translations } from '@/i18n'
import { cn } from '@/lib/utils'

const PLAN_FEATURES: Record<ServicePackage, { ru: string[]; en: string[]; uz: string[] }> = {
  SUBMISSION: {
    ru: [
      'Подача готовых документов',
      'Онлайн-трекинг статуса',
      'Уведомления в Telegram',
      'Ответ в течение 48 часов',
    ],
    uz: [
      'Tayyor hujjatlarni topshirish',
      'Onlayn holat kuzatuvi',
      'Telegram bildirishnomalar',
      '48 soat ichida javob',
    ],
    en: [
      'Submission of ready documents',
      'Online status tracking',
      'Telegram notifications',
      'Reply within 48 hours',
    ],
  },
  STANDARD: {
    ru: [
      'Перевод документов на арабский',
      'Подача в течение 24 часов',
      'Онлайн-трекинг статуса',
      'Уведомления в Telegram',
      'Поддержка после зачисления',
    ],
    uz: [
      'Hujjatlarni arabchaga tarjima',
      '24 soat ichida topshirish',
      'Onlayn holat kuzatuvi',
      'Telegram bildirishnomalar',
      'Qabul qilingandan keyin yordam',
    ],
    en: [
      'Arabic document translation',
      'Submission within 24 hours',
      'Online status tracking',
      'Telegram notifications',
      'Post-enrollment support',
    ],
  },
  VIP: {
    ru: [
      'Перевод документов на арабский',
      'Подача в течение 6 часов',
      'Приоритетная обработка',
      'Персональный менеджер',
      'Безлимитный чат с менеджером',
      'Поддержка после зачисления',
    ],
    uz: [
      'Hujjatlarni arabchaga tarjima',
      '6 soat ichida topshirish',
      'Ustuvor ko\'rib chiqish',
      'Shaxsiy menejer',
      'Cheksiz chat',
      'Qabul qilingandan keyin yordam',
    ],
    en: [
      'Arabic document translation',
      'Submission within 6 hours',
      'Priority processing',
      'Personal manager',
      'Unlimited chat with manager',
      'Post-enrollment support',
    ],
  },
}

const PLANS: { key: ServicePackage; hero: boolean }[] = [
  { key: 'SUBMISSION', hero: false },
  { key: 'STANDARD',   hero: true  },
  { key: 'VIP',        hero: false },
]

export default function PricingPage() {
  const [lang, setLang] = useState<AppLanguage>('ru')
  const t = translations[lang]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── Hero ── */}
      <section className="bg-[#0F172A] pt-16">
        <div className="container-narrow py-20 md:py-28 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#C9922A] text-[10px] font-bold tracking-[8px] uppercase mb-6"
          >
            {lang === 'ru' ? 'ТАРИФЫ' : lang === 'uz' ? 'TARIFLAR' : 'PRICING'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
            style={{ whiteSpace: 'pre-line' }}
          >
            {lang === 'ru'
              ? 'Простой выбор.\nПрофессиональный результат.'
              : lang === 'uz'
              ? 'Oddiy tanlov.\nProfessional natija.'
              : 'Simple choice.\nProfessional result.'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm sm:text-base tracking-wide"
          >
            {lang === 'ru'
              ? 'Три пакета. Полная прозрачность. Никаких скрытых платежей.'
              : lang === 'uz'
              ? 'Uch paket. To\'liq shaffoflik. Hech qanday yashirin to\'lovlar.'
              : 'Three packages. Full transparency. No hidden fees.'}
          </motion.p>
        </div>
      </section>

      {/* ── Cards ── */}
      <section className="bg-[#0F172A]">
        <div className="container-narrow pb-0">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {PLANS.map(({ key, hero }, i) => {
              const pkg  = PACKAGES[key]
              const feat = PLAN_FEATURES[key][lang]
              const name = lang === 'ru' ? pkg.name_ru : lang === 'uz' ? pkg.name_uz : pkg.name_en

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'relative flex flex-col px-8 py-10 md:px-10 md:py-12',
                    hero ? 'bg-[#1B4332]' : 'bg-[#131f2e]'
                  )}
                >
                  {/* Gold top bar on hero card */}
                  {hero && (
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#C9922A] to-[#D4A943]" />
                  )}

                  {/* Badge */}
                  {hero && (
                    <div className="mb-6">
                      <span className="text-[9px] font-black tracking-[5px] uppercase text-[#D4A943] bg-[#C9922A]/15 px-3 py-1.5 rounded-sm">
                        {lang === 'ru' ? 'ПОПУЛЯРНЫЙ' : lang === 'uz' ? 'MASHHUR' : 'POPULAR'}
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <p className={cn(
                    'text-[10px] font-bold tracking-[5px] uppercase mb-4',
                    hero ? 'text-white/50' : 'text-white/30'
                  )}>
                    {name}
                  </p>

                  {/* Price */}
                  <div className="flex items-start gap-1 mb-2">
                    <span className={cn(
                      'text-xl font-bold mt-3',
                      hero ? 'text-[#D4A943]' : 'text-white/40'
                    )}>$</span>
                    <span className={cn(
                      'text-[80px] md:text-[88px] font-black leading-none tracking-tighter',
                      hero ? 'text-white' : 'text-white/90'
                    )}>
                      {pkg.priceUSD}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/25 tracking-widest uppercase mb-8">
                    {lang === 'ru' ? 'единоразово' : lang === 'uz' ? 'bir martalik' : 'one-time'}
                  </p>

                  {/* Divider */}
                  <div className={cn('h-px mb-8', hero ? 'bg-white/10' : 'bg-white/5')} />

                  {/* Features */}
                  <ul className="flex flex-col gap-3.5 mb-10 flex-1">
                    {feat.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div className={cn(
                          'w-[18px] h-[18px] rounded-full flex items-center justify-center mt-0.5 shrink-0',
                          hero ? 'bg-[#C9922A]/25' : 'bg-white/8'
                        )}>
                          <Check className={cn(
                            'w-2.5 h-2.5',
                            hero ? 'text-[#D4A943]' : 'text-white/50'
                          )} />
                        </div>
                        <span className={cn(
                          'text-sm leading-relaxed',
                          hero ? 'text-white/80' : 'text-white/50'
                        )}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={`/apply?package=${key}`} className="block">
                    <button className={cn(
                      'w-full py-4 text-[11px] font-black tracking-[4px] uppercase',
                      'flex items-center justify-center gap-2 transition-all duration-200',
                      hero
                        ? 'bg-[#C9922A] text-white hover:bg-[#D4A943]'
                        : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white border border-white/10'
                    )}>
                      {lang === 'ru' ? 'ВЫБРАТЬ' : lang === 'uz' ? 'TANLASH' : 'CHOOSE'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-[#0A1020] border-t border-white/5 py-12">
        <div className="container-narrow">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { n: '26+',  label: lang === 'ru' ? 'УНИВЕРСИТЕТОВ' : 'UNIVERSITIES' },
              { n: '100%', label: lang === 'ru' ? 'С ПЕРВОГО РАЗА' : 'FIRST TRY' },
              { n: '6 ч',  label: lang === 'ru' ? 'МИНИМАЛЬНЫЙ СРОК' : 'MIN TURNAROUND' },
            ].map(s => (
              <div key={s.n}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">{s.n}</div>
                <div className="text-[9px] text-white/25 tracking-[3px] uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ teaser ── */}
      <div className="bg-[#0F172A] border-t border-white/5 py-10 text-center">
        <p className="text-white/30 text-sm">
          {lang === 'ru' ? 'Есть вопросы? ' : lang === 'uz' ? 'Savollar bormi? ' : 'Have questions? '}
          <Link href="/faq" className="text-[#C9922A] hover:text-[#D4A943] transition-colors">FAQ</Link>
          <span className="mx-2 opacity-30">·</span>
          <a href="https://t.me/tarjumanuz" className="text-[#C9922A] hover:text-[#D4A943] transition-colors">Telegram</a>
        </p>
      </div>

      <Footer lang={lang} />
    </>
  )
}
