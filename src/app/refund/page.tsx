'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import type { AppLanguage } from '@/types'

const SECTIONS = [
  {
    title: '1. Общие положения',
    content: `Настоящая Политика возврата (далее — «Политика») описывает условия, при которых TARJUMAN осуществляет возврат денежных средств Пользователям.

Оформляя заказ и производя оплату, вы подтверждаете, что ознакомились с настоящей Политикой и принимаете её условия.

По всем вопросам, связанным с возвратом средств, обращайтесь на почту tarjuman777@gmail.com или в Telegram @TARJUMAN_KSA.`,
  },
  {
    title: '2. Право на возврат',
    content: `2.1. Возврат возможен в следующих случаях:

— Вы отменили заказ в течение 24 часов с момента оплаты, и мы ещё не приступили к оказанию услуги;
— Мы по собственной инициативе не смогли оказать оплаченную услугу (например, технические или операционные причины на нашей стороне);
— Услуга была оказана с существенными отступлениями от согласованного объёма, и мы не устранили недостатки в разумный срок.

2.2. Возврат НЕ осуществляется в следующих случаях:

— Университет отказал в зачислении — решение о приёме принимается исключительно учебным заведением и не зависит от качества наших услуг;
— Пользователь предоставил неполные, недостоверные или неверно оформленные документы, что повлекло отказ;
— Работа по заявке уже завершена (документы переведены и поданы в университет);
— Прошло более 14 календарных дней с даты оплаты без обращения с претензией.`,
  },
  {
    title: '3. Частичный возврат',
    content: `В случаях, когда часть услуг уже была оказана (например, выполнен перевод документов, но заявка ещё не подана), возможен частичный возврат средств за ту часть работ, которая фактически не была выполнена.

Размер частичного возврата определяется индивидуально по согласованию сторон.`,
  },
  {
    title: '4. Порядок обращения за возвратом',
    content: `4.1. Для подачи заявки на возврат средств необходимо:

Шаг 1. Написать на почту tarjuman777@gmail.com с темой письма «Возврат средств — [ваш ID заказа]».

Шаг 2. Указать в письме:
— Имя и адрес электронной почты, указанные при регистрации;
— Номер заказа или дату платежа;
— Причину запроса на возврат.

Шаг 3. Мы рассмотрим ваше обращение и ответим в течение 3 рабочих дней.

4.2. При необходимости мы можем запросить дополнительные сведения для проверки.`,
  },
  {
    title: '5. Сроки и способ возврата',
    content: `5.1. После одобрения заявки возврат осуществляется в течение 5–10 рабочих дней.

5.2. Средства возвращаются тем же способом, которым была произведена оплата (криптовалюта, банковский перевод или иной используемый метод).

5.3. Комиссии платёжных систем или конвертационные потери при возврате криптовалюты вычитаются из суммы возврата — они не входят в нашу ответственность.`,
  },
  {
    title: '6. Изменение политики',
    content: `Мы оставляем за собой право изменять настоящую Политику в любое время. Актуальная версия всегда доступна по адресу /refund. Изменения не применяются к заказам, оформленным до даты их вступления в силу.`,
  },
]

export default function RefundPage() {
  const [lang, setLang] = useState<AppLanguage>('ru')

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        {/* Hero */}
        <div className="bg-ink text-white py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">Правовые документы</p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">Политика возврата</h1>
            <p className="text-white/60 text-base sm:text-lg">
              Последнее обновление: 1 мая 2025 г.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          {/* Quick summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5 text-center">
              <div className="text-2xl font-bold text-ink mb-1">24ч</div>
              <div className="text-xs text-muted">Полный возврат при отмене</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-2xl font-bold text-ink mb-1">3 дня</div>
              <div className="text-xs text-muted">Ответ на заявку</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-2xl font-bold text-ink mb-1">5–10 дней</div>
              <div className="text-xs text-muted">Срок зачисления средств</div>
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title} className="card p-6 sm:p-8">
              <h2 className="text-base font-bold text-ink mb-4">{section.title}</h2>
              <div className="text-sm text-muted leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="rounded-2xl bg-ink text-white p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Нужен возврат?</h3>
            <p className="text-white/60 mb-6 text-sm">Напишите нам — разберёмся быстро и честно</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:tarjuman777@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-400 text-ink font-semibold rounded-xl text-sm hover:bg-brand-300 transition-colors"
              >
                tarjuman777@gmail.com
              </a>
              <a
                href="https://t.me/TARJUMAN_KSA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl text-sm hover:bg-white/20 transition-colors"
              >
                Telegram @TARJUMAN_KSA
              </a>
            </div>
          </div>

          <div className="text-center py-2">
            <p className="text-xs text-muted">
              Также ознакомьтесь с{' '}
              <Link href="/terms" className="underline hover:text-ink transition-colors">
                Условиями использования
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
