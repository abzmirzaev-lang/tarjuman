'use client'
import { useState } from 'react'
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
  const [lang, setLang] = useState<AppLanguage>('ru')
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
                  className="group flex items-center gap-5 bg-white border border-border rounded-2xl p-5 hover:border-[#1B4332]/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1B4332]/8 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-[#1B4332]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted mb-0.5">{c.label}</p>
                    <p className="font-semibold text-ink truncate group-hover:text-[#1B4332] transition-colors">{c.value}</p>
                    <p className="text-xs text-muted mt-0.5">{isRu ? c.desc_ru : c.desc_en}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-[#1B4332] group-hover:translate-x-1 transition-all shrink-0" />
                </motion.a>
              ))}

              {/* FAQ link */}
              <motion.div {...fadeUp(0.24)} className="bg-[#1B4332]/5 border border-[#1B4332]/15 rounded-2xl p-5">
                <p className="font-semibold text-ink text-sm mb-1">
                  {isRu ? 'Уже есть вопрос?' : 'Already have a question?'}
                </p>
                <p className="text-muted text-sm mb-3">
                  {isRu ? 'Возможно, ответ уже есть в разделе FAQ.' : 'The answer might already be in our FAQ section.'}
                </p>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B4332] hover:text-[#C9922A] transition-colors"
                >
                  {isRu ? 'Перейти в FAQ' : 'Go to FAQ'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>

            {/* Right — form */}
            <motion.div {...fadeUp(0.1)}>
              <div className="bg-white border border-border rounded-2xl p-7 shadow-sm">
                <h3 className="font-bold text-ink text-lg mb-1">
                  {isRu ? 'Написать нам' : 'Send us a message'}
                </h3>
                <p className="text-muted text-sm mb-6">
                  {isRu ? 'Ответим в течение 24 часов' : 'We\'ll reply within 24 hours'}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label={isRu ? 'Ваше имя' : 'Your name'}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="label">{isRu ? 'Сообщение' : 'Message'}</label>
                    <textarea
                      className="input h-32 resize-none"
                      placeholder={isRu ? 'Опишите ваш вопрос...' : 'Describe your question...'}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    loading={loading}
                    size="lg"
                    className="w-full"
                    iconRight={<Send className="w-4 h-4" />}
                  >
                    {isRu ? 'Отправить сообщение' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── CTA STRIP ─────────────────────────────────────── */}
      <section className="bg-[#1B4332] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-white mb-4"
          >
            {isRu ? 'Готовы начать поступление?' : 'Ready to start your application?'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-white/60 text-sm mb-8"
          >
            {isRu ? 'Подайте заявку сейчас — мы возьмём всё на себя.' : 'Apply now — we\'ll handle everything.'}
          </motion.p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#D4A943] text-[#1B4332] font-semibold text-sm hover:bg-[#C9922A] transition-colors"
          >
            {isRu ? 'Подать заявку' : 'Apply now'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer lang={lang} />
    </>
  )
}
