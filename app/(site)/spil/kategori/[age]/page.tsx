import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import prisma from '@/lib/db';
import { GameCard } from '@/components/games';
import { FilterSidebar, MobileFilters, SortDropdown, Pagination, ActiveFilters } from './components';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

const GAMES_PER_PAGE = 12;

const validAgeGroups = ['0-3', '3-6', '7+'] as const;
type AgeGroup = (typeof validAgeGroups)[number];

const ageGroupConfig: Record<
  AgeGroup,
  {
    emoji: string;
    minAge: number;
    maxAge: number;
    color: { bg: string; text: string; gradient: string };
  }
> = {
  '0-3': {
    emoji: '👶',
    minAge: 0,
    maxAge: 3,
    color: {
      bg: '#FFD1DC',
      text: '#8B4563',
      gradient: 'from-[#FFD1DC] to-[#FFB6C1]',
    },
  },
  '3-6': {
    emoji: '🧒',
    minAge: 3,
    maxAge: 6,
    color: {
      bg: '#BAFFC9',
      text: '#2D6A4F',
      gradient: 'from-[#BAFFC9] to-[#95D5A6]',
    },
  },
  '7+': {
    emoji: '👦',
    minAge: 7,
    maxAge: 99,
    color: {
      bg: '#BAE1FF',
      text: '#1D4E89',
      gradient: 'from-[#BAE1FF] to-[#8ECAE6]',
    },
  },
};

type SortOption = 'popular' | 'newest' | 'rating' | 'adfree';

interface SearchParams {
  page?: string;
  sort?: string;
  categories?: string;
  reklamefri?: string;
  gratis?: string;
  offline?: string;
  ingenKob?: string;
}

// ============================================================================
// DATA FETCHING
// ============================================================================

async function getGamesForAgeGroup(
  ageGroup: AgeGroup,
  page: number,
  sort: SortOption,
  filters: {
    categories?: string[];
    adFree?: boolean;
    free?: boolean;
    offline?: boolean;
    noInAppPurchases?: boolean;
  }
) {
  const config = ageGroupConfig[ageGroup];

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    AND: [
      {
        OR: [
          { minAge: { lte: config.maxAge }, maxAge: { gte: config.minAge } },
          { ageGroup: ageGroup },
        ],
      },
    ],
  };

  // Apply filters
  if (filters.adFree) {
    where.AND.push({ hasAds: false });
  }
  if (filters.free) {
    where.AND.push({ priceModel: 'gratis' });
  }
  if (filters.offline) {
    where.AND.push({ isOfflineCapable: true });
  }
  if (filters.noInAppPurchases) {
    where.AND.push({ hasInAppPurchases: false });
  }
  if (filters.categories && filters.categories.length > 0) {
    // For SQLite JSON, we need to use string contains
    where.AND.push({
      OR: filters.categories.map((cat) => ({
        categories: { contains: cat },
      })),
    });
  }

  // Build orderBy based on sort
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any[] = [];
  switch (sort) {
    case 'newest':
      orderBy = [{ createdAt: 'desc' }];
      break;
    case 'rating':
      orderBy = [{ rating: 'desc' }, { createdAt: 'desc' }];
      break;
    case 'adfree':
      // Sort ad-free first, then by rating
      orderBy = [{ hasAds: 'asc' }, { hasInAppPurchases: 'asc' }, { rating: 'desc' }];
      break;
    case 'popular':
    default:
      // Featured first, then editor's choice, then by rating
      orderBy = [{ featured: 'desc' }, { editorChoice: 'desc' }, { rating: 'desc' }];
      break;
  }

  const skip = (page - 1) * GAMES_PER_PAGE;

  const [games, totalCount] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy,
      skip,
      take: GAMES_PER_PAGE,
    }),
    prisma.game.count({ where }),
  ]);

  return {
    games,
    totalCount,
    totalPages: Math.ceil(totalCount / GAMES_PER_PAGE),
    currentPage: page,
  };
}

async function getAvailableCategories(ageGroup: AgeGroup) {
  const config = ageGroupConfig[ageGroup];

  const games = await prisma.game.findMany({
    where: {
      OR: [
        { minAge: { lte: config.maxAge }, maxAge: { gte: config.minAge } },
        { ageGroup: ageGroup },
      ],
    },
    select: { categories: true },
  });

  // Extract unique categories
  const categoryCounts: Record<string, number> = {};
  games.forEach((game) => {
    try {
      const cats = JSON.parse(game.categories || '[]') as string[];
      cats.forEach((cat) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    } catch {
      // Ignore parse errors
    }
  });

  return Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

interface PageProps {
  params: Promise<{ age: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function AgeGroupPage({ params, searchParams }: PageProps) {
  const { age } = await params;
  const searchParamsResolved = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations('games');
  const tAgeGroups = await getTranslations('ageGroups');

  // Validate age group
  if (!validAgeGroups.includes(age as AgeGroup)) {
    notFound();
  }

  const ageGroup = age as AgeGroup;
  const config = ageGroupConfig[ageGroup];
  const ageLabel = tAgeGroups(ageGroup);
  const ageDesc = tAgeGroups(`${ageGroup}-desc`);

  // Parse search params
  const page = Math.max(1, parseInt(searchParamsResolved.page || '1', 10));
  const sort = (searchParamsResolved.sort || 'popular') as SortOption;
  const selectedCategories = searchParamsResolved.categories?.split(',').filter(Boolean) || [];
  const filters = {
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    adFree: searchParamsResolved.reklamefri === 'true',
    free: searchParamsResolved.gratis === 'true',
    offline: searchParamsResolved.offline === 'true',
    noInAppPurchases: searchParamsResolved.ingenKob === 'true',
  };

  // Fetch data
  const [gamesData, availableCategories] = await Promise.all([
    getGamesForAgeGroup(ageGroup, page, sort, filters),
    getAvailableCategories(ageGroup),
  ]);

  const hasActiveFilters =
    filters.adFree ||
    filters.free ||
    filters.offline ||
    filters.noInAppPurchases ||
    (filters.categories && filters.categories.length > 0);

  // Prepare translations for client components
  const translations = {
    filters: t('filters'),
    clearAll: t('clearAll'),
    parentFilters: t('parentFilters'),
    adFree: t('adFree'),
    noInAppPurchases: t('noInAppPurchases'),
    offline: t('offline'),
    freeOnly: t('freeOnly'),
    categories: t('categories'),
    showResults: t('showResults'),
    popular: t('popular'),
    newest: t('newest'),
    bestRated: t('bestRated'),
    adFreeFirst: t('adFreeFirst'),
  };

  // Translate category names - use the category name directly (already in Danish)
  // Just capitalize the first letter for display
  const categoryTranslations: Record<string, string> = {};
  availableCategories.forEach((cat) => {
    // Capitalize first letter of category name
    const displayName = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
    categoryTranslations[cat.name] = displayName;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Header */}
      <header className={`bg-gradient-to-r ${config.color.gradient} py-12 sm:py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm" style={{ color: config.color.text }}>
              <li>
                <Link href={`/${locale === 'da' ? '' : locale}`} className="hover:underline opacity-70">
                  {t('home')}
                </Link>
              </li>
              <li className="opacity-50">/</li>
              <li>
                <Link href={`/${locale === 'da' ? '' : locale + '/'}spil`} className="hover:underline opacity-70">
                  {t('breadcrumbDigital')}
                </Link>
              </li>
              <li className="opacity-50">/</li>
              <li className="font-semibold">{ageLabel}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-6xl sm:text-7xl">{config.emoji}</span>
            <div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2"
                style={{ color: config.color.text }}
              >
                {t('gamesForAge', { age: ageLabel })}
              </h1>
              <p className="text-lg opacity-80" style={{ color: config.color.text }}>
                {ageDesc} • {t('gamesFound', { count: gamesData.totalCount })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden mb-6">
          <Suspense fallback={<div className="h-12 bg-[#FFFCF7] rounded-2xl animate-pulse" />}>
            <MobileFilters
              ageGroup={ageGroup}
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              filters={filters}
              sort={sort}
              translations={translations}
              categoryTranslations={categoryTranslations}
            />
          </Suspense>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4">
              <FilterSidebar
                ageGroup={ageGroup}
                availableCategories={availableCategories}
                selectedCategories={selectedCategories}
                filters={filters}
                translations={translations}
                categoryTranslations={categoryTranslations}
              />
            </div>
          </aside>

          {/* Games Grid */}
          <div className="flex-1">
            {/* Sort & Active Filters Bar */}
            <div className="hidden lg:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#7A7A7A]">
                  {t('showingGames', {
                    from: (page - 1) * GAMES_PER_PAGE + 1,
                    to: Math.min(page * GAMES_PER_PAGE, gamesData.totalCount),
                    total: gamesData.totalCount,
                  })}
                </span>
              </div>
              <SortDropdown currentSort={sort} ageGroup={ageGroup} translations={translations} />
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <ActiveFilters
                filters={filters}
                selectedCategories={selectedCategories}
                ageGroup={ageGroup}
                translations={translations}
                categoryTranslations={categoryTranslations}
              />
            )}

            {/* Games Grid */}
            {gamesData.games.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {gamesData.games.map((game, index) => (
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

                {/* Pagination */}
                {gamesData.totalPages > 1 && (
                  <Pagination
                    currentPage={gamesData.currentPage}
                    totalPages={gamesData.totalPages}
                    ageGroup={ageGroup}
                  />
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <span className="text-6xl block mb-4">🔍</span>
                <h3 className="text-xl font-bold text-[#4A4A4A] mb-2">{t('noGamesFound')}</h3>
                <p className="text-[#7A7A7A] mb-6">{t('tryChangeFilters')}</p>
                <Link
                  href={`/spil/kategori/${ageGroup}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFB5A7] text-white font-semibold hover:bg-[#F8A99B] transition-colors"
                >
                  {t('resetFilters')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { age } = await params;
  const t = await getTranslations('games');
  const tAgeGroups = await getTranslations('ageGroups');

  if (!validAgeGroups.includes(age as AgeGroup)) {
    return { title: t('notFound') };
  }

  const ageLabel = tAgeGroups(age as AgeGroup);
  const ageDesc = tAgeGroups(`${age}-desc`);

  return {
    title: `${t('gamesForAge', { age: ageLabel })} - Børnespilguiden`,
    description: t('description') + ' ' + ageDesc,
    openGraph: {
      title: `${t('gamesForAge', { age: ageLabel })} - Børnespilguiden`,
      description: t('description') + ' ' + ageDesc,
    },
  };
}

// ============================================================================
// STATIC PARAMS
// ============================================================================

export function generateStaticParams() {
  return validAgeGroups.map((age) => ({ age }));
}
