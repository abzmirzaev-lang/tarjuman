'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink, GraduationCap, MapPin } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button, Badge } from '@/components/ui'
import { supabase } from '@/lib/supabase/client'
import type { UniversityRow, AppLanguage } from '@/types'
import { translations } from '@/i18n'
import { cn } from '@/lib/utils'

const PROGRAMS_RU: Record<string, string> = {
  'Islamic Studies': 'Исламские науки',
  'Engineering':     'Инженерия',
  'Medicine':        'Медицина',
  'Business':        'Бизнес',
  'Arabic Language': 'Арабский язык',
  'Computer Science': 'Информатика',
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
  const [lang,   setLang]   = useState<AppLanguage>('ru')
  const [unis,   setUnis]   = useState<UniversityRow[]>([])
  const [filter, setFilter] = useState<'ALL' | 'SA' | 'AE'>(
    (searchParams.get('country') as any) || 'ALL'
  )
  const [search, setSearch] = useState('')
  const [prog,   setProg]   = useState<string>('')

  const t = translations[lang]

  useEffect(() => {
    supabase
      .from('universities')
      .select('*')
      .eq('is_active', true)
      .order('rank')
      .then(({ data }) => setUnis(data ?? []))
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

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        {/* Header */}
        <div className="bg-white border-b border-border">
          <div className="container-wide py-10">
            <h1 className="page-title mb-2">{t.universities.title}</h1>
            <p className="page-subtitle">{t.universities.subtitle}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-border sticky top-16 z-20">
          <div className="container-wide py-4 flex flex-col md:flex-row gap-3">
            {/* Country tabs */}
            <div className="flex gap-1 bg-surface rounded-xl p-1">
              {(['ALL', 'SA', 'AE'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                    filter === c ? 'bg-brand-400 text-white shadow-sm' : 'text-muted hover:text-ink'
                  )}
                >
                  {c === 'ALL' ? t.universities.filterAll : c === 'SA' ? t.universities.filterSA : t.universities.filterAE}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                className="input pl-9"
                placeholder={t.common.search + '...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Program filter */}
            <select
              className="input max-w-[200px]"
              value={prog}
              onChange={e => setProg(e.target.value)}
            >
              <option value="">{t.universities.programs} — {t.universities.filterAll}</option>
              {allPrograms.map(p => (
                <option key={p} value={p}>
                  {lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="container-wide py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">{t.common.noData}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((uni, i) => (
                <motion.div
                  key={uni.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Flag + name */}
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{uni.country === 'SA' ? '🇸🇦' : '🇦🇪'}</span>
                    <div>
                      <h3 className="font-semibold text-ink leading-snug">{uni[nameKey]}</h3>
                      {uni.city && (
                        <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                          <MapPin className="w-3 h-3" /> {uni.city}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Programs */}
                  <div className="flex flex-wrap gap-1.5">
                    {uni.programs.slice(0, 4).map(p => (
                      <span key={p} className="badge badge-green text-[11px]">
                        {lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}
                      </span>
                    ))}
                    {uni.programs.length > 4 && (
                      <span className="badge badge-gray text-[11px]">+{uni.programs.length - 4}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                    <Link href={`/apply?university=${uni.id}&country=${uni.country}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        <GraduationCap className="w-4 h-4" />
                        {t.universities.apply}
                      </Button>
                    </Link>
                    {uni.website_url && (
                      <a href={uni.website_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}

export default function UniversitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <UniversitiesContent />
    </Suspense>
  )
}
