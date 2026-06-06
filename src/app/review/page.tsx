'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { useLanguage } from '@/hooks/useLanguage'

const COUNTRIES = [
  '🇺🇿 Узбекистан', '🇰🇿 Казахстан', '🇹🇯 Таджикистан',
  '🇰🇬 Кыргызстан', '🇹🇲 Туркменистан', '🇦🇿 Азербайджан',
  '🇷🇺 Россия', '🇺🇦 Украина', '🇧🇾 Беларусь', 'Другое',
]

export default function ReviewPage() {
  const [lang, setLang] = useLanguage()
  const [form, setForm] = useState({ name: '', country: '', university: '', text: '', stars: 5 })
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const t = (ru: string, uz: string, en: string) =>
    lang === 'uz' ? uz : lang === 'en' ? en : ru

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.text.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSubmitted(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      <div className="min-h-screen bg-[#F7F8FA] pt-16">

        {/* Hero */}
        <div className="bg-ink text-white py-14 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-violet-900/10 pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl mx-auto text-center relative z-10">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-brand-400 text-brand-400" />
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-3">
              {t('Оставьте отзыв', 'Fikr qoldiring', 'Leave a Review')}
            </h1>
            <p className="text-white/60 text-base max-w-sm mx-auto">
              {t(
                'Ваш опыт помогает другим студентам сделать правильный выбор',
                'Sizning tajribangiz boshqa talabalarga to\'g\'ri tanlov qilishga yordam beradi',
                'Your experience helps other students make the right choice'
              )}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-border shadow-xl p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-black text-ink mb-2">
                  {t('Спасибо!', 'Rahmat!', 'Thank you!')}
                </h2>
                <p className="text-muted text-sm">
                  {t(
                    'Ваш отзыв получен. Мы ценим ваше доверие.',
                    'Fikringiz qabul qilindi. Ishonchingiz uchun minnatdormiz.',
                    'Your review has been received. We appreciate your trust.'
                  )}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-border shadow-xl p-8"
              >
                {/* Stars */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
                    {t('Ваша оценка', 'Bahoyingiz', 'Your rating')}
                  </p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setForm(f => ({ ...f, stars: s }))}>
                        <Star className={`w-9 h-9 transition-all duration-150 ${s <= form.stars ? 'text-amber-400 fill-amber-400 scale-110' : 'text-border hover:text-amber-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">
                      {t('Ваше имя', 'Ismingiz', 'Your name')} *
                    </label>
                    <input
                      className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                      placeholder={t('Имя Фамилия', 'Ism Familiya', 'Full Name')}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">
                      {t('Страна', 'Mamlakat', 'Country')}
                    </label>
                    <select
                      className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 bg-white text-ink"
                      value={form.country}
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    >
                      <option value="">{t('Выберите страну', 'Mamlakatni tanlang', 'Select country')}</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* University */}
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">
                      {t('Университет', 'Universitet', 'University')}
                    </label>
                    <input
                      className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                      placeholder={t('Куда поступили?', 'Qayerga qabul bo\'ldingiz?', 'Where did you enroll?')}
                      value={form.university}
                      onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5">
                      {t('Ваш отзыв', 'Fikringiz', 'Your review')} *
                    </label>
                    <textarea
                      className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition resize-none h-36"
                      placeholder={t(
                        'Расскажите о вашем опыте работы с Tarjuman Edu...',
                        'Tarjuman Edu bilan tajribangiz haqida gapirib bering...',
                        'Tell us about your experience with Tarjuman Edu...'
                      )}
                      value={form.text}
                      onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={sending || !form.name.trim() || !form.text.trim()}
                  className="w-full mt-5 py-4 rounded-2xl bg-brand-400 text-ink font-bold text-sm hover:bg-brand-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-400/20"
                >
                  {sending
                    ? <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    : <><Send className="w-4 h-4" />{t('Отправить отзыв', 'Fikrni yuborish', 'Submit review')}</>
                  }
                </button>

                <p className="text-center text-xs text-muted mt-4">
                  {t(
                    'Отзыв появится на сайте после проверки',
                    'Fikr tekshirilgandan so\'ng saytda paydo bo\'ladi',
                    'Review will appear on the site after moderation'
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
