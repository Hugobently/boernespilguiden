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
// OPEN GRAPH HELPER
// ============================================================================

interface OpenGraphInput {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
}

/**
 * Builds a complete openGraph object for generateMetadata/metadata exports.
 * Next.js replaces the whole openGraph object per page (no deep merge with the
 * root layout), so every page must carry siteName/locale/fallback image itself.
 */
export function buildOpenGraph({ title, description, url, type = 'website', images }: OpenGraphInput) {
  return {
    title,
    description,
    url,
    type,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images:
      images && images.length > 0
        ? images
        : [{ url: '/og-image.png', width: 1200, height: 630, alt: siteConfig.name }],
  };
}

// ============================================================================
// JSON-LD TYPES
// ============================================================================

interface ReviewNotes {
  '@type': 'ItemList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
  }>;
}

interface VideoGameJsonLd {
  '@context': 'https://schema.org';
  '@type': 'VideoGame';
  name: string;
  description: string;
  url: string;
  image?: string;
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
    positiveNotes?: ReviewNotes;
    negativeNotes?: ReviewNotes;
  };
}

interface BoardGameJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Game';
  name: string;
  description: string;
  url: string;
  image?: string;
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
    positiveNotes?: ReviewNotes;
    negativeNotes?: ReviewNotes;
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

function toAbsoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${siteConfig.url}${url}`;
}

function toReviewNotes(value: string | string[] | null | undefined): ReviewNotes | undefined {
  const items = Array.isArray(value) ? value : parseJsonArray<string>(value || '[]');
  if (items.length === 0) return undefined;
  return {
    '@type': 'ItemList',
    itemListElement: items.map((name, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
    })),
  };
}

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
  pros?: string | string[] | null;
  cons?: string | string[] | null;
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
    image: toAbsoluteUrl(game.iconUrl),
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
      reviewBody: game.description || game.shortDescription,
      positiveNotes: toReviewNotes(game.pros),
      negativeNotes: toReviewNotes(game.cons),
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
  pros?: string | string[] | null;
  cons?: string | string[] | null;
}): BoardGameJsonLd {
  const categories = parseJsonArray<string>(game.categories);

  return {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: game.title,
    description: game.description || game.shortDescription,
    url: `${siteConfig.url}/braetspil/${game.slug}`,
    image: toAbsoluteUrl(game.imageUrl),
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
      reviewBody: game.description || game.shortDescription,
      positiveNotes: toReviewNotes(game.pros),
      negativeNotes: toReviewNotes(game.cons),
    },
  };
}

interface MediaJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Movie' | 'TVSeries';
  name: string;
  alternateName?: string;
  description?: string;
  url: string;
  image?: string;
  inLanguage?: string;
  genre?: string[];
  datePublished?: string;
  numberOfSeasons?: number;
  typicalAgeRange?: string;
  review?: {
    '@type': 'Review';
    author: { '@type': 'Organization'; name: string };
    reviewBody: string;
  };
}

export function generateMediaJsonLd(media: {
  slug: string;
  type: string;
  title: string;
  originalTitle?: string | null;
  description?: string | null;
  review?: string | null;
  posterUrl?: string | null;
  releaseDate?: Date | null;
  seasons?: number | null;
  ageMin?: number | null;
  ageMax?: number | null;
  genres?: string[];
  hasDanishAudio?: boolean | null;
}): MediaJsonLd {
  const isMovie = media.type === 'MOVIE';
  return {
    '@context': 'https://schema.org',
    '@type': isMovie ? 'Movie' : 'TVSeries',
    name: media.title,
    alternateName:
      media.originalTitle && media.originalTitle !== media.title ? media.originalTitle : undefined,
    description: media.description || undefined,
    url: `${siteConfig.url}/film-serier/${media.slug}`,
    image: toAbsoluteUrl(media.posterUrl),
    inLanguage: media.hasDanishAudio ? 'da' : undefined,
    genre: media.genres && media.genres.length > 0 ? media.genres : undefined,
    datePublished: media.releaseDate ? media.releaseDate.toISOString().split('T')[0] : undefined,
    numberOfSeasons: !isMovie && media.seasons ? media.seasons : undefined,
    typicalAgeRange:
      media.ageMin != null && media.ageMax != null ? `${media.ageMin}-${media.ageMax}` : undefined,
    review: media.review
      ? {
          '@type': 'Review',
          author: { '@type': 'Organization', name: siteConfig.name },
          reviewBody: media.review,
        }
      : undefined,
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
    logo: `${siteConfig.url}/icon-512.png`,
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
