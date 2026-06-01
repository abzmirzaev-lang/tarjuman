'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Clock, CheckCircle, ArrowRight, Star, Globe, BookOpen, Zap } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import type { AppLanguage } from '@/types'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

const STATS = [
  { n: '41',   label_ru: 'Студентов успешно подали',  label_en: 'Students applied' },
  { n: '6ч',    label_ru: 'Минимальный срок подачи',      label_en: 'Min. submission time' },
  { n: '100%',  label_ru: 'Документы с первого раза',     label_en: 'Docs correct first try' },
  { n: '2',     label_ru: 'Страны: КСА и ОАЭ',            label_en: 'Countries: KSA & UAE' },
]

const VALUES = [
  {
    icon: Zap,
    title_ru: 'Скорость',
    body_ru: 'VIP-заявки обрабатываем за 6 часов, стандартные — за 24. Каждая минута на счету.',
    title_en: 'Speed',
    body_en: 'VIP applications processed in 6 hours, standard in 24. Every minute counts.',
  },
  {
    icon: CheckCircle,
    title_ru: 'Точность',
    body_ru: 'Документы переводятся и оформляются правильно с первого раза — знаем требования каждого университета.',
    title_en: 'Precision',
    body_en: "Documents translated and formatted correctly on the first try — we know every university's requirements.",
  },
  {
    icon: Globe,
    title_ru: 'Прозрачность',
    body_ru: 'Личный кабинет с историей каждого шага. Никаких сюрпризов — только чёткий процесс.',
    title_en: 'Transparency',
    body_en: 'Personal dashboard with full history of every step. No surprises — just a clear process.',
  },
  {
    icon: Star,
    title_ru: 'Внимание',
    body_ru: 'Каждый студент важен. Мы только начинаем — и именно поэтому вы получаете максимум заботы.',
    title_en: 'Dedication',
    body_en: 'Every student matters. We\'re just starting — which is exactly why you get our full attention.',
  },
]

const STEPS = [
  {
    num: '01',
    title_ru: 'Опыт изнутри',
    body_ru: 'Наша команда сама прошла путь поступления в арабские университеты. Мы знаем каждый подводный камень — и обходим их за вас.',
  },
  {
    num: '02',
    title_ru: 'Сервис, который нужен',
    body_ru: 'Мы создали то, что хотели иметь сами: без лишних ожиданий, ошибок в документах и непонятных задержек.',
  },
  {
    num: '03',
    title_ru: 'Всегда на связи',
    body_ru: 'После подачи сопровождаем до получения оффера. Уведомления в Telegram при каждом обновлении статуса.',
  },
]

export default function AboutPage() {
  const [lang, setLang] = useLanguage()
  const isRu = lang === 'ru'

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="bg-[#1B4332] pt-16">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-32 text-center">
          <motion.p
            {...fadeUp(0)}
            className="text-[#D4A943] text-xs font-semibold uppercase tracking-[0.2em] mb-5"
          >
            {isRu ? 'О нас' : 'About us'}
          </motion.p>
          <motion.h1
            {...fadeUp(0.08)}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            {isRu
              ? <>Мы открываем<br className="hidden sm:block" /> двери в арабские<br className="hidden sm:block" /> университеты</>
              : <>Opening doors to<br className="hidden sm:block" /> Arab universities</>
            }
          </motion.h1>
          <motion.p
            {...fadeUp(0.16)}
            className="text-white/60 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {isRu
              ? 'TARJUMAN — сервис полного сопровождения для студентов, которые хотят учиться в Саудовской Аравии и ОАЭ. Берём на себя всё: документы, переводы, подачу.'
              : 'TARJUMAN is a full-service platform for students aiming to study in Saudi Arabia and the UAE. We handle everything: documents, translations, submission.'}
          </motion.p>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-ink mb-1">{s.n}</p>
                <p className="text-xs text-muted">{isRu ? s.label_ru : s.label_en}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section className="section bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 {...fadeUp(0)} className="text-3xl sm:text-4xl font-bold text-ink mb-3">
              {isRu ? 'Наши ценности' : 'Our values'}
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)} className="card p-6">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-semibold text-ink mb-2">{isRu ? v.title_ru : v.title_en}</h3>
                <p className="text-sm text-muted leading-relaxed">{isRu ? v.body_ru : v.body_en}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 {...fadeUp(0)} className="text-3xl sm:text-4xl font-bold text-ink mb-3">
              {isRu ? 'Почему мы?' : 'Why us?'}
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="card p-6">
                <span className="text-3xl font-bold text-brand-400 mb-4 block">{s.num}</span>
                <h3 className="font-semibold text-ink mb-2">{s.title_ru}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.body_ru}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="section bg-ink text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2 {...fadeUp(0)} className="text-3xl sm:text-5xl font-bold mb-4">
            {isRu ? 'Готовы начать?' : 'Ready to start?'}
          </motion.h2>
          <motion.p {...fadeUp(0.08)} className="text-white/60 text-lg mb-8">
            {isRu
              ? 'Подайте заявку сегодня — мы возьмём всё в свои руки.'
              : 'Apply today — we\'ll take care of everything.'}
          </motion.p>
          <motion.div {...fadeUp(0.16)}>
            <Link href="/apply">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-brand-400 text-ink font-bold rounded-2xl text-base hover:bg-brand-300 transition-colors">
                {isRu ? 'Подать заявку' : 'Apply now'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer lang={lang} />
    </>
  )
}
