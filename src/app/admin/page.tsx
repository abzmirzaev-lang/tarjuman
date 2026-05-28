'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users, FileText, CreditCard,
  Search, Download, Eye, Send, CheckCircle2,
  TrendingUp, LogOut, X, Play, Flag, Upload, Loader2, Trash2,
  Calendar, Globe, SlidersHorizontal, RefreshCw, ChevronDown
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button, Badge, Modal } from '@/components/ui'
import { PACKAGES, DOCUMENT_LABELS } from '@/types'
import type {
  ApplicationRow, UserRow, PaymentRow,
  MessageRow, DocumentRow, ApplicationStatus
} from '@/types'
import { formatDate, formatCurrency, cn, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

type AdminTab = 'overview' | 'applications' | 'users' | 'payments'

const ALL_STATUSES: ApplicationStatus[] = [
  'REGISTERED', 'PAID', 'IN_PROGRESS', 'UNDER_REVIEW', 'SUBMITTED', 'COMPLETED', 'REJECTED'
]

const STATUS_RU: Record<ApplicationStatus, string> = {
  REGISTERED:   'Зарегистрировано',
  PAID:         'Оплачено',
  IN_PROGRESS:  'В обработке',
  UNDER_REVIEW: 'На проверке',
  SUBMITTED:    'Подано',
  COMPLETED:    'Завершено',
  REJECTED:     'Отклонено',
}

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  REGISTERED:   'bg-gray-100 text-gray-600',
  PAID:         'bg-emerald-100 text-emerald-700',
  IN_PROGRESS:  'bg-blue-100 text-blue-700',
  UNDER_REVIEW: 'bg-violet-100 text-violet-700',
  SUBMITTED:    'bg-amber-100 text-amber-700',
  COMPLETED:    'bg-brand-100 text-brand-700',
  REJECTED:     'bg-red-100 text-red-600',
}

const TIME_FILTERS = [
  { key: '',      label: 'Всё время'     },
  { key: 'today', label: 'Сегодня'       },
  { key: 'week',  label: 'Эта неделя'   },
  { key: 'month', label: 'Этот месяц'   },
]

function isInTimeRange(dateStr: string, range: string): boolean {
  if (!range) return true
  const date = new Date(dateStr)
  const now = new Date()
  if (range === 'today') {
    return date.toDateString() === now.toDateString()
  }
  if (range === 'week') {
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
    return date >= weekAgo
  }
  if (range === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }
  return true
}

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<AdminTab>('overview')

  const [apps,     setApps]     = useState<ApplicationRow[]>([])
  const [users,    setUsers]    = useState<UserRow[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [loading,  setLoading]  = useState(true)

  // Filters
  const [search,      setSearch]      = useState('')
  const [statusFlt,   setStatusFlt]   = useState<ApplicationStatus | ''>('')
  const [timeFlt,     setTimeFlt]     = useState('')
  const [citizenFlt,  setCitizenFlt]  = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Detail modal
  const [selected,   setSelected]   = useState<ApplicationRow | null>(null)
  const [appDocs,    setAppDocs]    = useState<DocumentRow[]>([])
  const [appMsgs,    setAppMsgs]    = useState<MessageRow[]>([])
  const [msgText,    setMsgText]    = useState('')
  const [noteText,   setNoteText]   = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const [sending,    setSending]    = useState(false)

  // Processing
  const [startingProcessing, setStartingProcessing] = useState(false)
  const [completeModalOpen,  setCompleteModalOpen]  = useState(false)
  const [completeFiles,      setCompleteFiles]      = useState<File[]>([])
  const [completing,         setCompleting]         = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  async function loadData() {
    setLoading(true)
    const [{ data: a }, { data: u }, { data: p }] = await Promise.all([
      supabase.from('applications').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
    ])
    setApps(a ?? [])
    setUsers(u ?? [])
    setPayments(p ?? [])
    setLoading(false)
  }

  async function openDetail(app: ApplicationRow) {
    setSelected(app)
    setNoteText(app.notes ?? '')
    const [{ data: d }, { data: m }] = await Promise.all([
      supabase.from('documents').select('*').eq('application_id', app.id),
      supabase.from('messages').select('*').eq('application_id', app.id).order('created_at'),
    ])
    setAppDocs(d ?? [])
    setAppMsgs(m ?? [])
    setDetailOpen(true)
  }

  async function changeStatus(appId: string, newStatus: ApplicationStatus) {
    const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId)
    if (!error) {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      if (selected?.id === appId) setSelected(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success('Статус обновлён')
    } else toast.error('Ошибка')
  }

  async function startProcessing() {
    if (!selected) return
    setStartingProcessing(true)
    try {
      const res = await fetch('/api/admin/start-processing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: selected.id }),
      })
      if (!res.ok) throw new Error()
      setApps(prev => prev.map(a => a.id === selected.id ? { ...a, status: 'IN_PROGRESS' } : a))
      setSelected(prev => prev ? { ...prev, status: 'IN_PROGRESS' } : null)
      toast.success('Обработка начата. Клиент получит email.')
    } catch { toast.error('Ошибка при запуске обработки') }
    setStartingProcessing(false)
  }

  async function completeProcessing() {
    if (!selected) return
    if (completeFiles.length === 0) { toast.error('Загрузите хотя бы один документ'); return }
    setCompleting(true)
    try {
      const newDocs: DocumentRow[] = []
      for (const file of completeFiles) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const filePath = `${selected.user_id}/${selected.id}/translated/${Date.now()}_${safeName}`
        const { error: uploadErr } = await supabase.storage.from('documents').upload(filePath, file, { upsert: true })
        if (uploadErr) throw new Error(`Ошибка загрузки ${file.name}: ${uploadErr.message}`)
        const { data: doc, error: docErr } = await supabase.from('documents').insert({
          application_id: selected.id, user_id: selected.user_id,
          type: 'OTHER', file_name: file.name, file_path: filePath,
          file_size: file.size, mime_type: file.type, is_verified: true,
        }).select().single()
        if (docErr) throw new Error(docErr.message)
        if (doc) newDocs.push(doc as DocumentRow)
      }
      const res = await fetch('/api/admin/complete-processing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: selected.id }),
      })
      if (!res.ok) throw new Error('Ошибка завершения')
      setApps(prev => prev.map(a => a.id === selected.id ? { ...a, status: 'COMPLETED' } : a))
      setSelected(prev => prev ? { ...prev, status: 'COMPLETED' } : null)
      setAppDocs(prev => [...prev, ...newDocs])
      setCompleteFiles([])
      setCompleteModalOpen(false)
      toast.success(`✅ Завершено! ${newDocs.length} документ(ов) загружено. Клиент уведомлён.`)
    } catch (e: any) { toast.error(e.message ?? 'Ошибка') }
    setCompleting(false)
  }

  async function sendAdminMessage() {
    if (!msgText.trim() || !selected) return
    setSending(true)
    const { error } = await supabase.from('messages').insert({
      application_id: selected.id, user_id: selected.user_id,
      sender: 'ADMIN', content: msgText.trim(),
    })
    if (!error) {
      setAppMsgs(prev => [...prev, {
        id: 'tmp-' + Date.now(), application_id: selected.id,
        user_id: selected.user_id, sender: 'ADMIN',
        content: msgText.trim(), is_read: false, created_at: new Date().toISOString(),
      }])
      setMsgText('')
    } else toast.error('Ошибка отправки')
    setSending(false)
  }

  async function saveNote() {
    if (!selected) return
    await supabase.from('applications').update({ notes: noteText }).eq('id', selected.id)
    setApps(prev => prev.map(a => a.id === selected.id ? { ...a, notes: noteText } : a))
    toast.success('Сохранено')
  }

  async function downloadDoc(doc: DocumentRow) {
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 120)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else toast.error('Не удалось получить ссылку')
  }

  // Unique citizenships for filter
  const citizenships = Array.from(new Set(apps.map(a => a.citizenship).filter(Boolean))) as string[]

  const filteredApps = apps.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      a.full_name.toLowerCase().includes(q) ||
      a.id.includes(q) ||
      (a.citizenship ?? '').toLowerCase().includes(q) ||
      (a.phone ?? '').includes(q)
    const matchStatus = !statusFlt || a.status === statusFlt
    const matchTime   = isInTimeRange(a.created_at, timeFlt)
    const matchCitizen = !citizenFlt || a.citizenship === citizenFlt
    return matchSearch && matchStatus && matchTime && matchCitizen
  })

  const activeFiltersCount = [statusFlt, timeFlt, citizenFlt].filter(Boolean).length

  const stats = {
    total:       apps.length,
    inProgress:  apps.filter(a => a.status === 'IN_PROGRESS').length,
    completed:   apps.filter(a => a.status === 'COMPLETED').length,
    revenue:     payments.filter(p => p.status === 'PAID').reduce((s, p) => s + Number(p.amount), 0),
    needAction:  apps.filter(a => a.status === 'PAID').length,
  }

  const NAV = [
    { key: 'overview',     icon: TrendingUp, label: 'Обзор'       },
    { key: 'applications', icon: FileText,   label: 'Заявки'      },
    { key: 'users',        icon: Users,      label: 'Клиенты'     },
    { key: 'payments',     icon: CreditCard, label: 'Платежи'     },
  ] as const

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 bg-[#141414] border-r border-white/[0.06] min-h-screen fixed left-0 top-0 flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center">
              <span className="text-ink text-xs font-black">T</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">TARJUMAN</p>
              <p className="text-white/30 text-[10px] mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => setTab(n.key as AdminTab)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                tab === n.key
                  ? 'bg-brand-400/15 text-brand-400 border border-brand-400/20'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.05]'
              )}
            >
              <n.icon className="w-4 h-4 shrink-0" />
              {n.label}
              {n.key === 'applications' && stats.needAction > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {stats.needAction}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/[0.06]">
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/30 hover:text-white/70 transition-colors rounded-xl hover:bg-white/[0.05]"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#141414] border-b border-white/[0.06] h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-400 flex items-center justify-center">
            <span className="text-ink text-[10px] font-black">T</span>
          </div>
          <span className="font-bold text-white text-sm">TARJUMAN Admin</span>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>
          <LogOut className="w-4 h-4 text-white/40" />
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-16 md:pt-8 pb-24 md:pb-8 min-h-screen">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

          {/* ══════════════════════════════════
              OVERVIEW
          ══════════════════════════════════ */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Панель управления</h1>
                  <p className="text-white/40 text-sm mt-0.5">Добро пожаловать в TARJUMAN Admin</p>
                </div>
                <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/60 hover:text-white text-sm transition-all">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Обновить
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Всего заявок',  value: stats.total,                   sub: 'за всё время',     color: 'from-blue-500/20 to-blue-500/5',    icon: FileText,     iconColor: 'text-blue-400' },
                  { label: 'Ждут обработки', value: stats.needAction,             sub: 'оплачено',         color: 'from-emerald-500/20 to-emerald-500/5', icon: Play,        iconColor: 'text-emerald-400' },
                  { label: 'В обработке',   value: stats.inProgress,              sub: 'активных',         color: 'from-violet-500/20 to-violet-500/5',  icon: TrendingUp,   iconColor: 'text-violet-400' },
                  { label: 'Выручка',       value: formatCurrency(stats.revenue), sub: 'успешных платежей', color: 'from-brand-400/20 to-brand-400/5',   icon: CreditCard,   iconColor: 'text-brand-400' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} border border-white/[0.06] p-5`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn('w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center', s.iconColor)}>
                        <s.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
                    <div className="text-xs text-white/50">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Need action — highlighted */}
              {stats.needAction > 0 && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {stats.needAction} заявк{stats.needAction === 1 ? 'а' : stats.needAction < 5 ? 'и' : 'ов'} ждут обработки
                    </p>
                    <p className="text-xs text-white/40">Клиенты оплатили — нужно начать работу</p>
                  </div>
                  <button
                    onClick={() => setTab('applications')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors shrink-0"
                  >
                    Обработать
                  </button>
                </div>
              )}

              {/* Recent apps */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#141414] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <h2 className="font-semibold text-white text-sm">Последние заявки</h2>
                  <button onClick={() => setTab('applications')} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    Все заявки →
                  </button>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {apps.slice(0, 7).map(app => (
                    <div key={app.id} className="px-6 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                      <div className="w-8 h-8 bg-brand-400/20 rounded-full flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
                        {getInitials(app.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{app.full_name}</p>
                        <p className="text-xs text-white/30">{app.citizenship ?? app.country} · {formatDate(app.created_at)}</p>
                      </div>
                      <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', STATUS_COLOR[app.status])}>
                        {STATUS_RU[app.status]}
                      </span>
                      <button
                        onClick={() => openDetail(app)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 transition-all text-white/40 hover:text-white"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════
              APPLICATIONS
          ══════════════════════════════════ */}
          {tab === 'applications' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Заявки</h1>
                  <p className="text-white/40 text-sm mt-0.5">{filteredApps.length} из {apps.length}</p>
                </div>
                <button onClick={loadData} className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white/40 hover:text-white transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Search + Filters */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-400/50 focus:bg-white/[0.07] transition-all"
                      placeholder="Поиск по имени, ID, телефону..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                      <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {/* Filter toggle */}
                  <button
                    onClick={() => setShowFilters(v => !v)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                      showFilters || activeFiltersCount > 0
                        ? 'bg-brand-400/15 border-brand-400/30 text-brand-400'
                        : 'bg-white/[0.05] border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.08]'
                    )}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Фильтры
                    {activeFiltersCount > 0 && (
                      <span className="bg-brand-400 text-ink text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Filter panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {/* Status */}
                    <div>
                      <label className="text-[11px] text-white/40 font-semibold uppercase tracking-wider mb-2 block">
                        Статус
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setStatusFlt('')}
                          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                            !statusFlt ? 'bg-white/15 text-white' : 'bg-white/[0.05] text-white/40 hover:text-white/70')}
                        >
                          Все
                        </button>
                        {ALL_STATUSES.map(s => (
                          <button
                            key={s}
                            onClick={() => setStatusFlt(statusFlt === s ? '' : s)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                              statusFlt === s ? 'bg-brand-400/20 text-brand-400 border border-brand-400/30' : 'bg-white/[0.05] text-white/40 hover:text-white/70')}
                          >
                            {STATUS_RU[s]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="text-[11px] text-white/40 font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Период
                      </label>
                      <div className="flex flex-col gap-1">
                        {TIME_FILTERS.map(t => (
                          <button
                            key={t.key}
                            onClick={() => setTimeFlt(timeFlt === t.key ? '' : t.key)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all',
                              timeFlt === t.key ? 'bg-brand-400/20 text-brand-400 border border-brand-400/30' : 'bg-white/[0.05] text-white/40 hover:text-white/70')}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Citizenship */}
                    <div>
                      <label className="text-[11px] text-white/40 font-semibold uppercase tracking-wider mb-2 block flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Гражданство
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setCitizenFlt('')}
                          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                            !citizenFlt ? 'bg-white/15 text-white' : 'bg-white/[0.05] text-white/40 hover:text-white/70')}
                        >
                          Все
                        </button>
                        {citizenships.slice(0, 12).map(c => (
                          <button
                            key={c}
                            onClick={() => setCitizenFlt(citizenFlt === c ? '' : c)}
                            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                              citizenFlt === c ? 'bg-brand-400/20 text-brand-400 border border-brand-400/30' : 'bg-white/[0.05] text-white/40 hover:text-white/70')}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Clear */}
                    {activeFiltersCount > 0 && (
                      <div className="md:col-span-3 flex justify-end pt-2 border-t border-white/[0.06]">
                        <button
                          onClick={() => { setStatusFlt(''); setTimeFlt(''); setCitizenFlt('') }}
                          className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3 h-3" /> Сбросить фильтры
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Apps by package */}
              {(['VIP', 'STANDARD', 'SUBMISSION'] as const).map(pkg => {
                const pkgApps = filteredApps.filter(a => a.service_package === pkg)
                if (pkgApps.length === 0) return null
                const meta = {
                  VIP:        { label: 'VIP — $99',       badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                  STANDARD:   { label: 'Стандарт — $69',  badge: 'bg-brand-400/20 text-brand-400 border-brand-400/30' },
                  SUBMISSION: { label: 'Базовый — $29',   badge: 'bg-white/10 text-white/60 border-white/10' },
                }[pkg]
                return (
                  <div key={pkg} className="rounded-2xl border border-white/[0.06] bg-[#141414] overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-3">
                      <span className={cn('text-xs font-bold px-3 py-1 rounded-full border', meta.badge)}>{meta.label}</span>
                      <span className="text-xs text-white/30">{pkgApps.length} заявок</span>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/[0.04]">
                            {['Клиент', 'Гражданство', 'Страна', 'Статус', 'Дата', ''].map(h => (
                              <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {pkgApps.map(app => (
                            <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-brand-400/15 rounded-full flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
                                    {getInitials(app.full_name)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-white">{app.full_name}</p>
                                    <p className="text-xs text-white/30">{app.phone ?? '—'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-sm text-white/50">{app.citizenship ?? '—'}</td>
                              <td className="px-5 py-3.5 text-sm text-white/50">{app.country}</td>
                              <td className="px-5 py-3.5">
                                <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', STATUS_COLOR[app.status])}>
                                  {STATUS_RU[app.status]}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-white/30">{formatDate(app.created_at)}</td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2 justify-end">
                                  <button
                                    onClick={() => openDetail(app)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  {app.status === 'PAID' && (
                                    <button
                                      onClick={async () => { setSelected(app); await startProcessing() }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
                                    >
                                      <Play className="w-3 h-3" /> Начать
                                    </button>
                                  )}
                                  {app.status === 'IN_PROGRESS' && (
                                    <button
                                      onClick={() => openDetail(app)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/30 transition-colors"
                                    >
                                      <Flag className="w-3 h-3" /> Завершить
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-white/[0.04]">
                      {pkgApps.map(app => (
                        <div key={app.id} className="p-4 flex items-center gap-3" onClick={() => openDetail(app)}>
                          <div className="w-10 h-10 bg-brand-400/15 rounded-full flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
                            {getInitials(app.full_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{app.full_name}</p>
                            <p className="text-xs text-white/30">{app.citizenship ?? app.country} · {formatDate(app.created_at)}</p>
                            <span className={cn('inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full', STATUS_COLOR[app.status])}>
                              {STATUS_RU[app.status]}
                            </span>
                          </div>
                          <Eye className="w-4 h-4 text-white/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {filteredApps.length === 0 && (
                <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-16 text-center">
                  <FileText className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Заявки не найдены</p>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════
              USERS
          ══════════════════════════════════ */}
          {tab === 'users' && (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-white">Клиенты <span className="text-white/30 font-normal text-lg">({users.length})</span></h1>
              <div className="rounded-2xl border border-white/[0.06] bg-[#141414] overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['Клиент', 'Email', 'Telegram', 'Гражданство', 'Зарегистрирован', 'Заявок'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {users.map(user => {
                        const ua = apps.filter(a => a.user_id === user.id)
                        return (
                          <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-brand-400/15 rounded-full flex items-center justify-center text-brand-400 text-xs font-bold">
                                  {getInitials(user.full_name)}
                                </div>
                                <p className="text-sm font-medium text-white">{user.full_name ?? 'N/A'}</p>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-white/40">{user.email}</td>
                            <td className="px-5 py-3.5 text-xs text-white/40">{user.telegram ? '@' + user.telegram : '—'}</td>
                            <td className="px-5 py-3.5 text-xs text-white/40">{user.citizenship ?? '—'}</td>
                            <td className="px-5 py-3.5 text-xs text-white/30">{formatDate(user.created_at)}</td>
                            <td className="px-5 py-3.5">
                              <span className="bg-brand-400/20 text-brand-400 text-xs font-bold px-2.5 py-1 rounded-full">{ua.length}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden divide-y divide-white/[0.04]">
                  {users.map(user => (
                    <div key={user.id} className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-400/15 rounded-full flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
                        {getInitials(user.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{user.full_name ?? 'N/A'}</p>
                        <p className="text-xs text-white/30 truncate">{user.email}</p>
                        <p className="text-xs text-white/20">{user.citizenship ?? '—'} · {formatDate(user.created_at)}</p>
                      </div>
                      <span className="bg-brand-400/20 text-brand-400 text-xs font-bold px-2 py-1 rounded-full shrink-0">
                        {apps.filter(a => a.user_id === user.id).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════
              PAYMENTS
          ══════════════════════════════════ */}
          {tab === 'payments' && (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-white">Платежи</h1>
              <div className="rounded-2xl border border-white/[0.06] bg-[#141414] overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['ID', 'Клиент', 'Сумма', 'Метод', 'Статус', 'Пакет', 'Дата'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {payments.map(p => {
                        const appUser = apps.find(a => a.id === p.application_id)
                        return (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5 text-xs text-white/30 font-mono">{p.id.slice(0, 8)}…</td>
                            <td className="px-5 py-3.5 text-sm text-white/60">{appUser?.full_name ?? '—'}</td>
                            <td className="px-5 py-3.5 text-sm font-bold text-white">{formatCurrency(p.amount)}</td>
                            <td className="px-5 py-3.5 text-xs text-white/40">{p.method}</td>
                            <td className="px-5 py-3.5">
                              <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full',
                                p.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                                p.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                              )}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-white/40">{PACKAGES[p.package].name_ru}</td>
                            <td className="px-5 py-3.5 text-xs text-white/30">{formatDate(p.created_at)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden divide-y divide-white/[0.04]">
                  {payments.map(p => (
                    <div key={p.id} className="p-4 flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold',
                        p.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                        p.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      )}>$</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{formatCurrency(p.amount)}</p>
                        <p className="text-xs text-white/40">{PACKAGES[p.package].name_ru} · {p.method}</p>
                        <p className="text-xs text-white/30">{formatDate(p.created_at)}</p>
                      </div>
                      <span className={cn('text-[11px] font-semibold px-2 py-1 rounded-full shrink-0',
                        p.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                        p.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      )}>{p.status}</span>
                    </div>
                  ))}
                  {payments.length === 0 && <div className="p-8 text-center text-white/30 text-sm">Нет платежей</div>}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414] border-t border-white/[0.06] flex items-stretch h-16">
        {NAV.map(n => (
          <button
            key={n.key}
            onClick={() => setTab(n.key as AdminTab)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-all relative',
              tab === n.key ? 'text-brand-400' : 'text-white/30'
            )}
          >
            <n.icon className="w-5 h-5" />
            <span>{n.label}</span>
            {n.key === 'applications' && stats.needAction > 0 && (
              <span className="absolute top-2 right-1/4 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* ══ Detail Modal ══ */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={selected?.full_name} size="xl">
        {selected && (
          <div className="flex divide-x divide-white/[0.06] max-h-[80vh]">
            {/* Left */}
            <div className="w-80 p-5 space-y-5 overflow-y-auto scrollbar-thin">

              {/* Action button */}
              {selected.status === 'PAID' && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <p className="text-xs font-semibold text-emerald-400 mb-1">Ждёт обработки</p>
                  <p className="text-xs text-white/40 mb-3">Нажмите — клиент получит email о начале работы</p>
                  <button
                    onClick={startProcessing}
                    disabled={startingProcessing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    {startingProcessing ? <><Loader2 className="w-4 h-4 animate-spin" />Запускаю…</> : <><Play className="w-4 h-4" />Начать обработку</>}
                  </button>
                </div>
              )}

              {selected.status === 'IN_PROGRESS' && (
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                  <p className="text-xs font-semibold text-blue-400 mb-1">В обработке</p>
                  <p className="text-xs text-white/40 mb-3">Загрузите переведённые документы и завершите</p>
                  <button
                    onClick={() => setCompleteModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-400 transition-colors"
                  >
                    <Flag className="w-4 h-4" />Завершить обработку
                  </button>
                </div>
              )}

              {/* Status */}
              <div>
                <p className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mb-2">Статус</p>
                <div className="flex flex-col gap-0.5">
                  {ALL_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => changeStatus(selected.id, s)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left',
                        selected.status === s ? 'bg-brand-400/20 text-brand-400' : 'text-white/30 hover:text-white/70 hover:bg-white/[0.05]'
                      )}
                    >
                      {selected.status === s && <CheckCircle2 className="w-3 h-3" />}
                      {STATUS_RU[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mb-2">Данные</p>
                <div className="space-y-1.5 text-xs">
                  {[
                    ['Страна',        selected.country === 'SA' ? 'Саудовская Аравия' : 'ОАЭ'],
                    ['Пакет',         PACKAGES[selected.service_package].name_ru],
                    ['Гражданство',   selected.citizenship],
                    ['Телефон',       selected.phone],
                    ['Telegram',      selected.telegram],
                    ['Образование',   selected.education_level],
                    ['Арабский',      (selected as any).arabic_level],
                    ['Английский',    (selected as any).english_level],
                    ['Пол',           (selected as any).gender === 'male' ? 'Мужчина' : (selected as any).gender === 'female' ? 'Женщина' : null],
                    ['Контакт',       (selected as any).guardian_name],
                  ].map(([label, val]) => val ? (
                    <div key={label} className="flex justify-between gap-2">
                      <span className="text-white/30 shrink-0">{label}</span>
                      <span className="text-white/70 font-medium text-right">{val}</span>
                    </div>
                  ) : null)}
                </div>
              </div>

              {/* Faculties */}
              {(selected as any).selected_faculties?.length > 0 && (
                <div>
                  <p className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mb-2">Университеты</p>
                  <div className="space-y-1">
                    {(selected as any).selected_faculties.map((f: any, i: number) => (
                      <div key={i} className="text-xs bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1.5">
                        <p className="font-medium text-white/80">{f.university_name}</p>
                        <p className="text-white/30">{f.faculty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <p className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mb-2">Заметки</p>
                <textarea
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-400/50 h-20 resize-none"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Внутренние заметки..."
                />
                <button onClick={saveNote} className="mt-1 w-full py-1.5 rounded-lg bg-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.1] text-xs font-medium transition-all">
                  Сохранить
                </button>
              </div>

              {/* Documents */}
              <div>
                <p className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mb-2">
                  Документы ({appDocs.length})
                </p>
                <div className="space-y-1">
                  {appDocs.map(doc => (
                    <button key={doc.id} onClick={() => downloadDoc(doc)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-left group">
                      <FileText className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span className="text-xs text-white/60 flex-1 truncate group-hover:text-white">{doc.file_name}</span>
                      <Download className="w-3 h-3 text-white/20 group-hover:text-white/60" />
                    </button>
                  ))}
                  {appDocs.length === 0 && <p className="text-xs text-white/20">Нет документов</p>}
                </div>
              </div>
            </div>

            {/* Right: chat */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-5 py-3 border-b border-white/[0.06]">
                <p className="text-sm font-semibold text-white">Сообщения</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {appMsgs.map(msg => (
                  <div key={msg.id} className={cn('flex', msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                      msg.sender === 'ADMIN' ? 'bg-brand-400 text-ink rounded-br-sm' : 'bg-white/[0.06] text-white rounded-bl-sm'
                    )}>
                      <p className={cn('text-[10px] font-semibold mb-0.5', msg.sender === 'ADMIN' ? 'text-ink/60' : 'text-brand-400')}>
                        {msg.sender === 'ADMIN' ? 'Admin' : selected.full_name}
                      </p>
                      <p>{msg.content}</p>
                      <p className={cn('text-[10px] mt-1', msg.sender === 'ADMIN' ? 'text-ink/40' : 'text-white/30')}>
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                {appMsgs.length === 0 && <div className="text-center text-white/20 text-sm py-6">Нет сообщений</div>}
              </div>
              <div className="p-3 border-t border-white/[0.06] flex gap-2">
                <input
                  className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand-400/50 transition-all"
                  placeholder="Написать клиенту..."
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAdminMessage()}
                />
                <button
                  onClick={sendAdminMessage}
                  disabled={sending || !msgText.trim()}
                  className="px-4 py-2 rounded-xl bg-brand-400 text-ink font-bold hover:bg-brand-300 transition-colors disabled:opacity-40"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ══ Complete Modal ══ */}
      <Modal
        open={completeModalOpen}
        onClose={() => { if (!completing) { setCompleteModalOpen(false); setCompleteFiles([]) } }}
        title="Завершить обработку"
        size="md"
      >
        <div className="p-6 space-y-5">
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-sm text-blue-300">
            Загрузите переведённые документы. Клиент получит email и сможет скачать их в личном кабинете.
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center cursor-pointer hover:border-brand-400/40 hover:bg-brand-400/5 transition-all"
          >
            <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm font-medium text-white/60 mb-1">Нажмите чтобы выбрать файлы</p>
            <p className="text-xs text-white/30">PDF, JPG, PNG, DOCX</p>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => {
              if (!e.target.files) return
              const newFiles = Array.from(e.target.files)
              setCompleteFiles(prev => {
                const existing = prev.map(f => f.name)
                return [...prev, ...newFiles.filter(f => !existing.includes(f.name))]
              })
              e.target.value = ''
            }} />
          </div>

          {completeFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">Файлов: {completeFiles.length}</p>
              {completeFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                  <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-white/30">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={() => setCompleteFiles(prev => prev.filter((_, j) => j !== i))}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setCompleteModalOpen(false); setCompleteFiles([]) }}
              disabled={completing}
              className="flex-1 py-2.5 rounded-xl border border-white/[0.1] text-white/40 hover:text-white text-sm font-medium transition-colors disabled:opacity-40"
            >
              Отмена
            </button>
            <button
              onClick={completeProcessing}
              disabled={completing || completeFiles.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-400 transition-colors disabled:opacity-40"
            >
              {completing ? <><Loader2 className="w-4 h-4 animate-spin" />Завершаю…</> : <><Flag className="w-4 h-4" />Завершить заявку</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
