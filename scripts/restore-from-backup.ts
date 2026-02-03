#!/usr/bin/env npx tsx
/**
 * Restore pros/cons data from backup and convert to arrays
 */

import prisma from '../lib/db';
import fs from 'fs';
import path from 'path';

async function restoreData() {
  console.log('📥 Restoring pros/cons data from backup...\n');

  try {
    const backupPath = path.join(process.cwd(), 'backup-pros-cons.json');

    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    console.log(`📂 Loading backup from: ${backup.timestamp}`);
    console.log(`   Games: ${backup.games.length}`);
    console.log(`   Board games: ${backup.boardGames.length}\n`);

    // Restore Games
    console.log('🎮 Restoring games...');
    let gamesRestored = 0;

    for (const game of backup.games) {
      try {
        // Parse JSON strings to arrays
        const prosArray = game.pros ? JSON.parse(game.pros) : [];
        const consArray = game.cons ? JSON.parse(game.cons) : [];

        await prisma.game.update({
          where: { id: game.id },
          data: {
            pros: prosArray,
            cons: consArray
          }
        });
        gamesRestored++;
      } catch (error) {
        console.error(`   ⚠️  Error restoring game ${game.id}:`, error);
      }
    }
    console.log(`   ✓ Restored ${gamesRestored}/${backup.games.length} games\n`);

    // Restore BoardGames
    console.log('🎲 Restoring board games...');
    let boardGamesRestored = 0;

    for (const boardGame of backup.boardGames) {
      try {
        // Parse JSON strings to arrays
        const prosArray = boardGame.pros ? JSON.parse(boardGame.pros) : [];
        const consArray = boardGame.cons ? JSON.parse(boardGame.cons) : [];

        await prisma.boardGame.update({
          where: { id: boardGame.id },
          data: {
            pros: prosArray,
            cons: consArray
          }
        });
        boardGamesRestored++;
      } catch (error) {
        console.error(`   ⚠️  Error restoring board game ${boardGame.id}:`, error);
      }
    }
    console.log(`   ✓ Restored ${boardGamesRestored}/${backup.boardGames.length} board games\n`);

    // Verify restoration
    console.log('🔍 Verifying restoration...');
    const sampleGame = await prisma.game.findFirst({
      select: { title: true, pros: true, cons: true }
    });
    const sampleBoardGame = await prisma.boardGame.findFirst({
      select: { title: true, pros: true, cons: true }
    });

    if (sampleGame) {
      console.log(`\n   Sample Game: "${sampleGame.title}"`);
      console.log(`   Pros: ${Array.isArray(sampleGame.pros) ? `✓ Array with ${sampleGame.pros.length} items` : '✗ NOT ARRAY'}`);
      console.log(`   Cons: ${Array.isArray(sampleGame.cons) ? `✓ Array with ${sampleGame.cons.length} items` : '✗ NOT ARRAY'}`);
      if (sampleGame.pros.length > 0) {
        console.log(`   Example pro: "${sampleGame.pros[0]}"`);
      }
    }

    if (sampleBoardGame) {
      console.log(`\n   Sample BoardGame: "${sampleBoardGame.title}"`);
      console.log(`   Pros: ${Array.isArray(sampleBoardGame.pros) ? `✓ Array with ${sampleBoardGame.pros.length} items` : '✗ NOT ARRAY'}`);
      console.log(`   Cons: ${Array.isArray(sampleBoardGame.cons) ? `✓ Array with ${sampleBoardGame.cons.length} items` : '✗ NOT ARRAY'}`);
    }

    console.log('\n✨ Restoration completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  Games restored: ${gamesRestored}/${backup.games.length}`);
    console.log(`  Board games restored: ${boardGamesRestored}/${backup.boardGames.length}`);
    console.log(`\n💡 You can now delete the backup file if everything looks good:`);
    console.log(`   rm backup-pros-cons.json`);

  } catch (error) {
    console.error('\n❌ Restoration failed:', error);
    console.error('\n⚠️  Data may not be fully restored!');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

restoreData();
