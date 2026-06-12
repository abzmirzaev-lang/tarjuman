'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'

const T = {
  ru: {
    login: 'Войти',
    register: 'Зарегистрироваться',
    loginSub: 'Войдите, чтобы отслеживать заявку',
    registerSub: 'Создайте аккаунт для подачи заявки',
    email: 'Email',
    password: 'Пароль',
    passwordMin: 'Минимум 6 символов',
    loginBtn: 'Войти',
    registerBtn: 'Создать аккаунт',
    noAccount: 'Нет аккаунта?',
    hasAccount: 'Уже есть аккаунт?',
    orGoogle: 'или войдите через',
    googleBtn: 'Google',
    confirmTitle: 'Подтвердите email',
    confirmText: 'Мы отправили письмо на ',
    confirmText2: '. Перейдите по ссылке в письме для активации аккаунта.',
    terms: 'Нажимая, вы соглашаетесь с',
    termsLink: 'условиями использования',
    forgotPassword: 'Забыли пароль?',
    resetSent: 'Ссылка для сброса отправлена на вашу почту.',
  },
  uz: {
    login: 'Kirish',
    register: 'Ro\'yxatdan o\'tish',
    loginSub: 'Arizangizni kuzatish uchun kiring',
    registerSub: 'Ariza topshirish uchun hisob yarating',
    email: 'Email',
    password: 'Parol',
    passwordMin: 'Kamida 6 ta belgi',
    loginBtn: 'Kirish',
    registerBtn: 'Hisob yaratish',
    noAccount: 'Hisobingiz yo\'qmi?',
    hasAccount: 'Hisobingiz bormi?',
    orGoogle: 'yoki orqali kiring',
    googleBtn: 'Google',
    confirmTitle: 'Emailni tasdiqlang',
    confirmText: '',
    confirmText2: ' manziliga xat yubordik. Hisobni faollashtirish uchun xatdagi havolaga o\'ting.',
    terms: 'Bosish orqali siz',
    termsLink: 'foydalanish shartlariga',
    forgotPassword: 'Parolni unutdingizmi?',
    resetSent: 'Qayta tiklash havolasi elektron pochtangizga yuborildi.',
  },
  en: {
    login: 'Sign in',
    register: 'Create account',
    loginSub: 'Sign in to track your application',
    registerSub: 'Create an account to apply',
    email: 'Email',
    password: 'Password',
    passwordMin: 'Minimum 6 characters',
    loginBtn: 'Sign in',
    registerBtn: 'Create account',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    orGoogle: 'or continue with',
    googleBtn: 'Google',
    confirmTitle: 'Confirm your email',
    confirmText: 'We sent a confirmation link to ',
    confirmText2: '. Click the link in the email to activate your account.',
    terms: 'By continuing, you agree to our',
    termsLink: 'terms of service',
    forgotPassword: 'Forgot password?',
    resetSent: 'Password reset link sent to your email.',
  },
}

export default function LoginPage() {
  const [lang] = useLanguage()
  const t = T[lang as keyof typeof T] ?? T.ru
  const router = useRouter()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/dashboard')
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError(lang === 'ru' ? 'Заполните все поля' : lang === 'uz' ? 'Barcha maydonlarni to\'ldiring' : 'Fill all fields')
      return
    }
    if (password.length < 6) {
      setError(lang === 'ru' ? 'Пароль минимум 6 символов' : lang === 'uz' ? 'Parol kamida 6 ta belgi' : 'Password must be at least 6 characters')
      return
    }
    setLoading(true)
    if (mode === 'register') {
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
      })
      if (err) { setError(err.message); setLoading(false) }
      else { setConfirmed(true); setLoading(false) }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (err) {
        setError(
          lang === 'ru' ? 'Неверный email или пароль' :
          lang === 'uz' ? 'Email yoki parol noto\'g\'ri' :
          'Incorrect email or password'
        )
        setLoading(false)
      } else {
        router.push('/dashboard')
      }
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/confirm`, queryParams: { prompt: 'select_account' } },
    })
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError(lang === 'ru' ? 'Введите email для сброса пароля' : lang === 'uz' ? 'Parol tiklash uchun email kiriting' : 'Enter your email to reset password')
      return
    }
    setResetLoading(true)
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/confirm`,
    })
    setResetLoading(false)
    setResetSent(true)
    setError('')
  }

  const INPUT = "w-full h-12 px-4 pr-11 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white"

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-md p-8 text-center">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t.confirmTitle}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t.confirmText}<strong>{email}</strong>{t.confirmText2}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center mb-8">
        <svg viewBox="0 0 156 36" width="140" height="32" aria-label="TARJUMAN">
          <path d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36"
            fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
          <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
          <text x="40" y="24" fontFamily="'Helvetica Neue',Arial,sans-serif"
            fontSize="15" fontWeight="700" fill="#1B4332" style={{ letterSpacing: '4px' }}>TARJUMAN</text>
        </svg>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-md overflow-hidden">

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setResetSent(false) }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                mode === m ? 'text-[#1B4332] border-b-2 border-[#1B4332] -mb-px' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {m === 'login' ? t.login : t.register}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-sm text-gray-500 mb-6 text-center">
            {mode === 'login' ? t.loginSub : t.registerSub}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none w-4 h-4" />
              <input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder={t.password}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-11 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all bg-white"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-xs text-gray-400 -mt-2">{t.passwordMin}</p>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
              {resetSent && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {t.resetSent}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full h-12 bg-[#1B4332] text-white font-semibold rounded-xl hover:bg-[#1B4332]/90 transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 text-base">
              {loading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (mode === 'login' ? t.loginBtn : t.registerBtn)}
            </button>
          </form>

          {/* Forgot password */}
          {mode === 'login' && (
            <div className="mt-3 text-center">
              <button onClick={handleForgotPassword} disabled={resetLoading}
                className="text-xs text-gray-400 hover:text-[#1B4332] transition-colors underline-offset-2 hover:underline">
                {resetLoading ? '...' : t.forgotPassword}
              </button>
            </div>
          )}

          {/* Divider + Google */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">{t.orGoogle}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t.googleBtn}
          </button>

          <p className="text-xs text-gray-400 text-center mt-5">
            {t.terms}{' '}
            <Link href="/terms" className="text-[#1B4332] hover:underline">{t.termsLink}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
