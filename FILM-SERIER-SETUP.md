# Film & Serier Setup Guide

Dette dokument forklarer hvordan du sætter op og bruger Film & Serier funktionen i Børnespilguiden.

## Oversigt

Film & Serier funktionen kombinerer:
- **TMDB API**: Internationale børnefilm og serier med streaming info (JustWatch data)
- **DR Data**: Hardcoded danske børneserier fra DR Ramasjang
- **Claude API**: Automatisk generering af anmeldelser

## 1. Miljøvariabler

Tilføj følgende til din `.env` fil:

```bash
# TMDB API (opret gratis konto på themoviedb.org)
TMDB_API_KEY="din_tmdb_api_key"

# Anthropic Claude API (til review generering)
ANTHROPIC_API_KEY="sk-ant-api03-..."

# Admin endpoint sikkerhed
ADMIN_SECRET="en_lang_random_string"

# Vercel cron sikkerhed
CRON_SECRET="en_anden_random_string"
```

### Sådan får du API nøgler:

1. **TMDB API Key** (gratis):
   - Gå til https://www.themoviedb.org/settings/api
   - Opret en konto hvis du ikke har en
   - Anmod om en API key under "API" sektionen
   - Vælg "Developer" kategori

2. **Anthropic API Key** (betalt):
   - Gå til https://console.anthropic.com/
   - Opret en konto
   - Gå til "API Keys" og opret en ny nøgle
   - **OBS**: Dette er valgfrit. Uden denne key kan du ikke auto-generere reviews

3. **ADMIN_SECRET og CRON_SECRET**:
   - Generér to forskellige lange random strings
   - Brug f.eks.: `openssl rand -base64 32`

## 2. Database Migration

Kør Prisma migration for at oprette de nye tabeller:

```bash
npx prisma migrate dev --name add_media_tables
```

Dette opretter:
- `Media` tabel (film og serier)
- `StreamingInfo` tabel (streaming providers)
- `MediaType` enum (MOVIE, SERIES)
- `MediaSource` enum (TMDB, DR_MANUAL, MANUAL)

## 3. Initial Import

### Kør initial import via API:

```bash
curl -X POST http://localhost:3000/api/admin/import \
  -H "Authorization: Bearer din_admin_secret_her"
```

Dette vil:
1. Importere alle 40+ danske DR serier
2. Importere 50 populære børnefilm fra TMDB
3. Importere 50 populære børneserier fra TMDB

**Estimeret tid**: 5-10 minutter (TMDB har rate limiting)

### Tjek resultaterne:

```bash
npx prisma studio
```

Se `Media` og `StreamingInfo` tabeller.

## 4. Vercel Cron Setup

Vercel cron kører automatisk dagligt kl. 06:00 for at:
- Opdatere streaming tilgængelighed
- Generere reviews for nye titler

### Opsætning på Vercel:

1. `vercel.json` er allerede konfigureret
2. Tilføj `CRON_SECRET` til Vercel miljøvariabler
3. Deploy til Vercel
4. Vercel detekterer automatisk cron konfigurationen

### Test cron lokalt:

```bash
curl http://localhost:3000/api/cron/daily-update \
  -H "Authorization: Bearer din_cron_secret_her"
```

## 5. Sider og URLs

Følgende sider er blevet oprettet:

- `/film-serier` - Hovedoversigt
- `/film-serier?type=film` - Kun film
- `/film-serier?type=serier` - Kun serier
- `/film-serier?streaming=drtv` - Kun DR TV indhold
- `/film-serier?streaming=netflix` - Kun Netflix indhold
- `/film-serier/[slug]` - Detalje side for specifik film/serie

## 6. Komponenter

### StreamingBadges
Viser streaming providers med farve-kodning:
- DR TV (rød, gratis)
- Netflix (rød)
- Disney+ (blå)
- Viaplay (orange)
- Og flere...

### MediaCard
Kort oversigt med:
- Poster billede
- Titel
- Aldersanbefaling
- Type (film/serie)
- Dansk badge
- Streaming providers

## 7. Data Struktur

### Media model:
```typescript
{
  id: string
  tmdbId?: number          // TMDB ID (hvis fra TMDB)
  drEntityId?: string      // DR Entity ID (hvis fra DR)
  type: "MOVIE" | "SERIES"
  title: string
  slug: string
  description?: string
  review?: string          // Auto-genereret anmeldelse
  posterUrl?: string
  ageMin?: number
  ageMax?: number
  genres: string[]
  seasons?: number         // Kun for serier
  source: "TMDB" | "DR_MANUAL" | "MANUAL"
  isDanish: boolean
  isNordic: boolean
  streamingInfo: StreamingInfo[]
}
```

## 8. Tilføj Flere Serier Manuelt

### Tilføj danske DR serier:

Rediger `lib/dr-data.ts` og tilføj nye serier:

```typescript
{
  entityId: '123456',
  title: 'Serie Navn',
  slug: 'serie-navn',
  seasons: 2,
  ageMin: 5,
  ageMax: 10,
  isNordic: false
}
```

Kør derefter import igen for at opdatere database.

### Find DR Entity IDs:

1. Gå til https://www.dr.dk/drtv/serie/
2. Find serien
3. URL'en indeholder entity ID: `/serie/navn_ENTITYID`

## 9. Attribution

**VIGTIGT**: Du SKAL vise attribution på siderne:

- "Streaming-data fra JustWatch"
- "This product uses the TMDB API but is not endorsed or certified by TMDB"
- TMDB logo (https://www.themoviedb.org/assets/2/v4/logos/)

Dette er allerede inkluderet i siderne.

## 10. Næste Skridt

### Forbedringer du kan tilføje:

1. **Søgning**: Tilføj søgefunktion i `/film-serier`
2. **Flere filtre**: Genre, år, rating
3. **Favoritter**: Lad brugere gemme favoritter
4. **Anbefalinger**: "Lignende film/serier"
5. **Metadata**: SEO optimering med structured data
6. **Billeder**: Lazy loading og optimization
7. **Analytics**: Track hvilke film/serier der er populære

### Review Generering:

Reviews genereres automatisk via cron job (3 per dag).
Du kan også generere manuelt:

```typescript
import { generateMissingReviews } from '@/lib/services/review-generator';

// Generer 10 reviews
await generateMissingReviews(10);
```

## 11. Troubleshooting

### TMDB API returnerer 401:
- Tjek at `TMDB_API_KEY` er korrekt sat
- Verificer at din API key er aktiv på themoviedb.org

### Ingen streaming providers:
- TMDB's JustWatch data er ikke altid komplet
- DR serier har altid DRTV som provider
- Nogle film/serier har kun "flatrate" (abonnement) data

### Billeder vises ikke:
- Tjek `next.config.js` for image domains
- Tilføj:
  ```javascript
  images: {
    domains: [
      'image.tmdb.org',
      'prod95-static.dr-massive.com'
    ]
  }
  ```

### Cron job virker ikke:
- Verificer `CRON_SECRET` er sat i Vercel
- Tjek Vercel logs under "Deployments" → "Functions"
- Cron jobs virker kun på production, ikke preview

## 12. API Endpoints

### Admin Import (POST):
```
POST /api/admin/import
Header: Authorization: Bearer {ADMIN_SECRET}

Response:
{
  "success": true,
  "stats": {
    "drSeries": 42,
    "tmdbMovies": 50,
    "tmdbSeries": 50
  }
}
```

### Daily Cron (GET):
```
GET /api/cron/daily-update
Header: Authorization: Bearer {CRON_SECRET}

Response:
{
  "success": true,
  "stats": {
    "drRefreshed": true,
    "tmdbUpdated": 30,
    "reviewsGenerated": 3
  }
}
```

## Support

Ved problemer eller spørgsmål, se:
- Blueprint dokumentation: `boernespilguiden-film-serier-blueprint-v3.docx`
- TMDB API docs: https://developers.themoviedb.org/3
- Anthropic docs: https://docs.anthropic.com/
