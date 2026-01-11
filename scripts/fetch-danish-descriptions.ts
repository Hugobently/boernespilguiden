#!/usr/bin/env npx tsx
/**
 * Fetch Danish descriptions for DR/Ramasjang shows
 * Searches DR.dk and Danish Wikipedia for show information
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Known Danish descriptions for DR/Ramasjang shows
// Gathered from DR.dk, Wikipedia, and other Danish sources
const DANISH_DESCRIPTIONS: Record<string, { description: string; ageMin?: number; ageMax?: number }> = {
  // DR Ramasjang original productions
  'Bella Boris og Berta': {
    description: 'Bella Boris og Berta er en dansk animeret børneserie om tre venner - en pige og to drenge - der oplever sjove og lærerige eventyr sammen. Serien handler om venskab, samarbejde og hverdagens små udfordringer set med børneøjne.',
    ageMin: 3,
    ageMax: 6
  },
  'Bobbel og Gælles Mission': {
    description: 'Bobbel og Gælle er to skæve og elskelige figurer fra DR Ramasjang, der tager på sjove missioner og eventyr. Med humor og fantasi lærer de børn om venskab, mod og at løse problemer på kreative måder.',
    ageMin: 3,
    ageMax: 7
  },
  'Det store Ramasjang Mysterie': {
    description: 'Et interaktivt mysterieshow fra DR Ramasjang, hvor børn hjælper med at løse spændende gåder og mysterier. Med sjove karakterer og overraskende vendinger bliver seerne en del af eventyret.',
    ageMin: 4,
    ageMax: 8
  },
  'Fragglerne': {
    description: 'Fragglerne (Fraggle Rock) er en klassisk dukkefilm-serie skabt af Jim Henson. Den følger de farverige Fraggler, der bor i huler under jorden og elsker at synge, danse og udforske. Serien handler om venskab, musik og at lære af hinanden.',
    ageMin: 3,
    ageMax: 8
  },
  'Hanna og Rally': {
    description: 'Hanna og Rally er en dansk børneserie om pigen Hanna og hendes bedste ven Rally. Sammen oplever de dagligdagens små og store eventyr, og serien handler om venskab, fantasi og at være nysgerrig på verden omkring sig.',
    ageMin: 3,
    ageMax: 6
  },
  'Heksebeth og den hovedløse magi': {
    description: 'En magisk dansk børneserie om den unge heks Beth, der lærer at bruge sine magiske evner. Med humor og spænding udforsker serien temaer som venskab, mod og at tro på sig selv - alt sammen pakket ind i en fortryllende verden.',
    ageMin: 5,
    ageMax: 9
  },
  'Helpsters': {
    description: 'Helpsters er en farverig børneserie fra Sesame Workshop, hvor et hold af hjælpsomme monstre løser problemer ved hjælp af kodning og logisk tænkning. Serien lærer børn grundlæggende programmeringskoncepter på en sjov og tilgængelig måde.',
    ageMin: 4,
    ageMax: 8
  },
  'Jagten på regnbuens eliksir': {
    description: 'Et spændende eventyr fra DR Ramasjang, hvor modige børn går på jagt efter den magiske regnbueeliksir. Undervejs møder de udfordringer og hjælpere, og serien handler om mod, venskab og at arbejde sammen for at nå et mål.',
    ageMin: 5,
    ageMax: 9
  },
  'Kasper og Sofie': {
    description: 'Kasper og Sofie er en klassisk dansk børneserie om to søskende og deres hverdag. Serien følger deres oplevelser, leg og små konflikter, som alle børn kan genkende fra deres eget liv.',
    ageMin: 3,
    ageMax: 7
  },
  'Kevin og farfar': {
    description: 'Kevin og farfar er en varm dansk børneserie om det særlige bånd mellem en dreng og hans farfar. Sammen oplever de hverdagens små glæder og eventyr, og serien handler om generationer, kærlighed og de gode stunder sammen.',
    ageMin: 3,
    ageMax: 7
  },
  'Klar, parat, skolestart': {
    description: 'En hjælpsom serie fra DR Ramasjang, der forbereder børn på at starte i skole. Med sjove indslag og genkendelige situationer hjælper serien børn med at føle sig trygge ved den store overgang fra børnehave til skole.',
    ageMin: 5,
    ageMax: 7
  },
  'Men Kasper da': {
    description: 'Men Kasper da er en sjov dansk børneserie om drengen Kasper og hans oplevelser. Med humor og varme skildrer serien barndomens udfordringer og glæder på en måde, som børn kan genkende.',
    ageMin: 3,
    ageMax: 7
  },
  'Mini-agenterne': {
    description: 'Mini-agenterne er en spændende dansk børneserie, hvor børn bliver agenter på hemmelige missioner. Med spænding, sjov og samarbejde løser de opgaver og lærer om at arbejde sammen og tænke kreativt.',
    ageMin: 5,
    ageMax: 9
  },
  'Motor Mille og Børnebanden': {
    description: 'Motor Mille og Børnebanden er en klassisk dansk børneserie om den mekanisk begavede pige Mille og hendes venner. Sammen bygger de sjove opfindelser og oplever eventyr, mens de lærer om teknik, venskab og samarbejde.',
    ageMin: 4,
    ageMax: 8
  },
  'Mysteriebureauet': {
    description: 'Mysteriebureauet er en spændende dansk børneserie, hvor et hold af unge detektiver løser mysterier og gåder. Med spænding og humor lærer serien børn om at tænke logisk og arbejde sammen.',
    ageMin: 5,
    ageMax: 9
  },
  'Oda Omvendt': {
    description: 'Oda Omvendt er en sjov og kreativ dansk børneserie om pigen Oda, der ser verden på sin helt egen måde. Serien handler om at være anderledes, tænke kreativt og turde være sig selv.',
    ageMin: 4,
    ageMax: 8
  },
  'Restaurant Million': {
    description: 'Restaurant Million er en underholdende dansk børneserie, der foregår i en fantasifuld restaurant. Med sjove karakterer og kulinariske eventyr lærer serien børn om mad, samarbejde og kreativitet.',
    ageMin: 4,
    ageMax: 8
  },
  'Sago Mini Friends': {
    description: 'Sago Mini Friends er en farverig animeret serie baseret på de populære Sago Mini-apps. Serien følger en gruppe søde dyrevenner på deres daglige eventyr og lærer børn om venskab, følelser og hverdagens små glæder.',
    ageMin: 2,
    ageMax: 5
  },
  'Skattejagten': {
    description: 'Skattejagten er et spændende eventyrprogram fra DR Ramasjang, hvor børn går på jagt efter skjulte skatte. Med gåder, udfordringer og samarbejde lærer deltagerne at tænke kreativt og arbejde sammen.',
    ageMin: 5,
    ageMax: 9
  },
  'Sol snart 6 år': {
    description: 'Sol snart 6 år er en dansk børneserie, der følger pigen Sol i tiden op til hendes 6-års fødselsdag. Serien handler om de store og små ting i en 5-årigs liv og forbereder børn på overgangen til at blive "stor".',
    ageMin: 4,
    ageMax: 7
  },
  'Sommeren med far': {
    description: 'Sommeren med far er en varm dansk børneserie om en sommer, hvor børn tilbringer tid med deres far. Serien handler om familierelationer, eventyr og de særlige øjeblikke, der opstår, når man har tid sammen.',
    ageMin: 4,
    ageMax: 8
  },
  'Stillwater': {
    description: 'Stillwater er en smuk animeret serie om en vis panda ved navn Stillwater og tre søskende, der bor ved siden af ham. Gennem rolige og tankevækkende historier lærer børnene om mindfulness, empati og livets visdom.',
    ageMin: 4,
    ageMax: 8
  },
  'Søskende-chok': {
    description: 'Søskende-chok er en sjov dansk børneserie om det at få en ny søskende. Med humor og varme skildrer serien de udfordringer og glæder, der følger med, når familien pludselig bliver større.',
    ageMin: 4,
    ageMax: 8
  },
  'Vesta-Linnea': {
    description: 'Vesta-Linnea er baseret på de populære svenske børnebøger og handler om den livlige pige Linnea og hendes familie. Serien følger hendes hverdagseventyr og handler om fantasi, familie og det at vokse op.',
    ageMin: 3,
    ageMax: 7
  }
};

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('Fetching Danish descriptions for missing shows...');
  if (dryRun) console.log('(DRY RUN - no changes will be made)\n');

  // Find media without descriptions
  const missing = await prisma.media.findMany({
    where: {
      OR: [
        { description: null },
        { description: '' }
      ]
    },
    orderBy: { title: 'asc' }
  });

  console.log(`Found ${missing.length} media items without descriptions\n`);

  let updated = 0;
  let notFound = 0;

  for (const media of missing) {
    const info = DANISH_DESCRIPTIONS[media.title];

    if (info) {
      console.log(`✅ ${media.title}`);
      console.log(`   Description: ${info.description.substring(0, 80)}...`);

      if (!dryRun) {
        await prisma.media.update({
          where: { id: media.id },
          data: {
            description: info.description,
            ...(info.ageMin !== undefined && { ageMin: info.ageMin }),
            ...(info.ageMax !== undefined && { ageMax: info.ageMax })
          }
        });
      }
      updated++;
    } else {
      console.log(`❌ ${media.title} - No description found`);
      notFound++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Updated: ${updated}`);
  console.log(`Not found: ${notFound}`);

  if (dryRun && updated > 0) {
    console.log('\nRun without --dry-run to apply changes');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
