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
  const [lang, setLang] = useState<AppLanguage>('ru')
  const t = translations[lang]

  const steps = lang === 'ru' ? [
    { n: '01', title: 'Выберите тариф',      desc: 'Оплата онлайн — карта, Apple Pay или через Telegram' },
    { n: '02', title: 'Загрузите документы', desc: 'Паспорт, диплом, фото — прямо в личном кабинете' },
    { n: '03', title: 'Мы всё сделаем',      desc: 'Переводим, заполняем, подаём — вы получаете оффер' },
  ] : lang === 'uz' ? [
    { n: '01', title: 'Tarifni tanlang',        desc: 'Onlayn to\'lov — karta, Apple Pay yoki Telegram' },
    { n: '02', title: 'Hujjatlarni yuklang',    desc: 'Pasport, diplom, foto — shaxsiy kabinetda' },
    { n: '03', title: 'Biz hammасini qilamiz',  desc: 'Tarjima, to\'ldirish, topshirish — siz taklif olasiz' },
  ] : [
    { n: '01', title: 'Choose your plan',    desc: 'Pay online — card, Apple Pay or Telegram' },
    { n: '02', title: 'Upload your docs',    desc: 'Passport, diploma, photo — directly in your cabinet' },
    { n: '03', title: 'We handle the rest',  desc: 'We translate, fill and submit — you get the offer' },
  ]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="bg-surface pt-16 border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[10px] font-black tracking-[7px] uppercase text-[#C9922A] mb-5"
          >
            {lang === 'ru' ? 'ТАРИФЫ' : lang === 'uz' ? 'TARIFLAR' : 'PRICING'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-[68px] font-black text-ink leading-[1.05] tracking-tight mb-5"
            style={{ whiteSpace: 'pre-line' }}
          >
            {lang === 'ru'  ? 'Простой выбор.\nПрофессиональный результат.'
            : lang === 'uz' ? 'Oddiy tanlov.\nProfessional natija.'
            :                 'Simple choice.\nProfessional result.'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-muted text-xs tracking-[3px] uppercase"
          >
            {lang === 'ru'  ? 'Три пакета · Полная прозрачность · Без скрытых платежей'
            : lang === 'uz' ? 'Uch paket · To\'liq shaffoflik · Yashirin to\'lovlar yo\'q'
            :                 'Three packages · Full transparency · No hidden fees'}
          </motion.p>
        </div>
      </section>

      {/* ── Cards ─────────────────────────────────────── */}
      <section className="bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-[1fr_1.2fr_1fr] gap-4 md:gap-0 md:border md:border-border items-stretch">
            {PLANS.map(({ key, hero }, i) => {
              const pkg   = PACKAGES[key]
              const feats = FEATURES[key][lang]
              const name  = lang === 'ru' ? pkg.name_ru : lang === 'uz' ? pkg.name_uz : pkg.name_en

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'relative flex flex-col',
                    hero
                      ? 'bg-[#1B4332] px-8 py-12 md:px-10 md:py-14 md:-my-px md:shadow-2xl md:z-10'
                      : 'bg-white px-7 py-10 md:px-9 md:py-12 border border-border md:border-0'
                  )}
                >
                  {/* Gold accent top */}
                  {hero && <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#C9922A] via-[#D4A943] to-[#C9922A]" />}

                  {/* Badge */}
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
                    hero ? 'text-white/40' : 'text-muted'
                  )}>
                    {name}
                  </p>

                  {/* Price */}
                  <div className="flex items-start gap-1 mb-1">
                    <span className={cn('font-bold mt-2', hero ? 'text-[#D4A943] text-xl' : 'text-muted text-lg')}>$</span>
                    <span className={cn(
                      'font-black leading-none tracking-tighter',
                      hero ? 'text-[88px] md:text-[96px] text-white' : 'text-[72px] md:text-[80px] text-ink'
                    )}>
                      {pkg.priceUSD}
                    </span>
                  </div>
                  <p className={cn('text-[10px] tracking-[3px] uppercase mb-8', hero ? 'text-white/30' : 'text-muted/60')}>
                    {lang === 'ru' ? 'единоразово' : lang === 'uz' ? 'bir martalik' : 'one-time'}
                  </p>

                  {/* Divider */}
                  <div className={cn('h-px mb-8', hero ? 'bg-white/10' : 'bg-border')} />

                  {/* Features */}
                  <ul className="flex flex-col gap-3.5 mb-10 flex-1">
                    {feats.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3">
                        <div className={cn(
                          'w-[18px] h-[18px] rounded-full flex items-center justify-center mt-0.5 shrink-0',
                          hero ? 'bg-[#C9922A]/20' : 'bg-brand-50'
                        )}>
                          <Check className={cn('w-2.5 h-2.5', hero ? 'text-[#D4A943]' : 'text-brand-500')} />
                        </div>
                        <span className={cn('text-sm leading-relaxed', hero ? 'text-white/80' : 'text-muted')}>
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
                        : 'bg-ink hover:bg-ink/80 text-white'
                    )}>
                      {lang === 'ru' ? 'ВЫБРАТЬ' : lang === 'uz' ? 'TANLASH' : 'CHOOSE'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Guarantee */}
          <div className="flex items-center gap-4 mt-5 px-6 py-4 bg-brand-50 border border-brand-200 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-brand-500 shrink-0" />
            <p className="text-sm text-muted">
              <span className="text-ink font-bold">
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
      <section className="bg-white border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-[10px] font-black tracking-[7px] uppercase text-[#C9922A] text-center mb-12">
            {lang === 'ru' ? 'ЧТО ВКЛЮЧЕНО' : lang === 'uz' ? 'NIMA KIRITILGAN' : "WHAT'S INCLUDED"}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 pr-6 text-[10px] font-bold tracking-[3px] uppercase text-muted/60 w-[44%]">
                    {lang === 'ru' ? 'Возможность' : lang === 'uz' ? 'Xususiyat' : 'Feature'}
                  </th>
                  {PLANS.map(({ key, hero }) => (
                    <th key={key} className={cn(
                      'text-center py-4 px-4 text-[10px] font-bold tracking-[3px] uppercase',
                      hero ? 'text-[#1B4332]' : 'text-muted'
                    )}>
                      {lang === 'ru' ? PACKAGES[key].name_ru : lang === 'uz' ? PACKAGES[key].name_uz : PACKAGES[key].name_en}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, ri) => (
                  <tr key={ri} className="border-b border-border/50 hover:bg-surface transition-colors">
                    <td className="py-4 pr-6 text-sm text-muted">
                      {lang === 'ru' ? row.ru : lang === 'uz' ? row.uz : row.en}
                    </td>
                    <td className="text-center py-4 px-4"><CellIcon value={row.basic}    isHero={false} /></td>
                    <td className="text-center py-4 px-4 bg-brand-50/50"><CellIcon value={row.standard} isHero={true}  /></td>
                    <td className="text-center py-4 px-4"><CellIcon value={row.vip}      isHero={false} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────── */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-[10px] font-black tracking-[7px] uppercase text-[#C9922A] text-center mb-14">
            {lang === 'ru' ? 'КАК ЭТО РАБОТАЕТ' : lang === 'uz' ? 'QANDAY ISHLAYDI' : 'HOW IT WORKS'}
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-border">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-surface px-8 py-10 text-center"
              >
                <p className="text-[10px] font-black tracking-[5px] text-[#C9922A] mb-5">{s.n}</p>
                <p className="text-ink font-bold text-base mb-3">{s.title}</p>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="bg-[#1B4332]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-3 gap-px bg-white/10">
            {[
              { n: '26+',  label: lang === 'ru' ? 'УНИВЕРСИТЕТОВ'    : 'UNIVERSITIES'   },
              { n: '100%', label: lang === 'ru' ? 'С ПЕРВОГО РАЗА'   : 'FIRST TRY'      },
              { n: '6 ч',  label: lang === 'ru' ? 'МИНИМАЛЬНЫЙ СРОК' : 'MIN TURNAROUND' },
            ].map(s => (
              <div key={s.n} className="bg-[#1B4332] py-10 text-center">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{s.n}</div>
                <div className="text-[9px] tracking-[3px] uppercase text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <div className="bg-white border-t border-border py-10 text-center">
        <p className="text-muted text-sm">
          {lang === 'ru' ? 'Есть вопросы? ' : lang === 'uz' ? 'Savollar bormi? ' : 'Have questions? '}
          <Link href="/faq" className="text-brand-500 hover:underline">FAQ</Link>
          <span className="mx-3 text-border">·</span>
          <a href="https://t.me/tarjumanuz" className="text-brand-500 hover:underline">Telegram</a>
        </p>
      </div>

      <Footer lang={lang} />
    </>
  )
}
