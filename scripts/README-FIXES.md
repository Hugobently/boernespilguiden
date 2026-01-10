# Scripts for Fixing Media and Game Images

This document explains how to use the scripts created to fix missing images and add streaming content.

## Prerequisites

Make sure you have the following environment variables set in your `.env` file:

```bash
DATABASE_URL="postgresql://..."
TMDB_API_KEY="your_tmdb_api_key_here"
```

## Task #4: Fix Missing Images on DR Ramasjang Programs

### Script: `fix-media-images.ts`

This script finds media items (Film & Serier) without poster images and attempts to fetch them from TMDB.

**Usage:**

```bash
# Dry run (preview what would happen)
npx tsx scripts/fix-media-images.ts --dry-run

# Live run (actually update database)
npx tsx scripts/fix-media-images.ts
```

**What it does:**

1. Finds all media items without `posterUrl`
2. For items with `tmdbId`: Fetches image directly from TMDB
3. For items without `tmdbId`: Searches TMDB by title and year
4. Updates database with poster URL and TMDB ID
5. Rate limited to avoid API throttling (250ms between requests)

**Example output:**

```
[1/15] Processing: Ramasjang: Gurli Gris
  Type: SERIES
  Slug: ramasjang-gurli-gris
  🔍 Searching TMDB...
  ✅ Found on TMDB (ID: 1234)
  📸 Poster: https://image.tmdb.org/t/p/w500/abc123.jpg
  ✅ Updated database with TMDB ID and poster
```

## Task #5: Fix Missing Images on Khan Academy, Minecraft Games

### Script: `fix-game-images.ts`

This script finds digital games without proper images and either downloads them from known sources or provides instructions for manual addition.

**Usage:**

```bash
# Dry run
npx tsx scripts/fix-game-images.ts --dry-run

# Live run
npx tsx scripts/fix-game-images.ts
```

**What it does:**

1. Finds all games without `imageUrl` or with placeholder images
2. Checks against `KNOWN_GAME_IMAGES` mapping
3. Downloads images to `public/images/games/digital/`
4. Updates database with local image path
5. For unknown games, provides manual instructions

**Adding new game images:**

Edit the `KNOWN_GAME_IMAGES` object in the script:

```typescript
const KNOWN_GAME_IMAGES: Record<string, string> = {
  'khan-academy-kids': 'https://play-lh.googleusercontent.com/...',
  'minecraft': 'https://play-lh.googleusercontent.com/...',
  // Add more here
};
```

**Manual steps for games not in the mapping:**

1. Search for the game on Google Play / App Store
2. Download the icon image (right-click and save)
3. Save to `public/images/games/digital/[slug].jpg`
4. Update database manually or add to `KNOWN_GAME_IMAGES` and re-run

## Task #6: Add Filmstriben, Apple TV+, TV 2 Play Content

### Script: `fetch-streaming-content.ts`

This script fetches child-friendly content from streaming providers using TMDB API.

**Usage:**

```bash
# Fetch from Filmstriben (50 items, dry run)
npx tsx scripts/fetch-streaming-content.ts filmstriben 50 --dry-run

# Fetch from Apple TV+ (100 items, live)
npx tsx scripts/fetch-streaming-content.ts apple 100

# Fetch from TV 2 Play (50 items, live)
npx tsx scripts/fetch-streaming-content.ts tv2 50
```

**What it does:**

1. Uses TMDB's discover API with watch provider filtering
2. Fetches both movies and TV shows (50/50 split by default)
3. Filters for child-appropriate content (certification <= 11 for Denmark)
4. Creates Media records with:
   - Title, description, genres
   - TMDB ID and poster URL
   - Age ratings (from Danish certification)
   - Danish language detection
5. Creates StreamingInfo records linking media to providers

**Provider configurations:**

- **Filmstriben**: Free via Danish libraries (`isFree: true`)
- **Apple TV+**: Subscription service (`isFree: false`)
- **TV 2 Play**: Danish streaming service (`isFree: false`)

**Example output:**

```
[1] Frost (Frozen)
  📸 Poster: Yes
  🎭 Genres: animation, familie, eventyr
  👶 Ages: 7-18
  ✅ Added to database

[2] Løvernes Konge
  ⏭️  Already exists, updating streaming info...
  ✅ Added streaming provider
```

## Running All Fixes in Sequence

Here's the recommended order:

```bash
# 1. Fix media images (DR Ramasjang and others)
npx tsx scripts/fix-media-images.ts

# 2. Fix game images
npx tsx scripts/fix-game-images.ts

# 3. Add Filmstriben content
npx tsx scripts/fetch-streaming-content.ts filmstriben 100

# 4. Add Apple TV+ content
npx tsx scripts/fetch-streaming-content.ts apple 100

# 5. Add TV 2 Play content
npx tsx scripts/fetch-streaming-content.ts tv2 100
```

## Troubleshooting

### "TMDB_API_KEY not set"

Get a free API key from https://www.themoviedb.org/settings/api and add to `.env`:

```bash
TMDB_API_KEY="your_key_here"
```

### "DATABASE_URL" errors

Make sure your `.env` file has a valid PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Rate limiting

All scripts include built-in rate limiting (250-500ms delays). If you hit API limits:

- Reduce the limit parameter
- Add longer delays in the script
- Wait before running again

### No results found

For media/streaming content:

- TMDB may not have complete watch provider data for Denmark
- Try searching manually on TMDB to verify availability
- Some content may need to be added manually

For game images:

- Add URLs to `KNOWN_GAME_IMAGES` mapping
- Or download images manually to `public/images/games/digital/`

## Notes

- Always run with `--dry-run` first to preview changes
- Scripts are idempotent - safe to run multiple times
- Existing records are updated, not duplicated
- Images are stored locally in `public/images/` for better performance
- All scripts include progress indicators and detailed logging
