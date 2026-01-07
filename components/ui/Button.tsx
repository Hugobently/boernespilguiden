'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'coral'
  | 'mint'
  | 'sky'
  | 'sunflower'
  | 'lavender';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// ============================================================================
// STYLES - Soft pastel colors with bouncy 3D effect
// ============================================================================

const baseStyles = `
  relative inline-flex items-center justify-center gap-2
  font-semibold rounded-2xl
  transition-all duration-200 ease-out
  focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  select-none transform-gpu
`;

const variantStyles: Record<ButtonVariant, string> = {
  // Primary - Soft coral with 3D press effect
  primary: `
    bg-gradient-to-b from-[#FFB5A7] to-[#F8A99B]
    text-white
    shadow-[0_4px_0_0_#E8958A,0_6px_16px_-4px_rgba(255,181,167,0.4)]
    hover:shadow-[0_6px_0_0_#E8958A,0_10px_24px_-6px_rgba(255,181,167,0.5)]
    hover:-translate-y-0.5
    active:shadow-[0_2px_0_0_#E8958A,0_4px_12px_-2px_rgba(255,181,167,0.3)]
    active:translate-y-0.5
    focus-visible:ring-[#FFB5A7]/50
  `,
  // Secondary - Soft mint green
  secondary: `
    bg-gradient-to-b from-[#B8E0D2] to-[#95D5B2]
    text-[#4A4A4A]
    shadow-[0_4px_0_0_#7CC9A8,0_6px_16px_-4px_rgba(184,224,210,0.4)]
    hover:shadow-[0_6px_0_0_#7CC9A8,0_10px_24px_-6px_rgba(184,224,210,0.5)]
    hover:-translate-y-0.5
    active:shadow-[0_2px_0_0_#7CC9A8,0_4px_12px_-2px_rgba(184,224,210,0.3)]
    active:translate-y-0.5
    focus-visible:ring-[#B8E0D2]/50
  `,
  // Outline - Coral border
  outline: `
    bg-[#FFFCF7]
    border-2 border-[#FFB5A7]
    text-[#F8A99B]
    shadow-[0_2px_8px_-2px_rgba(255,181,167,0.2)]
    hover:bg-[#FFB5A7]/10
    hover:shadow-[0_4px_12px_-2px_rgba(255,181,167,0.3)]
    hover:-translate-y-0.5
    active:translate-y-0
    active:shadow-none
    focus-visible:ring-[#FFB5A7]/30
  `,
  // Ghost - Subtle hover
  ghost: `
    bg-transparent
    text-[#7A7A7A]
    hover:bg-[#4A4A4A]/5
    hover:text-[#4A4A4A]
    active:bg-[#4A4A4A]/10
    focus-visible:ring-[#4A4A4A]/20
  `,
  // Coral pastel
  coral: `
    bg-gradient-to-b from-[#FFB5A7] to-[#FCD5CE]
    text-[#4A4A4A]
    shadow-[0_4px_0_0_#F8A99B,0_6px_16px_-4px_rgba(255,181,167,0.35)]
    hover:shadow-[0_6px_0_0_#F8A99B,0_10px_24px_-6px_rgba(255,181,167,0.45)]
    hover:-translate-y-0.5
    active:shadow-[0_2px_0_0_#F8A99B,0_4px_12px_-2px_rgba(255,181,167,0.25)]
    active:translate-y-0.5
    focus-visible:ring-[#FFB5A7]/40
  `,
  // Mint pastel
  mint: `
    bg-gradient-to-b from-[#B8E0D2] to-[#D8F3DC]
    text-[#4A4A4A]
    shadow-[0_4px_0_0_#95D5B2,0_6px_16px_-4px_rgba(184,224,210,0.35)]
    hover:shadow-[0_6px_0_0_#95D5B2,0_10px_24px_-6px_rgba(184,224,210,0.45)]
    hover:-translate-y-0.5
    active:shadow-[0_2px_0_0_#95D5B2,0_4px_12px_-2px_rgba(184,224,210,0.25)]
    active:translate-y-0.5
    focus-visible:ring-[#B8E0D2]/40
  `,
  // Sky blue pastel
  sky: `
    bg-gradient-to-b from-[#A2D2FF] to-[#CAF0F8]
    text-[#4A4A4A]
    shadow-[0_4px_0_0_#72B4E8,0_6px_16px_-4px_rgba(162,210,255,0.35)]
    hover:shadow-[0_6px_0_0_#72B4E8,0_10px_24px_-6px_rgba(162,210,255,0.45)]
    hover:-translate-y-0.5
    active:shadow-[0_2px_0_0_#72B4E8,0_4px_12px_-2px_rgba(162,210,255,0.25)]
    active:translate-y-0.5
    focus-visible:ring-[#A2D2FF]/40
  `,
  // Sunflower yellow pastel
  sunflower: `
    bg-gradient-to-b from-[#FFE66D] to-[#FFF3B0]
    text-[#4A4A4A]
    shadow-[0_4px_0_0_#FFD93D,0_6px_16px_-4px_rgba(255,230,109,0.35)]
    hover:shadow-[0_6px_0_0_#FFD93D,0_10px_24px_-6px_rgba(255,230,109,0.45)]
    hover:-translate-y-0.5
    active:shadow-[0_2px_0_0_#FFD93D,0_4px_12px_-2px_rgba(255,230,109,0.25)]
    active:translate-y-0.5
    focus-visible:ring-[#FFE66D]/40
  `,
  // Lavender purple pastel
  lavender: `
    bg-gradient-to-b from-[#CDB4DB] to-[#E2D1F0]
    text-[#4A4A4A]
    shadow-[0_4px_0_0_#B392C9,0_6px_16px_-4px_rgba(205,180,219,0.35)]
    hover:shadow-[0_6px_0_0_#B392C9,0_10px_24px_-6px_rgba(205,180,219,0.45)]
    hover:-translate-y-0.5
    active:shadow-[0_2px_0_0_#B392C9,0_4px_12px_-2px_rgba(205,180,219,0.25)]
    active:translate-y-0.5
    focus-visible:ring-[#CDB4DB]/40
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm min-h-[36px] rounded-xl',
  md: 'px-6 py-2.5 text-base min-h-[44px] rounded-2xl',
  lg: 'px-8 py-3 text-lg min-h-[52px] rounded-2xl',
  xl: 'px-10 py-4 text-xl min-h-[60px] rounded-3xl',
};

// ============================================================================
// LOADING SPINNER - Playful bouncing dots
// ============================================================================

function LoadingSpinner() {
  return (
    <span className="inline-flex gap-1">
      <span
        className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </span>
  );
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading state */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </span>
        )}

        {/* Content */}
        <span
          className={cn(
            'inline-flex items-center gap-2',
            isLoading && 'invisible'
          )}
        >
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// ICON BUTTON VARIANT
// ============================================================================

interface IconButtonProps
  extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: ReactNode;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', icon, ...props }, ref) => {
    const iconSizeStyles: Record<ButtonSize, string> = {
      sm: '!w-9 !h-9 !p-0 !min-h-0',
      md: '!w-11 !h-11 !p-0 !min-h-0',
      lg: '!w-14 !h-14 !p-0 !min-h-0',
      xl: '!w-16 !h-16 !p-0 !min-h-0',
    };

    return (
      <Button
        ref={ref}
        className={cn(iconSizeStyles[size], className)}
        size={size}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default Button;
