'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import {
  GraduationCap,
  Globe2,
  Languages,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  UserPlus,
  CreditCard,
  ClipboardCheck,
  AlertTriangle,
  ShieldCheck,
  Info,
  ArrowRight,
  Wallet,
} from 'lucide-react'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=1600&q=80&auto=format'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
})

const facts = [
  { icon: GraduationCap, label: 'Университет',    value: 'Исламский университет Медины' },
  { icon: Globe2,        label: 'Формат обучения', value: 'Полностью дистанционно, онлайн' },
  { icon: Languages,     label: 'Язык обучения',   value: 'Арабский' },
  { icon: CalendarDays,  label: 'Приём документов', value: '1448 учебный год (2026/2027)' },
]

const grantCovers = [
  { title: 'Регистрация за семестр', desc: 'начиная со 2-го семестра', price: '230 SAR', usd: '≈ $61' },
  { title: 'Каждый кредитный час',   desc: 'учебная нагрузка по плану', price: '230 SAR', usd: '≈ $61' },
  { title: 'Пересдача экзамена',     desc: 'если понадобится после финала', price: '115 SAR', usd: '≈ $31' },
  { title: 'Выпуск и диплом',        desc: 'оформление документов при выпуске', price: '575 SAR', usd: '≈ $153' },
]

const conditions = [
  'Вы не гражданин Саудовской Аравии и постоянно не проживаете в стране',
  'Есть аттестат о среднем образовании или выше, признанный университетом',
  'Вас не отчисляли из другого учебного заведения за академические или дисциплинарные нарушения',
  'Свободно владеете арабским языком',
  'Если предыдущее образование было не на арабском — нужно сдать тест на уровень языка',
  'Готовы соблюдать академические и поведенческие правила университета',
  'Нет медицинских противопоказаний к дистанционному обучению',
  'Готовы выполнять условия вакфа — при нарушении грант могут отменить',
]

const documents = [
  'Аттестат о среднем образовании (оригинал)',
  'Выписка оценок (табель успеваемости)',
  'Справка об отсутствии судимости',
  'Действующий загранпаспорт',
]

const steps = [
  { icon: FileCheck2,      title: 'Подача заявки',   desc: 'Через официальный портал дистанционного обучения университета — только там' },
  { icon: UserPlus,        title: 'Регистрация',      desc: 'Заводите личный кабинет студента в системе дистанционного обучения' },
  { icon: CreditCard,      title: 'Оплата взноса',    desc: 'Разовый регистрационный сбор — он не возвращается' },
  { icon: ClipboardCheck,  title: 'Решение приёмной комиссии', desc: 'Университет проверяет документы и при зачислении выдаёт студенческий номер' },
]

const importantNotes = [
  'Обучение полностью на арабском языке — без англоязычного или русскоязычного трека.',
  'У университета нет представителей или агентов ни в одной другой стране. Если кто-то представляется "официальным агентом IUM" — это повод насторожиться.',
  'Заявка считается принятой только после официального объявления результатов на портале, а не после самой подачи документов.',
  'Для сдачи экзаменов онлайн нужен компьютер с камерой и микрофоном — смартфоны и планшеты для этого не подойдут.',
  'Регистрационный взнос не возвращается, даже если вы передумаете или отзовёте заявку.',
]

const diplomaSteps = [
  'Пройти все дисциплины и кредитные часы по учебному плану',
  'Набрать средний балл, необходимый для выпуска',
  'Сдать итоговый комплексный экзамен очно',
  'Выполнить остальные требования к выпуску по регламенту университета',
]

export default function DistanceShariaClient() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F8FA]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[56vh] min-h-[380px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Исламский университет Медины"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pb-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <Link href="/" className="inline-block text-sm text-white/70 hover:text-white transition-colors mb-4">← На главную</Link>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
              <CalendarDays className="w-3.5 h-3.5" />
              Приём на 1448 учебный год
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              Дистанционный бакалавриат Шариата — Исламский университет Медины
            </h1>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl">
              Один из самых уважаемых исламских вузов мира открывает набор на программу бакалавриата Шариата для иностранных студентов в формате полного дистанционного обучения. Программа реализуется совместно с Вакфом короля Абдаллы бен Абдулазиза, поэтому большую часть расходов на обучение покрывает грант.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">

          <motion.section {...fadeUp()} className="bg-white rounded-2xl border border-border p-6">
            <div className="grid grid-cols-2 gap-4">
              {facts.map(f => (
                <div key={f.label} className="flex items-start gap-3 bg-[#F7F8FA] rounded-xl p-3">
                  <f.icon className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted">{f.label}</p>
                    <p className="font-bold text-ink text-sm leading-snug">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fadeUp(0.05)} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl font-bold text-emerald-900">Что берёт на себя грант</h2>
            </div>
            <p className="text-sm text-emerald-800 mb-4">
              Вакф короля Абдаллы бен Абдулазиза оплачивает большинство учебных расходов студентам, которые приняты в программу и соблюдают её условия:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {grantCovers.map((g, i) => (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: 'easeOut' }}
                  className="bg-white rounded-xl p-3 border border-emerald-100"
                >
                  <p className="font-bold text-ink text-sm">{g.title}</p>
                  <p className="text-xs text-muted mb-1">{g.desc}</p>
                  <p className="text-emerald-700 font-black text-sm">{g.price} <span className="font-medium text-emerald-600">{g.usd}</span></p>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-emerald-700 mt-3">Грант сохраняется, пока студент соблюдает правила университета и условия вакфа. Университет вправе прекратить грант при их нарушении.</p>
          </motion.section>

          <motion.section {...fadeUp()}>
            <h2 className="text-2xl font-bold text-ink mb-3">Кто может подать заявку</h2>
            <ul className="grid gap-2.5">
              {conditions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-white border border-border rounded-xl p-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-ink">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted mt-3">Даже если все условия выполнены, окончательное решение остаётся за университетом — он вправе отказать в приёме без объяснения причин.</p>
          </motion.section>

          <motion.section {...fadeUp()}>
            <h2 className="text-2xl font-bold text-ink mb-3">Какие документы понадобятся</h2>
            <div className="grid grid-cols-2 gap-3">
              {documents.map(s => (
                <div key={s} className="flex items-center gap-2 bg-white border border-border rounded-xl p-3 text-sm font-medium text-ink">
                  <FileCheck2 className="w-4 h-4 text-brand-500 shrink-0" />
                  {s}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">Важно: нужны чёткие сканы с оригиналов документов. Скан с копии (не с оригинала) университет не примет.</p>
          </motion.section>

          <motion.section {...fadeUp()}>
            <h2 className="text-2xl font-bold text-ink mb-3">Как проходит поступление</h2>
            <div className="space-y-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: 'easeOut' }}
                  className="flex gap-4 bg-white rounded-xl border border-border p-4"
                >
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center">
                      <s.icon className="w-4 h-4 text-brand-600" />
                    </span>
                    <span className="text-xs font-bold text-muted">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-bold text-ink">{s.title}</p>
                    <p className="text-sm text-muted">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fadeUp()} className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-bold text-ink">Сколько нужно заплатить самому при подаче</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-3 bg-[#F7F8FA] rounded-xl">
                <p className="font-bold text-ink text-sm">Регистрация и активация файла</p>
                <p className="text-xl font-black text-brand-600">230 SAR</p>
                <p className="text-xs text-muted">≈ $61 · не возвращается</p>
              </div>
              <div className="text-center p-3 bg-[#F7F8FA] rounded-xl">
                <p className="font-bold text-ink text-sm">Тест на уровень арабского</p>
                <p className="text-xl font-black text-brand-600">230 SAR</p>
                <p className="text-xs text-muted">≈ $61 · если требуется, не возвращается даже при неудачной сдаче</p>
              </div>
            </div>
            <p className="text-xs text-muted">Суммы указаны с учётом НДС. Все дальнейшие расходы — за семестр, кредитные часы, экзамены, выпуск — покрывает грант вакфа, пока сохраняется его статус.</p>
          </motion.section>

          <motion.section {...fadeUp()}>
            <h2 className="text-2xl font-bold text-ink mb-3">Что нужно, чтобы получить диплом</h2>
            <ul className="grid gap-2.5 mb-3">
              {diplomaSteps.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-white border border-border rounded-xl p-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-ink">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>Диплом выдаётся только после очной сдачи итогового экзамена. На экзамен нужно приехать лично, за свой счёт, в место и сроки, которые определит университет.</span>
            </div>
          </motion.section>

          <motion.section {...fadeUp()} className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-ink" />
              <h2 className="text-xl font-bold text-ink">Важно знать заранее</h2>
            </div>
            <ul className="space-y-3">
              {importantNotes.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span className="text-sm text-ink leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section {...fadeUp()} className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-ink mb-2">Подать заявку на программу</h2>
            <p className="text-muted text-sm mb-4">Tarjuman Edu переведёт документы на арабский язык, поможет правильно оформить заявку и подать её через официальный портал Исламского университета Медины.</p>
            <a
              href="https://t.me/tarjumanedu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-brand-400 text-ink font-bold rounded-xl hover:bg-brand-300 active:scale-[0.98] transition-all duration-150"
            >
              Начать поступление в IUM
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.section>
        </div>
      </div>
      </main>
    </>
  )
}
