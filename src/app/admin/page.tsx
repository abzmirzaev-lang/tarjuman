'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Users, FileText, CreditCard, MessageSquare, Settings,
  Search, Filter, Download, Eye, Edit2, Send, CheckCircle2,
  Clock, TrendingUp, AlertCircle, LogOut, X, ChevronDown
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button, Badge, Modal, Input } from '@/components/ui'
import { PACKAGES, STATUS_LABELS, DOCUMENT_LABELS } from '@/types'
import type {
  ApplicationRow, UserRow, PaymentRow,
  MessageRow, DocumentRow, ApplicationStatus
} from '@/types'
import { formatDate, formatCurrency, cn, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

type AdminTab = 'overview' | 'applications' | 'users' | 'payments' | 'universities'

const ALL_STATUSES: ApplicationStatus[] = [
  'REGISTERED', 'PAID', 'IN_PROGRESS', 'UNDER_REVIEW', 'SUBMITTED', 'COMPLETED', 'REJECTED'
]

const STATUS_NEXT: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  PAID:         'IN_PROGRESS',
  IN_PROGRESS:  'UNDER_REVIEW',
  UNDER_REVIEW: 'SUBMITTED',
  SUBMITTED:    'COMPLETED',
}

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<AdminTab>('overview')

  // Data
  const [apps,     setApps]     = useState<ApplicationRow[]>([])
  const [users,    setUsers]    = useState<UserRow[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [docs,     setDocs]     = useState<DocumentRow[]>([])

  // Filters
  const [search,    setSearch]    = useState('')
  const [statusFlt, setStatusFlt] = useState<ApplicationStatus | ''>('')

  // Selected app for detail
  const [selected, setSelected] = useState<ApplicationRow | null>(null)
  const [appDocs,  setAppDocs]  = useState<DocumentRow[]>([])
  const [appMsgs,  setAppMsgs]  = useState<MessageRow[]>([])
  const [msgText,  setMsgText]  = useState('')
  const [noteText, setNoteText] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    // Check admin
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
    const [{ data: a }, { data: u }, { data: p }, { data: d }] = await Promise.all([
      supabase.from('applications').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('documents').select('*'),
    ])
    setApps(a ?? [])
    setUsers(u ?? [])
    setPayments(p ?? [])
    setDocs(d ?? [])
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
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId)

    if (!error) {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      if (selected?.id === appId) setSelected(prev => prev ? { ...prev, status: newStatus } : null)
      toast.success(`Status → ${newStatus}`)
      // Notify via API
      fetch('/api/notifications/status-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, newStatus }),
      }).catch(() => {})
    } else toast.error('Error updating status')
  }

  async function sendAdminMessage() {
    if (!msgText.trim() || !selected) return
    setSending(true)
    const user = await supabase.auth.getUser()
    const { error } = await supabase.from('messages').insert({
      application_id: selected.id,
      user_id:        selected.user_id,
      sender:         'ADMIN',
      content:        msgText.trim(),
    })
    if (!error) {
      setAppMsgs(prev => [...prev, {
        id: 'temp-' + Date.now(), application_id: selected.id,
        user_id: selected.user_id, sender: 'ADMIN',
        content: msgText.trim(), is_read: false, created_at: new Date().toISOString(),
      }])
      setMsgText('')
    } else toast.error('Error sending message')
    setSending(false)
  }

  async function saveNote() {
    if (!selected) return
    const { error } = await supabase.from('applications').update({ notes: noteText }).eq('id', selected.id)
    if (!error) {
      setApps(prev => prev.map(a => a.id === selected.id ? { ...a, notes: noteText } : a))
      toast.success('Note saved')
    }
  }

  async function downloadDoc(doc: DocumentRow) {
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 120)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  const filteredApps = apps.filter(a => {
    const matchSearch = !search ||
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.includes(search)
    const matchStatus = !statusFlt || a.status === statusFlt
    return matchSearch && matchStatus
  })

  // Stats
  const stats = {
    total:      apps.length,
    paid:       apps.filter(a => a.status !== 'REGISTERED').length,
    completed:  apps.filter(a => a.status === 'COMPLETED').length,
    revenue:    payments.filter(p => p.status === 'PAID').reduce((s, p) => s + Number(p.amount), 0),
  }

  const STATUS_RU: Record<ApplicationStatus, string> = {
    REGISTERED:   'Зарегистрировано',
    PAID:         'Оплачено',
    IN_PROGRESS:  'В обработке',
    UNDER_REVIEW: 'На проверке',
    SUBMITTED:    'Подано',
    COMPLETED:    'Завершено',
    REJECTED:     'Отклонено',
  }

  const NAV = [
    { key: 'overview',      icon: TrendingUp,    label: 'Обзор'      },
    { key: 'applications',  icon: FileText,       label: 'Заявки'     },
    { key: 'users',         icon: Users,          label: 'Пользователи'},
    { key: 'payments',      icon: CreditCard,     label: 'Платежи'    },
    { key: 'universities',  icon: Settings,       label: 'Университеты'},
  ] as const

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Admin Sidebar — только desktop */}
      <aside className="hidden md:flex w-60 bg-ink text-white min-h-screen fixed left-0 top-0 flex-col">
        <div className="h-14 flex items-center px-5 border-b border-white/10">
          <span className="font-bold text-white">TARJUMAN Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => setTab(n.key as AdminTab)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                tab === n.key
                  ? 'bg-brand-400 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <n.icon className="w-4 h-4 shrink-0" />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-ink text-white h-14 flex items-center justify-between px-4">
        <span className="font-bold text-sm">TARJUMAN Admin</span>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>
          <LogOut className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 md:ml-60 p-4 md:p-8 pt-16 md:pt-8 pb-24 md:pb-8">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-ink">Панель управления</h1>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: FileText, label: 'Всего заявок',  value: stats.total,                     color: 'bg-blue-50 text-blue-600' },
                  { icon: CheckCircle2, label: 'Оплачено',  value: stats.paid,                      color: 'bg-brand-50 text-brand-600' },
                  { icon: TrendingUp, label: 'Завершено',   value: stats.completed,                 color: 'bg-purple-50 text-purple-600' },
                  { icon: CreditCard, label: 'Выручка',     value: formatCurrency(stats.revenue),   color: 'bg-amber-50 text-amber-600' },
                ].map((s, i) => (
                  <div key={i} className="card p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-ink">{s.value}</div>
                    <div className="text-xs text-muted mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent applications */}
              <div className="card">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-ink">Последние заявки</h2>
                  <button onClick={() => setTab('applications')} className="text-xs text-brand-500 hover:underline">Все заявки →</button>
                </div>
                <div className="divide-y divide-border">
                  {apps.slice(0, 6).map(app => (
                    <div key={app.id} className="px-6 py-3 flex items-center gap-4 hover:bg-surface transition-colors">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                        {getInitials(app.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{app.full_name}</p>
                        <p className="text-xs text-muted">{app.country === 'SA' ? '🇸🇦 Саудовская Аравия' : '🇦🇪 ОАЭ'} · {formatDate(app.created_at)}</p>
                      </div>
                      <Badge status={app.status} label={STATUS_RU[app.status]} />
                      <button onClick={() => openDetail(app)} className="btn-ghost btn-sm p-1.5 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── APPLICATIONS ── */}
          {tab === 'applications' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-ink">Заявки ({apps.length})</h1>
              </div>

              {/* Package tabs */}
              <div className="flex gap-2 flex-wrap">
                {([
                  { key: '',           label: 'Все',            count: apps.length,                                        color: 'bg-surface border border-border text-ink' },
                  { key: 'VIP',        label: '👑 VIP — $99',   count: apps.filter(a => a.service_package === 'VIP').length,        color: 'bg-amber-50 border border-amber-200 text-amber-700' },
                  { key: 'STANDARD',   label: '⭐ Стандарт — $69', count: apps.filter(a => a.service_package === 'STANDARD').length, color: 'bg-brand-50 border border-brand-200 text-brand-700' },
                  { key: 'SUBMISSION', label: '📄 Базовый — $29',  count: apps.filter(a => a.service_package === 'SUBMISSION').length, color: 'bg-gray-50 border border-gray-200 text-gray-700' },
                ] as const).map(pkg => (
                  <button
                    key={pkg.key}
                    onClick={() => setStatusFlt(prev => prev)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                      pkg.color
                    )}
                    style={{ cursor: 'default' }}
                  >
                    {pkg.label}
                    <span className="bg-white/60 px-1.5 py-0.5 rounded-full text-xs font-bold">{pkg.count}</span>
                  </button>
                ))}
              </div>

              {/* Filters */}
              {/* Mobile search — full width */}
              <div className="relative md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  className="input pl-9 w-full"
                  placeholder="Поиск по имени..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* Mobile status filter */}
              <div className="md:hidden">
                <select className="input w-full" value={statusFlt} onChange={e => setStatusFlt(e.target.value as any)}>
                  <option value="">Все статусы</option>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_RU[s]}</option>)}
                </select>
              </div>
              {/* Desktop filters */}
              <div className="hidden md:flex gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input className="input pl-9 w-64" placeholder="Поиск по имени или ID..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="input w-48" value={statusFlt} onChange={e => setStatusFlt(e.target.value as any)}>
                  <option value="">Все статусы</option>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_RU[s]}</option>)}
                </select>
                <select className="input w-48" onChange={e => {
                  const val = e.target.value as 'VIP' | 'STANDARD' | 'SUBMISSION' | ''
                  setSearch(prev => prev)
                  ;(window as any).__pkgFilter = val
                  setSearch(s => s + '')
                }}>
                  <option value="">Все пакеты</option>
                  <option value="VIP">👑 VIP — $99</option>
                  <option value="STANDARD">⭐ Стандарт — $69</option>
                  <option value="SUBMISSION">📄 Базовый — $29</option>
                </select>
              </div>

              {/* Tables by package */}
              {(['VIP', 'STANDARD', 'SUBMISSION'] as const).map(pkg => {
                const pkgApps = filteredApps.filter(a => a.service_package === pkg)
                if (pkgApps.length === 0) return null
                const pkgMeta = {
                  VIP:        { label: '👑 VIP — $99',      color: 'bg-amber-50 border-amber-200 text-amber-700' },
                  STANDARD:   { label: '⭐ Стандарт — $69', color: 'bg-brand-50 border-brand-200 text-brand-700' },
                  SUBMISSION: { label: '📄 Базовый — $29',  color: 'bg-gray-50 border-gray-200 text-gray-700' },
                }[pkg]
                return (
                  <div key={pkg} className="card overflow-hidden">
                    <div className={cn('px-5 py-3 border-b border-border flex items-center gap-2', pkgMeta.color)}>
                      <span className="text-sm font-bold">{pkgMeta.label}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-white/50 rounded-full">{pkgApps.length} заявок</span>
                    </div>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-surface border-b border-border">
                          <tr>
                            {['Имя', 'Страна', 'Статус', 'Дата', 'Действия'].map(h => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {pkgApps.map(app => (
                            <tr key={app.id} className="hover:bg-surface transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600 shrink-0">
                                    {getInitials(app.full_name)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-ink">{app.full_name}</p>
                                    <p className="text-xs text-muted">{app.citizenship}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-muted">{app.country === 'SA' ? '🇸🇦' : '🇦🇪'}</td>
                              <td className="px-4 py-3"><Badge status={app.status} label={STATUS_RU[app.status]} /></td>
                              <td className="px-4 py-3 text-xs text-muted">{formatDate(app.created_at)}</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1">
                                  <button onClick={() => openDetail(app)} className="btn-ghost btn-sm p-1.5 rounded-lg">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  {STATUS_NEXT[app.status] && (
                                    <button onClick={() => changeStatus(app.id, STATUS_NEXT[app.status]!)} className="btn btn-primary btn-sm px-2.5 py-1 text-xs">
                                      → {STATUS_RU[STATUS_NEXT[app.status]!]}
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
                    <div className="md:hidden divide-y divide-border">
                      {pkgApps.map(app => (
                        <div key={app.id} className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600 shrink-0">
                            {getInitials(app.full_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink truncate">{app.full_name}</p>
                            <p className="text-xs text-muted">{app.country === 'SA' ? '🇸🇦' : '🇦🇪'} · {formatDate(app.created_at)}</p>
                            <div className="mt-1">
                              <Badge status={app.status} label={STATUS_RU[app.status]} />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button onClick={() => openDetail(app)} className="p-2 rounded-xl bg-surface hover:bg-border transition-colors">
                              <Eye className="w-4 h-4 text-muted" />
                            </button>
                            {STATUS_NEXT[app.status] && (
                              <button onClick={() => changeStatus(app.id, STATUS_NEXT[app.status]!)} className="px-2 py-1 rounded-lg bg-brand-400 text-white text-[10px] font-bold">
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {filteredApps.length === 0 && (
                <div className="card p-12 text-center text-muted">Нет заявок</div>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-ink">Пользователи ({users.length})</h1>
              <div className="card overflow-hidden">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface border-b border-border">
                      <tr>
                        {['Пользователь', 'Telegram', 'Гражданство', 'Дата рег.', 'Заявок'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map(user => {
                        const userApps = apps.filter(a => a.user_id === user.id)
                        return (
                          <tr key={user.id} className="hover:bg-surface transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600">
                                  {getInitials(user.full_name)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-ink">{user.full_name ?? 'N/A'}</p>
                                  <p className="text-xs text-muted">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted">{user.telegram ?? '—'}</td>
                            <td className="px-4 py-3 text-xs text-muted">{user.citizenship ?? '—'}</td>
                            <td className="px-4 py-3 text-xs text-muted">{formatDate(user.created_at)}</td>
                            <td className="px-4 py-3">
                              <span className="badge badge-blue text-xs">{userApps.length}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-border">
                  {users.map(user => {
                    const userApps = apps.filter(a => a.user_id === user.id)
                    return (
                      <div key={user.id} className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-600 shrink-0">
                          {getInitials(user.full_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">{user.full_name ?? 'N/A'}</p>
                          <p className="text-xs text-muted truncate">{user.email}</p>
                          <p className="text-xs text-muted mt-0.5">{user.citizenship ?? '—'} · {formatDate(user.created_at)}</p>
                          {user.telegram && <p className="text-xs text-muted">@{user.telegram}</p>}
                        </div>
                        <span className="badge badge-blue text-xs shrink-0">{userApps.length} заявок</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {tab === 'payments' && (
            <div className="space-y-5">
              <h1 className="text-2xl font-bold text-ink">Платежи</h1>
              <div className="card overflow-hidden">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface border-b border-border">
                      <tr>
                        {['ID', 'Сумма', 'Метод', 'Статус', 'Пакет', 'Дата'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {payments.map(p => (
                        <tr key={p.id} className="hover:bg-surface transition-colors">
                          <td className="px-4 py-3 text-xs text-muted font-mono">{p.id.slice(0, 8)}…</td>
                          <td className="px-4 py-3 text-sm font-semibold text-ink">{formatCurrency(p.amount)}</td>
                          <td className="px-4 py-3 text-xs text-muted">{p.method}</td>
                          <td className="px-4 py-3">
                            <Badge
                              label={p.status}
                              color={p.status === 'PAID' ? 'green' : p.status === 'FAILED' ? 'red' : 'yellow'}
                            />
                          </td>
                          <td className="px-4 py-3 text-xs text-muted">{PACKAGES[p.package].name_ru}</td>
                          <td className="px-4 py-3 text-xs text-muted">{formatDate(p.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-border">
                  {payments.map(p => (
                    <div key={p.id} className="p-4 flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold',
                        p.status === 'PAID' ? 'bg-brand-100 text-brand-600' :
                        p.status === 'FAILED' ? 'bg-red-50 text-red-500' :
                        'bg-yellow-50 text-yellow-600'
                      )}>
                        $
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink">{formatCurrency(p.amount)}</p>
                        <p className="text-xs text-muted">{PACKAGES[p.package].name_ru} · {p.method}</p>
                        <p className="text-xs text-muted">{formatDate(p.created_at)}</p>
                      </div>
                      <Badge
                        label={p.status}
                        color={p.status === 'PAID' ? 'green' : p.status === 'FAILED' ? 'red' : 'yellow'}
                      />
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <div className="p-8 text-center text-muted text-sm">Нет платежей</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border flex items-stretch h-16">
        {NAV.map(n => (
          <button
            key={n.key}
            onClick={() => setTab(n.key as AdminTab)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-all',
              tab === n.key ? 'text-brand-500' : 'text-muted'
            )}
          >
            <n.icon className={cn('w-5 h-5', tab === n.key ? 'text-brand-500' : 'text-muted')} />
            <span className="truncate w-full text-center px-0.5">{n.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Application Detail Modal ── */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={selected?.full_name} size="xl">
        {selected && (
          <div className="flex divide-x divide-border max-h-[80vh]">
            {/* Left: info */}
            <div className="w-80 p-5 space-y-5 overflow-y-auto scrollbar-thin">
              {/* Status control */}
              <div>
                <p className="text-xs text-muted font-semibold mb-2 uppercase tracking-wide">Статус</p>
                <div className="flex flex-col gap-1">
                  {ALL_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => changeStatus(selected.id, s)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left',
                        selected.status === s
                          ? 'bg-brand-400 text-white'
                          : 'text-muted hover:bg-surface hover:text-ink'
                      )}
                    >
                      {selected.status === s && <CheckCircle2 className="w-3 h-3" />}
                      {STATUS_RU[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="text-xs space-y-2">
                <p className="text-muted font-semibold uppercase tracking-wide mb-2">Данные</p>
                {[
                  ['Страна', selected.country === 'SA' ? '🇸🇦 Саудовская Аравия' : '🇦🇪 ОАЭ'],
                  ['Пакет', PACKAGES[selected.service_package].name_ru],
                  ['Гражданство', selected.citizenship],
                  ['Телефон', selected.phone],
                  ['Telegram', selected.telegram],
                  ['Пол', (selected as any).gender === 'male' ? 'Мужчина' : (selected as any).gender === 'female' ? 'Женщина' : null],
                  ['Семейное положение', (selected as any).marital_status === 'single' ? 'Не в браке' : (selected as any).marital_status === 'married' ? 'В браке' : (selected as any).marital_status === 'divorced' ? 'Разведён(а)' : (selected as any).marital_status === 'widowed' ? 'Вдовец/Вдова' : null],
                  ['Арабский язык', (selected as any).arabic_level],
                  ['Английский язык', (selected as any).english_level],
                  ['Образование', selected.education_level],
                  ['Контакт близкого', (selected as any).guardian_name],
                  ['Тел. близкого', (selected as any).guardian_phone],
                ].map(([label, val]) => val ? (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-muted shrink-0">{label}</span>
                    <span className="text-ink font-medium text-right">{val}</span>
                  </div>
                ) : null)}
              </div>

              {/* Selected faculties */}
              {(selected as any).selected_faculties?.length > 0 && (
                <div>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
                    Университеты ({(selected as any).selected_faculties.length})
                  </p>
                  <div className="space-y-1">
                    {(selected as any).selected_faculties.map((f: any, i: number) => (
                      <div key={i} className="text-xs bg-brand-50 border border-brand-100 rounded-lg px-2 py-1.5">
                        <p className="font-medium text-ink">{f.university_name}</p>
                        <p className="text-muted">{f.faculty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">Заметки</p>
                <textarea
                  className="input text-xs h-20 resize-none"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Внутренние заметки..."
                />
                <button onClick={saveNote} className="btn btn-secondary btn-sm mt-1 w-full text-xs">Сохранить</button>
              </div>

              {/* Documents */}
              <div>
                <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
                  Документы ({appDocs.length})
                </p>
                <div className="space-y-1.5">
                  {appDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => downloadDoc(doc)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-surface transition-colors text-left"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span className="text-xs text-ink flex-1 truncate">{DOCUMENT_LABELS[doc.type].ru}</span>
                      <Download className="w-3 h-3 text-muted" />
                    </button>
                  ))}
                  {appDocs.length === 0 && <p className="text-xs text-muted">Нет документов</p>}
                </div>
              </div>
            </div>

            {/* Right: chat */}
            <div className="flex-1 flex flex-col">
              <div className="px-5 py-3 border-b border-border">
                <p className="text-sm font-semibold text-ink">Сообщения</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {appMsgs.map(msg => (
                  <div key={msg.id} className={cn('flex', msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                      msg.sender === 'ADMIN'
                        ? 'bg-brand-400 text-white rounded-br-sm'
                        : 'bg-surface border border-border text-ink rounded-bl-sm'
                    )}>
                      <p className={cn('text-[10px] font-semibold mb-0.5', msg.sender === 'ADMIN' ? 'text-white/70' : 'text-brand-500')}>
                        {msg.sender === 'ADMIN' ? 'Admin' : selected.full_name}
                      </p>
                      <p>{msg.content}</p>
                      <p className={cn('text-[10px] mt-1', msg.sender === 'ADMIN' ? 'text-white/60' : 'text-muted')}>
                        {formatDate(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                {appMsgs.length === 0 && (
                  <div className="text-center text-muted text-sm py-6">Нет сообщений</div>
                )}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <input
                  className="input flex-1 text-sm"
                  placeholder="Написать пользователю..."
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAdminMessage()}
                />
                <Button size="sm" onClick={sendAdminMessage} loading={sending}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
