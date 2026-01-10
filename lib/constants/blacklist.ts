// TMDB IDs for adult content that should NEVER be imported
// These are incorrectly categorized as children's TV by TMDB

export const ADULT_CONTENT_BLACKLIST = new Set([
  // Adult Animation
  2190,   // South Park - Groft sprog, voksentemaer
  60625,  // Rick and Morty - Vold, alkohol, voksentemaer
  1434,   // Family Guy - Sexuelt indhold, groft sprog
  1433,   // American Dad! - Sexuelt indhold, vold
  10283,  // Archer - Vold, sex, alkohol, sprog
  86831,  // Love, Death & Robots - Ekstrem vold, nuditet
  615,    // Futurama - Voksentemaer, alkohol
  32726,  // Bob's Burgers - Voksenhumor
  2122,   // King of the Hill - Voksensitcom
  456,    // Simpsons - Grænsetilfælde

  // Adult Sitcoms/Shows
  3452,   // Frasier - Voksensitcom
  2352,   // The Nanny - Voksensitcom
  49009,  // The Goldbergs - Voksensitcom
  106,    // The Andy Griffith Show - Gammel voksenserie
  5371,   // iCarly - Teen-serie, ikke småbørn

  // Non-Children Programs
  2912,   // Jeopardy! - Quiz show for voksne
  1508,   // Dancing with the Stars - Voksenunderholdning
  94605,  // Arcane - Vold, 12+ minimum
]);

/**
 * Check if a TMDB ID is blacklisted (adult content)
 */
export function isBlacklisted(tmdbId: number): boolean {
  return ADULT_CONTENT_BLACKLIST.has(tmdbId);
}

/**
 * Get human-readable reason for blacklist (for logging)
 */
export function getBlacklistReason(tmdbId: number): string {
  const reasons: Record<number, string> = {
    2190: 'South Park - Adult animated series',
    60625: 'Rick and Morty - Adult sci-fi comedy',
    1434: 'Family Guy - Adult animated sitcom',
    1433: 'American Dad - Adult animated sitcom',
    10283: 'Archer - Adult spy comedy',
    86831: 'Love, Death & Robots - Adult anthology',
    615: 'Futurama - Adult animated comedy',
    32726: "Bob's Burgers - Adult comedy",
    2122: 'King of the Hill - Adult sitcom',
    456: 'Simpsons - Borderline adult content',
    3452: 'Frasier - Adult sitcom',
    2352: 'The Nanny - Adult sitcom',
    49009: 'The Goldbergs - Adult family sitcom',
    106: 'The Andy Griffith Show - Classic adult series',
    5371: 'iCarly - Teen show (not for young children)',
    2912: 'Jeopardy - Adult game show',
    1508: 'Dancing with the Stars - Adult entertainment',
    94605: 'Arcane - Violent (12+ minimum)',
  };

  return reasons[tmdbId] || 'Adult content';
}
