'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn, getAgeLabel } from '@/lib/utils';
import { Platform } from '@/lib/types';
import { platformConfig } from '@/lib/config/platforms';
import { ageGroups } from '@/lib/config/age-groups';
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

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-[#A2D2FF]/30 to-[#CDB4DB]/30">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#4A4A4A] hover:bg-white transition-colors"
              aria-label="Forrige billede"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i < screenshots.length - 1 ? i + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#4A4A4A] hover:bg-white transition-colors"
              aria-label="Næste billede"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium">
          {activeIndex + 1} / {screenshots.length}
        </div>
      </div>

      {/* Thumbnails */}
      {screenshots.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {screenshots.map((src, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden transition-all',
                index === activeIndex
                  ? 'ring-2 ring-[#FFB5A7] ring-offset-2 scale-105'
                  : 'opacity-60 hover:opacity-100'
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

// ============================================================================
// LARGE RATING
// ============================================================================

export function LargeRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={cn(
              'text-2xl transition-colors',
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
      </div>
      <span className="text-2xl font-bold text-[#4A4A4A]">{rating.toFixed(1)}</span>
    </div>
  );
}

// ============================================================================
// PROS & CONS
// ============================================================================

interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Pros */}
      <div className="bg-[#D8F3DC]/30 rounded-3xl p-6 border border-[#95D5B2]/30">
        <h3 className="font-bold text-lg text-[#2D6A4F] mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#77DD77] flex items-center justify-center text-white">
            👍
          </span>
          <span>Det gode</span>
        </h3>
        <ul className="space-y-3">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#77DD77] flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[#4A4A4A]">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="bg-[#FFD1DC]/30 rounded-3xl p-6 border border-[#FFB6C1]/30">
        <h3 className="font-bold text-lg text-[#8B4563] mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-[#FF9AA2] flex items-center justify-center text-white">
            👎
          </span>
          <span>Det mindre gode</span>
        </h3>
        <ul className="space-y-3">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF9AA2] flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <span className="text-[#4A4A4A]">{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// PARENT TIP
// ============================================================================

interface ParentTipProps {
  tip: string;
  title?: string;
}

export function ParentTip({ tip, title = 'Tip til forældre' }: ParentTipProps) {
  return (
    <div className="relative bg-gradient-to-br from-[#FFE66D]/30 via-[#FFF3B0]/30 to-[#FFE66D]/20 rounded-3xl p-6 border-2 border-[#FFE66D]/50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FFE66D]/20 rounded-full blur-xl" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FFD93D]/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">💡</span>
          <h3 className="font-bold text-xl text-[#7D6608]">{title}</h3>
        </div>
        <p className="text-[#4A4A4A] text-lg leading-relaxed">{tip}</p>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-2 right-2 text-2xl opacity-20">✨</div>
    </div>
  );
}

// ============================================================================
// PLATFORM DOWNLOAD LINKS
// ============================================================================

interface PlatformLinksProps {
  platforms: Platform[];
  appStoreUrl?: string | null;
  playStoreUrl?: string | null;
  websiteUrl?: string | null;
}

export function PlatformLinks({
  platforms,
  appStoreUrl,
  playStoreUrl,
  websiteUrl,
}: PlatformLinksProps) {
  const links = [
    { platform: 'iOS' as Platform, url: appStoreUrl, label: 'App Store' },
    { platform: 'Android' as Platform, url: playStoreUrl, label: 'Google Play' },
    { platform: 'Web' as Platform, url: websiteUrl, label: 'Spil online' },
  ].filter((link) => link.url && platforms.includes(link.platform));

  if (links.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-[#4A4A4A] flex items-center gap-2">
        <span>📥</span>
        <span>Hent spillet</span>
      </h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const config = platformConfig[link.platform];
          return (
            <a
              key={link.platform}
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold',
                'bg-[#4A4A4A] text-white',
                'shadow-[0_4px_0_0_#2D2D2D]',
                'hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#2D2D2D]',
                'active:translate-y-0.5 active:shadow-[0_2px_0_0_#2D2D2D]',
                'transition-all duration-200'
              )}
            >
              <span className="text-xl">{config.icon}</span>
              <span>{link.label}</span>
              <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// GAME DETAIL HERO
// ============================================================================

interface GameDetailHeroProps {
  title: string;
  type: 'digital' | 'board';
  iconUrl?: string | null;
  imageUrl?: string | null;
  minAge: number;
  maxAge: number;
  rating: number;
  publisher?: string | null;
  releaseDate?: string | null;
  editorChoice?: boolean;
}

export function GameDetailHero({
  title,
  type,
  iconUrl,
  imageUrl,
  minAge,
  maxAge,
  rating,
  publisher,
  releaseDate,
  editorChoice,
}: GameDetailHeroProps) {
  const typeEmoji = type === 'digital' ? '🎮' : '🎲';
  const displayImage = type === 'digital' ? iconUrl : imageUrl;

  // Find matching age group using centralized config
  const ageGroup = ageGroups.find(group => {
    if (group.slug === '0-3') return minAge <= 3;
    if (group.slug === '3-6') return minAge > 3 && minAge <= 6;
    return minAge > 6;
  }) || ageGroups[2]; // Default to 7+

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Icon/Image */}
      <div className="relative flex-shrink-0">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-[#A2D2FF] via-[#CDB4DB] to-[#FFB5A7]">
          {displayImage ? (
            <Image src={displayImage} alt={title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl">{typeEmoji}</span>
            </div>
          )}
        </div>

        {/* Editor's choice badge */}
        {editorChoice && (
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#FFE66D] rounded-full shadow-lg flex items-center justify-center animate-bounce-slow">
            <span className="text-2xl">⭐</span>
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="flex-1">
        <h1 className="font-black text-4xl md:text-5xl text-[#4A4A4A] mb-4 leading-tight">
          {title}
        </h1>

        {/* Age and rating */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-sm"
            style={{
              backgroundColor: ageGroup.color.bg,
              color: ageGroup.color.text,
            }}
          >
            <span className="text-xl">{ageGroup.emoji}</span>
            <span>{getAgeLabel(minAge, maxAge)}</span>
          </div>
          <LargeRating rating={rating} />
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-[#7A7A7A]">
          {publisher && (
            <span className="inline-flex items-center gap-2">
              <span>🏢</span>
              <span>{publisher}</span>
            </span>
          )}
          {releaseDate && (
            <span className="inline-flex items-center gap-2 ml-4">
              <span>📅</span>
              <span>{new Date(releaseDate).toLocaleDateString('da-DK', { year: 'numeric', month: 'long' })}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
