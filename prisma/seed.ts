import { PrismaClient } from '@prisma/client';
import { allDigitalGames, gameStats } from '../data/games-seed';
import { allBoardGames, boardGameStats } from '../data/boardgames-seed';

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

async function main() {
  console.log('🌱 Seeding database...');
  console.log('');
  console.log('📊 Digital Game Statistics:');
  console.log(`   Total: ${gameStats.total}`);
  console.log(`   0-3 år: ${gameStats.by0to3}`);
  console.log(`   3-6 år: ${gameStats.by3to6}`);
  console.log(`   7-10 år: ${gameStats.by7to10}`);
  console.log(`   11-15 år: ${gameStats.by11to15}`);
  console.log(`   Ingen reklamer: ${gameStats.noAds}`);
  console.log(`   Ingen in-app køb: ${gameStats.noInAppPurchases}`);
  console.log(`   Virker offline: ${gameStats.offlineCapable}`);
  console.log(`   Helt gratis: ${gameStats.completelyFree}`);
  console.log('');
  console.log('🎲 Board Game Statistics:');
  console.log(`   Total: ${boardGameStats.total}`);
  console.log(`   0-3 år: ${boardGameStats.by0to3}`);
  console.log(`   3-6 år: ${boardGameStats.by3to6}`);
  console.log(`   7-10 år: ${boardGameStats.by7to10}`);
  console.log(`   11-15 år: ${boardGameStats.by11to15}`);
  console.log(`   Samarbejdsspil: ${boardGameStats.cooperative}`);
  console.log(`   Strategispil: ${boardGameStats.strategyGames}`);
  console.log(`   Familiespil: ${boardGameStats.familyGames}`);
  console.log('');

  // Clear existing data
  await prisma.game.deleteMany();
  await prisma.boardGame.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Seed digital games
  for (const game of allDigitalGames) {
    await prisma.game.create({ data: transformGameForPrisma(game) });
  }
  console.log(`✅ Created ${allDigitalGames.length} digital games`);

  // Seed board games
  for (const game of allBoardGames) {
    await prisma.boardGame.create({ data: transformBoardGameForPrisma(game) });
  }
  console.log(`✅ Created ${allBoardGames.length} board games`);

  console.log('');
  console.log('🎉 Seeding complete!');
  console.log(`   Total games: ${allDigitalGames.length + allBoardGames.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
