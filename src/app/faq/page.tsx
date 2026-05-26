'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import type { AppLanguage } from '@/types'

const CATEGORIES = [
  {
    title: 'Общие вопросы',
    items: [
      {
        q: 'Что такое TARJUMAN и чем вы помогаете?',
        a: 'TARJUMAN — сервис помощи студентам при поступлении в университеты Саудовской Аравии и ОАЭ. Мы берём на себя всю работу: переводим документы, заполняем анкеты, подаём заявки и сопровождаем на каждом этапе до получения оффера.',
      },
      {
        q: 'Из каких стран принимаете заявки?',
        a: 'Мы работаем со студентами со всего мира: Узбекистан, Казахстан, Кыргызстан, Таджикистан, Туркменистан, Азербайджан, Россия, Турция и другие страны.',
      },
      {
        q: 'В какие страны помогаете поступить?',
        a: 'На данный момент специализируемся на Саудовской Аравии и ОАЭ — двух крупнейших образовательных центрах арабского мира с университетами мирового уровня.',
      },
    ],
  },
  {
    title: 'Документы',
    items: [
      {
        q: 'Какие документы нужны для поступления?',
        a: 'Обязательные документы: 1) Паспорт, 2) Фото 3×4, 3) Аттестат или диплом, 4) Справка о несудимости, 5) Медицинская справка. Дополнительные документы (не обязательны, но значительно повышают шансы на поступление): 1) IELTS/TOEFL, 2) Языковые дипломы — арабский, английский, 3) Характеристика с места учёбы или работы, 4) Рекомендательные письма от религиозных деятелей.',
      },
      {
        q: 'Нужно ли переводить документы на арабский?',
        a: 'Да, большинство саудовских университетов требуют профессиональный перевод документов на арабский язык. Мы выполняем такой перевод в срок 1–3 дня.',
      },
    ],
  },
  {
    title: 'Процесс и сроки',
    items: [
      {
        q: 'Как долго длится процесс поступления?',
        a: 'В среднем 2–6 месяцев — от подачи заявки до получения студенческой визы. С VIP-пакетом обработка приоритетная — 1–3 дня с нашей стороны.',
      },
      {
        q: 'Когда открывается приём заявок?',
        a: 'Сроки приёма меняются каждый год и зависят от конкретного университета. Следите за актуальными датами в нашем Telegram-канале @TARJUMAN_KSA — мы публикуем все важные дедлайны заранее.',
      },
      {
        q: 'Могу ли я отслеживать статус своей заявки?',
        a: 'Да! В личном кабинете вы видите текущий статус, все документы и историю изменений. Также отправляем уведомления в Telegram при каждом обновлении.',
      },
    ],
  },
  {
    title: 'Требования к студентам',
    items: [
      {
        q: 'Нужно ли знать арабский язык?',
        a: 'Не обязательно. Многие университеты Саудовской Аравии и ОАЭ предлагают подготовительные языковые курсы для студентов, не владеющих арабским. После прохождения курса студент переводится на основную программу. Программы в ОАЭ часто ведутся на английском. Мы поможем подобрать подходящий университет под ваш уровень языка.',
      },
      {
        q: 'Какой нужен средний балл?',
        a: 'Большинство университетов принимают от 3.0/5.0 (60%). Топовые (KFUPM, KAU) — от 4.0/5.0. Мы подберём университет под ваш балл.',
      },
      {
        q: 'Есть ли стипендии для иностранных студентов?',
        a: 'Да! Исламский университет Мадины предоставляет полные стипендии включая проживание и питание. Многие государственные университеты Саудовской Аравии бесплатны для иностранцев.',
      },
    ],
  },
  {
    title: 'Стоимость и оплата',
    items: [
      {
        q: 'Сколько стоят ваши услуги?',
        a: 'Три пакета: Базовый ($29) — подача документов, Стандарт ($69) — полное сопровождение с переводом, VIP ($99) — персональный менеджер и подача в несколько университетов.',
      },
      {
        q: 'Какие способы оплаты принимаются?',
        a: 'Принимаем банковский перевод и электронные платёжные системы. После оплаты сразу получаете подтверждение и доступ в личный кабинет.',
      },
      {
        q: 'Что если мне откажут в университете?',
        a: 'Отказ — это не конец. Университеты принимают заявки каждый год, и можно подать снова в следующем году с более подготовленным досье. Мы поможем определить причину отказа, усилить пакет документов и подать повторно с максимальными шансами на успех.',
      },
    ],
  },
]

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
            <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-border pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const [lang, setLang] = useState<AppLanguage>('ru')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CATEGORIES.flatMap(cat =>
      cat.items.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }))
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        {/* Hero */}
        <div className="bg-ink text-white py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">Часто задаваемые вопросы</h1>
            <p className="text-white/60 text-base sm:text-lg">
              Всё о поступлении в университеты Саудовской Аравии и ОАЭ
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
          {CATEGORIES.map(cat => (
            <div key={cat.title}>
              <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border">
                {cat.title}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item, i) => (
                  <FAQItem key={i} {...item} />
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="rounded-2xl bg-ink text-white p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Не нашли ответ?</h3>
            <p className="text-white/60 mb-6 text-sm">Напишите нам — ответим в течение нескольких часов</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://t.me/tarjuman_help_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                Написать в Telegram
              </a>
              <Link href="/apply" className="btn btn-lg bg-white/10 border border-white/20 text-white hover:bg-white/20">
                Подать заявку
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
