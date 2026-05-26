'use client'
import { useState } from 'react'
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
  { n: '28+',   label_ru: 'Студентов успешно поступили',  label_en: 'Students admitted' },
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
  const [lang, setLang] = useState<AppLanguage>('ru')
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
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-18">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.07)}
                className="bg-white px-6 py-10 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#1B4332] mb-2 tabular-nums">{s.n}</div>
                <div className="text-xs text-muted leading-snug">
                  {isRu ? s.label_ru : s.label_en}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ─────────────────────────────────────────── */}
      <section className="bg-surface py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Left — heading */}
            <motion.div {...fadeUp(0)}>
              <p className="text-[#D4A943] text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                {isRu ? 'Наша история' : 'Our story'}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight mb-6">
                {isRu
                  ? 'Мы прошли этот путь сами'
                  : 'We walked this path ourselves'}
              </h2>
              <p className="text-muted text-base leading-relaxed">
                {isRu
                  ? 'Команда TARJUMAN — люди, которые сами поступали в арабские университеты. Мы знаем каждый подводный камень, каждое требование и каждый срок. Поэтому и создали сервис, который хотели бы иметь тогда — без лишних ожиданий, без ошибок, с полной прозрачностью.'
                  : 'The TARJUMAN team are people who went through Arab university admissions themselves. We know every pitfall, requirement, and deadline — which is why we built the service we wish we had: no unnecessary waiting, no errors, full transparency.'}
              </p>
            </motion.div>

            {/* Right — steps */}
            <div className="space-y-8">
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(0.1 + i * 0.1)}
                  className="flex gap-5"
                >
                  <div className="text-3xl font-bold text-[#D4A943]/40 w-10 shrink-0 leading-none mt-1 tabular-nums">
                    {s.num}
                  </div>
                  <div>
                    <div className="font-semibold text-ink mb-1">{s.title_ru}</div>
                    <div className="text-sm text-muted leading-relaxed">{s.body_ru}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="text-[#D4A943] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              {isRu ? 'Наши принципы' : 'Our principles'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink">
              {isRu ? 'Почему выбирают нас' : 'Why students choose us'}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                {...fadeUp(0.05 + i * 0.07)}
                className="group rounded-2xl border border-border bg-surface p-7 hover:border-[#1B4332]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1B4332]/8 flex items-center justify-center mb-5">
                  <v.icon className="w-5 h-5 text-[#1B4332]" />
                </div>
                <div className="font-semibold text-ink mb-2">
                  {isRu ? v.title_ru : v.title_en}
                </div>
                <div className="text-sm text-muted leading-relaxed">
                  {isRu ? v.body_ru : v.body_en}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION STRIP ─────────────────────────────────── */}
      <section className="bg-[#1B4332] py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.p
            {...fadeUp(0)}
            className="text-[#D4A943] text-xs font-semibold uppercase tracking-[0.18em] mb-5"
          >
            {isRu ? 'Наша миссия' : 'Our mission'}
          </motion.p>
          <motion.blockquote
            {...fadeUp(0.08)}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug mb-10"
          >
            {isRu
              ? '«Сделать путь в арабский университет простым, быстрым и понятным для каждого студента»'
              : '"Make the path to an Arab university simple, fast, and clear for every student"'}
          </motion.blockquote>
          <motion.div {...fadeUp(0.16)} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#D4A943] text-[#1B4332] font-semibold text-sm hover:bg-[#C9922A] transition-colors"
            >
              {isRu ? 'Начать поступление' : 'Start application'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
            >
              {isRu ? 'Связаться с нами' : 'Contact us'}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer lang={lang} />
    </>
  )
}
