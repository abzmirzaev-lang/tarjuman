import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Al Qasimia University — Поступление для студентов из СНГ | Tarjuman Edu',
  description: 'Поступление в Al Qasimia University (Шарджа, ОАЭ). Документы, требования, стоимость, специальности. Помощь Tarjuman Edu с переводом и подачей заявки.',
  keywords: ['Al Qasimia University', 'Al Qasimia University поступление', 'Al Qasimia University Sharjah', 'университет Аль-Касимия', 'поступить в ОАЭ университет', 'al qasimia university admission'],
  alternates: { canonical: 'https://tarjumanedu.com/al-qasimia-university-postuplenie' },
  openGraph: {
    title: 'Al Qasimia University — Поступление | Tarjuman Edu',
    description: 'Помощь с поступлением в Al Qasimia University, Шарджа, ОАЭ. Документы и подача от $49.',
    url: 'https://tarjumanedu.com/al-qasimia-university-postuplenie',
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
          Al Qasimia University — Поступление из СНГ
        </h1>
        <p className="text-lg text-muted mb-10 leading-relaxed">
          Al Qasimia University — один из ведущих исламских университетов ОАЭ, расположен в Шардже. Принимает студентов из Узбекистана, Казахстана, Таджикистана и других стран СНГ.
        </p>

        <div className="space-y-8">

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-2xl font-bold text-ink mb-4">Об университете</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Город', value: 'Шарджа, ОАЭ' },
                { label: 'Тип', value: 'Исламский университет' },
                { label: 'Язык обучения', value: 'Арабский' },
                { label: 'Форма обучения', value: 'Очная' },
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
              {['Исламские науки', 'Арабский язык и литература', 'Шариат и право', 'Коранические науки', 'Исламская экономика', 'Педагогика'].map(s => (
                <div key={s} className="bg-white border border-border rounded-xl p-3 text-sm font-medium text-ink">
                  {s}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Требования к поступлению</h2>
            <ul className="space-y-2 text-muted">
              {[
                'Аттестат или диплом с переводом на арабский язык',
                'Средний балл не ниже 60%',
                'Знание арабского языка (или готовность пройти подготовительный курс)',
                'Медицинская справка',
                'Паспорт и фотографии',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Процесс поступления</h2>
            <div className="space-y-3">
              {[
                { n: '01', t: 'Консультация', d: 'Обсуждаем ваш уровень, цели и документы' },
                { n: '02', t: 'Перевод документов', d: 'Переводим на арабский язык в формате, принятом университетом' },
                { n: '03', t: 'Подача заявки', d: 'Отправляем документы в приёмную комиссию Al Qasimia' },
                { n: '04', t: 'Ответ и виза', d: 'После принятия помогаем оформить студенческую визу ОАЭ' },
              ].map(s => (
                <div key={s.n} className="flex gap-4 bg-white rounded-xl border border-border p-4">
                  <span className="text-xl font-black text-brand-400">{s.n}</span>
                  <div>
                    <p className="font-bold text-ink">{s.t}</p>
                    <p className="text-sm text-muted">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-ink mb-4">Стоимость помощи</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { name: 'Подача', price: '$49', desc: 'Только документы' },
                { name: 'Стандарт', price: '$99', desc: 'Перевод + подача' },
                { name: 'VIP', price: '$199', desc: 'Полное сопровождение' },
              ].map(t => (
                <div key={t.name} className="text-center p-3 bg-[#F7F8FA] rounded-xl">
                  <p className="font-bold text-ink text-sm">{t.name}</p>
                  <p className="text-xl font-black text-brand-600">{t.price}</p>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/apply" className="block w-full text-center py-3 bg-brand-400 text-ink font-bold rounded-xl hover:bg-brand-300 transition-colors">
              Подать документы в Al Qasimia
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
