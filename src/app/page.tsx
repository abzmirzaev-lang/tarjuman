'use client'
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
    city: 'Медина, Саудовская Аравия 🇸🇦',
  },
  {
    photo: 'https://images.unsplash.com/photo-1724191078796-8a997b989f43?w=1800&q=90',
    label: 'Зелёный купол Мечети Пророка',
    city: 'Медина, Саудовская Аравия 🇸🇦',
  },
  {
    photo: 'https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=1800&q=90',
    label: 'Эр-Рияд ночью',
    city: 'Эр-Рияд, Саудовская Аравия 🇸🇦',
  },
  {
    photo: 'https://images.unsplash.com/photo-1770685798053-c7b282cc3188?w=1800&q=90',
    label: 'Эр-Рияд на закате',
    city: 'Эр-Рияд, Саудовская Аравия 🇸🇦',
  },
  {
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1800&q=90',
    label: 'Дубай',
    city: 'Дубай, ОАЭ 🇦🇪',
  },
]

export default function HomePage() {
  const [lang, setLang] = useState<AppLanguage>('ru')
  const [slide, setSlide] = useState(0)
  const t = translations[lang]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(s => (s + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">

        {/* ── Slideshow background ── */}
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
                {/* Ken Burns zoom effect */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: 7, ease: 'easeInOut' }}
                >
                  <img
                    src={s.photo}
                    alt={s.label}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75 z-10" />
          {/* Bottom fade to white for transition to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent z-10" />
        </div>

        {/* ── Content ── */}
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

            {/* Stats */}
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

        {/* ── Slide indicators + location ── */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-3">
          {/* Location label */}
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

          {/* Dots */}
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

      {/* ── COUNTRIES ── */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3">{t.countries.title}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {([
              { code: 'SA', emoji: '🇸🇦', name: t.countries.sa, desc: t.countries.saDesc, href: '/universities?country=SA' },
              { code: 'AE', emoji: '🇦🇪', name: t.countries.ae, desc: t.countries.aeDesc, href: '/universities?country=AE' },
            ] as const).map((c) => (
              <Link key={c.code} href={c.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card-hover p-8 flex flex-col gap-4"
                >
                  <span className="text-4xl">{c.emoji}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-2">{c.name}</h3>
                    <p className="text-muted text-sm leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-brand-500 text-sm font-medium mt-auto">
                    {lang === 'ru' ? 'Смотреть университеты' : lang === 'uz' ? 'Universitetlarni ko\'rish' : 'View universities'}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
              {lang === 'ru' ? 'Что мы делаем' : 'What we do'}
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
                  ? ['Профессиональный перевод', 'Арабский и английский', 'Срок 2–5 дней']
                  : ['Professional translation', 'Arabic & English', '2–5 days'],
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
                {/* Subtle bg glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${s.gradient}`} />

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-5 shadow-lg ${s.shadow}`}>
                  <s.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>

                <h3 className="text-lg font-bold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-5">{s.desc}</p>

                {/* Feature points */}
                <ul className="space-y-2">
                  {s.points.map((p, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-ink/80">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0`}>
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-sm font-medium mb-4">
              {lang === 'ru' ? '3 простых шага' : lang === 'uz' ? '3 ta oddiy qadam' : '3 simple steps'}
            </span>
            <h2 className="text-3xl font-bold text-ink mb-3">
              {lang === 'ru' ? 'Как это работает' : lang === 'uz' ? 'Bu qanday ishlaydi' : 'How It Works'}
            </h2>
            <p className="text-muted max-w-md mx-auto">
              {lang === 'ru'
                ? 'От заявки до поступления — всё под ключ'
                : lang === 'uz'
                ? 'Arizadan qabulga qadar — kalit ostida'
                : 'From application to enrollment — turnkey'}
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 z-0" />

            <div className="grid sm:grid-cols-3 gap-8 relative z-10">
              {([
                {
                  n: '01',
                  icon: FileText,
                  gradient: 'from-blue-500 to-brand-500',
                  title: lang === 'ru' ? 'Заполни анкету' : lang === 'uz' ? 'Anketani to\'ldiring' : 'Fill the Form',
                  desc: lang === 'ru'
                    ? 'Укажите свои данные, выберите страну и университет. Займёт не больше 10 минут'
                    : lang === 'uz'
                    ? 'Ma\'lumotlaringizni kiriting, mamlakat va universitetni tanlang. 10 daqiqadan ko\'p vaqt ketmaydi'
                    : 'Enter your details, choose country and university. Takes less than 10 minutes',
                },
                {
                  n: '02',
                  icon: Zap,
                  gradient: 'from-brand-500 to-purple-500',
                  title: lang === 'ru' ? 'Оплати пакет' : lang === 'uz' ? 'Paketni to\'lang' : 'Pay for Package',
                  desc: lang === 'ru'
                    ? 'Выберите удобный тариф и оплатите онлайн. Принимаем карты и переводы'
                    : lang === 'uz'
                    ? 'Qulay tarifni tanlang va onlayn to\'lang. Kartalar va o\'tkazmalarni qabul qilamiz'
                    : 'Choose a plan and pay online. We accept cards and transfers',
                },
                {
                  n: '03',
                  icon: CheckCircle2,
                  gradient: 'from-purple-500 to-emerald-500',
                  title: lang === 'ru' ? 'Получи документы и поступление' : lang === 'uz' ? 'Hujjatlar va qabulni oling' : 'Get Docs & Enrollment',
                  desc: lang === 'ru'
                    ? 'Мы переведём все документы и подадим заявку в университет — вы получите зачисление'
                    : lang === 'uz'
                    ? 'Biz barcha hujjatlarni tarjimon qilamiz va universitetga ariza topshiramiz — siz qabul olasiz'
                    : 'We translate all documents and submit to university — you get enrolled',
                },
              ] as const).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <step.icon className="w-9 h-9 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-brand-400 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-brand-600">{step.n}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-ink mb-3">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-xs">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA under steps */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-14 text-center"
          >
            <Link href="/apply">
              <Button variant="primary" size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>
                {t.hero.cta}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <ReviewsSection lang={lang} />

      {/* ── CTA BANNER ── */}
      <section className="section bg-ink">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {lang === 'ru' ? 'Готовы начать?' : lang === 'uz' ? 'Boshlashga tayyormisiz?' : 'Ready to Start?'}
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            {lang === 'ru'
              ? 'Заполните заявку за 10 минут и наш менеджер свяжется с вами в течение 24 часов'
              : lang === 'uz'
              ? '10 daqiqada ariza to\'ldiring va menejerimiz 24 soat ichida siz bilan bog\'lanadi'
              : 'Fill the application in 10 minutes and our manager will contact you within 24 hours'}
          </p>
          <Link href="/apply">
            <Button variant="primary" size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>
              {t.hero.cta}
            </Button>
          </Link>
        </div>
      </section>

      <Footer lang={lang} />
    </>
  )
}
