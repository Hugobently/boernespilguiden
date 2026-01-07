'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef, useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

type RatingVariant = 'stars' | 'hearts' | 'thumbs' | 'smileys';
type RatingSize = 'sm' | 'md' | 'lg' | 'xl';

interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number;
  max?: number;
  variant?: RatingVariant;
  size?: RatingSize;
  showValue?: boolean;
  showMax?: boolean;
  animated?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

// ============================================================================
// ICON COMPONENTS - Kid-friendly designs
// ============================================================================

// Star icon with rounded, friendly design
function StarIcon({
  filled,
  half,
  className,
}: {
  filled?: boolean;
  half?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE66D" />
          <stop offset="100%" stopColor="#FFD93D" />
        </linearGradient>
        {half && (
          <clipPath id="halfClip">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        )}
      </defs>

      {/* Background star (empty) */}
      <path
        d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.5L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z"
        fill="#E8E8E8"
        stroke="#D0D0D0"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* Filled star */}
      {(filled || half) && (
        <path
          d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.5L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z"
          fill="url(#starGradient)"
          stroke="#FFD93D"
          strokeWidth="0.5"
          strokeLinejoin="round"
          clipPath={half ? 'url(#halfClip)' : undefined}
        />
      )}

      {/* Sparkle effect for filled stars */}
      {filled && (
        <>
          <circle cx="10" cy="7" r="0.8" fill="white" opacity="0.8" />
          <circle cx="8" cy="10" r="0.4" fill="white" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

// Heart icon
function HeartIcon({
  filled,
  half,
  className,
}: {
  filled?: boolean;
  half?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB5A7" />
          <stop offset="100%" stopColor="#F8A99B" />
        </linearGradient>
        {half && (
          <clipPath id="halfHeartClip">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        )}
      </defs>

      {/* Background heart */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#E8E8E8"
        stroke="#D0D0D0"
        strokeWidth="0.5"
      />

      {/* Filled heart */}
      {(filled || half) && (
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#heartGradient)"
          stroke="#F8A99B"
          strokeWidth="0.5"
          clipPath={half ? 'url(#halfHeartClip)' : undefined}
        />
      )}

      {/* Shine effect */}
      {filled && <circle cx="8" cy="8" r="1.5" fill="white" opacity="0.5" />}
    </svg>
  );
}

// Smiley face icon - More kid-appropriate
function SmileyIcon({
  filled,
  className,
}: {
  filled?: boolean;
  half?: boolean;
  className?: string;
}) {
  const faceColor = filled ? '#FFE66D' : '#E8E8E8';
  const strokeColor = filled ? '#FFD93D' : '#D0D0D0';

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Face */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={faceColor}
        stroke={strokeColor}
        strokeWidth="1"
      />

      {/* Eyes */}
      <circle cx="8.5" cy="10" r="1.5" fill={filled ? '#4A4A4A' : '#BBBBBB'} />
      <circle cx="15.5" cy="10" r="1.5" fill={filled ? '#4A4A4A' : '#BBBBBB'} />

      {/* Eye shine */}
      {filled && (
        <>
          <circle cx="9" cy="9.5" r="0.5" fill="white" />
          <circle cx="16" cy="9.5" r="0.5" fill="white" />
        </>
      )}

      {/* Smile */}
      <path
        d="M7 14c1.5 2.5 8 2.5 10 0"
        stroke={filled ? '#4A4A4A' : '#BBBBBB'}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Blush */}
      {filled && (
        <>
          <ellipse cx="6" cy="13" rx="1.5" ry="1" fill="#FFB5A7" opacity="0.5" />
          <ellipse cx="18" cy="13" rx="1.5" ry="1" fill="#FFB5A7" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

// Thumbs up icon
function ThumbIcon({
  filled,
  className,
}: {
  filled?: boolean;
  half?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
        fill={filled ? '#B8E0D2' : '#E8E8E8'}
        stroke={filled ? '#95D5B2' : '#D0D0D0'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================================================
// SIZE CONFIGURATIONS
// ============================================================================

const sizeConfigs: Record<RatingSize, { iconSize: string; gap: string; textSize: string }> = {
  sm: { iconSize: 'w-4 h-4', gap: 'gap-0.5', textSize: 'text-xs' },
  md: { iconSize: 'w-6 h-6', gap: 'gap-1', textSize: 'text-sm' },
  lg: { iconSize: 'w-8 h-8', gap: 'gap-1.5', textSize: 'text-base' },
  xl: { iconSize: 'w-10 h-10', gap: 'gap-2', textSize: 'text-lg' },
};

// ============================================================================
// RATING COMPONENT
// ============================================================================

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      value,
      max = 5,
      variant = 'stars',
      size = 'md',
      showValue = false,
      showMax = false,
      animated = true,
      interactive = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const config = sizeConfigs[size];

    // Calculate which icons should be filled, half-filled, or empty
    const icons = useMemo(() => {
      const result: Array<'filled' | 'half' | 'empty'> = [];
      for (let i = 1; i <= max; i++) {
        if (value >= i) {
          result.push('filled');
        } else if (value >= i - 0.5) {
          result.push('half');
        } else {
          result.push('empty');
        }
      }
      return result;
    }, [value, max]);

    // Get the icon component based on variant
    const IconComponent = useMemo(() => {
      switch (variant) {
        case 'hearts':
          return HeartIcon;
        case 'smileys':
          return SmileyIcon;
        case 'thumbs':
          return ThumbIcon;
        default:
          return StarIcon;
      }
    }, [variant]);

    const handleClick = (index: number) => {
      if (interactive && onChange) {
        onChange(index + 1);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center',
          config.gap,
          className
        )}
        role={interactive ? 'slider' : 'img'}
        aria-label={`Rating: ${value} out of ${max}`}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        {/* Icons */}
        <div className={cn('flex items-center', config.gap)}>
          {icons.map((status, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(index)}
              disabled={!interactive}
              className={cn(
                'transition-transform duration-200',
                config.iconSize,
                interactive && 'cursor-pointer hover:scale-110 focus:outline-none focus:scale-110',
                !interactive && 'cursor-default',
                animated && status === 'filled' && 'animate-[pop_0.3s_ease-out]',
              )}
              style={{ animationDelay: animated ? `${index * 50}ms` : undefined }}
              tabIndex={interactive ? 0 : -1}
              aria-label={interactive ? `Rate ${index + 1} out of ${max}` : undefined}
            >
              <IconComponent
                filled={status === 'filled'}
                half={status === 'half'}
                className="w-full h-full"
              />
            </button>
          ))}
        </div>

        {/* Value display */}
        {showValue && (
          <span className={cn('font-semibold text-[#4A4A4A] ml-1', config.textSize)}>
            {value.toFixed(1)}
            {showMax && <span className="text-[#9CA3AF]">/{max}</span>}
          </span>
        )}
      </div>
    );
  }
);

Rating.displayName = 'Rating';

// ============================================================================
// COMPACT RATING - Single icon with value
// ============================================================================

interface CompactRatingProps extends Omit<RatingProps, 'max' | 'showMax' | 'interactive' | 'onChange'> {
  label?: string;
}

export const CompactRating = forwardRef<HTMLDivElement, CompactRatingProps>(
  ({ className, value, variant = 'stars', size = 'md', label, ...props }, ref) => {
    const config = sizeConfigs[size];

    const IconComponent = useMemo(() => {
      switch (variant) {
        case 'hearts':
          return HeartIcon;
        case 'smileys':
          return SmileyIcon;
        case 'thumbs':
          return ThumbIcon;
        default:
          return StarIcon;
      }
    }, [variant]);

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center gap-1', className)}
        {...props}
      >
        <IconComponent filled className={config.iconSize} />
        <span className={cn('font-semibold text-[#4A4A4A]', config.textSize)}>
          {value.toFixed(1)}
        </span>
        {label && (
          <span className={cn('text-[#9CA3AF]', config.textSize)}>{label}</span>
        )}
      </div>
    );
  }
);

CompactRating.displayName = 'CompactRating';

// ============================================================================
// RATING BAR - For showing rating distribution
// ============================================================================

interface RatingBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: 'coral' | 'mint' | 'sky' | 'sunflower' | 'lavender';
  showPercentage?: boolean;
  label?: string;
}

const barColorStyles = {
  coral: 'bg-[#FFB5A7]',
  mint: 'bg-[#B8E0D2]',
  sky: 'bg-[#A2D2FF]',
  sunflower: 'bg-[#FFE66D]',
  lavender: 'bg-[#CDB4DB]',
};

export const RatingBar = forwardRef<HTMLDivElement, RatingBarProps>(
  (
    {
      className,
      value,
      max = 100,
      color = 'sunflower',
      showPercentage = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(label || showPercentage) && (
          <div className="flex justify-between items-center mb-1">
            {label && (
              <span className="text-sm font-medium text-[#4A4A4A]">{label}</span>
            )}
            {showPercentage && (
              <span className="text-sm text-[#7A7A7A]">{percentage.toFixed(0)}%</span>
            )}
          </div>
        )}
        <div className="h-3 bg-[#F5F5F5] rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              barColorStyles[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

RatingBar.displayName = 'RatingBar';

export default Rating;
