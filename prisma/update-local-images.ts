import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'games');

async function main() {
  const boardDir = path.join(PUBLIC_DIR, 'board');
  const digitalDir = path.join(PUBLIC_DIR, 'digital');

  console.log('📝 Updating database with local image paths...\n');

  // Update board games
  console.log('🎲 Board games:\n');
  let boardUpdated = 0;
  let boardNotFound = 0;

  if (fs.existsSync(boardDir)) {
    const boardFiles = fs.readdirSync(boardDir).filter(f =>
      f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')
    );

    for (const file of boardFiles) {
      const slug = file.replace(/\.(jpg|png|webp)$/, '');
      const imagePath = `/images/games/board/${file}`;

      try {
        const game = await prisma.boardGame.findUnique({ where: { slug } });
        if (game) {
          await prisma.boardGame.update({
            where: { slug },
            data: { imageUrl: imagePath },
          });
          console.log(`✓ ${game.title}`);
          boardUpdated++;
        } else {
          console.log(`⚠ Not in DB: ${slug}`);
          boardNotFound++;
        }
      } catch (e) {
        console.log(`✗ Error: ${slug}`);
      }
    }
  }

  // Update digital games
  console.log('\n🎮 Digital games:\n');
  let digitalUpdated = 0;
  let digitalNotFound = 0;

  if (fs.existsSync(digitalDir)) {
    const digitalFiles = fs.readdirSync(digitalDir).filter(f =>
      f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp') || f.endsWith('.svg')
    );

    // Prefer png/jpg over svg/webp
    const processedSlugs = new Set<string>();

    for (const file of digitalFiles) {
      const slug = file.replace(/\.(jpg|png|webp|svg)$/, '');

      // Skip if we already processed this slug (prefer earlier formats)
      if (processedSlugs.has(slug)) continue;

      const imagePath = `/images/games/digital/${file}`;

      try {
        const game = await prisma.game.findUnique({ where: { slug } });
        if (game) {
          await prisma.game.update({
            where: { slug },
            data: { iconUrl: imagePath },
          });
          console.log(`✓ ${game.title}`);
          digitalUpdated++;
          processedSlugs.add(slug);
        } else {
          console.log(`⚠ Not in DB: ${slug}`);
          digitalNotFound++;
        }
      } catch (e) {
        console.log(`✗ Error: ${slug}`);
      }
    }
  }

  console.log('\n========================================');
  console.log('Summary:');
  console.log(`  Board games: ${boardUpdated} updated, ${boardNotFound} not in DB`);
  console.log(`  Digital games: ${digitalUpdated} updated, ${digitalNotFound} not in DB`);
  console.log('========================================\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
