# Scripts Directory

Utility scripts for Børnespilguiden database management and content enhancement.

## Active Scripts

### `check-stats.ts`
Show database statistics and content status.
```bash
npx tsx scripts/check-stats.ts
```

### `enhance-media.ts`
AI-enhance media (film/serier) descriptions with parent-focused content.
```bash
npx tsx scripts/enhance-media.ts <limit> [--force]
```
Generates: parentInfo, parentTip, pros, cons for each media item.

### `fetch-game-media.ts`
Fetch game media (icons, screenshots) from external sources.
```bash
npx tsx scripts/fetch-game-media.ts
```

### `fetch-game-media-enhanced.ts`
Enhanced version with better source coverage and retry logic.
```bash
npx tsx scripts/fetch-game-media-enhanced.ts
```

### `update-game-media.ts`
Update game media URLs in the database after fetching.
```bash
npx tsx scripts/update-game-media.ts
```

### `migrate-media-to-db.ts`
Migrate media file references into the database.
```bash
npx tsx scripts/migrate-media-to-db.ts
```

## Environment Variables

Scripts that connect to the database need:
```bash
DATABASE_URL="postgresql://..."    # From Vercel dashboard or .env
ANTHROPIC_API_KEY="sk-ant-..."     # For AI enhancement scripts
```

## Output Directory

Script output files (CSVs, reports) go to `scripts/output/`. This directory is gitignored except for `.gitkeep`.
