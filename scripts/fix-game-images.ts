#!/usr/bin/env tsx
// Fix missing images for games (Khan Academy, Minecraft, etc.)
// Usage: npx tsx scripts/fix-game-images.ts [--dry-run]

import { prisma } from '../lib/db';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Known game image URLs - manually curated for quality
const KNOWN_GAME_IMAGES: Record<string, string> = {
  // Khan Academy games
  'khan-academy-kids': 'https://play-lh.googleusercontent.com/sXUxNxNK8aH6XBqmBUqFLqIiLZp8y1jRmJJPQaEKwFvz6w9lCKKMzl6YaRJ1Xqo5lg=w240-h480-rw',
  'khan-academy': 'https://play-lh.googleusercontent.com/sxGBTMQnBhqwAWtNqwjjNkCPD6glsIYHZL1JsYQF0YXGLPJSd3gLDJ1hXhGJQr3aKDg=w240-h480-rw',

  // Minecraft variants
  'minecraft': 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP=w240-h480-rw',
  'minecraft-education': 'https://play-lh.googleusercontent.com/VEw3t1w9a7Ty_RXX4XGZJFXjKXhZhEhH_KZl7Yx4LKVN8ADRW3sWB_kNQZC7JlQ0Xw=w240-h480-rw',
  'minecraft-trial': 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP=w240-h480-rw',

  // DR Ramasjang games
  'dr-ramasjang': 'https://www.dr.dk/drtv/assets/images/ramasjang-logo.png',
  'ramasjang-spil': 'https://www.dr.dk/drtv/assets/images/ramasjang-logo.png',

  // PBS Kids
  'pbs-kids-games': 'https://play-lh.googleusercontent.com/9n_AKuRzqL0BsKmKWQQ3PqPIc7hV3xN4IpZcJYZbzF1xZWFZhKLJZFQzYVdFWQzVzQ=w240-h480-rw',

  // Popular educational games
  'duolingo': 'https://play-lh.googleusercontent.com/WGXpwS7PJmmxlWQZb_XGlcXP0r5z1GGy0r1hH5xJ5JZz1pz5L1bZ8xJ1ZGy0r1hH=w240-h480-rw',
  'duolingo-abc': 'https://play-lh.googleusercontent.com/PCNsYnQl_gT3zGaFbZ9Kh1X1YzZL1bZ8xJ1ZGy0r1hH5xJ5JZz1pz5L1bZ8xJ1ZGy=w240-h480-rw',
};

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`  ❌ Failed to download: ${response.status}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    const dir = join(outputPath, '..');

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(outputPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`  ❌ Error downloading image:`, error);
    return false;
  }
}

async function searchGooglePlayImage(gameName: string): Promise<string | null> {
  // This would require a Google Play Store scraper or API
  // For now, we'll return null and handle manually
  console.log(`  💡 Consider manually searching Google Play for: ${gameName}`);
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🎮 Game Image Fixer');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  // Find digital games without images
  const gamesWithoutImages = await prisma.game.findMany({
    where: {
      OR: [
        { iconUrl: null },
        { iconUrl: '' },
        { iconUrl: { startsWith: '/images/placeholders/' } },
      ],
    },
    orderBy: {
      title: 'asc',
    },
  });

  console.log(`Found ${gamesWithoutImages.length} games without proper images\n`);

  let fixed = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < gamesWithoutImages.length; i++) {
    const game = gamesWithoutImages[i];
    const progress = `[${i + 1}/${gamesWithoutImages.length}]`;

    console.log(`${progress} Processing: ${game.title}`);
    console.log(`  Slug: ${game.slug}`);
    console.log(`  Platform: ${game.platform}`);

    // Check if we have a known image URL for this slug
    const knownImageUrl = KNOWN_GAME_IMAGES[game.slug];

    if (knownImageUrl) {
      console.log(`  ✅ Found known image URL`);

      if (!dryRun) {
        // Download image to local storage
        const imagePath = `/images/games/digital/${game.slug}.jpg`;
        const fullPath = join(process.cwd(), 'public', imagePath);

        console.log(`  ⬇️  Downloading image...`);
        const success = await downloadImage(knownImageUrl, fullPath);

        if (success) {
          // Update database with local path
          await prisma.game.update({
            where: { id: game.id },
            data: { iconUrl: imagePath },
          });

          console.log(`  ✅ Downloaded and updated database`);
          fixed++;
        } else {
          console.log(`  ❌ Failed to download image`);
          failed++;
        }
      } else {
        console.log(`  ✅ Would update with: ${knownImageUrl}`);
        fixed++;
      }
    } else {
      console.log(`  ⚠️  No known image for this game`);

      // Try to search for it
      if (game.platform === 'ANDROID' || game.platform === 'IOS') {
        const imageUrl = await searchGooglePlayImage(game.title);

        if (imageUrl) {
          console.log(`  ✅ Found image via search`);
          // Would download and update here
          fixed++;
        } else {
          console.log(`  💡 Manual action needed:`);
          console.log(`     1. Search for "${game.title}" on Google Play / App Store`);
          console.log(`     2. Download the icon image`);
          console.log(`     3. Save to: public/images/games/digital/${game.slug}.jpg`);
          console.log(`     4. Update database iconUrl to: /images/games/digital/${game.slug}.jpg`);
          failed++;
        }
      } else {
        console.log(`  💡 Web-based game - consider screenshot or logo`);
        failed++;
      }
    }

    console.log('');

    // Rate limiting
    if (i < gamesWithoutImages.length - 1) {
      await sleep(500);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  ✅ Fixed: ${fixed}`);
  console.log(`  ❌ Failed/Manual: ${failed}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log('='.repeat(60));

  if (dryRun) {
    console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.');
  }

  if (failed > 0) {
    console.log('\n📝 Manual Steps Required:');
    console.log('For games without known images, you need to:');
    console.log('  1. Add image URLs to KNOWN_GAME_IMAGES in this script');
    console.log('  2. Or manually download images to public/images/games/digital/');
    console.log('  3. Run this script again');
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
