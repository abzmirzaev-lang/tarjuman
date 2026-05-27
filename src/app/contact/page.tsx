'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button, Input } from '@/components/ui'
import { toast } from 'sonner'
import type { AppLanguage } from '@/types'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
})

const CHANNELS = [
  {
    icon: MessageSquare,
    label: 'Telegram',
    value: '@TARJUMAN_KSA',
    desc_ru: 'Отвечаем в течение нескольких часов',
    desc_en: 'We reply within a few hours',
    href: 'https://t.me/TARJUMAN_KSA',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'tarjuman777@gmail.com',
    desc_ru: 'Для официальных запросов и документов',
    desc_en: 'For official inquiries and documents',
    href: 'mailto:tarjuman777@gmail.com',
  },
]

export default function ContactPage() {
  const [lang, setLang] = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const isRu = lang === 'ru'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success(isRu ? 'Сообщение отправлено! Ответим в течение 24 часов.' : 'Message sent! We\'ll reply within 24 hours.')
    setForm({ name: '', email: '', message: '' })
    setLoading(false)
  }

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="bg-[#1B4332] pt-16">
        <div className="max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <motion.p {...fadeUp(0)} className="text-[#D4A943] text-xs font-semibold uppercase tracking-[0.2em] mb-5">
            {isRu ? 'Контакты' : 'Contact'}
          </motion.p>
          <motion.h1 {...fadeUp(0.08)} className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
            {isRu ? 'Мы готовы помочь' : 'We are here to help'}
          </motion.h1>
          <motion.p {...fadeUp(0.15)} className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {isRu
              ? 'Задайте вопрос — ответим в течение нескольких часов. Для срочных вопросов пишите в Telegram.'
              : 'Ask a question — we reply within a few hours. For urgent matters, write on Telegram.'}
          </motion.p>
        </div>
      </section>

      {/* ── MAIN ──────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 items-start">

            {/* Left — channels + info */}
            <div className="space-y-5">
              <motion.div {...fadeUp(0)}>
                <p className="text-[#D4A943] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
                  {isRu ? 'Способы связи' : 'Get in touch'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-2">
                  {isRu ? 'Выберите удобный канал' : 'Choose a convenient channel'}
                </h2>
                <p className="text-muted text-sm leading-relaxed">
                  {isRu
                    ? 'Работаем каждый день. Telegram — самый быстрый способ получить ответ.'
                    : 'We work every day. Telegram is the fastest way to get a reply.'}
                </p>
              </motion.div>

              {CHANNELS.map((c, i) => (
                <motion.a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...fadeUp(0.08 + i * 0.08)}
                  className="group flex items-center gap-5 bg-white border border-border rounded-2xl p