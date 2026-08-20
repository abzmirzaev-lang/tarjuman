'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Search, RefreshCw, X, Loader2, Upload, Download, Trash2,
  Eye, EyeOff, Copy, Check, Mail, Phone, MapPin, HeartPulse, Wallet,
  MessageSquare, GraduationCap, Package as PackageIcon, FileText, Lock,
  CircleDollarSign, CreditCard, Languages, Send,
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { cn, getInitials } from '@/lib/utils'
import { SAUDI_PACKAGES, SaudiPackageId } from '@/lib/saudiPackages'

// ── Types ──────────────────────────────────────────────────────────────────

type SaudiStatus = 'REGISTERED' | 'PAID' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'SUBMITTED' | 'COMPLETED' | 'REJECTED'

interface SelectedProgram { university_id: string | null; university_name: string; faculty: string; order: number }
interface DocEntry { file_name: string; file_path: string; file_size: number; mime_type: string | null; uploaded_at: string }

interface SaudiApp {
  id: string
  email: string
  phone: string
  address: string
  has_disability: boolean
  annual_income: number | null
  income_currency: string | null
  motivation: string
  selected_programs: SelectedProgram[]
  desired_programs: string | null
  service_package: SaudiPackageId
  service_package_price: number
  status: SaudiStatus
  lang: string | null
  study_portal_login: string | null
  study_portal_password: string | null
  documents: DocEntry[]
  translated_documents: DocEntry[]
  created_at: string
  updated_at: string
}

// ── Constants ──────────────────────────────────────────────────────────────

const COLUMNS: { status: SaudiStatus; title: string; sub: string; accent: string }[] = [
  { status: 'REGISTERED',   title: 'Не оплатили',                          sub: 'Связаться и выставить реквизиты',     accent: 'border-t-amber-400' },
  { status: 'PAID',         title: 'Оплатили — ждут перевода',             sub: 'Переводим документы на арабский',     accent: 'border-t-blue-400' },
  { status: 'UNDER_REVIEW', title: 'Перевод сделан — готовы к подаче',     sub: 'Подать на study-in-saudi',            accent: 'border-t-violet-400' },
  { status: 'SUBMITTED',    title: 'Подано',                               sub: 'Заявка отправлена в университет',     accent: 'border-t-emerald-400' },
]

const PKG_COLOR: Record<SaudiPackageId, string> = {
  SUPPORT:  'bg-slate-100 text-slate-700',
  STANDARD: 'bg-emerald-50 text-emerald-700',
  VIP:      'bg-amber-50 text-amber-800',
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин назад`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} ч назад`
  const days = Math.floor(hrs / 24)
  return `${days} дн назад`
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} Б`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} КБ`
  return `${(n / (1024 * 1024)).toFixed(1)} МБ`
}

// ── Small UI bits ──────────────────────────────────────────────────────────

function Avatar({ email }: { email: string }) {
  const colors = ['bg-violet-100 text-violet-700', 'bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']
  const color = colors[(email?.charCodeAt(0) ?? 0) % colors.length]
  return (
    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center font-semibold shrink-0 text-sm', color)}>
      {getInitials(email.split('@')[0])}
    </div>
  )
}

function PasswordField({ value }: { value: string }) {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-sm">{show ? value : '••••••••'}</span>
      <button type="button" onClick={() => setShow(s => !s)} className="text-muted hover:text-ink p-1">
        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      <button
        type="button"
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
        className="text-muted hover:text-ink p-1"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

// ── Document list (used for both original + translated) ────────────────────

function DocSection({
  title, docs, uploading, onUpload, onDownload, onDelete,
}: {
  title: string
  docs: DocEntry[]
  uploading: boolean
  onUpload: (file: File) => void
  onDownload: (path: string) => void
  onDelete: (path: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Загрузить
        </button>
        <input
          ref={inputRef} type="file" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = '' }}
        />
      </div>
      {docs.length === 0 ? (
        <p className="text-sm text-muted">Пока нет файлов</p>
      ) : (
        <div className="space-y-1.5">
          {docs.map(d => (
            <div key={d.file_path} className="flex items-center gap-2 rounded-lg border border-[#E7E1D3] px-3 py-2">
              <FileText className="w-4 h-4 text-muted shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{d.file_name}</p>
                <p className="text-xs text-muted">{formatBytes(d.file_size)}</p>
              </div>
              <button type="button" onClick={() => onDownload(d.file_path)} className="p-1.5 text-muted hover:text-ink">
                <Download className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => onDelete(d.file_path)} className="p-1.5 text-muted hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────

export default function AdminSaudiPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [apps, setApps] = useState<SaudiApp[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [selected, setSelected] = useState<SaudiApp | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [credModalFor, setCredModalFor] = useState<SaudiApp | null>(null)
  const [credLogin, setCredLogin] = useState('')
  const [credPassword, setCredPassword] = useState('')
  const [credSaving, setCredSaving] = useState(false)

  const [busyId, setBusyId] = useState<string | null>(null)
  const [uploadingCategory, setUploadingCategory] = useState<'original' | 'translated' | null>(null)

  // ── Auth ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/login'); return }
      supabase.from('users').select('is_admin').eq('id', data.session.user.id).single()
        .then(({ data: u }) => {
          if (!u?.is_admin) { router.push('/dashboard'); return }
          setChecking(false)
          loadData()
        })
    })
  }, [router])

  async function authFetch(path: string, options: RequestInit = {}) {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch(path, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return res
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authFetch('/api/admin/saudi')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка загрузки')
      setApps(json.applications ?? [])
    } catch (e: any) {
      toast.error(e.message ?? 'Ошибка загрузки')
    }
    setLoading(false)
  }, [])

  function patchApp(id: string, patch: Partial<SaudiApp>) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a))
    setSelected(prev => prev?.id === id ? { ...prev, ...patch } : prev)
  }

  async function markPaid(app: SaudiApp) {
    setBusyId(app.id)
    try {
      const res = await authFetch(`/api/admin/saudi/${app.id}/mark-paid`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка')
      patchApp(app.id, { status: 'PAID' })
      toast.success('Отмечено как оплачено')
    } catch (e: any) { toast.error(e.message ?? 'Ошибка') }
    setBusyId(null)
  }

  function openCredModal(app: SaudiApp) {
    setCredModalFor(app)
    setCredLogin(app.study_portal_login ?? '')
    setCredPassword(app.study_portal_password ?? '')
  }

  async function saveTranslationReady() {
    if (!credModalFor) return
    if (!credLogin.trim() || !credPassword.trim()) { toast.error('Заполните логин и пароль'); return }
    setCredSaving(true)
    try {
      const res = await authFetch(`/api/admin/saudi/${credModalFor.id}/mark-translated`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: credLogin.trim(), password: credPassword.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка')
      patchApp(credModalFor.id, { status: 'UNDER_REVIEW', study_portal_login: credLogin.trim(), study_portal_password: credPassword.trim() })
      toast.success('Перевод готов — клиент перемещён')
      setCredModalFor(null)
    } catch (e: any) { toast.error(e.message ?? 'Ошибка') }
    setCredSaving(false)
  }

  async function markSubmitted(app: SaudiApp) {
    setBusyId(app.id)
    try {
      const res = await authFetch(`/api/admin/saudi/${app.id}/mark-submitted`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка')
      patchApp(app.id, { status: 'SUBMITTED' })
      toast.success('Подача завершена 🎉')
    } catch (e: any) { toast.error(e.message ?? 'Ошибка') }
    setBusyId(null)
  }

  async function uploadDoc(app: SaudiApp, category: 'original' | 'translated', file: File) {
    setUploadingCategory(category)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('category', category)
      const res = await authFetch(`/api/admin/saudi/${app.id}/documents`, { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка загрузки')
      const key = category === 'original' ? 'documents' : 'translated_documents'
      patchApp(app.id, { [key]: json[key] } as Partial<SaudiApp>)
      toast.success('Файл загружен')
    } catch (e: any) { toast.error(e.message ?? 'Ошибка загрузки') }
    setUploadingCategory(null)
  }

  async function downloadDoc(app: SaudiApp, path: string) {
    try {
      const res = await authFetch(`/api/admin/saudi/${app.id}/documents/download`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка')
      window.open(json.url, '_blank')
    } catch (e: any) { toast.error(e.message ?? 'Не удалось скачать') }
  }

  async function deleteDoc(app: SaudiApp, category: 'original' | 'translated', path: string) {
    try {
      const res = await authFetch(`/api/admin/saudi/${app.id}/documents`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path, category }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Ошибка')
      const key = category === 'original' ? 'documents' : 'translated_documents'
      patchApp(app.id, { [key]: json[key] } as Partial<SaudiApp>)
      toast.success('Файл удалён')
    } catch (e: any) { toast.error(e.message ?? 'Ошибка') }
  }

  function openDetail(app: SaudiApp) {
    setSelected(app)
    setDetailOpen(true)
  }

  const filtered = apps.filter(a => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return a.email.toLowerCase().includes(q) || a.phone.includes(q) || a.address.toLowerCase().includes(q)
  })

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E7E1D3]">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-lg hover:bg-[#F5F1E8] text-muted hover:text-ink">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-ink">🇸🇦 Подача в Саудовскую Аравию</h1>
            <p className="text-xs text-muted">{apps.length} заявок всего</p>
          </div>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по email, телефону..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E7E1D3] text-sm bg-[#FAF8F3] focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <button onClick={loadData} className="p-2 rounded-lg hover:bg-[#F5F1E8] text-muted hover:text-ink" title="Обновить">
            <RefreshCw className={cn('w-5 h-5', loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colApps = filtered.filter(a => a.status === col.status)
            return (
              <div key={col.status} className={cn('bg-white rounded-2xl border border-[#E7E1D3] border-t-4 flex flex-col min-h-[320px]', col.accent)}>
                <div className="px-4 py-3 border-b border-[#E7E1D3]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-ink">{col.title}</h2>
                    <span className="text-xs font-semibold text-muted bg-[#F5F1E8] rounded-full px-2 py-0.5">{colApps.length}</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{col.sub}</p>
                </div>
                <div className="p-3 space-y-2.5 flex-1 overflow-y-auto max-h-[70vh]">
                  {loading ? (
                    <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted" /></div>
                  ) : colApps.length === 0 ? (
                    <p className="text-sm text-muted text-center py-8">Пусто</p>
                  ) : colApps.map(app => {
                    const pkg = SAUDI_PACKAGES[app.service_package]
                    return (
                      <div key={app.id} className="rounded-xl border border-[#E7E1D3] p-3 hover:border-brand/40 transition-colors cursor-pointer" onClick={() => openDetail(app)}>
                        <div className="flex items-start gap-2.5">
                          <Avatar email={app.email} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-ink truncate">{app.email}</p>
                            <p className="text-xs text-muted">{app.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2.5">
                          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', PKG_COLOR[app.service_package])}>{pkg?.name_ru ?? app.service_package}</span>
                          <span className="text-[11px] text-muted">${app.service_package_price}</span>
                          <span className="text-[11px] text-muted ml-auto">{timeAgo(app.created_at)}</span>
                        </div>
                        {col.status === 'REGISTERED' && (
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); markPaid(app) }}
                            disabled={busyId === app.id}
                            className="mt-3 w-full h-8 rounded-lg bg-[#1B4332] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {busyId === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                            Оплатил
                          </button>
                        )}
                        {col.status === 'PAID' && (
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); openCredModal(app) }}
                            className="mt-3 w-full h-8 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:opacity-90 flex items-center justify-center gap-1.5"
                          >
                            <Languages className="w-3.5 h-3.5" />
                            Перевод готов
                          </button>
                        )}
                        {col.status === 'UNDER_REVIEW' && (
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); markSubmitted(app) }}
                            disabled={busyId === app.id}
                            className="mt-3 w-full h-8 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {busyId === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            Подача завершена
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Credentials modal (stage 2 → 3) */}
      <AnimatePresence>
        {credModalFor && (
          <motion.div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCredModalFor(null)}>
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-sm" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-ink mb-1">Данные для study-in-saudi</h3>
              <p className="text-xs text-muted mb-4">Логин и пароль сохранятся у этого клиента для подачи документов</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted">Логин</label>
                  <input value={credLogin} onChange={e => setCredLogin(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#E7E1D3] text-sm focus:outline-none focus:ring-2 focus:ring-brand/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted">Пароль</label>
                  <input value={credPassword} onChange={e => setCredPassword(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-[#E7E1D3] text-sm focus:outline-none focus:ring-2 focus:ring-brand/30" />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setCredModalFor(null)} className="flex-1 h-10 rounded-lg border border-[#E7E1D3] text-sm font-semibold text-ink">Отмена</button>
                <button onClick={saveTranslationReady} disabled={credSaving} className="flex-1 h-10 rounded-lg bg-[#1B4332] text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5">
                  {credSaving && <Loader2 className="w-4 h-4 animate-spin" />} Сохранить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <AnimatePresence>
        {detailOpen && selected && (
          <motion.div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailOpen(false)}>
            <motion.div
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-[#E7E1D3] px-6 py-4 flex items-center gap-3 z-10">
                <Avatar email={selected.email} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate">{selected.email}</p>
                  <p className="text-xs text-muted">{COLUMNS.find(c => c.status === selected.status)?.title ?? selected.status}</p>
                </div>
                <button onClick={() => setDetailOpen(false)} className="p-2 rounded-lg hover:bg-[#F5F1E8] text-muted"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2"><Mail className="w-4 h-4 text-muted mt-0.5 shrink-0" /><div><p className="text-xs text-muted">Email</p><p className="text-sm text-ink">{selected.email}</p></div></div>
                  <div className="flex items-start gap-2"><Phone className="w-4 h-4 text-muted mt-0.5 shrink-0" /><div><p className="text-xs text-muted">Телефон</p><p className="text-sm text-ink">{selected.phone}</p></div></div>
                  <div className="flex items-start gap-2 sm:col-span-2"><MapPin className="w-4 h-4 text-muted mt-0.5 shrink-0" /><div><p className="text-xs text-muted">Адрес</p><p className="text-sm text-ink">{selected.address}</p></div></div>
                  <div className="flex items-start gap-2"><HeartPulse className="w-4 h-4 text-muted mt-0.5 shrink-0" /><div><p className="text-xs text-muted">Инвалидность</p><p className="text-sm text-ink">{selected.has_disability ? 'Да' : 'Нет'}</p></div></div>
                  <div className="flex items-start gap-2"><Wallet className="w-4 h-4 text-muted mt-0.5 shrink-0" /><div><p className="text-xs text-muted">Годовой доход</p><p className="text-sm text-ink">{selected.annual_income != null ? `${selected.annual_income.toLocaleString()} ${selected.income_currency ?? ''}` : '—'}</p></div></div>
                </div>

                {/* Motivation */}
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted mb-1">Мотивация</p>
                    <p className="text-sm text-ink whitespace-pre-wrap" dir="auto">{selected.motivation}</p>
                  </div>
                </div>

                {/* Programs */}
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted mb-1.5">Университеты и факультеты</p>
                    {selected.desired_programs ? (
                      <p className="text-sm text-ink whitespace-pre-wrap" dir="auto">{selected.desired_programs}</p>
                    ) : selected.selected_programs?.length ? (
                      <div className="space-y-1">
                        {selected.selected_programs.map((p, i) => (
                          <div key={i} className="text-sm text-ink flex gap-2">
                            <span className="text-muted">{i + 1}.</span>
                            <span>{p.university_name} — {p.faculty}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted italic">Не указано</p>
                    )}
                  </div>
                </div>

                {/* Package */}
                <div className="flex items-center gap-2">
                  <PackageIcon className="w-4 h-4 text-muted shrink-0" />
                  <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', PKG_COLOR[selected.service_package])}>
                    {SAUDI_PACKAGES[selected.service_package]?.name_ru}
                  </span>
                  <span className="text-sm text-muted">${selected.service_package_price}</span>
                </div>

                {/* Portal credentials */}
                {(selected.study_portal_login || selected.study_portal_password) && (
                  <div className="rounded-xl bg-[#F5F1E8] p-4">
                    <div className="flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-muted" /><p className="text-xs font-semibold uppercase tracking-wide text-muted">Study in Saudi — доступ</p></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><p className="text-xs text-muted mb-0.5">Логин</p><p className="text-sm font-mono text-ink">{selected.study_portal_login}</p></div>
                      <div><p className="text-xs text-muted mb-0.5">Пароль</p>{selected.study_portal_password && <PasswordField value={selected.study_portal_password} />}</div>
                    </div>
                  </div>
                )}

                {/* Documents */}
                <DocSection
                  title="Документы"
                  docs={selected.documents ?? []}
                  uploading={uploadingCategory === 'original'}
                  onUpload={f => uploadDoc(selected, 'original', f)}
                  onDownload={p => downloadDoc(selected, p)}
                  onDelete={p => deleteDoc(selected, 'original', p)}
                />
                <DocSection
                  title="Переведённые документы"
                  docs={selected.translated_documents ?? []}
                  uploading={uploadingCategory === 'translated'}
                  onUpload={f => uploadDoc(selected, 'translated', f)}
                  onDownload={p => downloadDoc(selected, p)}
                  onDelete={p => deleteDoc(selected, 'translated', p)}
                />
              </div>

              {/* Footer action */}
              <div className="sticky bottom-0 bg-white border-t border-[#E7E1D3] px-6 py-4">
                {selected.status === 'REGISTERED' && (
                  <button onClick={() => markPaid(selected)} disabled={busyId === selected.id} className="w-full h-11 rounded-xl bg-[#1B4332] text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                    {busyId === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />} Отметить как оплачено
                  </button>
                )}
                {selected.status === 'PAID' && (
                  <button onClick={() => openCredModal(selected)} className="w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2">
                    <Languages className="w-4 h-4" /> Перевод готов — ввести логин/пароль
                  </button>
                )}
                {selected.status === 'UNDER_REVIEW' && (
                  <button onClick={() => markSubmitted(selected)} disabled={busyId === selected.id} className="w-full h-11 rounded-xl bg-violet-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                    {busyId === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Подача завершена
                  </button>
                )}
                {selected.status === 'SUBMITTED' && (
                  <div className="w-full h-11 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Заявка подана
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
