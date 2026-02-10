// Theme configuration - centralized colors and styles
// Use this instead of hardcoding color values in components

export const THEME = {
  // Primary brand colors
  colors: {
    primary: '#FFB5A7',      // Coral/salmon - main brand color
    primaryHover: '#F8A99B',
    primaryShadow: '#E8958A',

    secondary: '#A2D2FF',    // Light blue
    secondaryHover: '#8ECAE6',

    accent: '#FFE66D',       // Yellow - for stars, highlights

    // Neutrals
    charcoal: '#4A4A4A',     // Main text color
    slate: '#7A7A7A',        // Secondary text
    muted: '#6B7280',        // WCAG AA compliant

    // Backgrounds
    cream: '#FFFDF8',        // Page background
    warmWhite: '#FFFCF7',    // Card background
    warmCream: '#FFF9F0',    // Tag background

    // Status colors
    success: '#2D6A4F',
    successBg: '#D8F3DC',
    error: '#C8102E',
    errorBg: '#FFD1DC',

    // Danish flag
    danishRed: '#C8102E',
  },

  // Age group specific colors (also exported from age-groups.ts)
  ageGroups: {
    '0-3': { bg: '#FFD1DC', bgSelected: '#FFB6C1', text: '#8B4563', border: '#FFB6C1', shadow: '#E89AAB' },
    '3-6': { bg: '#BAFFC9', bgSelected: '#95D5A6', text: '#2D6A4F', border: '#95D5A6', shadow: '#7BC492' },
    '7+':  { bg: '#BAE1FF', bgSelected: '#8ECAE6', text: '#1D4E89', border: '#8ECAE6', shadow: '#6BB3D9' },
  },

  // Gradient presets
  gradients: {
    hero: 'from-[#A2D2FF] via-[#CDB4DB] to-[#FFB5A7]',
    card: 'from-[#A2D2FF] to-[#CDB4DB]',
    featured: 'from-[#FFB5A7] via-[#FFE66D] to-[#B8E0D2]',
  },

  // Shadow presets
  shadows: {
    card: '0_2px_12px_-2px_rgba(0,0,0,0.06)',
    cardHover: '0_8px_24px_-4px_rgba(0,0,0,0.1)',
    button: '0_4px_0_0',
  },

  // Border radius
  radius: {
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    full: '9999px',  // Pill shape
  },
} as const;

// Helper to get age group colors
export function getAgeGroupColors(minAge: number) {
  if (minAge <= 3) return THEME.ageGroups['0-3'];
  if (minAge <= 6) return THEME.ageGroups['3-6'];
  return THEME.ageGroups['7+'];
}

// Export individual color sets for easy access
export const { colors, ageGroups, gradients, shadows, radius } = THEME;
