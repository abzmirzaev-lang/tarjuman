'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from 'framer-motion'
import { Star, Send, CheckCircle2, Quote } from 'lucide-react'

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

const AVATAR_GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600',
]

const STATIC_REVIEWS: Review[] = [
  {
    id: 's1', name: 'Абдурахман Юсупов', country: '🇺🇿 Узбекистан',
    university: 'Исламский университет Медины', stars: 5,
    text: 'Tarjuman помог мне с переводом документов и подачей в Университет Медины. Всё было быстро, профессионально и без лишних хлопот. Очень доволен результатом!',
    created_at: '',
  },
  {
    id: 's2', name: 'Зайнаб Рахимова', country: '🇹🇯 Таджикистан',
    university: 'Университет им. Короля Сауда', stars: 5,
    text: 'Переживала, что документы не примут. Менеджер проверил всё заранее, и поступление прошло без единого отказа. Рекомендую всем!',
    created_at: '',
  },
  {
    id: 's3', name: 'Мухаммад Алиев', country: '🇰🇿 Казахстан',
    university: 'Университет ОАЭ (ОАЭ)', stars: 5,
    text: 'Обратился за несколько недель до дедлайна. Команда уложилась в срок — документы подали за 12 часов. Получил приглашение от университета!',
    created_at: '',
  },
  {
    id: 's4', name: 'Фатима Каримова', country: '🇺🇿 Узбекистан',
    university: 'Университет им. Короля Абдулазиза', stars: 5,
    text: 'Перевод арабских документов качественный, universitys принял без замечаний. Поддержка на каждом шагу — от заявки до получения визы.',
    created_at: '',
  },
  {
    id: 's5', name: 'Бекзод Назаров', country: '🇺🇿 Узбекистан',
    university: 'Университет Шарджи (ОАЭ)', stars: 5,
    text: 'Сначала сомневался, но после первого звонка менеджера всё стало ясно. Процесс был полностью прозрачным. Сейчас учусь в Шардже!',
    created_at: '',
  },
  {
    id: 's6', name: 'Нилуфар Хасанова', country: '🇰🇬 Кыргызстан',
    university: 'Исламский университет Медины', stars: 5,
    text: 'Очень ответственный сервис. Проверили каждый документ, объяснили все требования. Поступила с первой попытки, хотя думала это невозможно.',
    created_at: '',
  },
]

/* ─── Infinite marquee strip ───────────────────────────────────────────── */
function MarqueeStrip({ reviews, reverse = false }: { reviews: Review[]; reverse?: boolean }) {
  const x = useMotionValue(0)
  const ref = useRef<HTMLDivElement>(null)
  const speed = reverse ? 0.4 : -0.4

  useAnimationFrame(() => {
    if (!ref.current) return
    const width = ref.current.scrollWidth / 2
    x.set(((x.get() + speed) % width + width) % width - width)
  })

  const doubled = [...reviews, ...reviews]

  return (
    <div className="overflow-hidden w-full">
      <motion.div
        ref={ref}
        style={{ x }}
        className="flex gap-5 w-max"
      >
        {doubled.map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} review={r} />
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Single review card ───────────────────────────────────────────────── */
function ReviewCard({ review: r }: { review: Review }) {
  const gradient = AVATAR_GRADIENTS[r.name.charCodeAt(0) % AVATAR_GRADIENTS.length]
  return (
    <div className="w-[300px] shrink-0 bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-300 select-none">
      {/* Quote + stars */}
      <div className="flex items-start justify-between">
        <Quote className="w-7 h-7 text-brand-200 shrink-0" />
        <div className="flex gap-0.5">
          {Array.from({ length: r.stars }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          ))}
        </div>
      </div>

      {/* Text */}
      <p className="text-sm text-muted leading-relaxed flex-1 line-clamp-4">
        {r.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
          {r.name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink truncate">{r.name}</p>
          {r.country && <p className="text-xs text-muted truncate">{r.country}</p>}
          {r.university && <p className="text-xs text-brand-600 font-medium truncate mt-0.5">{r.university}</p>}
        </div>
      </div>
    </div>
  )
}

/* ─── Main section ─────────────────────────────────────────────────────── */
export default function ReviewsSection({ lang = 'ru' }: { lang?: string }) {
  const [reviews, setReviews]   = useState<Review[]>([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]   = useState(false)
  const [form, setForm] = useState({ name: '', country: '', university: '', text: '', stars: 5 })

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
    } finally { setSending(false) }
  }

  const t = {
    title:    lang === 'ru' ? 'Отзывы студентов'                    : lang === 'uz' ? 'Talabalar fikrlari'                : 'Student Reviews',
    subtitle: lang === 'ru' ? 'Реальные истории тех, кто уже поступил' : lang === 'uz' ? "Allaqachon qabul bo'lganlar haqiqiy hikoyalari" : 'Real stories from students who enrolled',
    badge:    lang === 'ru' ? 'Отзывы'                               : lang === 'uz' ? 'Fikrlar'                          : 'Reviews',
    btn:      lang === 'ru' ? 'Оставить отзыв'                      : lang === 'uz' ? 'Fikr qoldirish'                   : 'Leave a Review',
    namePh:   lang === 'ru' ? 'Ваше имя'                            : 'Your name',
    uniPh:    lang === 'ru' ? 'Университет (необязательно)'         : 'University (optional)',
    textPh:   lang === 'ru' ? 'Напишите ваш отзыв...'               : 'Write your review...',
    send:     lang === 'ru' ? 'Отправить'                            : 'Submit',
    cancel:   lang === 'ru' ? 'Отмена'                               : 'Cancel',
    thanks:   lang === 'ru' ? 'Спасибо за отзыв!'                   : 'Thank you for your review!',
    country:  lang === 'ru' ? 'Ваша страна...'                       : 'Your country...',
  }

  // Merge API reviews with static ones (API first, then fill with static)
  const allReviews = [...reviews, ...STATIC_REVIEWS].slice(0, Math.max(reviews.length + STATIC_REVIEWS.length, 6))
  const row1 = allReviews.filter((_, i) => i % 2 === 0)
  const row2 = allReviews.filter((_, i) => i % 2 === 1)

  const avgRating = 5
  const totalCount = allReviews.length

  return (
    <section className="py-20 bg-[#F7F8FA] overflow-hidden">

      {/* Header */}
      <div className="container-narrow mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-3">{t.title}</h2>
          <p className="text-muted max-w-md mx-auto text-sm mb-6">{t.subtitle}</p>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white border border-border rounded-2xl shadow-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-2xl font-black text-ink">{avgRating}.0</span>
            <span className="text-muted text-sm">
              {lang === 'ru' ? `из 5 · ${totalCount} отзывов` : lang === 'uz' ? `5 dan · ${totalCount} ta fikr` : `out of 5 · ${totalCount} reviews`}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Marquee rows — visible on all screen sizes */}
      {!loading && allReviews.length > 0 && (
        <div className="space-y-5 mb-12">
          <MarqueeStrip reviews={row1.length > 0 ? row1 : allReviews} reverse={false} />
          {row2.length > 0 && <MarqueeStrip reviews={row2} reverse={true} />}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* CTA + Form */}
      <div className="container-narrow">
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {t.thanks}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowForm(true); setSubmitted(false) }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-2xl font-semibold text-sm hover:bg-ink/80 transition-colors shadow-sm"
            >
              <Star className="w-4 h-4 fill-brand-400 text-brand-400" />
              {t.btn}
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="max-w-xl mx-auto bg-white rounded-3xl border border-border shadow-xl p-7 mt-2"
            >
              <h3 className="text-lg font-bold text-ink mb-5">
                {lang === 'ru' ? 'Поделитесь своим опытом' : lang === 'uz' ? "Tajribangizni bo'lishing" : 'Share your experience'}
              </h3>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setForm(f => ({ ...f, stars: s }))}>
                    <Star className={`w-8 h-8 transition-all ${s <= form.stars ? 'text-amber-400 fill-amber-400 scale-110' : 'text-border'}`} />
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <input
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                  placeholder={t.namePh + ' *'}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                <select
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 bg-white text-ink"
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                >
                  <option value="">{t.country}</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
                  placeholder={t.uniPh}
                  value={form.university}
                  onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                />
                <textarea
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition resize-none h-32"
                  placeholder={t.textPh + ' *'}
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm text-muted hover:bg-surface transition-colors font-medium"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={sending || !form.name.trim() || !form.text.trim()}
                  className="flex-1 py-3 rounded-xl bg-brand-400 text-ink text-sm font-bold hover:bg-brand-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending
                    ? <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                    : <><Send className="w-4 h-4" />{t.send}</>
                  }
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
