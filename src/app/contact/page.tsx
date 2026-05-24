'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Phone, Send } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button, Input } from '@/components/ui'
import { toast } from 'sonner'
import type { AppLanguage } from '@/types'

export default function ContactPage() {
  const [lang, setLang] = useState<AppLanguage>('ru')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Here you'd POST to /api/contact
    await new Promise(r => setTimeout(r, 1000))
    toast.success(lang === 'ru' ? 'Сообщение отправлено! Ответим в течение 24 часов.' : 'Message sent!')
    setForm({ name: '', email: '', message: '' })
    setLoading(false)
  }

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        <div className="container-narrow py-16 max-w-5xl">
          <h1 className="page-title mb-3">
            {lang === 'ru' ? 'Свяжитесь с нами' : lang === 'uz' ? 'Biz bilan bog\'laning' : 'Contact Us'}
          </h1>
          <p className="page-subtitle mb-10">
            {lang === 'ru' ? 'Ответим на ваши вопросы в течение 24 часов' : 'We\'ll reply within 24 hours'}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="card p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={lang === 'ru' ? 'Имя' : 'Name'}
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
                  <label className="label">{lang === 'ru' ? 'Сообщение' : 'Message'}</label>
                  <textarea
                    className="input h-32 resize-none"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" loading={loading} size="lg" className="w-full"
                  iconRight={<Send className="w-4 h-4" />}>
                  {lang === 'ru' ? 'Отправить' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Channels */}
            <div className="space-y-4">
              {[
                { icon: MessageSquare, label: 'Telegram', value: '@tarjumanuz', href: 'https://t.me/tarjumanuz', color: 'bg-blue-50 text-blue-600' },
                { icon: Mail, label: 'Email', value: 'info@tarjuman.com', href: 'mailto:info@tarjuman.com', color: 'bg-brand-50 text-brand-600' },
                { icon: Phone, label: lang === 'ru' ? 'Телефон' : 'Phone', value: '+998 90 123 45 67', href: 'tel:+998901234567', color: 'bg-purple-50 text-purple-600' },
              ].map((c, i) => (
                <motion.a
                  key={i}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.color}`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">{c.label}</p>
                    <p className="font-medium text-ink group-hover:text-brand-500 transition-colors">{c.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
