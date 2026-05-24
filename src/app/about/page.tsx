'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Award, Users, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import type { AppLanguage } from '@/types'
import { translations } from '@/i18n'

export default function AboutPage() {
  const [lang, setLang] = useState<AppLanguage>('ru')
  const t = translations[lang]

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <div className="pt-16 min-h-screen bg-surface">
        {/* Hero */}
        <div className="bg-white border-b border-border py-16 md:py-24">
          <div className="container-narrow text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="page-title mb-4">
              {lang === 'ru' ? 'О компании TARJUMAN' : lang === 'uz' ? 'TARJUMAN haqida' : 'About TARJUMAN'}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="page-subtitle max-w-2xl mx-auto">
              {lang === 'ru'
                ? 'Мы помогаем студентам из СНГ поступить в университеты Саудовской Аравии — быстро, правильно и без лишних хлопот.'
                : lang === 'uz'
                ? 'Biz MDH talabalarига Saudiya Arabistoni universitetlariga tez va to\'g\'ri kirish imkonini beramiz.'
                : 'We help CIS students get into Saudi universities — fast, correctly, and without unnecessary stress.'}
            </motion.p>
          </div>
        </div>

        {/* Values */}
        <section className="section">
          <div className="container-narrow">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users,  n: '500+', l: lang === 'ru' ? 'Студентов поступили' : 'Students admitted' },
                { icon: Award,  n: '6',    l: lang === 'ru' ? 'Партнёрских университетов' : 'Partner Universities' },
                { icon: Clock,  n: '6ч',   l: lang === 'ru' ? 'Минимальное время подачи' : 'Min. submission time' },
                { icon: Shield, n: '100%', l: lang === 'ru' ? 'Правильно с первого раза' : 'Correct first time' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card p-6 text-center">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <div className="text-2xl font-bold text-ink mb-1">{item.n}</div>
                  <div className="text-sm text-muted">{item.l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="section bg-white">
          <div className="container-narrow max-w-3xl">
            <h2 className="text-3xl font-bold text-ink mb-6">
              {lang === 'ru' ? 'Наша история' : lang === 'uz' ? 'Bizning tarix' : 'Our Story'}
            </h2>
            <div className="prose text-muted space-y-4 text-base leading-relaxed">
              <p>
                {lang === 'ru'
                  ? 'TARJUMAN — это команда людей, которые сами прошли через поступление в арабские университеты и знают каждую деталь этого процесса. Мы создали сервис, который хотели бы иметь сами: без лишних ожиданий, без ошибок в документах и без непонятных задержек.'
                  : 'TARJUMAN is a team of people who went through the Arab university admission process themselves and know every detail. We built the service we wished we had.'}
              </p>
              <p>
                {lang === 'ru'
                  ? 'Наша фишка — скорость и точность. Пакет «Стандарт» — подача за 24 часа, VIP — за 6 часов. Документы переводим правильно с первого раза, потому что знаем требования каждого университета. А после зачисления мы остаёмся на связи — чтобы вы не остались один на один с новой страной.'
                  : 'Our thing is speed and accuracy. Standard package — submission in 24 hours, VIP — in 6 hours. Documents translated correctly the first time, because we know each university\'s requirements. And after admission, we stay in touch.'}
              </p>
              <p>
                {lang === 'ru'
                  ? 'Более 500 студентов уже учатся в Саудовской Аравии благодаря TARJUMAN. Следующий — вы.'
                  : 'Over 500 students are already studying in Saudi Arabia thanks to TARJUMAN. You could be next.'}
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer lang={lang} />
    </>
  )
}
