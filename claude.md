# Børnespilguiden - Project Context

## Overview
**Børnespilguiden** (Children's Game Guide) is a Danish website helping parents discover safe, educational, and fun games for their children. It features both digital games (apps, console games) and board games with honest reviews focused on safety, learning, and fun.

**Live Site:** https://boernespilguiden.dk
**Languages:** Danish (primary), English, French, Spanish
**Target Audience:** Danish parents with children aged 0-10+ years

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.35 | Framework (App Router) |
| React | 18 | UI Library |
| TypeScript | 5 | Type Safety |
| PostgreSQL | - | Database (Vercel hosted) |
| Prisma | 5.22.0 | ORM |
| TailwindCSS | 3.4.1 | Styling |
| next-intl | 4.7.0 | Internationalization |
| clsx + tailwind-merge | - | Class utilities |

---

## Project Structure

```
/app
  /api                          # REST API endpoints
    /games/route.ts             # GET games with filters
    /games/[slug]/route.ts      # GET single game
    /games/featured/route.ts    # GET featured games
    /boardgames/route.ts        # GET board games with filters
    /boardgames/[slug]/route.ts # GET single board game
    /search/route.ts            # Combined search endpoint
    /analytics/route.ts         # Event tracking
    /set-locale/route.ts        # Language switching
  /(site)                       # Public pages (with layout)
    /page.tsx                   # Homepage
    /spil/                      # Digital games section
      /page.tsx                 # Games listing
      /[slug]/page.tsx          # Game detail
      /kategori/[age]/          # Age-filtered games
    /braetspil/                 # Board games section
      /page.tsx                 # Board games listing
      /[slug]/page.tsx          # Board game detail
      /kategori/[age]/          # Age-filtered board games
    /soeg/                      # Search page
      /page.tsx                 # Search results
      /components.tsx           # Search components
    /om/                        # About page
    /kontakt/                   # Contact page
    /privatlivspolitik/         # Privacy policy
    /cookiepolitik/             # Cookie policy
  /layout.tsx                   # Root layout
  /error.tsx                    # Error boundary
  /not-found.tsx                # 404 page
  /global-error.tsx             # Global error handler
  /robots.ts                    # Robots.txt generation
  /sitemap.ts                   # Sitemap generation

/components
  /layout/
    Header.tsx                  # Site header with navigation
    Footer.tsx                  # Site footer
    Navigation.tsx              # Main navigation
    CookieConsent.tsx           # GDPR cookie banner
    LanguageSwitcher.tsx        # Language selector
    DecorativeFrame.tsx         # Decorative page elements
  /games/
    GameCard.tsx                # Game card for listings
    GameGrid.tsx                # Grid layout for games
    GameDetail.tsx              # Full game page
    GameDetailImage.tsx         # Game image with fallback
    FeaturedGame.tsx            # Featured game display
    LazyGameGrid.tsx            # Infinite scroll grid
    ParentInfo.tsx              # Parent information box
  /filters/
    SearchBar.tsx               # Smart search with suggestions
    AgeFilter.tsx               # Age group filter
    CategoryFilter.tsx          # Category filter
    GenderFilter.tsx            # Target gender filter
    ParentFilters.tsx           # Safety filters (ads, IAP, offline)
  /ui/
    Badge.tsx                   # Status badges
    Button.tsx                  # Button component
    Card.tsx                    # Card wrapper
    Rating.tsx                  # Star rating display
    AgeIndicator.tsx            # Age badge with color
    Input.tsx                   # Form input
  /tracking/
    TrackedLink.tsx             # Analytics-tracked links

/lib
  db.ts                         # Prisma client singleton
  types.ts                      # TypeScript types
  search.ts                     # Danish NLP search parser
  utils.ts                      # Utility functions
  translations.ts               # Translation helpers
  analytics.ts                  # Analytics tracking
  cache.ts                      # Caching utilities
  seo.tsx                       # SEO components

/prisma
  schema.prisma                 # Database schema (PostgreSQL)
  seed.ts                       # Main seeding script
  seed-production.ts            # Production seed
  seed-translations.ts          # Translation seeding
  *.ts                          # Migration/update scripts

/data
  games-seed.ts                 # Digital games data
  boardgames-seed.ts            # Board games data

/messages
  da.json                       # Danish translations
  en.json                       # English translations
  fr.json                       # French translations
  es.json                       # Spanish translations

/public/images/games
  /board/                       # Board game images (.webp/.jpg)
  /digital/                     # Digital game images (.webp/.jpg)

/i18n
  request.ts                    # next-intl configuration
```

---

## Database Schema (Prisma/PostgreSQL)

### Game (Digital Games)
```prisma
model Game {
  id                String   @id @default(cuid())
  title             String
  slug              String   @unique
  description       String   // Deep review (600-900 chars)
  shortDescription  String   // Card text (max 150 chars)

  // Age
  minAge            Int
  maxAge            Int
  ageGroup          String   // "0-3", "3-6", "7+"

  // Categories (JSON strings)
  categories        String   @default("[]")
  skills            String   @default("[]")
  themes            String   @default("[]")
  targetGender      String   @default("alle") // "alle", "drenge", "piger"

  // Platform
  platforms         String   @default("[]")
  appStoreUrl       String?
  playStoreUrl      String?
  websiteUrl        String?

  // Parent Safety Info
  hasAds            Boolean  @default(false)
  hasInAppPurchases Boolean  @default(false)
  isOfflineCapable  Boolean  @default(false)
  requiresInternet  Boolean  @default(false)
  dataCollection    String?  // "ingen", "minimal", "moderat", "omfattende"
  parentInfo        String?  // Extended parent info (100-150 words)
  hasSocialFeatures Boolean  @default(false)
  hasChat           Boolean  @default(false)
  hasNotifications  Boolean  @default(false)
  hasManipulativeDesign Boolean @default(false)
  hasScaryContent   Boolean  @default(false)
  isCoppaCompliant  Boolean  @default(true)
  requiresReading   Boolean  @default(false)
  typicalSessionMinutes Int?

  // Pricing
  price             Float    @default(0)
  priceModel        String   // "gratis", "engangskøb", "abonnement", "freemium"

  // Review
  rating            Float    // 1-5
  pros              String   @default("[]")
  cons              String   @default("[]")
  parentTip         String?  // Tip for parents

  // Media
  iconUrl           String?
  screenshots       String   @default("[]")
  videoUrl          String?
  developerName     String?

  // Affiliate
  affiliateUrl      String?
  affiliateProvider String?

  // Meta
  featured          Boolean  @default(false)
  editorChoice      Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  translations      GameTranslation[]
}
```

### BoardGame
```prisma
model BoardGame {
  id               String   @id @default(cuid())
  title            String
  slug             String   @unique
  description      String
  shortDescription String

  // Age
  minAge           Int
  maxAge           Int
  ageGroup         String

  // Game Info
  minPlayers       Int
  maxPlayers       Int
  playTimeMinutes  Int
  complexity       Int      // 1-5 (1=very easy, 5=complex)

  // Categories
  categories       String   @default("[]")
  skills           String   @default("[]")
  themes           String   @default("[]")
  targetGender     String   @default("alle")

  // Pricing & Purchase
  price            Float?
  affiliateUrl     String?
  amazonUrl        String?

  // Review
  rating           Float
  pros             String   @default("[]")
  cons             String   @default("[]")
  parentTip        String?

  // Media
  imageUrl         String?

  // Meta
  featured         Boolean  @default(false)
  editorChoice     Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  translations     BoardGameTranslation[]
}
```

### Translations
```prisma
model GameTranslation {
  id               String @id @default(cuid())
  gameId           String
  locale           String // "da", "en", "fr", "es"
  title            String
  description      String
  shortDescription String
  pros             String @default("[]")
  cons             String @default("[]")
  parentTip        String?
  game             Game   @relation(...)

  @@unique([gameId, locale])
}
```

---

## Current Database Status (2026-01-07)

| Category | Count |
|----------|-------|
| **Digital Games** | 97 |
| **Board Games** | 59 |
| **Total** | 156 |

### Digital Games by Age Group
- 0-3 år: 16 games
- 3-6 år: 31 games
- 7+ år: 30 games
- Apple Arcade: 20 games (cross-age)

### Board Games by Age Group
- 0-3 år: 12 games
- 3-6 år: 15 games
- 7+ år: 32 games

### Digital Games by Price Model
- Gratis: ~40 games
- Engangskøb: ~20 games
- Abonnement (Apple Arcade): 20 games
- Freemium: ~17 games

---

## Age Groups

The site uses 3 age categories:

| Age Group | Label | Target | Color | Emoji |
|-----------|-------|--------|-------|-------|
| `0-3` | 0-3 år | Baby/småbørn | #FFD1DC (pink) | 👶 |
| `3-6` | 3-6 år | Førskolebørn | #BAFFC9 (green) | 🧒 |
| `7+` | 7+ år | Skolebørn | #BAE1FF (blue) | 🎒 |

**Note:** `maxAge: 99` represents open-ended age ranges (e.g., "7+" means 7 to any age).

---

## TypeScript Types

```typescript
type AgeGroup = '0-3' | '3-6' | '7+';

type GameCategory =
  | 'læring' | 'eventyr' | 'puslespil'
  | 'kreativ' | 'action' | 'musik' | 'sport';

type BoardGameCategory =
  | 'strategi' | 'samarbejde' | 'læring'
  | 'fest' | 'kort' | 'familie' | 'hukommelse';

type Skill =
  | 'matematik' | 'læsning' | 'logik' | 'motorik'
  | 'sprog' | 'kreativitet' | 'samarbejde' | 'koncentration';

type Theme =
  | 'dyr' | 'rummet' | 'prinsesser' | 'dinosaurer'
  | 'eventyr' | 'natur' | 'biler' | 'superhelte';

type Platform = 'iOS' | 'Android' | 'PC' | 'Nintendo' | 'PlayStation' | 'Xbox' | 'Web';

type PriceModel = 'gratis' | 'engangskøb' | 'abonnement' | 'freemium';

type TargetGender = 'alle' | 'drenge' | 'piger';
```

---

## Design System

### Color Palette

**Primary Colors:**
```
coral:      #FFB5A7 (buttons, accents)
mint:       #B8E0D2 (success, nature)
sky:        #A2D2FF (links, info)
sunflower:  #FFE66D (highlights, stars)
lavender:   #CDB4DB (special features)
```

**Background Colors:**
```
paper:      #FFFCF7 (main background)
cream:      #FFF9F0 (cards)
peach:      #FFF0E8 (highlights)
mist:       #F5F9FC (subtle sections)
```

**Text Colors:**
```
primary:    #4A4A4A (main text)
secondary:  #7A7A7A (muted text)
muted:      #9CA3AF (placeholders)
```

**Age Group Colors:**
```
baby (0-3): #FFD1DC (pink)
child (3-6): #BAFFC9 (green)
tween (7+): #BAE1FF (blue)
```

### Custom Shadows
- `shadow-soft` - Subtle card shadow
- `shadow-card` / `shadow-card-hover` - Card hover effects
- `shadow-button` - 3D button effect
- `shadow-coral/mint/sky` - Colored shadows

### Animations
- `animate-float` - Gentle floating
- `animate-pop` - Bounce entrance
- `animate-wiggle` - Playful wiggle
- `animate-slide-up` - Slide in from bottom

---

## API Endpoints

### GET /api/games
Query parameters:
- `ageGroup` - "0-3", "3-6", "7+"
- `minAge`, `maxAge` - Age range
- `categories`, `skills`, `themes` - Comma-separated
- `hasAds`, `hasInAppPurchases`, `isOfflineCapable` - Boolean
- `priceModel` - "gratis", "engangskøb", "abonnement", "freemium"
- `search` - Text search
- `sort` - "rating", "title", "minAge", "price", "createdAt"
- `order` - "asc", "desc"
- `limit`, `offset` - Pagination
- `featured`, `editorChoice` - Boolean

### GET /api/boardgames
Similar to games, plus:
- `minPlayers`, `maxPlayers` - Player count
- `playTime` - Maximum play time
- `complexity` - 1-5

### GET /api/search
Combined search across games and board games:
- `q` - Search query
- `type` - "all", "digital", "board"

---

## Search System

The search system (`/lib/search.ts`) includes Danish natural language processing:

### Supported Query Patterns
- Age: "5 år", "til 7-årige", "fem år gammel"
- Price: "gratis", "ingen betaling", "abonnement"
- Safety: "ingen reklamer", "uden køb", "offline"
- Gender: "til piger", "drengespil"
- Categories: "læringsspil", "puslespil", "actionspil"

### Examples
```
"læring 5år pige uden reklamer"
→ { ageGroup: "3-6", targetGender: "piger", categories: ["læring"], hasAds: false }

"gratis matematik spil offline"
→ { priceModel: "gratis", skills: ["matematik"], isOfflineCapable: true }
```

---

## Review Guidelines

### Description (600-900 characters)
1. **Opening** - What is this game?
2. **Features** - Key gameplay mechanics
3. **Educational value** - Learning outcomes
4. **Quality** - Graphics, sound, UX
5. **Closing** - Who is this for?

### Parent Info (100-150 words)
- Price model and costs
- Ads/in-app purchase status
- Internet requirements
- Safety concerns
- Developer credibility

### Parent Tip (1-2 sentences)
Practical, actionable advice for parents.

### Writing Style
- Natural Danish language (avoid AI-sounding phrases)
- Honest and balanced
- Focus on parent concerns
- Avoid: "fantastisk", "perfekt til", excessive superlatives

### Rating Scale (1-5)
- **5.0:** Exceptionel - Best in class
- **4.5:** Fremragende - Excellent with minor nitpicks
- **4.0:** Meget god - Strong recommendation
- **3.5:** God - Solid choice
- **3.0:** Okay - Decent but room for improvement
- **2.5:** Middelmådig - Mixed bag
- **2.0:** Under middel - Notable problems
- **1.5-1.0:** Anbefales ikke - Avoid

---

## Danish Content Priority

### DR Apps (Danmarks Radio)
All free, ad-free, and safe:
- DR Ramasjang (LEG, LÆR, KREA)
- DR Minisjang (0-3 years)
- DR Naturspillet, DR Øen
- DR Karla, DR Motor Mille

### Danish Cultural Apps
- Rasmus Klump
- Cirkeline
- Gummi T
- ALPA Kids Dansk
- Poikilingo

### Danish Attractions
- Tivoli Gardens
- LEGOLAND Billund
- Jesperhus

### Apple Arcade Games (Subscription)
Premium, ad-free games with Apple Arcade subscription (79 kr/month):
- Sneaky Sasquatch - Open-world adventure
- Wylde Flowers - Farm simulator with magic
- Hello Kitty Island Adventure - Sanrio exploration
- Tangle Tower - Mystery puzzle
- Cut the Rope 3 - Classic puzzle
- Alto's Odyssey: The Lost City - Endless runner
- LEGO Brawls - Multiplayer action
- Sonic Racing - Racing game
- Cooking Mama: Cuisine! - Cooking simulation
- Taiko no Tatsujin Pop Tap Beat - Rhythm game
- And more (20 games total)

**Apple Arcade characteristics:**
- `priceModel: "abonnement"`
- `hasAds: false`
- `hasInAppPurchases: false`
- `platforms: ["iOS", "Mac", "Apple TV"]`

---

## Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build (prisma generate + db push + next build)
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema changes
npx prisma generate      # Regenerate client
npm run db:seed          # Run seed script

# Seeding with production DB
DATABASE_URL="postgres://..." npx tsx prisma/seed.ts
```

---

## Environment Variables

```env
# Database (Vercel Postgres)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Site
NEXT_PUBLIC_SITE_URL="https://boernespilguiden.dk"

# Analytics (optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="boernespilguiden.dk"
```

---

## Seed File Structure

The game data is stored in `/data/` directory and organized into arrays:

### Digital Games (`/data/games-seed.ts`)
```typescript
// Games organized by age group
export const games0to3: GameSeedData[] = [...];    // 0-3 år
export const games3to6: GameSeedData[] = [...];    // 3-6 år
export const games7to10: GameSeedData[] = [...];   // 7-10 år
export const games11to15: GameSeedData[] = [...];  // 11-15 år

// Apple Arcade games (subscription-based, ad-free)
export const appleArcadeGames: GameSeedData[] = [...];

// Combined export for seeding
export const allDigitalGames: GameSeedData[] = [
  ...games0to3,
  ...games3to6,
  ...games7to10,
  ...games11to15,
  ...appleArcadeGames,
];

// Statistics
export const gameStats = {
  total: allDigitalGames.length,
  byAge: {
    '0-3': games0to3.length,
    '3-6': games3to6.length,
    '7-10': games7to10.length,
    '11-15': games11to15.length,
  },
  appleArcade: appleArcadeGames.length,
};
```

### Board Games (`/data/boardgames-seed.ts`)
```typescript
export const boardGames0to3: BoardGameSeedData[] = [...];
export const boardGames3to6: BoardGameSeedData[] = [...];
export const boardGames7plus: BoardGameSeedData[] = [...];

export const allBoardGames: BoardGameSeedData[] = [
  ...boardGames0to3,
  ...boardGames3to6,
  ...boardGames7plus,
];
```

### Adding New Games

**IMPORTANT:** Always add new games to the appropriate array in the seed files. This ensures games persist when reseeding the database.

#### 1. Add to Seed File (Recommended)
Add the game to the appropriate array in `/data/games-seed.ts`:

```typescript
// For Apple Arcade games, add to appleArcadeGames array:
export const appleArcadeGames: GameSeedData[] = [
  // ... existing games
  {
    title: 'New Game Title',
    slug: 'new-game-slug',
    shortDescription: 'Short description (max 150 chars)',
    description: 'Deep review (600-900 chars)...',
    ageGroup: '3-6',
    minAge: 4,
    maxAge: 10,
    categories: ['eventyr', 'puslespil'],
    skills: ['logik', 'problemløsning'],
    themes: ['eventyr'],
    platforms: ['iOS', 'Mac'],
    price: 0,
    priceModel: 'abonnement',  // Apple Arcade
    rating: 4.5,
    developerName: 'Developer Name',
    parentInfo: 'Kræver Apple Arcade abonnement (79 kr/måned)...',
    parentTip: 'Practical tip for parents...',
    hasAds: false,
    hasInAppPurchases: false,
    isOfflineCapable: true,
    pros: ['Pro 1', 'Pro 2', 'Pro 3'],
    cons: ['Con 1'],
  },
];
```

Then reseed the database:
```bash
DATABASE_URL="your-connection-string" npx tsx prisma/seed.ts
```

#### 2. Direct Database Insert (For Quick Additions)
```typescript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addGame() {
  await prisma.game.create({
    data: {
      slug: 'game-slug',
      title: 'Game Title',
      shortDescription: 'Short description (max 150 chars)',
      description: 'Deep review (600-900 chars)...',
      ageGroup: '3-6',
      minAge: 3,
      maxAge: 6,
      categories: JSON.stringify(['læring', 'eventyr']),
      skills: JSON.stringify(['motorik', 'logik']),
      themes: JSON.stringify(['dyr', 'natur']),
      platforms: JSON.stringify(['iOS', 'Android']),
      price: 0,
      priceModel: 'gratis',
      rating: 4.0,
      developerName: 'Developer Name',
      parentInfo: 'Parent safety info (100-150 words)...',
      parentTip: 'Practical tip for parents...',
      hasAds: false,
      hasInAppPurchases: false,
      isOfflineCapable: true,
      pros: JSON.stringify(['Pro 1', 'Pro 2']),
      cons: JSON.stringify(['Con 1']),
    },
  });
  await prisma.$disconnect();
}

addGame();
```

Run with:
```bash
DATABASE_URL="your-connection-string" npx tsx prisma/add-game.ts
```

**Note:** Direct database inserts will be lost when reseeding. Always add games to seed files for persistence.

---

## Key Features

1. **Intelligent Danish Search** - Natural language parsing ("5 år", "ingen reklamer")
2. **Parent-Focused Filters** - Ads, IAP, offline, pricing
3. **4-Language Support** - DA, EN, FR, ES with fallback
4. **Deep Reviews** - Every game has comprehensive review
5. **Safety First** - Clear parent information
6. **Danish Focus** - Prioritizes Danish/Nordic content
7. **SEO Optimized** - Dynamic sitemap, meta tags
8. **Analytics** - Event tracking, popular searches
9. **GDPR Compliant** - Cookie consent, privacy policy

---

## Development Notes

- Database uses PostgreSQL on Vercel
- Search parser handles Danish number words ("fem", "syv")
- All games should have description > 500 characters
- Always include parentInfo and parentTip
- Images stored in `/public/images/games/` (.webp preferred)
- Run `npx prisma generate` after schema changes
- Build script auto-runs `prisma generate && prisma db push`
