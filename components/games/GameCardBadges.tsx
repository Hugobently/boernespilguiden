'use client';

import { ReactNode } from 'react';
import { Platform } from '@/lib/types';
import { platformConfig } from '@/lib/config/platforms';

// ============================================================================
// DANISH FLAG SVG
// ============================================================================

export function DanishFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 12"
      className={className}
      style={{ width: '1em', height: '0.75em' }}
      aria-label="Dansk flag"
    >
      <rect width="16" height="12" fill="#C8102E" />
      <rect x="5" y="0" width="2" height="12" fill="#FFFFFF" />
      <rect x="0" y="5" width="16" height="2" fill="#FFFFFF" />
    </svg>
  );
}

// ============================================================================
// QUICK BADGES
// ============================================================================

export interface QuickBadge {
  label: string;
  emoji?: string | ReactNode;
  show: boolean;
  /** 'positive' = soft green with checkmark, 'info' = warm neutral */
  variant: 'positive' | 'info';
}

// Max badges per card - the detail page carries the full story
const MAX_BADGES = 3;

export function QuickBadges({ badges }: { badges: QuickBadge[] }) {
  const visibleBadges = badges.filter((b) => b.show).slice(0, MAX_BADGES);
  if (visibleBadges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleBadges.map((badge) => (
        <span
          key={badge.label}
          className={
            badge.variant === 'positive'
              ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCF2E3] text-[#16603A]'
              : 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F1EDE6] text-[#55503F]'
          }
        >
          {badge.variant === 'positive' && <span aria-hidden="true">✓</span>}
          {badge.emoji && <span className="flex items-center">{badge.emoji}</span>}
          <span>{badge.label}</span>
        </span>
      ))}
    </div>
  );
}

// ============================================================================
// PLATFORM ICONS
// ============================================================================

export function PlatformIcons({ platforms }: { platforms: Platform[] }) {
  if (!platforms || platforms.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {platforms.slice(0, 4).map((platform) => {
        const info = platformConfig[platform];
        if (!info) return null;
        return (
          <span
            key={platform}
            className="w-2 h-2 rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-default"
            style={{ backgroundColor: info.color }}
            title={info.label}
            aria-label={info.label}
          />
        );
      })}
      {platforms.length > 4 && (
        <span className="text-xs text-[#7A7A7A]">+{platforms.length - 4}</span>
      )}
    </div>
  );
}

// ============================================================================
// STAR RATING
// ============================================================================

import { cn } from '@/lib/utils';

export function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const sizeClass = size === 'sm' ? 'text-sm' : 'text-lg';

  return (
    <div className={cn('flex items-center gap-0.5', sizeClass)}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={cn(
            'transition-colors',
            i < fullStars
              ? 'text-[#9A6700]'
              : i === fullStars && hasHalf
              ? 'text-[#9A6700]/50'
              : 'text-[#6B6258]/25'
          )}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-[#4A443C] ml-1 font-semibold">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ============================================================================
// AGE INDICATOR
// ============================================================================

import { getAgeLabel } from '@/lib/utils';

export function AgeIndicator({ minAge, maxAge }: { minAge: number; maxAge: number }) {
  // Solid petrol chip - the one fact parents scan for first, so it gets
  // a look nothing else on the card has (white on #0E5A6D: 7.8:1)
  return (
    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#0E5A6D] text-white">
      <span>{getAgeLabel(minAge, maxAge)}</span>
    </div>
  );
}
