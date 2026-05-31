'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  ChevronLeft, ChevronDown, ChevronUp, CheckCircle2,
  Upload, X, FileText, GraduationCap, Plus, ExternalLink,
  Lock, Save, Trash2
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button, Input, Select } from '@/components/ui'
import { DOCUMENT_LABELS } from '@/types'
import type { ApplicationRow, DocumentRow, DocumentType, UniversityRow, AppLanguage } from '@/types'
import { translations } from '@/i18n'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

const EDITABLE_STATUSES = ['REGISTERED', 'PAID']

const EDUCATION_OPTIONS_RU = [
  { value: '',            label: 'Выберите...' },
  { value: 'secondary',  label: 'Среднее образование' },
  { value: 'vocational', label: 'Среднее специальное' },
  { value: 'bachelor',   label: 'Бакалавриат' },
  { value: 'master',     label: 'Магистратура' },
]

const REQUIRED_DOCS: DocumentType[] = ['PASSPORT', 'PHOTO', 'DIPLOMA', 'MEDICAL', 'CRIMINAL_RECORD']
const OPTIONAL_DOCS: DocumentType[] = ['IELTS', 'ARABIC_CERT', 'RECOMMENDATION', 'TRANSCRIPT']
const MAX_FACULTIES = 25

interface SelectedFaculty {
  university_id:   string
  university_name: string
  faculty:         string
}

interface NewDoc {
  type: DocumentType
  file: File
}

function DropZone({ docType, label, onUpload, newDoc, onRemoveNew }: {
  docType:     DocumentType
  label:       string
  onUpload:    (type: DocumentType, file: File) => void
  newDoc?:     NewDoc
  onRemoveNew: (type: DocumentType) => void
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

  if (newDoc) {
    return (
      <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl">
        <FileText className="w-5 h-5 text-brand-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink truncate">{label}</p>
          <p className="text-xs text-muted truncate">{newDoc.file.name} <span className="text-brand-500">(новый)</span></p>
        </div>
        <button onClick={() => onRemoveNew(docType)} className="p-1 hover:bg-brand-100 rounded-lg">
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

export default function EditApplicationPage() {
  const router = useRouter()
  const params = useParams()
  const appId  = params.id as string

  const [lang, setLang] = useLanguage()
  const t = translations[lang]

  const [user,       setUser]       = useState<any>(null)
  const [app,        setApp]        = useState<ApplicationRow | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [blocked,    setBlocked]    = useState(false)

  // Form state
  const [form, setForm] = useState({
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

  // Documents state
  const [existingDocs,  setExistingDocs]  = useState<DocumentRow[]>([])
  const [docsToDelete,  setDocsToDelete]  = useState<string[]>([])  // doc IDs to delete
  const [newDocs,       setNewDocs]       = useState<Record<string, NewDoc>>({})

  // Universities state
  const [selectedFaculties,     setSelectedFaculties]     = useState<SelectedFaculty[]>([])
  const [universities,          setUniversities]          = useState<UniversityRow[]>([])
  const [universitiesLoading,   setUniversitiesLoading]   = useState(false)
  const [expandedUniversity,    setExpandedUniversity]    = useState<string | null>(null)
  const [customUniName,         setCustomUniName]         = useState('')
  const [customFaculty,         setCustomFaculty]         = useState('')

  // Active section
  const [section, setSection] = useState<'personal' | 'documents' | 'universities'>('personal')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/login'); return }
      setUser(data.session.user)

      // Load application
      const { data: appData } = await supabase
        .from('applications')
        .select('*')
        .eq('id', appId)
        .eq('user_id', data.session.user.id)
        .single()

      if (!appData) { router.push('/dashboard'); return }
      setApp(appData)

      if (!EDITABLE_STATUSES.includes(appData.status)) {
        setBlocked(true)
        setLoading(false)
        return
      }

      // Populate form
      setForm({
        full_name:       appData.full_name       ?? '',
        citizenship:     appData.citizenship     ?? '',
        date_of_birth:   appData.date_of_birth   ?? '',
        phone:           appData.phone           ?? '',
        telegram:        appData.telegram        ?? '',
        education_level: appData.education_level ?? '',
        gender:          appData.gender          ?? '',
        marital_status:  appData.marital_status  ?? '',
        arabic_level:    appData.arabic_level    ?? '',
        english_level:   appData.english_level   ?? '',
        guardian_name:   appData.guardian_name   ?? '',
        guardian_phone:  appData.guardian_phone  ?? '',
        guardian_email:  appData.guardian_email  ?? '',
      })

      // Populate faculties
      if (Array.isArray(appData.selected_faculties)) {
        setSelectedFaculties(appData.selected_faculties)
      }

      // Load existing documents
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', appId)
      setExistingDocs(docsData ?? [])

      setLoading(false)
    })
  }, [appId, router])

  // Load universities when switching to that section
  useEffect(() => {
    if (section === 'universities' && universities.length === 0) {
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
  }, [section, universities.length])

  const toggleFaculty = (university: UniversityRow, faculty: string) => {
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

  const isFacultySelected = (uniId: string, faculty: string) =>
    selectedFaculties.some(f => f.university_id === uniId && f.faculty === faculty)

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

  const markDocForDelete = (docId: string) => {
    setDocsToDelete(prev => [...prev, docId])
  }

  const unmarkDocForDelete = (docId: string) => {
    setDocsToDelete(prev => prev.filter(id => id !== docId))
  }

  const handleSave = async () => {
    if (!user || !app) return

    if (!form.full_name || !form.citizenship || !form.phone || !form.gender || !form.marital_status || !form.arabic_level || !form.english_level) {
      toast.error(lang === 'ru' ? 'Заполните все обязательные поля' : 'Fill all required fields')
      setSection('personal')
      return
    }

    setSaving(true)
    try {
      // Update application
      const { error: updateErr } = await supabase
        .from('applications')
        .update({
          full_name:          form.full_name,
          citizenship:        form.citizenship,
          date_of_birth:      form.date_of_birth || null,
          phone:              form.phone,
          telegram:           form.telegram || null,
          education_level:    form.education_level || null,
          gender:             form.gender,
          marital_status:     form.marital_status,
          arabic_level:       form.arabic_level,
          english_level:      form.english_level,
          guardian_name:      form.guardian_name || null,
          guardian_phone:     form.guardian_phone || null,
          guardian_email:     form.guardian_email || null,
          selected_faculties: selectedFaculties,
          updated_at:         new Date().toISOString(),
        })
        .eq('id', appId)

      if (updateErr) throw updateErr

      // Delete marked documents
      for (const docId of docsToDelete) {
        const doc = existingDocs.find(d => d.id === docId)
        if (doc) {
          await supabase.storage.from('documents').remove([doc.file_path])
          await supabase.from('documents').delete().eq('id', docId)
        }
      }

      // Upload new documents
      for (const [, newDoc] of Object.entries(newDocs)) {
        const ext  = newDoc.file.name.split('.').pop()
        const path = `${user.id}/${appId}/${newDoc.type}_${uuidv4()}.${ext}`

        const { error: storageErr } = await supabase.storage
          .from('documents')
          .upload(path, newDoc.file, { upsert: true })

        if (storageErr) throw storageErr

        // Remove existing doc of same type first (if exists and not already deleted)
        const existing = existingDocs.find(d => d.type === newDoc.type && !docsToDelete.includes(d.id))
        if (existing) {
          await supabase.storage.from('documents').remove([existing.file_path])
          await supabase.from('documents').delete().eq('id', existing.id)
        }

        await supabase.from('documents').insert({
          application_id: appId,
          user_id:        user.id,
          type:           newDoc.type,
          file_name:      newDoc.file.name,
          file_path:      path,
          file_size:      newDoc.file.size,
          mime_type:      newDoc.file.type,
        })
      }

      toast.success(lang === 'ru' ? 'Изменения сохранены' : 'Changes saved')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || t.common.error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (blocked) return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border p-10 text-center max-w-sm">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-gray-400" />
        </div>
        <h2 className="text-lg font-bold text-ink mb-2">
          {lang === 'ru' ? 'Редактирование недоступно' : 'Editing not available'}
        </h2>
        <p className="text-sm text-muted mb-6">
          {lang === 'ru'
            ? 'Заявка уже находится в обработке. Изменения больше невозможны.'
            : 'Your application is already being processed. Changes are no longer possible.'}
        </p>
        <Link href="/dashboard">
          <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-ink text-white rounded-xl text-sm font-medium hover:bg-ink/90 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            {lang === 'ru' ? 'Назад в кабинет' : 'Back to dashboard'}
          </button>
        </Link>
      </div>
    </div>
  )

  const SECTIONS = [
    { key: 'personal'     as const, label: lang === 'ru' ? 'Личные данные'  : 'Personal Info' },
    { key: 'documents'    as const, label: lang === 'ru' ? 'Документы'      : 'Documents' },
    { key: 'universities' as const, label: lang === 'ru' ? 'Университеты'   : 'Universities' },
  ]

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-2xl mx-auto h-14 flex items-center justify-between px-4">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors">
              <ChevronLeft className="w-4 h-4" />
              {lang === 'ru' ? 'Назад' : 'Back'}
            </button>
          </Link>
          <h1 className="text-sm font-semibold text-ink">
            {lang === 'ru' ? 'Редактировать заявку' : 'Edit Application'}
          </h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-white text-sm font-semibold rounded-xl hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Save className="w-4 h-4" />
            }
            {lang === 'ru' ? 'Сохранить' : 'Save'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Section tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-2xl p-1 mb-6">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-xl transition-all',
                section === s.key ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <motion.div key={section} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

          {/* ─── ЛИЧНЫЕ ДАННЫЕ ─── */}
          {section === 'personal' && (
            <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
              <Input
                label={(lang === 'ru' ? 'ФИО' : 'Full name') + ' *'}
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
                label={(lang === 'ru' ? 'Гражданство' : 'Citizenship') + ' *'}
                value={form.citizenship}
                onChange={e => setForm({ ...form, citizenship: e.target.value })}
                options={[
                  { value: '', label: lang === 'ru' ? 'Выберите страну...' : 'Select country...' },
                  { value: 'Узбекистан',   label: 'Узбекистан' },
                  { value: 'Казахстан',    label: 'Казахстан' },
                  { value: 'Таджикистан',  label: 'Таджикистан' },
                  { value: 'Кыргызстан',   label: 'Кыргызстан' },
                  { value: 'Туркменистан', label: 'Туркменистан' },
                  { value: 'Азербайджан',  label: 'Азербайджан' },
                  { value: 'Россия',       label: 'Россия' },
                  { value: 'Украина',      label: 'Украина' },
                  { value: 'Беларусь',     label: 'Беларусь' },
                  { value: 'Молдова',      label: 'Молдова' },
                  { value: 'Грузия',       label: 'Грузия' },
                  { value: 'Армения',      label: 'Армения' },
                  { value: 'Другое',       label: lang === 'ru' ? 'Другое' : 'Other' },
                ]}
              />
              <Input
                label={lang === 'ru' ? 'Дата рождения' : 'Date of birth'}
                type="date"
                value={form.date_of_birth}
                onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
              />
              <Input
                label={(lang === 'ru' ? 'Телефон' : 'Phone') + ' *'}
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+998901234567"
              />
              <Input
                label="Telegram"
                value={form.telegram}
                onChange={e => setForm({ ...form, telegram: e.target.value })}
                placeholder="@username"
              />
              <Select
                label={lang === 'ru' ? 'Образование' : 'Education'}
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
                label={(lang === 'ru' ? 'Уровень арабского' : 'Arabic level') + ' *'}
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
                label={(lang === 'ru' ? 'Уровень английского' : 'English level') + ' *'}
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
                  />
                  <Input
                    label={lang === 'ru' ? 'Телефон' : 'Phone'}
                    type="tel"
                    value={form.guardian_phone}
                    onChange={e => setForm({ ...form, guardian_phone: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={form.guardian_email}
                    onChange={e => setForm({ ...form, guardian_email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── ДОКУМЕНТЫ ─── */}
          {section === 'documents' && (
            <div className="space-y-4">

              {/* Existing docs */}
              {existingDocs.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-5">
                  <p className="text-sm font-semibold text-ink mb-3">
                    {lang === 'ru' ? 'Загруженные документы' : 'Uploaded documents'}
                  </p>
                  <div className="space-y-2">
                    {existingDocs.map(doc => {
                      const markedForDelete = docsToDelete.includes(doc.id)
                      return (
                        <div
                          key={doc.id}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-xl border transition-all',
                            markedForDelete
                              ? 'bg-red-50 border-red-200 opacity-60'
                              : 'bg-gray-50 border-border'
                          )}
                        >
                          <FileText className={cn('w-5 h-5 shrink-0', markedForDelete ? 'text-red-400' : 'text-brand-500')} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">
                              {DOCUMENT_LABELS[doc.type]?.[lang] ?? doc.type}
                            </p>
                            <p className="text-xs text-muted truncate">{doc.file_name}</p>
                          </div>
                          {markedForDelete ? (
                            <button
                              onClick={() => unmarkDocForDelete(doc.id)}
                              className="text-xs text-muted hover:text-ink transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
                            >
                              {lang === 'ru' ? 'Отмена' : 'Undo'}
                            </button>
                          ) : (
                            <button
                              onClick={() => markDocForDelete(doc.id)}
                              className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Upload new docs */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <p className="text-sm font-semibold text-ink mb-1">
                  {lang === 'ru' ? 'Заменить / добавить документы' : 'Replace / add documents'}
                </p>
                <p className="text-xs text-muted mb-4">
                  {lang === 'ru'
                    ? 'Загрузите новый файл — он заменит существующий документ того же типа'
                    : 'Upload a new file — it will replace the existing document of the same type'}
                </p>

                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {lang === 'ru' ? 'Обязательные' : 'Required'}
                </p>
                <div className="grid gap-2 mb-4">
                  {REQUIRED_DOCS.map(dtype => (
                    <DropZone
                      key={dtype}
                      docType={dtype}
                      label={DOCUMENT_LABELS[dtype][lang] ?? DOCUMENT_LABELS[dtype].ru}
                      newDoc={newDocs[dtype]}
                      onUpload={(type, file) => setNewDocs(d => ({ ...d, [type]: { type, file } }))}
                      onRemoveNew={type => setNewDocs(d => { const nd = { ...d }; delete nd[type]; return nd })}
                    />
                  ))}
                </div>

                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {lang === 'ru' ? 'Необязательные' : 'Optional'}
                </p>
                <div className="grid gap-2">
                  {OPTIONAL_DOCS.map(dtype => (
                    <DropZone
                      key={dtype}
                      docType={dtype}
                      label={DOCUMENT_LABELS[dtype][lang] ?? DOCUMENT_LABELS[dtype].ru}
                      newDoc={newDocs[dtype]}
                      onUpload={(type, file) => setNewDocs(d => ({ ...d, [type]: { type, file } }))}
                      onRemoveNew={type => setNewDocs(d => { const nd = { ...d }; delete nd[type]; return nd })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── УНИВЕРСИТЕТЫ ─── */}
          {section === 'universities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  {lang === 'ru'
                    ? 'Нажмите на университет чтобы увидеть факультеты'
                    : 'Click a university to see its faculties'}
                </p>
                <span className={cn(
                  'text-sm font-semibold px-3 py-1 rounded-full shrink-0',
                  selectedFaculties.length >= MAX_FACULTIES ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-600'
                )}>
                  {selectedFaculties.length}/{MAX_FACULTIES}
                </span>
              </div>

              {universitiesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {universities.map(uni => {
                    const isExpanded    = expandedUniversity === uni.id
                    const selectedCount = selectedFaculties.filter(f => f.university_id === uni.id).length
                    return (
                      <div key={uni.id} className={cn(
                        'bg-white rounded-2xl border-2 overflow-hidden transition-all',
                        selectedCount > 0 ? 'border-brand-300' : 'border-transparent shadow-sm'
                      )}>
                        <button
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-surface transition-colors"
                          onClick={() => setExpandedUniversity(isExpanded ? null : uni.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                              <GraduationCap className="w-5 h-5 text-brand-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-ink text-sm">{lang === 'ru' ? uni.name_ru : uni.name_en}</p>
                              <p className="text-xs text-muted">{uni.city} · {uni.country === 'SA' ? (lang === 'ru' ? 'Саудовская Аравия' : 'Saudi Arabia') : (lang === 'ru' ? 'ОАЭ' : 'UAE')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {selectedCount > 0 && (
                              <span className="badge badge-green text-[11px]">{selectedCount} {lang === 'ru' ? 'выбр.' : 'sel.'}</span>
                            )}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                          </div>
                        </button>

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

              {/* Custom university */}
              <div className="bg-white rounded-2xl border-2 border-dashed border-brand-200 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <ExternalLink className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {lang === 'ru' ? 'Добавить другой университет' : 'Add another university'}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {lang === 'ru' ? 'Полный список на ' : 'Full list at '}
                      <a href="https://studyinsaudi.sa/ar/Institutions" target="_blank" rel="noopener noreferrer" className="text-brand-500 underline">studyinsaudi.sa</a>
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

              {/* Selected summary */}
              {selectedFaculties.length > 0 && (
                <div className="bg-white rounded-2xl border border-brand-200 p-4">
                  <p className="text-xs font-semibold text-brand-700 mb-2">
                    {lang === 'ru' ? 'Выбранные факультеты:' : 'Selected faculties:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFaculties.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs bg-brand-50 border border-brand-200 text-brand-700 px-2 py-1 rounded-lg">
                        {f.university_name} — {f.faculty}
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
            </div>
          )}

        </motion.div>

        {/* Bottom save button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-ink text-white rounded-2xl text-sm font-semibold hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Save className="w-4 h-4" />
            }
            {lang === 'ru' ? 'Сохранить изменения' : 'Save changes'}
          </button>
        </div>

      </div>
    </div>
  )
}
