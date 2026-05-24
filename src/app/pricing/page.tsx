'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Zap, Star, Send } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui'
import { PACKAGES } from '@/types'
import type { AppLanguage, ServicePackage } from '@/types'
import { translations } from '@/i18n'
import { cn } from '@/lib/utils'

const ICONS: Record<ServicePackage, typeof Send> = {
  SUBMISSION: Send,
  STANDARD:   Star,
  VIP:        Zap,
}

export default function PricingPage() {
  const [lang, setLang] = useState<AppLanguage>('ru')
  const t = translations[lang]

  const packs = (['SUBMISSION', 'STANDARD', 'VIP'] as ServicePackage[]).map(k => ({
    key:      k,
    ...PACKAGES[k],
    popular:  k === 'STANDARD',
    Icon:     ICONS[k],
    features: lang === 'ru' ? PACKAGES[k].features_ru : PACKAGES[k].features_en,
    name:     lang === 'ru' ? PACKAGES[k].name_ru : lang === 'uz' ? PACKAGES[k].name_uz : PACKAGES[k].name_en,
  }))

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        <div className="container-narrow py-16 md:py-24">
          <div className="text-center mb-14">
            <h1 className="page-title mb-4">{t.pricing.title}</h1>
            <p className="page-subtitle">{t.pricing.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {packs.map((pack, i) => (
              <motion.div
                key={pack.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'card p-7 flex flex-col relative',
                  pack.popular && 'border-brand-400 border-2 shadow-lg scale-[1.02]'
                )}
              >
                {pack.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t.pricing.popular}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start gap-3 mb-5">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    pack.popular ? 'bg-brand-400 text-white' : 'bg-surface text-brand-500'
                  )}>
                    <pack.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted">{pack.name}</div>
                    <div className="text-2xl font-bold text-ink">${pack.priceUSD}</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {pack.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-muted">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href={`/apply?package=${pack.key}`}>
                  <Button
                    variant={pack.popular ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full"
                  >
                    {t.pricing.choose}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQ teaser */}
          <div className="text-center mt-12">
            <p className="text-muted text-sm">
              {lang === 'ru' ? 'Есть вопросы? ' : lang === 'uz' ? 'Savollar bormi? ' : 'Have questions? '}
              <Link href="/faq" className="text-brand-500 hover:underline">
                {lang === 'ru' ? 'Смотрите FAQ' : lang === 'uz' ? 'FAQ ga qarang' : 'See FAQ'}
              </Link>
              {lang === 'ru' ? ' или ' : lang === 'uz' ? ' yoki ' : ' or '}
              <a href="https://t.me/tarjumanuz" className="text-brand-500 hover:underline">
                {lang === 'ru' ? 'напишите нам' : lang === 'uz' ? 'bizga yozing' : 'contact us'}
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  )
}
