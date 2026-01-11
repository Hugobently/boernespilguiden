#!/usr/bin/env tsx
// CLI Script to enhance game descriptions using AI
// Usage: npx tsx scripts/enhance-games.ts [limit] [--force] [--dry-run]

import { prisma } from '../lib/db';
import { enhanceGameDescriptionWithRetry } from '../lib/services/ai-enhance-game';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = process.argv.slice(2);
  const limit = parseInt(args.find(a => !a.startsWith('--')) || '10');
  const force = args.includes('--force');
  const dryRun = args.includes('--dry-run');

  console.log('🎮 Game Description Enhancement Tool');
  console.log(`Limit: ${limit} items`);
  console.log(`Force reprocess: ${force}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set in environment');
    process.exit(1);
  }

  // Find games that need enhancement
  const gamesToEnhance = await prisma.game.findMany({
    where: force
      ? {}
      : {
          OR: [
            { parentInfo: null },
            { parentInfo: '' },
          ],
        },
    take: limit,
    orderBy: {
      title: 'asc',
    },
  });

  console.log(`Found ${gamesToEnhance.length} games to enhance\n`);

  let enhanced = 0;
  let failed = 0;

  for (let i = 0; i < gamesToEnhance.length; i++) {
    const game = gamesToEnhance[i];
    const progress = `[${i + 1}/${gamesToEnhance.length}]`;

    try {
      console.log(`${progress} Enhancing: ${game.title}`);

      // Parse JSON fields
      const categories = JSON.parse(game.categories || '[]');
      const skills = JSON.parse(game.skills || '[]');
      const platforms = JSON.parse(game.platforms || '[]');

      if (dryRun) {
        console.log(`  Would enhance with AI`);
        console.log(`  Categories: ${categories.join(', ')}`);
        console.log(`  Skills: ${skills.join(', ')}`);
        enhanced++;
        console.log('');
        continue;
      }

      // Call AI enhancement
      const result = await enhanceGameDescriptionWithRetry({
        title: game.title,
        description: game.description,
        shortDescription: game.shortDescription,
        minAge: game.minAge,
        maxAge: game.maxAge,
        categories,
        skills,
        platforms,
        hasAds: game.hasAds,
        hasInAppPurchases: game.hasInAppPurchases,
        isOfflineCapable: game.isOfflineCapable,
        requiresInternet: game.requiresInternet,
        hasSocialFeatures: game.hasSocialFeatures || false,
        hasChat: game.hasChat || false,
      });

      // Update game with enhanced content
      await prisma.game.update({
        where: { id: game.id },
        data: {
          parentInfo: result.parentInfo,
          parentTip: result.parentTip,
          pros: JSON.stringify(result.pros),
          cons: JSON.stringify(result.cons),
        },
      });

      enhanced++;
      console.log(`  parentInfo: ${result.parentInfo.substring(0, 80)}...`);
      console.log(`  pros: ${result.pros.length}, cons: ${result.cons.length}`);
      console.log('');

      // Rate limiting - wait 2 seconds between requests
      if (i < gamesToEnhance.length - 1) {
        console.log('  Waiting 2 seconds...\n');
        await sleep(2000);
      }
    } catch (error) {
      failed++;
      console.error(`  Failed:`, error);
      console.log('');
    }
  }

  console.log('Summary:');
  console.log(`  Total: ${gamesToEnhance.length}`);
  console.log(`  Enhanced: ${enhanced}`);
  console.log(`  Failed: ${failed}`);

  // Show overall stats
  const [total, withParentInfo] = await Promise.all([
    prisma.game.count(),
    prisma.game.count({ where: { parentInfo: { not: null } } }),
  ]);

  console.log('\nOverall Progress:');
  console.log(`  Total games: ${total}`);
  console.log(`  With parentInfo: ${withParentInfo}`);
  console.log(`  Remaining: ${total - withParentInfo}`);

  if (dryRun) {
    console.log('\nThis was a dry run. Run without --dry-run to apply changes.');
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
