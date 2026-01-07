# Translation Guide for Børnespilguiden

This document outlines the translation architecture and provides instructions for adding new content with proper multilingual support.

## Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `da` | Danish   | Default (source language) |
| `en` | English  | Fully supported |
| `fr` | French   | Supported |
| `es` | Spanish  | Supported |

## Architecture Overview

### 1. Database Schema (Prisma)

The translation system uses separate translation tables linked to the main content:

```
Game (Danish content) ──────┐
                            ├── GameTranslation (en, fr, es)
                            │
BoardGame (Danish content) ─┤
                            └── BoardGameTranslation (en, fr, es)
```

**Translation Tables:**
- `GameTranslation` - Translations for digital games
- `BoardGameTranslation` - Translations for board games

Each translation record contains:
- `locale` - Language code (en, fr, es)
- `title` - Translated title
- `description` - Full translated description
- `shortDescription` - Short description for cards
- `pros` - JSON array of translated pros
- `cons` - JSON array of translated cons
- `parentTip` - Translated parent tip (optional)

### 2. File Structure

```
/lib/translations.ts          # Translation helper functions
/prisma/seed-translations.ts  # Translation seed data
/messages/                    # UI translations (next-intl)
  ├── da.json                 # Danish UI strings
  ├── en.json                 # English UI strings
  ├── fr.json                 # French UI strings
  └── es.json                 # Spanish UI strings
```

### 3. Translation Flow

1. **Database content** (games, board games) → Stored in Danish by default
2. **Translations** → Stored in separate translation tables
3. **Query with locale** → Returns translated content or falls back to Danish
4. **UI strings** → Handled by next-intl from `/messages/*.json`

## Adding New Games

### Step 1: Add the game in Danish

Add the game to the appropriate seed file:
- Digital games: `/data/games-seed.ts`
- Board games: `/data/boardgames-seed.ts`

### Step 2: Add translations

Open `/prisma/seed-translations.ts` and add translations for ALL supported languages:

```typescript
// In digitalGameTranslationsEN:
'new-game-slug': {
  title: 'English Title',
  shortDescription: 'Brief description for cards (max 150 chars)',
  description: 'Full game description with details about gameplay...',
  pros: ['Pro point 1', 'Pro point 2', 'Pro point 3'],
  cons: ['Con point 1', 'Con point 2'],
  parentTip: 'Tip for parents about this game',
},

// In digitalGameTranslationsFR:
'new-game-slug': {
  title: 'Titre Français',
  shortDescription: 'Description courte...',
  description: 'Description complète du jeu...',
  pros: ['Avantage 1', 'Avantage 2', 'Avantage 3'],
  cons: ['Inconvénient 1', 'Inconvénient 2'],
  parentTip: 'Conseil pour les parents...',
},

// In digitalGameTranslationsES:
'new-game-slug': {
  title: 'Título Español',
  shortDescription: 'Descripción breve...',
  description: 'Descripción completa del juego...',
  pros: ['Ventaja 1', 'Ventaja 2', 'Ventaja 3'],
  cons: ['Desventaja 1', 'Desventaja 2'],
  parentTip: 'Consejo para padres...',
},
```

### Step 3: Run the seed scripts

```bash
# Seed the main game data
npx prisma db seed

# Seed the translations
npx tsx prisma/seed-translations.ts
```

## Adding New UI Strings

When adding new UI elements that need translation:

### Step 1: Add to all message files

Add the new key to ALL four message files:

```json
// messages/da.json
{
  "newSection": {
    "title": "Dansk titel",
    "description": "Dansk beskrivelse"
  }
}

// messages/en.json
{
  "newSection": {
    "title": "English title",
    "description": "English description"
  }
}

// messages/fr.json
{
  "newSection": {
    "title": "Titre français",
    "description": "Description française"
  }
}

// messages/es.json
{
  "newSection": {
    "title": "Título español",
    "description": "Descripción española"
  }
}
```

### Step 2: Use in components

```tsx
// Server component
import { getTranslations } from 'next-intl/server';

export default async function MyComponent() {
  const t = await getTranslations('newSection');
  return <h1>{t('title')}</h1>;
}

// Client component
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('newSection');
  return <h1>{t('title')}</h1>;
}
```

## Translation Guidelines

### Content Quality

1. **Accuracy** - Translations should convey the same meaning, not be literal word-for-word
2. **Tone** - Maintain a friendly, parent-focused tone in all languages
3. **Consistency** - Use consistent terminology across all translations
4. **Length** - `shortDescription` should be max 150 characters in all languages

### Required Fields

Every game MUST have translations for:
- `title`
- `shortDescription`
- `description`
- `pros` (array with at least 2 items)
- `cons` (array with at least 1 item)

Optional:
- `parentTip` (recommended but not required)

### Fallback Behavior

If a translation doesn't exist for a specific locale, the system automatically falls back to the Danish content. This ensures the site always displays something, but **new content should always include all translations**.

## Helper Functions

### Fetching translated games

```typescript
import {
  getGameWithTranslation,
  getGamesWithTranslation,
  getBoardGameWithTranslation,
  getBoardGamesWithTranslation,
  getHomepageDataWithTranslation
} from '@/lib/translations';

// Single game
const game = await getGameWithTranslation('game-slug', locale);

// Multiple games with filters
const games = await getGamesWithTranslation({
  where: { editorChoice: true },
  orderBy: { rating: 'desc' },
  take: 10,
}, locale);

// Homepage data (includes editor choice, ad-free, board games)
const data = await getHomepageDataWithTranslation(locale);
```

## Checklist for New Content

- [ ] Game added to seed file in Danish
- [ ] English translation added to `seed-translations.ts`
- [ ] French translation added to `seed-translations.ts`
- [ ] Spanish translation added to `seed-translations.ts`
- [ ] All UI strings added to all 4 message files
- [ ] Seed scripts run successfully
- [ ] Tested in all 4 languages in browser

## Common Issues

### Translation not showing
1. Check the game slug matches exactly between seed files
2. Ensure you ran both seed scripts
3. Verify the locale parameter is being passed correctly

### Missing UI text
1. Check the key exists in ALL message files
2. Verify the namespace in `getTranslations()` matches the JSON structure
3. Check for typos in key names

## Adding a New Language

To add support for a new language (e.g., German):

1. Add locale to `/lib/translations.ts`:
   ```typescript
   export const SUPPORTED_LOCALES = ['da', 'en', 'fr', 'es', 'de'] as const;
   ```

2. Create `/messages/de.json` with all translated UI strings

3. Add German translations to `seed-translations.ts`:
   ```typescript
   const digitalGameTranslationsDE: Record<string, TranslationData> = { ... };
   ```

4. Update the seed function to include the new language

5. Update the language switcher component if needed
