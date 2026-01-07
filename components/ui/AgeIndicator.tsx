'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef, useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

type AgeGroup = '0-3' | '3-6' | '7-10' | '11-15';
type IndicatorVariant = 'badge' | 'pill' | 'circle' | 'block' | 'minimal';
type IndicatorSize = 'sm' | 'md' | 'lg' | 'xl';

interface AgeIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  ageGroup: AgeGroup;
  variant?: IndicatorVariant;
  size?: IndicatorSize;
  showEmoji?: boolean;
  showLabel?: boolean;
  showDescription?: boolean;
  animated?: boolean;
}

// ============================================================================
// AGE GROUP CONFIGURATIONS
// ============================================================================

const ageGroupConfig: Record<
  AgeGroup,
  {
    label: string;
    shortLabel: string;
    emoji: string;
    description: string;
    color: {
      bg: string;
      bgLight: string;
      text: string;
      border: string;
      gradient: string;
    };
    character: string; // SVG character representing the age group
  }
> = {
  '0-3': {
    label: '0-3 år',
    shortLabel: 'Baby',
    emoji: '👶',
    description: 'For de allermindste',
    color: {
      bg: '#FFD1DC',
      bgLight: '#FFF0F3',
      text: '#8B4563',
      border: '#FFB6C1',
      gradient: 'from-[#FFD1DC] to-[#FFECF0]',
    },
    character: 'baby',
  },
  '3-6': {
    label: '3-6 år',
    shortLabel: 'Småbørn',
    emoji: '🧒',
    description: 'Leg og læring',
    color: {
      bg: '#BAFFC9',
      bgLight: '#E8FFF0',
      text: '#2D6A4F',
      border: '#95D5A6',
      gradient: 'from-[#BAFFC9] to-[#E8FFF0]',
    },
    character: 'toddler',
  },
  '7-10': {
    label: '7-10 år',
    shortLabel: 'Børn',
    emoji: '👦',
    description: 'Udfordrende spil',
    color: {
      bg: '#BAE1FF',
      bgLight: '#E8F4FF',
      text: '#1D4E89',
      border: '#8ECAE6',
      gradient: 'from-[#BAE1FF] to-[#E8F4FF]',
    },
    character: 'child',
  },
  '11-15': {
    label: '11-15 år',
    shortLabel: 'Tweens',
    emoji: '🧑',
    description: 'Avancerede spil',
    color: {
      bg: '#E2C2FF',
      bgLight: '#F5EEFF',
      text: '#5B4670',
      border: '#CDB4DB',
      gradient: 'from-[#E2C2FF] to-[#F5EEFF]',
    },
    character: 'tween',
  },
};

// ============================================================================
// SIZE CONFIGURATIONS
// ============================================================================

const sizeConfig: Record<
  IndicatorSize,
  {
    container: string;
    icon: string;
    text: string;
    emoji: string;
    padding: string;
    circle: string;
  }
> = {
  sm: {
    container: 'min-h-[28px]',
    icon: 'w-4 h-4',
    text: 'text-xs',
    emoji: 'text-sm',
    padding: 'px-2 py-1',
    circle: 'w-8 h-8',
  },
  md: {
    container: 'min-h-[36px]',
    icon: 'w-5 h-5',
    text: 'text-sm',
    emoji: 'text-base',
    padding: 'px-3 py-1.5',
    circle: 'w-10 h-10',
  },
  lg: {
    container: 'min-h-[44px]',
    icon: 'w-6 h-6',
    text: 'text-base',
    emoji: 'text-lg',
    padding: 'px-4 py-2',
    circle: 'w-12 h-12',
  },
  xl: {
    container: 'min-h-[56px]',
    icon: 'w-8 h-8',
    text: 'text-lg',
    emoji: 'text-2xl',
    padding: 'px-5 py-3',
    circle: 'w-16 h-16',
  },
};

// ============================================================================
// PLAYFUL CHARACTER ILLUSTRATIONS
// ============================================================================

function AgeCharacter({
  ageGroup,
  className,
}: {
  ageGroup: AgeGroup;
  className?: string;
}) {
  const config = ageGroupConfig[ageGroup];

  // Simple, cute SVG characters for each age group
  switch (config.character) {
    case 'baby':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          {/* Head */}
          <circle cx="20" cy="18" r="12" fill="#FFE4C9" />
          {/* Cheeks */}
          <circle cx="13" cy="20" r="2" fill="#FFD1DC" opacity="0.6" />
          <circle cx="27" cy="20" r="2" fill="#FFD1DC" opacity="0.6" />
          {/* Eyes */}
          <circle cx="16" cy="17" r="2" fill="#4A4A4A" />
          <circle cx="24" cy="17" r="2" fill="#4A4A4A" />
          {/* Eye shine */}
          <circle cx="16.5" cy="16.5" r="0.8" fill="white" />
          <circle cx="24.5" cy="16.5" r="0.8" fill="white" />
          {/* Smile */}
          <path
            d="M17 22C18 23.5 22 23.5 23 22"
            stroke="#4A4A4A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Hair tuft */}
          <path
            d="M18 7C19 5 21 5 22 7"
            stroke="#8B6914"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Pacifier */}
          <ellipse cx="20" cy="26" rx="3" ry="2" fill={config.color.bg} />
          <circle cx="20" cy="26" r="1.5" fill={config.color.border} />
        </svg>
      );

    case 'toddler':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          {/* Head */}
          <circle cx="20" cy="16" r="11" fill="#FFE4C9" />
          {/* Hair */}
          <path
            d="M12 12C11 8 15 5 20 5C25 5 29 8 28 12"
            fill="#8B6914"
          />
          <ellipse cx="14" cy="10" rx="3" ry="2" fill="#8B6914" />
          <ellipse cx="26" cy="10" rx="3" ry="2" fill="#8B6914" />
          {/* Eyes */}
          <circle cx="16" cy="15" r="2.5" fill="#4A4A4A" />
          <circle cx="24" cy="15" r="2.5" fill="#4A4A4A" />
          <circle cx="16.5" cy="14.5" r="1" fill="white" />
          <circle cx="24.5" cy="14.5" r="1" fill="white" />
          {/* Cheeks */}
          <circle cx="12" cy="18" r="2" fill="#BAFFC9" opacity="0.5" />
          <circle cx="28" cy="18" r="2" fill="#BAFFC9" opacity="0.5" />
          {/* Happy mouth */}
          <path
            d="M16 21C17 23 23 23 24 21"
            stroke="#4A4A4A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Body hint */}
          <path
            d="M14 27C14 27 17 32 20 32C23 32 26 27 26 27"
            fill={config.color.bg}
          />
        </svg>
      );

    case 'child':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          {/* Head */}
          <circle cx="20" cy="15" r="10" fill="#FFE4C9" />
          {/* Hair */}
          <path
            d="M10 13C10 7 14 4 20 4C26 4 30 7 30 13C30 13 28 10 20 10C12 10 10 13 10 13Z"
            fill="#5D4E37"
          />
          {/* Cap */}
          <path
            d="M12 11C12 8 15 6 20 6C25 6 28 8 28 11L30 12L10 12L12 11Z"
            fill={config.color.bg}
          />
          <rect x="10" y="11" width="20" height="3" rx="1" fill={config.color.border} />
          {/* Eyes */}
          <circle cx="16" cy="14" r="2" fill="#4A4A4A" />
          <circle cx="24" cy="14" r="2" fill="#4A4A4A" />
          <circle cx="16.5" cy="13.5" r="0.8" fill="white" />
          <circle cx="24.5" cy="13.5" r="0.8" fill="white" />
          {/* Confident smile */}
          <path
            d="M16 19C17 21 23 21 24 19"
            stroke="#4A4A4A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Body */}
          <path
            d="M14 25L13 35H17L18 28H22L23 35H27L26 25C26 25 24 24 20 24C16 24 14 25 14 25Z"
            fill={config.color.bg}
          />
        </svg>
      );

    case 'tween':
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          {/* Head */}
          <circle cx="20" cy="14" r="10" fill="#FFE4C9" />
          {/* Hair */}
          <path
            d="M10 12C10 6 14 3 20 3C26 3 30 6 30 12C30 14 28 13 26 13C24 13 22 14 20 14C18 14 16 13 14 13C12 13 10 14 10 12Z"
            fill="#3D3D3D"
          />
          {/* Cool hair streak */}
          <path
            d="M22 5C23 4 25 5 24 8"
            stroke={config.color.bg}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Eyes (slightly cooler expression) */}
          <ellipse cx="16" cy="13" rx="2" ry="1.8" fill="#4A4A4A" />
          <ellipse cx="24" cy="13" rx="2" ry="1.8" fill="#4A4A4A" />
          <circle cx="16.5" cy="12.5" r="0.8" fill="white" />
          <circle cx="24.5" cy="12.5" r="0.8" fill="white" />
          {/* Slight smirk */}
          <path
            d="M17 18C18 19 22 19.5 24 18"
            stroke="#4A4A4A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Headphones */}
          <path
            d="M8 14C7 14 6 12 6 10C6 6 8 4 10 4"
            stroke={config.color.border}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M32 14C33 14 34 12 34 10C34 6 32 4 30 4"
            stroke={config.color.border}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="5" y="12" width="5" height="6" rx="2" fill={config.color.bg} />
          <rect x="30" y="12" width="5" height="6" rx="2" fill={config.color.bg} />
          {/* Hoodie */}
          <path
            d="M12 24C12 24 15 23 20 23C25 23 28 24 28 24L30 35H10L12 24Z"
            fill={config.color.bg}
          />
          <path d="M18 24V30" stroke={config.color.border} strokeWidth="1" />
          <path d="M22 24V30" stroke={config.color.border} strokeWidth="1" />
        </svg>
      );

    default:
      return null;
  }
}

// ============================================================================
// AGE INDICATOR COMPONENT
// ============================================================================

export const AgeIndicator = forwardRef<HTMLDivElement, AgeIndicatorProps>(
  (
    {
      className,
      ageGroup,
      variant = 'badge',
      size = 'md',
      showEmoji = true,
      showLabel = true,
      showDescription = false,
      animated = true,
      ...props
    },
    ref
  ) => {
    const config = ageGroupConfig[ageGroup];
    const sizeStyles = sizeConfig[size];

    // Variant-specific styles
    const variantStyles = useMemo(() => {
      switch (variant) {
        case 'pill':
          return cn(
            'inline-flex items-center gap-2 rounded-full font-medium',
            `bg-gradient-to-r ${config.color.gradient}`,
            `text-[${config.color.text}]`,
            sizeStyles.padding,
            animated && 'hover:scale-105 transition-transform'
          );

        case 'circle':
          return cn(
            'inline-flex items-center justify-center rounded-full font-bold',
            `bg-[${config.color.bg}]`,
            `text-[${config.color.text}]`,
            `border-2 border-[${config.color.border}]`,
            sizeStyles.circle,
            animated && 'hover:rotate-12 transition-transform'
          );

        case 'block':
          return cn(
            'flex flex-col items-center gap-2 rounded-2xl p-4',
            `bg-gradient-to-br ${config.color.gradient}`,
            `text-[${config.color.text}]`,
            `border-2 border-[${config.color.border}]/30`,
            animated && 'hover:-translate-y-1 hover:shadow-lg transition-all'
          );

        case 'minimal':
          return cn(
            'inline-flex items-center gap-1.5',
            `text-[${config.color.text}]`,
            sizeStyles.text
          );

        case 'badge':
        default:
          return cn(
            'inline-flex items-center gap-2 rounded-xl font-medium',
            `bg-[${config.color.bgLight}]`,
            `text-[${config.color.text}]`,
            `border border-[${config.color.border}]/30`,
            sizeStyles.padding,
            sizeStyles.container,
            animated && 'hover:scale-105 transition-transform'
          );
      }
    }, [variant, config, sizeStyles, animated]);

    // For circle variant, show only emoji or short label
    if (variant === 'circle') {
      return (
        <div ref={ref} className={cn(variantStyles, className)} {...props}>
          {showEmoji ? (
            <span className={sizeStyles.emoji}>{config.emoji}</span>
          ) : (
            <span className={sizeStyles.text}>{config.shortLabel}</span>
          )}
        </div>
      );
    }

    // For block variant, show character illustration
    if (variant === 'block') {
      return (
        <div ref={ref} className={cn(variantStyles, className)} {...props}>
          <AgeCharacter ageGroup={ageGroup} className="w-16 h-16" />
          <div className="text-center">
            <div className="font-bold">{config.label}</div>
            {showDescription && (
              <div className="text-sm opacity-80">{config.description}</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(variantStyles, className)} {...props}>
        {showEmoji && <span className={sizeStyles.emoji}>{config.emoji}</span>}
        {showLabel && <span className={sizeStyles.text}>{config.label}</span>}
        {showDescription && variant !== 'minimal' && (
          <span className={cn(sizeStyles.text, 'opacity-70')}>
            - {config.description}
          </span>
        )}
      </div>
    );
  }
);

AgeIndicator.displayName = 'AgeIndicator';

// ============================================================================
// AGE SELECTOR - For filter UI
// ============================================================================

interface AgeSelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: AgeGroup | null;
  onChange?: (ageGroup: AgeGroup | null) => void;
  allowClear?: boolean;
  size?: IndicatorSize;
}

export const AgeSelector = forwardRef<HTMLDivElement, AgeSelectorProps>(
  (
    { className, value, onChange, allowClear = true, size = 'md', ...props },
    ref
  ) => {
    const ageGroups: AgeGroup[] = ['0-3', '3-6', '7-10', '11-15'];

    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-2', className)}
        role="radiogroup"
        aria-label="Vælg aldersgruppe"
        {...props}
      >
        {ageGroups.map((age) => {
          const config = ageGroupConfig[age];
          const isSelected = value === age;

          return (
            <button
              key={age}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                if (isSelected && allowClear) {
                  onChange?.(null);
                } else {
                  onChange?.(age);
                }
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl font-medium transition-all',
                sizeConfig[size].padding,
                isSelected
                  ? `bg-[${config.color.bg}] text-[${config.color.text}] shadow-md scale-105`
                  : `bg-[${config.color.bgLight}] text-[${config.color.text}] hover:bg-[${config.color.bg}]/50`,
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                `focus-visible:ring-[${config.color.border}]`
              )}
            >
              <span>{config.emoji}</span>
              <span className={sizeConfig[size].text}>{config.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);

AgeSelector.displayName = 'AgeSelector';

// ============================================================================
// AGE RANGE DISPLAY - Visual range representation
// ============================================================================

interface AgeRangeProps extends HTMLAttributes<HTMLDivElement> {
  minAge: number;
  maxAge: number;
  showLabels?: boolean;
}

export const AgeRange = forwardRef<HTMLDivElement, AgeRangeProps>(
  ({ className, minAge, maxAge, showLabels = true, ...props }, ref) => {
    // Determine which age groups this range covers
    const getAgeGroupsInRange = (min: number, max: number): AgeGroup[] => {
      const groups: AgeGroup[] = [];
      if (min <= 3) groups.push('0-3');
      if ((min <= 6 && max >= 3) || (max >= 3 && max <= 6)) groups.push('3-6');
      if ((min <= 10 && max >= 7) || (max >= 7 && max <= 10)) groups.push('7-10');
      if (max >= 11) groups.push('11-15');
      return groups;
    };

    const coveredGroups = getAgeGroupsInRange(minAge, maxAge);

    return (
      <div ref={ref} className={cn('flex items-center gap-1', className)} {...props}>
        {showLabels && (
          <span className="text-sm text-[#7A7A7A] mr-2">
            {minAge === maxAge ? `${minAge} år` : `${minAge}-${maxAge} år`}
          </span>
        )}
        <div className="flex gap-1">
          {(['0-3', '3-6', '7-10', '11-15'] as AgeGroup[]).map((age) => {
            const config = ageGroupConfig[age];
            const isInRange = coveredGroups.includes(age);

            return (
              <div
                key={age}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  isInRange ? `bg-[${config.color.bg}]` : 'bg-gray-200'
                )}
                title={config.label}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

AgeRange.displayName = 'AgeRange';

export default AgeIndicator;
