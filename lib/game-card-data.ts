/**
 * Picks only the fields GameCard actually renders, so full review rows
 * (description, parentInfo, pros/cons, screenshots, translations, ...)
 * never leak into the client payload on listing pages.
 */

interface GameRowLike {
  slug: string;
  title: string;
  shortDescription: string;
  minAge: number;
  maxAge: number;
  iconUrl?: string | null;
  imageUrl?: string | null;
  rating: number;
  featured?: boolean;
  editorChoice?: boolean;
  priceModel?: string | null;
  hasAds?: boolean | null;
  hasInAppPurchases?: boolean | null;
  isOfflineCapable?: boolean | null;
  supportsDanish?: boolean | null;
  platforms?: string | null;
  categories?: string | null;
}

export function toGameCardData(game: GameRowLike) {
  return {
    slug: game.slug,
    title: game.title,
    shortDescription: game.shortDescription,
    minAge: game.minAge,
    maxAge: game.maxAge,
    iconUrl: game.iconUrl ?? undefined,
    imageUrl: game.imageUrl ?? undefined,
    rating: game.rating,
    featured: game.featured,
    editorChoice: game.editorChoice,
    priceModel: game.priceModel ?? undefined,
    hasAds: game.hasAds ?? undefined,
    hasInAppPurchases: game.hasInAppPurchases ?? undefined,
    offlinePlay: game.isOfflineCapable ?? undefined,
    supportsDanish: game.supportsDanish ?? undefined,
    platforms: game.platforms ?? undefined,
    categories: game.categories ?? undefined,
  };
}
