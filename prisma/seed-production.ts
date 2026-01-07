import { PrismaClient } from '@prisma/client';
import { allDigitalGames, gameStats } from '../data/games-seed';
import { allBoardGames, boardGameStats } from '../data/boardgames-seed';

const prisma = new PrismaClient();

// Detect if we're using PostgreSQL
const isPostgres = process.env.DATABASE_URL?.includes('postgresql');

// Transform game data for Prisma
// For PostgreSQL: use native JSON
// For SQLite: use JSON strings
function transformGameForPrisma(game: typeof allDigitalGames[0]) {
  const arrayFields = {
    categories: game.categories,
    skills: game.skills,
    themes: game.themes,
    platforms: game.platforms,
    screenshots: game.screenshotUrls,
    pros: game.pros,
    cons: game.cons,
  };

  // Convert arrays based on database type
  const processedArrays = Object.fromEntries(
    Object.entries(arrayFields).map(([key, value]) => [
      key,
      isPostgres ? value : JSON.stringify(value),
    ])
  );

  return {
    title: game.title,
    slug: game.slug,
    description: game.description,
    shortDescription: game.shortDescription,
    minAge: game.minAge,
    maxAge: game.maxAge,
    ageGroup: game.ageGroup,
    hasAds: game.hasAds,
    hasInAppPurchases: game.hasInAppPurchases,
    isOfflineCapable: game.isOfflineCapable,
    dataCollection: game.dataCollection,
    price: game.price,
    priceModel: game.priceModel,
    rating: game.rating,
    iconUrl: game.iconUrl,
    videoUrl: game.videoUrl,
    appStoreUrl: game.appStoreUrl,
    playStoreUrl: game.playStoreUrl,
    websiteUrl: game.websiteUrl,
    developerName: game.developerName,
    parentTip: game.parentTip,
    featured: game.featured,
    editorChoice: game.editorChoice,
    ...processedArrays,
  };
}

// Transform board game data for Prisma
function transformBoardGameForPrisma(game: typeof allBoardGames[0]) {
  const arrayFields = {
    categories: game.categories,
    skills: game.skills,
    themes: game.themes,
    pros: game.pros,
    cons: game.cons,
  };

  // Convert arrays based on database type
  const processedArrays = Object.fromEntries(
    Object.entries(arrayFields).map(([key, value]) => [
      key,
      isPostgres ? value : JSON.stringify(value),
    ])
  );

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
    price: game.price,
    imageUrl: game.imageUrl,
    amazonUrl: game.amazonUrl,
    affiliateUrl: game.affiliateUrl,
    rating: game.rating,
    parentTip: game.parentTip,
    featured: game.featured,
    editorChoice: game.editorChoice,
    ...processedArrays,
  };
}

async function main() {
  console.log('');
  console.log('='.repeat(60));
  console.log('  BØRNESPILGUIDEN - Production Database Seeding');
  console.log('='.repeat(60));
  console.log('');
  console.log(`Database type: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);
  console.log('');
  console.log('Digital Game Statistics:');
  console.log(`  Total: ${gameStats.total}`);
  console.log(`  0-3 years: ${gameStats.by0to3}`);
  console.log(`  3-6 years: ${gameStats.by3to6}`);
  console.log(`  7-10 years: ${gameStats.by7to10}`);
  console.log(`  11-15 years: ${gameStats.by11to15}`);
  console.log(`  Ad-free: ${gameStats.noAds}`);
  console.log(`  No in-app purchases: ${gameStats.noInAppPurchases}`);
  console.log(`  Offline capable: ${gameStats.offlineCapable}`);
  console.log(`  Completely free: ${gameStats.completelyFree}`);
  console.log('');
  console.log('Board Game Statistics:');
  console.log(`  Total: ${boardGameStats.total}`);
  console.log(`  0-3 years: ${boardGameStats.by0to3}`);
  console.log(`  3-6 years: ${boardGameStats.by3to6}`);
  console.log(`  7-10 years: ${boardGameStats.by7to10}`);
  console.log(`  11-15 years: ${boardGameStats.by11to15}`);
  console.log(`  Cooperative: ${boardGameStats.cooperative}`);
  console.log(`  Strategy: ${boardGameStats.strategyGames}`);
  console.log(`  Family: ${boardGameStats.familyGames}`);
  console.log('');

  // Safety check for production
  if (isPostgres) {
    console.log('WARNING: About to clear production PostgreSQL database!');
    console.log('Waiting 3 seconds... Press Ctrl+C to cancel.');
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // Clear existing data (order matters due to relations)
  console.log('Clearing existing data...');
  await prisma.gameTranslation.deleteMany();
  await prisma.boardGameTranslation.deleteMany();
  await prisma.game.deleteMany();
  await prisma.boardGame.deleteMany();
  console.log('Cleared existing data');

  // Seed digital games using createMany for better performance
  console.log('');
  console.log('Seeding digital games...');
  const digitalGameData = allDigitalGames.map(transformGameForPrisma);

  // Use batch insert for better performance
  const batchSize = 50;
  for (let i = 0; i < digitalGameData.length; i += batchSize) {
    const batch = digitalGameData.slice(i, i + batchSize);
    await prisma.game.createMany({ data: batch as any });
    process.stdout.write(`\r  Progress: ${Math.min(i + batchSize, digitalGameData.length)}/${digitalGameData.length}`);
  }
  console.log('');
  console.log(`Created ${allDigitalGames.length} digital games`);

  // Seed board games
  console.log('');
  console.log('Seeding board games...');
  const boardGameData = allBoardGames.map(transformBoardGameForPrisma);

  for (let i = 0; i < boardGameData.length; i += batchSize) {
    const batch = boardGameData.slice(i, i + batchSize);
    await prisma.boardGame.createMany({ data: batch as any });
    process.stdout.write(`\r  Progress: ${Math.min(i + batchSize, boardGameData.length)}/${boardGameData.length}`);
  }
  console.log('');
  console.log(`Created ${allBoardGames.length} board games`);

  // Verify counts
  const finalDigitalCount = await prisma.game.count();
  const finalBoardCount = await prisma.boardGame.count();

  console.log('');
  console.log('='.repeat(60));
  console.log('  SEEDING COMPLETE');
  console.log('='.repeat(60));
  console.log('');
  console.log('Final counts:');
  console.log(`  Digital games: ${finalDigitalCount}`);
  console.log(`  Board games: ${finalBoardCount}`);
  console.log(`  Total: ${finalDigitalCount + finalBoardCount}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('');
    console.error('SEEDING FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
