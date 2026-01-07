'use client';

import { useCallback, ReactNode } from 'react';
import Link from 'next/link';
import { trackGameClick, trackAffiliateClick } from '@/lib/analytics';

// ============================================================================
// TRACKED GAME LINK
// ============================================================================

interface TrackedGameLinkProps {
  href: string;
  gameSlug: string;
  gameTitle: string;
  gameType: 'digital' | 'board';
  source: 'card' | 'search' | 'related' | 'featured' | 'category';
  position?: number;
  children: ReactNode;
  className?: string;
}

export function TrackedGameLink({
  href,
  gameSlug,
  gameTitle,
  gameType,
  source,
  position,
  children,
  className,
}: TrackedGameLinkProps) {
  const handleClick = useCallback(() => {
    trackGameClick({
      gameSlug,
      gameTitle,
      gameType,
      source,
      position,
    });
  }, [gameSlug, gameTitle, gameType, source, position]);

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

// ============================================================================
// TRACKED AFFILIATE LINK
// ============================================================================

interface TrackedAffiliateLinkProps {
  href: string;
  gameSlug: string;
  gameTitle: string;
  platform: 'appstore' | 'playstore' | 'amazon' | 'affiliate' | 'website';
  children: ReactNode;
  className?: string;
}

export function TrackedAffiliateLink({
  href,
  gameSlug,
  gameTitle,
  platform,
  children,
  className,
}: TrackedAffiliateLinkProps) {
  const handleClick = useCallback(() => {
    trackAffiliateClick({
      gameSlug,
      gameTitle,
      platform,
      url: href,
    });
  }, [gameSlug, gameTitle, platform, href]);

  return (
    <a
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

// ============================================================================
// DOWNLOAD BUTTONS WITH TRACKING
// ============================================================================

interface DownloadButtonProps {
  gameSlug: string;
  gameTitle: string;
  appStoreUrl?: string | null;
  playStoreUrl?: string | null;
  websiteUrl?: string | null;
  amazonUrl?: string | null;
  affiliateUrl?: string | null;
}

export function DownloadButtons({
  gameSlug,
  gameTitle,
  appStoreUrl,
  playStoreUrl,
  websiteUrl,
  amazonUrl,
  affiliateUrl,
}: DownloadButtonProps) {
  return (
    <div className="space-y-3">
      {appStoreUrl && (
        <TrackedAffiliateLink
          href={appStoreUrl}
          gameSlug={gameSlug}
          gameTitle={gameTitle}
          platform="appstore"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#000000] text-white font-semibold hover:bg-[#333333] transition-all hover:shadow-lg"
        >
          <span className="text-xl">🍎</span>
          <span>Download på App Store</span>
        </TrackedAffiliateLink>
      )}

      {playStoreUrl && (
        <TrackedAffiliateLink
          href={playStoreUrl}
          gameSlug={gameSlug}
          gameTitle={gameTitle}
          platform="playstore"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#3DDC84] text-white font-semibold hover:bg-[#2BC472] transition-all hover:shadow-lg"
        >
          <span className="text-xl">🤖</span>
          <span>Download på Google Play</span>
        </TrackedAffiliateLink>
      )}

      {websiteUrl && (
        <TrackedAffiliateLink
          href={websiteUrl}
          gameSlug={gameSlug}
          gameTitle={gameTitle}
          platform="website"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] transition-all hover:shadow-lg"
        >
          <span className="text-xl">🌐</span>
          <span>Besøg hjemmeside</span>
        </TrackedAffiliateLink>
      )}

      {amazonUrl && (
        <TrackedAffiliateLink
          href={amazonUrl}
          gameSlug={gameSlug}
          gameTitle={gameTitle}
          platform="amazon"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#FF9900] text-white font-semibold hover:bg-[#E68A00] transition-all hover:shadow-lg"
        >
          <span className="text-xl">🛒</span>
          <span>Køb på Amazon</span>
        </TrackedAffiliateLink>
      )}

      {affiliateUrl && (
        <TrackedAffiliateLink
          href={affiliateUrl}
          gameSlug={gameSlug}
          gameTitle={gameTitle}
          platform="affiliate"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#5B4670] text-white font-semibold hover:bg-[#4A3660] transition-all hover:shadow-lg"
        >
          <span className="text-xl">🎁</span>
          <span>Find bedste pris</span>
        </TrackedAffiliateLink>
      )}
    </div>
  );
}

export default TrackedGameLink;
