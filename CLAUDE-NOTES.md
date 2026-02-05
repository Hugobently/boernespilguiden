# Claude Session Notes - Boernespilguiden

Working notes for Claude instances. Update at the end of each session with new learnings.

> **IMPORTANT RULE FOR CLAUDE:** Always save what you learn to this file so you don't forget!

## Session Log

### 2026-01-18: Site Review & Accessibility Fixes
- Added `aria-label` to clear buttons in SearchBar.tsx and Header.tsx
- Added skip-to-content link (Header.tsx) with translations in da/en/fr/es
- Added `id="main-content"` to main element in layout.tsx
- SEO, security, TypeScript all clean. Lighthouse Speed Index 51%. 21 console.logs remain in API routes.

### 2026-01-11 (Session 6): DR Show Images Fix
- 21 DR shows had broken dr-massive image URLs (API changed, needs `ImageId` param)
- Scraped og:image, downloaded posters locally to `/public/images/media/`
- Shows: Restaurant Million, Soeskende-chok, Kasper og Sofie, Oda Omvendt, Mini-agenterne, etc.

### 2026-01-11 (Session 5-6): Bug Fixes, Images & Documentation
**Critical bugs fixed:**
1. **Film-serier page crash** - `searchParams` must be awaited (Next.js 14+ Promise). Also moved `ageGroups` out of `'use client'` module into shared `lib/config/age-groups.ts`.
2. **Minecraft image missing** - Added `'webp'` to `IMAGE_FORMATS` in GameCard.tsx. Fallback order: jpg, webp, png, svg.

**Other work:**
- Downloaded 18 + 14 game images from iTunes Search API (all games now have images)
- Created centralized config: `lib/config/age-groups.ts`, `platforms.ts`, `theme.ts`
- Created PROJECT-DOCUMENTATION.md
- Improved streaming section on show detail pages (gradient, larger badges, "Gratis" indicator)
- Added Danish language filter (dansk sprog toggle) on /spil page
- Added contact email to /om page

### 2026-01-11 (Session 3-4): AI Enhancement & Danish Descriptions
- Ran AI enhancement on all games and media needing parentInfo
- Fixed model name: `claude-3-5-sonnet-20240620` -> `claude-sonnet-4-5-20250929`
- Added Danish descriptions for 24 DR/Ramasjang shows not found on TMDB
- Result: 124 digital games + 73 board games = 197 total games, 194 media -- all at 100% parentInfo

### 2026-01-11 (Session 1-2): Initial Fixes & DR Media
- Reverted nav to emojis (user preference), hidden Allente from streaming badges
- Added combinable age filters to Film & Serier page
- Fixed 27 DR shows via TMDB lookup; 24 remaining needed manual Danish descriptions
- Key discovery: images live in filesystem (`/public/images/games/digital/` etc.), not DB -- `iconUrl` is mostly null but fallback works
- Added 40 Apple TV+ KIDS items (after deleting 42 accidentally-added adult items)
- `.env` had SQLite URL -- must use PostgreSQL for production

## User Preferences (Important!)

1. **TARGET AUDIENCE: KIDS 0-10 YEARS OLD** - NO content for 11+ or adults
2. **Emojis over icons** - User prefers emoji nav icons (not Lucide)
3. **Don't push secrets to GitHub** - Push protection blocks API keys
4. **Always test with --dry-run first**
5. **Commit often** with co-author line
6. **Danish language** for all user-facing text

## Content Age Restrictions (CRITICAL!)

- **ONLY fetch content for ages 0-10**
- Movies: `certification.lte=7` (Danish rating system)
- TV: Filter by Kids (10762), Animation (16), Family (10751) genres
- **DELETE any content with ageMin >= 11**
- Wrong: Severance, Bad Sisters, Silo, Ted Lasso
- Correct: Nuser (Winnie the Pooh), Fragglerne, Peppa Pig

## Design Principles

### Mobile-First
- Base styles for mobile, scale up with `sm:`, `md:`, `lg:`
- FloatingBlobs/sparkle animations hidden on mobile
- Hamburger menu on mobile, full nav on desktop
- Touch targets minimum 44px

### Child-Friendly UI
- Playful palette: coral (#FFB5A7), mint (#77DD77), sky (#A2D2FF), lavender (#CDB4DB), sunflower (#FFE66D)
- Rounded corners (rounded-2xl, rounded-3xl), soft shadows, fun animations
- Large emojis for visual appeal

### Accessibility
- Skip-to-content link, aria-labels on icon-only buttons
- Focus-visible states on all interactive elements

## Common Issues & Solutions

### searchParams must be awaited (Next.js 14+)
```typescript
// WRONG
export default function Page({ searchParams }: { searchParams: SearchParams }) {
// CORRECT
export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
```

### Cannot import 'use client' module in server component
Create a shared config file without `'use client'` for values needed in both contexts.

### DATABASE_URL must start with postgresql://
`.env` may have SQLite URL (`file:./dev.db`) -- replace with PostgreSQL URL from `.env.production` or Vercel dashboard.

### Field name gotchas
- **Game**: `iconUrl` (NOT `imageUrl`). Filesystem fallback: `/images/games/digital/{slug}.jpg`
- **BoardGame**: `imageUrl`. Filesystem fallback: `/images/games/board/{slug}.jpg`
- **Media**: `posterUrl`. Requires `source` field: `"TMDB"` | `"DR_MANUAL"` | `"MANUAL"`
- **StreamingInfo**: `provider` (e.g. `"drtv"`, `"netflix"`, `"apple"`), `isFree` (boolean)

### Anthropic API 404 error for model
Update to `claude-sonnet-4-5-20250929` in `lib/services/ai-enhance.ts` and `ai-enhance-game.ts`.

### TMDB fetch returns 0 results
Not all providers have Denmark data. Works well: Apple TV+ (350), Netflix (8), Disney+ (337). May not work: Filmstriben (483), TV 2 Play (383).

## Database Configuration (Brief)

Credentials in `.env` (not in git). Required vars: `DATABASE_URL`, `PRISMA_DATABASE_URL`, `TMDB_API_KEY`, `ANTHROPIC_API_KEY`. Find them in Vercel dashboard or `.env.production`.

Prisma schema expects PostgreSQL. Never commit with SQLite URL.

## Scripts

Most legacy scripts have been cleaned up. See `scripts/README.md` for current available scripts and usage.

## Lessons Learned

### Always Check prisma/schema.prisma for Field Names
Game uses `iconUrl`, BoardGame uses `imageUrl`, Media requires `source`. Don't guess.

### GitHub Push Protection
Never include actual API keys in committed files. Use placeholders.

### Always Filter for Kids Content
When fetching from TMDB:
1. Movies: `certification.lte=7` + genre filters
2. TV: `with_genres=10762|16|10751`
3. Never add 11+ content. If added by mistake, delete immediately.

### Image Fallback System
GameCard tries filesystem paths if DB field is null. Order: jpg, webp, png, svg. Most games have images on disk even though `iconUrl` is null in the DB.

## Navigation & UI Notes

- Emojis for nav: game pad, dice, tv, wave hand -- DO NOT replace with Lucide icons
- Allente hidden in StreamingBadges.tsx (`hide: true`) -- it's a TV aggregator
- Age filters on Film & Serier: 0-3, 3-6, 7+ (combinable with type + streaming)

## Git Co-Author Line

```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Current Stats (as of 2026-01-18)

- Games: 124 digital + 73 board = 197 total (all with parentInfo)
- Media: 194 total (all with posterUrl, description, parentInfo)

## Contact Information

**Email:** `boernespislguiden@proton.me` (this spelling is intentional and correct!)
