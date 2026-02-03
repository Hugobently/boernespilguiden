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
  emoji: string | ReactNode;
  show: boolean;
  color: { bg: string; text: string };
}

export function QuickBadges({ badges }: { badges: QuickBadge[] }) {
  const visibleBadges = badges.filter((b) => b.show);
  if (visibleBadges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleBadges.map((badge) => (
        <span
          key={badge.label}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm transition-transform hover:scale-105"
          style={{ backgroundColor: badge.color.bg, color: badge.color.text }}
        >
          <span className="flex items-center">{badge.emoji}</span>
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
            className="text-sm opacity-70 hover:opacity-100 transition-opacity cursor-default"
            title={info.label}
          >
            {info.icon}
          </span>
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
              ? 'text-[#FFE66D]'
              : i === fullStars && hasHalf
              ? 'text-[#FFE66D]/60'
              : 'text-[#9CA3AF]/40'
          )}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-[#7A7A7A] ml-1 font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ============================================================================
// AGE INDICATOR
// ============================================================================

import { getAgeLabel } from '@/lib/utils';
import { ageGroups } from '@/lib/config/age-groups';

export function AgeIndicator({ minAge, maxAge }: { minAge: number; maxAge: number }) {
  // Find matching age group
  const ageGroup = ageGroups.find(group => {
    if (group.slug === '0-3') return minAge <= 3;
    if (group.slug === '3-6') return minAge > 3 && minAge <= 6;
    return minAge > 6;
  }) || ageGroups[2]; // Default to 7+

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105"
      style={{
        backgroundColor: ageGroup.color.bg,
        color: ageGroup.color.text,
        boxShadow: `0 2px 0 0 ${ageGroup.color.border}`,
      }}
    >
      <span>{ageGroup.emoji}</span>
      <span>{getAgeLabel(minAge, maxAge)}</span>
    </div>
  );
}
