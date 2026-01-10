'use client';

import { cn } from '@/lib/utils';

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

const providerConfig: Record<AffiliateProvider, {
  name: string;
  icon: string;
  bgColor: string;
  hoverColor: string;
  textColor: string;
}> = {
  apple: {
    name: 'App Store',
    icon: '🍎',
    bgColor: 'bg-black',
    hoverColor: 'hover:bg-[#333333]',
    textColor: 'text-white',
  },
  google: {
    name: 'Google Play',
    icon: '🤖',
    bgColor: 'bg-[#3DDC84]',
    hoverColor: 'hover:bg-[#2BC472]',
    textColor: 'text-white',
  },
  amazon: {
    name: 'Amazon',
    icon: '📦',
    bgColor: 'bg-[#FF9900]',
    hoverColor: 'hover:bg-[#E88A00]',
    textColor: 'text-white',
  },
  coolshop: {
    name: 'Coolshop',
    icon: '🛒',
    bgColor: 'bg-[#00A0E3]',
    hoverColor: 'hover:bg-[#0090CC]',
    textColor: 'text-white',
  },
  proshop: {
    name: 'Proshop',
    icon: '🛍️',
    bgColor: 'bg-[#E31837]',
    hoverColor: 'hover:bg-[#CC1530]',
    textColor: 'text-white',
  },
  saxo: {
    name: 'Saxo',
    icon: '📚',
    bgColor: 'bg-[#1A1A1A]',
    hoverColor: 'hover:bg-[#333333]',
    textColor: 'text-white',
  },
  website: {
    name: 'Officiel hjemmeside',
    icon: '🌐',
    bgColor: 'bg-[#4F46E5]',
    hoverColor: 'hover:bg-[#4338CA]',
    textColor: 'text-white',
  },
  other: {
    name: 'Køb her',
    icon: '🔗',
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
        <span className="text-xl">{config.icon}</span>
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
      <span className="text-xl">{config.icon}</span>
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
          <span>📥</span>
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
