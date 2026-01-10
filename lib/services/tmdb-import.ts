// TMDB Import Service

import { prisma } from '@/lib/db';
import * as tmdb from './tmdb';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Provider name normalization
function normalizeProviderName(name: string): string {
  const mapping: Record<string, string> = {
    netflix: 'netflix',
    'disney plus': 'disney',
    'disney+': 'disney',
    viaplay: 'viaplay',
    'hbo max': 'hbo',
    max: 'hbo',
    skyshowtime: 'skyshowtime',
    'tv 2 play': 'tv2',
    'apple tv plus': 'apple',
    'apple tv+': 'apple',
    'amazon prime video': 'prime',
  };
  return mapping[name.toLowerCase()] || name.toLowerCase().replace(/\s+/g, '-');
}

// Import movies from TMDB
export async function importTMDBMovies(limit = 100): Promise<number> {
  const movies = await tmdb.discoverKidsMovies(Math.ceil(limit / 20));
  let imported = 0;

  for (const movie of movies.slice(0, limit)) {
    try {
      // Check if it already exists
      const existing = await prisma.media.findUnique({
        where: { tmdbId: movie.id },
      });

      if (existing) continue;

      // Get streaming providers
      const providers = await tmdb.getMovieProviders(movie.id);
      await sleep(100);

      // Create movie
      await prisma.media.create({
        data: {
          tmdbId: movie.id,
          title: movie.title,
          originalTitle:
            movie.original_title !== movie.title
              ? movie.original_title
              : null,
          slug: `film-${movie.id}-${movie.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .slice(0, 50)}`,
          type: 'MOVIE',
          source: 'TMDB',
          description: movie.overview || null,
          posterUrl: tmdb.getTMDBImageUrl(movie.poster_path),
          backdropUrl: tmdb.getTMDBImageUrl(movie.backdrop_path, 'w1280'),
          releaseDate: movie.release_date
            ? new Date(movie.release_date)
            : null,
          streamingInfo: {
            create:
              providers?.flatrate?.map((p: any) => ({
                provider: normalizeProviderName(p.provider_name),
                providerId: p.provider_id,
                available: true,
              })) || [],
          },
        },
      });

      imported++;
    } catch (error) {
      console.error(`Failed to import movie ${movie.title}:`, error);
    }
  }

  return imported;
}

// Import series from TMDB
export async function importTMDBSeries(limit = 100): Promise<number> {
  const series = await tmdb.discoverKidsSeries(Math.ceil(limit / 20));
  let imported = 0;

  for (const show of series.slice(0, limit)) {
    try {
      const existing = await prisma.media.findUnique({
        where: { tmdbId: show.id },
      });

      if (existing) continue;

      const providers = await tmdb.getTVProviders(show.id);
      await sleep(100);

      await prisma.media.create({
        data: {
          tmdbId: show.id,
          title: show.name,
          originalTitle:
            show.original_name !== show.name ? show.original_name : null,
          slug: `serie-${show.id}-${show.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .slice(0, 50)}`,
          type: 'SERIES',
          source: 'TMDB',
          description: show.overview || null,
          posterUrl: tmdb.getTMDBImageUrl(show.poster_path),
          backdropUrl: tmdb.getTMDBImageUrl(show.backdrop_path, 'w1280'),
          releaseDate: show.first_air_date
            ? new Date(show.first_air_date)
            : null,
          streamingInfo: {
            create:
              providers?.flatrate?.map((p: any) => ({
                provider: normalizeProviderName(p.provider_name),
                providerId: p.provider_id,
                available: true,
              })) || [],
          },
        },
      });

      imported++;
    } catch (error) {
      console.error(`Failed to import series ${show.name}:`, error);
    }
  }

  return imported;
}

// Update streaming status for existing TMDB titles
export async function refreshTMDBStreamingStatus(limit = 50): Promise<number> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find titles that haven't been checked recently
  const mediaToUpdate = await prisma.media.findMany({
    where: {
      source: 'TMDB',
      tmdbId: { not: null },
      OR: [
        { streamingInfo: { none: {} } },
        { streamingInfo: { some: { lastChecked: { lt: oneDayAgo } } } },
      ],
    },
    take: limit,
  });

  let updated = 0;

  for (const media of mediaToUpdate) {
    try {
      const providers =
        media.type === 'MOVIE'
          ? await tmdb.getMovieProviders(media.tmdbId!)
          : await tmdb.getTVProviders(media.tmdbId!);

      // Delete old providers
      await prisma.streamingInfo.deleteMany({
        where: { mediaId: media.id },
      });

      // Add new ones
      if (providers?.flatrate?.length > 0) {
        await prisma.streamingInfo.createMany({
          data: providers.flatrate.map((p: any) => ({
            mediaId: media.id,
            provider: normalizeProviderName(p.provider_name),
            providerId: p.provider_id,
            available: true,
            lastChecked: new Date(),
          })),
        });
      }

      updated++;
      await sleep(250);
    } catch (error) {
      console.error(`Failed to update ${media.title}:`, error);
    }
  }

  return updated;
}
