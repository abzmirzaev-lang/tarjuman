'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { Navbar } from '@/components/layout/Navbar'

type Lang = 'ru' | 'uz' | 'en'

const CONTENT: Record<Lang, {
  hero: { badge: string; title: string; updated: string }
  note: { title: string; body: string }
  sections: { title: string; content: string }[]
}> = {
  ru: {
    hero: { badge: 'Правовые документы', title: 'Политика конфиденциальности', updated: 'Последнее обновление: 1 мая 2025 г.' },
    note: { title: 'Ваши данные под защитой', body: 'TARJUMAN бережно относится к вашей конфиденциальности. Вопросы: tarjumanedu@gmail.com' },
    sections: [
      { title: '1. Кто мы', content: 'TARJUMAN — сервис сопровождения студентов при поступлении в университеты Саудовской Аравии и ОАЭ. Мы являемся оператором персональных данных, собираемых через сайт tarjuman.pro.\n\nКонтакт: tarjumanedu@gmail.com' },
      { title: '2. Какие данные мы собираем', content: 'Данные, которые вы предоставляете:\n— Полное имя;\n— Адрес электронной почты;\n— Телефон / Telegram;\n— Сведения об образовании;\n— Документы (паспорт, диплом и т.д.).\n\nАвтоматически собираемые данные:\n— IP-адрес и тип браузера;\n— Страницы посещений и продолжительность.' },
      { title: '3. Как мы используем данные', content: '— Обработка вашей заявки и оказание услуг;\n— Коммуникация по вашему заказу;\n— Отправка уведомлений о статусе заявки;\n— Улучшение нашего сервиса;\n— Соблюдение требований законодательства.\n\nМы не используем ваши данные для рекламы и не продаём их третьим лицам.' },
      { title: '4. Передача третьим лицам', content: 'Мы передаём данные только в следующих случаях:\n— Университетам — для подачи вашей заявки;\n— Переводчикам — для перевода ваших документов;\n— Платёжным провайдерам — для обработки платежей;\n— Государственным органам — по требованию закона.\n\nВо всех остальных случаях — только с вашего согласия.' },
      { title: '5. Хранение данных', content: '5.1. Данные хранятся на защищённых серверах столько, сколько необходимо для оказания услуг.\n\n5.2. Документы хранятся не более 12 месяцев после завершения услуги — можем удалить раньше по запросу.\n\n5.3. Мы применяем технические меры защиты от несанкционированного доступа.' },
      { title: '6. Ваши права', content: 'Вы вправе в любое время:\n— Получить информацию о хранимых данных;\n— Исправить неточные данные;\n— Запросить удаление данных;\n— Отозвать согласие на обработку;\n— Получить копию ваших данных.\n\nДля реализации прав — напишите на tarjumanedu@gmail.com. Ответим в течение 5 рабочих дней.' },
      { title: '7. Cookie', content: 'Сайт использует технические cookie, необходимые для корректной работы (например, cookie сессии для аутентификации). Рекламные cookie не используются.' },
      { title: '8. Изменения политики', content: 'Актуальная версия всегда доступна по адресу /privacy. О существенных изменениях уведомим по электронной почте.' },
    ],
  },
  uz: {
    hero: { badge: 'Huquqiy hujjatlar', title: 'Maxfiylik siyosati', updated: 'Oxirgi yangilanish: 1 may 2025 y.' },
    note: { title: "Ma'lumotlaringiz himoyalangan", body: "TARJUMAN sizning maxfiyligingizni qadrlaydi. Savollar: tarjumanedu@gmail.com" },
    sections: [
      { title: '1. Biz haqimizda', content: "TARJUMAN — talabalarni Saudiya Arabistoni va BAA universitetlariga qabul bo'lishda qo'llab-quvvatlash xizmati. Biz tarjuman.pro orqali to'plangan shaxsiy ma'lumotlar operatorimiz.\n\nAloqa: tarjumanedu@gmail.com" },
      { title: "2. Qanday ma'lumotlar to'playmiz", content: "Siz taqdim etgan ma'lumotlar:\n— To'liq ism;\n— Elektron pochta;\n— Telefon / Telegram;\n— Ta'lim haqida ma'lumotlar;\n— Hujjatlar (pasport, diplom va h.k.).\n\nAvtomatik to'planadigan:\n— IP-manzil va brauzer turi;\n— Tashrif buyurilgan sahifalar." },
      { title: "3. Ma'lumotlardan foydalanish", content: "— Arizangizni ko'rib chiqish va xizmat ko'rsatish;\n— Buyurtmangiz bo'yicha muloqot;\n— Ariza holati haqida bildirishnomalar yuborish;\n— Xizmatimizni yaxshilash.\n\nBiz ma'lumotlaringizdan reklama uchun foydalanmaymiz va uchinchi tomonlarga sotmaymiz." },
      { title: "4. Uchinchi tomonlarga uzatish", content: "Ma'lumotlarni faqat quyidagi hollarda uzatamiz:\n— Universitetlarga — arizangizni topshirish uchun;\n— Tarjimonlarga — hujjatlaringizni tarjima qilish uchun;\n— To'lov provayderlarga — to'lovni qayta ishlash uchun;\n— Davlat organlariga — qonun talabiga ko'ra." },
      { title: "5. Ma'lumotlarni saqlash", content: "5.1. Ma'lumotlar xavfsiz serverlarda xizmatlar uchun zarur bo'lgan muddatgacha saqlanadi.\n\n5.2. Hujjatlar xizmat yakunlangandan keyin 12 oydan ko'p saqlanmaydi.\n\n5.3. Ruxsatsiz kirishdan himoya qilish uchun texnik choralar ko'riladi." },
      { title: '6. Sizning huquqlaringiz', content: "Istalgan vaqtda:\n— Saqlangan ma'lumotlar haqida ma'lumot olish;\n— Noto'g'ri ma'lumotlarni tuzatish;\n— Ma'lumotlarni o'chirish so'rovi;\n— Qayta ishlashga rozilikni bekor qilish.\n\nBuning uchun tarjumanedu@gmail.com ga yozing. 5 ish kuni ichida javob beramiz." },
      { title: '7. Cookie', content: "Sayt to'g'ri ishlash uchun zarur texnik cookie'lardan foydalanadi. Reklama cookie'lari ishlatilmaydi." },
      { title: '8. Siyosatni o\'zgartirish', content: "Joriy versiya /privacy sahifasida mavjud. Muhim o'zgarishlar haqida elektron pochta orqali xabardor qilamiz." },
    ],
  },
  en: {
    hero: { badge: 'Legal Documents', title: 'Privacy Policy', updated: 'Last updated: May 1, 2025' },
    note: { title: 'Your data is protected', body: 'TARJUMAN cares about your privacy. Questions: tarjumanedu@gmail.com' },
    sections: [
      { title: '1. Who We Are', content: `TARJUMAN is a service supporting students in applying to universities in Saudi Arabia and the UAE. We are the operator of personal data collected through tarjuman.pro.\n\nContact: tarjumanedu@gmail.com` },
      { title: '2. What Data We Collect', content: `Data you provide directly:\n— Full name;\n— Email address;\n— Phone number / Telegram;\n— Educational background;\n— Application documents (passport, diploma, etc.).\n\nAutomatically collected data:\n— IP address and browser type;\n— Pages visited and visit duration.` },
      { title: '3. How We Use Your Data', content: `— Processing your application and providing services;\n— Communicating with you about your order;\n— Sending application status notifications;\n— Improving our service.\n\nWe do not use your data for advertising and do not sell it to third parties.` },
      { title: '4. Sharing with Third Parties', content: `We share data only in these cases:\n— Universities — to submit your application;\n— Translation services — to translate your documents;\n— Payment providers — to process payments;\n— Government authorities — as required by law.` },
      { title: '5. Data Storage', content: `5.1. Data is stored on secure servers for as long as needed to provide services.\n\n5.2. Documents are stored for no more than 12 months after service completion.\n\n5.3. We apply technical measures to protect against unauthorized access.` },
      { title: '6. Your Rights', content: `You have the right at any time to:\n— Obtain information about the data we store;\n— Correct inaccurate data;\n— Request data deletion;\n— Withdraw consent to processing.\n\nTo exercise these rights, write to tarjumanedu@gmail.com. We will respond within 5 business days.` },
      { title: '7. Cookies', content: `Our site uses technical cookies necessary for correct operation. No advertising cookies are used.` },
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
    </>
  )
}
