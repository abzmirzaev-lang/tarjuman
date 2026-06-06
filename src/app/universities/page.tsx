'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ExternalLink, GraduationCap, MapPin, X, Users, Calendar, Star, BookOpen, Globe2, Banknote, UtensilsCrossed, BedDouble, FileCheck, Instagram, Facebook, ShieldCheck } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
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
    photo: 'https://images.unsplash.com/photo-1586715065342-98d1f6016fd1?w=800&q=75',
    color: 'from-green-900 to-green-700',
    desc_ru: 'Крупнейший университет Саудовской Аравии в Джидде. Основан в 1967 году, в 1974 стал государственным. Предлагает уникальные программы по морским наукам, метеорологии и астрономии. 33 факультета, 177 программ.',
  },
  'King Saud University': {
    founded: 1957,
    students: '40,000+',
    photo: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=75',
    color: 'from-green-800 to-teal-600',
    desc_ru: 'Первый университет Саудовской Аравии, основан королём Саудом в 1957 году в Эр-Рияде. 23 факультета, 450+ программ. В топ-200 по QS Rankings 2024.',
  },
  'King Fahd University of Petroleum and Minerals': {
    founded: 1963,
    students: '8,000+',
    photo: 'https://images.unsplash.com/photo-1694018359679-49465b4c0d61?w=800&q=75',
    color: 'from-blue-900 to-blue-700',
    desc_ru: 'Ведущий технический университет Ближнего Востока, #1 в регионе MENA (Times Higher Education 2025). Основан в 1963 году в Дахране. Специализируется на инженерии и нефтяной промышленности. С 2021 года принимает женщин.',
  },
  'Imam Muhammad ibn Saud Islamic University': {
    founded: 1953,
    students: '81,000+',
    photo: 'https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=800&q=75',
    color: 'from-emerald-900 to-teal-700',
    desc_ru: 'Один из крупнейших исламских университетов мира в Эр-Рияде. Основан в 1953 году. Включает 14 факультетов, 70 институтов в Саудовской Аравии и 5 институтов за рубежом — в Индонезии и Джибути.',
  },
  'Islamic University of Madinah': {
    founded: 1961,
    students: '16,000+',
    photo: 'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=800&q=75',
    color: 'from-amber-900 to-yellow-700',
    desc_ru: 'Международный исламский университет в Медине, основан в 1961 году. Принимает студентов из 170+ стран. Предоставляет полную стипендию иностранным студентам, включая проживание и питание.',
  },
  'Umm Al-Qura University': {
    founded: 1949,
    students: '55,000+',
    photo: 'https://images.unsplash.com/photo-1724191078796-8a997b989f43?w=800&q=75',
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
    photo: 'https://i.ibb.co/67FLp20T/4.jpg',
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
    photo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=75',
    color: 'from-sky-900 to-sky-700',
    desc_ru: 'Государственный университет в горном Таифе. Основан в 2004 году. 17 факультетов, почти 57 000 студентов. Кампус расположен в живописном горном районе Аль-Хавия.',
  },
  'Qassim University': {
    founded: 2004,
    students: '50,000+',
    photo: 'https://i.ibb.co/vxk05YjQ/6.jpg',
    color: 'from-orange-900 to-orange-700',
    desc_ru: 'Государственный университет в Бурайде. Основан в 2004 году. Более 38 факультетов — один из самых больших в КСА. 120+ программ бакалавриата, 70+ магистратуры, 30+ PhD.',
  },
  'University of Tabuk': {
    founded: 2006,
    students: '35,000+',
    photo: 'https://i.ibb.co/b5CcT2xD/meta-tag.png',
    color: 'from-rose-900 to-pink-700',
    desc_ru: 'Государственный университет на севере Саудовской Аравии. Основан в 2006 году. 18 факультетов. Расположен вблизи ЮНЕСКО объекта Хегра (Мадаин-Салих) — одного из важнейших исторических мест Аравии.',
  },
  "University of Ha'il": {
    founded: 2005,
    students: '34,684',
    photo: 'https://i.ibb.co/s97MJLZS/1.png',
    color: 'from-slate-900 to-slate-700',
    desc_ru: 'Государственный университет в Хаиле, северная Саудовская Аравия. Основан в 2005 году. 14 факультетов, 51 программа бакалавриата и 32 программы магистратуры.',
  },
  'Jazan University': {
    founded: 2006,
    students: '35,000+',
    photo: 'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=800&q=75',
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
    photo: 'https://i.ibb.co/xKbTHCsD/baha.jpg',
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
    photo: 'https://i.ibb.co/7NQZfDtv/5.jpg',
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
    photo: 'https://images.unsplash.com/photo-1669529250752-9f5b54b30491?w=800&q=75',
    color: 'from-slate-900 to-blue-800',
    desc_ru: 'Элитный исследовательский университет мирового уровня в Тувале. Основан в 2009 году. Только аспирантура. Входит в топ-100 мира. Передовые исследования в области энергетики, нанотехнологий и искусственного интеллекта.',
  },
  'UAE University': {
    founded: 1976,
    students: '14,900+',
    photo: 'https://images.unsplash.com/photo-1699954669485-812988f5c2db?w=800&q=75',
    color: 'from-sky-900 to-blue-700',
    desc_ru: 'Старейший университет ОАЭ, основан шейхом Зайедом в 1976 году в Аль-Айне. Занимает 1-е место в ССЗ по исследовательской деятельности. Принимает студентов из 82 стран. 9 факультетов, PhD программы.',
  },
  'American University of Sharjah': {
    founded: 1997,
    students: '7,000+',
    photo: 'https://images.unsplash.com/photo-1585085952480-811ff8859fa1?w=800&q=75',
    color: 'from-red-900 to-rose-700',
    desc_ru: 'Ведущий частный университет ОАЭ американской модели образования, основан в 1997 году в Шардже. Аккредитован в США, программы на английском языке по инженерии, бизнесу, архитектуре и искусству.',
  },
  'Khalifa University': {
    founded: 2007,
    students: '3,000+',
    photo: 'https://images.unsplash.com/photo-1669529250752-9f5b54b30491?w=800&q=75',
    color: 'from-slate-900 to-slate-700',
    desc_ru: 'Исследовательский университет мирового класса в Абу-Даби, основан в 2007 году. Специализируется на инженерии, науке и технологиях. Входит в топ-50 молодых университетов мира по версии QS.',
  },
  'Zayed University': {
    founded: 1998,
    students: '9,000+',
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=75',
    color: 'from-violet-900 to-purple-700',
    desc_ru: 'Государственный университет ОАЭ, основан в 1998 году в честь шейха Зайеда. Кампусы в Абу-Даби и Дубае. Программы на английском языке по бизнесу, коммуникациям, искусству и образованию.',
  },
  'Al Qasimia University': {
    founded: 2009,
    students: '5,000+',
    photo: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800&q=75',
    color: 'from-[#1B4332] to-emerald-600',
    desc_ru: 'Исламский университет в Шардже (ОАЭ), основан в 2009 году шейхом Султаном бин Мухаммад аль-Касими. Специализируется на исламских науках, арабском языке, праве и экономике. Ведёт обучение на арабском языке. Иностранным студентам предоставляется стипендия, питание и общежитие.',
  },
}
const DEFAULT_EXTRA = {
  founded: 1970,
  students: '10,000+',
  photo: 'https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=800&q=75',
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

// ── Al Qasimia hardcoded entry ────────────────────────────────────────────────
const AQ_UNI: UniversityRow = {
  id: 'al-qasimia-university',
  name_ru: 'Университет аль-Касимия',
  name_uz: 'Al-Qosimiya universiteti',
  name_en: 'Al Qasimia University',
  country: 'AE',
  city: 'Sharjah',
  website_url: 'https://www.alqasimia.ac.ae',
  description_ru: 'Исламский университет в Шардже (ОАЭ), основан в 2009 году шейхом Султаном бин Мухаммад аль-Касими. Специализируется на исламских науках, арабском языке, праве и экономике. Ведёт обучение на арабском языке. Иностранным студентам предоставляется стипендия 1 500 AED в месяц, трёхразовое питание и общежитие.',
  description_uz: 'Al-Qosimiya universiteti 2009 yilda Sharjada (BAA) shayx Sulton bin Muhammad al-Qosimiy tomonidan tashkil etilgan. Islom fanlari, arab tili, huquq va iqtisodiyot bo\'yicha ta\'lim beradi. Xorijiy talabalarga oyiga 1 500 AED stipendiya, kuniga 3 mahal ovqat va yotoqxona beriladi.',
  description_en: 'An Islamic university in Sharjah (UAE), founded in 2009 by Sheikh Sultan bin Muhammad Al Qasimi. Specialises in Islamic sciences, Arabic language, law and economics. Teaching is conducted in Arabic. International students receive a monthly stipend of 1,500 AED, three meals a day and free dormitory accommodation.',
  programs: ['Islamic Studies', 'Arabic Language', 'Shariah', 'Quran'],
  is_active: true,
  rank: 1,
  created_at: '2024-01-01',
}

function UniversitiesContent() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useLanguage()
  const [unis,     setUnis]     = useState<UniversityRow[]>([])
  const [filter,   setFilter]   = useState<'ALL' | 'SA' | 'AE' | 'QA' | 'KW' | 'TR'>((searchParams.get('country') as any) || 'ALL')
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

  // Merge AQ_UNI into list if not already in DB results
  const allUnis = unis.some(u => u.name_en === 'Al Qasimia University')
    ? unis
    : [AQ_UNI, ...unis]

  const allPrograms = Array.from(new Set(allUnis.flatMap(u => u.programs))).sort()

  const filtered = allUnis.filter(u => {
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
        <div className="text-white py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">
              {lang === 'ru' ? 'Университеты' : lang === 'uz' ? 'Universitetlar' : 'Universities'}
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">{t.universities.title}</h1>
            <p className="text-white/60 text-base sm:text-lg">{t.universities.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Search + filter block — static */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

          {/* Search row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                className="input pl-9 py-2.5 text-sm w-full"
                placeholder={lang === 'ru' ? 'Поиск университета...' : lang === 'uz' ? 'Universitetni qidirish...' : 'Search university...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="input py-2.5 text-sm w-[180px] hidden md:block shrink-0" value={prog} onChange={e => setProg(e.target.value)}>
              <option value="">{lang === 'ru' ? 'Все специальности' : lang === 'uz' ? 'Barcha mutaxassisliklar' : 'All specializations'}</option>
              {allPrograms.map(p => (
                <option key={p} value={p}>{lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}</option>
              ))}
            </select>
          </div>

          {/* Country filter row */}
          <div className="flex flex-wrap gap-2">
            {([
              { code: 'ALL', iso: null,  labelRu: 'Все страны',          labelEn: 'All',          labelUz: 'Barchasi' },
              { code: 'SA',  iso: 'sa',  labelRu: 'Саудовская Аравия',   labelEn: 'Saudi Arabia', labelUz: 'Saudiya' },
              { code: 'AE',  iso: 'ae',  labelRu: 'ОАЭ',                 labelEn: 'UAE',          labelUz: 'BAA' },
              { code: 'QA',  iso: 'qa',  labelRu: 'Катар',               labelEn: 'Qatar',        labelUz: 'Qatar' },
              { code: 'KW',  iso: 'kw',  labelRu: 'Кувейт',              labelEn: 'Kuwait',       labelUz: 'Quvayt' },
              { code: 'TR',  iso: 'tr',  labelRu: 'Турция',              labelEn: 'Turkey',       labelUz: 'Turkiya' },
            ] as { code: string; iso: string | null; labelRu: string; labelEn: string; labelUz: string }[]).map(c => {
              const isActive = filter === c.code
              const label = lang === 'ru' ? c.labelRu : lang === 'uz' ? c.labelUz : c.labelEn
              return (
                <button
                  key={c.code}
                  onClick={() => setFilter(c.code as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                    isActive
                      ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B4332]/40 hover:text-[#1B4332] hover:bg-[#1B4332]/5'
                  )}
                >
                  {c.iso ? (
                    <span className="w-5 h-3.5 rounded overflow-hidden shrink-0 shadow-sm inline-flex ring-1 ring-black/10">
                      <img src={`https://flagcdn.com/w40/${c.iso}.png`} alt={label} className="w-full h-full object-cover" />
                    </span>
                  ) : (
                    <Globe2 className="w-3.5 h-3.5 shrink-0" />
                  )}
                  {label}
                </button>
              )
            })}
          </div>

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
                const isAQ = uni.name_en === 'Al Qasimia University'

                if (isAQ) return (
                  <motion.div
                    key={uni.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card overflow-hidden group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ring-2 ring-[#1B4332]/20"
                  >
                    {/* AQ card header */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#071a10] via-[#1B4332] to-[#0a2218]">
                      <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}} />
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-[#C9922A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        <Star className="w-3 h-3 fill-white" />
                        {lang === 'ru' ? 'Приём открыт' : lang === 'uz' ? 'Qabul ochiq' : 'Admissions open'}
                      </div>
                      <div className="absolute top-3 right-3 z-20 w-7 h-5 rounded overflow-hidden shadow-sm">
                        <img src="https://flagcdn.com/w40/ae.png" alt="UAE" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/en/2/2f/Al_Qasimia_University_logo.png"
                          alt="Al Qasimia University"
                          className="h-20 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="font-bold text-white text-base leading-tight">{uni[nameKey]}</h3>
                        <div className="flex items-center gap-1 text-white/70 text-xs mt-1">
                          <MapPin className="w-3 h-3" /> Sharjah, UAE
                        </div>
                      </div>
                    </div>

                    {/* Benefits mini row */}
                    <div className="grid grid-cols-3 gap-0 border-b border-gray-100">
                      {[
                        { icon: <Banknote className="w-3.5 h-3.5" />, label: '1 500 AED' },
                        { icon: <UtensilsCrossed className="w-3.5 h-3.5" />, label: lang === 'ru' ? '3 раза/день' : lang === 'uz' ? '3 mahal' : '3 meals/day' },
                        { icon: <BedDouble className="w-3.5 h-3.5" />, label: lang === 'ru' ? 'Общежитие' : lang === 'uz' ? 'Yotoqxona' : 'Dorm' },
                      ].map((b, j) => (
                        <div key={j} className="flex flex-col items-center gap-1 py-2.5 text-[#1B4332] border-r last:border-r-0 border-gray-100">
                          {b.icon}
                          <span className="text-[10px] font-semibold">{b.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /><span>{foundedLabel} 2009</span></div>
                        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /><span>5,000+ {studentsLabel}</span></div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Islamic Studies','Arabic Language','Shariah','Quran'].slice(0,3).map(p => (
                          <span key={p} className="badge badge-green text-[10px]">{lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}</span>
                        ))}
                        <span className="badge badge-gray text-[10px]">+8</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <Link
                          href="/universities/al-qasimia"
                          className="text-xs text-brand-500 font-medium group-hover:underline"
                        >
                          {detailLabel} →
                        </Link>
                        <Link
                          href="/apply?country=AE"
                          onClick={e => e.stopPropagation()}
                          className="btn btn-primary btn-sm px-3 py-1.5 text-xs"
                        >
                          {applyLabel}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )

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
                      <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-green-700 opacity-50 z-10" />
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
                      <div className="absolute top-3 right-3 z-20">
                        <span className="w-7 h-5 rounded overflow-hidden shadow-sm inline-flex">
                          <img src={`https://flagcdn.com/w40/${uni.country.toLowerCase()}.png`} alt={uni.country} className="w-full h-full object-cover" />
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                        <h3 className="font-bold text-white text-base leading-tight drop-shadow">{uni[nameKey]}</h3>
                        {uni.city && <div className="flex items-center gap-1 text-white/80 text-xs mt-1"><MapPin className="w-3 h-3" /> {uni.city}</div>}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /><span>{foundedLabel} {extra.founded}</span></div>
                        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /><span>{extra.students} {studentsLabel}</span></div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {uni.programs.slice(0, 3).map(p => (
                          <span key={p} className="badge badge-green text-[10px]">{lang === 'ru' ? (PROGRAMS_RU[p] ?? p) : p}</span>
                        ))}
                        {uni.programs.length > 3 && <span className="badge badge-gray text-[10px]">+{uni.programs.length - 3}</span>}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-brand-500 font-medium group-hover:underline">{detailLabel} →</span>
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
                  {selected.name_en === 'Al Qasimia University' ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0d2b1e] via-[#1B4332] to-[#0a2218]" />
                      <div className="absolute inset-0 opacity-10" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'24px 24px'}} />
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/en/2/2f/Al_Qasimia_University_logo.png"
                          alt="Al Qasimia University"
                          className="h-24 w-auto object-contain drop-shadow-2xl"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-green-700 opacity-50 z-10" />
                      <img
                        src={extra.photo}
                        alt={selected.name_en}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 z-30 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>

                  {selected.name_en === 'Al Qasimia University' && (
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-1 bg-[#C9922A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      <Star className="w-3 h-3 fill-white" />
                      {lang === 'ru' ? 'Приём открыт' : lang === 'uz' ? 'Qabul ochiq' : 'Admissions open'}
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-8 h-5 rounded overflow-hidden shadow-sm inline-flex">
                        <img src={`https://flagcdn.com/w40/${selected.country.toLowerCase()}.png`} alt={selected.country} className="w-full h-full object-cover" />
                      </span>
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

                {/* Al Qasimia special sections */}
                {selected.name_en === 'Al Qasimia University' && (
                  <>
                    {/* Benefits */}
                    <div>
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">
                        {lang === 'ru' ? 'Что даёт университет студентам' : lang === 'uz' ? 'Universitet talabalariga nima beradi' : 'What the university provides'}
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Banknote className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div className="text-base font-bold text-emerald-800">1 500 AED</div>
                          <div className="text-[11px] text-emerald-600 leading-tight">
                            {lang === 'ru' ? 'стипендия в месяц' : lang === 'uz' ? 'oylik stipendiya' : 'monthly stipend'}
                          </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <UtensilsCrossed className="w-5 h-5 text-amber-700" />
                          </div>
                          <div className="text-base font-bold text-amber-800">
                            {lang === 'ru' ? '3 раза' : lang === 'uz' ? '3 marta' : '3 times'}
                          </div>
                          <div className="text-[11px] text-amber-600 leading-tight">
                            {lang === 'ru' ? 'питание в день' : lang === 'uz' ? 'kunlik ovqat' : 'meals per day'}
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <BedDouble className="w-5 h-5 text-blue-700" />
                          </div>
                          <div className="text-base font-bold text-blue-800">
                            {lang === 'ru' ? 'Общежитие' : lang === 'uz' ? 'Yotoqxona' : 'Dormitory'}
                          </div>
                          <div className="text-[11px] text-blue-600 leading-tight">
                            {lang === 'ru' ? 'бесплатное проживание' : lang === 'uz' ? 'bepul turar joy' : 'free accommodation'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Faculties */}
                    <div>
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">
                        {lang === 'ru' ? 'Факультеты — Бакалавриат' : lang === 'uz' ? 'Fakultetlar — Bakalavr' : 'Faculties — Bachelor'}
                      </p>
                      <div className="space-y-1.5">
                        {[
                          { ar: 'تفسير وعلوم القرآن',      ru: 'Толкование и науки Корана',       uz: 'Tafsir va Qur\'on fanlari' },
                          { ar: 'اللغة العربية وآدابها',    ru: 'Арабский язык и литература',      uz: 'Arab tili va adabiyoti' },
                          { ar: 'الإعلام',                  ru: 'Медиа и журналистика',             uz: 'Media va jurnalistika' },
                          { ar: 'الاقتصاد',                 ru: 'Экономика',                        uz: 'Iqtisodiyot' },
                          { ar: 'أصول الدين',               ru: 'Основы религии (Акыда)',           uz: 'Din asoslari (Aqida)' },
                          { ar: 'الفقه وأصوله',             ru: 'Исламское право (Фикх)',           uz: 'Islom huquqi (Fiqh)' },
                          { ar: 'الحضارة والتاريخ الإسلامي',ru: 'Исламская цивилизация и история', uz: 'Islom sivilizatsiyasi va tarixi' },
                          { ar: 'القراءات',                 ru: 'Чтение Корана (Кираат)',           uz: 'Qur\'on qiroati (Qiroat)' },
                        ].map((f, i) => (
                          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <span className="text-sm text-ink font-medium">
                              {lang === 'ru' ? f.ru : lang === 'uz' ? f.uz : f.ar}
                            </span>
                            <span className="text-xs text-gray-400" dir="rtl">{f.ar}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider mt-4 mb-3">
                        {lang === 'ru' ? 'Факультеты — Магистратура' : lang === 'uz' ? 'Fakultetlar — Magistratura' : 'Faculties — Master\'s'}
                      </p>
                      <div className="space-y-1.5">
                        {[
                          { ar: 'اللغة العربية وآدابها', ru: 'Арабский язык и литература', uz: 'Arab tili va adabiyoti' },
                          { ar: 'الفقه وأصوله',          ru: 'Исламское право (Фикх)',    uz: 'Islom huquqi (Fiqh)' },
                          { ar: 'التفسير والحديث',       ru: 'Тафсир и хадисоведение',   uz: 'Tafsir va hadis ilmi' },
                        ].map((f, i) => (
                          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <span className="text-sm text-ink font-medium">
                              {lang === 'ru' ? f.ru : lang === 'uz' ? f.uz : f.ar}
                            </span>
                            <span className="text-xs text-gray-400" dir="rtl">{f.ar}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required documents */}
                    <div>
                      <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">
                        {lang === 'ru' ? 'Необходимые документы' : lang === 'uz' ? 'Kerakli hujjatlar' : 'Required Documents'}
                      </p>
                      <div className="space-y-2">
                        {(lang === 'uz' ? [
                          'Xorijiy pasport (faqat bosh sahifasi)',
                          '11-sinf attestati',
                          '9-sinf o\'qish baholar jadvali',
                          '10-sinf o\'qish baholar jadvali',
                          'Bir dona fotosurat (3×4), rangli, oq fonda',
                          'Tibbiy ma\'lumotnoma (086 shakli)',
                          'Ta\'lim yoki ish joyidan tavsifnoma',
                          'Tug\'ilish guvohnomasi',
                          'Al-Qosimiya universitetining Instagram yoki Facebook sahifasiga obuna bo\'lganingizni tasdiqlash skrini',
                        ] : lang === 'en' ? [
                          'Passport (main page only)',
                          '11th grade certificate',
                          '9th grade transcript',
                          '10th grade transcript',
                          'One photo (3×4 cm), color on white background',
                          'Medical certificate (form 086)',
                          'Reference letter from school, university or workplace',
                          'Birth certificate',
                          'Screenshot confirming subscription to Al Qasimia Instagram or Facebook',
                        ] : [
                          'Загранпаспорт (только главная страница)',
                          'Аттестат 11 класса',
                          'Табель оценок за 9-й класс',
                          'Табель оценок за 10-й класс',
                          'Одна фотокарточка (3×4), цветной на белом фоне',
                          'Медицинская справка формы 086',
                          'Характеристика с места учёбы (школы, университета) или работы',
                          'Свидетельство о рождении',
                          'Скрин экрана, что вы подписаны на Instagram или Facebook вуза',
                        ]).map((doc, i) => (
                          <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-xl bg-gray-50">
                            <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              <FileCheck className="w-3 h-3 text-emerald-700" />
                            </div>
                            <span className="text-sm text-ink">{doc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-3">
                        <a
                          href="https://www.instagram.com/alqasimiauni/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-pink-200 bg-pink-50 text-pink-700 text-xs font-medium hover:bg-pink-100 transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </a>
                        <a
                          href="https://www.facebook.com/AlQasimiaUni/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </a>
                      </div>
                    </div>
                  </>
                )}

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
