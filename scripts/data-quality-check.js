// Data quality check for Film & Serier section
// Usage: POSTGRES_URL="..." node scripts/data-quality-check.js

const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL eller DATABASE_URL ikke sat');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

async function main() {
  console.log('🔍 Kører datakvalitetscheck på Film & Serier\n');

  // 1. Check Danish audio flags
  console.log('📺 Dansk tale status:');
  const withDanishAudio = await prisma.media.count({
    where: { hasDanishAudio: true },
  });
  const withoutDanishAudio = await prisma.media.count({
    where: { hasDanishAudio: { not: true } },
  });
  console.log(`  Med dansk tale: ${withDanishAudio}`);
  console.log(`  Uden/ukendt: ${withoutDanishAudio}`);

  // 2. Check descriptions
  console.log('\n📝 Beskrivelser:');
  const withDescription = await prisma.media.count({
    where: { description: { not: null } },
  });
  const withoutDescription = await prisma.media.count({
    where: { description: null },
  });
  console.log(`  Med beskrivelse: ${withDescription}`);
  console.log(`  Uden beskrivelse: ${withoutDescription}`);

  // 3. Check AI enhancement status
  console.log('\n🤖 AI-forbedringer:');
  const enhanced = await prisma.media.count({
    where: { parentInfo: { not: null } },
  });
  const notEnhanced = await prisma.media.count({
    where: { parentInfo: null },
  });
  const total = await prisma.media.count();
  console.log(`  AI-forbedret: ${enhanced}/${total} (${Math.round(enhanced/total*100)}%)`);
  console.log(`  Ikke forbedret: ${notEnhanced}/${total} (${Math.round(notEnhanced/total*100)}%)`);

  // 4. Check by source
  console.log('\n📊 Fordeling efter kilde:');
  const sources = await prisma.media.groupBy({
    by: ['source'],
    _count: true,
  });
  for (const { source, _count } of sources) {
    console.log(`  ${source}: ${_count}`);
  }

  // 5. Check DR programs specifically
  console.log('\n🎬 DR Programmer:');
  const drPrograms = await prisma.media.findMany({
    where: { source: 'DR_MANUAL' },
    select: {
      title: true,
      hasDanishAudio: true,
      isDanish: true,
      description: true,
    },
  });

  const drWithDanish = drPrograms.filter(p => p.hasDanishAudio === true).length;
  const drWithDescription = drPrograms.filter(p => p.description !== null).length;

  console.log(`  Total DR programmer: ${drPrograms.length}`);
  console.log(`  Med dansk tale: ${drWithDanish}/${drPrograms.length}`);
  console.log(`  Med beskrivelse: ${drWithDescription}/${drPrograms.length}`);

  // 6. Check for potential issues
  console.log('\n⚠️  Potentielle problemer:');

  // Programs marked as Danish but without Danish audio
  const danishNoAudio = await prisma.media.count({
    where: {
      isDanish: true,
      hasDanishAudio: { not: true },
    },
  });
  console.log(`  Danske programmer uden dansk tale: ${danishNoAudio}`);

  // Programs without posters
  const noPoster = await prisma.media.count({
    where: {
      posterUrl: null,
    },
  });
  console.log(`  Programmer uden poster: ${noPoster}`);

  console.log('\n✅ Datakvalitetscheck gennemført!');

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal fejl:', error);
  process.exit(1);
});
