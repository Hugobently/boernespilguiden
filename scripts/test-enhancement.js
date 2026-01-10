// Test AI Enhancement locally against production database
// Usage: node scripts/test-enhancement.js [limit]

const { PrismaClient } = require('@prisma/client');

const limit = parseInt(process.argv[2]) || 3;
const POSTGRES_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL not set');
  process.exit(1);
}

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not set');
  process.exit(1);
}

console.log('🔌 Connecting to production database...');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: POSTGRES_URL,
    },
  },
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function enhanceMedia(media) {
  const typeLabel = media.type === 'MOVIE' ? 'film' : 'serie';
  const ageText = media.ageMin && media.ageMax ? `${media.ageMin}-${media.ageMax} år` : 'børn';
  const releaseYear = media.releaseDate ? new Date(media.releaseDate).getFullYear() : '';

  const prompt = `Du er ekspert i børnemedier og skriver til danske forældre på Børnespilguiden.dk.

OPGAVE: Analyser denne ${typeLabel} og skriv indhold til forældreguiden.

INFORMATION OM ${media.type === 'MOVIE' ? 'FILMEN' : 'SERIEN'}:
Titel: ${media.title}${media.originalTitle ? ` (${media.originalTitle})` : ''}
Genres: ${media.genres.join(', ')}
Aldersgruppe: ${ageText}
${releaseYear ? `Udgivelsesår: ${releaseYear}` : ''}
${media.isDanish ? 'Dette er dansk produktion' : ''}
${media.hasDanishAudio ? 'Har dansk tale' : 'Kun udenlandsk tale'}

TMDB beskrivelse:
${media.description}

SKRIV FØLGENDE (på dansk, til danske forældre):

1. UDVIDET BESKRIVELSE (200-300 ord):
- Beskriv plottet mere detaljeret end TMDB-teksten
- Hvad gør ${typeLabel}en interessant for børn?
- Hvilke temaer og budskaber er der?
- Beskriv stilen og atmosfæren
- Skriv engagerende og informativt

2. HVAD FORÆLDRE SKAL VIDE (100-150 ord):
- Hvad er vigtigt for forældre at vide?
- Er der noget de skal forberede børnene på?
- Hvilken kontekst er god at have?
- Sociale eller følelsesmæssige temaer?

3. TIP TIL FORÆLDRE (50-75 ord):
- Et konkret, praktisk råd
- Hvordan kan de få mest ud af at se ${typeLabel}en sammen?
- Samtaleemner at tage op bagefter

4. FORDELE (3-5 punkter):
- Positive aspekter ved ${typeLabel}en
- Kort, præcist (max 10 ord per punkt)

5. TIL AT VÆRE OPMÆRKSOM PÅ (2-4 punkter):
- Ting forældre bør vide
- Ikke nødvendigvis negative, men vigtige
- Kort, præcist (max 10 ord per punkt)

6. INDHOLDSMARKERING (true/false):
- hasViolence: Indeholder ${typeLabel}en vold eller kampe?
- hasScaryContent: Er der skræmmende elementer?
- hasLanguage: Er der upassende sprogbrug?
- hasEducational: Er der lærerigt indhold?

RETURNER KUN JSON (ingen forklaring):
{
  "description": "...",
  "parentInfo": "...",
  "parentTip": "...",
  "pros": ["...", "...", "..."],
  "cons": ["...", "..."],
  "hasViolence": false,
  "hasScaryContent": false,
  "hasLanguage": false,
  "hasEducational": false
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error('No content in response');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]);
}

async function main() {
  console.log(`🚀 AI Enhancement Test - Processing ${limit} media items\n`);

  // Find media to enhance
  const mediaList = await prisma.media.findMany({
    where: {
      isActive: true,
      description: { not: null },
      OR: [
        { parentInfo: null },
        { pros: { equals: [] } },
      ],
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Found ${mediaList.length} media items to enhance\n`);

  let enhanced = 0;
  let failed = 0;

  for (let i = 0; i < mediaList.length; i++) {
    const media = mediaList[i];
    const progress = `[${i + 1}/${mediaList.length}]`;

    try {
      console.log(`${progress} Enhancing: ${media.title}`);

      const result = await enhanceMedia(media);

      await prisma.media.update({
        where: { id: media.id },
        data: {
          description: result.description,
          parentInfo: result.parentInfo,
          parentTip: result.parentTip,
          pros: result.pros,
          cons: result.cons,
          hasViolence: result.hasViolence,
          hasScaryContent: result.hasScaryContent,
          hasLanguage: result.hasLanguage,
          hasEducational: result.hasEducational,
        },
      });

      enhanced++;
      console.log(`  ✅ Enhanced successfully`);
      console.log(`  👍 Pros: ${result.pros.length} | ⚠️  Cons: ${result.cons.length}`);
      console.log('');

      // Rate limiting
      if (i < mediaList.length - 1) {
        console.log('  ⏳ Waiting 2 seconds...\n');
        await sleep(2000);
      }
    } catch (error) {
      failed++;
      console.error(`  ❌ Failed:`, error.message);
      console.log('');
    }
  }

  console.log('📊 Summary:');
  console.log(`  Enhanced: ${enhanced}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${mediaList.length}\n`);

  await prisma.$disconnect();
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
