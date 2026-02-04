/**
 * Database Migration Script for Media
 *
 * Updates existing game records in the database with screenshot and video URLs
 * without resetting the entire database. Safe for production use.
 */

import { PrismaClient } from '@prisma/client';
import { games0to3, games3to6, games7to10, games11to15, GameSeedData } from '../data/games-seed';

const prisma = new PrismaClient();

// ============================================
// TYPES
// ============================================

interface MigrationResult {
  slug: string;
  success: boolean;
  error?: string;
  screenshotsUpdated: boolean;
  videoUpdated: boolean;
}

// ============================================
// MIGRATION
// ============================================

async function migrateGameMedia(game: GameSeedData): Promise<MigrationResult> {
  try {
    const hasScreenshots = game.screenshotUrls && game.screenshotUrls.length > 0;
    const hasVideo = game.videoUrl && game.videoUrl.trim() !== '';

    // Check if game exists
    const existingGame = await prisma.game.findUnique({
      where: { slug: game.slug }
    });

    if (!existingGame) {
      return {
        slug: game.slug,
        success: false,
        error: 'Game not found in database',
        screenshotsUpdated: false,
        videoUpdated: false
      };
    }

    // Prepare update data
    const updateData: any = {};

    if (hasScreenshots) {
      updateData.screenshots = JSON.stringify(game.screenshotUrls);
    }

    if (hasVideo) {
      updateData.videoUrl = game.videoUrl;
    }

    // Only update if there's data to update
    if (Object.keys(updateData).length === 0) {
      return {
        slug: game.slug,
        success: true,
        screenshotsUpdated: false,
        videoUpdated: false
      };
    }

    // Update the game
    await prisma.game.update({
      where: { slug: game.slug },
      data: updateData
    });

    return {
      slug: game.slug,
      success: true,
      screenshotsUpdated: hasScreenshots,
      videoUpdated: hasVideo
    };
  } catch (error) {
    return {
      slug: game.slug,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      screenshotsUpdated: false,
      videoUpdated: false
    };
  }
}

async function migrateAllGames(): Promise<MigrationResult[]> {
  const allGames = [
    ...games0to3,
    ...games3to6,
    ...games7to10,
    ...games11to15
  ];

  console.log(`\n📱 Migrating media for ${allGames.length} games...\n`);

  const results: MigrationResult[] = [];

  for (const game of allGames) {
    const result = await migrateGameMedia(game);
    results.push(result);

    const status = result.success ? '✓' : '✗';
    const updates: string[] = [];
    if (result.screenshotsUpdated) updates.push('screenshots');
    if (result.videoUpdated) updates.push('video');

    const updateText = updates.length > 0
      ? ` (${updates.join(', ')})`
      : ' (no updates)';

    console.log(`${status} ${game.slug}${updateText}`);

    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }

    // Progress indicator
    if ((results.length % 10) === 0) {
      console.log(`   Progress: ${results.length}/${allGames.length}`);
    }
  }

  return results;
}

// ============================================
// REPORT
// ============================================

function printReport(results: MigrationResult[]): void {
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const withScreenshots = results.filter(r => r.screenshotsUpdated).length;
  const withVideos = results.filter(r => r.videoUpdated).length;
  const withBoth = results.filter(r => r.screenshotsUpdated && r.videoUpdated).length;

  console.log('\n' + '='.repeat(60));
  console.log('MIGRATION REPORT');
  console.log('='.repeat(60));
  console.log(`Total games processed: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);
  console.log(`\nMedia updates:`);
  console.log(`  - Games with screenshots added: ${withScreenshots}`);
  console.log(`  - Games with videos added: ${withVideos}`);
  console.log(`  - Games with both added: ${withBoth}`);

  if (failed > 0) {
    console.log(`\n⚠️  Failed games:`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.slug}: ${r.error}`);
    });
  }

  console.log('='.repeat(60) + '\n');
}

// ============================================
// VERIFICATION
// ============================================

async function verifyMigration(): Promise<void> {
  console.log('\n🔍 Verifying migration...\n');

  const gamesWithScreenshots = await prisma.game.count({
    where: {
      screenshots: {
        not: null,
        not: '[]',
        not: ''
      }
    }
  });

  const gamesWithVideos = await prisma.game.count({
    where: {
      videoUrl: {
        not: null,
        not: ''
      }
    }
  });

  const totalGames = await prisma.game.count();

  console.log(`Database statistics:`);
  console.log(`  - Total games: ${totalGames}`);
  console.log(`  - Games with screenshots: ${gamesWithScreenshots} (${Math.round(gamesWithScreenshots/totalGames*100)}%)`);
  console.log(`  - Games with videos: ${gamesWithVideos} (${Math.round(gamesWithVideos/totalGames*100)}%)`);
  console.log('');
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n🎮 GAME MEDIA DATABASE MIGRATION\n');
  console.log('This script will update the database with media from games-seed.ts\n');
  console.log('⚠️  This is a production-safe migration that only updates media fields.\n');

  const results = await migrateAllGames();
  printReport(results);
  await verifyMigration();

  console.log('✅ Migration complete!\n');
  console.log('Next steps:');
  console.log('1. Test the game detail pages to verify media displays correctly');
  console.log('2. Check screenshot galleries and video players');
  console.log('3. Verify mobile responsiveness\n');
}

main()
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
