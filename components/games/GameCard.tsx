'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { parseJsonArray, Platform, DataCollection } from '@/lib/types';
import { forwardRef, HTMLAttributes } from 'react';
import { GameImageWithFallback } from './GameCardImage';
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

export interface GameCardProps extends HTMLAttributes<HTMLDivElement> {
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

export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
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
      ...props
    },
    ref
  ) => {
    const t = useTranslations('gameCard');
    const href = type === 'digital' ? `/spil/${slug}` : `/braetspil/${slug}`;
    const typeEmoji = type === 'digital' ? '🎮' : '🎲';

    // Fall back to slug-based image path if iconUrl/imageUrl is null
    const displayImage = type === 'digital'
      ? (iconUrl || `/images/games/digital/${slug}.jpg`)
      : (imageUrl || `/images/games/board/${slug}.jpg`);

    const parsedPlatforms = platforms ? parseJsonArray<Platform>(platforms) : [];
    const parsedCategories = categories ? parseJsonArray<string>(categories) : [];

    // Quick badges configuration
    const quickBadges: QuickBadge[] = [
      {
        label: t('danish'),
        emoji: <DanishFlag />,
        show: supportsDanish === true,
        color: { bg: '#C8102E', text: '#FFFFFF' },
      },
      {
        label: t('free'),
        emoji: '🆓',
        show: priceModel === 'gratis',
        color: { bg: '#D8F3DC', text: '#2D6A4F' },
      },
      {
        label: t('adFree'),
        emoji: '🚫',
        show: hasAds === false,
        color: { bg: '#BAE1FF', text: '#1D4E89' },
      },
      {
        label: t('offline'),
        emoji: '📱',
        show: offlinePlay === true,
        color: { bg: '#E2C2FF', text: '#5B4670' },
      },
      {
        label: t('noInApp'),
        emoji: '💰',
        show: hasInAppPurchases === false && priceModel !== 'gratis',
        color: { bg: '#FFF3B0', text: '#7D6608' },
      },
    ];

    return (
      <div ref={ref} className={cn('group', className)} {...props}>
        <Link href={href} className="block">
          <article
            className={cn(
              'relative h-full bg-white rounded-3xl overflow-hidden',
              'shadow-card border border-white/50',
              'transition-all duration-300 ease-out',
              'group-hover:shadow-card-hover',
              'group-hover:-translate-y-2 group-hover:scale-[1.02]'
            )}
          >
            {/* Featured/Editor's Choice Banner */}
            {(featured || editorChoice) && (
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-primary via-accent to-secondary py-1.5 px-3">
                <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  <span className="animate-sparkle">⭐</span>
                  {editorChoice ? t('editorChoice') : t('recommended')}
                  <span className="animate-sparkle" style={{ animationDelay: '0.3s' }}>⭐</span>
                </span>
              </div>
            )}

            {/* Image Container */}
            <div
              className={cn(
                'relative aspect-[4/3] overflow-hidden',
                featured || editorChoice ? 'mt-7' : ''
              )}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/60 via-lavender/60 to-primary/60" />

              {/* Image with fallback to game title */}
              <GameImageWithFallback
                src={displayImage}
                alt={title}
                title={title}
                type={type}
                slug={slug}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />

              {/* Decorative blob */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/20 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] transition-transform duration-500 group-hover:scale-150 group-hover:rotate-45" />

              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold',
                    'bg-white/90 backdrop-blur-sm shadow-sm',
                    type === 'digital' ? 'text-[#1D4E89]' : 'text-[#5B4670]'
                  )}
                >
                  <span>{typeEmoji}</span>
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

            {/* Content */}
            <div className="p-4">
              {/* Age indicator and rating row */}
              <div className="flex items-center justify-between mb-3">
                <AgeIndicator minAge={minAge} maxAge={maxAge} />
                <StarRating rating={rating} />
              </div>

              {/* Quick badges */}
              <div className="mb-3">
                <QuickBadges badges={quickBadges} />
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-text-primary mb-1.5 line-clamp-1 transition-colors group-hover:text-primary">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#7A7A7A] line-clamp-2 mb-3">
                {shortDescription}
              </p>

              {/* Categories */}
              {parsedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {parsedCategories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs text-[#7A7A7A] bg-[#FFF9F0] px-2 py-0.5 rounded-full capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                  {parsedCategories.length > 2 && (
                    <span className="text-xs text-[#7A7A7A] bg-[#FFF9F0] px-2 py-0.5 rounded-full">
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

GameCard.displayName = 'GameCard';
