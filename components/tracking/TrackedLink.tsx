'use client';

import { useCallback, ReactNode } from 'react';
import Link from 'next/link';
import { trackGameClick, trackAffiliateClick } from '@/lib/analytics';
import { Icon } from '@/components/ui/Icon';

/** Officielle butiks-logoer som inline SVG */
function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.4 1.7c.1 1-.3 2-.9 2.8-.7.8-1.7 1.4-2.7 1.3-.1-1 .4-2 1-2.7.6-.8 1.7-1.4 2.6-1.4zM19 17.3c-.5 1.1-.7 1.6-1.3 2.6-.9 1.4-2.1 3.1-3.6 3.1-1.3 0-1.7-.9-3.5-.8-1.8 0-2.2.8-3.5.8-1.5 0-2.7-1.6-3.5-2.9-2.4-3.7-2.6-8-1.2-10.3 1-1.6 2.6-2.6 4.1-2.6 1.5 0 2.5.9 3.8.9 1.2 0 2-.9 3.8-.9 1.3 0 2.7.7 3.7 2-3.2 1.8-2.7 6.4 1 8.1z" />
    </svg>
  );
}

function GooglePlayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3.6 2.3c-.3.3-.4.7-.4 1.3v16.8c0 .6.1 1 .4 1.3l.1.1 9.4-9.4v-.2L3.7 2.2l-.1.1z" />
      <path d="M16.3 15.2l-3.2-3.2v-.2l3.2-3.2.1.1 3.8 2.1c1.1.6 1.1 1.6 0 2.2l-3.8 2.2-.1.1z" />
    </svg>
  );
}

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
          <AppleLogo className="w-5 h-5" />
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
          <GooglePlayLogo className="w-5 h-5" />
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
          <Icon name="world" className="w-5 h-5" />
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
          <Icon name="tag" className="w-5 h-5" />
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
          <Icon name="coins" className="w-5 h-5" />
          <span>Find bedste pris</span>
        </TrackedAffiliateLink>
      )}
    </div>
  );
}

export default TrackedGameLink;
