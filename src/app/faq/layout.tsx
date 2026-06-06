export { metadata } from './metadata'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Что такое Tarjuman Edu?', acceptedAnswer: { '@type': 'Answer', text: 'Tarjuman Edu — профессиональный сервис помощи студентам из СНГ при поступлении в университеты Саудовской Аравии и ОАЭ. Мы переводим документы, подаём заявки и сопровождаем до зачисления.' } },
    { '@type': 'Question', name: 'Гарантируете ли вы зачисление?', acceptedAnswer: { '@type': 'Answer', text: 'Нет. Tarjuman Edu оказывает консультационные, переводческие и организационные услуги. Решение о зачислении принимается университетом.' } },
    { '@type': 'Question', name: 'Есть ли стипендии для иностранных студентов в Саудовской Аравии?', acceptedAnswer: { '@type': 'Answer', text: 'Да. Исламский университет Медины предоставляет полную стипендию: бесплатное обучение, ежемесячное пособие $300–500, проживание и питание. Многие государственные университеты Саудовской Аравии не взимают плату за обучение с иностранцев.' } },
    { '@type': 'Question', name: 'Какие документы нужны для поступления?', acceptedAnswer: { '@type': 'Answer', text: 'Загранпаспорт, фото, аттестат/диплом с транскриптом, справка о несудимости, медицинская справка. Дополнительно: IELTS/TOEFL, сертификаты по арабскому, рекомендательные письма.' } },
    { '@type': 'Question', name: 'Сколько стоят услуги Tarjuman Edu?', acceptedAnswer: { '@type': 'Answer', text: 'Три тарифа: Submission $49 (подача готового пакета), Standard $99 (перевод + проверка + подача), VIP $199 (приоритетная подача за 12–24 часа + персональный менеджер).' } },
    { '@type': 'Question', name: 'Как поступить в Al Qasimia University?', acceptedAnswer: { '@type': 'Answer', text: 'Подайте заявку через Tarjuman Edu: заполните форму, загрузите документы, мы переведём их и подадим в Al Qasimia University (Шарджа, ОАЭ) в установленные сроки.' } },
    { '@type': 'Question', name: 'Нужно ли знать арабский язык для поступления?', acceptedAnswer: { '@type': 'Answer', text: 'Не обязательно на момент подачи. Многие университеты Саудовской Аравии включают подготовительный языковой курс. Программы в ОАЭ часто ведутся на английском.' } },
    { '@type': 'Question', name: 'Можно ли вернуть деньги?', acceptedAnswer: { '@type': 'Answer', text: 'Да. До начала работы — возврат 100%. Если перевод выполнен, но заявка не подана — возврат 50%. После подачи заявки возврат не предусмотрен.' } },
  ],
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
