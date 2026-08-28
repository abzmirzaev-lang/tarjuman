/**
 * TARJUMAN — Saudi Arabia anketa: service package catalogue
 *
 * Single source of truth for names/prices/descriptions of the 3 packages
 * offered on the Saudi Arabia anketa (/apply-saudi). Both the package-picker
 * UI and the /api/apply-saudi route import from here — the price is never
 * hardcoded in more than one place.
 */

export type SaudiPackageId = 'SUPPORT' | 'STANDARD' | 'VIP'

export type SaudiFeatureKey = 'translation' | 'submission' | 'priority' | 'support'

export interface SaudiFeatureDef {
  key:    SaudiFeatureKey
  label_ru: string
  label_uz: string
  label_en: string
}

// Shared feature rows — every package renders the same rows so the three
// cards line up and differences are scannable at a glance.
export const SAUDI_FEATURES: SaudiFeatureDef[] = [
  { key: 'translation', label_ru: 'Перевод документов на арабский', label_uz: 'Hujjatlarni arab tiliga tarjima qilish', label_en: 'Document translation into Arabic' },
  { key: 'submission',  label_ru: 'Подача документов в университеты', label_uz: 'Universitetlarga hujjat topshirish', label_en: 'Submission to universities' },
  { key: 'priority',    label_ru: 'Приоритетная подача без очереди', label_uz: 'Navbatsiz ustuvor topshirish', label_en: 'Priority, no-queue submission' },
  { key: 'support',     label_ru: 'Личный менеджер на связи', label_uz: 'Shaxsiy menejer aloqada', label_en: 'Dedicated personal manager' },
]

export interface SaudiPackage {
  id:            SaudiPackageId
  priceUSD:      number
  name_ru:       string
  name_uz:       string
  name_en:       string
  tagline_ru:    string
  tagline_uz:    string
  tagline_en:    string
  features:      Record<SaudiFeatureKey, boolean>
}

export const SAUDI_PACKAGES: Record<SaudiPackageId, SaudiPackage> = {
  SUPPORT: {
    id:       'SUPPORT',
    priceUSD: 39,
    name_ru:  'Support',
    name_uz:  'Support',
    name_en:  'Support',
    tagline_ru: 'Документы уже переведены, нужна только подача',
    tagline_uz: 'Hujjatlar allaqachon tarjima qilingan, faqat topshirish kerak',
    tagline_en: 'Your documents are already translated, you just need submission',
    features: { translation: false, submission: true, priority: false, support: true },
  },
  STANDARD: {
    id:       'STANDARD',
    priceUSD: 79,
    name_ru:  'Standard',
    name_uz:  'Standard',
    name_en:  'Standard',
    tagline_ru: 'Полный цикл: перевод и подача под ключ',
    tagline_uz: 'Toliq tsikl: tarjima va topshirish kalit topshirish tizimida',
    tagline_en: 'Full cycle: translation and submission, done for you',
    features: { translation: true, submission: true, priority: false, support: true },
  },
  VIP: {
    id:       'VIP',
    priceUSD: 99,
    name_ru:  'VIP',
    name_uz:  'VIP',
    name_en:  'VIP',
    tagline_ru: 'Все из Standard плюс максимальный приоритет и скорость',
    tagline_uz: 'Standard imkoniyatlari plyus maksimal ustuvorlik va tezlik',
    tagline_en: 'Everything in Standard plus maximum priority and speed',
    features: { translation: true, submission: true, priority: true, support: true },
  },
}

export const SAUDI_PACKAGE_IDS: SaudiPackageId[] = ['SUPPORT', 'STANDARD', 'VIP']
