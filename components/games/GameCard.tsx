'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn, getAgeLabel } from '@/lib/utils';
import { parseJsonArray, Platform, DataCollection } from '@/lib/types';
import { forwardRef, HTMLAttributes, useState, useCallback } from 'react';

// ============================================================================
// IMAGE FORMAT HELPER - Tries jpg, png, svg in order
// ============================================================================

const IMAGE_FORMATS = ['jpg', 'webp', 'png', 'svg'] as const;

function getImagePath(slug: string, type: 'digital' | 'board', format: string): string {
  return `/images/games/${type}/${slug}.${format}`;
}

// ============================================================================
// IMAGE WITH FALLBACK - Shows game title when image fails/missing
// ============================================================================

function GameImageWithFallback({
  src,
  alt,
  title,
  type,
  slug,
  fill = true,
  className,
}: {
  src: string;
  alt: string;
  title: string;
  type: 'digital' | 'board';
  slug?: string;
  fill?: boolean;
  className?: string;
}) {
  const [formatIndex, setFormatIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const typeEmoji = type === 'digital' ? '🎮' : '🎲';

  // Determine current image source - try different formats on error
  const currentSrc = src.startsWith('/images/games/') && slug
    ? getImagePath(slug, type, IMAGE_FORMATS[formatIndex])
    : src;

  const handleError = useCallback(() => {
    if (slug && formatIndex < IMAGE_FORMATS.length - 1) {
      // Try next format
      setFormatIndex(prev => prev + 1);
    } else {
      // All formats failed, show fallback
      setHasError(true);
    }
  }, [slug, formatIndex]);

  if (hasError) {
    // Show game title as fallback instead of random placeholder
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <span className="text-4xl mb-2">{typeEmoji}</span>
        <span className="text-sm font-semibold text-[#4A4A4A]/80 line-clamp-2">
          {title}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      loading="lazy"
      onError={handleError}
    />
  );
}

// Compact version for smaller thumbnails
function CompactGameImageWithFallback({
  src,
  alt,
  type,
}: {
  src: string;
  alt: string;
  type: 'digital' | 'board';
}) {
  const [hasError, setHasError] = useState(false);
  const typeEmoji = type === 'digital' ? '🎮' : '🎲';

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl">{typeEmoji}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
}

// ============================================================================
// PLATFORM ICONS
// ============================================================================

const platformIcons: Record<Platform, { icon: string; label: string; color: string }> = {
  iOS: { icon: '🍎', label: 'iOS', color: '#007AFF' },
  Android: { icon: '🤖', label: 'Android', color: '#3DDC84' },
  PC: { icon: '💻', label: 'PC', color: '#6B7280' },
  Nintendo: { icon: '🎮', label: 'Nintendo', color: '#E60012' },
  PlayStation: { icon: '🎯', label: 'PlayStation', color: '#003791' },
  Xbox: { icon: '🟢', label: 'Xbox', color: '#107C10' },
  Web: { icon: '🌐', label: 'Web', color: '#4F46E5' },
};

// ============================================================================
// AGE GROUP COLORS
// ============================================================================

const ageGroupColors: Record<string, { bg: string; text: string; border: string }> = {
  '0-3': { bg: '#FFD1DC', text: '#8B4563', border: '#FFB6C1' },
  '3-6': { bg: '#BAFFC9', text: '#2D6A4F', border: '#95D5A6' },
  '7+': { bg: '#BAE1FF', text: '#1D4E89', border: '#8ECAE6' },
};

function getAgeGroupColor(minAge: number) {
  if (minAge <= 3) return ageGroupColors['0-3'];
  if (minAge <= 6) return ageGroupColors['3-6'];
  return ageGroupColors['7+'];
}

// ============================================================================
// DANISH FLAG SVG COMPONENT
// ============================================================================

function DanishFlag({ className }: { className?: string }) {
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

interface QuickBadge {
  label: string;
  emoji: string | React.ReactNode;
  show: boolean;
  color: { bg: string; text: string };
}

function QuickBadges({ badges }: { badges: QuickBadge[] }) {
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
// PLATFORM ICONS DISPLAY
// ============================================================================

function PlatformIcons({ platforms }: { platforms: Platform[] }) {
  if (!platforms || platforms.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {platforms.slice(0, 4).map((platform) => {
        const info = platformIcons[platform];
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

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
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
// AGE INDICATOR (Visual)
// ============================================================================

function AgeIndicator({ minAge, maxAge }: { minAge: number; maxAge: number }) {
  const colors = getAgeGroupColor(minAge);
  const ageEmojis: Record<string, string> = {
    '0-3': '👶',
    '3-6': '🧒',
    '7+': '👦',
  };

  let ageGroup = '0-3';
  if (minAge <= 3) ageGroup = '0-3';
  else if (minAge <= 6) ageGroup = '3-6';
  else ageGroup = '7+';

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-transform hover:scale-105"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        boxShadow: `0 2px 0 0 ${colors.border}`,
      }}
    >
      <span>{ageEmojis[ageGroup]}</span>
      <span>{getAgeLabel(minAge, maxAge)}</span>
    </div>
  );
}

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
                    <span className="text-xs text-[#9CA3AF]">
                      +{parsedCategories.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-300 group-hover:border-primary/30 pointer-events-none" />
          </article>
        </Link>
      </div>
    );
  }
);

GameCard.displayName = 'GameCard';

// ============================================================================
// COMPACT GAME CARD (For sidebars, related games)
// ============================================================================

export interface CompactGameCardProps {
  slug: string;
  title: string;
  type: 'digital' | 'board';
  minAge: number;
  maxAge: number;
  iconUrl?: string | null;
  imageUrl?: string | null;
  rating: number;
  className?: string;
}

export function CompactGameCard({
  slug,
  title,
  type,
  minAge,
  maxAge,
  iconUrl,
  imageUrl,
  rating,
  className,
}: CompactGameCardProps) {
  const href = type === 'digital' ? `/spil/${slug}` : `/braetspil/${slug}`;
  // Fall back to slug-based image path if iconUrl/imageUrl is null
  const displayImage = type === 'digital'
    ? (iconUrl || `/images/games/digital/${slug}.jpg`)
    : (imageUrl || `/images/games/board/${slug}.jpg`);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl',
        'bg-[#FFFCF7] shadow-sm',
        'transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#A2D2FF] to-[#CDB4DB]">
        <CompactGameImageWithFallback
          src={displayImage}
          alt={title}
          type={type}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-[#4A4A4A] truncate">{title}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[#7A7A7A]">{getAgeLabel(minAge, maxAge)}</span>
          <StarRating rating={rating} size="sm" />
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
