# Deployment Guide for Fixes

This guide explains how to deploy and run the fixes for børnespilguiden.dk.

## Overview

All fixes from `boernespilguiden-fixes-v2.md` have been implemented:

- ✅ **Task #1**: Navigation emojis restored
- ✅ **Task #2**: Allente hidden from streaming badges
- ✅ **Task #3**: Age filters added to Film & Serier page
- 🔧 **Task #4**: Script ready to fix DR Ramasjang images
- 🔧 **Task #5**: Script ready to fix game images
- 🔧 **Task #6**: Script ready to fetch streaming content

Tasks #1-3 are already deployed (code changes). Tasks #4-6 require running scripts with database access.

## Prerequisites

### 1. Environment Variables

Make sure your `.env` file contains:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
TMDB_API_KEY="your_tmdb_api_key_here"
```

**Get TMDB API Key:**
1. Sign up at https://www.themoviedb.org/
2. Go to Settings → API
3. Request an API key (free)

### 2. Database Access

Scripts need to connect to your PostgreSQL database. You can run them:

- **Locally**: If you have the database running on your dev machine
- **On Server**: SSH into your production/staging server
- **Via Tunnel**: Set up SSH tunnel to remote database

### 3. Node.js & Dependencies

```bash
# Install dependencies if needed
npm install

# Or if using pnpm
pnpm install
```

## Quick Start (Recommended)

The easiest way to run all fixes:

### Test Run (No Changes)

```bash
./scripts/quick-fix.sh --dry-run
```

This will show you what would happen without making any changes.

### Live Run (Apply Changes)

```bash
./scripts/quick-fix.sh
```

This will:
1. Fix media images (DR Ramasjang programs)
2. Fix game images (Khan Academy, Minecraft, etc.)
3. Fetch streaming content (Filmstriben, Apple TV+, TV 2 Play)

## Advanced Usage

### Run Individual Scripts

**Task #4: Fix DR Ramasjang Images**
```bash
npx tsx scripts/fix-media-images.ts --dry-run  # Test
npx tsx scripts/fix-media-images.ts            # Live
```

**Task #5: Fix Game Images**
```bash
npx tsx scripts/fix-game-images.ts --dry-run   # Test
npx tsx scripts/fix-game-images.ts             # Live
```

**Task #6: Fetch Streaming Content**
```bash
# Filmstriben (100 items)
npx tsx scripts/fetch-streaming-content.ts filmstriben 100 --dry-run
npx tsx scripts/fetch-streaming-content.ts filmstriben 100

# Apple TV+ (100 items)
npx tsx scripts/fetch-streaming-content.ts apple 100 --dry-run
npx tsx scripts/fetch-streaming-content.ts apple 100

# TV 2 Play (100 items)
npx tsx scripts/fetch-streaming-content.ts tv2 100 --dry-run
npx tsx scripts/fetch-streaming-content.ts tv2 100
```

### Custom Run with Bash Script

```bash
# Run all tasks
./scripts/run-all-fixes.sh

# Dry run (test mode)
./scripts/run-all-fixes.sh --dry-run

# Skip specific tasks
./scripts/run-all-fixes.sh --skip-media-images
./scripts/run-all-fixes.sh --skip-game-images
./scripts/run-all-fixes.sh --skip-streaming

# Combine options
./scripts/run-all-fixes.sh --dry-run --skip-streaming
```

## Deployment Scenarios

### Scenario 1: Local Development Machine

```bash
# 1. Pull latest changes
git pull

# 2. Make sure .env is configured
cat .env  # Check DATABASE_URL and TMDB_API_KEY

# 3. Test run
./scripts/quick-fix.sh --dry-run

# 4. Live run
./scripts/quick-fix.sh
```

### Scenario 2: Production Server (SSH)

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Navigate to project
cd /var/www/boernespilguiden

# 3. Pull latest changes
git pull

# 4. Test run
./scripts/quick-fix.sh --dry-run

# 5. Live run (if test looks good)
./scripts/quick-fix.sh

# 6. Restart application (if needed)
pm2 restart boernespilguiden
# or
systemctl restart boernespilguiden
```

### Scenario 3: Database Tunnel

If your database is remote and you want to run locally:

```bash
# 1. Set up SSH tunnel (in separate terminal)
ssh -L 5432:localhost:5432 user@db-server.com

# 2. Update .env to use localhost
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# 3. Run scripts normally
./scripts/quick-fix.sh
```

## What Each Script Does

### fix-media-images.ts

- Finds media items without poster images
- Searches TMDB for images using title/year or existing tmdbId
- Downloads poster URLs
- Updates database with posterUrl and tmdbId
- **Safe to run multiple times** (idempotent)

### fix-game-images.ts

- Finds games without proper images
- Downloads from known URLs (Khan Academy, Minecraft, etc.)
- Saves to `public/images/games/digital/`
- Provides manual instructions for unknown games
- **Safe to run multiple times** (idempotent)

### fetch-streaming-content.ts

- Fetches child-friendly content from streaming providers
- Uses TMDB discover API with provider filtering
- Filters for age-appropriate content (DK certification ≤ 11)
- Creates Media and StreamingInfo records
- **Safe to run multiple times** (won't duplicate existing content)

## Monitoring & Logs

All scripts provide detailed output:

```
[1/15] Processing: Ramasjang: Gurli Gris
  Type: SERIES
  Slug: ramasjang-gurli-gris
  🔍 Searching TMDB...
  ✅ Found on TMDB (ID: 1234)
  📸 Poster: https://image.tmdb.org/t/p/w500/abc123.jpg
  ✅ Updated database with TMDB ID and poster
```

Save logs for record:

```bash
./scripts/quick-fix.sh 2>&1 | tee fix-run-$(date +%Y%m%d-%H%M%S).log
```

## Troubleshooting

### "TMDB_API_KEY not set"

Add to `.env`:
```bash
TMDB_API_KEY="your_key_here"
```

### "DATABASE_URL" errors

Check your connection string format:
```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

### Permission Denied

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### Rate Limiting

If you hit TMDB API limits:
- Scripts already include 250-500ms delays
- Reduce the limit parameter (e.g., 50 instead of 100)
- Wait 10 minutes before running again

### No Results for Streaming Content

- TMDB may not have complete watch provider data for Denmark
- Some content may need manual addition
- Try different search parameters

## Verification

After running scripts, verify the changes:

```bash
# Check media images were added
npm run db:studio
# Navigate to Media table, check posterUrl column

# Check streaming content was added
# Navigate to StreamingInfo table, check for filmstriben/apple/tv2

# Test on website
npm run dev
# Visit http://localhost:3000/film-serier
# Filter by Filmstriben, Apple TV+, TV 2 Play
```

## Rollback

If something goes wrong:

1. **Database backup**: Make sure you have a backup before running
2. **Restore**: Restore from backup if needed
3. **Manual fix**: Update specific records via database tool

Scripts are designed to be safe (idempotent) but always backup first!

## Production Deployment Checklist

- [ ] Database backup created
- [ ] `.env` file configured with correct credentials
- [ ] Dry run completed successfully
- [ ] Manual review of dry run output
- [ ] Live run executed
- [ ] Verification completed on staging/dev
- [ ] Website tested (filters, images, streaming content)
- [ ] Production deployment
- [ ] Post-deployment verification

## Support

For issues or questions:
- Check [scripts/README-FIXES.md](scripts/README-FIXES.md)
- Review script source code
- Check logs for error messages
- Test with `--dry-run` first

## Summary

**Fastest way to run everything:**

```bash
git pull
./scripts/quick-fix.sh --dry-run  # Test
./scripts/quick-fix.sh            # Apply
```

Done! 🎉
