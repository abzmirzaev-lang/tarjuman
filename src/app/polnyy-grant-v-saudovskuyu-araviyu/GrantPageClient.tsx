'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Stamp, Plane, Home, Wallet, HeartPulse,
  BookUser, FileSpreadsheet, Camera, FilePlus2,
  CheckCircle2, ChevronDown, MapPin, Users, BookOpen, ArrowRight,
  AlertTriangle, ShieldCheck, Building2, Sparkles, Layers,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useLanguage } from '@/hooks/useLanguage'
import {
  GRANT_UNIVERSITIES, GRANT_BENEFITS, DEGREE_LEVELS, SPECIALTY_CATEGORIES,
  AUDIENCE, DOCUMENTS, PROCESS_STEPS, GRANT_FAQ,
} from '@/data/saudiFullGrant'

// ── Palette — Saudi Premium / Islamic Premium (this page only) ─────────────
const GREEN_DEEP  = '#0D3B2E'
const GREEN_DARK  = '#092D23'
const GREEN_SOFT  = '#174C3B'
const GOLD        = '#C9A44C'
const GOLD_TEXT   = '#8A6B2A'
const IVORY       = '#F4EBDD'

const ICONS: Record<string, any> = {
  GraduationCap, Stamp, Plane, Home, Wallet, HeartPulse,
  BookUser, FileSpreadsheet, Camera, FilePlus2,
}

const APPLY_HREF = '/apply-saudi'

function fadeUp(delay = 0) {
  return {
    initial:  { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
  }
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border"
      style={{ color: GOLD_TEXT, borderColor: 'rgba(201,164,76,0.35)', background: 'rgba(201,164,76,0.08)' }}
    >
      {children}
    </span>
  )
}

function GoldRule({ className = '' }: { className?: string }) {
  return <div className={`h-px w-16 ${className}`} style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
}

// ════════════════════════════════════════════════════════════════════════
export default function GrantPageClient() {
  const [lang, setLang] = useLanguage()

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main className="min-h-screen overflow-x-hidden" style={{ background: IVORY }}>
        <HeroSection />
        <StatsStrip />
        <BenefitsSection />
        <DegreeLevelsSection />
        <SpecialtiesSection />
        <UniversitiesSection />
        <AudienceSection />
        <DocumentsSection />
        <ProcessSection />
        <Why25Section />
        <SummarySection />
        <FinalCTASection />
        <FAQSection />
        <Disclaimer />
      </main>
      <StickyMobileCTA />
    </>
  )
}

// ════════════════════════ HERO ════════════════════════
function HeroSection() {
  const miniUnis = ['Islamic University of Madinah', 'King Saud University', 'King Abdulaziz University', 'King Khalid University']

  return (
    <section
      id="hero"
      className="relative min-h-[94vh] flex items-center overflow-hidden"
      style={{ background: `radial-gradient(circle at 15% 20%, ${GREEN_SOFT}55, transparent 45%), radial-gradient(circle at 85% 80%, ${GOLD}22, transparent 40%), linear-gradient(160deg, ${GREEN_DARK} 0%, ${GREEN_DEEP} 55%, ${GREEN_SOFT} 100%)` }}
    >
      {/* subtle geometric motif */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: `linear-gradient(30deg, ${GOLD} 1px, transparent 1px), linear-gradient(150deg, ${GOLD} 1px, transparent 1px), linear-gradient(90deg, ${GOLD} 1px, transparent 1px)`,
        backgroundSize: '60px 104px',
      }} />
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none" style={{ background: `${GOLD}18` }} />
      <div className="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none" style={{ background: `${GREEN_SOFT}55` }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div>
          <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-6">
            <span className="w-6 h-4 rounded-sm overflow-hidden shadow-sm shrink-0">
              <img src="https://flagcdn.com/w40/sa.png" alt="Saudi Arabia" className="w-full h-full object-cover" />
            </span>
            <Eyebrow>Study in Saudi Arabia</Eyebrow>
          </motion.div>

          <motion.h1 {...fadeUp(0.08)} className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.12] mb-6 tracking-tight">
            Полный грант в университеты<br />Саудовской Аравии
          </motion.h1>

          <motion.p {...fadeUp(0.14)} className="text-white/75 text-lg leading-relaxed mb-3 max-w-xl">
            Бесплатное обучение + общежитие + стипендия + виза + авиабилеты + страховка.
          </motion.p>

          <motion.div {...fadeUp(0.2)} className="inline-flex items-center gap-2.5 rounded-2xl px-4 py-3 mb-9 border" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(201,164,76,0.3)' }}>
            <Layers className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
            <span className="text-white font-semibold text-sm sm:text-base">До 25 факультетов в разных университетах</span>
          </motion.div>

          <motion.div {...fadeUp(0.26)} className="flex flex-col sm:flex-row gap-3">
            <Link
              href={APPLY_HREF}
              className="inline-flex items-center justify-center gap-2 font-bold px-7 py-4 rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5 text-white"
              style={{ background: GOLD, color: GREEN_DARK, boxShadow: '0 12px 30px -8px rgba(201,164,76,0.55)' }}
            >
              Начать подачу
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#universities"
              className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-4 rounded-2xl text-base border text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.06)' }}
            >
              Посмотреть университеты
            </a>
          </motion.div>
        </div>

        {/* RIGHT — 25 options visual */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-[2rem] p-8 border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)' }}>
            <div className="text-center mb-6">
              <p className="text-5xl font-bold" style={{ color: GOLD }}>25</p>
              <p className="text-white/60 text-xs uppercase tracking-[0.25em] mt-1">Options</p>
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-[11px] font-semibold border"
                  style={{
                    color: i < 6 ? GREEN_DARK : 'rgba(255,255,255,0.55)',
                    background: i < 6 ? GOLD : 'rgba(255,255,255,0.06)',
                    borderColor: i < 6 ? GOLD : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          {/* floating mini university cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-5 -left-8 bg-white rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center gap-2 max-w-[190px]"
          >
            <Building2 className="w-4 h-4 shrink-0" style={{ color: GREEN_DEEP }} />
            <p className="text-[11px] font-semibold leading-tight" style={{ color: GREEN_DEEP }}>{miniUnis[0]}</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center gap-2 max-w-[190px]"
          >
            <Building2 className="w-4 h-4 shrink-0" style={{ color: GREEN_DEEP }} />
            <p className="text-[11px] font-semibold leading-tight" style={{ color: GREEN_DEEP }}>{miniUnis[1]}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════ STATS STRIP ════════════════════════
function StatsStrip() {
  const stats = [
    { value: '25',     label: 'факультетов для выбора' },
    { value: '840 SAR', label: 'ежемесячная стипендия' },
    { value: '6',       label: 'основных преимуществ гранта' },
    { value: '🇸🇦',      label: 'обучение в Саудовской Аравии' },
  ]
  return (
    <section className="border-b" style={{ background: GREEN_DARK, borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i * 0.06)} className="text-center">
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: GOLD }}>{s.value}</p>
            <p className="text-white/65 text-xs sm:text-sm mt-1.5 leading-tight">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ════════════════════════ BENEFITS (6 cards) ════════════════════════
function BenefitsSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: IVORY }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div {...fadeUp(0)}><Eyebrow>Что входит в полный грант</Eyebrow></motion.div>
          <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5" style={{ color: GREEN_DEEP }}>
            Шесть ключевых преимуществ
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GRANT_BENEFITS.map((b, i) => {
            const Icon = ICONS[b.icon]
            return (
              <motion.div
                key={b.title}
                {...fadeUp((i % 3) * 0.08)}
                className="rounded-3xl p-7 bg-white border shadow-sm hover:shadow-xl transition-shadow duration-300"
                style={{ borderColor: 'rgba(13,59,46,0.08)' }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${GREEN_DEEP}0d` }}>
                  <Icon className="w-6 h-6" style={{ color: GREEN_DEEP }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: GREEN_DEEP }}>{b.title}</h3>
                <p className="text-sm text-[#5b6b64] leading-relaxed">{b.desc}</p>
                {'highlight' in b && b.highlight && (
                  <p className="mt-4 text-xl font-bold" style={{ color: GOLD_TEXT }}>{b.highlight}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ════════════════════════ DEGREE LEVELS ════════════════════════
function DegreeLevelsSection() {
  const available = DEGREE_LEVELS.filter(d => d.available)
  const upcoming = DEGREE_LEVELS.filter(d => !d.available)

  return (
    <section className="py-20 md:py-28" style={{ background: IVORY }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div {...fadeUp(0)}><Eyebrow>Уровни обучения</Eyebrow></motion.div>
          <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5" style={{ color: GREEN_DEEP }}>
            На какие уровни можно подавать?
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          {available.map((d, i) => (
            <motion.div
              key={d.id}
              {...fadeUp(i * 0.08)}
              className="rounded-3xl p-8 text-center border shadow-sm"
              style={{ background: GREEN_DEEP, borderColor: GREEN_DEEP }}
            >
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-5" style={{ background: `${GOLD}22` }}>
                <GraduationCap className="w-7 h-7" style={{ color: GOLD }} />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">{d.title}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{d.desc}</p>
            </motion.div>
          ))}
        </div>

        {upcoming.length > 0 && (
          <motion.p {...fadeUp(0.2)} className="text-center text-sm text-[#5b6b64]">
            Скоро также будут доступны:{' '}
            {upcoming.map(u => u.title).join(', ')}.
          </motion.p>
        )}
      </div>
    </section>
  )
}

// ════════════════════════ SPECIALTIES ════════════════════════
function SpecialtiesSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: IVORY }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div {...fadeUp(0)}><Eyebrow>Специальности</Eyebrow></motion.div>
          <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5" style={{ color: GREEN_DEEP }}>
            Большой выбор специальностей
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-[#5b6b64] mt-4 text-sm leading-relaxed">
            Выбор специальности зависит от выбранного университета и программы — не каждая специальность доступна каждому кандидату.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPECIALTY_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              {...fadeUp((i % 3) * 0.07)}
              className="rounded-3xl p-6 bg-white border shadow-sm"
              style={{ borderColor: 'rgba(13,59,46,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <GoldRule />
              </div>
              <h3 className="font-bold text-base mb-3" style={{ color: GREEN_DEEP }}>{cat.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map(item => (
                  <span
                    key={item}
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${GREEN_DEEP}0a`, color: GREEN_SOFT }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ════════════════════════ UNIVERSITIES CATALOG ════════════════════════
const DEGREE_SHORT: Record<string, string> = { bachelor: 'Bachelor', master: 'Master', phd: 'PhD', diploma: 'Diploma', higher_diploma: 'Higher Diploma' }

function UniversityCard({ uni, i }: { uni: (typeof GRANT_UNIVERSITIES)[number]; i: number }) {
  return (
    <motion.div
      {...fadeUp((i % 3) * 0.08)}
      className="rounded-3xl overflow-hidden bg-white border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
      style={{ borderColor: 'rgba(13,59,46,0.08)' }}
    >
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 z-10" style={{ background: `linear-gradient(180deg, transparent 30%, ${GREEN_DARK}cc 100%)` }} />
        <img src={uni.image} alt={uni.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />
        <div className="absolute top-3 left-3 z-20 w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-bold shadow" style={{ background: GOLD, color: GREEN_DARK }}>
          {uni.logoInitials}
        </div>
        {uni.fullGrant && (
          <div className="absolute top-3 right-3 z-20 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.92)', color: GREEN_DEEP }}>
            Full Scholarship
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3.5">
          <h3 className="font-bold text-white text-sm leading-tight">{uni.name}</h3>
          <div className="flex items-center gap-1 text-white/75 text-xs mt-1"><MapPin className="w-3 h-3" />{uni.city}</div>
        </div>
      </div>

      <div className="p-5 space-y-3.5">
        <p className="text-xs text-[#5b6b64] leading-relaxed line-clamp-2">{uni.description}</p>
        <div className="flex items-center gap-3 text-xs text-[#5b6b64]">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" style={{ color: GREEN_SOFT }} />{uni.programsCount} программ</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" style={{ color: GREEN_SOFT }} />Int'l students</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {uni.degrees.map(d => (
            <span key={d} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${GREEN_DEEP}0a`, color: GREEN_SOFT }}>
              {DEGREE_SHORT[d]}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1 text-[11px] text-[#5b6b64]">
          <Home className="w-3.5 h-3.5" style={{ color: GOLD_TEXT }} /> Accommodation
          <Wallet className="w-3.5 h-3.5 ml-2" style={{ color: GOLD_TEXT }} /> Monthly stipend
        </div>
        <Link
          href={APPLY_HREF}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          style={{ background: GREEN_DEEP, color: '#fff' }}
        >
          Посмотреть программы
        </Link>
      </div>
    </motion.div>
  )
}

function UniversitiesSection() {
  return (
    <section id="universities" className="py-20 md:py-28 scroll-mt-20" style={{ background: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div {...fadeUp(0)}><Eyebrow>Университеты Саудовской Аравии</Eyebrow></motion.div>
          <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5" style={{ color: GREEN_DEEP }}>
            Каталог университетов
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-[#5b6b64] mt-4 text-sm leading-relaxed">
            Ниже — несколько университетов, участвующих в программе полного гранта. Полный каталог со всеми факультетами появится позже.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GRANT_UNIVERSITIES.map((uni, i) => <UniversityCard key={uni.id} uni={uni} i={i} />)}
        </div>
      </div>
    </section>
  )
}

// ════════════════════════ AUDIENCE ════════════════════════
function AudienceSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: IVORY }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div {...fadeUp(0)}><Eyebrow>Кому подходит грант</Eyebrow></motion.div>
          <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5" style={{ color: GREEN_DEEP }}>
            Кто может подать?
          </motion.h2>
        </div>

        <motion.div {...fadeUp(0.1)} className="flex flex-wrap justify-center gap-3 mb-8">
          {AUDIENCE.map(a => (
            <span key={a} className="text-sm font-semibold px-4 py-2.5 rounded-2xl bg-white border shadow-sm" style={{ borderColor: 'rgba(13,59,46,0.08)', color: GREEN_DEEP }}>
              {a}
            </span>
          ))}
        </motion.div>

        <motion.p {...fadeUp(0.16)} className="text-center text-sm text-[#5b6b64] max-w-lg mx-auto">
          Условия поступления зависят от выбранного университета, факультета и образовательной программы.
        </motion.p>
      </div>
    </section>
  )
}

// ════════════════════════ DOCUMENTS ════════════════════════
function DocumentsSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: '#fff' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div {...fadeUp(0)}><Eyebrow>Документы</Eyebrow></motion.div>
          <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5" style={{ color: GREEN_DEEP }}>
            Какие документы понадобятся?
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {DOCUMENTS.map((d, i) => {
            const Icon = ICONS[d.icon]
            return (
              <motion.div key={d.title} {...fadeUp((i % 5) * 0.06)} className="rounded-2xl p-5 border text-center" style={{ background: IVORY, borderColor: 'rgba(13,59,46,0.08)' }}>
                <div className="w-11 h-11 rounded-xl mx-auto flex items-center justify-center mb-3" style={{ background: `${GREEN_DEEP}0d` }}>
                  <Icon className="w-5 h-5" style={{ color: GREEN_DEEP }} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5" style={{ color: GREEN_DEEP }}>{d.title}</h3>
                <p className="text-xs text-[#5b6b64] leading-relaxed">{d.desc}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.p {...fadeUp(0.2)} className="text-center text-sm text-[#5b6b64]">
          Точный список документов определяется выбранной программой.
        </motion.p>
      </div>
    </section>
  )
}

// ════════════════════════ PROCESS TIMELINE ════════════════════════
function ProcessSection() {
  return (
    <section className="py-20 md:py-28" style={{ background: GREEN_DEEP }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div {...fadeUp(0)} className="flex justify-center"><Eyebrow>Процесс подачи</Eyebrow></motion.div>
          <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5 text-white">
            Как проходит подача
          </motion.h2>
        </div>

        <div className="space-y-4">
          {PROCESS_STEPS.map((s, i) => (
            <motion.div key={s.step} {...fadeUp(i * 0.05)} className="flex gap-5 items-start rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <span className="text-2xl font-bold shrink-0" style={{ color: GOLD }}>{s.step}</span>
              <div>
                <h3 className="font-bold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ════════════════════════ WHY 25 ════════════════════════
function Why25Section() {
  const flow = ['1 кандидат', '25 вариантов', 'разные университеты', 'разные специальности', 'больше возможностей подобрать подходящую программу']
  return (
    <section className="py-20 md:py-28" style={{ background: IVORY }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div {...fadeUp(0)} className="flex justify-center"><Eyebrow>Почему не один университет</Eyebrow></motion.div>
        <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5 mb-4" style={{ color: GREEN_DEEP }}>
          Не ограничивайте себя одним университетом
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="text-[#5b6b64] leading-relaxed mb-12 max-w-xl mx-auto">
          Вместо выбора только одного варианта кандидат может сформировать список до 25 факультетов в разных университетах Саудовской Аравии.
        </motion.p>

        <div className="flex flex-col items-center gap-3">
          {flow.map((item, i) => (
            <motion.div key={item} {...fadeUp(i * 0.08)} className="flex flex-col items-center gap-3">
              <span
                className="text-sm sm:text-base font-semibold px-5 py-3 rounded-2xl border"
                style={{ background: i === 0 || i === 1 ? GREEN_DEEP : '#fff', color: i === 0 || i === 1 ? '#fff' : GREEN_DEEP, borderColor: 'rgba(13,59,46,0.1)' }}
              >
                {item}
              </span>
              {i < flow.length - 1 && <div className="w-px h-5" style={{ background: GOLD }} />}
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.3)} className="text-xs text-[#8a938e] mt-10">
          Подача заявки не гарантирует поступление.
        </motion.p>
      </div>
    </section>
  )
}

// ════════════════════════ SUMMARY ════════════════════════
function SummarySection() {
  const items = [
    'Бесплатное обучение',
    'Учебную визу',
    'Билет туда и обратно',
    'Общежитие',
    'Стипендию 840 SAR в месяц',
    'Медицинскую страховку',
  ]
  return (
    <section className="py-20 md:py-28" style={{ background: `linear-gradient(160deg, ${GREEN_DARK}, ${GREEN_DEEP})` }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp(0)}>
          <Eyebrow>Что вы получите</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-bold mt-5 mb-6 text-white">Полный грант включает</h2>
          <ul className="space-y-3">
            {items.map(item => (
              <li key={item} className="flex items-center gap-3 text-white/85 text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fadeUp(0.12)} className="flex justify-center">
          <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center border-2 text-center" style={{ borderColor: GOLD, background: 'rgba(255,255,255,0.04)' }}>
            <Sparkles className="w-7 h-7 mb-3" style={{ color: GOLD }} />
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">FULL<br />SCHOLARSHIP</p>
            <p className="text-sm mt-3 text-white/60">Saudi Arabia 🇸🇦</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════ FINAL CTA ════════════════════════
function FinalCTASection() {
  return (
    <section className="py-20 md:py-28" style={{ background: IVORY }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2 {...fadeUp(0)} className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: GREEN_DEEP }}>
          Готовы начать путь к обучению в Саудовской Аравии?
        </motion.h2>
        <motion.p {...fadeUp(0.06)} className="text-[#5b6b64] mb-9 leading-relaxed">
          Выберите до 25 факультетов и подайте заявку на полный грант.
        </motion.p>
        <motion.div {...fadeUp(0.12)} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={APPLY_HREF}
            className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: GREEN_DEEP, color: '#fff' }}
          >
            Начать подачу
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#universities"
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-2xl text-base border"
            style={{ borderColor: 'rgba(13,59,46,0.15)', color: GREEN_DEEP }}
          >
            Подобрать университет
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════ FAQ ════════════════════════
function FAQItem({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <div className="border-b" style={{ borderColor: 'rgba(13,59,46,0.1)' }}>
      <button onClick={onClick} className="w-full flex items-center justify-between gap-4 py-5 text-left">
        <span className="font-semibold text-base" style={{ color: GREEN_DEEP }}>{q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ color: GOLD_TEXT }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-[#5b6b64] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section className="py-20 md:py-28" style={{ background: '#fff' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.div {...fadeUp(0)} className="flex justify-center"><Eyebrow>FAQ</Eyebrow></motion.div>
          <motion.h2 {...fadeUp(0.06)} className="text-3xl sm:text-4xl font-bold mt-5" style={{ color: GREEN_DEEP }}>
            Частые вопросы
          </motion.h2>
        </div>
        <motion.div {...fadeUp(0.1)}>
          {GRANT_FAQ.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} open={openIdx === i} onClick={() => setOpenIdx(openIdx === i ? null : i)} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ════════════════════════ DISCLAIMER ════════════════════════
function Disclaimer() {
  return (
    <section className="py-10" style={{ background: IVORY }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-start gap-3 rounded-2xl p-4 border" style={{ borderColor: 'rgba(13,59,46,0.1)', background: '#fff' }}>
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD_TEXT }} />
          <p className="text-xs text-[#8a938e] leading-relaxed">
            Подача заявки не гарантирует поступление. Окончательное решение принимает университет в соответствии с требованиями выбранной программы. Условия и доступность отдельных программ могут отличаться.
          </p>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════ STICKY MOBILE CTA ════════════════════════
function StickyMobileCTA() {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3" style={{ background: 'rgba(244,235,221,0.92)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(13,59,46,0.1)' }}>
      <Link
        href={APPLY_HREF}
        className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-sm"
        style={{ background: GREEN_DEEP, color: '#fff' }}
      >
        <ShieldCheck className="w-4 h-4" />
        Начать подачу
      </Link>
    </div>
  )
}
