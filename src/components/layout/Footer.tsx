import Link from 'next/link'
import { translations } from '@/i18n'
import type { AppLanguage } from '@/types'

export function Footer({ lang = 'ru' }: { lang?: AppLanguage }) {
  const t = translations[lang]
  return (
    <footer className="bg-ink text-white/80">
      <div className="container-wide py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center text-white text-sm font-bold">T</span>
            <span className="font-bold text-xl text-white">TARJUMAN</span>
          </div>
          <p className="text-sm leading-relaxed text-white/60 max-w-xs">{t.footer.tagline}</p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Навигация</h4>
          <ul className="space-y-2">
            {[
              ['/universities', t.nav.universities],
              ['/pricing',      t.nav.pricing     ],
              ['/about',        t.nav.about       ],
              ['/faq',          t.nav.faq         ],
              ['/contact',      t.nav.contact     ],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Контакты</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="mailto:info@tarjuman.com" className="hover:text-white transition-colors">info@tarjuman.com</a></li>
            <li><a href="https://t.me/tarjumanuz" className="hover:text-white transition-colors">@tarjumanuz</a></li>
            <li><a href="tel:+998901234567" className="hover:text-white transition-colors">+998 90 123 45 67</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>{t.footer.copy}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">{t.footer.privacy}</Link>
            <Link href="/terms"   className="hover:text-white/70 transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
