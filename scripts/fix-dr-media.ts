#!/usr/bin/env tsx
// Fix DR_MANUAL media items that have broken poster URLs and missing descriptions
// This script searches TMDB for each Danish show and updates with proper data
// Usage: npx tsx scripts/fix-dr-media.ts [--dry-run]

import { prisma } from '../lib/db';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface TMDBSearchResult {
  id: number;
  name?: string;
  title?: string;
  overview: string;
  poster_path?: string;
  first_air_date?: string;
  release_date?: string;
  original_language?: string;
}

async function searchTMDB(title: string, type: 'tv' | 'movie' = 'tv'): Promise<TMDBSearchResult | null> {
  try {
    // Search in Danish first
    const url = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=da-DK`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`  TMDB search error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Return the first result
      return data.results[0];
    }

    // Try English if Danish didn't work
    const urlEn = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=en-US`;
    const responseEn = await fetch(urlEn);
    const dataEn = await responseEn.json();

    if (dataEn.results && dataEn.results.length > 0) {
      return dataEn.results[0];
    }

    return null;
  } catch (error) {
    console.error(`  Error searching TMDB:`, error);
    return null;
  }
}

async function getTMDBDetails(tmdbId: number, type: 'tv' | 'movie' = 'tv'): Promise<{ overview: string; poster_path?: string } | null> {
  try {
    // Get details in Danish
    const url = `${TMDB_BASE_URL}/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&language=da-DK`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // If no Danish overview, try English
    if (!data.overview) {
      const urlEn = `${TMDB_BASE_URL}/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
      const responseEn = await fetch(urlEn);
      const dataEn = await responseEn.json();
      return {
        overview: dataEn.overview || '',
        poster_path: data.poster_path || dataEn.poster_path,
      };
    }

    return {
      overview: data.overview,
      poster_path: data.poster_path,
    };
  } catch (error) {
    console.error(`  Error getting TMDB details:`, error);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY not set in environment');
    process.exit(1);
  }

  console.log('🎬 DR Media Fixer');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  // Find DR_MANUAL items without descriptions
  const drMedia = await prisma.media.findMany({
    where: {
      source: 'DR_MANUAL',
      OR: [
        { description: null },
        { description: '' },
      ],
    },
    orderBy: { title: 'asc' },
  });

  console.log(`Found ${drMedia.length} DR media items needing fixes\n`);

  let fixed = 0;
  let notFound = 0;
  let errors = 0;

  for (let i = 0; i < drMedia.length; i++) {
    const media = drMedia[i];
    const progress = `[${i + 1}/${drMedia.length}]`;

    console.log(`${progress} ${media.title}`);
    console.log(`  Type: ${media.type}`);
    console.log(`  Current poster: ${media.posterUrl ? 'Has URL (may be broken)' : 'None'}`);

    // Search TMDB for this title
    const searchType = media.type === 'MOVIE' ? 'movie' : 'tv';
    const result = await searchTMDB(media.title, searchType);

    if (!result) {
      console.log(`  ❌ Not found on TMDB`);
      notFound++;
      console.log('');
      await sleep(300);
      continue;
    }

    console.log(`  ✅ Found on TMDB: ${result.name || result.title} (ID: ${result.id})`);

    // Get full details (for better description)
    const details = await getTMDBDetails(result.id, searchType);

    const newPosterUrl = result.poster_path
      ? `${TMDB_IMAGE_BASE}${result.poster_path}`
      : null;
    const newDescription = details?.overview || result.overview || '';

    console.log(`  📸 New poster: ${newPosterUrl ? 'Yes' : 'No'}`);
    console.log(`  📝 Description: ${newDescription ? newDescription.substring(0, 80) + '...' : 'None'}`);

    if (!dryRun) {
      try {
        await prisma.media.update({
          where: { id: media.id },
          data: {
            tmdbId: result.id,
            description: newDescription || undefined,
            posterUrl: newPosterUrl || undefined,
          },
        });
        console.log(`  ✅ Updated in database`);
        fixed++;
      } catch (error) {
        console.error(`  ❌ Error updating:`, error);
        errors++;
      }
    } else {
      console.log(`  ✅ Would update in database`);
      fixed++;
    }

    console.log('');
    await sleep(300); // Rate limiting
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  ✅ Fixed: ${fixed}`);
  console.log(`  ❌ Not found on TMDB: ${notFound}`);
  console.log(`  ⚠️  Errors: ${errors}`);
  console.log('='.repeat(60));

  if (dryRun) {
    console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.');
  }

  if (notFound > 0) {
    console.log('\n📝 Items not found on TMDB will need manual descriptions.');
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
