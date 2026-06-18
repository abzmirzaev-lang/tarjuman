'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { useLanguage } from '@/hooks/useLanguage'
import { t, type Lang } from './translations'
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
  const [lang, setLang] = useLanguage()

  const tr = t[lang as Lang] ?? t.ru

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <Navbar lang={lang} onLangChange={setLang} />

      <main className="min-h-screen bg-[#F7F8FA] overflow-x-hidden">
        <HeroSection tr={tr} />
        <AboutSection tr={tr} />
        <WhyAIUSection tr={tr} />
        <ProgramsSection tr={tr} />
        <ScholarshipSection tr={tr} />
        <RequirementsSection tr={tr} />
        <DocumentsSection tr={tr} />
        <IELTSSection tr={tr} />
        <ProcessSection tr={tr} />
        <InterviewSection tr={tr} />
        <FAQSection tr={tr} lang={lang as Lang} />
        <CTASection tr={tr} />
      </main>
    </>
  )
}

/* ════════════════════ HERO ════════════════════ */
function HeroSection({ tr }: { tr: typeof import('./translations').t.ru }) {
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
          <motion.div {...fadeUp(0.05)} className="flex flex-wrap gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {tr.badge}
            </div>
            <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur border border-red-400/40 rounded-full px-4 py-2 text-red-200 text-sm font-bold">
              <Clock size={13} className="text-red-300" />
              {tr.deadline}
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] mb-6">
            Albukhary<br />
            <span className="text-brand-300">International</span><br />
            University
          </motion.h1>

          <motion.p {...fadeUp(0.18)} className="text-lg text-white/70 mb-4 leading-relaxed">
            {tr.heroSub}
          </motion.p>

          <motion.p {...fadeUp(0.22)} className="text-white/60 text-base leading-relaxed mb-10 max-w-xl">
            {tr.heroDesc}
          </motion.p>

          {/* stats strip */}
          <motion.div {...fadeUp(0.27)} className="grid grid-cols-3 gap-4 mb-10">
            {[
              { value: '100%', label: tr.stat1 },
              { value: '60+', label: tr.stat2 },
              { value: '9', label: tr.stat3 },
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
              {tr.btnApply}
            </a>
            <a
              href={TG_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1a8dc5] text-white font-semibold px-6 py-4 rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5"
            >
              <Send size={18} />
              {tr.btnTg}
            </a>

          </motion.div>

          <motion.div {...fadeUp(0.37)} className="flex flex-wrap gap-3 mt-6">
            <a
              href="https://aiu.edu.my/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/18 border border-white/20 hover:border-white/35 rounded-2xl px-4 py-3 transition-all group"
            >
              <div className="w-9 h-9 bg-white/15 group-hover:bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <Globe size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">{tr.linkSiteLabel}</p>
                <p className="text-white/55 text-xs mt-0.5">{tr.linkSiteSub}</p>
              </div>
            </a>
            <a
              href="https://www.instagram.com/aiuedu?igsh=MWRvZ3NrejNsc3htbg=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 hover:bg-pink-500/15 border border-white/20 hover:border-pink-400/40 rounded-2xl px-4 py-3 transition-all group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-pink-500/40 to-purple-600/40 group-hover:from-pink-500/60 group-hover:to-purple-600/60 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">{tr.linkIgLabel}</p>
                <p className="text-white/55 text-xs mt-0.5">{tr.linkIgSub}</p>
              </div>
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
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOBGwqqltcCvK3ekMNqYExsnTHPT3co-WEfLTX9wot6w&s=10"
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
                <p className="text-xs font-bold text-ink">{tr.b1t}</p>
                <p className="text-[10px] text-muted">100%</p>
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
                <p className="text-xs font-bold text-ink">{tr.b8t}</p>
                <p className="text-[10px] text-muted">60+</p>
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
              <p className="text-xs font-bold text-ink">{tr.b6t}</p>
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
function AboutSection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const stats = [
    { icon: <Calendar size={20} />, label: tr.statFounded, value: '2012' },
    { icon: <MapPin size={20} />, label: tr.statLocation, value: 'Alor Setar, Kedah' },
    { icon: <Globe size={20} />, label: tr.statLang, value: tr.statLangVal },
    { icon: <Users size={20} />, label: tr.statStudents, value: '60+' },
    { icon: <Award size={20} />, label: tr.statAccred, value: 'MQA' },
    { icon: <GraduationCap size={20} />, label: tr.statDiploma, value: tr.statDiplomaVal },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <SectionLabel><Building2 size={12} /> {tr.aboutLabel}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-ink mb-6 leading-tight">
              {tr.aboutTitle}<br />
              <span className="text-brand-600">{tr.aboutTitleSpan}</span>
            </h2>
            <p className="text-muted leading-relaxed mb-5">
              {tr.aboutP1}
            </p>
            <p className="text-muted leading-relaxed mb-5">
              {tr.aboutP2}
            </p>
            <p className="text-muted leading-relaxed">
              {tr.aboutP3}
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
function WhyAIUSection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const benefits = [
    {
      icon: <Award className="text-amber-500" size={28} />,
      bg: 'bg-amber-50',
      title: tr.b1t,
      desc: tr.b1d
    },
    {
      icon: <BookOpen className="text-brand-600" size={28} />,
      bg: 'bg-brand-50',
      title: tr.b2t,
      desc: tr.b2d
    },
    {
      icon: <Home className="text-purple-500" size={28} />,
      bg: 'bg-purple-50',
      title: tr.b3t,
      desc: tr.b3d
    },
    {
      icon: <Utensils className="text-rose-500" size={28} />,
      bg: 'bg-rose-50',
      title: tr.b4t,
      desc: tr.b4d
    },
    {
      icon: <Globe className="text-blue-500" size={28} />,
      bg: 'bg-blue-50',
      title: tr.b5t,
      desc: tr.b5d
    },
    {
      icon: <GraduationCap className="text-indigo-500" size={28} />,
      bg: 'bg-indigo-50',
      title: tr.b6t,
      desc: tr.b6d
    },
    {
      icon: <Building2 className="text-teal-500" size={28} />,
      bg: 'bg-teal-50',
      title: tr.b7t,
      desc: tr.b7d
    },
    {
      icon: <Users className="text-orange-500" size={28} />,
      bg: 'bg-orange-50',
      title: tr.b8t,
      desc: tr.b8d
    },
  ]

  return (
    <section className="py-24 bg-[#F7F8FA]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><Star size={12} /> {tr.whyLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            {tr.whyTitle}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            {tr.whyDesc}
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
function ProgramsSection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const programs = [
    {
      icon: <Monitor size={22} />,
      color: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      faculty: tr.p1name,
      programs: [tr.p1p1],
      degree: tr.p1deg,
    },
    {
      icon: <Briefcase size={22} />,
      color: 'from-brand-500 to-brand-700',
      bg: 'bg-brand-50',
      text: 'text-brand-700',
      faculty: tr.p2name,
      programs: [tr.p2p1, tr.p2p2, tr.p2p3],
      degree: tr.p2deg,
    },
    {
      icon: <TrendingUp size={22} />,
      color: 'from-emerald-500 to-emerald-700',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      faculty: tr.p3name,
      programs: [tr.p3p1],
      degree: tr.p3deg,
    },
    {
      icon: <Landmark size={22} />,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      faculty: tr.p4name,
      programs: [tr.p4p1],
      degree: tr.p4deg,
    },
    {
      icon: <Globe size={22} />,
      color: 'from-purple-500 to-purple-700',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      faculty: tr.p5name,
      programs: [tr.p5p1],
      degree: tr.p5deg,
    },
    {
      icon: <Users size={22} />,
      color: 'from-cyan-500 to-cyan-700',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      faculty: tr.p6name,
      programs: [tr.p6p1],
      degree: tr.p6deg,
    },
    {
      icon: <Heart size={22} />,
      color: 'from-rose-500 to-rose-700',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      faculty: tr.p7name,
      programs: [tr.p7p1, tr.p7p2],
      degree: tr.p7deg,
    },
    {
      icon: <Newspaper size={22} />,
      color: 'from-indigo-500 to-indigo-700',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      faculty: tr.p8name,
      programs: [tr.p8p1],
      degree: tr.p8deg,
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><BookOpen size={12} /> {tr.progLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            {tr.progTitle}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
{tr.progDesc}
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
              className="group bg-[#F7F8FA] hover:bg-white border border-transparent hover:border-border rounded-2xl p-5 transition-all duration-300 hover:shadow-card"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${p.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {p.icon}
              </div>
              <div className={`inline-flex text-[11px] font-semibold uppercase tracking-wider ${p.text} ${p.bg} rounded-full px-2.5 py-0.5 mb-3 max-w-full truncate`}>
                {p.degree}
              </div>
              <h3 className="font-bold text-ink text-base mb-3 leading-snug">{p.faculty}</h3>
              <ul className="space-y-1.5">
                {p.programs.map(prog => (
                  <li key={prog} className="flex items-start gap-2 text-sm text-muted">
                    <ChevronRight size={13} className="text-brand-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug break-words min-w-0">{prog}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.2)} className="text-center text-sm text-muted mt-8">
{tr.progNote}
        </motion.p>

        {/* Preparatory English course block */}
        <motion.div
          {...fadeUp(0.25)}
          className="mt-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
                <BadgeCheck size={12} /> {tr.prepBadge}
              </div>
              <h3 className="text-xl font-bold mb-2">{tr.prepTitle}</h3>
              <p className="text-white/75 leading-relaxed text-sm max-w-2xl">
                {tr.prepDesc}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/15 border border-white/20 rounded-2xl px-5 py-4 text-center">
<p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-white/70 mt-1">{tr.prepFree}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════ SCHOLARSHIP TABLE ════════════════════ */
function ScholarshipSection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const covered = [
    { icon: <BookOpen size={16} />, item: tr.cov1 },
    { icon: <Home size={16} />, item: tr.cov2 },
    { icon: <Utensils size={16} />, item: tr.cov3 },
    { icon: <GraduationCap size={16} />, item: tr.cov4 },
    { icon: <BookOpen size={16} />, item: tr.cov5 },
  ]

  const notCovered = [
    { icon: <Plane size={16} />, item: tr.ncov1 },
    { icon: <CreditCard size={16} />, item: tr.ncov2 },
    { icon: <FileText size={16} />, item: tr.ncov3 },
    { icon: <Globe size={16} />, item: tr.ncov4 },
    { icon: <Phone size={16} />, item: tr.ncov5 },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-[#0a2e26] to-[#1a4a3a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-brand-600/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><Award size={12} /> {tr.schlLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            {tr.schlTitle}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
{tr.schlDesc}
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
<p className="font-bold text-white text-lg">{tr.schlCoveredTitle}</p>
                <p className="text-green-400/80 text-sm">{tr.schlCoveredSub}</p>
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
            {tr.schlAlert}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════ REQUIREMENTS ════════════════════ */
function RequirementsSection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const reqs = [
    { icon: <Calendar size={18} />, text: tr.req1 },
    { icon: <GraduationCap size={18} />, text: tr.req2 },
    { icon: <TrendingUp size={18} />, text: tr.req3 },
    { icon: <Globe size={18} />, text: tr.req4 },
    { icon: <FileText size={18} />, text: tr.req5 },
    { icon: <BadgeCheck size={18} />, text: tr.req6 },
  ]

  return (
    <section className="py-24 bg-[#F7F8FA]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <SectionLabel><CheckCircle size={12} /> {tr.reqLabel}</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-ink mb-6 leading-tight">
              {tr.reqTitle}
            </h2>
            <p className="text-muted leading-relaxed mb-8">
  {tr.reqDesc} Требования — адекватные, и большинство выпускников школ им соответствуют.
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
              <h3 className="text-xl font-bold mb-2">{tr.ageLabel}</h3>
              <p className="text-white/70 text-sm mb-6">{tr.ageSub}</p>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-4xl font-black text-white mb-1">{tr.age1val}</div>
  <p className="text-white/70 text-sm">{tr.age1desc}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5">
                  <div className="text-4xl font-black text-amber-300 mb-1">{tr.age2val}</div>
  <p className="text-white/70 text-sm">{tr.age2desc}</p>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-white/20">
                <p className="text-white/60 text-xs leading-relaxed">
  {tr.ageNote} {tr.ageNoteMgr}
                </p>
              </div>
            </div>

            <div className="mt-5 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 text-brand-700 font-semibold mb-2">
                <BadgeCheck size={16} /> {tr.goodNews}
              </div>
              <p className="text-sm text-muted leading-relaxed">
  {tr.goodNewsText}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ DOCUMENTS ════════════════════ */
function DocumentsSection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const required = [
tr.d1,
tr.d2,
tr.d3,
tr.d4,
tr.d5,
tr.d6,
tr.d7,
tr.d8,
tr.d9,
tr.d10,
tr.d11,
  ]

  const optional = [
tr.o1,
tr.o2,
tr.o3,
tr.o4,
tr.o5,
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel><FileText size={12} /> {tr.docLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            {tr.docTitle}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            {tr.docDesc}
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
<p className="font-bold text-ink text-lg">{tr.docReqTitle}</p>
                  <p className="text-sm text-muted">{required.length}</p>
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
<p className="font-bold text-ink text-lg">{tr.docOptTitle}</p>
                  <p className="text-sm text-muted">{tr.docOptSub}</p>
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
                  <p className="font-semibold text-blue-900 mb-1">{tr.transNote}</p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {tr.transNoteText}
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
                {tr.psNoteText}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ════════════════════ IELTS ════════════════════ */
function IELTSSection({ tr }: { tr: typeof import('./translations').t.ru }) {
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
              {tr.ieltsTitle}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              {tr.ieltsTitle}
            </h2>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
  {tr.ieltsDesc}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
{ icon: <CheckCircle size={20} />, text: tr.ielts1 },
{ icon: <CheckCircle size={20} />, text: tr.ielts2 },
{ icon: <CheckCircle size={20} />, text: tr.ielts3 },
              ].map(item => (
                <div key={item.text} className="bg-white/15 backdrop-blur rounded-2xl p-4 flex items-center gap-2 justify-center font-semibold">
                  <span className="text-green-300">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            <p className="text-white/60 text-sm">
              {tr.ieltsFooter}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════ PROCESS TIMELINE ════════════════════ */
function ProcessSection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const steps = [
    {
      num: '01',
      icon: <FileText size={20} />,
      title: tr.s1t,
      desc: tr.s1d,
      color: 'bg-blue-500',
    },
    {
      num: '02',
      icon: <Globe size={20} />,
      title: tr.s2t,
      desc: tr.s2d,
      color: 'bg-purple-500',
    },
    {
      num: '03',
      icon: <CheckCircle size={20} />,
      title: tr.s3t,
      desc: tr.s3d,
      color: 'bg-brand-500',
    },
    {
      num: '04',
      icon: <Clock size={20} />,
      title: tr.s4t,
      desc: tr.s4d,
      color: 'bg-amber-500',
    },
    {
      num: '05',
      icon: <Mic2 size={20} />,
      title: tr.s5t,
      desc: tr.s5d,
      color: 'bg-rose-500',
    },
    {
      num: '06',
      icon: <Award size={20} />,
      title: tr.s6t,
      desc: tr.s6d,
      color: 'bg-green-500',
    },
    {
      num: '07',
      icon: <CreditCard size={20} />,
      title: tr.s7t,
      desc: tr.s7d,
      color: 'bg-indigo-500',
    },
    {
      num: '08',
      icon: <Plane size={20} />,
      title: tr.s8t,
      desc: tr.s8d,
      color: 'bg-teal-500',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <SectionLabel><ArrowRight size={12} /> {tr.procLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            {tr.procTitle}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
{tr.procDesc}
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
function InterviewSection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const tips = [
    '{tr.tip1}',
    '{tr.tip2}',
    '{tr.tip3}',
    '{tr.tip4}',
    '{tr.tip5}',
    '{tr.tip6}',
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
          <SectionLabel><Mic2 size={12} /> {tr.intLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            {tr.intTitle}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
{tr.intDesc}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Format */}
          <motion.div {...fadeUp(0.05)} className="bg-white rounded-2xl border border-border p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Monitor size={20} className="text-blue-600" />
            </div>
<h3 className="font-bold text-ink text-lg mb-3">{tr.intFormatTitle}</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {[
tr.if1,
tr.if2,
tr.if3,
tr.if4,
tr.if5,
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
<h3 className="font-bold text-ink text-lg mb-3">{tr.intCriteriaTitle}</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {[
tr.ic1,
tr.ic2,
tr.ic3,
tr.ic4,
tr.ic5,
tr.ic6,
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
<h3 className="font-bold text-ink text-lg mb-3">{tr.intTipsTitle}</h3>
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
          <h3 className="font-bold text-ink text-lg mb-5">{tr.intQTitle}</h3>
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
            {tr.intQNote}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ════════════════════ GALLERY ════════════════════ */
function GallerySection({ tr }: { tr: typeof import('./translations').t.ru }) {
  const images = [
    {
      src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOBGwqqltcCvK3ekMNqYExsnTHPT3co-WEfLTX9wot6w&s=10',
label: tr.gal1,
      span: 'col-span-2',
    },
    {
      src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80&auto=format',
label: tr.gal2,
      span: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80&auto=format',
label: tr.gal3,
      span: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80&auto=format',
label: tr.gal4,
      span: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f11?w=800&q=80&auto=format',
label: tr.gal5,
      span: 'col-span-2',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <SectionLabel>📸 {tr.galLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            {tr.galTitle}
          </h2>
          <p className="text-muted max-w-xl mx-auto">
{tr.galDesc}
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
function FAQSection({ tr, lang }: { tr: typeof import('./translations').t.ru, lang: import('./translations').Lang }) {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    { q: tr.faq1q, a: tr.faq1a },
    { q: tr.faq2q, a: tr.faq2a },
    { q: tr.faq3q, a: tr.faq3a },
    { q: tr.faq4q, a: tr.faq4a },
    { q: tr.faq5q, a: tr.faq5a },
    { q: tr.faq6q, a: tr.faq6a },
    { q: tr.faq7q, a: tr.faq7a },
    { q: tr.faq8q, a: tr.faq8a },
    { q: tr.faq9q, a: tr.faq9a },
    { q: tr.faq10q, a: tr.faq10a },
    { q: tr.faq11q, a: tr.faq11a },
    { q: tr.faq12q, a: tr.faq12a },
    { q: tr.faq13q, a: tr.faq13a },
    { q: tr.faq14q, a: tr.faq14a },
    { q: tr.faq15q, a: tr.faq15a },
    { q: tr.faq16q, a: tr.faq16a },
    { q: tr.faq17q, a: tr.faq17a },
    { q: tr.faq18q, a: tr.faq18a },
    { q: tr.faq19q, a: tr.faq19a },
    { q: tr.faq20q, a: tr.faq20a },
  ]

  return (
    <section className="py-24 bg-[#F7F8FA]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionLabel>❓ {tr.faqLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            {tr.faqTitle}
          </h2>
          <p className="text-muted max-w-xl mx-auto">
{tr.faqDesc}
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
function TestimonialsSection({ tr }: { tr: typeof import('./translations').t.ru }) {
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
          <SectionLabel><Star size={12} /> {tr.revLabel}</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-ink mb-4">
            {tr.revTitle}
          </h2>
          <p className="text-muted max-w-xl mx-auto">
{tr.revDesc}
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
  {tr.revShareText}{' '}
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
function CTASection({ tr }: { tr: typeof import('./translations').t.ru }) {
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
{tr.ctaBadge}
          </div>
        </motion.div>

        <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-5xl font-black text-white mb-6 leading-[1.1]">
          {tr.ctaTitle}<br />
          <span className="text-brand-300">{tr.ctaTitleSpan}</span>
        </motion.h2>

        <motion.p {...fadeUp(0.1)} className="text-lg text-white/65 mb-10 leading-relaxed">
{tr.ctaDesc}
        </motion.p>

        <motion.div {...fadeUp(0.15)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-brand-400 hover:bg-brand-300 text-white font-bold px-10 py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-[0_8px_40px_rgba(111,175,155,0.5)] hover:-translate-y-0.5"
          >
            <GraduationCap size={22} />
{tr.ctaBtn}
          </a>
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-5 rounded-2xl text-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <Send size={20} />
            {tr.ctaBtnTg}
          </a>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
{ v: tr.cta1v, l: tr.cta1l },
{ v: tr.cta2v, l: tr.cta2l },
{ v: tr.cta3v, l: tr.cta3l },
{ v: tr.cta4v, l: tr.cta4l },
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
