'use client'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Building2, FileText, Mail, MapPin, Hash, Calendar, Globe } from 'lucide-react'

type Lang = 'ru' | 'uz' | 'en'

const CONTENT: Record<Lang, {
  badge: string
  title: string
  subtitle: string
  companyTitle: string
  activityTitle: string
  activity: string
  contactTitle: string
  docsTitle: string
  fields: { label: string; value: string }[]
}> = {
  ru: {
    badge: 'Юридическая информация',
    title: 'Сведения о компании',
    subtitle: 'Официальная информация о юридическом лице, оказывающем услуги на платформе TARJUMAN.',
    companyTitle: 'Реквизиты организации',
    activityTitle: 'Вид деятельности',
    activity: 'Консультационные и посреднические услуги в сфере образования: помощь в поступлении в университеты Саудовской Аравии и ОАЭ, перевод документов, сопровождение студентов.',
    contactTitle: 'Контактная информация',
    docsTitle: 'Правовые документы',
    fields: [
      { label: 'Полное наименование', value: 'bughyat alqasid Establishment' },
      { label: 'Арабское название', value: 'مؤسسة بغية القاصد' },
      { label: 'Тип организации', value: 'Establishment (Единоличное предприятие)' },
      { label: 'Номер коммерческой регистрации (CR)', value: '7051611031' },
      { label: 'Дата регистрации', value: '13 сентября 2025 г.' },
      { label: 'Статус', value: 'Действующая (Active)' },
      { label: 'Страна регистрации', value: 'Королевство Саудовская Аравия' },
      { label: 'Регулятор', value: 'Министерство торговли Саудовской Аравии (mc.gov.sa)' },
    ],
  },
  uz: {
    badge: 'Yuridik ma\'lumot',
    title: 'Kompaniya haqida ma\'lumot',
    subtitle: 'TARJUMAN platformasida xizmat ko\'rsatuvchi yuridik shaxs haqida rasmiy ma\'lumot.',
    companyTitle: 'Tashkilot rekvizitlari',
    activityTitle: 'Faoliyat turi',
    activity: 'Ta\'lim sohasida maslahat va vositachilik xizmatlari: Saudiya Arabistoni va BAA universitetlariga qabul bo\'lishda yordam, hujjatlarni tarjima qilish, talabalarni qo\'llab-quvvatlash.',
    contactTitle: 'Aloqa ma\'lumotlari',
    docsTitle: 'Huquqiy hujjatlar',
    fields: [
      { label: 'To\'liq nomi', value: 'bughyat alqasid Establishment' },
      { label: 'Arabcha nomi', value: 'مؤسسة بغية القاصد' },
      { label: 'Tashkilot turi', value: 'Establishment (Yakka tartibdagi korxona)' },
      { label: 'Tijoriy ro\'yxat raqami (CR)', value: '7051611031' },
      { label: 'Ro\'yxatga olingan sana', value: '13 sentabr 2025 y.' },
      { label: 'Holati', value: 'Faol (Active)' },
      { label: 'Ro\'yxatga olingan mamlakat', value: 'Saudiya Arabistoni Qirolligi' },
      { label: 'Nazorat organi', value: 'Saudiya Arabistoni Savdo vazirligi (mc.gov.sa)' },
    ],
  },
  en: {
    badge: 'Legal Information',
    title: 'Company Details',
    subtitle: 'Official information about the legal entity providing services on the TARJUMAN platform.',
    companyTitle: 'Company Registration',
    activityTitle: 'Business Activity',
    activity: 'Educational consultancy and intermediary services: assistance with university admissions in Saudi Arabia and the UAE, document translation, and student support.',
    contactTitle: 'Contact Information',
    docsTitle: 'Legal Documents',
    fields: [
      { label: 'Full Name', value: 'bughyat alqasid Establishment' },
      { label: 'Arabic Name', value: 'مؤسسة بغية القاصد' },
      { label: 'Entity Type', value: 'Establishment (Sole Proprietorship)' },
      { label: 'Commercial Registration No. (CR)', value: '7051611031' },
      { label: 'Registration Date', value: 'September 13, 2025' },
      { label: 'Status', value: 'Active' },
      { label: 'Country of Registration', value: 'Kingdom of Saudi Arabia' },
      { label: 'Regulator', value: 'Ministry of Commerce, Saudi Arabia (mc.gov.sa)' },
    ],
  },
}

const ICONS: Record<string, React.ReactNode> = {
  0: <Building2 className="w-4 h-4" />,
  1: <Building2 className="w-4 h-4" />,
  2: <FileText className="w-4 h-4" />,
  3: <Hash className="w-4 h-4" />,
  4: <Calendar className="w-4 h-4" />,
  5: <FileText className="w-4 h-4" />,
  6: <MapPin className="w-4 h-4" />,
  7: <Globe className="w-4 h-4" />,
}

export default function LegalPage() {
  const { lang } = useLanguage()
  const c = CONTENT[(lang as Lang) ?? 'ru']

  return (
    <>
      <Navbar lang={lang} />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-ink text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#C9922A] mb-3">
              {c.badge}
            </span>
            <h1 className="text-4xl font-bold mb-4">{c.title}</h1>
            <p className="text-white/60 text-base max-w-xl mx-auto">{c.subtitle}</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">

          {/* Company details card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-ink text-base">{c.companyTitle}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {c.fields.map((field, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-4">
                  <span className="mt-0.5 text-[#1B4332]">{ICONS[i]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">{field.label}</p>
                    <p
                      className="text-sm font-medium text-ink break-words"
                      dir={i === 1 ? 'rtl' : 'ltr'}
                    >
                      {field.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-ink text-base">{c.activityTitle}</h2>
            </div>
            <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed">
              {c.activity}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-ink text-base">{c.contactTitle}</h2>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#1B4332]" />
                <a href="mailto:tarjumanedu@gmail.com" className="text-[#1B4332] hover:underline font-medium">
                  tarjumanedu@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-4 h-4 text-[#1B4332]" />
                <a href="https://tarjuman.uz" className="text-[#1B4332] hover:underline font-medium">
                  tarjuman.uz
                </a>
              </div>
            </div>
          </div>

          {/* Legal docs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-ink text-base">{c.docsTitle}</h2>
            </div>
            <div className="px-6 py-5 flex flex-wrap gap-3">
              {[
                { href: '/terms',   label: lang === 'ru' ? 'Условия использования' : lang === 'uz' ? 'Foydalanish shartlari' : 'Terms of Service' },
                { href: '/privacy', label: lang === 'ru' ? 'Политика конфиденциальности' : lang === 'uz' ? 'Maxfiylik siyosati' : 'Privacy Policy' },
                { href: '/refund',  label: lang === 'ru' ? 'Политика возврата' : lang === 'uz' ? 'Qaytarish siyosati' : 'Refund Policy' },
              ].map(doc => (
                <Link
                  key={doc.href}
                  href={doc.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-[#1B4332] hover:text-[#1B4332] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {doc.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer lang={lang} />
    </>
  )
}
