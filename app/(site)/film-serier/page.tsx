// Film & Serier Overview Page

import { prisma } from '@/lib/db';
import { MediaCard } from '@/components/media/MediaCard';
import { Pagination } from '@/components/Pagination';
import { ageGroups } from '@/lib/config/age-groups';
import { StreamingFilter } from '@/components/filters';
import { FloatingBlobs } from '@/components/brand';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

interface SearchParams {
  type?: string;
  streaming?: string;
  alder?: string;
  page?: string;
}

export const metadata = {
  title: 'Film & Serier til Børn',
  description:
    'Find de bedste børnefilm og serier på streaming. Se hvor du kan se dem - Netflix, Disney+, DR TV og flere.',
  alternates: {
    canonical: '/film-serier',
  },
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
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-transparent to-transparent pointer-events-none" />
      <FloatingBlobs className="opacity-30" />

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
            <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#DCEDFC] text-[#1D4E89] flex items-center justify-center flex-shrink-0">
              <Icon name="tv" className="w-7 h-7 sm:w-8 sm:h-8" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Film & Serier til Børn
            </h1>
          </div>
          <p className="text-lg text-text-secondary max-w-xl">
            Find de bedste børnefilm og serier på streaming
          </p>
        </div>

        {/* Filters Card */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft border border-white/50 space-y-5">
          {/* Type filters */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Type</h3>
            <div className="flex gap-2">
              <Link
                href={buildUrl({ type: undefined })}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px] flex items-center gap-2',
                  'hover:-translate-y-0.5 active:translate-y-0',
                  !type
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-white text-text-secondary hover:bg-gray-50 border border-gray-200'
                )}
              >
                <Icon name="sparkle" className="w-4 h-4" />
                <span>Alle</span>
              </Link>
              <Link
                href={buildUrl({ type: 'film' })}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px] flex items-center gap-2',
                  'hover:-translate-y-0.5 active:translate-y-0',
                  type === 'film'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-text-secondary hover:bg-gray-50 border border-gray-200'
                )}
              >
                <Icon name="film" className="w-4 h-4" />
                <span>Film</span>
              </Link>
              <Link
                href={buildUrl({ type: 'serier' })}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[40px] flex items-center gap-2',
                  'hover:-translate-y-0.5 active:translate-y-0',
                  type === 'serier'
                    ? 'bg-accent text-text-primary shadow-md'
                    : 'bg-white text-text-secondary hover:bg-gray-50 border border-gray-200'
                )}
              >
                <Icon name="tv" className="w-4 h-4" />
                <span>Serier</span>
              </Link>
            </div>
          </div>

          {/* Age filters */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Alder</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildUrl({ alder: undefined })}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 min-h-[40px]',
                  'hover:-translate-y-0.5 active:translate-y-0',
                  !alder
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-text-secondary hover:bg-gray-50 border border-gray-200'
                )}
              >
                <Icon name="sparkle" className="w-4 h-4" />
                <span>Alle aldre</span>
              </Link>

              {ageGroups.map((config) => (
                <Link
                  key={config.slug}
                  href={buildUrl({ alder: config.slug })}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 min-h-[40px]',
                    'hover:-translate-y-0.5 active:translate-y-0',
                    alder === config.slug
                      ? 'shadow-md'
                      : 'hover:shadow-sm border border-gray-200'
                  )}
                  style={{
                    backgroundColor: alder === config.slug ? config.color.bgSelected : 'white',
                    color: alder === config.slug ? config.color.text : undefined,
                  }}
                >
                  <Icon name={config.icon} className="w-4 h-4" />
                  <span>{config.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Streaming filters - using new component */}
          <StreamingFilter
            currentStreaming={streaming}
            currentType={type}
            currentAge={alder}
            basePath="/film-serier"
          />
        </div>

        {/* Results */}
        {media.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-2xl">
            <Icon name="search" className="w-12 h-12 mb-4 mx-auto text-[#6B6258]/60" />
            <p className="text-text-secondary text-lg">Ingen film eller serier fundet</p>
            <p className="text-text-muted text-sm mt-2">Prøv at ændre dine filtre</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-secondary mb-4">
              Viser {startIndex}-{endIndex} af {totalItems} resultater
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {media.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <MediaCard
                    slug={item.slug}
                    title={item.title}
                    posterUrl={item.posterUrl}
                    type={item.type as 'MOVIE' | 'SERIES'}
                    ageMin={item.ageMin}
                    ageMax={item.ageMax}
                    isDanish={item.isDanish}
                    streamingInfo={item.streamingInfo}
                  />
                </div>
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
        <div className="mt-12 pt-8 border-t border-gray-200/50 text-sm text-text-muted text-center">
          <p>Streaming-data fra JustWatch og TMDB</p>
          <p className="mt-1 text-xs">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </div>
  );
}
