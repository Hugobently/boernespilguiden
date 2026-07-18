'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';

// ============================================================================
// IMAGE FORMAT HELPERS
// ============================================================================

const IMAGE_FORMATS = ['jpg', 'webp', 'png', 'svg'] as const;

function getImagePath(slug: string, type: 'digital' | 'board', format: string): string {
  return `/images/games/${type}/${slug}.${format}`;
}

// ============================================================================
// GAME IMAGE WITH FALLBACK
// ============================================================================

interface GameImageWithFallbackProps {
  src: string;
  alt: string;
  title: string;
  type: 'digital' | 'board';
  slug?: string;
  fill?: boolean;
  className?: string;
  /** Set for above-the-fold cards so the image loads eagerly (better LCP) */
  priority?: boolean;
  /** App-store-style: centered rounded square instead of cropped cover.
      Square app icons must never be cropped to a wide format. */
  squircle?: boolean;
}

export function GameImageWithFallback({
  src,
  alt,
  title,
  type,
  slug,
  fill = true,
  className,
  priority = false,
  squircle = false,
}: GameImageWithFallbackProps) {
  const [formatIndex, setFormatIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

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
        <Icon name={type === 'digital' ? 'gamepad' : 'dice'} className="w-10 h-10 mb-2 text-[#4A443C]/60" />
        <span className="text-sm font-semibold text-[#4A4A4A]/80 line-clamp-2">
          {title}
        </span>
      </div>
    );
  }

  if (squircle) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[68%] aspect-square rounded-[22.5%] overflow-hidden bg-white shadow-[0_8px_20px_-6px_rgba(46,40,34,0.35)] transition-transform duration-300 ease-out group-hover:scale-105">
          <Image
            src={currentSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 40vw, 20vw"
            {...(priority ? { priority: true } : { loading: 'lazy' as const })}
            onError={handleError}
          />
        </div>
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
      {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      onError={handleError}
    />
  );
}

// ============================================================================
// COMPACT VERSION FOR THUMBNAILS
// ============================================================================

interface CompactGameImageWithFallbackProps {
  src: string;
  alt: string;
  type: 'digital' | 'board';
}

export function CompactGameImageWithFallback({
  src,
  alt,
  type,
}: CompactGameImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon name={type === 'digital' ? 'gamepad' : 'dice'} className="w-7 h-7 text-[#4A443C]/60" />
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
