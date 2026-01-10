// Update existing media with correct age ratings from TMDB content ratings
// Fixes the issue where all titles show "3-12 år"

const { PrismaClient } = require('@prisma/client');
const { getTVContentRatings, ratingToAgeRange } = require('../lib/services/tmdb');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function updateAgeRatings() {
  console.log('🔄 Updating age ratings for existing media...\n');

  try {
    // Find all TV series from TMDB with default 3-12 age range
    const media = await prisma.media.findMany({
      where: {
        source: 'TMDB',
        type: 'SERIES',
        tmdbId: { not: null },
        // Only ones with default 3-12 or similar
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
