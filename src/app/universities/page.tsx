'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ExternalLink, GraduationCap, MapPin, X, Users, Calendar, Star, BookOpen } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui'
import { supabase } from '@/lib/supabase/client'
import type { UniversityRow, AppLanguage } from '@/types'
import { translations } from '@/i18n'
import { cn } from '@/lib/utils'

// Static extra info per university (keyed by name_en)
// Photos: real Unsplash photos matching each university's city/location
const UNI_EXTRA: Record<string, {
  founded: number
  students: string
  photo: string
  color: string
  desc_ru: string
}> = {
  'King Abdulaziz University': {
    founded: 1967,
    students: '117,000+',
    photo: 'https://images.unsplash.com/photo-1586715065342-98d1f6016fd1?w=1200&q=85',
    color: 'from-green-900 to-green-700',
    desc_ru: 'Крупнейший университет Саудовской Аравии в Джидде. Основан в 1967 году, в 1974 стал государственным. Предлагает уникальные программы по морским наукам, метеорологии и астрономии. 33 факультета, 177 программ.',
  },
  'King Fahd University of Petroleum': {
    founded: 1963,
    students: '8,000+',
    photo: 'https://images.unsplash.com/photo-1694018359679-49465b4c0d61?w=1200&q=85',
    color: 'from-blue-900 to-blue-700',
    desc_ru: 'Ведущий технический университет Ближнего Востока, #1 в регионе MENA (Times Higher Education 2025). Основан в 1963 году в Дахране. Специализируется на инженерии и нефтяной промышленности. С 2021 года принимает женщин.',
  },
  'Imam Muhammad ibn Saud University': {
    founded: 1953,
    students: '81,000+',
    photo: 'https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=1200&q=85',
    color: 'from-emerald-900 to-teal-700',
    desc_ru: 'Один из крупнейших исламских университетов мира в Эр-Рияде. Основан в 1953 году. Включает 14 факультетов, 70 институтов в Саудовской Аравии и 5 институтов за рубежом — в Индонезии и Джибути.',
  },
  'Islamic University of Madinah': {
    founded: 1961,
    students: '16,000+',
    photo: 'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=1200&q=85',
    color: 'from-amber-900 to-yellow-700',
    desc_ru: 'Международный исламский университет в Медине, основан в 1961 году. Принимает студентов из 170+ стран. Предоставляет полную стипендию иностранным студентам, включая проживание и питание.',
  },
  'King Saud University': {
    founded: 1957,
    students: '40,000+',
    photo: 'https://images.unsplash.com/photo-1770685798053-c7b282cc3188?w=1200&q=85',
    color: 'from-green-800 to-teal-600',
    desc_ru: 'Первый университет Саудовской Аравии, основан королём Саудом в 1957 году в Эр-Рияде. Предлагает программы по естественным и гуманитарным наукам. В 2023 году стал независимым некоммерческим учреждением.',
  },
  'Umm Al-Qura University': {
    founded: 1949,
    students: '55,000+',
    photo: 'https://images.unsplash.com/photo-1724191078796-8a997b989f43?w=1200&q=85',
    color: 'from-stone-800 to-amber-700',
    desc_ru: 'Старейший университет Саудовской Аравии, расположен в Мекке. Основан в 1949 году. Специализируется на исламских науках, шариате, арабском языке и гуманитарных дисциплинах.',
  },
  'UAE University': {
    founded: 1976,
    students: '14,900+',
    photo: 'https://images.unsplash.com/photo-1699954669485-812988f5c2db?w=1200&q=85',
    color: 'from-sky-900 to-blue-700',
    desc_ru: 'Старейший университет ОАЭ, основан шейхом Зайедом в 1976 году в Аль-Айне. Занимает 1-е место в ССЗ по исследовательской деятельности. Принимает студентов из 82 стран. 9 факультетов, PhD программы.',
  },
  'American University of Sharjah': {
    founded: 1997,
    students: '7,000+',
    photo: 'https://images.unsplash.com/photo-1585085952480-811ff8859fa1?w=1200&q=85',
    color: 'from-red-900 to-rose-700',
    desc_ru: 'Ведущий частный университет ОАЭ американской модели образования, основан в 1997 году в Шардже. Аккредитован в США, программы на английском языке по инженерии, бизнесу, архитектуре и искусству.',
  },
  'Khalifa University': {
    founded: 2007,
    students: '3,000+',
    photo: 'https://images.unsplash.com/photo-1669529250752-9f5b54b30491?w=1200&q=85',
    color: 'from-slate-900 to-slate-700',
    desc_ru: 'Исследовательский университет мирового класса в Абу-Даби, основан в 2007 году. Специализируется на инженерии, науке и технологиях. Входит в топ-50 молодых университетов мира по версии QS.',
  },
  'Zayed University': {
    founded: 1998,
    students: '9,000+',
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85',
    color: 'from-violet-900 to-purple-700',
    desc_ru: 'Государственный университет ОАЭ, основан в 1998 году в честь шейха Зайеда. Кампусы в Абу-Даби и Дубае. Программы на английском языке по бизнесу, коммуникациям, искусству и образованию.',
  },
}

const DEFAULT_EXTRA = {
  founded: 1970,
  students: '10,000+',
  photo: 'https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=1200&q=85',
  color: 'from-brand-700 to-brand-500',
  desc_ru: '',
}

const PROGRAMS_RU: Record<string, string> = {
  'Islamic Studies': 'Исламские науки',
  'Engineering':     'Инженерия',
  'Medicine':        'Медицина',
  'Business':        'Бизнес',
  'Arabic Language': 'Арабский язык',
  'Computer Science':'Информатика',
  'Sciences':        'Науки',
  'Architecture':    'Архитектура',
  'Shariah':         'Шариат',
  'Dawah':           'Дагват',
  'Quran':           'Коран',
  'Social Sciences': 'Социальные науки',
  'Law':             'Право',
  'Pharmacy':        'Фармация',
  'IT':              'IT',
  'Arts & Sciences': 'Гуманитарные науки',
}

function UniversitiesContent() {
  const searchParams = useSearchParams()
  const [lang,     setLang]     = useState<AppLanguage>('ru')
  const [unis,     setUnis]     = useState<UniversityRow[]>([])
  const [filter,   setFilter]   = useState<'ALL' | 'SA' | 'AE'>((searchParams.get('country') as any) || 'ALL')
  const [search,   setSearch]   = useState('')
  const [prog,     setProg]     = useState<string>('')
  const [selected, setSelected] = useState<UniversityRow | null>(null)

  const t = translations[lang]

  useEffect(() => {
    supabase
      .from('universities')
      .select('*')
      .eq('is_active', true)
      .order('rank')
      .then(({ data }) => setUnis(data ?? []))
  }, [])

  // Close modal on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const allPrograms = Array.from(new Set(unis.flatMap(u => u.programs))).sort()

  const filtered = unis.filter(u => {
    const matchCountry = filter === 'ALL' || u.country === filter
    const matchSearch  = !search || u.name_ru.toLowerCase().includes(search.toLowerCase()) ||
                         u.name_en.toLowerCase().includes(search.toLowerCase())
    const matchProg    = !prog || u.programs.includes(prog)
    return matchCountry && matchSearch && matchProg
  })

  const nameKey = lang === 'ru' ? 'name_ru' : lang === 'uz' ? 'name_uz' : 'name_en'
  const descKey = lang === 'ru' ? 'description_ru' : lang === 'uz' ? 'description_uz' : 'description_en'

  const getExtra = (uni: UniversityRow) =>
    UNI_EXTRA[uni.name_en] ?? UNI_EXTRA[Object.keys(UNI_EXTRA).find(k => uni.name_en.includes(k.split(' ')[0])) ?? ''] ?? DEFAULT_EXTRA

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      {/* Dark header */}
      <div className="bg-ink pt-16">
        <div className="text-white py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">Университеты</p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">{t.universities.title}</h1>
            <p className="text-white/60 text-base sm:text-lg">{t.universities.subtitle}</p>
            <div className="flex justify-center gap-6 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400">{unis.filter(u => u.country === 'SA').length}+</div>
                <div className="text-white/50 text-xs mt-0.5">Университетов в 🇸🇦</div>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400">{unis.filter(u => u.country === 'AE').length}+</div>
                <div className="text-white/50 text-xs mt-0.5">Университетов в 🇦🇪</div>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400">{allPrograms.length}+</div>
                <div className="text-white/50 text-xs mt-0.5">Специальностей</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters — sticky directly below navbar */}
      <div
        className="sticky top-16 z-30 bg-white border-b border-border shadow-sm"
        style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
      >
          <div className="container-wide py-3 flex flex-col md:flex-row gap-3">
            <div className="flex gap-1 bg-surface rounded-xl p-1">
              {(['ALL', 'SA', 'AE'] as const).map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={cn('px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                    filter === c ? 'bg-brand-400 text-white shadow-sm' : 'text-muted hover:text-ink'
                  )}>
                  {c === 'ALL' ? '🌍 Все' : c === 'SA' ? '🇸🇦 Саудовская Аравия' : '🇦🇪 ОАЭ'}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input className="input pl-9" placeholder="Поиск университета..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input max-w-[200px]" value={prog} onChange={e => setProg(e.target.value)}>
              <option value="">Все специальности</option>
              {allPrograms.map(p => (
                <option key={p} value={p}>{lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}</option>
              ))}
            </select>
          </div>
      </div>

      {/* Cards */}
      <div className="bg-surface">
        <div className="container-wide py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">Университеты не найдены</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((uni, i) => {
                const extra = getExtra(uni)
                return (
                  <motion.div
                    key={uni.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(uni)}
                    className="card overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Photo */}
                    <div className="relative h-44 overflow-hidden">
                      <div className={cn('absolute inset-0 bg-gradient-to-br', extra.color, 'opacity-80 z-10')} />
                      <img
                        src={extra.photo}
                        alt={uni.name_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      {/* Rank badge */}
                      {uni.rank <= 5 && (
                        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                          <Star className="w-3 h-3" /> Топ {uni.rank}
                        </div>
                      )}
                      {/* Country */}
                      <div className="absolute top-3 right-3 z-20 text-2xl">
                        {uni.country === 'SA' ? '🇸🇦' : '🇦🇪'}
                      </div>
                      {/* Name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                        <h3 className="font-bold text-white text-base leading-tight drop-shadow">
                          {uni[nameKey]}
                        </h3>
                        {uni.city && (
                          <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                            <MapPin className="w-3 h-3" /> {uni.city}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Осн. {extra.founded}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{extra.students} студентов</span>
                        </div>
                      </div>

                      {/* Programs */}
                      <div className="flex flex-wrap gap-1.5">
                        {uni.programs.slice(0, 3).map(p => (
                          <span key={p} className="badge badge-green text-[10px]">
                            {lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}
                          </span>
                        ))}
                        {uni.programs.length > 3 && (
                          <span className="badge badge-gray text-[10px]">+{uni.programs.length - 3}</span>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-brand-500 font-medium group-hover:underline">
                          Подробнее →
                        </span>
                        <Link
                          href={`/apply?university=${uni.id}&country=${uni.country}`}
                          onClick={e => e.stopPropagation()}
                          className="btn btn-primary btn-sm px-3 py-1.5 text-xs"
                        >
                          Подать заявку
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
        <Footer lang={lang} />
      </div>

      {/* ── University Detail Modal ── */}
      <AnimatePresence>
        {selected && (() => {
          const extra = getExtra(selected)
          const desc = selected[descKey] ?? selected.description_ru ?? selected.description_en ?? extra.desc_ru
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => setSelected(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
              >
                {/* Photo header */}
                <div className="relative h-52 sm:h-64 shrink-0">
                  <div className={cn('absolute inset-0 bg-gradient-to-br', extra.color, 'opacity-75')} />
                  <img
                    src={extra.photo}
                    alt={selected.name_en}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Close button */}
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>

                  {/* Rank */}
                  {selected.rank <= 5 && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3" /> Топ {selected.rank}
                    </div>
                  )}

                  {/* Name */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="text-2xl mb-1">{selected.country === 'SA' ? '🇸🇦' : '🇦🇪'}</div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow">
                      {selected[nameKey]}
                    </h2>
                    {selected.city && (
                      <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {selected.city}, {selected.country === 'SA' ? 'Саудовская Аравия' : 'ОАЭ'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
                  {/* Key stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Calendar, label: 'Основан', value: extra.founded.toString() },
                      { icon: Users,    label: 'Студентов', value: extra.students },
                      { icon: BookOpen, label: 'Программ', value: selected.programs.length.toString() },
                    ].map(s => (
                      <div key={s.label} className="bg-surface rounded-xl p-3 text-center">
                        <s.icon className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                        <div className="text-base font-bold text-ink">{s.value}</div>
                        <div className="text-[10px] text-muted">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {desc && (
                    <div>
                      <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">О университете</p>
                      <p className="text-sm text-muted leading-relaxed">{desc}</p>
                    </div>
                  )}

                  {/* Programs */}
                  <div>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">Специальности</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.programs.map(p => (
                        <span key={p} className="badge badge-green text-xs py-1">
                          {lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 sm:p-5 border-t border-border flex gap-3 shrink-0 bg-white">
                  <Link
                    href={`/apply?university=${selected.id}&country=${selected.country}`}
                    className="flex-1 btn btn-primary btn-lg justify-center"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Подать заявку
                  </Link>
                  {selected.website_url && (
                    <a href={selected.website_url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-secondary btn-lg px-4">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </>
  )
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <UniversitiesContent />
    </Suspense>
  )
}
