'use client';

import { cn } from '@/lib/utils';
import { GameCard, GameCardProps } from './GameCard';
import { forwardRef, HTMLAttributes } from 'react';

// ============================================================================
// SKELETON LOADER
// ============================================================================

function GameCardSkeleton() {
  return (
    <div className="bg-[#FFFCF7] rounded-3xl overflow-hidden shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gradient-to-br from-[#A2D2FF]/20 via-[#CDB4DB]/20 to-[#FFB5A7]/20 relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Age and rating row */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 rounded-full bg-[#FFD1DC]/30 animate-pulse" />
          <div className="h-4 w-16 rounded bg-[#FFE66D]/30 animate-pulse" />
        </div>

        {/* Badges */}
        <div className="flex gap-1">
          <div className="h-5 w-14 rounded-full bg-[#D8F3DC]/30 animate-pulse" />
          <div className="h-5 w-16 rounded-full bg-[#BAE1FF]/30 animate-pulse" />
        </div>

        {/* Title */}
        <div className="h-6 w-3/4 rounded bg-[#4A4A4A]/10 animate-pulse" />

        {/* Description lines */}
        <div className="space-y-1.5">
          <div className="h-4 w-full rounded bg-[#7A7A7A]/10 animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-[#7A7A7A]/10 animate-pulse" />
        </div>

        {/* Categories */}
        <div className="flex gap-1">
          <div className="h-5 w-12 rounded-full bg-[#FFF9F0] animate-pulse" />
          <div className="h-5 w-16 rounded-full bg-[#FFF9F0] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  type: 'digital' | 'board';
  title?: string;
  description?: string;
}

function EmptyState({
  type,
  title = 'Ingen spil fundet',
  description = 'Prøv at ændre din søgning eller filtre',
}: EmptyStateProps) {
  const emoji = type === 'digital' ? '🎮' : '🎲';
  const suggestions = type === 'digital'
    ? ['Prøv en anden aldersgruppe', 'Søg efter specifik kategori', 'Fjern filtre og se alle spil']
    : ['Prøv en anden aldersgruppe', 'Søg efter spillerantal', 'Se alle brætspil'];

  return (
    <div className="text-center py-16 px-4">
      {/* Animated emoji */}
      <div className="relative inline-block mb-6">
        <div className="text-8xl animate-bounce" style={{ animationDuration: '2s' }}>
          {emoji}
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#FFB5A7]/40 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute -bottom-1 -right-3 w-4 h-4 rounded-full bg-[#A2D2FF]/40 animate-ping" style={{ animationDuration: '2.5s' }} />
        <div className="absolute top-1/2 -right-6 w-3 h-3 rounded-full bg-[#B8E0D2]/40 animate-ping" style={{ animationDuration: '3s' }} />
      </div>

      {/* Title */}
      <h3 className="font-bold text-2xl text-[#4A4A4A] mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#7A7A7A] text-lg mb-6 max-w-md mx-auto">
        {description}
      </p>

      {/* Suggestions */}
      <div className="max-w-sm mx-auto">
        <p className="text-sm text-[#6B7280] mb-3">Prøv i stedet:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <span
              key={suggestion}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-[#FFF9F0] text-[#7A7A7A] border border-[#FFB5A7]/20"
            >
              <span>💡</span>
              <span>{suggestion}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Decorative wave */}
      <div className="mt-12 max-w-xs mx-auto h-2 rounded-full bg-gradient-to-r from-[#FFB5A7]/20 via-[#B8E0D2]/20 to-[#A2D2FF]/20" />
    </div>
  );
}

// ============================================================================
// GRID LOADING STATE
// ============================================================================

interface LoadingGridProps {
  count?: number;
  columns?: 2 | 3 | 4;
}

function LoadingGrid({ count = 8, columns = 4 }: LoadingGridProps) {
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', columnClasses[columns])}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          style={{ animationDelay: `${index * 0.05}s` }}
          className="animate-fade-in opacity-0"
        >
          <GameCardSkeleton />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// GAME GRID COMPONENT
// ============================================================================

type GameData = Omit<GameCardProps, 'type' | 'className'>;

interface GameGridProps extends HTMLAttributes<HTMLDivElement> {
  games: GameData[];
  type: 'digital' | 'board';
  loading?: boolean;
  loadingCount?: number;
  columns?: 2 | 3 | 4;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const GameGrid = forwardRef<HTMLDivElement, GameGridProps>(
  (
    {
      games,
      type,
      loading = false,
      loadingCount = 8,
      columns = 4,
      emptyTitle,
      emptyDescription,
      className,
      ...props
    },
    ref
  ) => {
    const columnClasses = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    };

    // Loading state
    if (loading) {
      return <LoadingGrid count={loadingCount} columns={columns} />;
    }

    // Empty state
    if (games.length === 0) {
      return (
        <EmptyState
          type={type}
          title={emptyTitle}
          description={emptyDescription}
        />
      );
    }

    // Grid with games
    return (
      <div
        ref={ref}
        className={cn('grid gap-6', columnClasses[columns], className)}
        {...props}
      >
        {games.map((game, index) => (
          <div
            key={game.slug}
            className="animate-slide-up opacity-0 h-full"
            style={{
              animationDelay: `${index * 0.05}s`,
              animationFillMode: 'forwards',
            }}
          >
            <GameCard
              {...game}
              type={type}
              imagePriority={index < 4}
            />
          </div>
        ))}
      </div>
    );
  }
);

GameGrid.displayName = 'GameGrid';

export default GameGrid;
