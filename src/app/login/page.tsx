'use client'
import { useLanguage } from '@/hooks/useLanguage'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import type { AppLanguage } from '@/types'
import { translations } from '@/i18n'

export default function LoginPage() {
  const [lang, setLang] = useLanguage()
  const [loading, setLoading] = useState(false)
  const router  = useRouter()
  const t = translations[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/dashboard')
    })
  }, [router])

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link href="/" className="flex items-center mb-10">
        <svg viewBox="0 0 156 36" width="156" height="36" aria-label="TARJUMAN">
          <path
            d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36"
            fill="none" stroke="#1B4332" strokeWidth="1.5"
            strokeLinejoin="round" strokeLinecap="round"
          />
          <line x1="9" y1="13" x2="23" y2="13" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="13" x2="16" y2="31" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/>
          <text x="40" y="24"
            fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
            fontSize="15" fontWeight="700"
            fill="#1B4332" style={{ letterSpacing: '4px' }}
          >TARJUMAN</text>
        </svg>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold text-ink mb-2 text-center">{t.auth.loginTitle}</h1>
        <p className="text-muted text-sm text-center mb-8">{t.auth.loginSub}</p>

        <Button
          variant="secondary"
          size="lg"
          className="w-full border-border"
          loading={loading}
          onClick={handleGoogleLogin}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          }
        >
          {t.auth.googleLogin}
        </Button>

        <p className="text-xs text-muted text-center mt-6">
          {t.auth.terms}{' '}
          <Link href="/terms" className="text-brand-500 hove