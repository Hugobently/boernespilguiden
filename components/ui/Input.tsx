'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-5 py-3 rounded-2xl border-2 border-candy-pink/20 bg-white',
            'font-body text-charcoal placeholder:text-slate/60',
            'transition-all duration-200',
            'focus:border-candy-pink focus:outline-none focus:ring-4 focus:ring-candy-pink/10',
            'hover:border-candy-pink/40',
            icon && 'pl-12',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
