import { Metadata } from 'next';
import { Navigation } from '@/components/layout';
import { GameGrid } from '@/components/games';
import { AgeFilter } from '@/components/filters';
import { AGE_CATEGORIES } from '@/lib/utils';
import prisma from '@/lib/db';

interface PageProps {
  params: { age: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = AGE_CATEGORIES.find((c) => c.slug === params.age);

  return {
    title: category
      ? `Brætspil til ${category.label}`
      : 'Brætspil efter alder',
    description: category
      ? `Find de bedste brætspil til børn i alderen ${category.label}`
      : 'Find brætspil efter aldersgruppe',
  };
}

function getAgeRange(slug: string): { min: number; max: number } | null {
  switch (slug) {
    case '0-3':
      return { min: 0, max: 3 };
    case '4-6':
      return { min: 4, max: 6 };
    case '7-9':
      return { min: 7, max: 9 };
    case '10-12':
      return { min: 10, max: 12 };
    case '13+':
      return { min: 13, max: 99 };
    default:
      return null;
  }
}

export default async function BoardGamesByCategoryPage({ params }: PageProps) {
  const ageRange = getAgeRange(params.age);
  const category = AGE_CATEGORIES.find((c) => c.slug === params.age);

  const games = ageRange
    ? await prisma.game.findMany({
        where: {
          type: 'BOARD',
          minAge: { lte: ageRange.max },
          maxAge: { gte: ageRange.min },
        },
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navigation
        breadcrumbs={[
          { label: 'Brætspil', href: '/braetspil' },
          { label: category?.label || params.age },
        ]}
        className="mb-8"
      />

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{category?.emoji || '🎲'}</span>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal">
              Brætspil til {category?.label || params.age}
            </h1>
            <p className="text-slate">{category?.description}</p>
          </div>
        </div>
      </div>

      <AgeFilter basePath="/braetspil" selectedAge={params.age} className="mb-8" />

      <GameGrid games={games} />
    </div>
  );
}
