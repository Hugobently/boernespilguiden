// TMDB IDs for adult content that should NEVER be imported
// These are incorrectly categorized as children's TV by TMDB

export const ADULT_CONTENT_BLACKLIST = new Set([
  // Adult Animation (US)
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
  94954,  // Hazbin Hotel - Voksenanimation
  61222,  // BoJack Horseman - Voksentemaer, depression

  // Adult Anime (Japan)
  30984,  // Bleach - Vold, 12+
  31911,  // JoJo's Bizarre Adventure - Vold, 13+
  21735,  // One Punch Man - Vold
  73223,  // My Hero Academia - Shonen, 10+
  110531, // Spy x Family - Teen/voksen
  114695, // Frieren - Teen/voksen fantasy
  85937,  // Psycho-Pass - Vold, voksentemaer
  73586,  // Black Clover - Shonen, vold

  // Adult Sitcoms/Shows
  3452,   // Frasier - Voksensitcom
  2352,   // The Nanny - Voksensitcom
  49009,  // The Goldbergs - Voksensitcom
  106,    // The Andy Griffith Show - Gammel voksenserie
  5371,   // iCarly - Teen-serie, ikke småbørn
  1418,   // The Big Bang Theory - Voksensitcom
  63174,  // Young Sheldon - Voksensitcom

  // Non-Children Programs
  2912,   // Jeopardy! - Quiz show for voksne
  1508,   // Dancing with the Stars - Voksenunderholdning
  94605,  // Arcane - Vold, 12+ minimum
  95557,  // Invincible - Ekstrem vold
  114478, // The Legend of Vox Machina - Vold, 16+
  119051, // Star Trek: Lower Decks - Voksenhumor

  // Nordic Adult Shows
  36361,  // Solsidan - Svensk voksenkomedie
  105768, // Stormester DK - Voksenunderholdning
  1695,   // Bjerglægen - Tysk voksendrama
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
    // Adult Animation (US)
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
    94954: 'Hazbin Hotel - Adult animation',
    61222: 'BoJack Horseman - Adult themes',
    // Adult Anime
    30984: 'Bleach - Violence, 12+',
    31911: "JoJo's Bizarre Adventure - Violence, 13+",
    21735: 'One Punch Man - Violence',
    73223: 'My Hero Academia - Shonen, 10+',
    110531: 'Spy x Family - Teen/adult',
    114695: 'Frieren - Teen/adult fantasy',
    85937: 'Psycho-Pass - Violence, adult themes',
    73586: 'Black Clover - Shonen, violence',
    // Adult Sitcoms
    3452: 'Frasier - Adult sitcom',
    2352: 'The Nanny - Adult sitcom',
    49009: 'The Goldbergs - Adult family sitcom',
    106: 'The Andy Griffith Show - Classic adult series',
    5371: 'iCarly - Teen show (not for young children)',
    1418: 'The Big Bang Theory - Adult sitcom',
    63174: 'Young Sheldon - Adult sitcom',
    // Non-Children
    2912: 'Jeopardy - Adult game show',
    1508: 'Dancing with the Stars - Adult entertainment',
    94605: 'Arcane - Violent (12+ minimum)',
    95557: 'Invincible - Extreme violence',
    114478: 'The Legend of Vox Machina - Violence, 16+',
    119051: 'Star Trek: Lower Decks - Adult humor',
    // Nordic
    36361: 'Solsidan - Swedish adult comedy',
    105768: 'Stormester DK - Adult entertainment',
    1695: 'Bjerglægen - German adult drama',
  };

  return reasons[tmdbId] || 'Adult content';
}
