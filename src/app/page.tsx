'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Star, Globe2, FileText,
  Send, Zap, Shield, Clock, Award, ChevronRight,
  Languages, Plane, HeartHandshake, Gauge, Check
} from 'lucide-react'
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

const HERO_SLIDES = [
  {
    photo: 'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=1800&q=90',
    label: 'Мечеть Пророка — Медина',
    city: 'Медина, Саудовская Аравия',
  },
  {
    photo: 'https://images.unsplash.com/photo-1724191078796-8a997b989f43?w=1800&q=90',
    label: 'Зелёный купол Мечети Пророка',
    city: 'Медина, Саудовская Аравия',
  },
  {
    photo: 'https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=1800&q=90',
    label: 'Эр-Рияд ночью',
    city: 'Эр-Рияд, Саудовская Аравия',
  },
  {
    photo: 'https://images.unsplash.com/photo-1770685798053-c7b282cc3188?w=1800&q=90',
    label: 'Эр-Рияд на закате',
    city: 'Эр-Рияд, Саудовская Аравия',
  },
  {
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1800&q=90',
    label: 'Дубай',
    city: 'Дубай, ОАЭ',
  },
]

export default function HomePage() {
  const [lang, setLang] = useLanguage()
  const [slide, setSlide] = useState(0)
  const t = translations[lang]

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(s => (s + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
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
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="sync">
            {HERO_SLIDES.map((s, i) => i === slide && (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: 7, ease: 'easeInOut' }}
                >
                  <img src={s.photo} alt={s.label} className="w-full h-full object-cover" />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75 z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent z-10" />
        </div>

        <div className="container-narrow relative z-20 text-center py-28 pt-36">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>

            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium">
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight text-balance"
              style={{ whiteSpace: 'pre-line', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
            >
              {t.hero.title}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
              {t.hero.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/apply">
                <Button variant="primary" size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>
                  {t.hero.cta}
                </Button>
              </Link>
              <Link href="/universities">
                <button className="btn btn-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20">
                  {t.hero.ctaSecondary}
                </button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                [t.hero.stat1, t.hero.stat1l],
                [t.hero.stat2, t.hero.stat2l],
                [t.hero.stat3, t.hero.stat3l],
              ].map(([val, label], i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{val}</div>
                  <div className="text-xs text-white/60 mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-white/70 text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              {HERO_SLIDES[slide].city}
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="relative h-1 rounded-full transition-all duration-500 overflow-hidden"
                style={{ width: i === slide ? 32 : 16, background: 'rgba(255,255,255,0.3)' }}
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
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3">{t.countries.title}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {([
              { code: 'SA', name: t.countries.sa, desc: t.countries.saDesc, href: '/universities?country=SA' },
              { code: 'AE', name: t.countries.ae, desc: t.countries.aeDesc, href: '/universities?country=AE' },
            ] as const).map((c) => (
              <Link key={c.code} href={c.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card-hover p-8 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
                    <span className="text-sm font-bold text-brand-600">{c.code}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-2">{c.name}</h3>
                    <p className="text-muted text-sm leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-brand-500 text-sm font-medium mt-auto">
                    {lang === 'ru' ? 'Смотреть университеты' : lang === 'uz' ? "Universitetlarni ko'rish" : 'View universities'}
                    <ChevronRight className="w-4 h-4" />
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
                  {t.hero.cta}
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
