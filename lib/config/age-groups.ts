// Age group configuration - shared between server and client components
import { AgeGroup } from '@/lib/types';

export interface AgeGroupConfig {
  slug: AgeGroup;
  label: string;
  shortLabel: string;
  emoji: string;
  color: {
    bg: string;
    bgHover: string;
    bgSelected: string;
    text: string;
    border: string;
    shadow: string;
  };
  description: string;
}

export const ageGroups: AgeGroupConfig[] = [
  {
    slug: '0-3',
    label: '0-3 år',
    shortLabel: 'Baby',
    emoji: '👶',
    color: {
      bg: '#FFD1DC',
      bgHover: '#FFBDCC',
      bgSelected: '#FFB6C1',
      text: '#8B4563',
      border: '#FFB6C1',
      shadow: '#E89AAB',
    },
    description: 'Babyer og småbørn',
  },
  {
    slug: '3-6',
    label: '3-6 år',
    shortLabel: 'Småbørn',
    emoji: '🧒',
    color: {
      bg: '#BAFFC9',
      bgHover: '#A5F5B8',
      bgSelected: '#95D5A6',
      text: '#2D6A4F',
      border: '#95D5A6',
      shadow: '#7BC492',
    },
    description: 'Børnehave-alder',
  },
  {
    slug: '7+',
    label: '7+ år',
    shortLabel: 'Større børn',
    emoji: '👦',
    color: {
      bg: '#BAE1FF',
      bgHover: '#A5D4F5',
      bgSelected: '#8ECAE6',
      text: '#1D4E89',
      border: '#8ECAE6',
      shadow: '#6BB3D9',
    },
    description: 'Skolebørn',
  },
];
