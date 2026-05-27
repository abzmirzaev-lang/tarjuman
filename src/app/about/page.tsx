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
       