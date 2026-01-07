# Børnespilguiden - Project Context

## Overview
**Børnespilguiden** (Children's Game Guide) is a Danish website helping parents discover safe, educational, and fun games for their children. It features both digital games (apps, console games) and board games with honest reviews focused on safety, learning, and fun.

**Live Site:** https://boernespilguiden.dk
**Languages:** Danish (primary), English, French, Spanish
**Target Audience:** Danish parents with children aged 0-10 years

## Tech Stack
- **Framework:** Next.js 14.2.35 (App Router)
- **Database:** PostgreSQL with Prisma ORM 5.22.0 (hosted on Vercel/Prisma)
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

/prisma
  schema.prisma           # Database schema
  seed.ts                 # Database seeding script
  *.ts                    # Various migration and update scripts

/public/images/games
  /board/                 # Board game images
  /digital/               # Digital game images

/messages
  da.json, en.json, fr.json, es.json  # UI translations
```

## Database Schema (Prisma)

### Game (Digital Games)
Required fields for creating a new game:
- `title` - Game name
- `slug` - URL-friendly identifier (lowercase, hyphens)
- `description` - Deep review (600-900 characters, see Review Guidelines)
- `shortDescription` - For cards (max 150 characters)
- `minAge`, `maxAge` - Age range (integers)
- `ageGroup` - One of: "0-3", "3-6", "7+"
- `categories` - JSON string array: ["læring", "eventyr", "puslespil", "kreativ", "action", "musik"]
- `platforms` - JSON string array: ["iOS", "Android", "PC", "Nintendo", "PlayStation", "Xbox", "Web"]
- `price` - Float (0 for free)
- `priceModel` - One of: "gratis", "engangskøb", "abonnement", "freemium"
- `rating` - Float 1-5

Optional but recommended:
- `parentInfo` - Parent safety information (100-150 words)
- `parentTip` - Practical tip for parents (1-2 sentences)
- `skills` - JSON array: ["matematik", "læsning", "logik", "motorik", "sprog", "kreativitet"]
- `themes` - JSON array: ["dyr", "rummet", "prinsesser", "dinosaurer", "natur", "eventyr"]
- `developerName` - Developer/publisher name
- `hasAds`, `hasInAppPurchases`, `isOfflineCapable` - Boolean flags
- `pros`, `cons` - JSON arrays of strings

### BoardGame
Required fields:
- `title`, `slug`, `description`, `shortDescription`
- `minAge`, `maxAge`, `ageGroup`
- `minPlayers`, `maxPlayers`, `playTimeMinutes`
- `complexity` - Integer 1-5 (1=very easy, 5=complex)
- `rating` - Float 1-5

### Translations
- GameTranslation & BoardGameTranslation tables
- Per-locale: title, description, shortDescription, pros, cons, parentTip

## Age Groups (UPDATED)
The site now focuses on younger children with 3 age groups:
- `0-3` (baby/toddler) - Pink color (#FFD1DC)
- `3-6` (preschool) - Green color (#BAFFC9)
- `7+` (school age) - Blue color (#BAE1FF)

**Note:** Previous categories "7-10" and "11-15" have been consolidated into "7+".

## Current Database Status (2026-01-07)
- **Digital games:** 86 games with deep reviews
- **Board games:** 64 games with deep reviews
- **All games have:** Description (600-900 chars), parentInfo, parentTip

---

# Review Guidelines

## Writing Deep Reviews (description field)

### Length & Format
- **Target:** 600-900 characters (Danish)
- **Style:** Informative but engaging, written for parents
- **Tone:** Honest, balanced, helpful

### Content Structure
1. **Opening** (1-2 sentences): What is this game/app? What's the main experience?
2. **Features** (2-3 sentences): Key activities, gameplay mechanics, what children can do
3. **Educational value** (1-2 sentences): What skills does it develop? Learning outcomes?
4. **Quality assessment** (1-2 sentences): Graphics, sound, user experience
5. **Closing** (1 sentence): Who is this perfect for?

### Example (Danish):
```
Khan Academy Kids er en af de bedste gratis læringsapps på markedet. Udviklet af den
anerkendte non-profit organisation Khan Academy tilbyder appen tusindvis af aktiviteter
inden for læsning, matematik, logik og social-emotionel læring. Børnene følger de søde
dyrekarakterer gennem en struktureret læringssti, men kan også udforske frit. Indholdet
er forskningsbaseret og opdateres løbende med nye aktiviteter. Interfacet er intuitivt
og farverigt, og al tale er tydelig og venlig. Helt gratis uden reklamer eller køb -
finansieret af donationer. En must-have for alle forældre der vil give deres børn et
forspring, uden at betale en krone.
```

## Writing Parent Info (parentInfo field)

### Length & Format
- **Target:** 100-150 words (Danish)
- **Focus:** Safety, practical concerns, what parents need to know

### Must Include
- Price model (gratis, abonnement, engangskøb, freemium)
- Ads/in-app purchase status
- Internet requirements
- Age appropriateness
- Any safety concerns
- Developer credibility (if notable)

### Example:
```
100% gratis app fra den anerkendte Khan Academy - ingen reklamer, ingen køb, ingen
skjulte omkostninger. Dataindsamling er minimal og transparent. Kan bruges offline
efter download. Indholdet er udviklet af pædagogiske eksperter og er helt sikkert
for børn. Perfekt til forældre der vil give kvalitetslæring uden bekymringer.
```

## Writing Parent Tips (parentTip field)

### Length & Format
- **Target:** 1-2 sentences
- **Style:** Praktisk, actionable advice

### Good Tips Include
- How to maximize learning
- When/how to use the app
- How to extend the learning beyond the screen
- What to watch out for

### Examples:
```
Sæt daglige mål (15-20 min) og sid gerne med de første gange for at forstå hvad barnet lærer.
```
```
Brug appen som optakt til en naturtur - lad barnet finde de samme dyr og planter i virkeligheden.
```

## Rating Guidelines (1-5 scale)

- **5.0:** Exceptionel - Best in class, no significant flaws
- **4.5:** Fremragende - Excellent with minor nitpicks
- **4.0:** Meget god - Strong recommendation with some limitations
- **3.5:** God - Solid choice, some notable issues
- **3.0:** Okay - Decent but significant room for improvement
- **2.5:** Middelmådig - Mixed bag, specific use cases only
- **2.0:** Under middel - Notable problems, better alternatives exist
- **1.5-1.0:** Anbefales ikke - Significant issues, avoid

## Danish Apps Priority
The site has a special focus on Danish content:

### DR Apps (Danmarks Radio)
All DR apps are 100% free, ad-free, and safe:
- DR Ramasjang LEG, LÆR, KREA
- DR Minisjang (0-3 years)
- DR Naturspillet, DR Øen
- DR Karla, DR Motor Mille

### Danish Cultural Apps
- Rasmus Klump (classic Danish character)
- Cirkeline (animated classic)
- Gummi T (Danish Film Institute)
- Poikilingo (Danish language learning)
- ALPA Kids Dansk

### Danish Attraction Apps
- Tivoli Gardens
- LEGOLAND Billund Resort
- Jesperhus

---

# Adding New Games to Database

## Method: Database Script
Create a new file in `/prisma/` or run inline:

```typescript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addGame() {
  const game = await prisma.game.create({
    data: {
      slug: 'game-slug',
      title: 'Game Title',
      shortDescription: 'Short description for cards (max 150 chars)',
      description: 'Deep review (600-900 chars)...',
      ageGroup: '3-6',
      minAge: 3,
      maxAge: 6,
      categories: JSON.stringify(['læring', 'eventyr']),
      skills: JSON.stringify(['motorik', 'logik']),
      themes: JSON.stringify(['dyr', 'natur']),
      platforms: JSON.stringify(['iOS', 'Android']),
      price: 0,
      priceModel: 'gratis',
      rating: 4.0,
      developerName: 'Developer Name',
      parentInfo: 'Parent safety info (100-150 words)...',
      parentTip: 'Practical tip for parents...',
      hasAds: false,
      hasInAppPurchases: false,
      isOfflineCapable: true,
      pros: JSON.stringify(['Pro 1', 'Pro 2', 'Pro 3']),
      cons: JSON.stringify(['Con 1']),
    },
  });
  console.log('Created:', game.title);
  await prisma.$disconnect();
}

addGame();
```

Run with:
```bash
DATABASE_URL="your-connection-string" npx tsx prisma/your-script.ts
```

---

# Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npx prisma studio    # Open database GUI
npx prisma db push   # Push schema changes to database
npx prisma generate  # Regenerate Prisma client
```

---

# Design System
- **Pastel Palette:** Coral (#FFB5A7), Mint (#B8E0D2), Sky (#A2D2FF), Sunflower (#FFE66D), Lavender (#CDB4DB)
- **Background:** Paper (#FFFCF7), Cream (#FFF9F0)
- **Text:** Dark (#4A4A4A), Muted (#7A7A7A)
- Child-friendly rounded components, soft shadows, hover animations

---

# Key Features
1. **Intelligent Search** - Danish natural language parsing ("5 år", "ingen reklamer", "gratis")
2. **Parent-Focused Filters** - Ads, in-app purchases, offline capability, pricing
3. **Multi-Language** - Full 4-language support with fallback to Danish
4. **Deep Reviews** - Every game has comprehensive parent-focused review
5. **Danish Focus** - Prioritizes Danish and Nordic content

---

# Notes for Development
- Database uses PostgreSQL on Vercel/Prisma
- Search parser in `/lib/search.ts` handles Danish number words and phrases
- All games should have description > 500 characters
- Always include parentInfo and parentTip for new games
- Run `npx prisma generate` after schema changes
