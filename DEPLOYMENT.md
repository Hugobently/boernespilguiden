# Deployment Guide - Boernespilguiden.dk

Next.js 14 App Router | PostgreSQL | Vercel | TMDB + Anthropic AI

---

## 1. Prerequisites

- **Node.js** >= 18.x (anbefalet 20.x LTS), **npm** >= 9.x
- **PostgreSQL** database (Vercel Postgres eller Prisma-hosted)
- **Git** med adgang til repository

### API Keys

| Key | Formaal | Kilde |
|-----|---------|-------|
| `TMDB_API_KEY` | Film/seriedata | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (gratis) |
| `ANTHROPIC_API_KEY` | AI foraeldreguide (Claude Sonnet 4) | [console.anthropic.com](https://console.anthropic.com) |
| `ADMIN_SECRET` | Admin API-endpoints | Selvvalgt lang random string |
| `CRON_SECRET` | Vercel cron jobs | Selvvalgt lang random string |

---

## 2. Environment Setup

```bash
cp .env.example .env
```

### Paakraevede variabler

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXT_PUBLIC_SITE_URL="https://boernespilguiden.dk"
TMDB_API_KEY="din_tmdb_api_key"
ANTHROPIC_API_KEY="sk-ant-api03-..."
ADMIN_SECRET="lang_random_string"
CRON_SECRET="anden_random_string"
```

Valgfrie: `NEXT_PUBLIC_GA_ID`, `RESEND_API_KEY`, `AMAZON_ASSOCIATE_TAG` (se `.env.example`)

---

## 3. Lokal Udvikling

```bash
npm install                   # Installer dependencies (+ prisma generate via postinstall)
npx prisma db push            # Push schema til database
npm run db:seed               # Seed med testdata
npm run dev                   # Start dev server paa localhost:3000
```

Andre: `npm run build`, `npm run lint`, `npm run test`, `npm run test:e2e`, `npx prisma studio`

---

## 4. Vercel Deployment

**Auto-deploy**: Hvert push til `main` trigger et nyt build via Vercel Git integration.

**Build-script**: `prisma generate && next build`

### Environment Variables i Vercel

Sæt under **Project > Settings > Environment Variables**:

| Variable | Environment |
|----------|-------------|
| `DATABASE_URL` | Production + Preview (auto ved Vercel Postgres) |
| `NEXT_PUBLIC_SITE_URL` | Production |
| `TMDB_API_KEY` | Production + Preview |
| `ANTHROPIC_API_KEY` | Production |
| `ADMIN_SECRET` | Production |
| `CRON_SECRET` | Production |

### Cron Jobs (vercel.json)

| Endpoint | Schedule | Beskrivelse |
|----------|----------|-------------|
| `/api/cron/daily-update` | Dagligt kl. 06 UTC | DR/TMDB streaming + AI reviews |
| `/api/cron/weekly-maintenance` | Soendage kl. 07 UTC | Link-check, ikon-fix |

---

## 5. Database

**Prisma ORM** v5.22 med PostgreSQL. Schema i `prisma/schema.prisma`.

**Modeller**: `Game`, `BoardGame`, `Media`, `StreamingInfo`, `GameTranslation`,
`BoardGameTranslation`, `AnalyticsEvent`, `SearchQuery`

| Kommando | Beskrivelse |
|----------|-------------|
| `npx prisma db push` | Sync schema uden migration |
| `npx prisma migrate dev` | Opret migration |
| `npm run db:seed` | Seed (`prisma/seed.ts`) |
| `npm run db:reset` | Slet alt + seed igen |
| `npx prisma studio` | Database GUI |

---

## 6. Film & Serier

### TMDB Integration

Film/seriedata hentes fra TMDB API. Initial import via admin-endpoint:

```bash
curl -X POST https://boernespilguiden.dk/api/admin/import \
  -H "Authorization: Bearer $ADMIN_SECRET"
```

Importerer DR serier, DR Ramasjang (via TMDB), top TMDB film og serier.

### DR Data & Streaming

DR-programmer (Ramasjang m.fl.) importeres som `DR_MANUAL`/`DR_TMDB`, alle med `hasDanishAudio: true`.
Streaming-udbydere (Netflix, Disney+, HBO Max) gemmes i `StreamingInfo` og opdateres
dagligt via cron: DR status, TMDB streaming (max 30), AI-reviews (max 3/dag).

---

## 7. AI Enhancement

Anthropic Claude Sonnet 4 genererer dansk foraeldreguide per film/serie:
beskrivelse, foraeldreinfo, tips, fordele/ulemper og content flags.

### Via Admin API (produktion)

```bash
# Enhance op til 10 items
curl -X POST https://boernespilguiden.dk/api/admin/enhance-media \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"limit": 10, "force": false}'

# Check status
curl https://boernespilguiden.dk/api/admin/enhance-media \
  -H "Authorization: Bearer $ADMIN_SECRET"
```

### Via lokale scripts

```bash
npm run enhance:media                         # AI-enhance media
```

Built-in 2s delay mellem requests. Koer i batches af 10-35.

---

## 8. Verifikation efter Deploy

### Sider

- [ ] Forside (`/`) - featured spil vises
- [ ] Film & Serier (`/film-serier`) - pagination, filtrering, soegning
- [ ] Film detalje (`/film-serier/[slug]`) - streaming badges, foraeldreinfo
- [ ] Braetspil (`/braetspil`) - kategorier, affiliate links
- [ ] Om os (`/om-os`) og Privatlivspolitik (`/privatlivspolitik`)

### API Endpoints

- [ ] `GET /api/games` - returnerer spildata
- [ ] `GET /api/boardgames` - returnerer braetspil
- [ ] `GET /api/search?q=test` - soegning
- [ ] `POST /api/admin/enhance-media` - 401 uden ADMIN_SECRET

### Generelt

- [ ] Ingen konsolferror, billeder loader, responsivt paa mobil
- [ ] Dansk som default sprog, database-forbindelse OK

---

## 9. Fejlsoegning / Troubleshooting

### 401 Unauthorized paa admin/cron endpoints
Tjek at `ADMIN_SECRET`/`CRON_SECRET` er sat korrekt i Vercel og matcher
`Authorization: Bearer <secret>` headeren.

### Missing API key
Tilfoej `TMDB_API_KEY` / `ANTHROPIC_API_KEY` i Vercel Environment Variables og redeploy.
Lokalt: tilfoej til `.env`.

### Anthropic Rate Limiting (429)
Reducer `limit` i enhance-media kald. Vent et par minutter og proev igen.

### Vercel Function Timeout
- `daily-update`: `maxDuration = 60` (60 sek)
- `weekly-maintenance`: `maxDuration = 120` (120 sek)
- Reducer antal items pr. koersel. Vercel Pro giver laengere timeouts.

### Prisma / Database Connection Error
Tjek `DATABASE_URL` i `.env` / Vercel. Koer `npx prisma db push` for at synkronisere.
Tjek database-status i Vercel/Prisma dashboard.

### Build fejler med Prisma
Build-scriptet koerer `prisma generate` automatisk. Proev manuelt:
```bash
npx prisma generate && npm run build
```

### Manglende data efter deploy
```bash
npm run db:seed   # Seed manuelt
# Eller import via admin endpoint:
curl -X POST https://boernespilguiden.dk/api/admin/import \
  -H "Authorization: Bearer $ADMIN_SECRET"
```

---

*Sidst opdateret: Februar 2026*
