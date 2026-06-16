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
      body: "TARJUMAN xizmatidan foydalanib, siz quyidagi shartlarga roziligingizni bildirасиз. Savollar uchun: support@tarjumanedu.com",
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
        content: "3.1. Foydalanuvchi to'g'ri ma'lumotlar ko'rsatib ro'yxatdan o'tishi shart.\n\n3.2. Foydalanuvchi o'z kirish ma'lumotlari xavfsizligi uchun javobgardir.\n\n3.3. Ruxsatsiz kirish aniqlansa, darhol xabar bering: support@tarjum