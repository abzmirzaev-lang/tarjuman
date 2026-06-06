'use client'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { motion } from 'framer-motion'
import {
  MapPin, GraduationCap, Banknote, UtensilsCrossed,
  BedDouble, ShieldCheck, FileCheck, Instagram, Facebook,
  ChevronRight, BookOpen, ArrowRight
} from 'lucide-react'

type Lang = 'ru' | 'uz' | 'en'

const T = {
  ru: {
    badge: 'Университет ОАЭ · Шарджа',
    name: 'Университет аль-Касимия',
    nameAr: 'جامعة القاسمية',
    tagline: 'Исламское образование мирового уровня в сердце Шарджи',
    aboutTitle: 'Об университете',
    about: 'Университет аль-Касимия — престижный исламский университет, расположенный в Шардже (ОАЭ). Основан в 2009 году по указу шейха Султана бин Мухаммад аль-Касими. Обучение ведётся на арабском языке. Университет принимает студентов из десятков стран мира, создавая уникальную международную среду.',
    providesTitle: 'Что даёт университет',
    docsTitle: 'Необходимые документы',
    applyTitle: 'Готовы подать заявку?',
    applyDesc: 'Мы поможем вам оформить все документы и подать заявку в университет аль-Касимия.',
    applyBtn: 'Подать заявку',
    websiteBtn: 'Сайт университета',
    programs: [
      { ar: 'تفسير وعلوم القرآن',       label: 'Толкование и науки Корана' },
      { ar: 'اللغة العربية وآدابها',     label: 'Арабский язык и литература' },
      { ar: 'الإعلام',                   label: 'Медиа и журналистика' },
      { ar: 'الاقتصاد',                  label: 'Экономика' },
      { ar: 'أصول الدين',                label: 'Основы религии (Акыда)' },
      { ar: 'الفقه وأصوله',              label: 'Исламское право (Фикх)' },
      { ar: 'الحضارة والتاريخ الإسلامي', label: 'Исламская цивилизация и история' },
      { ar: 'القراءات',                  label: 'Чтение Корана (Кираат)' },
    ],
    masterPrograms: [
      { ar: 'اللغة العربية وآدابها', label: 'Арабский язык и литература' },
      { ar: 'الفقه وأصوله',         label: 'Исламское право (Фикх)' },
      { ar: 'التفسير والحديث',      label: 'Тафсир и хадисоведение' },
    ],
    bachelor: 'Бакалавриат',
    master: 'Магистратура',
    ageTitle: 'Требования к возрасту',
    ageBachelor: 'Бакалавриат: от 16 до 24 лет',
    ageMaster: 'Магистратура: до 30 лет',
    arabicTitle: 'Курсы арабского языка',
    arabicDesc: 'Не знаете арабский? Не проблема! Университет аль-Касимия предоставляет подготовительные курсы арабского языка для иностранных студентов. Вы сможете освоить язык до начала основной программы.',
    docsTitle: 'Необходимые документы',
    docsBachelor: 'Для бакалавриата',
    docsMaster: 'Дополнительно для магистратуры',
    docs: [
      'Загранпаспорт (только главная страница)',
      'Аттестат 11 класса',
      'Табель оценок за 9-й класс',
      'Табель оценок за 10-й класс',
      'Одна фотокарточка (3×4), цветной на белом фоне',
      'Медицинская справка формы 086',
      'Характеристика с места учёбы (школы, университета) или работы',
      'Свидетельство о рождении',
      'Скрин подписки на Instagram или Facebook университета',
    ],
    docsMasterExtra: [
      'Диплом бакалавра (оригинал + копия)',
      'Транскрипт оценок за весь период бакалавриата',
    ],
  },
  uz: {
    badge: 'BAA universiteti · Sharjah',
    name: 'Al-Qosimiya universiteti',
    nameAr: 'جامعة القاسمية',
    tagline: 'Sharjah markazida jahon darajasidagi islomiy ta\'lim',
    aboutTitle: 'Universitet haqida',
    about: 'Al-Qosimiya universiteti — 2009 yilda shayx Sulton bin Muhammad al-Qosimiy farmoni bilan Sharjahda (BAA) tashkil etilgan nufuzli islomiy universitet. Ta\'lim arab tilida olib boriladi. Universitet dunyo bo\'ylab o\'nlab mamlakatlardan talabalarni qabul qiladi.',
    providesTitle: 'Universitet nima beradi',
    docsTitle: 'Kerakli hujjatlar',
    applyTitle: 'Ariza berishga tayyormisiz?',
    applyDesc: 'Biz sizga barcha hujjatlarni rasmiylashtirish va Al-Qosimiya universitetiga ariza topshirishda yordam beramiz.',
    applyBtn: 'Ariza berish',
    websiteBtn: 'Universitet sayti',
    programs: [
      { ar: 'تفسير وعلوم القرآن',       label: 'Tafsir va Qur\'on fanlari' },
      { ar: 'اللغة العربية وآدابها',     label: 'Arab tili va adabiyoti' },
      { ar: 'الإعلام',                   label: 'Media va jurnalistika' },
      { ar: 'الاقتصاد',                  label: 'Iqtisodiyot' },
      { ar: 'أصول الدين',                label: 'Din asoslari (Aqida)' },
      { ar: 'الفقه وأصوله',              label: 'Islom huquqi (Fiqh)' },
      { ar: 'الحضارة والتاريخ الإسلامي', label: 'Islom sivilizatsiyasi va tarixi' },
      { ar: 'القراءات',                  label: 'Qur\'on qiroati (Qiroat)' },
    ],
    masterPrograms: [
      { ar: 'اللغة العربية وآدابها', label: 'Arab tili va adabiyoti' },
      { ar: 'الفقه وأصوله',         label: 'Islom huquqi (Fiqh)' },
      { ar: 'التفسير والحديث',      label: 'Tafsir va hadis ilmi' },
    ],
    bachelor: 'Bakalavr',
    master: 'Magistratura',
    ageTitle: 'Yosh talablari',
    ageBachelor: 'Bakalavr: 16 dan 24 yoshgacha',
    ageMaster: 'Magistratura: 30 yoshgacha',
    arabicTitle: 'Arab tili kurslari',
    arabicDesc: 'Arab tilini bilmaysizmi? Muammo emas! Universitet xorijiy talabalar uchun tayyorlov arab tili kurslarini taqdim etadi. Asosiy dastur boshlanishidan oldin tilni o\'rgana olasiz.',
    docsTitle: 'Kerakli hujjatlar',
    docsBachelor: 'Bakalavr uchun',
    docsMaster: 'Magistratura uchun qo\'shimcha',
    docs: [
      'Xorijiy pasport (faqat bosh sahifasi)',
      '11-sinf attestati',
      '9-sinf baholar jadvali',
      '10-sinf baholar jadvali',
      'Bir dona fotosurat (3×4), rangli, oq fonda',
      'Tibbiy ma\'lumotnoma (086 shakli)',
      'O\'quv yoki ish joyidan tavsifnoma',
      'Tug\'ilish guvohnomasi',
      'Universitetning Instagram yoki Facebook sahifasiga obuna bo\'lganingizni tasdiqlash skrini',
    ],
    docsMasterExtra: [
      'Bakalavr diplomi (asl nusxa + nusxa)',
      'Bakalavr davridagi baholar transkripty',
    ],
  },
  en: {
    badge: 'UAE University · Sharjah',
    name: 'Al Qasimia University',
    nameAr: 'جامعة القاسمية',
    tagline: 'World-class Islamic education in the heart of Sharjah',
    aboutTitle: 'About the University',
    about: 'Al Qasimia University is a prestigious Islamic university located in Sharjah, UAE. Founded in 2009 by Sheikh Sultan bin Muhammad Al Qasimi. Teaching is conducted in Arabic. The university welcomes students from dozens of countries, creating a unique international environment.',
    providesTitle: 'What the University Provides',
    docsTitle: 'Required Documents',
    applyTitle: 'Ready to Apply?',
    applyDesc: 'We will help you prepare all documents and submit your application to Al Qasimia University.',
    applyBtn: 'Apply Now',
    websiteBtn: 'University Website',
    programs: [
      { ar: 'تفسير وعلوم القرآن',       label: 'Quran Interpretation & Sciences' },
      { ar: 'اللغة العربية وآدابها',     label: 'Arabic Language & Literature' },
      { ar: 'الإعلام',                   label: 'Media & Journalism' },
      { ar: 'الاقتصاد',                  label: 'Economics' },
      { ar: 'أصول الدين',                label: 'Fundamentals of Religion (Aqeedah)' },
      { ar: 'الفقه وأصوله',              label: 'Islamic Law (Fiqh)' },
      { ar: 'الحضارة والتاريخ الإسلامي', label: 'Islamic Civilization & History' },
      { ar: 'القراءات',                  label: 'Quran Recitation (Qira\'at)' },
    ],
    masterPrograms: [
      { ar: 'اللغة العربية وآدابها', label: 'Arabic Language & Literature' },
      { ar: 'الفقه وأصوله',         label: 'Islamic Law (Fiqh)' },
      { ar: 'التفسير والحديث',      label: 'Tafsir & Hadith Studies' },
    ],
    bachelor: "Bachelor's",
    master: "Master's",
    ageTitle: 'Age Requirements',
    ageBachelor: "Bachelor's: 16 to 24 years old",
    ageMaster: "Master's: up to 30 years old",
    arabicTitle: 'Arabic Language Courses',
    arabicDesc: "Don't speak Arabic? No problem! The university provides preparatory Arabic language courses for international students so you can learn the language before starting your main program.",
    docsTitle: 'Required Documents',
    docsBachelor: "For Bachelor's",
    docsMaster: "Additional for Master's",
    docs: [
      'Passport (main page only)',
      '11th grade certificate',
      '9th grade transcript',
      '10th grade transcript',
      'One photo (3×4 cm), colour on white background',
      'Medical certificate (form 086)',
      'Reference letter from school, university or workplace',
      'Birth certificate',
      'Screenshot confirming subscription to university Instagram or Facebook',
    ],
    docsMasterExtra: [
      "Bachelor's degree diploma (original + copy)",
      'Full academic transcript from bachelor studies',
    ],
  },
}

const BENEFITS = [
  {
    icon: <Banknote className="w-6 h-6" />,
    color: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-100',
    value: { ru: '1 500 AED', uz: '1 500 AED', en: '1,500 AED' },
    label: { ru: 'стипендия в месяц', uz: 'oylik stipendiya', en: 'monthly stipend' },
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6" />,
    color: 'bg-amber-50 border-amber-100 text-amber-700',
    iconBg: 'bg-amber-100',
    value: { ru: '3 раза', uz: '3 marta', en: '3 times' },
    label: { ru: 'питание в день', uz: 'kunlik ovqat', en: 'meals per day' },
  },
  {
    icon: <BedDouble className="w-6 h-6" />,
    color: 'bg-blue-50 border-blue-100 text-blue-700',
    iconBg: 'bg-blue-100',
    value: { ru: 'Бесплатно', uz: 'Bepul', en: 'Free' },
    label: { ru: 'общежитие', uz: 'yotoqxona', en: 'dormitory' },
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'bg-purple-50 border-purple-100 text-purple-700',
    iconBg: 'bg-purple-100',
    value: { ru: 'Включена', uz: 'Kiritilgan', en: 'Included' },
    label: { ru: 'мед. страховка', uz: 'tibbiy sug\'urta', en: 'health insurance' },
  },
]

export default function AlQasimiaPage() {
  const [lang, setLang] = useLanguage()
  const c = T[(lang as Lang) ?? 'ru']

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src="/al-qasimia.jpg"
            alt="Al Qasimia University"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-5 rounded overflow-hidden shadow-sm inline-flex shrink-0">
                <img src="https://flagcdn.com/w40/ae.png" alt="UAE" className="w-full h-full object-cover" />
              </span>
              <span className="text-white/60 text-sm">{c.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-2">{c.name}</h1>
            <p className="text-[#C9922A] text-xl font-medium mb-3" dir="rtl">{c.nameAr}</p>
            <p className="text-white/70 text-lg max-w-xl">{c.tagline}</p>
            <div className="flex items-center gap-2 mt-4 text-white/50 text-sm">
              <MapPin className="w-4 h-4" /> Sharjah, UAE · {lang === 'ru' ? 'Основан в 2009' : lang === 'uz' ? '2009-yilda tashkil etilgan' : 'Founded 2009'}
            </div>
          </motion.div>
        </div>
      </section>

      <main className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* ── ABOUT ────────────────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-ink mb-4">{c.aboutTitle}</h2>
            <p className="text-gray-600 leading-relaxed text-base">{c.about}</p>
          </motion.section>

          {/* ── AGE REQUIREMENTS ─────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-ink mb-4">{c.ageTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">{c.bachelor}</div>
                  <div className="text-sm font-semibold text-ink">{c.ageBachelor}</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">{c.master}</div>
                  <div className="text-sm font-semibold text-ink">{c.ageMaster}</div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── ARABIC COURSES ───────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-blue-900 mb-1">{c.arabicTitle}</h2>
                <p className="text-blue-700 text-sm leading-relaxed">{c.arabicDesc}</p>
              </div>
            </div>
          </motion.section>

          {/* ── BENEFITS ─────────────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-ink mb-6">{c.providesTitle}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {BENEFITS.map((b, i) => (
                <div key={i} className={`rounded-2xl border p-5 flex flex-col items-center text-center gap-3 ${b.color}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${b.iconBg}`}>
                    {b.icon}
                  </div>
                  <div>
                    <div className="text-lg font-bold">{b.value[lang as Lang]}</div>
                    <div className="text-xs opacity-80 mt-0.5">{b.label[lang as Lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── PROGRAMS ─────────────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-ink mb-6">
              {lang === 'ru' ? 'Факультеты' : lang === 'uz' ? 'Fakultetlar' : 'Faculties'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Bachelor */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-[#1B4332]/5 border-b border-gray-100">
                  <GraduationCap className="w-4 h-4 text-[#1B4332]" />
                  <span className="font-semibold text-[#1B4332] text-sm">{c.bachelor}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {c.programs.map((p, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                      <span className="text-sm text-ink font-medium">{p.label}</span>
                      <span className="text-xs text-gray-400" dir="rtl">{p.ar}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-[#C9922A]/10 border-b border-gray-100">
                  <BookOpen className="w-4 h-4 text-[#C9922A]" />
                  <span className="font-semibold text-[#C9922A] text-sm">{c.master}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {c.masterPrograms.map((p, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                      <span className="text-sm text-ink font-medium">{p.label}</span>
                      <span className="text-xs text-gray-400" dir="rtl">{p.ar}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── DOCUMENTS ────────────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-ink mb-6">{c.docsTitle}</h2>
            <div className="space-y-4">
              {/* Bachelor docs */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-[#1B4332]/5 border-b border-gray-100">
                  <GraduationCap className="w-4 h-4 text-[#1B4332]" />
                  <span className="font-semibold text-[#1B4332] text-sm">{c.docsBachelor}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {c.docs.map((doc, i) => (
                    <div key={i} className="flex items-start gap-4 px-5 py-4">
                      <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-sm text-ink leading-relaxed">{doc}</span>
                    </div>
                  ))}
                </div>
                {/* Social subscribe */}
                <div className="px-5 pb-5 pt-2 flex gap-3">
                  <a href="https://www.instagram.com/alqasimiauni/" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-pink-200 bg-pink-50 text-pink-700 text-sm font-medium hover:bg-pink-100 transition-colors">
                    <Instagram className="w-4 h-4" /> Instagram
                  </a>
                  <a href="https://www.facebook.com/AlQasimiaUni/" target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors">
                    <Facebook className="w-4 h-4" /> Facebook
                  </a>
                </div>
              </div>

              {/* Master extra docs */}
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-amber-50 border-b border-amber-100">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span className="font-semibold text-amber-700 text-sm">{c.docsMaster}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {c.docsMasterExtra.map((doc, i) => (
                    <div key={i} className="flex items-start gap-4 px-5 py-4">
                      <div className="w-7 h-7 bg-amber-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <span className="text-sm text-ink leading-relaxed">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── APPLY CTA ────────────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-[#1B4332] to-[#0d2b1e] rounded-3xl p-8 sm:p-10 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',backgroundSize:'24px 24px'}} />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">{c.applyTitle}</h2>
                <p className="text-white/70 mb-8 max-w-lg mx-auto">{c.applyDesc}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/apply?country=AE"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9922A] hover:bg-[#b07e22] text-white font-bold rounded-2xl text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <GraduationCap className="w-5 h-5" />
                    {c.applyBtn}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://www.alqasimia.ac.ae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl text-base transition-all duration-200 border border-white/20"
                  >
                    {c.websiteBtn}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

        </div>
      </main>

    </>
  )
}
