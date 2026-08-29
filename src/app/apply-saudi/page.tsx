'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { SAUDI_PACKAGES, SAUDI_PACKAGE_IDS, SAUDI_FEATURES, SaudiPackageId } from '@/lib/saudiPackages'
import {
  Mail, Phone, MapPin, HeartPulse, Wallet, MessageSquare,
  GraduationCap, CheckCircle2, Send, Loader2,
  Check, Minus, Crown, ShieldCheck, ExternalLink, User,
} from 'lucide-react'

// ── Palette (this page only) ───────────────────────────────────────────────
// GREEN drives structure & primary actions (brand identity, matches the logo).
// GOLD is decorative-only (icons, borders, gradients, badge fills) — text that
// needs to sit on white uses GOLD_TEXT, a darkened variant that clears 4.5:1.
const GREEN      = '#1B4332'
const GREEN_SOFT = '#2F6B53'
const GOLD       = '#C9922A'
const GOLD_TEXT  = '#8A6116'

// ── Constants ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+[1-9]\d{7,14}$/
const CURRENCIES = ['USD', 'EUR', 'RUB', 'UZS', 'SAR', 'GBP']
const STUDY_IN_SAUDI_URL = 'https://studyinsaudi.sa/en/programs'
const SERIF = "'Playfair Display', Georgia, serif"

const INPUT = 'w-full h-12 px-4 text-base border border-[#E7E1D3] rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-4 focus:ring-[#1B4332]/10 transition-all bg-white placeholder:text-muted/70'
const TEXTAREA = 'w-full px-4 py-3.5 text-base border border-[#E7E1D3] rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-4 focus:ring-[#1B4332]/10 transition-all bg-white resize-y placeholder:text-muted/70'

// Phone is stored raw (digits + leading "+", no spaces) so PHONE_RE / the API
// never have to deal with formatting — spaces are only ever added for display.
const sanitizePhone = (v: string) => {
  const hasPlus = v.trim().startsWith('+')
  const digits = v.replace(/[^\d]/g, '')
  return (hasPlus ? '+' : '') + digits
}
const formatPhoneDisplay = (v: string) => {
  const hasPlus = v.startsWith('+')
  const digits = v.replace('+', '')
  const groups = digits.match(/.{1,3}/g) || []
  return (hasPlus ? '+' : '') + groups.join(' ')
}

// ── Small building blocks ──────────────────────────────────────────────────

function Field({ label, required, hint, icon: Icon, trailing, children }: {
  label: string; required?: boolean; hint?: string; icon?: any; trailing?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          {Icon && (
            <span className="w-7 h-7 rounded-full bg-[#1B4332]/8 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#1B4332]" />
            </span>
          )}
          {label} {required && <span className="text-[#B45309]">*</span>}
        </label>
        {trailing}
      </div>
      {children}
      {hint && <p className="text-xs text-muted mt-2 ml-9 leading-relaxed">{hint}</p>}
    </div>
  )
}

function Card({ children, className, contentClassName, accent = 'green' }: {
  children: React.ReactNode; className?: string; contentClassName?: string; accent?: 'green' | 'gold'
}) {
  return (
    <div className={cn('bg-white rounded-3xl border border-[#ECE6D6] shadow-card overflow-hidden', className)}>
      <div className={cn('h-1 w-full', accent === 'gold' ? 'bg-gradient-to-r from-[#C9922A] to-[#E2B562]' : 'bg-gradient-to-r from-[#1B4332] to-[#2F6B53]')} />
      <div className={cn('p-5 sm:p-7', contentClassName)}>{children}</div>
    </div>
  )
}

function Eyebrow({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: GOLD_TEXT }}>
      {step} — {children}
    </p>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function ApplySaudiPage() {
  const [lang, setLang] = useLanguage()
  const ru = lang === 'ru'; const uz = lang === 'uz'
  const t = (r: string, u: string, e: string) => (ru ? r : uz ? u : e)

  // Contact / screening
  const [fullName, setFullName]           = useState('')
  const [email, setEmail]                 = useState('')
  const [phone, setPhone]                 = useState('')
  const [address, setAddress]             = useState('')
  const [hasDisability, setHasDisability] = useState<'' | 'yes' | 'no'>('')
  const [income, setIncome]               = useState('')
  const [currency, setCurrency]           = useState('USD')
  const [motivation, setMotivation]       = useState('')

  // Universities/faculties — free text, client writes their own preferences
  const [desiredPrograms, setDesiredPrograms] = useState('')

  // Package
  const [pkg, setPkg] = useState<SaudiPackageId | ''>('')

  // Submit
  const [loading, setLoading]     = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showOffer, setShowOffer] = useState(false)

  const validate = (): string | null => {
    if (fullName.trim().length < 3) return t('Укажите имя и фамилию как в загранпаспорте', 'Ism va familiyangizni pasportdagidek kiriting', 'Enter your full name as it appears in your passport')
    if (!EMAIL_RE.test(email.trim())) return t('Укажите корректный email', 'To\'g\'ri email kiriting', 'Enter a valid email')
    if (!PHONE_RE.test(phone.trim())) return t('Укажите телефон в международном формате (+998...)', 'Telefonni xalqaro formatda kiriting (+998...)', 'Enter phone in international format (+1...)')
    if (address.trim().length < 5) return t('Укажите полный адрес', 'To\'liq manzilni kiriting', 'Enter your full address')
    if (!hasDisability) return t('Ответьте на вопрос об инвалидности', 'Nogironlik haqidagi savolga javob bering', 'Answer the disability question')
    if (motivation.trim().length < 10) return t('Расскажите, почему хотите учиться в Саудовской Аравии', 'Nima uchun Saudiya Arabistonida o\'qimoqchisiz — yozing', 'Tell us why you want to study in Saudi Arabia')
    if (desiredPrograms.trim().length < 5) return t('Укажите университеты/факультеты или напишите, что выбор за нами', 'Universitet/fakultetlarni yozing yoki tanlovni bizga qoldiring deb yozing', 'Enter universities/faculties, or write that you\'d like us to choose')
    if (!pkg) return t('Выберите пакет услуг', 'Xizmat paketini tanlang', 'Choose a service package')
    return null
  }

  // Validates the form and opens the public-offer confirmation modal.
  // Actual submission only happens once the client clicks "I accept" in the modal.
  const handleSubmitClick = () => {
    const err = validate()
    if (err) { toast.error(err); return }
    setShowOffer(true)
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { toast.error(err); setShowOffer(false); return }
    setLoading(true)
    try {
      const res = await fetch('/api/apply-saudi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          has_disability: hasDisability === 'yes',
          annual_income: income ? Number(income) : null,
          income_currency: income ? currency : null,
          motivation: motivation.trim(),
          desired_programs: desiredPrograms.trim(),
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
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl border border-[#ECE6D6] shadow-modal p-8 sm:p-10">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(27,67,50,0.08)' }}>
            <CheckCircle2 className="w-8 h-8" style={{ color: GREEN }} />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2" style={{ fontFamily: SERIF }}>
            {t('Заявка отправлена!', 'Ariza yuborildi!', 'Application submitted!')}
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-6">
            {t(
              'Мы получили вашу анкету на поступление в университеты Саудовской Аравии. Наш менеджер свяжется с вами в ближайшее время.',
              'Saudiya Arabistoni universitetlariga kirish uchun arizangizni qabul qildik. Menejerimiz tez orada siz bilan bog\'lanadi.',
              'We\'ve received your Saudi Arabia university application. Our manager will contact you shortly.'
            )}
          </p>
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all" style={{ background: GREEN }}>
            {t('На главную', 'Bosh sahifaga', 'Back to home')}
          </Link>
        </div>
      </div>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <header className="bg-white sticky top-0 z-20 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <svg viewBox="0 0 156 36" width="120" height="28" aria-label="TARJUMAN">
              <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
              <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
              <text x="40" y="24" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 rounded-full border border-[#E7E1D3] p-0.5">
              {(['ru', 'uz'] as const).map(code => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-bold uppercase transition-all',
                    lang === code ? 'text-white' : 'text-muted hover:text-ink'
                  )}
                  style={lang === code ? { background: GREEN } : undefined}
                >
                  {code}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: GREEN }} />
              {t('Конфиденциально', 'Maxfiy', 'Confidential')}
            </div>
          </div>
        </div>
        <div className="h-[3px] w-full bg-gradient-to-r from-[#1B4332] via-[#2F6B53] to-[#C9922A]" />
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-20">
        <div className="mb-9 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#ECE0C4] bg-white">
            <img src="https://flagcdn.com/w40/sa.png" alt="Saudi Arabia" className="w-5 h-3.5 rounded-sm object-cover" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD_TEXT }}>
              {t('Саудовская Аравия', 'Saudiya Arabistoni', 'Saudi Arabia')}
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight" style={{ fontFamily: SERIF, color: GREEN }}>
            {t('Подача в университеты Саудовской Аравии', 'Saudiya Arabistoni universitetlariga topshirish', 'Apply to Saudi Arabia universities')}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 text-xs text-muted">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" style={{ color: GREEN }} />{t('Защищённая передача данных', 'Xavfsiz uzatish', 'Secure data transfer')}</span>
          </div>
        </div>

        {/* ── Section 1: Contact info ── */}
        <Card className="mb-5" contentClassName="space-y-7" accent="green">
          <Eyebrow step="01">{t('Контактные данные', 'Kontakt ma\'lumotlari', 'Contact details')}</Eyebrow>

          <Field label={t('Имя и фамилия (как в загранпаспорте)', 'Ism va familiya (pasportdagidek)', 'Full name (as in your passport)')} required icon={User}>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder={t('Например: IVANOV IVAN', 'Masalan: IVANOV IVAN', 'E.g.: IVANOV IVAN')} className={INPUT} />
          </Field>

          <Field label={t('Email', 'Email', 'Email')} required icon={Mail}>
            <input type="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="name@gmail.com" className={INPUT} />
          </Field>

          <Field label={t('Номер телефона', 'Telefon raqami', 'Phone number')} required icon={Phone}>
            <input type="tel" inputMode="tel" value={formatPhoneDisplay(phone)} onChange={e => setPhone(sanitizePhone(e.target.value))}
              placeholder="+998 90 123 45 67" className={cn(INPUT, 'tabular-nums tracking-wide')} />
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
                    hasDisability === v ? 'text-white shadow-sm' : 'border-[#E7E1D3] text-ink hover:border-[#1B4332]/30'
                  )}
                  style={hasDisability === v ? { borderColor: GREEN, background: GREEN } : undefined}>
                  {v === 'yes' ? t('Да', 'Ha', 'Yes') : t('Нет', 'Yo\'q', 'No')}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t('Сколько вы зарабатываете в год?', 'Yiliga qancha topasiz?', 'What is your annual income?')} icon={Wallet}>
            <div className="flex gap-2">
              <input type="number" min={0} value={income} onChange={e => setIncome(e.target.value)}
                placeholder="0" className={cn(INPUT, 'flex-1 tabular-nums')} />
              <select value={currency} onChange={e => setCurrency(e.target.value)} className={cn(INPUT, 'w-28 appearance-none')}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </Field>

          <Field label={t('Почему вы хотите учиться в Саудовской Аравии?', 'Nima uchun Saudiya Arabistonida o\'qimoqchisiz?', 'Why do you want to study in Saudi Arabia?')} required icon={MessageSquare}
            trailing={<span className="text-[11px] text-muted tabular-nums">{motivation.trim().length}/10+</span>}>
            <textarea rows={8} dir="auto" value={motivation} onChange={e => setMotivation(e.target.value)}
              placeholder={t('Расскажите о своей мотивации...', 'Motivatsiyangiz haqida yozing...', 'Tell us about your motivation...')} className={TEXTAREA} />
          </Field>
        </Card>

        {/* ── Section 2: Universities/faculties ── */}
        <Card className="mb-5" contentClassName="space-y-6" accent="green">
          <Eyebrow step="02">{t('Университеты и факультеты', 'Universitet va fakultetlar', 'Universities & faculties')}</Eyebrow>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-[#ECE0C4]" style={{ background: 'rgba(201,146,42,0.06)' }}>
            <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(201,146,42,0.14)' }}>
              <GraduationCap className="w-4.5 h-4.5" style={{ color: GOLD_TEXT }} />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-ink leading-relaxed">
                {t('Чтобы узнать, какие факультеты и университеты доступны, перейдите по ссылке:', 'Qanday fakultet va universitetlar mavjudligini bilish uchun havolaga o\'ting:', 'To see which faculties and universities are available, follow the link:')}
              </p>
              <a href={STUDY_IN_SAUDI_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 text-sm font-semibold rounded-xl text-white hover:opacity-90 transition-all shadow-sm"
                style={{ background: GOLD }}>
                <ExternalLink className="w-3.5 h-3.5" />
                studyinsaudi.sa/en/programs
              </a>
            </div>
          </div>

          <Field label={t('Какие университеты и факультеты вас интересуют?', 'Qaysi universitet va fakultetlar sizni qiziqtiradi?', 'Which universities and faculties interest you?')} required icon={GraduationCap}
            hint={t(
              '(Или напишите «выбирайте сами, мы сами выберем университеты и факультеты на свой выбор» — просто укажите, какие направления вас интересуют)',
              '(Yoki «o\'zingiz tanlang, universitet va fakultetlarni o\'zimiz tanlaymiz» deb yozing — faqat qaysi yo\'nalishlar qiziqtirishini ko\'rsating)',
              '(Or write "choose for us — we\'ll pick universities and faculties at our discretion", just tell us which fields interest you)'
            )}>
            <p className="text-xs font-semibold mb-2" style={{ color: GOLD_TEXT }}>
              {t('У вас есть право выбрать до 25 факультетов в разных университетах', 'Turli universitetlarda 25 tagacha fakultetni tanlash huquqingiz bor', 'You have the right to choose up to 25 faculties across different universities')}
            </p>
            <textarea rows={6} dir="auto" value={desiredPrograms} onChange={e => setDesiredPrograms(e.target.value)}
              placeholder={t('Например: King Saud University — Медицина; Al Qasimia University — Исламские науки...', 'Masalan: King Saud University — Tibbiyot; Al Qasimia University — Islom ilmlari...', 'E.g.: King Saud University — Medicine; Al Qasimia University — Islamic Studies...')}
              className={TEXTAREA} />
          </Field>
        </Card>

        {/* ── Section 3: Package ── */}
        <Card className="mb-5" accent="gold">
          <Eyebrow step="03">{t('Пакет услуг', 'Xizmat paketi', 'Service package')}</Eyebrow>
          <h2 className="font-bold text-ink text-xl mb-1" style={{ fontFamily: SERIF }}>
            {t('Выберите пакет TARJUMAN', 'TARJUMAN paketini tanlang', 'Choose a TARJUMAN package')}
          </h2>
          <p className="text-xs text-muted mb-5">
            {t('Один пакет действует на все выбранные университеты и факультеты', 'Tanlangan barcha universitet va fakultetlar uchun bitta paket amal qiladi', 'One package covers every university and faculty you selected above')}
          </p>

          <div className="space-y-3">
            {SAUDI_PACKAGE_IDS.map(id => {
              const p = SAUDI_PACKAGES[id]
              const isSelected = pkg === id
              const tagline = t(p.tagline_ru, p.tagline_uz, p.tagline_en)
              const isVip = id === 'VIP'
              return (
                <button key={id} type="button" onClick={() => setPkg(id)}
                  className={cn(
                    'w-full text-left rounded-2xl border-2 p-5 transition-all',
                    isSelected ? 'shadow-md' : 'border-[#ECE6D6] bg-white hover:border-[#1B4332]/25 hover:shadow-sm'
                  )}
                  style={isSelected ? { borderColor: isVip ? GOLD : GREEN, background: isVip ? 'rgba(201,146,42,0.06)' : 'rgba(27,67,50,0.05)' } : undefined}>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn('w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5')}
                        style={{ borderColor: isSelected ? (isVip ? GOLD : GREEN) : '#D9D2BE', background: isSelected ? (isVip ? GOLD : GREEN) : 'transparent' }}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-ink text-base" style={{ fontFamily: SERIF }}>{p.name_ru}</p>
                          {id === 'STANDARD' && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {t('популярный', 'mashhur', 'popular')}
                            </span>
                          )}
                          {isVip && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color: GOLD_TEXT, background: 'rgba(201,146,42,0.12)', borderColor: 'rgba(201,146,42,0.35)' }}>
                              <Crown className="w-3 h-3" /> {t('максимум', 'maksimal', 'max')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted mt-0.5">{tagline}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-ink tabular-nums" style={{ fontFamily: SERIF }}>${p.priceUSD}</p>
                      <p className="text-[11px] text-muted">{t('разово', 'bir martalik', 'one-time')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-[#ECE6D6]">
                    {SAUDI_FEATURES.map(f => {
                      const included = p.features[f.key]
                      return (
                        <div key={f.key} className="flex items-center gap-2">
                          <span className={cn('w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                            included ? '' : 'bg-gray-100')} style={included ? { background: isVip ? 'rgba(201,146,42,0.18)' : 'rgba(27,67,50,0.1)' } : undefined}>
                            {included
                              ? <Check className="w-2.5 h-2.5" style={{ color: isVip ? GOLD_TEXT : GREEN }} strokeWidth={3} />
                              : <Minus className="w-2.5 h-2.5 text-gray-400" strokeWidth={3} />}
                          </span>
                          <span className={cn('text-xs', included ? 'text-ink' : 'text-muted/70')}>
                            {t(f.label_ru, f.label_uz, f.label_en)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* ── Submit ── */}
        <button type="button" onClick={handleSubmitClick} disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold rounded-2xl transition-all duration-200 text-white disabled:opacity-60 hover:-translate-y-0.5"
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_SOFT})`, boxShadow: '0 12px 28px -10px rgba(27,67,50,0.45)' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {t('Отправить заявку', 'Arizani yuborish', 'Submit application')}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted mt-3">
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: GREEN }} />
          {t('Данные передаются по защищённому соединению и не публикуются', 'Ma\'lumotlar xavfsiz kanal orqali uzatiladi va e\'lon qilinmaydi', 'Data is sent over a secure connection and never published')}
        </p>
      </div>

      {/* ── Public offer confirmation modal ── */}
      {showOffer && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6"
          onClick={() => !loading && setShowOffer(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl border border-[#ECE6D6] shadow-modal max-h-[85vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#1B4332] to-[#2F6B53] shrink-0" />
            <div className="p-6 sm:p-7 overflow-y-auto">
              <h2 className="text-xl font-bold text-ink mb-1" style={{ fontFamily: SERIF }}>
                {t('Публичная оферта', 'Ommaviy oferta', 'Public offer')}
              </h2>
              <p className="text-xs text-muted mb-5">
                {t(
                  'Перед отправкой заявки ознакомьтесь с условиями и подтвердите согласие',
                  'Arizani yuborishdan oldin shartlar bilan tanishing va roziligingizni tasdiqlang',
                  'Please review the terms and confirm your agreement before submitting'
                )}
              </p>
              <ol className="space-y-3 text-sm text-ink leading-relaxed list-decimal list-outside pl-5">
                <li>
                  {t(
                    'Мы не гарантируем поступление в университет. Решение о принятии или отказе принимает только университет. Мы гарантируем со своей стороны выполнение оплаченной работы: перевод документов и подачу заявления в университет.',
                    'Biz universitetga qabul qilinishingizni kafolatlamaymiz. Qabul qilish yoki rad etish haqidagi qarorni faqat universitet qabul qiladi. Biz o\'z tomonimizdan to\'langan ishning bajarilishini kafolatlaymiz: hujjatlarni tarjima qilish va universitetga ariza topshirish.',
                    'We do not guarantee admission to the university. The decision to accept or reject an applicant is made solely by the university. On our part, we guarantee completion of the paid work: document translation and submission of the application to the university.'
                  )}
                </li>
                <li>
                  {t(
                    'Ответ от университета обычно приходит в течение 1–5 месяцев после оплаты и подачи заявления. Срок может зависеть от университета.',
                    'Universitetdan javob odatda to\'lov va ariza topshirilgandan so\'ng 1–5 oy ichida keladi. Muddat universitetga qarab farq qilishi mumkin.',
                    'A response from the university usually arrives within 1–5 months after payment and submission. The timeframe may vary by university.'
                  )}
                </li>
                <li>
                  {t(
                    'Если после оплаты вы передумали подавать документы, возврат денежных средств не производится.',
                    'Agar to\'lovdan so\'ng hujjat topshirishdan voz kechsangiz, pul qaytarilmaydi.',
                    'If you change your mind about submitting your documents after payment, no refund will be issued.'
                  )}
                </li>
                <li>
                  {t(
                    'Оплачивая услугу, вы подтверждаете, что ознакомились и согласны с данными условиями.',
                    'Xizmat uchun to\'lov qilish orqali siz ushbu shartlar bilan tanishganingizni va rozi ekanligingizni tasdiqlaysiz.',
                    'By paying for the service, you confirm that you have read and agree to these terms.'
                  )}
                </li>
              </ol>
            </div>
            <div className="p-5 sm:p-6 border-t border-[#ECE6D6] flex flex-col sm:flex-row gap-3 shrink-0">
              <button type="button" onClick={() => setShowOffer(false)} disabled={loading}
                className="flex-1 h-12 rounded-xl border-2 border-[#E7E1D3] text-sm font-semibold text-ink hover:border-[#1B4332]/30 transition-all disabled:opacity-60">
                {t('Отмена', 'Bekor qilish', 'Cancel')}
              </button>
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60"
                style={{ background: GREEN }}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t('Принимаю', 'Qabul qilaman', 'I accept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
