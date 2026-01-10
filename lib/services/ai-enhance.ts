// AI Enhancement Service for Media Descriptions
// Uses Claude AI to enhance TMDB descriptions with Danish parent perspective

interface MediaEnhancementInput {
  title: string;
  originalTitle?: string;
  type: 'MOVIE' | 'SERIES';
  description: string; // TMDB description
  genres: string[];
  ageMin?: number;
  ageMax?: number;
  releaseYear?: number;
  isDanish?: boolean;
  hasDanishAudio?: boolean;
}

interface MediaEnhancementOutput {
  description: string; // Enhanced description (200-300 words)
  parentInfo: string; // "Hvad forældre skal vide" (100-150 words)
  parentTip: string; // Concrete tip for parents (50-75 words)
  pros: string[]; // 3-5 positive points
  cons: string[]; // 2-4 things to be aware of
  hasViolence: boolean;
  hasScaryContent: boolean;
  hasLanguage: boolean;
  hasEducational: boolean;
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Enhance media description using Claude AI
 * Expands short TMDB descriptions with detailed, parent-focused content in Danish
 */
export async function enhanceMediaDescription(
  input: MediaEnhancementInput
): Promise<MediaEnhancementOutput> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const typeLabel = input.type === 'MOVIE' ? 'film' : 'serie';
  const ageText = input.ageMin && input.ageMax ? `${input.ageMin}-${input.ageMax} år` : 'børn';

  const prompt = `Du er ekspert i børnemedier og skriver til danske forældre på Børnespilguiden.dk.

OPGAVE: Analyser denne ${typeLabel} og skriv indhold til forældreguiden.

INFORMATION OM ${input.type === 'MOVIE' ? 'FILMEN' : 'SERIEN'}:
Titel: ${input.title}${input.originalTitle ? ` (${input.originalTitle})` : ''}
Genres: ${input.genres.join(', ')}
Aldersgruppe: ${ageText}
${input.releaseYear ? `Udgivelsesår: ${input.releaseYear}` : ''}
${input.isDanish ? 'Dette er dansk produktion' : ''}
${input.hasDanishAudio ? 'Har dansk tale' : 'Kun udenlandsk tale'}

TMDB beskrivelse:
${input.description}

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

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
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
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      throw new Error('No content in Anthropic response');
    }

    // Extract JSON from response (in case there's any surrounding text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result: MediaEnhancementOutput = JSON.parse(jsonMatch[0]);

    // Validate the output
    if (!result.description || !result.parentInfo || !result.parentTip) {
      throw new Error('Invalid enhancement output - missing required fields');
    }

    return result;
  } catch (error) {
    console.error('Failed to enhance media description:', error);
    throw error;
  }
}

/**
 * Enhance media description with retry logic
 */
export async function enhanceMediaDescriptionWithRetry(
  input: MediaEnhancementInput,
  maxRetries = 2
): Promise<MediaEnhancementOutput> {
  let lastError: Error | null = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await enhanceMediaDescription(input);
    } catch (error) {
      lastError = error as Error;
      console.error(`Enhancement attempt ${i + 1} failed:`, error);

      if (i < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Enhancement failed after retries');
}
