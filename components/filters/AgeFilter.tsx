'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AGE_CATEGORIES } from '@/lib/utils';

interface AgeFilterProps {
  basePath: string;
  selectedAge?: string;
  className?: string;
}

export function AgeFilter({ basePath, selectedAge, className }: AgeFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <Link
        href={basePath}
        className={cn(
          'px-4 py-2 rounded-2xl font-display font-semibold transition-all duration-200',
          !selectedAge
            ? 'bg-gradient-to-r from-candy-pink to-candy-purple text-white shadow-playful'
            : 'bg-white text-charcoal border-2 border-candy-pink/20 hover:border-candy-pink hover:text-candy-pink'
        )}
      >
        Alle aldre
      </Link>

      {AGE_CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`${basePath}/kategori/${category.slug}`}
          className={cn(
            'px-4 py-2 rounded-2xl font-display font-semibold transition-all duration-200 flex items-center gap-2',
            selectedAge === category.slug
              ? 'bg-gradient-to-r from-candy-pink to-candy-purple text-white shadow-playful'
              : 'bg-white text-charcoal border-2 border-candy-pink/20 hover:border-candy-pink hover:text-candy-pink'
          )}
        >
          <span>{category.emoji}</span>
          <span>{category.label}</span>
        </Link>
      ))}
    </div>
  );
}
