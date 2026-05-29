'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, LogOut, Download, CheckCircle2, Plus,
  ChevronRight, Layers, Calendar, GraduationCap, Trash2
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import { PACKAGES, STATUS_LABELS, DOCUMENT_LABELS } from '@/types'
import type { AppLanguage, ApplicationRow, DocumentRow } from '@/types'
import { translations } from '@/i18n'
import { formatDate, formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_ORDER = ['REGISTERED', 'PAID', 'IN_PROGRESS', 'UNDER_REVIEW', 'SUBMITTED', 'COMPLETED']

const STATUS_COLORS: Record<string, string> = {
  REGISTERED:   'bg-amber-100 text-amber-700 border-amber-200',
  PAID:         'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS:  'bg-purple-100 text-purple-700 border-purple-200',
  UNDER_REVIEW: 'bg-orange-100 text-orange-700 border-orange-200',
  SUBMITTED:    'bg-cyan-100 text-cyan-700 border-cyan-200',
  COMPLETED:    'bg-emerald-100 text-emerald-700 border-emerald-200',
}

type Tab = 'applications' | 'documents'

function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-7 h-7 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [lang, setLang] = useLanguage()
  const t = translations[lang]

  const [user,          setUser]          = useState<any>(null)
  const [authLoading,   setAuthLoading]   = useState(true)
  const [apps,          setApps]          = useState<ApplicationRow[]>([])
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [docs,          setDocs]          = useState<DocumentRow[]>([])
  const [tab,           setTab]           = useState<Tab>('applications')
  const [appLoading,    setAppLoading]    = useState(false)

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
      lang === 'ru'
        ? 'Удалить заявку? Это действие нельзя отменить.'
        : lang === 'uz'
          ? "Arizani o'chirish? Bu amalni bekor qilib bo'lmaydi."
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
    toast.success(lang === 'ru' ? 'Заявка удалена' : lang === 'uz' ? "Ariza o'chirildi" : 'Application deleted')
  }

  const handleDownloadDoc = async (doc: DocumentRow) => {
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.file_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
    else toast.error('Could not download file')
  }

  const statusLabel = (s: string) => STATUS_LABELS[s as keyof typeof STATUS_LABELS]?.[lang] ?? s

  if (authLoading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted text-sm">Загрузка...</p>
      </div>
    </div>
  )
  if (!user) return null

  const TABS: { key: Tab; icon: typeof FileText; label: string }[] = [
    { key: 'applications', icon: Layers,   label: lang === 'ru' ? 'Заявки' : lang === 'uz' ? 'Arizalar' : 'Applications' },
    { key: 'documents',    icon: FileText, label: lang === 'ru' ? 'Документы' : lang === 'uz' ? 'Hujjatlar' : 'Documents' },
  ]

  const userName = user?.user_metadata?.full_name?.split(' ')[0] ?? (lang === 'ru' ? 'Пользователь' : 'User')

  return (
    <div className="min-h-screen bg-[#F7F8FA] overflow-x-hidden">
      <div className="flex">

        {/* SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border min-h-screen fixed left-0 top-0 shadow-sm">

          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link href="/">
              <svg viewBox="0 0 156 36" width="140" height="32" aria-label="TARJUMAN">
                <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
                <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
                <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
              </svg>
            </Link>
          </div>

          <div className="mx-3 my-3 p-3 bg-gradient-to-br from-brand-50 to-emerald-50 rounded-2xl border border-brand-100">
            <div className="flex items-center gap-3">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full object-cover ring-2 ring-white" alt="" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white">
                  {user?.user_metadata?.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{user?.user_metadata?.full_name ?? 'User'}</p>
                <p className="text-[11px] text-muted truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-2 space-y-0.5">
            {TABS.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  tab === item.key
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-muted hover:text-ink hover:bg-gray-100'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.key === 'applications' && apps.length > 0 && (
                  <span className={cn(
                    'ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
                    tab === item.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-muted'
                  )}>
                    {apps.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-border space-y-3">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {(['ru', 'uz', 'en'] as AppLanguage[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={cn('flex-1 py-1 text-xs font-semibold rounded-lg transition-all',
                    lang === l ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink')}
                >{l.toUpperCase()}</button>
              ))}
            </div>
            <button
              onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t.nav.logout}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 md:ml-64 min-h-screen">

          {/* Mobile header */}
          <div className="md:hidden bg-white border-b border-border h-14 flex items-center justify-between px-4 sticky top-0 z-30">
            <Link href="/">
              <svg viewBox="0 0 156 36" width="130" height="30" aria-label="TARJUMAN">
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
                      lang === l ? 'bg-white text-brand-600 shadow-sm' : 'text-muted')}
                  >{l.toUpperCase()}</button>
                ))}
              </div>
              <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>
                <LogOut className="w-4 h-4 text-muted" />
              </button>
            </div>
          </div>

          {/* Mobile bottom nav */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-30 flex">
            {TABS.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={cn(
                  'flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors',
                  tab === item.key ? 'text-brand-600' : 'text-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 md:p-8 pb-24 md:pb-8">

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-ink">
                {lang === 'ru' ? `Привет, ${userName} ` : lang === 'uz' ? `Salom, ${userName} ` : `Hello, ${userName} `}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                {lang === 'ru'
                  ? apps.length === 0 ? 'У вас нет заявок' : apps.length === 1 ? '1 заявка' : `${apps.length} заявки`
                  : lang === 'uz'
                  ? apps.length === 0 ? 'Sizda ariza yoq' : `${apps.length} ta ariza`
                  : `${apps.length} application${apps.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>

            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

              {/* TAB: ЗАЯВКИ */}
              {tab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-ink">
                      {lang === 'ru' ? 'Мои заявки' : lang === 'uz' ? 'Mening arizalarim' : 'My Applications'}
                    </h2>
                    <Link href="/apply">
                      <button className="flex items-center gap-2 px-3 py-2 md:px-4 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-ink/90 transition-colors">
                        <Plus className="w-4 h-4 shrink-0" />
                        <span className="hidden sm:inline">{lang === 'ru' ? 'Новая заявка' : lang === 'uz' ? 'Yangi ariza' : 'New Application'}</span>
                        <span className="sm:hidden">{lang === 'ru' ? 'Новая' : lang === 'uz' ? 'Yangi' : 'New'}</span>
                      </button>
                    </Link>
                  </div>

                  {apps.length === 0 && (
                    <div className="bg-white rounded-2xl border border-border p-12 text-center">
                      <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-brand-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-ink mb-2">{t.dashboard.noApp}</h3>
                      <p className="text-sm text-muted mb-6 max-w-xs mx-auto">
                        {lang === 'ru'
                          ? 'Подайте первую заявку и начните путь к арабскому образованию'
                          : lang === 'uz'
                          ? "Birinchi arizangizni yuboring va arab ta'limiga yo'l boshlang"
                          : 'Submit your first application and start your journey'}
                      </p>
                      <Link href="/apply">
                        <Button size="lg" iconRight={<ChevronRight className="w-4 h-4" />}>
                          {t.dashboard.startApp}
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="space-y-3">
                    {apps.map((application, idx) => {
                      const isSelected = application.id === selectedAppId
                      const sIdx       = STATUS_ORDER.indexOf(application.status)
                      const progress   = Math.round(((sIdx + 1) / STATUS_ORDER.length) * 100)

                      return (
                        <motion.div
                          key={application.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div
                            className={cn(
                              'bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer',
                              isSelected ? 'border-ink shadow-md' : 'border-transparent shadow-sm hover:border-gray-200 hover:shadow-md'
                            )}
                            onClick={() => switchApp(application.id)}
                          >
                            <div className="p-5">
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={cn(
                                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold',
                                    isSelected ? 'bg-ink text-white' : 'bg-gray-100 text-gray-500'
                                  )}>
                                    {application.country === 'SA' ? 'SA' : 'AE'}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-ink text-sm truncate">
                                      {application.country === 'SA'
                                        ? (lang === 'ru' ? 'Саудовская Аравия' : lang === 'uz' ? 'Saudiya Arabistoni' : 'Saudi Arabia')
                                        : (lang === 'ru' ? 'ОАЭ' : lang === 'uz' ? 'BAA' : 'UAE')}
                                    </p>
                                    <p className="text-xs text-muted truncate">
                                      {lang === 'ru'
                                        ? PACKAGES[application.service_package]?.name_ru
                                        : PACKAGES[application.service_package]?.name_en}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={cn(
                                    'text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap',
                                    STATUS_COLORS[application.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                                  )}>
                                    {statusLabel(application.status)}
                                  </span>
                                  {application.status === 'REGISTERED' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); deleteApp(application.id) }}
                                      className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                      title={lang === 'ru' ? 'Удалить заявку' : 'Delete'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs text-muted">{lang === 'ru' ? 'Прогресс' : lang === 'uz' ? 'Jarayon' : 'Progress'}</span>
                                  <span className="text-xs font-semibold text-ink">{progress}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-brand-400 to-emerald-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(application.created_at)}
                                </span>
                                {application.university_name && (
                                  <span className="flex items-center gap-1 truncate">
                                    <GraduationCap className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{application.university_name}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden border-t border-gray-100"
                                >
                                  <div className="px-5 py-4">
                                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                                      {lang === 'ru' ? 'Этапы' : lang === 'uz' ? 'Bosqichlar' : 'Stages'}
                                    </p>
                                    <div className="flex flex-col gap-2.5">
                                      {STATUS_ORDER.map((s, i) => {
                                        const curIdx  = STATUS_ORDER.indexOf(application.status)
                                        const done    = i < curIdx
                                        const current = i === curIdx
                                        return (
                                          <div key={s} className="flex items-center gap-3">
                                            <div className={cn(
                                              'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold',
                                              done    ? 'bg-emerald-500 text-white' :
                                              current ? 'bg-ink text-white ring-4 ring-ink/10' :
                                                        'bg-gray-100 text-gray-400'
                                            )}>
                                              {done ? '✓' : i + 1}
                                            </div>
                                            <span className={cn(
                                              'text-xs',
                                              done    ? 'text-emerald-600 font-medium' :
                                              current ? 'text-ink font-semibold' :
                                                        'text-muted'
                                            )}>
                                              {statusLabel(s)}
                                            </span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB: ДОКУМЕНТЫ */}
              {tab === 'documents' && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-ink">
                    {lang === 'ru' ? 'Документы' : lang === 'uz' ? 'Hujjatlar' : 'Documents'}
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
                              ? 'bg-ink text-white'
                              : 'bg-white border border-border text-muted hover:text-ink'
                          )}
                        >
                          <span className="text-xs font-bold">{a.country}</span>
                          <span>{lang === 'ru' ? `Заявка ${i + 1}` : lang === 'uz' ? `Ariza ${i + 1}` : `App ${i + 1}`}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {!selectedApp ? (
                    <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted text-sm">
                      {lang === 'ru' ? 'Выберите заявку' : lang === 'uz' ? 'Ariza tanlang' : 'Select an application'}
                    </div>
                  ) : appLoading ? (
                    <Spinner />
                  ) : docs.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-border p-10 text-center">
                      <FileText className="w-10 h-10 text-muted mx-auto mb-3" />
                      <p className="text-sm text-muted">{t.dashboard.noDocs}</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {docs.map(doc => (
                        <div key={doc.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-brand-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{DOCUMENT_LABELS[doc.type]?.[lang] ?? doc.type}</p>
                            <p className="text-xs text-muted">{formatDate(doc.created_at)}</p>
                          </div>
                          <button
                            onClick={() => handleDownloadDoc(doc)}
                            className="p-2 rounded-xl hover:bg-surface transition-colors"
                          >
                            <Download className="w-4 h-4 text-muted" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
