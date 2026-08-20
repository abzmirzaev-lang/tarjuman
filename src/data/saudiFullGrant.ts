/**
 * TARJUMAN — «Полный грант в Саудовскую Аравию» (Study in Saudi Arabia)
 * ─────────────────────────────────────────────────────────────────────────
 * Единый источник данных для лендинга /polnyy-grant-v-saudovskuyu-araviyu.
 *
 * ВАЖНО: сейчас это mock-данные для демонстрации интерфейса. Структуры
 * `GrantUniversity` и `GrantProgram` спроектированы так, чтобы позже их
 * можно было заполнять из реальной базы (Supabase таблицы `universities`
 * и `programs`) без изменения дизайна страницы — компоненты читают только
 * поля этих интерфейсов, а не сами mock-массивы напрямую.
 */

// ──────────────────────────────────────────────────────────────────────────
// Типы (будущая схема БД)
// ──────────────────────────────────────────────────────────────────────────

export type DegreeLevel = 'bachelor' | 'master' | 'phd' | 'diploma' | 'higher_diploma'

export interface GrantUniversity {
  id:             string
  name:           string
  city:           string
  logoInitials:   string   // временная замена реального логотипа университета
  image:          string
  description:    string
  programsCount:  number
  degrees:        DegreeLevel[]
  fullGrant:      boolean
}

export interface GrantProgram {
  id:               string
  university_id:    string
  name:             string
  degree:           DegreeLevel
  field:            string
  gender:           'male' | 'female' | 'both'
  language:         string
  scholarship_type: 'full' | 'partial'
  duration:         string
  requirements:     string[]
  documents:        string[]
  deadline?:        string
  active:           boolean
}

// ──────────────────────────────────────────────────────────────────────────
// Университеты (демонстрационные карточки — позже заменяются данными из БД)
// ──────────────────────────────────────────────────────────────────────────

export const GRANT_UNIVERSITIES: GrantUniversity[] = [
  {
    id:            'islamic-university-of-madinah',
    name:          'Islamic University of Madinah',
    city:          'Медина',
    logoInitials:  'IUM',
    image:         'https://images.unsplash.com/photo-1692977579997-948328cdb7d2?w=800&q=75',
    description:   'Международный исламский университет, принимает студентов из 170+ стран. Один из вузов с самой давней историей полного гранта для иностранных студентов.',
    programsCount: 45,
    degrees:       ['bachelor', 'master', 'phd'],
    fullGrant:     true,
  },
  {
    id:            'king-saud-university',
    name:          'King Saud University',
    city:          'Эр-Рияд',
    logoInitials:  'KSU',
    image:         'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=75',
    description:   'Первый университет Саудовской Аравии. Широкий выбор инженерных, естественнонаучных и гуманитарных факультетов.',
    programsCount: 60,
    degrees:       ['bachelor', 'master', 'phd'],
    fullGrant:     true,
  },
  {
    id:            'king-abdulaziz-university',
    name:          'King Abdulaziz University',
    city:          'Джидда',
    logoInitials:  'KAU',
    image:         'https://i.ibb.co/67FLp20T/4.jpg',
    description:   'Один из крупнейших университетов страны. Известен программами по морским наукам, метеорологии и медицине.',
    programsCount: 55,
    degrees:       ['bachelor', 'master', 'phd'],
    fullGrant:     true,
  },
  {
    id:            'king-khalid-university',
    name:          'King Khalid University',
    city:          'Абха',
    logoInitials:  'KKU',
    image:         '/kku-abha.jpg',
    description:   'Государственный университет в горном регионе Асир. Один из крупнейших на Аравийском полуострове по числу факультетов.',
    programsCount: 38,
    degrees:       ['bachelor', 'master'],
    fullGrant:     true,
  },
  {
    id:            'jazan-university',
    name:          'Jazan University',
    city:          'Джазан',
    logoInitials:  'JU',
    image:         'https://images.unsplash.com/photo-1614350292382-c448d0110dfa?w=800&q=75',
    description:   'Университет на побережье Красного моря. Особо известен медицинской школой и естественнонаучными факультетами.',
    programsCount: 30,
    degrees:       ['bachelor', 'master'],
    fullGrant:     true,
  },
  {
    id:            'taibah-university',
    name:          'Taibah University',
    city:          'Медина',
    logoInitials:  'TU',
    image:         '/taibah.jpg',
    description:   'Государственный университет в Медине с полноценным медицинским факультетом и широким спектром инженерных программ.',
    programsCount: 40,
    degrees:       ['bachelor', 'master', 'phd'],
    fullGrant:     true,
  },
  {
    id:            'umm-al-qura-university',
    name:          'Umm Al-Qura University',
    city:          'Мекка',
    logoInitials:  'UQU',
    image:         'https://images.unsplash.com/photo-1724191078796-8a997b989f43?w=800&q=75',
    description:   'Старейший университет Саудовской Аравии. Специализируется на исламских науках, шариате и арабском языке.',
    programsCount: 42,
    degrees:       ['bachelor', 'master', 'phd'],
    fullGrant:     true,
  },
  {
    id:            'imam-muhammad-ibn-saud-university',
    name:          'Imam Muhammad ibn Saud Islamic University',
    city:          'Эр-Рияд',
    logoInitials:  'IMSIU',
    image:         'https://images.unsplash.com/photo-1663900108404-a05e8bf82cda?w=800&q=75',
    description:   'Один из крупнейших исламских университетов мира — 14 факультетов и институты за рубежом.',
    programsCount: 50,
    degrees:       ['bachelor', 'master', 'phd'],
    fullGrant:     true,
  },
]

// Небольшой демонстрационный набор программ — показывает форму будущей
// таблицы `programs`. Не используется как исчерпывающий каталог.
export const GRANT_PROGRAMS_SAMPLE: GrantProgram[] = [
  {
    id: 'sample-1', university_id: 'islamic-university-of-madinah',
    name: 'Шариат', degree: 'bachelor', field: 'Исламские науки',
    gender: 'male', language: 'Арабский', scholarship_type: 'full',
    duration: '4 года', requirements: ['Аттестат о среднем образовании'],
    documents: ['Паспорт', 'Аттестат', 'Фото'], active: true,
  },
  {
    id: 'sample-2', university_id: 'king-saud-university',
    name: 'Computer Science', degree: 'bachelor', field: 'IT и технологии',
    gender: 'both', language: 'Английский / Арабский', scholarship_type: 'full',
    duration: '4 года', requirements: ['Аттестат о среднем образовании'],
    documents: ['Паспорт', 'Аттестат', 'Фото'], active: true,
  },
  {
    id: 'sample-3', university_id: 'king-abdulaziz-university',
    name: 'Business Administration', degree: 'master', field: 'Экономика и бизнес',
    gender: 'both', language: 'Английский / Арабский', scholarship_type: 'full',
    duration: '2 года', requirements: ['Диплом бакалавра'],
    documents: ['Паспорт', 'Диплом', 'Академическая выписка', 'Фото'], active: true,
  },
]

// ──────────────────────────────────────────────────────────────────────────
// Что входит в полный грант
// ──────────────────────────────────────────────────────────────────────────

export const GRANT_BENEFITS = [
  { icon: 'GraduationCap', title: 'Бесплатное обучение', desc: 'Студент освобождается от оплаты обучения в рамках предоставленного полного гранта.' },
  { icon: 'Stamp',         title: 'Учебная виза',        desc: 'В рамках гранта предусмотрена учебная виза для обучения в Саудовской Аравии.' },
  { icon: 'Plane',         title: 'Билет туда и обратно', desc: 'Студент получает авиабилет туда и обратно в соответствии с условиями гранта.' },
  { icon: 'Home',          title: 'Общежитие',            desc: 'Предоставляется место в университетском общежитии.' },
  { icon: 'Wallet',        title: 'Стипендия — 840 SAR',  desc: 'Студент получает ежемесячную стипендию в размере 840 саудовских риялов.', highlight: '840 SAR / месяц' },
  { icon: 'HeartPulse',    title: 'Медицинская страховка', desc: 'В грант входит медицинская страховка.' },
] as const

// ──────────────────────────────────────────────────────────────────────────
// Уровни обучения
// ──────────────────────────────────────────────────────────────────────────

export const DEGREE_LEVELS: { id: DegreeLevel; title: string; desc: string; available: boolean }[] = [
  { id: 'bachelor',       title: 'Бакалавриат',  desc: 'Для поступления после окончания школы.', available: true },
  { id: 'master',         title: 'Магистратура', desc: 'Для выпускников бакалавриата.',           available: true },
  { id: 'phd',            title: 'Докторантура', desc: 'Для кандидатов, соответствующих требованиям PhD-программ.', available: true },
  { id: 'diploma',        title: 'Diploma',        desc: 'Появится позже.', available: false },
  { id: 'higher_diploma', title: 'Higher Diploma', desc: 'Появится позже.', available: false },
]

// ──────────────────────────────────────────────────────────────────────────
// Специальности (по категориям)
// ──────────────────────────────────────────────────────────────────────────

export const SPECIALTY_CATEGORIES = [
  {
    title: 'Исламские науки',
    items: ['Шариат', 'Фикх', 'Коран', 'Хадис', 'Акида', "Да'ва", 'Исламские исследования'],
  },
  {
    title: 'Экономика и бизнес',
    items: ['Экономика', 'Бизнес-администрирование', 'Финансы', 'Бухгалтерский учёт', 'Менеджмент', 'Маркетинг'],
  },
  {
    title: 'IT и технологии',
    items: ['Computer Science', 'Information Technology', 'Data Science', 'Software Engineering', 'Cybersecurity', 'Information Systems'],
  },
  {
    title: 'Инженерия',
    items: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Petroleum Engineering', 'и другие направления'],
  },
  {
    title: 'Естественные науки',
    items: ['Математика', 'Физика', 'Химия', 'Биология', 'Astronomy', 'Medical Physics'],
  },
  {
    title: 'Языки и гуманитарные науки',
    items: ['Арабский язык', 'Английский язык', 'Лингвистика', 'История', 'Литература', 'Перевод', 'Медиа', 'Журналистика'],
  },
  {
    title: 'Другие направления',
    items: ['Список специальностей продолжает пополняться'],
  },
] as const

// ──────────────────────────────────────────────────────────────────────────
// Кому подходит грант
// ──────────────────────────────────────────────────────────────────────────

export const AUDIENCE = [
  'Выпускники школ',
  'Студенты',
  'Выпускники бакалавриата',
  'Кандидаты на магистратуру',
  'Кандидаты на докторантуру',
  'Мужчины',
  'Женщины',
]

// ──────────────────────────────────────────────────────────────────────────
// Документы
// ──────────────────────────────────────────────────────────────────────────

export const DOCUMENTS = [
  { icon: 'BookUser',    title: 'Заграничный паспорт',  desc: 'Действующий паспорт.' },
  { icon: 'GraduationCap', title: 'Документ об образовании', desc: 'Аттестат / диплом.' },
  { icon: 'FileSpreadsheet', title: 'Академическая выписка', desc: 'Transcript / академическая справка.' },
  { icon: 'Camera',      title: 'Фотография',          desc: 'Фото установленного формата.' },
  { icon: 'FilePlus2',   title: 'Дополнительные документы', desc: 'В зависимости от выбранного университета и программы могут потребоваться дополнительные документы.' },
] as const

// ──────────────────────────────────────────────────────────────────────────
// Процесс подачи
// ──────────────────────────────────────────────────────────────────────────

export const PROCESS_STEPS = [
  { step: '01', title: 'Оставьте заявку',       desc: 'Клиент заполняет форму TARJUMAN.' },
  { step: '02', title: 'Проверка',              desc: 'Мы изучаем профиль кандидата и документы.' },
  { step: '03', title: 'Выбор университетов',   desc: 'Подбираются подходящие университеты и факультеты.' },
  { step: '04', title: 'До 25 вариантов',       desc: 'Кандидат формирует список до 25 факультетов в разных университетах.' },
  { step: '05', title: 'Подготовка документов', desc: 'Документы проверяются и подготавливаются к подаче.' },
  { step: '06', title: 'Подача',                desc: 'Заявки направляются через соответствующую систему.' },
  { step: '07', title: 'Ожидание решения',      desc: 'Университеты рассматривают заявки и принимают решения.' },
] as const

// ──────────────────────────────────────────────────────────────────────────
// FAQ
// ──────────────────────────────────────────────────────────────────────────

export const GRANT_FAQ = [
  { q: 'Что входит в полный грант?', a: 'Бесплатное обучение, учебная виза, билет туда и обратно, общежитие, стипендия 840 SAR и медицинская страховка.' },
  { q: 'Сколько факультетов можно выбрать?', a: 'До 25 факультетов в разных университетах Саудовской Аравии.' },
  { q: 'Можно ли выбрать разные университеты?', a: 'Да. Кандидат может выбрать факультеты в разных университетах в пределах доступных вариантов подачи.' },
  { q: 'Можно ли подавать на бакалавриат?', a: 'Да, при соответствии требованиям выбранной программы.' },
  { q: 'Можно ли подавать на магистратуру?', a: 'Да, при соответствии требованиям выбранной программы.' },
  { q: 'Можно ли подавать на PhD?', a: 'Да, при соответствии требованиям конкретной программы.' },
  { q: 'Могут ли подавать девушки?', a: 'Да, если выбранная программа доступна для женщин.' },
  { q: 'Могут ли подавать мужчины?', a: 'Да, если выбранная программа доступна для мужчин.' },
  { q: 'Гарантирует ли подача поступление?', a: 'Нет. Решение принимает соответствующий университет.' },
  { q: 'Можно ли выбрать любую специальность?', a: 'Выбор осуществляется из доступных программ полного гранта и с учётом требований конкретной программы.' },
] as const
