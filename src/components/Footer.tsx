'use client'

import Link from 'next/link'
import { Mail, Send, MessageCircle, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

const LINKS = {
  company: [
    { ru: 'О нас',        uz: 'Biz haqimizda', en: 'About',        href: '/about' },
    { ru: 'Университеты', uz: 'Universitetlar', en: 'Universities', href: '/universities' },
    { ru: 'Тарифы',       uz: 'Tariflar',       en: 'Pricing',      href: '/pricing' },
    { ru: 'FAQ',          uz: 'FAQ',             en: 'FAQ',          href: '/faq' },
    { ru: 'Контакты',     uz: 'Aloqa',           en: 'Contact',      href: '/contact' },
  ],
  legal: [
    { ru: 'Политика конфиденциальности', uz: 'Maxfiylik siyosati',      en: 'Privacy Policy',  href: '/privacy' },
    { ru: 'Условия использования',       uz: 'Foydalanish shartlari',   en: 'Terms of Use',    href: '/terms' },
    { ru: 'Политика возврата',           uz: 'Qaytarish siyosati',      en: 'Refund Policy',   href: '/refund' },
    { ru: 'Сведения о компании',         uz: 'Kompaniya ma\'lumotlari', en: 'Company Info',    href: '/legal' },
  ],
}

export default function Footer() {
  const [lang] = useLanguage()

  const t = (ru: string, uz: string, en: string) =>
    lang === 'uz' ? uz : lang === 'en' ? en : ru

  const label = (l: { ru: string; uz: string; en: string }) =>
    lang === 'uz' ? l.uz : lang === 'en' ? l.en : l.ru

  return (
    <footer className="bg-[#0d1117] text-white/80">

      {/* Top divider glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4A943]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-black tracking-tight text-white">TARJUMAN</span>
              <span className="text-[10px] font-semibold bg-brand-400/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-400/30">EDU</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              {t(
                'Консультационные, переводческие и организационные услуги для поступления в университеты Саудовской Аравии и ОАЭ.',
                "Saudiya Arabistoni va BAA universitetlariga qabul qilish uchun konsultatsiya, tarjima va tashkiliy xizmatlar.",
                'Consulting, translation and organizational services for admission to universities in Saudi Arabia and UAE.'
              )}
            </p>
            <p className="text-xs text-white/30 leading-relaxed">
              {t(
                'Решение о зачислении принимается университетом.',
                'Qabul qarori universitet tomonidan qabul qilinadi.',
                'Admission decisions are made by the university.'
              )}
            </p>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              {t('Компания', 'Kompaniya', 'Company')}
            </p>
            <ul className="space-y-2.5">
              {LINKS.company.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {label(l)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              {t('Документы', 'Hujjatlar', 'Legal')}
            </p>
            <ul className="space-y-2.5">
              {LINKS.legal.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {label(l)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              {t('Контакты', 'Aloqa', 'Contacts')}
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@tarjumanedu.com"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-400/50 transition-colors">
                    <Mail size={13} />
                  </span>
                  support@tarjumanedu.com
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/tarjumanedu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-400/50 transition-colors">
                    <Send size={13} />
                  </span>
                  @tarjumanedu
                  <span className="text-[10px] text-white/30">канал</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/TARJUMAN_EDU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-400/50 transition-colors">
                    <MessageCircle size={13} />
                  </span>
                  @TARJUMAN_EDU
                  <span className="text-[10px] text-white/30">{lang === 'uz' ? 'menejer' : lang === 'en' ? 'manager' : 'менеджер'}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/966574958717"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-400/50 transition-colors">
                    <MessageCircle size={13} />
                  </span>
                  WhatsApp
                  <ExternalLink size={10} className="opacity-40" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Tarjuman Edu (bughyat alqasid Est.).{' '}
            {t('Все права защищены.', 'Barcha huquqlar himoyalangan.', 'All rights reserved.')}
          </p>
          <p className="text-xs text-white/25">
            bughyat alqasid Establishment · Riyadh, KSA · CR №&nbsp;<span className="text-white/40 font-mono">7051611031</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
