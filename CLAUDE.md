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
  /api/                    # REST API: games, boardgames, search, analytics, set-locale
  /(site)/                 # Public pages with layout
    /spil/                 # Digital games: listing, [slug] detail, kategori/[age]
    /braetspil/            # Board games: listing, [slug] detail, kategori/[age]
    /soeg/                 # Search page
    /om/, /kontakt/, /privatlivspolitik/, /cookiepolitik/
  /layout.tsx, /error.tsx, /not-found.tsx, /sitemap.ts

/components
  /layout/    Header, Footer, Navigation, CookieConsent, LanguageSwitcher, DecorativeFrame
  /games/     GameCard, GameGrid, GameDetail, GameDetailImage, FeaturedGame, LazyGameGrid, ParentInfo
  /filters/   SearchBar, AgeFilter, CategoryFilter, GenderFilter, ParentFilters
  /ui/        Badge, Button, Card, Rating, AgeIndicator, Input
  /affiliate/ AffiliateLink, AffiliateLinksGroup, buildAffiliateLinks
  /tracking/  TrackedLink

/lib           db.ts, types.ts, search.ts, utils.ts, translations.ts, analytics.ts, cache.ts, seo.tsx
/prisma        schema.prisma, seed.ts
/data          games-seed.ts, boardgames-seed.ts
/messages      da.json, en.json, fr.json, es.json
/public/images/games/  board/ (.webp/.jpg), digital/ (.webp/.jpg)
```

---

## Database Schema

Full schema is in `prisma/schema.prisma`. Key models: `Game`, `BoardGame`, `GameTranslation`, `BoardGameTranslation`, `Media`, `StreamingInfo`.

**Important field notes:**
- `Game.iconUrl` is NOT `imageUrl` -- uses filesystem fallback to `/images/games/digital/{slug}.jpg`
- `Game.platforms`, `pros`, `cons`, `categories`, `skills`, `themes` are JSON strings (`"[]"`), not native arrays
- `BoardGame.imageUrl` uses filesystem fallback to `/images/games/board/{slug}.jpg`
- `Game.screenshots` is a JSON string array of screenshot URLs
- See `PROJECT-DOCUMENTATION.md` for full schema details and ER diagram

---

## Current Database Status (2026-02-05)

| Category | Count |
|----------|-------|
| **Digital Games** | 123 |
| **Board Games** | 72 |
| **Total** | 195 |

### Digital Games by Age Group
- 0-3 ar: 19 games
- 3-6 ar: 38 games
- 7-10 ar: 27 games
- 11-15 ar: 19 games
- Apple Arcade: 20 games (cross-age, included in counts above)

### Board Games by Age Group
- 0-3 ar: 14 games
- 3-6 ar: 16 games
- 7-10 ar: 22 games
- 11-15 ar: 20 games

### Digital Games by Price Model
- Gratis: 33 games
- Engangskob: 34 games
- Abonnement: 28 games
- Freemium: 28 games

---

## Age Groups

The site uses 3 primary age categories (with 11-15 as extended):

| Age Group | Label | Target | Color | Emoji |
|-----------|-------|--------|-------|-------|
| `0-3` | 0-3 ar | Baby/smaborns | #FFD1DC (pink) | baby |
| `3-6` | 3-6 ar | Forskolebarn | #BAFFC9 (green) | child |
| `7+` | 7+ ar | Skolebarn | #BAE1FF (blue) | backpack |

**Note:** `maxAge: 99` represents open-ended age ranges (e.g., "7+" means 7 to any age).

---

## TypeScript Types

```typescript
type AgeGroup = '0-3' | '3-6' | '7+';

type GameCategory =
  | 'laering' | 'eventyr' | 'puslespil'
  | 'kreativ' | 'action' | 'musik' | 'sport';

type BoardGameCategory =
  | 'strategi' | 'samarbejde' | 'laering'
  | 'fest' | 'kort' | 'familie' | 'hukommelse';

type Skill =
  | 'matematik' | 'laesning' | 'logik' | 'motorik'
  | 'sprog' | 'kreativitet' | 'samarbejde' | 'koncentration';

type Theme =
  | 'dyr' | 'rummet' | 'prinsesser' | 'dinosaurer'
  | 'eventyr' | 'natur' | 'biler' | 'superhelte';

type Platform = 'iOS' | 'Android' | 'PC' | 'Nintendo' | 'PlayStation' | 'Xbox' | 'Web';

type PriceModel = 'gratis' | 'engangskob' | 'abonnement' | 'freemium';

type TargetGender = 'alle' | 'drenge' | 'piger';
```

---

## Design System

### Color Palette

```
Primary:    coral #FFB5A7, mint #B8E0D2, sky #A2D2FF, sunflower #FFE66D, lavender #CDB4DB
Background: paper #FFFCF7, cream #FFF9F0, peach #FFF0E8, mist #F5F9FC
Text:       primary #4A4A4A, secondary #7A7A7A, muted #9CA3AF
Age:        baby(0-3) #FFD1DC, child(3-6) #BAFFC9, tween(7+) #BAE1FF
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

## API Endpoints (Summary)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/games` | List games with filters (ageGroup, categories, skills, priceModel, search, sort, limit, offset, etc.) |
| `GET /api/games/[slug]` | Get single game |
| `GET /api/games/featured` | Get featured games |
| `GET /api/boardgames` | List board games with filters (similar to games, plus minPlayers, maxPlayers, playTime, complexity) |
| `GET /api/boardgames/[slug]` | Get single board game |
| `GET /api/search` | Combined search: `q`, `type` (all/digital/board) |
| `POST /api/analytics` | Event tracking |
| `POST /api/set-locale` | Language switching |

See `PROJECT-DOCUMENTATION.md` for full parameter documentation and admin endpoints.

---

## Search System

The search system (`/lib/search.ts`) includes Danish natural language processing:

### Supported Query Patterns
- Age: "5 ar", "til 7-arige", "fem ar gammel"
- Price: "gratis", "ingen betaling", "abonnement"
- Safety: "ingen reklamer", "uden kob", "offline"
- Gender: "til piger", "drengespil"
- Categories: "laeringsspil", "puslespil", "actionspil"

### Examples
```
"laering 5ar pige uden reklamer"
-> { ageGroup: "3-6", targetGender: "piger", categories: ["laering"], hasAds: false }

"gratis matematik spil offline"
-> { priceModel: "gratis", skills: ["matematik"], isOfflineCapable: true }
```

### Search Page Features (`/soeg`)
- **Filters:** Age group, Danish language, ad-free, free, offline, no IAP, player count, play time
- **Sorting:** Relevans (default), Rating, Navn (A-A), Alder
- **URL params:** `/soeg?q=laering&tab=spil&alder=3-6&reklamefri=true&dansk=true&sort=rating`

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
- **2.5:** Middelmadig - Mixed bag
- **2.0:** Under middel - Notable problems
- **1.5-1.0:** Anbefales ikke - Avoid

---

## Adding New Games

**IMPORTANT:** Always add new games to the appropriate array in the seed files. Games added directly to the database will be lost on reseed.

### Seed File Structure
- `/data/games-seed.ts` -- arrays: `games0to3`, `games3to6`, `games7to10`, `games11to15`, `appleArcadeGames`, `allDigitalGames`
- `/data/boardgames-seed.ts` -- arrays: `boardGames0to3`, `boardGames3to6`, `boardGames7to10`, `boardGames11to15`, `allBoardGames`

### Add to Seed File
Add the game to the appropriate array in `/data/games-seed.ts`:

```typescript
{
  title: 'New Game Title',
  slug: 'new-game-slug',
  shortDescription: 'Short description (max 150 chars)',
  description: 'Deep review (600-900 chars)...',
  ageGroup: '3-6',
  minAge: 4,
  maxAge: 10,
  categories: ['eventyr', 'puslespil'],
  skills: ['logik', 'problemlosning'],
  themes: ['eventyr'],
  platforms: ['iOS', 'Android'],
  price: 0,
  priceModel: 'gratis',
  rating: 4.5,
  developerName: 'Developer Name',
  parentInfo: 'Parent safety info (100-150 words)...',
  parentTip: 'Practical tip for parents...',
  hasAds: false,
  hasInAppPurchases: false,
  isOfflineCapable: true,
  pros: ['Pro 1', 'Pro 2', 'Pro 3'],
  cons: ['Con 1'],
}
```

Then reseed:
```bash
DATABASE_URL="your-connection-string" npx tsx prisma/seed.ts
```

---

## Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build (prisma generate + db push + seed + next build)
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema changes
npx prisma generate      # Regenerate client
npm run db:seed          # Run seed script

# Seeding with production DB
DATABASE_URL="postgres://..." npx tsx prisma/seed.ts
```

**Note:** The build script automatically seeds the database on every deploy to Vercel, ensuring all game data stays in sync with seed files.

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

## Affiliate System

The affiliate system (`/components/affiliate/`) supports future monetization.

### Supported Providers
`apple`, `google`, `amazon`, `coolshop`, `proshop`, `saxo`, `website`, `other`

### Usage
```typescript
import { AffiliateLink, AffiliateLinksGroup, buildAffiliateLinks } from '@/components/affiliate';

// Single link
<AffiliateLink href="https://..." provider="apple" gameTitle="Game Name" gameSlug="game-slug" variant="button" />

// Group of links from game data
<AffiliateLinksGroup links={buildAffiliateLinks(game)} gameTitle={game.title} gameSlug={game.slug} />
```

Click tracking via Google Analytics: event `affiliate_click` with parameters `provider`, `game_slug`, `game_title`.

---

## Key Features

1. **Intelligent Danish Search** - Natural language parsing ("5 ar", "ingen reklamer")
2. **Parent-Focused Filters** - Ads, IAP, offline, pricing, Danish language support
3. **4-Language Support** - DA, EN, FR, ES with fallback
4. **Deep Reviews** - Every game has comprehensive review
5. **Safety First** - Clear parent information
6. **Danish Focus** - Prioritizes Danish/Nordic content
7. **SEO Optimized** - Dynamic sitemap, meta tags
8. **GDPR Compliant** - Cookie consent, privacy policy
9. **Affiliate Ready** - AffiliateLink component with click tracking
10. **100% Screenshot Coverage** - All games have screenshot galleries

---

## Development Notes

- Database uses PostgreSQL on Vercel
- Search parser handles Danish number words ("fem", "syv")
- All games should have description > 500 characters
- Always include parentInfo and parentTip
- Images stored in `/public/images/games/` (.webp preferred)
- Run `npx prisma generate` after schema changes
- Build script auto-runs `prisma generate && prisma db push && seed`
- Database is re-seeded on every deploy to keep data in sync
- See `PROJECT-DOCUMENTATION.md` for full documentation including component architecture, deployment guide, session history, and known issues
