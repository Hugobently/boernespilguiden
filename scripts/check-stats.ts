#!/usr/bin/env tsx
import prisma from '../lib/db';

async function main() {
  const gameCount = await prisma.game.count();
  const gamesWithImages = await prisma.game.count({ where: { iconUrl: { not: null } } });
  const gamesWithoutImages = await prisma.game.count({ where: { OR: [{ iconUrl: null }, { iconUrl: '' }] } });

  const mediaCount = await prisma.media.count();
  const mediaWithImages = await prisma.media.count({ where: { posterUrl: { not: null } } });
  const mediaWithoutImages = await prisma.media.count({ where: { OR: [{ posterUrl: null }, { posterUrl: '' }] } });

  console.log('\n📊 Database Statistics\n');
  console.log('Games:');
  console.log(`  Total: ${gameCount}`);
  console.log(`  With images: ${gamesWithImages}`);
  console.log(`  Without images: ${gamesWithoutImages}`);

  console.log('\nMedia:');
  console.log(`  Total: ${mediaCount}`);
  console.log(`  With images: ${mediaWithImages}`);
  console.log(`  Without images: ${mediaWithoutImages}`);

  console.log('');

  await prisma.$disconnect();
}

main();
