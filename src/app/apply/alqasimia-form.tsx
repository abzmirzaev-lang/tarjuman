'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, X, ChevronRight, ChevronLeft, Send, Zap, GraduationCap
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { PACKAGES } from '@/types'
import type { AppLanguage, ServicePackage } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

// ── Styles ────────────────────────────────────────────────────────────────────

const INPUT = "w-full h-12 px-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white"
const DATE_INPUT = "w-full h-12 px-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white [color-scheme:light]"
const SELECT = "w-full h-12 px-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white appearance-none"

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
    <div className="px-4 sm:px-6 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</p>
      {optional && <span className="text-[11px] text-muted bg-gray-100 px-2 py-0.5 rounded-full">{ru ? 'Необязательно' : uz ? 'Ixtiyoriy' : 'Optional'}</span>}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3">{children}</div>
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

  const ru = lang === 'ru'
  const uz = lang === 'uz'
  const t = (ruText: string, uzText: string, enText: string) =>
    ru ? ruText : uz ? uzText : enText

  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    religion: '',
    madhab: '',
    lived_in_uae: '',
    has_disability: '',
    covid_vaccinated: '',
    email: '',
    whatsapp: '',
    home_phone: '',
    social_media: '',
    nearest_airport: '',
    father_name: '',
    father_phone: '',
    mother_name: '',
    mother_phone: '',
    school_type: '',
    school_name: '',
    gpa: '',
    school_language: '',
    known_languages: '',
    arabic_years: '',
    arabic_institute: '',
  })

  const setF = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const TOTAL = 3
  const STEP_NAMES = ru
    ? ['Анкета', 'Программа', 'Оплата']
    : uz
    ? ['Anketa', 'Dastur', 'To\'lov']
    : ['Questionnaire', 'Program', 'Payment']

  const programs = degreeType === 'bachelor' ? BACHELOR_PROGRAMS : MASTER_PROGRAMS

  // ── Validators ──────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const required: string[] = [
      form.full_name, form.date_of_birth, form.gender, form.religion,
      form.lived_in_uae, form.has_disability, form.covid_vaccinated,
      form.email, form.whatsapp, form.home_phone, form.nearest_airport,
      form.father_name, form.father_phone,
      form.mother_name, form.mother_phone,
      form.school_type, form.school_name, form.gpa,
      form.school_language, form.known_languages, form.arabic_years,
    ]
    if (required.some(v => !v.trim())) {
      toast.error(t(
        'Заполните все обязательные поля',
        'Barcha majburiy maydonlarni to\'ldiring',
        'Fill all required fields'
      ))
      return false
    }
    if (!form.email.toLowerCase().includes('@gmail.com')) {
      toast.error(t('Укажите Gmail адрес (@gmail.com)', 'Gmail manzil kiriting (@gmail.com)', 'Please enter a Gmail address (@gmail.com)'))
      return false
    }
    return true
  }

  const validateStep2 = () => {
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
    return true
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const progLabel = (prog: Program) => ru ? prog.ru : uz ? prog.uz : prog.ar
  const progKey   = (prog: Program) => prog.ar

  const toggleProgram = (prog: Program) => {
    const key = progKey(prog)
    if (degreeType === 'master') {
      setSelectedPrograms(selectedPrograms.includes(key) ? [] : [key])
    } else {
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
        religion: form.religion,
        madhab: form.madhab,
        lived_in_uae: form.lived_in_uae,
        has_disability: form.has_disability,
        covid_vaccinated: form.covid_vaccinated,
        whatsapp: form.whatsapp,
        home_phone: form.home_phone,
        social_media: form.social_media,
        nearest_airport: form.nearest_airport,
        father: { name: form.father_name, phone: form.father_phone },
        mother: { name: form.mother_name, phone: form.mother_phone },
        school_type: form.school_type,
        school_name: form.school_name,
        gpa: form.gpa,
        school_language: form.school_language,
        known_languages: form.known_languages,
        arabic_years: form.arabic_years,
        arabic_institute: form.arabic_institute,
      }

      const { data: app, error: appErr } = await supabase
        .from('applications')
        .insert({
          user_id:            user.id,
          country:            'AE',
          service_package:    pkg,
          status:             'REGISTERED',
          full_name:          form.full_name,
          citizenship:        null,
          date_of_birth:      form.date_of_birth || null,
          phone:              form.whatsapp,
          telegram:           null,
          education_level:    degreeType,
          gender:             form.gender,
          marital_status:     null,
          arabic_level:       null,
          english_level:      null,
          guardian_name:      form.father_name || null,
          guardian_phone:     form.father_phone || null,
          guardian_email:     null,
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
      setSuccessModal(true)
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
                    <div className={cn('w-8 h-0.5 mx-1 mb-4 rounded-full transition-all', done ? 'bg-[#1B4332]' : 'bg-gray-200')} />
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

          {/* ── STEP 1: Анкета ── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">
                  {t('Шаг 1 из 3', '1-qadam 3 tadan', 'Step 1 of 3')}
                </p>
                <h1 className="text-3xl font-bold text-ink">{t('Анкета', 'Anketa', 'Questionnaire')}</h1>
                <p className="text-muted mt-1 text-sm">{t('Заполните все обязательные поля', 'Barcha maydonlarni to\'ldiring', 'Fill in all required fields')}</p>
              </div>

              {/* Личные данные */}
              <Card>
                <SectionHeader title={t('Личные данные', 'Shaxsiy ma\'lumot', 'Personal data')} lang={lang} />
                <div className="p-4 sm:p-6 space-y-4">
                  <Field label={t('Полное имя', 'To\'liq ism', 'Full name')} required>
                    <input value={form.full_name} onChange={e => setF('full_name', e.target.value)}
                      placeholder={ru ? 'Иванов Иван Иванович' : uz ? 'Ivanov Ivan Ivanovich' : 'Full name'} className={INPUT} />
                  </Field>
                  <Field label={t('Дата рождения', 'Tug\'ilgan sana', 'Date of birth')} required>
                    <input type="date" value={form.date_of_birth} onChange={e => setF('date_of_birth', e.target.value)} className={DATE_INPUT} />
                  </Field>
                  <Field label={t('Пол', 'Jinsi', 'Gender')} required>
                    <select value={form.gender} onChange={e => setF('gender', e.target.value)} className={SELECT}>
                      <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                      <option value="male">{t('Мужчина', 'Erkak', 'Male')}</option>
                      <option value="female">{t('Женщина', 'Ayol', 'Female')}</option>
                    </select>
                  </Field>
                  <Field label={t('Религия', 'Dini', 'Religion')} required>
                    <select value={form.religion} onChange={e => { setF('religion', e.target.value); if (e.target.value !== 'islam') setF('madhab', '') }} className={SELECT}>
                      <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                      <option value="islam">{t('Ислам', 'Islom', 'Islam')}</option>
                      <option value="other">{t('Другое', 'Boshqa', 'Other')}</option>
                    </select>
                  </Field>
                  {form.religion === 'islam' && (
                    <Field label={t('Мазхаб', 'Mazhab', 'Madhab')}>
                      <select value={form.madhab} onChange={e => setF('madhab', e.target.value)} className={SELECT}>
                        <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                        <option value="hanafi">{t('Ханафитский', 'Hanafiy', 'Hanafi')}</option>
                        <option value="hanbali">{t('Ханбалитский', 'Hanbaliy', 'Hanbali')}</option>
                        <option value="shafi">{t('Шафиитский', 'Shofiy', 'Shafi\'i')}</option>
                        <option value="maliki">{t('Маликитский', 'Molikiy', 'Maliki')}</option>
                      </select>
                    </Field>
                  )}
                </div>
              </Card>

              {/* Дополнительные сведения */}
              <Card>
                <SectionHeader title={t('Дополнительные сведения', 'Qo\'shimcha ma\'lumotlar', 'Additional details')} lang={lang} />
                <div className="p-4 sm:p-6 space-y-4">
                  <Field label={t('Проживали ли в ОАЭ?', 'BAA da yashagansizmi?', 'Have you lived in UAE?')} required>
                    <YesNo value={form.lived_in_uae} onChange={v => setF('lived_in_uae', v)} lang={lang} />
                  </Field>
                  <Field label={t('Есть ли инвалидность?', 'Nogironligingiz bormi?', 'Do you have a disability?')} required>
                    <YesNo value={form.has_disability} onChange={v => setF('has_disability', v)} lang={lang} />
                  </Field>
                  <Field label={t('Получены ли 2 дозы вакцины COVID-19?', 'COVID-19 vaksinasining 2 dozasini oldingizmi?', 'Received 2 COVID-19 vaccine doses?')} required>
                    <YesNo value={form.covid_vaccinated} onChange={v => setF('covid_vaccinated', v)} lang={lang} />
                  </Field>
                </div>
              </Card>

              {/* Контакты */}
              <Card>
                <SectionHeader title={t('Контакты', 'Aloqa', 'Contacts')} lang={lang} />
                <div className="p-4 sm:p-6 space-y-4">
                  <Field label="Gmail" required>
                    <input type="email" value={form.email} onChange={e => setF('email', e.target.value)}
                      placeholder="example@gmail.com" className={INPUT} />
                  </Field>
                  <Field label="WhatsApp" required>
                    <input type="tel" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)}
                      placeholder="+998901234567" className={INPUT} />
                  </Field>
                  <Field label={t('Домашний телефон', 'Uy telefoni', 'Home phone')} required>
                    <input type="tel" value={form.home_phone} onChange={e => setF('home_phone', e.target.value)}
                      placeholder="+998..." className={INPUT} />
                  </Field>
                  <Field label="Instagram / Facebook">
                    <input value={form.social_media} onChange={e => setF('social_media', e.target.value)}
                      placeholder={ru ? '@username или «Нет»' : uz ? '@username yoki «Yo\'q»' : '@username or "No"'} className={INPUT} />
                  </Field>
                  <Field label={t('Ближайший аэропорт', 'Eng yaqin aeroport', 'Nearest airport')} required>
                    <input value={form.nearest_airport} onChange={e => setF('nearest_airport', e.target.value)}
                      placeholder={ru ? 'Ташкент (TAS)' : uz ? 'Toshkent (TAS)' : 'Tashkent (TAS)'} className={INPUT} />
                  </Field>
                </div>
              </Card>

              {/* Данные отца */}
              <Card>
                <SectionHeader title={t('Данные отца', 'Otasi haqida', 'Father\'s data')} lang={lang} />
                <div className="p-4 sm:p-6 space-y-4">
                  <Field label={t('ФИО', 'To\'liq ism', 'Full name')} required>
                    <input value={form.father_name} onChange={e => setF('father_name', e.target.value)} className={INPUT} />
                  </Field>
                  <Field label={t('Телефон', 'Telefon', 'Phone')} required>
                    <input type="tel" value={form.father_phone} onChange={e => setF('father_phone', e.target.value)}
                      placeholder="+998..." className={INPUT} />
                  </Field>
                </div>
              </Card>

              {/* Данные матери */}
              <Card>
                <SectionHeader title={t('Данные матери', 'Onasi haqida', 'Mother\'s data')} lang={lang} />
                <div className="p-4 sm:p-6 space-y-4">
                  <Field label={t('ФИО', 'To\'liq ism', 'Full name')} required>
                    <input value={form.mother_name} onChange={e => setF('mother_name', e.target.value)} className={INPUT} />
                  </Field>
                  <Field label={t('Телефон', 'Telefon', 'Phone')} required>
                    <input type="tel" value={form.mother_phone} onChange={e => setF('mother_phone', e.target.value)}
                      placeholder="+998..." className={INPUT} />
                  </Field>
                </div>
              </Card>

              {/* Образование */}
              <Card>
                <SectionHeader title={t('Образование', 'Ta\'lim', 'Education')} lang={lang} />
                <div className="p-4 sm:p-6 space-y-4">
                  <Field label={t('Тип школы', 'Maktab turi', 'School type')} required>
                    <select value={form.school_type} onChange={e => setF('school_type', e.target.value)} className={SELECT}>
                      <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                      <option value="public">{t('Государственная', 'Davlat', 'Public')}</option>
                      <option value="private">{t('Частная', 'Xususiy', 'Private')}</option>
                      <option value="semi_public">{t('Полугосударственная', 'Yarim davlat', 'Semi-public')}</option>
                      <option value="other">{t('Другая', 'Boshqa', 'Other')}</option>
                    </select>
                  </Field>
                  <Field label={t('Название школы', 'Maktab nomi', 'School name')} required>
                    <input value={form.school_name} onChange={e => setF('school_name', e.target.value)} className={INPUT} />
                  </Field>
                  <Field label={t('Средний балл (GPA)', 'O\'rtacha ball (GPA)', 'GPA / average grade')} required>
                    <input value={form.gpa} onChange={e => setF('gpa', e.target.value)}
                      placeholder="4.5 / 5.0" className={INPUT} />
                  </Field>
                  <Field label={t('Язык обучения', 'O\'qitish tili', 'Language of instruction')} required>
                    <select value={form.school_language} onChange={e => setF('school_language', e.target.value)} className={SELECT}>
                      <option value="">{t('Выберите...', 'Tanlang...', 'Select...')}</option>
                      {['Арабский','Русский','Узбекский','Казахский','Таджикский','Английский','Другой'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </Field>

                  {/* Языки */}
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">
                      {t('Какие языки знаете?', 'Qanday tillarni bilasiz?', 'Languages you know')}
                      <span className="text-red-400 ml-1">*</span>
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
                              const next = selected ? current.filter(k => k !== opt.key) : [...current, opt.key]
                              setF('known_languages', next.join(', '))
                            }}
                            className={cn(
                              'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 select-none',
                              selected
                                ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B4332] hover:text-[#1B4332]'
                            )}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Field label={t('Сколько лет изучали арабский?', 'Arab tilini necha yil o\'rgandingiz?', 'How many years studied Arabic?')} required>
                    <input type="number" min="0" value={form.arabic_years} onChange={e => setF('arabic_years', e.target.value)}
                      placeholder="0" className={INPUT} />
                  </Field>
                  <Field label={t('Где обучались арабскому?', 'Arab tilini qayerda o\'rgandingiz?', 'Where did you study Arabic?')}>
                    <input value={form.arabic_institute} onChange={e => setF('arabic_institute', e.target.value)}
                      placeholder={ru ? 'Название места (если есть)' : uz ? 'Joy nomi (mavjud bo\'lsa)' : 'Name of place (if any)'} className={INPUT} />
                  </Field>
                </div>
              </Card>

              {/* Nav */}
              <div className="flex gap-3 mt-6">
                <button onClick={onBack} className="flex items-center justify-center gap-1.5 px-4 py-3.5 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{ru ? 'Назад' : uz ? 'Orqaga' : 'Back'}</span>
                </button>
                <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm">
                  {ru ? 'Далее' : uz ? 'Keyingi' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Программа + Пакет ── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">
                  {t('Шаг 2 из 3', '2-qadam 3 tadan', 'Step 2 of 3')}
                </p>
                <h1 className="text-3xl font-bold text-ink">{t('Программа и пакет', 'Dastur va paket', 'Program & plan')}</h1>
              </div>

              {/* Programs */}
              <Card>
                <SectionHeader
                  title={degreeType === 'bachelor'
                    ? t('Выбор специальности (3)', 'Yo\'nalish tanlash (3)', 'Program selection (3)')
                    : t('Выбор специальности (1)', 'Yo\'nalish tanlash (1)', 'Program selection (1)')}
                  lang={lang}
                />
                <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
                  <p className="text-xs text-amber-700">
                    {degreeType === 'master'
                      ? t('Выберите 1 специальность.', 'Bitta yo\'nalish tanlang.', 'Select 1 program.')
                      : t('Выберите ровно 3 специальности. Университет оставляет за собой право определить специальность.', 'Aynan 3 ta yo\'nalish tanlang. Universitet yo\'nalishni mustaqil belgilash huquqini saqlaydi.', 'Select exactly 3 programs. The university may assign the final specialty.')
                    }
                  </p>
                </div>
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

              {/* Packages */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-1">
                  {t('Выберите пакет', 'Paket tanlang', 'Choose a plan')}
                </p>
                <div className="space-y-3">
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
              </div>

              {/* Nav */}
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center justify-center gap-1.5 px-4 py-3.5 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{ru ? 'Назад' : uz ? 'Orqaga' : 'Back'}</span>
                </button>
                <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm">
                  {ru ? 'Далее' : uz ? 'Keyingi' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Оплата ── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">
                  {t('Шаг 3 из 3', '3-qadam 3 tadan', 'Step 3 of 3')}
                </p>
                <h1 className="text-3xl font-bold text-ink">{t('Оплата', 'To\'lov', 'Payment')}</h1>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{t('Данные', 'Ma\'lumotlar', 'Summary')}</p>
                    <button onClick={() => setStep(1)} className="text-xs text-[#1B4332] font-medium hover:underline">{t('Изменить', 'O\'zgartirish', 'Edit')}</button>
                  </div>
                  <div className="px-5 py-4 grid grid-cols-2 gap-y-2.5 text-sm">
                    <span className="text-muted">{t('Имя', 'Ism', 'Name')}</span>
                    <span className="text-ink font-medium">{form.full_name}</span>
                    <span className="text-muted">{t('WhatsApp', 'WhatsApp', 'WhatsApp')}</span>
                    <span className="text-ink">{form.whatsapp}</span>
                    <span className="text-muted">{t('Пол', 'Jinsi', 'Gender')}</span>
                    <span className="text-ink">{form.gender === 'male' ? t('Мужчина', 'Erkak', 'Male') : form.gender === 'female' ? t('Женщина', 'Ayol', 'Female') : form.gender}</span>
                    <span className="text-muted">{t('Религия', 'Dini', 'Religion')}</span>
                    <span className="text-ink">{form.religion}{form.madhab ? ` (${form.madhab})` : ''}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{t('Специальности', 'Yo\'nalishlar', 'Programs')}</p>
                    <button onClick={() => setStep(2)} className="text-xs text-[#1B4332] font-medium hover:underline">{t('Изменить', 'O\'zgartirish', 'Edit')}</button>
                  </div>
                  <div className="px-5 py-4 flex flex-wrap gap-2">
                    {selectedPrograms.map((key, i) => {
                      const allProgs = [...BACHELOR_PROGRAMS, ...MASTER_PROGRAMS]
                      const found = allProgs.find(p => p.ar === key)
                      const label = found ? progLabel(found) : key
                      return (
                        <span key={i} className="text-xs bg-[#1B4332]/5 border border-[#1B4332]/20 text-[#1B4332] px-3 py-1.5 rounded-lg font-medium">{label}</span>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-[#1B4332] rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-0.5">{t('Выбранный пакет', 'Tanlangan paket', 'Selected plan')}</p>
                    <p className="text-white font-bold text-lg">{ru || uz ? PACKAGES[pkg].name_ru : PACKAGES[pkg].name_en}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">${PACKAGES[pkg].priceUSD}</p>
                    <button onClick={() => setStep(2)} className="text-white/60 text-xs hover:text-white transition-colors">{t('Изменить', 'O\'zgartirish', 'Change')}</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-start mb-5">
                <button onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-4 h-4" /> {ru ? 'Назад' : uz ? 'Orqaga' : 'Back'}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button disabled className="relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white opacity-50 cursor-not-allowed">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ink text-sm">{t('Оплатить картой', 'Karta bilan to\'lash', 'Pay by Card')}</p>
                    <p className="text-xs text-muted mt-0.5">Visa / Mastercard</p>
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
              href="https://t.me/TARJUMAN_EDU"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#229ED9] text-white font-semibold hover:bg-[#1a8fc4] transition-colors mb-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.37l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.189z"/>
              </svg>
              {t('Написать менеджеру в Telegram', 'Menejerga Telegram\'da yozish', 'Message manager on Telegram')}
            </a>
            <a
              href="https://t.me/tarjumanedu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-ink text-sm font-medium hover:bg-gray-50 transition-colors mb-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.37l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.189z"/>
              </svg>
              {t('Подписаться на канал @tarjumanedu', '@tarjumanedu kanaliga obuna bo\'lish', 'Subscribe to @tarjumanedu')}
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
