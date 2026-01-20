#!/usr/bin/env tsx
/**
 * Safe Add Games Script
 *
 * This script ONLY adds new games that don't exist in the database.
 * It NEVER deletes or modifies existing games, preserving AI enhancements.
 *
 * Usage:
 *   npx tsx scripts/add-new-games.ts              # Add new games (dry-run by default)
 *   npx tsx scripts/add-new-games.ts --live       # Actually insert new games
 *   npx tsx scripts/add-new-games.ts --backup     # Create backup before adding
 *
 * IMPORTANT: This script preserves all existing data including AI enhancements!
 */

import { PrismaClient } from '@prisma/client';
import { allDigitalGames } from '../data/games-seed';
import { allBoardGames } from '../data/boardgames-seed';
import { execSync } from 'child_process';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Transform game data for Prisma (convert arrays to JSON strings)
function transformGameForPrisma(game: typeof allDigitalGames[0]) {
  return {
    title: game.title,
    slug: game.slug,
    description: game.description,
    shortDescription: game.shortDescription,
    minAge: game.minAge,
    maxAge: game.maxAge,
    ageGroup: game.ageGroup,
    categories: JSON.stringify(game.categories),
    skills: JSON.stringify(game.skills),
    themes: JSON.stringify(game.themes),
    platforms: JSON.stringify(game.platforms),
    hasAds: game.hasAds,
    hasInAppPurchases: game.hasInAppPurchases,
    isOfflineCapable: game.isOfflineCapable,
    dataCollection: game.dataCollection,
    supportsDanish: game.supportsDanish,
    price: game.price,
    priceModel: game.priceModel,
    rating: game.rating,
    iconUrl: game.iconUrl,
    screenshots: JSON.stringify(game.screenshotUrls),
    videoUrl: game.videoUrl,
    appStoreUrl: game.appStoreUrl,
    playStoreUrl: game.playStoreUrl,
    websiteUrl: game.websiteUrl,
    developerName: game.developerName,
    pros: JSON.stringify(game.pros),
    cons: JSON.stringify(game.cons),
    parentTip: game.parentTip,
    featured: game.featured,
    editorChoice: game.editorChoice,
  };
}

// Transform board game data for Prisma
function transformBoardGameForPrisma(game: typeof allBoardGames[0]) {
  return {
    title: game.title,
    slug: game.slug,
    description: game.description,
    shortDescription: game.shortDescription,
    minAge: game.minAge,
    maxAge: game.maxAge,
    ageGroup: game.ageGroup,
    minPlayers: game.minPlayers,
    maxPlayers: game.maxPlayers,
    playTimeMinutes: game.playTimeMinutes,
    complexity: game.complexity,
    categories: JSON.stringify(game.categories),
    skills: JSON.stringify(game.skills),
    themes: JSON.stringify(game.themes),
    supportsDanish: game.supportsDanish,
    price: game.price,
    imageUrl: game.imageUrl,
    amazonUrl: game.amazonUrl,
    affiliateUrl: game.affiliateUrl,
    rating: game.rating,
    pros: JSON.stringify(game.pros),
    cons: JSON.stringify(game.cons),
    parentTip: game.parentTip,
    featured: game.featured,
    editorChoice: game.editorChoice,
  };
}

async function createBackup() {
  const timestamp = new Date().toISOString().split('T')[0];
  const backupDir = `backups/${timestamp}`;

  if (!fs.existsSync('backups')) {
    fs.mkdirSync('backups');
  }
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`📦 Creating backup in ${backupDir}...`);

  // Export current games to JSON
  const games = await prisma.game.findMany();
  const boardGames = await prisma.boardGame.findMany();

  fs.writeFileSync(
    `${backupDir}/games-backup.json`,
    JSON.stringify(games, null, 2)
  );
  fs.writeFileSync(
    `${backupDir}/boardgames-backup.json`,
    JSON.stringify(boardGames, null, 2)
  );

  console.log(`✅ Backup created: ${games.length} games, ${boardGames.length} board games\n`);
  return backupDir;
}

async function main() {
  const args = process.argv.slice(2);
  const isLive = args.includes('--live');
  const shouldBackup = args.includes('--backup');

  console.log('🎮 Safe Add Games Script');
  console.log('========================');
  console.log(`Mode: ${isLive ? '🔴 LIVE - Will insert new games' : '🟡 DRY RUN - No changes will be made'}`);
  console.log('');
  console.log('⚠️  This script NEVER deletes existing data!');
  console.log('');

  // Create backup if requested
  if (shouldBackup && isLive) {
    await createBackup();
  }

  // Get existing games from database
  const existingGames = await prisma.game.findMany({
    select: { slug: true, title: true }
  });
  const existingBoardGames = await prisma.boardGame.findMany({
    select: { slug: true, title: true }
  });

  const existingGameSlugs = new Set(existingGames.map(g => g.slug));
  const existingBoardGameSlugs = new Set(existingBoardGames.map(g => g.slug));

  console.log(`📊 Current database status:`);
  console.log(`   Digital games: ${existingGames.length}`);
  console.log(`   Board games: ${existingBoardGames.length}`);
  console.log('');

  // Find new digital games
  const newDigitalGames = allDigitalGames.filter(g => !existingGameSlugs.has(g.slug));
  const skippedDigitalGames = allDigitalGames.filter(g => existingGameSlugs.has(g.slug));

  // Find new board games
  const newBoardGames = allBoardGames.filter(g => !existingBoardGameSlugs.has(g.slug));
  const skippedBoardGames = allBoardGames.filter(g => existingBoardGameSlugs.has(g.slug));

  console.log(`📋 Seed file contains:`);
  console.log(`   Digital games: ${allDigitalGames.length}`);
  console.log(`   Board games: ${allBoardGames.length}`);
  console.log('');

  console.log(`🆕 New games to add:`);
  console.log(`   Digital games: ${newDigitalGames.length}`);
  console.log(`   Board games: ${newBoardGames.length}`);
  console.log('');

  if (newDigitalGames.length > 0) {
    console.log('New digital games:');
    newDigitalGames.forEach(g => console.log(`   + ${g.title} (${g.ageGroup})`));
    console.log('');
  }

  if (newBoardGames.length > 0) {
    console.log('New board games:');
    newBoardGames.forEach(g => console.log(`   + ${g.title} (${g.ageGroup})`));
    console.log('');
  }

  console.log(`⏭️  Skipped (already exist):`);
  console.log(`   Digital games: ${skippedDigitalGames.length}`);
  console.log(`   Board games: ${skippedBoardGames.length}`);
  console.log('');

  if (!isLive) {
    console.log('─'.repeat(50));
    console.log('🟡 DRY RUN complete. No changes were made.');
    console.log('   Run with --live to actually insert new games.');
    console.log('   Run with --live --backup to create a backup first.');
    console.log('─'.repeat(50));
    await prisma.$disconnect();
    return;
  }

  // Insert new games
  let insertedGames = 0;
  let insertedBoardGames = 0;

  if (newDigitalGames.length > 0) {
    console.log('📥 Inserting new digital games...');
    for (const game of newDigitalGames) {
      try {
        await prisma.game.create({
          data: transformGameForPrisma(game)
        });
        console.log(`   ✅ ${game.title}`);
        insertedGames++;
      } catch (error) {
        console.log(`   ❌ ${game.title}: ${error}`);
      }
    }
    console.log('');
  }

  if (newBoardGames.length > 0) {
    console.log('📥 Inserting new board games...');
    for (const game of newBoardGames) {
      try {
        await prisma.boardGame.create({
          data: transformBoardGameForPrisma(game)
        });
        console.log(`   ✅ ${game.title}`);
        insertedBoardGames++;
      } catch (error) {
        console.log(`   ❌ ${game.title}: ${error}`);
      }
    }
    console.log('');
  }

  // Final summary
  const finalGames = await prisma.game.count();
  const finalBoardGames = await prisma.boardGame.count();

  console.log('─'.repeat(50));
  console.log('🎉 Complete!');
  console.log(`   Inserted: ${insertedGames} digital games, ${insertedBoardGames} board games`);
  console.log(`   Total now: ${finalGames} digital games, ${finalBoardGames} board games`);
  console.log('');
  console.log('💡 Remember to run AI enhancement for new games:');
  console.log('   npx tsx scripts/enhance-games.ts 10');
  console.log('─'.repeat(50));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  prisma.$disconnect();
  process.exit(1);
});
