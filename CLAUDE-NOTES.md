# Claude Session Notes - Børnespilguiden

This document contains important information learned during development sessions to help future Claude instances work more efficiently.

> **IMPORTANT RULE FOR CLAUDE:** Always save what you learn to this file or another .md file so you don't forget! Update this document at the end of each session with new learnings.

## Session Log

### 2026-01-18: Site Review & Accessibility Improvements
Performed comprehensive site review checking SEO, accessibility, security, and performance.

**Accessibility Fixes Made:**
1. Added `aria-label="Ryd søgefelt"` to clear buttons in:
   - `components/filters/SearchBar.tsx:486`
   - `components/layout/Header.tsx:204`
2. Added skip-to-content link for keyboard/screen reader users:
   - Added skip link in `Header.tsx` (visually hidden, shown on focus)
   - Added `id="main-content"` to main element in `layout.tsx`
   - Added translations in all 4 languages (da/en/fr/es)

**Site Review Findings:**
- ✅ SEO: Sitemap, robots.txt, meta tags all properly configured
- ✅ Security: Admin routes protected, security headers in place
- ✅ TypeScript: No diagnostics/errors
- ⚠️ Speed Index: 51% in Lighthouse (could be improved)
- ⚠️ 21 console.log statements in API routes (should be removed for production)

**Files Modified:**
- `components/filters/SearchBar.tsx` - Added aria-label to clear button
- `components/layout/Header.tsx` - Added aria-label and skip-to-content link
- `app/layout.tsx` - Added id="main-content" to main element
- `messages/da.json` - Added "skipToContent" translation
- `messages/en.json` - Added "skipToContent" translation
- `messages/fr.json` - Added "skipToContent" translation
- `messages/es.json` - Added "skipToContent" translation

### 2026-01-11 (Session 6 continued): DR Show Images Fix
Fixed 21 DR shows with broken dr-massive image URLs.

**Problem:** DR's image API changed - URLs without `ImageId` parameter now return 400 errors.

**Solution:**
- Created `scripts/fix-dr-images.ts` to scrape og:image from DR website
- Downloaded 21 poster images locally to `/public/images/media/`
- Updated database to use local paths instead of broken dr-massive URLs

**Shows Fixed:**
Restaurant Million, Søskende-chok, Kasper og Sofie, Oda Omvendt, Mini-agenterne,
Hanna og Rally, Elefantvask, Det sidste nye med Onkel Reje, Onkel Reje og Galaksens Helte,
Det store Ramasjang Mysterie, Mysteriebureauet, Men Kasper da, Sommeren med far,
Kevin og farfar, Sol snart 6 år, Bobbel og Gælles Mission, Bella Boris og Berta,
Jagten på regnbuens eliksir, Klar parat skolestart, Heksebeth og den hovedløse magi,
Motor Mille og Børnebanden

### 2026-01-11 (Session 6): Bug Fixes, Images & Documentation
Fixed critical production bugs, added more game images, created backup, and wrote comprehensive documentation.

**Critical Bugs Fixed:**
1. **Film-serier page crash** - Page showed "Ups! Noget gik galt" error
   - **Bug 1:** `searchParams` must be awaited in Next.js 14+ App Router
   - **Fix:** Changed `searchParams: SearchParams` to `searchParams: Promise<SearchParams>` and added `await`
   - **Bug 2:** `ageGroups` was imported from `'use client'` module (AgeFilter.tsx) into server component
   - **Fix:** Created shared config `lib/config/age-groups.ts` without 'use client' directive

2. **Minecraft image not loading** - 86KB webp file existed but wasn't displayed
   - **Cause:** `IMAGE_FORMATS` array in GameCard.tsx didn't include 'webp'
   - **Fix:** Added 'webp' to the format fallback chain: `['jpg', 'webp', 'png', 'svg']`

**Game Images Downloaded (18 new):**
Downloaded from iTunes Search API:
- Khan Academy Kids, Endless Alphabet, Lingokids, Prodigy Math, Thinkrolls
- Sago Mini Friends, Peppa Pig Party Time, Mineko Night Market, Candy Crush
- DR apps: Karla, Minisjang, Motor Mille, Naturspillet, Øen, Ramasjang Krea/Læer/Leg
- Minecraft, Minecraft Education

**Project Backup Created:**
- Location: `/home/halfgood/Desktop/boernespilguiden-backup-20260111-165747/`
- Contents: Git bundle, database export (JSON), .env, images, config files, documentation
- Compressed archive: 19MB

**Documentation & Code Improvements:**
- Created `PROJECT-DOCUMENTATION.md` (1042 lines) - Comprehensive technical docs
- Updated `README.md` with proper project information
- Created centralized config system:
  - `lib/config/age-groups.ts` - Shared age group config (server/client safe)
  - `lib/config/platforms.ts` - Platform icons and colors
  - `lib/config/theme.ts` - Centralized theme colors
  - `lib/config/index.ts` - Unified exports

**Files Modified:**
- `app/(site)/film-serier/page.tsx` - Fixed searchParams and ageGroups import
- `lib/config/age-groups.ts` - NEW: Shared module for age groups
- `components/filters/AgeFilter.tsx` - Updated imports
- `components/games/GameCard.tsx` - Added webp to IMAGE_FORMATS
- `lib/config/platforms.ts` - NEW: Centralized platform config
- `lib/config/theme.ts` - NEW: Centralized theme config
- `lib/config/index.ts` - NEW: Config exports
- `PROJECT-DOCUMENTATION.md` - NEW: Comprehensive docs
- `README.md` - Updated with proper info
- `public/images/games/digital/*.jpg` - 18 new game images

**Key Learnings:**
- Next.js 14+ App Router: `searchParams` is a Promise and must be awaited
- Server/Client boundary: Cannot import from 'use client' modules in server components
- Image fallback: GameCard tries formats in order: jpg → webp → png → svg

### 2026-01-11 (Session 5): UI Improvements & Game Images
Used Puppeteer to visually review the live site and implemented several improvements.

**What was done:**
1. **Fixed 14 missing game images** - Downloaded icons from iTunes Search API for:
   - Pepi Wonder World, codeSpark Academy, Gorogoa, Sky: Children of the Light
   - The Gardens Between, Smart Tales, Draw and Tell HD, Crayola Create and Play
   - Moka Mera Lingua, Pango Seek and Find, Poikilingo, ALPA Kids Denmark
   - Toontastic 3D, Chrome Music Lab
   - ✅ **All 111 games now have images!**

2. **Improved streaming availability on show detail pages**
   - Made streaming section more prominent with gradient background
   - Added larger badges with hover effect
   - Added "Gratis" indicator when shows are free to watch

3. **Added Danish language filter for games**
   - New 🇩🇰 "Dansk sprog" toggle on /spil page
   - Filters to show only games with Danish language support (11 games)
   - Useful for parents who want Danish-language apps for their kids

4. **Added direct contact email to About page**
   - Added email link on /om page
   - Made email clickable with mailto: link
   - **NOTE:** The email is `boernespislguiden@proton.me` (this is CORRECT - not a typo!)

**Bug fixes:**
- Fixed TypeScript error in film-serier/page.tsx (age filter type definition)
- Fixed TypeScript error in fix-game-images.ts (platform vs platforms field)

**Files modified:**
- `scripts/download-game-images.ts` - Added 14 new game image URLs
- `components/media/StreamingBadges.tsx` - Added size prop for large badges
- `app/(site)/film-serier/[slug]/page.tsx` - Improved streaming section
- `app/(site)/film-serier/page.tsx` - Fixed type definition
- `app/(site)/spil/page.tsx` - Added Danish language filter
- `app/(site)/om/page.tsx` - Added direct email link
- `app/(site)/kontakt/page.tsx` - Fixed email typo

### 2026-01-11 (Session 4): Danish Descriptions for DR/Ramasjang Shows
Added Danish descriptions for all 24 remaining DR/Ramasjang shows and ran AI enhancement.

**What was done:**
- Created `scripts/fetch-danish-descriptions.ts` with Danish descriptions for all missing shows
- Added descriptions for: Bella Boris og Berta, Bobbel og Gælles Mission, Det store Ramasjang Mysterie, Fragglerne, Hanna og Rally, Heksebeth og den hovedløse magi, Helpsters, Jagten på regnbuens eliksir, Kasper og Sofie, Kevin og farfar, Klar parat skolestart, Men Kasper da, Mini-agenterne, Motor Mille og Børnebanden, Mysteriebureauet, Oda Omvendt, Restaurant Million, Sago Mini Friends, Skattejagten, Sol snart 6 år, Sommeren med far, Stillwater, Søskende-chok, Vesta-Linnea
- Ran AI enhancement on all 24 newly described shows

**Final Results:**
- ✅ **GAMES: 111/111 (100%)** - All games have AI-enhanced parentInfo
- ✅ **MEDIA: 194/194 (100%)** - All media have AI-enhanced parentInfo
- ✅ **ALL CONTENT IS NOW COMPLETE!**

### 2026-01-11 (Session 3): AI Enhancement for All Content
Ran AI enhancement on all games and media that needed parentInfo.

**AI Enhancement Completed:**
- Created `lib/services/ai-enhance-game.ts` - AI service for game descriptions
- Created `scripts/enhance-games.ts` - Script to run game AI enhancement
- Fixed outdated model name: `claude-3-5-sonnet-20240620` → `claude-sonnet-4-20250514`

**Results:**
- ✅ **GAMES: 111/111 (100%)** - All games now have parentInfo, parentTip, pros, cons
- ✅ **MEDIA: 194/194 (100%)** - All media now have AI-enhanced parentInfo (after Session 4)

**What Each Game/Media Now Has:**
- `parentInfo`: "Hvad forældre skal vide" (100-150 words)
- `parentTip`: Practical tip for parents (50-75 words)
- `pros`: 3-5 positive points
- `cons`: 2-4 things to be aware of

### 2026-01-11 (Session 2): Site Review & DR Media Fix
Performed thorough site review of boernespilguiden.dk

**CORRECTION: Images are in filesystem, not database!**
The code uses fallback paths: `/images/games/digital/{slug}.jpg` and `/images/games/board/{slug}.jpg`
- Database `iconUrl`/`imageUrl` fields are null, but images exist on disk
- 86 digital game images exist in `/public/images/games/digital/`
- 70 board game images exist in `/public/images/games/board/`
- Only ~25 games and ~2 board games are actually missing images

**DR Media Fix:**
- Created `fix-dr-media.ts` script to search TMDB for DR shows
- Fixed 27 shows with TMDB posters and descriptions
- 4 had duplicate tmdbId conflicts (already existed in DB)
- 14 not found on TMDB (Danish-only content, need manual descriptions)
- **Before:** 49 media without descriptions → **After:** 24 remaining

**Remaining Issues (RESOLVED in Session 4):**
- ✅ **24 media descriptions** - FIXED with Danish descriptions
- 🟡 **~25 games missing images** (not 91 - most have filesystem fallback)
- 🟡 **~2 board games missing images** (not 72 - most have filesystem fallback)
- 🟡 **Duplicate streaming provider names** in database (apple vs apple-tv, netflix vs netflix-kids)

**What's Working Well:**
- ✅ All 194 media items have poster images
- ✅ All 111 games have AI-enhanced parentInfo
- ✅ 170/194 media have AI-enhanced parentInfo
- ✅ Most games have images via filesystem fallback
- ✅ Most board games have images via filesystem fallback
- ✅ Age filters are combinable on Film & Serier
- ✅ No adult content visible (ages 11+ filtered)
- ✅ Navigation with emojis working
- ✅ Search works across all content types
- ✅ Allente hidden correctly in UI

### 2026-01-11 (Session 1): Tasks #1-6 from boernespilguiden-fixes-v2.md
- ✅ Task #1: Reverted navigation to emojis (user prefers emojis over Lucide icons)
- ✅ Task #2: Hidden Allente from streaming badges (it's a TV aggregator, not a service)
- ✅ Task #3: Added combinable age filters to Film & Serier page
- ✅ Task #4: All media already have images (147 items with posterUrl)
- ⚠️ Task #4b: 45 DR shows need descriptions (DR_MANUAL entries without TMDB data)
- ✅ Task #5: Created fix-game-images.ts script (91 games need icons)
- ✅ Task #6: Added 40 Apple TV+ KIDS items (after fixing adult content issue)

**Key bugs fixed:**
- `Game.iconUrl` not `imageUrl`
- `Media` requires `source` field when creating
- `.env` had SQLite URL, needed PostgreSQL
- **CRITICAL: fetch-streaming-content.ts was adding adult content!**
  - Deleted 42 adult/teen items (Severance, Bad Sisters, etc.)
  - Fixed script to only fetch kids content (ages 0-10)
  - Added genre filters: Animation (16), Family (10751), Kids (10762)

## Database Configuration

### Production Database URLs
All credentials are stored in `.env` file (not committed to git).

**Required environment variables:**
```bash
DATABASE_URL        # PostgreSQL connection (postgres://...@db.prisma.io:5432/postgres)
PRISMA_DATABASE_URL # Prisma Accelerate connection (prisma+postgres://accelerate.prisma-data.net/...)
TMDB_API_KEY        # TMDB API key for fetching media data
ANTHROPIC_API_KEY   # Anthropic API key for AI enhancement
```

**Where to find these:**
- Database URLs: Vercel dashboard → Project → Settings → Environment Variables
- TMDB API: https://www.themoviedb.org/settings/api
- Anthropic API: https://console.anthropic.com/

### Important Notes
- The `.env` file may have `DATABASE_URL="file:./dev.db"` (SQLite) - this is WRONG for production
- Always use the PostgreSQL URL above for running scripts
- Prisma schema expects PostgreSQL, not SQLite

## Database Schema - Key Field Names

### Game Model
- **Image field:** `iconUrl` (NOT `imageUrl`)
- **Screenshots:** `screenshots` (JSON array string)
- **Platform field:** `platforms` (JSON array string)
- **IMPORTANT:** Images use filesystem fallback! If `iconUrl` is null, code falls back to `/images/games/digital/{slug}.jpg`

### BoardGame Model
- **Image field:** `imageUrl`
- **IMPORTANT:** Images use filesystem fallback! If `imageUrl` is null, code falls back to `/images/games/board/{slug}.jpg`

### Media Model (Film & Serier)
- **Image field:** `posterUrl`
- **Required field:** `source` - Must be one of: `"TMDB"`, `"DR_MANUAL"`, `"MANUAL"`
- **Type field:** `type` - Values: `"MOVIE"` | `"SERIES"`

### StreamingInfo Model
- Links Media to streaming providers
- **Provider field:** `provider` - e.g., `"drtv"`, `"netflix"`, `"apple"`, `"disney"`
- **Free field:** `isFree` - Boolean

## Database Statistics (Updated 2026-01-11)

```
Games: 111 total
  - With AI parentInfo: 111 (100%) ✅
  - Database iconUrl set: 20
  - Database iconUrl null: 91 (BUT images exist in filesystem!)
  - Actual images on disk: 86 jpg files in /public/images/games/digital/
  - Actually missing images: ~25

Board Games: 72 total
  - Database imageUrl set: 0
  - Database imageUrl null: 72 (BUT images exist in filesystem!)
  - Actual images on disk: 70 jpg files in /public/images/games/board/
  - Actually missing images: ~2

Media: 194 total
  - All have posterUrl ✅
  - All have description ✅
  - With AI parentInfo: 194 (100%) ✅
  - DR_MANUAL entries: 45 (all now have descriptions)

Streaming Providers in DB:
  - drtv: 65 items
  - apple: 48 items
  - disney: 33 items
  - netflix: 26 items
  - allente: 24 items (hidden in UI)
  - skyshowtime: 16 items
  - tv2-skyshowtime: 16 items
  - viaplay: 15 items
  - hbo: 11 items
  - netflix-kids: 11 items
  - tv-2: 6 items
  - prime: 5 items
  - apple-tv: 1 item (duplicate of apple)
```

## Scripts Available

### fix-media-images.ts
Finds media without `posterUrl` and fetches from TMDB.
```bash
npx tsx scripts/fix-media-images.ts --dry-run
npx tsx scripts/fix-media-images.ts
```

### fix-game-images.ts
Finds games without `iconUrl` and downloads from known URLs.
```bash
npx tsx scripts/fix-game-images.ts --dry-run
npx tsx scripts/fix-game-images.ts
```
**Note:** Most games need manual image URLs added to `KNOWN_GAME_IMAGES` mapping.

### fetch-streaming-content.ts
Fetches content from streaming providers via TMDB API.
```bash
npx tsx scripts/fetch-streaming-content.ts <provider> <limit> [--dry-run]

# Examples:
npx tsx scripts/fetch-streaming-content.ts apple 100
npx tsx scripts/fetch-streaming-content.ts netflix 100
npx tsx scripts/fetch-streaming-content.ts disney 100
```

### enhance-media.ts
Uses AI to enhance media descriptions.
```bash
npx tsx scripts/enhance-media.ts <limit> [--force]
```
**Note:** Only works on items WITH descriptions but WITHOUT parentInfo.

### enhance-games.ts
Uses AI to enhance game descriptions with parent-focused info.
```bash
npx tsx scripts/enhance-games.ts <limit> [--force] [--dry-run]
```
**Note:** Adds parentInfo, parentTip, pros, cons to games.

### check-stats.ts
Shows database statistics.
```bash
npx tsx scripts/check-stats.ts
```

### fix-dr-media.ts
Searches TMDB for DR_MANUAL shows and updates with proper posters/descriptions.
```bash
npx tsx scripts/fix-dr-media.ts --dry-run
npx tsx scripts/fix-dr-media.ts
```
**Note:** Only works for shows that exist on TMDB. Danish-only content needs manual descriptions.

### fetch-danish-descriptions.ts
Adds Danish descriptions to DR/Ramasjang shows not found on TMDB.
```bash
npx tsx scripts/fetch-danish-descriptions.ts --dry-run
npx tsx scripts/fetch-danish-descriptions.ts
```
**Note:** Contains hardcoded descriptions for known Danish children's shows.

### Automation Scripts
```bash
./scripts/quick-fix.sh --dry-run  # Test all fixes
./scripts/quick-fix.sh            # Run all fixes
./scripts/run-all-fixes.sh --help # Advanced options
```

## Common Issues & Solutions

### Next.js 14+ searchParams must be awaited
**Error:** "Attempted to call from the server but is on the client" or async iteration errors
**Cause:** In Next.js 14+ App Router, `searchParams` is a Promise
**Fix:**
```typescript
// Before (WRONG)
export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const { page } = searchParams;

// After (CORRECT)
export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { page } = params;
```

### Cannot import 'use client' module in server component
**Error:** "Attempted to call X() from the server but X is on the client"
**Cause:** Importing a value from a file with 'use client' directive into a server component
**Fix:** Create a shared config file without 'use client' for values needed in both contexts

### "DATABASE_URL must start with postgresql://"
**Cause:** `.env` has SQLite URL instead of PostgreSQL
**Fix:** Update `DATABASE_URL` in `.env` to the production PostgreSQL URL above

### "Unknown argument `imageUrl`" for Game model
**Cause:** Wrong field name
**Fix:** Use `iconUrl` for Game model, `imageUrl` for BoardGame model

### "Argument `source` is missing" when creating Media
**Cause:** Media model requires `source` field
**Fix:** Add `source: 'TMDB'` (or `'DR_MANUAL'`, `'MANUAL'`) to create data

### TMDB fetch returns 0 results
**Cause:** Provider ID may be wrong or TMDB doesn't have that provider's data for Denmark
**Fix:** Try different providers (Apple TV+ works well), or use manual import

### 45 media items without descriptions
**Cause:** These are DR_MANUAL entries imported without TMDB data
**Fix:** Need to search TMDB for each title, get tmdbId, then run enhance-media

### Anthropic API 404 error for model
**Cause:** Outdated model name `claude-3-5-sonnet-20240620`
**Fix:** Update to `claude-sonnet-4-20250514` in `lib/services/ai-enhance.ts` and `ai-enhance-game.ts`

## Navigation & UI Notes

### Navigation Icons
- User prefers emojis over Lucide icons for children's site
- Current nav uses emoji strings: 🎮 🎲 📺 👋
- DO NOT replace with Lucide icons unless explicitly requested

### Streaming Provider Display
- **Allente is hidden** (`hide: true` in StreamingBadges.tsx)
- Reason: It's a TV package aggregator, not a streaming service

### Age Filters on Film & Serier
- Age groups: 0-3 år, 3-6 år, 7+ år
- Filters are combinable (type + age + streaming)
- Uses `buildUrl()` helper to preserve query params

## File Locations

### Key Configuration Files
- `.env` - Environment variables (DATABASE_URL, API keys)
- `.env.production` - Backup of production URLs
- `prisma/schema.prisma` - Database schema
- `lib/config/index.ts` - Centralized config exports
- `lib/config/age-groups.ts` - Age group config (server/client safe)
- `lib/config/platforms.ts` - Platform icons and colors
- `lib/config/theme.ts` - Theme colors, gradients, shadows

### Key Component Files
- `components/media/StreamingBadges.tsx` - Provider badges with hide logic
- `components/filters/AgeFilter.tsx` - Age group filter component
- `app/(site)/film-serier/page.tsx` - Film & Serier page with filters

### Scripts
- `scripts/fix-media-images.ts` - Fix media poster images
- `scripts/fix-game-images.ts` - Fix game icon images
- `scripts/fetch-streaming-content.ts` - Fetch from streaming providers
- `scripts/enhance-media.ts` - AI enhancement for media descriptions
- `scripts/enhance-games.ts` - AI enhancement for game descriptions
- `scripts/fix-dr-media.ts` - Fix DR shows via TMDB lookup
- `scripts/check-stats.ts` - Database statistics

### AI Services
- `lib/services/ai-enhance.ts` - Media AI enhancement (Claude API)
- `lib/services/ai-enhance-game.ts` - Game AI enhancement (Claude API)

## TMDB Provider IDs

Used in fetch-streaming-content.ts:
- **Apple TV+:** 350 ✅ (works)
- **Netflix:** 8
- **Disney+:** 337
- **Filmstriben:** 483 (may not have DK data)
- **TV 2 Play:** 383

## Git Workflow

Repository: `https://github.com/Hugobently/boernespilguiden.git`
Branch: `main`

Always commit with co-author:
```bash
git commit -m "message

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

## What Still Needs Work (Priority Order)

### Priority 1 - Content Quality (ALL DONE!)
1. ✅ **All 111 games have AI parentInfo** - COMPLETE
2. ✅ **All 194 media have AI parentInfo** - COMPLETE
3. ✅ **All 194 media have descriptions** - COMPLETE (24 DR shows added in Session 4)

### Priority 2 - Missing Images (Lower Priority - Most Have Fallback)
4. **~25 games missing images** - Most games (86/111) have images via filesystem fallback
5. **~2 board games missing images** - Most board games (70/72) have images via filesystem fallback

### Priority 3 - Database Cleanup
6. **Consolidate duplicate providers** - Clean up apple vs apple-tv, netflix vs netflix-kids

### Priority 4 - Nice to Have
7. **Add contact email to /om page** - Users can't easily report issues
8. **Clean up Allente data** - 24 items still in DB (hidden in UI but data exists)
9. **More streaming content** - Can fetch from Netflix, Disney+, etc.
10. **Filmstriben content** - TMDB may not have this data, might need manual import

## Quick Commands for New Sessions

```bash
# Check database connectivity
npx tsx scripts/check-stats.ts

# Fetch more streaming content
npx tsx scripts/fetch-streaming-content.ts apple 100
npx tsx scripts/fetch-streaming-content.ts netflix 100

# View what needs images
npx tsx scripts/fix-game-images.ts --dry-run
npx tsx scripts/fix-media-images.ts --dry-run
```

## User Preferences (Important!)

1. **TARGET AUDIENCE: KIDS 0-10 YEARS OLD** - This is the main target group! NO content for older kids (11+) or adults should be on the site
2. **Emojis over icons** - User prefers emoji icons (🎮 🎲 📺 👋) for navigation, not Lucide/professional icons
3. **Don't push secrets to GitHub** - GitHub has push protection that blocks API keys
4. **Always test with --dry-run first** - User appreciates seeing what will happen before changes
5. **Commit often** - Push changes after each completed task
6. **Danish language** - Site is in Danish, use Danish for user-facing text

## Design Principles

### Mobile-First Design
The site uses **mobile-first responsive design**:
- Base styles are for mobile, then scaled up with `sm:`, `md:`, `lg:` breakpoints
- Hero section shows smaller mascot on mobile, larger on desktop
- FloatingBlobs and sparkle animations are hidden on mobile for cleaner experience
- Navigation uses hamburger menu on mobile, full nav on desktop
- Touch targets are minimum 44px for accessibility

### Child-Friendly UI
- Playful color palette: coral (#FFB5A7), mint (#77DD77), sky (#A2D2FF), lavender (#CDB4DB), sunflower (#FFE66D)
- Rounded corners everywhere (rounded-2xl, rounded-3xl)
- Soft shadows (shadow-card, shadow-soft)
- Fun animations (bounce, wiggle, float, sparkle)
- Large emojis for visual appeal

### Accessibility
- Skip-to-content link for keyboard users
- Aria-labels on icon-only buttons
- Focus-visible states on all interactive elements
- Role="img" with aria-label on decorative emojis

## Contact Information

**Email:** `boernespislguiden@proton.me` (this spelling is intentional and correct!)

### Content Age Restrictions (CRITICAL!)
- **ONLY fetch content for ages 0-10**
- Movies: certification.lte=7 (Danish rating system)
- TV: Filter by Kids (10762), Animation (16), Family (10751) genres
- **DELETE any content with ageMin >= 11**
- Examples of WRONG content: Severance, Bad Sisters, Silo, Ted Lasso
- Examples of CORRECT content: Nuser (Winnie the Pooh), Fragglerne, Peppa Pig

## Lessons Learned

### Don't Assume Field Names
Always check `prisma/schema.prisma` for exact field names:
- Game uses `iconUrl`, BoardGame uses `imageUrl`
- Media has required `source` field
- Different models have different field names for similar concepts

### Database Connection Issues
If you see "DATABASE_URL must start with postgresql://":
1. Check `.env` file
2. It might have `file:./dev.db` (SQLite) which is wrong
3. Replace with the PostgreSQL URL from `.env.production` or Vercel dashboard

### GitHub Push Protection
Never include actual API keys or secrets in committed files. Use placeholders like:
```
DATABASE_URL="postgres://...@db.prisma.io:5432/postgres"
```

### TMDB Provider Data
Not all streaming providers have data in TMDB for Denmark:
- **Works well:** Apple TV+ (350), Netflix (8), Disney+ (337)
- **May not work:** Filmstriben (483), TV 2 Play (383)

### Scripts Need source Field
When creating Media via scripts, always include:
```typescript
source: 'TMDB'  // or 'DR_MANUAL' or 'MANUAL'
```

### CRITICAL: Always Filter for Kids Content!
This is a CHILDREN'S website for ages 0-10. When fetching content:
1. **Movies**: Use `certification.lte=7` and genre filters
2. **TV**: Use `with_genres=10762|16|10751` (Kids, Animation, Family)
3. **NEVER** add content for ages 11+
4. If adult content gets added by mistake, DELETE IT IMMEDIATELY:
```typescript
// Delete content with ageMin >= 11
await prisma.streamingInfo.deleteMany({
  where: { media: { ageMin: { gte: 11 } } }
});
await prisma.media.deleteMany({
  where: { ageMin: { gte: 11 }, source: 'TMDB' }
});
```

## How to Update This File

At the end of each session:
1. Add a new entry to "Session Log" with date and what was done
2. Add any new bugs/fixes to "Common Issues & Solutions"
3. Update "Database Statistics" if counts changed
4. Add any new user preferences discovered
5. Commit and push this file

```bash
git add CLAUDE-NOTES.md && git commit -m "docs: Update Claude session notes" && git push
```
