import { unstable_cache } from 'next/cache';
import prisma from './db';

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

// Cache tags for invalidation
export const CacheTags = {
  ALL_GAMES: 'all-games',
  ALL_BOARD_GAMES: 'all-board-games',
  GAME: (slug: string) => `game-${slug}`,
  BOARD_GAME: (slug: string) => `board-game-${slug}`,
  CATEGORY: (ageGroup: string) => `category-${ageGroup}`,
  FEATURED: 'featured',
  EDITOR_CHOICE: 'editor-choice',
  SEARCH: 'search',
} as const;

// Cache durations in seconds
export const CacheDurations = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// ============================================================================
// CACHED DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Get all digital games with caching
 */
export const getCachedGames = unstable_cache(
  async () => {
    return prisma.game.findMany({
      orderBy: [{ editorChoice: 'desc' }, { featured: 'desc' }, { rating: 'desc' }],
    });
  },
  ['all-games'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.ALL_GAMES],
  }
);

/**
 * Get all board games with caching
 */
export const getCachedBoardGames = unstable_cache(
  async () => {
    return prisma.boardGame.findMany({
      orderBy: [{ editorChoice: 'desc' }, { featured: 'desc' }, { rating: 'desc' }],
    });
  },
  ['all-board-games'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.ALL_BOARD_GAMES],
  }
);

/**
 * Get a single digital game by slug
 */
export const getCachedGameBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.game.findUnique({
      where: { slug },
    });
  },
  ['game-by-slug'],
  {
    revalidate: CacheDurations.LONG,
    tags: [CacheTags.ALL_GAMES],
  }
);

/**
 * Get a single board game by slug
 */
export const getCachedBoardGameBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.boardGame.findUnique({
      where: { slug },
    });
  },
  ['board-game-by-slug'],
  {
    revalidate: CacheDurations.LONG,
    tags: [CacheTags.ALL_BOARD_GAMES],
  }
);

/**
 * Get featured/editor's choice games
 */
export const getCachedFeaturedGames = unstable_cache(
  async (limit: number = 6) => {
    return prisma.game.findMany({
      where: { editorChoice: true },
      orderBy: { rating: 'desc' },
      take: limit,
    });
  },
  ['featured-games'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.FEATURED, CacheTags.EDITOR_CHOICE],
  }
);

/**
 * Get ad-free games
 */
export const getCachedAdFreeGames = unstable_cache(
  async (limit: number = 4) => {
    return prisma.game.findMany({
      where: {
        hasAds: false,
        hasInAppPurchases: false,
        rating: { gte: 4 },
      },
      orderBy: { rating: 'desc' },
      take: limit,
    });
  },
  ['ad-free-games'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.ALL_GAMES],
  }
);

/**
 * Get featured board games
 */
export const getCachedFeaturedBoardGames = unstable_cache(
  async (limit: number = 4) => {
    return prisma.boardGame.findMany({
      where: { OR: [{ editorChoice: true }, { featured: true }] },
      orderBy: { rating: 'desc' },
      take: limit,
    });
  },
  ['featured-board-games'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.FEATURED, CacheTags.ALL_BOARD_GAMES],
  }
);

/**
 * Get games by age group
 */
export const getCachedGamesByAgeGroup = unstable_cache(
  async (ageGroup: string, limit?: number) => {
    const [minAge, maxAge] = ageGroup.split('-').map(Number);

    return prisma.game.findMany({
      where: {
        OR: [
          { minAge: { lte: maxAge }, maxAge: { gte: minAge } },
          { ageGroup: ageGroup },
        ],
      },
      orderBy: [{ featured: 'desc' }, { editorChoice: 'desc' }, { rating: 'desc' }],
      take: limit,
    });
  },
  ['games-by-age-group'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.ALL_GAMES],
  }
);

/**
 * Get board games by age group
 */
export const getCachedBoardGamesByAgeGroup = unstable_cache(
  async (ageGroup: string, limit?: number) => {
    const [minAge, maxAge] = ageGroup.split('-').map(Number);

    return prisma.boardGame.findMany({
      where: {
        OR: [
          { minAge: { lte: maxAge }, maxAge: { gte: minAge } },
          { ageGroup: ageGroup },
        ],
      },
      orderBy: [{ featured: 'desc' }, { editorChoice: 'desc' }, { rating: 'desc' }],
      take: limit,
    });
  },
  ['board-games-by-age-group'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.ALL_BOARD_GAMES],
  }
);

/**
 * Get game counts by age group
 */
export const getCachedGameCountsByAge = unstable_cache(
  async () => {
    const [age0to3, age3to6, age7to10, age11plus] = await Promise.all([
      prisma.game.count({ where: { minAge: { lte: 3 } } }),
      prisma.game.count({ where: { minAge: { gte: 3, lte: 6 } } }),
      prisma.game.count({ where: { minAge: { gte: 7, lte: 10 } } }),
      prisma.game.count({ where: { minAge: { gte: 11 } } }),
    ]);

    return { '0-3': age0to3, '3-6': age3to6, '7-10': age7to10, '11-15': age11plus };
  },
  ['game-counts-by-age'],
  {
    revalidate: CacheDurations.LONG,
    tags: [CacheTags.ALL_GAMES],
  }
);

/**
 * Get related games
 */
export const getCachedRelatedGames = unstable_cache(
  async (gameId: string, categories: string[], ageGroup: string, limit: number = 4) => {
    return prisma.game.findMany({
      where: {
        AND: [
          { id: { not: gameId } },
          {
            OR: [
              { ageGroup: ageGroup },
              ...categories.map((cat) => ({ categories: { contains: cat } })),
            ],
          },
        ],
      },
      orderBy: [{ editorChoice: 'desc' }, { rating: 'desc' }],
      take: limit,
    });
  },
  ['related-games'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.ALL_GAMES],
  }
);

/**
 * Get related board games
 */
export const getCachedRelatedBoardGames = unstable_cache(
  async (gameId: string, categories: string[], ageGroup: string, limit: number = 4) => {
    return prisma.boardGame.findMany({
      where: {
        AND: [
          { id: { not: gameId } },
          {
            OR: [
              { ageGroup: ageGroup },
              ...categories.map((cat) => ({ categories: { contains: cat } })),
            ],
          },
        ],
      },
      orderBy: [{ editorChoice: 'desc' }, { rating: 'desc' }],
      take: limit,
    });
  },
  ['related-board-games'],
  {
    revalidate: CacheDurations.MEDIUM,
    tags: [CacheTags.ALL_BOARD_GAMES],
  }
);

// ============================================================================
// STATIC PARAMS GENERATION
// ============================================================================

/**
 * Generate static params for all digital games
 */
export async function generateGameStaticParams() {
  const games = await prisma.game.findMany({
    select: { slug: true },
  });
  return games.map((game) => ({ slug: game.slug }));
}

/**
 * Generate static params for all board games
 */
export async function generateBoardGameStaticParams() {
  const games = await prisma.boardGame.findMany({
    select: { slug: true },
  });
  return games.map((game) => ({ slug: game.slug }));
}

/**
 * Generate static params for age groups
 */
export function generateAgeGroupStaticParams() {
  return ['0-3', '3-6', '7-10', '11-15'].map((age) => ({ age }));
}
