'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, FileText, CreditCard, Search, Download, Send, CheckCircle2,
  TrendingUp, LogOut, X, Play, Flag, Upload, Loader2, Trash2,
  Bell, ChevronRight, LayoutDashboard, Settings, Filter,
  RefreshCw, GraduationCap, Clock, CircleDollarSign, Eye,
  MessageCircle, Phone, Mail, MapPin, Calendar, Globe,
  CheckCheck, AlertCircle, Inbox
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { PACKAGES } from '@/types'
import type { ApplicationRow, UserRow, PaymentRow, MessageRow, DocumentRow, ApplicationStatus } from '@/types'
import { formatDate, formatCurrency, cn, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

// ── Constants ──────────────────────────────────────────────────────────────────

type AdminTab = 'dashboard' | 'applications' | 'users' | 'payments'

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; dot: string }> = {
  REGISTERED:   { label: 'Ожидает оплаты', color: 'bg-amber-50 text-amber-700 ring-amber-200',   dot: 'bg-amber-400' },
  PAID:         { label: 'Оплачено',        color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  IN_PROGRESS:  { label: 'В обработке',    color: 'bg-blue-50 text-blue-700 ring-blue-200',       dot: 'bg-blue-500' },
  UNDER_REVIEW: { label: 'В обработке',    color: 'bg-blue-50 text-blue-700 ring-blue-200',       dot: 'bg-blue-500' },
  SUBMITTED:    { label: 'Подано',          color: 'bg-violet-50 text-violet-700 ring-violet-200', dot: 'bg-violet-500' },
  COMPLETED:    { label: 'Подано',          color: 'bg-violet-50 text-violet-700 ring-violet-200', dot: 'bg-violet-500' },
  REJECTED:     { label: 'Отклонено',       color: 'bg-red-50 text-red-700 ring-red-200',          dot: 'bg-red-500' },
}

const ALL_STATUSES: ApplicationStatus[] = ['REGISTERED', 'PAID', 'IN_PROGRESS', 'SUBMITTED']

const DOC_TYPE_LABEL: Record<string, string> = {
  PASSPORT: 'Паспорт', PHOTO: 'Фото 3×4', DIPLOMA: 'Диплом / Аттестат',
  TRANSCRIPT: 'Транскрипт', IELTS: 'IELTS / TOEFL', ARABIC_CERT: 'Сертификат арабского',
  RECOMMENDATION: 'Рекомендательное письмо', MEDICAL: 'Медицинская справка',
  CRIMINAL_RECORD: 'Справка о несудимости', BIRTH_CERT: 'Свидетельство о рождении',
  NATIONAL_ID: 'Нац. удостоверение', CONDUCT_CERT: 'Справка о поведении',
  SOCIAL_MEDIA: 'Подписка Instagram/Facebook', GRADE9: 'Табель 9 класса',
  GRADE10: 'Табель 10 класса', GRADE11: 'Аттестат 11 класса',
  BACHELOR_DIPLOMA: 'Диплом бакалавра', BACHELOR_TRANSCRIPT: 'Транскрипт бакалавра',
  OTHER: 'Документ',
}

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.REGISTERED
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ring-1', cfg.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const colors = ['bg-violet-100 text-violet-700', 'bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']
  const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length]
  const sz = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }[size]
  return (
    <div className={cn('rounded-full flex items-center justify-center font-semibold shrink-0', sz, color)}>
      {getInitials(name)}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<AdminTab>('dashboard')
  const [apps, setApps] = useState<ApplicationRow[]>([])
  const [users, setUsers] = useState<UserRow[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFlt, setStatusFlt] = useState<ApplicationStatus | ''>('')
  const [showFilters, setShowFilters] = useState(false)

  const [selected, setSelected] = useState<ApplicationRow | null>(null)
  const [appDocs, setAppDocs] = useState<DocumentRow[]>([])
  const [appMsgs, setAppMsgs] = useState<MessageRow[]>([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailTab, setDetailTab] = useState<'overview' | 'form' | 'docs' | 'chat'>('overview')

  const [msgText, setMsgText] = useState('')
  const [noteText, setNoteText] = useState('')
  const [sending, setSending] = useState(false)
  const [startingProcessing, setStartingProcessing] = useState(false)

  const [completeOpen, setCompleteOpen] = useState(false)
  const [completeFiles, setCompleteFiles] = useState<File[]>([])
  const [completing, setCompleting] = useState(false)
  const [studysaudiLogin, setStudysaudiLogin] = useState('')
  const [studysaudiPassword, setStudysaudiPassword] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [notifOpen, setNotifOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/login'); return }
      supabase.from('users').select('is_admin').eq('id', data.session.user.id).single()
        .then(({ data: u }) => {
          if (!u?.is_admin) { router.push('/dashboard'); return }
          loadData()
        })
    })
  }, [router])

  useEffect(() => {
    if (detailTab === 'chat') setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [detailTab, appMsgs.length])

  async function loadData() {
    setLoading(true)
    const [{ data: a }, { data: u }, { data: p }] = await Promise.all([
      supabase.from('applications').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
    ])
    setApps(a ?? []); setUsers(u ?? []); setPayments(p ?? [])
    setLoading(false)
  }

  async function openDetail(app: ApplicationRow) {
    const rawNotes = app.notes ?? ''
    const isJson = rawNotes.trimStart().startsWith('{') || rawNotes.trimStart().startsWith('[')
    setSelected(app)
    setNoteText(isJson ? '' : rawNotes)
    setDetailTab('overview')
    setDetailOpen(true)
    const [{ data: d1 }, { data: storageFiles }, { data: m }] = await Promise.all([
      supabase.from('documents').select('*').eq('application_id', app.id).order('created_at'),
      supabase.storage.from('documents').list(`${app.user_id}/${app.id}`, { limit: 100 }),
      supabase.from('messages').select('*').eq('application_id', app.id).order('created_at'),
    ])
    const dbDocs = d1 ?? []
    const dbPaths = new Set(dbDocs.map((d: any) => d.file_path))
    const extraDocs = (storageFiles ?? [])
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .filter(f => !Array.from(dbPaths).some(p => (p as string).endsWith(f.name)))
      .map(f => ({
        id: f.id ?? f.name, application_id: app.id, user_id: app.user_id,
        type: 'OTHER', file_name: f.name, file_path: `${app.user_id}/${app.id}/${f.name}`,
        file_size: f.metadata?.size ?? 0, mime_type: f.metadata?.mimetype ?? '',
        is_verified: false, created_at: f.created_at ?? new Date().toISOString(),
      }))
    setAppDocs([...dbDocs, ...extraDocs])
    setAppMsgs(m ?? [])
  }

  async function changeStatus(appId: string, newStatus: ApplicationStatus) {
    const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId)
    if (!error) {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      setSelected(prev => prev?.id === appId ? { ...prev, status: newStatus } : prev)
      toast.success('Статус обновлён')
    } else toast.error('Ошибка')
  }

  async function startProcessing() {
    if (!selected) return
    setStartingProcessing(true)
    try {
      const res = await fetch('/api/admin/start-processing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: selected.id }),
      })
      if (!res.ok) throw new Error()
      setApps(prev => prev.map(a => a.id === selected.id ? { ...a, status: 'IN_PROGRESS' } : a))
      setSelected(prev => prev ? { ...prev, status: 'IN_PROGRESS' } : null)
      toast.success('Обработка начата')
    } catch { toast.error('Ошибка') }
    setStartingProcessing(false)
  }

  async function completeProcessing() {
    if (!selected || completeFiles.length === 0) { toast.error('Загрузите документы'); return }
    setCompleting(true)
    try {
      const newDocs: DocumentRow[] = []
      for (const file of completeFiles) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const filePath = `${selected.user_id}/${selected.id}/translated/${Date.now()}_${safeName}`
        const { error: ue } = await supabase.storage.from('documents').upload(filePath, file, { upsert: true })
        if (ue) throw new Error(ue.message)
        const { data: doc, error: de } = await supabase.from('documents').insert({
          application_id: selected.id, user_id: selected.user_id, type: 'OTHER',
          file_name: file.name, file_path: filePath, file_size: file.size, mime_type: file.type, is_verified: true,
        }).select().single()
        if (de) throw new Error(de.message)
        if (doc) newDocs.push(doc as DocumentRow)
      }
      const res = await fetch('/api/admin/complete-processing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: selected.id, studysaudiLogin: studysaudiLogin.trim(), studysaudiPassword: studysaudiPassword.trim() }),
      })
      if (!res.ok) throw new Error('Ошибка завершения')
      setApps(prev => prev.map(a => a.id === selected.id ? { ...a, status: 'SUBMITTED' } : a))
      setSelected(prev => prev ? { ...prev, status: 'SUBMITTED' } : null)
      setAppDocs(prev => [...prev, ...newDocs])
      const clientName = selected.full_name?.split(' ')[0] ?? 'Клиент'
      const uniName = ((selected as any).extra_data?.university) ?? 'Al Qasimia University'
      const autoMsg = `🎓 ${clientName}, ваша заявка успешно подана в ${uniName}!\n\nВаши переведённые документы доступны в личном кабинете. Университет рассмотрит вашу заявку и свяжется с вами.\n\nЖелаем удачи! 🌟\n\n— Команда TARJUMAN`
      await supabase.from('messages').insert({ application_id: selected.id, user_id: selected.user_id, sender: 'ADMIN', content: autoMsg })
      setAppMsgs(prev => [...prev, { id: 'auto-' + Date.now(), application_id: selected.id, user_id: selected.user_id, sender: 'ADMIN', content: autoMsg, is_read: false, created_at: new Date().toISOString() }])
      setCompleteFiles([]); setStudysaudiLogin(''); setStudysaudiPassword(''); setCompleteOpen(false)
      toast.success(`✅ Подано! ${newDocs.length} документ(ов) загружено`)
    } catch (e: any) { toast.error(e.message ?? 'Ошибка') }
    setCompleting(false)
  }

  async function sendMessage() {
    if (!msgText.trim() || !selected) return
    setSending(true)
    const { error } = await supabase.from('messages').insert({ application_id: selected.id, user_id: selected.user_id, sender: 'ADMIN', content: msgText.trim() })
    if (!error) {
      setAppMsgs(prev => [...prev, { id: 'tmp-' + Date.now(), application_id: selected.id, user_id: selected.user_id, sender: 'ADMIN', content: msgText.trim(), is_read: false, created_at: new Date().toISOString() }])
      setMsgText('')
    } else toast.error('Ошибка отправки')
    setSending(false)
  }

  async function downloadDoc(doc: DocumentRow) {
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 120)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else toast.error('Не удалось получить ссылку')
  }

  async function saveNote() {
    if (!selected) return
    await supabase.from('applications').update({ notes: noteText }).eq('id', selected.id)
    setApps(prev => prev.map(a => a.id === selected.id ? { ...a, notes: noteText } : a))
    toast.success('Сохранено')
  }

  const filteredApps = apps.filter(a => {
    const q = search.toLowerCase()
    return (!search || a.full_name?.toLowerCase().includes(q) || a.id.includes(q) || (a.citizenship ?? '').toLowerCase().includes(q) || (a.phone ?? '').includes(q))
      && (!statusFlt || a.status === statusFlt)
  })

  const stats = {
    total: apps.length,
    paid: apps.filter(a => a.status === 'PAID').length,
    inProgress: apps.filter(a => a.status === 'IN_PROGRESS').length,
    submitted: apps.filter(a => ['SUBMITTED', 'COMPLETED'].includes(a.status)).length,
    revenue: payments.filter(p => p.status === 'PAID').reduce((s, p) => s + Number(p.amount), 0),
  }

  const unreadMsgs = 0 // can wire up real count later
  const clientUser = selected ? users.find(u => u.id === selected.user_id) : null

  const ex: any = selected ? (() => {
    const rawExtra = (selected as any).extra_data
    if (rawExtra && Object.keys(rawExtra).length > 0) return rawExtra
    try { return JSON.parse((selected as any).notes ?? '{}') } catch { return {} }
  })() : {}

  // ── SIDEBAR NAV ───────────────────────────────────────────────────────────────
  const NAV = [
    { key: 'dashboard',    icon: LayoutDashboard, label: 'Дашборд' },
    { key: 'applications', icon: FileText,         label: 'Заявки', badge: stats.paid },
    { key: 'users',        icon: Users,            label: 'Клиенты' },
    { key: 'payments',     icon: CircleDollarSign, label: 'Платежи' },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">

      {/* ── SIDEBAR ────────────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-60 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 flex-col z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1B4332] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">TARJUMAN</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(n => (
            <button key={n.key} onClick={() => setTab(n.key as AdminTab)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                tab === n.key
                  ? 'bg-[#1B4332] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              )}>
              <n.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{n.label}</span>
              {(n as any).badge > 0 && (
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  tab === n.key ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                )}>{(n as any).badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────────────── */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div>
            <h1 className="font-bold text-gray-900 text-base">
              {tab === 'dashboard' ? 'Дашборд' : tab === 'applications' ? 'Заявки' : tab === 'users' ? 'Клиенты' : 'Платежи'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadData} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="relative">
              <button onClick={() => setNotifOpen(v => !v)} className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                <Bell className="w-4 h-4" />
                {stats.paid > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: 4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <p className="font-semibold text-gray-800 text-sm">Уведомления</p>
                      <button onClick={() => setNotifOpen(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    {stats.paid > 0 ? (
                      <div className="p-3 space-y-1">
                        {apps.filter(a => a.status === 'PAID').slice(0, 5).map(app => (
                          <button key={app.id} onClick={() => { openDetail(app); setNotifOpen(false); setTab('applications') }}
                            className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{app.full_name}</p>
                              <p className="text-xs text-gray-400">Оплатил — ждёт обработки · {formatDate(app.created_at)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-sm">Новых уведомлений нет</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

              {/* ══ DASHBOARD ══════════════════════════════════════════════════════ */}
              {tab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Всего заявок',   value: stats.total,                   icon: FileText,         color: 'text-blue-600',    bg: 'bg-blue-50' },
                      { label: 'Ждут обработки', value: stats.paid,                    icon: Clock,            color: 'text-amber-600',   bg: 'bg-amber-50' },
                      { label: 'В обработке',    value: stats.inProgress,              icon: TrendingUp,       color: 'text-violet-600',  bg: 'bg-violet-50' },
                      { label: 'Выручка',        value: formatCurrency(stats.revenue), icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', s.bg)}>
                          <s.icon className={cn('w-5 h-5', s.color)} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                        <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action needed */}
                  {stats.paid > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-800">{stats.paid} заявок ждут обработки</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Клиенты оплатили — нужно начать работу</p>
                      </div>
                      <button onClick={() => setTab('applications')}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shrink-0">
                        Перейти
                      </button>
                    </div>
                  )}

                  {/* Recent applications */}
                  <div className="bg-white rounded-2xl border border-gray-100">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="font-semibold text-gray-800 text-sm">Последние заявки</h2>
                      <button onClick={() => setTab('applications')} className="text-xs text-[#1B4332] font-medium hover:underline flex items-center gap-1">
                        Все заявки <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {apps.slice(0, 8).map(app => (
                        <div key={app.id} onClick={() => { openDetail(app); setTab('applications') }}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group">
                          <Avatar name={app.full_name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{app.full_name}</p>
                            <p className="text-xs text-gray-400">{app.citizenship ?? app.country} · {formatDate(app.created_at)}</p>
                          </div>
                          <StatusBadge status={app.status} />
                          <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ APPLICATIONS ═══════════════════════════════════════════════════ */}
              {tab === 'applications' && (
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="flex gap-3 items-center">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all"
                        placeholder="Поиск по имени, телефону..."
                        value={search} onChange={e => setSearch(e.target.value)}
                      />
                      {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"><X className="w-4 h-4" /></button>}
                    </div>
                    <button onClick={() => setShowFilters(v => !v)}
                      className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                        showFilters || statusFlt ? 'bg-[#1B4332] border-[#1B4332] text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      )}>
                      <Filter className="w-4 h-4" /> Фильтры
                      {statusFlt && <span className="w-2 h-2 rounded-full bg-white/70" />}
                    </button>
                    <span className="text-xs text-gray-400 ml-1">{filteredApps.length} из {apps.length}</span>
                  </div>

                  {/* Filter chips */}
                  {showFilters && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-2">
                      {[{ key: '', label: 'Все статусы' }, ...ALL_STATUSES.map(s => ({ key: s, label: STATUS_CONFIG[s].label }))].map(s => (
                        <button key={s.key} onClick={() => setStatusFlt(s.key as any)}
                          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                            statusFlt === s.key ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200'
                          )}>{s.label}</button>
                      ))}
                    </motion.div>
                  )}

                  {/* Table */}
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            {['Клиент', 'Гражданство', 'Пакет', 'Статус', 'Дата', ''].map(h => (
                              <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredApps.map(app => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => openDetail(app)}>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <Avatar name={app.full_name} size="sm" />
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">{app.full_name}</p>
                                    <p className="text-xs text-gray-400">{app.phone ?? '—'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-gray-500">{app.citizenship ?? '—'}</td>
                              <td className="px-5 py-3.5">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                  {PACKAGES[app.service_package]?.name_ru ?? app.service_package}
                                </span>
                              </td>
                              <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                              <td className="px-5 py-3.5 text-xs text-gray-400">{formatDate(app.created_at)}</td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                  {app.status === 'PAID' && (
                                    <button onClick={e => { e.stopPropagation(); setSelected(app); setTimeout(startProcessing, 0) }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors">
                                      <Play className="w-3 h-3" /> Начать
                                    </button>
                                  )}
                                  {app.status === 'IN_PROGRESS' && (
                                    <button onClick={e => { e.stopPropagation(); openDetail(app); setCompleteOpen(true) }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-colors">
                                      <Flag className="w-3 h-3" /> Завершить
                                    </button>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-gray-300" />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Mobile list */}
                    <div className="md:hidden divide-y divide-gray-50">
                      {filteredApps.map(app => (
                        <div key={app.id} className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50" onClick={() => openDetail(app)}>
                          <Avatar name={app.full_name} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{app.full_name}</p>
                            <p className="text-xs text-gray-400">{app.citizenship ?? app.country} · {formatDate(app.created_at)}</p>
                          </div>
                          <StatusBadge status={app.status} />
                        </div>
                      ))}
                    </div>
                    {filteredApps.length === 0 && (
                      <div className="py-16 text-center">
                        <Inbox className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Заявки не найдены</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ USERS ══════════════════════════════════════════════════════════ */}
              {tab === 'users' && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Клиенты <span className="text-gray-400 font-normal">({users.length})</span></h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {users.map(user => {
                      const ua = apps.filter(a => a.user_id === user.id)
                      return (
                        <div key={user.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                          <Avatar name={user.full_name ?? 'U'} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800">{user.full_name ?? 'N/A'}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400">
                            <span>{user.citizenship ?? '—'}</span>
                            <span>{formatDate(user.created_at)}</span>
                          </div>
                          <span className="text-xs font-semibold bg-[#1B4332]/10 text-[#1B4332] px-2.5 py-1 rounded-full">{ua.length} заявок</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ══ PAYMENTS ═══════════════════════════════════════════════════════ */}
              {tab === 'payments' && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Платежи</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          {['Клиент', 'Сумма', 'Метод', 'Статус', 'Пакет', 'Дата'].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {payments.map(p => {
                          const au = apps.find(a => a.id === p.application_id)
                          return (
                            <tr key={p.id} className="hover:bg-gray-50">
                              <td className="px-5 py-3.5 text-sm text-gray-700">{au?.full_name ?? '—'}</td>
                              <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{formatCurrency(p.amount)}</td>
                              <td className="px-5 py-3.5 text-xs text-gray-500">{p.method}</td>
                              <td className="px-5 py-3.5">
                                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full ring-1',
                                  p.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
                                  p.status === 'FAILED' ? 'bg-red-50 text-red-700 ring-red-200' : 'bg-amber-50 text-amber-700 ring-amber-200'
                                )}>{p.status}</span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-gray-500">{PACKAGES[p.package]?.name_ru}</td>
                              <td className="px-5 py-3.5 text-xs text-gray-400">{formatDate(p.created_at)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  {payments.length === 0 && <div className="py-12 text-center text-sm text-gray-400">Нет платежей</div>}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 flex h-16">
        {NAV.map(n => (
          <button key={n.key} onClick={() => setTab(n.key as AdminTab)}
            className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
              tab === n.key ? 'text-[#1B4332]' : 'text-gray-400'
            )}>
            <n.icon className="w-5 h-5" />
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* ══ DETAIL MODAL ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {detailOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
                <Avatar name={selected.full_name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-gray-900 text-lg leading-tight">{selected.full_name}</h2>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-gray-400">{PACKAGES[selected.service_package]?.name_ru}</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-xs text-gray-400">{formatDate(selected.created_at)}</span>
                    {clientUser?.email && (
                      <>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400">{clientUser.email}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {selected.status === 'PAID' && (
                    <button onClick={startProcessing} disabled={startingProcessing}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50">
                      {startingProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      Начать
                    </button>
                  )}
                  {selected.status === 'IN_PROGRESS' && (
                    <button onClick={() => setCompleteOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                      <Flag className="w-4 h-4" /> Завершить
                    </button>
                  )}
                  <button onClick={() => setDetailOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status chips */}
              <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 font-medium mr-1">Статус:</span>
                {ALL_STATUSES.map(s => (
                  <button key={s} onClick={() => changeStatus(selected.id, s)}
                    className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      selected.status === s ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-100'
                    )}>
                    {selected.status === s && <CheckCheck className="w-3 h-3" />}
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-2">
                {([
                  { key: 'overview', label: 'Обзор', icon: LayoutDashboard },
                  { key: 'form',     label: 'Анкета', icon: FileText },
                  { key: 'docs',     label: `Документы${appDocs.length > 0 ? ` (${appDocs.length})` : ''}`, icon: Download },
                  { key: 'chat',     label: `Чат${appMsgs.length > 0 ? ` (${appMsgs.length})` : ''}`, icon: MessageCircle },
                ] as const).map(t => (
                  <button key={t.key} onClick={() => setDetailTab(t.key)}
                    className={cn('flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-all border-b-2 -mb-px',
                      detailTab === t.key ? 'border-[#1B4332] text-[#1B4332]' : 'border-transparent text-gray-400 hover:text-gray-600'
                    )}>
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto">

                {/* ── OVERVIEW ── */}
                {detailTab === 'overview' && (
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { icon: GraduationCap, label: 'Университет', value: ex.university ?? 'Al Qasimia University' },
                        { icon: FileText,      label: 'Степень',      value: ex.degree_type === 'bachelor' ? 'Бакалавриат' : ex.degree_type === 'master' ? 'Магистратура' : selected.education_level },
                        { icon: Globe,         label: 'Гражданство',  value: selected.citizenship ?? ex.nationality },
                        { icon: Phone,         label: 'Телефон',      value: selected.phone ?? ex.mobile },
                        { icon: Mail,          label: 'Email',        value: clientUser?.email ?? ex.email },
                        { icon: CreditCard,    label: 'Пакет',        value: PACKAGES[selected.service_package]?.name_ru },
                      ].filter(i => i.value).map(({ icon: Icon, label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                        </div>
                      ))}
                    </div>
                    {ex.programs?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Выбранные факультеты</p>
                        <div className="flex flex-wrap gap-2">
                          {ex.programs.map((p: string, i: number) => (
                            <span key={i} className="text-xs font-medium bg-[#1B4332]/8 text-[#1B4332] border border-[#1B4332]/15 px-3 py-1.5 rounded-full" dir="rtl">{p}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Внутренние заметки</p>
                      <textarea
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 h-24 resize-none transition-all"
                        value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Заметки видны только администратору..."
                      />
                      <button onClick={saveNote} className="mt-2 px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition-all">
                        Сохранить
                      </button>
                    </div>
                  </div>
                )}

                {/* ── FORM ── */}
                {detailTab === 'form' && (
                  <div className="p-6 space-y-4">
                    {[
                      { title: '👤 Личные данные', rows: [
                        ['ФИО', ex.full_name ?? selected.full_name],
                        ['Гражданство', ex.citizenship ?? selected.citizenship],
                        ['Предыдущее гражданство', ex.prev_citizenship],
                        ['Дата рождения', ex.date_of_birth],
                        ['Страна рождения', ex.country_of_birth],
                        ['Город рождения', ex.city_of_birth],
                        ['Пол', ex.gender],
                        ['Религия', ex.religion],
                        ['Семейное положение', ex.marital_status],
                        ['Паспорт №', ex.passport_number],
                        ['Дата выдачи паспорта', ex.passport_issued],
                        ['Срок действия паспорта', ex.passport_expiry],
                        ['Нац. удостоверение №', ex.national_id_number],
                        ['Живёт в ОАЭ', ex.lives_in_uae],
                        ['Жил в ОАЭ ранее', ex.lived_in_uae],
                        ['Работает', ex.is_working],
                        ['Инвалидность', ex.has_disability],
                        ['Вакцинирован COVID', ex.covid_vaccinated],
                      ]},
                      { title: '📞 Контакты', rows: [
                        ['Email', clientUser?.email ?? ex.email],
                        ['Мобильный', ex.mobile ?? selected.phone],
                        ['WhatsApp', ex.whatsapp],
                        ['Домашний тел.', ex.home_phone],
                        ['Ближайший аэропорт', ex.nearest_airport],
                        ['Skype', ex.skype],
                        ['Instagram', ex.instagram_contact],
                        ['Facebook', ex.facebook_contact],
                        ['Twitter', ex.twitter],
                      ]},
                      { title: '👨‍👩‍👦 Семья', rows: [
                        ['Отец — имя', ex.father?.name ?? ex.father_name],
                        ['Отец — тел.', ex.father?.phone ?? ex.father_phone],
                        ['Отец — email', ex.father?.email ?? ex.father_email],
                        ['Отец — работа', ex.father?.work ?? ex.father_work],
                        ['Мать — имя', ex.mother?.name ?? ex.mother_name],
                        ['Мать — тел.', ex.mother?.phone ?? ex.mother_phone],
                        ['Мать — email', ex.mother?.email ?? ex.mother_email],
                        ['Мать — работа', ex.mother?.work ?? ex.mother_work],
                        ['Родственник — имя', ex.relative?.name ?? ex.relative_name],
                        ['Родственник — тел.', ex.relative?.phone ?? ex.relative_phone],
                        ['Родственник — email', ex.relative?.email ?? ex.relative_email],
                        ['Родственник — работа', ex.relative?.work ?? ex.relative_work],
                      ]},
                      { title: '🎓 Образование', rows: [
                        ['Тип уч. заведения', ex.school_type],
                        ['Название', ex.school_name],
                        ['Страна', ex.school_country],
                        ['Город', ex.school_city],
                        ['Язык обучения', ex.school_language],
                        ['Дата окончания', ex.graduation_date],
                        ['Средний балл (GPA)', ex.gpa],
                        ['Знает языки', Array.isArray(ex.known_languages) ? ex.known_languages.join(', ') : ex.known_languages],
                        ['Лет изучал арабский', ex.arabic_years],
                        ['Где изучал арабский', ex.arabic_institute],
                        ...(ex.degree_type === 'master' ? [
                          ['Университет (бакалавр)', ex.bachelor_university],
                          ['Страна (бакалавр)', ex.bachelor_country],
                          ['Специальность', ex.bachelor_major],
                          ['Год окончания', ex.bachelor_year],
                          ['GPA (бакалавр)', ex.bachelor_gpa],
                          ['Оценка', ex.bachelor_grade],
                          ['Язык обучения', ex.bachelor_language],
                          ['Эквивалентность', ex.bachelor_equivalency],
                        ] as [string,any][] : []),
                      ]},
                    ].map(section => {
                      const visibleRows = section.rows.filter(([, v]) => v !== undefined && v !== null && v !== '')
                      if (visibleRows.length === 0) return null
                      return (
                        <div key={section.title} className="border border-gray-100 rounded-2xl overflow-hidden">
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{section.title}</p>
                          </div>
                          <div className="divide-y divide-gray-50">
                            {visibleRows.map(([label, value]) => (
                              <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
                                <span className="text-xs text-gray-400 shrink-0 w-40">{label}</span>
                                <span className="text-xs font-semibold text-gray-700 text-right break-words">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                    {ex.programs?.length > 0 && (
                      <div className="border border-gray-100 rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            📚 Выбранные программы ({ex.degree_type === 'bachelor' ? 'Бакалавриат' : 'Магистратура'})
                          </p>
                        </div>
                        <div className="px-4 py-3 flex flex-wrap gap-2">
                          {ex.programs.map((p: string, i: number) => (
                            <span key={i} className="text-xs font-medium bg-[#1B4332]/8 text-[#1B4332] border border-[#1B4332]/15 px-3 py-1.5 rounded-full" dir="rtl">{p}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── DOCS ── */}
                {detailTab === 'docs' && (
                  <div className="p-6 space-y-2">
                    {appDocs.length === 0 ? (
                      <div className="py-16 text-center">
                        <Download className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Документов нет</p>
                      </div>
                    ) : appDocs.map(doc => {
                      const typeLabel = DOC_TYPE_LABEL[doc.type] ?? doc.type
                      return (
                        <button key={doc.id} onClick={() => downloadDoc(doc)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#1B4332]/30 hover:bg-[#1B4332]/3 transition-all group text-left">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-[#1B4332]/10 flex items-center justify-center shrink-0 transition-colors">
                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#1B4332] transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1B4332] transition-colors">{typeLabel}</p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{doc.file_name}</p>
                          </div>
                          <Download className="w-4 h-4 text-gray-300 group-hover:text-[#1B4332] transition-colors shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* ── CHAT ── */}
                {detailTab === 'chat' && (
                  <div className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {appMsgs.map(msg => (
                        <div key={msg.id} className={cn('flex', msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start')}>
                          <div className={cn('max-w-[75%] rounded-2xl px-4 py-3 text-sm',
                            msg.sender === 'ADMIN'
                              ? 'bg-[#1B4332] text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                          )}>
                            <p className={cn('text-[10px] font-bold mb-1', msg.sender === 'ADMIN' ? 'text-white/60' : 'text-[#1B4332]')}>
                              {msg.sender === 'ADMIN' ? 'Вы' : selected.full_name}
                            </p>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            <p className={cn('text-[10px] mt-1.5', msg.sender === 'ADMIN' ? 'text-white/40' : 'text-gray-400')}>
                              {formatDate(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {appMsgs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <MessageCircle className="w-8 h-8 text-gray-200 mb-3" />
                          <p className="text-sm text-gray-400">Сообщений пока нет</p>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="p-3 border-t border-gray-100 flex gap-2">
                      <input
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all"
                        placeholder="Написать клиенту..."
                        value={msgText} onChange={e => setMsgText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      />
                      <button onClick={sendMessage} disabled={sending || !msgText.trim()}
                        className="px-4 py-2 rounded-xl bg-[#1B4332] text-white font-bold hover:bg-[#1B4332]/90 transition-colors disabled:opacity-40">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ COMPLETE MODAL ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {completeOpen && selected && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { if (!completing) setCompleteOpen(false) }} />
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Завершить обработку</h3>
                <button onClick={() => { if (!completing) { setCompleteOpen(false); setCompleteFiles([]) } }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {/* Auto message preview */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                    <Send className="w-3 h-3" /> Сообщение клиенту (отправится автоматически)
                  </p>
                  <p className="text-xs text-emerald-600 leading-relaxed">
                    🎓 {selected.full_name?.split(' ')[0]}, ваша заявка успешно подана в {ex.university ?? 'Al Qasimia University'}! Ваши переведённые документы доступны в личном кабинете...
                  </p>
                </div>

                {/* Credentials */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Данные studyinsaudi.com</p>
                  <input type="text" value={studysaudiLogin} onChange={e => setStudysaudiLogin(e.target.value)}
                    placeholder="Email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all" />
                  <input type="text" value={studysaudiPassword} onChange={e => setStudysaudiPassword(e.target.value)}
                    placeholder="Пароль" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all" />
                </div>

                {/* File upload */}
                <div onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#1B4332]/40 hover:bg-[#1B4332]/3 transition-all">
                  <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-500">Нажмите для загрузки файлов</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOCX</p>
                  <input ref={fileInputRef} type="file" multiple className="hidden"
                    onChange={e => {
                      if (!e.target.files) return
                      const nf = Array.from(e.target.files)
                      setCompleteFiles(prev => { const ex2 = prev.map(f => f.name); return [...prev, ...nf.filter(f => !ex2.includes(f.name))] })
                      e.target.value = ''
                    }} />
                </div>
                {completeFiles.length > 0 && (
                  <div className="space-y-2">
                    {completeFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <FileText className="w-4 h-4 text-[#1B4332] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button onClick={() => setCompleteFiles(prev => prev.filter((_, j) => j !== i))}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { setCompleteOpen(false); setCompleteFiles([]) }} disabled={completing}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-40">
                    Отмена
                  </button>
                  <button onClick={completeProcessing} disabled={completing || completeFiles.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1B4332] text-white text-sm font-bold hover:bg-[#1B4332]/90 transition-colors disabled:opacity-40">
                    {completing ? <><Loader2 className="w-4 h-4 animate-spin" />Завершаю…</> : <><Flag className="w-4 h-4" />Завершить</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
