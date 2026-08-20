'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { SAUDI_PACKAGES, SAUDI_PACKAGE_IDS, SaudiPackageId } from '@/lib/saudiPackages'
import {
  Mail, Phone, MapPin, HeartPulse, Wallet, MessageSquare,
  GraduationCap, Plus, X, ArrowUp, ArrowDown, CheckCircle2, Send, Loader2,
} from 'lucide-react'

// ── Constants ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+[1-9]\d{7,14}$/
const MAX_PROGRAMS = 25
const CURRENCIES = ['USD', 'EUR', 'RUB', 'UZS', 'SAR', 'GBP']

const INPUT = 'w-full h-12 px-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white'
const TEXTAREA = 'w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white resize-y'

interface SelectedProgram {
  id:              string
  university_name: string
  faculty:         string
}

// ── Small building blocks ──────────────────────────────────────────────────

function Field({ label, required, hint, icon: Icon, children }: {
  label: string; required?: boolean; hint?: string; icon?: any; children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-semibold text-ink mb-1.5">
        {Icon && <Icon className="w-4 h-4 text-[#1B4332]" />}
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted mt-1.5">{hint}</p>}
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6', className)}>{children}</div>
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ApplySaudiPage() {
  const [lang] = useLanguage()
  const ru = lang === 'ru'; const uz = lang === 'uz'
  const t = (r: string, u: string, e: string) => (ru ? r : uz ? u : e)

  // Contact / screening
  const [email, setEmail]                 = useState('')
  const [phone, setPhone]                 = useState('')
  const [address, setAddress]             = useState('')
  const [hasDisability, setHasDisability] = useState<'' | 'yes' | 'no'>('')
  const [income, setIncome]               = useState('')
  const [currency, setCurrency]           = useState('USD')
  const [motivation, setMotivation]       = useState('')

  // Programs (placeholder architecture — manual add, ready for future catalogue swap-in)
  const [programs, setPrograms]   = useState<SelectedProgram[]>([])
  const [newUni, setNewUni]       = useState('')
  const [newFaculty, setNewFaculty] = useState('')

  // Package
  const [pkg, setPkg] = useState<SaudiPackageId | ''>('')

  // Submit
  const [loading, setLoading]     = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const addProgram = () => {
    const uni = newUni.trim()
    const fac = newFaculty.trim()
    if (!uni || !fac) {
      toast.error(t('Укажите университет и факультет', 'Universitet va fakultetni kiriting', 'Enter university and faculty'))
      return
    }
    if (programs.length >= MAX_PROGRAMS) {
      toast.error(t(`Максимум ${MAX_PROGRAMS} вариантов`, `Maksimal ${MAX_PROGRAMS} ta`, `Maximum ${MAX_PROGRAMS} options`))
      return
    }
    const dup = programs.some(p => p.university_name.toLowerCase() === uni.toLowerCase() && p.faculty.toLowerCase() === fac.toLowerCase())
    if (dup) {
      toast.error(t('Этот вариант уже выбран', 'Bu variant allaqachon tanlangan', 'This option is already selected'))
      return
    }
    setPrograms(p => [...p, { id: crypto.randomUUID(), university_name: uni, faculty: fac }])
    setNewUni('')
    setNewFaculty('')
  }

  const removeProgram = (id: string) => setPrograms(p => p.filter(x => x.id !== id))

  const moveProgram = (index: number, dir: -1 | 1) => {
    setPrograms(p => {
      const next = [...p]
      const target = index + dir
      if (target < 0 || target >= next.length) return p
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const validate = (): string | null => {
    if (!EMAIL_RE.test(email.trim())) return t('Укажите корректный email', 'To\'g\'ri email kiriting', 'Enter a valid email')
    if (!PHONE_RE.test(phone.trim())) return t('Укажите телефон в международном формате (+998...)', 'Telefonni xalqaro formatda kiriting (+998...)', 'Enter phone in international format (+1...)')
    if (address.trim().length < 5) return t('Укажите полный адрес', 'To\'liq manzilni kiriting', 'Enter your full address')
    if (!hasDisability) return t('Ответьте на вопрос об инвалидности', 'Nogironlik haqidagi savolga javob bering', 'Answer the disability question')
    if (motivation.trim().length < 10) return t('Расскажите, почему хотите учиться в Саудовской Аравии', 'Nima uchun Saudiya Arabistonida o\'qimoqchisiz — yozing', 'Tell us why you want to study in Saudi Arabia')
    if (programs.length < 1) return t('Добавьте хотя бы один университет/факультет', 'Kamida bitta universitet/fakultet qo\'shing', 'Add at least one university/faculty')
    if (!pkg) return t('Выберите пакет услуг', 'Xizmat paketini tanlang', 'Choose a service package')
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { toast.error(err); return }
    setLoading(true)
    try {
      const res = await fetch('/api/apply-saudi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          has_disability: hasDisability === 'yes',
          annual_income: income ? Number(income) : null,
          income_currency: income ? currency : null,
          motivation: motivation.trim(),
          selected_programs: programs.map(p => ({ university_name: p.university_name, faculty: p.faculty })),
          service_package: pkg,
          lang,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'error')
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e: any) {
      toast.error(t('Не удалось отправить заявку. Попробуйте ещё раз.', 'Arizani yuborib bo\'lmadi. Qayta urinib ko\'ring.', 'Could not submit application. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-gray-100 shadow-lg p-8 sm:p-10">
          <div className="w-16 h-16 rounded-full bg-[#1B4332]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-[#1B4332]" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2">
            {t('Заявка отправлена!', 'Ariza yuborildi!', 'Application submitted!')}
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-6">
            {t(
              'Мы получили вашу анкету на поступление в университеты Саудовской Аравии. Наш менеджер свяжется с вами в ближайшее время.',
              'Saudiya Arabistoni universitetlariga kirish uchun arizangizni qabul qildik. Menejerimiz tez orada siz bilan bog\'lanadi.',
              'We\'ve received your Saudi Arabia university application. Our manager will contact you shortly.'
            )}
          </p>
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all">
            {t('На главную', 'Bosh sahifaga', 'Back to home')}
          </Link>
        </div>
      </div>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center">
          <Link href="/">
            <svg viewBox="0 0 156 36" width="120" height="28" aria-label="TARJUMAN">
              <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
              <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
              <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
            </svg>
          </Link>
        </div>
        <div className="h-0.5 bg-gray-100" />
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <img src="https://flagcdn.com/w40/sa.png" alt="Saudi Arabia" className="w-8 h-5 rounded object-cover" />
            <p className="text-xs font-semibold text-[#C9922A] uppercase tracking-widest">
              {t('Саудовская Аравия', 'Saudiya Arabistoni', 'Saudi Arabia')}
            </p>
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">
            {t('Подача в университеты Саудовской Аравии', 'Saudiya Arabistoni universitetlariga topshirish', 'Apply to Saudi Arabia universities')}
          </h1>
          <p className="text-muted text-sm">
            {t('Заполните анкету в один шаг', 'Anketani bir bosqichda to\'ldiring', 'Fill out the form in one step')}
          </p>
        </div>

        {/* ── Section 1: Contact info ── */}
        <Card className="mb-4 space-y-5">
          <Field label={t('Email', 'Email', 'Email')} required icon={Mail} hint={t('Предпочтительно указывать Gmail', 'Iloji bo\'lsa Gmail kiriting', 'Gmail preferred')}>
            <input type="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="name@gmail.com" className={INPUT} />
          </Field>

          <Field label={t('Номер телефона', 'Telefon raqami', 'Phone number')} required icon={Phone} hint={t('Международный формат, начинается с +', 'Xalqaro format, + bilan boshlanadi', 'International format, starts with +')}>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+998901234567" className={INPUT} />
          </Field>

          <Field label={t('Полный адрес', 'To\'liq manzil', 'Full address')} required icon={MapPin}>
            <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)}
              placeholder={t('Страна, город, улица, дом, квартира...', 'Davlat, shahar, ko\'cha, uy, xonadon...', 'Country, city, street, building, apartment...')}
              className={TEXTAREA} />
          </Field>

          <Field label={t('Есть ли у вас инвалидность?', 'Sizda nogironlik bormi?', 'Do you have a disability?')} required icon={HeartPulse}>
            <div className="flex gap-2">
              {(['yes', 'no'] as const).map(v => (
                <button key={v} type="button" onClick={() => setHasDisability(v)}
                  className={cn(
                    'flex-1 h-12 rounded-xl border-2 text-sm font-semibold transition-all',
                    hasDisability === v ? 'border-[#1B4332] bg-[#1B4332]/5 text-[#1B4332]' : 'border-gray-200 text-ink hover:border-gray-300'
                  )}>
                  {v === 'yes' ? t('Да', 'Ha', 'Yes') : t('Нет', 'Yo\'q', 'No')}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t('Сколько вы зарабатываете в год?', 'Yiliga qancha topasiz?', 'What is your annual income?')} icon={Wallet} hint={t('Необязательно', 'Ixtiyoriy', 'Optional')}>
            <div className="flex gap-2">
              <input type="number" min={0} value={income} onChange={e => setIncome(e.target.value)}
                placeholder="0" className={cn(INPUT, 'flex-1')} />
              <select value={currency} onChange={e => setCurrency(e.target.value)} className={cn(INPUT, 'w-28 appearance-none')}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </Field>

          <Field label={t('Почему вы хотите учиться в Саудовской Аравии?', 'Nima uchun Saudiya Arabistonida o\'qimoqchisiz?', 'Why do you want to study in Saudi Arabia?')} required icon={MessageSquare}
            hint={t('Можно писать на арабском или английском языке', 'Arab yoki ingliz tilida yozishingiz mumkin', 'You may answer in Arabic or English')}>
            <textarea rows={8} dir="auto" value={motivation} onChange={e => setMotivation(e.target.value)}
              placeholder="..." className={TEXTAREA} />
          </Field>
        </Card>

        {/* ── Section 2: Universities/faculties ── */}
        <Card className="mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-bold text-ink text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1B4332]" />
                {t('Университеты и факультеты', 'Universitet va fakultetlar', 'Universities & faculties')}
              </h2>
              <p className="text-xs text-muted mt-1">
                {t('Добавьте до 25 вариантов, в порядке приоритета', 'Ustuvorlik tartibida 25 tagacha variant qo\'shing', 'Add up to 25 options, in order of priority')}
              </p>
            </div>
            <span className={cn(
              'text-sm font-bold px-3 py-1.5 rounded-xl shrink-0',
              programs.length >= MAX_PROGRAMS ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#1B4332]/10 text-[#1B4332]'
            )}>
              {t('Выбрано', 'Tanlandi', 'Selected')}: {programs.length}/{MAX_PROGRAMS}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input type="text" value={newUni} onChange={e => setNewUni(e.target.value)} onKeyDown={e => e.key === 'Enter' && addProgram()}
              placeholder={t('Университет', 'Universitet', 'University')}
              className="flex-1 h-11 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B4332] bg-white" />
            <input type="text" value={newFaculty} onChange={e => setNewFaculty(e.target.value)} onKeyDown={e => e.key === 'Enter' && addProgram()}
              placeholder={t('Факультет / направление', 'Fakultet / yo\'nalish', 'Faculty / program')}
              className="flex-1 h-11 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B4332] bg-white" />
            <button type="button" onClick={addProgram}
              className="flex items-center justify-center gap-1.5 px-4 h-11 bg-[#1B4332] text-white text-sm font-medium rounded-lg hover:bg-[#1B4332]/90 transition-colors shrink-0">
              <Plus className="w-4 h-4" /> {t('Добавить', 'Qo\'shish', 'Add')}
            </button>
          </div>

          {programs.length === 0 ? (
            <p className="text-sm text-muted text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
              {t('Пока ничего не выбрано', 'Hozircha hech narsa tanlanmagan', 'Nothing selected yet')}
            </p>
          ) : (
            <div className="space-y-2">
              {programs.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{p.university_name}</p>
                    <p className="text-xs text-muted truncate">{p.faculty}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => moveProgram(i, -1)} disabled={i === 0}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => moveProgram(i, 1)} disabled={i === programs.length - 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => removeProgram(p.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Section 3: Package ── */}
        <Card className="mb-4">
          <h2 className="font-bold text-ink text-lg mb-4">{t('Выберите пакет TARJUMAN', 'TARJUMAN paketini tanlang', 'Choose a TARJUMAN package')}</h2>
          <div className="space-y-3">
            {SAUDI_PACKAGE_IDS.map(id => {
              const p = SAUDI_PACKAGES[id]
              const isSelected = pkg === id
              const desc = t(p.desc_ru, p.desc_uz, p.desc_en)
              return (
                <button key={id} type="button" onClick={() => setPkg(id)}
                  className={cn(
                    'w-full text-left rounded-2xl border-2 p-5 transition-all shadow-sm',
                    isSelected ? 'border-[#1B4332] bg-[#1B4332]/5 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                  )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                        isSelected ? 'border-[#1B4332] bg-[#1B4332]' : 'border-gray-300'
                      )}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <p className="font-bold text-ink text-base">
                        {id === 'STANDARD' && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mr-2 align-middle">
                            {t('популярный', 'mashhur', 'popular')}
                          </span>
                        )}
                        {p.name_ru}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-ink">${p.priceUSD}</p>
                      <p className="text-xs text-muted">{t('разово', 'bir martalik', 'one-time')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </button>
              )
            })}
          </div>
        </Card>

        {/* ── Submit ── */}
        <button type="button" onClick={handleSubmit} disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-2xl transition-all duration-200 bg-[#1B4332] text-white hover:bg-[#1B4332]/90 shadow-lg shadow-[#1B4332]/20 disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {t('Отправить заявку', 'Arizani yuborish', 'Submit application')}
        </button>
      </div>
    </div>
  )
}
