// Centralized configuration exports
// Import from '@/lib/config' instead of individual files

export { ageGroups, type AgeGroupConfig } from './age-groups';
export { platformConfig, getPlatformInfo, getAllPlatforms, type PlatformConfig } from './platforms';
export { THEME, getAgeGroupColors, colors, ageGroups as themeAgeGroups, gradients, shadows, radius } from './theme';
