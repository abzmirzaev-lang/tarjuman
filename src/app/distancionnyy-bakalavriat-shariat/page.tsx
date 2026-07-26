import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Дистанционный бакалавриат Шариата — Исламский университет Медины | Tarjuman Edu',
  description: 'Поступление на дистанционную программу бакалавриата Шариата в Исламском университете Медины (IUM) для иностранных студентов. Бесплатный грант от Вакфа короля Абдаллы. Приём на 1448 г.х. Помощь с документами от Tarjuman Edu.',
  keywords: [
    'дистанционный бакалавриат шариат',
    'IUM дистанционное обучение',
    'Исламский университет Медины онлайн',
    'бакалавриат шариата дистанционно',
    'islamic university madinah distance learning',
    'IUM online bachelor sharia',
    'поступление дистанционно Медина',
    'грант вакф короля Абдаллы',
  ],
  alternates: { canonical: 'https://tarjumanedu.com/distancionnyy-bakalavriat-shariat' },
  openGraph: {
    title: 'Дистанционный бакалавриат Шариата — IUM | Tarjuman Edu',
    description: 'Онлайн-программа бакалавриата Шариата в Исламском университете Медины. Бесплатный грант, приём на 1448 г.х. Помощь с документами.',
    url: 'https://tarjumanedu.com/distancionnyy-bakalavriat-shariat',
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
          Дистанционный бакалавриат Шариата — Исламский университет Медины
        </h1>
        <p className="text-lg text-muted mb-10 leading-relaxed">
          Исламский университет Медины (IUM) открывает приём иностранных студентов на программу бакалавриата Шариата в формате полностью дистанционного электронного обучения. Программа реализуется в сотрудничестве с Вакфом короля Абдаллы бен Абдулазиза (в память о его родителях) и включает бесплатный грант для студентов, соответствующих условиям приёма. Приём документов — на 1448 учебный год хиджры (2026/2027).
        </p>

        <div className="space-y-8">

          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-emerald-900 mb-3">Грант покрывает</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                '✓ Регистрационный сбор за семестр (после 1-го)',
                '✓ Оплату за каждый кредитный час',
                '✓ Сборы за пересдачи после финального экзамена',
                '✓ Сбор за выпуск и оформление диплома',
              ].map((item, i) => (
                <p key={i} className="text-emerald-800 text-sm font-medium">{item}</p>
              ))}
            </div>
            <p className="text-xs text-emerald-700 mt-3">Грант предоставляется Вакфом короля Абдаллы бен Абдулазиза и сохраняется при соблюдении условий обучения и правил вакфа.</p>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-2xl font-bold text-ink mb-4">О программе</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Университет', value: 'Исламский университет Медины' },
                { label: 'Основан', value: '1381 г.х. (1962)' },
                { label: 'Формат обучения', value: 'Полностью дистанционно (онлайн)' },
                { label: 'Язык обучения', value: 'Арабский' },
                { label: 'Программа', value: 'Бакалавриат Шариата' },
                { label: 'Приём документов', value: '1448 учебный год' },
              ].map(item => (
                <div key={item.label} className="bg-[#F7F8FA] rounded-xl p-3">
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="font-bold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Общие условия приёма</h2>
            <ul className="space-y-2 text-muted">
              {[
                'Не гражданин Саудовской Аравии и не проживает в стране постоянно',
                'Аттестат о среднем образовании или эквивалентный документ, признанный университетом',
                'Не был отчислен из другого учебного заведения по академическим или дисциплинарным причинам',
                'Свободное владение арабским языком',
                'Прохождение теста на определение уровня арабского, если предыдущее обучение было не на арабском',
                'Соблюдение академических норм и правил поведения университета',
                'Годность по состоянию здоровья к дистанционному обучению',
                'Соблюдение условий вакфа-донора (King Abdullah Waqf)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Необходимые документы</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Аттестат о среднем образовании (оригинал)',
                'Выписка оценок (табель успеваемости)',
                'Справка об отсутствии судимости',
                'Действующий загранпаспорт',
              ].map(s => (
                <div key={s} className="bg-white border border-border rounded-xl p-3 text-sm font-medium text-ink">{s}</div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3">Принимаются только чёткие сканы с оригиналов документов — копии с копий не рассматриваются.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Этапы поступления</h2>
            <div className="space-y-3">
              {[
                { n: '01', t: 'Подача заявки', d: 'Через официальный электронный портал дистанционного обучения университета' },
                { n: '02', t: 'Регистрация', d: 'Создание учётной записи студента в системе дистанционного обучения' },
                { n: '03', t: 'Оплата сбора', d: 'Регистрационный сбор за подачу заявки (не возвращается)' },
                { n: '04', t: 'Рассмотрение и зачисление', d: 'Проверка документов университетом и присвоение студенческого номера при зачислении' },
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
            <h2 className="text-xl font-bold text-ink mb-4">Сборы при подаче заявки</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { name: 'Регистрация и активация файла', price: '230 SAR', desc: '≈ $61, не возвращается' },
                { name: 'Тест на уровень арабского (если требуется)', price: '230 SAR', desc: '≈ $61, не возвращается даже при неудаче' },
              ].map(t => (
                <div key={t.name} className="text-center p-3 bg-[#F7F8FA] rounded-xl">
                  <p className="font-bold text-ink text-sm">{t.name}</p>
                  <p className="text-xl font-black text-brand-600">{t.price}</p>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">Все сборы указаны с учётом НДС. Дальнейшие сборы (за семестр, кредитные часы, экзамены, выпуск) покрываются грантом вакфа при сохранении статуса гранта.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Требования для получения степени бакалавра</h2>
            <ul className="space-y-2 text-muted">
              {[
                'Прохождение всех дисциплин и кредитных часов учебного плана',
                'Достижение необходимого среднего балла для выпуска',
                'Успешная сдача итогового комплексного экзамена очно',
                'Выполнение всех прочих требований к выпуску по регламенту университета',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mt-3">
              Диплом бакалавра выдаётся только после очной сдачи итогового комплексного экзамена. Явка на экзамен — за счёт студента, в месте и в сроки, установленные университетом.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Важно знать</h2>
            <div className="space-y-2">
              {[
                'Обучение полностью на арабском языке.',
                'Заявки принимаются только через официальный электронный портал университета.',
                'У университета нет представительств или агентов в других странах — будьте осторожны с посредниками, выдающими себя за официальных представителей.',
                'Зачисление считается окончательным только после официального объявления на портале приёма.',
                'Для сдачи онлайн-экзаменов нужен компьютер с камерой и микрофоном — смартфоны и планшеты не принимаются.',
                'Сбор за подачу заявки не возвращается при отказе или отзыве заявки.',
              ].map((item, i) => (
                <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-ink mb-2">Подать заявку на программу</h2>
            <p className="text-muted text-sm mb-4">Tarjuman Edu поможет перевести документы на арабский язык, правильно оформить заявку и подать её через официальный портал Исламского университета Медины.</p>
            <Link href="/apply" className="block w-full text-center py-3 bg-brand-400 text-ink font-bold rounded-xl hover:bg-brand-300 transition-colors">
              Начать поступление в IUM (дистанционно)
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
