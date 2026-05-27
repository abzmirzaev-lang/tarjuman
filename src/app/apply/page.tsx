'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { CheckCircle2, Upload, X, FileText, AlertCircle, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, GraduationCap, Plus, ExternalLink, Zap, Send } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button, Input, Select } from '@/components/ui'
import { PACKAGES, DOCUMENT_LABELS } from '@/types'
import type { AppLanguage, ServicePackage, DocumentType, UniversityRow } from '@/types'
import { translations } from '@/i18n'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

const EDUCATION_OPTIONS_RU = [
  { value: '',             label: 'Выберите...' },
  { value: 'secondary',   label: 'Среднее образование' },
  { value: 'vocational',  label: 'Среднее специальное' },
  { value: 'bachelor',    label: 'Бакалавриат' },
  { value: 'master',      label: 'Магистратура' },
]

const REQUIRED_DOCS: DocumentType[] = ['PASSPORT', 'PHOTO', 'DIPLOMA', 'MEDICAL', 'CRIMINAL_RECORD']
const OPTIONAL_DOCS: DocumentType[] = ['IELTS', 'ARABIC_CERT', 'RECOMMENDATION', 'TRANSCRIPT']
const MAX_FACULTIES = 25

interface FormData {
  full_name:       string
  citizenship:     string
  date_of_birth:   string
  phone:           string
  telegram:        string
  education_level: string
  gender:          string
  marital_status:  string
  arabic_level:    string
  english_level:   string
  guardian_name:   string
  guardian_phone:  string
  guardian_email:  string
}

interface SelectedFaculty {
  university_id:   string
  university_name: string
  faculty:         string
}

interface UploadedDoc {
  type:     DocumentType
  file:     File
  preview?: string
}

function DropZone({ docType, label, onUpload, uploaded, onRemove }: {
  docType:  DocumentType
  label:    string
  onUpload: (type: DocumentType, file: File) => void
  uploaded?: UploadedDoc
  onRemove: (type: DocumentType) => void
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

function ApplyContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [lang, setLang] = useLanguage()
  const t = translations[lang]

  const [step, setStep]     = useState(1)
  const [user, setUser]     = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [appId, setAppId]   = useState<string | null>(null)

  // Universities state
  const [universities, setUniversities]               = useState<UniversityRow[]>([])
  const [universitiesLoading, setUniversitiesLoading] = useState(false)
  const [expandedUniversity, setExpandedUniversity]   = useState<string | null>(null)
  const [selectedFaculties, setSelectedFaculties]     = useState<SelectedFaculty[]>([])

  // Custom university input
  const [customUniName, setCustomUniName]     = useState('')
  const [customFaculty, setCustomFaculty]     = useState('')

  const [form, setForm] = useState<FormData>({
    full_name:       '',
    citizenship:     '',
    date_of_birth:   '',
    phone:           '',
    telegram:        '',
    education_level: '',
    gender:          '',
    marital_status:  '',
    arabic_level:    '',
    english_level:   '',
    guardian_name:   '',
    guardian_phone:  '',
    guardian_email:  '',
  })

  const [docs, setDocs] = useState<Record<DocumentType, UploadedDoc | undefined>>({} as any)
  const [pkg,  setPkg]  = useState<ServicePackage>(
    (searchParams.get('package') as ServicePackage) || 'STANDARD'
  )

  // Comment modal
  const [commentModal, setCommentModal] = useState(false)
  const [comment, setComment] = useState('')

  const universityId = searchParams.get('university') || undefined
  const countryParam = searchParams.get('country') as 'SA' | 'AE' || 'SA'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/login?next=/apply')
      else setUser(data.session.user)
    })
  }, [router])

  // Load universities when entering step 3
  useEffect(() => {
    if (step === 3 && universities.length === 0) {
      setUniversitiesLoading(true)
      supabase
        .from('universities')
        .select('*')
        .eq('is_active', true)
        .order('rank', { ascending: true })
        .then(({ data, error }) => {
          if (!error && data) setUniversities(data as UniversityRow[])
          setUniversitiesLoading(false)
        })
    }
  }, [step, universities.length])

  const toggleFaculty = (university: UniversityRow, faculty: string) => {
    const key = `${university.id}__${faculty}`
    const exists = selectedFaculties.find(f => f.university_id === university.id && f.faculty === faculty)
    if (exists) {
      setSelectedFaculties(prev => prev.filter(f => !(f.university_id === university.id && f.faculty === faculty)))
    } else {
      if (selectedFaculties.length >= MAX_FACULTIES) {
        toast.error(lang === 'ru' ? `Максимум ${MAX_FACULTIES} факультетов` : `Maximum ${MAX_FACULTIES} faculties`)
        return
      }
      setSelectedFaculties(prev => [...prev, {
        university_id:   university.id,
        university_name: lang === 'ru' ? university.name_ru : university.name_en,
        faculty,
      }])
    }
  }

  const isFacultySelected = (universityId: string, faculty: string) =>
    selectedFaculties.some(f => f.university_id === universityId && f.faculty === faculty)

  const addCustomFaculty = () => {
    if (!customUniName.trim() || !customFaculty.trim()) {
      toast.error(lang === 'ru' ? 'Укажите название университета и факультет' : 'Enter university name and faculty')
      return
    }
    if (selectedFaculties.length >= MAX_FACULTIES) {
      toast.error(lang === 'ru' ? `Максимум ${MAX_FACULTIES} факультетов` : `Maximum ${MAX_FACULTIES} faculties`)
      return
    }
    setSelectedFaculties(prev => [...prev, {
      university_id:   `custom_${Date.now()}`,
      university_name: customUniName.trim(),
      faculty:         customFaculty.trim(),
    }])
    setCustomFaculty('')
  }

  // Success modal state
  const [successModal, setSuccessModal] = useState(false)

  // Step handlers
  const handleStep1 = () => {
    if (!form.full_name || !form.citizenship || !form.phone || !form.gender || !form.marital_status || !form.arabic_level || !form.english_level) {
      toast.error(lang === 'ru' ? 'Заполните все обязательные поля' : 'Fill all required fields')
      return
    }
    setStep(2)
  }

  const handleStep2 = () => {
    const missing = REQUIRED_DOCS.filter(d => !docs[d])
    if (missing.length > 0) {
      toast.error(
        lang === 'ru'
          ? `Загрузите обязательные документы: ${missing.map(d => DOCUMENT_LABELS[d].ru).join(', ')}`
          : `Upload required documents: ${missing.map(d => DOCUMENT_LABELS[d].en).join(', ')}`
      )
      return
    }
    setStep(3)
  }

  const handleStep3 = () => {
    if (selectedFaculties.length === 0) {
      toast.error(lang === 'ru' ? 'Выберите хотя бы один факультет' : 'Please select at least one faculty')
      return
    }
    setCommentModal(true)
  }

  const handleStep4 = () => setStep(5)

  // Submit
  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: app, error: appErr } = await supabase
        .from('applications')
        .insert({
          user_id:            user.id,
          university_id:      universityId || null,
          country:            countryParam,
          service_package:    pkg,
          status:             'REGISTERED',
          full_name:          form.full_name,
          citizenship:        form.citizenship,
          date_of_birth:      form.date_of_birth || null,
          phone:              form.phone,
          telegram:           form.telegram || null,
          education_level:    form.education_level || null,
          gender:             form.gender || null,
          marital_status:     form.marital_status || null,
          arabic_level:       form.arabic_level || null,
          english_level:      form.english_level || null,
          guardian_name:      form.guardian_name || null,
          guardian_phone:     form.guardian_phone || null,
          guardian_email:     form.guardian_email || null,
          selected_faculties: selectedFaculties,
          notes:              comment || null,
        })
        .select()
        .single()

      if (appErr) throw appErr
      setAppId(app.id)

      // Upload documents
      const uploadPromises = Object.entries(docs)
        .filter(([, d]) => d != null)
        .map(async ([type, doc]) => {
          const docData = doc!
          const ext  = docData.file.name.split('.').pop()
          const path = `${user.id}/${app.id}/${type}_${uuidv4()}.${ext}`

          const { error: storageErr } = await supabase.storage
            .from('documents')
            .upload(path, docData.file, { upsert: true })

          if (storageErr) throw storageErr

          await supabase.from('documents').insert({
            application_id: app.id,
            user_id:        user.id,
            type:           type as DocumentType,
            file_name:      docData.file.name,
            file_path:      path,
            file_size:      docData.file.size,
            mime_type:      docData.file.type,
          })
        })

      await Promise.all(uploadPromises)

      // Redirect to payment
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const res = await fetch('/api/payments/create-checkout', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession?.access_token ?? ''}`,
        },
        body:    JSON.stringify({ applicationId: app.id, package: pkg }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
      else router.push(`/dashboard?app=${app.id}`)
    } catch (err: any) {
      toast.error(err.message || t.common.error)
      setLoading(false)
    }
  }

  // Manual payment submit
  const handleSubmitManual = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: app, error: appErr } = await supabase
        .from('applications')
        .insert({
          user_id:            user.id,
          university_id:      null,
          country:            countryParam,
          service_package:    pkg,
          status:             'REGISTERED',
          full_name:          form.full_name,
          citizenship:        form.citizenship,
          date_of_birth:      form.date_of_birth || null,
          phone:              form.phone,
          telegram:           form.telegram || null,
          education_level:    form.education_level || null,
          gender:             form.gender || null,
          marital_status:     form.marital_status || null,
          arabic_level:       form.arabic_level || null,
          english_level:      form.english_level || null,
          guardian_name:      form.guardian_name || null,
          guardian_phone:     form.guardian_phone || null,
          guardian_email:     form.guardian_email || null,
          selected_faculties: selectedFaculties,
          notes:              comment || null,
        })
        .select()
        .single()

      if (appErr) throw appErr

      // Upload documents
      const uploadPromises = Object.entries(docs)
        .filter(([, d]) => d != null)
        .map(async ([type, doc]) => {
          const docData = doc!
          const ext  = docData.file.name.split('.').pop()
          const path = `${user.id}/${app.id}/${type}_${Date.now()}.${ext}`
          await supabase.storage.from('documents').upload(path, docData.file, { upsert: true })
          await supabase.from('documents').insert({
            application_id: app.id,
            user_id:        user.id,
            type:           type as DocumentType,
            file_name:      docData.file.name,
            file_path:      path,
            file_size:      docData.file.size,
            mime_type:      docData.file.type,
          })
        })
      await Promise.all(uploadPromises)

      // Notify admin via Telegram
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      await fetch('/api/payments/create-checkout', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession?.access_token ?? ''}`,
        },
        body: JSON.stringify({ applicationId: app.id, package: pkg }),
      })

      setAppId(app.id)
      setSuccessModal(true)
    } catch (err: any) {
      toast.error(err.message || t.common.error)
    } finally {
      setLoading(false)
    }
  }

  const STEPS = [
    t.apply.step1,
    t.apply.step2,
    lang === 'ru' ? 'Университеты' : 'Universities',
    t.apply.step3,
    t.apply.step4,
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <div className="bg-white border-b border-border">
        <div className="container-narrow h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <svg viewBox="0 0 156 36" width="140" height="32" aria-label="TARJUMAN">
              <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
              <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
              <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            {STEPS.map((s, i) => (
              <div key={i} className={cn(
                'flex items-center gap-1.5 text-sm',
                i + 1 === step ? 'text-brand-500 font-medium' : i + 1 < step ? 'text-brand-400' : 'text-muted'
              )}>
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  i + 1 < step   ? 'bg-brand-400 text-white' :
                  i + 1 === step ? 'bg-brand-400 text-white' :
                                   'bg-border text-muted'
                )}>
                  {i + 1 < step ? '✓' : i + 1}
                </span>
                <span className="hidden sm:block">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-narrow py-10 max-w-2xl">
        <AnimatePresence mode="wait">

          {/* ── STEP 1 — Анкета ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-ink mb-6">{t.apply.step1}</h1>
              <div className="card p-6 space-y-4">
                <Input
                  label={t.apply.fullName + ' *'}
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                />
                <Select
                  label={(lang === 'ru' ? 'Пол' : 'Gender') + ' *'}
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                  options={[
                    { value: '',       label: lang === 'ru' ? 'Выберите...' : 'Select...' },
                    { value: 'male',   label: lang === 'ru' ? 'Мужчина' : 'Male' },
                    { value: 'female', label: lang === 'ru' ? 'Женщина' : 'Female' },
                  ]}
                />
                <Select
                  label={t.apply.citizenship + ' *'}
                  value={form.citizenship}
                  onChange={e => setForm({ ...form, citizenship: e.target.value })}
                  options={[
                    { value: '', label: lang === 'ru' ? 'Выберите страну...' : 'Select country...' },
                    { value: 'Узбекистан', label: 'Узбекистан' },
                    { value: 'Казахстан', label: 'Казахстан' },
                    { value: 'Таджикистан', label: 'Таджикистан' },
                    { value: 'Кыргызстан', label: 'Кыргызстан' },
                    { value: 'Туркменистан', label: 'Туркменистан' },
                    { value: 'Азербайджан', label: 'Азербайджан' },
                    { value: 'Россия', label: 'Россия' },
                    { value: 'Украина', label: 'Украина' },
                    { value: 'Беларусь', label: 'Беларусь' },
                    { value: 'Молдова', label: 'Молдова' },
                    { value: 'Грузия', label: 'Грузия' },
                    { value: 'Армения', label: 'Армения' },
                    { value: 'Другое', label: lang === 'ru' ? 'Другое' : 'Other' },
                  ]}
                />
                <Input
                  label={t.apply.dob}
                  type="date"
                  value={form.date_of_birth}
                  onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
                />
                <Input
                  label={t.apply.phone + ' *'}
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+998901234567"
                />
                <Input
                  label={t.apply.telegram}
                  value={form.telegram}
                  onChange={e => setForm({ ...form, telegram: e.target.value })}
                  placeholder="@username"
                />
                <Select
                  label={t.apply.education}
                  value={form.education_level}
                  onChange={e => setForm({ ...form, education_level: e.target.value })}
                  options={EDUCATION_OPTIONS_RU}
                />
                <Select
                  label={(lang === 'ru' ? 'Семейное положение' : 'Marital status') + ' *'}
                  value={form.marital_status}
                  onChange={e => setForm({ ...form, marital_status: e.target.value })}
                  options={[
                    { value: '',         label: lang === 'ru' ? 'Выберите...' : 'Select...' },
                    { value: 'single',   label: lang === 'ru' ? 'Не в браке' : 'Single' },
                    { value: 'married',  label: lang === 'ru' ? 'В браке' : 'Married' },
                    { value: 'divorced', label: lang === 'ru' ? 'Разведён(а)' : 'Divorced' },
                    { value: 'widowed',  label: lang === 'ru' ? 'Вдовец/Вдова' : 'Widowed' },
                  ]}
                />
                <Select
                  label={(lang === 'ru' ? 'Уровень знания арабского языка' : 'Arabic language level') + ' *'}
                  value={form.arabic_level}
                  onChange={e => setForm({ ...form, arabic_level: e.target.value })}
                  options={[
                    { value: '',             label: lang === 'ru' ? 'Выберите...' : 'Select...' },
                    { value: 'none',         label: lang === 'ru' ? 'Не знаю' : 'No knowledge' },
                    { value: 'beginner',     label: lang === 'ru' ? 'Начальный' : 'Beginner' },
                    { value: 'elementary',   label: lang === 'ru' ? 'Элементарный' : 'Elementary' },
                    { value: 'intermediate', label: lang === 'ru' ? 'Средний' : 'Intermediate' },
                    { value: 'upper',        label: lang === 'ru' ? 'Выше среднего' : 'Upper-Intermediate' },
                    { value: 'advanced',     label: lang === 'ru' ? 'Продвинутый' : 'Advanced' },
                    { value: 'fluent',       label: lang === 'ru' ? 'Свободно' : 'Fluent' },
                  ]}
                />
                <Select
                  label={(lang === 'ru' ? 'Уровень знания английского языка' : 'English language level') + ' *'}
                  value={form.english_level}
                  onChange={e => setForm({ ...form, english_level: e.target.value })}
                  options={[
                    { value: '',             label: lang === 'ru' ? 'Выберите...' : 'Select...' },
                    { value: 'none',         label: lang === 'ru' ? 'Не знаю' : 'No knowledge' },
                    { value: 'beginner',     label: lang === 'ru' ? 'Начальный' : 'Beginner' },
                    { value: 'elementary',   label: lang === 'ru' ? 'Элементарный' : 'Elementary' },
                    { value: 'intermediate', label: lang === 'ru' ? 'Средний' : 'Intermediate' },
                    { value: 'upper',        label: lang === 'ru' ? 'Выше среднего' : 'Upper-Intermediate' },
                    { value: 'advanced',     label: lang === 'ru' ? 'Продвинутый' : 'Advanced' },
                    { value: 'fluent',       label: lang === 'ru' ? 'Свободно' : 'Fluent' },
                  ]}
                />
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold text-ink mb-3">
                    {lang === 'ru' ? 'Контакт близкого человека' : 'Emergency contact'}{' '}
                    <span className="text-muted font-normal text-xs">({lang === 'ru' ? 'необязательно' : 'optional'})</span>
                  </p>
                  <div className="space-y-3">
                    <Input
                      label={lang === 'ru' ? 'Имя' : 'Full name'}
                      value={form.guardian_name}
                      onChange={e => setForm({ ...form, guardian_name: e.target.value })}
                      placeholder={lang === 'ru' ? 'Иванов Иван' : 'John Doe'}
                    />
                    <Input
                      label={lang === 'ru' ? 'Номер телефона' : 'Phone number'}
                      type="tel"
                      value={form.guardian_phone}
                      onChange={e => setForm({ ...form, guardian_phone: e.target.value })}
                      placeholder="+998901234567"
                    />
                    <Input
                      label={lang === 'ru' ? 'Email' : 'Email'}
                      type="email"
                      value={form.guardian_email}
                      onChange={e => setForm({ ...form, guardian_email: e.target.value })}
                      placeholder="example@mail.com"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={handleStep1} size="lg" iconRight={<ChevronRight className="w-4 h-4" />}>
                  {t.apply.next}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 — Документы ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-ink mb-6">{t.apply.uploadTitle}</h1>
              <div className="card p-4 md:p-6 overflow-hidden">
                <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  {t.apply.required}
                </h3>
                <div className="grid gap-2">
                  {REQUIRED_DOCS.map(dtype => (
                    <DropZone
                      key={dtype}
                      docType={dtype}
                      label={lang === 'ru' ? DOCUMENT_LABELS[dtype].ru : DOCUMENT_LABELS[dtype].en}
                      uploaded={docs[dtype]}
                      onUpload={(type, file) => setDocs(d => ({ ...d, [type]: { type, file } }))}
                      onRemove={type => setDocs(d => ({ ...d, [type]: undefined }))}
                    />
                  ))}
                </div>
                <div className="divider my-4" />
                <h3 className="text-sm font-semibold text-ink mb-3">{t.apply.optional}</h3>
                <div className="grid gap-2">
                  {OPTIONAL_DOCS.map(dtype => (
                    <DropZone
                      key={dtype}
                      docType={dtype}
                      label={lang === 'ru' ? DOCUMENT_LABELS[dtype].ru : DOCUMENT_LABELS[dtype].en}
                      uploaded={docs[dtype]}
                      onUpload={(type, file) => setDocs(d => ({ ...d, [type]: { type, file } }))}
                      onRemove={type => setDocs(d => ({ ...d, [type]: undefined }))}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={() => setStep(1)} icon={<ChevronLeft className="w-4 h-4" />}>{t.apply.back}</Button>
                <Button onClick={handleStep2} iconRight={<ChevronRight className="w-4 h-4" />}>{t.apply.next}</Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3 — Выбор университетов и факультетов ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-ink">
                  {lang === 'ru' ? 'Выберите университеты' : 'Select Universities'}
                </h1>
                <span className={cn(
                  'text-sm font-semibold px-3 py-1 rounded-full',
                  selectedFaculties.length >= MAX_FACULTIES
                    ? 'bg-red-100 text-red-600'
                    : 'bg-brand-50 text-brand-600'
                )}>
                  {selectedFaculties.length}/{MAX_FACULTIES}
                </span>
              </div>
              <p className="text-sm text-muted mb-6">
                {lang === 'ru'
                  ? 'Нажмите на университет чтобы увидеть факультеты. Можно выбрать до 25 факультетов из разных университетов.'
                  : 'Click a university to see its faculties. You can select up to 25 faculties from different universities.'}
              </p>

              {universitiesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  {universities.map(uni => {
                    const isExpanded = expandedUniversity === uni.id
                    const selectedCount = selectedFaculties.filter(f => f.university_id === uni.id).length
                    return (
                      <div key={uni.id} className={cn(
                        'card overflow-hidden transition-all border-2',
                        selectedCount > 0 ? 'border-brand-300' : 'border-transparent'
                      )}>
                        {/* University header */}
                        <button
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-surface transition-colors"
                          onClick={() => setExpandedUniversity(isExpanded ? null : uni.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                              <GraduationCap className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-ink text-sm">
                                {lang === 'ru' ? uni.name_ru : uni.name_en}
                              </p>
                              <p className="text-xs text-muted">{uni.city} · {uni.country === 'SA' ? (lang === 'ru' ? 'Саудовская Аравия' : 'Saudi Arabia') : (lang === 'ru' ? 'ОАЭ' : 'UAE')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {selectedCount > 0 && (
                              <span className="badge badge-green text-[11px]">
                                {selectedCount} {lang === 'ru' ? 'выбр.' : 'sel.'}
                              </span>
                            )}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                          </div>
                        </button>

                        {/* Faculties list */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-border">
                            <p className="text-xs text-muted mt-3 mb-2 font-medium uppercase tracking-wide">
                              {lang === 'ru' ? 'Факультеты' : 'Faculties'}
                            </p>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {(uni.programs || []).map(faculty => {
                                const selected = isFacultySelected(uni.id, faculty)
                                return (
                                  <button
                                    key={faculty}
                                    onClick={() => toggleFaculty(uni, faculty)}
                                    className={cn(
                                      'flex items-center gap-2 p-2.5 rounded-lg text-sm text-left transition-all border',
                                      selected
                                        ? 'bg-brand-50 border-brand-300 text-brand-700 font-medium'
                                        : 'border-border hover:border-brand-200 hover:bg-brand-50/50 text-ink'
                                    )}
                                  >
                                    <span className={cn(
                                      'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
                                      selected ? 'bg-brand-400 border-brand-400' : 'border-border'
                                    )}>
                                      {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </span>
                                    {faculty}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Блок дополнительных университетов */}
              <div className="card p-5 border-2 border-dashed border-brand-200 bg-brand-50/30">
                <div className="flex items-start gap-3 mb-4">
                  <ExternalLink className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {lang === 'ru' ? 'Хотите добавить другой университет?' : 'Want to add another university?'}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {lang === 'ru' ? 'Выше показаны рекомендуемые нами университеты. Полный список смотрите на ' : 'Above are our recommended universities. See the full list at '}
                      <a
                        href="https://studyinsaudi.sa/ar/Institutions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 underline hover:text-brand-600"
                      >
                        studyinsaudi.sa
                      </a>
                      {lang === 'ru' ? ' и добавьте вручную:' : ' and add manually:'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customUniName}
                    onChange={e => setCustomUniName(e.target.value)}
                    placeholder={lang === 'ru' ? 'Название университета' : 'University name'}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-brand-400 bg-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customFaculty}
                      onChange={e => setCustomFaculty(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomFaculty()}
                      placeholder={lang === 'ru' ? 'Факультет / направление' : 'Faculty / program'}
                      className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-brand-400 bg-white"
                    />
                    <button
                      onClick={addCustomFaculty}
                      className="flex items-center gap-1.5 px-3 py-2 bg-brand-400 text-white text-sm font-medium rounded-lg hover:bg-brand-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {lang === 'ru' ? 'Добавить' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected faculties summary */}
              {selectedFaculties.length > 0 && (
                <div className="card p-4 bg-brand-50/50 border border-brand-200">
                  <p className="text-xs font-semibold text-brand-700 mb-2">
                    {lang === 'ru' ? 'Выбранные факультеты:' : 'Selected faculties:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFaculties.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-white border border-brand-200 text-brand-700 px-2 py-1 rounded-lg"
                      >
                        {f.faculty}
                        <button
                          onClick={() => setSelectedFaculties(prev => prev.filter((_, pi) => pi !== i))}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={() => setStep(2)} icon={<ChevronLeft className="w-4 h-4" />}>{t.apply.back}</Button>
                <Button onClick={handleStep3} iconRight={<ChevronRight className="w-4 h-4" />}>{t.apply.next}</Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4 — Пакет ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-ink mb-6">{t.apply.step3}</h1>
              <div className="grid gap-4">
                {(['SUBMISSION', 'STANDARD', 'VIP'] as ServicePackage[]).map(k => {
                  const p = PACKAGES[k]
                  return (
                    <button
                      key={k}
                      onClick={() => setPkg(k)}
                      className={cn(
                        'card p-5 text-left transition-all border-2',
                        pkg === k ? 'border-brand-400 bg-brand-50/50' : 'border-transparent hover:border-brand-200'
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-semibold text-ink">{lang === 'ru' ? p.name_ru : p.name_en}</span>
                          {k === 'STANDARD' && (
                            <span className="ml-2 badge badge-green text-[11px]">{t.pricing.popular}</span>
                          )}
                        </div>
                        <div className="text-xl font-bold text-ink">${p.priceUSD}</div>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-1">
                        {(lang === 'ru' ? p.features_ru : p.features_en).map((f, fi) => (
                          <li key={fi} className="flex items-center gap-1.5 text-xs text-muted">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={() => setStep(3)} icon={<ChevronLeft className="w-4 h-4" />}>{t.apply.back}</Button>
                <Button onClick={handleStep4} iconRight={<ChevronRight className="w-4 h-4" />}>{t.apply.next}</Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 5 — Проверка и оплата ── */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-ink mb-6">{t.apply.step4}</h1>

              <div className="card p-6 mb-4">
                <h3 className="font-semibold text-ink mb-3">{lang === 'ru' ? 'Ваши данные' : 'Your Details'}</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted">{t.apply.fullName}</span><span className="text-ink font-medium">{form.full_name}</span>
                  <span className="text-muted">{t.apply.citizenship}</span><span className="text-ink">{form.citizenship}</span>
                  <span className="text-muted">{t.apply.phone}</span><span className="text-ink">{form.phone}</span>
                  {form.telegram && <><span className="text-muted">Telegram</span><span className="text-ink">{form.telegram}</span></>}
                  {form.gender && <>
                    <span className="text-muted">{lang === 'ru' ? 'Пол' : 'Gender'}</span>
                    <span className="text-ink">{form.gender === 'male' ? (lang === 'ru' ? 'Мужчина' : 'Male') : (lang === 'ru' ? 'Женщина' : 'Female')}</span>
                  </>}
                  {form.marital_status && <>
                    <span className="text-muted">{lang === 'ru' ? 'Семейное положение' : 'Marital status'}</span>
                    <span className="text-ink">{
                      form.marital_status === 'single'   ? (lang === 'ru' ? 'Не в браке' : 'Single') :
                      form.marital_status === 'married'  ? (lang === 'ru' ? 'В браке' : 'Married') :
                      form.marital_status === 'divorced' ? (lang === 'ru' ? 'Разведён(а)' : 'Divorced') :
                      (lang === 'ru' ? 'Вдовец/Вдова' : 'Widowed')
                    }</span>
                  </>}
                  {form.arabic_level && <><span className="text-muted">{lang === 'ru' ? 'Арабский' : 'Arabic'}</span><span className="text-ink">{form.arabic_level}</span></>}
                  {form.english_level && <><span className="text-muted">{lang === 'ru' ? 'Английский' : 'English'}</span><span className="text-ink">{form.english_level}</span></>}
                  {form.guardian_name && <><span className="text-muted">{lang === 'ru' ? 'Контакт близкого' : 'Emergency contact'}</span><span className="text-ink">{form.guardian_name}</span></>}
                </div>
              </div>

              <div className="card p-6 mb-4">
                <h3 className="font-semibold text-ink mb-3">
                  {lang === 'ru' ? 'Документы' : 'Documents'}{' '}
                  <span className="badge badge-green text-[11px]">{Object.values(docs).filter(Boolean).length} файлов</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(docs) as [DocumentType, UploadedDoc | undefined][])
                    .filter(([, d]) => d != null)
                    .map(([type]) => (
                      <span key={type} className="badge badge-gray text-[11px]">
                        {lang === 'ru' ? DOCUMENT_LABELS[type].ru : DOCUMENT_LABELS[type].en}
                      </span>
                    ))}
                </div>
              </div>

              <div className="card p-6 mb-4">
                <h3 className="font-semibold text-ink mb-3">
                  {lang === 'ru' ? 'Выбранные факультеты' : 'Selected Faculties'}{' '}
                  <span className="badge badge-green text-[11px]">{selectedFaculties.length}</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFaculties.map((f, i) => (
                    <span key={i} className="badge badge-gray text-[11px]">
                      {f.university_name} — {f.faculty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-ink">
                      {lang === 'ru' ? PACKAGES[pkg].name_ru : PACKAGES[pkg].name_en}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">{lang === 'ru' ? 'Выбранный пакет' : 'Selected package'}</p>
                  </div>
                  <div className="text-2xl font-bold text-ink">${PACKAGES[pkg].priceUSD}</div>
                </div>
              </div>

              <div className="flex justify-start mb-4">
                <Button variant="secondary" onClick={() => setStep(4)} icon={<ChevronLeft className="w-4 h-4" />}>{t.apply.back}</Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* Кнопка 1 — Оплатить сейчас */}
                <button
                  disabled
                  className="relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 opacity-60 cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ink text-sm">
                      {lang === 'ru' ? 'Оплатить сейчас' : lang === 'uz' ? 'Hozir to\'lash' : 'Pay Now'}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {lang === 'ru' ? 'Карта / USDT' : 'Card / USDT'}
                    </p>
                  </div>
                  <span className="absolute top-2 right-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {lang === 'ru' ? 'Скоро' : 'Soon'}
                  </span>
                </button>

                {/* Кнопка 2 — Оплата через перевод */}
                <button
                  onClick={() => handleSubmitManual()}
                  disabled={loading}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ink text-sm">
                      {lang === 'ru' ? 'Оплата через перевод' : lang === 'uz' ? 'O\'tkazma orqali to\'lash' : 'Pay via Transfer'}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {lang === 'ru' ? 'Менеджер свяжется с вами' : 'Manager will contact you'}
                    </p>
                  </div>
                  {loading && <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Success Modal ── */}
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
            <h3 className="text-xl font-bold text-ink mb-2">
              {lang === 'ru' ? 'Заявка принята!' : lang === 'uz' ? 'Ariza qabul qilindi!' : 'Application Accepted!'}
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-4">
              {lang === 'ru'
                ? 'Заявка принята! Подключите Telegram-уведомления — бот сразу напишет вам и будет держать в курсе.'
                : lang === 'uz'
                ? 'Ariza qabul qilindi! Telegram bildirishnomalarini ulang — bot darhol yozadi.'
                : 'Application accepted! Connect Telegram notifications — the bot will write to you right away.'}
            </p>

            {/* Кнопка Telegram */}
            <a
              href={`https://t.me/tarjuman_help_bot?start=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#229ED9] text-white font-semibold hover:bg-[#1a8fc4] transition-colors mb-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.37l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.189z"/>
              </svg>
              {lang === 'ru' ? 'Получить уведомление в Telegram' : 'Get Telegram notification'}
            </a>

            <button
              onClick={() => router.push(`/dashboard?app=${appId}`)}
              className="w-full py-3 rounded-xl border border-border text-muted text-sm font-medium hover:bg-surface transition-colors"
            >
              {lang === 'ru' ? 'Перейти в личный кабинет' : lang === 'uz' ? 'Shaxsiy kabinetga o\'tish' : 'Go to Dashboard'}
            </button>
          </motion.div>
        </div>
      )}

      {/* ── Comment Modal ── */}
      {commentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <h3 className="text-lg font-bold text-ink mb-1">
              {lang === 'ru' ? 'Дополнительный комментарий' : lang === 'uz' ? 'Qo\'shimcha izoh' : 'Additional Comment'}
            </h3>
            <p className="text-sm text-muted mb-4">
              {lang === 'ru'
                ? 'Напишите любые пожелания или дополнительную информацию для нашего менеджера'
                : lang === 'uz'
                ? 'Menejerimiz uchun istalgan tilak yoki qo\'shimcha ma\'lumot yozing'
                : 'Write any wishes or additional information for our manager'}
            </p>
            <textarea
              className="w-full border border-border rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-brand-400 h-32"
              placeholder={lang === 'ru' ? 'Например: хочу общежитие, нужна стипендия, есть особые требования...' : 'E.g. need dormitory, scholarship, special requirements...'}
              value={comment}
              onChange={e => setComment(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setCommentModal(false); setStep(4) }}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted hover:bg-surface transition-colors"
              >
                {lang === 'ru' ? 'Пропустить' : 'Skip'}
              </button>
              <button
                onClick={() => { setCommentModal(false); setStep(4) }}
                className="flex-1 py-2.5 rounded-xl bg-brand-400 text-white text-sm font-semibold hover:bg-brand-500 transition-colors"
  