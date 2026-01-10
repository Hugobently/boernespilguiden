# Run Final Enhancement Batches

## Quick Command (Copy & Paste)

Replace `YOUR_POSTGRES_URL_HERE` with your actual Vercel POSTGRES_URL and run:

```bash
export POSTGRES_URL='YOUR_POSTGRES_URL_HERE' && \
export ANTHROPIC_API_KEY=$(grep '^ANTHROPIC_API_KEY=' .env | cut -d'"' -f2) && \
node scripts/test-enhancement.js 35 && \
echo "✅ Batch 1 complete! Starting Batch 2 in 5 seconds..." && \
sleep 5 && \
node scripts/test-enhancement.js 30
```

## Get POSTGRES_URL

From: https://vercel.com/halfgoods-projects/boernespilguiden/settings/environment-variables

## Status Check

After completion:

```bash
export POSTGRES_URL='YOUR_POSTGRES_URL_HERE' && node scripts/check-enhancement-status.js
```

Expected: `Enhanced: 147/147 (100%)`
