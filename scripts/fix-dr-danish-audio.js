// Script til at rette dansk tale markering på DR programmer
// ALLE DR programmer sendes med dansk tale (enten danske produktioner eller dubbede)
// Usage: POSTGRES_URL="..." node scripts/fix-dr-danish-audio.js

const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL eller DATABASE_URL ikke sat');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

async function main() {
  console.log('Retter dansk tale markering på ALLE DR programmer\n');

  // DR er dansk public service - alle programmer sendes med dansk tale
  // (enten danske produktioner eller dubbede versioner)

  // 1. Opdater ALLE DR_MANUAL programmer til at have dansk tale
  console.log('Opdaterer alle DR_MANUAL programmer...');

  const result = await prisma.media.updateMany({
    where: {
      source: 'DR_MANUAL',
    },
    data: {
      hasDanishAudio: true,
    },
  });

  console.log(`  Opdateret: ${result.count} programmer`);

  // 2. Verificer resultat
  console.log('');
  console.log('Verificerer...');

  const totalDR = await prisma.media.count({
    where: {
      source: 'DR_MANUAL',
    },
  });

  const withDanish = await prisma.media.count({
    where: {
      source: 'DR_MANUAL',
      hasDanishAudio: true,
    },
  });

  const withoutDanish = await prisma.media.count({
    where: {
      source: 'DR_MANUAL',
      hasDanishAudio: { not: true },
    },
  });

  console.log(`  Total DR programmer: ${totalDR}`);
  console.log(`  Med dansk tale: ${withDanish}`);
  console.log(`  Uden dansk tale: ${withoutDanish}`);

  if (withoutDanish > 0) {
    console.log('');
    console.log('ADVARSEL: Nogle programmer mangler stadig dansk tale markering!');

    const missing = await prisma.media.findMany({
      where: {
        source: 'DR_MANUAL',
        hasDanishAudio: { not: true },
      },
      select: { title: true },
    });

    for (const m of missing) {
      console.log(`  - ${m.title}`);
    }
  } else {
    console.log('');
    console.log('Alle DR programmer har nu dansk tale markering!');
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal fejl:', error);
  process.exit(1);
});
