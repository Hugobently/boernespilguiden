# Quick Start: Add Media to Games

> **Note (2026-02-05):** Media has been added to all 124 games (100% coverage). The one-time scripts and CSV files referenced below have been removed. For current scripts, see [scripts/README.md](./scripts/README.md).

## 🎯 What You Need to Do

1. **Review screenshots** in the CSV file
2. **Add YouTube videos** (optional but recommended)
3. **Approve the media**
4. **Run update script**
5. **Migrate to database**

## 📋 Current Status

- ✅ **50 games have screenshots** (out of 103)
- ⚠️ **0 games have videos** (YouTube API not set up)
- 📁 **CSV file ready**: `scripts/output/media-suggestions.csv`

## 🚀 Quick Steps

### 1. Preview the Media (Easy Way)

Open `scripts/preview-media.html` in your browser:
- Drag and drop the CSV file
- View all screenshots visually
- Filter by status
- Click screenshots to enlarge

### 2. Review & Approve

Open `scripts/output/media-suggestions.csv` in Excel/Google Sheets:

For each game with screenshots (`needsReview=yes`):
- ✅ Check screenshots show actual gameplay
- ✅ Delete poor quality screenshots (blank columns are OK)
- ✅ Keep 3-5 best screenshots
- ✅ Add YouTube URL in `videoUrl` column (search: "{game name} gameplay kids")
- ✅ Set `approved` to `yes`

Save as: `scripts/output/media-approved.csv`

### 3. Update Seed File

```bash
npm run update:media
```

Review changes in `data/games-seed.ts` before proceeding.

### 4. Update Database

**Development:**
```bash
npm run db:reset && npm run db:seed
```

**Production:**
```bash
npm run migrate:media
```

### 5. Test

```bash
npm run dev
```

Visit game detail pages and verify:
- Screenshots display correctly
- Gallery navigation works
- Videos play (if added)
- Mobile responsive

## 📚 Full Documentation

- **Complete Guide**: `scripts/MEDIA_IMPLEMENTATION_GUIDE.md`
- **YouTube API Setup**: `scripts/YOUTUBE_API_SETUP.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`

## 🆘 Help

- Check error messages carefully
- All backups are in `data/games-seed.backup*.ts`
- Test with one game first if unsure

## ⚡ Speed Tips

1. Use the HTML preview tool (`scripts/preview-media.html`) for faster visual review
2. Don't overthink - if a screenshot looks good, approve it
3. You can always update later
4. Work in batches of 10 games

## 📊 Expected Results

After completion:
- 50+ games with approved screenshots
- 50+ games with videos (if you add them)
- Better user engagement on game pages
- Professional looking game detail pages

---

**Ready to start?** Open `scripts/preview-media.html` in your browser!
