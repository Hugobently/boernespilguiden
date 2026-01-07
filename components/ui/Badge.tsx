'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef, type ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

type BadgeVariant = 'solid' | 'soft' | 'outline' | 'dot';
type BadgeColor =
  | 'neutral'
  | 'coral'
  | 'mint'
  | 'sky'
  | 'sunflower'
  | 'lavender'
  | 'success'
  | 'warning'
  | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  icon?: ReactNode;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

// ============================================================================
// STYLES
// ============================================================================

// Pre-computed Tailwind classes for each variant/color combo
const variantColorStyles: Record<BadgeVariant, Record<BadgeColor, string>> = {
  solid: {
    neutral: 'bg-[#7A7A7A] text-white',
    coral: 'bg-[#FFB5A7] text-[#6B3A2E]',
    mint: 'bg-[#B8E0D2] text-[#2D6A4F]',
    sky: 'bg-[#A2D2FF] text-[#1D4E89]',
    sunflower: 'bg-[#FFE66D] text-[#7D6608]',
    lavender: 'bg-[#CDB4DB] text-[#5B4670]',
    success: 'bg-[#77DD77] text-[#1B5E20]',
    warning: 'bg-[#FFD97D] text-[#8B6914]',
    error: 'bg-[#FF9AA2] text-[#8B2635]',
  },
  soft: {
    neutral: 'bg-[#F5F5F5] text-[#4A4A4A]',
    coral: 'bg-[#FFB5A7]/20 text-[#B4564A]',
    mint: 'bg-[#B8E0D2]/20 text-[#2D6A4F]',
    sky: 'bg-[#A2D2FF]/20 text-[#1D4E89]',
    sunflower: 'bg-[#FFE66D]/20 text-[#8B7300]',
    lavender: 'bg-[#CDB4DB]/20 text-[#5B4670]',
    success: 'bg-[#77DD77]/20 text-[#1B5E20]',
    warning: 'bg-[#FFD97D]/20 text-[#8B6914]',
    error: 'bg-[#FF9AA2]/20 text-[#8B2635]',
  },
  outline: {
    neutral: 'bg-transparent border-2 border-[#E0E0E0] text-[#4A4A4A]',
    coral: 'bg-transparent border-2 border-[#FFB5A7] text-[#B4564A]',
    mint: 'bg-transparent border-2 border-[#B8E0D2] text-[#2D6A4F]',
    sky: 'bg-transparent border-2 border-[#A2D2FF] text-[#1D4E89]',
    sunflower: 'bg-transparent border-2 border-[#FFE66D] text-[#8B7300]',
    lavender: 'bg-transparent border-2 border-[#CDB4DB] text-[#5B4670]',
    success: 'bg-transparent border-2 border-[#77DD77] text-[#1B5E20]',
    warning: 'bg-transparent border-2 border-[#FFD97D] text-[#8B6914]',
    error: 'bg-transparent border-2 border-[#FF9AA2] text-[#8B2635]',
  },
  dot: {
    neutral: 'bg-[#FFFCF7] text-[#4A4A4A]',
    coral: 'bg-[#FFFCF7] text-[#4A4A4A]',
    mint: 'bg-[#FFFCF7] text-[#4A4A4A]',
    sky: 'bg-[#FFFCF7] text-[#4A4A4A]',
    sunflower: 'bg-[#FFFCF7] text-[#4A4A4A]',
    lavender: 'bg-[#FFFCF7] text-[#4A4A4A]',
    success: 'bg-[#FFFCF7] text-[#4A4A4A]',
    warning: 'bg-[#FFFCF7] text-[#4A4A4A]',
    error: 'bg-[#FFFCF7] text-[#4A4A4A]',
  },
};

const dotColorStyles: Record<BadgeColor, string> = {
  neutral: 'bg-[#7A7A7A]',
  coral: 'bg-[#FFB5A7]',
  mint: 'bg-[#B8E0D2]',
  sky: 'bg-[#A2D2FF]',
  sunflower: 'bg-[#FFE66D]',
  lavender: 'bg-[#CDB4DB]',
  success: 'bg-[#77DD77]',
  warning: 'bg-[#FFD97D]',
  error: 'bg-[#FF9AA2]',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

// ============================================================================
// BADGE COMPONENT
// ============================================================================

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'soft',
      color = 'neutral',
      size = 'md',
      icon,
      dot = false,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    const showDot = variant === 'dot' || dot;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium',
          'transition-all duration-200',
          variantColorStyles[variant][color],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* Dot indicator */}
        {showDot && (
          <span
            className={cn(
              'w-2 h-2 rounded-full animate-pulse',
              dotColorStyles[color]
            )}
          />
        )}

        {/* Icon */}
        {icon && !showDot && (
          <span className="flex-shrink-0 -ml-0.5">{icon}</span>
        )}

        {/* Content */}
        {children}

        {/* Remove button */}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className={cn(
              'flex-shrink-0 -mr-1 ml-0.5 p-0.5 rounded-full',
              'hover:bg-black/10 transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-current'
            )}
            aria-label="Fjern"
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ============================================================================
// SPECIALIZED BADGE VARIANTS
// ============================================================================

// Age badge with emoji
interface AgeBadgeProps extends Omit<BadgeProps, 'color' | 'children'> {
  ageGroup: '0-3' | '3-6' | '7+';
}

const ageGroupConfig = {
  '0-3': { label: '0-3 år', emoji: '👶', color: 'coral' as BadgeColor },
  '3-6': { label: '3-6 år', emoji: '🧒', color: 'mint' as BadgeColor },
  '7+': { label: '7+ år', emoji: '👦', color: 'sky' as BadgeColor },
};

export const AgeBadge = forwardRef<HTMLSpanElement, AgeBadgeProps>(
  ({ ageGroup, variant = 'soft', ...props }, ref) => {
    const config = ageGroupConfig[ageGroup];
    return (
      <Badge ref={ref} variant={variant} color={config.color} {...props}>
        <span>{config.emoji}</span>
        <span>{config.label}</span>
      </Badge>
    );
  }
);
AgeBadge.displayName = 'AgeBadge';

// Category badge
interface CategoryBadgeProps extends Omit<BadgeProps, 'children'> {
  category: string;
}

export const CategoryBadge = forwardRef<HTMLSpanElement, CategoryBadgeProps>(
  ({ category, variant = 'soft', color = 'coral', ...props }, ref) => {
    return (
      <Badge ref={ref} variant={variant} color={color} {...props}>
        {category}
      </Badge>
    );
  }
);
CategoryBadge.displayName = 'CategoryBadge';

// Feature badge (e.g., "No ads", "Offline")
interface FeatureBadgeProps extends Omit<BadgeProps, 'children'> {
  feature: 'noAds' | 'offline' | 'free' | 'editorChoice' | 'noIAP';
}

const featureConfig = {
  noAds: { label: 'Ingen reklamer', icon: '🚫', color: 'mint' as BadgeColor },
  offline: { label: 'Virker offline', icon: '📴', color: 'sky' as BadgeColor },
  free: { label: 'Gratis', icon: '🆓', color: 'sunflower' as BadgeColor },
  editorChoice: { label: 'Anbefalet', icon: '⭐', color: 'coral' as BadgeColor },
  noIAP: { label: 'Ingen køb', icon: '💰', color: 'lavender' as BadgeColor },
};

export const FeatureBadge = forwardRef<HTMLSpanElement, FeatureBadgeProps>(
  ({ feature, variant = 'soft', ...props }, ref) => {
    const config = featureConfig[feature];
    return (
      <Badge ref={ref} variant={variant} color={config.color} {...props}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </Badge>
    );
  }
);
FeatureBadge.displayName = 'FeatureBadge';

export default Badge;
