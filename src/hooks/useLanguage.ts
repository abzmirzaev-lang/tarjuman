'use client'
import { useState, useEffect, useCallback } from 'react'
import type { AppLanguage } from '@/types'

const STORAGE_KEY = 'tarjuman_lang'

export function useLanguage(): [AppLanguage, (lang: AppLanguage) => void] {
  const [lang, setLangState] = useState<AppLanguage>('ru')

  // On mount — read from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AppLanguage | null
      if (saved && ['ru', 'uz', 'en'].includes(saved)) {
        setLangState(saved)
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, [])

  const setLang = useCallback((newLang: AppLanguage) => {
    setLangState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
    } catch {
      // ignore
    }
  }, [])

  return [lang, setLang]
}
