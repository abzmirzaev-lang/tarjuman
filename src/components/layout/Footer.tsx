import Link from 'next/link'
import { translations } from '@/i18n'
import type { AppLanguage } from '@/types'

export function Footer({ lang = 'ru' }: { lang?: AppLanguage }) {
  const t = translations[lang]
  return (
    <footer className="bg-ink text-white/80">
      <div className="container-wide py-14 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center mb-3">
            <svg viewBox="0 0 156 36" width="148" height="34" aria-label="TARJUMAN">
              <path
                d="M 2,36 L 2,22 L 8,10 L 16,4 L 24,10 L 30,22 L 30,36"
                fill="none" stroke="#ffffff" strokeWidth="1.5"
                strokeLinejoin="round" strokeLinecap="round"
              />
              <line x1="9" y1="13" x2="23" y2="13" stroke="#D4A943" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="13" x2="16" y2="31" stroke="#D4A943" strokeWidth="2" strokeLinecap="round"/>
              <text x="40" y="24"
                fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
                fontSize="15" fontWeight="700" fill="#ffffff"
                style={{ letterSpacing: '4px' }}
              >TARJUMAN</text>
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-white/60 max-w-xs">{t.footer.tagline}</p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">{t.footer.navTitle}</h4>
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
          <h4 className="text-white font-semibold mb-3 text-sm">{t.footer.contactTitle}</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="mailto:tarjumanedu@gmail.com" className="hover:text-white transition-colors">tarjumanedu@gmail.com</a></li>
            <li><a href="https://t.me/TARJUMAN_KSA" className="hover:text-white transition-colors">@TARJUMAN_KSA</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Документы</h4>
          <ul className="space-y-2">
            {[
              ['/terms',   'Условия использования'],
              ['/privacy', 'Конфиденциальность'   ],
              ['/refund',  'Политика возврата'     ],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-5 flex items-center justify-center text-xs text-white/40">
          <p>{t.footer.copy}</p>
        </div>
      </div>
    </footer>
  )
}
