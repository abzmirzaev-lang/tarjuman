import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Saudiya Arabistoniga o'qishga kirish — Tarjuman Edu",
  description: "Saudiya Arabistoni va BAA universitetlariga hujjat topshirishda yordam. Tarjima, ariza, kuzatib borish. Al Qasimia, IUM, KSU, KAU. Narx $39 dan.",
  keywords: ['saudiya arabistoniga kirish', 'saudiya arabistoni universiteti', 'BAA universiteti', 'arab universiteti qabul', 'hujjat topshirish saudiya', 'stipendiya saudiya arabistoni', 'al qasimia university'],
  alternates: {
    canonical: 'https://tarjumanedu.com/saudiya-arabistoniga-kirish',
    languages: {
      'ru':        'https://tarjumanedu.com/postupit-v-saudovskuyu-araviyu',
      'uz':        'https://tarjumanedu.com/saudiya-arabistoniga-kirish',
      'en':        'https://tarjumanedu.com/study-in-saudi-arabia',
      'x-default': 'https://tarjumanedu.com',
    },
  },
  openGraph: {
    title: "Saudiya Arabistoniga o'qishga kirish — Tarjuman Edu",
    description: "Universitetlarga hujjat topshirishda yordam. $39 dan boshlanadi.",
    url: 'https://tarjumanedu.com/saudiya-arabistoniga-kirish',
  },
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-4">
          <Link href="/" className="text-sm text-brand-600 hover:underline">← Bosh sahifa</Link>
        </div>

        <h1 className="text-4xl font-black text-ink mb-4">
          Saudiya Arabistoni va BAA universitetlariga kirish
        </h1>
        <p className="text-lg text-muted mb-10 leading-relaxed">
          O'zbekiston, Qozog'iston, Tojikiston va boshqa MDH davlatlaridan kelgan talabalar uchun to'liq yordam.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Nima uchun Saudiya Arabistonida o'qish?</h2>
            <ul className="space-y-2 text-muted">
              {[
                "Madina Islom universiteti — to'liq stipendiya, oylik $300–500, bepul yotoqxona",
                "Ko'pchilik davlat universitetlari xorijiy talabalardan to'lov olmaydi",
                "Dunyodagi eng yaxshi islom ta'limi",
                "Xavfsiz muhit va kuchli muslim hamjamiyat",
                "30+ universitetga ariza topshirish imkoniyati",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-ink mb-3">Kerakli hujjatlar</h2>
            <ul className="space-y-2 text-muted">
              {[
                "Diplom yoki attestat (arab tiliga tarjima bilan)",
                "Pasport nusxasi",
                "Suratlar (4 dona, 3×4)",
                "Tibbiy ma'lumotnoma",
                "Tavsiya xatlari (ba'zi universitetlar uchun)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold text-ink mb-4">Narxlar</h2>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { name: 'Topshirish', price: '$39', desc: 'Faqat hujjatlar' },
                { name: 'Standart', price: '$79', desc: 'Tarjima + topshirish' },
                { name: 'VIP', price: '$99', desc: "To'liq yordam" },
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
