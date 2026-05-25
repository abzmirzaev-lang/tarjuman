'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, CheckCircle2 } from 'lucide-react'

interface Review {
  id: string
  name: string
  country: string
  university: string
  text: string
  stars: number
  created_at: string
}

const COUNTRIES = [
  '🇺🇿 Узбекистан', '🇰🇿 Казахстан', '🇹🇯 Таджикистан',
  '🇰🇬 Кыргызстан', '🇹🇲 Туркменистан', '🇦🇿 Азербайджан',
  '🇷🇺 Россия', '🇺🇦 Украина', '🇧🇾 Беларусь', 'Другое',
]

export default function ReviewsSection({ lang = 'ru' }: { lang?: string }) {
  const [reviews, setReviews]   = useState<Review[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]   = useState(false)

  const [form, setForm] = useState({
    name: '', country: '', university: '', text: '', stars: 5,
  })

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => { setReviews(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.text.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setReviews(prev => [data, ...prev])
        setSubmitted(true)
        setShowForm(false)
        setForm({ name: '', country: '', university: '', text: '', stars: 5 })
      }
    } finally {
      setSending(false)
    }
  }

  const title       = lang === 'ru' ? 'Отзывы студентов'         : lang === 'uz' ? 'Talabalar fikrlari'       : 'Student Reviews'
  const subtitle    = lang === 'ru' ? 'Реальные истории наших студентов' : lang === 'uz' ? 'Talabalarimizning haqiqiy hikoyalari' : 'Real stories from our students'
  const btnLabel    = lang === 'ru' ? 'Оставить отзыв'           : lang === 'uz' ? 'Fikr qoldirish'           : 'Leave a Review'
  const namePh      = lang === 'ru' ? 'Ваше имя'                 : 'Your name'
  const uniPh       = lang === 'ru' ? 'Университет (необязательно)' : 'University (optional)'
  const textPh      = lang === 'ru' ? 'Напишите ваш отзыв...'    : 'Write your review...'
  const sendLabel   = lang === 'ru' ? 'Отправить'                : 'Submit'
  const cancelLabel = lang === 'ru' ? 'Отмена'                   : 'Cancel'
  const thankYou    = lang === 'ru' ? 'Спасибо за отзыв!'        : 'Thank you for your review!'
  const emptyText   = lang === 'ru' ? 'Пока нет отзывов. Будьте первым!' : 'No reviews yet. Be the first!'

  return (
    <section className="section bg-surface">
      <div className="container-narrow">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-sm font-medium mb-4">
            {title}
          </span>
          <h2 className="text-3xl font-bold text-ink mb-3">{subtitle}</h2>

          {/* Success message */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                {thankYou}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add review button */}
        {!showForm && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => { setShowForm(true); setSubmitted(false) }}
              className="flex items-center gap-2 px-6 py-3 bg-brand-400 text-white rounded-xl font-semibold text-sm hover:bg-brand-500 transition-colors"
            >
              <Star className="w-4 h-4 fill-white" />
              {btnLabel}
            </button>
          </div>
        )}

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="card p-6 mb-8 max-w-xl mx-auto"
            >
              {/* Stars selector */}
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, stars: s }))}>
                    <Star className={`w-7 h-7 transition-colors ${s <= form.stars ? 'text-amber-400 fill-amber-400' : 'text-border'}`} />
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <input
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400"
                  placeholder={namePh + ' *'}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                <select
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 bg-white text-ink"
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                >
                  <option value="">{lang === 'ru' ? 'Ваша страна...' : 'Your country...'}</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400"
                  placeholder={uniPh}
                  value={form.university}
                  onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                />
                <textarea
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 resize-none h-28"
                  placeholder={textPh + ' *'}
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted hover:bg-surface transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={sending || !form.name.trim() || !form.text.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-brand-400 text-white text-sm font-semibold hover:bg-brand-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><Send className="w-4 h-4" />{sendLabel}</>
                  }
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-muted py-12">{emptyText}</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-6 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: r.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed flex-1">«{r.text}»</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                    {r.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                    {r.country && <p className="text-xs text-muted">{r.country}</p>}
                    {r.university && <p className="text-xs text-brand-500 mt-0.5">{r.university}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
