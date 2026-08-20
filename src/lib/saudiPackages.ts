/**
 * TARJUMAN — Saudi Arabia anketa: service package catalogue
 *
 * Single source of truth for names/prices/descriptions of the 3 packages
 * offered on the Saudi Arabia anketa (/apply-saudi). Both the package-picker
 * UI and the /api/apply-saudi route import from here — the price is never
 * hardcoded in more than one place.
 */

export type SaudiPackageId = 'SUPPORT' | 'STANDARD' | 'VIP'

export interface SaudiPackage {
  id:            SaudiPackageId
  priceUSD:      number
  name_ru:       string
  name_uz:       string
  name_en:       string
  desc_ru:       string
  desc_uz:       string
  desc_en:       string
}

export const SAUDI_PACKAGES: Record<SaudiPackageId, SaudiPackage> = {
  SUPPORT: {
    id:       'SUPPORT',
    priceUSD: 39,
    name_ru:  'Support',
    name_uz:  'Support',
    name_en:  'Support',
    desc_ru:  'Подача готовых документов, уже переведённых на арабский язык, в выбранные университеты + поддержка.',
    desc_uz:  'Arab tiliga tarjima qilingan tayyor hujjatlarni tanlangan universitetlarga topshirish + qo\'llab-quvvatlash.',
    desc_en:  'Submission of ready documents, already translated into Arabic, to your chosen universities + support.',
  },
  STANDARD: {
    id:       'STANDARD',
    priceUSD: 69,
    name_ru:  'Standard',
    name_uz:  'Standard',
    name_en:  'Standard',
    desc_ru:  'Перевод документов на арабский язык + подача документов в университеты + поддержка.',
    desc_uz:  'Hujjatlarni arab tiliga tarjima qilish + universitetlarga topshirish + qo\'llab-quvvatlash.',
    desc_en:  'Translation of documents into Arabic + submission to universities + support.',
  },
  VIP: {
    id:       'VIP',
    priceUSD: 99,
    name_ru:  'VIP',
    name_uz:  'VIP',
    name_en:  'VIP',
    desc_ru:  'Перевод документов на арабский язык + подача документов в университеты без очереди + поддержка.',
    desc_uz:  'Hujjatlarni arab tiliga tarjima qilish + universitetlarga navbatsiz topshirish + qo\'llab-quvvatlash.',
    desc_en:  'Translation of documents into Arabic + priority (no-queue) submission to universities + support.',
  },
}

export const SAUDI_PACKAGE_IDS: SaudiPackageId[] = ['SUPPORT', 'STANDARD', 'VIP']
