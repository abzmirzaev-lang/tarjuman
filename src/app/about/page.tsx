'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useStudentCount } from '@/hooks/useStudentCount'
import { motion } from 'framer-motion'
import {
  ArrowRight, Target, Heart, Zap, Shield,
  CheckCircle2, Globe2, BookOpen,
  Star, Briefcase, Languages, Headphones,
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import type { AppLanguage } from '@/types'

const f = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const STATS = [
  { val: 'DYNAMIC',  ru: 'Подали заявку',           uz: 'Ariza topshirdi',         en: 'Applications submitted' },
  { val: '30+', ru: 'Университетов для подачи', uz: 'Topshirish universitetlari',   en: 'Universities to apply' },
  { val: '6ч',  ru: 'Минимальный срок подачи', uz: 'Minimal topshirish',      en: 'Min. turnaround' },
  { val: '1',   ru: 'Год на рынке',           uz: 'Yillik tajriba',          en: 'Year on market' },
]

const VALUES = [
  {
    icon: Target,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    ru: { t: 'Честность', b: 'Мы говорим правду о шансах на поступление. Никаких пустых обещаний — только реальная оценка и максимальная помощь.' },
    en: { t: 'Honesty', b: 'We tell the truth about admission chances. No empty promises — just realistic assessment and maximum support.' },
    uz: { t: 'Halollik', b: "Qabul imkoniyatlari haqida haqiqatni aytamiz. Bo'sh va'dalar yo'q — faqat haqiqiy baholash va maksimal yordam." },
  },
  {
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    ru: { t: 'Скорость', b: 'VIP-заявки за 12–24 часа, стандартные за 1–3 дня. Дедлайны — наша ответственность, не ваш стресс.' },
    en: { t: 'Speed', b: 'VIP applications in 12–24 hours, standard in 1–3 days. Deadlines are our responsibility, not your stress.' },
    uz: { t: 'Tezlik', b: 'VIP arizalar 12–24 soat, standart 1–3 kun ichida. Muddatlar — bizning mas\'uliyatimiz, sizning stressingiz emas.' },
  },
  {
    icon: Shield,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    ru: { t: 'Надёжность', b: 'Каждый документ проходит двойную проверку перед подачей. Ошибка в документах — это наша ответственность.' },
    en: { t: 'Reliability', b: 'Every document passes double review before submission. Document errors are our responsibility.' },
    uz: { t: 'Ishonchlilik', b: 'Har bir hujjat topshirishdan oldin ikki marta tekshiriladi. Hujjatlardagi xatolar — bizning mas\'uliyatimiz.' },
  },
  {
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    ru: { t: 'Забота', b: 'Мы сопровождаем каждого студента как своего. Вопрос в 2 ночи? Ответим. Срочный документ? Сделаем.' },
    en: { t: 'Care', b: 'We support every student like our own. Question at 2am? We\'ll answer. Urgent document? We\'ll handle it.' },
    uz: { t: 'G\'amxo\'rlik', b: 'Har bir talabaga o\'zimiznikidek yondashamiz. Tunda savol? Javob beramiz. Shoshilinch hujjat? Bajaramiz.' },
  },
]


const PROCESS = [
  { n: '01', icon: BookOpen, ru: { t: 'Вы оставляете заявку', b: 'Заполняете форму за 5 минут и загружаете документы прямо в личный кабинет.' }, en: { t: 'You apply', b: 'Fill out the form in 5 minutes and upload documents directly to your dashboard.' }, uz: { t: 'Ariza berasiz', b: '5 daqiqada formani to\'ldirasiz va hujjatlarni shaxsiy kabinetga yuklab qo\'yasiz.' } },
  { n: '02', icon: CheckCircle2, ru: { t: 'Мы проверяем документы', b: 'Каждый документ проходит проверку на соответствие требованиям вашего университета.' }, en: { t: 'We review documents', b: 'Every document is checked against your target university\'s requirements.' }, uz: { t: 'Hujjatlarni tekshiramiz', b: 'Har bir hujjat universitetingiz talablariga muvofiqligini tekshiramiz.' } },
  { n: '03', icon: Globe2, ru: { t: 'Переводим и оформляем', b: 'Профессиональные переводчики переводят документы на арабский. Проверяем всё ещё раз.' }, en: { t: 'We translate', b: 'Professional translators translate documents into Arabic. We verify everything once more.' }, uz: { t: 'Tarjima qilamiz', b: 'Professional tarjimonlar hujjatlarni arabchaga tarjima qiladi. Hamma narsani yana bir bor tekshiramiz.' } },
  { n: '04', icon: Zap, ru: { t: 'Подаём заявку', b: 'Направляем полный пакет в университет в установленные сроки — 12–48 часов в зависимости от пакета.' }, en: { t: 'We submit', b: 'We send the complete package to the university on schedule — 12–48 hours depending on your plan.' }, uz: { t: 'Ariza topshiramiz', b: 'To\'liq paketni belgilangan muddatda universitetga yuboramiz — paketga qarab 12–48 soat.' } },
  { n: '05', icon: Star, ru: { t: 'Вы получаете оффер', b: 'Сопровождаем до официального письма о зачислении. Telegram-уведомления на каждом шаге.' }, en: { t: 'You get the offer', b: 'We support you until the official admission letter. Telegram notifications at every step.' }, uz: { t: 'Taklif olasiz', b: 'Rasmiy qabul xatigacha yordam beramiz. Har bosqichda Telegram bildirishnomasi.' } },
]

const TEAM = [
  {
    name: 'Yazeed Alajaleen',
    role_ru: 'Директор',
    role_en: 'Director',
    role_uz: 'Direktor',
    icon: Briefcase,
    grad: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/25',
    ru: 'Руководит всеми операциями Tarjuman Edu. Отвечает за партнёрства с университетами и стратегическое развитие сервиса.',
    en: 'Leads all Tarjuman Edu operations. Responsible for university partnerships and the strategic development of the service.',
    uz: "Tarjuman Edu ning barcha operatsiyalarini boshqaradi. Universitetlar bilan hamkorlik va xizmatning strategik rivojlanishi uchun javobgar.",
  },
  {
    name: 'Abu Atika',
    role_ru: 'Основатель & Главный переводчик',
    role_en: 'Founder & Head Translator',
    role_uz: 'Asoschisi & Bosh tarjimon',
    icon: Languages,
    grad: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/25',
    ru: 'Основал Tarjuman Edu, пройдя через процесс поступления в арабские университеты лично. Отвечает за качество всех переводов.',
    en: 'Founded Tarjuman Edu after going through the university application process personally. Responsible for the quality of all translations.',
    uz: "Arab universitetlariga qabul jarayonini shaxsan bosib o'tib, Tarjuman Edu ni tashkil etdi. Barcha tarjimalar sifati uchun javobgar.",
  },
  {
    name: 'Abu Afnan',
    role_ru: 'Менеджер & Переводчик',
    role_en: 'Manager & Translator',
    role_uz: 'Menejer & Tarjimon',
    icon: Headphones,
    grad: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/25',
    ru: 'Сопровождает каждого студента от первой заявки до зачисления. Также участвует в переводе документов и проверке пакетов.',
    en: 'Guides every student from the first application to enrollment. Also assists with document translation and package review.',
    uz: "Har bir talabani birinchi arizadan qabulga qadar yo'llab-quvvatlaydi. Hujjatlar tarjimasi va paketlarni tekshirishda ham ishtirok etadi.",
  },
]

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const [lang, setLang] = useLanguage()
  const studentCount = useStudentCount()
  const l = lang as AppLanguage

  const t = (obj: { ru: string; en: string; uz: string }) =>
    l === 'uz' ? obj.uz : l === 'en' ? obj.en : obj.ru

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-ink pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-violet-900/10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 py-24 md:py-32 text-center relative z-10">
          <motion.div {...f(0)} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold uppercase tracking-widest">
              {t({ ru: 'О нас', en: 'About us', uz: 'Biz haqimizda' })}
            </span>
          </motion.div>

          <motion.h1 {...f(0.08)} className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.06] tracking-tight mb-6">
            {t({
              ru: <>Мы открываем двери<br /><span className="text-brand-400">в арабские университеты</span></>,
              en: <>Opening doors to<br /><span className="text-brand-400">Arab universities</span></>,
              uz: <>Arab universitetlariga<br /><span className="text-brand-400">eshiklar ochamiz</span></>,
            })}
          </motion.h1>

          <motion.p {...f(0.16)} className="text-white/60 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            {t({
              ru: 'Tarjuman Edu — образовательный сервис нового поколения для студентов СНГ, мечтающих об учёбе в Саудовской Аравии и ОАЭ.',
              en: 'Tarjuman Edu is a next-generation educational service for CIS students dreaming of studying in Saudi Arabia and the UAE.',
              uz: "Tarjuman Edu — Saudiya Arabistoni va BAA da o'qishni orzu qilgan MDH talabalari uchun yangi avlod ta'lim xizmati.",
            })}
          </motion.p>

          {/* Stats row */}
          <motion.div {...f(0.22)} className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-3xl overflow-hidden max-w-2xl mx-auto border border-white/10">
            {STATS.map((s, i) => (
              <div key={i} className="bg-black/20 py-6 px-4 text-center">
                <div className="text-3xl font-black text-white mb-1">{s.val === 'DYNAMIC' ? studentCount : s.val}</div>
                <div className="text-white/50 text-xs">{t({ ru: s.ru, en: s.en, uz: s.uz })}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* ── ЦЕННОСТИ ─────────────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div {...f(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
                {t({ ru: 'Наши ценности', en: 'Our Values', uz: 'Bizning qadriyatlarimiz' })}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-ink">
                {t({ ru: 'Что нами движет', en: 'What drives us', uz: 'Bizni nima harakatlantiradi' })}
              </h2>
            </motion.div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={i} {...f(i * 0.08)}
                className="group relative bg-white rounded-2xl border border-border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon className="w-6 h-6 text-ink" />
                </div>
                <h3 className="font-bold text-ink mb-2">{t(v.ru.t === v.ru.t ? { ru: v.ru.t, en: v.en.t, uz: v.uz.t } : { ru: '', en: '', uz: '' })}</h3>
                <p className="text-sm text-muted leading-relaxed">{t({ ru: v.ru.b, en: v.en.b, uz: v.uz.b })}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ── КОМАНДА ──────────────────────────────────────────────────────── */}
      <section className="section bg-ink relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-violet-900/10 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <motion.div {...f(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">
                {t({ ru: 'Команда', en: 'Our Team', uz: 'Jamoa' })}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                {t({ ru: 'Люди за сервисом', en: 'The people behind the service', uz: 'Xizmat ortidagi odamlar' })}
              </h2>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                {t({
                  ru: 'Небольшая, но сильная команда экспертов с личным опытом поступления в арабские университеты.',
                  en: 'A small but strong team of experts with personal experience of enrolling in Arab universities.',
                  uz: 'Arab universitetlariga kirish shaxsiy tajribasiga ega kichik, lekin kuchli mutaxassislar jamoasi.',
                })}
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TEAM.map((m, i) => (
              <motion.div key={i} {...f(i * 0.08)}
                className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${m.grad} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                {/* Icon avatar */}
                <div className="relative mx-auto mb-5 w-20 h-20">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${m.grad} flex items-center justify-center shadow-2xl ${m.glow}`}>
                    <m.icon className="w-9 h-9 text-white" strokeWidth={1.5} />
                  </div>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${m.grad} blur-xl opacity-40 -z-10`} />
                </div>
                <h3 className="font-bold text-white text-base mb-1">{m.name}</h3>
                <p className="text-brand-400 text-xs font-semibold mb-4 uppercase tracking-wide">
                  {t({ ru: m.role_ru, en: m.role_en, uz: m.role_uz })}
                </p>
                <p className="text-white/50 text-xs leading-relaxed">{t({ ru: m.ru, en: m.en, uz: m.uz })}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРОЦЕСС РАБОТЫ ───────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div {...f(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
                {t({ ru: 'Процесс работы', en: 'How we work', uz: 'Ish jarayoni' })}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-ink">
                {t({ ru: '5 шагов до зачисления', en: '5 steps to enrollment', uz: 'Qabulga 5 qadam' })}
              </h2>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-5 gap-4">
            {PROCESS.map((step, i) => (
              <motion.div key={i} {...f(i * 0.08)} className="relative text-center">
                {/* Connector */}
                {i < PROCESS.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-1/2 w-full h-px bg-border z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mx-auto mb-3 shadow-md">
                    <step.icon className="w-7 h-7 text-brand-400" />
                  </div>
                  <span className="text-brand-500 text-xs font-bold">{step.n}</span>
                  <h3 className="font-bold text-ink text-sm mt-1 mb-1">{t({ ru: step.ru.t, en: step.en.t, uz: step.uz.t })}</h3>
                  <p className="text-muted text-xs leading-relaxed">{t({ ru: step.ru.b, en: step.en.b, uz: step.uz.b })}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section bg-[#F7F8FA]">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...f(0)} className="rounded-3xl bg-ink text-white p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black mb-3">
                {t({ ru: 'Готовы начать путь?', en: 'Ready to begin your journey?', uz: 'Yo\'lni boshlashga tayyormisiz?' })}
              </h2>
              <p className="text-white/60 mb-8 text-base max-w-md mx-auto">
                {t({
                  ru: 'Подайте заявку за 5 минут — мы возьмём всё в свои руки.',
                  en: 'Apply in 5 minutes — we\'ll take care of everything.',
                  uz: '5 daqiqada ariza bering — biz hamma narsani o\'z zimmasimizga olamiz.',
                })}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/apply">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-400 text-ink font-bold rounded-2xl text-base hover:bg-brand-300 transition-colors shadow-xl shadow-brand-400/20"
                  >
                    {t({ ru: 'Подать заявку', en: 'Apply now', uz: 'Ariza berish' })}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl text-base hover:bg-white/20 transition-colors"
                  >
                    {t({ ru: 'Связаться с нами', en: 'Contact us', uz: 'Biz bilan bog\'lanish' })}
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </>
  )
}
