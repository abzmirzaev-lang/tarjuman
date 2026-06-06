'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, MessageCircle, Mail, BookOpen, FileText, Clock, GraduationCap, CreditCard, ShieldCheck } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
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
      { q: 'Нужно ли переводить документы на арабский язык?', a: 'Да, большинство университетов Саудовской Аравии требуют профессиональный перевод на арабский язык. Документы для ОАЭ могут быть на английском. Все переводы в наших пакетах Standard и VIP входят в стоимость и выполняются нашими переводчиками.' },
      { q: 'Как проходит перевод документов?', a: 'Вы загружаете сканы документов в личный кабинет. Наш переводчик-арабист выполняет перевод в течение 1–3 рабочих дней (в VIP-пакете — приоритетно). Затем мы проверяем перевод на соответствие требованиям конкретного университета и только после этого включаем в пакет документов.' },
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
      { q: 'Гарантируете ли вы зачисление?', a: 'Нет. Tarjuman Edu оказывает консультационные, переводческие и организационные услуги. Решение о зачислении принимается университетом. Мы делаем всё возможное для качественной подготовки вашего пакета документов, однако итоговое решение остаётся за приёмной комиссией вуза.' },
      { q: 'Что если университет отказал?', a: 'Отказ — не конец. Мы анализируем причину отказа, при необходимости помогаем усилить пакет документов (дополнительные справки, улучшение мотивационного письма) и подаём повторно или в альтернативный университет. Первая повторная подача — бесплатно.' },
      { q: 'Что если я передумал поступать?', a: 'Свяжитесь с нашим менеджером как можно раньше. Если работа ещё не началась — возврат полной суммы. Мы понимаем, что обстоятельства меняются, и подходим к каждому случаю индивидуально.' },
    ],
  },
]

const FAQ_EN: FAQCategory[] = [
  {
    id: 'general', icon: BookOpen, title: 'General',
    items: [
      { q: 'What is Tarjuman Edu and how do you help?', a: 'Tarjuman Edu is a professional service helping students apply to universities in Saudi Arabia, UAE, Qatar, Kuwait and Turkey. We handle the full cycle: document translation, package review, application submission and support until you receive your enrollment offer.' },
      { q: 'Which countries do you accept applications from?', a: 'We work with students from around the world — Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, Azerbaijan, Russia and others. Citizenship is not a restriction.' },
      { q: 'Which countries and universities do you help with?', a: 'We specialize in Saudi Arabia (Islamic University of Madinah, King Saud University, KFUPM, KAU) and UAE (UAE University, University of Sharjah, American University of Sharjah). We also work with universities in Qatar, Kuwait and Turkey.' },
      { q: 'Can I apply to several universities at once?', a: 'Yes, we recommend applying to 3–5 universities in parallel — this significantly increases your chances. With Standard and VIP packages we submit to all eligible universities at no extra charge.' },
    ],
  },
  {
    id: 'documents', icon: FileText, title: 'Documents',
    items: [
      { q: 'What documents are needed for admission?', a: 'Required: valid passport, 3×4 photo on white background, school certificate or diploma with transcript, criminal record clearance, medical certificate (HIV/hepatitis). Optional (improve chances): IELTS/TOEFL, Arabic language certificates, recommendation letters.' },
      { q: 'Do documents need to be translated into Arabic?', a: 'Yes, most Saudi universities require a professional Arabic translation. Documents for UAE may be in English. All translations in Standard and VIP packages are included in the price and done by our translators.' },
      { q: 'How does the document translation process work?', a: 'You upload document scans to your dashboard. Our Arabic translator completes the translation within 1–3 business days (priority in VIP). We then verify the translation against the specific university requirements before including it in the package.' },
      { q: 'Do translations need to be notarized?', a: 'It depends on the university. The Islamic University of Madinah, for example, requires an apostille and notarization. We clarify your university\'s requirements in advance and inform you of any steps needed on your end.' },
      { q: 'What if my documents are in Russian or Uzbek?', a: 'This is the standard situation — we work with documents in any language. We translate into Arabic or English depending on the university requirements. There is no extra charge for the source document language.' },
    ],
  },
  {
    id: 'process', icon: Clock, title: 'Process & Timeline',
    items: [
      { q: 'How long does the admission process take?', a: 'Our submission takes 6–48 hours depending on the package. The university review process takes 2 weeks to 4 months. After a positive decision, visa processing takes another 2–6 weeks. Total: expect 2–6 months from first application to entry.' },
      { q: 'When does the application period open?', a: 'Deadlines depend on the university and change each year. Typically: Saudi Arabia — January–March for the fall semester; UAE — March–June. We track current deadlines and notify clients via the Telegram channel @tarjumanedu.' },
      { q: 'Can I track the status of my application?', a: 'Yes! In your dashboard you can see your real-time status, all uploaded documents, change history and manager comments. With each status update you automatically receive a Telegram notification.' },
      { q: 'What happens after the application is submitted?', a: 'After submission the university reviews the documents and makes a decision: accepted (we send the enrollment letter), pending (additional documents or interview) or rejected (we help identify the reason and resubmit). Your manager is available at every stage.' },
    ],
  },
  {
    id: 'requirements', icon: GraduationCap, title: 'Requirements',
    items: [
      { q: 'Do I need to know Arabic?', a: 'Not necessarily at the time of application. Many Saudi universities include a one-year preparatory language course. UAE programs are often taught in English. We will find an option that matches your language level.' },
      { q: 'What GPA is required?', a: 'Most universities accept from 60–65% (3.0/5.0). Top universities — KFUPM, King Abdulaziz University — require 75–80%. We will honestly tell you which universities are realistic for your grade.' },
      { q: 'Are there scholarships for international students?', a: 'Yes, and very generous ones. The Islamic University of Madinah offers a full scholarship: free tuition, monthly allowance of $300–500, dormitory and meals. Many Saudi state universities charge no tuition for international students. We help you apply for grant programs.' },
      { q: 'Are students without work experience accepted?', a: 'Yes, most bachelor\'s and master\'s programs are available without work experience. Some master\'s and doctoral programs require 2–3 years of experience — we clarify requirements for your program in advance.' },
    ],
  },
  {
    id: 'payment', icon: CreditCard, title: 'Pricing & Payment',
    items: [
      { q: 'How much do your services cost?', a: 'Three plans: Submission ($49) — submission of your ready document package; Standard ($99) — translation + review + submission within 1–3 days + post-enrollment support; VIP ($199) — translation + priority submission in 12–24 hours + personal manager + unlimited chat. University tuition is paid separately.' },
      { q: 'What payment methods are accepted?', a: 'We accept bank cards (Visa, Mastercard), cryptocurrency (USDT, BTC) and other methods. After payment you immediately receive confirmation by email and access to your dashboard where work begins.' },
      { q: 'Are there hidden fees or extra charges?', a: 'No. The package price is fixed and includes all services listed in the description. If something extra is needed for your situation (e.g. apostille), we will inform you in advance before payment.' },
    ],
  },
  {
    id: 'refunds', icon: ShieldCheck, title: 'Refunds & Guarantees',
    items: [
      { q: 'Can I get a refund?', a: 'Yes. If we have not yet started work — 100% refund. If documents have been translated but the application has not been submitted — 50% refund. After the application is submitted to the university no refund is available as the work has been fully completed. See the Refund Policy for details.' },
      { q: 'Do you guarantee admission?', a: 'No. Tarjuman Edu provides consulting, translation and organizational services. The admission decision is made by the university. We do everything possible to prepare a quality document package, but the final decision rests with the university admissions office.' },
      { q: 'What if the university rejects my application?', a: 'Rejection is not the end. We analyze the reason for rejection, help strengthen the document package if needed (additional certificates, improved motivation letter) and resubmit or apply to an alternative university. The first resubmission is free.' },
      { q: 'What if I change my mind about applying?', a: 'Contact our manager as soon as possible. If work has not yet started — full refund. We understand that circumstances change and approach each case individually.' },
    ],
  },
]

const FAQ_UZ: FAQCategory[] = [
  {
    id: 'general', icon: BookOpen, title: 'Umumiy savollar',
    items: [
      { q: 'Tarjuman Edu nima va qanday yordam berasiz?', a: "Tarjuman Edu — talabalarni Saudiya Arabistoni, BAA, Qatar, Quvayt va Turkiya universitetlariga qabul qilishda yordam beruvchi professional xizmat. Biz to'liq jarayonni o'z zimmamizga olamiz: hujjatlar tarjimasi, paketni tekshirish, ariza topshirish va qabul taklifini olguncha hamrohlik." },
      { q: "Qaysi mamlakatlardan arizalar qabul qilasiz?", a: "Biz butun dunyo talabalari bilan ishlaymiz — O'zbekiston, Qozog'iston, Qirg'iziston, Tojikiston, Turkmaniston, Ozarbayjon, Rossiya va boshqalar. Fuqarolik cheklov emas." },
      { q: "Qaysi mamlakatlarga va universitetlarga qabul qilishda yordam berasiz?", a: "Biz Saudiya Arabistoni (Madina Islom universiteti, Qirol Saud universiteti, KFUPM, KAU) va BAA (BAA universiteti, Sharjah universiteti, Sharjah Amerika universiteti) ga ixtisoslashganmiz. Shuningdek, Qatar, Quvayt va Turkiya universitetlari bilan ham ishlaymiz." },
      { q: "Bir vaqtning o'zida bir necha universitetga ariza topshirish mumkinmi?", a: "Ha, biz 3–5 universitetga parallel ravishda ariza topshirishni tavsiya qilamiz — bu qabul bo'lish imkoniyatini sezilarli darajada oshiradi. Standard va VIP paketlarda biz qo'shimcha to'lovsiz barcha mos universitetlarga topshiramiz." },
    ],
  },
  {
    id: 'documents', icon: FileText, title: 'Hujjatlar',
    items: [
      { q: "Qabul uchun qanday hujjatlar kerak?", a: "Majburiy: amal qiluvchi xalqaro pasport, oq fonda 3×4 rasm, attestat yoki diplom (transkript bilan), jinoiy javobgarlikka tortilmaganlik ma'lumotnomasi, tibbiy ma'lumotnoma (OIV/gepatit). Qo'shimcha (imkoniyatni oshiradi): IELTS/TOEFL, arab tili sertifikatlari, o'qituvchilardan tavsiya xatlari." },
      { q: "Hujjatlarni arabchaga tarjima qilish kerakmi?", a: "Ha, ko'pchilik Saudiya Arabistoni universitetlari professional arab tili tarjimasini talab qiladi. BAA uchun hujjatlar ingliz tilida bo'lishi mumkin. Standard va VIP paketlaridagi barcha tarjimalar narxga kiritilgan va bizning tarjimonlarimiz tomonidan bajariladi." },
      { q: "Hujjatlarni tarjima qilish qanday amalga oshiriladi?", a: "Siz hujjatlar skanlarini shaxsiy kabinetga yuklaysiz. Bizning arabshunos tarjimonimiz 1–3 ish kuni ichida tarjimani bajaradi (VIP da ustuvor). Keyin biz tarjimani muayyan universitetning talablariga muvofiqligini tekshiramiz va shundan keyingina hujjatlar paketiga kiritamiz." },
      { q: "Tarjimalarni notarial tasdiqlash kerakmi?", a: "Universitetga bog'liq. Masalan, Madina Islom universiteti apostil va notarial tasdiqlashni talab qiladi. Biz universitetingizning talablarini oldindan aniqlaymiz va sizdan qanday qadamlar qo'yish kerakligini xabardor qilamiz." },
      { q: "Hujjatlarim rus yoki o'zbek tilida bo'lsa nima qilaman?", a: "Bu standart holat — biz istalgan tildagi hujjatlar bilan ishlaymiz. Universitetning talablariga qarab arabcha yoki inglizchaga tarjima qilamiz. Manba hujjat tili uchun qo'shimcha to'lov yo'q." },
    ],
  },
  {
    id: 'process', icon: Clock, title: 'Jarayon va muddatlar',
    items: [
      { q: "Qabul jarayoni qancha davom etadi?", a: "Bizning tomonimizdan topshirish paketga qarab 6–48 soat oladi. Universitetning ko'rib chiqish jarayoni 2 haftadan 4 oygacha. Ijobiy qarordan keyin viza rasmiylashtirilishi yana 2–6 hafta oladi. Jami: birinchi arizadan mamlakatga kirishgacha 2–6 oyga hisoblang." },
      { q: "Arizalar qabuli qachon boshlanadi?", a: "Qabul muddatlari universitetga bog'liq va har yili o'zgaradi. Odatda: Saudiya Arabistoni — kuzgi semestr uchun yanvar–mart; BAA — mart–iyun. Biz joriy muddatlarni kuzatib boramiz va mijozlarni @tarjumanedu Telegram kanalida xabardor qilamiz." },
      { q: "Arizamning holatini kuzatib bora olamanmi?", a: "Ha! Shaxsiy kabinetda siz real vaqt rejimida joriy holat, yuklangan barcha hujjatlar, o'zgarishlar tarixi va menejer izohlarini ko'rasiz. Har bir holat yangilanishida siz avtomatik ravishda Telegram orqali xabardor qilinasiz." },
      { q: "Ariza topshirilgandan keyin nima bo'ladi?", a: "Topshirishdan so'ng universitet hujjatlarni ko'rib chiqadi va qaror chiqaradi: qabul qilindi (biz qabul xatini yuboramiz), kutilmoqda (qo'shimcha hujjatlar yoki suhbat) yoki rad etildi (sababini tushunishga va qayta topshirishga yordam beramiz). Har bir bosqichda menejeringiz aloqada." },
    ],
  },
  {
    id: 'requirements', icon: GraduationCap, title: 'Talabalar uchun talablar',
    items: [
      { q: "Arab tilini bilish shartmi?", a: "Ariza topshirish vaqtida shart emas. Ko'pchilik Saudiya Arabistoni universitetlari bir yillik tayyorlov til kursini o'z ichiga oladi. BAA dasturlari ko'pincha ingliz tilida olib boriladi. Biz sizning til darajangizga mos variant topamiz." },
      { q: "Diplom yoki attestatning o'rtacha bali qancha bo'lishi kerak?", a: "Ko'pchilik universitetlar 60–65% (3.0/5.0) dan qabul qiladi. KFUPM, Qirol Abdulaziz universiteti kabi eng yaxshi universitetlar uchun 75–80% talab qilinadi. Biz sizga balingiz bilan qaysi universitetlarga haqiqiy imkoniyat borligini halol aytamiz." },
      { q: "Xorijiy talabalar uchun stipendiyalar bormi?", a: "Ha, va juda saxiy. Madina Islom universiteti to'liq stipendiya taqdim etadi: bepul ta'lim, oylik nafaqa $300–500, yotoqxona va ovqatlanish. Ko'pchilik Saudiya Arabistoni davlat universitetlari xorijiy talabalardan ta'lim to'lovini olmaydi. Biz grant dasturlariga ariza berishingizda yordam beramiz." },
      { q: "Ish tajribasiz talabalar qabul qilinadimi?", a: "Ha, ko'pchilik bakalavr va magistratura dasturlari ish tajribasisiz mavjud. Ba'zi magistratura va doktorantura dasturlari 2–3 yillik tajriba talab qiladi — biz yo'nalishingiz talablarini oldindan aniqlaymiz." },
    ],
  },
  {
    id: 'payment', icon: CreditCard, title: "Narx va to'lov",
    items: [
      { q: "Xizmatlaringiz qancha turadi?", a: "Uch tarif: Submission ($49) — tayyor hujjatlar paketingizni topshirish; Standard ($99) — tarjima + tekshirish + 1–3 kun ichida topshirish + qabul keyin qo'llab-quvvatlash; VIP ($199) — tarjima + 12–24 soat ichida ustuvor topshirish + shaxsiy menejer + cheksiz chat. Universitetdagi o'qish to'lovi alohida to'lanadi." },
      { q: "Qanday to'lov usullari qabul qilinadi?", a: "Bank kartalar (Visa, Mastercard), kriptovalyuta (USDT, BTC) va boshqa usullarni qabul qilamiz. To'lovdan so'ng siz darhol email orqali tasdiqlash va ish boshlanadigan shaxsiy kabinetga kirish huquqini olasiz." },
      { q: "Yashirin to'lovlar yoki qo'shimcha to'lovlar bormi?", a: "Yo'q. Paket narxi belgilangan va tavsifda ko'rsatilgan barcha xizmatlarni o'z ichiga oladi. Agar sizning holatingiz uchun qo'shimcha narsa kerak bo'lsa (masalan, apostil), biz to'lovdan oldin oldindan xabardor qilamiz." },
    ],
  },
  {
    id: 'refunds', icon: ShieldCheck, title: "Qaytarish va kafolatlar",
    items: [
      { q: "Pulni qaytarib olish mumkinmi?", a: "Ha. Agar biz hali ishni boshlamagan bo'lsak — 100% qaytarish. Agar hujjatlar tarjima qilingan, lekin ariza hali topshirilmagan bo'lsa — 50% qaytarish. Ariza universitetga topshirilgandan so'ng ish to'liq bajarilganligi sababli qaytarish ko'zda tutilmagan. Batafsil — Qaytarish siyosatida." },
      { q: "Qabul bo'lishini kafolatlaysizmi?", a: "Yo'q. Tarjuman Edu konsultatsiya, tarjima va tashkiliy xizmatlar ko'rsatadi. Qabul qarori universitet tomonidan qabul qilinadi. Biz hujjatlar paketini sifatli tayyorlash uchun hamma narsani qilamiz, biroq yakuniy qaror universitetning qabul komissiyasida qoladi." },
      { q: "Universitet rad etsa nima bo'ladi?", a: "Rad etish — bu oxiri emas. Biz rad etish sababini tahlil qilamiz, kerak bo'lsa hujjatlar paketini kuchaytirashga yordam beramiz (qo'shimcha ma'lumotnomalar, motivatsiya xatini yaxshilash) va qayta topshiramiz yoki muqobil universitetga murojaat qilamiz. Birinchi qayta topshirish — bepul." },
      { q: "O'qishdan voz kechsam nima bo'ladi?", a: "Menejerimiz bilan imkon qadar tezroq bog'laning. Agar ish hali boshlanmagan bo'lsa — to'liq summani qaytarish. Biz sharoitlar o'zgarishini tushunamiz va har bir holga individual yondashamiz." },
    ],
  },
]

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

  const categories = lang === 'uz' ? FAQ_UZ : lang === 'en' ? FAQ_EN : FAQ_RU

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
                  href="mailto:support@tarjumanedu.com"
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
    </>
  )
}
