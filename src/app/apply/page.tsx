'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { CheckCircle2, Upload, X, FileText, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button, Input, Select } from '@/components/ui'
import { PACKAGES, DOCUMENT_LABELS } from '@/types'
import type { AppLanguage, ServicePackage, DocumentType } from '@/types'
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

const REQUIRED_DOCS: DocumentType[]  = ['PASSPORT', 'PHOTO', 'DIPLOMA', 'TRANSCRIPT']
const OPTIONAL_DOCS: DocumentType[]  = ['IELTS', 'ARABIC_CERT', 'RECOMMENDATION', 'MEDICAL', 'CRIMINAL_RECORD']

interface FormData {
  full_name:       string
  citizenship:     string
  date_of_birth:   string
  phone:           string
  telegram:        string
  education_level: string
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

export default function ApplyPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<AppLanguage>('ru')
  const t = translations[lang]

  const [step, setStep]   = useState(1)
  const [user, setUser]   = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [appId, setAppId] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    full_name:       '',
    citizenship:     '',
    date_of_birth:   '',
    phone:           '',
    telegram:        '',
    education_level: '',
  })

  const [docs, setDocs] = useState<Record<DocumentType, UploadedDoc | undefined>>({} as any)
  const [pkg,  setPkg]  = useState<ServicePackage>(
    (searchParams.get('package') as ServicePackage) || 'STANDARD'
  )

  const universityId   = searchParams.get('university') || undefined
  const countryParam   = searchParams.get('country') as 'SA' | 'AE' || 'SA'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/login?next=/apply')
      else setUser(data.session.user)
    })
  }, [router])

  // Step 1 — personal info
  const handleStep1 = () => {
    if (!form.full_name || !form.citizenship || !form.phone) {
      toast.error(lang === 'ru' ? 'Заполните обязательные поля' : 'Fill required fields')
      return
    }
    setStep(2)
  }

  // Step 2 — documents (just validate required)
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

  // Step 3 — package
  const handleStep3 = () => setStep(4)

  // Step 4 — create application + upload docs + redirect to payment
  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)
    try {
      // 1. Create application
      const { data: app, error: appErr } = await supabase
        .from('applications')
        .insert({
          user_id:         user.id,
          university_id:   universityId || null,
          country:         countryParam,
          service_package: pkg,
          status:          'REGISTERED',
          full_name:       form.full_name,
          citizenship:     form.citizenship,
          date_of_birth:   form.date_of_birth || null,
          phone:           form.phone,
          telegram:        form.telegram || null,
          education_level: form.education_level || null,
        })
        .select()
        .single()

      if (appErr) throw appErr
      setAppId(app.id)

      // 2. Upload documents
      const uploadPromises = Object.entries(docs)
        .filter(([, d]) => d != null)
        .map(async ([type, doc]) => {
          const docData = doc!
          const ext     = docData.file.name.split('.').pop()
          const path    = `${user.id}/${app.id}/${type}_${uuidv4()}.${ext}`

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

      // 3. Redirect to payment
      const res = await fetch('/api/payments/create-checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const STEPS = [t.apply.step1, t.apply.step2, t.apply.step3, t.apply.step4]

  if (!user) return null

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <div className="bg-white border-b border-border">
        <div className="container-narrow h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-ink">
            <span className="w-7 h-7 bg-brand-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">T</span>
            TARJUMAN
          </Link>
          <div className="flex items-center gap-4">
            {STEPS.map((s, i) => (
              <div key={i} className={cn(
                'flex items-center gap-1.5 text-sm',
                i + 1 === step ? 'text-brand-500 font-medium' : i + 1 < step ? 'text-brand-400' : 'text-muted'
              )}>
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                  i + 1 < step  ? 'bg-brand-400 text-white' :
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
          {/* ── STEP 1 ── */}
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
                <Input
                  label={t.apply.citizenship + ' *'}
                  value={form.citizenship}
                  onChange={e => setForm({ ...form, citizenship: e.target.value })}
                  placeholder="Узбекистан"
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
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={handleStep1} size="lg" iconRight={<ChevronRight className="w-4 h-4" />}>
                  {t.apply.next}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-ink mb-6">{t.apply.uploadTitle}</h1>

              <div className="card p-6">
                <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  {t.apply.required}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
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

                <div className="divider my-5" />

                <h3 className="text-sm font-semibold text-ink mb-3">{t.apply.optional}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
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

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
                            <span className="ml-2 badge badge-green text-[11px]">
                              {t.pricing.popular}
                            </span>
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
                <Button variant="secondary" onClick={() => setStep(2)} icon={<ChevronLeft className="w-4 h-4" />}>{t.apply.back}</Button>
                <Button onClick={handleStep3} iconRight={<ChevronRight className="w-4 h-4" />}>{t.apply.next}</Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4 — Review & Pay ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-bold text-ink mb-6">{t.apply.step4}</h1>

              {/* Summary */}
              <div className="card p-6 mb-4">
                <h3 className="font-semibold text-ink mb-3">
                  {lang === 'ru' ? 'Ваши данные' : 'Your Details'}
                </h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted">{t.apply.fullName}</span><span className="text-ink font-medium">{form.full_name}</span>
                  <span className="text-muted">{t.apply.citizenship}</span><span className="text-ink">{form.citizenship}</span>
                  <span className="text-muted">{t.apply.phone}</span><span className="text-ink">{form.phone}</span>
                  {form.telegram && <><span className="text-muted">Telegram</span><span className="text-ink">{form.telegram}</span></>}
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

              <div className="card p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-ink">
                      {lang === 'ru' ? PACKAGES[pkg].name_ru : PACKAGES[pkg].name_en}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      {lang === 'ru' ? 'Выбранный пакет' : 'Selected package'}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-ink">${PACKAGES[pkg].priceUSD}</div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(3)} icon={<ChevronLeft className="w-4 h-4" />}>{t.apply.back}</Button>
                <Button
                  size="lg"
                  loading={loading}
                  onClick={handleSubmit}
                  iconRight={<ChevronRight className="w-5 h-5" />}
                >
                  {t.apply.submit} — ${PACKAGES[pkg].priceUSD}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
