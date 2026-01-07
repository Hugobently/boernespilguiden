/**
 * Børnespilguiden Design System
 *
 * A soft, playful design system for a Danish children's game guide.
 * Features pastel colors, rounded forms, and bouncy micro-animations.
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary pastel palette - soft and inviting
  primary: {
    coral: '#FFB5A7',      // Soft coral/peach - main accent
    coralLight: '#FCD5CE', // Lighter coral for backgrounds
    coralDark: '#F8A99B',  // Slightly darker for hover states
  },

  mint: {
    DEFAULT: '#B8E0D2',    // Fresh mint green
    light: '#D8F3DC',      // Very light mint
    dark: '#95D5B2',       // Deeper mint for contrast
  },

  sky: {
    DEFAULT: '#A2D2FF',    // Soft sky blue
    light: '#CAF0F8',      // Pale sky
    dark: '#72B4E8',       // Deeper sky
  },

  sunflower: {
    DEFAULT: '#FFE66D',    // Warm sunflower yellow
    light: '#FFF3B0',      // Pale yellow
    dark: '#FFD93D',       // Golden yellow
  },

  lavender: {
    DEFAULT: '#CDB4DB',    // Soft lavender purple
    light: '#E2D1F0',      // Very pale lavender
    dark: '#B392C9',       // Deeper lavender
  },

  // Background colors - warm and cozy
  background: {
    cream: '#FFF9F0',      // Main background - warm off-white
    paper: '#FFFCF7',      // Slightly lighter for cards
    peach: '#FFF0E8',      // Peachy background variant
    mist: '#F5F9FC',       // Cool mist for contrast sections
  },

  // Text colors
  text: {
    primary: '#4A4A4A',    // Soft charcoal - easier on young eyes
    secondary: '#7A7A7A',  // Muted gray
    muted: '#9CA3AF',      // Very muted
    inverse: '#FFFFFF',    // White text on dark backgrounds
  },

  // Semantic colors
  semantic: {
    success: '#77DD77',    // Pastel green
    warning: '#FFD97D',    // Pastel amber
    error: '#FF9AA2',      // Pastel red/pink
    info: '#A0D2DB',       // Pastel teal
  },

  // Age group colors - distinctive but harmonious
  age: {
    baby: '#FFD1DC',       // 0-3 år - soft pink
    toddler: '#BAFFC9',    // 3-6 år - soft green
    child: '#BAE1FF',      // 7-10 år - soft blue
    tween: '#E2C2FF',      // 11-15 år - soft purple
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fonts: {
    display: "'Nunito', 'Quicksand', system-ui, sans-serif",
    body: "'Nunito', system-ui, sans-serif",
  },

  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

// ============================================================================
// SPACING & SIZING
// ============================================================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.5rem',     // 8px - subtle rounding
  DEFAULT: '1rem',   // 16px - standard playful rounding
  md: '1rem',        // 16px
  lg: '1.25rem',     // 20px
  xl: '1.5rem',      // 24px - maximum playfulness
  '2xl': '2rem',     // 32px - extra round
  full: '9999px',    // Fully round (pills, circles)
  blob: '30% 70% 70% 30% / 30% 30% 70% 70%',
  blob2: '60% 40% 30% 70% / 60% 30% 70% 40%',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  // Soft, diffused shadows for that cozy feel
  none: 'none',
  sm: '0 2px 8px -2px rgba(0, 0, 0, 0.06)',
  DEFAULT: '0 4px 16px -4px rgba(0, 0, 0, 0.08)',
  md: '0 6px 20px -6px rgba(0, 0, 0, 0.1)',
  lg: '0 8px 30px -8px rgba(0, 0, 0, 0.12)',
  xl: '0 12px 40px -12px rgba(0, 0, 0, 0.15)',

  // Colored shadows for playful depth
  coral: '0 8px 24px -8px rgba(255, 181, 167, 0.4)',
  mint: '0 8px 24px -8px rgba(184, 224, 210, 0.4)',
  sky: '0 8px 24px -8px rgba(162, 210, 255, 0.4)',
  sunflower: '0 8px 24px -8px rgba(255, 230, 109, 0.4)',
  lavender: '0 8px 24px -8px rgba(205, 180, 219, 0.4)',

  // Interactive shadows
  button: '0 4px 0 0 rgba(0, 0, 0, 0.08), 0 6px 16px -4px rgba(0, 0, 0, 0.12)',
  buttonHover: '0 6px 0 0 rgba(0, 0, 0, 0.1), 0 10px 24px -6px rgba(0, 0, 0, 0.15)',
  buttonPressed: '0 2px 0 0 rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.1)',

  // Card shadows
  card: '0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 4px 24px -4px rgba(0, 0, 0, 0.04)',
  cardHover: '0 8px 24px -4px rgba(0, 0, 0, 0.1), 0 16px 48px -8px rgba(0, 0, 0, 0.06)',

  // Inner glow effect
  innerGlow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)',
} as const;

// ============================================================================
// ANIMATIONS & TRANSITIONS
// ============================================================================

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  medium: '300ms ease',
  slow: '500ms ease',
  bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  elastic: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const animations = {
  // Keyframe definitions (to be used in CSS)
  keyframes: {
    bounce: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-8px)' },
    },
    wiggle: {
      '0%, 100%': { transform: 'rotate(-2deg)' },
      '50%': { transform: 'rotate(2deg)' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-6px)' },
    },
    pulse: {
      '0%, 100%': { transform: 'scale(1)', opacity: '1' },
      '50%': { transform: 'scale(1.05)', opacity: '0.9' },
    },
    pop: {
      '0%': { transform: 'scale(0.95)', opacity: '0' },
      '70%': { transform: 'scale(1.02)' },
      '100%': { transform: 'scale(1)', opacity: '1' },
    },
    slideUp: {
      '0%': { transform: 'translateY(16px)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    fadeIn: {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '25%': { transform: 'translateX(-4px)' },
      '75%': { transform: 'translateX(4px)' },
    },
    sparkle: {
      '0%, 100%': { opacity: '1', transform: 'scale(1)' },
      '50%': { opacity: '0.6', transform: 'scale(0.8)' },
    },
  },

  // Animation presets
  presets: {
    bounceIn: 'pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    floatSlow: 'float 3s ease-in-out infinite',
    wiggleOnHover: 'wiggle 400ms ease-in-out',
    pulseSubtle: 'pulse 2s ease-in-out infinite',
    fadeInUp: 'slideUp 400ms ease-out',
  },
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const components = {
  button: {
    sizes: {
      sm: { px: '1rem', py: '0.5rem', fontSize: '0.875rem' },
      md: { px: '1.5rem', py: '0.75rem', fontSize: '1rem' },
      lg: { px: '2rem', py: '1rem', fontSize: '1.125rem' },
      xl: { px: '2.5rem', py: '1.25rem', fontSize: '1.25rem' },
    },
    borderRadius: '1rem',
  },

  card: {
    borderRadius: '1.25rem',
    padding: '1.5rem',
  },

  badge: {
    borderRadius: '9999px',
    padding: { x: '0.75rem', y: '0.25rem' },
  },

  input: {
    borderRadius: '0.75rem',
    padding: { x: '1rem', y: '0.75rem' },
  },
} as const;

// ============================================================================
// AGE GROUP CONFIGURATION
// ============================================================================

export const ageGroups = {
  '0-3': {
    label: '0-3 år',
    shortLabel: 'Baby',
    color: colors.age.baby,
    emoji: '👶',
    description: 'For de allermindste',
  },
  '3-6': {
    label: '3-6 år',
    shortLabel: 'Småbørn',
    color: colors.age.toddler,
    emoji: '🧒',
    description: 'Leg og læring',
  },
  '7-10': {
    label: '7-10 år',
    shortLabel: 'Børn',
    color: colors.age.child,
    emoji: '👦',
    description: 'Udfordrende spil',
  },
  '11-15': {
    label: '11-15 år',
    shortLabel: 'Tweens',
    color: colors.age.tween,
    emoji: '🧑',
    description: 'Avancerede spil',
  },
} as const;

// ============================================================================
// THEME EXPORT
// ============================================================================

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  animations,
  zIndex,
  breakpoints,
  components,
  ageGroups,
} as const;

export default theme;

// Type exports for TypeScript
export type Theme = typeof theme;
export type Colors = typeof colors;
export type AgeGroup = keyof typeof ageGroups;
