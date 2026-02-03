#!/usr/bin/env npx tsx
/**
 * Safe schema migration: String → String[] for pros/cons
 *
 * This script:
 * 1. Backs up all current pros/cons data
 * 2. Applies schema change manually via SQL
 * 3. Restores data in new format
 */

import prisma from '../lib/db';

async function safelyMigrateSchema() {
  console.log('🔄 Starting safe schema migration: pros/cons String → String[]\n');

  try {
    // Step 1: Backup all Game data
    console.log('📦 Step 1: Backing up Game data...');
    const games = await prisma.$queryRaw<Array<{
      id: string;
      pros: string;
      cons: string;
    }>>`SELECT id, pros, cons FROM "Game"`;

    console.log(`   Found ${games.length} games to migrate`);

    // Step 2: Backup all BoardGame data
    console.log('📦 Step 2: Backing up BoardGame data...');
    const boardGames = await prisma.$queryRaw<Array<{
      id: string;
      pros: string;
      cons: string;
    }>>`SELECT id, pros, cons FROM "BoardGame"`;

    console.log(`   Found ${boardGames.length} board games to migrate\n`);

    // Step 3: Alter table schema using raw SQL
    console.log('🔧 Step 3: Altering table schema...');

    // Game table
    await prisma.$executeRaw`ALTER TABLE "Game" ALTER COLUMN "pros" TYPE TEXT[] USING pros::text[]`;
    await prisma.$executeRaw`ALTER TABLE "Game" ALTER COLUMN "cons" TYPE TEXT[] USING cons::text[]`;
    console.log('   ✓ Game table altered');

    // BoardGame table
    await prisma.$executeRaw`ALTER TABLE "BoardGame" ALTER COLUMN "pros" TYPE TEXT[] USING pros::text[]`;
    await prisma.$executeRaw`ALTER TABLE "BoardGame" ALTER COLUMN "cons" TYPE TEXT[] USING cons::text[]`;
    console.log('   ✓ BoardGame table altered\n');

    // Step 4: Restore and convert data for Games
    console.log('📥 Step 4: Restoring Game data...');
    let gamesConverted = 0;

    for (const game of games) {
      try {
        const prosArray = game.pros ? JSON.parse(game.pros) : [];
        const consArray = game.cons ? JSON.parse(game.cons) : [];

        await prisma.$executeRaw`
          UPDATE "Game"
          SET pros = ${prosArray}::text[], cons = ${consArray}::text[]
          WHERE id = ${game.id}
        `;
        gamesConverted++;
      } catch (error) {
        console.error(`   ⚠️  Error converting game ${game.id}:`, error);
      }
    }
    console.log(`   ✓ Converted ${gamesConverted}/${games.length} games\n`);

    // Step 5: Restore and convert data for BoardGames
    console.log('📥 Step 5: Restoring BoardGame data...');
    let boardGamesConverted = 0;

    for (const boardGame of boardGames) {
      try {
        const prosArray = boardGame.pros ? JSON.parse(boardGame.pros) : [];
        const consArray = boardGame.cons ? JSON.parse(boardGame.cons) : [];

        await prisma.$executeRaw`
          UPDATE "BoardGame"
          SET pros = ${prosArray}::text[], cons = ${consArray}::text[]
          WHERE id = ${boardGame.id}
        `;
        boardGamesConverted++;
      } catch (error) {
        console.error(`   ⚠️  Error converting board game ${boardGame.id}:`, error);
      }
    }
    console.log(`   ✓ Converted ${boardGamesConverted}/${boardGames.length} board games\n`);

    // Step 6: Verify migration
    console.log('🔍 Step 6: Verifying migration...');
    const sampleGame = await prisma.game.findFirst({
      select: { title: true, pros: true, cons: true }
    });
    const sampleBoardGame = await prisma.boardGame.findFirst({
      select: { title: true, pros: true, cons: true }
    });

    if (sampleGame) {
      console.log(`\n   Sample Game: "${sampleGame.title}"`);
      console.log(`   Pros type: ${Array.isArray(sampleGame.pros) ? 'Array ✓' : 'NOT ARRAY ✗'}`);
      console.log(`   Cons type: ${Array.isArray(sampleGame.cons) ? 'Array ✓' : 'NOT ARRAY ✗'}`);
    }

    if (sampleBoardGame) {
      console.log(`\n   Sample BoardGame: "${sampleBoardGame.title}"`);
      console.log(`   Pros type: ${Array.isArray(sampleBoardGame.pros) ? 'Array ✓' : 'NOT ARRAY ✗'}`);
      console.log(`   Cons type: ${Array.isArray(sampleBoardGame.cons) ? 'Array ✓' : 'NOT ARRAY ✗'}`);
    }

    console.log('\n✨ Migration completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  Games migrated: ${gamesConverted}/${games.length}`);
    console.log(`  Board games migrated: ${boardGamesConverted}/${boardGames.length}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\n⚠️  Database may be in an inconsistent state!');
    console.error('   Please restore from backup or contact support.');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
safelyMigrateSchema();
