export const locales = [
  "en-AU"
] as const

export type Locale = typeof locales[number]

export const defaultLocale: Locale = "en-AU"