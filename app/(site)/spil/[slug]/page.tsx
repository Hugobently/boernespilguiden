import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { getAgeLabel } from '@/lib/utils';
import { parseJsonArray, Platform, DataCollection, PriceModel } from '@/lib/types';
import { GameCard, ParentInfoExpanded } from '@/components/games';
import { GameDetailImage } from '@/components/games/GameDetailImage';
import { getGameWithTranslation, getGamesWithTranslation } from '@/lib/translations';
import { GameJsonLd, JsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

// ============================================================================
// TYPES
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const game = await getGameWithTranslation(slug, locale);

  if (!game) {
    return { title: 'Game not found - Børnespilguiden' };
  }

  const categories = parseJsonArray<string>(game.categories);

  return {
    title: `${game.title} - Review | Børnespilguiden`,
    description: game.shortDescription,
    keywords: [
      game.title,
      'kids games',
      'review',
      `games for ${game.minAge}-${game.maxAge} year olds`,
      ...categories,
    ],
    openGraph: {
      title: `${game.title} - Review`,
      description: game.shortDescription,
      type: 'article',
      images: game.iconUrl ? [{ url: game.iconUrl, alt: game.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} - Review`,
      description: game.shortDescription,
    },
  };
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const platformConfig: Record<Platform, { icon: string; label: string; color: string }> = {
  iOS: { icon: '🍎', label: 'iOS', color: '#007AFF' },
  Android: { icon: '🤖', label: 'Android', color: '#3DDC84' },
  PC: { icon: '💻', label: 'PC', color: '#6B7280' },
  Nintendo: { icon: '🎮', label: 'Nintendo', color: '#E60012' },
  PlayStation: { icon: '🎯', label: 'PlayStation', color: '#003791' },
  Xbox: { icon: '🟢', label: 'Xbox', color: '#107C10' },
  Web: { icon: '🌐', label: 'Web', color: '#4F46E5' },
};

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-3xl transition-colors ${
            i < fullStars
              ? 'text-[#FFE66D]'
              : i === fullStars && hasHalf
              ? 'text-[#FFE66D]/60'
              : 'text-[#E5E5E5]'
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-xl font-bold text-[#4A4A4A] ml-2">{rating.toFixed(1)}</span>
    </div>
  );
}

function getAgeGroupColorExtended(minAge: number) {
  if (minAge <= 3) return { bg: '#FFD1DC', text: '#8B4563', gradient: 'from-[#FFD1DC] to-[#FFB6C1]' };
  if (minAge <= 6) return { bg: '#BAFFC9', text: '#2D6A4F', gradient: 'from-[#BAFFC9] to-[#95D5A6]' };
  // 7+ age group
  return { bg: '#BAE1FF', text: '#1D4E89', gradient: 'from-[#BAE1FF] to-[#8ECAE6]' };
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('games');
  const tCard = await getTranslations('gameCard');
  const tCommon = await getTranslations('common');

  const game = await getGameWithTranslation(slug, locale);

  if (!game) notFound();

  const categories = parseJsonArray<string>(game.categories);
  const skills = parseJsonArray<string>(game.skills);
  const platforms = parseJsonArray<Platform>(game.platforms);
  const pros = parseJsonArray<string>(game.pros);
  const cons = parseJsonArray<string>(game.cons);
  const themes = parseJsonArray<string>(game.themes);

  // Get related games with translations
  const allGames = await getGamesWithTranslation(
    {
      where: {
        AND: [
          { id: { not: game.id } },
          {
            OR: [
              { ageGroup: game.ageGroup },
              { minAge: { lte: game.maxAge }, maxAge: { gte: game.minAge } },
            ],
          },
        ],
      },
      orderBy: { rating: 'desc' },
      take: 4,
    },
    locale
  );

  const ageColors = getAgeGroupColorExtended(game.minAge);

  // Breadcrumb data for JSON-LD
  const breadcrumbItems = [
    { name: 'Forside', url: '/' },
    { name: 'Digitale spil', url: '/spil' },
    { name: `${game.ageGroup} år`, url: `/spil/kategori/${game.ageGroup}` },
    { name: game.title },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Structured Data for SEO */}
      <GameJsonLd game={game} type="digital" />
      <JsonLd data={generateBreadcrumbJsonLd(breadcrumbItems)} />

      {/* Breadcrumbs */}
      <div className="bg-white/50 border-b border-[#FFB5A7]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav>
            <ol className="flex items-center gap-2 text-sm text-[#7A7A7A]">
              <li>
                <Link href="/" className="hover:text-[#FFB5A7] transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/spil" className="hover:text-[#FFB5A7] transition-colors">
                  {t('breadcrumbDigital')}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/spil/kategori/${game.ageGroup}`}
                  className="hover:text-[#FFB5A7] transition-colors"
                >
                  {game.ageGroup} {tCommon('years')}
                </Link>
              </li>
              <li>/</li>
              <li className="text-[#4A4A4A] font-medium truncate max-w-[200px]">{game.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column - Image & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${ageColors.gradient}`} />

              <GameDetailImage
                src={game.iconUrl || `/images/games/digital/${game.slug}.jpg`}
                alt={game.title}
                title={game.title}
                type="digital"
              />

              {/* Editor's Choice Badge */}
              {game.editorChoice && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFE66D] to-[#FFB5A7] text-white font-bold shadow-lg text-sm">
                    <span className="animate-pulse">⭐</span>
                    {tCard('editorChoice')}
                  </span>
                </div>
              )}

              {/* Featured Badge */}
              {game.featured && !game.editorChoice && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#77DD77] text-white font-bold shadow-lg text-sm">
                    ✨ {tCard('recommended')}
                  </span>
                </div>
              )}
            </div>

            {/* Platform Links - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block space-y-3">
              {game.appStoreUrl && (
                <a
                  href={game.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#000000] text-white font-semibold hover:bg-[#333333] transition-all hover:shadow-lg"
                >
                  <span className="text-xl">🍎</span>
                  <span>{t('downloadAppStore')}</span>
                </a>
              )}
              {game.playStoreUrl && (
                <a
                  href={game.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#3DDC84] text-white font-semibold hover:bg-[#2BC472] transition-all hover:shadow-lg"
                >
                  <span className="text-xl">🤖</span>
                  <span>{t('downloadPlayStore')}</span>
                </a>
              )}
              {game.websiteUrl && (
                <a
                  href={game.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] transition-all hover:shadow-lg"
                >
                  <span className="text-xl">🌐</span>
                  <span>{t('visitWebsite')}</span>
                </a>
              )}
            </div>

            {/* Quick Stats Mobile */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4 text-center"
                style={{ backgroundColor: ageColors.bg }}
              >
                <span className="text-2xl block mb-1">👶</span>
                <span className="text-xs opacity-70" style={{ color: ageColors.text }}>
                  {t('ageGroup')}
                </span>
                <span
                  className="block font-bold text-lg"
                  style={{ color: ageColors.text }}
                >
                  {getAgeLabel(game.minAge, game.maxAge)}
                </span>
              </div>
              <div className="rounded-2xl p-4 text-center bg-[#FFE66D]/30">
                <span className="text-2xl block mb-1">⭐</span>
                <span className="text-xs text-[#7D6608] opacity-70">{t('rating')}</span>
                <span className="block font-bold text-lg text-[#7D6608]">
                  {game.rating.toFixed(1)}/5
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#BAE1FF] text-[#1D4E89] font-semibold text-sm">
                  <span>🎮</span> {t('digitalGame')}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm"
                  style={{ backgroundColor: ageColors.bg, color: ageColors.text }}
                >
                  {getAgeLabel(game.minAge, game.maxAge)}
                </span>
                {categories.slice(0, 3).map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#E2C2FF]/50 text-[#5B4670] font-medium text-sm capitalize"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A4A4A] mb-2">
                {game.title}
              </h1>

              {/* Developer */}
              {game.developerName && (
                <p className="text-[#7A7A7A] mb-4">{t('by')} {game.developerName}</p>
              )}

              {/* Rating - Desktop */}
              <div className="hidden lg:block">
                <StarRating rating={game.rating} />
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-[#4A4A4A] text-lg leading-relaxed">{game.description}</p>
            </div>

            {/* Hvad forældre skal vide - Udvidet sektion */}
            <ParentInfoExpanded
              parentInfo={(game as { parentInfo?: string | null }).parentInfo}
              parentTip={game.parentTip}
              hasAds={game.hasAds}
              hasInAppPurchases={game.hasInAppPurchases}
              price={game.price}
              priceModel={game.priceModel as PriceModel}
              hasManipulativeDesign={(game as { hasManipulativeDesign?: boolean }).hasManipulativeDesign}
              hasNotifications={(game as { hasNotifications?: boolean }).hasNotifications}
              typicalSessionMinutes={(game as { typicalSessionMinutes?: number | null }).typicalSessionMinutes}
              hasSocialFeatures={(game as { hasSocialFeatures?: boolean }).hasSocialFeatures}
              hasChat={(game as { hasChat?: boolean }).hasChat}
              hasScaryContent={(game as { hasScaryContent?: boolean }).hasScaryContent}
              dataCollection={game.dataCollection as DataCollection}
              isCoppaCompliant={(game as { isCoppaCompliant?: boolean }).isCoppaCompliant}
              requiresReading={(game as { requiresReading?: boolean }).requiresReading}
              isOfflineCapable={game.isOfflineCapable}
              supportsDanish={game.supportsDanish}
              minAge={game.minAge}
              maxAge={game.maxAge}
            />

            {/* Platform Links - Mobile only, shown after description and parent info */}
            <div className="lg:hidden space-y-3">
              {game.appStoreUrl && (
                <a
                  href={game.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#000000] text-white font-semibold hover:bg-[#333333] transition-all hover:shadow-lg"
                >
                  <span className="text-xl">🍎</span>
                  <span>{t('downloadAppStore')}</span>
                </a>
              )}
              {game.playStoreUrl && (
                <a
                  href={game.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#3DDC84] text-white font-semibold hover:bg-[#2BC472] transition-all hover:shadow-lg"
                >
                  <span className="text-xl">🤖</span>
                  <span>{t('downloadPlayStore')}</span>
                </a>
              )}
              {game.websiteUrl && (
                <a
                  href={game.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#4F46E5] text-white font-semibold hover:bg-[#4338CA] transition-all hover:shadow-lg"
                >
                  <span className="text-xl">🌐</span>
                  <span>{t('visitWebsite')}</span>
                </a>
              )}
            </div>

            {/* Details Grid */}
            <div className="bg-[#FFFCF7] rounded-3xl p-6 shadow-sm border border-[#FFB5A7]/10">
              <h2 className="text-lg font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                {t('details')}
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm text-[#7A7A7A] mb-1">{t('ageGroup')}</dt>
                  <dd className="font-semibold text-[#4A4A4A]">
                    {getAgeLabel(game.minAge, game.maxAge)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-[#7A7A7A] mb-1">{t('price')}</dt>
                  <dd className="font-semibold text-[#4A4A4A]">
                    {game.price === 0 ? (
                      <span className="text-[#2D6A4F]">{tCommon('free')}</span>
                    ) : (
                      `${game.price} kr`
                    )}
                    {game.priceModel && game.priceModel !== 'gratis' && game.priceModel !== 'engangskøb' && (
                      <span className="text-sm text-[#7A7A7A] ml-1 capitalize">
                        ({game.priceModel})
                      </span>
                    )}
                  </dd>
                </div>

                {platforms.length > 0 && (
                  <div className="col-span-2">
                    <dt className="text-sm text-[#7A7A7A] mb-2">{t('platforms')}</dt>
                    <dd className="flex flex-wrap gap-2">
                      {platforms.map((p) => {
                        const config = platformConfig[p];
                        return (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-sm font-medium shadow-sm"
                          >
                            <span>{config?.icon || '📱'}</span>
                            <span>{config?.label || p}</span>
                          </span>
                        );
                      })}
                    </dd>
                  </div>
                )}

                {skills.length > 0 && (
                  <div className="col-span-2">
                    <dt className="text-sm text-[#7A7A7A] mb-2">{t('skillsTrained')}</dt>
                    <dd className="flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#E2C2FF]/30 text-[#5B4670] text-sm font-medium capitalize"
                        >
                          {s}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                {themes.length > 0 && (
                  <div className="col-span-2">
                    <dt className="text-sm text-[#7A7A7A] mb-2">{t('themes')}</dt>
                    <dd className="flex flex-wrap gap-2">
                      {themes.map((theme) => (
                        <span
                          key={theme}
                          className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#BAFFC9]/30 text-[#2D6A4F] text-sm font-medium capitalize"
                        >
                          {theme}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </div>
            </div>

            {/* Pros & Cons */}
            {(pros.length > 0 || cons.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {pros.length > 0 && (
                  <div className="bg-[#D8F3DC] rounded-3xl p-6">
                    <h3 className="font-bold text-[#2D6A4F] mb-4 flex items-center gap-2 text-lg">
                      <span className="text-2xl">👍</span>
                      {t('pros')}
                    </h3>
                    <ul className="space-y-3">
                      {pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#2D6A4F]">
                          <span className="text-[#77DD77] mt-0.5">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {cons.length > 0 && (
                  <div className="bg-[#FFB5A7]/20 rounded-3xl p-6">
                    <h3 className="font-bold text-[#6B3A2E] mb-4 flex items-center gap-2 text-lg">
                      <span className="text-2xl">👎</span>
                      {t('cons')}
                    </h3>
                    <ul className="space-y-3">
                      {cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#6B3A2E]">
                          <span className="text-[#E89488] mt-0.5">✗</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Parent Tip */}
            {game.parentTip && (
              <div className="bg-[#FFE66D]/20 border-l-4 border-[#FFE66D] rounded-r-2xl p-6">
                <h3 className="font-bold text-[#7D6608] mb-2 flex items-center gap-2 text-lg">
                  <span className="text-2xl">💡</span>
                  {t('parentTip')}
                </h3>
                <p className="text-[#4A4A4A]">{game.parentTip}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Games */}
        {allGames.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#4A4A4A] flex items-center gap-3">
                <span className="text-3xl">🎮</span>
                {t('similar')}
              </h2>
              <Link
                href={`/spil/kategori/${game.ageGroup}`}
                className="text-[#FFB5A7] font-semibold hover:underline hidden sm:inline-flex items-center gap-1"
              >
                {t('seeAllForAge', { age: game.ageGroup })}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allGames.map((relatedGame, index) => (
                <div
                  key={relatedGame.slug}
                  className="animate-slide-up opacity-0"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <GameCard
                    slug={relatedGame.slug}
                    title={relatedGame.title}
                    shortDescription={relatedGame.shortDescription}
                    type="digital"
                    minAge={relatedGame.minAge}
                    maxAge={relatedGame.maxAge}
                    iconUrl={relatedGame.iconUrl}
                    rating={relatedGame.rating}
                    featured={relatedGame.featured}
                    editorChoice={relatedGame.editorChoice}
                    priceModel={relatedGame.priceModel}
                    hasAds={relatedGame.hasAds}
                    hasInAppPurchases={relatedGame.hasInAppPurchases}
                    offlinePlay={relatedGame.isOfflineCapable}
                    supportsDanish={relatedGame.supportsDanish}
                    platforms={relatedGame.platforms}
                    categories={relatedGame.categories}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                href={`/spil/kategori/${game.ageGroup}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFB5A7] text-white font-semibold hover:bg-[#F8A99B] transition-colors"
              >
                {t('seeAllForAge', { age: game.ageGroup })}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}
