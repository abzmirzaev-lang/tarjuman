'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { motion } from 'framer-motion'
import {
  ArrowRight, Target, Heart, Zap, Shield,
  CheckCircle2, Globe2, Users, BookOpen,
  Star, Lightbulb, TrendingUp, Clock,
} from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import type { AppLanguage } from '@/types'

const f = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const STATS = [
  { val: '120+', ru: 'Заявок обработано',     uz: 'Ariza ko\'rib chiqildi',   en: 'Applications processed' },
  { val: '95%',  ru: 'Успешных зачислений',   uz: 'Muvaffaqiyatli qabullar', en: 'Successful enrollments' },
  { val: '12+',  ru: 'Университетов-партнёров', uz: 'Hamkor universitetlar',   en: 'Partner universities' },
  { val: '6ч',   ru: 'Минимальный срок',      uz: 'Minimal muddat',           en: 'Minimum turnaround' },
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

const TIMELINE = [
  {
    year: '2022',
    icon: Lightbulb,
    ru: { t: 'Идея', b: 'Наш основатель, сам прошедший через мучительный процесс поступления в Исламский университет Медины, решил создать сервис, который упростит этот путь для других студентов.' },
    en: { t: 'The Idea', b: 'Our founder, having gone through the painful process of applying to the Islamic University of Madinah, decided to build a service that simplifies this journey for other students.' },
    uz: { t: 'G\'oya', b: 'Asoschiimiz, o\'zi Madina Islom universiteti qabul jarayonini og\'ir bosib o\'tib, boshqa talabalar uchun bu yo\'lni osonlashtiradigan xizmat yaratishga qaror qildi.' },
  },
  {
    year: '2023',
    icon: Users,
    ru: { t: 'Первые студенты', b: 'Запустили сервис в тестовом режиме. Первые 10 студентов прошли через весь наш процесс — от перевода документов до подачи заявки. Качество работы команды подтвердилось на практике.' },
    en: { t: 'First Students', b: 'Launched in beta mode. The first 10 students went through our full process — from document translation to application submission. The quality of our team\'s work was proven in practice.' },
    uz: { t: 'Birinchi talabalar', b: 'Xizmatni sinov rejimida ishga tushirdik. Birinchi 10 talaba hujjat tarjimasidan ariza topshirishgacha bo\'lgan jarayondan o\'tdi. Jamoa ishining sifati amalda tasdiqlandi.' },
  },
  {
    year: '2024',
    icon: TrendingUp,
    ru: { t: 'Масштабирование', b: 'Расширили команду, добавили направление ОАЭ, запустили личный кабинет с онлайн-трекингом. Число обработанных заявок перевалило за 100.' },
    en: { t: 'Scaling Up', b: 'Expanded the team, added the UAE direction, launched personal dashboard with online tracking. Number of processed applications crossed 100.' },
    uz: { t: 'Kengayish', b: 'Jamoani kengaytirdik, BAA yo\'nalishi qo\'shdik, onlayn kuzatuv bilan shaxsiy kabinet ishga tushirdik. Ko\'rib chiqilgan arizalar soni 100 dan oshdi.' },
  },
  {
    year: '2025',
    icon: Globe2,
    ru: { t: 'Сегодня', b: 'Tarjuman Edu — признанный сервис с 12+ университетами-партнёрами. Продолжаем расти и помогаем студентам из СНГ построить своё будущее в лучших университетах арабского мира.' },
    en: { t: 'Today', b: 'Tarjuman Edu is a recognized service with 12+ partner universities. We continue growing and helping CIS students build their future at the best universities in the Arab world.' },
    uz: { t: 'Bugun', b: 'Tarjuman Edu — 12+ hamkor universiteti bilan tan olingan xizmat. O\'sishni davom ettiramiz va MDH talabalariga arab dunyosining eng yaxshi universitetlarida kelajak qurishga yordam beramiz.' },
  },
]

const PROCESS = [
  { n: '01', icon: BookOpen, ru: { t: 'Вы оставляете заявку', b: 'Заполняете форму за 5 минут и загружаете документы прямо в личный кабинет.' }, en: { t: 'You apply', b: 'Fill out the form in 5 minutes and upload documents directly to your dashboard.' }, uz: { t: 'Ariza berasiz', b: '5 daqiqada formani to\'ldirasiz va hujjatlarni shaxsiy kabinetga yuklab qo\'yasiz.' } },
  { n: '02', icon: CheckCircle2, ru: { t: 'Мы проверяем документы', b: 'Каждый документ проходит проверку на соответствие требованиям вашего университета.' }, en: { t: 'We review documents', b: 'Every document is checked against your target university\'s requirements.' }, uz: { t: 'Hujjatlarni tekshiramiz', b: 'Har bir hujjat universitetingiz talablariga muvofiqligini tekshiramiz.' } },
  { n: '03', icon: Globe2, ru: { t: 'Переводим и оформляем', b: 'Сертифицированные переводчики переводят документы на арабский. Проверяем всё ещё раз.' }, en: { t: 'We translate', b: 'Certified translators translate documents into Arabic. We verify everything once more.' }, uz: { t: 'Tarjima qilamiz', b: 'Sertifikatlangan tarjimonlar hujjatlarni arabchaga tarjima qiladi. Hamma narsani yana bir bor tekshiramiz.' } },
  { n: '04', icon: Zap, ru: { t: 'Подаём заявку', b: 'Направляем полный пакет в университет в установленные сроки — 12–48 часов в зависимости от пакета.' }, en: { t: 'We submit', b: 'We send the complete package to the university on schedule — 12–48 hours depending on your plan.' }, uz: { t: 'Ariza topshiramiz', b: 'To\'liq paketni belgilangan muddatda universitetga yuboramiz — paketga qarab 12–48 soat.' } },
  { n: '05', icon: Star, ru: { t: 'Вы получаете оффер', b: 'Сопровождаем до официального письма о зачислении. Telegram-уведомления на каждом шаге.' }, en: { t: 'You get the offer', b: 'We support you until the official admission letter. Telegram notifications at every step.' }, uz: { t: 'Taklif olasiz', b: 'Rasmiy qabul xatigacha yordam beramiz. Har bosqichda Telegram bildirishnomasi.' } },
]

const TEAM = [
  {
    name: 'Абдурахман',
    role_ru: 'Основатель & CEO',
    role_en: 'Founder & CEO',
    role_uz: 'Asoschisi & CEO',
    emoji: '👨‍💼',
    grad: 'from-violet-500 to-purple-600',
    ru: 'Сам поступил в Исламский университет Медины. Знает процесс изнутри и создал Tarjuman Edu, чтобы сделать его доступным для всех.',
    en: 'Personally enrolled in the Islamic University of Madinah. Knows the process from the inside and built Tarjuman Edu to make it accessible to all.',
    uz: "O'zi Madina Islom universitetiga kirgan. Jarayonni ichidan biladi va uni hammaga ochiq qilish uchun Tarjuman Edu ni yaratdi.",
  },
  {
    name: 'Зайнаб',
    role_ru: 'Главный переводчик',
    role_en: 'Head Translator',
    role_uz: 'Bosh tarjimon',
    emoji: '👩‍🎓',
    grad: 'from-rose-500 to-pink-600',
    ru: 'Сертифицированный арабист с 7-летним опытом. Отвечает за качество всех переводов и соответствие требованиям университетов.',
    en: 'Certified Arabist with 7 years of experience. Responsible for the quality of all translations and university compliance.',
    uz: '7 yillik tajribaga ega sertifikatlangan arabshunos. Barcha tarjimalar sifati va universitetlar talablariga muvofiqlik uchun javobgar.',
  },
  {
    name: 'Мухаммад',
    role_ru: 'Менеджер по поступлению',
    role_en: 'Admissions Manager',
    role_uz: 'Qabul menejeri',
    emoji: '👨‍💻',
    grad: 'from-blue-500 to-cyan-600',
    ru: 'Специалист по требованиям 20+ арабских университетов. Лично курирует каждую заявку от проверки документов до зачисления.',
    en: 'Specialist in requirements of 20+ Arab universities. Personally oversees each application from document review to enrollment.',
    uz: '20+ arab universiteti talablarini biluvchi mutaxassis. Hujjatlar tekshirishdan qabulga qadar har bir arizani shaxsan nazorat qiladi.',
  },
  {
    name: 'Нилуфар',
    role_ru: 'Менеджер поддержки',
    role_en: 'Support Manager',
    role_uz: 'Qo\'llab-quvvatlash menejeri',
    emoji: '👩‍💼',
    grad: 'from-emerald-500 to-teal-600',
    ru: 'Отвечает за коммуникацию с каждым студентом. Первой берёт трубку, последней уходит. Потому что каждый студент важен.',
    en: 'Responsible for communication with every student. First to pick up the phone, last to leave. Because every student matters.',
    uz: 'Har bir talaba bilan muloqot uchun javobgar. Birinchi bo\'lib javob beradi, oxirgi bo\'lib ketadi. Chunki har bir talaba muhim.',
  },
]

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const [lang, setLang] = useLanguage()
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
                <div className="text-3xl font-black text-white mb-1">{s.val}</div>
                <div className="text-white/50 text-xs">{t({ ru: s.ru, en: s.en, uz: s.uz })}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ИСТОРИЯ ──────────────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...f(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-5">
                {t({ ru: 'История', en: 'Our Story', uz: 'Tarix' })}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-ink mb-5 leading-tight">
                {t({
                  ru: 'Всё началось с одного студента',
                  en: 'It all started with one student',
                  uz: 'Hammasi bir talabadan boshlandi',
                })}
              </h2>
              <div className="space-y-4 text-muted text-sm leading-relaxed">
                <p>
                  {t({
                    ru: 'Наш основатель Абдурахман прошёл через мучительный процесс поступления в Исламский университет Медины самостоятельно — бесконечные очереди, путаные требования, отклонённые документы из-за мелких ошибок.',
                    en: 'Our founder Abdurakhman went through the painful process of applying to the Islamic University of Madinah on his own — endless queues, confusing requirements, rejected documents due to minor errors.',
                    uz: "Asoschiimiz Abduraxmon Madina Islom universitetiga mustaqil ravishda qabul jarayonining og'ir yo'lini bosib o'tdi — cheksiz navbatlar, chalkash talablar, mayda xatolar tufayli rad etilgan hujjatlar.",
                  })}
                </p>
                <p>
                  {t({
                    ru: 'После зачисления он задал себе вопрос: почему нет сервиса, который берёт эту боль на себя? Так в 2022 году родилась идея Tarjuman Edu.',
                    en: 'After enrolling, he asked himself: why is there no service that takes this pain away? That\'s how the idea of Tarjuman Edu was born in 2022.',
                    uz: "Qabul bo'lgandan so'ng u o'ziga savol berdi: nega bu og'riqni o'z zimmasiga oladigan xizmat yo'q? Shunday qilib 2022 yilda Tarjuman Edu g'oyasi tug'ildi.",
                  })}
                </p>
                <p>
                  {t({
                    ru: 'Сегодня мы помогли более чем 120 студентам из стран СНГ поступить в лучшие университеты арабского мира. И это только начало.',
                    en: 'Today we have helped over 120 students from CIS countries enroll in the best universities of the Arab world. And this is just the beginning.',
                    uz: "Bugun biz MDH mamlakatlaridan 120 dan ortiq talabaga arab dunyosining eng yaxshi universitetlariga kirishga yordam berdik. Bu faqat boshlanish.",
                  })}
                </p>
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div {...f(0.1)} className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-brand-900 to-ink">
                <img
                  src="https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=800&q=80"
                  alt="Медина"
                  className="w-full h-full object-cover opacity-70 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-400/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-brand-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">
                          {t({ ru: 'Исламский университет Медины', en: 'Islamic University of Madinah', uz: 'Madina Islom universiteti' })}
                        </p>
                        <p className="text-white/60 text-xs">
                          {t({ ru: 'Где всё началось', en: 'Where it all began', uz: 'Hamma narsa shu yerdan boshlandi' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── МИССИЯ ───────────────────────────────────────────────────────── */}
      <section className="section bg-[#F7F8FA]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...f(0)}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-5">
              {t({ ru: 'Наша миссия', en: 'Our Mission', uz: 'Bizning missiyamiz' })}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-ink mb-6 leading-tight">
              {t({
                ru: <>Сделать арабское образование<br /><span className="text-brand-500">доступным для каждого</span></>,
                en: <>Make Arab-world education<br /><span className="text-brand-500">accessible to everyone</span></>,
                uz: <>Arab ta'limini<br /><span className="text-brand-500">hamma uchun ochiq qilish</span></>,
              })}
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {t({
                ru: 'Мы верим, что языковой барьер, бюрократия и незнание требований не должны мешать достойным студентам получить образование мирового уровня. Наша задача — убрать все эти препятствия.',
                en: 'We believe that language barriers, bureaucracy and unfamiliar requirements should not prevent deserving students from receiving world-class education. Our job is to remove all these obstacles.',
                uz: "Til to'siqlari, byurokratiya va talablarni bilmaslik loyiq talabalarning jahon darajasidagi ta'lim olishiga to'sqinlik qilmasligi kerak deb ishonamiz. Bizning vazifamiz — bu to'siqlarning barchasini olib tashlash.",
              })}
            </p>
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

      {/* ── ТАЙМЛАЙН ─────────────────────────────────────────────────────── */}
      <section className="section bg-ink text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 via-transparent to-violet-900/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <motion.div {...f(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">
                {t({ ru: 'История развития', en: 'Our Journey', uz: 'Rivojlanish tarixi' })}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {t({ ru: 'Как мы росли', en: 'How we grew', uz: 'Biz qanday o\'sdik' })}
              </h2>
            </motion.div>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <motion.div key={i} {...f(i * 0.1)}
                  className={`relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'} pl-16 sm:pl-0`}>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                      <span className="text-brand-400 text-xs font-bold uppercase tracking-widest">{item.year}</span>
                      <h3 className="text-white font-bold text-lg mt-1 mb-2">{t({ ru: item.ru.t, en: item.en.t, uz: item.uz.t })}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">{t({ ru: item.ru.b, en: item.en.b, uz: item.uz.b })}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-10 h-10 bg-brand-400 rounded-full flex items-center justify-center shadow-lg shadow-brand-400/30 z-10 sm:top-4">
                    <item.icon className="w-4 h-4 text-ink" />
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="flex-1 hidden sm:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── КОМАНДА ──────────────────────────────────────────────────────── */}
      <section className="section bg-[#F7F8FA]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div {...f(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-xs font-semibold uppercase tracking-widest mb-4">
                {t({ ru: 'Команда', en: 'Our Team', uz: 'Jamoa' })}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-ink mb-3">
                {t({ ru: 'Люди за сервисом', en: 'The people behind the service', uz: 'Xizmat ortidagi odamlar' })}
              </h2>
              <p className="text-muted text-sm max-w-md mx-auto">
                {t({
                  ru: 'Небольшая, но сильная команда экспертов с личным опытом поступления в арабские университеты.',
                  en: 'A small but strong team of experts with personal experience of enrolling in Arab universities.',
                  uz: 'Arab universitetlariga kirish shaxsiy tajribasiga ega kichik, lekin kuchli mutaxassislar jamoasi.',
                })}
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((m, i) => (
              <motion.div key={i} {...f(i * 0.08)}
                className="bg-white rounded-2xl border border-border p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.grad} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg`}>
                  {m.emoji}
                </div>
                <h3 className="font-bold text-ink text-base mb-0.5">{m.name}</h3>
                <p className="text-brand-600 text-xs font-semibold mb-3">
                  {t({ ru: m.role_ru, en: m.role_en, uz: m.role_uz })}
                </p>
                <p className="text-muted text-xs leading-relaxed">{t({ ru: m.ru, en: m.en, uz: m.uz })}</p>
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

      <Footer lang={lang} />
    </>
  )
}
