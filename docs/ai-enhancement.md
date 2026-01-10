# AI-Powered Media Description Enhancement

This system automatically enhances TMDB film and TV series descriptions with detailed, parent-focused content in Danish using Claude AI.

## What Gets Enhanced

For each film or TV series, the AI generates:

1. **Extended Description** (200-300 words)
   - Detailed plot summary
   - What makes it interesting for children
   - Themes and messages
   - Style and atmosphere

2. **Parent Information** (100-150 words)
   - Important context for parents
   - Things to prepare children for
   - Social or emotional themes

3. **Parent Tip** (50-75 words)
   - Concrete, practical advice
   - How to watch together effectively
   - Discussion topics for after viewing

4. **Pros & Cons**
   - 3-5 positive aspects
   - 2-4 things to be aware of
   - Short, precise points

5. **Content Flags**
   - Violence detection
   - Scary content detection
   - Language appropriateness
   - Educational value

## Setup

1. Get an Anthropic API key from https://console.anthropic.com/

2. Add it to your `.env` file:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Ensure you have the ADMIN_SECRET set (for API route access):
   ```
   ADMIN_SECRET=your-secret-here
   ```

## Usage

### Command Line (Recommended)

Enhance 10 media items:
```bash
npm run enhance:media
```

Enhance 50 media items:
```bash
npm run enhance:media 50
```

Force re-enhancement of already processed items:
```bash
npm run enhance:media 10 -- --force
```

### API Route

Check enhancement status:
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  https://your-domain.com/api/admin/enhance-media
```

Enhance media via API:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"limit": 10, "force": false}' \
  https://your-domain.com/api/admin/enhance-media
```

## How It Works

1. Finds media items that need enhancement (no `parentInfo` or empty `pros`)
2. For each item:
   - Sends TMDB description + metadata to Claude AI
   - Claude analyzes and writes Danish parent-focused content
   - Updates database with enhanced content
3. Rate limited to 1 request per 2 seconds to avoid API limits
4. Automatic retry logic with exponential backoff

## Cost Estimation

- Model: Claude 3.5 Sonnet
- ~1000 tokens input + ~1500 tokens output per media item
- Cost: ~$0.01 per enhancement
- 100 items ≈ $1.00

## Tips

- Start with small batches (10-20) to verify quality
- Review the enhanced content before going live
- Use `--force` sparingly (it re-processes already enhanced items)
- Monitor API usage in Anthropic console
- The system skips items without TMDB descriptions

## Quality Control

Enhanced content is written:
- In Danish
- For Danish parents
- With specific age recommendations
- Culturally appropriate
- Focused on helping parents make informed choices

## Database Fields Updated

- `description` - Enhanced long description
- `parentInfo` - "Hvad forældre skal vide" section
- `parentTip` - Concrete tip for parents
- `pros[]` - Array of positive points
- `cons[]` - Array of things to be aware of
- `hasViolence` - Boolean flag
- `hasScaryContent` - Boolean flag
- `hasLanguage` - Boolean flag
- `hasEducational` - Boolean flag

## Troubleshooting

**"ANTHROPIC_API_KEY not configured"**
- Add the API key to your `.env` file

**"Unauthorized"**
- Check that ADMIN_SECRET matches in request and `.env`

**API rate limits**
- The script already includes 2-second delays
- If you hit limits, wait a bit and try again
- Consider processing in smaller batches

**Enhancement fails**
- Check Anthropic API status
- Verify API key has sufficient credits
- Check console logs for specific errors
