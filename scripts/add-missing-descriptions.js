// Script til at tilføje manuelle danske beskrivelser til TMDB serier uden beskrivelser
// Usage: POSTGRES_URL="..." node scripts/add-missing-descriptions.js

const { PrismaClient } = require('@prisma/client');

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL eller DATABASE_URL ikke sat');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: POSTGRES_URL } },
});

// Danske beskrivelser til de 11 serier
const descriptions = {
  3022: {
    title: 'Rugrats',
    description: 'Rugrats følger en gruppe småbørn med vilde fantasier og store eventyr. Tommy, Chuckie, Phil og Lil oplever hverdagen fra et barns perspektiv, hvor selv simple ting bliver til store eventyr. Serien er fuld af humor og hjertevarme, og lærer børn om venskab og problemløsning.',
  },
  7869: {
    title: 'Pingvinerne fra Madagaskar',
    description: 'Pingvinerne fra Madagaskar følger fire eventyrlyste pingviner - Skipper, Kowalski, Rico og Private - der bor i Central Park Zoo. Med militær præcision og masser af humor tackler de daglige udfordringer og mystiske missioner. En actionfyldt animeret serie med slapstick humor.',
  },
  61923: {
    title: 'Star vs. the Forces of Evil',
    description: 'Star Butterfly er en magisk prinsesse fra en anden dimension, der sendes til Jorden for at lære at bruge sin magi ansvarligt. Sammen med sin bedste ven Marco kæmper hun mod onde kræfter, mens hun navigerer teenage-livet. En farverig fantasy-serie med stærke rollemodeller.',
  },
  74415: {
    title: 'Grizzy og lemmingerne',
    description: 'Grizzy er en stor bjørn der elsker at slappe af i en hytte i skoven, men hans fred bliver konstant forstyrret af en flok små, energiske lemminger. De konkurrerer om de samme ressourcer og godbidder i denne sjove animerede serie uden dialog, der appellerer til alle aldre.',
  },
  2808: {
    title: 'Totally Spies!',
    description: 'Tre teenagepiger - Sam, Clover og Alex - lever dobbeltliv som hemmelige agenter for organisationen WOOHP. De bekæmper skurke og redder verden, mens de navigerer udfordringerne ved at være teenager. En actionfyldt serie om venskab, teamwork og selvtillid.',
  },
  72468: {
    title: 'OK K.O.! Let\'s Be Heroes',
    description: 'K.O. er en ung, optimistisk dreng der drømmer om at blive verdens bedste helt. Han arbejder i Lakewood Plaza og træner sammen med sine venner Radicles og Enid. Serien handler om venskab, mod og at forfølge sine drømme, med masser af action og humor.',
  },
  502: {
    title: 'Sesame Street',
    description: 'Sesame Street er et klassisk amerikansk børneprogram der har underholdt og undervist børn siden 1969. Med ikoniske karakterer som Elmo, Big Bird og Cookie Monster lærer børn om tal, bogstaver, farver og sociale færdigheder gennem sjove sange, historier og interaktive segmenter.',
  },
  15260: {
    title: 'Adventure Time',
    description: 'Adventure Time følger Finn den menneskelige og hans bedste ven Jake, en magisk hund der kan ændre form. De oplever fantastiske eventyr i det post-apokalyptiske land Ooo, hvor de møder mærkelige væsner og kæmper mod onde kræfter. En fantasifuld serie om venskab og mod.',
  },
  65763: {
    title: 'New Looney Tunes',
    description: 'New Looney Tunes bringer de klassiske karakterer som Bugs Bunny, Daffy And, Porky Pig og Tweety til live i nye, kortere historier. Med samme slapstick humor og vilde situationer som originalen, er serien fyldt med action, gags og tidløs underholdning for hele familien.',
  },
  45140: {
    title: 'Teen Titans Go!',
    description: 'Teen Titans Go! følger fem unge superhelte - Robin, Starfire, Raven, Beast Boy og Cyborg - i deres dagligdag på Titans Tower. Mellem superhelte-missioner håndterer de teenage-problemer, venskab og sjov. En komisk take på superhelte-genren med masser af humor og action.',
  },
  8123: {
    title: 'The Wacky World of Tex Avery',
    description: 'The Wacky World of Tex Avery er en animated comedy-serie inspireret af klassisk animation. Med vilde karakterer, overdreven slapstick og uforudsigelige situationer leverer serien masser af lattere. Hver episode indeholder korte segmenter med forskellige karakterer og historier.',
  },
};

async function main() {
  console.log('🚀 Tilføjer danske beskrivelser til 11 TMDB serier\n');

  let updated = 0;
  let skipped = 0;

  for (const [tmdbId, data] of Object.entries(descriptions)) {
    try {
      // Find media item
      const media = await prisma.media.findUnique({
        where: { tmdbId: parseInt(tmdbId) },
      });

      if (!media) {
        console.log(`⏭️  ${data.title}: Ikke fundet i databasen`);
        skipped++;
        continue;
      }

      if (media.description) {
        console.log(`⏭️  ${data.title}: Har allerede beskrivelse`);
        skipped++;
        continue;
      }

      // Update with description
      await prisma.media.update({
        where: { id: media.id },
        data: { description: data.description },
      });

      console.log(`✅ ${data.title}: Beskrivelse tilføjet`);
      updated++;
    } catch (error) {
      console.error(`❌ ${data.title}: Fejl - ${error.message}`);
    }
  }

  console.log(`\n📊 Resultat:`);
  console.log(`  Opdateret: ${updated}`);
  console.log(`  Sprunget over: ${skipped}`);
  console.log(`  Total: ${Object.keys(descriptions).length}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal fejl:', error);
  process.exit(1);
});
