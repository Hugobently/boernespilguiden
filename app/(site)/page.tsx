import Link from 'next/link';
import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { Button, Icon, Reveal, type IconName } from '@/components/ui';
import { SearchBar } from '@/components/filters';
import { GameCard } from '@/components/games';
import { MediaCard } from '@/components/media/MediaCard';
import { getHomepageDataWithTranslation } from '@/lib/translations';
import { WebsiteJsonLdScript, JsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';
import { HeroScene } from '@/components/brand';

// ============================================================================
// AGE CATEGORY CARDS CONFIG
// ============================================================================

const ageCategoryConfig: Array<{
  slug: '0-3' | '3-6' | '7+';
  icon: IconName;
  sublabel: string;
  className: string;
}> = [
  {
    slug: '0-3',
    icon: 'blocks',
    sublabel: 'De mindste',
    className: 'bg-[#FFDCE5] text-[#8B3A56] border-white/70',
  },
  {
    slug: '3-6',
    icon: 'kite',
    sublabel: 'Børnehave',
    className: 'bg-[#CFF0DD] text-[#1E5C40] border-white/70',
  },
  {
    slug: '7+',
    icon: 'rocket',
    sublabel: 'Skolebørn',
    className: 'bg-[#CCE5FA] text-[#1D4E89] border-white/70',
  },
];

// ============================================================================
// HERO SECTION - "Spiluniverset" (Koncept A, 2026 redesign)
// ============================================================================

interface HeroSectionProps {
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
  tAge: Awaited<ReturnType<typeof getTranslations<'ageGroups'>>>;
  tCommon: Awaited<ReturnType<typeof getTranslations<'common'>>>;
}

function HeroSection({ t, tAge, tCommon }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#CDEBFA_0%,#E9F6FD_34%,#FFF3EC_62%,#FFEDE2_100%)]">
      {/* Illustreret scene: sol, skyer, drage, bakker og ræven */}
      <HeroScene />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-44 sm:pb-56 lg:pb-64">
        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start gap-4 sm:gap-5">
          {/* Main headline - display font with a single deep-coral accent */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-[#2E2822] text-balance">
            <span>{t('heroTitle').split(' ').slice(0, -2).join(' ')}</span>{' '}
            <span className="text-[#C2410C]">
              {t('heroTitle').split(' ').slice(-2).join(' ')}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-[#4A443C] max-w-md">
            {t('heroSubtitle')}
          </p>

          {/* Search - det ene søgefelt over folden */}
          <div className="w-full max-w-xl">
            <Suspense
              fallback={<div className="h-14 bg-white rounded-2xl animate-pulse shadow-soft" />}
            >
              <SearchBar variant="hero" placeholder={tCommon('searchPlaceholderLong')} />
            </Suspense>
          </div>

          {/* Aldersdørene - de tre store indgange til universet */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-md" role="list">
            {ageCategoryConfig.map((cat) => (
              <Link
                key={cat.slug}
                role="listitem"
                href={`/spil/kategori/${cat.slug}`}
                className={`group flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 sm:py-3.5 font-semibold shadow-[0_5px_0_rgba(46,40,34,0.10),0_10px_20px_rgba(46,40,34,0.10)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_7px_0_rgba(46,40,34,0.10),0_14px_24px_rgba(46,40,34,0.14)] active:translate-y-0 active:shadow-[0_3px_0_rgba(46,40,34,0.10)] ${cat.className}`}
              >
                <Icon name={cat.icon} className="w-7 h-7" />
                <span className="font-display text-base sm:text-lg leading-none">
                  {tAge(cat.slug)}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold opacity-75 leading-none">
                  {cat.sublabel}
                </span>
              </Link>
            ))}
          </div>

          {/* Trust - hele forretningens eksistensberettigelse, hero-niveau */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {['Ærligt testet', '100% uafhængig', 'Ingen reklamer'].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-[#2E2822]/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#4A443C] backdrop-blur-sm"
              >
                <Icon name="check" className="w-3.5 h-3.5 text-[#16603A]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION HEADER HELPER
// ============================================================================

function SectionEyebrow({
  icon,
  color,
  children,
}: {
  icon: IconName;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase mb-2"
      style={{ color }}
    >
      <Icon name={icon} className="w-4 h-4" />
      {children}
    </p>
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
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal className="text-center mb-6 sm:mb-10">
          <SectionEyebrow icon="star" color="#C2410C">
            {t('editorChoice')}
          </SectionEyebrow>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E2822] mb-2">
            {t('editorChoiceTitle')}
          </h2>
          <p className="text-[#6B6258] text-base sm:text-lg max-w-xl mx-auto">
            {t('editorChoiceDesc')}
          </p>
        </Reveal>

        {/* Hylde på mobil (swipe), grid på desktop */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
          {games.map((game, index) => (
            <Reveal
              key={game.slug}
              delay={index * 0.06}
              className="min-w-[260px] w-[75vw] max-w-[300px] snap-start sm:w-auto sm:max-w-none sm:min-w-0 h-auto sm:h-full"
            >
              <GameCard
                imagePriority={index < 3}
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
            </Reveal>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-8 sm:mt-10">
          <Link href="/spil">
            <Button variant="outline" size="lg">
              {t('seeAllEditorChoice')}
              <Icon name="arrow-right" className="w-5 h-5 ml-2" />
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
    <section className="py-10 sm:py-14 bg-[#FBF5EC]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with special styling */}
        <Reveal className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <SectionEyebrow icon="shield" color="#16603A">
              {t('adFree')}
            </SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E2822] mb-2">
              {t('adFreeTitle')}
            </h2>
            <p className="text-[#6B6258] text-base sm:text-lg max-w-xl">{t('adFreeDesc')}</p>
          </div>

          {/* USP callout - hidden on mobile to save space */}
          <div className="hidden sm:block bg-white rounded-2xl p-5 shadow-sm border border-[#EAE3D8] max-w-sm">
            <div className="flex items-start gap-3">
              <Icon name="sparkle" className="w-7 h-7 text-[#9A6700] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#16603A] mb-1">{t('ourPromise')}</h4>
                <p className="text-sm text-[#4A443C]">{t('ourPromiseText')}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Hylde på mobil (swipe), grid på desktop */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
          {games.map((game, index) => (
            <Reveal
              key={game.slug}
              delay={index * 0.06}
              className="min-w-[260px] w-[75vw] max-w-[300px] snap-start sm:w-auto sm:max-w-none sm:min-w-0 h-auto sm:h-full"
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
            </Reveal>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-8 sm:mt-10">
          <Link href="/soeg?reklamefri=true">
            <Button variant="mint" size="lg">
              {t('seeAllAdFree')}
              <Icon name="arrow-right" className="w-5 h-5 ml-2" />
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
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <SectionEyebrow icon="dice" color="#5B4670">
              Brætspil
            </SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E2822] mb-2">
              {t('boardGamesTitle')}
            </h2>
            <p className="text-[#6B6258] text-lg max-w-xl">{t('boardGamesDesc')}</p>
          </div>

          <Link href="/braetspil">
            <Button variant="sunflower" size="lg">
              {t('exploreBoardGames')}
              <Icon name="arrow-right" className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </Reveal>

        {/* Board games display */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <Reveal key={game.slug} delay={index * 0.06} className="h-full">
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
              </Reveal>
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
                      <Icon name="dice" className="w-20 h-20 text-[#5B4670]" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  <h3 className="font-display text-2xl font-bold text-[#2E2822] mb-3">
                    {t('boardGamesTeaserTitle')}
                  </h3>
                  <p className="text-[#6B6258] mb-6 max-w-lg">{t('boardGamesTeaserDesc')}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-3 py-1 rounded-full bg-[#BAE1FF]/30 text-[#1D4E89] text-sm font-medium">{tCategories('strategy')}</span>
                    <span className="px-3 py-1 rounded-full bg-[#BAFFC9]/30 text-[#2D6A4F] text-sm font-medium">{tCategories('cooperative')}</span>
                    <span className="px-3 py-1 rounded-full bg-[#FFD1DC]/30 text-[#8B4563] text-sm font-medium">{tCategories('party')}</span>
                    <span className="px-3 py-1 rounded-full bg-[#E2C2FF]/30 text-[#5B4670] text-sm font-medium">{tCategories('family')}</span>
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
    <section className="py-10 sm:py-14 bg-[#FBF5EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <SectionEyebrow icon="tv" color="#1D4E89">
              Film & serier
            </SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2E2822] mb-2">
              {t('filmSerierTitle')}
            </h2>
            <p className="text-[#6B6258] text-lg max-w-xl">{t('filmSerierDesc')}</p>
          </div>

          <Link href="/film-serier">
            <Button variant="sky" size="lg">
              {t('exploreFilmSerier')}
              <Icon name="arrow-right" className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </Reveal>

        {/* Media display */}
        {media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {media.map((item, index) => {
              const streamingInfo = item.streamingInfo || [];

              return (
                <Reveal key={item.id} delay={index * 0.06} className="h-full">
                  <MediaCard
                    slug={item.slug}
                    title={item.title}
                    posterUrl={item.posterUrl}
                    type={item.type as 'MOVIE' | 'SERIES'}
                    isDanish={item.isDanish}
                    streamingInfo={streamingInfo}
                  />
                </Reveal>
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
                      <Icon name="tv" className="w-20 h-20 text-[#1D4E89]" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  <h3 className="font-display text-2xl font-bold text-[#2E2822] mb-3">
                    {t('filmSerierTeaserTitle')}
                  </h3>
                  <p className="text-[#6B6258] mb-6 max-w-lg">{t('filmSerierTeaserDesc')}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-3 py-1 rounded-full bg-[#FFB5A7]/30 text-[#8B4563] text-sm font-medium">Netflix</span>
                    <span className="px-3 py-1 rounded-full bg-[#A2D2FF]/30 text-[#1D4E89] text-sm font-medium">Disney+</span>
                    <span className="px-3 py-1 rounded-full bg-[#BAFFC9]/30 text-[#2D6A4F] text-sm font-medium">DR</span>
                    <span className="px-3 py-1 rounded-full bg-[#FFE66D]/30 text-[#7D6608] text-sm font-medium">HBO Max</span>
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
              <Icon name="check" className="w-4 h-4" />
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
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0E5A6D]">
            {/* Content */}
            <div className="relative px-6 py-8 sm:px-12 sm:py-12 text-center">
              <Icon name="search" className="w-10 h-10 sm:w-12 sm:h-12 text-white/90 mx-auto mb-3" />
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-3">
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
                  <Icon name="search" className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
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
    'Ærlige anmeldelser af 130+ digitale spil og brætspil til børn 0-15 år. Testet af forældre med fokus på reklamefri, sikre og lærerige spil.',
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
