#!/usr/bin/env tsx
// Fetch content from Filmstriben, Apple TV+, and TV 2 Play
// Usage: npx tsx scripts/fetch-streaming-content.ts <provider> [limit] [--dry-run]
// Example: npx tsx scripts/fetch-streaming-content.ts filmstriben 50

import { prisma } from '../lib/db';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Provider configurations with TMDB watch provider IDs
// https://developer.themoviedb.org/reference/watch-providers-movie-list
const PROVIDERS = {
  filmstriben: {
    name: 'Filmstriben',
    tmdbId: 483, // Filmstriben's TMDB ID (if available)
    region: 'DK',
    notes: 'Free via Danish libraries',
    isFree: true,
  },
  apple: {
    name: 'Apple TV+',
    tmdbId: 350, // Apple TV+ TMDB ID
    region: 'DK',
    notes: 'Subscription service',
    isFree: false,
  },
  tv2: {
    name: 'TV 2 Play',
    tmdbId: 383, // TV 2 Play TMDB ID (approximate)
    region: 'DK',
    notes: 'Danish streaming service',
    isFree: false,
  },
};

type ProviderKey = keyof typeof PROVIDERS;

interface TMDBMovie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  genre_ids?: number[];
  original_language?: string;
  vote_average?: number;
}

interface TMDBTVShow {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  first_air_date?: string;
  genre_ids?: number[];
  original_language?: string;
  vote_average?: number;
}

interface TMDBGenre {
  id: number;
  name: string;
}

// Map TMDB genre IDs to our genre names
const GENRE_MAPPING: Record<number, string> = {
  // Movies
  12: 'eventyr',
  16: 'animation',
  35: 'komedie',
  18: 'drama',
  27: 'gyser',
  10751: 'familie',
  14: 'fantasy',
  878: 'sci-fi',
  10402: 'musik',
  9648: 'mysterium',
  // TV
  10762: 'børn',
  10763: 'nyheder',
  10764: 'reality',
  10765: 'sci-fi-fantasy',
  10766: 'soap',
  10767: 'talk',
  10768: 'krig-politik',
};

async function fetchFromTMDB(endpoint: string): Promise<any> {
  const url = `${TMDB_BASE_URL}${endpoint}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

async function getContentCertification(tmdbId: number, type: 'movie' | 'tv'): Promise<{ ageMin: number; ageMax: number }> {
  try {
    const endpoint = type === 'movie'
      ? `/movie/${tmdbId}/release_dates?api_key=${TMDB_API_KEY}`
      : `/tv/${tmdbId}/content_ratings?api_key=${TMDB_API_KEY}`;

    const data = await fetchFromTMDB(endpoint);

    // Look for Danish (DK) rating first
    const dkRating = type === 'movie'
      ? data.results?.find((r: any) => r.iso_3166_1 === 'DK')?.release_dates?.[0]?.certification
      : data.results?.find((r: any) => r.iso_3166_1 === 'DK')?.rating;

    // Parse rating to age range
    if (dkRating) {
      const match = dkRating.match(/(\d+)/);
      if (match) {
        const age = parseInt(match[1]);
        return { ageMin: age, ageMax: 18 };
      }
    }

    // Default to all ages if no rating found
    return { ageMin: 0, ageMax: 18 };
  } catch (error) {
    console.error(`  ⚠️  Could not fetch certification:`, error);
    return { ageMin: 0, ageMax: 18 };
  }
}

async function discoverContent(
  provider: ProviderKey,
  type: 'movie' | 'tv',
  page: number = 1
): Promise<(TMDBMovie | TMDBTVShow)[]> {
  const config = PROVIDERS[provider];

  const endpoint = type === 'movie'
    ? `/discover/movie?api_key=${TMDB_API_KEY}&language=da-DK&region=${config.region}&watch_region=${config.region}&with_watch_providers=${config.tmdbId}&page=${page}&sort_by=popularity.desc&certification_country=DK&certification.lte=11`
    : `/discover/tv?api_key=${TMDB_API_KEY}&language=da-DK&watch_region=${config.region}&with_watch_providers=${config.tmdbId}&page=${page}&sort_by=popularity.desc`;

  try {
    const data = await fetchFromTMDB(endpoint);
    return data.results || [];
  } catch (error) {
    console.error(`  ❌ Error discovering ${type} content:`, error);
    return [];
  }
}

function mapGenres(genreIds: number[]): string[] {
  return genreIds
    .map(id => GENRE_MAPPING[id])
    .filter(Boolean);
}

function createSlug(title: string, id: number): string {
  return title
    .toLowerCase()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'oe')
    .replace(/[å]/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + `-${id}`;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: npx tsx scripts/fetch-streaming-content.ts <provider> [limit] [--dry-run]');
    console.error('');
    console.error('Providers:');
    Object.entries(PROVIDERS).forEach(([key, value]) => {
      console.error(`  ${key}: ${value.name} (${value.notes})`);
    });
    process.exit(1);
  }

  const providerKey = args[0] as ProviderKey;
  const limit = parseInt(args[1]) || 50;
  const dryRun = args.includes('--dry-run');

  if (!PROVIDERS[providerKey]) {
    console.error(`❌ Unknown provider: ${providerKey}`);
    console.error('Available providers:', Object.keys(PROVIDERS).join(', '));
    process.exit(1);
  }

  if (!TMDB_API_KEY) {
    console.error('❌ TMDB_API_KEY not set in environment');
    console.error('Please add it to your .env file');
    process.exit(1);
  }

  const provider = PROVIDERS[providerKey];

  console.log(`📺 Streaming Content Fetcher`);
  console.log(`Provider: ${provider.name}`);
  console.log(`Limit: ${limit} items`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  let added = 0;
  let skipped = 0;
  let errors = 0;

  // Fetch movies
  console.log('🎬 Fetching movies...\n');

  let moviePage = 1;
  let moviesFetched = 0;

  while (moviesFetched < limit / 2) {
    const movies = await discoverContent(providerKey, 'movie', moviePage);

    if (movies.length === 0) break;

    for (const movie of movies as TMDBMovie[]) {
      if (moviesFetched >= limit / 2) break;

      const progress = `[${added + skipped + 1}]`;
      console.log(`${progress} ${movie.title}`);

      try {
        // Check if already exists
        const existing = await prisma.media.findFirst({
          where: { tmdbId: movie.id },
        });

        if (existing) {
          console.log(`  ⏭️  Already exists, updating streaming info...`);

          if (!dryRun) {
            // Add streaming provider if not already present
            const hasProvider = await prisma.streamingInfo.findFirst({
              where: {
                mediaId: existing.id,
                provider: providerKey,
              },
            });

            if (!hasProvider) {
              await prisma.streamingInfo.create({
                data: {
                  mediaId: existing.id,
                  provider: providerKey,
                  available: true,
                  isFree: provider.isFree,
                },
              });
              console.log(`  ✅ Added streaming provider`);
            }
          }

          skipped++;
        } else {
          // Get age rating
          const { ageMin, ageMax } = await getContentCertification(movie.id, 'movie');

          const slug = createSlug(movie.title, movie.id);
          const posterUrl = movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null;
          const genres = mapGenres(movie.genre_ids || []);

          console.log(`  📸 Poster: ${posterUrl ? 'Yes' : 'No'}`);
          console.log(`  🎭 Genres: ${genres.join(', ') || 'None'}`);
          console.log(`  👶 Ages: ${ageMin}-${ageMax}`);

          if (!dryRun) {
            const newMedia = await prisma.media.create({
              data: {
                slug,
                title: movie.title,
                originalTitle: movie.original_title !== movie.title ? movie.original_title : null,
                description: movie.overview || '',
                type: 'MOVIE',
                tmdbId: movie.id,
                posterUrl,
                genres,
                ageMin,
                ageMax,
                releaseDate: movie.release_date ? new Date(movie.release_date) : null,
                isDanish: movie.original_language === 'da',
                source: 'TMDB',
                isActive: true,
              },
            });

            // Add streaming info
            await prisma.streamingInfo.create({
              data: {
                mediaId: newMedia.id,
                provider: providerKey,
                available: true,
                isFree: provider.isFree,
              },
            });

            console.log(`  ✅ Added to database`);
          }

          added++;
        }
      } catch (error) {
        console.error(`  ❌ Error processing movie:`, error);
        errors++;
      }

      moviesFetched++;
      console.log('');

      await sleep(250);
    }

    moviePage++;
    await sleep(500);
  }

  // Fetch TV shows
  console.log('\n📺 Fetching TV shows...\n');

  let tvPage = 1;
  let tvFetched = 0;

  while (tvFetched < limit / 2) {
    const shows = await discoverContent(providerKey, 'tv', tvPage);

    if (shows.length === 0) break;

    for (const show of shows as TMDBTVShow[]) {
      if (tvFetched >= limit / 2) break;

      const progress = `[${added + skipped + 1}]`;
      console.log(`${progress} ${show.name}`);

      try {
        // Check if already exists
        const existing = await prisma.media.findFirst({
          where: { tmdbId: show.id },
        });

        if (existing) {
          console.log(`  ⏭️  Already exists, updating streaming info...`);

          if (!dryRun) {
            const hasProvider = await prisma.streamingInfo.findFirst({
              where: {
                mediaId: existing.id,
                provider: providerKey,
              },
            });

            if (!hasProvider) {
              await prisma.streamingInfo.create({
                data: {
                  mediaId: existing.id,
                  provider: providerKey,
                  available: true,
                  isFree: provider.isFree,
                },
              });
              console.log(`  ✅ Added streaming provider`);
            }
          }

          skipped++;
        } else {
          const { ageMin, ageMax } = await getContentCertification(show.id, 'tv');

          const slug = createSlug(show.name, show.id);
          const posterUrl = show.poster_path ? `${TMDB_IMAGE_BASE}${show.poster_path}` : null;
          const genres = mapGenres(show.genre_ids || []);

          console.log(`  📸 Poster: ${posterUrl ? 'Yes' : 'No'}`);
          console.log(`  🎭 Genres: ${genres.join(', ') || 'None'}`);
          console.log(`  👶 Ages: ${ageMin}-${ageMax}`);

          if (!dryRun) {
            const newMedia = await prisma.media.create({
              data: {
                slug,
                title: show.name,
                originalTitle: show.original_name !== show.name ? show.original_name : null,
                description: show.overview || '',
                type: 'SERIES',
                tmdbId: show.id,
                posterUrl,
                genres,
                ageMin,
                ageMax,
                releaseDate: show.first_air_date ? new Date(show.first_air_date) : null,
                isDanish: show.original_language === 'da',
                source: 'TMDB',
                isActive: true,
              },
            });

            await prisma.streamingInfo.create({
              data: {
                mediaId: newMedia.id,
                provider: providerKey,
                available: true,
                isFree: provider.isFree,
              },
            });

            console.log(`  ✅ Added to database`);
          }

          added++;
        }
      } catch (error) {
        console.error(`  ❌ Error processing TV show:`, error);
        errors++;
      }

      tvFetched++;
      console.log('');

      await sleep(250);
    }

    tvPage++;
    await sleep(500);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  ✅ Added: ${added}`);
  console.log(`  ⏭️  Skipped (already exists): ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log('='.repeat(60));

  if (dryRun) {
    console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.');
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
