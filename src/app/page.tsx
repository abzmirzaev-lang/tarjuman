'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Star, Globe2, FileText,
  Send, Zap, Shield, Clock, Award, ChevronRight,
  Languages, Plane, HeartHandshake, Gauge, Check,
  BadgeCheck, SearchCheck, LifeBuoy, GraduationCap,
  TrendingUp, Users, Building2, ThumbsUp
} from 'lucide-react'
import { useInView } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui'
import ReviewsSection from '@/components/ReviewsSection'
import type { AppLanguage } from '@/types'
import { translations } from '@/i18n'

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return { count, ref }
}

const HERO_SLIDES = [
  {
    photo: 'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=1200&q=80',
    label: 'Мечеть Пророка — Медина',
    city: 'Медина, Саудовская Аравия',
  },
  {
    photo: 'https://images.unsplash.com/photo-1724191078796-8a997b989f43?w=1200&q=80',
    label: 'Зелёный купол Мечети Пророка',
    city: 'Медина, Саудовская Аравия',
  },
  {
    photo: 'https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=1200&q=80',
    label: 'Эр-Рияд ночью',
    city: 'Эр-Рияд, Саудовская Аравия',
  },
  {
    photo: 'https://images.unsplash.com/photo-1770685798053-c7b282cc3188?w=1200&q=80',
    label: 'Эр-Рияд на закате',
    city: 'Эр-Рияд, Саудовская Аравия',
  },
  {
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',
    label: 'Дубай',
    city: 'Дубай, ОАЭ',
  },
  {
    photo: 'https://www.arabnews.com/sites/default/files/styles/n_670_395/public/main-image/2023/10/04/4033656-719443225.jpeg?itok=SLiYubit',
    label: 'Университет имама Мухаммада ибн Сауда',
    city: 'Эр-Рияд, Саудовская Аравия',
  },
]

/* ─── STATS ─────────────────────────────────────────────────────────────── */
function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(target)
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-black text-ink mb-1 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted font-medium">{label}</div>
    </div>
  )
}

function StatsSection({ lang }: { lang: AppLanguage }) {
  const stats =
    lang === 'ru' ? [
      { target: 120, suffix: '+', label: 'Заявок обработано' },
      { target: 85,  suffix: '+', label: 'Студентов зачислено' },
      { target: 12,  suffix: '+', label: 'Университетов-партнёров' },
    ] : lang === 'uz' ? [
      { target: 120, suffix: '+', label: 'Ariza ko\'rib chiqildi' },
      { target: 85,  suffix: '+', label: 'Talaba qabul qilindi' },
      { target: 12,  suffix: '+', label: 'Hamkor universitetlar' },
    ] : [
      { target: 120, suffix: '+', label: 'Applications processed' },
      { target: 85,  suffix: '+', label: 'Students enrolled' },
      { target: 12,  suffix: '+', label: 'Partner universities' },
    ]

  return (
    <section className="py-16 bg-white border-y border-border">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6 sm:gap-10 divide-x divide-border"
        >
          {stats.map((s, i) => (
            <StatItem key={i} {...s} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─── BENEFITS ───────────────────────────────────────────────────────────── */
function BenefitsSection({ lang }: { lang: AppLanguage }) {
  const title =
    lang === 'ru' ? 'Наши преимущества'
    : lang === 'uz' ? 'Bizning afzalliklarimiz'
    : 'Our advantages'

  const sub =
    lang === 'ru' ? 'Мы берём на себя весь процесс — от перевода до зачисления'
    : lang === 'uz' ? 'Biz butun jarayonni o\'z zimmamizga olamiz — tarjimadan qabulga qadar'
    : 'We handle the entire process — from translation to enrollment'

  const items =
    lang === 'ru' ? [
      { icon: BadgeCheck,  title: 'Официальный перевод документов',       desc: 'Все переводы заверены и приняты университетами Саудовской Аравии и ОАЭ.' },
      { icon: SearchCheck, title: 'Проверка документов перед подачей',     desc: 'Каждый документ проходит проверку на соответствие требованиям вуза.' },
      { icon: LifeBuoy,    title: 'Поддержка на каждом этапе',            desc: 'Персональный менеджер сопровождает вас от заявки до получения визы.' },
      { icon: GraduationCap, title: 'Помощь с университетами СА и ОАЭ',  desc: 'Прямое взаимодействие с приёмными комиссиями ведущих арабских вузов.' },
    ] : lang === 'uz' ? [
      { icon: BadgeCheck,  title: 'Rasmiy hujjat tarjimasi',              desc: 'Barcha tarjimalar Saudiya Arabistoni va BAA universitetlari tomonidan qabul qilinadi.' },
      { icon: SearchCheck, title: 'Topshirishdan oldin hujjatlarni tekshirish', desc: 'Har bir hujjat universitet talablariga muvofiqligini tekshiradi.' },
      { icon: LifeBuoy,    title: 'Har bosqichda yordam',                 desc: 'Shaxsiy menejer arizadan vizaga qadar siz bilan birga.' },
      { icon: GraduationCap, title: 'SA va BAA universitetlariga yordam', desc: 'Yetakchi arab universitetlarining qabul komissiyalari bilan to\'g\'ridan-to\'g\'ri aloqa.' },
    ] : [
      { icon: BadgeCheck,  title: 'Official document translation',         desc: 'All translations are certified and accepted by universities in Saudi Arabia and UAE.' },
      { icon: SearchCheck, title: 'Document review before submission',     desc: 'Every document is checked against the university requirements.' },
      { icon: LifeBuoy,    title: 'Support at every step',                desc: 'A personal manager accompanies you from application to visa.' },
      { icon: GraduationCap, title: 'Help with SA & UAE universities',    desc: 'Direct communication with admissions offices of leading Arab universities.' },
    ]

  return (
    <section className="section bg-[#F7F8FA]">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
            {lang === 'ru' ? 'Преимущества' : lang === 'uz' ? 'Afzalliklar' : 'Benefits'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-3">{title}</h2>
          <p className="text-muted max-w-md mx-auto text-sm">{sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-5 bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── WHY US ─────────────────────────────────────────────────────────────── */
function WhyUsSection({ lang }: { lang: AppLanguage }) {
  const title =
    lang === 'ru' ? 'Почему выбирают Tarjuman Edu'
    : lang === 'uz' ? 'Nega Tarjuman Edu tanlashadi'
    : 'Why students choose Tarjuman Edu'

  const points =
    lang === 'ru' ? [
      { icon: TrendingUp,  title: 'Высокий процент зачисления',  desc: 'Более 95% наших клиентов успешно поступают в выбранный университет.' },
      { icon: Clock,       title: 'Быстрая обработка',           desc: 'Минимальный срок подачи — 6 часов. VIP-пакет приоритизируется немедленно.' },
      { icon: Shield,      title: 'Безопасность данных',         desc: 'Все документы хранятся на защищённых серверах и передаются только в университет.' },
      { icon: Users,       title: 'Команда профессионалов',      desc: 'Арабисты, переводчики и юристы с опытом в образовательной сфере.' },
      { icon: Building2,   title: 'Проверенные партнёры',        desc: 'Работаем только с аккредитованными университетами Саудовской Аравии и ОАЭ.' },
      { icon: ThumbsUp,    title: 'Гарантия возврата',           desc: 'Если документы не приняты по нашей вине — возвращаем деньги.' },
    ] : lang === 'uz' ? [
      { icon: TrendingUp,  title: 'Yuqori qabul foizi',          desc: 'Mijozlarimizning 95% dan ko\'prog\'i tanlagan universitetiga muvaffaqiyatli qabul bo\'ladi.' },
      { icon: Clock,       title: 'Tez ishlov berish',           desc: 'Minimal topshirish muddati — 6 soat. VIP paket darhol ustuvorlik qilinadi.' },
      { icon: Shield,      title: 'Ma\'lumotlar xavfsizligi',    desc: 'Barcha hujjatlar himoyalangan serverlarda saqlanadi va faqat universitetga uzatiladi.' },
      { icon: Users,       title: 'Mutaxassislar jamoasi',       desc: 'Ta\'lim sohasida tajribali arabshunoslar, tarjimonlar va yuristlar.' },
      { icon: Building2,   title: 'Ishonchli hamkorlar',         desc: 'Faqat Saudiya Arabistoni va BAA ning akkreditatsiyalangan universitetlari bilan ishlaymiz.' },
      { icon: ThumbsUp,    title: 'Qaytarish kafolati',          desc: 'Agar hujjatlar bizning aybimiz bilan qabul qilinmasa — pulni qaytaramiz.' },
    ] : [
      { icon: TrendingUp,  title: 'High enrollment rate',        desc: 'Over 95% of our clients are successfully admitted to their chosen university.' },
      { icon: Clock,       title: 'Fast processing',             desc: 'Minimum submission time — 6 hours. VIP package is prioritized immediately.' },
      { icon: Shield,      title: 'Data security',               desc: 'All documents are stored on secure servers and transmitted only to the university.' },
      { icon: Users,       title: 'Team of professionals',       desc: 'Arabists, translators and lawyers with experience in the educational field.' },
      { icon: Building2,   title: 'Verified partners',           desc: 'We work only with accredited universities in Saudi Arabia and UAE.' },
      { icon: ThumbsUp,    title: 'Refund guarantee',            desc: 'If documents are not accepted due to our fault — we refund your money.' },
    ]

  return (
    <section className="section bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-brand-800/10 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-narrow relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">
            {lang === 'ru' ? 'Почему мы' : lang === 'uz' ? 'Nega biz' : 'Why us'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h2>
          <p className="text-white/50 max-w-md mx-auto text-sm">
            {lang === 'ru' ? 'Мы не просто переводим документы — мы открываем двери к лучшему образованию'
              : lang === 'uz' ? 'Biz shunchaki hujjatlarni tarjima qilmaymiz — yaxshiroq ta\'limga eshiklar ochamiz'
              : "We don't just translate documents — we open doors to better education"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-400/30 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-400/15 flex items-center justify-center mb-4 group-hover:bg-brand-400/25 transition-colors">
                <p.icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-bold text-white mb-2 text-sm leading-snug">{p.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── HOME PAGE ──────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [lang, setLang] = useLanguage()
  const [slide, setSlide] = useState(0)
  const [submittedCount, setSubmittedCount] = useState<number | null>(null)
  const t = translations[lang]

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(s => (s + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setSubmittedCount(d.submitted))
      .catch(() => setSubmittedCount(41))
  }, [])

  const steps = lang === 'ru' ? [
    { n: '01', icon: FileText,    title: 'Подайте заявку',       desc: 'Заполните форму за 5 минут' },
    { n: '02', icon: Send,        title: 'Оплатите тариф',       desc: 'Карта, крипта или Telegram' },
    { n: '03', icon: Zap,         title: 'Мы делаем всё',        desc: 'Перевод, подача, отслеживание' },
    { n: '04', icon: Award,       title: 'Получите зачисление',  desc: 'Официальное письмо от вуза' },
  ] : lang === 'uz' ? [
    { n: '01', icon: FileText,    title: 'Ariza bering',          desc: '5 daqiqada shaklni to\'ldiring' },
    { n: '02', icon: Send,        title: 'Tarifni to\'lang',       desc: 'Karta, kripto yoki Telegram' },
    { n: '03', icon: Zap,         title: 'Biz hamma narsani qilamiz', desc: 'Tarjima, topshirish, kuzatuv' },
    { n: '04', icon: Award,       title: 'Qabul xatini oling',    desc: 'Universitetdan rasmiy xat' },
  ] : [
    { n: '01', icon: FileText,    title: 'Submit application',   desc: 'Fill the form in 5 minutes' },
    { n: '02', icon: Send,        title: 'Pay for the plan',     desc: 'Card, crypto or Telegram' },
    { n: '03', icon: Zap,         title: 'We do everything',     desc: 'Translation, filing, tracking' },
    { n: '04', icon: Award,       title: 'Get your admission',   desc: 'Official letter from the university' },
  ]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* HERO */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">

        {/* Background slideshow */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="sync">
            {HERO_SLIDES.map((s, i) => i === slide && (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.06 }}
                  transition={{ duration: 8, ease: 'easeInOut' }}
                >
                  <img src={s.photo} alt={s.label} className="w-full h-full object-cover" />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Premium layered overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20 z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface to-transparent z-10" />
        </div>

        {/* Content */}
        <div className="container-narrow relative z-20 w-full px-4 pt-32 pb-28 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.10 }}
            className="flex flex-col items-center"
          >

            {/* Social proof pill */}
            <motion.div variants={fadeUp} className="mb-7">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <div className="flex -space-x-2">
                  {['🇺🇿','🇰🇿','🇹🇯','🇰🇬'].map((f, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs">{f}</div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-brand-400 text-brand-400" />
                  ))}
                </div>
                <span className="text-white/90 text-xs font-medium">
                  {lang === 'ru' ? '120+ студентов поступили' : lang === 'uz' ? "120+ talaba qabul bo'ldi" : '120+ students enrolled'}
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-5 leading-[1.08] tracking-tight max-w-4xl"
              style={{ textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}
            >
              {lang === 'ru' ? (
                <>Поступление в университеты<br /><span className="text-brand-400">Саудовской Аравии и ОАЭ</span></>
              ) : lang === 'uz' ? (
                <>Saudiya Arabistoni va BAA<br /><span className="text-brand-400">universitetlariga qabul</span></>
              ) : (
                <>University admissions in<br /><span className="text-brand-400">Saudi Arabia & UAE</span></>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-white/75 max-w-xl mx-auto mb-9 leading-relaxed"
            >
              {lang === 'ru'
                ? 'Перевод документов, проверка пакета и сопровождение при подаче заявки.'
                : lang === 'uz'
                ? "Hujjatlarni tarjima qilish, paketni tekshirish va ariza topshirishda hamrohlik."
                : 'Document translation, package review and guidance through the application process.'}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/apply">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-4 bg-brand-400 text-ink font-bold text-base rounded-2xl shadow-xl shadow-brand-400/30 hover:bg-brand-300 transition-colors"
                >
                  {lang === 'ru' ? 'Подать заявку' : lang === 'uz' ? 'Ariza berish' : 'Apply now'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold text-base rounded-2xl hover:bg-white/20 transition-colors"
                >
                  {lang === 'ru' ? 'Бесплатная консультация' : lang === 'uz' ? "Bepul maslahat" : 'Free consultation'}
                </motion.button>
              </Link>
            </motion.div>

            {/* Feature pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-14">
              {(lang === 'ru'
                ? ['✓ Официальный перевод', '✓ Проверка документов', '✓ Поддержка 24/7', '✓ Без скрытых комиссий']
                : lang === 'uz'
                ? ["✓ Rasmiy tarjima", "✓ Hujjatlarni tekshirish", "✓ 24/7 yordam", "✓ Yashirin to'lovlarsiz"]
                : ['✓ Official translation', '✓ Document review', '✓ 24/7 support', '✓ No hidden fees']
              ).map((pill, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-white/80 text-xs font-medium">
                  {pill}
                </span>
              ))}
            </motion.div>

            {/* Stats bar */}
            <motion.div
              variants={fadeUp}
              className="w-full max-w-lg grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden backdrop-blur-md border border-white/15"
            >
              {[
                { val: '120+', label: lang === 'ru' ? 'Заявок' : lang === 'uz' ? 'Ariza' : 'Applications' },
                { val: '6 ч',  label: lang === 'ru' ? 'Мин. срок подачи' : lang === 'uz' ? 'Min. muddat' : 'Min. turnaround' },
                { val: '95%',  label: lang === 'ru' ? 'Успешных подач' : lang === 'uz' ? 'Muvaffaqiyat' : 'Success rate' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center py-4 px-2 bg-black/20">
                  <span className="text-2xl font-black text-white">{s.val}</span>
                  <span className="text-white/50 text-[11px] mt-0.5 text-center">{s.label}</span>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>

        {/* Slide indicator */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-white/60 text-xs bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              {HERO_SLIDES[slide].city}
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="relative h-[3px] rounded-full transition-all duration-500 overflow-hidden"
                style={{ width: i === slide ? 28 : 12, background: 'rgba(255,255,255,0.25)' }}
              >
                {i === slide && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section className="section bg-[#F7F8FA]">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
              {lang === 'ru' ? 'Направления' : lang === 'uz' ? "Yo'nalishlar" : 'Destinations'}
            </span>
            <h2 className="text-3xl font-bold text-ink mb-2">{t.countries.title}</h2>
            <p className="text-muted text-sm">{lang === 'ru' ? 'Выберите страну и начните путь к поступлению' : lang === 'uz' ? "Mamlakat tanlang va qabul yo'lini boshlang" : 'Choose a country and start your admission journey'}</p>
          </div>

          {/* Top row: SA + AE large cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {([
              { iso: 'sa', code: 'SA', name: t.countries.sa, desc: t.countries.saDesc, href: '/universities?country=SA',
                photo: 'https://images.unsplash.com/photo-1586715065342-98d1f6016fd1?w=600&q=75' },
              { iso: 'ae', code: 'AE', name: t.countries.ae, desc: t.countries.aeDesc, href: '/universities?country=AE',
                photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=75' },
            ] as { iso: string; code: string; name: string; desc: string; href: string; photo: string }[]).map((c) => (
              <Link key={c.code} href={c.href}>
                <motion.div whileHover={{ y: -3 }} className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-400 h-56">
                  <img src={c.photo} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <span className="w-9 h-6 rounded-md overflow-hidden shadow-lg inline-flex ring-1 ring-white/30">
                        <img src={`https://flagcdn.com/w40/${c.iso}.png`} alt={c.name} className="w-full h-full object-cover" />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">{c.name}</h3>
                      <p className="text-white/75 text-xs leading-relaxed mb-3">{c.desc}</p>
                      <span className="inline-flex items-center gap-1 text-white text-xs font-semibold bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full group-hover:bg-white/25 transition-colors">
                        {lang === 'ru' ? 'Смотреть университеты' : lang === 'uz' ? "Universitetlar" : 'View universities'}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Bottom row: QA + KW + TR smaller cards */}
          <div className="grid grid-cols-3 gap-4">
            {([
              { iso: 'qa', code: 'QA', name: t.countries.qa, desc: t.countries.qaDesc, href: '/apply',
                photo: 'https://images.unsplash.com/photo-1647252262017-582a7dbb73d0?w=600&q=85' },
              { iso: 'kw', code: 'KW', name: t.countries.kw, desc: t.countries.kwDesc, href: '/apply',
                photo: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=600&q=85' },
              { iso: 'tr', code: 'TR', name: t.countries.tr, desc: t.countries.trDesc, href: '/apply',
                photo: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=85' },
            ] as { iso: string; code: string; name: string; desc: string; href: string; photo: string }[]).map((c) => (
              <Link key={c.code} href={c.href}>
                <motion.div whileHover={{ y: -3 }} className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 h-40">
                  <img src={c.photo} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <span className="w-7 h-5 rounded overflow-hidden shadow-md inline-flex ring-1 ring-white/30">
                        <img src={`https://flagcdn.com/w40/${c.iso}.png`} alt={c.name} className="w-full h-full object-cover" />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm leading-tight mb-1 drop-shadow">{c.name}</h3>
                      <span className="inline-flex items-center gap-0.5 text-white/80 text-[10px] font-medium">
                        {lang === 'ru' ? 'Подать заявку' : lang === 'uz' ? "Ariza" : 'Apply'}
                        <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
              {lang === 'ru' ? 'Что мы делаем' : lang === 'uz' ? 'Biz nima qilamiz' : 'What we do'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-3">{t.services.title}</h2>
            <p className="text-muted max-w-md mx-auto">{t.services.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Languages,
                gradient: 'from-blue-500 to-cyan-400',
                shadow: 'shadow-blue-200',
                bg: 'bg-blue-50',
                title: t.services.s1title,
                desc: t.services.s1desc,
                points: lang === 'ru'
                  ? ['Профессиональный перевод', 'Арабский и английский', 'Срок 1–3 дня']
                  : lang === 'uz'
                  ? ['Professional tarjima', 'Arab va ingliz tili', 'Muddat 1–3 kun']
                  : ['Professional translation', 'Arabic & English', '1–3 days'],
              },
              {
                icon: Plane,
                gradient: 'from-brand-500 to-emerald-400',
                shadow: 'shadow-brand-200',
                bg: 'bg-brand-50',
                title: t.services.s2title,
                desc: t.services.s2desc,
                points: lang === 'ru'
                  ? ['Все подходящие университеты', 'Отслеживание онлайн', 'Уведомления в Telegram']
                  : lang === 'uz'
                  ? ['Barcha mos universitetlar', 'Onlayn kuzatuv', 'Telegram xabarnomalar']
                  : ['All eligible universities', 'Online tracking', 'Telegram notifications'],
              },
              {
                icon: HeartHandshake,
                gradient: 'from-violet-500 to-purple-400',
                shadow: 'shadow-violet-200',
                bg: 'bg-violet-50',
                title: t.services.s3title,
                desc: t.services.s3desc,
                points: lang === 'ru'
                  ? ['Личный менеджер', 'Поддержка 24/7', 'От заявки до визы']
                  : lang === 'uz'
                  ? ['Shaxsiy menejer', "24/7 qo'llab-quvvatlash", 'Arizadan vizagacha']
                  : ['Personal manager', '24/7 support', 'From application to visa'],
              },
              {
                icon: Gauge,
                gradient: 'from-amber-500 to-orange-400',
                shadow: 'shadow-amber-200',
                bg: 'bg-amber-50',
                title: t.services.s4title,
                desc: t.services.s4desc,
                points: lang === 'ru'
                  ? ['Приоритетная обработка', 'Ответ за 1–3 дня', 'VIP сопровождение']
                  : lang === 'uz'
                  ? ['Ustuvor qayta ishlash', '1–3 kun ichida javob', 'VIP hamrohlik']
                  : ['Priority processing', 'Response in 1–3 days', 'VIP support'],
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative bg-white rounded-2xl border border-border p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-5 shadow-sm ${s.shadow}`}>
                  <s.icon className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{s.title}</h3>
                <p className="text-muted text-sm mb-4 leading-relaxed">{s.desc}</p>
                <ul className="space-y-1.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs text-muted">
                      <Check className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatsSection lang={lang} />

      {/* BENEFITS */}
      <BenefitsSection lang={lang} />

      {/* WHY US */}
      <WhyUsSection lang={lang} />

      {/* HOW IT WORKS */}
      <section className="section bg-ink text-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">
              {lang === 'ru' ? 'Процесс' : lang === 'uz' ? 'Jarayon' : 'Process'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              {lang === 'ru' ? 'Как это работает' : lang === 'uz' ? 'Bu qanday ishlaydi' : 'How it works'}
            </h2>
            <p className="text-white/60 max-w-md mx-auto text-sm">
              {lang === 'ru' ? '4 шага до вашего университета мечты' : lang === 'uz' ? "Orzu qilgan universitetingizgacha 4 qadam" : '4 steps to your dream university'}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl font-black text-white/10 mb-4">{s.n}</div>
                <div className="w-10 h-10 rounded-xl bg-brand-400/20 flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-bold text-white mb-1">{s.title}</h3>
                <p className="text-white/50 text-sm">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 text-white/20 text-lg">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection lang={lang} />

      {/* PRICING PREVIEW */}
      <section className="section bg-surface">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
            {lang === 'ru' ? 'Тарифы' : lang === 'uz' ? 'Tariflar' : 'Pricing'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
            {lang === 'ru' ? 'Простые и прозрачные цены' : lang === 'uz' ? "Oddiy va shaffof narxlar" : 'Simple, transparent pricing'}
          </h2>
          <p className="text-muted mb-10 max-w-md mx-auto text-sm">
            {lang === 'ru' ? 'Без скрытых платежей. Платите один раз — мы делаем всё остальное.'
              : lang === 'uz' ? "Yashirin to'lovlarsiz. Bir marta to'lang — biz qolganini qilamiz."
              : 'No hidden fees. Pay once — we handle everything.'}
          </p>
          <Link href="/pricing">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              {lang === 'ru' ? 'Смотреть тарифы' : lang === 'uz' ? 'Tariflarni ko\'rish' : 'View pricing'}
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-ink text-white p-10 sm:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {lang === 'ru' ? 'Готовы начать?' : lang === 'uz' ? "Boshlashga tayyormisiz?" : 'Ready to start?'}
              </h2>
              <p className="text-white/60 mb-8 text-base max-w-md mx-auto">
                {lang === 'ru' ? 'Подайте заявку прямо сейчас — это займёт всего 5 минут'
                  : lang === 'uz' ? "Hoziroq ariza bering — bu atigi 5 daqiqa oladi"
                  : 'Apply right now — it takes just 5 minutes'}
              </p>
              <Link href="/apply">
                <Button variant="primary" size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>
                  {lang === 'ru' ? 'Подать заявку' : lang === 'uz' ? "Ariza topshirish" : 'Apply now'}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer lang={lang} />
    </>
  )
}
