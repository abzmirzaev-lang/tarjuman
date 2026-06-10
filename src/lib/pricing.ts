import { PACKAGES } from '@/types'

/**
 * Canonical price config — единственный источник правды.
 * Используется в JSON-LD (layout.tsx), FAQ (faq/page.tsx) и компонентах с ценами.
 * Сами значения берутся из PACKAGES в types/index.ts — менять только там.
 */
export const PRICES = {
  SUBMISSION: PACKAGES.SUBMISSION.priceUSD,  // 39
  STANDARD:   PACKAGES.STANDARD.priceUSD,   // 79
  VIP:        PACKAGES.VIP.priceUSD,        // 99
} as const

/** Форматированные строки вида "$39" для вставки в тексты и schema.org */
export const PRICE_STR = {
  SUBMISSION: `$${PACKAGES.SUBMISSION.priceUSD}`,  // '$39'
  STANDARD:   `$${PACKAGES.STANDARD.priceUSD}`,   // '$79'
  VIP:        `$${PACKAGES.VIP.priceUSD}`,         // '$99'
} as const
