import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { getAgeLabel } from '@/lib/utils';
import { parseJsonArray } from '@/lib/types';
import { GameCard, BoardGameParentInfo } from '@/components/games';
import { GameDetailImage } from '@/components/games/GameDetailImage';
import { getBoardGameWithTranslation, getBoardGamesWithTranslation } from '@/lib/translations';
import { GameJsonLd, JsonLd, generateBreadcrumbJsonLd, buildOpenGraph } from '@/lib/seo';
import { Icon } from '@/components/ui/Icon';
import { resolveGameImage } from '@/lib/game-image';

// ============================================================================
// TYPES
// ============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Prerender all board game pages at build time; unknown slugs still render
// on demand. The catalog only changes via deploys, so pages stay fresh.
export async function generateStaticParams() {
  try {
    const prisma = (await import('@/lib/db')).default;
    const games = await prisma.boardGame.findMany({ select: { slug: true } });
    return games.map((game) => ({ slug: game.slug }));
  } catch {
    // No database at build time (e.g. local build) — render on demand
    return [];
  }
}

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const game = await getBoardGameWithTranslation(slug, locale);

  if (!game) {
    return { title: 'Brætspillet blev ikke fundet' };
  }

  const ageLabel = game.maxAge >= 99 ? `${game.minAge}+ år` : `${game.minAge}-${game.maxAge} år`;
  const shortDesc = game.shortDescription.trim();
  const intro = /[.!?]$/.test(shortDesc) ? shortDesc : `${shortDesc}.`;
  const description = `${intro} Læs vores anmeldelse: ${ageLabel}, ${game.minPlayers}-${game.maxPlayers} spillere, ${game.rating.toFixed(1).replace('.', ',')}/5 stjerner.`;
  const image = resolveGameImage('board', slug, game.imageUrl) || '/og-image.png';

  return {
    title: `${game.title} anmeldelse – brætspil til børn ${ageLabel}`,
    description,
    alternates: {
      canonical: `/braetspil/${slug}`,
    },
    openGraph: buildOpenGraph({
      title: `${game.title} anmeldelse`,
      description,
      url: `/braetspil/${slug}`,
      type: 'article',
      images: [{ url: image, alt: game.title }],
    }),
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} anmeldelse`,
      description,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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
              ? 'text-[#9A6700]'
              : i === fullStars && hasHalf
              ? 'text-[#9A6700]/50'
              : 'text-[#6B6258]/25'
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-xl font-bold text-[#4A4A4A] ml-2">{rating.toFixed(1)}</span>
    </div>
  );
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function BoardGameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('boardGames');
  const tGames = await getTranslations('games');
  const tCard = await getTranslations('gameCard');
  const tCommon = await getTranslations('common');

  const game = await getBoardGameWithTranslation(slug, locale);

  if (!game) notFound();

  const categories = parseJsonArray<string>(game.categories);
  const skills = parseJsonArray<string>(game.skills);
  const pros = game.pros || [];
  const cons = game.cons || [];
  const themes = parseJsonArray<string>(game.themes);

  // Get related games with translations
  const relatedGames = await getBoardGamesWithTranslation(
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

  // Get complexity info with translations
  // Sværhedsgrad vises som 1-5 udfyldte prikker + label (ingen emoji)
  const getComplexityInfo = (complexity: number) => {
    switch (complexity) {
      case 1:
        return { label: t('easy'), level: 1, color: '#77DD77' };
      case 2:
        return { label: t('easy'), level: 2, color: '#BAFFC9' };
      case 3:
        return { label: t('medium'), level: 3, color: '#FFE66D' };
      case 4:
        return { label: t('hard'), level: 4, color: '#FFB5A7' };
      case 5:
        return { label: t('hard'), level: 5, color: '#E2C2FF' };
      default:
        return { label: '?', level: 0, color: '#E5E5E5' };
    }
  };

  const complexityInfo = getComplexityInfo(game.complexity);

  // Breadcrumb data for JSON-LD
  const breadcrumbItems = [
    { name: 'Forside', url: '/' },
    { name: 'Brætspil', url: '/braetspil' },
    { name: `${game.ageGroup} år`, url: `/braetspil/kategori/${game.ageGroup}` },
    { name: game.title },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Structured Data for SEO */}
      <GameJsonLd
        game={{ ...game, imageUrl: resolveGameImage('board', slug, game.imageUrl) }}
        type="board"
      />
      <JsonLd data={generateBreadcrumbJsonLd(breadcrumbItems)} />

      {/* Breadcrumbs */}
      <div className="bg-white/50 border-b border-[#FFE66D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav>
            <ol className="flex items-center gap-2 text-sm text-[#7A7A7A]">
              <li>
                <Link href="/" className="hover:text-[#C2410C] transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/braetspil" className="hover:text-[#C2410C] transition-colors">
                  {t('breadcrumbBoardGames')}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/braetspil/kategori/${game.ageGroup}`}
                  className="hover:text-[#C2410C] transition-colors"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column - Image & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFE66D]/30 to-[#FFB5A7]/30" />

              <GameDetailImage
                src={game.imageUrl || `/images/games/board/${game.slug}.jpg`}
                alt={game.title}
                title={game.title}
                type="board"
              />

              {/* Editor's Choice Badge */}
              {game.editorChoice && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-[#9A6700] font-bold shadow-lg text-sm">
                    <Icon name="star" className="w-4 h-4" />
                    {tCard('editorChoice')}
                  </span>
                </div>
              )}

              {/* Featured Badge */}
              {game.featured && !game.editorChoice && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 text-[#16603A] font-bold shadow-lg text-sm">
                    <Icon name="sparkle" className="w-4 h-4" /> {tCard('recommended')}
                  </span>
                </div>
              )}
            </div>

            {/* Buy Links */}
            <div className="space-y-3">
              {game.amazonUrl && (
                <a
                  href={game.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#FF9900] text-white font-semibold hover:bg-[#E68A00] transition-all hover:shadow-lg"
                >
                  <Icon name="tag" className="w-5 h-5" />
                  <span>{t('buyAt')} Amazon</span>
                </a>
              )}
              {game.affiliateUrl && (
                <a
                  href={game.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#5B4670] text-white font-semibold hover:bg-[#4A3660] transition-all hover:shadow-lg"
                >
                  <Icon name="coins" className="w-5 h-5" />
                  <span>{t('buyAt')}</span>
                </a>
              )}
            </div>

          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFE66D] text-[#7D6608] font-semibold text-sm">
                  <Icon name="dice" className="w-4 h-4" /> {tCard('boardGame')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm bg-[#0E5A6D] text-white">
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A4A4A] mb-4">
                {game.title}
              </h1>

              {/* Rating */}
              <StarRating rating={game.rating} />
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-[#BAE1FF]/30 rounded-2xl p-4 text-center">
                <span className="flex justify-center mb-2"><Icon name="users" className="w-8 h-8 text-[#1D4E89]" /></span>
                <span className="text-xs text-[#1D4E89] opacity-70">{t('players')}</span>
                <span className="block font-bold text-lg text-[#1D4E89]">
                  {game.minPlayers === game.maxPlayers
                    ? game.minPlayers
                    : `${game.minPlayers}-${game.maxPlayers}`}
                </span>
              </div>
              <div className="bg-[#BAFFC9]/30 rounded-2xl p-4 text-center">
                <span className="flex justify-center mb-2"><Icon name="clock" className="w-8 h-8 text-[#2D6A4F]" /></span>
                <span className="text-xs text-[#2D6A4F] opacity-70">{t('playTime')}</span>
                <span className="block font-bold text-lg text-[#2D6A4F]">
                  {game.playTimeMinutes} min
                </span>
              </div>
              <div
                className="rounded-2xl p-4 text-center"
                style={{ backgroundColor: `${complexityInfo.color}30` }}
              >
                <span className="flex items-center justify-center gap-1 h-8 mb-2">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: dot <= complexityInfo.level ? '#5B4670' : '#5B467030',
                      }}
                    />
                  ))}
                </span>
                <span className="text-xs text-[#5B4670] opacity-70">{t('complexity')}</span>
                <span className="block font-bold text-lg text-[#5B4670]">
                  {complexityInfo.label}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-[#4A4A4A] text-lg leading-relaxed">{game.description}</p>
            </div>

            {/* Hvad forældre skal vide */}
            <BoardGameParentInfo
              minAge={game.minAge}
              maxAge={game.maxAge}
              complexity={game.complexity}
              playTimeMinutes={game.playTimeMinutes}
              minPlayers={game.minPlayers}
              maxPlayers={game.maxPlayers}
              supportsDanish={game.supportsDanish}
              isCooperative={categories.includes('samarbejde')}
              parentTip={game.parentTip}
            />

            {/* Details Grid - spillere/tid/sværhedsgrad vises allerede i
                quick stats og forældre-panelet */}
            {(game.price || skills.length > 0 || themes.length > 0) && (
            <div className="bg-[#FFFCF7] rounded-3xl p-6 shadow-sm border border-[#FFE66D]/10">
              <h2 className="text-lg font-bold text-[#4A4A4A] mb-4 flex items-center gap-2">
                <Icon name="info" className="w-6 h-6 text-[#C2410C]" />
                {tGames('details')}
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {game.price && (
                  <div className="col-span-2">
                    <dt className="text-sm text-[#7A7A7A] mb-1">{tGames('price')}</dt>
                    <dd className="font-semibold text-[#4A4A4A]">{game.price} kr</dd>
                  </div>
                )}

                {skills.length > 0 && (
                  <div className="col-span-2">
                    <dt className="text-sm text-[#7A7A7A] mb-2">{tGames('skillsTrained')}</dt>
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
                    <dt className="text-sm text-[#7A7A7A] mb-2">{tGames('themes')}</dt>
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
            )}

            {/* Pros & Cons */}
            {(pros.length > 0 || cons.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {pros.length > 0 && (
                  <div className="bg-[#D8F3DC] rounded-3xl p-6">
                    <h3 className="font-bold text-[#2D6A4F] mb-4 flex items-center gap-2 text-lg">
                      <Icon name="check" className="w-6 h-6 text-[#16603A]" />
                      {tGames('pros')}
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
                      <Icon name="warning" className="w-6 h-6 text-[#A93409]" />
                      {tGames('cons')}
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

          </div>
        </div>

        {/* Related Board Games */}
        {relatedGames.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#4A4A4A] flex items-center gap-3">
                <Icon name="dice" className="w-8 h-8 text-[#5B4670]" />
                {t('similar')}
              </h2>
              <Link
                href={`/braetspil/kategori/${game.ageGroup}`}
                className="text-[#C2410C] font-semibold hover:underline hidden sm:inline-flex items-center gap-1"
              >
                {t('seeAllForAge', { age: game.ageGroup })}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGames.map((relatedGame, index) => (
                <div
                  key={relatedGame.slug}
                  className="animate-slide-up opacity-0 h-full"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <GameCard
                    slug={relatedGame.slug}
                    title={relatedGame.title}
                    shortDescription={relatedGame.shortDescription}
                    type="board"
                    minAge={relatedGame.minAge}
                    maxAge={relatedGame.maxAge}
                    imageUrl={relatedGame.imageUrl}
                    rating={relatedGame.rating}
                    featured={relatedGame.featured}
                    editorChoice={relatedGame.editorChoice}
                    supportsDanish={relatedGame.supportsDanish}
                    categories={relatedGame.categories}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                href={`/braetspil/kategori/${game.ageGroup}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE66D] text-[#7D6608] font-semibold hover:bg-[#FFD93D] transition-colors"
              >
                {t('seeAllForAge', { age: game.ageGroup })}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
