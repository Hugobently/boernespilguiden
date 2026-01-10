// Script til at rette dansk tale markering på DR programmer
// Alle danske DR produktioner skal have hasDanishAudio: true
// Usage: POSTGRES_URL="..." node scripts/fix-dr-danish-audio.js

const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL eller DATABASE_URL ikke sat');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

// Programmer der ER på dansk (isDanish: true)
// Disse skal ALLE have hasDanishAudio: true
const danishPrograms = [
  'Motor Mille og Børnebanden',
  'Sprinter Galore',
  'Den magiske klub',
  'Onkel Rejes Sørøvershow',
  'Heksebeth',
  'Heksebeth og den hovedløse magi',
  'Klar, parat, skolestart',
  'HundeBanden',
  'Max Pinlig',
  'Oda Omvendt',
  'Bella Boris og Berta',
  'Bobbel og Gælles Mission',
  'Cirkusliv i savsmuld',
  'Det Kongelige Spektakel',
  'Det sidste nye med Onkel Reje',
  'Det store Ramasjang Mysterie',
  'Elefantvask',
  'Far, Mor og Bjørn',
  'Hugo og Drømmemasken',
  'Jagten på regnbuens eliksir',
  'Jagten på regnbuens magi',
  'Onkel Reje og Galaksens Helte',
  'Onkel Rejes Heavyband',
  'Osman og Jeppe',
  'Paphoved',
  'Skattejagten',
  'Bamses Julerejse',
];

// Udenlandske programmer der er dubbet til dansk
// Disse skal OGSÅ have hasDanishAudio: true
const dubbedPrograms = [
  'Pippi Langstrømpe',      // Svensk, men sendes på dansk
  'Brandbamsen Bjørnis',    // Norsk, men sendes på dansk
  'Elsa',                   // Norsk/Svensk, dansk version
  'Kasper og Sofie',        // Norsk, dansk version
  'Kevin og farfar',        // Norsk, dansk version
  'Men Kasper da',          // Norsk, dansk version
  'Agenterne',              // Kan være dubbet
  'Mini-agenterne',         // Kan være dubbet
  'Mysteriebureauet',       // Norsk, dansk version
  'Restaurant Million',     // Norsk, dansk version
  'Sol snart 6 år',         // Norsk, dansk version
  'Sommeren med far',       // Norsk, dansk version
  'Stop!',                  // Norsk, dansk version
  'Superhelteskolen',       // Norsk, dansk version
  'Søskende-chok',          // Norsk, dansk version
  'Trex',                   // Norsk, dansk version
  'Vesta-Linnea',           // Svensk/Norsk, dansk version
  'Hanna og Rally',         // Norsk, dansk version
];

async function main() {
  console.log('🎬 Retter dansk tale markering på DR programmer\n');

  let updated = 0;
  let notFound = 0;

  // 1. Opdater alle danske produktioner
  console.log('📺 Opdaterer danske produktioner...');
  for (const title of danishPrograms) {
    try {
      const result = await prisma.media.updateMany({
        where: {
          title: title,
          source: 'DR_MANUAL',
        },
        data: {
          hasDanishAudio: true,
          isDanish: true, // Sikr også at isDanish er sat
        },
      });

      if (result.count > 0) {
        console.log(`  ✅ ${title}`);
        updated += result.count;
      } else {
        console.log(`  ⏭️  ${title} (ikke fundet)`);
        notFound++;
      }
    } catch (error) {
      console.error(`  ❌ ${title}: ${error.message}`);
    }
  }

  console.log('');
  console.log('🌍 Opdaterer dubbede programmer...');

  // 2. Opdater dubbede programmer
  for (const title of dubbedPrograms) {
    try {
      const result = await prisma.media.updateMany({
        where: {
          title: title,
          source: 'DR_MANUAL',
        },
        data: {
          hasDanishAudio: true,
          // isDanish forbliver false da det ikke er danske produktioner
        },
      });

      if (result.count > 0) {
        console.log(`  ✅ ${title}`);
        updated += result.count;
      } else {
        console.log(`  ⏭️  ${title} (ikke fundet)`);
        notFound++;
      }
    } catch (error) {
      console.error(`  ❌ ${title}: ${error.message}`);
    }
  }

  console.log('');
  console.log('📊 Resultat:');
  console.log(`  Opdateret: ${updated} programmer`);
  console.log(`  Ikke fundet: ${notFound}`);

  // 3. Verificer resultat
  console.log('');
  console.log('🔍 Verificerer...');
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

  console.log(`  Med dansk tale: ${withDanish}/45`);
  console.log(`  Uden/ukendt: ${withoutDanish}/45`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal fejl:', error);
  process.exit(1);
});
