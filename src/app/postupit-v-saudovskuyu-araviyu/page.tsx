import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Как поступить в университет Саудовской Аравии — Tarjuman Edu',
  description: 'Пошаговая инструкция как поступить в университет Саудовской Аравии из СНГ. Документы, сроки, стоимость. Al Qasimia, IUM, KSU, KAU. Помощь Tarjuman Edu от $39.',
  keywords: ['поступить в Саудовскую Аравию', 'как поступить в университет Саудовской Аравии', 'поступление в Саудию', 'документы для поступления Саудовская Аравия', 'учёба в Саудовской Аравии'],
  alternates: {
    canonical: 'https://tarjumanedu.com/postupit-v-saudovskuyu-araviyu',
    languages: {
      'ru':        'https://tarjumanedu.com/postupit-v-saudovskuyu-araviyu',
      'uz':        'https://tarjumanedu.com/saudiya-arabistoniga-kirish',
      'en':        'https://tarjumanedu.com/study-in-saudi-arabia',
      'x-default': 'https://tarjumanedu.com',
    },
  },
  openGraph: {
    title: 'Как поступить в университет Саудовской Аравии',
    description: 'Пошаговая инструкция. Документы, сроки, стоимость. Tarjuman Edu помогает с $39.',
    url: 'https://tarjumanedu.com/postupit-v-saudovskuyu-araviyu',
  },
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <div className="mb-4">
          <Link href="/" className="text-sm text-brand-600 hover:underline">← На главную</Link>
        </div>

        <h1 className="text-4xl font-black text-ink mb-4">
          Как поступить в университет Саудовской Аравии
        </h1>
        <p className="text-lg text-muted mb-10 leading-relaxed">
          Подробное руководство для студентов из Узбекистана, Казахстана, Таджикистана и других стран СНГ.
        </p>

        <div className="space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Шаг 1. Выберите университет</h2>
            <p className="text-muted leading-relaxed">
              В Саудовской Аравии более 30 университетов, принимающих иностранных студентов. Самые популярные:
              <strong> Al Qasimia University</strong> (Шарджа),
              <strong> Исламский университет Медины</strong> (полная стипендия),
              <strong> King Saud University</strong>,
              <strong> King Abdulaziz University</strong>.
              Мы помогаем выбрать университет под ваш уровень и цели.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Шаг 2. Подготовьте документы</h2>
            <p className="text-muted leading-relaxed mb-3">Для поступления в большинство университетов Саудовской Аравии нужны:</p>
            <ul className="space-y-2 text-muted">
              {['Диплом или аттестат с переводом на арабский язык', 'Паспорт (копия)', 'Фотографии (4 шт., 3×4)', 'Медицинская справка', 'Рекомендательные письма (для некоторых вузов)', 'Сертификат знания языка (арабский или английский — зависит от программы)'].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Шаг 3. Переведите документы</h2>
            <p className="text-muted leading-relaxed">
              Все документы должны быть переведены на арабский язык. <strong>Tarjuman Edu</strong> выполняет переводы, которые принимают университеты Саудовской Аравии и ОАЭ. Срок перевода — от 6 часов.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Шаг 4. Подайте заявку</h2>
            <p className="text-muted leading-relaxed">
              Мы подаём документы напрямую в приёмную комиссию университета. Вы получаете доступ к личному кабинету, где можно отслеживать статус заявки в реальном времени.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Шаг 5. Получите ответ и оформите визу</h2>
            <p className="text-muted leading-relaxed">
              После положительного решения университета мы помогаем с оформлением студенческой визы. Весь процесс от первого обращения до въезда в страну занимает 2–6 месяцев.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-ink mb-2">Сколько это стоит?</h2>
            <p className="text-muted mb-4">Тарифы Tarjuman Edu:</p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { name: 'Подача', price: '$39', desc: 'Только документы' },
                { name: 'Стандарт', price: '$79', desc: 'Перевод + подача' },
                { name: 'VIP', price: '$99', desc: 'Полное сопровождение' },
              ].map(t => (
                <div key={t.name} className="text-center p-3 bg-[#F7F8FA] rounded-xl">
                  <p className="font-bold text-ink">{t.name}</p>
                  <p className="text-2xl font-black text-brand-600">{t.price}</p>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
              ))}
            </div>
            <Link
              href="/apply-saudi"
              className="block w-full text-center py-3 bg-brand-400 text-ink font-bold rounded-xl hover:bg-brand-300 transition-colors"
            >
              Начать поступление
            </Link>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              {[
                { q: 'Нужно ли знать арабский язык?', a: 'Нет. Большинство университетов предлагают подготовительный курс языка. Мы поможем выбрать программу на вашем уровне.' },
                { q: 'Есть ли стипендии для иностранных студентов?', a: 'Да. Исламский университет Медины предоставляет полную стипендию: бесплатное обучение, проживание и $300–500 в месяц. Многие государственные университеты КСА также не взимают плату с иностранных студентов.' },
                { q: 'Принимают ли без опыта работы?', a: 'Да, большинство программ бакалавриата и магистратуры доступны без опыта работы.' },
              ].map((item, i) => (
                <div key={i} className="border border-border rounded-xl p-4">
                  <p className="font-bold text-ink mb-1">{item.q}</p>
                  <p className="text-sm text-muted">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
