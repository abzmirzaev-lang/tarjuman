'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
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
    value: '@tarjumanedu',
    desc_ru: 'Отвечаем в течение нескольких часов',
    desc_en: 'We reply within a few hours',
    href: 'https://t.me/tarjumanedu',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'support@tarjumanedu.com',
    desc_ru: 'Для официальных запросов и документов',
    desc_en: 'For official inquiries and documents',
    href: 'mailto:support@tarjumanedu.com',
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
                  className="group flex items-center gap-5 bg-white border border-border rounded-2xl p-5 hover:border-brand-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                    <c.icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted mb-0.5">{c.label}</p>
                    <p className="font-semibold text-ink text-sm">{c.value}</p>
                    <p className="text-xs text-muted mt-0.5">{isRu ? c.desc_ru : c.desc_en}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-brand-500 group-hover:translate-x-1 transition-all shrink-0" />
                </motion.a>
              ))}
            </div>

            {/* Right — contact form */}
            <motion.div {...fadeUp(0.1)}>
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8">
                <h2 className="text-xl font-bold text-ink mb-6">
                  {isRu ? 'Написать нам' : 'Send us a message'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">
                      {isRu ? 'Ваше имя' : 'Your name'}
                    </label>
                    <Input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder={isRu ? 'Имя Фамилия' : 'Full Name'}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">Email</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">
                      {isRu ? 'Сообщение' : 'Message'}
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder={isRu ? 'Ваш вопрос...' : 'Your question...'}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-ink text-white rounded-xl font-semibold text-sm hover:bg-ink/90 disabled:opacity-60 transition-all"
                  >
                    {loading
                      ? (isRu ? 'Отправляем...' : 'Sending...')
                      : (isRu ? 'Отправить сообщение' : 'Send message')
                    }
                    {!loading && <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </>
  )
}
