'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap, Stamp, Plane, Wallet, Home, HeartPulse,
  Building2, MapPin, CheckCircle2, AlertTriangle, ExternalLink,
  Send, ArrowRight, ShieldCheck, Sparkles, BookOpen, Layers,
  Languages, Camera, Fingerprint, FileText, ScrollText, Users,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useLanguage } from '@/hooks/useLanguage'
import { SAUDI_PACKAGES } from '@/lib/saudiPackages'

// ── Palette — Saudi Premium / Modern Islamic / Luxury Education (this page only) ──
const GREEN_DEEP = '#0D3B2E'
const GREEN_DARK = '#092D23'
const GREEN_SOFT = '#174C3B'
const GOLD = '#C9A44C'
const GOLD_TEXT = '#8A6B2A'
const IVORY = '#F4EBDD'

const APPLY_HREF = '/apply-saudi'
const TELEGRAM_HREF = 'https://t.me/TARJUMAN_EDU'
const UNIVERSITIES_HREF = 'https://studyinsaudi.sa/en/Institutions'

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  }
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
      style={
        dark
          ? { background: 'rgba(201,164,76,0.12)', color: GOLD, border: `1px solid rgba(201,164,76,0.35)` }
          : { background: 'rgba(13,59,46,0.06)', color: GREEN_DEEP, border: `1px solid rgba(13,59,46,0.15)` }
      }
    >
      {children}
    </span>
  )
}

function GoldRule() {
  return (
    <div className="mx-auto my-5 h-[2px] w-16 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28"
      style={{ background: `linear-gradient(160deg, ${GREEN_DARK} 0%, ${GREEN_DEEP} 55%, ${GREEN_SOFT} 100%)` }}
    >
      {/* Decorative geometric pattern — no stock photography */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.10]" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="arabesque" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke={GOLD} strokeWidth="1" />
              <circle cx="40" cy="40" r="14" fill="none" stroke={GOLD} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="800" fill="url(#arabesque)" />
        </svg>
      </div>
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(201,164,76,0.25), transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(201,164,76,0.15), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6">
        <motion.div {...fadeUp(0)}>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ background: 'rgba(201,164,76,0.14)', color: GOLD, border: '1px solid rgba(201,164,76,0.4)' }}
          >
            🇸🇦 STUDY IN SAUDI
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.08)}
          className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl sm:leading-[1.1]"
        >
          Получите возможность учиться в Саудовской Аравии на гранте
        </motion.h1>

        <motion.p
          {...fadeUp(0.16)}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          Бесплатное обучение, стипендия и поддержка иностранных студентов в государственных университетах Королевства — от выбора программы до подачи документов.
        </motion.p>

        <motion.div {...fadeUp(0.24)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={APPLY_HREF}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-7 py-4 text-base font-bold text-[#092D23] shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C978)` }}
          >
            Подать заявку
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <a
            href={TELEGRAM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            Связаться с менеджером
            <Send className="h-5 w-5" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 1 — What is Study in Saudi
// ─────────────────────────────────────────────────────────────────────────────
function WhatIsSection() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: IVORY }}>
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <Eyebrow>О программе</Eyebrow>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl" style={{ color: GREEN_DEEP }}>
            Что такое Study in Saudi?
          </h2>
          <GoldRule />
          <p className="mx-auto max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: '#3E4C46' }}>
            Study in Saudi — государственная программа Королевства Саудовская Аравия, которая открывает иностранным студентам доступ к обучению в государственных университетах страны. Программа охватывает разные уровни образования и специальности — от подготовительного курса языка до магистратуры и докторантуры.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-3xl border p-8 text-center shadow-sm"
          style={{ background: '#fff', borderColor: 'rgba(13,59,46,0.12)' }}
        >
          <span className="text-5xl font-black sm:text-6xl" style={{ color: GOLD_TEXT }}>25</span>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide" style={{ color: GREEN_DEEP }}>
            вариантов обучения можно выбрать
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 2 — Benefits
// ─────────────────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: GraduationCap, title: 'Бесплатное обучение', desc: 'Плата за учёбу не взимается' },
  { icon: Stamp, title: 'Виза', desc: 'Оформление студенческой визы' },
  { icon: Plane, title: 'Авиабилеты', desc: 'Перелёт в рамках программы' },
  { icon: Wallet, title: 'Стипендия', desc: '840 SAR ≈ $225 в месяц' },
  { icon: Home, title: 'Общежитие', desc: 'Проживание на территории университета' },
  { icon: HeartPulse, title: 'Медицинская страховка', desc: 'Покрытие на время учёбы' },
]

function BenefitsSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <Eyebrow>Возможности гранта</Eyebrow>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl" style={{ color: GREEN_DEEP }}>
            Что даёт грант?
          </h2>
          <GoldRule />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              {...fadeUp(0.05 * i)}
              className="flex items-start gap-4 rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(13,59,46,0.12)', background: IVORY }}
            >
              <div
                className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
                style={{ background: 'rgba(13,59,46,0.08)' }}
              >
                <b.icon className="h-5 w-5" style={{ color: GREEN_DEEP }} aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold" style={{ color: GREEN_DEEP }}>{b.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.3)} className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Точные условия по каждому пункту (сроки выплат, тип общежития, объём страхового покрытия) зависят от конкретного университета и программы и уточняются на этапе подачи документов.
        </motion.p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 3 — Who can apply
// ─────────────────────────────────────────────────────────────────────────────
const AGE_GROUPS = [
  { title: 'Подготовительный курс арабского языка', age: '16–25 лет', conditional: false },
  { title: 'Бакалавриат', age: '16–25 лет', conditional: false },
  { title: 'Магистратура', age: 'до 35 лет', conditional: false },
  { title: 'Докторантура (PhD)', age: 'зависит от программы и университета', conditional: true },
]

function AudienceSection() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: IVORY }}>
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <Eyebrow>Требования</Eyebrow>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl" style={{ color: GREEN_DEEP }}>
            Кто может получить грант?
          </h2>
          <GoldRule />
          <p className="mx-auto flex max-w-xl items-center justify-center gap-2 text-base text-slate-600">
            <Users className="h-5 w-5 flex-none" style={{ color: GOLD_TEXT }} aria-hidden="true" />
            Программа открыта как для мужчин, так и для женщин
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {AGE_GROUPS.map((g, i) => (
            <motion.div
              key={g.title}
              {...fadeUp(0.05 * i)}
              className="rounded-2xl border bg-white p-5 shadow-sm"
              style={{ borderColor: 'rgba(13,59,46,0.12)' }}
            >
              <p className="font-bold" style={{ color: GREEN_DEEP }}>{g.title}</p>
              <p className="mt-1 text-lg font-black" style={{ color: GOLD_TEXT }}>{g.age}</p>
              {g.conditional && (
                <p className="mt-1 text-xs text-slate-500">Указано ориентировочно — уточняется индивидуально по программе</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.25)} className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Возрастные и иные требования могут отличаться в зависимости от конкретного университета и программы обучения — актуальные условия уточняются индивидуально на этапе подачи документов.
        </motion.p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 4 — Universities
// ─────────────────────────────────────────────────────────────────────────────
const UNIVERSITIES = [
  { name: 'Islamic University of Madinah', city: 'Медина' },
  { name: 'Umm Al-Qura University', city: 'Мекка' },
  { name: 'King Abdulaziz University', city: 'Джидда' },
  { name: 'Imam Muhammad ibn Saud Islamic University', city: 'Эр-Рияд' },
  { name: 'King Saud University', city: 'Эр-Рияд' },
  { name: 'Princess Nourah University', city: 'Эр-Рияд' },
]

function UniversitiesSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <Eyebrow>Университеты</Eyebrow>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl" style={{ color: GREEN_DEEP }}>
            Университеты-участники программы
          </h2>
          <GoldRule />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERSITIES.map((u, i) => (
            <motion.div
              key={u.name}
              {...fadeUp(0.05 * i)}
              className="flex items-start gap-3 rounded-2xl border p-5 shadow-sm"
              style={{ borderColor: 'rgba(13,59,46,0.12)', background: IVORY }}
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl" style={{ background: 'rgba(13,59,46,0.08)' }}>
                <Building2 className="h-5 w-5" style={{ color: GREEN_DEEP }} aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold leading-snug" style={{ color: GREEN_DEEP }}>{u.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {u.city}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.3)} className="mt-6 text-center text-sm text-slate-500">
          И многие другие государственные университеты Саудовской Аравии
        </motion.p>

        <motion.div {...fadeUp(0.35)} className="mt-8 flex justify-center">
          <a
            href={UNIVERSITIES_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-bold transition-colors hover:bg-black/[0.03]"
            style={{ borderColor: GREEN_DEEP, color: GREEN_DEEP }}
          >
            Посмотреть все университеты
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 5 — Specialties
// ─────────────────────────────────────────────────────────────────────────────
const SPECIALTIES = [
  { icon: BookOpen, title: 'Исламские науки' },
  { icon: Languages, title: 'Арабский язык' },
  { icon: Layers, title: 'ИТ и технологии' },
  { icon: Wallet, title: 'Экономика и бизнес' },
  { icon: Sparkles, title: 'Медиа' },
]

function SpecialtiesSection() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: IVORY }}>
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <Eyebrow>Специальности</Eyebrow>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl" style={{ color: GREEN_DEEP }}>
            Доступные направления обучения
          </h2>
          <GoldRule />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SPECIALTIES.map((s, i) => (
            <motion.div
              key={s.title}
              {...fadeUp(0.05 * i)}
              className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm"
              style={{ borderColor: 'rgba(13,59,46,0.12)' }}
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl" style={{ background: 'rgba(201,164,76,0.14)' }}>
                <s.icon className="h-5 w-5" style={{ color: GOLD_TEXT }} aria-hidden="true" />
              </div>
              <p className="font-bold" style={{ color: GREEN_DEEP }}>{s.title}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.25)} className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          Наличие конкретной специальности зависит от университета и текущего набора — актуальный список уточняется на этапе подачи документов.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border p-4 text-left"
          style={{ borderColor: 'rgba(180,83,9,0.25)', background: 'rgba(254,243,199,0.6)' }}
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-600" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-amber-800">
            Медицинские направления могут иметь отдельные условия и оплату — они не всегда покрываются грантом в полном объёме. Точные условия для медицинских специальностей уточняются индивидуально.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.35)} className="mt-8 flex justify-center">
          <a
            href={UNIVERSITIES_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-bold transition-colors hover:bg-black/[0.03]"
            style={{ borderColor: GREEN_DEEP, color: GREEN_DEEP }}
          >
            Посмотреть все университеты
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 6 — Arabic language path
// ─────────────────────────────────────────────────────────────────────────────
const LANGUAGE_TIMELINE = [
  { label: 'Арабский язык', icon: Languages },
  { label: 'Подготовка', icon: BookOpen },
  { label: 'Специальность', icon: Layers },
  { label: 'Диплом университета', icon: GraduationCap },
]

function LanguageSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div {...fadeUp(0)}>
          <Eyebrow>Языковой барьер</Eyebrow>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl" style={{ color: GREEN_DEEP }}>
            Не знаете арабский язык? Это не всегда проблема.
          </h2>
          <GoldRule />
          <p className="mx-auto max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: '#3E4C46' }}>
            Для студентов без знания арабского языка предусмотрен подготовительный курс — он позволяет выйти на нужный уровень языка и затем перейти к выбранной специальности. Продолжительность подготовки — до 2 лет, в зависимости от начального уровня и программы.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.15)} className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          {LANGUAGE_TIMELINE.map((step, i) => (
            <div key={step.label} className="flex flex-1 items-center sm:flex-col">
              <div className="flex flex-none flex-col items-center gap-2 sm:flex-1">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(13,59,46,0.06)', border: `1px solid rgba(13,59,46,0.15)` }}
                >
                  <step.icon className="h-6 w-6" style={{ color: GREEN_DEEP }} aria-hidden="true" />
                </div>
                <p className="text-center text-sm font-bold" style={{ color: GREEN_DEEP }}>{step.label}</p>
              </div>
              {i < LANGUAGE_TIMELINE.length - 1 && (
                <div className="mx-2 h-px flex-1 sm:mx-0 sm:mt-7 sm:h-px sm:w-full" style={{ background: 'rgba(201,164,76,0.5)' }} aria-hidden="true" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 7 — How to apply
// ─────────────────────────────────────────────────────────────────────────────
const PROCESS_STEPS = [
  { n: '01', title: 'Заполните анкету', desc: 'Расскажите о себе и своих целях в короткой форме.', cta: { label: 'Заполнить анкету', href: APPLY_HREF, external: false } },
  { n: '02', title: 'Отправьте документы', desc: 'Пришлите сканы документов нашему менеджеру в Telegram.', cta: { label: 'Отправить документы в Telegram', href: TELEGRAM_HREF, external: true } },
  { n: '03', title: 'Оплатите выбранный пакет', desc: 'Выберите подходящий пакет услуг и внесите оплату.' },
  { n: '04', title: 'Мы готовим и подаём документы', desc: 'Переводим и подаём ваш пакет документов в университет.' },
]

function ProcessSection() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: `linear-gradient(160deg, ${GREEN_DARK}, ${GREEN_DEEP})` }}>
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <Eyebrow dark>Процесс</Eyebrow>
          <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            Как подать заявку через нас?
          </h2>
          <GoldRule />
        </motion.div>

        <div className="mt-10 space-y-4">
          {PROCESS_STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp(0.06 * i)}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center"
            >
              <span className="text-3xl font-black" style={{ color: GOLD }}>{s.n}</span>
              <div className="flex-1">
                <p className="font-bold text-white">{s.title}</p>
                <p className="mt-0.5 text-sm text-white/65">{s.desc}</p>
              </div>
              {s.cta && (
                s.cta.external ? (
                  <a
                    href={s.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-[#092D23] sm:flex-none"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C978)` }}
                  >
                    {s.cta.label}
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={s.cta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-[#092D23] sm:flex-none"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C978)` }}
                  >
                    {s.cta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 8 — Documents
// ─────────────────────────────────────────────────────────────────────────────
const REQUIRED_DOCS = [
  { icon: Fingerprint, label: 'Паспорт' },
  { icon: Camera, label: 'Фото на белом фоне' },
  { icon: FileText, label: 'Аттестат или диплом' },
  { icon: ScrollText, label: 'Справка об отсутствии судимости' },
]

const OPTIONAL_DOCS = [
  { icon: HeartPulse, label: 'Медицинская справка' },
  { icon: FileText, label: 'Характеристика' },
  { icon: ScrollText, label: 'Тазкия / рекомендательное письмо' },
  { icon: Languages, label: 'Языковые сертификаты' },
  { icon: GraduationCap, label: 'Дополнительные сертификаты об образовании' },
]

function DocumentsSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <Eyebrow>Документы</Eyebrow>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl" style={{ color: GREEN_DEEP }}>
            Основные документы
          </h2>
          <GoldRule />
        </motion.div>

        <motion.div {...fadeUp(0.08)} className="mt-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: GOLD_TEXT }}>Обязательные</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {REQUIRED_DOCS.map((d) => (
              <div key={d.label} className="flex items-center gap-3 rounded-xl border p-4" style={{ borderColor: 'rgba(13,59,46,0.12)', background: IVORY }}>
                <CheckCircle2 className="h-5 w-5 flex-none" style={{ color: GREEN_DEEP }} aria-hidden="true" />
                <span className="text-sm font-semibold" style={{ color: GREEN_DEEP }}>{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.16)} className="mt-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Желательные (могут усилить пакет документов)</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {OPTIONAL_DOCS.map((d) => (
              <div key={d.label} className="flex items-center gap-3 rounded-xl border border-dashed p-4" style={{ borderColor: 'rgba(13,59,46,0.2)' }}>
                <d.icon className="h-5 w-5 flex-none text-slate-400" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-600">{d.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Наличие этих документов не обязательно, но может усилить пакет заявки в зависимости от программы и университета.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 9 — Pricing
// ─────────────────────────────────────────────────────────────────────────────
function PricingSection() {
  const standard = SAUDI_PACKAGES.STANDARD
  const priority = SAUDI_PACKAGES.VIP

  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24" style={{ background: IVORY }}>
      <div className="mx-auto max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center">
          <Eyebrow>Тарифы</Eyebrow>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl" style={{ color: GREEN_DEEP }}>
            Выберите пакет услуг
          </h2>
          <GoldRule />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* STANDARD */}
          <motion.div {...fadeUp(0.05)} className="flex flex-col rounded-3xl border bg-white p-7 shadow-sm" style={{ borderColor: 'rgba(13,59,46,0.14)' }}>
            <p className="text-sm font-bold uppercase tracking-wide" style={{ color: GREEN_DEEP }}>{standard.name_ru}</p>
            <p className="mt-2 text-4xl font-black" style={{ color: GREEN_DEEP }}>${standard.priceUSD}</p>
            <p className="mt-1 text-sm text-slate-500">Перевод документов + подача</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {[
                'Перевод документов на арабский язык',
                'Подача документов в университет',
                'Личный менеджер на связи',
                'Проверка комплектности документов',
                'Консультация по выбору университета и специальности',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" style={{ color: GREEN_DEEP }} aria-hidden="true" />
                  <span className="text-slate-600">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={APPLY_HREF}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-colors hover:bg-black/[0.03]"
              style={{ borderColor: GREEN_DEEP, color: GREEN_DEEP }}
            >
              Выбрать пакет — ${standard.priceUSD}
            </Link>
          </motion.div>

          {/* PRIORITY */}
          <motion.div
            {...fadeUp(0.1)}
            className="relative flex flex-col rounded-3xl p-7 shadow-xl sm:scale-[1.03]"
            style={{ background: `linear-gradient(165deg, ${GREEN_DEEP}, ${GREEN_DARK})`, border: `1px solid rgba(201,164,76,0.4)` }}
          >
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide text-[#092D23]"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C978)` }}
            >
              ПОПУЛЯРНЫЙ
            </span>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide" style={{ color: GOLD }}>{priority.name_ru}</p>
            <p className="mt-2 text-4xl font-black text-white">${priority.priceUSD}</p>
            <p className="mt-1 text-sm text-white/60">Перевод + приоритетная подача</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {[
                `Всё из пакета $${standard.priceUSD}`,
                'Приоритетная подача без очереди',
                'Максимальная скорость обработки',
                'Расширенная поддержка на всех этапах',
                'Приоритетные ответы от менеджера',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" style={{ color: GOLD }} aria-hidden="true" />
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={APPLY_HREF}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#092D23] transition-transform hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C978)` }}
            >
              Выбрать пакет — ${priority.priceUSD}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section 10 — Important disclaimer
// ─────────────────────────────────────────────────────────────────────────────
function ImportantSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-20">
      <motion.div
        {...fadeUp(0)}
        className="mx-auto max-w-3xl rounded-3xl border p-7 sm:p-9"
        style={{ borderColor: 'rgba(13,59,46,0.15)', background: IVORY }}
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 flex-none" style={{ color: GREEN_DEEP }} aria-hidden="true" />
          <div>
            <h2 className="text-xl font-black sm:text-2xl" style={{ color: GREEN_DEEP }}>Важно понимать</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              <p>
                TARJUMAN EDU — агентство, которое помогает с подготовкой, переводом и подачей документов. Мы не являемся университетом и не принимаем решение о зачислении.
              </p>
              <p>
                Итоговое решение о поступлении принимает университет. <strong style={{ color: GREEN_DEEP }}>Мы не гарантируем поступление.</strong>
              </p>
              <p>
                Условия гранта, возрастные требования, доступные программы и требования к документам могут меняться — актуальную информацию необходимо уточнять на этапе подачи заявки.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section
      className="relative overflow-hidden px-5 py-16 text-center sm:px-6 sm:py-24"
      style={{ background: `linear-gradient(160deg, ${GREEN_DARK}, ${GREEN_DEEP})` }}
    >
      <div
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(201,164,76,0.2), transparent 70%)' }}
        aria-hidden="true"
      />
      <motion.div {...fadeUp(0)} className="relative mx-auto max-w-2xl">
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          Готовы начать поступление в Саудовскую Аравию? 🇸🇦
        </h2>
        <p className="mt-4 text-base text-white/70 sm:text-lg">
          Заполните анкету — мы поможем с переводом документов, выбором университета и подачей заявки.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={APPLY_HREF}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-[#092D23] shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C978)` }}
          >
            НАЧАТЬ ПОДАЧУ
          </Link>
          <a
            href={TELEGRAM_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            НАПИСАТЬ МЕНЕДЖЕРУ
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sticky mobile CTA
// ─────────────────────────────────────────────────────────────────────────────
function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 backdrop-blur sm:hidden" style={{ borderColor: 'rgba(13,59,46,0.12)' }}>
      <Link
        href={APPLY_HREF}
        className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-[#092D23]"
        style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C978)` }}
      >
        Подать заявку
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function StudyInSaudiClient() {
  const [lang, setLang] = useLanguage()

  return (
    <main className="min-h-screen bg-white pb-20 sm:pb-0">
      <Navbar lang={lang} onLangChange={setLang} />
      <HeroSection />
      <WhatIsSection />
      <BenefitsSection />
      <AudienceSection />
      <UniversitiesSection />
      <SpecialtiesSection />
      <LanguageSection />
      <ProcessSection />
      <DocumentsSection />
      <PricingSection />
      <ImportantSection />
      <FinalCTASection />
      <StickyMobileCTA />
    </main>
  )
}
