import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Footer } from '@/components/layout';
import { GameCard } from '@/components/games';
import { SearchBar } from '@/components/filters';
import prisma from '@/lib/db';
import { SearchTabs, SearchFilters, SearchSuggestions } from './components';

// ============================================================================
// TYPES
// ============================================================================

interface SearchParams {
  q?: string;
  tab?: 'alle' | 'spil' | 'braetspil';
  alder?: string;
  reklamefri?: string;
  gratis?: string;
  offline?: string;
  ingenKob?: string;
  spillere?: string;
  spilletid?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;
  const t = await getTranslations('search');

  if (query) {
    return {
      title: t('metaTitleWithQuery', { query }),
      description: t('metaDescriptionWithQuery', { query }),
    };
  }

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

// ============================================================================
// DATA FETCHING
// ============================================================================

async function searchGames(
  query: string,
  filters: {
    adFree?: boolean;
    free?: boolean;
    offline?: boolean;
    noInAppPurchases?: boolean;
    ageGroup?: string;
  }
) {
  // Build where clause for digital games
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const digitalWhere: any = {
    AND: [],
  };

  // Search term matching
  if (query) {
    digitalWhere.AND.push({
      OR: [
        { title: { contains: query } },
        { shortDescription: { contains: query } },
        { description: { contains: query } },
        { categories: { contains: query } },
      ],
    });
  }

  // Apply filters
  if (filters.adFree) {
    digitalWhere.AND.push({ hasAds: false });
  }
  if (filters.free) {
    digitalWhere.AND.push({ priceModel: 'gratis' });
  }
  if (filters.offline) {
    digitalWhere.AND.push({ isOfflineCapable: true });
  }
  if (filters.noInAppPurchases) {
    digitalWhere.AND.push({ hasInAppPurchases: false });
  }
  if (filters.ageGroup) {
    const [minAge, maxAge] = filters.ageGroup.split('-').map(Number);
    digitalWhere.AND.push({
      OR: [
        { minAge: { lte: maxAge }, maxAge: { gte: minAge } },
        { ageGroup: filters.ageGroup },
      ],
    });
  }

  // Clean up empty AND array
  if (digitalWhere.AND.length === 0) {
    delete digitalWhere.AND;
  }

  const digitalGames = await prisma.game.findMany({
    where: Object.keys(digitalWhere).length > 0 ? digitalWhere : undefined,
    orderBy: [{ editorChoice: 'desc' }, { rating: 'desc' }],
    take: 50,
  });

  return digitalGames;
}

async function searchBoardGames(
  query: string,
  filters: {
    ageGroup?: string;
    players?: string;
    playTime?: string;
  }
) {
  // Build where clause for board games
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boardWhere: any = {
    AND: [],
  };

  // Search term matching
  if (query) {
    boardWhere.AND.push({
      OR: [
        { title: { contains: query } },
        { shortDescription: { contains: query } },
        { description: { contains: query } },
        { categories: { contains: query } },
      ],
    });
  }

  // Apply filters
  if (filters.ageGroup) {
    const [minAge, maxAge] = filters.ageGroup.split('-').map(Number);
    boardWhere.AND.push({
      OR: [
        { minAge: { lte: maxAge }, maxAge: { gte: minAge } },
        { ageGroup: filters.ageGroup },
      ],
    });
  }
  if (filters.players) {
    const playerCount = parseInt(filters.players, 10);
    boardWhere.AND.push({
      minPlayers: { lte: playerCount },
      maxPlayers: { gte: playerCount },
    });
  }
  if (filters.playTime) {
    const maxPlayTime = parseInt(filters.playTime, 10);
    boardWhere.AND.push({
      playTimeMinutes: { lte: maxPlayTime },
    });
  }

  // Clean up empty AND array
  if (boardWhere.AND.length === 0) {
    delete boardWhere.AND;
  }

  const boardGames = await prisma.boardGame.findMany({
    where: Object.keys(boardWhere).length > 0 ? boardWhere : undefined,
    orderBy: [{ editorChoice: 'desc' }, { rating: 'desc' }],
    take: 50,
  });

  return boardGames;
}

async function getPopularGames() {
  const [digitalGames, boardGames] = await Promise.all([
    prisma.game.findMany({
      where: { OR: [{ featured: true }, { editorChoice: true }] },
      orderBy: { rating: 'desc' },
      take: 4,
    }),
    prisma.boardGame.findMany({
      where: { OR: [{ featured: true }, { editorChoice: true }] },
      orderBy: { rating: 'desc' },
      take: 4,
    }),
  ]);

  return { digitalGames, boardGames };
}

// ============================================================================
// SEARCH RESULTS COMPONENT
// ============================================================================

async function SearchResults({
  query,
  tab,
  filters,
}: {
  query: string;
  tab: 'alle' | 'spil' | 'braetspil';
  filters: {
    adFree?: boolean;
    free?: boolean;
    offline?: boolean;
    noInAppPurchases?: boolean;
    ageGroup?: string;
    players?: string;
    playTime?: string;
  };
}) {
  // Get results based on active tab
  const showDigital = tab === 'alle' || tab === 'spil';
  const showBoard = tab === 'alle' || tab === 'braetspil';

  const [digitalGames, boardGames] = await Promise.all([
    showDigital ? searchGames(query, filters) : Promise.resolve([]),
    showBoard ? searchBoardGames(query, filters) : Promise.resolve([]),
  ]);

  const totalResults = digitalGames.length + boardGames.length;
  const hasActiveFilters =
    filters.adFree ||
    filters.free ||
    filters.offline ||
    filters.noInAppPurchases ||
    filters.ageGroup ||
    filters.players ||
    filters.playTime;

  // No query provided - show empty state
  if (!query && !hasActiveFilters) {
    const popular = await getPopularGames();

    return (
      <div className="space-y-12">
        <div className="text-center py-12">
          <span className="text-7xl block mb-6">🔍</span>
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-3">
            Hvad leder du efter?
          </h2>
          <p className="text-[#7A7A7A] max-w-md mx-auto">
            Brug søgefeltet ovenfor til at finde det perfekte spil til dit barn.
            Du kan søge efter spilnavn, kategori eller aldersgruppe.
          </p>
        </div>

        {/* Popular games suggestion */}
        <div>
          <h3 className="text-xl font-bold text-[#4A4A4A] mb-6 flex items-center gap-2">
            <span>⭐</span> Populære spil
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.digitalGames.map((game, index) => (
              <div
                key={game.slug}
                className="animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <GameCard
                  slug={game.slug}
                  title={game.title}
                  shortDescription={game.shortDescription}
                  type="digital"
                  minAge={game.minAge}
                  maxAge={game.maxAge}
                  iconUrl={game.iconUrl}
                  rating={game.rating}
                  featured={game.featured}
                  editorChoice={game.editorChoice}
                  priceModel={game.priceModel}
                  hasAds={game.hasAds}
                  hasInAppPurchases={game.hasInAppPurchases}
                  offlinePlay={game.isOfflineCapable}
                  platforms={game.platforms}
                  categories={game.categories}
                />
              </div>
            ))}
          </div>
        </div>

        {popular.boardGames.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-[#4A4A4A] mb-6 flex items-center gap-2">
              <span>🎲</span> Populære brætspil
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popular.boardGames.map((game, index) => (
                <div
                  key={game.slug}
                  className="animate-slide-up opacity-0"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <GameCard
                    slug={game.slug}
                    title={game.title}
                    shortDescription={game.shortDescription}
                    type="board"
                    minAge={game.minAge}
                    maxAge={game.maxAge}
                    imageUrl={game.imageUrl}
                    rating={game.rating}
                    featured={game.featured}
                    editorChoice={game.editorChoice}
                    categories={game.categories}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // No results found
  if (totalResults === 0) {
    return (
      <div className="space-y-12">
        <div className="text-center py-12 bg-[#FFFCF7] rounded-3xl">
          <span className="text-7xl block mb-6">😕</span>
          <h2 className="text-2xl font-bold text-[#4A4A4A] mb-3">
            Ingen resultater fundet
          </h2>
          <p className="text-[#7A7A7A] max-w-md mx-auto mb-6">
            Vi kunne ikke finde nogen spil der matcher &ldquo;{query}&rdquo;
            {hasActiveFilters && ' med de valgte filtre'}
          </p>

          {hasActiveFilters && (
            <Link
              href={`/soeg?q=${encodeURIComponent(query)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFB5A7] text-white font-semibold hover:bg-[#F8A99B] transition-colors"
            >
              Fjern alle filtre
            </Link>
          )}
        </div>

        {/* Search suggestions */}
        <SearchSuggestions query={query} />
      </div>
    );
  }

  // Show results
  return (
    <div className="space-y-8">
      {/* Results count */}
      <p className="text-[#7A7A7A]">
        {totalResults} {totalResults === 1 ? 'resultat' : 'resultater'}
        {query && (
          <>
            {' '}
            for &ldquo;<span className="font-semibold text-[#4A4A4A]">{query}</span>&rdquo;
          </>
        )}
      </p>

      {/* Digital Games Results */}
      {digitalGames.length > 0 && (
        <section>
          {tab === 'alle' && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#4A4A4A] flex items-center gap-2">
                <span>🎮</span> Digitale spil ({digitalGames.length})
              </h2>
              {digitalGames.length > 8 && (
                <Link
                  href={`/soeg?q=${encodeURIComponent(query)}&tab=spil`}
                  className="text-sm text-[#FFB5A7] font-semibold hover:underline"
                >
                  Se alle →
                </Link>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(tab === 'alle' ? digitalGames.slice(0, 8) : digitalGames).map((game, index) => (
              <div
                key={game.slug}
                className="animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <GameCard
                  slug={game.slug}
                  title={game.title}
                  shortDescription={game.shortDescription}
                  type="digital"
                  minAge={game.minAge}
                  maxAge={game.maxAge}
                  iconUrl={game.iconUrl}
                  rating={game.rating}
                  featured={game.featured}
                  editorChoice={game.editorChoice}
                  priceModel={game.priceModel}
                  hasAds={game.hasAds}
                  hasInAppPurchases={game.hasInAppPurchases}
                  offlinePlay={game.isOfflineCapable}
                  platforms={game.platforms}
                  categories={game.categories}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Board Games Results */}
      {boardGames.length > 0 && (
        <section>
          {tab === 'alle' && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#4A4A4A] flex items-center gap-2">
                <span>🎲</span> Brætspil ({boardGames.length})
              </h2>
              {boardGames.length > 8 && (
                <Link
                  href={`/soeg?q=${encodeURIComponent(query)}&tab=braetspil`}
                  className="text-sm text-[#FFE66D] font-semibold hover:underline"
                >
                  Se alle →
                </Link>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(tab === 'alle' ? boardGames.slice(0, 8) : boardGames).map((game, index) => (
              <div
                key={game.slug}
                className="animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <GameCard
                  slug={game.slug}
                  title={game.title}
                  shortDescription={game.shortDescription}
                  type="board"
                  minAge={game.minAge}
                  maxAge={game.maxAge}
                  imageUrl={game.imageUrl}
                  rating={game.rating}
                  featured={game.featured}
                  editorChoice={game.editorChoice}
                  categories={game.categories}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const query = params.q || '';
  const tab = (params.tab || 'alle') as 'alle' | 'spil' | 'braetspil';
  const filters = {
    adFree: params.reklamefri === 'true',
    free: params.gratis === 'true',
    offline: params.offline === 'true',
    noInAppPurchases: params.ingenKob === 'true',
    ageGroup: params.alder,
    players: params.spillere,
    playTime: params.spilletid,
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#FFB5A7] via-[#FFE66D] to-[#B8E0D2] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Hjem
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium">Søg</li>
            </ol>
          </nav>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              🔍 Søg efter spil
            </h1>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={<div className="h-14 bg-white/50 rounded-2xl animate-pulse" />}>
                <SearchBar variant="hero" placeholder="Søg efter spil, alder, kategori..." />
              </Suspense>
            </div>

            {/* Quick search chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Link
                href="/soeg?q=læringsspil"
                className="px-4 py-2 rounded-full bg-white/30 text-white text-sm font-medium hover:bg-white/50 transition-colors"
              >
                📚 Læringsspil
              </Link>
              <Link
                href="/soeg?gratis=true"
                className="px-4 py-2 rounded-full bg-white/30 text-white text-sm font-medium hover:bg-white/50 transition-colors"
              >
                🆓 Gratis spil
              </Link>
              <Link
                href="/soeg?reklamefri=true"
                className="px-4 py-2 rounded-full bg-white/30 text-white text-sm font-medium hover:bg-white/50 transition-colors"
              >
                🚫 Reklamefri
              </Link>
              <Link
                href="/soeg?alder=3-6"
                className="px-4 py-2 rounded-full bg-white/30 text-white text-sm font-medium hover:bg-white/50 transition-colors"
              >
                🧒 3-6 år
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <Suspense fallback={<div className="h-12 bg-[#FFFCF7] rounded-2xl animate-pulse w-80" />}>
            <SearchTabs activeTab={tab} query={query} />
          </Suspense>

          <Suspense fallback={<div className="h-12 bg-[#FFFCF7] rounded-2xl animate-pulse w-40" />}>
            <SearchFilters activeTab={tab} filters={filters} query={query} />
          </Suspense>
        </div>

        {/* Results */}
        <Suspense
          fallback={
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3">
                <span className="text-4xl animate-bounce">🔍</span>
                <span className="text-[#7A7A7A] font-medium">Søger...</span>
              </div>
            </div>
          }
        >
          <SearchResults query={query} tab={tab} filters={filters} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
