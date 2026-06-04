'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, LogOut, Download, CheckCircle2, Plus,
  ChevronRight, Layers, Calendar, GraduationCap, Trash2,
  Menu, Pencil, MessageCircle, Send, Clock, CheckCheck
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import { PACKAGES, STATUS_LABELS, DOCUMENT_LABELS } from '@/types'
import type { AppLanguage, ApplicationRow, DocumentRow, MessageRow } from '@/types'
import { translations } from '@/i18n'
import { formatDate, cn } from '@/lib/utils'
import { toast } from 'sonner'

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_STEPS = ['REGISTERED', 'PAID', 'IN_PROGRESS', 'SUBMITTED']

const STATUS_STEP_LABELS: Record<string, { ru: string; uz: string; en: string }> = {
  REGISTERED:   { ru: 'Ожидает оплаты',  uz: "To'lov kutilmoqda", en: 'Pending payment' },
  PAID:         { ru: 'Оплачено',         uz: "To'landi",          en: 'Paid' },
  IN_PROGRESS:  { ru: 'В обработке',      uz: 'Jarayonda',         en: 'In progress' },
  SUBMITTED:    { ru: 'Подано',           uz: 'Topshirildi',       en: 'Submitted' },
}

const STATUS_COLORS: Record<string, string> = {
  REGISTERED:   'bg-amber-100 text-amber-700 border-amber-200',
  PAID:         'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS:  'bg-purple-100 text-purple-700 border-purple-200',
  UNDER_REVIEW: 'bg-purple-100 text-purple-700 border-purple-200',
  SUBMITTED:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  COMPLETED:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  REJECTED:     'bg-red-100 text-red-700 border-red-200',
}

type Tab = 'applications' | 'documents' | 'chat'

function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-7 h-7 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// ── Status stepper ────────────────────────────────────────────────────────────

function StatusStepper({ status, lang }: { status: string; lang: AppLanguage }) {
  const curIdx = STATUS_STEPS.indexOf(status)
  const effectiveIdx = curIdx === -1 ? STATUS_STEPS.length - 1 : curIdx
  const isRejected = status === 'REJECTED'

  return (
    <div className="w-full">
      <div className="flex items-center w-full">
        {STATUS_STEPS.map((s, i) => {
          const done    = !isRejected && i < effectiveIdx
          const current = !isRejected && i === effectiveIdx
          const isLast  = i === STATUS_STEPS.length - 1

          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0',
                  isRejected  ? 'bg-gray-100 text-gray-400' :
                  done        ? 'bg-[#1B4332] text-white' :
                  current     ? 'bg-[#C9922A] text-white ring-4 ring-[#C9922A]/20' :
                                'bg-gray-100 text-gray-400'
                )}>
                  {done ? <CheckCheck className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={cn(
                  'text-[10px] font-medium text-center leading-tight max-w-[60px] hidden sm:block',
                  done    ? 'text-[#1B4332]' :
                  current ? 'text-[#C9922A] font-semibold' :
                            'text-gray-400'
                )}>
                  {STATUS_STEP_LABELS[s]?.[lang] ?? s}
                </span>
              </div>
              {!isLast && (
                <div className={cn(
                  'flex-1 h-0.5 mx-1 rounded-full transition-all',
                  done ? 'bg-[#1B4332]' : 'bg-gray-200'
                )} />
              )}
            </div>
          )
        })}
      </div>

      {/* Current step label on mobile */}
      <p className="sm:hidden text-center text-xs font-medium text-[#C9922A] mt-2">
        {STATUS_STEP_LABELS[status]?.[lang] ?? STATUS_LABELS[status as keyof typeof STATUS_LABELS]?.[lang] ?? status}
      </p>
    </div>
  )
}

// ── App Card ─────────────────────────────────────────────────────────────────

function AppCard({
  application, isSelected, lang, onSelect, onEdit, onDelete
}: {
  application: ApplicationRow
  isSelected: boolean
  lang: AppLanguage
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const ru = lang === 'ru'; const uz = lang === 'uz'

  const uniName = (application as any).extra_data?.university
    ?? (application.country === 'SA'
      ? (ru ? 'Саудовская Аравия' : uz ? 'Saudiya Arabistoni' : 'Saudi Arabia')
      : 'Al Qasimia University')

  const packageName = ru
    ? PACKAGES[application.service_package]?.name_ru
    : PACKAGES[application.service_package]?.name_en

  const degree = (application as any).extra_data?.degree_type
  const degreeLabel = degree === 'master'
    ? (ru ? 'Магистратура' : uz ? 'Magistratura' : "Master's")
    : (ru ? 'Бакалавриат' : uz ? 'Bakalavr' : "Bachelor's")

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden',
        isSelected ? 'border-[#1B4332] shadow-lg' : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md'
      )}
    >
      {/* Card header — always visible */}
      <div
        className="p-4 md:p-5 cursor-pointer"
        onClick={onSelect}
      >
        {/* Top row */}
        <div className="flex items-start gap-3 mb-4">
          <div className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm',
            isSelected ? 'bg-[#1B4332] text-white' : 'bg-gray-100 text-gray-500'
          )}>
            {application.country === 'SA' ? 'SA' : 'AE'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-ink text-sm leading-tight truncate">{uniName}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-muted">{degreeLabel}</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-muted">{packageName}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={cn(
              'text-[11px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap',
              STATUS_COLORS[application.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
            )}>
              {STATUS_LABELS[application.status as keyof typeof STATUS_LABELS]?.[lang] ?? application.status}
            </span>
            {['REGISTERED', 'PAID'].includes(application.status) && (
              <button
                onClick={e => { e.stopPropagation(); onEdit() }}
                className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#1B4332] hover:bg-[#1B4332]/5 transition-colors"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}
            {application.status === 'REGISTERED' && (
              <button
                onClick={e => { e.stopPropagation(); onDelete() }}
                className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Status stepper */}
        <StatusStepper status={application.status} lang={lang} />

        {/* Footer */}
        <div className="flex items-center gap-3 mt-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(application.created_at)}
          </span>
          {application.status === 'REGISTERED' && (
            <span className="ml-auto flex items-center gap-1 text-amber-600 font-medium">
              <Clock className="w-3 h-3" />
              {ru ? 'Ожидает оплаты' : uz ? "To'lov kutilmoqda" : 'Awaiting payment'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Chat ─────────────────────────────────────────────────────────────────────

function ChatPanel({ app, user, lang }: { app: ApplicationRow | null; user: any; lang: AppLanguage }) {
  const ru = lang === 'ru'; const uz = lang === 'uz'
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!app) return
    loadMessages(app.id)

    const channel = supabase
      .channel(`messages-${app.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `application_id=eq.${app.id}`
      }, payload => {
        setMessages(prev => [...prev, payload.new as MessageRow])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [app?.id])

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [messages])

  async function loadMessages(appId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('application_id', appId)
      .order('created_at', { ascending: true })
    setMessages(data ?? [])
    setLoading(false)
  }

  async function sendMessage() {
    if (!text.trim() || !app || !user) return
    setSending(true)
    const { error } = await supabase.from('messages').insert({
      application_id: app.id,
      user_id: user.id,
      sender: 'USER',
      content: text.trim(),
      is_read: false,
    })
    if (error) toast.error('Error sending message')
    else setText('')
    setSending(false)
  }

  if (!app) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-muted text-sm">
      {ru ? 'Выберите заявку' : uz ? 'Ariza tanlang' : 'Select an application'}
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: 400 }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-ink text-sm">
            {ru ? 'Чат с менеджером' : uz ? 'Menejer bilan chat' : 'Manager chat'}
          </p>
          <p className="text-xs text-muted">
            {(app as any).extra_data?.university ?? (ru ? 'Al Qasimia University' : 'Al Qasimia University')}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs text-muted">{ru ? 'Онлайн' : 'Online'}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <Spinner />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
              <MessageCircle className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">
              {ru ? 'Нет сообщений' : uz ? 'Xabar yoq' : 'No messages yet'}
            </p>
            <p className="text-xs text-muted max-w-[200px]">
              {ru ? 'Напишите менеджеру, мы ответим в течение нескольких часов'
                : uz ? 'Menejerga yozing, biz bir necha soat ichida javob beramiz'
                : 'Write to the manager, we reply within a few hours'}
            </p>
          </div>
        ) : (
          messages.map(msg => {
            const isUser = msg.sender === 'USER'
            return (
              <div key={msg.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-[10px] font-bold shrink-0 mr-2 mt-0.5">
                    T
                  </div>
                )}
                <div className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                  isUser
                    ? 'bg-[#1B4332] text-white rounded-tr-sm'
                    : 'bg-gray-100 text-ink rounded-tl-sm'
                )}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <p className={cn('text-[10px] mt-1', isUser ? 'text-white/60' : 'text-muted')}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder={ru ? 'Написать сообщение...' : uz ? 'Xabar yozing...' : 'Write a message...'}
            className="flex-1 bg-transparent text-sm outline-none text-ink placeholder:text-muted"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim() || sending}
            className="w-8 h-8 rounded-xl bg-[#1B4332] flex items-center justify-center text-white disabled:opacity-40 transition-opacity shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const [lang, setLang] = useLanguage()
  const t = translations[lang]
  const ru = lang === 'ru'; const uz = lang === 'uz'

  const [user,          setUser]          = useState<any>(null)
  const [authLoading,   setAuthLoading]   = useState(true)
  const [apps,          setApps]          = useState<ApplicationRow[]>([])
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [docs,          setDocs]          = useState<DocumentRow[]>([])
  const [tab,           setTab]           = useState<Tab>('applications')
  const [appLoading,    setAppLoading]    = useState(false)
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [unreadCount,   setUnreadCount]   = useState(0)

  const selectedApp = apps.find(a => a.id === selectedAppId) ?? null

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user)
        loadAllApps(data.session.user.id)
        setAuthLoading(false)
      } else {
        window.location.href = '/login'
      }
    })
  }, [])

  // Count unread messages from admin
  useEffect(() => {
    if (!selectedAppId) return
    supabase
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('application_id', selectedAppId)
      .eq('sender', 'ADMIN')
      .eq('is_read', false)
      .then(({ count }) => setUnreadCount(count ?? 0))
  }, [selectedAppId, tab])

  async function loadAllApps(userId: string) {
    const { data: appsData } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    const all = appsData ?? []
    setApps(all)
    if (all.length > 0) {
      setSelectedAppId(all[0].id)
      await loadAppData(all[0].id)
    }
  }

  async function loadAppData(appId: string) {
    setAppLoading(true)
    const { data: docsData } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', appId)
    setDocs(docsData ?? [])
    setAppLoading(false)
  }

  async function switchApp(appId: string) {
    setSelectedAppId(appId)
    await loadAppData(appId)
  }

  async function deleteApp(appId: string) {
    const confirmed = window.confirm(
      ru ? 'Удалить заявку? Это действие нельзя отменить.'
        : uz ? "Arizani o'chirish? Bu amalni bekor qilib bo'lmaydi."
        : 'Delete this application? This cannot be undone.'
    )
    if (!confirmed) return
    const { error } = await supabase.from('applications').delete().eq('id', appId)
    if (error) { toast.error(t.common.error); return }
    const remaining = apps.filter(a => a.id !== appId)
    setApps(remaining)
    if (selectedAppId === appId) {
      if (remaining.length > 0) {
        setSelectedAppId(remaining[0].id)
        await loadAppData(remaining[0].id)
      } else {
        setSelectedAppId(null)
        setDocs([])
      }
    }
    toast.success(ru ? 'Заявка удалена' : uz ? "Ariza o'chirildi" : 'Application deleted')
  }

  const handleDownloadDoc = async (doc: DocumentRow) => {
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else toast.error('Could not download file')
  }

  if (authLoading) return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted text-sm">{ru ? 'Загрузка...' : 'Loading...'}</p>
      </div>
    </div>
  )
  if (!user) return null

  const TABS: { key: Tab; icon: typeof FileText; label: string; badge?: number }[] = [
    { key: 'applications', icon: Layers,        label: ru ? 'Заявки'    : uz ? 'Arizalar'  : 'Applications' },
    { key: 'documents',    icon: FileText,       label: ru ? 'Документы' : uz ? 'Hujjatlar' : 'Documents' },
    { key: 'chat',         icon: MessageCircle, label: ru ? 'Чат'       : uz ? 'Chat'       : 'Chat', badge: unreadCount },
  ]

  const userName = user?.user_metadata?.full_name?.split(' ')[0] ?? (ru ? 'Пользователь' : 'User')

  return (
    <div className="min-h-screen bg-[#F7F8FA] overflow-x-hidden">
      <div className="flex">

        {/* SIDEBAR */}
        <aside className={cn(
          'hidden md:flex flex-col bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 shadow-sm transition-all duration-300 z-20',
          sidebarOpen ? 'w-64' : 'w-16'
        )}>
          <div className="h-16 flex items-center border-b border-gray-100 px-3 justify-between">
            {sidebarOpen && (
              <Link href="/">
                <svg viewBox="0 0 156 36" width="120" height="28" aria-label="TARJUMAN">
                  <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                  <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                  <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
                </svg>
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className={cn(
                'w-9 h-9 flex items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-gray-100 transition-colors shrink-0',
                !sidebarOpen && 'mx-auto'
              )}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          {sidebarOpen ? (
            <div className="mx-3 my-3 p-3 bg-gradient-to-br from-[#1B4332]/5 to-[#C9922A]/5 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full object-cover ring-2 ring-white" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B4332] to-[#C9922A] flex items-center justify-center text-white font-bold text-sm ring-2 ring-white">
                    {user?.user_metadata?.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{user?.user_metadata?.full_name ?? 'User'}</p>
                  <p className="text-[11px] text-muted truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center my-3">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} className="w-9 h-9 rounded-full object-cover ring-2 ring-white" alt="" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B4332] to-[#C9922A] flex items-center justify-center text-white font-bold text-sm">
                  {user?.user_metadata?.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
            </div>
          )}

          <nav className="flex-1 px-2 py-2 space-y-0.5">
            {TABS.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                title={!sidebarOpen ? item.label : undefined}
                className={cn(
                  'w-full flex items-center rounded-xl text-sm font-medium transition-all duration-150 relative',
                  sidebarOpen ? 'gap-3 px-3.5 py-2.5' : 'justify-center py-2.5',
                  tab === item.key
                    ? 'bg-[#1B4332] text-white shadow-sm'
                    : 'text-muted hover:text-ink hover:bg-gray-100'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && (
                  <>
                    {item.label}
                    {item.badge ? (
                      <span className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                        {item.badge}
                      </span>
                    ) : item.key === 'applications' && apps.length > 0 ? (
                      <span className={cn(
                        'ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
                        tab === item.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-muted'
                      )}>
                        {apps.length}
                      </span>
                    ) : null}
                  </>
                )}
                {!sidebarOpen && !!item.badge && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className={cn('py-4 border-t border-gray-100', sidebarOpen ? 'px-4 space-y-3' : 'px-2 flex flex-col items-center gap-2')}>
            {sidebarOpen && (
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {(['ru', 'uz', 'en'] as AppLanguage[]).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={cn('flex-1 py-1 text-xs font-semibold rounded-lg transition-all',
                      lang === l ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink')}
                  >{l.toUpperCase()}</button>
                ))}
              </div>
            )}
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              title={!sidebarOpen ? t.nav.logout : undefined}
              className={cn(
                'flex items-center rounded-xl text-sm text-muted hover:text-red-500 hover:bg-red-50 transition-colors',
                sidebarOpen ? 'w-full gap-2 px-3 py-2' : 'p-2'
              )}
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && t.nav.logout}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className={cn(
          'flex-1 min-h-screen overflow-x-hidden transition-all duration-300',
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        )}>
          {/* Mobile header */}
          <div className="md:hidden bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 sticky top-0 z-30">
            <Link href="/">
              <svg viewBox="0 0 156 36" width="100" height="24" aria-label="TARJUMAN">
                <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                {(['ru', 'uz', 'en'] as AppLanguage[]).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={cn('px-2 py-0.5 text-xs font-medium rounded-md transition-colors',
                      lang === l ? 'bg-white text-[#1B4332] shadow-sm' : 'text-muted')}
                  >{l.toUpperCase()}</button>
                ))}
              </div>
              <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>
                <LogOut className="w-4 h-4 text-muted" />
              </button>
            </div>
          </div>

          {/* Mobile bottom nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 flex safe-area-bottom">
            {TABS.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={cn(
                  'flex-1 flex flex-col items-center py-3 gap-1 text-[10px] font-medium transition-colors relative',
                  tab === item.key ? 'text-[#1B4332]' : 'text-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {!!item.badge && (
                  <span className="absolute top-2 right-1/4 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-8 pb-28 md:pb-8">

            {/* Greeting */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-ink">
                {ru ? `Привет, ${userName} 👋` : uz ? `Salom, ${userName} 👋` : `Hello, ${userName} 👋`}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                {apps.length === 0
                  ? (ru ? 'У вас нет заявок' : uz ? 'Sizda ariza yoq' : 'No applications yet')
                  : apps.length === 1
                  ? (ru ? '1 активная заявка' : uz ? '1 ta ariza' : '1 application')
                  : (ru ? `${apps.length} заявки` : uz ? `${apps.length} ta ariza` : `${apps.length} applications`)}
              </p>
            </div>

            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

              {/* ── TAB: ЗАЯВКИ ── */}
              {tab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-ink">
                      {ru ? 'Мои заявки' : uz ? 'Mening arizalarim' : 'My Applications'}
                    </h2>
                    <Link href="/apply">
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1B4332] text-white rounded-xl text-sm font-semibold hover:bg-[#1B4332]/90 transition-colors">
                        <Plus className="w-4 h-4" />
                        {ru ? 'Новая заявка' : uz ? 'Yangi ariza' : 'New'}
                      </button>
                    </Link>
                  </div>

                  {apps.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                      <div className="w-16 h-16 bg-[#1B4332]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-[#1B4332]" />
                      </div>
                      <h3 className="text-lg font-semibold text-ink mb-2">{t.dashboard.noApp}</h3>
                      <p className="text-sm text-muted mb-6 max-w-xs mx-auto">
                        {ru ? 'Подайте первую заявку и начните путь к арабскому образованию'
                          : uz ? "Birinchi arizangizni yuboring va arab ta'limiga yo'l boshlang"
                          : 'Submit your first application and start your journey'}
                      </p>
                      <Link href="/apply">
                        <Button size="lg" iconRight={<ChevronRight className="w-4 h-4" />}>
                          {t.dashboard.startApp}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {apps.map(application => (
                        <AppCard
                          key={application.id}
                          application={application}
                          isSelected={application.id === selectedAppId}
                          lang={lang}
                          onSelect={() => switchApp(application.id)}
                          onEdit={() => router.push(`/dashboard/edit/${application.id}`)}
                          onDelete={() => deleteApp(application.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: ДОКУМЕНТЫ ── */}
              {tab === 'documents' && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-ink">
                    {ru ? 'Документы' : uz ? 'Hujjatlar' : 'Documents'}
                  </h2>

                  {apps.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {apps.map((a, i) => (
                        <button
                          key={a.id}
                          onClick={() => switchApp(a.id)}
                          className={cn(
                            'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium shrink-0 transition-all',
                            selectedAppId === a.id
                              ? 'bg-[#1B4332] text-white'
                              : 'bg-white border border-gray-100 text-muted hover:text-ink'
                          )}
                        >
                          <span className="text-xs font-bold">{a.country}</span>
                          <span>{ru ? `Заявка ${i + 1}` : uz ? `Ariza ${i + 1}` : `App ${i + 1}`}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!selectedApp ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-muted text-sm">
                      {ru ? 'Выберите заявку' : uz ? 'Ariza tanlang' : 'Select an application'}
                    </div>
                  ) : appLoading ? (
                    <Spinner />
                  ) : docs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                      <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
                      <p className="text-sm text-muted">{t.dashboard.noDocs}</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {docs.map(doc => (
                        <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
                          <div className="w-10 h-10 bg-[#1B4332]/5 rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-[#1B4332]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{DOCUMENT_LABELS[doc.type]?.[lang] ?? doc.type}</p>
                            <p className="text-xs text-muted">{formatDate(doc.created_at)}</p>
                          </div>
                          <button
                            onClick={() => handleDownloadDoc(doc)}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <Download className="w-4 h-4 text-muted" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB: ЧАТ ── */}
              {tab === 'chat' && (
                <div className="space-y-4">
                  {apps.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {apps.map((a, i) => (
                        <button
                          key={a.id}
                          onClick={() => switchApp(a.id)}
                          className={cn(
                            'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium shrink-0 transition-all',
                            selectedAppId === a.id
                              ? 'bg-[#1B4332] text-white'
                              : 'bg-white border border-gray-100 text-muted hover:text-ink'
                          )}
                        >
                          <span>{(a as any).extra_data?.university ?? a.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <ChatPanel app={selectedApp} user={user} lang={lang} />
                </div>
              )}

            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
