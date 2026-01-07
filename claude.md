# Børnespilguiden - Project Context

## Overview
**Børnespilguiden** (Children's Game Guide) is a Danish website helping parents discover safe, educational, and fun games for their children. It features both digital games (apps, console games) and board games with honest reviews focused on safety, learning, and fun.

**Live Site:** https://boernespilguiden.dk
**Languages:** Danish (primary), English, French, Spanish

## Tech Stack
- **Framework:** Next.js 14.2.35 (App Router)
- **Database:** SQLite with Prisma ORM 5.22.0
- **Frontend:** React 18, TypeScript 5
- **Styling:** TailwindCSS 3.4.1 with custom pastel child-friendly palette
- **i18n:** next-intl 4.7.0

## Project Structure
```
/app
  /api                    # REST API endpoints
    /games/               # Digital games API
    /boardgames/          # Board games API
    /search/              # Combined search
    /analytics/           # Event tracking
  /(site)                 # Public pages
    /spil/                # Digital games (/spil = games in Danish)
    /braetspil/           # Board games (/braetspil = board games)
    /soeg/                # Search page

/components
  /layout/                # Header, Footer, Navigation
  /games/                 # GameCard, GameGrid, GameDetail
  /filters/               # AgeFilter, CategoryFilter, SearchBar
  /ui/                    # Badge, Button, Card, Rating

/lib
  db.ts                   # Prisma client singleton
  types.ts                # TypeScript types (AgeGroup, GameCategory, etc.)
  search.ts               # Danish-aware natural language search parser
  translations.ts         # Multi-language content helpers

/data
  games-seed.ts           # 77 digital games seed data (includes 8 DR Ramasjang apps)
  boardgames-seed.ts      # 59 board games seed data

/prisma
  schema.prisma           # Database schema
  seed.ts                 # Database seeding script

/public/images/games
  /board/                 # Board game images (SVG placeholders + real JPG/PNG)
  /digital/               # Digital game images (SVG placeholders + real JPG/PNG)

/messages
  da.json, en.json, fr.json, es.json  # UI translations
```

## Database Schema (Prisma)

### Game (Digital Games)
- title, slug, minAge, maxAge, ageGroup
- categories, skills, themes (JSON arrays)
- platforms (iOS, Android, PC, Nintendo, PlayStation, Xbox, Web)
- Parent safety: hasAds, hasInAppPurchases, isOfflineCapable, dataCollection
- Media: iconUrl, screenshots, videoUrl
- Links: appStoreUrl, playStoreUrl, websiteUrl
- rating (1-5), featured, editorChoice

### BoardGame
- title, slug, minAge, maxAge, ageGroup
- playTimeMinutes, minPlayers, maxPlayers, complexity
- categories, skills, themes, targetGender
- imageUrl, affiliateUrl, amazonUrl
- rating (1-5), featured, editorChoice

### Translations
- GameTranslation & BoardGameTranslation tables
- Per-locale: title, description, shortDescription, pros, cons, parentTip

## Age Groups
- `0-3` (baby/toddler) - Pink color
- `3-6` (preschool) - Green color
- `7-10` (child) - Blue color
- `11-15` (tween) - Purple color

## Key Features
1. **Intelligent Search** - Danish natural language parsing ("5 år", "ingen reklamer", "gratis")
2. **Parent-Focused Filters** - Ads, in-app purchases, offline capability, pricing
3. **Multi-Language** - Full 4-language support with fallback to Danish
4. **Affiliate Links** - App store and Amazon links for monetization
5. **Analytics** - Page views, game clicks, affiliate click tracking

## Commands
```bash
npm run dev          # Start dev server (usually localhost:3000)
npm run build        # Production build
npm run db:seed      # Seed database with games
npm run db:reset     # Reset and reseed database
npx prisma studio    # Open database GUI
```

## Image Status (as of 2026-01-06)
- **Board games:** 67 games, ALL have real JPG/PNG images
- **Digital games:** 87 games, 86 have real images, 1 (candy-crush) has SVG placeholder only
- Images stored in `/public/images/games/board/` and `/public/images/games/digital/`
- Naming convention: `{slug}.{jpg|png|svg}`
- Images sourced from BoardGameGeek (board games) and various official sources (digital)

## Launch Readiness Checklist (2026-01-06)

### ✅ All Launch Requirements Completed
- [x] Build compiles successfully (TypeScript, no errors)
- [x] API routes configured with `dynamic = 'force-dynamic'`
- [x] Database seeded: 77 digital games, 59 board games
- [x] All board games have real images (JPG/PNG)
- [x] Image fallback system tries jpg → png → svg automatically
- [x] SEO metadata configured (title, description, keywords, OG tags)
- [x] robots.txt and sitemap.xml working
- [x] .env and database properly gitignored
- [x] Homepage, game pages, search all functional
- [x] **og-image.png** (1200x630px) - created for social media sharing
- [x] **apple-touch-icon.png** (180x180px) - created for iOS bookmarks
- [x] **manifest.webmanifest** - created for PWA support
- [x] **Security headers** via middleware.ts (X-Frame-Options, CSP, HSTS, etc.)
- [x] **.env.example** - created with production setup guidance

### Public Assets Created
```
/public/
  og-image.png          # Social media sharing (1200x630)
  apple-touch-icon.png  # iOS bookmark icon (180x180)
  icon-192.png          # PWA icon small
  icon-512.png          # PWA icon large
  icon.svg              # Vector favicon
  manifest.webmanifest  # PWA manifest
```

### For Production Deployment
1. Set up production database (PostgreSQL recommended)
2. Configure analytics (see .env.example)
3. Update NEXT_PUBLIC_SITE_URL in .env
4. Deploy to Vercel/Railway/Render

### Known Limitations
- candy-crush and DR Ramasjang games only have SVG placeholders
- Translation tables exist but are empty (Danish-only content in main tables)

## Danish Focus - DR Ramasjang Games
The site includes 8 free Danish games from DR (Danmarks Radio) public service:
- **DR Ramasjang LEG** - Play with Ramasjang characters (featured, editor's choice)
- **DR Ramasjang LÆR** - Learn Danish letters/numbers with Hr. Skæg (featured, editor's choice)
- **DR Ramasjang KREA** - Creative drawing/art app
- **DR Øen** - Explore Ramasjang Island
- **DR Minisjang** - For youngest kids (0-3 years)
- **DR Naturspillet** - Learn about Danish nature
- **DR Karla** - Based on TV series
- **DR Motor Mille** - Car-themed for vehicle lovers

All DR apps are 100% free (funded by license), no ads, no in-app purchases, offline capable.

## Design System
- **Pastel Palette:** Coral, Mint, Sky, Sunflower, Lavender
- **Background:** Paper (#FFFCF7), Cream (#FFF9F0)
- Child-friendly rounded components, soft shadows, hover animations

## Notes for Development
- Database uses JSON strings for arrays (SQLite limitation)
- Search parser in `/lib/search.ts` handles Danish number words and phrases
- GameCard component has compact variant for sidebars
- Always run `npx prisma generate` after schema changes
