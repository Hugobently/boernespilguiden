import { Metadata } from 'next';
import { Suspense } from 'react';
import { Navigation } from '@/components/layout';
import { GameGrid } from '@/components/games';
import { SearchBar } from '@/components/filters';
import prisma from '@/lib/db';

interface PageProps {
  searchParams: { q?: string };
}

export const metadata: Metadata = {
  title: 'Søg efter spil',
  description: 'Søg i vores store udvalg af børnespil',
};

async function SearchResults({ query }: { query: string }) {
  const games = query
    ? await prisma.game.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
      })
    : [];

  if (!query) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 animate-bounce-slow">🔍</div>
        <h3 className="font-display text-2xl text-charcoal mb-2">
          Begynd at søge
        </h3>
        <p className="text-slate">
          Skriv et søgeord for at finde spil
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-slate mb-6">
        {games.length === 0
          ? 'Ingen resultater fundet'
          : `${games.length} ${games.length === 1 ? 'resultat' : 'resultater'} for "${query}"`}
      </p>
      <GameGrid games={games} />
    </div>
  );
}

export default function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Navigation
        breadcrumbs={[{ label: 'Søg' }]}
        className="mb-8"
      />

      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-4">
          Søg efter spil
        </h1>
        <div className="max-w-xl">
          <SearchBar placeholder="Skriv et spilnavn eller søgeord..." />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-16">
            <div className="text-4xl animate-spin inline-block">🎮</div>
            <p className="text-slate mt-4">Søger...</p>
          </div>
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
