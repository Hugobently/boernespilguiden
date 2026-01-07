import { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { Navigation } from '@/components/layout';
import { GameGrid } from '@/components/games';
import { AgeFilter } from '@/components/filters';
import { getGamesWithTranslation } from '@/lib/translations';

export const metadata: Metadata = {
  title: 'Digitale Spil til Børn - Apps, Tablet & Konsolspil',
  description:
    'Find de bedste digitale spil til børn. Apps til iPad og Android, computerspil og konsolspil. Anmeldelser med fokus på sikkerhed, læring og sjov.',
  keywords: [
    'digitale spil til børn',
    'apps til børn',
    'tablet spil',
    'iPad spil børn',
    'Android spil børn',
    'computerspil til børn',
    'læringsspil',
  ],
  openGraph: {
    title: 'Digitale Spil til Børn - Børnespilguiden',
    description:
      'Find de bedste digitale spil til børn. Apps, computerspil og konsolspil med anmeldelser.',
    type: 'website',
    url: '/spil',
  },
  alternates: {
    canonical: '/spil',
  },
};

// Age group configuration
const ageGroupRanges: Record<string, { min: number; max: number }> = {
  '0-3': { min: 0, max: 3 },
  '3-6': { min: 3, max: 6 },
  '7-10': { min: 7, max: 10 },
  '11-15': { min: 11, max: 15 },
};

interface PageProps {
  searchParams: Promise<{ alder?: string }>;
}

export default async function DigitalGamesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedAge = params.alder;
  const locale = await getLocale();
  const t = await getTranslations('games');

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

  const games = await getGamesWithTranslation(
    {
      where,
      orderBy: { rating: 'desc' },
    },
    locale
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navigation
        breadcrumbs={[{ label: t('title') }]}
        className="mb-8"
      />

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">🎮</span>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
              {t('title')}
            </h1>
            <p className="text-slate">
              {selectedAge
                ? t('subtitleWithAge', { age: selectedAge })
                : t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      <AgeFilter basePath="/spil" className="mb-8" />

      <GameGrid games={games} type="digital" />
    </div>
  );
}
