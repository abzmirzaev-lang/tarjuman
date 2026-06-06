'use client'

import Link from 'next/link'
import { Mail, Send, MessageCircle, ExternalLink } from 'lucide-react'

const LINKS = {
  company: [
    { label: 'О нас',          href: '/about' },
    { label: 'Университеты',   href: '/universities' },
    { label: 'Тарифы',         href: '/pricing' },
    { label: 'FAQ',            href: '/faq' },
    { label: 'Контакты',       href: '/contact' },
  ],
  legal: [
    { label: 'Политика конфиденциальности', href: '/privacy' },
    { label: 'Условия использования',       href: '/terms' },
    { label: 'Политика возврата',           href: '/refund' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0d1117] text-white/80">

      {/* Top divider glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-black tracking-tight text-white">TARJUMAN</span>
              <span className="text-[10px] font-semibold bg-brand-400/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-400/30">EDU</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              Консультационные, переводческие и организационные услуги для поступления в университеты Саудовской Аравии и ОАЭ.
            </p>
            <p className="text-xs text-white/30 leading-relaxed">
              Решение о зачислении принимается университетом.
            </p>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Компания</p>
            <ul className="space-y-2.5">
              {LINKS.company.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Документы</p>
            <ul className="space-y-2.5">
              {LINKS.legal.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Контакты</p>
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
                  href="https://t.me/TARJUMAN_KSA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors duration-150 group"
                >
                  <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-400/50 transition-colors">
                    <Send size={13} />
                  </span>
                  @TARJUMAN_KSA
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/message/TARJUMANEDU"
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
        <div className="mt-12 pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Tarjuman Edu. Все права защищены.
          </p>
          <p className="text-xs text-white/25">
            CR №&nbsp;<span className="text-white/40 font-mono">1010XXXXXX</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
