export const locales = ['da', 'en', 'fr', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'da';

export const localeNames: Record<Locale, string> = {
  da: 'Dansk',
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  da: '🇩🇰',
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
};
