// Update existing media with correct age ratings from TMDB content ratings
// Standalone version with inline TMDB functions

const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY || '932750e2e3aa637e3f6cb4c046f46639';

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// TMDB API fetch
async function tmdbFetch(endpoint) {
  const url = `https://api.themoviedb.org/3${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }
  return response.json();
}

// Get content ratings for a TV series
async function getTVContentRatings(tmdbId) {
  try {
    const data = await tmdbFetch(`/tv/${tmdbId}/content_ratings`);
    return data.results || [];
  } catch {
    return [];
  }
}

// Convert content rating to age range
function ratingToAgeRange(ratings) {
  if (!ratings || ratings.length === 0) {
    return { min: 3, max: 10 }; // Default for children's TV
  }

  // Prioritize Danish/European ratings, then US
  const dk = ratings.find(r => r.iso_3166_1 === 'DK');
  const de = ratings.find(r => r.iso_3166_1 === 'DE');
  const us = ratings.find(r => r.iso_3166_1 === 'US');

  const rating = (dk?.rating || de?.rating || us?.rating || '').toString();

  // Mapping based on known rating systems
  const ratingMap = {
    // US TV Ratings
    'TV-Y': { min: 0, max: 6 },
    'TV-Y7': { min: 5, max: 10 },
    'TV-Y7-FV': { min: 6, max: 10 },
    'TV-G': { min: 4, max: 12 },
    'TV-PG': { min: 7, max: 12 },

    // German ratings (FSK)
    '0': { min: 0, max: 6 },
    '6': { min: 4, max: 10 },
    '12': { min: 8, max: 12 },

    // Danish ratings
    'A': { min: 0, max: 12 },
    '7': { min: 5, max: 10 },
    '11': { min: 8, max: 12 },
  };

  return ratingMap[rating] || { min: 3, max: 10 };
}

async function updateAgeRatings() {
  console.log('🔄 Updating age ratings for existing media...\n');

  try {
    // Find all TV series from TMDB with default age ranges
    const media = await prisma.media.findMany({
      where: {
        source: 'TMDB',
        type: 'SERIES',
        tmdbId: { not: null },
        // Only ones with default 3-12 or 3-10
        OR: [
          { ageMin: 3, ageMax: 12 },
          { ageMin: 3, ageMax: 10 },
        ],
      },
    });

    console.log(`Found ${media.length} TV series to update\n`);

    let updated = 0;
    let unchanged = 0;
    let failed = 0;

    for (let i = 0; i < media.length; i++) {
      const item = media[i];
      const progress = `[${i + 1}/${media.length}]`;

      try {
        console.log(`${progress} Checking: ${item.title}`);

        // Get content ratings from TMDB
        const ratings = await getTVContentRatings(item.tmdbId);
        const { min, max } = ratingToAgeRange(ratings);

        // Only update if different from current
        if (min !== item.ageMin || max !== item.ageMax) {
          await prisma.media.update({
            where: { id: item.id },
            data: { ageMin: min, ageMax: max },
          });

          console.log(`  ✅ Updated: ${item.ageMin}-${item.ageMax} → ${min}-${max} år`);
          updated++;
        } else {
          console.log(`  ⏭️  Unchanged: ${min}-${max} år`);
          unchanged++;
        }

        // Rate limiting - 100ms between requests
        await sleep(100);
      } catch (error) {
        console.error(`  ❌ Failed:`, error.message);
        failed++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  Total processed: ${media.length}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Unchanged: ${unchanged}`);
    console.log(`  Failed: ${failed}`);

    if (updated > 0) {
      console.log(`\n✅ Successfully updated ${updated} media items with correct age ratings!\n`);
    } else {
      console.log('\n✅ All media already has correct age ratings!\n');
    }

  } catch (error) {
    console.error('❌ Error updating age ratings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateAgeRatings();
