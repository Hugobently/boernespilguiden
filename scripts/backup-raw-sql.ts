#!/usr/bin/env npx tsx
/**
 * Backup using raw SQL to avoid Prisma type checking
 */

import prisma from '../lib/db';
import fs from 'fs';
import path from 'path';

async function backupData() {
  console.log('📦 Backing up current pros/cons data using raw SQL...\n');

  try {
    // Use raw SQL to avoid Prisma's type checking
    const games = await prisma.$queryRaw<Array<{
      id: string;
      pros: string;
      cons: string;
    }>>`SELECT id, pros, cons FROM "Game"`;

    const boardGames = await prisma.$queryRaw<Array<{
      id: string;
      pros: string;
      cons: string;
    }>>`SELECT id, pros, cons FROM "BoardGame"`;

    const backup = {
      timestamp: new Date().toISOString(),
      games: games.map(g => ({
        id: g.id,
        pros: g.pros,
        cons: g.cons
      })),
      boardGames: boardGames.map(bg => ({
        id: bg.id,
        pros: bg.pros,
        cons: bg.cons
      }))
    };

    const backupPath = path.join(process.cwd(), 'backup-pros-cons.json');
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    console.log(`✅ Backup saved to: ${backupPath}`);
    console.log(`   Games: ${games.length}`);
    console.log(`   Board games: ${boardGames.length}\n`);

    console.log('✅ Data safely backed up!');
    console.log('\nNext steps:');
    console.log('1. Run: npx prisma db push --accept-data-loss');
    console.log('2. Run: npx tsx scripts/restore-from-backup.ts');

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupData();
