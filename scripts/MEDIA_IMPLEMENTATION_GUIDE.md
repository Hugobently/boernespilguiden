# Game Media Implementation Guide

> **Note (2026-02-05):** All 97 games now have screenshots (100% coverage). The one-time scripts and CSV workflow referenced below have been completed. For current scripts, see [README.md](./README.md).

This guide documents the process used to add screenshots and videos to all online games.

## Final Status

- ✅ **97/97 games have screenshots (100%)**
- ✅ All media migrated to database
- ✅ Seed files updated with media data

## Step-by-Step Process

### Step 1: Set Up YouTube API (Optional but Recommended)

If you want to automate video search:

1. Follow the guide in `scripts/YOUTUBE_API_SETUP.md`
2. Add `YOUTUBE_API_KEY=your_key_here` to `.env` file
3. Re-run: `npm run fetch:media`

**OR** you can add videos manually during the review process (see Step 2).

### Step 2: Review and Approve Media

1. **Open the CSV file**: `scripts/output/media-suggestions.csv`
   - Use Excel, Google Sheets, or any CSV editor

2. **Review each game** with screenshots (`needsReview=yes`):
   - Click each screenshot URL to verify:
     - ✅ Shows actual gameplay (not marketing/logos)
     - ✅ Child-appropriate content
     - ✅ Good quality (clear, not blurry)
     - ✅ Representative of the game

3. **Select best screenshots**:
   - Keep 3-5 best screenshots per game
   - Delete URLs from columns you don't want to use
   - Reorder by moving URLs between `screenshot1-5` columns

4. **Add YouTube videos manually**:
   - Search YouTube for: `"{game title} gameplay kids"`
   - Find a child-appropriate gameplay video (2-10 min)
   - Copy the URL and paste into `videoUrl` column
   - Add video title to `videoTitle` column

5. **Mark approved games**:
   - Set `approved` column to `yes` for reviewed games
   - Add any notes in the `notes` column

6. **Save the file as**: `scripts/output/media-approved.csv`

### Step 3: Update Seed File

Once you have reviewed and approved media:

```bash
npm run update:media
```

This script will:
- Read `media-approved.csv`
- Validate all URLs (check they return 200 OK)
- Update `data/games-seed.ts` with approved media
- Create automatic backup: `data/games-seed.backup-auto.ts`
- Generate a report

**Review the changes** in `data/games-seed.ts` before proceeding.

### Step 4: Migrate to Database

Choose the appropriate method:

#### Option A: Development (Safe to Reset)
```bash
npm run db:reset && npm run db:seed
```
This completely resets and re-seeds the database.

#### Option B: Production (Safer)
```bash
npm run migrate:media
```
This only updates media fields without affecting other data.

### Step 5: Verification

1. **Test locally**:
   ```bash
   npm run dev
   ```

2. **Check game pages**:
   - Visit a few game detail pages
   - Verify screenshots display in gallery
   - Test gallery navigation (arrows, thumbnails)
   - Check video player works
   - Test on mobile/tablet sizes

3. **Look for issues**:
   - Broken image links
   - CORS errors in console
   - Layout problems
   - Performance issues

## Current Statistics

Based on the initial automated fetch:

- **Total games**: 103
- **Games with screenshots**: 50 (49%)
  - From iTunes API: 36 games
  - From Play Store: 14 games
- **Games with videos**: 0 (needs YouTube API or manual addition)

## Quality Guidelines

### Screenshots
- ✅ **Include**: Actual gameplay, clear UI, child-appropriate
- ❌ **Exclude**: Marketing images, text overlays, low quality, inappropriate content
- **Minimum**: 3 screenshots per game
- **Maximum**: 5 screenshots per game
- **Resolution**: Prefer 800x600px minimum

### Videos
- ✅ **Include**: Gameplay footage, kid-friendly narration, 2-10 minutes
- ❌ **Exclude**: Reviews, tutorials with inappropriate language, too long
- **Duration**: 2-10 minutes preferred
- **Content**: Must be child-appropriate (check YouTube age restrictions)
- **Quality**: Clear visuals, good sound

## Files Reference

### Scripts
- `scripts/fetch-game-media.ts` - Automated media fetching
- `scripts/update-game-media.ts` - Update seed file with approved media
- `scripts/migrate-media-to-db.ts` - Database migration

### Data
- `data/games-seed.ts` - Source of truth for game data
- `data/games-seed.backup.ts` - Manual backup (created at start)
- `data/games-seed.backup-auto.ts` - Auto backup (created before updates)

### Output
- `scripts/output/media-suggestions.csv` - Initial automated fetch results
- `scripts/output/media-approved.csv` - Your reviewed and approved media (create this)

### Documentation
- `scripts/YOUTUBE_API_SETUP.md` - YouTube API configuration guide
- `scripts/MEDIA_IMPLEMENTATION_GUIDE.md` - This file

## NPM Scripts

```bash
# Fetch media from iTunes, Play Store, and YouTube
npm run fetch:media

# Update seed file with approved media
npm run update:media

# Migrate media to database (production-safe)
npm run migrate:media

# Reset database and re-seed (development only)
npm run db:reset && npm run db:seed
```

## Troubleshooting

### iTunes API not finding apps
- Apps might not be available in all regions
- Some apps might be removed from App Store
- Try Play Store instead (if available)

### Play Store returning 404
- URL might be incorrect
- App might be region-locked
- App might be removed

### YouTube API quota exceeded
- Daily limit: 10,000 units (100 searches)
- Wait 24 hours or create new project
- Or add videos manually

### URLs not validating
- Check URL is accessible in browser
- Some CDNs block HEAD requests (false negative)
- If URL works in browser, it's probably fine

### Screenshots not displaying
- Check CORS headers (Next.js Image handles most cases)
- Verify URL is HTTPS (not HTTP)
- Check browser console for errors

## Next Steps After Implementation

1. **Test thoroughly** on multiple devices
2. **Monitor analytics** to see engagement with media
3. **Quarterly refresh**:
   - Re-run `npm run fetch:media`
   - Update any broken links
   - Add media for new games
4. **Consider automation**:
   - GitHub Actions to check link health
   - Automated video updates
   - Screenshot quality checks

## Tips for Efficient Review

1. **Use a spreadsheet app** with URL preview (Excel/Sheets)
2. **Work in batches** (e.g., 10 games at a time)
3. **Keep notes** of any issues in the `notes` column
4. **Don't overthink** - if a screenshot looks good, approve it
5. **You can always update later** - this isn't set in stone

## Getting Help

If you encounter issues:
1. Check error messages carefully
2. Review this guide and other documentation
3. Check the backup files are intact
4. Test with a single game first

## Summary Checklist

- [ ] Backup created (`data/games-seed.backup.ts`)
- [ ] Media fetcher run (`npm run fetch:media`)
- [ ] CSV reviewed and approved
- [ ] Best screenshots selected (3-5 per game)
- [ ] Videos added (manual or via YouTube API)
- [ ] Approved media saved to `media-approved.csv`
- [ ] Seed file updated (`npm run update:media`)
- [ ] Changes reviewed in `data/games-seed.ts`
- [ ] Database migrated
- [ ] Testing completed
- [ ] Issues resolved

Good luck! 🎮📱
