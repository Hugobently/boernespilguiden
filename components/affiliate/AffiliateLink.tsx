'use client';

import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

// ============================================================================
// AFFILIATE LINK TYPES
// ============================================================================

export type AffiliateProvider =
  | 'apple'      // Apple App Store
  | 'google'     // Google Play Store
  | 'amazon'     // Amazon (board games)
  | 'coolshop'   // Coolshop.dk
  | 'proshop'    // Proshop.dk
  | 'saxo'       // Saxo.com
  | 'website'    // Generic website
  | 'other';

interface AffiliateLinkProps {
  href: string;
  provider: AffiliateProvider;
  gameTitle: string;
  gameSlug: string;
  className?: string;
  children?: React.ReactNode;
  variant?: 'button' | 'text' | 'icon';
}

// ============================================================================
// PROVIDER CONFIG
// ============================================================================

/** Officielle butiks-logoer som inline SVG (samme greb som App Store-badges) */
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

const providerConfig: Record<AffiliateProvider, {
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
  textColor: string;
}> = {
  apple: {
    name: 'App Store',
    icon: <AppleLogo className="w-5 h-5" />,
    bgColor: 'bg-black',
    hoverColor: 'hover:bg-[#333333]',
    textColor: 'text-white',
  },
  google: {
    name: 'Google Play',
    icon: <GooglePlayLogo className="w-5 h-5" />,
    bgColor: 'bg-[#3DDC84]',
    hoverColor: 'hover:bg-[#2BC472]',
    textColor: 'text-white',
  },
  amazon: {
    name: 'Amazon',
    icon: <Icon name="tag" className="w-5 h-5" />,
    bgColor: 'bg-[#FF9900]',
    hoverColor: 'hover:bg-[#E88A00]',
    textColor: 'text-white',
  },
  coolshop: {
    name: 'Coolshop',
    icon: <Icon name="tag" className="w-5 h-5" />,
    bgColor: 'bg-[#00A0E3]',
    hoverColor: 'hover:bg-[#0090CC]',
    textColor: 'text-white',
  },
  proshop: {
    name: 'Proshop',
    icon: <Icon name="tag" className="w-5 h-5" />,
    bgColor: 'bg-[#E31837]',
    hoverColor: 'hover:bg-[#CC1530]',
    textColor: 'text-white',
  },
  saxo: {
    name: 'Saxo',
    icon: <Icon name="book" className="w-5 h-5" />,
    bgColor: 'bg-[#1A1A1A]',
    hoverColor: 'hover:bg-[#333333]',
    textColor: 'text-white',
  },
  website: {
    name: 'Officiel hjemmeside',
    icon: <Icon name="world" className="w-5 h-5" />,
    bgColor: 'bg-[#4F46E5]',
    hoverColor: 'hover:bg-[#4338CA]',
    textColor: 'text-white',
  },
  other: {
    name: 'Køb her',
    icon: <Icon name="arrow-right" className="w-5 h-5" />,
    bgColor: 'bg-[#6B7280]',
    hoverColor: 'hover:bg-[#4B5563]',
    textColor: 'text-white',
  },
};

// ============================================================================
// CLICK TRACKING
// ============================================================================

function trackAffiliateClick(
  provider: AffiliateProvider,
  gameSlug: string,
  gameTitle: string,
  href: string
) {
  // Track click for analytics
  // This can be expanded to send to your analytics service
  if (typeof window !== 'undefined') {
    // Log for debugging in development only
    if (process.env.NODE_ENV === 'development') {
      console.log('Affiliate click:', { provider, gameSlug, gameTitle, href });
    }

    // Google Analytics event (if GA is set up)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'affiliate_click', {
        event_category: 'affiliate',
        event_label: gameTitle,
        provider: provider,
        game_slug: gameSlug,
      });
    }

    // Custom analytics endpoint (can be implemented later)
    // fetch('/api/analytics/affiliate-click', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ provider, gameSlug, gameTitle, href, timestamp: Date.now() }),
    // }).catch(() => {}); // Fire and forget
  }
}

// ============================================================================
// AFFILIATE LINK COMPONENT
// ============================================================================

export function AffiliateLink({
  href,
  provider,
  gameTitle,
  gameSlug,
  className,
  children,
  variant = 'button',
}: AffiliateLinkProps) {
  const config = providerConfig[provider];

  const handleClick = () => {
    trackAffiliateClick(provider, gameSlug, gameTitle, href);
  };

  if (variant === 'text') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className={cn(
          'text-[#FFB5A7] hover:underline font-medium',
          className
        )}
      >
        {children || config.name}
      </a>
    );
  }

  if (variant === 'icon') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        title={`${config.name} - ${gameTitle}`}
        className={cn(
          'inline-flex items-center justify-center w-10 h-10 rounded-xl',
          config.bgColor,
          config.hoverColor,
          'transition-all hover:shadow-lg',
          className
        )}
      >
        <span className="inline-flex items-center justify-center">{config.icon}</span>
      </a>
    );
  }

  // Default button variant
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={cn(
        'flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-semibold',
        config.bgColor,
        config.hoverColor,
        config.textColor,
        'transition-all hover:shadow-lg',
        className
      )}
    >
      <span className="inline-flex items-center justify-center">{config.icon}</span>
      <span>{children || config.name}</span>
    </a>
  );
}

// ============================================================================
// AFFILIATE LINKS GROUP
// ============================================================================

interface AffiliateLinkData {
  url: string;
  provider: AffiliateProvider;
  label?: string;
}

interface AffiliateLinksGroupProps {
  links: AffiliateLinkData[];
  gameTitle: string;
  gameSlug: string;
  title?: string;
  className?: string;
}

export function AffiliateLinksGroup({
  links,
  gameTitle,
  gameSlug,
  title = 'Hent spillet',
  className,
}: AffiliateLinksGroupProps) {
  if (links.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {title && (
        <h3 className="font-bold text-lg text-[#4A4A4A] flex items-center gap-2">
          <Icon name="download" className="w-5 h-5 text-[#C2410C]" />
          <span>{title}</span>
        </h3>
      )}
      <div className="space-y-2">
        {links.map((link) => (
          <AffiliateLink
            key={`${link.provider}-${link.url}`}
            href={link.url}
            provider={link.provider}
            gameTitle={gameTitle}
            gameSlug={gameSlug}
          >
            {link.label}
          </AffiliateLink>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// HELPER: Build affiliate links from game data
// ============================================================================

export function buildAffiliateLinks(game: {
  appStoreUrl?: string | null;
  playStoreUrl?: string | null;
  websiteUrl?: string | null;
  amazonUrl?: string | null;
  affiliateUrl?: string | null;
  affiliateProvider?: string | null;
}): AffiliateLinkData[] {
  const links: AffiliateLinkData[] = [];

  // Add affiliate link first if available
  if (game.affiliateUrl && game.affiliateProvider) {
    links.push({
      url: game.affiliateUrl,
      provider: game.affiliateProvider as AffiliateProvider,
    });
  }

  // App Store
  if (game.appStoreUrl) {
    links.push({
      url: game.appStoreUrl,
      provider: 'apple',
    });
  }

  // Play Store
  if (game.playStoreUrl) {
    links.push({
      url: game.playStoreUrl,
      provider: 'google',
    });
  }

  // Amazon (for board games)
  if (game.amazonUrl) {
    links.push({
      url: game.amazonUrl,
      provider: 'amazon',
    });
  }

  // Website
  if (game.websiteUrl) {
    links.push({
      url: game.websiteUrl,
      provider: 'website',
    });
  }

  return links;
}

// ============================================================================
// TYPE DECLARATION FOR GTAG
// ============================================================================

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}
