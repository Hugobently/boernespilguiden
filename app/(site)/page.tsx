import Link from 'next/link';
import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { Button } from '@/components/ui';
import { SearchBar } from '@/components/filters';
import { GameCard } from '@/components/games';
import { MediaCard } from '@/components/media/MediaCard';
import { getHomepageDataWithTranslation } from '@/lib/translations';
import { WebsiteJsonLdScript, JsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { Mascot, FloatingBlobs } from '@/components/brand';

// ============================================================================
// AGE CATEGORY CARDS CONFIG
// ============================================================================

const ageCategoryConfig = [
  {
    slug: '0-3',
    emoji: '👶',
    emojiLabel: 'Baby',
    color: {
      bg: 'from-[#FFD1DC] to-[#FFB6C1]',
      text: '#8B4563',
      shadow: '#E89AAB',
    },
  },
  {
    slug: '3-6',
    emoji: '🧒',
    emojiLabel: 'Barn',
    color: {
      bg: 'from-[#BAFFC9] to-[#95D5A6]',
      text: '#2D6A4F',
      shadow: '#7BC492',
    },
  },
  {
    slug: '7+',
    emoji: '👦',
    emojiLabel: 'Større barn',
    color: {
      bg: 'from-[#BAE1FF] to-[#8ECAE6]',
      text: '#1D4E89',
      shadow: '#6BB3D9',
    },
  },
];

// ============================================================================
// HERO SECTION
// ============================================================================

interface HeroSectionProps {
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
  tAge: Awaited<ReturnType<typeof getTranslations<'ageGroups'>>>;
  tCommon: Awaited<ReturnType<typeof getTranslations<'common'>>>;
}

function HeroSection({ t, tAge, tCommon }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:pt-8 sm:pb-12 bg-gradient-to-b from-[#FFF3EC] via-[#FFFDF8] to-white">
      {/* Decorative elements - hidden on mobile for cleaner look */}
      <div className="hidden sm:block">
        <FloatingBlobs />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-12">
          {/* Mascot - hidden on mobile, shown on tablet and up */}
          <div className="flex-shrink-0 order-2 lg:order-none hidden sm:block">
            <div className="relative">
              {/* Only show on tablet and up */}
              <Mascot size="lg" variant="wave" className="animate-float md:hidden" />
              <Mascot size="xl" variant="wave" className="animate-float hidden md:block" />
              {/* Sparkles only on desktop */}
              <span className="absolute -top-4 right-0 text-3xl animate-sparkle hidden md:inline" role="img" aria-label="Glimmer">✨</span>
              <span className="absolute bottom-4 -left-4 text-2xl animate-sparkle hidden md:inline" role="img" aria-label="Stjerne" style={{ animationDelay: '0.5s' }}>⭐</span>
            </div>
          </div>

          {/* Content - appears first on mobile (order-1) */}
          <div className="text-center lg:text-left flex-1 max-w-2xl order-1 lg:order-none">
            {/* Game icons - static on mobile, animated on desktop */}
            <div className="flex justify-center lg:justify-start items-center gap-3 mb-4 sm:mb-6">
              <span className="text-2xl sm:text-4xl sm:animate-bounce-slow" role="img" aria-label="Videospil">🎮</span>
              <span className="text-3xl sm:text-5xl sm:animate-bounce-slow" role="img" aria-label="Stjerne" style={{ animationDelay: '0.2s' }}>⭐</span>
              <span className="text-2xl sm:text-4xl sm:animate-bounce-slow" role="img" aria-label="Brætspil" style={{ animationDelay: '0.4s' }}>🎲</span>
              <span className="text-2xl sm:text-4xl sm:animate-bounce-slow hidden sm:inline" role="img" aria-label="Film og serier" style={{ animationDelay: '0.6s' }}>📺</span>
            </div>

            {/* Main headline - solid ink with a single deep-coral accent */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight text-[#2E2822]">
              <span>{t('heroTitle').split(' ').slice(0, -2).join(' ')}</span>{' '}
              <span className="text-[#C2410C]">
                {t('heroTitle').split(' ').slice(-2).join(' ')}
              </span>
            </h1>

            {/* Subheadline - more compact on mobile */}
            <p className="text-base sm:text-lg lg:text-xl text-text-secondary mb-2 sm:mb-3 max-w-xl mx-auto lg:mx-0">
              {t('heroSubtitle')}
            </p>
            <p className="text-sm text-text-muted mb-4 sm:mb-6 max-w-md mx-auto lg:mx-0 hidden sm:block">
              {t('heroDescription')}
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-6">
              <Suspense fallback={
                <div className="h-14 bg-white rounded-2xl animate-pulse shadow-soft" />
              }>
                <SearchBar
                  variant="hero"
                  placeholder={tCommon('searchPlaceholderLong')}
                />
              </Suspense>
            </div>

            {/* Quick age links - calm white chips with hairline borders */}
            <div className="flex justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6">
              {ageCategoryConfig.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/spil/kategori/${cat.slug}`}
                  className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-sm sm:text-base text-[#2E2822] bg-white border border-[#EAE3D8] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C2410C]/40 hover:shadow-md active:translate-y-0 min-h-[44px]"
                >
                  <span className="text-lg sm:text-xl" role="img" aria-label={cat.emojiLabel}>{cat.emoji}</span>
                  <span>{tAge(cat.slug as '0-3' | '3-6' | '7+')}</span>
                </Link>
              ))}
            </div>

            {/* Trust stamp */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 rounded-full bg-white border border-[#EAE3D8] shadow-sm text-xs sm:text-sm text-[#4A443C]">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#DCF2E3] text-[#16603A] font-bold" aria-hidden="true">✓</span>
              <span className="font-bold text-[#2E2822]">Ærligt testet</span>
              <span className="text-[#D9D0C3]" aria-hidden="true">·</span>
              <span>100% uafhængig</span>
              <span className="text-[#D9D0C3]" aria-hidden="true">·</span>
              <span>Ingen reklamer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// EDITOR'S CHOICE SECTION
// ============================================================================

interface EditorChoiceSectionProps {
  games: Awaited<ReturnType<typeof getHomepageDataWithTranslation>>['editorChoiceGames'];
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
}

function EditorChoiceSection({ games, t }: EditorChoiceSectionProps) {
  if (games.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C2410C] mb-2">
            ⭐ {t('editorChoice')}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E2822] mb-2">
            {t('editorChoiceTitle')}
          </h2>
          <p className="text-[#6B6258] text-base sm:text-lg max-w-xl mx-auto">
            {t('editorChoiceDesc')}
          </p>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <div
              key={game.slug}
              className="animate-slide-up opacity-0"
              style={{
                animationDelay: `${index * 0.1}s`,
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
                supportsDanish={game.supportsDanish}
                platforms={game.platforms}
                categories={game.categories}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link href="/spil">
            <Button variant="outline" size="lg">
              {t('seeAllEditorChoice')}
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// AD-FREE FAVORITES SECTION
// ============================================================================

interface AdFreeSectionProps {
  games: Awaited<ReturnType<typeof getHomepageDataWithTranslation>>['adFreeGames'];
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
}

function AdFreeSection({ games, t }: AdFreeSectionProps) {
  if (games.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-[#FBF5EC]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with special styling */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#16603A] mb-2">
              🛡️ {t('adFree')}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E2822] mb-2">
              {t('adFreeTitle')}
            </h2>
            <p className="text-[#6B6258] text-base sm:text-lg max-w-xl">
              {t('adFreeDesc')}
            </p>
          </div>

          {/* USP callout - hidden on mobile to save space */}
          <div className="hidden sm:block bg-white rounded-2xl p-5 shadow-sm border border-[#EAE3D8] max-w-sm">
            <div className="flex items-start gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <h4 className="font-bold text-[#16603A] mb-1">{t('ourPromise')}</h4>
                <p className="text-sm text-[#4A443C]">
                  {t('ourPromiseText')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <div
              key={game.slug}
              className="animate-slide-up opacity-0"
              style={{
                animationDelay: `${index * 0.1}s`,
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
                supportsDanish={game.supportsDanish}
                platforms={game.platforms}
                categories={game.categories}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link href="/soeg?reklamefri=true">
            <Button variant="mint" size="lg">
              {t('seeAllAdFree')}
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BOARD GAMES TEASER SECTION
// ============================================================================

interface BoardGamesSectionProps {
  games: Awaited<ReturnType<typeof getHomepageDataWithTranslation>>['featuredBoardGames'];
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
  tCategories: Awaited<ReturnType<typeof getTranslations<'categories'>>>;
}

function BoardGamesSection({ games, t, tCategories }: BoardGamesSectionProps) {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <span className="text-3xl sm:text-5xl">🎲</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E2822]">
                {t('boardGamesTitle')}
              </h2>
            </div>
            <p className="text-[#6B6258] text-lg max-w-xl">
              {t('boardGamesDesc')}
            </p>
          </div>

          <Link href="/braetspil">
            <Button variant="sunflower" size="lg">
              {t('exploreBoardGames')}
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>

        {/* Board games display */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <div
                key={game.slug}
                className="animate-slide-up opacity-0"
                style={{
                  animationDelay: `${index * 0.1}s`,
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
                  supportsDanish={game.supportsDanish}
                  categories={game.categories}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Teaser card when no board games */
          <div className="relative rounded-3xl overflow-hidden border border-[#EAE3D8] shadow-sm">
            <div className="bg-[#EEF8F2] rounded-3xl p-8 sm:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Illustration */}
                <div className="flex-shrink-0">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 bg-[#FFE66D]/30 rounded-full animate-pulse" />
                    <div className="absolute inset-4 bg-[#FFE66D]/50 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl">🎲</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-[#4A4A4A] mb-3">
                    {t('boardGamesTeaserTitle')}
                  </h3>
                  <p className="text-[#7A7A7A] mb-6 max-w-lg">
                    {t('boardGamesTeaserDesc')}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-3 py-1 rounded-full bg-[#BAE1FF]/30 text-[#1D4E89] text-sm font-medium">🧠 {tCategories('strategy')}</span>
                    <span className="px-3 py-1 rounded-full bg-[#BAFFC9]/30 text-[#2D6A4F] text-sm font-medium">🤝 {tCategories('cooperative')}</span>
                    <span className="px-3 py-1 rounded-full bg-[#FFD1DC]/30 text-[#8B4563] text-sm font-medium">🎉 {tCategories('party')}</span>
                    <span className="px-3 py-1 rounded-full bg-[#E2C2FF]/30 text-[#5B4670] text-sm font-medium">👨‍👩‍👧‍👦 {tCategories('family')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// FILM & SERIER SECTION
// ============================================================================

interface FeaturedMediaItem {
  id: string;
  slug: string;
  title: string;
  posterUrl: string | null;
  type: string;
  isDanish: boolean;
  streamingInfo: Array<{ provider: string; isFree?: boolean }>;
}

interface FilmSerierSectionProps {
  media: FeaturedMediaItem[];
  mediaCount: number;
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
}

function FilmSerierSection({ media, mediaCount, t }: FilmSerierSectionProps) {
  return (
    <section className="py-8 sm:py-12 bg-[#FBF5EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <span className="text-3xl sm:text-5xl">📺</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E2822]">
                {t('filmSerierTitle')}
              </h2>
            </div>
            <p className="text-[#6B6258] text-lg max-w-xl">
              {t('filmSerierDesc')}
            </p>
          </div>

          <Link href="/film-serier">
            <Button variant="sky" size="lg">
              {t('exploreFilmSerier')}
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>

        {/* Media display */}
        {media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {media.map((item, index) => {
              const streamingInfo = item.streamingInfo || [];

              return (
                <div
                  key={item.id}
                  className="animate-slide-up opacity-0"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <MediaCard
                    slug={item.slug}
                    title={item.title}
                    posterUrl={item.posterUrl}
                    type={item.type as 'MOVIE' | 'SERIES'}
                    isDanish={item.isDanish}
                    streamingInfo={streamingInfo}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Teaser card when no media */
          <div className="relative rounded-3xl overflow-hidden border border-[#EAE3D8] shadow-sm">
            <div className="bg-[#DCEDFC]/40 rounded-3xl p-8 sm:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Illustration */}
                <div className="flex-shrink-0">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 bg-[#A2D2FF]/30 rounded-full animate-pulse" />
                    <div className="absolute inset-4 bg-[#A2D2FF]/50 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl">📺</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-[#4A4A4A] mb-3">
                    {t('filmSerierTeaserTitle')}
                  </h3>
                  <p className="text-[#7A7A7A] mb-6 max-w-lg">
                    {t('filmSerierTeaserDesc')}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-3 py-1 rounded-full bg-[#FFB5A7]/30 text-[#8B4563] text-sm font-medium">📺 Netflix</span>
                    <span className="px-3 py-1 rounded-full bg-[#A2D2FF]/30 text-[#1D4E89] text-sm font-medium">⭐ Disney+</span>
                    <span className="px-3 py-1 rounded-full bg-[#BAFFC9]/30 text-[#2D6A4F] text-sm font-medium">🇩🇰 DR</span>
                    <span className="px-3 py-1 rounded-full bg-[#FFE66D]/30 text-[#7D6608] text-sm font-medium">🎬 HBO Max</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats badge */}
        {mediaCount > 0 && (
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A2D2FF]/20 text-[#1D4E89] font-medium">
              <span>✅</span>
              <span>{t('seriesCount', { count: mediaCount })} anmeldt</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================

interface CTASectionProps {
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
}

function CTASection({ t }: CTASectionProps) {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0E5A6D]">
          {/* Content */}
          <div className="relative px-6 py-8 sm:px-12 sm:py-12 text-center">
            <span className="text-4xl sm:text-5xl block mb-3">🔍</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-3">
              {t('cantFind')}
            </h2>
            <p className="text-white/85 mb-6 max-w-xl mx-auto text-sm sm:text-base">
              {t('cantFindDesc')}
            </p>
            <Link href="/soeg">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-[#0E5A6D] hover:bg-[#FFF3EC] shadow-lg font-bold"
              >
                {t('searchGames')}
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default async function HomePage() {
  // Get locale and translations
  const locale = await getLocale();
  const t = await getTranslations('home');
  const tAge = await getTranslations('ageGroups');
  const tCommon = await getTranslations('common');
  const tCategories = await getTranslations('categories');

  // Get data with translations
  const data = await getHomepageDataWithTranslation(locale);

  // Generate FAQ structured data for SEO
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Hvad er de bedste spil til børn uden reklamer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vi anbefaler spil som Khan Academy Kids, Toca Life World, og LEGO-spil. Disse er alle reklamefri og sikre for børn. Se vores komplette liste over reklamefri spil.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hvilke brætspil er gode til små børn?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Til børn 0-3 år anbefaler vi HABA First Orchard og Roll & Play. Til 3-6 år er Candy Land og Hoot Owl Hoot populære valg.',
        },
      },
      {
        '@type': 'Question',
        name: 'Er apps til børn sikre?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Det varierer meget. Vi gennemgår alle apps for reklamer, in-app køb og dataindsamling. Se vores anmeldelser for at finde sikre apps til dit barn.',
        },
      },
    ],
  };

  return (
    <div className="relative">
      {/* Structured Data for SEO */}
      <WebsiteJsonLdScript />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={generateBreadcrumbJsonLd([{ name: 'Forside' }])} />

      {/* Hero Section */}
      <HeroSection t={t} tAge={tAge} tCommon={tCommon} />

      {/* Editor's Choice Section */}
      <EditorChoiceSection games={data.editorChoiceGames} t={t} />

      {/* Ad-Free Favorites Section - moved up since age selection is already in hero */}
      <AdFreeSection games={data.adFreeGames} t={t} />

      {/* Board Games Teaser Section */}
      <BoardGamesSection games={data.featuredBoardGames} t={t} tCategories={tCategories} />

      {/* Film & Serier Section */}
      <FilmSerierSection media={data.featuredMedia as unknown as FeaturedMediaItem[]} mediaCount={data.mediaCount} t={t} />

      {/* CTA Section */}
      <CTASection t={t} />

    </div>
  );
}

// ============================================================================
// METADATA
// ============================================================================

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Børnespilguiden - Find de bedste spil til børn 2026 | Anmeldelser & Guide',
  },
  description:
    'Danmarks bedste guide til børnespil! ⭐ Ærlige anmeldelser af 130+ digitale spil og brætspil til børn 0-15 år. ✓ Reklamefri ✓ Sikre ✓ Lærerige. Find det perfekte spil i dag!',
  keywords: [
    'børnespil',
    'spil til børn',
    'brætspil børn',
    'brætspil til børn',
    'digitale spil børn',
    'apps til børn',
    'læringsspil',
    'læringsspil til børn',
    'familiespil',
    'reklamefri spil',
    'reklamefri apps børn',
    'sikre spil til børn',
    'spil uden reklamer',
    'børnevenlige spil',
    'iPad spil til børn',
    'gratis spil til børn',
    'spil til 3 årige',
    'spil til 5 årige',
    'spil til 7 årige',
    'spil til 10 årige',
    'bedste børnespil 2026',
    'anmeldelser børnespil',
  ],
  openGraph: {
    title: 'Børnespilguiden - Find de bedste spil til dine børn',
    description:
      'Ærlige anmeldelser af digitale spil og brætspil til børn. Reklamefri guide med fokus på sikkerhed, læring og sjov.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Børnespilguiden - Find de bedste spil til dine børn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Børnespilguiden - Find de bedste spil til dine børn',
    description: 'Ærlige anmeldelser af digitale spil og brætspil til børn.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};
