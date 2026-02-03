#!/usr/bin/env npx tsx
/**
 * Migration script: Convert pros/cons from JSON strings to native arrays
 *
 * This script migrates Game and BoardGame models from storing pros/cons as
 * JSON strings ("[]") to native PostgreSQL arrays (String[]).
 *
 * Run this ONCE after updating the Prisma schema and before deployment.
 *
 * Usage: npx tsx scripts/migrate-pros-cons-to-arrays.ts
 */

import prisma from '../lib/db';

async function migrateProsConsToArrays() {
  console.log('🔄 Starting migration: pros/cons JSON strings → arrays\n');

  try {
    // Migrate Games
    console.log('📱 Migrating digital games...');
    const games = await prisma.game.findMany({
      select: { id: true, pros: true, cons: true }
    });

    let gamesUpdated = 0;
    for (const game of games) {
      // Check if pros/cons are strings (old format)
      const prosIsString = typeof game.pros === 'string';
      const consIsString = typeof game.cons === 'string';

      if (prosIsString || consIsString) {
        const prosArray = prosIsString
          ? JSON.parse(game.pros as unknown as string)
          : game.pros;
        const consArray = consIsString
          ? JSON.parse(game.cons as unknown as string)
          : game.cons;

        await prisma.game.update({
          where: { id: game.id },
          data: {
            pros: prosArray,
            cons: consArray
          }
        });
        gamesUpdated++;
      }
    }
    console.log(`✅ Migrated ${gamesUpdated} digital games\n`);

    // Migrate Board Games
    console.log('🎲 Migrating board games...');
    const boardGames = await prisma.boardGame.findMany({
      select: { id: true, pros: true, cons: true }
    });

    let boardGamesUpdated = 0;
    for (const boardGame of boardGames) {
      const prosIsString = typeof boardGame.pros === 'string';
      const consIsString = typeof boardGame.cons === 'string';

      if (prosIsString || consIsString) {
        const prosArray = prosIsString
          ? JSON.parse(boardGame.pros as unknown as string)
          : boardGame.pros;
        const consArray = consIsString
          ? JSON.parse(boardGame.cons as unknown as string)
          : boardGame.cons;

        await prisma.boardGame.update({
          where: { id: boardGame.id },
          data: {
            pros: prosArray,
            cons: consArray
          }
        });
        boardGamesUpdated++;
      }
    }
    console.log(`✅ Migrated ${boardGamesUpdated} board games\n`);

    // Verify migration
    console.log('🔍 Verifying migration...');
    const sampleGame = await prisma.game.findFirst({
      select: { title: true, pros: true, cons: true }
    });
    const sampleBoardGame = await prisma.boardGame.findFirst({
      select: { title: true, pros: true, cons: true }
    });

    if (sampleGame) {
      console.log(`\nSample Game: ${sampleGame.title}`);
      console.log(`Pros type: ${typeof sampleGame.pros}, value:`, sampleGame.pros);
      console.log(`Cons type: ${typeof sampleGame.cons}, value:`, sampleGame.cons);
    }

    if (sampleBoardGame) {
      console.log(`\nSample Board Game: ${sampleBoardGame.title}`);
      console.log(`Pros type: ${typeof sampleBoardGame.pros}, value:`, sampleBoardGame.pros);
      console.log(`Cons type: ${typeof sampleBoardGame.cons}, value:`, sampleBoardGame.cons);
    }

    console.log('\n✨ Migration completed successfully!');
    console.log(`Total: ${gamesUpdated} games + ${boardGamesUpdated} board games updated`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateProsConsToArrays();
