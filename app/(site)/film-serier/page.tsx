// Film & Serier Overview Page

import { prisma } from '@/lib/db';
import { MediaCard } from '@/components/media/MediaCard';
import { Pagination } from '@/components/Pagination';
import { ageGroups } from '@/lib/config/age-groups';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SearchParams {
  type?: string;
  streaming?: string;
  alder?: string;
  page?: string;
}

export const metadata = {
  title: 'Film & Serier til Børn | Børnespilguiden',
  description:
    'Find de bedste børnefilm og serier på streaming. Se hvor du kan se dem - Netflix, Disney+, DR TV og flere.',
};

export default async function FilmSerierPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { type, streaming, alder, page } = params;

  // Helper to build query string with preserved filters
  const buildUrl = (newParams: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams();
    const merged = { type, streaming, alder, ...newParams };

    Object.entries(merged).forEach(([key, value]) => {
      if (value && key !== 'page') {
        urlParams.set(key, value);
      }
    });

    const queryString = urlParams.toString();
    return queryString ? `/film-serier?${queryString}` : '/film-serier';
  };

  // Pagination
  const currentPage = parseInt(page || '1');
  const itemsPerPage = 24;

  // Build query filters
  const where: {
    isActive: boolean;
    type?: string;
    streamingInfo?: { some: { provider: string; available: boolean } };
    ageMin?: { lte?: number; gte?: number };
    ageMax?: { gte?: number; lte?: number };
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
    // Map age group to age ranges (matching game pages)
    // '0-3' => ages 0-3
    // '3-6' => ages 3-6
    // '7+' => ages 7+
    if (alder === '0-3') {
      where.ageMin = { lte: 3 };
      where.ageMax = { gte: 0 };
    } else if (alder === '3-6') {
      where.ageMin = { lte: 6 };
      where.ageMax = { gte: 3 };
    } else if (alder === '7+') {
      where.ageMin = { gte: 7 };
    }
  }

  // Get total count for pagination
  const totalItems = await prisma.media.count({ where });

  // Fetch media with pagination
  const media = await prisma.media.findMany({
    where,
    include: {
      streamingInfo: {
        where: { available: true },
      },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  // Calculate pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

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
      <div className="mb-8 space-y-6">
        {/* Type filters */}
        <div>
          <h3 className="text-sm font-semibold text-[#4A4A4A] mb-3">Type</h3>
          <div className="flex gap-2">
            <a
              href={buildUrl({ type: undefined })}
              className={`px-4 py-2 rounded-lg ${
                !type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Alle
            </a>
            <a
              href={buildUrl({ type: 'film' })}
              className={`px-4 py-2 rounded-lg ${
                type === 'film'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Film
            </a>
            <a
              href={buildUrl({ type: 'serier' })}
              className={`px-4 py-2 rounded-lg ${
                type === 'serier'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Serier
            </a>
          </div>
        </div>

        {/* Age filters */}
        <div>
          <h3 className="text-sm font-semibold text-[#4A4A4A] mb-3">Alder</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href={buildUrl({ alder: undefined })}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200',
                !alder
                  ? 'bg-[#FFB5A7] text-white shadow-[0_4px_0_0_#E8958A]'
                  : 'bg-[#FFFCF7] text-[#4A4A4A] shadow-sm hover:shadow-md border-2 border-[#FFB5A7]/30'
              )}
            >
              <span className="text-xl">✨</span>
              <span>Alle aldre</span>
            </Link>

            {ageGroups.map((config) => (
              <Link
                key={config.slug}
                href={buildUrl({ alder: config.slug })}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200',
                  alder === config.slug
                    ? 'shadow-[0_4px_0_0_var(--shadow-color)]'
                    : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
                )}
                style={{
                  backgroundColor: alder === config.slug ? config.color.bgSelected : config.color.bg,
                  color: config.color.text,
                  '--shadow-color': config.color.shadow,
                  borderWidth: '2px',
                  borderColor: alder === config.slug ? config.color.border : 'transparent',
                } as React.CSSProperties}
              >
                <span className="text-xl">{config.emoji}</span>
                <span>{config.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Streaming filters */}
        <div>
          <h3 className="text-sm font-semibold text-[#4A4A4A] mb-3">Streaming-tjenester</h3>
          <div className="flex gap-2 flex-wrap">
          <a
            href={buildUrl({ streaming: undefined })}
            className={`px-4 py-2 rounded-lg ${
              !streaming
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Alle
          </a>
          <a
            href={buildUrl({ streaming: 'drtv' })}
            className={`px-4 py-2 rounded-lg ${
              streaming === 'drtv'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            DR TV
          </a>
          <a
            href={buildUrl({ streaming: 'filmstriben' })}
            className={`px-4 py-2 rounded-lg ${
              streaming === 'filmstriben'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Filmstriben
          </a>
          <a
            href={buildUrl({ streaming: 'netflix' })}
            className={`px-4 py-2 rounded-lg ${
              streaming === 'netflix'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Netflix
          </a>
          <a
            href={buildUrl({ streaming: 'disney' })}
            className={`px-4 py-2 rounded-lg ${
              streaming === 'disney'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Disney+
          </a>
          <a
            href={buildUrl({ streaming: 'apple' })}
            className={`px-4 py-2 rounded-lg ${
              streaming === 'apple'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Apple TV+
          </a>
          </div>
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
            Viser {startIndex}-{endIndex} af {totalItems} resultater
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            baseUrl="/film-serier"
          />
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
