/**
 * Migrate Icon URLs to Database
 *
 * Updates existing game records with corrected icon URLs
 * without resetting the entire database.
 */

import { PrismaClient } from '@prisma/client';
import { games0to3, games3to6, games7to10, games11to15 } from '../data/games-seed';

const prisma = new PrismaClient();

async function updateGameIcon(slug: string, iconUrl: string | null): Promise<boolean> {
  try {
    const game = await prisma.game.findUnique({
      where: { slug }
    });

    if (!game) {
      console.log(`⚠️  Game not found: ${slug}`);
      return false;
    }

    // Only update if iconUrl is different
    if (game.iconUrl === iconUrl) {
      return false;
    }

    await prisma.game.update({
      where: { slug },
      data: { iconUrl }
    });

    console.log(`✓ Updated ${slug}: ${iconUrl}`);
    return true;
  } catch (error) {
    console.error(`✗ Error updating ${slug}:`, error);
    return false;
  }
}

async function main() {
  console.log('\n🔄 Migrating icon URLs to database...\n');

  const allGames = [
    ...games0to3,
    ...games3to6,
    ...games7to10,
    ...games11to15
  ];

  let updateCount = 0;

  for (const game of allGames) {
    const updated = await updateGameIcon(game.slug, game.iconUrl);
    if (updated) updateCount++;
  }

  console.log(`\n✅ Updated ${updateCount} game icons\n`);
}

main()
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
