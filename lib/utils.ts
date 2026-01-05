import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAgeLabel(minAge: number, maxAge: number): string {
  if (minAge === maxAge) return `${minAge} år`;
  if (maxAge >= 99) return `${minAge}+ år`;
  return `${minAge}-${maxAge} år`;
}

export function getAgeCategory(age: number): string {
  if (age <= 3) return '0-3';
  if (age <= 6) return '4-6';
  if (age <= 9) return '7-9';
  if (age <= 12) return '10-12';
  return '13+';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatPlayTime(time: string | null): string {
  if (!time) return 'Varierer';
  return time;
}

export const AGE_CATEGORIES = [
  { slug: '0-3', label: '0-3 år', emoji: '👶', description: 'De helt små' },
  { slug: '4-6', label: '4-6 år', emoji: '🧒', description: 'Førskolebørn' },
  { slug: '7-9', label: '7-9 år', emoji: '🎒', description: 'Indskoling' },
  { slug: '10-12', label: '10-12 år', emoji: '📚', description: 'Mellemtrin' },
  { slug: '13+', label: '13+ år', emoji: '🎮', description: 'Teenagere' },
] as const;
