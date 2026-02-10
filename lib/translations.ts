import prisma from './db';
import { Game, BoardGame, GameTranslation, BoardGameTranslation } from '@prisma/client';
import { parseJsonArray } from './types';

// Default locale
export const DEFAULT_LOCALE = 'da';

// Supported locales
export const SUPPORTED_LOCALES = ['da', 'en', 'fr', 'es'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// ============================================================================
// TYPES
// ============================================================================

export type GameWithTranslation = Game & {
  translations: GameTranslation[];
};

export type BoardGameWithTranslation = BoardGame & {
  translations: BoardGameTranslation[];
};

export type TranslatedGame = Omit<Game, 'title' | 'description' | 'shortDescription' | 'pros' | 'cons' | 'parentTip'> & {
  title: string;
  description: string;
  shortDescription: string;
  pros: string[];
  cons: string[];
  parentTip: string | null;
};

export type TranslatedBoardGame = Omit<BoardGame, 'title' | 'description' | 'shortDescription' | 'pros' | 'cons' | 'parentTip'> & {
  title: string;
  description: string;
  shortDescription: string;
  pros: string[];
  cons: string[];
  parentTip: string | null;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Apply translation to a game object
 * Falls back to original (Danish) content if translation doesn't exist
 */
export function applyGameTranslation(
  game: GameWithTranslation,
  locale: string
): TranslatedGame {
  const translation = game.translations.find((t) => t.locale === locale);

  if (translation) {
    return {
      ...game,
      title: translation.title,
      description: translation.description,
      shortDescription: translation.shortDescription,
      pros: parseJsonArray<string>(translation.pros),
      cons: parseJsonArray<string>(translation.cons),
      parentTip: translation.parentTip,
    };
  }

  // Fallback to original Danish content
  return game;
}

/**
 * Apply translation to a board game object
 * Falls back to original (Danish) content if translation doesn't exist
 */
export function applyBoardGameTranslation(
  game: BoardGameWithTranslation,
  locale: string
): TranslatedBoardGame {
  const translation = game.translations.find((t) => t.locale === locale);

  if (translation) {
    return {
      ...game,
      title: translation.title,
      description: translation.description,
      shortDescription: translation.shortDescription,
      pros: parseJsonArray<string>(translation.pros),
      cons: parseJsonArray<string>(translation.cons),
      parentTip: translation.parentTip,
    };
  }

  // Fallback to original Danish content
  return game;
}

// ============================================================================
// DATABASE QUERIES WITH TRANSLATIONS
// ============================================================================

/**
 * Get a single game with translations
 */
export async function getGameWithTranslation(slug: string, locale: string) {
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { locale },
      },
    },
  });

  if (!game) return null;

  return applyGameTranslation(game, locale);
}

/**
 * Get multiple games with translations
 */
export async function getGamesWithTranslation(
  options: {
    where?: object;
    orderBy?: object;
    take?: number;
    skip?: number;
  },
  locale: string
) {
  const games = await prisma.game.findMany({
    where: options.where,
    orderBy: options.orderBy,
    take: options.take,
    skip: options.skip,
    include: {
      translations: {
        where: { locale },
      },
    },
  });

  return games.map((game) => applyGameTranslation(game, locale));
}

/**
 * Get a single board game with translations
 */
export async function getBoardGameWithTranslation(slug: string, locale: string) {
  const game = await prisma.boardGame.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { locale },
      },
    },
  });

  if (!game) return null;

  return applyBoardGameTranslation(game, locale);
}

/**
 * Get multiple board games with translations
 */
export async function getBoardGamesWithTranslation(
  options: {
    where?: object;
    orderBy?: object;
    take?: number;
    skip?: number;
  },
  locale: string
) {
  const games = await prisma.boardGame.findMany({
    where: options.where,
    orderBy: options.orderBy,
    take: options.take,
    skip: options.skip,
    include: {
      translations: {
        where: { locale },
      },
    },
  });

  return games.map((game) => applyBoardGameTranslation(game, locale));
}

// ============================================================================
// HOMEPAGE DATA WITH TRANSLATIONS
// ============================================================================

export async function getHomepageDataWithTranslation(locale: string) {
  const [editorChoiceGames, adFreeGames, featuredBoardGames, featuredMedia, allGameAges, mediaCount] =
    await Promise.all([
      // Editor's Choice - digital games (prioritize Danish + younger kids)
      prisma.game.findMany({
        where: { editorChoice: true },
        orderBy: [
          { supportsDanish: 'desc' },
          { minAge: 'asc' },
          { rating: 'desc' },
        ],
        take: 6,
        include: {
          translations: {
            where: { locale },
          },
        },
      }),
      // Ad-free favorites
      prisma.game.findMany({
        where: {
          hasAds: false,
          hasInAppPurchases: false,
          rating: { gte: 4 },
        },
        orderBy: { rating: 'desc' },
        take: 4,
        include: {
          translations: {
            where: { locale },
          },
        },
      }),
      // Featured board games
      prisma.boardGame.findMany({
        where: { OR: [{ editorChoice: true }, { featured: true }] },
        orderBy: { rating: 'desc' },
        take: 4,
        include: {
          translations: {
            where: { locale },
          },
        },
      }),
      // Featured Film & Serier (AI-enhanced items with high quality)
      prisma.media.findMany({
        where: {
          parentInfo: { not: null }, // Only AI-enhanced items
        },
        orderBy: { releaseDate: 'desc' },
        take: 4,
        select: {
          id: true,
          slug: true,
          title: true,
          posterUrl: true,
          type: true,
          isDanish: true,
          streamingInfo: {
            select: {
              provider: true,
              isFree: true,
            },
          },
        },
      }),
      // Get all game ages in one query, count in JS (1 query instead of 4)
      prisma.game.findMany({ select: { minAge: true } }),
      // Count total media items
      prisma.media.count(),
    ]);

  // Count games by age group in JS (from single query result)
  const gameCounts = {
    '0-3': allGameAges.filter((g) => g.minAge <= 3).length,
    '3-6': allGameAges.filter((g) => g.minAge >= 3 && g.minAge <= 6).length,
    '7+': allGameAges.filter((g) => g.minAge >= 7).length,
  };

  return {
    editorChoiceGames: editorChoiceGames.map((g) => applyGameTranslation(g, locale)),
    adFreeGames: adFreeGames.map((g) => applyGameTranslation(g, locale)),
    featuredBoardGames: featuredBoardGames.map((g) => applyBoardGameTranslation(g, locale)),
    featuredMedia: featuredMedia,
    gameCounts,
    mediaCount: mediaCount,
  };
}
