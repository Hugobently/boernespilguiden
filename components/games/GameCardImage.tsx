'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';

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
}

export function GameImageWithFallback({
  src,
  alt,
  title,
  type,
  slug,
  fill = true,
  className,
}: GameImageWithFallbackProps) {
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
