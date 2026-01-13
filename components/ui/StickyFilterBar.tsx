// Sticky Filter Bar Component
// Makes filter section sticky on mobile for better UX
// Now includes optional result count display

'use client';

import { useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StickyFilterBarProps {
  children: ReactNode;
  className?: string;
  resultCount?: number;
  resultLabel?: string;
}

export function StickyFilterBar({
  children,
  className,
  resultCount,
  resultLabel = 'resultater',
}: StickyFilterBarProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Make sticky after scrolling past header (approximately 150px)
      setIsSticky(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'transition-all duration-300 z-40',
        isSticky && [
          'sticky top-0',
          'bg-white/95 backdrop-blur-md',
          'shadow-md',
          '-mx-4 px-4 py-3 sm:-mx-6 sm:px-6',
          'border-b border-gray-100',
        ],
        className
      )}
    >
      {/* Result count on top for mobile */}
      {resultCount !== undefined && (
        <div className="flex justify-end mb-2 sm:hidden">
          <span className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{resultCount}</span> {resultLabel}
          </span>
        </div>
      )}
      {/* Horizontally scrollable filter container */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
        {children}
        {/* Result count inline on desktop */}
        {resultCount !== undefined && (
          <span className="hidden sm:inline-flex text-sm text-text-secondary whitespace-nowrap flex-shrink-0 ml-auto">
            <span className="font-semibold text-text-primary mr-1">{resultCount}</span> {resultLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export default StickyFilterBar;
