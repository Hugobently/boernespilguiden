// Review Generator Service using Anthropic Claude

import { prisma } from '@/lib/db';
import { Media } from '@prisma/client';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateReview(media: Media): Promise<string> {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const type = media.type === 'MOVIE' ? 'børnefilm' : 'børneserie';
  const origin = media.isDanish ? 'dansk ' : media.isNordic ? 'nordisk ' : '';

  const prompt = `Skriv en kort anmeldelse (150-200 ord) af denne ${origin}${type} til forældre.

Titel: ${media.title}
${media.description ? `Beskrivelse: ${media.description}` : ''}
${media.ageMin && media.ageMax ? `Anbefalet alder: ${media.ageMin}-${media.ageMax} år` : ''}
${media.seasons ? `Antal sæsoner: ${media.seasons}` : ''}

REGLER:
- Skriv som en forælder der har set det med børn
- Naturligt, uformelt dansk
- Fokuser på: Hvad handler det om? Passer det til aldersgruppen?
- Nævn eventuelle bekymringer (tempo, skræmmende scener)
- Vær ærlig og nuanceret
- UNDGÅ: "magisk", "fortryllende", "vidunderlig", "fantastisk"
- Afslut med konkret aldersanbefaling

Start direkte med teksten, ingen overskrift.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0];
  return text.type === 'text' ? text.text : '';
}

export async function generateMissingReviews(limit = 5): Promise<number> {
  const mediaWithoutReview = await prisma.media.findMany({
    where: {
      review: null,
      isActive: true,
      description: { not: null }, // Only those with descriptions
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  let generated = 0;

  for (const media of mediaWithoutReview) {
    try {
      const review = await generateReview(media);

      await prisma.media.update({
        where: { id: media.id },
        data: { review, isReviewed: true },
      });

      generated++;
      await sleep(1000); // Rate limit Claude API
    } catch (error) {
      console.error(`Failed to generate review for ${media.title}:`, error);
    }
  }

  return generated;
}
