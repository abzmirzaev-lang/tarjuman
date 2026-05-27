'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { AppLanguage } from '@/types'
import { translations } from '@/i18n'

interface NavbarProps {
  lang?:    AppLanguage
  onLangChange?: (l: AppLanguage) => void
}

const LANGS: { code: AppLanguage; label: string }[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: "O'zbek" },
  { code: 'en', label: 'English' },
]

export function Navbar({ lang = 'ru', onLangChange }: NavbarProps) {
  const t       = translations[lang]
  const pathname = usePathname()
  const [open,    setOpen]    = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user,    setUser]    = useState<any>(null)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  const navLinks = [
    { href: '/universities', label: t.nav.universities },
    { href: '/pricing',      label: t.nav.pricing      },
    { href: '/faq',          label: 'FAQ'              },
    { href: '/about',        label: t.nav.about        },
    { href: '/contact',      label: t.nav.contact      },
  ]

  const isHome = pathname === '/'
  const useDark = !isHome || scrolled || open

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        (scrolled || !isHome)
          ? 'bg-white/95 border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
      style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
    >
      <nav className="container-wide h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <svg viewBox="0 0 156 36" width="156" height="36" aria-label="TARJUMAN">
            <path
              d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36"
              fill="none"
              stroke={useDark ? '#1B4332' : '#ffffff'}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line x1="9" y1="13" x2="23" y2="13" stroke="#D4A943" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="13" x2="16" y2="31" stroke="#D4A943" strokeWidth="2" strokeLinecap="round"/>
            <text
              x="40" y="24"
              fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
              fontSize="15" fontWeight="700"
              fill={useDark ? '#1B4332' : '#ffffff'}
              style={{ letterSpacing: '4px' }}
            >TARJUMAN</text>
          </svg>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === l.href
                  ? 'text-brand-600 bg-brand-50'
                  : useDark
                    ? 'text-muted hover:text-ink hover:bg-ink/5'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="btn-ghost btn-sm flex items-center gap-1.5 rounded-lg"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase text-xs font-semibold">{lang}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  className="absolute right-0 top-full mt-1 card py-1 w-36 z-50"
                >
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { onLangChange?.(l.code); setLangOpen(false) }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm rounded-lg mx-1 transition-colors',
                        lang === l.code ? 'text-brand-600 font-medium' : 'text-muted hover:text-ink hover:bg-ink/5'
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm" icon={<LayoutDashboard className="w-4 h-4" />}>
                  {t.nav.dashboard}
                </Button>
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="btn-ghost btn-sm p-2 rounded-lg"
                title={t.nav.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm">{t.nav.login}</Button>
              </Link>
              <Link href="/apply">
                <Button variant="primary" size="sm">{t.nav.apply}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className={cn(
            'md:hidden btn-sm p-2 rounded-lg transition-colors',
            useDark ? 'text-ink hover:bg-ink/5' : 'text-white hover:bg-white/10'
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-border overflow-hidden"
          >
            <div className="container-wide py-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium',
                    pathname === l.href ? 'text-brand-600 bg-brand-50' : 'text-muted hover:text-ink hover:bg-ink/5'
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-border mt-2">
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => { onLangChange?.(l.code); setOpen(false) }}
                    className={cn('px-4 py-2 rounded-xl text-sm text-left', lang === l.code ? 'text-brand-600 font-medium' : 'text-muted')}
                  >
                    {l.label}
                  </button>
                ))}
                {user ? (
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="primary" size="md" className="w-full">{t.nav.dashboard}</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="secondary" size="md" className="w-full">{t.nav.login}</Button>
                    </Link>
                    <Link href="/apply" onClick={() => setOpen(false)}>
                      <Button variant="primary" size="md" className="w-full">{t.nav.apply}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
