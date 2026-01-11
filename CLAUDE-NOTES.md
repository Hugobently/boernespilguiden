# Claude Session Notes - Børnespilguiden

This document contains important information learned during development sessions to help future Claude instances work more efficiently.

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

### BoardGame Model
- **Image field:** `imageUrl`

### Media Model (Film & Serier)
- **Image field:** `posterUrl`
- **Required field:** `source` - Must be one of: `"TMDB"`, `"DR_MANUAL"`, `"MANUAL"`
- **Type field:** `type` - Values: `"MOVIE"` | `"SERIES"`

### StreamingInfo Model
- Links Media to streaming providers
- **Provider field:** `provider` - e.g., `"drtv"`, `"netflix"`, `"apple"`, `"disney"`
- **Free field:** `isFree` - Boolean

## Database Statistics (as of last session)

```
Games: 111 total
  - With iconUrl: 20
  - Without iconUrl: 91 (need manual image URLs)

Media: 147 total → 196 after Apple TV+ import
  - All have posterUrl
  - 45 DR_MANUAL entries lack descriptions
  - 49 Apple TV+ items added successfully

Streaming Providers in DB:
  - DR TV (drtv)
  - Netflix (netflix)
  - Disney+ (disney)
  - Apple TV+ (apple) ← newly added
  - Viaplay (viaplay)
  - Max/HBO (max, hbo)
  - SkyShowtime (skyshowtime)
  - TV 2 Play (tv2)
  - Filmstriben (filmstriben)
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

### check-stats.ts
Shows database statistics.
```bash
npx tsx scripts/check-stats.ts
```

### Automation Scripts
```bash
./scripts/quick-fix.sh --dry-run  # Test all fixes
./scripts/quick-fix.sh            # Run all fixes
./scripts/run-all-fixes.sh --help # Advanced options
```

## Common Issues & Solutions

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

### Key Component Files
- `components/media/StreamingBadges.tsx` - Provider badges with hide logic
- `components/filters/AgeFilter.tsx` - Age group filter component
- `app/(site)/film-serier/page.tsx` - Film & Serier page with filters

### Scripts
- `scripts/fix-media-images.ts` - Fix media poster images
- `scripts/fix-game-images.ts` - Fix game icon images
- `scripts/fetch-streaming-content.ts` - Fetch from streaming providers
- `scripts/enhance-media.ts` - AI enhancement for descriptions
- `scripts/check-stats.ts` - Database statistics

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

## What Still Needs Work

1. **91 games without icons** - Need to add image URLs to `KNOWN_GAME_IMAGES` mapping
2. **45 DR shows without descriptions** - Need TMDB lookup and AI enhancement
3. **More streaming content** - Can fetch from Netflix, Disney+, etc.
4. **Filmstriben content** - TMDB may not have this data, might need manual import

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
