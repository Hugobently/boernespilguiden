'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// INTERSECTION OBSERVER HOOK
// ============================================================================

function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null!);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0,
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
}

// ============================================================================
// LAZY GAME CARD WRAPPER
// ============================================================================

interface LazyGameCardProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function LazyGameCard({ children, index, className }: LazyGameCardProps) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={cn(
        'transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        animationDelay: isVisible ? `${Math.min(index * 0.05, 0.3)}s` : '0s',
      }}
    >
      {isVisible ? (
        children
      ) : (
        <div className="aspect-[4/3] bg-[#FFFCF7] rounded-3xl animate-pulse" />
      )}
    </div>
  );
}

// ============================================================================
// LAZY GAME GRID
// ============================================================================

interface LazyGameGridProps {
  children: ReactNode[];
  className?: string;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function LazyGameGrid({
  children,
  className,
  columns = { default: 1, sm: 2, lg: 3, xl: 4 },
}: LazyGameGridProps) {
  const gridClasses = cn(
    'grid gap-6',
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children.map((child, index) => (
        <LazyGameCard key={index} index={index}>
          {child}
        </LazyGameCard>
      ))}
    </div>
  );
}

// ============================================================================
// SKELETON LOADER
// ============================================================================

export function GameCardSkeleton() {
  return (
    <div className="bg-[#FFFCF7] rounded-3xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-[#E5E5E5] to-[#F5F5F5]" />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Age and rating */}
        <div className="flex justify-between">
          <div className="h-6 w-16 bg-[#E5E5E5] rounded-full" />
          <div className="h-4 w-20 bg-[#E5E5E5] rounded" />
        </div>

        {/* Badges */}
        <div className="flex gap-1">
          <div className="h-5 w-16 bg-[#E5E5E5] rounded-full" />
          <div className="h-5 w-20 bg-[#E5E5E5] rounded-full" />
        </div>

        {/* Title */}
        <div className="h-6 w-3/4 bg-[#E5E5E5] rounded" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#E5E5E5] rounded" />
          <div className="h-4 w-2/3 bg-[#E5E5E5] rounded" />
        </div>

        {/* Categories */}
        <div className="flex gap-1">
          <div className="h-5 w-14 bg-[#E5E5E5] rounded-full" />
          <div className="h-5 w-16 bg-[#E5E5E5] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default LazyGameGrid;
