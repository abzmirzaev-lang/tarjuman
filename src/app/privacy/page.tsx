'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

type Lang = 'ru' | 'uz' | 'en'

const CONTENT: Record<Lang, { hero: { badge: string; title: string; updated: string }; note: { title: string; body: string }; sections: { title: string; content: string }[] }> = {
  ru: {
    hero: { badge: 'Правовые документы', title: 'Политика конфиденциальности', updated: 'Последнее обновление: 1 мая 2025 г.' },
    note: { title: 'Ваша конфиденциальность важна для нас', body: 'Мы бережно относимся к вашим данным. Вопросы — tarjuman777@gmail.com' },
    sections: [
      { title: '1. Кто мы', content: `TARJUMAN — сервис по сопровождению студентов при поступлении в университеты Саудовской Аравии и ОАЭ. Мы являемся оператором персональных данных, собираемых через сайт tarjuman.pro.\n\nКонтакт: tarjuman777@gmail.com` },
      { title: '2. Какие данные мы собираем', content: `Данные, которые вы предоставляете нам:\n— Имя и фамилия;\n— Адрес электронной почты;\n— Номер телефона / Telegram;\n— Сведения об образовании;\n— Документы для заявки (паспорт, аттестат и др.).\n\nДанные, собираемые автоматически:\n— IP-адрес и тип браузера;\n— Посещённые страницы и время визита.` },
      { title: '3. Для чего мы используем ваши данные', content: `— Обработка заявки и оказание услуг;\n— Связь с вами по вопросам заказа;\n— Уведомления об изменении статуса заявки;\n— Улучшение качества работы Сервиса;\n— Выполнение требований законодательства.\n\nМы не используем данные для рекламы и не продаём их третьим лицам.` },
      { title: '4. Передача данных третьим лицам', content: `Мы передаём данные только в следующих случаях:\n— Университетам — для подачи заявки;\n— Бюро переводов — для перевода документов;\n— Платёжным провайдерам — для обработки платежей;\n— Государственным органам — по требованию закона.\n\nВ остальных случаях передача без вашего согласия не осуществляется.` },
      { title: '5. Хранение данных', content: `5.1. Данные хранятся на защищённых серверах в течение срока, необходимого для оказания услуг.\n\n5.2. Документы хранятся не более 12 месяцев после завершения услуг — по запросу удаляем раньше.\n\n5.3. Мы применяем технические меры защиты от несанкционированного доступа.` },
      { title: '6. Ваши права', content: `Вы вправе в любой момент:\n— Получить информацию о хранимых данных;\n— Исправить неточные данные;\n— Запросить удаление данных;\n— Отозвать согласие на обработку;\n— Получить копию данных.\n\nДля реализации прав напишите: tarjuman777@gmail.com. Ответим в течение 5 рабочих дней.` },
      { title: '7. Файлы cookie', content: `Сайт использует технические cookie, необходимые для корректной работы (например, сессионные cookie для авторизации). Рекламные cookie не используются.` },
      { title: '8. Изменения политики', content: `Актуальная версия всегда доступна по адресу /privacy. При существенных изменениях мы уведомим вас по email.` },
    ],
  },
  uz: {
    hero: { badge: 'Huquqiy hujjatlar', title: 'Maxfiylik siyosati', updated: 'Oxirgi yangilanish: 1 may 2025 y.' },
    note: { title: 'Sizning maxfiyligingiz bizning uchun muhim', body: 'Biz sizning ma\'lumotlaringizni ehtiyotkorlik bilan saqlaymiz. Savollar uchun: tarjuman777@gmail.com' },
    sections: [
      { title: '1. Biz kimizmiz', content: `TARJUMAN — Saudiya Arabistoni va BAA universitetlariga qabul bo'lishda talabalarni qo'llab-quvvatlash xizmati. Biz tarjuman.pro sayti orqali yig'iladigan shaxsiy ma'lumotlarni qayta ishlovchimiz.\n\nAloqa: tarjuman777@gmail.com` },
      { title: '2. Qanday ma\'lumotlarni yig\'amiz', content: `Siz bizga taqdim etgan ma'lumotlar:\n— Ism va familiya;\n— Elektron pochta manzili;\n— Telefon raqami / Telegram;\n— Ta'lim haqidagi ma'lumotlar;\n— Ariza uchun hujjatlar (pasport, diplom va boshqalar).\n\nAvtomatik to'planadigan ma'lumotlar:\n— IP manzil va brauzer turi;\n— Tashrif buyurilgan sahifalar va vaqt.` },
      { title: '3. Ma\'lumotlaringizdan qanday foydalanamiz', content: `— Arizani ko'rib chiqish va xizmat ko'rsatish;\n— Buyurtmangiz bo'yicha siz bilan bog'lanish;\n— Ariza holati o'zgarishi haqida bildirishnomalar;\n— Xizmat sifatini yaxshilash;\n— Qonun talablarini bajarish.\n\nBiz ma'lumotlarni reklama maqsadida ishlatmaymiz va uchinchi shaxslarga sotmaymiz.` },
      { title: '4. Uchinchi shaxslarga ma\'lumot uzatish', content: `Ma'lumotlarni faqat quyidagi hollarda uzatamiz:\n— Universitetlarga — ariza topshirish uchun;\n— Tarjima byurolariga — hujjatlarni tarjima qilish uchun;\n— To'lov provayderlarga — to'lovlarni qayta ishlash uchun;\n— Davlat organlariga — qonun talabi asosida.\n\nBoshqa hollarda sizning roziligingizsiz uzatilmaydi.` },
      { title: '5. Ma\'lumotlarni saqlash', content: `5.1. Ma'lumotlar xizmatlar ko'rsatilishi uchun zarur bo'lgan muddat davomida himoyalangan serverlarda saqlanadi.\n\n5.2. Hujjatlar xizmat yakunlanganidan keyin ko'pi bilan 12 oy saqlanadi — so'rov bo'yicha ertaroq o'chiramiz.\n\n5.3. Ruxsatsiz kirishdan himoya uchun texnik chora-tadbirlar qo'llaymiz.` },
      { title: '6. Sizning huquqlaringiz', content: `Siz istalgan vaqtda quyidagi huquqlarga egasiz:\n— Saqlanayotgan ma'lumotlar haqida ma'lumot olish;\n— Noto'g'ri ma'lumotlarni tuzatish;\n— Ma'lumotlarni o'chirish;\n— Qayta ishlashga rozilikni qaytarib olish;\n— Ma'lumotlar nusxasini olish.\n\nHuquqlarni amalga oshirish uchun yozing: tarjuman777@gmail.com. 5 ish kuni ichida javob beramiz.` },
      { title: '7. Cookie fayllar', content: `Sayt to'g'ri ishlash uchun zarur texnik cookie fayllardan foydalanadi (masalan, avtorizatsiya uchun sessiya cookie). Reklama cookie ishlatilmaydi.` },
      { title: '8. Siyosatga o\'zgartirishlar', content: `Joriy versiya doimo /privacy sahifasida mavjud. Muhim o'zgartirishlar haqida email orqali xabar beramiz.` },
    ],
  },
  en: {
    hero: { badge: 'Legal Documents', title: 'Privacy Policy', updated: 'Last updated: May 1, 2025' },
    note: { title: 'Your privacy matters to us', body: 'We handle your data with care. Questions? Contact us at tarjuman777@gmail.com' },
    sections: [
      { title: '1. Who We Are', content: `TARJUMAN is a service supporting students in applying to universities in Saudi Arabia and the UAE. We are the operator of personal data collected through tarjuman.pro.\n\nContact: tarjuman777@gmail.com` },
      { title: '2. What Data We Collect', content: `Data you provide directly:\n— Full name;\n— Email address;\n— Phone number / Telegram;\n— Educational background;\n— Application documents (passport, diploma, etc.).\n\nAutomatically collected data:\n— IP address and browser type;\n— Pages visited and visit duration.` },
      { title: '3. How We Use Your Data', content: `— Processing your application and providing services;\n— Communicating with you about your order;\n— Sending application status notifications;\n— Improving our service;\n— Complying with legal requirements.\n\nWe do not use your data for advertising and do not sell it to third parties.` },
      { title: '4. Sharing with Third Parties', content: `We share data only in these cases:\n— Universities — to submit your application;\n— Translation services — to translate your documents;\n— Payment providers — to process payments;\n— Government authorities — as required by law.\n\nIn all other cases, no sharing without your consent.` },
      { title: '5. Data Storage', content: `5.1. Data is stored on secure servers for as long as needed to provide services.\n\n5.2. Documents are stored for no more than 12 months after service completion — we can delete them earlier upon request.\n\n5.3. We apply technical measures to protect against unauthorized access.` },
      { title: '6. Your Rights', content: `You have the right at any time to:\n— Obtain information about the data we store;\n— Correct inaccurate data;\n— Request data deletion;\n— Withdraw consent to processing;\n— Receive a copy of your data.\n\nTo exercise these rights, write to tarjuman777@gmail.com. We will respond within 5 business days.` },
      { title: '7. Cookies', content: `Our site uses technical cookies necessary for correct operation (e.g., session cookies for authentication). No advertising cookies are used.` },
      { title: '8. Policy Changes', content: `The current version is always available at /privacy. We will notify you by email of any significant changes.` },
    ],
  },
}

export default function PrivacyPage() {
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
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
