// Film & Serier Overview Page

import { prisma } from '@/lib/db';
import { MediaCard } from '@/components/media/MediaCard';

interface SearchParams {
  type?: string;
  streaming?: string;
  alder?: string;
}

export const metadata = {
  title: 'Film & Serier til Børn | Børnespilguiden',
  description:
    'Find de bedste børnefilm og serier på streaming. Se hvor du kan se dem - Netflix, Disney+, DR TV og flere.',
};

export default async function FilmSerierPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { type, streaming, alder } = searchParams;

  // Build query filters
  const where: {
    isActive: boolean;
    type?: string;
    streamingInfo?: { some: { provider: string; available: boolean } };
    ageMin?: { lte: number };
    ageMax?: { gte: number };
  } = {
    isActive: true,
  };

  if (type === 'film') {
    where.type = 'MOVIE';
  } else if (type === 'serier') {
    where.type = 'SERIES';
  }

  if (streaming) {
    where.streamingInfo = {
      some: {
        provider: streaming,
        available: true,
      },
    };
  }

  if (alder) {
    const age = parseInt(alder);
    where.ageMin = { lte: age };
    where.ageMax = { gte: age };
  }

  // Fetch media
  const media = await prisma.media.findMany({
    where,
    include: {
      streamingInfo: {
        where: { available: true },
      },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 50,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Film & Serier til Børn
        </h1>
        <p className="text-lg text-gray-600">
          Find de bedste børnefilm og serier på streaming
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex gap-2">
          <a
            href="/film-serier"
            className={`px-4 py-2 rounded-lg ${
              !type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Alle
          </a>
          <a
            href="/film-serier?type=film"
            className={`px-4 py-2 rounded-lg ${
              type === 'film'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Film
          </a>
          <a
            href="/film-serier?type=serier"
            className={`px-4 py-2 rounded-lg ${
              type === 'serier'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Serier
          </a>
        </div>

        <div className="flex gap-2">
          <a
            href="/film-serier?streaming=drtv"
            className={`px-4 py-2 rounded-lg ${
              streaming === 'drtv'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            DR TV
          </a>
          <a
            href="/film-serier?streaming=netflix"
            className={`px-4 py-2 rounded-lg ${
              streaming === 'netflix'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Netflix
          </a>
          <a
            href="/film-serier?streaming=disney"
            className={`px-4 py-2 rounded-lg ${
              streaming === 'disney'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Disney+
          </a>
        </div>
      </div>

      {/* Results */}
      {media.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Ingen film eller serier fundet</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Viser {media.length} resultater
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {media.map((item) => (
              <MediaCard
                key={item.id}
                slug={item.slug}
                title={item.title}
                posterUrl={item.posterUrl}
                type={item.type as 'MOVIE' | 'SERIES'}
                ageMin={item.ageMin}
                ageMax={item.ageMax}
                isDanish={item.isDanish}
                streamingInfo={item.streamingInfo}
              />
            ))}
          </div>
        </>
      )}

      {/* Attribution */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <p>Streaming-data fra JustWatch og TMDB</p>
        <p className="mt-1">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </div>
    </div>
  );
}
