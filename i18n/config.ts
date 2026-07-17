export const locales = ['da'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'da';
