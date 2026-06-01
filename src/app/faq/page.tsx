'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

const CATEGORIES = {
  ru: [
    {
      title: 'Общие вопросы',
      items: [
        { q: 'Что такое TARJUMAN и чем вы помогаете?', a: 'TARJUMAN — сервис помощи студентам при поступлении в университеты Саудовской Аравии, ОАЭ, Катара, Кувейта и Турции. Мы берём на себя всю работу: переводим документы, заполняем анкеты, подаём заявки и сопровождаем на каждом этапе до получения оффера.' },
        { q: 'Из каких стран принимаете заявки?', a: 'Мы работаем со студентами со всего мира: Узбекистан, Казахстан, Кыргызстан, Таджикистан, Туркменистан, Азербайджан, Россия, Турция и другие страны.' },
        { q: 'В какие страны помогаете поступить?', a: 'Специализируемся на Саудовской Аравии, ОАЭ, Катаре, Кувейте и Турции — крупнейших образовательных центрах с университетами мирового уровня.' },
      ],
    },
    {
      title: 'Документы',
      items: [
        { q: 'Какие документы нужны для поступления?', a: 'Обязательные: паспорт, фото 3×4, аттестат или диплом, справка о несудимости, медицинская справка. Дополнительные (повышают шансы): IELTS/TOEFL, языковые дипломы, рекомендательные письма.' },
        { q: 'Нужно ли переводить документы на арабский?', a: 'Да, большинство университетов требуют профессиональный перевод на арабский язык. Мы выполняем его в срок 1–3 дня.' },
      ],
    },
    {
      title: 'Процесс и сроки',
      items: [
        { q: 'Как долго длится процесс поступления?', a: 'В среднем 2–6 месяцев — от подачи заявки до получения студенческой визы. С VIP-пакетом обработка приоритетная — 1–3 дня с нашей стороны.' },
        { q: 'Когда открывается приём заявок?', a: 'Сроки меняются каждый год и зависят от университета. Следите за актуальными датами в нашем Telegram-канале @TARJUMAN_KSA.' },
        { q: 'Могу ли я отслеживать статус своей заявки?', a: 'Да! В личном кабинете вы видите текущий статус, все документы и историю изменений. Также отправляем уведомления в Telegram при каждом обновлении.' },
      ],
    },
    {
      title: 'Требования к студентам',
      items: [
        { q: 'Нужно ли знать арабский язык?', a: 'Не обязательно. Многие университеты предлагают подготовительные языковые курсы. Программы в ОАЭ часто ведутся на английском. Мы подберём университет под ваш уровень языка.' },
        { q: 'Какой нужен средний балл?', a: 'Большинство университетов принимают от 3.0/5.0 (60%). Топовые (KFUPM, KAU) — от 4.0/5.0. Мы подберём университет под ваш балл.' },
        { q: 'Есть ли стипендии для иностранных студентов?', a: 'Да! Исламский университет Мадины предоставляет полные стипендии включая проживание и питание. Многие государственные университеты Саудовской Аравии бесплатны для иностранцев.' },
      ],
    },
    {
      title: 'Стоимость и оплата',
      items: [
        { q: 'Сколько стоят ваши услуги?', a: 'Три пакета: Базовый ($29) — подача готовых переведённых документов + поддержка после принятия; Стандарт ($69) — перевод + подача за 24ч + поддержка; VIP ($99) — перевод + подача за 6ч + поддержка + безлимитный чат.' },
        { q: 'Какие способы оплаты принимаются?', a: 'Принимаем криптовалюту и банковские карты. После оплаты сразу получаете подтверждение и доступ в личный кабинет.' },
        { q: 'Что если мне откажут в университете?', a: 'Отказ — не конец. Мы поможем определить причину, усилить пакет документов и подать повторно с максимальными шансами на успех.' },
      ],
    },
  ],
  en: [
    {
      title: 'General Questions',
      items: [
        { q: 'What is TARJUMAN and how do you help?', a: 'TARJUMAN is a student support service for applying to universities in Saudi Arabia, UAE, Qatar, Kuwait, and Turkey. We handle everything: document translation, application forms, submission, and support at every step until you receive your offer.' },
        { q: 'Which countries do you accept applications from?', a: 'We work with students worldwide: Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, Azerbaijan, Russia, Turkey, and many others.' },
        { q: 'Which countries do you help apply to?', a: 'We specialize in Saudi Arabia, UAE, Qatar, Kuwait, and Turkey — the largest educational hubs with world-class universities.' },
      ],
    },
    {
      title: 'Documents',
      items: [
        { q: 'What documents are required for admission?', a: 'Required: passport, 3×4 photo, school certificate or diploma, criminal record clearance, medical certificate. Optional (boost your chances): IELTS/TOEFL, language certificates, recommendation letters.' },
        { q: 'Do documents need to be translated into Arabic?', a: 'Yes, most universities require a professional Arabic translation. We complete this within 1–3 business days.' },
      ],
    },
    {
      title: 'Process & Timeline',
      items: [
        { q: 'How long does the admission process take?', a: 'On average 2–6 months — from application submission to receiving your student visa. With the VIP package, our processing is priority: 1–3 days on our end.' },
        { q: 'When does the application window open?', a: 'Deadlines change every year and depend on the university. Follow our Telegram channel @TARJUMAN_KSA for up-to-date information.' },
        { q: 'Can I track the status of my application?', a: 'Yes! Your personal dashboard shows the current status, all documents, and full history. We also send Telegram notifications on every update.' },
      ],
    },
    {
      title: 'Student Requirements',
      items: [
        { q: 'Do I need to know Arabic?', a: "Not necessarily. Many universities offer preparatory language courses. Programs in the UAE are often taught in English. We'll match you with a university that fits your language level." },
        { q: 'What GPA is required?', a: "Most universities accept from 3.0/5.0 (60%). Top institutions (KFUPM, KAU) require 4.0/5.0+. We'll find the right university for your grades." },
        { q: 'Are there scholarships for international students?', a: 'Yes! The Islamic University of Madinah offers full scholarships including accommodation and meals. Many Saudi government universities are free for international students.' },
      ],
    },
    {
      title: 'Pricing & Payment',
      items: [
        { q: 'How much do your services cost?', a: 'Three packages: Basic ($29) — submit your ready translated docs + post-acceptance support; Standard ($69) — translation + 24h submission + support; VIP ($99) — translation + 6h submission + support + unlimited chat.' },
        { q: 'What payment methods are accepted?', a: 'We accept cryptocurrency and bank cards. After payment you immediately receive confirmation and access to your personal dashboard.' },
        { q: 'What if I get rejected by the university?', a: "Rejection is not the end. We'll help identify the reason, strengthen your application package, and reapply with the best possible chances." },
      ],
    },
  ],
  uz: [
    {
      title: 'Umumiy savollar',
      items: [
        { q: 'TARJUMAN nima va qanday yordam berasiz?', a: "TARJUMAN — Saudiya Arabistoni, BAA, Qatar, Quvayt va Turkiya universitetlariga kirish uchun talabalar xizmati. Biz hamma narsani o'z zimmamizga olamiz: hujjatlar tarjimasi, anketalar to'ldirish, ariza topshirish va taklif olguncha har bir bosqichda yordam." },
        { q: 'Qaysi mamlakatlardan ariza qabul qilasiz?', a: "Biz dunyo bo'ylab talabalar bilan ishlaymiz: O'zbekiston, Qozog'iston, Qirg'iziston, Tojikiston, Turkmaniston, Ozarbayjon, Rossiya, Turkiya va boshqalar." },
        { q: 'Qaysi mamlakatlarga kirish uchun yordam berasiz?', a: "Biz Saudiya Arabistoni, BAA, Qatar, Quvayt va Turkiyaga ixtisoslashganmiz — jahon darajasidagi universitetlarga ega yirik ta'lim markazlari." },
      ],
    },
    {
      title: 'Hujjatlar',
      items: [
        { q: 'Qabul uchun qanday hujjatlar kerak?', a: "Majburiy: pasport, 3×4 fotosurat, attestat yoki diplom, sudlanmaganlik ma'lumotnomasi, tibbiy ma'lumotnoma. Qo'shimcha (imkoniyatlarni oshiradi): IELTS/TOEFL, til diplomlari, tavsiya xatlari." },
        { q: 'Hujjatlarni arab tiliga tarjima qilish kerakmi?', a: 'Ha, ko\'pchilik universitetlar professional arab tili tarjimasini talab qiladi. Biz buni 1-3 kun ichida bajaramiz.' },
      ],
    },
    {
      title: 'Jarayon va muddatlar',
      items: [
        { q: 'Qabul jarayoni qancha vaqt oladi?', a: "O'rtacha 2-6 oy — ariza topshirishdan talaba vizasini olishgacha. VIP paket bilan bizning tomonimizdan ustuvor qayta ishlash — 1-3 kun." },
        { q: 'Ariza qabul qilish qachon boshlanadi?', a: "Muddatlar har yili o'zgaradi va universitetga bog'liq. Dolzarb sanalar uchun @TARJUMAN_KSA Telegram kanalimizni kuzating." },
        { q: 'Ariza holatini kuzatib borishim mumkinmi?', a: "Ha! Shaxsiy kabinetingizda joriy holat, barcha hujjatlar va o'zgarishlar tarixi ko'rinadi. Har yangilanishda Telegram bildirishnomasi ham yuboramiz." },
      ],
    },
    {
      title: 'Talabalar uchun talablar',
      items: [
        { q: 'Arab tilini bilish kerakmi?', a: "Shart emas. Ko'pchilik universitetlar tayyorlov til kurslarini taklif etadi. BAA dasturlari ko'pincha ingliz tilida olib boriladi. Biz sizning til darajangizga mos universitetni tanlaymiz." },
        { q: "Qanday o'rtacha ball kerak?", a: "Ko'pchilik universitetlar 3.0/5.0 (60%) dan qabul qiladi. Top universitetlar (KFUPM, KAU) — 4.0/5.0 dan. Sizning ballingizga mos universitetni topamiz." },
        { q: 'Xorijiy talabalar uchun stipendiya bormi?', a: "Ha! Madina Islom universiteti turar joy va ovqat kirgan to'liq stipendiya beradi. Ko'plab Saudiya davlat universitetlari xorijliklar uchun bepul." },
      ],
    },
    {
      title: "Narx va to'lov",
      items: [
        { q: 'Xizmatlaringiz qancha turadi?', a: "Uch paket: Basic ($29) — tayyor tarjima qilingan hujjatlarni topshirish + qabul bo'lgandan keyin yordam; Standard ($69) — tarjima + 24 soatda topshirish + yordam; VIP ($99) — tarjima + 6 soatda topshirish + yordam + cheksiz chat." },
        { q: "Qanday to'lov usullari qabul qilinadi?", a: "Kriptovalyuta va bank kartalari qabul qilinadi. To'lovdan so'ng darhol tasdiqlash va shaxsiy kabinetga kirish imkoniyatini olasiz." },
        { q: "Universitetdan rad etilsam nima bo'ladi?", a: "Rad etish oxiri emas. Biz sababini aniqlashga, hujjatlar to'plamini mustahkamlashga va muvaffaqiyat imkoniyatini maksimal oshirib qayta topshirishga yordam beramiz." },
      ],
    },
  ],
}

const UI = {
  ru: { hero_label: 'FAQ', hero_title: 'Часто задаваемые вопросы', hero_sub: 'Всё о поступлении в университеты Саудовской Аравии, ОАЭ и других стран', cta_title: 'Не нашли ответ?', cta_sub: 'Напишите нам — ответим в течение нескольких часов' },
  en: { hero_label: 'FAQ', hero_title: 'Frequently Asked Questions', hero_sub: 'Everything about admission to universities in Saudi Arabia, UAE, and beyond', cta_title: "Didn't find an answer?", cta_sub: 'Write to us — we reply within a few hours' },
  uz: { hero_label: 'FAQ', hero_title: "Ko'p so'raladigan savollar", hero_sub: "Saudiya Arabistoni, BAA va boshqa mamlakatlardagi universitetlarga kirish haqida hamma narsa", cta_title: 'Javob topa olmadingizmi?', cta_sub: "Bizga yozing — bir necha soat ichida javob beramiz" },
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-surface transition-colors"
      >
        <span className="font-medium text-ink text-sm leading-snug">{q}</span>
        <ChevronDown className={cn('w-4 h-4 text-muted shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-border pt-4">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const [lang, setLang] = useLanguage()
  const ui = UI[lang] ?? UI.ru
  const categories = CATEGORIES[lang] ?? CATEGORIES.ru

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        <div className="bg-ink text-white py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">{ui.hero_label}</p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">{ui.hero_title}</h1>
            <p className="text-white/60 text-base sm:text-lg">{ui.hero_sub}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
          {categories.map(cat => (
            <div key={cat.title}>
              <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border">{cat.title}</h2>
              <div className="space-y-3">
                {cat.items.map((item, i) => <FAQItem key={i} {...item} />)}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-ink text-white p-8 text-center">
            <h3 className="text-xl font-bold mb-2">{ui.cta_title}</h3>
            <p className="text-white/60 mb-6 text-sm">{ui.cta_sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/tarjuman_help_bot" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-400 text-ink font-semibold rounded-xl text-sm hover:bg-brand-300 transition-colors">
                Telegram
              </a>
              <a href="mailto:tarjumanedu@gmail.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl text-sm hover:bg-white/20 transition-colors">
                tarjumanedu@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
