// ============================================================
// TARJUMAN — TypeScript Types (mirrors DB schema)
// ============================================================

export type AppLanguage = 'ru' | 'uz' | 'en'

export type ApplicationStatus =
  | 'REGISTERED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'UNDER_REVIEW'
  | 'SUBMITTED'
  | 'COMPLETED'
  | 'REJECTED'

export type PaymentStatus  = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type PaymentMethod  = 'STRIPE_CARD' | 'STRIPE_APPLE_PAY' | 'CIS_UZCARD' | 'CIS_HUMO' | 'OTHER'
export type ServicePackage = 'SUBMISSION' | 'STANDARD' | 'VIP'
export type DocumentType   =
  | 'PASSPORT' | 'PHOTO' | 'DIPLOMA' | 'TRANSCRIPT'
  | 'IELTS' | 'ARABIC_CERT' | 'RECOMMENDATION'
  | 'MEDICAL' | 'CRIMINAL_RECORD' | 'OTHER'
export type MessageSender = 'USER' | 'ADMIN'

// ──────────────────────────────────────────
// DB Row types
// ──────────────────────────────────────────
export interface UserRow {
  id:              string
  email:           string
  full_name?:      string
  avatar_url?:     string
  phone?:          string
  telegram?:       string
  citizenship?:    string
  date_of_birth?:  string
  education_level?: string
  preferred_lang:  AppLanguage
  is_admin:        boolean
  created_at:      string
  updated_at:      string
}

export interface UniversityRow {
  id:               string
  name_ru:          string
  name_uz:          string
  name_en:          string
  country:          'SA' | 'AE'
  city?:            string
  logo_url?:        string
  website_url?:     string
  description_ru?:  string
  description_uz?:  string
  description_en?:  string
  programs:         string[]
  is_active:        boolean
  rank:             number
  created_at:       string
}

export interface ApplicationRow {
  id:              string
  user_id:         string
  university_id?:  string
  university_name?: string
  country:         'SA' | 'AE'
  program?:        string
  service_package: ServicePackage
  status:          ApplicationStatus
  full_name:       string
  citizenship?:    string
  date_of_birth?:  string
  phone?:          string
  telegram?:       string
  education_level?: string
  notes?:          string
  submitted_at?:   string
  completed_at?:   string
  created_at:      string
  updated_at:      string
}

export interface DocumentRow {
  id:             string
  application_id: string
  user_id:        string
  type:           DocumentType
  file_name:      string
  file_path:      string
  file_size?:     number
  mime_type?:     string
  is_verified:    boolean
  verified_at?:   string
  created_at:     string
}

export interface PaymentRow {
  id:                    string
  application_id:        string
  user_id:               string
  stripe_payment_intent?: string
  stripe_session_id?:    string
  cis_transaction_id?:   string
  amount:                number
  currency:              string
  method:                PaymentMethod
  status:                PaymentStatus
  package:               ServicePackage
  paid_at?:              string
  created_at:            string
}

export interface MessageRow {
  id:             string
  application_id: string
  user_id:        string
  sender:         MessageSender
  content:        string
  is_read:        boolean
  read_at?:       string
  created_at:     string
}

export interface StatusHistoryRow {
  id:             string
  application_id: string
  changed_by?:    string
  old_status?:    ApplicationStatus
  new_status:     ApplicationStatus
  note?:          string
  created_at:     string
}

// ──────────────────────────────────────────
// Service package config
// ──────────────────────────────────────────
export const PACKAGES: Record<ServicePackage, {
  priceUSD:    number
  priceId?:    string          // Stripe price ID from env
  name_ru:     string
  name_en:     string
  name_uz:     string
  features_ru: string[]
  features_en: string[]
}> = {
  SUBMISSION: {
    priceUSD:    29,
    name_ru:     'Подача документов',
    name_en:     'Submission Only',
    name_uz:     'Hujjat topshirish',
    features_ru: ['Подача документов в 1 университет', 'Онлайн статус-трекер', 'Базовая поддержка'],
    features_en: ['Submit to 1 university', 'Online status tracker', 'Basic support'],
  },
  STANDARD: {
    priceUSD:    69,
    name_ru:     'Стандарт',
    name_en:     'Standard',
    name_uz:     'Standart',
    features_ru: ['Подача в до 3 университетов', 'Перевод документов', 'Проверка пакета', 'Поддержка 24/7'],
    features_en: ['Submit to up to 3 universities', 'Document translation', 'Package review', '24/7 support'],
  },
  VIP: {
    priceUSD:    99,
    name_ru:     'VIP Быстрый трек',
    name_en:     'VIP Fast Track',
    name_uz:     'VIP Tezkor',
    features_ru: ['Неограниченные университеты', 'Приоритетная обработка', 'Персональный куратор', 'Telegram-поддержка', 'Всё включено'],
    features_en: ['Unlimited universities', 'Priority processing', 'Personal manager', 'Telegram support', 'All inclusive'],
  },
}

export const STATUS_LABELS: Record<ApplicationStatus, { ru: string; en: string; uz: string }> = {
  REGISTERED:   { ru: 'Зарегистрировано',   en: 'Registered',    uz: 'Ro\'yxatdan o\'tdi' },
  PAID:         { ru: 'Оплачено',            en: 'Paid',          uz: 'To\'landi' },
  IN_PROGRESS:  { ru: 'В обработке',         en: 'In Progress',   uz: 'Jarayonda' },
  UNDER_REVIEW: { ru: 'На проверке',         en: 'Under Review',  uz: 'Ko\'rib chiqilmoqda' },
  SUBMITTED:    { ru: 'Подано',              en: 'Submitted',     uz: 'Topshirildi' },
  COMPLETED:    { ru: 'Завершено',           en: 'Completed',     uz: 'Yakunlandi' },
  REJECTED:     { ru: 'Отклонено',           en: 'Rejected',      uz: 'Rad etildi' },
}

export const DOCUMENT_LABELS: Record<DocumentType, { ru: string; en: string }> = {
  PASSPORT:        { ru: 'Паспорт',          en: 'Passport' },
  PHOTO:           { ru: 'Фото 3×4',         en: 'Photo 3×4' },
  DIPLOMA:         { ru: 'Диплом/Аттестат',  en: 'Diploma/Certificate' },
  TRANSCRIPT:      { ru: 'Транскрипт',       en: 'Transcript' },
  IELTS:           { ru: 'IELTS/TOEFL',      en: 'IELTS/TOEFL' },
  ARABIC_CERT:     { ru: 'Сертификат по арабскому', en: 'Arabic Certificate' },
  RECOMMENDATION:  { ru: 'Рекомендательное письмо', en: 'Recommendation Letter' },
  MEDICAL:         { ru: 'Медицинская справка', en: 'Medical Certificate' },
  CRIMINAL_RECORD: { ru: 'Справка о несудимости', en: 'Criminal Record' },
  OTHER:           { ru: 'Другое',            en: 'Other' },
}
