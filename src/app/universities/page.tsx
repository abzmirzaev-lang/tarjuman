'use client'
import { useLanguage } from '@/hooks/useLanguage'
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
  'King Saud University': {
    founded: 1957,
    students: '40,000+',
    photo: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=85',
    color: 'from-green-800 to-teal-600',
    desc_ru: 'Первый университет Саудовской Аравии, основан королём Саудом в 1957 году в Эр-Рияде. 23 факультета, 450+ программ. В топ-200 по QS Rankings 2024.',
  },
  'King Fahd University of Petroleum and Minerals': {
    founded: 1963,
    students: '8,000+',
    photo: 'https://images.unsplash.com/photo-1694018359679-49465b4c0d61?w=1200&q=85',
    color: 'from-blue-900 to-blue-700',
    desc_ru: 'Ведущий технический университет Ближнего Востока, #1 в регионе MENA (Times Higher Education 2025). Основан в 1963 году в Дахране. Специализируется на инженерии и нефтяной промышленности. С 2021 года принимает женщин.',
  },
  'Imam Muhammad ibn Saud Islamic University': {
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
  'Umm Al-Qura University': {
    founded: 1949,
    students: '55,000+',
    photo: 'https://images.unsplash.com/photo-1724191078796-8a997b989f43?w=1200&q=85',
    color: 'from-stone-800 to-amber-700',
    desc_ru: 'Старейший университет Саудовской Аравии, расположен в Мекке. Основан в 1949 году. 34 факультета, 119 кафедр, 402 образовательные программы. Специализируется на исламских науках, шариате и арабском языке.',
  },
  'King Khalid University': {
    founded: 1998,
    students: '60,000+',
    photo: '/kku-abha.jpg',
    color: 'from-teal-900 to-cyan-700',
    desc_ru: 'Государственный университет в Абхе, регион Асир. Основан в 1998 году. 26 факультетов на 27 кампусах. Один из крупнейших университетов Аравийского полуострова.',
  },
  'King Faisal University': {
    founded: 1975,
    students: '41,500+',
    photo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=85',
    color: 'from-indigo-900 to-indigo-700',
    desc_ru: 'Государственный университет в Аль-Хуфуфе (провинция Аль-Ахса). Основан в 1975 году. 15 факультетов, 125 образовательных программ. Площадь кампуса — 4 млн кв. м.',
  },
  'Taibah University': {
    founded: 2003,
    students: '40,000+',
    photo: '/taibah.jpg',
    color: 'from-violet-900 to-purple-700',
    desc_ru: 'Государственный университет в Медине. Основан в 2003 году. 28 факультетов. Единственный университет в Медине с полноценным медицинским факультетом.',
  },
  'Taif University': {
    founded: 2004,
    students: '56,885',
    photo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=85',
    color: 'from-sky-900 to-sky-700',
    desc_ru: 'Государственный университет в горном Таифе. Основан в 2004 году. 17 факультетов, почти 57 000 студентов. Кампус расположен в живописном горном районе Аль-Хавия.',
  },
  'Qassim University': {
    founded: 2004,
    students: '50,000+',
    photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85',
    color: 'from-orange-900 to-orange-700',
    desc_ru: 'Государственный университет в Бурайде. Основан в 2004 году. Более 38 факультетов — один из самых больших в КСА. 120+ программ бакалавриата, 70+ магистратуры, 30+ PhD.',
  },
  'University of Tabuk': {
    founded: 2006,
    students: '35,000+',
    photo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=85',
    color: 'from-rose-900 to-pink-700',
    desc_ru: 'Государственный университет на севере Саудовской Аравии. Основан в 2006 году. 18 факультетов. Расположен вблизи ЮНЕСКО объекта Хегра (Мадаин-Салих) — одного из важнейших исторических мест Аравии.',
  },
  "University of Ha'il": {
    founded: 2005,
    students: '34,684',
    photo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&q=85',
    color: 'from-slate-900 to-slate-700',
    desc_ru: 'Государственный университет в Хаиле, северная Саудовская Аравия. Основан в 2005 году. 14 факультетов, 51 программа бакалавриата и 32 программы магистратуры.',
  },
  'Jazan University': {
    founded: 2006,
    students: '35,000+',
    photo: 'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=1200&q=85',
    color: 'from-cyan-900 to-teal-700',
    desc_ru: 'Государственный университет у берегов Красного моря на юго-западе Саудовской Аравии. Основан в 2006 году. 23 факультета, 35 000+ студентов. Особо известен медицинской школой.',
  },
  'Najran University': {
    founded: 2006,
    students: '20,000+',
    photo: '/najran.jpg',
    color: 'from-lime-900 to-green-700',
    desc_ru: 'Государственный университет на юге Саудовской Аравии, вблизи границы с Йеменом. Основан в 2006 году. 14 факультетов, 70 специальностей.',
  },
  'Al-Baha University': {
    founded: 2006,
    students: '15,000+',
    photo: 'https://images.unsplash.com/photo-1521587765099-8835e7201186?w=1200&q=85',
    color: 'from-fuchsia-900 to-purple-700',
    desc_ru: 'Государственный университет в живописном горном регионе Аль-Баха. Основан в 2006 году. 16 факультетов и 5 научно-исследовательских центров.',
  },
  'Shaqra University': {
    founded: 2009,
    students: '20,000+',
    photo: 'https://saudipedia.com/var/site/storage/images/3/7/6/4/4524673-1-eng-GB/b0ab6241c4bb-67118.jpg',
    color: 'from-yellow-900 to-amber-600',
    desc_ru: 'Государственный университет в провинции Эр-Рияд. Основан в 2009 году. 24 факультета — входит в топ-10 КСА по числу факультетов.',
  },
  'University of Jeddah': {
    founded: 2014,
    students: '25,000+',
    photo: 'https://cos.uj.edu.sa/sites/cos.uoj.com.sa/files/2024-10/%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%A8%D8%AF%D9%88%D9%86%20%D8%B9%D9%86%D9%88%D8%A7%D9%86%20%281%29.webp',
    color: 'from-emerald-800 to-green-600',
    desc_ru: 'Молодой государственный университет в Джидде, основан в 2014 году. 16 факультетов. Современная инфраструктура, активное международное сотрудничество.',
  },
  'Northern Border University': {
    founded: 2007,
    students: '15,000+',
    photo: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=85',
    color: 'from-blue-800 to-indigo-700',
    desc_ru: 'Государственный университет в Ararе, крайний север Саудовской Аравии. Основан в 2007 году. Обслуживает северные приграничные регионы королевства.',
  },
  'Jouf University': {
    founded: 2005,
    students: '20,000+',
    photo: 'https://saudipedia.com/var/site/storage/images/3/8/1/8/4468183-1-eng-GB/f08ba8d6666d-67089.jpg',
    color: 'from-red-900 to-rose-700',
    desc_ru: 'Государственный университет в регионе аль-Джауф на севере Саудовской Аравии. Основан в 2005 году. Широкий спектр специальностей, динамично развивающийся центр образования.',
  },
  'Prince Sattam bin Abdulaziz University': {
    founded: 2009,
    students: '25,000+',
    photo: 'https://saudipedia.com/var/site/storage/images/3/8/3/3/4463383-1-eng-GB/e53a629fcfa2-67085.jpg',
    color: 'from-purple-900 to-violet-700',
    desc_ru: 'Государственный университет в Аль-Хардже, провинция Эр-Рияд. Основан в 2009 году. Специализируется на медицинских и инженерных специальностях. Около 25 000 студентов.',
  },
  'Majmaah University': {
    founded: 2009,
    students: '30,000+',
    photo: 'https://saudipedia.com/var/site/storage/images/9/2/4/7/4477429-1-eng-GB/3b5012028464-66600.jpg',
    color: 'from-zinc-800 to-zinc-600',
    desc_ru: 'Государственный университет в Маджмаа, центральная Саудовская Аравия. Основан в 2009 году. 30 000 студентов. Кампусы в нескольких городах провинции Эр-Рияд.',
  },
  'King Abdullah University of Science and Technology': {
    founded: 2009,
    students: '3,000+',
    photo: 'https://images.unsplash.com/photo-1669529250752-9f5b54b30491?w=1200&q=85',
    color: 'from-slate-900 to-blue-800',
    desc_ru: 'Элитный исследовательский университет мирового уровня в Тувале. Основан в 2009 году. Только аспирантура. Входит в топ-100 мира. Передовые исследования в области энергетики, нанотехнологий и искусственного интеллекта.',
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
  const [lang, setLang] = useLanguage()
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

  const applyLabel  = lang === 'ru' ? 'Подать заявку' : lang === 'uz' ? 'Ariza berish' : 'Apply'
  const detailLabel = lang === 'ru' ? 'Подробнее' : lang === 'uz' ? 'Batafsil' : 'Details'
  const foundedLabel = lang === 'ru' ? 'Осн.' : lang === 'uz' ? 'Asos.' : 'Est.'
  const studentsLabel = lang === 'ru' ? 'студентов' : lang === 'uz' ? 'talaba' : 'students'
  const notFoundLabel = lang === 'ru' ? 'Университеты не найдены' : lang === 'uz' ? 'Universitetlar topilmadi' : 'No universities found'

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="bg-ink pt-[7.5rem]">
        <div className="text-white py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">
              {lang === 'ru' ? 'Университеты' : lang === 'uz' ? 'Universitetlar' : 'Universities'}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">{t.universities.title}</h1>
            <p className="text-white/60 text-base sm:text-lg">{t.universities.subtitle}</p>
            <div className="flex justify-center gap-6 mt-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400">{unis.filter(u => u.country === 'SA').length}+</div>
                <div className="text-white/50 text-xs mt-0.5">{lang === 'ru' ? 'Университетов в КСА' : lang === 'uz' ? 'KSA universitetlari' : 'Universities in KSA'}</div>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400">{unis.filter(u => u.country === 'AE').length}+</div>
                <div className="text-white/50 text-xs mt-0.5">{lang === 'ru' ? 'Университетов в ОАЭ' : lang === 'uz' ? 'BAA universitetlari' : 'Universities in UAE'}</div>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-400">{allPrograms.length}+</div>
                <div className="text-white/50 text-xs mt-0.5">{lang === 'ru' ? 'Специальностей' : lang === 'uz' ? 'Mutaxassisliklar' : 'Specializations'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed top-16 inset-x-0 h-14 z-40 bg-white border-b border-border shadow-sm flex items-center"
        style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
      >
        <div className="container-wide flex items-center gap-2">
          <div className="flex gap-1 bg-surface rounded-xl p-1 shrink-0">
            {(['ALL', 'SA', 'AE'] as const).map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={cn('px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap',
                  filter === c ? 'bg-brand-400 text-white shadow-sm' : 'text-muted hover:text-ink'
                )}>
                {c === 'ALL'
                  ? (lang === 'ru' ? 'Все' : lang === 'uz' ? 'Barchasi' : 'All')
                  : c === 'SA'
                  ? 'КСА'
                  : 'ОАЭ'}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              className="input pl-9 py-2 text-sm"
              placeholder={lang === 'ru' ? 'Поиск университета...' : lang === 'uz' ? 'Universitetni qidirish...' : 'Search university...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input py-2 text-sm w-[180px] hidden md:block shrink-0" value={prog} onChange={e => setProg(e.target.value)}>
            <option value="">{lang === 'ru' ? 'Все специальности' : lang === 'uz' ? 'Barcha mutaxassisliklar' : 'All specializations'}</option>
            {allPrograms.map(p => (
              <option key={p} value={p}>{lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-surface">
        <div className="container-wide py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">{notFoundLabel}</div>
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
                    <div className="relative h-44 overflow-hidden">
                      <div className={cn('absolute inset-0 bg-gradient-to-br', extra.color, 'opacity-80 z-10')} />
                      <img
                        src={extra.photo}
                        alt={uni.name_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      {uni.rank <= 5 && (
                        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                          <Star className="w-3 h-3" /> Топ {uni.rank}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 z-20 text-2xl">
                        {uni.country === 'SA' ? '🇸🇦' : '🇦🇪'}
                      </div>
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

                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{foundedLabel} {extra.founded}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>{extra.students} {studentsLabel}</span>
                        </div>
                      </div>

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

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-brand-500 font-medium group-hover:underline">
                          {detailLabel} →
                        </span>
                        <Link
                          href={`/apply?university=${uni.id}&country=${uni.country}`}
                          onClick={e => e.stopPropagation()}
                          className="btn btn-primary btn-sm px-3 py-1.5 text-xs"
                        >
                          {applyLabel}
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

      {/* University Detail Modal */}
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
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

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

                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>

                  {selected.rank <= 5 && (
                    <div className="absolute top-4 left-4 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                      <Star className="w-3 h-3" /> Топ {selected.rank}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{selected.country === 'SA' ? '🇸🇦' : '🇦🇪'}</span>
                      {selected.city && (
                        <span className="flex items-center gap-1 text-white/70 text-xs">
                          <MapPin className="w-3 h-3" /> {selected.city}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                      {selected[nameKey]}
                    </h2>
                  </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-surface rounded-xl p-3 text-center">
                      <Calendar className="w-4 h-4 text-brand-500 mx-auto mb-1" />
                      <div className="text-sm font-bold text-ink">{extra.founded}</div>
                      <div className="text-[10px] text-muted">{foundedLabel}</div>
                    </div>
                    <div className="bg-surface rounded-xl p-3 text-center">
                      <Users className="w-4 h-4 text-brand-500 mx-auto mb-1" />
                      <div className="text-sm font-bold text-ink">{extra.students}</div>
                      <div className="text-[10px] text-muted">{studentsLabel}</div>
                    </div>
                    <div className="bg-surface rounded-xl p-3 text-center">
                      <BookOpen className="w-4 h-4 text-brand-500 mx-auto mb-1" />
                      <div className="text-sm font-bold text-ink">{selected.programs.length}</div>
                      <div className="text-[10px] text-muted">{lang === 'ru' ? 'программ' : lang === 'uz' ? 'dasturlar' : 'programs'}</div>
                    </div>
                  </div>

                  {/* Description */}
                  {desc && (
                    <p className="text-sm text-muted leading-relaxed">{desc}</p>
                  )}

                  {/* Programs */}
                  {selected.programs.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                        {lang === 'ru' ? 'Специальности' : lang === 'uz' ? 'Mutaxassisliklar' : 'Programs'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.programs.map(p => (
                          <span key={p} className="badge badge-green text-xs">
                            {lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="border-t border-border p-4 sm:p-5 flex gap-3 shrink-0">
                  {selected.website_url && (
                    <a
                      href={selected.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-medium text-ink hover:bg-surface transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {lang === 'ru' ? 'Сайт' : lang === 'uz' ? 'Veb-sayt' : 'Website'}
                    </a>
                  )}
                  <Link
                    href={`/apply?university=${selected.id}&country=${selected.country}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-ink/80 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4" />
                    {applyLabel}
                  </Link>
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
        <div className="text-muted">Загрузка...</div>
      </div>
    }>
      <UniversitiesContent />
    </Suspense>
  )
}
