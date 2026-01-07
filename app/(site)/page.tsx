import Link from 'next/link';
import { Suspense } from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { Button } from '@/components/ui';
import { SearchBar } from '@/components/filters';
import { GameCard } from '@/components/games';
import { getHomepageDataWithTranslation } from '@/lib/translations';
import { WebsiteJsonLdScript, JsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

// ============================================================================
// AGE CATEGORY CARDS CONFIG
// ============================================================================

const ageCategoryConfig = [
  {
    slug: '0-3',
    emoji: '👶',
    color: {
      bg: 'from-[#FFD1DC] to-[#FFB6C1]',
      text: '#8B4563',
      shadow: '#E89AAB',
    },
  },
  {
    slug: '3-6',
    emoji: '🧒',
    color: {
      bg: 'from-[#BAFFC9] to-[#95D5A6]',
      text: '#2D6A4F',
      shadow: '#7BC492',
    },
  },
  {
    slug: '7+',
    emoji: '👦',
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
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFB5A7]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A2D2FF]/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#B8E0D2]/15 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Floating game icons */}
          <div className="flex justify-center items-center gap-3 sm:gap-6 mb-8">
            <span className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>🎮</span>
            <span className="text-5xl sm:text-6xl animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2s' }}>⭐</span>
            <span className="text-4xl sm:text-5xl animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '2s' }}>🎲</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#4A4A4A] mb-6 leading-tight">
            {t('heroTitle')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-[#7A7A7A] mb-4 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <p className="text-base text-[#9CA3AF] mb-10 max-w-xl mx-auto">
            {t('heroDescription')}
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <Suspense fallback={
              <div className="h-14 bg-[#FFFCF7] rounded-2xl animate-pulse" />
            }>
              <SearchBar
                variant="hero"
                placeholder={tCommon('searchPlaceholderLong')}
              />
            </Suspense>
          </div>

          {/* Quick age links */}
          <div className="flex flex-wrap justify-center gap-3">
            {ageCategoryConfig.map((cat, index) => (
              <Link
                key={cat.slug}
                href={`/spil?alder=${cat.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${cat.color.bg.split(' ')[0].replace('from-[', '').replace(']', '')}, ${cat.color.bg.split(' ')[1].replace('to-[', '').replace(']', '')})`,
                  color: cat.color.text,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span>{tAge(cat.slug as '0-3' | '3-6' | '7+')}</span>
              </Link>
            ))}
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
    <section className="py-16 bg-gradient-to-b from-transparent via-[#FFF9F0]/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFE66D] to-[#FFD93D] text-[#7D6608] font-bold text-sm mb-4">
            <span>⭐</span>
            <span>{t('editorChoice')}</span>
            <span>⭐</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-3">
            {t('editorChoiceTitle')}
          </h2>
          <p className="text-[#7A7A7A] text-lg max-w-xl mx-auto">
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
                platforms={game.platforms}
                categories={game.categories}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link href="/spil?editor=true">
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
// AGE CATEGORIES SECTION
// ============================================================================

interface AgeCategoriesSectionProps {
  gameCounts: Record<string, number>;
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
  tAge: Awaited<ReturnType<typeof getTranslations<'ageGroups'>>>;
}

function AgeCategoriesSection({ gameCounts, t, tAge }: AgeCategoriesSectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-3">
            {t('chooseAge')}
          </h2>
          <p className="text-[#7A7A7A] text-lg">
            {t('chooseAgeDesc')}
          </p>
        </div>

        {/* Age cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ageCategoryConfig.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/spil?alder=${cat.slug}`}
              className="group animate-slide-up opacity-0"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div
                className="relative rounded-3xl p-6 sm:p-8 text-center overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${cat.color.bg.split(' ')[0].replace('from-[', '').replace(']', '')}, ${cat.color.bg.split(' ')[1].replace('to-[', '').replace(']', '')})`,
                }}
              >
                {/* Decorative circle */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 group-hover:scale-150 transition-transform duration-500" />

                {/* Emoji */}
                <div className="relative mb-4">
                  <span className="text-6xl sm:text-7xl block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {cat.emoji}
                  </span>
                </div>

                {/* Label */}
                <h3
                  className="text-xl sm:text-2xl font-bold mb-1"
                  style={{ color: cat.color.text }}
                >
                  {tAge(cat.slug as '0-3' | '3-6' | '7+')}
                </h3>

                {/* Description */}
                <p
                  className="text-sm opacity-80 mb-3"
                  style={{ color: cat.color.text }}
                >
                  {tAge(`${cat.slug}-desc` as '0-3-desc' | '3-6-desc' | '7+-desc')}
                </p>

                {/* Game count */}
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/40 text-sm font-semibold"
                  style={{ color: cat.color.text }}
                >
                  <span>🎮</span>
                  <span>{t('gamesCount', { count: gameCounts[cat.slug] || 0 })}</span>
                </div>
              </div>
            </Link>
          ))}
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
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D8F3DC]/30 via-transparent to-[#BAE1FF]/20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with special styling */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#77DD77] text-white font-bold text-sm mb-4">
              <span>🛡️</span>
              <span>{t('adFree')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-3">
              {t('adFreeTitle')}
            </h2>
            <p className="text-[#7A7A7A] text-lg max-w-xl">
              {t('adFreeDesc')}
            </p>
          </div>

          {/* USP callout */}
          <div className="bg-[#FFFCF7] rounded-2xl p-5 shadow-md border-2 border-[#77DD77]/30 max-w-sm">
            <div className="flex items-start gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <h4 className="font-bold text-[#2D6A4F] mb-1">{t('ourPromise')}</h4>
                <p className="text-sm text-[#4A4A4A]">
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
                platforms={game.platforms}
                categories={game.categories}
              />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link href="/spil?reklamefri=true">
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
    <section className="py-16 bg-gradient-to-b from-transparent via-[#FFE66D]/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">🎲</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A]">
                {t('boardGamesTitle')}
              </h2>
            </div>
            <p className="text-[#7A7A7A] text-lg max-w-xl">
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
                  categories={game.categories}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Teaser card when no board games */
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFE66D] via-[#FFD93D] to-[#FFB5A7] p-1">
            <div className="bg-[#FFFCF7] rounded-[1.4rem] p-8 sm:p-12">
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
// CTA SECTION
// ============================================================================

interface CTASectionProps {
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
}

function CTASection({ t }: CTASectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFB5A7] via-[#CDB4DB] to-[#A2D2FF]" />

          {/* Content */}
          <div className="relative px-8 py-12 sm:px-12 sm:py-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-4xl opacity-20">✨</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-20">🎯</div>
            <div className="absolute top-1/2 left-8 text-3xl opacity-10 -translate-y-1/2">🎮</div>
            <div className="absolute top-1/2 right-8 text-3xl opacity-10 -translate-y-1/2">🎲</div>

            <span className="text-5xl block mb-4">🔍</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {t('cantFind')}
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              {t('cantFindDesc')}
            </p>
            <Link href="/soeg">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-[#4A4A4A] hover:bg-[#FFFCF7] shadow-lg"
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

      {/* Age Categories Section */}
      <AgeCategoriesSection gameCounts={data.gameCounts} t={t} tAge={tAge} />

      {/* Ad-Free Favorites Section */}
      <AdFreeSection games={data.adFreeGames} t={t} />

      {/* Board Games Teaser Section */}
      <BoardGamesSection games={data.featuredBoardGames} t={t} tCategories={tCategories} />

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
  title: 'Børnespilguiden - Find de bedste spil til børn 2025 | Anmeldelser & Guide',
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
    'bedste børnespil 2025',
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
