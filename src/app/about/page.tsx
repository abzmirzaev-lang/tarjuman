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
                ? 'Мы специализируемся на помощи студентам из стран СНГ в поступлении в ведущие университеты Саудовской Аравии и ОАЭ. С 2019 года помогаем сотням студентов реализовать свою мечту об арабском образовании.'
                : lang === 'uz'
                ? 'Biz MDH mamlakatlaridan talabalarni Saudiya Arabistoni va BAA ning yetakchi universitetlariga qabulida yordam berishga ixtisoslashganmiz.'
                : 'We specialize in helping students from CIS countries get admitted to leading universities in Saudi Arabia and UAE.'}
            </motion.p>
          </div>
        </div>

        {/* Values */}
        <section className="section">
          <div className="container-narrow">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield,  n: '500+', l: lang === 'ru' ? 'Успешных поступлений' : 'Successful Admissions' },
                { icon: Award,   n: '15+',  l: lang === 'ru' ? 'Партнёрских университетов' : 'Partner Universities' },
                { icon: Users,   n: '5',    l: lang === 'ru' ? 'Лет опыта' : 'Years of Experience' },
                { icon: Clock,   n: '3дня', l: lang === 'ru' ? 'Среднее время обработки' : 'Avg. Processing Time' },
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
                  ? 'TARJUMAN был основан в 2019 году командой выпускников арабских университетов. Мы на собственном опыте знаем, насколько сложным может быть процесс поступления — языковые барьеры, бюрократические сложности, незнание требований.'
                  : 'TARJUMAN was founded in 2019 by a team of Arab university graduates who experienced firsthand how challenging the admission process can be.'}
              </p>
              <p>
                {lang === 'ru'
                  ? 'Сегодня наша команда состоит из специалистов с опытом работы в ведущих университетах Саудовской Аравии и ОАЭ. Мы не просто подаём документы — мы становимся вашим личным проводником на всём пути от мечты до зачисления.'
                  : 'Today our team consists of specialists with experience at leading universities in Saudi Arabia and UAE. We guide you every step of the way.'}
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer lang={lang} />
    </>
  )
}
