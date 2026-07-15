'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// ============================================================================
// SCREENSHOT GALLERY
// ============================================================================

interface ScreenshotGalleryProps {
  screenshots: string[];
  title: string;
}

export function ScreenshotGallery({ screenshots, title }: ScreenshotGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations('gameDetail');

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main image */}
      <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#A2D2FF]/30 to-[#CDB4DB]/30">
        <Image
          src={screenshots[activeIndex]}
          alt={`${title} screenshot ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority
        />

        {/* Navigation arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i > 0 ? i - 1 : screenshots.length - 1))}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#4A4A4A] hover:bg-white transition-colors active:scale-95"
              aria-label={t('previousImage')}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i < screenshots.length - 1 ? i + 1 : 0))}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#4A4A4A] hover:bg-white transition-colors active:scale-95"
              aria-label={t('nextImage')}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 px-2.5 sm:px-3 py-1 rounded-full bg-black/50 text-white text-xs sm:text-sm font-medium">
          {activeIndex + 1} / {screenshots.length}
        </div>
      </div>

      {/* Thumbnails */}
      {screenshots.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {screenshots.map((src, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden transition-all',
                index === activeIndex
                  ? 'ring-2 ring-[#FFB5A7] ring-offset-2 scale-105'
                  : 'opacity-60 hover:opacity-100 active:opacity-100'
              )}
            >
              <Image src={src} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
