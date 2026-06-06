import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Исламский университет Медины (IUM) — Поступление | Tarjuman Edu',
  description: 'Поступление в Исламский университет Медины. Полная стипендия: бесплатное обучение, $300–500 в месяц, жильё, авиабилеты. Помощь с документами от Tarjuman Edu.',
  keywords: ['Исламский университет Медины', 'IUM поступление', 'Islamic University of Madinah', 'стипендия Медина', 'университет Медины для узбекистанцев', 'islamic university madinah admission cis'],
  alternates: { canonical: 'https://tarjumanedu.com/islamskiy-universitet-mediny' },
  openGraph: {
    title: 'Исламский университет Медины — Поступление | Tarjuman Edu',
    description: 'Полная стипендия IUM: бесплатное обучение + $300–500/мес + жильё. Помощь с документами.',
    url: 'https://tarjumanedu.com/islamskiy-universitet-mediny',
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
          Исламский университет Медины — Поступление и стипендия
        </h1>
        <p className="text-lg text-muted mb-10 leading-relaxed">
          Islamic University of Madinah (IUM) — один из самых престижных исламских университетов мира. Предоставляет полную стипендию иностранным студентам, включая студентов из Узбекистана, Казахстана и других стран СНГ.
        </p>

        <div className="space-y-8">

          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-emerald-900 mb-3">Полная стипендия включает</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                '✓ Бесплатное обучение',
                '✓ $300–500 в месяц',
                '✓ Бесплатное общежитие',
                '✓ Авиабилеты (туда-обратно)',
                '✓ Медицинская страховка',
                '✓ Питание в кампусе',
              ].map((item, i) => (
                <p key={i} className="text-emerald-800 text-sm font-medium">{item}</p>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-2xl font-bold text-ink mb-4">Об университете</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Город', value: 'Медина, Саудовская Аравия' },
                { label: 'Основан', value: '1961 год' },
                { label: 'Язык обучения', value: 'Арабский' },
                { label: 'Стипендия', value: 'Полная (100%)' },
              ].map(item => (
                <div key={item.label} className="bg-[#F7F8FA] rounded-xl p-3">
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="font-bold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Специальности</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Коран и исламские науки', 'Шариат', 'Арабский язык', 'Дааватуль ислам', 'Хадисы', 'Исламская педагогика'].map(s => (
                <div key={s} className="bg-white border border-border rounded-xl p-3 text-sm font-medium text-ink">{s}</div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Требования</h2>
            <ul className="space-y-2 text-muted">
              {[
                'Возраст от 17 до 25 лет (для бакалавриата)',
                'Аттестат или диплом с переводом на арабский',
                'Хорошее знание арабского языка (или хафиз Корана)',
                'Справка об отсутствии судимости',
                'Медицинская справка',
                'Рекомендация от исламской организации (желательно)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Важно знать</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              Конкурс в IUM очень высокий. Мы помогаем правильно оформить все документы и подготовить сильное досье, чтобы максимально увеличить шансы на поступление.
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-ink mb-2">Подать документы в IUM</h2>
            <p className="text-muted text-sm mb-4">Tarjuman Edu поможет с переводом документов и подачей заявки в Исламский университет Медины.</p>
            <Link href="/apply" className="block w-full text-center py-3 bg-brand-400 text-ink font-bold rounded-xl hover:bg-brand-300 transition-colors">
              Начать поступление в IUM
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
