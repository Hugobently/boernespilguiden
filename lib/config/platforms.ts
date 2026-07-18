// Platform configuration - shared across components
// This centralizes platform labels and colors to avoid duplication.
// Platforms render as colored dots with a title tooltip (no emoji).

import { Platform } from '@/lib/types';

export interface PlatformConfig {
  label: string;
  color: string;
}

export const platformConfig: Record<Platform, PlatformConfig> = {
  iOS: { label: 'iOS', color: '#007AFF' },
  Android: { label: 'Android', color: '#3DDC84' },
  PC: { label: 'PC', color: '#6B7280' },
  Nintendo: { label: 'Nintendo', color: '#E60012' },
  PlayStation: { label: 'PlayStation', color: '#003791' },
  Xbox: { label: 'Xbox', color: '#107C10' },
  Web: { label: 'Web', color: '#4F46E5' },
};

// Helper to get platform info
export function getPlatformInfo(platform: Platform): PlatformConfig | undefined {
  return platformConfig[platform];
}

// Get all platforms as array
export function getAllPlatforms(): Platform[] {
  return Object.keys(platformConfig) as Platform[];
}
