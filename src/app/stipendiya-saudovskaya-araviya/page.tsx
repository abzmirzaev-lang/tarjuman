import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Стипендия в Саудовской Аравии для студентов из СНГ — Tarjuman Edu',
  description: 'Полные стипендии в университетах Саудовской Аравии: бесплатное обучение, $300–500 в месяц, жильё. Исламский университет Медины, KSU, KAU. Помощь с подачей от $39.',
  keywords: ['стипендия Саудовская Аравия', 'бесплатное образование Саудовская Аравия', 'грант Саудовская Аравия', 'стипендия для узбекистанцев', 'stipendiya saudiya arabistoni', 'saudi arabia scholarship uzbekistan'],
  alternates: { canonical: 'https://tarjumanedu.com/stipendiya-saudovskaya-araviya' },
  openGraph: {
    title: 'Стипендия в Саудовской Аравии — Tarjuman Edu',
    description: 'Полные стипендии: бесплатное обучение + $300–500/мес + жильё. Помощь с подачей.',
    url: 'https://tarjumanedu.com/stipendiya-saudovskaya-araviya',
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
          Стипендия в Саудовской Аравии для студентов из СНГ
        </h1>
        <p className="text-lg text-muted mb-10 leading-relaxed">
          Университеты Саудовской Аравии предоставляют одни из самых щедрых стипендий в мире для иностранных студентов. Tarjuman Edu помогает с подачей документов.
        </p>

        <div className="space-y-8">

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-2xl font-bold text-ink mb-4">Что включает полная стипендия</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎓', title: 'Бесплатное обучение', desc: 'Никакой платы за учёбу' },
                { icon: '💰', title: '$300–500 в месяц', desc: 'Ежемесячная стипендия' },
                { icon: '🏠', title: 'Жильё', desc: 'Бесплатное общежитие' },
                { icon: '✈️', title: 'Авиабилеты', desc: 'Перелёт туда и обратно' },
              ].map(item => (
                <div key={item.title} className="flex gap-3 p-3 bg-[#F7F8FA] rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-ink text-sm">{item.title}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-4">Университеты со стипендиями</h2>
            <div className="space-y-4">
              {[
                { name: 'Исламский университет Медины (IUM)', type: 'Полная стипендия', desc: 'Бесплатное обучение, $300–500/мес, общежитие, авиабилеты. Специальности: исламские науки, арабский язык, шариат.' },
                { name: 'King Saud University (KSU)', type: 'Частичная стипендия', desc: 'Бесплатное обучение для иностранных студентов. Стипендии доступны для отличников. Эр-Рияд.' },
                { name: 'King Abdulaziz University (KAU)', type: 'Бесплатное обучение', desc: 'Иностранные студенты не платят за обучение. Джидда. Широкий выбор специальностей.' },
                { name: 'Imam Muhammad ibn Saud University', type: 'Полная стипендия', desc: 'Стипендии для иностранных студентов по исламским дисциплинам. Эр-Рияд.' },
              ].map(u => (
                <div key={u.name} className="bg-white rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-bold text-ink">{u.name}</p>
                    <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2 py-1 rounded-full whitespace-nowrap ml-2">{u.type}</span>
                  </div>
                  <p className="text-sm text-muted">{u.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Требования для получения стипендии</h2>
            <ul className="space-y-2 text-muted">
              {[
                'Диплом или аттестат с переводом на арабский язык',
                'Средний балл от 60% (для топовых вузов от 75%)',
                'Возраст до 25 лет для бакалавриата (у некоторых вузов до 30)',
                'Медицинская справка об отсутствии заболеваний',
                'Рекомендательные письма',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-ink mb-2">Помощь с подачей на стипендию</h2>
            <p className="text-muted mb-4 text-sm">Tarjuman Edu подготовит все документы и подаст заявку в университет за вас.</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { name: 'Подача', price: '$39' },
                { name: 'Стандарт', price: '$79' },
                { name: 'VIP', price: '$99' },
              ].map(t => (
                <div key={t.name} className="text-center p-3 bg-[#F7F8FA] rounded-xl">
                  <p className="font-bold text-ink text-sm">{t.name}</p>
                  <p className="text-xl font-black text-brand-600">{t.price}</p>
                </div>
              ))}
            </div>
            <Link href="/apply" className="block w-full text-center py-3 bg-brand-400 text-ink font-bold rounded-xl hover:bg-brand-300 transition-colors">
              Подать на стипендию
            </Link>
          </section>

        </div>
      </div>
    </main>
  )
}
