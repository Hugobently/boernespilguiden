#!/usr/bin/env npx tsx
/**
 * Backup current data, then we'll apply schema change, then restore
 */

import prisma from '../lib/db';
import fs from 'fs';
import path from 'path';

async function backupData() {
  console.log('📦 Backing up current pros/cons data...\n');

  try {
    // Backup Games
    const games = await prisma.game.findMany({
      select: { id: true, pros: true, cons: true }
    });

    // Backup BoardGames
    const boardGames = await prisma.boardGame.findMany({
      select: { id: true, pros: true, cons: true }
    });

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
    console.log('Now run: npx prisma db push --accept-data-loss');
    console.log('Then run: npx tsx scripts/restore-from-backup.ts');

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupData();
