// Sticky Filter Bar Component
// Makes filter section sticky on mobile for better UX

'use client';

import { useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StickyFilterBarProps {
  children: ReactNode;
  className?: string;
}

export function StickyFilterBar({ children, className }: StickyFilterBarProps) {
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
      {children}
    </div>
  );
}

export default StickyFilterBar;
