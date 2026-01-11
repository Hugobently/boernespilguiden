// Results Bar Component
// Shows result count and active filters with ability to remove them

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ActiveFilter {
  key: string;
  label: string;
  emoji?: string;
  color?: string;
  removeUrl: string;
}

interface ResultsBarProps {
  totalResults: number;
  itemType?: 'spil' | 'brætspil' | 'film' | 'serier';
  activeFilters?: ActiveFilter[];
  resetUrl?: string;
  className?: string;
}

export function ResultsBar({
  totalResults,
  itemType = 'spil',
  activeFilters = [],
  resetUrl,
  className,
}: ResultsBarProps) {
  const hasFilters = activeFilters.length > 0;

  // Get item type text
  const getItemText = (count: number) => {
    switch (itemType) {
      case 'spil':
        return count === 1 ? 'spil' : 'spil';
      case 'brætspil':
        return count === 1 ? 'brætspil' : 'brætspil';
      case 'film':
        return count === 1 ? 'film' : 'film';
      case 'serier':
        return count === 1 ? 'serie' : 'serier';
      default:
        return 'resultater';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm',
        className
      )}
    >
      {/* Results count */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">
          {itemType === 'spil' && '🎮'}
          {itemType === 'brætspil' && '🎲'}
          {itemType === 'film' && '🎬'}
          {itemType === 'serier' && '📺'}
        </span>
        <div>
          <span className="font-bold text-text-primary text-lg">{totalResults}</span>
          <span className="text-text-secondary ml-1">{getItemText(totalResults)}</span>
          {hasFilters && (
            <span className="text-text-muted text-sm ml-1">
              (filtreret)
            </span>
          )}
        </div>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <Link
              key={filter.key}
              href={filter.removeUrl}
              className={cn(
                'group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                'transition-all duration-200 hover:opacity-80',
                filter.color || 'bg-primary/10 text-primary'
              )}
              title={`Fjern filter: ${filter.label}`}
            >
              {filter.emoji && <span>{filter.emoji}</span>}
              <span>{filter.label}</span>
              <span className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity">×</span>
            </Link>
          ))}

          {/* Reset all button */}
          {resetUrl && activeFilters.length > 1 && (
            <Link
              href={resetUrl}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-text-muted hover:text-text-secondary hover:bg-gray-100 transition-colors"
            >
              <span>Nulstil alle</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultsBar;
