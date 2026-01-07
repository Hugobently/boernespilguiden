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
  if (age <= 6) return '3-6';
  return '7+';
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

// Age group colors - centralized for consistency across the site
export const AGE_GROUP_COLORS: Record<string, string> = {
  '0-3': '#FFD1DC',  // Pink - babies/toddlers
  '3-6': '#BAFFC9',  // Green - preschool
  '7+': '#BAE1FF',   // Blue - school age
};

export function getAgeGroupColor(minAge: number): string {
  if (minAge <= 3) return AGE_GROUP_COLORS['0-3'];
  if (minAge <= 6) return AGE_GROUP_COLORS['3-6'];
  return AGE_GROUP_COLORS['7+'];
}

export const AGE_CATEGORIES = [
  { slug: '0-3', label: '0-3 år', emoji: '👶', description: 'Baby og småbørn', color: '#FFD1DC' },
  { slug: '3-6', label: '3-6 år', emoji: '🧒', description: 'Førskolebørn', color: '#BAFFC9' },
  { slug: '7+', label: '7+ år', emoji: '🎒', description: 'Skolebørn', color: '#BAE1FF' },
] as const;

// Helper to parse age group string like "3-6" or "7+"
export function parseAgeGroup(ageGroup: string): { minAge: number; maxAge: number } {
  if (ageGroup.endsWith('+')) {
    const minAge = parseInt(ageGroup.slice(0, -1), 10);
    return { minAge, maxAge: 99 };
  }
  const parts = ageGroup.split('-');
  return {
    minAge: parseInt(parts[0], 10) || 0,
    maxAge: parseInt(parts[1], 10) || 99,
  };
}
