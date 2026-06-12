'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { Navbar } from '@/components/layout/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, ChevronDown, BookOpen, Headphones,
  PenLine, Mic, Monitor, Building2, ArrowRight, CheckCircle2, Globe
} from 'lucide-react'

const ARABIC_CHARS = ['ا','ب','ح','د','ع','ف','ق','ك','ل','م','ن','ه','و','ي','ص','ط','ظ','غ','خ','ش','ث','ذ','ز','همزة']

function FloatingLetters() {
  const letters = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    char: ARABIC_CHARS[i % ARABIC_CHARS.length],
    size: 48 + (i % 5) * 28,
    left: (i * 6 + 3) % 96,
    delay: (i * 0.7) % 8,
    duration: 12 + (i % 4) * 4,
    opacity: 0.06 + (i % 4) * 0.04,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {letters.map(l => (
        <div
          key={l.id}
          className="absolute font-serif text-[#1B4332] select-none"
          style={{
            fontSize: l.size,
            left: `${l.left}%`,
            opacity: l.opacity,
            animation: `floatUp ${l.duration}s ${l.delay}s infinite linear`,
            bottom: '-10%',
          }}
        >
          {l.char}
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0)   rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(15deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
import Link from 'next/link'

type Lang = 'ru' | 'uz' | 'en'

const T = {
  ru: {
    badge: 'Академический экзамен · Арабский язык',
    name: 'Тест «Хамза»',
    nameAr: 'اختبار همزة',
    tagline: 'Международный академический тест по арабскому языку',
    aboutTitle: 'Об экзамене',
    aboutText: 'Академический тест «Хамза» — стандартизированный экзамен по арабскому языку для носителей других языков. Разработан в соответствии с международной системой CEFR. Создатель — Глобальный центр арабского языка имени короля Салмана.',
    levelsTitle: 'Уровни CEFR',
    structureTitle: 'Структура экзамена',
    formatTitle: 'Формат сдачи',
    forWhomTitle: 'Для кого?',
    benefitsTitle: 'Преимущества',
    ctaTitle: 'Готовы зарегистрироваться?',
    ctaBtn: 'Подать заявку на Хамза →',
    duration: '155 минут',
    questions: '75 вопросов',
    durationLabel: 'Продолжительность',
    questionsLabel: 'Количество заданий',
  },
  uz: {
    badge: 'Akademik imtihon · Arab tili',
    name: '«Hamza» testi',
    nameAr: 'اختبار همزة',
    tagline: 'Xalqaro akademik arab tili testi',
    aboutTitle: 'Imtihon haqida',
    aboutText: '«Hamza» akademik testi — arab tili bo\'lmagan talabalar uchun standartlashtirilgan imtihon. CEFR xalqaro tizimiga muvofiq ishlab chiqilgan. Muallif — Qirol Salmon nomidagi Global Arab Tili Markazi.',
    levelsTitle: 'CEFR darajalari',
    structureTitle: 'Imtihon tuzilishi',
    formatTitle: 'O\'tkazish formati',
    forWhomTitle: 'Kim uchun?',
    benefitsTitle: 'Afzalliklari',
    ctaTitle: 'Ro\'yxatdan o\'tishga tayyormisiz?',
    ctaBtn: 'Hamza testiga ariza topshirish →',
    duration: '155 daqiqa',
    questions: '75 savol',
    durationLabel: 'Davomiyligi',
    questionsLabel: 'Savollar soni',
  },
}

const LEVELS = [
  { level: 'A2', label: { ru: 'Базовый', uz: 'Boshlang\'ich' }, color: 'bg-green-100 text-green-800 border-green-200' },
  { level: 'B1', label: { ru: 'Средний', uz: 'O\'rta' }, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { level: 'B2', label: { ru: 'Выше среднего', uz: 'O\'rtadan yuqori' }, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { level: 'C1', label: { ru: 'Продвинутый', uz: 'Yuqori' }, color: 'bg-purple-100 text-purple-800 border-purple-200' },
]

const STRUCTURE = {
  ru: [
    { icon: <Headphones className="w-5 h-5" />, title: 'Аудирование', desc: 'Прослушивание аудиоматериалов, ответы на вопросы', count: '30 заданий', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'Чтение', desc: 'Работа с текстами различной сложности', count: '40 заданий', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { icon: <PenLine className="w-5 h-5" />, title: 'Письмо', desc: 'Эссе на общую тему, 200–250 слов', count: '1 задание', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    { icon: <Mic className="w-5 h-5" />, title: 'Говорение', desc: 'Ответы на вопросы, монолог на заданную тему', count: '4 задания', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  ],
  uz: [
    { icon: <Headphones className="w-5 h-5" />, title: 'Tinglash', desc: 'Audio materiallarni tinglash, savollarga javob', count: '30 ta savol', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { icon: <BookOpen className="w-5 h-5" />, title: 'O\'qish', desc: 'Turli darajadagi matnlar bilan ishlash', count: '40 ta savol', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { icon: <PenLine className="w-5 h-5" />, title: 'Yozish', desc: 'Umumiy mavzuda insho, 200–250 so\'z', count: '1 ta savol', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    { icon: <Mic className="w-5 h-5" />, title: 'Gapirish', desc: 'Savollarga javob, berilgan mavzuda monolog', count: '4 ta savol', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  ],
}

const FOR_WHOM = {
  ru: ['Университеты и академические учреждения', 'Преподаватели и студенты арабского языка', 'Работодатели и образовательные организации', 'Все, кто изучает арабский и хочет подтвердить уровень'],
  uz: ['Universitetlar va akademik muassasalar', 'Arab tili o\'qituvchilari va talabalari', 'Ish beruvchilar va ta\'lim tashkilotlari', 'Arab tilini o\'rganib, darajasini tasdiqlashni istagan har kim'],
}

const BENEFITS = {
  ru: ['Международно признанный стандарт оценки языка', 'Помогает при поступлении в университеты арабских стран', 'Точно определяет уровень владения арабским языком', 'Повышает шансы на обучение и работу в арабских странах'],
  uz: ['Xalqaro tan olingan til baholash standarti', 'Arab mamlakatlari universitetlariga kirish imkoniyatini oshiradi', 'Arab tili bilim darajasini aniq belgilaydi', 'Arab mamlakatlarida o\'qish va ishlash imkoniyatlarini oshiradi'],
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
      >
        <span className="font-semibold text-gray-900 text-sm leading-snug">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3 whitespace-pre-line">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function HamzaTestPage() {
  const [lang] = useLanguage()
  const l = (lang === 'uz' ? 'uz' : 'ru') as 'ru' | 'uz'
  const t = T[l]

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ minHeight: 320 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ef] via-[#e8f0e6] to-[#ddeedd]" />
        <FloatingLetters />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#1B4332]/15 rounded-full px-4 py-1.5 mb-6">
              <Globe className="w-3.5 h-3.5 text-[#1B4332]" />
              <span className="text-[#1B4332]/80 text-xs font-medium">{t.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1B4332] mb-2 leading-tight">
              {t.name}
            </h1>
            <p className="text-2xl text-[#C9922A] font-bold mb-4" dir="rtl">{t.nameAr}</p>
            <p className="text-[#1B4332]/60 text-lg max-w-xl mx-auto">{t.tagline}</p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="text-center">
                <p className="text-2xl font-black text-[#1B4332]">{t.duration}</p>
                <p className="text-xs text-[#1B4332]/50 mt-0.5">{t.durationLabel}</p>
              </div>
              <div className="w-px h-10 bg-[#1B4332]/20" />
              <div className="text-center">
                <p className="text-2xl font-black text-[#1B4332]">{t.questions}</p>
                <p className="text-xs text-[#1B4332]/50 mt-0.5">{t.questionsLabel}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* About */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.aboutTitle}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-600 leading-relaxed">{t.aboutText}</p>
          </div>
        </motion.section>

        {/* Levels */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.levelsTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LEVELS.map(lv => (
              <div key={lv.level} className={`rounded-2xl border p-4 text-center ${lv.color}`}>
                <p className="text-2xl font-black">{lv.level}</p>
                <p className="text-xs font-medium mt-1">{lv.label[l]}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Structure */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.structureTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {STRUCTURE[l].map((s, i) => (
              <div key={i} className={`rounded-2xl border p-5 ${s.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{s.title}</p>
                    <p className="text-xs opacity-70">{s.count}</p>
                  </div>
                </div>
                <p className="text-sm opacity-80 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Format */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.formatTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <Monitor className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {l === 'ru' ? 'Онлайн через интернет (дистанционно)' : 'Onlayn internet orqali (masofaviy)'}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {l === 'ru' ? 'В аккредитованных экзаменационных центрах' : 'Akkreditatsiyalangan imtihon markazlarida'}
              </p>
            </div>
          </div>
        </motion.section>

        {/* For whom */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.forWhomTitle}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            {FOR_WHOM[l].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.benefitsTitle}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            {BENEFITS[l].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] rounded-3xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">{t.ctaTitle}</h2>
            <p className="text-white/60 text-sm mb-6">
              {l === 'ru'
                ? 'Официальный портал регистрации на экзамен «Хамза»'
                : '«Hamza» imtihoniga rasmiy ro\'yxatdan o\'tish portali'}
            </p>
            <a
              href="https://form.ksaa.gov.sa/ic/builder/rt/hamzatest_1_0/live/webApps/regapp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C9922A] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#b8831e] transition-colors"
            >
              {t.ctaBtn}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  )
}
