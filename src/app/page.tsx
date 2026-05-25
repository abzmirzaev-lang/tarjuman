'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Star, Globe2, FileText,
  Send, Zap, Shield, Clock, Award, ChevronRight
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

export default function HomePage() {
  const [lang, setLang] = useState<AppLanguage>('ru')
  const t = translations[lang]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-surface pt-16">
        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100 rounded-full blur-[120px] opacity-40 -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-200 rounded-full blur-[100px] opacity-30 translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="container-narrow relative z-10 text-center py-20">
          <motion.div
            initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-sm font-medium">
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="page-title text-ink mb-6 text-balance"
              style={{ whiteSpace: 'pre-line' }}
            >
              {t.hero.title}
            </motion.h1>

            <motion.p variants={fadeUp} className="page-subtitle max-w-2xl mx-auto mb-10 text-balance">
              {t.hero.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/apply">
                <Button variant="primary" size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>
                  {t.hero.cta}
                </Button>
              </Link>
              <Link href="/universities">
                <Button variant="secondary" size="xl">
                  {t.hero.ctaSecondary}
                </Button>
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
                  <div className="text-2xl font-bold text-ink">{val}</div>
                  <div className="text-xs text-muted mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
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
      <section className="section bg-surface">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3">{t.services.title}</h2>
            <p className="text-muted">{t.services.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: t.services.s1title, desc: t.services.s1desc,  color: 'bg-blue-50 text-blue-600'   },
              { icon: Send,     title: t.services.s2title, desc: t.services.s2desc,  color: 'bg-brand-50 text-brand-600' },
              { icon: Shield,   title: t.services.s3title, desc: t.services.s3desc,  color: 'bg-purple-50 text-purple-600' },
              { icon: Zap,      title: t.services.s4title, desc: t.services.s4desc,  color: 'bg-amber-50 text-amber-600' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-ink mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
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
