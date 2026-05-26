'use client'
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

// ── Enriched feature lists ─────────────────────────────
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

// ── Comparison table rows ──────────────────────────────
type Cell = true | false | string
const TABLE_ROWS: { ru: string; en: string; uz: string; basic: Cell; standard: Cell; vip: Cell }[] = [
  { ru: 'Подача документов',          uz: 'Hujjat topshirish',         en: 'Document submission',      basic: true,  standard: true,  vip: true  },
  { ru: 'Перевод на арабский',        uz: 'Arabchaga tarjima',         en: 'Arabic translation',       basic: false, standard: true,  vip: true  },
  { ru: 'Срок подачи',                uz: 'Topshirish muddati',        en: 'Submission time',          basic: '48 ч',standard: '24 ч',vip: '6 ч' },
  { ru: 'Онлайн-трекинг',             uz: 'Onlayn kuzatuv',           en: 'Online tracking',          basic: true,  standard: true,  vip: true  },
  { ru: 'Telegram-уведомления',       uz: 'Telegram bildirish',       en: 'Telegram notifications',   basic: true,  standard: true,  vip: true  },
  { ru: 'Поддержка после зачисления', uz: 'Qabul keyin yordam',       en: 'Post-enrollment support',  basic: false, standard: true,  vip: true  },
  { ru: 'Персональный менеджер',      uz: 'Shaxsiy menejer',          en: 'Personal manager',         basic: false, standard: false, vip: true  },
  { ru: 'Безлимитный чат',            uz: 'Cheksiz chat',             en: 'Unlimited chat',           basic: false, standard: false, vip: true  },
]

function CellIcon({ value, isHero }: { value: Cell; isHero: boolean }) {
  if (value === true)  return <Check className={cn('w-4 h-4 mx-auto', isHero ? 'text-[#4ade80]' : 'text-[#4ade80]/70')} />
  if (value === false) return <span className="text-white/15 text-lg leading-none">—</span>
  return <span className={cn('text-[11px] font-bold tracking-wider', isHero ? 'text-[#D4A943]' : 'text-white/40')}>{value}</span>
}

const PLANS: { key: ServicePackage; hero: boolean }[] = [
  { key: 'SUBMISSION', hero: false },
  { key: 'STANDARD',   hero: true  },
  { key: 'VIP',        hero: false },
]

export default function PricingPage() {
  const [lang, setLang] = useState<AppLanguage>('ru')
  const t = translations[lang]

  const steps = lang === 'ru' ? [
    { n: '01', title: 'Выберите тариф',      desc: 'Оплата онлайн — карта, Apple Pay или Telegram' },
    { n: '02', title: 'Загрузите документы', desc: 'Паспорт, диплом, фото — прямо в личном кабинете' },
    { n: '03', title: 'Мы всё сделаем',      desc: 'Переводим, заполняем, подаём — вы получаете оффер' },
  ] : lang === 'uz' ? [
    { n: '01', title: 'Tarifni tanlang',       desc: 'Onlayn to\'lov — karta, Apple Pay yoki Telegram' },
    { n: '02', title: 'Hujjatlarni yuklang',  desc: 'Pasport, diplom, foto — shaxsiy kabinetda' },
    { n: '03', title: 'Biz hammасini qilamiz', desc: 'Tarjima, to\'ldirish, topshirish — siz taklif olasiz' },
  ] : [
    { n: '01', title: 'Choose your plan',    desc: 'Pay online — card, Apple Pay or Telegram' },
    { n: '02', title: 'Upload your docs',    desc: 'Passport, diploma, photo — directly in your cabinet' },
    { n: '03', title: 'We handle the rest',  desc: 'We translate, fill and submit — you get the offer' },
  ]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="bg-[#080d14] pt-16">
        <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[#C9922A] text-[10px] font-black tracking-[8px] uppercase mb-7"
          >
            {lang === 'ru' ? 'ТАРИФЫ' : lang === 'uz' ? 'TARIFLAR' : 'PRICING'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-[72px] font-black text-white leading-[1.05] tracking-tight mb-6"
            style={{ whiteSpace: 'pre-line' }}
          >
            {lang === 'ru'  ? 'Простой выбор.\nПрофессиональный\nрезультат.'
            : lang === 'uz' ? 'Oddiy tanlov.\nProfessional\nnatija.'
            :                 'Simple choice.\nProfessional\nresult.'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-white/30 text-xs tracking-[3px] uppercase"
          >
            {lang === 'ru'  ? 'Три пакета · Полная прозрачность · Без скрытых платежей'
            : lang === 'uz' ? 'Uch paket · To\'liq shaffoflik · Yashirin to\'lovlar yo\'q'
            :                 'Three packages · Full transparency · No hidden fees'}
          </motion.p>
        </div>
      </section>

      {/* ── Cards ─────────────────────────────────────── */}
      <section className="bg-[#080d14]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-[1fr_1.22fr_1fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.07]"
               style={{ background: 'rgba(255,255,255,0.04)' }}>
            {PLANS.map(({ key, hero }, i) => {
              const pkg   = PACKAGES[key]
              const feats = FEATURES[key][lang]
              const name  = lang === 'ru' ? pkg.name_ru : lang === 'uz' ? pkg.name_uz : pkg.name_en

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'relative flex flex-col',
                    hero ? 'bg-[#1B4332] px-8 py-12 md:px-10 md:py-14' : 'bg-[#131f2e] px-7 py-10 md:px-9 md:py-12'
                  )}
                >
                  {/* Gold top bar on hero */}
                  {hero && <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#C9922A] via-[#D4A943] to-[#C9922A]" />}

                  {/* Popular badge */}
                  {hero && (
                    <div className="mb-7">
                      <span className="text-[9px] font-black tracking-[5px] uppercase text-[#D4A943] bg-[#C9922A]/15 px-3 py-1.5">
                        {lang === 'ru' ? 'ПОПУЛЯРНЫЙ' : lang === 'uz' ? 'MASHHUR' : 'POPULAR'}
                      </span>
                    </div>
                  )}

                  {/* Name */}
                  <p className={cn(
                    'text-[9px] font-bold tracking-[5px] uppercase mb-4',
                    hero ? 'text-white/40' : 'text-white/20'
                  )}>
                    {name}
                  </p>

                  {/* Price */}
                  <div className="flex items-start gap-1 mb-1">
                    <span className={cn('font-bold mt-2', hero ? 'text-[#D4A943] text-xl' : 'text-white/25 text-lg')}>$</span>
                    <span className={cn(
                      'font-black leading-none tracking-tighter',
                      hero ? 'text-[88px] md:text-[96px] text-white' : 'text-[72px] md:text-[80px] text-white/80'
                    )}>
                      {pkg.priceUSD}
                    </span>
                  </div>
                  <p className={cn('text-[10px] tracking-[3px] uppercase mb-8', hero ? 'text-white/25' : 'text-white/15')}>
                    {lang === 'ru' ? 'единоразово' : lang === 'uz' ? 'bir martalik' : 'one-time'}
                  </p>

                  {/* Divider */}
                  <div className={cn('h-px mb-8', hero ? 'bg-white/10' : 'bg-white/5')} />

                  {/* Features */}
                  <ul className="flex flex-col gap-3.5 mb-10 flex-1">
                    {feats.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div className={cn(
                          'w-[18px] h-[18px] rounded-full flex items-center justify-center mt-0.5 shrink-0',
                          hero ? 'bg-[#C9922A]/20' : 'bg-white/6'
                        )}>
                          <Check className={cn('w-2.5 h-2.5', hero ? 'text-[#D4A943]' : 'text-white/35')} />
                        </div>
                        <span className={cn('text-sm leading-relaxed', hero ? 'text-white/80' : 'text-white/40')}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={`/apply?package=${key}`} className="block">
                    <button className={cn(
                      'w-full py-4 text-[10px] font-black tracking-[4px] uppercase',
                      'flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]',
                      hero
                        ? 'bg-[#C9922A] hover:bg-[#D4A943] text-white'
                        : 'bg-white/6 hover:bg-white/12 text-white/50 hover:text-white/80 border border-white/8'
                    )}>
                      {lang === 'ru' ? 'ВЫБРАТЬ' : lang === 'uz' ? 'TANLASH' : 'CHOOSE'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Guarantee strip */}
          <div className="flex items-center gap-4 px-6 py-5 bg-[#1B4332]/30 border border-[#C9922A]/20 border-t-0">
            <ShieldCheck className="w-5 h-5 text-[#C9922A] shrink-0" />
            <p className="text-sm text-white/50">
              <span className="text-white font-bold">
                {lang === 'ru' ? 'Гарантия результата.' : lang === 'uz' ? 'Natija kafolati.' : 'Result guarantee.'}
              </span>{' '}
              {lang === 'ru'
                ? 'Если отказ произошёл по нашей ошибке — подаём повторно бесплатно.'
                : lang === 'uz'
                ? 'Bizning xatoimiz tufayli rad etilsa — qayta bepul topshiramiz.'
                : 'If rejection was our fault — we resubmit for free.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────── */}
      <section className="bg-[#080d14] border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-24">
          <p className="text-[#C9922A] text-[10px] font-black tracking-[7px] uppercase text-center mb-14">
            {lang === 'ru' ? 'ЧТО ВКЛЮЧЕНО' : lang === 'uz' ? 'NIMA KIRITILGAN' : 'WHAT\'S INCLUDED'}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left py-4 pr-6 text-[10px] font-bold tracking-[3px] uppercase text-white/20 w-[42%]">
                    {lang === 'ru' ? 'Возможность' : lang === 'uz' ? 'Xususiyat' : 'Feature'}
                  </th>
                  {PLANS.map(({ key, hero }) => (
                    <th key={key} className={cn(
                      'text-center py-4 px-4 text-[10px] font-bold tracking-[3px] uppercase',
                      hero ? 'text-[#D4A943]' : 'text-white/25'
                    )}>
                      {lang === 'ru'  ? PACKAGES[key].name_ru
                      : lang === 'uz' ? PACKAGES[key].name_uz
                      :                 PACKAGES[key].name_en}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, ri) => (
                  <tr key={ri} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                    <td className="py-4 pr-6 text-sm text-white/45">
                      {lang === 'ru' ? row.ru : lang === 'uz' ? row.uz : row.en}
                    </td>
                    <td className="text-center py-4 px-4">
                      <CellIcon value={row.basic}    isHero={false} />
                    </td>
                    <td className="text-center py-4 px-4 bg-[#1B4332]/15">
                      <CellIcon value={row.standard} isHero={true}  />
                    </td>
                    <td className="text-center py-4 px-4">
                      <CellIcon value={row.vip}      isHero={false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────── */}
      <section className="bg-[#0F172A] border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-24">
          <p className="text-[#C9922A] text-[10px] font-black tracking-[7px] uppercase text-center mb-16">
            {lang === 'ru' ? 'КАК ЭТО РАБОТАЕТ' : lang === 'uz' ? 'QANDAY ISHLAYDI' : 'HOW IT WORKS'}
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-[#0F172A] px-8 py-10 text-center"
              >
                <p className="text-[10px] font-black tracking-[5px] text-[#C9922A] mb-5">{s.n}</p>
                <p className="text-white font-bold text-base mb-3">{s.title}</p>
                <p className="text-white/30 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="bg-[#080d14] border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
            {[
              { n: '26+',  label: lang === 'ru' ? 'УНИВЕРСИТЕТОВ'    : 'UNIVERSITIES'    },
              { n: '100%', label: lang === 'ru' ? 'С ПЕРВОГО РАЗА'   : 'FIRST TRY'       },
              { n: '6 ч',  label: lang === 'ru' ? 'МИНИМАЛЬНЫЙ СРОК' : 'MIN TURNAROUND'  },
            ].map(s => (
              <div key={s.n} className="bg-[#080d14] py-10 text-center">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{s.n}</div>
                <div className="text-[9px] tracking-[3px] uppercase text-white/20">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ / CTA ─────────────────────────────────── */}
      <div className="bg-[#080d14] border-t border-white/[0.05] py-10 text-center">
        <p className="text-white/25 text-sm">
          {lang === 'ru' ? 'Есть вопросы? ' : lang === 'uz' ? 'Savollar bormi? ' : 'Have questions? '}
          <Link href="/faq" className="text-[#C9922A] hover:text-[#D4A943] transition-colors">FAQ</Link>
          <span className="mx-3 opacity-20">·</span>
          <a href="https://t.me/tarjumanuz" className="text-[#C9922A] hover:text-[#D4A943] transition-colors">Telegram</a>
        </p>
      </div>

      <Footer lang={lang} />
    </>
  )
}
