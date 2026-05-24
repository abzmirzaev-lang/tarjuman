'use client'
import { ru } from './ru'
import { en } from './en'
import { uz } from './uz'
import type { Translation } from './ru'
import type { AppLanguage } from '@/types'

export const translations: Record<AppLanguage, Translation> = { ru, en, uz }

export function useTranslation(lang: AppLanguage = 'ru') {
  return translations[lang] ?? ru
}

export { ru, en, uz }
export type { Translation }
