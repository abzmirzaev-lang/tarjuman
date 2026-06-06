'use client'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

type Lang = 'ru' | 'uz' | 'en'

const CONTENT: Record<Lang, {
  hero: { badge: string; title: string; updated: string }
  stats: { val: string; label: string }[]
  sections: { title: string; content: string }[]
  cta: { title: string; sub: string; email: string; tg: string }
}> = {
  ru: {
    hero: { badge: 'Правовые документы', title: 'Политика возврата', updated: 'Последнее обновление: 1 мая 2025 г.' },
    stats: [
      { val: '24ч', label: 'Полный возврат при отмене' },
      { val: '3 дня', label: 'Ответ на заявку' },
      { val: '5–10 дней', label: 'Зачисление средств' },
    ],
    sections: [
      { title: '1. Общие положения', content: `Настоящая Политика возврата описывает условия, при которых TARJUMAN осуществляет возврат денежных средств.\n\nОформляя заказ, вы подтверждаете, что ознакомились с настоящей Политикой и принимаете её условия.\n\nКонтакт: tarjumanedu@gmail.com | @TARJUMAN_KSA` },
      { title: '2. Право на возврат', content: `Возврат возможен, если:\n— Вы отменили заказ в течение 24 часов с момента оплаты, и мы ещё не приступили к работе;\n— Мы по собственной инициативе не смогли оказать оплаченную услугу;\n— Услуга была оказана с существенными отступлениями, и мы не устранили недостатки.\n\nВозврат НЕ осуществляется, если:\n— Университет отказал в зачислении (решение принимает университет, не мы);\n— Пользователь предоставил неполные или недостоверные документы;\n— Работа по заявке уже завершена;\n— Прошло более 14 дней без обращения с претензией.` },
      { title: '3. Частичный возврат', content: `Если часть услуг уже выполнена (например, перевод документов готов, но заявка не подана), возможен частичный возврат за невыполненную часть работ.\n\nРазмер частичного возврата определяется по согласованию сторон.` },
      { title: '4. Порядок обращения', content: `Шаг 1. Напишите на tarjumanedu@gmail.com с темой «Возврат — [номер заказа]».\n\nШаг 2. Укажите:\n— Имя и email при регистрации;\n— Номер заказа или дату платежа;\n— Причину запроса на возврат.\n\nШаг 3. Мы рассмотрим обращение и ответим в течение 3 рабочих дней.` },
      { title: '5. Сроки и способ возврата', content: `5.1. После одобрения заявки возврат — в течение 5–10 рабочих дней.\n\n5.2. Средства возвращаются тем же способом, что и оплата.\n\n5.3. Комиссии платёжных систем и конвертационные потери при возврате криптовалюты вычитаются из суммы.` },
      { title: '6. Изменение политики', content: `Актуальная версия — на странице /refund. Изменения не применяются к заказам, оформленным до их вступления в силу.` },
    ],
    cta: { title: 'Нужен возврат?', sub: 'Напишите нам — разберёмся быстро и честно', email: 'tarjumanedu@gmail.com', tg: 'Telegram @TARJUMAN_KSA' },
  },
  uz: {
    hero: { badge: 'Huquqiy hujjatlar', title: 'Qaytarish siyosati', updated: 'Oxirgi yangilanish: 1 may 2025 y.' },
    stats: [
      { val: '24 soat', label: "Bekor qilish bilan to'liq qaytarish" },
      { val: '3 kun', label: 'Arizaga javob' },
      { val: '5–10 kun', label: "Mablag' o'tkazish muddati" },
    ],
    sections: [
      { title: '1. Umumiy qoidalar', content: `Ushbu Qaytarish siyosati TARJUMAN tomonidan mablag' qaytarish shartlarini tavsiflaydi.\n\nBuyurtma rasmiylashtirish orqali siz ushbu Siyosat bilan tanishganligingizni va uning shartlarini qabul qilganligingizni tasdiqlaysiz.\n\nAloqa: tarjumanedu@gmail.com | @TARJUMAN_KSA` },
      { title: '2. Qaytarish huquqi', content: `Qaytarish mumkin, agar:\n— To'lovdan 24 soat ichida buyurtmani bekor qilsangiz va biz hali ishni boshlamagan bo'lsak;\n— Biz o'z tashabbusimiz bilan to'langan xizmatni ko'rsata olmagan bo'lsak;\n— Xizmat muhim kamchiliklar bilan ko'rsatilgan bo'lsa va biz ularni bartaraf etmagan bo'lsak.\n\nQaytarish AMALGA OSHIRILMAYDI, agar:\n— Universitet qabul qilishdan bosh tortgan bo'lsa (qarorni universitet qabul qiladi, biz emas);\n— Foydalanuvchi to'liq bo'lmagan yoki noto'g'ri hujjatlar taqdim etgan bo'lsa;\n— Ariza bo'yicha ish allaqachon tugallangan bo'lsa;\n— 14 kundan ortiq vaqt o'tgan bo'lsa.` },
      { title: '3. Qisman qaytarish', content: `Agar xizmatning bir qismi bajarilgan bo'lsa (masalan, hujjatlar tarjima qilingan, lekin ariza topshirilmagan), bajarilmagan qism uchun qisman qaytarish mumkin.\n\nQisman qaytarish miqdori tomonlar o'rtasida kelishiladi.` },
      { title: '4. Murojaat tartibi', content: `1-qadam. tarjumanedu@gmail.com manziliga «Qaytarish — [buyurtma raqami]» mavzusi bilan yozing.\n\n2-qadam. Quyidagilarni ko'rsating:\n— Ro'yxatdan o'tishda ko'rsatilgan ism va email;\n— Buyurtma raqami yoki to'lov sanasi;\n— Qaytarish so'rovining sababi.\n\n3-qadam. Biz murojaatni ko'rib chiqib, 3 ish kuni ichida javob beramiz.` },
      { title: '5. Muddatlar va qaytarish usuli', content: `5.1. Ariza tasdiqlangandan so'ng 5–10 ish kuni ichida qaytariladi.\n\n5.2. Mablag' to'lov bilan bir xil usulda qaytariladi.\n\n5.3. To'lov tizimlari komissiyalari va kriptovalyuta qaytarishda konvertatsiya yo'qotishlari summadan ayiriladi.` },
      { title: "6. Siyosatga o'zgartirishlar", content: `Joriy versiya /refund sahifasida mavjud. O'zgartirishlar kuchga kirgunga qadar rasmiylashtirilgan buyurtmalarga tatbiq etilmaydi.` },
    ],
    cta: { title: 'Qaytarish kerakmi?', sub: 'Bizga yozing — tez va halol hal qilamiz', email: 'tarjumanedu@gmail.com', tg: 'Telegram @TARJUMAN_KSA' },
  },
  en: {
    hero: { badge: 'Legal Documents', title: 'Refund Policy', updated: 'Last updated: May 1, 2025' },
    stats: [
      { val: '24h', label: 'Full refund on cancellation' },
      { val: '3 days', label: 'Response to request' },
      { val: '5–10 days', label: 'Funds transfer' },
    ],
    sections: [
      { title: '1. General Provisions', content: `This Refund Policy describes the conditions under which TARJUMAN issues refunds to users.\n\nBy placing an order, you confirm that you have read this Policy and accept its terms.\n\nContact: tarjumanedu@gmail.com | @TARJUMAN_KSA` },
      { title: '2. Right to Refund', content: `A refund is available if:\n— You cancel the order within 24 hours of payment and we have not yet started work;\n— We were unable to provide the paid service due to reasons on our side;\n— The service was rendered with significant deviations and we did not correct them.\n\nRefunds are NOT issued if:\n— The university denied admission (admission decisions are made by the university, not us);\n— The user provided incomplete or inaccurate documents;\n— Work on the application has already been completed;\n— More than 14 days have passed without a complaint.` },
      { title: '3. Partial Refund', content: `If part of the service has already been performed (e.g., documents translated but application not yet submitted), a partial refund for the unperformed portion is possible.\n\nThe amount of the partial refund is determined by mutual agreement.` },
      { title: '4. How to Request a Refund', content: `Step 1. Write to tarjumanedu@gmail.com with subject "Refund — [order number]".\n\nStep 2. Include:\n— Name and email used at registration;\n— Order number or payment date;\n— Reason for the refund request.\n\nStep 3. We will review your request and respond within 3 business days.` },
      { title: '5. Timeline and Method', content: `5.1. Once approved, the refund is processed within 5–10 business days.\n\n5.2. Funds are returned via the same payment method used.\n\n5.3. Payment system fees and crypto conversion losses are deducted from the refund amount.` },
      { title: '6. Policy Changes', content: `The current version is available at /refund. Changes do not apply to orders placed before they take effect.` },
    ],
    cta: { title: 'Need a refund?', sub: "Contact us — we'll resolve it quickly and fairly", email: 'tarjumanedu@gmail.com', tg: 'Telegram @TARJUMAN_KSA' },
  },
}

export default function RefundPage() {
  const [lang, setLang] = useLanguage()
  const c = CONTENT[lang]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        <div className="bg-ink text-white py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">{c.hero.badge}</p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">{c.hero.title}</h1>
            <p className="text-white/60 text-base sm:text-lg">{c.hero.updated}</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {c.stats.map(s => (
              <div key={s.val} className="card p-4 text-center">
                <div className="text-xl font-bold text-ink mb-1">{s.val}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Sections */}
          {c.sections.map(s => (
            <div key={s.title} className="card p-6 sm:p-8">
              <h2 className="text-base font-bold text-ink mb-4">{s.title}</h2>
              <div className="text-sm text-muted leading-relaxed whitespace-pre-line">{s.content}</div>
            </div>
          ))}
          {/* CTA */}
          <div className="rounded-2xl bg-ink text-white p-8 text-center">
            <h3 className="text-xl font-bold mb-2">{c.cta.title}</h3>
            <p className="text-white/60 mb-6 text-sm">{c.cta.sub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`mailto:${c.cta.email}`} className="inline-flex items-center justify-center px-6 py-3 bg-brand-400 text-ink font-semibold rounded-xl text-sm hover:bg-brand-300 transition-colors">
                {c.cta.email}
              </a>
              <a href="https://t.me/TARJUMAN_KSA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-semibold rounded-xl text-sm hover:bg-white/20 transition-colors">
                {c.cta.tg}
              </a>
            </div>
          </div>
          <div className="text-center py-2">
            <p className="text-xs text-muted">
              <Link href="/terms" className="underline hover:text-ink transition-colors">
                {lang === 'ru' ? 'Условия использования' : lang === 'uz' ? 'Foydalanish shartlari' : 'Terms of Use'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
