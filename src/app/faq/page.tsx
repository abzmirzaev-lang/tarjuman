'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import type { AppLanguage } from '@/types'

const FAQ_RU = [
  {
    q: 'Какие документы нужны для поступления?',
    a: 'Обязательные: паспорт, фото 3×4, диплом/аттестат, транскрипт оценок. Дополнительные (повышают шансы): IELTS/TOEFL, сертификат по арабскому языку, рекомендательные письма, медицинская справка, справка о несудимости.',
  },
  {
    q: 'Как долго длится процесс поступления?',
    a: 'В среднем 2–4 недели от подачи документов до получения ответа от университета. С VIP-пакетом обработка приоритетная — 1–3 дня с нашей стороны.',
  },
  {
    q: 'Нужно ли знать арабский язык?',
    a: 'Зависит от выбранного университета и программы. Многие программы в ОАЭ ведутся на английском. В Саудовской Аравии большинство программ — на арабском. Мы поможем выбрать подходящий вариант.',
  },
  {
    q: 'Есть ли стипендии для студентов из СНГ?',
    a: 'Да! Исламский университет Мадины предоставляет полные стипендии для иностранных студентов, включая проживание и питание. Мы поможем правильно оформить документы для получения стипендии.',
  },
  {
    q: 'Какие способы оплаты принимаются?',
    a: 'Мы принимаем карты Visa/Mastercard, Apple Pay, а также UzCard и Humo через местного провайдера. Оплата безопасная через Stripe.',
  },
  {
    q: 'Что если мне откажут в поступлении?',
    a: 'Мы поможем рассмотреть альтернативные варианты. В зависимости от пакета, мы можем подать документы в другой университет без дополнительной оплаты.',
  },
  {
    q: 'Могу ли я отслеживать статус своей заявки?',
    a: 'Да! В личном кабинете вы видите текущий статус, все загруженные документы и историю изменений в реальном времени. Также мы отправляем уведомления на email и Telegram.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium text-ink text-sm leading-snug">{q}</span>
        <ChevronDown className={cn('w-4 h-4 text-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
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
  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        <div className="container-narrow py-16 max-w-3xl">
          <h1 className="page-title mb-3">FAQ</h1>
          <p className="page-subtitle mb-10">
            {lang === 'ru' ? 'Ответы на частые вопросы' : lang === 'uz' ? 'Ko\'p beriladigan savollar' : 'Frequently Asked Questions'}
          </p>
          <div className="space-y-3">
            {FAQ_RU.map((item, i) => <FAQItem key={i} {...item} />)}
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
