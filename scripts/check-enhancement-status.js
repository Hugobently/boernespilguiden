// Quick status checker for AI enhancement progress
// Usage: POSTGRES_URL="..." node scripts/check-enhancement-status.js

const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL or DATABASE_URL not set');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

async function checkStatus() {
  console.log('📊 AI Enhancement Status Check\n');

  const total = await prisma.media.count({
    where: { isActive: true },
  });

  const enhanced = await prisma.media.count({
    where: {
      isActive: true,
      parentInfo: { not: null },
    },
  });

  const needsEnhancement = total - enhanced;
  const percentage = ((enhanced / total) * 100).toFixed(1);

  console.log(`Total Active Media: ${total}`);
  console.log(`Enhanced: ${enhanced} (${percentage}%)`);
  console.log(`Needs Enhancement: ${needsEnhancement}`);
  console.log('');

  if (needsEnhancement > 0) {
    console.log(`💡 To enhance remaining items, run:`);
    console.log(`   export POSTGRES_URL='...' && node scripts/test-enhancement.js ${needsEnhancement}`);
  } else {
    console.log(`✅ All media items are enhanced!`);
  }

  await prisma.$disconnect();
}

checkStatus().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
