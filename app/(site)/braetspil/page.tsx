import { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { Navigation } from '@/components/layout';
import { GameGrid } from '@/components/games';
import { AgeFilter } from '@/components/filters';
import { StickyFilterBar, ResultsBar } from '@/components/ui';
import { FloatingBlobs } from '@/components/brand';
import { getBoardGamesWithTranslation } from '@/lib/translations';

export const metadata: Metadata = {
  title: 'Brætspil til Børn - Familie, Strategi & Samarbejdsspil',
  description:
    'Find de bedste brætspil til børn og familier. Anmeldelser af strategi-, samarbejds- og familiespil. Perfekt til hyggelige spilaftener.',
  keywords: [
    'brætspil til børn',
    'familiespil',
    'børnebrætspil',
    'samarbejdsspil',
    'strategispil børn',
    'spil til familier',
    'klassiske brætspil',
  ],
  openGraph: {
    title: 'Brætspil til Børn - Børnespilguiden',
    description:
      'Find de bedste brætspil til børn og familier. Anmeldelser af strategi-, samarbejds- og familiespil.',
    type: 'website',
    url: '/braetspil',
  },
  alternates: {
    canonical: '/braetspil',
  },
};

// Age group configuration
const ageGroupRanges: Record<string, { min: number; max: number }> = {
  '0-3': { min: 0, max: 3 },
  '3-6': { min: 3, max: 6 },
  '7+': { min: 7, max: 99 },
};

interface PageProps {
  searchParams: Promise<{ alder?: string }>;
}

export default async function BoardGamesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedAge = params.alder;
  const locale = await getLocale();
  const t = await getTranslations('boardGames');

  // Build where clause based on age filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let where: any = {};

  if (selectedAge && ageGroupRanges[selectedAge]) {
    const range = ageGroupRanges[selectedAge];
    where = {
      OR: [
        { minAge: { lte: range.max }, maxAge: { gte: range.min } },
        { ageGroup: selectedAge },
      ],
    };
  }

  const games = await getBoardGamesWithTranslation(
    {
      where,
      orderBy: { rating: 'desc' },
    },
    locale
  );

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-sunflower-light/30 via-transparent to-transparent pointer-events-none" />
      <FloatingBlobs className="opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navigation
          breadcrumbs={[{ label: t('title') }]}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
            <span className="text-4xl sm:text-5xl animate-bounce-slow">🎲</span>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
                {t('title')}
              </h1>
              <p className="text-text-secondary">
                {selectedAge
                  ? t('subtitleWithAge', { age: selectedAge })
                  : t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <StickyFilterBar className="mb-8">
          <AgeFilter basePath="/braetspil" />
        </StickyFilterBar>

        {/* Results Bar */}
        <ResultsBar
          totalResults={games.length}
          itemType="brætspil"
          activeFilters={selectedAge ? [{
            key: 'age',
            label: selectedAge === '0-3' ? '0-3 år' : selectedAge === '3-6' ? '3-6 år' : '7+ år',
            emoji: selectedAge === '0-3' ? '👶' : selectedAge === '3-6' ? '🧒' : '👦',
            color: selectedAge === '0-3' ? 'bg-[#FFD1DC] text-[#8B4563]' : selectedAge === '3-6' ? 'bg-[#BAFFC9] text-[#2D6A4F]' : 'bg-[#BAE1FF] text-[#1D4E89]',
            removeUrl: '/braetspil',
          }] : []}
          resetUrl="/braetspil"
          className="mb-6"
        />

        <GameGrid games={games} type="board" />
      </div>
    </div>
  );
}
