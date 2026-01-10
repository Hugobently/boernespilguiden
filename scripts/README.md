# Scripts Directory

Collection of utility scripts for Børnespilguiden management.

## AI Enhancement Scripts

### Quick Start (Recommended)

To enhance the remaining ~60 media items in 2 batches:

```bash
# 1. Get POSTGRES_URL from Vercel dashboard
# 2. Run both batches automatically:
export POSTGRES_URL='postgresql://...' && ./scripts/run-enhancement-batches.sh
```

### Individual Scripts

#### `enhance-remaining.sh` ⭐
Single batch enhancement with helpful error messages.

```bash
# Enhance 35 items (default)
export POSTGRES_URL='postgresql://...' && ./scripts/enhance-remaining.sh

# Custom batch size
export POSTGRES_URL='postgresql://...' && ./scripts/enhance-remaining.sh 50
```

#### `run-enhancement-batches.sh`
Runs 2 batches of 35 items each automatically (total: 70 items).

```bash
export POSTGRES_URL='postgresql://...' && ./scripts/run-enhancement-batches.sh
```

#### `test-enhancement.js`
Core enhancement script (Node.js).

```bash
export POSTGRES_URL='postgresql://...'
export ANTHROPIC_API_KEY='sk-ant-...'
node scripts/test-enhancement.js 35
```

#### `check-enhancement-status.js`
Check how many items are enhanced vs. remaining.

```bash
export POSTGRES_URL='postgresql://...'
node scripts/check-enhancement-status.js
```

## Database Scripts

#### `delete-adult-content.js`
Deletes adult content from the database (already run).

#### `update-age-ratings-standalone.js`
Updates age ratings for TV series based on TMDB content ratings (already run).

#### `migrate-production.js`
Adds missing database columns for AI enhancement features.

#### `add-all-missing-columns.js`
Ensures all 11 required columns exist for parent info, pros, cons, etc.

## How to Get POSTGRES_URL

1. Go to [Vercel Dashboard](https://vercel.com/halfgoods-projects/boernespilguiden/settings/environment-variables)
2. Find `POSTGRES_URL`
3. Click "Show" and copy the value
4. Use in commands: `export POSTGRES_URL='postgresql://...'`

## Enhancement Details

- **Model**: Claude 3 Haiku
- **Rate Limit**: 2 seconds between requests
- **Time per item**: ~2-3 seconds
- **Batch of 35**: ~70 minutes
- **Language**: Danish
- **Content**: Parent-focused descriptions, tips, pros/cons

See [../ENHANCEMENT-GUIDE.md](../ENHANCEMENT-GUIDE.md) for full documentation.
