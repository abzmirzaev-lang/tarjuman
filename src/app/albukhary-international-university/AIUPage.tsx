'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  GraduationCap, MapPin, Globe, BookOpen, Award, Home, Utensils,
  Users, ChevronDown, ChevronRight, CheckCircle, XCircle, Star,
  MessageCircle, Send, ArrowRight, Building2, Briefcase, TrendingUp,
  Landmark, Heart, Newspaper, Monitor, Clock, FileText, Plane,
  CreditCard, BadgeCheck, AlertCircle, Phone, Calendar, Mic2
} from 'lucide-react'

/* ─── helpers ─── */
const TG_LINK = 'https://t.me/TARJUMAN_EDU'
const WA_LINK = 'https://t.me/TARJUMAN_EDU'

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600 bg-brand-50 border border-brand-200 rounded-full px-3 py-1 mb-4">
      {children}
    </span>
  )
}

/* ─── SCHEMA.ORG ─── */
const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Albukhary International University',
  alternateName: 'AIU Malaysia',
  url: 'https://www.aiu.edu.my',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Alor Setar',
    addressRegion: 'Kedah',
    addressCountry: 'MY',
  },
  description:
    'Albukhary International University (AIU) — международный университет в Малайзии, предоставляющий полную стипендию студентам из разных стран мира.',
}

/* ════════════════════════════════════════════════════════ */
export default function AIUPage() {
  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <main className="min-h-screen bg-[#F7F8FA] overflow-x-hidden">
        <HeroSection />
        <AboutSection />
        <WhyAIUSection />
        <ProgramsSection />
        <ScholarshipSection />
        <RequirementsSection />
        <DocumentsSection />
        <IELTSSection />
        <ProcessSection />
        <InterviewSection />
        <GallerySection />
        <FAQSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  )
}

/* ════════════════════ HERO ════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0a2e26] via-[#0d3b30] to-[#1a4a3a]">
      {/* animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-400/10 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-600/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.02] blur-2xl" />
        {/* grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div>
          <motion.div {...fadeUp(0.05)}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Приём заявок открыт · 2025–2026
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] mb-6">
            Albukhary<br />
            <span className="text-brand-300">International</span><br />
            University
          </motion.h1>

          <motion.p {...fadeUp(0.18)} className="text-lg text-white/70 mb-4 leading-relaxed">
            Малайзия · Полная стипендия
          </motion.p>

          <motion.p {...fadeUp(0.22)} className="text-white/60 text-base leading-relaxed mb-10 max-w-xl">
            Международный университет с кампусом мирового уровня в Алор-Старе, Малайзия.
            Полная стипендия покрывает обучение, проживание и питание — для студентов без финансовых ограничений.
          </motion.p>

          {/* stats strip */}
          <motion.div {...fadeUp(0.27)} className="grid grid-cols-3 gap-4 mb-10">
            {[
              { value: '100%', label: 'Стипендия' },
              { value: '60+', label: 'Стран' },
              { value: '9', label: 'Специальностей' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.32)} className="flex flex-col sm:flex-row gap-3">
            <a
              href={TG_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-400 hover:bg-brand-300 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 hover:shadow-[0_8px_30px_rgba(111,175,155,0.4)] hover:-translate-y-0.5"
            >
              <GraduationCap size={20} />
              Подать заявку
            </a>
            <a
              href={TG_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1a8dc5] text-white font-semibold px-6 py-4 rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5"
            >
              <Send size={18} />
              Telegram
            </a>
            <a
              href="https://wa.me/message/TARJUMAN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5c] text-white font-semibold px-6 py-4 rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </motion.div>
        </div>

        {/* RIGHT — card stack */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <div className="relative">
            {/* main image card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=700&q=85&auto=format"
                alt="Albukhary International University Campus"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 text-white">
                <p className="font-bold text-lg">AIU Campus</p>
                <p className="text-sm text-white/70">Alor Setar, Kedah, Malaysia</p>
              </div>
            </div>

            {/* floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-border"
            >
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <Award size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Полная стипендия</p>
                <p className="text-[10px] text-muted">100% покрытие</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-border"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <Globe size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">Международная среда</p>
                <p className="text-[10px] text-muted">60+ стран</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 -right-6 bg-white rounded-2xl shadow-xl p-3 border border-border"
            >
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-xs font-bold text-ink">Обучение на английском</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ════════════════════ ABOUT ════════════════════ */
function AboutSection() {
  const stats = [
    { icon: <Calendar size={20} />, label: 'Основан', value: '2012' },
    { icon: <MapPin size={20} />, label: 'Расположение', value: 'Alor Setar, Kedah' },
    { icon: <Globe size={20} />, label: 'Язык обучения', value: 'Английский' },
    { icon: <Users size={20} />, label: 'Студенты', value: '60+ стран' },
    { icon: <Award size={20} />, label: 'Аккредитация', value: 'MQA, Малайзия' },
    { icon: <GraduationCap size={20} />, label: 'Диплом', value: 'Международный' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <SectionLabel><Building2 size={12} /> Об университете</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-ink mb-6 leading-tight">
              Международный университет<br />
              <span className="text-brand-600">в сердце Малайзии</span>
            </h2>
            <p className="text-muted leading-relaxed mb-5">
              Albukhary International University (AIU) — частный международный университет, основанный в 2012 году в Алор-Старе, штат Кедах, Малайзия. Университет был создан с особой миссией: предоставить качественное высшее образование студентам из развивающихся стран по всему миру — бесплатно.
            </p>
            <p className="text-muted leading-relaxed mb-5">
              AIU финансируется Фондом Albukhary — крупнейшей гуманитарной организацией, основанной малайзийским меценатом Саедом Мокхтаром Аль-Бухари. Фонд покрывает все расходы студентов: обучение, проживание и питание.
            </p>
            <p className="text-muted leading-relaxed">
              Кампус мирового уровня включает современные учебные корпуса, библиотеку, спортивные объекты, благоустроенные общежития и студенческие центры. Студенты из более чем 60 стран создают по-настоящему интернациональную академическую среду.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-[#F7F8FA] rounded-2xl p-5 hover:shadow-card transition-shadow"
                >
                  <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-3">
                    {s.icon}
                  </div>
                  <p className="text-xs text-muted mb-1">{s.label}</p>
                  <p className="font-bold text-ink">{s.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl overflow-hidden shadow-card">
              <img
                src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=700&q=80&auto=format"
                alt="University campus Malaysia"
                className="w-full h-48 object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ WHY AIU ════════════════════ */
function WhyAIUSection() {
  const benefits = [
    {
      icon: <Award className="text-amber-500" size={28} />,
      bg: 'bg-amber-50',
      title: 'Полная стипендия',
      desc: 'Университет полностью финансируется Фондом Albukhary. Обучение, проживание и питание — за счёт фонда.'
    },
    {
      icon: <BookOpen className="text-brand-600" size={28} />,
      bg: 'bg-brand-50',
      title: 'Бесплатное обучение',
      desc: 'Стоимость обучения (до $8 000 в год) полностью покрывается стипендией. Студент не платит ни за один предмет.'
    },
    {
      icon: <Home className="text-purple-500" size={28} />,
      bg: 'bg-purple-50',
      title: 'Бесплатное проживание',
      desc: 'Все студенты обеспечены местом в современных кампусных общежитиях с кондиционером и всеми удобствами.'
    },
    {
      icon: <Utensils className="text-rose-500" size={28} />,
      bg: 'bg-rose-50',
      title: 'Бесплатное питание',
      desc: 'Завтрак, обед и ужин в студенческой столовой включены в стипендию. Никаких расходов на еду.'
    },
    {
      icon: <Globe className="text-blue-500" size={28} />,
      bg: 'bg-blue-50',
      title: 'Международный диплом',
      desc: 'Диплом AIU аккредитован Малайзийским агентством квалификаций (MQA) и признаётся работодателями по всему миру.'
    },
    {
      icon: <GraduationCap className="text-indigo-500" size={28} />,
      bg: 'bg-indigo-50',
      title: 'Обучение на английском',
      desc: 'Все программы ведутся на английском языке. IELTS не является обязательным для поступления.'
    },
    {
      icon: <Building2 className="text-teal-500" size={28} />,
      bg: 'bg-teal-50',
      title: 'Современный кампус',
      desc: 'Кампус мирового уровня: аудитории с проекторами, лаборатории, библиотека, спортзалы и зелёные территории.'
    },
    {
      icon: <Users className="text-orange-500" size={28} />,
      bg: 'bg-orange-50',
      title: 'Интернациональная среда',
      desc: 'Студенты из 60+ стран. Культурное разнообразие, международные связи и возможность развить глобальное мышление.'
    },
  ]

  return (
    <section className="py-24 bg-[#F7F8FA]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><Star size={12} /> Преимущества</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            Почему стоит выбрать AIU?
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Albukhary International University — один из немногих университетов в мире, предлагающих полную стипендию с покрытием всех основных расходов студента.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-modal transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 ${b.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {b.icon}
              </div>
              <h3 className="font-bold text-ink mb-2">{b.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ PROGRAMS ════════════════════ */
function ProgramsSection() {
  const programs = [
    {
      icon: <Monitor size={22} />,
      color: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      faculty: 'Computer Science',
      programs: ['Bachelor of Computer Science'],
      degree: 'Bachelor of Science',
    },
    {
      icon: <Briefcase size={22} />,
      color: 'from-brand-500 to-brand-700',
      bg: 'bg-brand-50',
      text: 'text-brand-700',
      faculty: 'Business Administration',
      programs: [
        'Bachelor of Business Administration',
        'BBA — Marketing',
        'BBA — Human Resource Management',
      ],
      degree: 'Bachelor of Business',
    },
    {
      icon: <TrendingUp size={22} />,
      color: 'from-emerald-500 to-emerald-700',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      faculty: 'Economics',
      programs: ['Bachelor of Economics'],
      degree: 'Bachelor of Economics',
    },
    {
      icon: <Landmark size={22} />,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      faculty: 'Islamic Finance',
      programs: ['Bachelor of Finance (Islamic Finance)'],
      degree: 'Bachelor of Finance',
    },
    {
      icon: <Globe size={22} />,
      color: 'from-purple-500 to-purple-700',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      faculty: 'Politics & Int. Relations',
      programs: ['Bachelor of Politics and International Relations'],
      degree: 'Bachelor of Arts',
    },
    {
      icon: <Users size={22} />,
      color: 'from-cyan-500 to-cyan-700',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      faculty: 'Social Development',
      programs: ['Bachelor of Social Development'],
      degree: 'Bachelor of Arts',
    },
    {
      icon: <Heart size={22} />,
      color: 'from-rose-500 to-rose-700',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      faculty: 'Education',
      programs: [
        'Bachelor of Primary Education',
        'Bachelor of Early Childhood Education',
      ],
      degree: 'Bachelor of Education',
    },
    {
      icon: <Newspaper size={22} />,
      color: 'from-indigo-500 to-indigo-700',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      faculty: 'Media & Communication',
      programs: ['Bachelor of Media and Communication'],
      degree: 'Bachelor of Communication',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><BookOpen size={12} /> Специальности</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            Доступные программы
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            AIU предлагает широкий спектр программ бакалавриата на английском языке. Все программы ведутся на уровне международных академических стандартов.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={p.faculty}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-[#F7F8FA] hover:bg-white border border-transparent hover:border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-card"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${p.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {p.icon}
              </div>
              <div className={`inline-flex text-[11px] font-semibold uppercase tracking-wider ${p.text} ${p.bg} rounded-full px-2.5 py-0.5 mb-3`}>
                {p.degree}
              </div>
              <h3 className="font-bold text-ink text-lg mb-3">{p.faculty}</h3>
              <ul className="space-y-1.5">
                {p.programs.map(prog => (
                  <li key={prog} className="flex items-center gap-2 text-sm text-muted">
                    <ChevronRight size={13} className="text-brand-400 flex-shrink-0" />
                    {prog}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.2)} className="text-center text-sm text-muted mt-8">
          * Конкретный перечень программ на текущий год уточняйте у менеджера Tarjuman Education
        </motion.p>
      </div>
    </section>
  )
}

/* ════════════════════ SCHOLARSHIP TABLE ════════════════════ */
function ScholarshipSection() {
  const covered = [
    { icon: <BookOpen size={16} />, item: 'Обучение (tuition fee)' },
    { icon: <Home size={16} />, item: 'Проживание в кампусе' },
    { icon: <Utensils size={16} />, item: 'Питание (3 раза в день)' },
    { icon: <GraduationCap size={16} />, item: 'Регистрационный взнос' },
    { icon: <BookOpen size={16} />, item: 'Учебные материалы' },
  ]

  const notCovered = [
    { icon: <Plane size={16} />, item: 'Авиабилет (туда-обратно)' },
    { icon: <CreditCard size={16} />, item: 'EMGS (студенческая виза)' },
    { icon: <FileText size={16} />, item: 'Возвратный депозит' },
    { icon: <Globe size={16} />, item: 'Виза (стоимость оформления)' },
    { icon: <Phone size={16} />, item: 'Личные расходы' },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-[#0a2e26] to-[#1a4a3a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-brand-600/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><Award size={12} /> Стипендия</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Что покрывает стипендия?
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Стипендия AIU — одна из самых щедрых в Азии. Студент получает полное обеспечение без ежегодных платежей за обучение и проживание.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            {...fadeUp(0.1)}
            className="bg-green-900/30 backdrop-blur border border-green-500/30 rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-green-400" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Покрывается стипендией</p>
                <p className="text-green-400/80 text-sm">100% бесплатно для студента</p>
              </div>
            </div>
            <div className="space-y-3">
              {covered.map(c => (
                <div key={c.item} className="flex items-center gap-3 bg-green-500/10 rounded-xl px-4 py-3">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-white font-medium">{c.item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.2)} className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200/90 text-sm leading-relaxed">
            <strong className="text-amber-300">Важно:</strong> Расходы на визу, авиабилет, EMGS и возвратный депозит — единоразовые и относительно небольшие по сравнению со стоимостью обучения. Tarjuman Education помогает рассчитать точные суммы и подготовить все документы для визы.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════ REQUIREMENTS ════════════════════ */
function RequirementsSection() {
  const reqs = [
    { icon: <Calendar size={18} />, text: 'Предпочтительный возраст — до 20 лет (в отдельных случаях до 22 лет)' },
    { icon: <GraduationCap size={18} />, text: 'Хорошая академическая успеваемость (аттестат без двоек)' },
    { icon: <TrendingUp size={18} />, text: 'Семейный доход должен соответствовать критериям стипендии' },
    { icon: <Globe size={18} />, text: 'Владение английским языком — приветствуется, но IELTS не обязателен' },
    { icon: <FileText size={18} />, text: 'Полный пакет документов в соответствии с требованиями университета' },
    { icon: <BadgeCheck size={18} />, text: 'Готовность пройти вступительное интервью (онлайн или очно)' },
  ]

  return (
    <section className="py-24 bg-[#F7F8FA]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <SectionLabel><CheckCircle size={12} /> Требования</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-ink mb-6 leading-tight">
              Требования<br />к поступлению
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              AIU принимает студентов из развивающихся стран с хорошей успеваемостью и реальной потребностью в финансовой поддержке. Требования — адекватные, и большинство выпускников школ им соответствуют.
            </p>
            <div className="space-y-4">
              {reqs.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-border"
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 flex-shrink-0 mt-0.5">
                    {r.icon}
                  </div>
                  <p className="text-sm text-ink leading-relaxed pt-1">{r.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
              <h3 className="text-xl font-bold mb-2">Возрастные требования</h3>
              <p className="text-white/70 text-sm mb-6">Ключевой критерий для поступления</p>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-4xl font-black text-white mb-1">до 20</div>
                  <p className="text-white/70 text-sm">Предпочтительный возраст. Наибольшие шансы на одобрение заявки.</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-4xl font-black text-amber-300 mb-1">до 22</div>
                  <p className="text-white/70 text-sm">Рассматривается в отдельных случаях, при сильном академическом досье.</p>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-white/20">
                <p className="text-white/60 text-xs leading-relaxed">
                  * Студентам старше 22 лет рекомендуем рассмотреть другие программы. Наши менеджеры помогут подобрать подходящий вариант.
                </p>
              </div>
            </div>

            <div className="mt-5 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 text-brand-700 font-semibold mb-2">
                <BadgeCheck size={16} /> Хорошая новость
              </div>
              <p className="text-sm text-muted leading-relaxed">
                AIU не требует IELTS, TOEFL или других сертификатов английского языка. Студенты проходят внутренний языковой тест уже после поступления.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ DOCUMENTS ════════════════════ */
function DocumentsSection() {
  const required = [
    'Загранпаспорт',
    'Аттестат об окончании школы',
    'Оценки за 9, 10 и 11 классы',
    'Перевод всех документов на английский язык',
    'Удостоверение личности обоих родителей',
    'Подтверждение дохода родителей (справка или форма AIU)',
    'Коммунальный счёт (электричество, вода или газ)',
    'Фотография дома снаружи',
    'Фотография кухни',
    'Фотография гостиной',
    'Personal Statement (эссе-мотивация)',
  ]

  const optional = [
    'IELTS (при наличии)',
    'TOEFL (при наличии)',
    'Рекомендательное письмо',
    'Сертификаты и грамоты за достижения',
    'Дипломы олимпиад и конкурсов',
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><FileText size={12} /> Документы</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            Полный список документов
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Tarjuman Education помогает собрать, перевести и правильно оформить весь пакет документов для подачи в AIU.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Required */}
          <motion.div {...fadeUp(0.1)}>
            <div className="bg-[#F7F8FA] rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                  <CheckCircle size={20} className="text-brand-600" />
                </div>
                <div>
                  <p className="font-bold text-ink text-lg">Обязательные документы</p>
                  <p className="text-sm text-muted">{required.length} позиций</p>
                </div>
              </div>
              <div className="space-y-3">
                {required.map((doc, i) => (
                  <motion.div
                    key={doc}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="flex items-start gap-3 bg-white rounded-xl p-3 border border-border"
                  >
                    <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-ink">{doc}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Optional + note */}
          <motion.div {...fadeUp(0.15)} className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Star size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-ink text-lg">Необязательные документы</p>
                  <p className="text-sm text-muted">Усиливают заявку</p>
                </div>
              </div>
              <div className="space-y-3">
                {optional.map(doc => (
                  <div key={doc} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-amber-200/60">
                    <Star size={14} className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-ink">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Перевод документов</p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Все документы должны быть переведены на английский язык. Tarjuman Education — специализируется на переводе документов для поступления в зарубежные университеты.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <p className="font-semibold text-ink mb-2 flex items-center gap-2">
                <GraduationCap size={16} className="text-brand-600" />
                Personal Statement
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Мотивационное эссе — один из ключевых документов. Наши специалисты помогают написать убедительный Personal Statement, который выделит вас среди других кандидатов.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ IELTS ════════════════════ */
function IELTSSection() {
  return (
    <section className="py-16 bg-[#F7F8FA]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          {...fadeUp()}
          className="bg-gradient-to-br from-green-600 to-brand-700 rounded-3xl p-10 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <BadgeCheck size={16} className="text-green-300" />
              Важная информация
            </div>

            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              IELTS не обязателен!
            </h2>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Для подачи заявки в AIU не требуется сертификат IELTS или TOEFL.
              Студенты без языкового сертификата могут подавать документы.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <CheckCircle size={20} />, text: 'Подача без IELTS' },
                { icon: <CheckCircle size={20} />, text: 'Подача без TOEFL' },
                { icon: <CheckCircle size={20} />, text: 'Внутренний тест в AIU' },
              ].map(item => (
                <div key={item.text} className="bg-white/15 backdrop-blur rounded-2xl p-4 flex items-center gap-2 justify-center font-semibold">
                  <span className="text-green-300">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            <p className="text-white/60 text-sm">
              Если у вас есть IELTS — это плюс. Но отсутствие сертификата не является причиной для отказа в рассмотрении заявки.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════ PROCESS TIMELINE ════════════════════ */
function ProcessSection() {
  const steps = [
    {
      num: '01',
      icon: <FileText size={20} />,
      title: 'Подготовка документов',
      desc: 'Собираем все необходимые документы: аттестат, оценки, паспорт, фотографии дома и справки о доходах.',
      color: 'bg-blue-500',
    },
    {
      num: '02',
      icon: <Globe size={20} />,
      title: 'Перевод документов',
      desc: 'Переводим все документы на английский язык. Tarjuman Education специализируется на профессиональных переводах для поступления.',
      color: 'bg-purple-500',
    },
    {
      num: '03',
      icon: <CheckCircle size={20} />,
      title: 'Заполнение заявки',
      desc: 'Заполняем онлайн-заявку на сайте AIU, прикладываем все документы и пишем Personal Statement.',
      color: 'bg-brand-500',
    },
    {
      num: '04',
      icon: <Clock size={20} />,
      title: 'Рассмотрение',
      desc: 'Университет рассматривает заявку. Этот этап занимает от нескольких недель до 2 месяцев.',
      color: 'bg-amber-500',
    },
    {
      num: '05',
      icon: <Mic2 size={20} />,
      title: 'Интервью',
      desc: 'Университет приглашает на онлайн-интервью. Мы проводим подготовку и тренировочные сессии.',
      color: 'bg-rose-500',
    },
    {
      num: '06',
      icon: <Award size={20} />,
      title: 'Получение оффера',
      desc: 'Университет отправляет Letter of Offer (письмо с подтверждением зачисления и стипендии).',
      color: 'bg-green-500',
    },
    {
      num: '07',
      icon: <CreditCard size={20} />,
      title: 'Визовый процесс',
      desc: 'Оформляем студенческую визу через EMGS Malaysia. Tarjuman помогает с заполнением всех форм.',
      color: 'bg-indigo-500',
    },
    {
      num: '08',
      icon: <Plane size={20} />,
      title: 'Прибытие в Малайзию',
      desc: 'Вылетаем в Малайзию! Регистрируемся в кампусе, получаем ключи от комнаты и начинаем новую жизнь.',
      color: 'bg-teal-500',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <SectionLabel><ArrowRight size={12} /> Процесс</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            Как подать заявку в AIU?
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Tarjuman Education сопровождает вас на каждом шаге — от первого звонка до регистрации в кампусе.
          </p>
        </motion.div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`flex items-center gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <div className={`bg-[#F7F8FA] hover:bg-white border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-card ${i % 2 === 0 ? 'lg:text-right' : ''}`}>
                    <div className={`text-5xl font-black text-border mb-3 ${i % 2 === 0 ? 'lg:text-right' : ''}`}>{step.num}</div>
                    <h3 className="text-lg font-bold text-ink mb-2">{step.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* center circle */}
                <div className={`hidden lg:flex w-14 h-14 ${step.color} rounded-full items-center justify-center text-white shadow-lg flex-shrink-0 z-10`}>
                  {step.icon}
                </div>

                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ INTERVIEW ════════════════════ */
function InterviewSection() {
  const tips = [
    'Говорите уверенно и чётко. Университет оценивает вашу уверенность, а не идеальный английский.',
    'Заранее подготовьте ответы на вопросы о себе, своей семье и мотивации к учёбе.',
    'Расскажите о своих достижениях в школе — академических и внеучебных.',
    'Объясните, почему вы выбрали именно AIU и конкретную специальность.',
    'Будьте честны. Комиссия ценит искренность больше, чем заученные шаблонные ответы.',
    'Убедитесь в стабильном интернет-соединении, тихом месте и хорошем освещении.',
  ]

  const questions = [
    'Tell me about yourself.',
    'Why did you choose AIU?',
    'Why did you choose this program?',
    'What are your goals after graduation?',
    'Tell me about your family.',
    'What are your strengths and weaknesses?',
    'Describe a challenge you overcame.',
    'Why should we give you the scholarship?',
  ]

  return (
    <section className="py-24 bg-[#F7F8FA]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><Mic2 size={12} /> Интервью</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            Вступительное интервью
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Интервью — финальный этап перед получением оффера. Tarjuman Education проводит подготовительные сессии с каждым студентом.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Format */}
          <motion.div {...fadeUp(0.05)} className="bg-white rounded-2xl border border-border p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Monitor size={20} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-ink text-lg mb-3">Формат интервью</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {[
                'Проводится онлайн (Zoom/Teams)',
                'Длительность: 20–40 минут',
                'Язык: английский',
                '1–3 члена приёмной комиссии',
                'Возможно собеседование на арабском',
                'Уведомление за 1–2 недели',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <ChevronRight size={13} className="text-brand-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* What they assess */}
          <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl border border-border p-6">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
              <Users size={20} className="text-brand-600" />
            </div>
            <h3 className="font-bold text-ink text-lg mb-3">Что оценивает комиссия</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {[
                'Мотивация к обучению',
                'Уровень английского языка',
                'Академический потенциал',
                'Финансовая необходимость',
                'Личностные качества',
                'Цели после окончания',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-brand-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tips */}
          <motion.div {...fadeUp(0.15)} className="bg-white rounded-2xl border border-border p-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Star size={20} className="text-green-600" />
            </div>
            <h3 className="font-bold text-ink text-lg mb-3">Советы по подготовке</h3>
            <ul className="space-y-2 text-sm text-muted">
              {tips.slice(0, 5).map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Frequent questions */}
        <motion.div {...fadeUp(0.2)} className="mt-10 bg-white rounded-2xl border border-border p-8">
          <h3 className="font-bold text-ink text-lg mb-5">Частые вопросы на интервью</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {questions.map((q, i) => (
              <div key={q} className="flex items-center gap-3 bg-[#F7F8FA] rounded-xl p-3 text-sm">
                <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-ink font-medium italic">"{q}"</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">
            * Tarjuman Education проводит полноценную подготовку к интервью — тренировочные сессии с разбором ответов на английском языке.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════ GALLERY ════════════════════ */
function GallerySection() {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80&auto=format',
      label: 'Кампус AIU',
      span: 'col-span-2',
    },
    {
      src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80&auto=format',
      label: 'Общежитие',
      span: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80&auto=format',
      label: 'Студенческая жизнь',
      span: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80&auto=format',
      label: 'Учебные аудитории',
      span: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&q=80&auto=format',
      label: 'Малайзия',
      span: 'col-span-2',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <SectionLabel>📸 Галерея</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            Жизнь в AIU
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Современный кампус, комфортабельные общежития и студенческая жизнь в Малайзии.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative group rounded-2xl overflow-hidden ${img.span} aspect-video`}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {img.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ FAQ ════════════════════ */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Можно ли поступить в AIU без IELTS?',
      a: 'Да. IELTS и TOEFL не являются обязательными документами для подачи заявки. Если у вас нет языкового сертификата — это не помешает подать заявку. После зачисления студенты проходят внутренний языковой тест AIU.',
    },
    {
      q: 'Есть ли общежитие в AIU?',
      a: 'Да, все студенты AIU обеспечены местом в кампусных общежитиях. Проживание полностью покрывается стипендией — студент ничего не платит. Общежития оснащены кондиционерами, Wi-Fi и всеми необходимыми удобствами.',
    },
    {
      q: 'Что именно покрывает стипендия AIU?',
      a: 'Стипендия покрывает: обучение (tuition fee), проживание в общежитии и трёхразовое питание. Не покрывается: авиабилет до Малайзии, виза, EMGS (регистрация для визы), возвратный депозит и личные расходы.',
    },
    {
      q: 'Можно ли поступить сразу после школы?',
      a: 'Да. AIU принимает выпускников школ. Более того — предпочтительный возраст кандидатов до 20 лет, поэтому подача сразу после 11 класса — это оптимальный вариант.',
    },
    {
      q: 'Какой максимальный возраст для поступления?',
      a: 'Предпочтительно до 20 лет. В отдельных случаях университет может рассматривать кандидатов до 22 лет. Кандидатам старше рекомендуем рассмотреть другие программы.',
    },
    {
      q: 'На каком языке ведётся обучение в AIU?',
      a: 'Все программы в AIU ведутся на английском языке. Хорошее знание английского значительно помогает, но отсутствие сертификата IELTS или TOEFL не является препятствием для подачи.',
    },
    {
      q: 'Какие специальности доступны в AIU?',
      a: 'AIU предлагает программы по Computer Science, Data Science, Business Administration, Marketing, Economics, Islamic Finance, Politics & International Relations, Education и Media & Communication. Перечень программ уточняйте актуальный — на текущий год.',
    },
    {
      q: 'Как проходит интервью в AIU?',
      a: 'Интервью проводится онлайн (через Zoom или Teams) на английском языке. Длительность — 20–40 минут. Комиссия оценивает мотивацию, уровень английского, академический потенциал и личностные качества. Tarjuman Education помогает подготовиться.',
    },
    {
      q: 'Сколько стоит виза в Малайзию?',
      a: 'Стоимость студенческой визы через EMGS Malaysia составляет порядка $120–150 (единоразово). Tarjuman Education помогает со всеми документами для визового процесса.',
    },
    {
      q: 'Сколько длится процесс поступления?',
      a: 'Полный процесс от подачи документов до получения оффера занимает 2–4 месяца. Визовый процесс после оффера — ещё 1–2 месяца. Рекомендуем начинать подготовку за 3–6 месяцев до желаемой даты начала учёбы.',
    },
    {
      q: 'Помогает ли Tarjuman Education с переводом документов?',
      a: 'Да. Перевод документов на английский язык — одна из ключевых услуг Tarjuman Education. Мы делаем профессиональный перевод всех необходимых документов: аттестатов, оценок, справок и других.',
    },
    {
      q: 'Можно ли получить стипендию, если семья не бедная?',
      a: 'Стипендия AIU ориентирована на студентов из семей с ограниченными финансовыми возможностями. При подаче необходимо предоставить подтверждение дохода родителей. Финансовое положение семьи — один из ключевых критериев.',
    },
    {
      q: 'Принимаются ли студенты из Узбекистана, Казахстана, Таджикистана?',
      a: 'Да. AIU принимает студентов из всех стран СНГ — Узбекистана, Казахстана, Таджикистана, Кыргызстана, Азербайджана и других. Университет специально ориентирован на студентов из развивающихся стран.',
    },
    {
      q: 'Нужно ли знать малайский язык?',
      a: 'Нет. Обучение ведётся на английском языке. Знание малайского не требуется, хотя студенты в процессе жизни в Малайзии естественным образом его изучают.',
    },
    {
      q: 'Можно ли работать во время учёбы в Малайзии?',
      a: 'Студенческая виза в Малайзии позволяет работать до 20 часов в неделю в период семестра и без ограничений во время каникул. Кампус AIU предоставляет все необходимые условия, поэтому срочная необходимость работать отсутствует.',
    },
    {
      q: 'Есть ли у AIU международное признание?',
      a: 'Да. AIU аккредитован Малайзийским агентством квалификаций (MQA). Диплом признаётся во многих странах мира и ценится работодателями, особенно в регионе Юго-Восточной Азии и странах Ближнего Востока.',
    },
    {
      q: 'Как написать Personal Statement для AIU?',
      a: 'Personal Statement — это эссе о вашей мотивации, целях и причинах выбора AIU. Его нужно писать искренне, рассказывая о своих достижениях и планах. Tarjuman Education помогает структурировать и написать убедительный Personal Statement.',
    },
    {
      q: 'Что такое возвратный депозит AIU?',
      a: 'Возвратный депозит — единоразовая сумма, которую студент вносит при поступлении и получает обратно по окончании учёбы. Точную сумму уточняйте у менеджера Tarjuman Education.',
    },
    {
      q: 'Насколько безопасно жить в Малайзии?',
      a: 'Малайзия — одна из самых безопасных стран Юго-Восточной Азии. Алор-Стар — спокойный город с низким уровнем преступности. Кампус AIU — охраняемая территория с круглосуточной безопасностью.',
    },
    {
      q: 'Как начать процесс поступления через Tarjuman Education?',
      a: 'Напишите нам в Telegram @TARJUMAN_EDU или WhatsApp. Менеджер проконсультирует вас бесплатно, проверит соответствие требованиям и составит индивидуальный план поступления. Сопровождение — от первого звонка до регистрации в кампусе.',
    },
  ]

  return (
    <section className="py-24 bg-[#F7F8FA]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel>❓ FAQ</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            Часто задаваемые вопросы
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            {faqs.length} подробных ответа на самые частые вопросы о поступлении в AIU
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
              className="bg-white rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#F7F8FA] transition-colors"
              >
                <span className="font-semibold text-ink">{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={18} className="text-muted" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-muted text-sm leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ TESTIMONIALS ════════════════════ */
function TestimonialsSection() {
  const reviews = [
    {
      name: 'Азизбек М.',
      country: '🇺🇿 Узбекистан',
      program: 'Computer Science',
      year: '2024',
      text: 'Tarjuman Education помогли мне с нуля собрать все документы и подготовиться к интервью. Я не знал, с чего начать, но менеджеры объяснили каждый шаг. Сейчас учусь в AIU по полной стипендии!',
      rating: 5,
    },
    {
      name: 'Малика К.',
      country: '🇰🇿 Казахстан',
      program: 'Business Administration',
      year: '2024',
      text: 'Была очень волнительно — первый раз за рубеж и сразу в университет. Ребята из Tarjuman Education были на связи 24/7, помогли написать Personal Statement и подготовились к интервью. Получила оффер!',
      rating: 5,
    },
    {
      name: 'Фаррух Т.',
      country: '🇹🇯 Таджикистан',
      program: 'Islamic Finance',
      year: '2023',
      text: 'Думал, что без IELTS не возьмут. Оказалось, AIU не требует IELTS! Tarjuman Education объяснили всё подробно. Документы перевели быстро и качественно. Рекомендую всем!',
      rating: 5,
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><Star size={12} /> Отзывы</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            Студенты о Tarjuman Education
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Реальные истории студентов, поступивших в AIU с помощью Tarjuman Education
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#F7F8FA] rounded-2xl p-6 border border-border hover:border-brand-200 hover:shadow-card transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className={s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-border'} />
                ))}
              </div>
              <p className="text-sm text-ink leading-relaxed mb-5 italic">"{r.text}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-bold text-ink">{r.name}</p>
                <p className="text-xs text-muted mt-0.5">{r.country} · {r.program} · {r.year}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.2)} className="mt-10 bg-[#F7F8FA] rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-muted text-sm">
            Вы поступили в AIU с помощью Tarjuman Education? Поделитесь своей историей — напишите нам в{' '}
            <a href={TG_LINK} className="text-brand-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">
              Telegram @TARJUMAN_EDU
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════ CTA ════════════════════ */
function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0a2e26] via-[#0d3b30] to-[#1a4a3a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.div {...fadeUp()}>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white/70 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Приём заявок открыт · 2025–2026
          </div>
        </motion.div>

        <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-5xl font-black text-white mb-6 leading-[1.1]">
          Начните обучение в Малайзии<br />
          <span className="text-brand-300">по полной стипендии</span>
        </motion.h2>

        <motion.p {...fadeUp(0.1)} className="text-lg text-white/65 mb-10 leading-relaxed">
          Оставьте заявку — и специалисты Tarjuman Education помогут вам пройти весь путь
          от подготовки документов до получения оффера и прибытия в кампус.
        </motion.p>

        <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-brand-400 hover:bg-brand-300 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-[0_8px_40px_rgba(111,175,155,0.5)] hover:-translate-y-0.5"
          >
            <GraduationCap size={22} />
            Подать заявку
          </a>
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-5 rounded-2xl text-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <Send size={20} />
            Написать в Telegram
          </a>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { v: 'Бесплатно', l: 'Первая консультация' },
            { v: '24/7', l: 'Поддержка студентов' },
            { v: '100%', l: 'Сопровождение' },
            { v: 'от A до Я', l: 'Все этапы с нами' },
          ].map(s => (
            <div key={s.l} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-xl font-black text-white">{s.v}</div>
              <div className="text-xs text-white/50 mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
