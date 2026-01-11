// AI Enhancement Service for Game Descriptions
// Uses Claude AI to add parent-focused info for games

interface GameEnhancementInput {
  title: string;
  description: string;
  shortDescription: string;
  minAge: number;
  maxAge: number;
  categories: string[];
  skills: string[];
  platforms: string[];
  hasAds: boolean;
  hasInAppPurchases: boolean;
  isOfflineCapable: boolean;
  requiresInternet: boolean;
  hasSocialFeatures?: boolean;
  hasChat?: boolean;
}

interface GameEnhancementOutput {
  parentInfo: string; // "Hvad forældre skal vide" (100-150 words)
  parentTip: string; // Concrete tip for parents (50-75 words)
  pros: string[]; // 3-5 positive points
  cons: string[]; // 2-4 things to be aware of
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Enhance game description using Claude AI
 * Adds parent-focused info to existing game descriptions
 */
export async function enhanceGameDescription(
  input: GameEnhancementInput
): Promise<GameEnhancementOutput> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const ageText = `${input.minAge}-${input.maxAge} år`;

  // Build concerns list
  const concerns: string[] = [];
  if (input.hasAds) concerns.push('Har reklamer');
  if (input.hasInAppPurchases) concerns.push('Har in-app køb');
  if (input.requiresInternet) concerns.push('Kræver internet');
  if (input.hasSocialFeatures) concerns.push('Har sociale funktioner');
  if (input.hasChat) concerns.push('Har chat-funktion');

  const positives: string[] = [];
  if (input.isOfflineCapable) positives.push('Kan spilles offline');
  if (!input.hasAds) positives.push('Ingen reklamer');
  if (!input.hasInAppPurchases) positives.push('Ingen køb i app');

  const prompt = `Du er ekspert i børnespil og skriver til danske forældre på Børnespilguiden.dk.

OPGAVE: Analyser dette spil og skriv forældreinformation.

INFORMATION OM SPILLET:
Titel: ${input.title}
Aldersgruppe: ${ageText}
Platforme: ${input.platforms.join(', ')}
Kategorier: ${input.categories.join(', ')}
Færdigheder: ${input.skills.join(', ')}

EKSISTERENDE BESKRIVELSE:
${input.description}

KORT BESKRIVELSE:
${input.shortDescription}

TEKNISK INFO:
${concerns.length > 0 ? '- Opmærksomhedspunkter: ' + concerns.join(', ') : '- Ingen særlige bekymringer'}
${positives.length > 0 ? '- Positive: ' + positives.join(', ') : ''}

SKRIV FØLGENDE (på dansk, til danske forældre):

1. HVAD FORÆLDRE SKAL VIDE (100-150 ord):
- Hvad er vigtigt for forældre at vide om spillet?
- Hvordan kan barnet lære af spillet?
- Er der noget at være opmærksom på?
- Hvordan kan forældre støtte barnet?

2. TIP TIL FORÆLDRE (50-75 ord):
- Et konkret, praktisk råd
- Hvordan får man mest ud af spillet?
- Forslag til samspil eller opfølgning

3. FORDELE (3-5 punkter):
- Positive aspekter ved spillet
- Kort, præcist (max 10 ord per punkt)
- Fokuser på læring og underholdning

4. TIL AT VÆRE OPMÆRKSOM PÅ (2-4 punkter):
- Ting forældre bør vide
- Baseret på den tekniske info og spillets indhold
- Kort, præcist (max 10 ord per punkt)

RETURNER KUN JSON (ingen forklaring):
{
  "parentInfo": "...",
  "parentTip": "...",
  "pros": ["...", "...", "..."],
  "cons": ["...", "..."]
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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
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

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result: GameEnhancementOutput = JSON.parse(jsonMatch[0]);

    // Validate the output
    if (!result.parentInfo || !result.parentTip) {
      throw new Error('Invalid enhancement output - missing required fields');
    }

    return result;
  } catch (error) {
    console.error('Failed to enhance game description:', error);
    throw error;
  }
}

/**
 * Enhance game description with retry logic
 */
export async function enhanceGameDescriptionWithRetry(
  input: GameEnhancementInput,
  maxRetries = 2
): Promise<GameEnhancementOutput> {
  let lastError: Error | null = null;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await enhanceGameDescription(input);
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
