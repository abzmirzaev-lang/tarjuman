'use client'

import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { Navbar } from '@/components/layout/Navbar'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, GraduationCap, Banknote, BedDouble, ChevronDown,
  FileCheck, Instagram, Facebook, ArrowRight, BookOpen,
  ShieldCheck, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

type Lang = 'ru' | 'uz' | 'en'

const T = {
  uz: {
    badge: 'BAA universiteti · Sharjah',
    name: 'Al Qasimia University',
    nameAr: 'جامعة القاسمية',
    tagline: 'Ko\'p so\'raladigan savollar',
    faqTitle: 'Barcha savollar va javoblar',
    ctaTitle: 'Hujjat topshirishga tayyormisiz?',
    ctaDesc: 'Biz hujjatlaringizni tarjima qilib, universitetga topshiramiz.',
    ctaBtn: 'Hoziroq murojaat qiling',
    faq: [
      {
        q: 'Al Qasimia University qayerda joylashgan?',
        a: 'Al Qasimia University BAA ning Sharjah shahrida joylashgan.',
      },
      {
        q: 'O\'qish bepulmi?',
        a: 'Ha. Universitetda o\'qish to\'liq bepul.\n\nTalabalarga qo\'shimcha ravishda bepul yotoqxona va oylik stipendiya ham taqdim etiladi.',
      },
      {
        q: 'Imtihondan o\'tish kerakmi?',
        a: 'Yo\'q. Hozirda kirish imtihoni talab qilinmaydi.\n\nUniversitet hujjatlar asosida nomzodlarni saralab oladi.',
      },
      {
        q: 'Arab tilini bilish kerakmi?',
        a: 'Yo\'q. Arab tilini bilmagan talabalar uchun maxsus tayyorlov dasturi mavjud. Siz asosiy dasturni boshlashdan oldin arab tilini o\'rganishingiz mumkin.',
      },
      {
        q: 'Ingliz tilini bilish kerakmi?',
        a: 'Attestatda ingliz tili fanidan baho kamida 4 bo\'lishi kerak.\n\nYoki IELTS sertifikati bilan kamida 5.5 ball taqdim etilishi kerak.',
      },
      {
        q: 'Qanday hujjatlar kerak?',
        a: 'Xorijga chiqish pasporti (faqat asosiy sahifa), 11-sinf attestati, 9-sinf baholar tabeli, 10-sinf baholar tabeli, oq fonda tushirilgan 3×4 rangli foto, 086-shakldagi tibbiy ma\'lumotnoma, o\'qish yoki ish joyidan tavsifnoma, tug\'ilganlik haqida guvohnoma, universitetning Instagram yoki Facebook sahifasiga obuna bo\'lganingizning skrinshoti.\n\nBarcha hujjatlar printer-skaner orqali PDF shaklida, yuqori sifatda va o\'qishga qulay holatda yuborilishi kerak.',
        hasDocs: true,
      },
      {
        q: 'Sizlar nima qilib berasizlar?',
        a: 'Hujjatlaringizni arab tiliga tarjima qilamiz, universitet talablariga mos tayyorlaymiz, ariza topshirish jarayonini amalga oshiramiz va qabul natijalarini kuzatishda yordam beramiz.',
        hasList: ['Hujjatlarni tarjima qilish', 'Universitet talablariga tayyorlash', 'Ariza topshirish', 'Qabul natijalarini kuzatish'],
      },
      {
        q: 'Qabul bo\'lishga garantiya berasizlarmi?',
        a: 'Yo\'q. Universitet grant asosida talaba qabul qiladi va nomzodlarni mustaqil ravishda tanlaydi.\n\nBiz faqat hujjatlarni tarjima qilib, universitetga topshirib beramiz.',
      },
      {
        q: '9-sinf bitirib topshirsa bo\'ladimi?',
        a: 'Yo\'q. Nomzod 11-sinfni to\'liq tamomlagan bo\'lishi shart.',
      },
      {
        q: 'Qanday fakultetlar mavjud?',
        a: 'Bakalavr darajasi uchun: Tafsir va Qur\'on ilmlari, Arab tili va adabiyoti, Media va jurnalistika, Iqtisodiyot, Aqida va din asoslari, Fiqh va uning asoslari, Islom sivilizatsiyasi va tarixi, Qiroat ilmi.\n\nMagistratura uchun: Arab tili va adabiyoti, Fiqh va uning asoslari, Tafsir va hadis ilmi.',
      },
      {
        q: 'Hujjat topshirish pullikmi?',
        a: 'Universitetga hujjat topshirish bepul.\n\nTARJUMAN EDU xizmatlari uchun alohida xizmat haqi olinadi.',
      },
      {
        q: 'O\'qish davomida stipendiya beriladimi?',
        a: 'Ha. Universitet talabalariga oylik stipendiya (1 500 AED) taqdim etadi.',
      },
      {
        q: 'O\'qish muddati qancha?',
        a: 'Fakultetga qarab o\'rtacha 4 yil (bakalavr). Magistratura uchun 2 yil.',
      },
      {
        q: 'Qizlar uchun alohida joy bormi?',
        a: 'Ha, albatta. Qizlarning o\'qish va yotoq joyi alohida kampusda joylashgan va to\'liq ajratilgan.',
      },
    ],
  },
  ru: {
    badge: 'Университет ОАЭ · Шарджа',
    name: 'Al Qasimia University',
    nameAr: 'جامعة القاسمية',
    tagline: 'Часто задаваемые вопросы',
    faqTitle: 'Все вопросы и ответы',
    ctaTitle: 'Готовы подать документы?',
    ctaDesc: 'Мы переведём ваши документы и передадим их в университет.',
    ctaBtn: 'Связаться с нами',
    faq: [
      {
        q: 'Где находится Al Qasimia University?',
        a: 'Al Qasimia University расположен в городе Шарджа, ОАЭ.',
      },
      {
        q: 'Обучение платное?',
        a: 'Нет. Обучение в университете полностью бесплатное.\n\nСтудентам также предоставляется бесплатное общежитие и ежемесячная стипендия.',
      },
      {
        q: 'Нужно ли сдавать вступительный экзамен?',
        a: 'Нет. На данный момент вступительный экзамен не требуется.\n\nУниверситет отбирает кандидатов на основе документов.',
      },
      {
        q: 'Обязательно ли знать арабский язык?',
        a: 'Нет. Для студентов, не знающих арабского языка, предусмотрена специальная подготовительная программа. Вы сможете освоить язык до начала основной учёбы.',
      },
      {
        q: 'Нужно ли знать английский язык?',
        a: 'Оценка по английскому языку в аттестате должна быть не ниже 4.\n\nИли необходимо предоставить сертификат IELTS с баллом не менее 5.5.',
      },
      {
        q: 'Какие документы нужны?',
        a: 'Загранпаспорт (только главная страница), аттестат за 11 класс, табель оценок за 9-й класс, табель оценок за 10-й класс, фотография 3×4 на белом фоне, медицинская справка формы 086, характеристика с места учёбы или работы, свидетельство о рождении, скриншот подписки на Instagram или Facebook университета.\n\nВсе документы должны быть в формате PDF, высокого качества и удобочитаемом виде.',
        hasDocs: true,
      },
      {
        q: 'Что вы делаете для нас?',
        a: 'Переводим документы на арабский язык, подготавливаем их в соответствии с требованиями университета, подаём заявку и помогаем отслеживать результаты зачисления.',
        hasList: ['Перевод документов на арабский', 'Подготовка под требования университета', 'Подача заявки', 'Отслеживание результатов'],
      },
      {
        q: 'Даёте ли вы гарантию зачисления?',
        a: 'Нет. Университет принимает студентов на грантовой основе и самостоятельно отбирает кандидатов.\n\nМы лишь переводим документы и передаём их в университет.',
      },
      {
        q: 'Можно ли подать документы после 9 класса?',
        a: 'Нет. Кандидат обязательно должен окончить 11 классов.',
      },
      {
        q: 'Какие есть факультеты?',
        a: 'Бакалавриат: Толкование и науки Корана, Арабский язык и литература, Медиа и журналистика, Экономика, Основы религии, Исламское право, Исламская цивилизация и история, Чтение Корана.\n\nМагистратура: Арабский язык и литература, Исламское право, Тафсир и хадисоведение.',
      },
      {
        q: 'Подача документов платная?',
        a: 'Подача документов в университет бесплатная.\n\nЗа услуги TARJUMAN EDU взимается отдельная плата.',
      },
      {
        q: 'Выплачивается ли стипендия во время обучения?',
        a: 'Да. Университет предоставляет студентам ежемесячную стипендию в размере 1 500 AED.',
      },
      {
        q: 'Сколько длится обучение?',
        a: 'В зависимости от факультета, бакалавриат — в среднем 4 года. Магистратура — 2 года.',
      },
      {
        q: 'Есть ли отдельное место для девушек?',
        a: 'Да, конечно. Учебный корпус и общежитие для девушек расположены на отдельном кампусе и полностью разделены.',
      },
    ],
  },
  en: {
    badge: 'UAE University · Sharjah',
    name: 'Al Qasimia University',
    nameAr: 'جامعة القاسمية',
    tagline: 'Frequently Asked Questions',
    faqTitle: 'All Questions & Answers',
    ctaTitle: 'Ready to Apply?',
    ctaDesc: 'We will translate your documents and submit them to the university.',
    ctaBtn: 'Contact Us',
    faq: [],
  },
}

const STATS = [
  { icon: <Banknote className="w-5 h-5" />, bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', color: 'text-emerald-700', value: { uz: 'Bepul', ru: 'Бесплатно' }, label: { uz: 'ta\'lim', ru: 'обучение' } },
  { icon: <BedDouble className="w-5 h-5" />, bg: 'bg-blue-50', iconBg: 'bg-blue-100', color: 'text-blue-700', value: { uz: 'Bepul', ru: 'Бесплатно' }, label: { uz: 'yotoqxona', ru: 'общежитие' } },
  { icon: <ShieldCheck className="w-5 h-5" />, bg: 'bg-purple-50', iconBg: 'bg-purple-100', color: 'text-purple-700', value: { uz: '1 500 AED', ru: '1 500 AED' }, label: { uz: 'oylik stipendiya', ru: 'стипендия/мес' } },
  { icon: <GraduationCap className="w-5 h-5" />, bg: 'bg-amber-50', iconBg: 'bg-amber-100', color: 'text-amber-700', value: { uz: '4 yil', ru: '4 года' }, label: { uz: 'o\'qish muddati', ru: 'срок обучения' } },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${
        open ? 'border-[#1B4332]/20 shadow-md' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm font-semibold leading-relaxed transition-colors ${open ? 'text-[#1B4332]' : 'text-gray-900'}`}>
          {q}
        </span>
        <span className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-[#1B4332] text-white rotate-180' : 'bg-gray-100 text-gray-500'
        }`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 border-t border-gray-50">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line pt-4">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AlQasimiaFAQPage() {
  const [lang, setLang] = useLanguage()
  const c = T[(lang as Lang) in T ? (lang as Lang) : 'ru']

  const faqItems = lang === 'uz' ? T.uz.faq : T.ru.faq

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#14532d] to-[#0d2b1e] py-20 sm:py-28">
        {/* subtle pattern */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }} />
        {/* gold glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9922A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-5 rounded overflow-hidden shadow-sm inline-flex shrink-0">
                <img src="https://flagcdn.com/w40/ae.png" alt="UAE" className="w-full h-full object-cover" />
              </span>
              <span className="text-white/60 text-sm">{c.badge}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-2 leading-tight">{c.name}</h1>
            <p className="text-[#C9922A] text-xl font-medium mb-4" dir="rtl">{c.nameAr}</p>
            <p className="text-white/70 text-lg">{c.tagline}</p>
            <div className="flex items-center gap-2 mt-4 text-white/40 text-sm">
              <MapPin className="w-4 h-4" />
              Sharjah, UAE · Founded 2009
            </div>
          </motion.div>
        </div>
      </section>

      <main className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* ── STATS ─────────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className={`${s.bg} rounded-2xl border border-transparent p-5 flex flex-col items-center text-center gap-3`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.iconBg} ${s.color}`}>
                    {s.icon}
                  </div>
                  <div>
                    <div className={`text-base font-bold ${s.color}`}>{s.value[lang === 'uz' ? 'uz' : 'ru']}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label[lang === 'uz' ? 'uz' : 'ru']}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── FAQ ───────────────────────────────────────────────── */}
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-900 mb-6"
            >
              {c.faqTitle}
            </motion.h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <FAQItem key={`${lang}-${i}`} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </section>

          {/* ── SOCIAL NOTE ───────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  {lang === 'uz' ? 'Ijtimoiy tarmoqlarga obuna' : 'Подписка на соцсети'}
                </h3>
              </div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {lang === 'uz'
                  ? 'Hujjatlar paketiga universitetning rasmiy sahifalariga obuna bo\'lganingizni tasdiqlovchi skrinshot ham kiritilishi kerak.'
                  : 'В пакет документов необходимо включить скриншот, подтверждающий подписку на официальные страницы университета.'}
              </p>
              <div className="flex gap-3">
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
          </motion.section>

          {/* ── WHAT WE DO ────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 bg-[#1B4332]/5 border-b border-gray-100">
                <BookOpen className="w-4 h-4 text-[#1B4332]" />
                <span className="font-semibold text-[#1B4332] text-sm">
                  {lang === 'uz' ? 'TARJUMAN EDU nima qiladi?' : 'Что делает TARJUMAN EDU?'}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {(lang === 'uz'
                  ? ['Hujjatlarni arab tiliga tarjima qilish', 'Universitet talablariga mos tayyorlash', 'Ariza topshirish jarayonini amalga oshirish', 'Qabul natijalarini kuzatishda yordam berish']
                  : ['Перевод документов на арабский язык', 'Подготовка документов по требованиям университета', 'Подача заявки в университет', 'Помощь с отслеживанием результатов зачисления']
                ).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── CTA ───────────────────────────────────────────────── */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-[#1B4332] to-[#0d2b1e] rounded-3xl p-8 sm:p-10 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">{c.ctaTitle}</h2>
                <p className="text-white/70 mb-8 max-w-lg mx-auto">{c.ctaDesc}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://t.me/tarjumanedu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9922A] hover:bg-[#b07e22] text-white font-bold rounded-2xl text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <GraduationCap className="w-5 h-5" />
                    {c.ctaBtn}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/al-qasimia"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl text-base transition-all duration-200 border border-white/20"
                  >
                    {lang === 'uz' ? 'Universitet haqida' : 'Об университете'}
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

        </div>
      </main>
    </>
  )
}
