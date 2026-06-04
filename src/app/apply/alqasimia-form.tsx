'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  CheckCircle2, Upload, X, FileText, AlertCircle,
  ChevronRight, ChevronLeft, Send, Zap, GraduationCap
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { PACKAGES } from '@/types'
import type { AppLanguage, ServicePackage } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

// ── Language options ──────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS = [
  { key: 'arabic',   ru: 'Арабский',    uz: 'Arab tili',    en: 'Arabic' },
  { key: 'russian',  ru: 'Русский',     uz: 'Rus tili',     en: 'Russian' },
  { key: 'uzbek',    ru: 'Узбекский',   uz: 'O\'zbek tili', en: 'Uzbek' },
  { key: 'english',  ru: 'Английский',  uz: 'Ingliz tili',  en: 'English' },
  { key: 'turkish',  ru: 'Турецкий',    uz: 'Turk tili',    en: 'Turkish' },
  { key: 'french',   ru: 'Французский', uz: 'Fransuz tili', en: 'French' },
  { key: 'german',   ru: 'Немецкий',    uz: 'Nemis tili',   en: 'German' },
  { key: 'other',    ru: 'Другой',      uz: 'Boshqa',       en: 'Other' },
]

// ── Programs ─────────────────────────────────────────────────────────────────

interface Program {
  ar: string
  ru: string
  uz: string
}

const BACHELOR_PROGRAMS: Program[] = [
  { ar: 'تفسير وعلوم القرآن',        ru: 'Толкование и науки Корана',        uz: 'Tafsir va Qur\'on fanlari' },
  { ar: 'اللغة العربية وآدابها',      ru: 'Арабский язык и литература',       uz: 'Arab tili va adabiyoti' },
  { ar: 'الإعلام',                    ru: 'Медиа и журналистика',              uz: 'Media va jurnalistika' },
  { ar: 'الاقتصاد',                   ru: 'Экономика',                         uz: 'Iqtisodiyot' },
  { ar: 'أصول الدين',                 ru: 'Основы религии (Акыда)',            uz: 'Din asoslari (Aqida)' },
  { ar: 'الفقه وأصوله',               ru: 'Исламское право (Фикх)',            uz: 'Islom huquqi (Fiqh)' },
  { ar: 'الحضارة والتاريخ الإسلامي',  ru: 'Исламская цивилизация и история',   uz: 'Islom sivilizatsiyasi va tarixi' },
  { ar: 'القراءات',                   ru: 'Чтение Корана (Кираат)',            uz: 'Qur\'on qiroati (Qiroat)' },
]

const MASTER_PROGRAMS: Program[] = [
  { ar: 'اللغة العربية وآدابها', ru: 'Арабский язык и литература', uz: 'Arab tili va adabiyoti' },
  { ar: 'الفقه وأصوله',          ru: 'Исламское право (Фикх)',     uz: 'Islom huquqi (Fiqh)' },
  { ar: 'التفسير والحديث',        ru: 'Тафсир и хадисоведение',    uz: 'Tafsir va hadis ilmi' },
]

// ── Document types ────────────────────────────────────────────────────────────

type AQDocType =
  | 'PASSPORT'
  | 'PHOTO'
  | 'BIRTH_CERT'
  | 'NATIONAL_ID'
  | 'CONDUCT_CERT'
  | 'MEDICAL'
  | 'SOCIAL_MEDIA'
  | 'DIPLOMA'
  | 'GRADE9'
  | 'GRADE10'
  | 'GRADE11'
  | 'IELTS'
  | 'BACHELOR_DIPLOMA'
  | 'BACHELOR_TRANSCRIPT'

const DOC_LABELS: Record<AQDocType, { ru: string; en: string }> = {
  PASSPORT:            { ru: 'Действующий загранпаспорт',              en: 'Valid passport' },
  PHOTO:               { ru: 'Фото 4×3',                                en: 'Photo 4×3' },
  BIRTH_CERT:          { ru: 'Свидетельство о рождении',                en: 'Birth certificate' },
  NATIONAL_ID:         { ru: 'Нац. удостоверение личности',             en: 'National ID' },
  CONDUCT_CERT:        { ru: 'Справка о хорошем поведении',             en: 'Good conduct certificate' },
  MEDICAL:             { ru: 'Медицинская справка',                     en: 'Medical certificate' },
  SOCIAL_MEDIA:        { ru: 'Скриншот подписки Instagram/Facebook',    en: 'Instagram/Facebook subscription screenshot' },
  DIPLOMA:             { ru: 'Аттестат о среднем образовании',          en: 'School diploma' },
  GRADE9:              { ru: 'Табель за 9 класс',                       en: 'Grade 9 transcript' },
  GRADE10:             { ru: 'Табель за 10 класс',                      en: 'Grade 10 transcript' },
  GRADE11:             { ru: 'Табель за 11 класс',                      en: 'Grade 11 transcript' },
  IELTS:               { ru: 'IELTS / TOEFL (если есть)',               en: 'IELTS / TOEFL (if available)' },
  BACHELOR_DIPLOMA:    { ru: 'Диплом бакалавра',                        en: 'Bachelor diploma' },
  BACHELOR_TRANSCRIPT: { ru: 'Академическая выписка (оценки и предметы)', en: 'Academic transcript (grades & courses)' },
}

const REQUIRED_DOCS: AQDocType[] = [
  'PASSPORT', 'PHOTO', 'BIRTH_CERT', 'NATIONAL_ID',
  'CONDUCT_CERT', 'MEDICAL', 'SOCIAL_MEDIA',
  'DIPLOMA', 'GRADE9', 'GRADE10', 'GRADE11',
]
const OPTIONAL_DOCS: AQDocType[] = ['IELTS']
const MASTER_DOCS: AQDocType[] = ['BACHELOR_DIPLOMA', 'BACHELOR_TRANSCRIPT']

interface AQDoc { type: AQDocType; file: File }

// ── Mini DropZone ─────────────────────────────────────────────────────────────

function DocZone({ docType, label, onUpload, uploaded, onRemove }: {
  docType:  AQDocType
  label:    string
  onUpload: (type: AQDocType, file: File) => void
  uploaded?: AQDoc
  onRemove: (type: AQDocType) => void
}) {
  const onDrop = useCallback((files: File[]) => {
    if (files[0]) onUpload(docType, files[0])
  }, [docType, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  if (uploaded) {
    return (
      <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl">
        <FileText className="w-5 h-5 text-brand-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink truncate">{label}</p>
          <p className="text-xs text-muted truncate">{uploaded.file.name}</p>
        </div>
        <button onClick={() => onRemove(docType)} className="p-1 hover:bg-brand-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-muted" />
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all text-center',
        isDragActive ? 'border-brand-400 bg-brand-50' : 'border-border hover:border-brand-300 hover:bg-brand-50/50'
      )}
    >
      <input {...getInputProps()} />
      <Upload className="w-4 h-4 text-muted mx-auto mb-1" />
      <p className="text-sm text-muted">{label}</p>
      <p className="text-xs text-muted/60 mt-0.5">PDF, JPG, PNG — max 10MB</p>
    </div>
  )
}

// ── Countries ─────────────────────────────────────────────────────────────────

const ALL_COUNTRIES = [
  'Австралия','Австрия','Азербайджан','Албания','Алжир','Ангола','Андорра',
  'Антигуа и Барбуда','Аргентина','Армения','Афганистан','Багамы','Бангладеш',
  'Барбадос','Бахрейн','Беларусь','Белиз','Бельгия','Бенин','Болгария',
  'Боливия','Босния и Герцеговина','Ботсвана','Бразилия','Бруней','Буркина-Фасо',
  'Бурунди','Бутан','Вануату','Великобритания','Венгрия','Венесуэла','Вьетнам',
  'Габон','Гаити','Гайана','Гамбия','Гана','Гватемала','Гвинея','Гвинея-Бисау',
  'Германия','Гондурас','Гренада','Греция','Грузия','Дания','Джибути',
  'Доминика','Доминиканская Республика','Египет','Замбия','Зимбабве','Израиль',
  'Индия','Индонезия','Иордания','Ирак','Иран','Ирландия','Исландия','Испания',
  'Италия','Йемен','Кабо-Верде','Казахстан','Камбоджа','Камерун','Канада',
  'Катар','Кения','Кипр','Кирибати','Китай','Колумбия','Коморы','Конго',
  'Коста-Рика','Кот-д\'Ивуар','Куба','Кувейт','Кыргызстан','Лаос','Латвия',
  'Лесото','Либерия','Ливан','Ливия','Литва','Лихтенштейн','Люксембург',
  'Маврикий','Мавритания','Мадагаскар','Малави','Малайзия','Мальдивы','Мали',
  'Мальта','Марокко','Маршалловы Острова','Мексика','Микронезия','Мозамбик',
  'Молдова','Монако','Монголия','Мьянма','Намибия','Науру','Непал','Нигер',
  'Нигерия','Нидерланды','Никарагуа','Новая Зеландия','Норвегия','ОАЭ',
  'Оман','Пакистан','Палау','Палестина','Панама','Папуа — Новая Гвинея',
  'Парагвай','Перу','Польша','Португалия','Россия','Руанда','Румыния',
  'Сальвадор','Самоа','Сан-Марино','Сан-Томе и Принсипи','Саудовская Аравия',
  'Северная Корея','Северная Македония','Сенегал','Сент-Винсент и Гренадины',
  'Сент-Китс и Невис','Сент-Люсия','Сербия','Сингапур','Сирия','Словакия',
  'Словения','Соломоновы Острова','Сомали','Судан','Суринам','Сьерра-Леоне',
  'Таджикистан','Таиланд','Танзания','Тимор-Лесте','Того','Тонга',
  'Тринидад и Тобаго','Тувалу','Тунис','Туркменистан','Турция','Уганда',
  'Узбекистан','Украина','Уругвай','Фиджи','Филиппины','Финляндия','Франция',
  'Хорватия','Центральноафриканская Республика','Чад','Черногория','Чехия',
  'Чили','Швейцария','Швеция','Шри-Ланка','Эквадор','Экваториальная Гвинея',
  'Эритрея','Эсватини','Эстония','Эфиопия','Южная Корея','Южная Осетия',
  'Южный Судан','Ямайка','Япония',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

const INPUT = "w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white"
const DATE_INPUT = "w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white"
const SELECT = "w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white appearance-none"

// ── Helpers (outside component to avoid focus loss on re-render) ──────────────

function YesNo({ value, onChange, lang }: { value: string; onChange: (v: string) => void; lang: string }) {
  const ru = lang === 'ru'; const uz = lang === 'uz'
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={SELECT}>
      <option value="">{ru ? 'Выберите...' : uz ? 'Tanlang...' : 'Select...'}</option>
      <option value="yes">{ru ? 'Да' : uz ? 'Ha' : 'Yes'}</option>
      <option value="no">{ru ? 'Нет' : uz ? 'Yo\'q' : 'No'}</option>
    </select>
  )
}

function SectionHeader({ title, optional, lang }: { title: string; optional?: boolean; lang: string }) {
  const ru = lang === 'ru'; const uz = lang === 'uz'
  return (
    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</p>
      {optional && <span className="text-[11px] text-muted bg-gray-100 px-2 py-0.5 rounded-full">{ru ? 'Необязательно' : uz ? 'Ixtiyoriy' : 'Optional'}</span>}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">{children}</div>
}

function NavButtons({ onBack, onNext, lang }: { onBack: () => void; onNext: () => void; lang: string }) {
  const ru = lang === 'ru'; const uz = lang === 'uz'
  return (
    <div className="flex justify-between mt-8">
      <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
        <ChevronLeft className="w-4 h-4" /> {ru ? 'Назад' : uz ? 'Orqaga' : 'Back'}
      </button>
      <button onClick={onNext} className="flex items-center gap-2 px-8 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm">
        {ru ? 'Далее' : uz ? 'Keyingi' : 'Next'} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface AlQasimiaFormProps {
  degreeType: 'bachelor' | 'master'
  lang: AppLanguage
  user: any
  onBack: () => void
}

export function AlQasimiaForm({ degreeType, lang, user, onBack }: AlQasimiaFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [appId, setAppId] = useState<string | null>(null)
  const [successModal, setSuccessModal] = useState(false)
  const [pkg, setPkg] = useState<ServicePackage>('STANDARD')
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [docs, setDocs] = useState<Partial<Record<AQDocType, AQDoc>>>({})

  const ru = lang === 'ru'
  const uz = lang === 'uz'
  const t = (ruText: string, uzText: string, enText: string) =>
    ru ? ruText : uz ? uzText : enText

  const [form, setForm] = useState({
    // Personal
    full_name: '', citizenship: '', prev_citizenship: '',
    passport_number: '', passport_issued: '', passport_expiry: '',
    date_of_birth: '', country_of_birth: '', city_of_birth: '',
    gender: '', religion: '', marital_status: '',
    lives_in_uae: '', lived_in_uae: '', is_working: '',
    has_disability: '', covid_vaccinated: '',
    // Contact
    national_id_number: '', email: '', mobile: '', whatsapp: '',
    home_phone: '', skype: '', facebook_contact: '',
    instagram_contact: '', twitter: '', nearest_airport: '',
    // Father
    father_name: '', father_phone: '', father_email: '', father_work: '',
    // Mother
    mother_name: '', mother_phone: '', mother_email: '', mother_work: '',
    // Relative
    relative_name: '', relative_phone: '', relative_email: '', relative_work: '',
    // Education
    school_type: '', gpa: '', school_name: '', school_country: '',
    school_city: '', school_language: '', graduation_date: '',
    // Languages
    known_languages: '', arabic_years: '', arabic_institute: '',
    // Master — bachelor degree
    bachelor_university: '', bachelor_public_private: '', bachelor_country: '',
    bachelor_city: '', bachelor_year: '', bachelor_major: '',
    bachelor_duration: '', bachelor_language: '', bachelor_gpa: '',
    bachelor_grade: '', bachelor_equivalency: '',
  })

  const setF = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const programs = degreeType === 'bachelor' ? BACHELOR_PROGRAMS : MASTER_PROGRAMS

  // Steps: 1=Programs, 2=Personal, 3=Contacts, 4=Education, 5=Docs, 6=Package, 7=Review
  const TOTAL = 7
  const STEP_NAMES = ru
    ? ['Личные данные', 'Контакты и семья', 'Образование', 'Программы', 'Документы', 'Пакет', 'Проверка']
    : uz
    ? ['Shaxsiy ma\'lumot', 'Aloqa va oila', 'Ta\'lim', 'Yo\'nalishlar', 'Hujjatlar', 'Paket', 'Tekshirish']
    : ['Personal data', 'Contacts & family', 'Education', 'Programs', 'Documents', 'Package', 'Review']

  // ── Validators ──────────────────────────────────────────────────────────────

  const validatePersonal = () => {
    const required = [
      form.full_name, form.citizenship, form.passport_number,
      form.passport_issued, form.passport_expiry,
      form.date_of_birth, form.country_of_birth, form.city_of_birth,
      form.gender, form.religion, form.marital_status,
      form.lives_in_uae, form.covid_vaccinated,
    ]
    if (required.some(v => !v.trim())) {
      toast.error(t('Заполните все обязательные поля', 'Barcha majburiy maydonlarni to\'ldiring', 'Fill all required fields'))
      return false
    }
    return true
  }

  const validateContacts = () => {
    // Facebook, Instagram, Twitter/X — optional
    const required = [
      form.email, form.mobile, form.whatsapp, form.home_phone,
      form.nearest_airport,
      form.father_name, form.father_phone,
      form.mother_name, form.mother_phone,
    ]
    if (required.some(v => !v.trim())) {
      toast.error(t(
        'Заполните все обязательные поля (если нет — напишите «Нет»)',
        'Barcha majburiy maydonlarni to\'ldiring (yo\'q bo\'lsa — «Yo\'q» deb yozing)',
        'Fill all required fields (if none — write "No")'
      ))
      return false
    }
    return true
  }

  const validateEducation = () => {
    const required = [
      form.school_type, form.school_name, form.school_country,
      form.school_city, form.school_language, form.graduation_date, form.gpa,
      form.known_languages, form.arabic_years,
    ]
    if (required.some(v => !v.trim())) {
      toast.error(t('Заполните все обязательные поля образования', 'Ta\'lim bo\'yicha barcha maydonlarni to\'ldiring', 'Fill all required education fields'))
      return false
    }
    return true
  }

  const validatePrograms = () => {
    if (degreeType === 'master') {
      if (selectedPrograms.length < 1) {
        toast.error(t('Выберите специальность', 'Yo\'nalish tanlang', 'Select a program'))
        return false
      }
    } else {
      if (selectedPrograms.length < 3) {
        toast.error(t('Выберите 3 специальности', 'Kamida 3 ta yo\'nalish tanlang', 'Select 3 programs'))
        return false
      }
    }
    if (degreeType === 'master' && !form.bachelor_university) {
      toast.error(t('Укажите данные о дипломе бакалавра', 'Bakalavr diplomi ma\'lumotlarini kiriting', 'Enter bachelor degree info'))
      return false
    }
    return true
  }

  const validateDocs = () => {
    const required = [...REQUIRED_DOCS, ...(degreeType === 'master' ? MASTER_DOCS : [])]
    const missing = required.filter(d => !docs[d])
    if (missing.length > 0) {
      const names = missing.slice(0, 2).map(d => DOC_LABELS[d].ru).join(', ')
      toast.error(
        ru ? `Загрузите обязательные документы: ${names}${missing.length > 2 ? '...' : ''}` :
        uz ? `Majburiy hujjatlarni yuklang: ${names}${missing.length > 2 ? '...' : ''}` :
             `Upload required documents`
      )
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && !validatePersonal()) return
    if (step === 2 && !validateContacts()) return
    if (step === 3 && !validateEducation()) return
    if (step === 4 && !validatePrograms()) return
    if (step === 5 && !validateDocs()) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDocUpload = (type: AQDocType, file: File) => {
    setDocs(d => ({ ...d, [type]: { type, file } }))
  }
  const handleDocRemove = (type: AQDocType) => {
    setDocs(d => { const nd = { ...d }; delete nd[type]; return nd })
  }

  const progLabel = (prog: Program) => ru ? prog.ru : uz ? prog.uz : prog.ar
  const progKey   = (prog: Program) => prog.ar // always store Arabic as canonical key

  const toggleProgram = (prog: Program) => {
    const key = progKey(prog)
    if (degreeType === 'master') {
      // Master: only 1 selection allowed — clicking another replaces current
      setSelectedPrograms(selectedPrograms.includes(key) ? [] : [key])
    } else {
      // Bachelor: up to 3
      if (selectedPrograms.includes(key)) {
        setSelectedPrograms(p => p.filter(x => x !== key))
      } else {
        if (selectedPrograms.length >= 3) {
          toast.error(t('Максимум 3 специальности', 'Maksimal 3 ta yo\'nalish', 'Maximum 3 programs'))
          return
        }
        setSelectedPrograms(p => [...p, key])
      }
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    try {
      const extraData = {
        university: 'Al Qasimia University',
        degree_type: degreeType,
        programs: selectedPrograms,
        passport_number: form.passport_number,
        passport_issued: form.passport_issued,
        passport_expiry: form.passport_expiry,
        country_of_birth: form.country_of_birth,
        city_of_birth: form.city_of_birth,
        prev_citizenship: form.prev_citizenship,
        religion: form.religion,
        lives_in_uae: form.lives_in_uae,
        lived_in_uae: form.lived_in_uae,
        is_working: form.is_working,
        has_disability: form.has_disability,
        covid_vaccinated: form.covid_vaccinated,
        national_id_number: form.national_id_number,
        whatsapp: form.whatsapp,
        home_phone: form.home_phone,
        skype: form.skype,
        facebook_contact: form.facebook_contact,
        instagram_contact: form.instagram_contact,
        twitter: form.twitter,
        nearest_airport: form.nearest_airport,
        father:   { name: form.father_name,   phone: form.father_phone,   email: form.father_email,   work: form.father_work },
        mother:   { name: form.mother_name,   phone: form.mother_phone,   email: form.mother_email,   work: form.mother_work },
        relative: { name: form.relative_name, phone: form.relative_phone, email: form.relative_email, work: form.relative_work },
        school_type: form.school_type, gpa: form.gpa,
        school_name: form.school_name, school_country: form.school_country,
        school_city: form.school_city, school_language: form.school_language,
        graduation_date: form.graduation_date,
        known_languages: form.known_languages,
        arabic_years: form.arabic_years, arabic_institute: form.arabic_institute,
        ...(degreeType === 'master' ? {
          bachelor_university: form.bachelor_university,
          bachelor_public_private: form.bachelor_public_private,
          bachelor_country: form.bachelor_country,
          bachelor_city: form.bachelor_city,
          bachelor_year: form.bachelor_year,
          bachelor_major: form.bachelor_major,
          bachelor_duration: form.bachelor_duration,
          bachelor_language: form.bachelor_language,
          bachelor_gpa: form.bachelor_gpa,
          bachelor_grade: form.bachelor_grade,
          bachelor_equivalency: form.bachelor_equivalency,
        } : {}),
      }

      const { data: app, error: appErr } = await supabase
        .from('applications')
        .insert({
          user_id:            user.id,
          country:            'AE',
          service_package:    pkg,
          status:             'REGISTERED',
          full_name:          form.full_name,
          citizenship:        form.citizenship,
          date_of_birth:      form.date_of_birth || null,
          phone:              form.mobile,
          telegram:           null,
          education_level:    degreeType,
          gender:             form.gender,
          marital_status:     form.marital_status,
          arabic_level:       null,
          english_level:      null,
          guardian_name:      form.father_name || null,
          guardian_phone:     form.father_phone || null,
          guardian_email:     form.father_email || null,
          selected_faculties: selectedPrograms.map(p => ({
            university_id:   'alqasimia',
            university_name: 'Al Qasimia University',
            faculty:         p,
          })),
          extra_data: extraData,
        })
        .select()
        .single()

      if (appErr) throw appErr
      setAppId(app.id)

      // Upload docs
      const uploads = (Object.entries(docs) as [AQDocType, AQDoc | undefined][])
        .filter(([, d]) => d != null)
        .map(async ([type, doc]) => {
          try {
            const ext  = doc!.file.name.split('.').pop()
            const path = `${user.id}/${app.id}/${type}_${uuidv4()}.${ext}`
            const { error: uploadErr } = await supabase.storage.from('documents').upload(path, doc!.file, { upsert: true })
            if (uploadErr) { console.error('Upload error', type, uploadErr); return }
            const { error: insertErr } = await supabase.from('documents').insert({
              application_id: app.id,
              user_id:        user.id,
              type,
              file_name:      doc!.file.name,
              file_path:      path,
              file_size:      doc!.file.size,
              mime_type:      doc!.file.type,
            })
            if (insertErr) console.error('Insert error', type, insertErr)
          } catch (e) { console.error('Doc error', type, e) }
        })
      await Promise.allSettled(uploads)

      // Payment redirect
      const { data: { session: sess } } = await supabase.auth.getSession()
      const res = await fetch('/api/payments/create-checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sess?.access_token ?? ''}` },
        body:    JSON.stringify({ applicationId: app.id, package: pkg }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
      else setSuccessModal(true)
    } catch (err: any) {
      toast.error(err.message || 'Error')
      setLoading(false)
    }
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1B4332] rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted leading-none">{t('Заявка в', 'Ariza:', 'Application to')}</p>
              <p className="text-sm font-bold text-ink leading-tight">Al Qasimia University</p>
            </div>
          </div>

          {/* Steps — desktop */}
          <div className="hidden md:flex items-center gap-0">
            {STEP_NAMES.map((s, i) => {
              const done    = i + 1 < step
              const current = i + 1 === step
              return (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                      done    ? 'bg-[#1B4332] text-white' :
                      current ? 'bg-[#C9922A] text-white ring-4 ring-[#C9922A]/20' :
                                'bg-gray-100 text-gray-400'
                    )}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className={cn(
                      'text-[10px] font-medium whitespace-nowrap',
                      current ? 'text-[#C9922A]' : done ? 'text-[#1B4332]' : 'text-gray-400'
                    )}>{s}</span>
                  </div>
                  {i < TOTAL - 1 && (
                    <div className={cn('w-6 h-0.5 mx-1 mb-4 rounded-full transition-all', done ? 'bg-[#1B4332]' : 'bg-gray-200')} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">{step}/{TOTAL}</span>
            <span className="text-sm text-muted">{STEP_NAMES[step - 1]}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-[#1B4332] to-[#C9922A]"
            animate={{ width: `${((step - 1) / (TOTAL - 1)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Personal data ── */}
          {step === 1 && (
            <motion.div key="s1personal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{t(`Шаг 1 из ${TOTAL}`, `1-qadam ${TOTAL} tadan`, `Step 1 of ${TOTAL}`)}</p>
                <h1 className="text-3xl font-bold text-ink">{t('Личные данные', 'Shaxsiy ma\'lumot', 'Personal data')}</h1>
                <p className="text-muted mt-1 text-sm">{t('Данные из загранпаспорта и личные сведения', 'Pasport va shaxsiy ma\'lumotlar', 'Passport data and personal information')}</p>
              </div>

              {/* Passport info */}
              <Card>
                <SectionHeader title={t('Паспортные данные', 'Pasport ma\'lumotlari', 'Passport information')} lang={lang} />
                <div className="p-6 space-y-4">
                  <Field label={t('Полное имя по загранпаспорту', 'To\'liq ism (pasport bo\'yicha)', 'Full name (as in passport)')} required>
                    <input value={form.full_name} onChange={e => setF('full_name', e.target.value)}
                      placeholder={ru ? 'Иванов Иван Иванович' : uz ? 'Ivanov Ivan Ivanovich' : 'John Michael Doe'} className={INPUT} />
                  </Field>
                  <div className="space-y-4">
                    <Field label={t('Текущее гражданство', 'Hozirgi fuqarolik', 'Current citizenship')} required>
                      <select value={form.citizenship} onChange={e => setF('citizenship', e.target.value)} className={SELECT}>
                        <option value="">{t('Страна...', 'Mamlakat...', 'Country...')}</option>
                        {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label={t('Предыдущее гражданство', 'Avvalgi fuqarolik', 'Previous citizenship')}>
                      <input value={form.prev_citizenship} onChange={e => setF('prev_citizenship', e.target.value)}
                        placeholder={ru ? 'Если было' : uz ? 'Agar bo\'lgan bo\'lsa' : 'If applicable'} className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Номер паспорта', 'Pasport raqami', 'Passport number')} required>
                      <input value={form.passport_number} onChange={e => setF('passport_number', e.target.value)}
                        placeholder="AA1234567" className={INPUT} />
                    </Field>
                    <Field label={t('Место выдачи паспорта', 'Pasport berilgan joy', 'Place of issue')} required>
                      <input value={form.passport_issued} onChange={e => setF('passport_issued', e.target.value)}
                        placeholder={ru ? 'Город, страна' : uz ? 'Shahar, mamlakat' : 'City, country'} className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Срок действия паспорта', 'Pasport muddati', 'Passport expiry')} required>
                      <input type="text" inputMode="numeric" placeholder="ДД.ММ.ГГГГ" value={form.passport_expiry} onChange={e => setF('passport_expiry', e.target.value)} className={DATE_INPUT} />
                    </Field>
                    <Field label={t('Номер нац. удостоверения (ID)', 'Milliy ID raqami', 'National ID number')}>
                      <input value={form.national_id_number} onChange={e => setF('national_id_number', e.target.value)}
                        placeholder={t('Номер ID (если есть)', 'ID raqami (mavjud bo\'lsa)', 'ID number (if applicable)')} className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Дата рождения', 'Tug\'ilgan sana', 'Date of birth')} required>
                      <input type="text" inputMode="numeric" placeholder="ДД.ММ.ГГГГ" value={form.date_of_birth} onChange={e => setF('date_of_birth', e.target.value)} className={DATE_INPUT} />
                    </Field>
                    <Field label={t('Страна рождения', 'Tug\'ilgan mamlakat', 'Country of birth')} required>
                      <input value={form.country_of_birth} onChange={e => setF('country_of_birth', e.target.value)}
                        placeholder={t('Страна', 'Mamlakat', 'Country')} className={INPUT} />
                    </Field>
                    <Field label={t('Город рождения', 'Tug\'ilgan shahar', 'City of birth')} required>
                      <input value={form.city_of_birth} onChange={e => setF('city_of_birth', e.target.value)}
                        placeholder={t('Город', 'Shahar', 'City')} className={INPUT} />
                    </Field>
                  </div>
                </div>
              </Card>

              {/* Personal info */}
              <Card>
                <SectionHeader title={t('Личные сведения', 'Shaxsiy ma\'lumotlar', 'Personal information')} lang={lang} />
                <div className="p-6 space-y-4">
                  <div className="space-y-4">
                    <Field label={t('Пол', 'Jinsi', 'Gender')} required>
                      <select value={form.gender} onChange={e => setF('gender', e.target.value)} className={SELECT}>
                        <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                        <option value="male">{t('Мужчина', 'Erkak', 'Male')}</option>
                        <option value="female">{t('Женщина', 'Ayol', 'Female')}</option>
                      </select>
                    </Field>
                    <Field label={t('Религия', 'Dini', 'Religion')} required>
                      <select value={form.religion} onChange={e => setF('religion', e.target.value)} className={SELECT}>
                        <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                        <option value="islam">{t('Ислам', 'Islom', 'Islam')}</option>
                        <option value="other">{t('Другое', 'Boshqa', 'Other')}</option>
                      </select>
                    </Field>
                  </div>
                  <Field label={t('Семейное положение', 'Oilaviy holati', 'Marital status')} required>
                    <select value={form.marital_status} onChange={e => setF('marital_status', e.target.value)} className={SELECT}>
                      <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                      <option value="single">{t('Не в браке', 'Turmush qurmagan', 'Single')}</option>
                      <option value="married">{t('В браке', 'Turmush qurgan', 'Married')}</option>
                      <option value="divorced">{t('Разведён(а)', 'Ajrashgan', 'Divorced')}</option>
                      <option value="widowed">{t('Вдовец/Вдова', 'Beva', 'Widowed')}</option>
                    </select>
                  </Field>
                </div>
              </Card>

              {/* UAE & other status */}
              <Card>
                <SectionHeader title={t('Дополнительные сведения', 'Qo\'shimcha ma\'lumotlar', 'Additional details')} lang={lang} />
                <div className="p-6 space-y-4">
                  <div className="space-y-4">
                    <Field label={t('Проживаете ли в ОАЭ?', 'BAA da yashaysizmi?', 'Currently living in UAE?')} required>
                      <YesNo value={form.lives_in_uae} onChange={v => setF('lives_in_uae', v)} lang={lang} />
                    </Field>
                    <Field label={t('Проживали ли ранее в ОАЭ?', 'Avval BAA da yashagansizmi?', 'Previously lived in UAE?')}>
                      <YesNo value={form.lived_in_uae} onChange={v => setF('lived_in_uae', v)} lang={lang} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Работаете ли вы?', 'Ishlaysizmi?', 'Are you employed?')}>
                      <YesNo value={form.is_working} onChange={v => setF('is_working', v)} lang={lang} />
                    </Field>
                    <Field label={t('Есть ли инвалидность?', 'Nogironligingiz bormi?', 'Do you have a disability?')}>
                      <YesNo value={form.has_disability} onChange={v => setF('has_disability', v)} lang={lang} />
                    </Field>
                  </div>
                  <Field label={t('Получены ли 2 дозы вакцины COVID-19?', 'COVID-19 vaksinasining 2 dozasini oldingizmi?', 'Have you received 2 COVID-19 vaccine doses?')} required>
                    <YesNo value={form.covid_vaccinated} onChange={v => setF('covid_vaccinated', v)} lang={lang} />
                  </Field>
                </div>
              </Card>

              <div className="flex justify-between mt-2">
                <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-4 h-4" /> {ru ? 'Назад' : uz ? 'Orqaga' : 'Back'}
                </button>
                <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm">
                  {ru ? 'Далее' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Contacts + Family ── */}
          {step === 2 && (
            <motion.div key="s2new" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{t(`Шаг 2 из ${TOTAL}`, `2-qadam ${TOTAL} tadan`, `Step 2 of ${TOTAL}`)}</p>
                <h1 className="text-3xl font-bold text-ink">{t('Контакты и семья', 'Aloqa va oila', 'Contacts & family')}</h1>
              </div>

              {/* Contacts */}
              <Card>
                <SectionHeader title={t('Контактные данные', 'Aloqa ma\'lumotlari', 'Contact details')} lang={lang} />
                <div className="p-6 space-y-4">
                  <div className="space-y-4">
                    <Field label="Email" required>
                      <input type="email" value={form.email} onChange={e => setF('email', e.target.value)}
                        placeholder="example@mail.com" className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Мобильный телефон', 'Mobil telefon', 'Mobile phone')} required>
                      <input type="tel" value={form.mobile} onChange={e => setF('mobile', e.target.value)}
                        placeholder="+998901234567" className={INPUT} />
                    </Field>
                    <Field label="WhatsApp" required>
                      <input type="tel" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)}
                        placeholder='+998...' className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Домашний телефон', 'Uy telefoni', 'Home phone')} required>
                      <input type="tel" value={form.home_phone} onChange={e => setF('home_phone', e.target.value)}
                        placeholder='+998...' className={INPUT} />
                    </Field>
                    <Field label="Skype">
                      <input value={form.skype} onChange={e => setF('skype', e.target.value)}
                        placeholder={'Skype'} className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label="Facebook">
                      <input value={form.facebook_contact} onChange={e => setF('facebook_contact', e.target.value)}
                        placeholder={'facebook.com/...'} className={INPUT} />
                    </Field>
                    <Field label="Instagram">
                      <input value={form.instagram_contact} onChange={e => setF('instagram_contact', e.target.value)}
                        placeholder={'@username'} className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label="Twitter / X">
                      <input value={form.twitter} onChange={e => setF('twitter', e.target.value)}
                        placeholder={'@username'} className={INPUT} />
                    </Field>
                    <Field label={t('Ближайший аэропорт', 'Eng yaqin xalqaro aeroport', 'Nearest international airport')} required>
                      <input value={form.nearest_airport} onChange={e => setF('nearest_airport', e.target.value)}
                        placeholder={ru ? 'Ташкент (TAS)' : uz ? 'Toshkent (TAS)' : 'Tashkent (TAS)'} className={INPUT} />
                    </Field>
                  </div>
                </div>
              </Card>

              {/* Father */}
              <Card>
                <SectionHeader title={t('Данные отца', 'Otasi haqida', 'Father\'s information')} lang={lang} />
                <div className="p-6 space-y-4">
                  <Field label={t('ФИО', 'To\'liq ism', 'Full name')} required>
                    <input value={form.father_name} onChange={e => setF('father_name', e.target.value)} className={INPUT} />
                  </Field>
                  <div className="space-y-4">
                    <Field label={t('Телефон', 'Telefon', 'Phone')} required>
                      <input type="tel" value={form.father_phone} onChange={e => setF('father_phone', e.target.value)}
                        placeholder='+998...' className={INPUT} />
                    </Field>
                    <Field label="Email">
                      <input type="email" value={form.father_email} onChange={e => setF('father_email', e.target.value)}
                        placeholder={ru ? 'email или «Нет»' : uz ? 'email yoki «Yo\'q»' : 'email or "No"'} className={INPUT} />
                    </Field>
                  </div>
                  <Field label={t('Место работы', 'Ish joyi', 'Place of work')}>
                    <input value={form.father_work} onChange={e => setF('father_work', e.target.value)}
                      placeholder={ru ? 'Организация или «Нет»' : uz ? 'Tashkilot yoki «Yo\'q»' : 'Organization or "No"'} className={INPUT} />
                  </Field>
                </div>
              </Card>

              {/* Mother */}
              <Card>
                <SectionHeader title={t('Данные матери', 'Onasi haqida', 'Mother\'s information')} lang={lang} />
                <div className="p-6 space-y-4">
                  <Field label={t('ФИО', 'To\'liq ism', 'Full name')} required>
                    <input value={form.mother_name} onChange={e => setF('mother_name', e.target.value)} className={INPUT} />
                  </Field>
                  <div className="space-y-4">
                    <Field label={t('Телефон', 'Telefon', 'Phone')} required>
                      <input type="tel" value={form.mother_phone} onChange={e => setF('mother_phone', e.target.value)}
                        placeholder='+998...' className={INPUT} />
                    </Field>
                    <Field label="Email">
                      <input type="email" value={form.mother_email} onChange={e => setF('mother_email', e.target.value)}
                        placeholder={ru ? 'email или «Нет»' : uz ? 'email yoki «Yo\'q»' : 'email or "No"'} className={INPUT} />
                    </Field>
                  </div>
                  <Field label={t('Место работы', 'Ish joyi', 'Place of work')}>
                    <input value={form.mother_work} onChange={e => setF('mother_work', e.target.value)}
                      placeholder={ru ? 'Организация или «Нет»' : uz ? 'Tashkilot yoki «Yo\'q»' : 'Organization or "No"'} className={INPUT} />
                  </Field>
                </div>
              </Card>

              {/* Relative */}
              <Card>
                <SectionHeader title={t('Данные родственника', 'Qarindosh haqida', 'Relative\'s information')} optional lang={lang} />
                <div className="p-6 space-y-4">
                  <Field label={t('ФИО', 'To\'liq ism', 'Full name')}>
                    <input value={form.relative_name} onChange={e => setF('relative_name', e.target.value)} className={INPUT} />
                  </Field>
                  <div className="space-y-4">
                    <Field label={t('Телефон', 'Telefon', 'Phone')}>
                      <input type="tel" value={form.relative_phone} onChange={e => setF('relative_phone', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label="Email">
                      <input type="email" value={form.relative_email} onChange={e => setF('relative_email', e.target.value)} className={INPUT} />
                    </Field>
                  </div>
                  <Field label={t('Место работы', 'Ish joyi', 'Place of work')}>
                    <input value={form.relative_work} onChange={e => setF('relative_work', e.target.value)} className={INPUT} />
                  </Field>
                </div>
              </Card>

              <NavButtons onBack={() => setStep(1)} onNext={handleNext} lang={lang} />
            </motion.div>
          )}

          {/* ── STEP 3: Education ── */}
          {step === 3 && (
            <motion.div key="s3new" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{t(`Шаг 3 из ${TOTAL}`, `3-qadam ${TOTAL} tadan`, `Step 3 of ${TOTAL}`)}</p>
                <h1 className="text-3xl font-bold text-ink">{t('Образование', 'Ta\'lim', 'Education')}</h1>
              </div>

              <Card>
                <SectionHeader title={t('Среднее образование', 'O\'rta ta\'lim', 'Secondary education')} lang={lang} />
                <div className="p-6 space-y-4">
                  <Field label={t('Тип школы', 'Maktab turi', 'School type')} required>
                    <select value={form.school_type} onChange={e => setF('school_type', e.target.value)} className={SELECT}>
                      <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                      <option value="public">{t('Государственная', 'Davlat', 'Public')}</option>
                      <option value="private">{t('Частная', 'Xususiy', 'Private')}</option>
                      <option value="semi_public">{t('Полугосударственная', 'Yarim davlat', 'Semi-public')}</option>
                      <option value="other">{t('Другая', 'Boshqa', 'Other')}</option>
                    </select>
                  </Field>
                  <div className="space-y-4">
                    <Field label={t('Название школы', 'Maktab nomi', 'School name')} required>
                      <input value={form.school_name} onChange={e => setF('school_name', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label={t('Средний балл (GPA)', 'O\'rtacha ball (GPA)', 'GPA / average grade')} required>
                      <input value={form.gpa} onChange={e => setF('gpa', e.target.value)}
                        placeholder="4.5 / 5.0" className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Страна', 'Mamlakat', 'Country')} required>
                      <input value={form.school_country} onChange={e => setF('school_country', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label={t('Город', 'Shahar', 'City')} required>
                      <input value={form.school_city} onChange={e => setF('school_city', e.target.value)} className={INPUT} />
                    </Field>
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Язык обучения', 'O\'qitish tili', 'Language of instruction')} required>
                      <select value={form.school_language} onChange={e => setF('school_language', e.target.value)} className={SELECT}>
                        <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                        {['Арабский','Русский','Узбекский','Казахский','Таджикский','Английский','Другой'].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label={t('Дата окончания', 'Tugatish sanasi', 'Graduation date')} required>
                      <input type="text" inputMode="numeric" placeholder="ДД.ММ.ГГГГ" value={form.graduation_date} onChange={e => setF('graduation_date', e.target.value)} className={DATE_INPUT} />
                    </Field>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionHeader title={t('Знание языков', 'Til bilimlari', 'Languages')} lang={lang} />
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('Какие языки знаете?', 'Qanday tillarni bilasiz?', 'Languages you know')}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_OPTIONS.map(opt => {
                        const label = ru ? opt.ru : uz ? opt.uz : opt.en
                        const selected = form.known_languages.split(',').map(s => s.trim()).filter(Boolean).includes(opt.key)
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              const current = form.known_languages.split(',').map(s => s.trim()).filter(Boolean)
                              const next = selected
                                ? current.filter(k => k !== opt.key)
                                : [...current, opt.key]
                              setF('known_languages', next.join(', '))
                            }}
                            className={cn(
                              'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 select-none',
                              selected
                                ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm scale-105'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B4332] hover:text-[#1B4332]'
                            )}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                    {form.known_languages === '' && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('Выберите один или несколько языков', 'Bir yoki bir nechta til tanlang', 'Select one or more languages')}
                      </p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Field label={t('Сколько лет изучали арабский язык?', 'Arab tilini necha yil o\'rgandingiz?', 'How many years did you study Arabic?')} required>
                      <input type="number" min="0" value={form.arabic_years} onChange={e => setF('arabic_years', e.target.value)}
                        placeholder="0" className={INPUT} />
                    </Field>
                    <Field label={t('Где изучали арабский язык? (название места)', 'Arab tilini qayerda o\'rgandingiz? (joy nomi)', 'Where did you study Arabic? (name of place)')}>
                      <input value={form.arabic_institute} onChange={e => setF('arabic_institute', e.target.value)} className={INPUT} />
                    </Field>
                  </div>
                </div>
              </Card>

              {/* Master: Bachelor degree info — moved here from Programs step */}
              {degreeType === 'master' && (
                <Card>
                  <SectionHeader title={t('Данные о дипломе бакалавра', 'Bakalavr diplomi haqida', 'Bachelor\'s degree information')} lang={lang} />
                  <div className="p-6 space-y-4">
                    <Field label={t('Название университета', 'Universitet nomi', 'University name')} required>
                      <input value={form.bachelor_university} onChange={e => setF('bachelor_university', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label={t('Гос. или частный?', 'Davlat yoki xususiy?', 'Public or private?')}>
                      <select value={form.bachelor_public_private} onChange={e => setF('bachelor_public_private', e.target.value)} className={SELECT}>
                        <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                        <option value="public">{t('Государственный', 'Davlat', 'Public')}</option>
                        <option value="private">{t('Частный', 'Xususiy', 'Private')}</option>
                      </select>
                    </Field>
                    <Field label={t('Страна', 'Mamlakat', 'Country')}>
                      <input value={form.bachelor_country} onChange={e => setF('bachelor_country', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label={t('Город', 'Shahar', 'City')}>
                      <input value={form.bachelor_city} onChange={e => setF('bachelor_city', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label={t('Год окончания', 'Tugatish yili', 'Graduation year')}>
                      <input type="number" min="1990" max="2030" value={form.bachelor_year} onChange={e => setF('bachelor_year', e.target.value)} placeholder="2023" className={INPUT} />
                    </Field>
                    <Field label={t('Специальность', 'Mutaxassislik', 'Major')}>
                      <input value={form.bachelor_major} onChange={e => setF('bachelor_major', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label={t('Срок обучения (лет)', 'O\'qish muddati (yil)', 'Duration (years)')}>
                      <input type="number" min="1" max="10" value={form.bachelor_duration} onChange={e => setF('bachelor_duration', e.target.value)} placeholder="4" className={INPUT} />
                    </Field>
                    <Field label={t('Язык обучения', 'O\'qitish tili', 'Language of instruction')}>
                      <select value={form.bachelor_language} onChange={e => setF('bachelor_language', e.target.value)} className={SELECT}>
                        <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                        {['Арабский','Русский','Узбекский','Казахский','Английский','Другой'].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label="GPA">
                      <input value={form.bachelor_gpa} onChange={e => setF('bachelor_gpa', e.target.value)} placeholder="3.8 / 4.0" className={INPUT} />
                    </Field>
                    <Field label={t('Общая оценка (отлично / хорошо...)', 'Umumiy baho (a\'lo / yaxshi...)', 'Overall grade')}>
                      <input value={form.bachelor_grade} onChange={e => setF('bachelor_grade', e.target.value)} className={INPUT} />
                    </Field>
                    <Field label={t('Эмиратская нострификация диплома?', 'BAA diploma ekvivalenti?', 'Emirates degree equivalency?')}>
                      <YesNo value={form.bachelor_equivalency} onChange={v => setF('bachelor_equivalency', v)} lang={lang} />
                    </Field>
                  </div>
                </Card>
              )}

              <NavButtons onBack={() => setStep(2)} onNext={handleNext} lang={lang} />
            </motion.div>
          )}

          {/* ── STEP 4: Programs (+ master bachelor info) ── */}
          {step === 4 && (
            <motion.div key="s4new" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{t(`Шаг 4 из ${TOTAL}`, `4-qadam ${TOTAL} tadan`, `Step 4 of ${TOTAL}`)}</p>
                <h1 className="text-3xl font-bold text-ink">{t('Выбор специальности', 'Yo\'nalish tanlash', 'Program selection')}</h1>
                <p className="text-muted mt-1 text-sm">
                  {degreeType === 'master'
                    ? t('Выберите 1 специальность.', 'Bitta yo\'nalish tanlang.', 'Select 1 program.')
                    : t('Выберите ровно 3 специальности. Университет оставляет за собой право определить специальность.', 'Aynan 3 ta yo\'nalish tanlang. Universitet yo\'nalishni mustaqil belgilash huquqini saqlaydi.', 'Select exactly 3 programs. The university reserves the right to assign one.')
                  }
                </p>
              </div>

              <Card>
                <SectionHeader
                  title={degreeType === 'bachelor'
                    ? t('Бакалавриат', 'Bakalavr yo\'nalishlari', 'Bachelor\'s programs')
                    : t('Магистратура', 'Magistratura yo\'nalishlari', 'Master\'s programs')}
                  lang={lang}
                />
                <div className="p-4 grid grid-cols-1 gap-2">
                  {programs.map(prog => {
                    const key = progKey(prog)
                    const selected = selectedPrograms.includes(key)
                    const label = progLabel(prog)
                    return (
                      <button key={key} onClick={() => toggleProgram(prog)}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border-2 transition-all w-full text-left',
                          selected ? 'bg-[#1B4332]/5 border-[#1B4332]/30 text-[#1B4332]' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-ink'
                        )}
                      >
                        <span className={cn(
                          'w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all',
                          degreeType === 'master' ? 'rounded-full' : 'rounded-md',
                          selected ? 'bg-[#1B4332] border-[#1B4332]' : 'border-gray-300'
                        )}>
                          {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </span>
                        <div className="flex-1">
                          <span className="text-base font-medium block">{label}</span>
                          <span className="text-xs text-muted" dir="rtl">{prog.ar}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {selectedPrograms.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="bg-[#1B4332]/5 rounded-xl p-3 flex flex-wrap gap-2">
                      {selectedPrograms.map((key, i) => {
                        const allProgs = [...BACHELOR_PROGRAMS, ...MASTER_PROGRAMS]
                        const found = allProgs.find(p => p.ar === key)
                        const label = found ? progLabel(found) : key
                        return (
                          <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-white border border-[#1B4332]/20 text-[#1B4332] px-2.5 py-1 rounded-lg font-medium">
                            {label}
                            <button onClick={() => setSelectedPrograms(prev => prev.filter(x => x !== key))} className="hover:text-red-500">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </Card>

              <NavButtons onBack={() => setStep(3)} onNext={handleNext} lang={lang} />
            </motion.div>
          )}

          {/* ── STEP 5: Documents ── */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{t(`Шаг 5 из ${TOTAL}`, `5-qadam ${TOTAL} tadan`, `Step 5 of ${TOTAL}`)}</p>
                <h1 className="text-3xl font-bold text-ink">{t('Документы', 'Hujjatlar', 'Documents')}</h1>
                <p className="text-muted mt-1 text-sm">{t('PDF, JPG или PNG — до 10 МБ каждый', 'PDF, JPG yoki PNG — har biri 10 MB gacha', 'PDF, JPG or PNG — up to 10MB each')}</p>
              </div>

              {/* Scanner warning */}
              <div className="mb-6 flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-sm text-amber-800 leading-relaxed">
                  <p className="font-semibold mb-1">
                    {t('Требования к документам', 'Hujjatlarga talablar', 'Document requirements')}
                  </p>
                  <p>
                    {t(
                      'Документы должны быть в формате PDF или JPG, отсканированные на портативном сканере. Документы, сфотографированные на телефон, не принимаются в обработку.',
                      'Hujjatlar PDF yoki JPG formatida, portativ skaner yordamida skanerlanishi kerak. Telefonda suratga olingan hujjatlar qabul qilinmaydi.',
                      'Documents must be in PDF or JPG format, scanned with a portable scanner. Documents photographed on a phone are not accepted for processing.'
                    )}
                  </p>
                </div>
              </div>

              {/* Required */}
              <Card>
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">{ru ? 'Обязательные документы' : 'Required documents'}</p>
                </div>
                <div className="p-4 grid grid-cols-1 gap-2">
                  {REQUIRED_DOCS.map(dt => (
                    <DocZone key={dt} docType={dt}
                      label={ru ? DOC_LABELS[dt].ru : DOC_LABELS[dt].en}
                      uploaded={docs[dt]}
                      onUpload={handleDocUpload}
                      onRemove={handleDocRemove}
                    />
                  ))}
                </div>
              </Card>

              {/* Optional */}
              <Card>
                <SectionHeader title={t('Дополнительные документы', 'Qo\'shimcha hujjatlar', 'Additional documents')} optional lang={lang} />
                <div className="p-4 grid grid-cols-1 gap-2">
                  {OPTIONAL_DOCS.map(dt => (
                    <DocZone key={dt} docType={dt}
                      label={ru ? DOC_LABELS[dt].ru : DOC_LABELS[dt].en}
                      uploaded={docs[dt]}
                      onUpload={handleDocUpload}
                      onRemove={handleDocRemove}
                    />
                  ))}
                </div>
              </Card>

              {/* Master docs */}
              {degreeType === 'master' && (
                <Card>
                  <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{ru ? 'Документы магистратуры' : 'Master\'s degree documents'}</p>
                  </div>
                  <div className="p-4 grid grid-cols-1 gap-2">
                    {MASTER_DOCS.map(dt => (
                      <DocZone key={dt} docType={dt}
                        label={ru ? DOC_LABELS[dt].ru : DOC_LABELS[dt].en}
                        uploaded={docs[dt]}
                        onUpload={handleDocUpload}
                        onRemove={handleDocRemove}
                      />
                    ))}
                  </div>
                </Card>
              )}

              <NavButtons onBack={() => setStep(4)} onNext={handleNext} lang={lang} />
            </motion.div>
          )}

          {/* ── STEP 6: Package ── */}
          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{t(`Шаг 6 из ${TOTAL}`, `6-qadam ${TOTAL} tadan`, `Step 6 of ${TOTAL}`)}</p>
                <h1 className="text-3xl font-bold text-ink">{t('Выбор пакета', 'Paket tanlash', 'Choose a plan')}</h1>
              </div>

              <div className="space-y-3 mb-8">
                {(['SUBMISSION', 'STANDARD', 'VIP'] as ServicePackage[]).map(k => {
                  const p = PACKAGES[k]
                  const isSelected = pkg === k
                  return (
                    <button key={k} onClick={() => setPkg(k)}
                      className={cn(
                        'w-full text-left rounded-2xl border-2 p-5 transition-all shadow-sm',
                        isSelected ? 'border-[#1B4332] bg-[#1B4332]/5 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                      )}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                            isSelected ? 'border-[#1B4332] bg-[#1B4332]' : 'border-gray-300'
                          )}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <p className="font-bold text-ink text-base">{ru ? p.name_ru : p.name_en}</p>
                            {k === 'STANDARD' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{t('Популярный', 'Mashhur', 'Popular')}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-ink">${p.priceUSD}</p>
                          <p className="text-xs text-muted">{t('разово', 'bir martalik', 'one-time')}</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {(ru || uz ? p.features_ru : p.features_en).map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2 text-sm text-muted">
                            <div className={cn('w-4 h-4 rounded-full flex items-center justify-center shrink-0', isSelected ? 'bg-[#1B4332]/10' : 'bg-gray-100')}>
                              <CheckCircle2 className={cn('w-2.5 h-2.5', isSelected ? 'text-[#1B4332]' : 'text-gray-400')} />
                            </div>
                            {f}
                          </div>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>

              <NavButtons onBack={() => setStep(5)} onNext={handleNext} lang={lang} />
            </motion.div>
          )}

          {/* ── STEP 7: Review + Submit ── */}
          {step === 7 && (
            <motion.div key="s7" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{t(`Шаг 7 из ${TOTAL}`, `7-qadam ${TOTAL} tadan`, `Step 7 of ${TOTAL}`)}</p>
                <h1 className="text-3xl font-bold text-ink">{t('Проверка и оплата', 'Tekshirish va to\'lov', 'Review & payment')}</h1>
              </div>

              <div className="space-y-3 mb-6">
                {/* Personal */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{t('Личные данные', 'Shaxsiy ma\'lumot', 'Personal info')}</p>
                    <button onClick={() => setStep(1)} className="text-xs text-[#1B4332] font-medium hover:underline">{t('Изменить', 'O\'zgartirish', 'Edit')}</button>
                  </div>
                  <div className="px-5 py-4 grid grid-cols-2 gap-y-2.5 text-sm">
                    <span className="text-muted">{t('Имя', 'Ism', 'Name')}</span><span className="text-ink font-medium">{form.full_name}</span>
                    <span className="text-muted">{t('Гражданство', 'Fuqarolik', 'Citizenship')}</span><span className="text-ink">{form.citizenship}</span>
                    <span className="text-muted">{t('Паспорт', 'Pasport', 'Passport')}</span><span className="text-ink">{form.passport_number}</span>
                    <span className="text-muted">{t('Дата рождения', 'Tug\'ilgan sana', 'Date of birth')}</span><span className="text-ink">{form.date_of_birth}</span>
                    <span className="text-muted">{t('Пол', 'Jinsi', 'Gender')}</span><span className="text-ink">{form.gender}</span>
                    <span className="text-muted">{t('Религия', 'Dini', 'Religion')}</span><span className="text-ink">{form.religion}</span>
                  </div>
                </div>

                {/* Programs */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{t('Специальности', 'Yo\'nalishlar', 'Programs')}</p>
                    <button onClick={() => setStep(4)} className="text-xs text-[#1B4332] font-medium hover:underline">{t('Изменить', 'O\'zgartirish', 'Edit')}</button>
                  </div>
                  <div className="px-5 py-4 flex flex-wrap gap-2" dir="rtl">
                    {selectedPrograms.map((p, i) => (
                      <span key={i} className="text-xs bg-[#1B4332]/5 border border-[#1B4332]/20 text-[#1B4332] px-3 py-1.5 rounded-lg font-medium">{p}</span>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{t('Документы', 'Hujjatlar', 'Documents')}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{Object.values(docs).filter(Boolean).length} {t('файлов', 'fayl', 'files')}</span>
                      <button onClick={() => setStep(5)} className="text-xs text-[#1B4332] font-medium hover:underline">{t('Изменить', 'O\'zgartirish', 'Edit')}</button>
                    </div>
                  </div>
                  <div className="px-5 py-4 flex flex-wrap gap-2">
                    {(Object.entries(docs) as [AQDocType, AQDoc | undefined][]).filter(([, d]) => d).map(([type]) => (
                      <span key={type} className="inline-flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 text-ink px-3 py-1.5 rounded-lg">
                        <FileText className="w-3 h-3 text-muted" />
                        {ru ? DOC_LABELS[type].ru : DOC_LABELS[type].en}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Package */}
                <div className="bg-[#1B4332] rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-0.5">{t('Выбранный пакет', 'Tanlangan paket', 'Selected plan')}</p>
                    <p className="text-white font-bold text-lg">{ru || uz ? PACKAGES[pkg].name_ru : PACKAGES[pkg].name_en}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">${PACKAGES[pkg].priceUSD}</p>
                    <button onClick={() => setStep(6)} className="text-white/60 text-xs hover:text-white transition-colors">{t('Изменить', 'O\'zgartirish', 'Change')}</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-start mb-5">
                <button onClick={() => setStep(6)} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-4 h-4" /> {ru ? 'Назад' : uz ? 'Orqaga' : 'Back'}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button disabled className="relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white opacity-50 cursor-not-allowed">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ink text-sm">{t('Оплатить сейчас', 'Hozir to\'lash', 'Pay Now')}</p>
                    <p className="text-xs text-muted mt-0.5">{t('Карта / USDT', 'Karta / USDT', 'Card / USDT')}</p>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{t('Скоро', 'Tez kunda', 'Soon')}</span>
                </button>

                <button onClick={handleSubmit} disabled={loading}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#1B4332] bg-[#1B4332]/5 hover:bg-[#1B4332]/10 transition-all cursor-pointer shadow-sm">
                  <div className="w-12 h-12 bg-[#1B4332] rounded-2xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-[#1B4332] text-sm">{t('Оплата через перевод', "O'tkazma orqali to'lash", 'Pay via Transfer')}</p>
                    <p className="text-xs text-muted mt-0.5">{t('Менеджер свяжется с вами', "Menejer siz bilan bog'lanadi", 'Manager will contact you')}</p>
                  </div>
                  {loading && <div className="w-5 h-5 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Success modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">{t('Заявка принята!', 'Ariza qabul qilindi!', 'Application accepted!')}</h3>
            <p className="text-muted text-sm leading-relaxed mb-4">
              {t(
                'Ваша заявка в Al Qasimia University принята. Менеджер свяжется с вами для подтверждения оплаты.',
                "Sizning arizangiz Al Qasimia University tomonidan qabul qilindi. Menejer to'lov tasdiqlash uchun siz bilan bog'lanadi.",
                'Your application to Al Qasimia University has been received. A manager will contact you to confirm payment.'
              )}
            </p>
            <a
              href={`https://t.me/tarjuman_help_bot?start=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#229ED9] text-white font-semibold hover:bg-[#1a8fc4] transition-colors mb-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.37l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.189z"/>
              </svg>
              {t('Получить уведомление в Telegram', 'Telegram bildirishnomasi olish', 'Get Telegram notification')}
            </a>
            <button
              onClick={() => router.push(`/dashboard?app=${appId}`)}
              className="w-full py-3 rounded-xl border border-border text-muted text-sm font-medium hover:bg-surface transition-colors"
            >
              {t('Перейти в личный кабинет', "Shaxsiy kabinetga o'tish", 'Go to Dashboard')}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
