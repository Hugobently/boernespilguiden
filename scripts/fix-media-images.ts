#!/usr/bin/env tsx
// Fix missing images for media items (DR Ramasjang, etc.)
// Usage: npx tsx scripts/fix-media-images.ts [--dry-run]

import { prisma } from '../lib/db';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  original_language?: string;
}

interface TMDBResponse {
  results: TMDBSearchResult[];
}

async function searchTMDB(title: string, type: 'movie' | 'tv', year?: number): Promise<TMDBSearchResult | null> {
  try {
    const endpoint = type === 'movie' ? 'search/movie' : 'search/tv';
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY!,
      query: title,
      language: 'da-DK',
      include_adult: 'false',
    });

    if (year) {
      params.append(type === 'movie' ? 'year' : 'first_air_date_year', year.toString());
    }

    const url = `${TMDB_BASE_URL}/${endpoint}?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`  ❌ TMDB API error: ${response.status}`);
      return null;
    }

    const data: TMDBResponse = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  } catch (error) {
    console.error(`  ❌ Error searching TMDB:`, error);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🖼️  Media Image Fixer');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  if (!TMDB_API_KEY) {
    console.error('❌ TMDB_API_KEY not set in environment');
    console.error('Please add it to your .env file');
    process.exit(1);
  }

  // Find media without images
  const mediaWithoutImages = await prisma.media.findMany({
    where: {
      isActive: true,
      OR: [
        { posterUrl: null },
        { posterUrl: '' },
      ],
    },
    orderBy: {
      title: 'asc',
    },
  });

  console.log(`Found ${mediaWithoutImages.length} media items without images\n`);

  let fixed = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < mediaWithoutImages.length; i++) {
    const media = mediaWithoutImages[i];
    const progress = `[${i + 1}/${mediaWithoutImages.length}]`;

    console.log(`${progress} Processing: ${media.title}`);
    console.log(`  Type: ${media.type}`);
    console.log(`  Slug: ${media.slug}`);

    // If it already has a TMDB ID, use it directly
    if (media.tmdbId) {
      console.log(`  ℹ️  Has TMDB ID: ${media.tmdbId}`);

      // Fetch image from TMDB using the ID
      try {
        const type = media.type === 'MOVIE' ? 'movie' : 'tv';
        const url = `${TMDB_BASE_URL}/${type}/${media.tmdbId}?api_key=${TMDB_API_KEY}&language=da-DK`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();

          if (data.poster_path) {
            const posterUrl = `${TMDB_IMAGE_BASE}${data.poster_path}`;
            console.log(`  ✅ Found poster: ${posterUrl}`);

            if (!dryRun) {
              await prisma.media.update({
                where: { id: media.id },
                data: { posterUrl },
              });
              console.log(`  ✅ Updated database`);
            }

            fixed++;
          } else {
            console.log(`  ⚠️  No poster available`);
            failed++;
          }
        } else {
          console.log(`  ❌ TMDB API error: ${response.status}`);
          failed++;
        }
      } catch (error) {
        console.error(`  ❌ Error fetching from TMDB:`, error);
        failed++;
      }
    } else {
      // Search for the media on TMDB
      console.log(`  🔍 Searching TMDB...`);

      const releaseYear = media.releaseDate
        ? new Date(media.releaseDate).getFullYear()
        : undefined;

      const type = media.type === 'MOVIE' ? 'movie' : 'tv';
      const result = await searchTMDB(media.title, type, releaseYear);

      if (result && result.poster_path) {
        const posterUrl = `${TMDB_IMAGE_BASE}${result.poster_path}`;
        console.log(`  ✅ Found on TMDB (ID: ${result.id})`);
        console.log(`  📸 Poster: ${posterUrl}`);

        if (!dryRun) {
          await prisma.media.update({
            where: { id: media.id },
            data: {
              tmdbId: result.id,
              posterUrl,
            },
          });
          console.log(`  ✅ Updated database with TMDB ID and poster`);
        }

        fixed++;
      } else {
        console.log(`  ⚠️  Not found on TMDB or no poster available`);

        // For DR content, we could try using DR's own image API
        // if we had the entityId
        console.log(`  💡 Consider manually adding image or using DR API if available`);

        failed++;
      }
    }

    console.log('');

    // Rate limiting - wait 250ms between requests
    if (i < mediaWithoutImages.length - 1) {
      await sleep(250);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  ✅ Fixed: ${fixed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
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
