#!/usr/bin/env tsx
// Script to re-enhance ONLY DR_MANUAL media descriptions
// This fixes incorrect "kun udenlandsk tale" descriptions
// Usage: npx tsx scripts/reenhance-dr-media.ts [limit]

import { prisma } from '../lib/db';
import { enhanceMediaDescriptionWithRetry } from '../lib/services/ai-enhance';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = process.argv.slice(2);
  const limit = parseInt(args[0]) || 100; // Default to all DR programs

  console.log('Re-enhancing DR_MANUAL media descriptions');
  console.log(`Limit: ${limit} items\n`);

  // Check API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set in environment');
    process.exit(1);
  }

  // Find all DR_MANUAL media
  const drMedia = await prisma.media.findMany({
    where: {
      source: 'DR_MANUAL',
      isActive: true,
      description: { not: null },
    },
    take: limit,
    orderBy: {
      title: 'asc',
    },
  });

  console.log(`Found ${drMedia.length} DR programs to re-enhance\n`);

  let enhanced = 0;
  let failed = 0;

  for (let i = 0; i < drMedia.length; i++) {
    const media = drMedia[i];
    const progress = `[${i + 1}/${drMedia.length}]`;

    try {
      console.log(`${progress} ${media.title}`);

      if (!media.description) {
        console.log(`  Skipped - no description`);
        continue;
      }

      const releaseYear = media.releaseDate
        ? new Date(media.releaseDate).getFullYear()
        : undefined;

      // Call AI enhancement with source info
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
        hasDanishAudio: true, // DR always has Danish audio
        source: 'DR_MANUAL',
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
          hasDanishAudio: true, // Also fix the database field
        },
      });

      enhanced++;
      console.log(`  Done`);

      // Rate limiting
      if (i < drMedia.length - 1) {
        await sleep(2000);
      }
    } catch (error) {
      failed++;
      console.error(`  Failed:`, error);
    }
  }

  console.log('\nSummary:');
  console.log(`  Total: ${drMedia.length}`);
  console.log(`  Enhanced: ${enhanced}`);
  console.log(`  Failed: ${failed}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
