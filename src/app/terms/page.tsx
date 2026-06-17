'use client'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { FileText, CreditCard, RotateCcw, ShieldOff, UserX, Scale, Lock, Bell, Phone, RefreshCw } from 'lucide-react'

type Lang = 'ru' | 'uz' | 'en'

const CONTENT: Record<Lang, {
  hero: { badge: string; title: string; sub: string; updated: string }
  note: { title: string; body: string }
  sections: { title: string; icon: React.ElementType; content: string }[]
}> = {
  ru: {
    hero: {
      badge: 'Правовые документы',
      title: 'Условия использования',
      sub: 'Пожалуйста, ознакомьтесь с условиями перед использованием сервиса.',
      updated: 'Последнее обновление: 16 июня 2026 г.',
    },
    note: {
      title: 'Важно прочитать',
      body: 'Используя сервис TARJUMAN, вы соглашаетесь соблюдать изложенные ниже условия. По вопросам пишите на support@tarjumanedu.com',
    },
    sections: [
      {
        title: '1. Общие положения',
        icon: FileText,
        content: `Настоящие Условия использования регулируют отношения между сервисом TARJUMAN (bughyat alqasid Establishment, CR 7051611031, Эр-Рияд, Саудовская Аравия) и пользователями.\n\nИспользуя наш сайт, вы подтверждаете, что ознакомились с настоящими Условиями и соглашаетесь с ними в полном объёме.`,
      },
      {
        title: '2. Описание услуг',
        icon: FileText,
        content: `TARJUMAN предоставляет услуги по сопровождению студентов при поступлении в университеты Саудовской Аравии и ОАЭ:\n\n— Консультации по выбору университета и программы;\n— Перевод документов на арабский язык;\n— Помощь в заполнении заявочных форм и подача документов;\n— Отслеживание статуса заявки и уведомления;\n— Поддержка на каждом этапе поступления.\n\nОбъём услуг определяется выбранным пакетом (Базовый, Стандарт или VIP).`,
      },
      {
        title: '3. Регистрация и учётная запись',
        icon: Lock,
        content: `3.1. Пользователь обязан зарегистрироваться, указав достоверные данные.\n\n3.2. Пользователь несёт ответственность за сохранность учётных данных.\n\n3.3. При обнаружении несанкционированного доступа немедленно уведомите: support@tarjumanedu.com`,
      },
      {
        title: '4. Порядок оплаты',
        icon: CreditCard,
        content: `4.1. Стоимость услуг указана на странице «Тарифы».\n\n4.2. Оплата производится до начала оказания услуг.\n\n4.3. Мы не храним данные платёжных карт.\n\n4.4. Цены могут изменяться. Изменения не затрагивают уже оплаченные заказы.`,
      },
      {
        title: '5. Права и обязанности сторон',
        icon: Scale,
        content: `Обязанности Пользователя:\n— Предоставлять достоверные документы;\n— Своевременно отвечать на запросы менеджеров;\n— Использовать Сервис только в законных целях.\n\nОбязанности Сервиса:\n— Прилагать все усилия для качественного оказания услуг;\n— Мы не гарантируем положительное решение университета.`,
      },
      {
        title: '6. Запрещённые действия',
        icon: ShieldOff,
        content: `Пользователю запрещается:\n\n— Предоставлять заведомо ложные или поддельные документы;\n— Использовать Сервис в мошеннических или незаконных целях;\n— Создавать несколько учётных записей с целью обхода ограничений;\n— Копировать, воспроизводить или перепродавать материалы Сервиса без разрешения;\n— Осуществлять действия, нарушающие работу сайта (атаки, спам, вредоносный код);\n— Нарушать права третьих лиц, в том числе права на интеллектуальную собственность.\n\nНарушение данных запретов является основанием для немедленной блокировки аккаунта без возврата средств.`,
      },
      {
        title: '7. Правила возврата средств',
        icon: RotateCcw,
        content: `7.1. Возврат возможен, если вы отменили заказ в течение 14 дней с момента оплаты и работа ещё не начата.\n\n7.2. Возврат не осуществляется, если:\n— Университет отказал в зачислении (решение принимает университет, не мы);\n— Пользователь предоставил неполные или недостоверные документы;\n— Работа по заявке уже завершена;\n— Прошло более 14 дней без обращения с претензией.\n\n7.3. При частичном выполнении услуги возможен частичный возврат за невыполненную часть.\n\n7.4. После одобрения заявки средства возвращаются в течение 5–10 рабочих дней тем же способом, что и оплата.\n\n7.5. Для запроса возврата напишите на support@tarjumanedu.com с темой «Возврат — [номер заказа]».\n\nПолная Политика возврата: tarjumanedu.com/refund`,
      },
      {
        title: '8. Блокировка аккаунта',
        icon: UserX,
        content: `8.1. Мы вправе заблокировать или удалить аккаунт пользователя в следующих случаях:\n— Нарушение раздела «Запрещённые действия»;\n— Предоставление заведомо ложных данных при регистрации или в документах;\n— Инициирование необоснованного чарджбэка (возврата платежа через банк);\n— Попытки мошенничества или злоупотребления Сервисом.\n\n8.2. О блокировке пользователь уведомляется по email, если это технически возможно.\n\n8.3. При блокировке по причине нарушений возврат средств не производится.\n\n8.4. Пользователь вправе обжаловать блокировку, написав на support@tarjumanedu.com.`,
      },
      {
        title: '9. Ограничение ответственности',
        icon: Bell,
        content: `9.1. Мы не несём ответственности за решения университетов и визовых служб.\n\n9.2. Мы не несём ответственности за задержки из-за неполных документов.\n\n9.3. Совокупная ответственность не превышает стоимость оплаченного пакета.`,
      },
      {
        title: '10. Конфиденциальность',
        icon: Lock,
        content: `Обработка персональных данных осуществляется в соответствии с Политикой конфиденциальности (/privacy).`,
      },
      {
        title: '11. Изменение условий',
        icon: RefreshCw,
        content: `Мы вправе изменять Условия в любое время. Актуальная версия — на странице /terms. Продолжение использования Сервиса после изменений означает согласие с новыми условиями.`,
      },
      {
        title: '12. Споры и применимое право',
        icon: Scale,
        content: `12.1. Стороны стремятся урегулировать разногласия путём переговоров.\n\n12.2. При невозможности урегулирования — претензия на support@tarjumanedu.com; срок ответа 10 рабочих дней.\n\n12.3. Настоящие Условия регулируются законодательством Королевства Саудовская Аравия.\n\n12.4. Если вы инициируете чарджбэк без предварительного обращения к нам, мы вправе предоставить платёжной системе доказательства оказанной услуги.`,
      },
      {
        title: '13. Контактные данные',
        icon: Phone,
        content: `bughyat alqasid Establishment\nCR 7051611031 · Riyadh, Kingdom of Saudi Arabia\n\nEmail: support@tarjumanedu.com\nTelegram: @tarjumanedu\nСайт: tarjumanedu.com`,
      },
    ],
  },
  uz: {
    hero: {
      badge: 'Huquqiy hujjatlar',
      title: 'Foydalanish shartlari',
      sub: "Xizmatdan foydalanishdan oldin shartlarni diqqat bilan o'qing.",
      updated: 'Oxirgi yangilanish: 16 iyun 2026 y.',
    },
    note: {
      title: "Muhim ma'lumot",
      body: "TARJUMAN xizmatidan foydalanib, siz quyidagi shartlarga roziligingizni bildirasiz. Savollar uchun: support@tarjumanedu.com",
    },
    sections: [
      {
        title: '1. Umumiy qoidalar',
        icon: FileText,
        content: "Ushbu Foydalanish shartlari TARJUMAN xizmati (bughyat alqasid Establishment, CR 7051611031, Ar-Riyod, Saudiya Arabistoni) va foydalanuvchilar o'rtasidagi munosabatlarni tartibga soladi.\n\nSaytimizdan foydalanib siz ushbu Shartlar bilan to'liq tanishganingizni tasdiqlaysiz.",
      },
      {
        title: '2. Xizmatlar tavsifi',
        icon: FileText,
        content: "TARJUMAN Saudiya Arabistoni va BAA universitetlariga qabul bo'lishda talabalarni qo'llab-quvvatlash xizmatlarini ko'rsatadi:\n\n— Universitet va ta'lim dasturini tanlash bo'yicha maslahat;\n— Hujjatlarni arab tiliga tarjima qilish;\n— Ariza to'ldirish va topshirishda yordam;\n— Ariza holati monitoringi va bildirishnomalar;\n— Qabul jarayonining har bosqichida qo'llab-quvvatlash.\n\nXizmatlar hajmi tanlangan paketga (Asosiy, Standart yoki VIP) qarab belgilanadi.",
      },
      {
        title: "3. Ro'yxatdan o'tish va hisob",
        icon: Lock,
        content: "3.1. Foydalanuvchi to'g'ri ma'lumotlar ko'rsatib ro'yxatdan o'tishi shart.\n\n3.2. Foydalanuvchi o'z kirish ma'lumotlari xavfsizligi uchun javobgardir.\n\n3.3. Ruxsatsiz kirish aniqlansa, darhol xabar bering: support@tarjumanedu.com",
      },
      {
        title: "4. To'lov tartibi",
        icon: CreditCard,
        content: "4.1. Xizmatlar narxi «Narxlar» sahifasida ko'rsatilgan.\n\n4.2. To'lov xizmat ko'rsatilishidan oldin amalga oshiriladi.\n\n4.3. Biz to'lov karta ma'lumotlarini saqlamaymiz.\n\n4.4. Narxlar o'zgarishi mumkin, ammo to'langan buyurtmalarga ta'sir qilmaydi.",
      },
      {
        title: '5. Tomonlarning huquq va majburiyatlari',
        icon: Scale,
        content: "Foydalanuvchi majburiyatlari:\n— To'g'ri va to'liq hujjatlar taqdim etish;\n— Menejerlar so'rovlariga o'z vaqtida javob berish;\n— Xizmatdan faqat qonuniy maqsadlarda foydalanish.\n\nXizmat majburiyatlari:\n— Sifatli xizmat ko'rsatishga barcha choralarni ko'rish;\n— Biz universitetning qabul qarorini kafolatlay olmaymiz.",
      },
      {
        title: '6. Taqiqlangan harakatlar',
        icon: ShieldOff,
        content: "Foydalanuvchiga quyidagilar taqiqlanadi:\n\n— Ataylab noto'g'ri yoki soxta hujjatlar taqdim etish;\n— Xizmatdan firibgarlik yoki noqonuniy maqsadlarda foydalanish;\n— Cheklovlardan qochish uchun bir nechta hisob yaratish;\n— Ruxsatsiz xizmat materiallarini nusxalash yoki qayta sotish;\n— Sayt ishlashiga zarar yetkazuvchi harakatlar (hujumlar, spam, zararli kod);\n— Uchinchi shaxslar huquqlarini, shu jumladan intellektual mulk huquqlarini buzish.\n\nUshbu taqiqlarni buzish hisobni darhol bloklash uchun asos bo'ladi.",
      },
      {
        title: "7. Mablag' qaytarish qoidalari",
        icon: RotateCcw,
        content: "7.1. To'lovdan 14 kun ichida buyurtmani bekor qilsangiz va biz hali ishni boshlamagan bo'lsak, qaytarish mumkin.\n\n7.2. Quyidagi hollarda qaytarish amalga oshirilmaydi:\n— Universitet qabul qilishdan bosh tortgan bo'lsa (qarorni universitet qabul qiladi, biz emas);\n— Foydalanuvchi to'liq bo'lmagan yoki noto'g'ri hujjatlar taqdim etgan bo'lsa;\n— Ariza bo'yicha ish allaqachon tugallangan bo'lsa;\n— 14 kundan ortiq vaqt o'tgan bo'lsa.\n\n7.3. Xizmatning bir qismi bajarilgan bo'lsa, bajarilmagan qism uchun qisman qaytarish mumkin.\n\n7.4. Tasdiqlangandan so'ng 5–10 ish kuni ichida to'lov usuli orqali qaytariladi.\n\n7.5. Qaytarish uchun support@tarjumanedu.com manziliga «Qaytarish — [buyurtma raqami]» mavzusi bilan yozing.\n\nTo'liq qaytarish siyosati: tarjumanedu.com/refund",
      },
      {
        title: '8. Akkauntni bloklash',
        icon: UserX,
        content: "8.1. Biz quyidagi hollarda foydalanuvchi hisobini bloklash yoki o'chirish huquqiga egamiz:\n— «Taqiqlangan harakatlar» bo'limini buzish;\n— Ro'yxatdan o'tishda yoki hujjatlarda ataylab noto'g'ri ma'lumot berish;\n— Asossiz chargeback (bank orqali to'lovni qaytarish) boshlash;\n— Firibgarlik yoki xizmatdan suiiste'mol qilish urinishlari.\n\n8.2. Texnik jihatdan imkon bo'lsa, foydalanuvchi email orqali xabardor qilinadi.\n\n8.3. Qoidabuzarlik sababli bloklashda mablag' qaytarilmaydi.\n\n8.4. Foydalanuvchi support@tarjumanedu.com manziliga yozib bloklashga e'tiroz bildirishi mumkin.",
      },
      {
        title: '9. Javobgarlikni cheklash',
        icon: Bell,
        content: "9.1. Biz universitetlar va viza xizmatlarining qarorlari uchun javobgar emasmiz.\n\n9.2. Biz to'liq bo'lmagan hujjatlar sababli kechikishlar uchun javobgar emasmiz.\n\n9.3. Umumiy javobgarlik to'langan paket qiymatidan oshmaydi.",
      },
      {
        title: '10. Maxfiylik',
        icon: Lock,
        content: "Shaxsiy ma'lumotlarni qayta ishlash Maxfiylik siyosatiga (/privacy) muvofiq amalga oshiriladi.",
      },
      {
        title: "11. Shartlarni o'zgartirish",
        icon: RefreshCw,
        content: "Biz istalgan vaqtda Shartlarni o'zgartirish huquqiga egamiz. Joriy versiya /terms sahifasida mavjud. O'zgarishlardan keyin xizmatdan foydalanishni davom ettirish yangi shartlarga rozilikni bildiradi.",
      },
      {
        title: '12. Nizolar va qo\'llaniladigan huquq',
        icon: Scale,
        content: "12.1. Tomonlar kelishmovchiliklarni muzokaralar orqali hal etishga intiladi.\n\n12.2. Hal etib bo'lmasa — support@tarjumanedu.com manziliga da'vo; javob muddati 10 ish kuni.\n\n12.3. Ushbu Shartlar Saudiya Arabistoni Qirolligi qonunchiligiga muvofiq tartibga solinadi.",
      },
      {
        title: '13. Aloqa ma\'lumotlari',
        icon: Phone,
        content: "bughyat alqasid Establishment\nCR 7051611031 · Riyadh, Kingdom of Saudi Arabia\n\nEmail: support@tarjumanedu.com\nTelegram: @tarjumanedu\nSayt: tarjumanedu.com",
      },
    ],
  },
  en: {
    hero: {
      badge: 'Legal Documents',
      title: 'Terms of Use',
      sub: 'Please read these terms carefully before using our service.',
      updated: 'Last updated: June 16, 2026',
    },
    note: {
      title: 'Please read carefully',
      body: 'By using TARJUMAN, you agree to comply with the terms below. Questions? Contact us at support@tarjumanedu.com',
    },
    sections: [
      {
        title: '1. General Provisions',
        icon: FileText,
        content: `These Terms of Use govern the relationship between TARJUMAN (bughyat alqasid Establishment, CR 7051611031, Riyadh, Kingdom of Saudi Arabia) and its users.\n\nBy using our website, you confirm that you have read these Terms and agree to them in full.`,
      },
      {
        title: '2. Description of Services',
        icon: FileText,
        content: `TARJUMAN provides support services for students applying to universities in Saudi Arabia and the UAE:\n\n— Advice on choosing a university and program;\n— Translation of documents into Arabic;\n— Assistance with application forms and document submission;\n— Application status tracking and notifications;\n— Support at every stage of the admission process.\n\nThe scope of services depends on the selected package (Basic, Standard, or VIP).`,
      },
      {
        title: '3. Registration & Account',
        icon: Lock,
        content: `3.1. Users must register with accurate information.\n\n3.2. Users are responsible for keeping their credentials secure.\n\n3.3. If you discover unauthorized access, notify us immediately at support@tarjumanedu.com`,
      },
      {
        title: '4. Payment',
        icon: CreditCard,
        content: `4.1. Service prices are listed on the Pricing page.\n\n4.2. Payment is made before services begin.\n\n4.3. We do not store payment card data.\n\n4.4. Prices may change but do not affect already paid orders.`,
      },
      {
        title: '5. Rights and Obligations',
        icon: Scale,
        content: `User obligations:\n— Provide accurate and complete documents;\n— Respond promptly to manager requests;\n— Use the Service for lawful purposes only.\n\nService obligations:\n— Make every effort to provide quality services;\n— We do not guarantee a positive admission decision.`,
      },
      {
        title: '6. Prohibited Actions',
        icon: ShieldOff,
        content: `Users are prohibited from:\n\n— Submitting knowingly false or forged documents;\n— Using the Service for fraudulent or illegal purposes;\n— Creating multiple accounts to circumvent restrictions;\n— Copying, reproducing, or reselling Service materials without permission;\n— Taking actions that disrupt the website (attacks, spam, malicious code);\n— Violating third-party rights, including intellectual property rights.\n\nViolation of these prohibitions is grounds for immediate account suspension without a refund.`,
      },
      {
        title: '7. Refund Policy',
        icon: RotateCcw,
        content: `7.1. A refund is available if you cancel within 14 days of payment and work has not yet begun.\n\n7.2. Refunds are NOT issued if:\n— The university denied admission (the decision is made by the university, not us);\n— The user provided incomplete or inaccurate documents;\n— Work on the application has already been completed;\n— More than 14 days have passed without a complaint.\n\n7.3. If part of the service has been performed, a partial refund for the unperformed portion is possible.\n\n7.4. Once approved, funds are returned within 5–10 business days via the original payment method.\n\n7.5. To request a refund, write to support@tarjumanedu.com with subject "Refund — [order number]".\n\nFull Refund Policy: tarjumanedu.com/refund`,
      },
      {
        title: '8. Account Suspension',
        icon: UserX,
        content: `8.1. We reserve the right to suspend or delete an account in the following cases:\n— Violation of the "Prohibited Actions" section;\n— Providing knowingly false information during registration or in documents;\n— Initiating an unjustified chargeback without prior contact with us;\n— Attempts at fraud or abuse of the Service.\n\n8.2. The user will be notified by email of the suspension where technically possible.\n\n8.3. If suspended due to violations, no refund will be issued.\n\n8.4. Users may appeal a suspension by writing to support@tarjumanedu.com.`,
      },
      {
        title: '9. Limitation of Liability',
        icon: Bell,
        content: `9.1. We are not responsible for decisions made by universities or visa services.\n\n9.2. We are not responsible for delays caused by incomplete documents.\n\n9.3. Total liability shall not exceed the cost of the paid package.`,
      },
      {
        title: '10. Privacy',
        icon: Lock,
        content: `Personal data processing is carried out in accordance with our Privacy Policy (/privacy).`,
      },
      {
        title: '11. Changes to Terms',
        icon: RefreshCw,
        content: `We reserve the right to modify these Terms at any time. The current version is always available at /terms. Continued use of the Service after changes constitutes acceptance of the new terms.`,
      },
      {
        title: '12. Disputes & Governing Law',
        icon: Scale,
        content: `12.1. The parties seek to resolve disputes through negotiation.\n\n12.2. If unresolved, a claim may be submitted to support@tarjumanedu.com; response time is 10 business days.\n\n12.3. These Terms are governed by the laws of the Kingdom of Saudi Arabia.\n\n12.4. If you initiate a chargeback without prior contact, we reserve the right to provide the payment system with all documentation of services rendered.`,
      },
      {
        title: '13. Contact Information',
        icon: Phone,
        content: `bughyat alqasid Establishment\nCR 7051611031 · Riyadh, Kingdom of Saudi Arabia\n\nEmail: support@tarjumanedu.com\nTelegram: @tarjumanedu\nWebsite: tarjumanedu.com`,
      },
    ],
  },
}

export default function TermsPage() {
  const [lang, setLang] = useLanguage()
  const c = CONTENT[lang]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-[#F7F8FA]">

        {/* Hero */}
        <div className="bg-ink text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-brand-400 text-xs font-semibold uppercase tracking-widest mb-5">
              {c.hero.badge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">{c.hero.title}</h1>
            <p className="text-white/60 text-base sm:text-lg mb-4 max-w-xl mx-auto">{c.hero.sub}</p>
            <p className="text-white/40 text-xs">{c.hero.updated}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">

          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8">
            <p className="font-bold text-ink mb-1 text-sm">{c.note.title}</p>
            <p className="text-sm text-amber-800 leading-relaxed">{c.note.body}</p>
          </div>

          {/* Sections */}
          {c.sections.map(s => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="bg-white rounded-2xl border border-border p-6 sm:p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-brand-600" />
                  </div>
                  <h2 className="text-base font-bold text-ink">{s.title}</h2>
                </div>
                <div className="text-sm text-muted leading-relaxed whitespace-pre-line">{s.content}</div>
              </div>
            )
          })}

          {/* Footer links */}
          <div className="flex flex-wrap justify-center gap-4 py-4 text-xs text-muted">
            <Link href="/privacy" className="underline hover:text-ink transition-colors">
              {lang === 'ru' ? 'Политика конфиденциальности' : lang === 'uz' ? 'Maxfiylik siyosati' : 'Privacy Policy'}
            </Link>
            <Link href="/refund" className="underline hover:text-ink transition-colors">
              {lang === 'ru' ? 'Политика возврата' : lang === 'uz' ? 'Qaytarish siyosati' : 'Refund Policy'}
            </Link>
            <a href="mailto:support@tarjumanedu.com" className="underline hover:text-ink transition-colors">
              support@tarjumanedu.com
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
