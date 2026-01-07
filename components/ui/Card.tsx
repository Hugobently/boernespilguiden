'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef, type ReactNode } from 'react';

// ============================================================================
// TYPES
// ============================================================================

type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'playful';
type CardColor = 'neutral' | 'coral' | 'mint' | 'sky' | 'sunflower' | 'lavender';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  color?: CardColor;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// ============================================================================
// STYLES
// ============================================================================

const variantStyles: Record<CardVariant, string> = {
  default: `
    bg-[#FFFCF7]
    shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06),0_4px_24px_-4px_rgba(0,0,0,0.04)]
  `,
  elevated: `
    bg-[#FFFCF7]
    shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08),0_8px_32px_-8px_rgba(0,0,0,0.06)]
  `,
  outlined: `
    bg-[#FFFCF7]
    border-2 border-[#FFB5A7]/30
    shadow-none
  `,
  glass: `
    bg-white/70
    backdrop-blur-md
    border border-white/50
    shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]
  `,
  playful: `
    bg-[#FFFCF7]
    shadow-[0_6px_0_0_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.08)]
  `,
};

const colorStyles: Record<CardColor, string> = {
  neutral: '',
  coral: 'bg-gradient-to-br from-[#FFFCF7] to-[#FFF0E8] border-[#FFB5A7]/20',
  mint: 'bg-gradient-to-br from-[#FFFCF7] to-[#E8F8F0] border-[#B8E0D2]/20',
  sky: 'bg-gradient-to-br from-[#FFFCF7] to-[#E8F4FC] border-[#A2D2FF]/20',
  sunflower: 'bg-gradient-to-br from-[#FFFCF7] to-[#FFFAE8] border-[#FFE66D]/20',
  lavender: 'bg-gradient-to-br from-[#FFFCF7] to-[#F5F0FA] border-[#CDB4DB]/20',
};

const hoverStyles = `
  transition-all duration-300 ease-out
  hover:-translate-y-1
  hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1),0_16px_48px_-8px_rgba(0,0,0,0.06)]
`;

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

// ============================================================================
// CARD COMPONENT
// ============================================================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      color = 'neutral',
      hover = true,
      padding = 'none',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl overflow-hidden',
          variantStyles[variant],
          colorStyles[color],
          hover && hoverStyles,
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ============================================================================
// CARD SUB-COMPONENTS
// ============================================================================

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 pt-6 pb-2', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 pb-6 pt-2 flex items-center gap-3', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// ============================================================================
// CARD IMAGE - For game thumbnails with overlay support
// ============================================================================

interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'wide';
  overlay?: ReactNode;
}

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, src, alt, aspectRatio = 'video', overlay, ...props }, ref) => {
    const aspectStyles = {
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[2/1]',
    };

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', aspectStyles[aspectRatio], className)}
        {...props}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Soft gradient overlay at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            {overlay}
          </div>
        )}
      </div>
    );
  }
);
CardImage.displayName = 'CardImage';

// ============================================================================
// GAME CARD - Pre-styled card specifically for game listings
// ============================================================================

interface GameCardProps extends Omit<CardProps, 'children'> {
  title: string;
  image: string;
  ageLabel?: string;
  rating?: number;
  badges?: ReactNode;
  onClick?: () => void;
}

export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
  (
    {
      className,
      title,
      image,
      ageLabel,
      rating,
      badges,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn('group cursor-pointer', className)}
        onClick={onClick}
        {...props}
      >
        <CardImage src={image} alt={title} />
        <CardContent className="space-y-2">
          <h3 className="font-semibold text-[#4A4A4A] text-lg leading-tight line-clamp-2 group-hover:text-[#F8A99B] transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            {ageLabel && (
              <span className="text-sm text-[#7A7A7A]">{ageLabel}</span>
            )}
            {rating !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-[#FFE66D] text-lg">★</span>
                <span className="text-sm font-medium text-[#4A4A4A]">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          {badges && <div className="flex flex-wrap gap-2 pt-1">{badges}</div>}
        </CardContent>
      </Card>
    );
  }
);
GameCard.displayName = 'GameCard';

export default Card;
