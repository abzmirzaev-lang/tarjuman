'use client'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

type Lang = 'ru' | 'uz' | 'en'

const CONTENT: Record<Lang, { hero: { badge: string; title: string; updated: string }; note: { title: string; body: string }; sections: { title: string; content: string }[] }> = {
  ru: {
    hero: { badge: 'Правовые документы', title: 'Условия использования', updated: 'Последнее обновление: 1 мая 2025 г.' },
    note: { title: 'Пожалуйста, ознакомьтесь внимательно', body: 'Используя сервис TARJUMAN, вы соглашаетесь соблюдать изложенные ниже условия. Вопросы — на support@tarjumanedu.com' },
    sections: [
      { title: '1. Общие положения', content: `Настоящие Условия использования регулируют отношения между сервисом TARJUMAN и пользователями.\n\nИспользуя наш сайт, вы подтверждаете, что ознакомились с настоящими Условиями и соглашаетесь с ними в полном объёме.` },
      { title: '2. Описание услуг', content: `TARJUMAN предоставляет услуги по сопровождению студентов при поступлении в университеты Саудовской Аравии и ОАЭ:\n\n— Консультации по выбору университета и программы;\n— Перевод документов на арабский язык;\n— Помощь в заполнении заявочных форм и подача документов;\n— Отслеживание статуса заявки и уведомления;\n— Поддержка на каждом этапе поступления.\n\nОбъём услуг определяется выбранным пакетом (Базовый, Стандарт или VIP).` },
      { title: '3. Регистрация и учётная запись', content: `3.1. Пользователь обязан зарегистрироваться, указав достоверные данные.\n\n3.2. Пользователь несёт ответственность за сохранность учётных данных.\n\n3.3. При обнаружении несанкционированного доступа немедленно уведомите: support@tarjumanedu.com` },
      { title: '4. Оплата', content: `4.1. Стоимость услуг указана на странице «Тарифы».\n\n4.2. Оплата производится до начала оказания услуг.\n\n4.3. Мы не храним данные платёжных карт.\n\n4.4. Цены могут изменяться. Изменения не затрагивают уже оплаченные заказы.` },
      { title: '5. Права и обязанности сторон', content: `Обязанности Пользователя:\n— Предоставлять достоверные документы;\n— Своевременно отвечать на запросы менеджеров;\n— Использовать Сервис только в законных целях.\n\nОбязанности Сервиса:\n— Прилагать все усилия для качественного оказания услуг;\n— Мы не гарантируем положительное решение университета.` },
      { title: '6. Ограничение ответственности', content: `6.1. Мы не несём ответственности за решения университетов и визовых служб.\n\n6.2. Мы не несём ответственности за задержки из-за неполных документов.\n\n6.3. Совокупная ответственность не превышает стоимость оплаченного пакета.` },
      { title: '7. Конфиденциальность', content: `Обработка персональных данных осуществляется в соответствии с Политикой конфиденциальности (/privacy).` },
      { title: '8. Изменение условий', content: `Мы вправе изменять Условия в любое время. Актуальная версия — на странице /terms.` },
      { title: '9. Споры и применимое право', content: `9.1. Стороны стремятся урегулировать разногласия путём переговоров.\n\n9.2. При невозможности урегулирования — претензия на support@tarjumanedu.com; срок ответа 10 рабочих дней.\n\n9.3. Настоящие Условия регулируются законодательством Королевства Саудовская Аравия.\n\n9.4. Если вы инициируете чарджбэк (возврат платежа через банк) без предварительного обращения к нам, мы вправе предоставить платёжной системе доказательства оказанной услуги.` },
      { title: '10. Контакты', content: `bughyat alqasid Establishment\nCR 7051611031 · Riyadh, Kingdom of Saudi Arabia\nEmail: support@tarjumanedu.com\nTelegram: @TARJUMAN_KSA\nСайт: tarjumanedu.com` },
    ],
  },
  uz: {
    hero: { badge: 'Huquqiy hujjatlar', title: 'Foydalanish shartlari', updated: 'Oxirgi yangilanish: 1 may 2025 y.' },
    note: { title: "Iltimos, diqqat bilan o'qing", body: "TARJUMAN xizmatidan foydalanib, siz quyidagi shartlarga roziligingizni bildirасиз. Savollar uchun: support@tarjumanedu.com" },
    sections: [
      { title: '1. Umumiy qoidalar', content: "Ushbu Foydalanish shartlari TARJUMAN xizmati va foydalanuvchilar o'rtasidagi munosabatlarni tartibga soladi.\n\nSaytimizdan foydalanib siz ushbu Shartlar bilan to'liq tanishganingizni tasdiqlaysiz." },
      { title: '2. Xizmatlar tavsifi', content: "TARJUMAN Saudiya Arabistoni va BAA universitetlariga qabul bo'lishda talabalarni qo'llab-quvvatlash xizmatlarini ko'rsatadi:\n\n— Universitet va ta'lim dasturini tanlash bo'yicha maslahat;\n— Hujjatlarni arab tiliga tarjima qilish;\n— Ariza topshirishda yordam;\n— Ariza holati monitoringi va bildirishnomalar." },
      { title: "3. Ro'yxatdan o'tish", content: "3.1. Foydalanuvchi to'g'ri ma'lumotlar ko'rsatib ro'yxatdan o'tishi shart.\n\n3.2. Foydalanuvchi o'z kirish ma'lumotlari xavfsizligi uchun javobgardir." },
      { title: "4. To'lov", content: "4.1. Xizmatlar narxi «Narxlar» sahifasida ko'rsatilgan.\n\n4.2. To'lov xizmat ko'rsatilishidan oldin amalga oshiriladi.\n\n4.3. Narxlar o'zgarishi mumkin, ammo to'langan buyurtmalarga ta'sir qilmaydi." },
      { title: '5. Tomonlarning huquq va majburiyatlari', content: "Foydalanuvchi majburiyatlari:\n— To'g'ri va to'liq hujjatlar taqdim etish;\n— Menejerlar so'rovlariga javob berish.\n\nXizmat majburiyatlari:\n— Sifatli xizmat ko'rsatishga harakat qilish;\n— Biz universitetning qabul qarorini kafolatlay olmaymiz." },
      { title: '6. Javobgarlikni cheklash', content: "6.1. Biz universitetlar va viza xizmatlarining qarorlari uchun javobgar emasmiz.\n\n6.2. Umumiy javobgarlik to'langan paket qiymatidan oshmaydi." },
      { title: '7. Maxfiylik', content: "Shaxsiy ma'lumotlarni qayta ishlash Maxfiylik siyosatiga (/privacy) muvofiq amalga oshiriladi." },
      { title: "8. Shartlarni o'zgartirish", content: "Biz istalgan vaqtda Shartlarni o'zgartirish huquqiga egamiz. Joriy versiya /terms sahifasida mavjud." },
      { title: '9. Aloqa', content: "Barcha savollar uchun: support@tarjumanedu.com\nTelegram: @TARJUMAN_KSA" },
    ],
  },
  en: {
    hero: { badge: 'Legal Documents', title: 'Terms of Use', updated: 'Last updated: May 1, 2025' },
    note: { title: 'Please read carefully', body: 'By using TARJUMAN, you agree to comply with the terms below. Questions? Contact us at support@tarjumanedu.com' },
    sections: [
      { title: '1. General Provisions', content: `These Terms of Use govern the relationship between TARJUMAN and its users.\n\nBy using our website, you confirm that you have read these Terms and agree to them in full.` },
      { title: '2. Description of Services', content: `TARJUMAN provides support services for students applying to universities in Saudi Arabia and the UAE:\n\n— Advice on choosing a university and program;\n— Translation of documents into Arabic;\n— Assistance with application forms and document submission;\n— Application status tracking and notifications;\n— Support at every stage of the admission process.` },
      { title: '3. Registration', content: `3.1. Users must register with accurate information.\n\n3.2. Users are responsible for keeping their credentials secure.\n\n3.3. If you discover unauthorized access, notify us immediately at support@tarjumanedu.com` },
      { title: '4. Payment', content: `4.1. Service prices are listed on the Pricing page.\n\n4.2. Payment is made before services begin.\n\n4.3. We do not store payment card data.\n\n4.4. Prices may change but do not affect already paid orders.` },
      { title: '5. Rights and Obligations', content: `User obligations:\n— Provide accurate and complete documents;\n— Respond promptly to manager requests;\n— Use the Service for lawful purposes only.\n\nService obligations:\n— Make every effort to provide quality services;\n— We do not guarantee a positive admission decision.` },
      { title: '6. Limitation of Liability', content: `6.1. We are not responsible for decisions made by universities or visa services.\n\n6.2. We are not responsible for delays caused by incomplete documents.\n\n6.3. Total liability shall not exceed the cost of the paid package.` },
      { title: '7. Privacy', content: `Personal data processing is carried out in accordance with our Privacy Policy (/privacy).` },
      { title: '8. Changes to Terms', content: `We reserve the right to modify these Terms at any time. The current version is always available at /terms.` },
      { title: '9. Contact', content: `For all inquiries: support@tarjumanedu.com\nTelegram: @TARJUMAN_KSA` },
    ],
  },
}

export default function TermsPage() {
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
          <div className="card p-6 sm:p-8 text-sm text-muted leading-relaxed bg-amber-50 border border-amber-200 rounded-2xl">
            <p className="font-semibold text-ink mb-1">{c.note.title}</p>
            <p>{c.note.body}</p>
          </div>
          {c.sections.map(s => (
            <div key={s.title} className="card p-6 sm:p-8">
              <h2 className="text-base font-bold text-ink mb-4">{s.title}</h2>
              <div className="text-sm text-muted leading-relaxed whitespace-pre-line">{s.content}</div>
            </div>
          ))}
          <div className="text-center py-4">
            <p className="text-xs text-muted">
              <a href="mailto:support@tarjumanedu.com" className="text-ink underline hover:opacity-70">support@tarjumanedu.com</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
