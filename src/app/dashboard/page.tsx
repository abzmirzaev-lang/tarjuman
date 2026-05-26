'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FileText, CreditCard, MessageSquare, Clock, LogOut,
  Send, Download, CheckCircle2, AlertCircle, User, Plus,
  ChevronRight, Bell
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button, Badge } from '@/components/ui'
import { PACKAGES, STATUS_LABELS, DOCUMENT_LABELS } from '@/types'
import type {
  AppLanguage, ApplicationRow, DocumentRow,
  PaymentRow, MessageRow, StatusHistoryRow
} from '@/types'
import { translations } from '@/i18n'
import { formatDate, formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_ORDER = ['REGISTERED', 'PAID', 'IN_PROGRESS', 'UNDER_REVIEW', 'SUBMITTED', 'COMPLETED']

type Tab = 'status' | 'documents' | 'payment' | 'messages' | 'timeline'

export default function DashboardPage() {
  const router = useRouter()
  const [lang, setLang] = useState<AppLanguage>('ru')
  const t = translations[lang]

  const [user,      setUser]      = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [app,       setApp]       = useState<ApplicationRow | null>(null)
  const [docs,      setDocs]      = useState<DocumentRow[]>([])
  const [payment,   setPayment]   = useState<PaymentRow | null>(null)
  const [messages,  setMessages]  = useState<MessageRow[]>([])
  const [history,   setHistory]   = useState<StatusHistoryRow[]>([])
  const [tab,       setTab]       = useState<Tab>('status')
  const [msgText,   setMsgText]   = useState('')
  const [sending,   setSending]   = useState(false)
  const [unread,    setUnread]    = useState(0)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user)
        loadData(data.session.user.id)
        setAuthLoading(false)
      } else {
        window.location.href = '/login'
      }
    })
  }, [])

  // Realtime messages
  useEffect(() => {
    if (!app?.id) return
    const channel = supabase
      .channel(`messages:${app.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `application_id=eq.${app.id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as MessageRow])
          if ((payload.new as MessageRow).sender === 'ADMIN') setUnread(u => u + 1)
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [app?.id])

  async function loadData(userId: string) {
    const [{ data: apps }, { data: paymentsData }] = await Promise.all([
      supabase.from('applications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1),
      supabase.from('payments').select('*').eq('user_id', userId).eq('status', 'PAID').limit(1),
    ])

    const currentApp = apps?.[0] ?? null
    setApp(currentApp)
    setPayment(paymentsData?.[0] ?? null)

    if (currentApp) {
      const [{ data: docsData }, { data: msgsData }, { data: histData }] = await Promise.all([
        supabase.from('documents').select('*').eq('application_id', currentApp.id),
        supabase.from('messages').select('*').eq('application_id', currentApp.id).order('created_at'),
        supabase.from('status_history').select('*').eq('application_id', currentApp.id).order('created_at'),
      ])
      setDocs(docsData ?? [])
      setMessages(msgsData ?? [])
      setHistory(histData ?? [])
      setUnread((msgsData ?? []).filter(m => m.sender === 'ADMIN' && !m.is_read).length)
    }
  }

  const handleSendMessage = async () => {
    if (!msgText.trim() || !app || !user) return
    setSending(true)
    const { error } = await supabase.from('messages').insert({
      application_id: app.id,
      user_id:        user.id,
      sender:         'USER',
      content:        msgText.trim(),
    })
    if (!error) {
      setMsgText('')
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else toast.error(t.common.error)
    setSending(false)
  }

  const handleDownloadDoc = async (doc: DocumentRow) => {
    const { data, error } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else toast.error('Could not download file')
  }

  if (authLoading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted text-sm">Загрузка...</p>
      </div>
    </div>
  )
  if (!user) return null

  const statusIdx  = app ? STATUS_ORDER.indexOf(app.status) : -1
  const statusLabel = (s: string) => STATUS_LABELS[s as keyof typeof STATUS_LABELS]?.[lang] ?? s

  const TABS: { key: Tab; icon: typeof FileText; label: string; badge?: number }[] = [
    { key: 'status',    icon: CheckCircle2,  label: t.dashboard.status },
    { key: 'documents', icon: FileText,      label: t.dashboard.documents },
    { key: 'payment',   icon: CreditCard,    label: t.dashboard.payment },
    { key: 'messages',  icon: MessageSquare, label: t.dashboard.messages, badge: unread },
    { key: 'timeline',  icon: Clock,         label: t.dashboard.timeline },
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar */}
      <div className="flex">
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border min-h-screen fixed left-0 top-0">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link href="/" className="flex items-center">
              <svg viewBox="0 0 156 36" width="140" height="32" aria-label="TARJUMAN">
                <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
              </svg>
            </Link>
          </div>

          {/* User */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} className="w-9 h-9 rounded-full object-cover" alt="" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-medium text-sm">
                  {user?.user_metadata?.full_name?.[0] ?? '?'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink truncate">{user?.user_metadata?.full_name ?? 'User'}</p>
                <p className="text-xs text-muted truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {TABS.map(item => (
              <button
                key={item.key}
                onClick={() => { setTab(item.key); if (item.key === 'messages') setUnread(0) }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  tab === item.key
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-muted hover:text-ink hover:bg-ink/5'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.badge ? (
                  <span className="ml-auto bg-brand-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>

          {/* Language + Logout */}
          <div className="px-4 py-4 border-t border-border space-y-2">
            <div className="flex gap-1">
              {(['ru', 'uz', 'en'] as AppLanguage[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={cn('flex-1 py-1 text-xs font-medium rounded-lg transition-colors',
                    lang === l ? 'bg-brand-50 text-brand-600' : 'text-muted hover:text-ink')}
                >{l.toUpperCase()}</button>
              ))}
            </div>
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted hover:text-ink hover:bg-ink/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t.nav.logout}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 md:ml-64 min-h-screen">
          {/* Mobile header */}
          <div className="md:hidden bg-white border-b border-border h-14 flex items-center justify-between px-4 sticky top-0 z-30">
            <Link href="/" className="flex items-center">
              <svg viewBox="0 0 156 36" width="140" height="32" aria-label="TARJUMAN">
                <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-surface rounded-lg p-0.5">
                {(['ru', 'uz', 'en'] as AppLanguage[]).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className={cn('px-2 py-0.5 text-xs font-medium rounded-md transition-colors',
                      lang === l ? 'bg-white text-brand-600 shadow-sm' : 'text-muted')}
                  >{l.toUpperCase()}</button>
                ))}
              </div>
              <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>
                <LogOut className="w-4 h-4 text-muted" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-8 pb-24 md:pb-8">
            {/* No application state */}
            {!app && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-brand-400" />
                </div>
                <h2 className="text-xl font-semibold text-ink mb-2">{t.dashboard.noApp}</h2>
                <p className="text-muted text-sm mb-6 max-w-xs">
                  {lang === 'ru' ? 'Начните своё арабское образование прямо сейчас' : 'Start your Arab education journey now'}
                </p>
                <Link href="/apply">
                  <Button size="lg" iconRight={<ChevronRight className="w-4 h-4" />}>{t.dashboard.startApp}</Button>
                </Link>
              </div>
            )}

            {app && (
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

                {/* ── STATUS TAB ── */}
                {tab === 'status' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold text-ink">{t.dashboard.title}</h1>
                      <Badge status={app.status} label={statusLabel(app.status)} />
                    </div>

                    {/* Status pipeline */}
                    <div className="card p-4 md:p-6">
                      <h3 className="text-sm font-semibold text-ink mb-4">{t.dashboard.status}</h3>
                      {/* Mobile: vertical list */}
                      <div className="flex flex-col gap-3 sm:hidden">
                        {STATUS_ORDER.map((s, i) => {
                          const done    = i < statusIdx
                          const current = i === statusIdx
                          return (
                            <div key={s} className="flex items-center gap-3">
                              <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                                done    ? 'bg-brand-400 text-white' :
                                current ? 'bg-brand-400 text-white ring-4 ring-brand-100' :
                                          'bg-border text-muted'
                              )}>
                                {done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                              </div>
                              <span className={cn(
                                'text-sm',
                                current ? 'text-brand-600 font-semibold' : done ? 'text-brand-400' : 'text-muted'
                              )}>
                                {statusLabel(s)}
                              </span>
                              {current && <span className="ml-auto text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">Текущий</span>}
                            </div>
                          )
                        })}
                      </div>
                      {/* Desktop: horizontal */}
                      <div className="hidden sm:flex items-center gap-0">
                        {STATUS_ORDER.map((s, i) => {
                          const done    = i < statusIdx
                          const current = i === statusIdx
                          return (
                            <div key={s} className="flex-1 flex flex-col items-center relative">
                              {i > 0 && (
                                <div className={cn('absolute left-0 top-3.5 h-0.5 w-1/2 -translate-x-full', done || current ? 'bg-brand-400' : 'bg-border')} />
                              )}
                              {i < STATUS_ORDER.length - 1 && (
                                <div className={cn('absolute right-0 top-3.5 h-0.5 w-1/2 translate-x-full', done ? 'bg-brand-400' : 'bg-border')} />
                              )}
                              <div className={cn(
                                'w-7 h-7 rounded-full flex items-center justify-center z-10',
                                done    ? 'bg-brand-400 text-white' :
                                current ? 'bg-brand-400 text-white ring-4 ring-brand-100' :
                                          'bg-border text-muted'
                              )}>
                                {done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                              </div>
                              <span className={cn('text-[10px] mt-2 text-center px-1 leading-tight', current ? 'text-brand-600 font-semibold' : done ? 'text-brand-400' : 'text-muted')}>
                                {statusLabel(s)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Pay now banner — shown when REGISTERED */}
                    {app.status === 'REGISTERED' && (
                      <div className="card p-4 border-2 border-emerald-200 bg-emerald-50">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-ink text-sm">
                                {lang === 'ru' ? 'Ожидает оплаты' : 'Awaiting Payment'}
                              </p>
                              <span className="text-lg font-bold text-ink shrink-0">${PACKAGES[app.service_package].priceUSD}</span>
                            </div>
                            <p className="text-xs text-muted mt-0.5">
                              {lang === 'ru' ? 'Менеджер свяжется с вами в ближайшее время' : 'Manager will contact you soon'}
                            </p>
                          </div>
                        </div>
                        <button disabled className="w-full py-2.5 rounded-xl bg-emerald-400 text-white text-sm font-semibold opacity-50 cursor-not-allowed">
                          {lang === 'ru' ? '💳 Оплатить онлайн (скоро)' : '💳 Pay Online (coming soon)'}
                        </button>
                      </div>
                    )}

                    {/* Details card */}
                    <div className="card p-4 md:p-6">
                      <h3 className="text-sm font-semibold text-ink mb-4">
                        {lang === 'ru' ? 'Детали заявки' : 'Application Details'}
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4">
                          <span className="text-muted shrink-0">{lang === 'ru' ? 'Страна' : 'Country'}</span>
                          <span className="text-ink font-medium">{app.country === 'SA' ? '🇸🇦 Саудовская Аравия' : '🇦🇪 ОАЭ'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4">
                          <span className="text-muted shrink-0">{lang === 'ru' ? 'Пакет' : 'Package'}</span>
                          <span className="text-ink font-medium">{lang === 'ru' ? PACKAGES[app.service_package].name_ru : PACKAGES[app.service_package].name_en}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4">
                          <span className="text-muted shrink-0">{lang === 'ru' ? 'Дата заявки' : 'Date'}</span>
                          <span className="text-ink">{formatDate(app.created_at)}</span>
                        </div>
                        {app.university_name && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4">
                            <span className="text-muted shrink-0">{lang === 'ru' ? 'Университет' : 'University'}</span>
                            <span className="text-ink">{app.university_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── DOCUMENTS TAB ── */}
                {tab === 'documents' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h1 className="text-2xl font-bold text-ink">{t.dashboard.documents}</h1>
                      <span className="badge badge-green">{docs.length} {lang === 'ru' ? 'файлов' : 'files'}</span>
                    </div>
                    {docs.length === 0 ? (
                      <div className="text-center py-10 text-muted">{t.common.noData}</div>
                    ) : (
                      <div className="grid gap-3">
                        {docs.map(doc => (
                          <div key={doc.id} className="card p-4 flex items-center gap-4">
                            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center">
                              <FileText className="w-5 h-5 text-brand-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink">{lang === 'ru' ? DOCUMENT_LABELS[doc.type].ru : DOCUMENT_LABELS[doc.type].en}</p>
                              <p className="text-xs text-muted truncate">{doc.file_name}</p>
                            </div>
                            {doc.is_verified && <Badge label="✓" color="green" className="text-[11px]" />}
                            <button onClick={() => handleDownloadDoc(doc)} className="btn-ghost btn-sm p-2 rounded-lg">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── PAYMENT TAB ── */}
                {tab === 'payment' && (
                  <div>
                    <h1 className="text-2xl font-bold text-ink mb-6">{t.dashboard.payment}</h1>
                    {payment ? (
                      <div className="card p-6">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-brand-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-ink">{formatCurrency(payment.amount, payment.currency)}</p>
                            <p className="text-xs text-muted">{formatDate(payment.created_at)}</p>
                          </div>
                          <Badge color="green" label={lang === 'ru' ? 'Оплачено' : 'Paid'} className="ml-auto" />
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 text-sm border-t border-border pt-4">
                          <span className="text-muted">{lang === 'ru' ? 'Метод' : 'Method'}</span>
                          <span className="text-ink">{payment.method.replace('_', ' ')}</span>
                          <span className="text-muted">{lang === 'ru' ? 'Пакет' : 'Package'}</span>
                          <span className="text-ink">{lang === 'ru' ? PACKAGES[payment.package].name_ru : PACKAGES[payment.package].name_en}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="card p-6 text-center">
                        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                        <p className="text-muted text-sm">
                          {lang === 'ru' ? 'Оплата ещё не поступила' : 'Payment not received yet'}
                        </p>
                        <Link href="/apply" className="mt-4 inline-block">
                          <Button size="sm">{lang === 'ru' ? 'Оплатить' : 'Pay Now'}</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* ── MESSAGES TAB ── */}
                {tab === 'messages' && (
                  <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-220px)]">
                    <h1 className="text-2xl font-bold text-ink mb-4">{t.dashboard.messages}</h1>
                    <div className="card flex-1 flex flex-col overflow-hidden">
                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                        {messages.length === 0 ? (
                          <div className="text-center text-muted text-sm py-8">{t.common.noData}</div>
                        ) : (
                          messages.map(msg => (
                            <div key={msg.id} className={cn('flex', msg.sender === 'USER' ? 'justify-end' : 'justify-start')}>
                              <div className={cn(
                                'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                                msg.sender === 'USER'
                                  ? 'bg-brand-400 text-white rounded-br-sm'
                                  : 'bg-surface border border-border text-ink rounded-bl-sm'
                              )}>
                                {msg.sender === 'ADMIN' && (
                                  <p className="text-xs font-semibold text-brand-500 mb-0.5">TARJUMAN</p>
                                )}
                                <p>{msg.content}</p>
                                <p className={cn('text-[10px] mt-1', msg.sender === 'USER' ? 'text-white/70' : 'text-muted')}>
                                  {formatDate(msg.created_at)}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Input */}
                      <div className="border-t border-border p-3 flex gap-2">
                        <input
                          className="input flex-1"
                          placeholder={t.dashboard.sendMessage + '...'}
                          value={msgText}
                          onChange={e => setMsgText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} loading={sending} size="md" className="shrink-0">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TIMELINE TAB ── */}
                {tab === 'timeline' && (
                  <div>
                    <h1 className="text-2xl font-bold text-ink mb-6">{t.dashboard.timeline}</h1>
                    {history.length === 0 ? (
                      <div className="text-muted text-sm text-center py-10">{t.common.noData}</div>
                    ) : (
                      <div className="card p-6">
                        <div className="relative space-y-5">
                          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                          {history.map((h, i) => (
                            <div key={h.id} className="flex gap-4 relative">
                              <div className="w-7 h-7 rounded-full bg-brand-50 border-2 border-brand-400 flex items-center justify-center shrink-0 z-10">
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                              </div>
                              <div className="pb-1">
                                <p className="text-sm font-medium text-ink">{statusLabel(h.new_status)}</p>
                                {h.note && <p className="text-xs text-muted mt-0.5">{h.note}</p>}
                                <p className="text-xs text-muted mt-1">{formatDate(h.created_at)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* ── Mobile bottom navigation ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {TABS.map(item => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); if (item.key === 'messages') setUnread(0) }}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            >
              <div className={cn(
                'w-10 h-8 flex items-center justify-center rounded-xl transition-all',
                tab === item.key ? 'bg-brand-50' : ''
              )}>
                <item.icon className={cn(
                  'w-5 h-5 transition-colors',
                  tab === item.key ? 'text-brand-500' : 'text-muted'
                )} />
                {item.badge ? (
                  <span className="absolute top-1 right-2 w-4 h-4 bg-brand-400 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={cn(
                'text-[10px] font-medium transition-colors',
                tab === item.key ? 'text-brand-500' : 'text-muted'
              )}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
