// Intelligent search query parser for Danish children's game searches

export interface ParsedSearchQuery {
  // Age filtering
  minAge: number | null;
  maxAge: number | null;
  ageGroup: string | null;

  // Gender preference
  targetGender: 'piger' | 'drenge' | null;

  // Content filtering
  categories: string[];
  skills: string[];
  themes: string[];

  // Safety/feature filters
  hasAds: boolean | null;
  hasInAppPurchases: boolean | null;
  isOfflineCapable: boolean | null;

  // Price filtering
  priceModel: 'free' | 'paid' | 'freemium' | null;

  // Remaining search terms (for text search)
  searchTerms: string[];

  // Original query for reference
  originalQuery: string;
}

// Danish number words to digits
const numberWords: Record<string, number> = {
  'nul': 0, 'en': 1, 'et': 1, 'to': 2, 'tre': 3, 'fire': 4,
  'fem': 5, 'seks': 6, 'syv': 7, 'otte': 8, 'ni': 9, 'ti': 10,
  'elleve': 11, 'tolv': 12, 'tretten': 13, 'fjorten': 14, 'femten': 15,
};

// Age patterns to recognize
const agePatterns = [
  // "5 år", "5år", "5-år"
  /(\d+)\s*-?\s*år(?:ig|ige)?/i,
  // "5-årig", "5årig"
  /(\d+)-?årig(?:e)?/i,
  // "femårig", "fem år"
  new RegExp(`(${Object.keys(numberWords).join('|')})\\s*-?\\s*år(?:ig|ige)?`, 'i'),
];

// Age range patterns
const ageRangePatterns = [
  // "3-6 år", "3 til 6 år"
  /(\d+)\s*(?:-|til)\s*(\d+)\s*år/i,
];

// Gender keywords
const genderKeywords: Record<string, 'piger' | 'drenge'> = {
  'pige': 'piger',
  'piger': 'piger',
  'pigespil': 'piger',
  'prinsesse': 'piger',
  'dreng': 'drenge',
  'drenge': 'drenge',
  'drengespil': 'drenge',
};

// Category mappings (Danish terms → category values)
const categoryMappings: Record<string, string[]> = {
  // Learning
  'læring': ['læring', 'uddannelse'],
  'læringsspil': ['læring', 'uddannelse'],
  'lærings': ['læring', 'uddannelse'],
  'uddannelse': ['læring', 'uddannelse'],
  'educational': ['læring', 'uddannelse'],
  'lære': ['læring'],
  'undervisning': ['læring', 'uddannelse'],
  'edutainment': ['læring', 'uddannelse'],

  // Creativity
  'kreativ': ['kreativitet'],
  'kreativt': ['kreativitet'],
  'kreativitet': ['kreativitet'],
  'kreativspil': ['kreativitet'],
  'tegnespil': ['kreativitet', 'tegning'],
  'tegning': ['kreativitet', 'tegning'],
  'tegne': ['kreativitet', 'tegning'],
  'male': ['kreativitet', 'tegning'],
  'malespil': ['kreativitet', 'tegning'],
  'kunst': ['kreativitet'],

  // Music
  'musik': ['musik'],
  'musikspil': ['musik'],
  'sang': ['musik'],
  'synge': ['musik'],
  'instrument': ['musik'],

  // Puzzle/Logic
  'puslespil': ['puslespil', 'logik'],
  'puzzle': ['puslespil', 'logik'],
  'logik': ['logik', 'puslespil'],
  'logikspil': ['logik', 'puslespil'],
  'tænkning': ['logik'],
  'hjernegymnastik': ['logik', 'puslespil'],

  // Adventure
  'eventyr': ['eventyr', 'adventure'],
  'eventyrspil': ['eventyr', 'adventure'],
  'adventure': ['eventyr', 'adventure'],

  // Action
  'action': ['action'],
  'actionspil': ['action'],
  'racing': ['action', 'racing'],
  'racerspil': ['action', 'racing'],
  'løb': ['action', 'racing'],

  // Simulation
  'simulation': ['simulation'],
  'simulator': ['simulation'],

  // Building
  'byggespil': ['byggespil'],
  'bygge': ['byggespil'],
  'konstruktion': ['byggespil'],

  // Board games specific
  'brætspil': ['brætspil'],
  'kortspil': ['kortspil'],
  'familiespil': ['familiespil'],
  'strategi': ['strategi'],
  'samarbejde': ['samarbejde', 'kooperativt'],
  'kooperativt': ['samarbejde', 'kooperativt'],
  'party': ['party', 'festspil'],
  'festspil': ['party', 'festspil'],
};

// Skill mappings
const skillMappings: Record<string, string[]> = {
  // Math
  'matematik': ['matematik', 'tal'],
  'tal': ['matematik', 'tal'],
  'regning': ['matematik'],
  'tælle': ['matematik', 'tal'],
  'plus': ['matematik'],
  'minus': ['matematik'],

  // Reading/Language
  'læsning': ['læsning', 'bogstaver'],
  'læse': ['læsning', 'bogstaver'],
  'bogstaver': ['bogstaver', 'læsning'],
  'alfabet': ['bogstaver'],
  'ord': ['læsning', 'sprog'],
  'sprog': ['sprog'],
  'dansk': ['sprog', 'læsning'],
  'engelsk': ['sprog', 'engelsk'],

  // Coding
  'kodning': ['kodning', 'programmering'],
  'programmering': ['kodning', 'programmering'],
  'kode': ['kodning'],
  'coding': ['kodning', 'programmering'],

  // Motor skills
  'finmotorik': ['finmotorik'],
  'motorik': ['finmotorik', 'motorik'],
  'koordination': ['koordination'],

  // Memory
  'hukommelse': ['hukommelse'],
  'memory': ['hukommelse'],
  'husk': ['hukommelse'],

  // Problem solving
  'problemløsning': ['problemløsning', 'logik'],
  'logisk': ['logik', 'problemløsning'],

  // Social skills
  'sociale': ['sociale færdigheder'],
  'samarbejde': ['samarbejde'],
  'kommunikation': ['kommunikation'],

  // Creativity skills
  'fantasi': ['fantasi', 'kreativitet'],
  'kreativitet': ['kreativitet'],
};

// Theme mappings
const themeMappings: Record<string, string[]> = {
  'dyr': ['dyr', 'natur'],
  'natur': ['natur', 'dyr'],
  'dinosaur': ['dinosaurer'],
  'dinosaurer': ['dinosaurer'],
  'prinsesse': ['prinsesser', 'eventyr'],
  'prinsesser': ['prinsesser'],
  'superhelte': ['superhelte'],
  'superhelt': ['superhelte'],
  'rummet': ['rummet', 'space'],
  'space': ['rummet', 'space'],
  'biler': ['biler', 'køretøjer'],
  'køretøjer': ['køretøjer', 'biler'],
  'tog': ['køretøjer', 'tog'],
  'fly': ['køretøjer'],
  'pirater': ['pirater', 'eventyr'],
  'pirat': ['pirater'],
  'farm': ['farm', 'dyr'],
  'bondegård': ['farm', 'dyr'],
  'have': ['natur', 'have'],
  'monster': ['monstre'],
  'monstre': ['monstre'],
  'robot': ['robotter', 'teknologi'],
  'robotter': ['robotter'],
  'fantasy': ['fantasy', 'eventyr'],
  'magi': ['magi', 'fantasy'],
  'sport': ['sport'],
  'fodbold': ['sport', 'fodbold'],
};

// Negative filter patterns (for ads, purchases, etc.)
const negativeFilters: Array<{
  patterns: RegExp[];
  filter: keyof Pick<ParsedSearchQuery, 'hasAds' | 'hasInAppPurchases' | 'isOfflineCapable' | 'priceModel'>;
  value: boolean | string;
}> = [
  // No ads
  {
    patterns: [
      /uden\s*reklamer?/i,
      /ingen\s*reklamer?/i,
      /reklamefri/i,
      /ad[\s-]?free/i,
      /no\s*ads?/i,
    ],
    filter: 'hasAds',
    value: false,
  },
  // No in-app purchases
  {
    patterns: [
      /uden\s*(?:in[\s-]?app[\s-]?)?køb/i,
      /ingen\s*(?:in[\s-]?app[\s-]?)?køb/i,
      /uden\s*mikrotransaktioner/i,
      /ingen\s*mikrotransaktioner/i,
      /gratis\s*uden\s*køb/i,
    ],
    filter: 'hasInAppPurchases',
    value: false,
  },
  // Works offline
  {
    patterns: [
      /offline/i,
      /uden\s*internet/i,
      /uden\s*wifi/i,
      /virker\s*offline/i,
    ],
    filter: 'isOfflineCapable',
    value: true,
  },
  // Free games
  {
    patterns: [
      /^gratis$/i,
      /helt\s*gratis/i,
      /free/i,
    ],
    filter: 'priceModel',
    value: 'free',
  },
];

// Determine age group from age
function getAgeGroup(age: number): string {
  if (age <= 3) return '0-3';
  if (age <= 6) return '3-6';
  return '7+';
}

// Determine age group from age range
function getAgeGroupFromRange(minAge: number, maxAge: number): string | null {
  // If range spans multiple groups, return the primary one based on minAge
  const midAge = Math.floor((minAge + maxAge) / 2);
  return getAgeGroup(midAge);
}

/**
 * Parse a search query and extract structured filters
 *
 * Examples:
 * - "læring 5år pige uden reklamer" → { ageGroup: "3-6", targetGender: "piger", categories: ["læring"], hasAds: false }
 * - "matematik spil til 7-årig dreng" → { minAge: 7, maxAge: 7, ageGroup: "7+", targetGender: "drenge", skills: ["matematik"] }
 * - "gratis puslespil offline" → { priceModel: "free", categories: ["puslespil", "logik"], isOfflineCapable: true }
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const result: ParsedSearchQuery = {
    minAge: null,
    maxAge: null,
    ageGroup: null,
    targetGender: null,
    categories: [],
    skills: [],
    themes: [],
    hasAds: null,
    hasInAppPurchases: null,
    isOfflineCapable: null,
    priceModel: null,
    searchTerms: [],
    originalQuery: query,
  };

  if (!query || query.trim() === '') {
    return result;
  }

  let remainingQuery = query.toLowerCase().trim();

  // 1. Extract negative filters first (they often contain multiple words)
  for (const filter of negativeFilters) {
    for (const pattern of filter.patterns) {
      if (pattern.test(remainingQuery)) {
        if (filter.filter === 'priceModel') {
          result.priceModel = filter.value as 'free' | 'paid' | 'freemium';
        } else {
          (result[filter.filter] as boolean | null) = filter.value as boolean;
        }
        remainingQuery = remainingQuery.replace(pattern, ' ').trim();
        break;
      }
    }
  }

  // 2. Extract age ranges (e.g., "3-6 år")
  for (const pattern of ageRangePatterns) {
    const match = remainingQuery.match(pattern);
    if (match) {
      result.minAge = parseInt(match[1]);
      result.maxAge = parseInt(match[2]);
      result.ageGroup = getAgeGroupFromRange(result.minAge, result.maxAge);
      remainingQuery = remainingQuery.replace(pattern, ' ').trim();
      break;
    }
  }

  // 3. Extract single age if no range was found
  if (result.minAge === null) {
    for (const pattern of agePatterns) {
      const match = remainingQuery.match(pattern);
      if (match) {
        let age: number;
        if (numberWords[match[1].toLowerCase()]) {
          age = numberWords[match[1].toLowerCase()];
        } else {
          age = parseInt(match[1]);
        }
        result.minAge = age;
        result.maxAge = age;
        result.ageGroup = getAgeGroup(age);
        remainingQuery = remainingQuery.replace(pattern, ' ').trim();
        break;
      }
    }
  }

  // 4. Process remaining words
  const words = remainingQuery.split(/\s+/).filter(w => w.length > 0);

  for (const word of words) {
    // Skip common filler words
    if (['til', 'for', 'med', 'og', 'i', 'på', 'spil', 'app', 'apps'].includes(word)) {
      continue;
    }

    let matched = false;

    // Check gender keywords
    if (genderKeywords[word]) {
      result.targetGender = genderKeywords[word];
      matched = true;
    }

    // Check category mappings
    if (categoryMappings[word]) {
      result.categories.push(...categoryMappings[word]);
      matched = true;
    }

    // Check skill mappings
    if (skillMappings[word]) {
      result.skills.push(...skillMappings[word]);
      matched = true;
    }

    // Check theme mappings
    if (themeMappings[word]) {
      result.themes.push(...themeMappings[word]);
      matched = true;
    }

    // If word wasn't matched to any filter, keep it as a search term
    if (!matched) {
      result.searchTerms.push(word);
    }
  }

  // Remove duplicates
  result.categories = Array.from(new Set(result.categories));
  result.skills = Array.from(new Set(result.skills));
  result.themes = Array.from(new Set(result.themes));
  result.searchTerms = Array.from(new Set(result.searchTerms));

  return result;
}

/**
 * Build a Prisma where clause from parsed search query
 */
export function buildPrismaWhereClause(parsed: ParsedSearchQuery): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  const andConditions: unknown[] = [];

  // Age filtering
  if (parsed.minAge !== null && parsed.maxAge !== null) {
    andConditions.push({
      minAge: { lte: parsed.maxAge },
      maxAge: { gte: parsed.minAge },
    });
  } else if (parsed.ageGroup) {
    where.ageGroup = parsed.ageGroup;
  }

  // Boolean filters
  if (parsed.hasAds !== null) {
    where.hasAds = parsed.hasAds;
  }
  if (parsed.hasInAppPurchases !== null) {
    where.hasInAppPurchases = parsed.hasInAppPurchases;
  }
  if (parsed.isOfflineCapable !== null) {
    where.isOfflineCapable = parsed.isOfflineCapable;
  }

  // Price model
  if (parsed.priceModel) {
    where.priceModel = parsed.priceModel;
  }

  // Categories (JSON string contains)
  if (parsed.categories.length > 0) {
    andConditions.push({
      OR: parsed.categories.map(cat => ({ categories: { contains: cat } })),
    });
  }

  // Skills
  if (parsed.skills.length > 0) {
    andConditions.push({
      OR: parsed.skills.map(skill => ({ skills: { contains: skill } })),
    });
  }

  // Themes
  if (parsed.themes.length > 0) {
    andConditions.push({
      OR: parsed.themes.map(theme => ({ themes: { contains: theme } })),
    });
  }

  // Gender-based theme filtering
  if (parsed.targetGender === 'piger') {
    // Boost princess, fashion, etc. themes
    const girlThemes = ['prinsesser', 'mode', 'dukker', 'eventyr', 'unicorn'];
    andConditions.push({
      OR: girlThemes.map(theme => ({ themes: { contains: theme } })),
    });
  } else if (parsed.targetGender === 'drenge') {
    // Boost cars, action, etc. themes
    const boyThemes = ['biler', 'action', 'superhelte', 'robotter', 'dinosaurer'];
    andConditions.push({
      OR: boyThemes.map(theme => ({ themes: { contains: theme } })),
    });
  }

  // Text search from remaining terms
  if (parsed.searchTerms.length > 0) {
    const searchConditions = parsed.searchTerms.flatMap(term => [
      { title: { contains: term, mode: 'insensitive' as const } },
      { shortDescription: { contains: term, mode: 'insensitive' as const } },
      { description: { contains: term, mode: 'insensitive' as const } },
    ]);
    andConditions.push({ OR: searchConditions });
  }

  // Combine AND conditions
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  return where;
}

/**
 * Build a Prisma where clause for board games (slightly different fields)
 */
export function buildBoardGameWhereClause(parsed: ParsedSearchQuery): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  const andConditions: unknown[] = [];

  // Age filtering
  if (parsed.minAge !== null && parsed.maxAge !== null) {
    andConditions.push({
      minAge: { lte: parsed.maxAge },
      maxAge: { gte: parsed.minAge },
    });
  } else if (parsed.ageGroup) {
    where.ageGroup = parsed.ageGroup;
  }

  // Categories
  if (parsed.categories.length > 0) {
    andConditions.push({
      OR: parsed.categories.map(cat => ({ categories: { contains: cat } })),
    });
  }

  // Skills
  if (parsed.skills.length > 0) {
    andConditions.push({
      OR: parsed.skills.map(skill => ({ skills: { contains: skill } })),
    });
  }

  // Themes
  if (parsed.themes.length > 0) {
    andConditions.push({
      OR: parsed.themes.map(theme => ({ themes: { contains: theme } })),
    });
  }

  // Gender-based theme filtering for board games
  if (parsed.targetGender === 'piger') {
    const girlThemes = ['prinsesser', 'eventyr', 'unicorn', 'dyr'];
    andConditions.push({
      OR: girlThemes.map(theme => ({ themes: { contains: theme } })),
    });
  } else if (parsed.targetGender === 'drenge') {
    const boyThemes = ['pirater', 'robotter', 'dinosaurer', 'rummet'];
    andConditions.push({
      OR: boyThemes.map(theme => ({ themes: { contains: theme } })),
    });
  }

  // Text search
  if (parsed.searchTerms.length > 0) {
    const searchConditions = parsed.searchTerms.flatMap(term => [
      { title: { contains: term, mode: 'insensitive' as const } },
      { shortDescription: { contains: term, mode: 'insensitive' as const } },
      { description: { contains: term, mode: 'insensitive' as const } },
    ]);
    andConditions.push({ OR: searchConditions });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  return where;
}
