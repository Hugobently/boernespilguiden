# AI Enhancement - Setup Guide

> **Note (2026-02-05):** AI enhancement is 100% complete. All 194 media items and all 97 digital games are fully enhanced. This guide is kept for historical reference. The one-time scripts referenced below have been removed from the repository. For current scripts, see [scripts/README.md](./scripts/README.md).

## Status

- **Media**: 194/194 items enhanced (100%)
- **Digital Games**: 97/97 items enhanced (100%)
- **Board Games**: 59 total (no AI enhancement needed)

## Prerequisites

You need the production database URL from Vercel to run the enhancement scripts.

### Step 1: Get POSTGRES_URL from Vercel

1. Go to [Vercel Dashboard](https://vercel.com/halfgoods-projects/boernespilguiden/settings/environment-variables)
2. Find the `POSTGRES_URL` environment variable
3. Click "Show" to reveal the value
4. Copy the entire connection string (starts with `postgresql://`)

### Step 2: Run Enhancement in 2 Batches

#### Option A: Automated (Run both batches sequentially)

```bash
# Set the production database URL
export POSTGRES_URL='postgresql://...'  # Paste your URL here

# Run both batches automatically
./scripts/run-enhancement-batches.sh
```

This will:
- Run Batch 1: 35 items
- Wait 5 seconds
- Run Batch 2: 35 items
- Total: ~2 hours

#### Option B: Manual (Run batches one at a time)

```bash
# Set environment variables
export POSTGRES_URL='postgresql://...'  # From Vercel dashboard
export ANTHROPIC_API_KEY=$(grep '^ANTHROPIC_API_KEY=' .env | cut -d'"' -f2)

# Run Batch 1
node scripts/test-enhancement.js 35

# Wait a bit, then run Batch 2
node scripts/test-enhancement.js 35
```

### Step 3: Check Status

```bash
# Check how many items are enhanced
export POSTGRES_URL='postgresql://...'
node scripts/check-enhancement-status.js
```

## What Gets Enhanced

For each media item, the AI generates:

1. **Description**: 200-300 word Danish description suitable for parents
2. **Parent Info**: What parents should know about the content
3. **Parent Tips**: Suggestions for watching with children
4. **Pros**: 3 positive aspects (educational value, entertainment, themes)
5. **Cons**: 1-2 potential concerns or considerations

## Troubleshooting

### "POSTGRES_URL not set"
Make sure you export the variable in the same terminal session where you run the script.

### "ANTHROPIC_API_KEY not set"
The API key should be in your [.env](.env) file. It's already configured.

### JSON Parsing Errors
Some items may fail due to AI response formatting. These can be retried later or skipped.

### Rate Limiting
The script includes 2-second delays between requests to avoid rate limits. Don't reduce this delay.

## Expected Timeline

- **Batch 1** (35 items): ~70 minutes (2 seconds per item)
- **Batch 2** (35 items): ~70 minutes
- **Total**: ~2.5 hours for all remaining items

## After Completion

Run the status check to verify:

```bash
export POSTGRES_URL='postgresql://...'
node scripts/check-enhancement-status.js
```

Expected output:
```
Total Active Media: 147
Enhanced: 147 (100%)
Needs Enhancement: 0
✅ All media items are enhanced!
```

## Files Created

- [scripts/run-enhancement-batches.sh](scripts/run-enhancement-batches.sh) - Automated batch runner
- [scripts/check-enhancement-status.js](scripts/check-enhancement-status.js) - Status checker
- [scripts/test-enhancement.js](scripts/test-enhancement.js) - Main enhancement script (already existed)

## Manual Alternative: Using TypeScript Script

If you prefer, you can also use the TypeScript enhancement script:

```bash
# This uses DATABASE_URL from .env, so update .env first:
# Change DATABASE_URL="file:./dev.db" to DATABASE_URL="postgresql://..."

npm run enhance:media 35
```

However, the JavaScript version (`test-enhancement.js`) is recommended as it accepts POSTGRES_URL directly without modifying .env.
