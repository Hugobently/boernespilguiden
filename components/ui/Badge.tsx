import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'default' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-cream text-charcoal',
  pink: 'bg-candy-pink/10 text-candy-pink',
  blue: 'bg-candy-blue/10 text-candy-blue',
  green: 'bg-candy-green/10 text-candy-green',
  orange: 'bg-candy-orange/10 text-candy-orange',
  purple: 'bg-candy-purple/10 text-candy-purple',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold font-body',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = 'Badge';
