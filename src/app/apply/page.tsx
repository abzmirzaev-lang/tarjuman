'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect, useCallback, Suspense } from 'react'
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

const DRAFT_KEY = 'tarjuman_apply_draft'

function ApplyContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [lang, setLang] = useLanguage()
  const t = translations[lang]

  const [step, setStep]     = useState(0)
  const [selectedCountry, setSelectedCountry] = useState<string>('')

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

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.form)             setForm(draft.form)
        if (draft.selectedCountry)  { setSelectedCountry(draft.selectedCountry); if (draft.step) setStep(draft.step) }
        if (draft.selectedFaculties) setSelectedFaculties(draft.selectedFaculties)
        if (draft.pkg)              setPkg(draft.pkg)
        if (draft.comment)          setComment(draft.comment)
      }
    } catch {}
  }, [])

  // Save draft to localStorage whenever key state changes
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step, selectedCountry, selectedFaculties, pkg, comment }))
    } catch {}
  }, [form, step, selectedFaculties, pkg, comment])

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
          country:            selectedCountry,
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

      // Clear draft
      try { localStorage.removeItem(DRAFT_KEY) } catch {}

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
          country:            selectedCountry,
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

      // Clear draft
      try { localStorage.removeItem(DRAFT_KEY) } catch {}

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

  const progressPct = step === 0 ? 0 : ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <svg viewBox="0 0 156 36" width="120" height="28" aria-label="TARJUMAN">
              <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
              <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
              <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
            </svg>
          </Link>

          {/* Steps — desktop */}
          <div className={cn("hidden md:flex items-center gap-0", step === 0 && "invisible")}>
            {STEPS.map((s, i) => {
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
                  {i < STEPS.length - 1 && (
                    <div className={cn('w-8 h-0.5 mx-1 mb-4 rounded-full transition-all', done ? 'bg-[#1B4332]' : 'bg-gray-200')} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step counter — mobile */}
          {step > 0 && (
            <div className="md:hidden flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">{step}/{STEPS.length}</span>
              <span className="text-sm text-muted">{STEPS[step - 1]}</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-[#1B4332] to-[#C9922A]"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
        <AnimatePresence mode="wait">

          {/* ── STEP 0 — Выбор страны ── */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <div className="mb-10 text-center">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-2">{lang === 'ru' ? 'Начало' : 'Start'}</p>
                <h1 className="text-3xl font-bold text-ink mb-2">{lang === 'ru' ? 'Выберите страну' : 'Select Country'}</h1>
                <p className="text-muted text-sm">{lang === 'ru' ? 'В какую страну вы хотите подать заявку?' : 'Which country do you want to apply to?'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  { code: 'SA', flag: '🇸🇦', nameRu: 'Саудовская Аравия', nameEn: 'Saudi Arabia' },
                  { code: 'AE', flag: '🇦🇪', nameRu: 'ОАЭ', nameEn: 'UAE' },
                  { code: 'QA', flag: '🇶🇦', nameRu: 'Катар', nameEn: 'Qatar' },
                  { code: 'KW', flag: '🇰🇼', nameRu: 'Кувейт', nameEn: 'Kuwait' },
                  { code: 'TR', flag: '🇹🇷', nameRu: 'Турция', nameEn: 'Turkey' },
                ].map(country => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country.code)}
                    className={cn(
                      'flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all shadow-sm',
                      selectedCountry === country.code
                        ? 'border-[#1B4332] bg-[#1B4332]/5 shadow-md'
                        : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md'
                    )}
                  >
                    <span className="text-4xl">{country.flag}</span>
                    <div className="flex-1">
                      <p className="font-bold text-ink text-base">{lang === 'ru' ? country.nameRu : country.nameEn}</p>
                    </div>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                      selectedCountry === country.code ? 'border-[#1B4332] bg-[#1B4332]' : 'border-gray-300'
                    )}>
                      {selectedCountry === country.code && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => { if (selectedCountry) setStep(1) }}
                  disabled={!selectedCountry}
                  className={cn(
                    'flex items-center gap-2 px-8 py-3.5 text-white text-sm font-semibold rounded-xl transition-all shadow-sm',
                    selectedCountry ? 'bg-[#1B4332] hover:bg-[#1B4332]/90' : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  {lang === 'ru' ? 'Далее' : 'Next'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 1 — Личные данные ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{lang === 'ru' ? 'Шаг 1 из 5' : 'Step 1 of 5'}</p>
                <h1 className="text-3xl font-bold text-ink">{t.apply.step1}</h1>
                <p className="text-muted mt-1 text-sm">{lang === 'ru' ? 'Заполните свои личные данные для заявки' : 'Fill in your personal details for the application'}</p>
              </div>

              {/* Section: Основная информация */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ru' ? 'Основная информация' : 'Basic information'}</p>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">{t.apply.fullName} <span className="text-red-400">*</span></label>
                    <input
                      value={form.full_name}
                      onChange={e => setForm({ ...form, full_name: e.target.value })}
                      placeholder="Иванов Иван Иванович"
                      className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">{lang === 'ru' ? 'Пол' : 'Gender'} <span className="text-red-400">*</span></label>
                      <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white appearance-none">
                        <option value="">{lang === 'ru' ? 'Выберите...' : 'Select...'}</option>
                        <option value="male">{lang === 'ru' ? 'Мужчина' : 'Male'}</option>
                        <option value="female">{lang === 'ru' ? 'Женщина' : 'Female'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">{lang === 'ru' ? 'Семейное положение' : 'Marital status'} <span className="text-red-400">*</span></label>
                      <select value={form.marital_status} onChange={e => setForm({ ...form, marital_status: e.target.value })}
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white appearance-none">
                        <option value="">{lang === 'ru' ? 'Выберите...' : 'Select...'}</option>
                        <option value="single">{lang === 'ru' ? 'Не в браке' : 'Single'}</option>
                        <option value="married">{lang === 'ru' ? 'В браке' : 'Married'}</option>
                        <option value="divorced">{lang === 'ru' ? 'Разведён(а)' : 'Divorced'}</option>
                        <option value="widowed">{lang === 'ru' ? 'Вдовец/Вдова' : 'Widowed'}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">{t.apply.citizenship} <span className="text-red-400">*</span></label>
                      <select value={form.citizenship} onChange={e => setForm({ ...form, citizenship: e.target.value })}
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white appearance-none">
                        <option value="">{lang === 'ru' ? 'Страна...' : 'Country...'}</option>
                        {['Узбекистан','Казахстан','Таджикистан','Кыргызстан','Туркменистан','Азербайджан','Россия','Украина','Беларусь','Молдова','Грузия','Армения'].map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="Другое">{lang === 'ru' ? 'Другое' : 'Other'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">{t.apply.dob}</label>
                      <input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">{t.apply.education}</label>
                    <select value={form.education_level} onChange={e => setForm({ ...form, education_level: e.target.value })}
                      className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white appearance-none">
                      {EDUCATION_OPTIONS_RU.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Контакты */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ru' ? 'Контакты' : 'Contacts'}</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">{t.apply.phone} <span className="text-red-400">*</span></label>
                      <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+998901234567"
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">Telegram</label>
                      <input value={form.telegram} onChange={e => setForm({ ...form, telegram: e.target.value })} placeholder="@username"
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Языки */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ru' ? 'Знание языков' : 'Language proficiency'}</p>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">{lang === 'ru' ? 'Арабский' : 'Arabic'} <span className="text-red-400">*</span></label>
                    <select value={form.arabic_level} onChange={e => setForm({ ...form, arabic_level: e.target.value })}
                      className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white appearance-none">
                      <option value="">{lang === 'ru' ? 'Выберите...' : 'Select...'}</option>
                      {[['none','Не знаю','No knowledge'],['beginner','Начальный','Beginner'],['elementary','Элементарный','Elementary'],['intermediate','Средний','Intermediate'],['upper','Выше среднего','Upper-Intermediate'],['advanced','Продвинутый','Advanced'],['fluent','Свободно','Fluent']].map(([v,ru,en]) => <option key={v} value={v}>{lang === 'ru' ? ru : en}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">{lang === 'ru' ? 'Английский' : 'English'} <span className="text-red-400">*</span></label>
                    <select value={form.english_level} onChange={e => setForm({ ...form, english_level: e.target.value })}
                      className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white appearance-none">
                      <option value="">{lang === 'ru' ? 'Выберите...' : 'Select...'}</option>
                      {[['none','Не знаю','No knowledge'],['beginner','Начальный','Beginner'],['elementary','Элементарный','Elementary'],['intermediate','Средний','Intermediate'],['upper','Выше среднего','Upper-Intermediate'],['advanced','Продвинутый','Advanced'],['fluent','Свободно','Fluent']].map(([v,ru,en]) => <option key={v} value={v}>{lang === 'ru' ? ru : en}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Контакт близкого */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ru' ? 'Контакт близкого человека' : 'Emergency contact'}</p>
                  <span className="text-[11px] text-muted bg-gray-100 px-2 py-0.5 rounded-full">{lang === 'ru' ? 'Необязательно' : 'Optional'}</span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">{lang === 'ru' ? 'Имя' : 'Full name'}</label>
                    <input value={form.guardian_name} onChange={e => setForm({ ...form, guardian_name: e.target.value })} placeholder={lang === 'ru' ? 'Иванов Иван' : 'John Doe'}
                      className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">{lang === 'ru' ? 'Телефон' : 'Phone'}</label>
                      <input type="tel" value={form.guardian_phone} onChange={e => setForm({ ...form, guardian_phone: e.target.value })} placeholder="+998901234567"
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
                      <input type="email" value={form.guardian_email} onChange={e => setForm({ ...form, guardian_email: e.target.value })} placeholder="example@mail.com"
                        className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-4 h-4" /> {t.apply.back}
                </button>
                <button onClick={handleStep1} className="flex items-center gap-2 px-8 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm">
                  {t.apply.next} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 — Документы ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{lang === 'ru' ? 'Шаг 2 из 5' : 'Step 2 of 5'}</p>
                <h1 className="text-3xl font-bold text-ink">{t.apply.uploadTitle}</h1>
                <p className="text-muted mt-1 text-sm">{lang === 'ru' ? 'Загрузите ваши документы. PDF, JPG или PNG, до 10 МБ каждый.' : 'Upload your documents. PDF, JPG or PNG, up to 10MB each.'}</p>
              </div>

              {/* Required docs */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">{t.apply.required}</p>
                </div>
                <div className="p-4 grid gap-2">
                  {REQUIRED_DOCS.map(dtype => (
                    <DropZone key={dtype} docType={dtype}
                      label={lang === 'ru' ? DOCUMENT_LABELS[dtype].ru : DOCUMENT_LABELS[dtype].en}
                      uploaded={docs[dtype]}
                      onUpload={(type, file) => setDocs(d => ({ ...d, [type]: { type, file } }))}
                      onRemove={type => setDocs(d => ({ ...d, [type]: undefined }))}
                    />
                  ))}
                </div>
              </div>

              {/* Optional docs */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">{t.apply.optional}</p>
                  <span className="text-[11px] text-muted bg-gray-100 px-2 py-0.5 rounded-full">{lang === 'ru' ? 'Необязательно' : 'Optional'}</span>
                </div>
                <div className="p-4 grid gap-2">
                  {OPTIONAL_DOCS.map(dtype => (
                    <DropZone key={dtype} docType={dtype}
                      label={lang === 'ru' ? DOCUMENT_LABELS[dtype].ru : DOCUMENT_LABELS[dtype].en}
                      uploaded={docs[dtype]}
                      onUpload={(type, file) => setDocs(d => ({ ...d, [type]: { type, file } }))}
                      onRemove={type => setDocs(d => ({ ...d, [type]: undefined }))}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-4 h-4" /> {t.apply.back}
                </button>
                <button onClick={handleStep2} className="flex items-center gap-2 px-8 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm">
                  {t.apply.next} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3 — Университеты ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{lang === 'ru' ? 'Шаг 3 из 5' : 'Step 3 of 5'}</p>
                  <h1 className="text-3xl font-bold text-ink">{lang === 'ru' ? 'Университеты' : 'Universities'}</h1>
                  <p className="text-muted mt-1 text-sm">{lang === 'ru' ? 'Выберите до 25 факультетов' : 'Select up to 25 faculties'}</p>
                </div>
                <span className={cn(
                  'text-sm font-bold px-4 py-2 rounded-xl mt-1 shrink-0',
                  selectedFaculties.length >= MAX_FACULTIES ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#1B4332]/10 text-[#1B4332]'
                )}>
                  {selectedFaculties.length}/{MAX_FACULTIES}
                </span>
              </div>

              {universitiesLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {universities.map(uni => {
                    const isExpanded    = expandedUniversity === uni.id
                    const selectedCount = selectedFaculties.filter(f => f.university_id === uni.id).length
                    return (
                      <div key={uni.id} className={cn(
                        'bg-white rounded-2xl border-2 overflow-hidden transition-all shadow-sm',
                        selectedCount > 0 ? 'border-[#1B4332]/30 shadow-md' : 'border-transparent hover:border-gray-200'
                      )}>
                        <button className="w-full p-4 flex items-center justify-between text-left" onClick={() => setExpandedUniversity(isExpanded ? null : uni.id)}>
                          <div className="flex items-center gap-3">
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all',
                              selectedCount > 0 ? 'bg-[#1B4332] text-white' : 'bg-gray-100 text-gray-500'
                            )}>
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-ink text-sm">{lang === 'ru' ? uni.name_ru : uni.name_en}</p>
                              <p className="text-xs text-muted">{uni.city} · {uni.country === 'SA' ? (lang === 'ru' ? 'Саудовская Аравия' : 'Saudi Arabia') : (lang === 'ru' ? 'ОАЭ' : 'UAE')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {selectedCount > 0 && (
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#1B4332] text-white">
                                {selectedCount}
                              </span>
                            )}
                            <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center transition-all', isExpanded ? 'bg-gray-100' : 'bg-gray-50')}>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-muted" />}
                            </div>
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-gray-50">
                            <p className="text-[11px] text-muted mt-3 mb-2 font-semibold uppercase tracking-widest">{lang === 'ru' ? 'Факультеты' : 'Faculties'}</p>
                            <div className="grid sm:grid-cols-2 gap-1.5">
                              {(uni.programs || []).map(faculty => {
                                const selected = isFacultySelected(uni.id, faculty)
                                return (
                                  <button key={faculty} onClick={() => toggleFaculty(uni, faculty)}
                                    className={cn(
                                      'flex items-center gap-2.5 p-3 rounded-xl text-sm text-left transition-all border',
                                      selected ? 'bg-[#1B4332]/5 border-[#1B4332]/20 text-[#1B4332] font-medium' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-ink'
                                    )}>
                                    <span className={cn(
                                      'w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                                      selected ? 'bg-[#1B4332] border-[#1B4332]' : 'border-gray-300'
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

              {/* Custom university */}
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-5 mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{lang === 'ru' ? 'Добавить другой университет' : 'Add another university'}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {lang === 'ru' ? 'Полный список на ' : 'Full list at '}
                      <a href="https://studyinsaudi.sa/ar/Institutions" target="_blank" rel="noopener noreferrer" className="text-[#1B4332] underline">studyinsaudi.sa</a>
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <input type="text" value={customUniName} onChange={e => setCustomUniName(e.target.value)}
                    placeholder={lang === 'ru' ? 'Название университета' : 'University name'}
                    className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B4332] bg-white" />
                  <div className="flex gap-2">
                    <input type="text" value={customFaculty} onChange={e => setCustomFaculty(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomFaculty()}
                      placeholder={lang === 'ru' ? 'Факультет / направление' : 'Faculty / program'}
                      className="flex-1 h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B4332] bg-white" />
                    <button onClick={addCustomFaculty} className="flex items-center gap-1.5 px-4 h-10 bg-[#1B4332] text-white text-sm font-medium rounded-lg hover:bg-[#1B4332]/90 transition-colors">
                      <Plus className="w-4 h-4" /> {lang === 'ru' ? 'Добавить' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected summary */}
              {selectedFaculties.length > 0 && (
                <div className="bg-[#1B4332]/5 rounded-2xl border border-[#1B4332]/10 p-4 mb-6">
                  <p className="text-xs font-semibold text-[#1B4332] mb-2">{lang === 'ru' ? 'Выбранные факультеты:' : 'Selected:'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFaculties.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs bg-white border border-[#1B4332]/20 text-[#1B4332] px-2.5 py-1 rounded-lg font-medium">
                        {f.faculty}
                        <button onClick={() => setSelectedFaculties(prev => prev.filter((_, pi) => pi !== i))} className="hover:text-red-500 transition-colors ml-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-4 h-4" /> {t.apply.back}
                </button>
                <button onClick={handleStep3} className="flex items-center gap-2 px-8 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm">
                  {t.apply.next} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4 — Пакет ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{lang === 'ru' ? 'Шаг 4 из 5' : 'Step 4 of 5'}</p>
                <h1 className="text-3xl font-bold text-ink">{t.apply.step3}</h1>
                <p className="text-muted mt-1 text-sm">{lang === 'ru' ? 'Выберите подходящий тарифный план' : 'Choose the right plan for you'}</p>
              </div>

              <div className="space-y-3 mb-8">
                {(['SUBMISSION', 'STANDARD', 'VIP'] as ServicePackage[]).map(k => {
                  const p       = PACKAGES[k]
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
                            <p className="font-bold text-ink text-base">{lang === 'ru' ? p.name_ru : p.name_en}</p>
                            {k === 'STANDARD' && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{t.pricing.popular}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-ink">${p.priceUSD}</p>
                          <p className="text-xs text-muted">{lang === 'ru' ? 'разово' : 'one-time'}</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {(lang === 'ru' ? p.features_ru : p.features_en).map((f, fi) => (
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

              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-4 h-4" /> {t.apply.back}
                </button>
                <button onClick={handleStep4} className="flex items-center gap-2 px-8 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm">
                  {t.apply.next} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 5 — Проверка и оплата ── */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

              <div className="mb-8">
                <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest mb-1">{lang === 'ru' ? 'Шаг 5 из 5' : 'Step 5 of 5'}</p>
                <h1 className="text-3xl font-bold text-ink">{t.apply.step4}</h1>
                <p className="text-muted mt-1 text-sm">{lang === 'ru' ? 'Проверьте данные и выберите способ оплаты' : 'Review your details and choose payment method'}</p>
              </div>

              {/* Summary cards */}
              <div className="space-y-3 mb-6">

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ru' ? 'Личные данные' : 'Personal info'}</p>
                    <button onClick={() => setStep(1)} className="text-xs text-[#1B4332] font-medium hover:underline">{lang === 'ru' ? 'Изменить' : 'Edit'}</button>
                  </div>
                  <div className="px-5 py-4 grid grid-cols-2 gap-y-2.5 text-sm">
                    <span className="text-muted">{t.apply.fullName}</span><span className="text-ink font-medium">{form.full_name}</span>
                    <span className="text-muted">{t.apply.citizenship}</span><span className="text-ink">{form.citizenship}</span>
                    <span className="text-muted">{t.apply.phone}</span><span className="text-ink">{form.phone}</span>
                    {form.telegram && <><span className="text-muted">Telegram</span><span className="text-ink">{form.telegram}</span></>}
                    {form.arabic_level && <><span className="text-muted">{lang === 'ru' ? 'Арабский' : 'Arabic'}</span><span className="text-ink">{form.arabic_level}</span></>}
                    {form.english_level && <><span className="text-muted">{lang === 'ru' ? 'Английский' : 'English'}</span><span className="text-ink">{form.english_level}</span></>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ru' ? 'Документы' : 'Documents'}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{Object.values(docs).filter(Boolean).length} {lang === 'ru' ? 'файлов' : 'files'}</span>
                      <button onClick={() => setStep(2)} className="text-xs text-[#1B4332] font-medium hover:underline">{lang === 'ru' ? 'Изменить' : 'Edit'}</button>
                    </div>
                  </div>
                  <div className="px-5 py-4 flex flex-wrap gap-2">
                    {(Object.entries(docs) as [DocumentType, UploadedDoc | undefined][]).filter(([, d]) => d != null).map(([type]) => (
                      <span key={type} className="inline-flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 text-ink px-3 py-1.5 rounded-lg font-medium">
                        <FileText className="w-3 h-3 text-muted" />
                        {lang === 'ru' ? DOCUMENT_LABELS[type].ru : DOCUMENT_LABELS[type].en}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">{lang === 'ru' ? 'Университеты' : 'Universities'}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{selectedFaculties.length}</span>
                      <button onClick={() => setStep(3)} className="text-xs text-[#1B4332] font-medium hover:underline">{lang === 'ru' ? 'Изменить' : 'Edit'}</button>
                    </div>
                  </div>
                  <div className="px-5 py-4 flex flex-wrap gap-1.5">
                    {selectedFaculties.map((f, i) => (
                      <span key={i} className="text-xs bg-gray-50 border border-gray-200 text-ink px-2.5 py-1 rounded-lg">{f.university_name} — {f.faculty}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1B4332] rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-xs mb-0.5">{lang === 'ru' ? 'Выбранный пакет' : 'Selected plan'}</p>
                    <p className="text-white font-bold text-lg">{lang === 'ru' ? PACKAGES[pkg].name_ru : PACKAGES[pkg].name_en}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">${PACKAGES[pkg].priceUSD}</p>
                    <button onClick={() => setStep(4)} className="text-white/60 text-xs hover:text-white transition-colors">{lang === 'ru' ? 'Изменить' : 'Change'}</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-start mb-5">
                <button onClick={() => setStep(4)} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-ink text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-4 h-4" /> {t.apply.back}
                </button>
              </div>

              {/* Payment options */}
              <div className="grid sm:grid-cols-2 gap-3">
                <button disabled className="relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-white opacity-50 cursor-not-allowed">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-ink text-sm">{lang === 'ru' ? 'Оплатить сейчас' : 'Pay Now'}</p>
                    <p className="text-xs text-muted mt-0.5">{lang === 'ru' ? 'Карта / USDT' : 'Card / USDT'}</p>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{lang === 'ru' ? 'Скоро' : 'Soon'}</span>
                </button>

                <button onClick={() => handleSubmitManual()} disabled={loading}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#1B4332] bg-[#1B4332]/5 hover:bg-[#1B4332]/10 transition-all cursor-pointer shadow-sm">
                  <div className="w-12 h-12 bg-[#1B4332] rounded-2xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-[#1B4332] text-sm">{lang === 'ru' ? 'Оплата через перевод' : 'Pay via Transfer'}</p>
                    <p className="text-xs text-muted mt-0.5">{lang === 'ru' ? 'Менеджер свяжется с вами' : 'Manager will contact you'}</p>
                  </div>
                  {loading && <div className="w-5 h-5 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />}
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
                >
                  {lang === 'ru' ? 'Продолжить' : lang === 'uz' ? 'Davom etish' : 'Continue'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-muted">Загрузка...</div>
      </div>
    }>
      <ApplyContent />
    </Suspense>
  )
}
