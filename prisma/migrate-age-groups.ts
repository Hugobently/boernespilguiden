import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateAgeGroups() {
  console.log('🔄 Migrating age groups from 7-10/11-15 to 7+...\n');

  // Update digital games
  const gamesResult7to10 = await prisma.game.updateMany({
    where: { ageGroup: '7-10' },
    data: { ageGroup: '7+' },
  });
  console.log(`✅ Updated ${gamesResult7to10.count} digital games from "7-10" to "7+"`);

  const gamesResult11to15 = await prisma.game.updateMany({
    where: { ageGroup: '11-15' },
    data: { ageGroup: '7+' },
  });
  console.log(`✅ Updated ${gamesResult11to15.count} digital games from "11-15" to "7+"`);

  // Update board games
  const boardGamesResult7to10 = await prisma.boardGame.updateMany({
    where: { ageGroup: '7-10' },
    data: { ageGroup: '7+' },
  });
  console.log(`✅ Updated ${boardGamesResult7to10.count} board games from "7-10" to "7+"`);

  const boardGamesResult11to15 = await prisma.boardGame.updateMany({
    where: { ageGroup: '11-15' },
    data: { ageGroup: '7+' },
  });
  console.log(`✅ Updated ${boardGamesResult11to15.count} board games from "11-15" to "7+"`);

  // Verify the changes
  const gamesByAgeGroup = await prisma.game.groupBy({
    by: ['ageGroup'],
    _count: { id: true },
  });
  console.log('\n📊 Digital games by age group:');
  gamesByAgeGroup.forEach((group) => {
    console.log(`   ${group.ageGroup}: ${group._count.id} games`);
  });

  const boardGamesByAgeGroup = await prisma.boardGame.groupBy({
    by: ['ageGroup'],
    _count: { id: true },
  });
  console.log('\n📊 Board games by age group:');
  boardGamesByAgeGroup.forEach((group) => {
    console.log(`   ${group.ageGroup}: ${group._count.id} games`);
  });

  console.log('\n✨ Migration complete!');
}

migrateAgeGroups()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
