import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Study in Saudi Arabia — Tarjuman Edu | University Admission Help',
  description: 'Apply to universities in Saudi Arabia and UAE from CIS countries. Document translation, application submission, full support. Al Qasimia, IUM, KSU, KAU. From $39.',
  keywords: ['study in saudi arabia', 'university admission saudi arabia', 'apply saudi arabia university', 'study in uae', 'saudi arabia scholarship', 'al qasimia university apply', 'islamic university madinah'],
  alternates: {
    canonical: 'https://tarjumanedu.com/study-in-saudi-arabia',
    languages: {
      'ru':        'https://tarjumanedu.com/postupit-v-saudovskuyu-araviyu',
      'uz':        'https://tarjumanedu.com/saudiya-arabistoniga-kirish',
      'en':        'https://tarjumanedu.com/study-in-saudi-arabia',
      'x-default': 'https://tarjumanedu.com',
    },
  },
  openGraph: {
    title: 'Study in Saudi Arabia — Tarjuman Edu',
    description: 'University admission help for CIS students. Document translation, application, guidance. From $39.',
    url: 'https://tarjumanedu.com/study-in-saudi-arabia',
  },
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-4">
          <Link href="/" className="text-sm text-brand-600 hover:underline">← Home</Link>
        </div>

        <h1 className="text-4xl font-black text-ink mb-4">
          Study in Saudi Arabia & UAE — University Admissions for CIS Students
        </h1>
        <p className="text-lg text-muted mb-10 leading-relaxed">
          Tarjuman Edu helps students from Uzbekistan, Kazakhstan, Tajikistan, Kyrgyzstan, Azerbaijan and Russia apply to top universities in Saudi Arabia and UAE.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Why Study in Saudi Arabia?</h2>
            <ul className="space-y-2 text-muted">
              {[
                'Full scholarships available at Islamic University of Madinah and other state universities',
                'Monthly stipend of $300–500 at scholarship universities',
                'Free tuition at many Saudi government universities for international students',
                'World-class education in Islamic studies, engineering, medicine, and business',
                'Safe environment and strong Muslim community',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Top Universities</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Al Qasimia University', city: 'Sharjah, UAE' },
                { name: 'Islamic University of Madinah', city: 'Madinah, KSA' },
                { name: 'King Saud University', city: 'Riyadh, KSA' },
                { name: 'King Abdulaziz University', city: 'Jeddah, KSA' },
              ].map(u => (
                <div key={u.name} className="bg-white rounded-xl border border-border p-4">
                  <p className="font-bold text-ink text-sm">{u.name}</p>
                  <p className="text-xs text-muted">{u.city}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">How We Help</h2>
            <div className="space-y-3">
              {[
                { step: '01', title: 'University selection', desc: 'We help you choose the right university based on your grades, language level and goals.' },
                { step: '02', title: 'Document translation', desc: 'All documents translated into Arabic — accepted by Saudi and UAE universities.' },
                { step: '03', title: 'Application submission', desc: 'We submit your documents directly to the admissions office.' },
                { step: '04', title: 'Visa support', desc: 'After acceptance, we guide you through the student visa process.' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 bg-white rounded-xl border border-border p-4">
                  <span className="text-2xl font-black text-brand-400">{s.step}</span>
                  <div>
                    <p className="font-bold text-ink">{s.title}</p>
                    <p className="text-sm text-muted">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-ink mb-4">Pricing</h2>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { name: 'Submission', price: '$39', desc: 'Documents only' },
                { name: 'Standard', price: '$69', desc: 'Translation + submission' },
                { name: 'VIP', price: '$99', desc: 'Full support' },
              ].map(t => (
                <div key={t.name} className="text-center p-3 bg-[#F7F8FA] rounded-xl">
                  <p className="font-bold text-ink">{t.name}</p>
                  <p className="text-2xl font-black text-brand-600">{t.price}</p>
                  <p className="text-xs text-muted">{t.desc}</p>
                </div>
              
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
