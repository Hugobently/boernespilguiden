#!/usr/bin/env tsx
// CLI Script to enhance media descriptions using AI
// Usage: npx tsx scripts/enhance-media.ts [limit] [--force]

import { prisma } from '../lib/db';
import { enhanceMediaDescriptionWithRetry } from '../lib/services/ai-enhance';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = process.argv.slice(2);
  const limit = parseInt(args[0]) || 10;
  const force = args.includes('--force');

  console.log('🚀 Media Description Enhancement Tool');
  console.log(`Limit: ${limit} items`);
  console.log(`Force reprocess: ${force}`);
  console.log('');

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set in environment');
    console.error('Please add it to your .env file');
    process.exit(1);
  }

  // Find media that needs enhancement
  const mediaToEnhance = await prisma.media.findMany({
    where: {
      isActive: true,
      description: { not: null },
      ...(force
        ? {}
        : {
            OR: [
              { parentInfo: null },
              { pros: { equals: [] } },
            ],
          }),
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log(`Found ${mediaToEnhance.length} media items to enhance\n`);

  let enhanced = 0;
  let failed = 0;

  for (let i = 0; i < mediaToEnhance.length; i++) {
    const media = mediaToEnhance[i];
    const progress = `[${i + 1}/${mediaToEnhance.length}]`;

    try {
      console.log(`${progress} Enhancing: ${media.title}`);

      if (!media.description) {
        console.log(`  ⏭️  Skipped - no description`);
        continue;
      }

      // Get release year
      const releaseYear = media.releaseDate
        ? new Date(media.releaseDate).getFullYear()
        : undefined;

      // Call AI enhancement
      const result = await enhanceMediaDescriptionWithRetry({
        title: media.title,
        originalTitle: media.originalTitle || undefined,
        type: media.type as 'MOVIE' | 'SERIES',
        description: media.description,
        genres: media.genres,
        ageMin: media.ageMin || undefined,
        ageMax: media.ageMax || undefined,
        releaseYear,
        isDanish: media.isDanish,
        hasDanishAudio: media.hasDanishAudio || undefined,
      });

      // Update media with enhanced content
      await prisma.media.update({
        where: { id: media.id },
        data: {
          description: result.description,
          parentInfo: result.parentInfo,
          parentTip: result.parentTip,
          pros: result.pros,
          cons: result.cons,
          hasViolence: result.hasViolence,
          hasScaryContent: result.hasScaryContent,
          hasLanguage: result.hasLanguage,
          hasEducational: result.hasEducational,
        },
      });

      enhanced++;
      console.log(`  ✅ Enhanced successfully`);
      console.log(`  📝 Description: ${result.description.substring(0, 100)}...`);
      console.log(`  👍 Pros: ${result.pros.length}`);
      console.log(`  ⚠️  Cons: ${result.cons.length}`);
      console.log('');

      // Rate limiting - wait 2 seconds between requests
      if (i < mediaToEnhance.length - 1) {
        console.log('  ⏳ Waiting 2 seconds (rate limiting)...\n');
        await sleep(2000);
      }
    } catch (error) {
      failed++;
      console.error(`  ❌ Failed:`, error);
      console.log('');
    }
  }

  console.log('📊 Summary:');
  console.log(`  Total: ${mediaToEnhance.length}`);
  console.log(`  Enhanced: ${enhanced}`);
  console.log(`  Failed: ${failed}`);

  // Show overall stats
  const [total, withParentInfo] = await Promise.all([
    prisma.media.count({ where: { isActive: true } }),
    prisma.media.count({ where: { isActive: true, parentInfo: { not: null } } }),
  ]);

  console.log('\n📈 Overall Progress:');
  console.log(`  Total media: ${total}`);
  console.log(`  With parent info: ${withParentInfo}`);
  console.log(`  Remaining: ${total - withParentInfo}`);
  console.log(`  Progress: ${Math.round((withParentInfo / total) * 100)}%`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
