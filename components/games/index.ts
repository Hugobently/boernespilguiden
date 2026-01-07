// Game Card Components
export { GameCard, CompactGameCard } from './GameCard';
export type { GameCardProps, CompactGameCardProps } from './GameCard';

// Game Detail Image (with fallback)
export { GameDetailImage } from './GameDetailImage';

// Game Grid Components
export { GameGrid, LoadingGrid, FeaturedGamesRow, GameCount } from './GameGrid';

// Lazy Loading Components
export { LazyGameGrid, LazyGameCard, GameCardSkeleton, GameGridSkeleton } from './LazyGameGrid';

// Game Detail Components
export {
  GameDetail,
  GameDetailHero,
  ProsCons,
  ParentTip,
  PlatformLinks,
  RelatedGames,
} from './GameDetail';
export type { GameDetailProps } from './GameDetail';

// Parent Info Components
export { ParentInfo, SafetyBadge, ParentInfoExpanded } from './ParentInfo';
export type { ParentInfoProps } from './ParentInfo';

// Featured Game (Legacy)
export { FeaturedGame } from './FeaturedGame';
