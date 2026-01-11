// Platform configuration - shared across components
// This centralizes platform icons and colors to avoid duplication

import { Platform } from '@/lib/types';

export interface PlatformConfig {
  icon: string;
  label: string;
  color: string;
}

export const platformConfig: Record<Platform, PlatformConfig> = {
  iOS: { icon: '🍎', label: 'iOS', color: '#007AFF' },
  Android: { icon: '🤖', label: 'Android', color: '#3DDC84' },
  PC: { icon: '💻', label: 'PC', color: '#6B7280' },
  Nintendo: { icon: '🎮', label: 'Nintendo', color: '#E60012' },
  PlayStation: { icon: '🎯', label: 'PlayStation', color: '#003791' },
  Xbox: { icon: '🟢', label: 'Xbox', color: '#107C10' },
  Web: { icon: '🌐', label: 'Web', color: '#4F46E5' },
};

// Helper to get platform info
export function getPlatformInfo(platform: Platform): PlatformConfig | undefined {
  return platformConfig[platform];
}

// Get all platforms as array
export function getAllPlatforms(): Platform[] {
  return Object.keys(platformConfig) as Platform[];
}
