# Børnespilguiden

> Danish children's game & media guide for parents

**Live:** [boernespilguiden.dk](https://boernespilguiden.dk)

## What is this?

Børnespilguiden helps Danish parents find age-appropriate games, apps, and streaming content for children aged 0-10. Every item is reviewed with AI-enhanced parent tips, safety information, and age recommendations.

## Content

- **111 Digital Games** - Apps and games with ratings, parent tips, and safety info
- **72 Board Games** - Physical games with age recommendations
- **194 Movies & TV Shows** - Streaming content with availability info

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL
- **AI:** Claude (Anthropic) for content enhancement
- **Hosting:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Documentation

- **[PROJECT-DOCUMENTATION.md](./PROJECT-DOCUMENTATION.md)** - Complete technical documentation
- **[CLAUDE-NOTES.md](./CLAUDE-NOTES.md)** - Development session notes
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Feature backlog

## Scripts

```bash
# AI enhance games
npx tsx scripts/enhance-games.ts

# Download missing game images
npx tsx scripts/download-game-images.ts

# Import streaming content
npx tsx scripts/fetch-streaming-content.ts
```

## Environment Variables

```bash
DATABASE_URL="postgres://..."
TMDB_API_KEY="your_tmdb_key"
ANTHROPIC_API_KEY="your_anthropic_key"
```

## License

Private - All rights reserved

## Contact

boernespilguiden@proton.me
