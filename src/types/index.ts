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
  gender?:         string
  marital_status?: string
  arabic_level?:   string
  english_level?:  string
  guardian_name?:      string
  guardian_phone?:     string
  guardian_email?:     string
  selected_faculties?: any[]
  notes?:              string
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
    name_ru:     'Базовый',
    name_en:     'Basic',
    name_uz:     'Asosiy',
    features_ru: ['Подача готовых переведённых документов', 'Поддержка после принятия'],
    features_en: ['Submission of ready translated documents', 'Support after acceptance'],
  },
  STANDARD: {
    priceUSD:    69,
    name_ru:     'Стандарт',
    name_en:     'Standard',
    name_uz:     'Standart',
    features_ru: ['Перевод документов', 'Подача в течение 24 часов', 'Поддержка после принятия'],
    features_en: ['Document translation', 'Submission within 24 hours', 'Support after acceptance'],
  },
  VIP: {
    priceUSD:    99,
    name_ru:     'VIP',
    name_en:     'VIP',
    name_uz:     'VIP',
    features_ru: ['Перевод документов', 'Подача в течение 6 часов', 'Поддержка после принятия', 'Безлимитный чат с менеджером'],
    features_en: ['Document translation', 'Submission within 6 hours', 'Support after acceptance', 'Unlimited chat with manager'],
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
  DIPLOMA:         { ru: 'Диплом/Аттестат + Транскрипт (оценки)',  en: 'Diploma/Certificate + Transcript' },
  TRANSCRIPT:      { ru: 'Транскрипт (дополнительно)',       en: 'Transcript (additional)' },
  IELTS:           { ru: 'IELTS/TOEFL',      en: 'IELTS/TOEFL' },
  ARABIC_CERT:     { ru: 'Сертификат по арабскому', en: 'Arabic Certificate' },
  RECOMMENDATION:  { ru: 'Рекомендательное письмо', en: 'Recommendation Letter' },
  MEDICAL:         { ru: 'Медицинская справка', en: 'Medical Certificate' },
  CRIMINAL_RECORD: { ru: 'Справка о несудимости', en: 'Criminal Record' },
  OTHER:           { ru: 'Другое',            en: 'Other' },
}
