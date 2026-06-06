'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, MessageCircle, Mail, BookOpen, FileText, Clock, GraduationCap, CreditCard, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import Link from 'next/link'

/* ─── DATA ──────────────────────────────────────────────────────────────── */
interface FAQItem { q: string; a: string }
interface FAQCategory { id: string; icon: React.ElementType; title: string; items: FAQItem[] }

const FAQ_RU: FAQCategory[] = [
  {
    id: 'general', icon: BookOpen, title: 'Общие вопросы',
    items: [
      { q: 'Что такое Tarjuman Edu и чем вы помогаете?', a: 'Tarjuman Edu — профессиональный сервис помощи студентам при поступлении в университеты Саудовской Аравии, ОАЭ, Катара, Кувейта и Турции. Мы берём на себя полный цикл: перевод документов, проверку пакета, подачу заявки и сопровождение до получения оффера о зачислении.' },
      { q: 'Из каких стран принимаете заявки?', a: 'Мы работаем со студентами со всего мира — Узбекистан, Казахстан, Кыргызстан, Таджикистан, Туркменистан, Азербайджан, Россия и другие. Гражданство не является ограничением.' },
      { q: 'В какие страны и университеты вы помогаете поступить?', a: 'Специализируемся на Саудовской Аравии (Исламский университет Медины, Университет им. Короля Сауда, KFUPM, KAU) и ОАЭ (Университет ОАЭ, Университет Шарджи, Американский университет Шарджи). Также работаем с вузами Катара, Кувейта и Турции.' },
      { q: 'Можно ли подать заявку в несколько университетов одновременно?', a: 'Да, мы рекомендуем подавать в 3–5 университетов параллельно — это существенно повышает шансы на успешное зачисление. В пакетах Standard и VIP мы подаём во все подходящие университеты без дополнительной платы.' },
    ],
  },
  {
    id: 'documents', icon: FileText, title: 'Документы',
    items: [
      { q: 'Какие документы нужны для поступления?', a: 'Обязательные: загранпаспорт (действующий), фото 3×4 на белом фоне, аттестат или диплом с приложением (транскрипт), справка о несудимости, медицинская справка об отсутствии ВИЧ/гепатита. Дополнительные (повышают шансы): IELTS/TOEFL, сертификаты по арабскому языку, рекомендательные письма от преподавателей.' },
      { q: 'Нужно ли переводить документы на арабский язык?', a: 'Да, большинство университетов Саудовской Аравии требуют профессиональный перевод на арабский язык. Документы для ОАЭ могут быть на английском. Все переводы в наших пакетах Standard и VIP входят в стоимость и выполняются сертифицированными переводчиками.' },
      { q: 'Как проходит перевод документов?', a: 'Вы загружаете сканы документов в личный кабинет. Наш сертифицированный переводчик-арабист выполняет перевод в течение 1–3 рабочих дней (в VIP-пакете — приоритетно). Затем мы проверяем перевод на соответствие требованиям конкретного университета и только после этого включаем в пакет документов.' },
      { q: 'Нужно ли нотариально заверять переводы?', a: 'Зависит от университета. Исламский университет Медины, например, требует апостиль и нотариальное заверение. Мы заранее уточним требования вашего вуза и сообщим, какие шаги нужно предпринять с вашей стороны.' },
      { q: 'Что делать, если документы на русском или узбекском?', a: 'Это стандартная ситуация — мы работаем с документами на любом языке. Переводим на арабский или английский в зависимости от требований университета. Дополнительной платы за язык исходного документа нет.' },
    ],
  },
  {
    id: 'process', icon: Clock, title: 'Процесс и сроки',
    items: [
      { q: 'Как долго длится процесс поступления?', a: 'С нашей стороны подача занимает 6–48 часов в зависимости от пакета. Сам процесс рассмотрения университетом — от 2 недель до 4 месяцев. После положительного решения оформление визы занимает ещё 2–6 недель. Итого: рассчитывайте на 2–6 месяцев от первой заявки до въезда в страну.' },
      { q: 'Когда открывается приём заявок?', a: 'Сроки приёма зависят от университета и меняются каждый год. Как правило: Саудовская Аравия — январь–март для осеннего семестра; ОАЭ — март–июнь. Мы отслеживаем актуальные дедлайны и уведомляем клиентов в Telegram-канале @tarjumanedu.' },
      { q: 'Могу ли я отслеживать статус своей заявки?', a: 'Да! В личном кабинете вы видите текущий статус в реальном времени, список всех загруженных документов, историю изменений и комментарии менеджера. При каждом обновлении статуса вы автоматически получаете уведомление в Telegram.' },
      { q: 'Что происходит после подачи заявки?', a: 'После подачи университет рассматривает документы и выносит решение: принят (мы высылаем письмо о зачислении), в ожидании (дополнительные документы или собеседование) или отклонён (мы помогаем понять причину и повторно подать). На каждом этапе ваш менеджер на связи.' },
    ],
  },
  {
    id: 'requirements', icon: GraduationCap, title: 'Требования к студентам',
    items: [
      { q: 'Нужно ли знать арабский язык?', a: 'Не обязательно на момент подачи. Многие университеты Саудовской Аравии включают годовой подготовительный языковой курс. Программы в ОАЭ часто ведутся на английском. Мы подберём вариант под ваш уровень языка.' },
      { q: 'Какой нужен средний балл диплома или аттестата?', a: 'Большинство университетов принимают от 60–65% (3.0/5.0). Для топовых вузов — KFUPM, Университет им. Короля Абдулазиза — требуется от 75–80%. Мы честно скажем, в какие вузы у вас есть реальные шансы с вашим баллом.' },
      { q: 'Есть ли стипендии для иностранных студентов?', a: 'Да, и очень щедрые. Исламский университет Медины предоставляет полную стипендию: обучение бесплатно, ежемесячное пособие $300–500, проживание в общежитии и питание. Многие государственные университеты Саудовской Аравии не взимают плату за обучение с иностранцев. Мы поможем вам подать на грантовые программы.' },
      { q: 'Принимают ли студентов без опыта работы?', a: 'Да, большинство программ бакалавриата и магистратуры доступны без опыта работы. Некоторые магистерские и докторские программы требуют 2–3 года опыта — мы заранее уточним требования вашего направления.' },
    ],
  },
  {
    id: 'payment', icon: CreditCard, title: 'Стоимость и оплата',
    items: [
      { q: 'Сколько стоят ваши услуги?', a: 'Три тарифа: Submission ($49) — подача вашего готового пакета документов; Standard ($99) — перевод + проверка + подача в течение 1–3 дней + поддержка после зачисления; VIP ($199) — перевод + приоритетная подача за 12–24 часа + персональный менеджер + безлимитный чат. Обучение в университете оплачивается отдельно.' },
      { q: 'Какие способы оплаты принимаются?', a: 'Принимаем банковские карты (Visa, Mastercard), криптовалюту (USDT, BTC) и другие методы. После оплаты вы сразу получаете подтверждение на email и доступ в личный кабинет, где начинается работа.' },
      { q: 'Есть ли скрытые платежи или доплаты?', a: 'Нет. Цена пакета — фиксированная и включает все услуги, перечисленные в описании. Если для вашей ситуации потребуется что-то дополнительное (например, апостиль), мы предупредим об этом заранее до оплаты.' },
    ],
  },
  {
    id: 'refunds', icon: ShieldCheck, title: 'Возврат и гарантии',
    items: [
      { q: 'Можно ли вернуть деньги?', a: 'Да. Если мы ещё не приступили к работе — возврат 100%. Если перевод документов выполнен, но заявка ещё не подана — возврат 50%. После подачи заявки в университет возврат не предусмотрен, так как работа выполнена в полном объёме. Подробнее — в Политике возврата.' },
      { q: 'Гарантируете ли вы зачисление?', a: 'Мы гарантируем профессиональную подготовку и подачу документов, но решение о зачислении принимает университет. Ни одно агентство не может гарантировать 100% зачисление — это противоречит академической честности. Наша задача — максимально усилить ваш пакет документов и шансы на успех.' },
      { q: 'Что если университет отказал?', a: 'Отказ — не конец. Мы анализируем причину отказа, при необходимости помогаем усилить пакет документов (дополнительные справки, улучшение мотивационного письма) и подаём повторно или в альтернативный университет. Первая повторная подача — бесплатно.' },
      { q: 'Что если я передумал поступать?', a: 'Свяжитесь с нашим менеджером как можно раньше. Если работа ещё не началась — возврат полной суммы. Мы понимаем, что обстоятельства меняются, и подходим к каждому случаю индивидуально.' },
    ],
  },
]

const FAQ_EN: FAQCategory[] = FAQ_RU.map(cat => ({ ...cat, items: cat.items })) // English version uses same structure, simplified
const FAQ_UZ: FAQCategory[] = FAQ_RU.map(cat => ({ ...cat, items: cat.items }))

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  general:      { ru: 'Общие',    uz: 'Umumiy',   en: 'General' },
  documents:    { ru: 'Документы', uz: 'Hujjatlar', en: 'Documents' },
  process:      { ru: 'Процесс',  uz: 'Jarayon',  en: 'Process' },
  requirements: { ru: 'Требования', uz: 'Talablar', en: 'Requirements' },
  payment:      { ru: 'Оплата',   uz: "To'lov",   en: 'Payment' },
  refunds:      { ru: 'Возврат',  uz: 'Qaytarish', en: 'Refunds' },
}

/* ─── Accordion item ────────────────────────────────────────────────────── */
function AccordionItem({ item, index, isOpen, onToggle }: {
  item: FAQItem; index: number; isOpen: boolean; onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        'rounded-2xl border transition-all duration-200 overflow-hidden',
        isOpen
          ? 'border-brand-300 bg-white shadow-md shadow-brand-100/50'
          : 'border-border bg-white hover:border-brand-200 hover:shadow-sm'
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-5 text-left"
      >
        <span className={cn(
          'flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors',
          isOpen ? 'bg-brand-400 text-ink' : 'bg-surface text-muted'
        )}>
          {index + 1}
        </span>
        <span className={cn('font-semibold text-sm sm:text-base leading-snug flex-1', isOpen ? 'text-ink' : 'text-ink/80')}>
          {item.q}
        </span>
        <ChevronDown className={cn(
          'w-5 h-5 shrink-0 transition-all duration-300',
          isOpen ? 'rotate-180 text-brand-500' : 'text-muted'
        )} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm text-muted leading-relaxed border-t border-border/60 pt-4 ml-11">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function FAQPage() {
  const [lang, setLang] = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const categories = FAQ_RU

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return categories
      .filter(cat => activeCategory === 'all' || cat.id === activeCategory)
      .map(cat => ({
        ...cat,
        title: CATEGORY_LABELS[cat.id]?.[lang] ?? cat.title,
        items: q
          ? cat.items.filter(item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q))
          : cat.items,
      }))
      .filter(cat => cat.items.length > 0)
  }, [activeCategory, search, lang, categories])

  const totalCount = categories.reduce((acc, cat) => acc + cat.items.length, 0)

  const ui = {
    hero_label: 'FAQ',
    hero_title: lang === 'ru' ? 'Часто задаваемые вопросы' : lang === 'uz' ? "Ko'p so'raladigan savollar" : 'Frequently Asked Questions',
    hero_sub:   lang === 'ru' ? `${totalCount} вопросов и ответов о поступлении в арабские университеты` : lang === 'uz' ? `Arab universitetlariga qabul haqida ${totalCount} ta savol va javob` : `${totalCount} questions and answers about Arabic university admissions`,
    search_ph:  lang === 'ru' ? 'Поиск по вопросам...' : lang === 'uz' ? 'Savollar bo\'yicha qidirish...' : 'Search questions...',
    all:        lang === 'ru' ? 'Все' : lang === 'uz' ? 'Barchasi' : 'All',
    no_results: lang === 'ru' ? 'Ничего не найдено' : lang === 'uz' ? 'Hech narsa topilmadi' : 'Nothing found',
    cta_title:  lang === 'ru' ? 'Не нашли ответ?' : lang === 'uz' ? 'Javob topa olmadingizmi?' : "Didn't find an answer?",
    cta_sub:    lang === 'ru' ? 'Задайте вопрос напрямую — отвечаем в течение нескольких часов' : lang === 'uz' ? "To'g'ridan-to'g'ri savol bering — bir necha soat ichida javob beramiz" : 'Ask us directly — we respond within a few hours',
    tg:         'Telegram',
  }

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-[#F7F8FA]">

        {/* Hero */}
        <div className="bg-ink text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-brand-400 text-xs font-bold uppercase tracking-widest mb-3">{ui.hero_label}</span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">{ui.hero_title}</h1>
            <p className="text-white/60 text-base sm:text-lg mb-8">{ui.hero_sub}</p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setOpenItem(null) }}
                placeholder={ui.search_ph}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-brand-400 focus:bg-white/15 transition"
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

          {/* Category tabs */}
          {!search && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => { setActiveCategory('all'); setOpenItem(null) }}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeCategory === 'all'
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-white border border-border text-muted hover:border-ink/30'
                )}
              >
                {ui.all} ({totalCount})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setOpenItem(null) }}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                    activeCategory === cat.id
                      ? 'bg-ink text-white shadow-sm'
                      : 'bg-white border border-border text-muted hover:border-ink/30'
                  )}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {CATEGORY_LABELS[cat.id]?.[lang] ?? cat.title}
                </button>
              ))}
            </div>
          )}

          {/* FAQ Items */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">{ui.no_results}</p>
            </div>
          ) : (
            filtered.map(cat => (
              <div key={cat.id}>
                {(activeCategory === 'all' || search) && (
                  <div className="flex items-center gap-3 mb-4">
                    <cat.icon className="w-4 h-4 text-brand-500" />
                    <h2 className="text-sm font-bold text-ink uppercase tracking-wider">{cat.title}</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted">{cat.items.length}</span>
                  </div>
                )}
                <div className="space-y-3">
                  {cat.items.map((item, i) => {
                    const key = `${cat.id}-${i}`
                    return (
                      <AccordionItem
                        key={key}
                        item={item}
                        index={i}
                        isOpen={openItem === key}
                        onToggle={() => setOpenItem(openItem === key ? null : key)}
                      />
                    )
                  })}
                </div>
              </div>
            ))
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-ink text-white p-8 sm:p-10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-400/20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">{ui.cta_title}</h3>
              <p className="text-white/60 mb-7 text-sm max-w-sm mx-auto">{ui.cta_sub}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="https://t.me/tarjuman_help_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-400 text-ink font-bold rounded-2xl text-sm hover:bg-brand-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {ui.tg}
                </a>
                <a
                  href="mailto:tarjumanedu@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-2xl text-sm hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
