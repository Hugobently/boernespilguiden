'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { parseJsonArray, Platform, DataCollection } from '@/lib/types';
import { forwardRef, memo, useMemo } from 'react';
import { GameImageWithFallback } from './GameCardImage';
import { Icon } from '@/components/ui';
import {
  QuickBadges,
  QuickBadge,
  PlatformIcons,
  StarRating,
  AgeIndicator,
  DanishFlag,
} from './GameCardBadges';

// ============================================================================
// GAME CARD COMPONENT
// ============================================================================

// NOTE: deliberately NOT extending HTMLAttributes — unknown props used to be
// spread onto the wrapper div, leaking full game objects (description,
// parentInfo, ...) into the HTML as attributes (~1.2 MB extra on /spil).
export interface GameCardProps {
  className?: string;
  /** Set for above-the-fold cards so the image loads eagerly (better LCP) */
  imagePriority?: boolean;
  slug: string;
  title: string;
  shortDescription: string;
  type: 'digital' | 'board';
  minAge: number;
  maxAge: number;
  iconUrl?: string | null;
  imageUrl?: string | null;
  rating: number;
  featured?: boolean;
  editorChoice?: boolean;
  priceModel?: string;
  hasAds?: boolean;
  hasInAppPurchases?: boolean;
  offlinePlay?: boolean;
  supportsDanish?: boolean;
  platforms?: string;
  categories?: string;
  dataCollection?: DataCollection | string | null;
}

const GameCardInner = forwardRef<HTMLDivElement, GameCardProps>(
  (
    {
      slug,
      title,
      shortDescription,
      type,
      minAge,
      maxAge,
      iconUrl,
      imageUrl,
      rating,
      featured,
      editorChoice,
      priceModel,
      hasAds,
      hasInAppPurchases,
      offlinePlay,
      supportsDanish,
      platforms,
      categories,
      className,
      imagePriority,
    },
    ref
  ) => {
    const t = useTranslations('gameCard');
    const href = type === 'digital' ? `/spil/${slug}` : `/braetspil/${slug}`;

    // Fall back to slug-based image path if iconUrl/imageUrl is null
    const displayImage = type === 'digital'
      ? (iconUrl || `/images/games/digital/${slug}.jpg`)
      : (imageUrl || `/images/games/board/${slug}.jpg`);

    // Memoize parsed arrays to avoid re-parsing on every render
    const parsedPlatforms = useMemo(
      () => (platforms ? parseJsonArray<Platform>(platforms) : []),
      [platforms]
    );
    const parsedCategories = useMemo(
      () => (categories ? parseJsonArray<string>(categories) : []),
      [categories]
    );

    // Quick badges: two roles (positive/info), priority-ordered, max 3 shown.
    // The detail page carries the full safety story.
    const quickBadges: QuickBadge[] = useMemo(() => [
      {
        label: t('adFree'),
        show: hasAds === false,
        variant: 'positive' as const,
      },
      {
        label: t('free'),
        show: priceModel === 'gratis',
        variant: 'positive' as const,
      },
      {
        label: t('danish'),
        emoji: <DanishFlag />,
        show: supportsDanish === true,
        variant: 'positive' as const,
      },
      {
        label: t('noInApp'),
        show: hasInAppPurchases === false && priceModel !== 'gratis',
        variant: 'positive' as const,
      },
      {
        label: t('offline'),
        show: offlinePlay === true,
        variant: 'info' as const,
      },
    ], [t, supportsDanish, priceModel, hasAds, offlinePlay, hasInAppPurchases]);

    return (
      <div ref={ref} className={cn('group h-full', className)}>
        <Link href={href} className="block h-full">
          <article
            className={cn(
              'relative h-full flex flex-col bg-white rounded-3xl overflow-hidden',
              'shadow-card border border-white/50',
              'transition-all duration-300 ease-out',
              'group-hover:shadow-card-hover',
              'group-hover:-translate-y-2 group-hover:scale-[1.02]'
            )}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
              {/* Solid pastel surface behind image/fallback */}
              <div
                className={cn(
                  'absolute inset-0',
                  type === 'digital' ? 'bg-[#DCEDFC]' : 'bg-[#ECE3F6]'
                )}
              />

              {/* Digital games: square app icons shown as squircles (never
                  cropped to a wide format); board games: box photo as cover */}
              <GameImageWithFallback
                src={displayImage}
                alt={title}
                title={title}
                type={type}
                slug={slug}
                priority={imagePriority}
                squircle={type === 'digital'}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />

              {/* Editor's choice / recommended - small chip instead of banner */}
              {(editorChoice || featured) && (
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-[#9A6700] shadow-sm">
                    <Icon name="star" className="w-3.5 h-3.5" />
                    {editorChoice ? t('editorChoice') : t('recommended')}
                  </span>
                </div>
              )}

              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold',
                    'bg-white/90 backdrop-blur-sm shadow-sm',
                    type === 'digital' ? 'text-[#1D4E89]' : 'text-[#5B4670]'
                  )}
                >
                  <Icon name={type === 'digital' ? 'gamepad' : 'dice'} className="w-3.5 h-3.5" />
                  <span>{type === 'digital' ? t('digital') : t('boardGame')}</span>
                </span>
              </div>

              {/* Platform icons (for digital games) */}
              {type === 'digital' && parsedPlatforms.length > 0 && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
                  <PlatformIcons platforms={parsedPlatforms} />
                </div>
              )}
            </div>

            {/* Content - flex column so the categories pin to the bottom
                and all cards in a row get the same height */}
            <div className="p-4 flex-1 flex flex-col">
              {/* Age indicator and rating row */}
              <div className="flex items-center justify-between mb-3">
                <AgeIndicator minAge={minAge} maxAge={maxAge} />
                <StarRating rating={rating} />
              </div>

              {/* Quick badges - reserve one row so badge-less cards align */}
              <div className="mb-3 min-h-[22px]">
                <QuickBadges badges={quickBadges} />
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-[#2E2822] mb-1.5 line-clamp-1 transition-colors group-hover:text-[#C2410C]">
                {title}
              </h3>

              {/* Description - reserve two lines so single-line cards align */}
              <p className="text-sm text-[#6B6258] line-clamp-2 mb-3 min-h-[2.5rem]">
                {shortDescription}
              </p>

              {/* Categories - pinned to the card bottom */}
              {parsedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-auto">
                  {parsedCategories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs text-[#55503F] bg-[#F1EDE6] px-2 py-0.5 rounded-full capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                  {parsedCategories.length > 2 && (
                    <span className="text-xs text-[#55503F] bg-[#F1EDE6] px-2 py-0.5 rounded-full">
                      +{parsedCategories.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </article>
        </Link>
      </div>
    );
  }
);

GameCardInner.displayName = 'GameCard';

// Memoize the component to prevent unnecessary re-renders
export const GameCard = memo(GameCardInner);
