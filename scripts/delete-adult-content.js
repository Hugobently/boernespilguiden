// Delete adult content from production database
// Removes blacklisted TMDB entries

const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

// Adult content TMDB IDs to delete
const ADULT_IDS = [
  2190, 60625, 1434, 1433, 10283, 86831, 615, 32726, 2122, 456,
  3452, 2352, 49009, 106, 5371, 2912, 1508, 94605
];

async function deleteAdultContent() {
  console.log('🗑️  Deleting adult content from database...\n');

  try {
    // First, get the media items to see what we're deleting
    const toDelete = await prisma.media.findMany({
      where: { tmdbId: { in: ADULT_IDS } },
      select: { id: true, title: true, tmdbId: true },
    });

    if (toDelete.length === 0) {
      console.log('✅ No adult content found in database - already clean!\n');
      return;
    }

    console.log(`Found ${toDelete.length} adult content items to delete:\n`);
    toDelete.forEach(item => {
      console.log(`  - ${item.title} (TMDB ID: ${item.tmdbId})`);
    });
    console.log('');

    // Delete streaming info first (foreign key constraint)
    const streamingDeleted = await prisma.streamingInfo.deleteMany({
      where: {
        mediaId: { in: toDelete.map(m => m.id) }
      }
    });

    console.log(`✓ Deleted ${streamingDeleted.count} streaming info records`);

    // Delete media items
    const mediaDeleted = await prisma.media.deleteMany({
      where: {
        tmdbId: { in: ADULT_IDS }
      }
    });

    console.log(`✓ Deleted ${mediaDeleted.count} media items`);
    console.log('\n✅ Adult content successfully removed from database!\n');

  } catch (error) {
    console.error('❌ Error deleting adult content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAdultContent();
