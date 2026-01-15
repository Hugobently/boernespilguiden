import { parseJsonArray, Platform } from './types';

// ============================================================================
// SITE CONFIGURATION
// ============================================================================

export const siteConfig = {
  name: 'Børnespilguiden',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://xn--brnespilguiden-qqb.dk',
  description:
    'Find de bedste digitale spil og brætspil til børn i alle aldre. Ærlige anmeldelser med fokus på sikkerhed, læring og sjov.',
  author: 'Børnespilguiden',
  locale: 'da_DK',
  language: 'da',
};

// ============================================================================
// JSON-LD TYPES
// ============================================================================

interface VideoGameJsonLd {
  '@context': 'https://schema.org';
  '@type': 'VideoGame';
  name: string;
  description: string;
  url: string;
  image?: string;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
    ratingCount: number;
  };
  author?: {
    '@type': 'Organization';
    name: string;
  };
  genre?: string[];
  gamePlatform?: string[];
  contentRating?: string;
  applicationCategory?: string;
  offers?: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
  };
  review?: {
    '@type': 'Review';
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
      bestRating: number;
    };
    author: {
      '@type': 'Organization';
      name: string;
    };
    reviewBody?: string;
  };
}

interface BoardGameJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Game';
  name: string;
  description: string;
  url: string;
  image?: string;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
    ratingCount: number;
  };
  genre?: string[];
  numberOfPlayers?: {
    '@type': 'QuantitativeValue';
    minValue: number;
    maxValue: number;
  };
  typicalAgeRange?: string;
  review?: {
    '@type': 'Review';
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
      bestRating: number;
    };
    author: {
      '@type': 'Organization';
      name: string;
    };
    reviewBody?: string;
  };
}

interface WebsiteJsonLd {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  inLanguage: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface BreadcrumbJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

interface OrganizationJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  description: string;
  sameAs?: string[];
}

// ============================================================================
// JSON-LD GENERATORS
// ============================================================================

export function generateVideoGameJsonLd(game: {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  iconUrl?: string | null;
  rating: number;
  developerName?: string | null;
  categories: string;
  platforms: string;
  minAge: number;
  maxAge: number;
  price: number;
  priceModel?: string | null;
}): VideoGameJsonLd {
  const categories = parseJsonArray<string>(game.categories);
  const platforms = parseJsonArray<Platform>(game.platforms);

  const platformMapping: Record<Platform, string> = {
    iOS: 'iOS',
    Android: 'Android',
    PC: 'PC',
    Nintendo: 'Nintendo Switch',
    PlayStation: 'PlayStation',
    Xbox: 'Xbox',
    Web: 'Web Browser',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description || game.shortDescription,
    url: `${siteConfig.url}/spil/${game.slug}`,
    image: game.iconUrl || undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    },
    author: game.developerName
      ? {
          '@type': 'Organization',
          name: game.developerName,
        }
      : undefined,
    genre: categories.length > 0 ? categories : undefined,
    gamePlatform: platforms.length > 0 ? platforms.map((p) => platformMapping[p] || p) : undefined,
    contentRating: `${game.minAge}+`,
    applicationCategory: 'Game',
    offers: {
      '@type': 'Offer',
      price: game.price,
      priceCurrency: 'DKK',
      availability: 'https://schema.org/InStock',
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: game.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
      reviewBody: game.shortDescription,
    },
  };
}

export function generateBoardGameJsonLd(game: {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl?: string | null;
  rating: number;
  categories: string;
  minAge: number;
  maxAge: number;
  minPlayers: number;
  maxPlayers: number;
}): BoardGameJsonLd {
  const categories = parseJsonArray<string>(game.categories);

  return {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: game.title,
    description: game.description || game.shortDescription,
    url: `${siteConfig.url}/braetspil/${game.slug}`,
    image: game.imageUrl || undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 1,
    },
    genre: categories.length > 0 ? categories : undefined,
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      minValue: game.minPlayers,
      maxValue: game.maxPlayers,
    },
    typicalAgeRange: `${game.minAge}-${game.maxAge}`,
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: game.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
      reviewBody: game.shortDescription,
    },
  };
}

export function generateWebsiteJsonLd(): WebsiteJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/soeg?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationJsonLd(): OrganizationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
  };
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>
): BreadcrumbJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${siteConfig.url}${item.url}` : undefined,
    })),
  };
}

// ============================================================================
// JSON-LD COMPONENT
// ============================================================================

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Array<Record<string, any>>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// ============================================================================
// COMBINED JSON-LD FOR GAME PAGES
// ============================================================================

export function GameJsonLd({
  game,
  type,
}: {
  game: Parameters<typeof generateVideoGameJsonLd>[0] | Parameters<typeof generateBoardGameJsonLd>[0];
  type: 'digital' | 'board';
}) {
  const jsonLd =
    type === 'digital'
      ? generateVideoGameJsonLd(game as Parameters<typeof generateVideoGameJsonLd>[0])
      : generateBoardGameJsonLd(game as Parameters<typeof generateBoardGameJsonLd>[0]);

  return <JsonLd data={jsonLd} />;
}

// ============================================================================
// WEBSITE JSON-LD (FOR HOMEPAGE)
// ============================================================================

export function WebsiteJsonLdScript() {
  const websiteJsonLd = generateWebsiteJsonLd();
  const organizationJsonLd = generateOrganizationJsonLd();

  return <JsonLd data={[websiteJsonLd, organizationJsonLd]} />;
}
