# Film & Serier Deployment Checklist

## Pre-Deployment

### 1. API Keys og Secrets
- [ ] Opret TMDB API key på https://www.themoviedb.org/settings/api
- [ ] Opret Anthropic API key på https://console.anthropic.com/ (valgfrit)
- [ ] Generér ADMIN_SECRET: `openssl rand -base64 32`
- [ ] Generér CRON_SECRET: `openssl rand -base64 32`

### 2. Miljøvariabler i Vercel
Tilføj følgende i Vercel dashboard under "Settings" → "Environment Variables":

```
TMDB_API_KEY=din_tmdb_key
ANTHROPIC_API_KEY=sk-ant-... (valgfrit)
ADMIN_SECRET=din_admin_secret
CRON_SECRET=din_cron_secret
```

### 3. Database Migration
Når du deployer til Vercel første gang:

```bash
# Vercel vil køre automatisk:
npx prisma migrate deploy
npx prisma generate
```

Hvis du har problemer, kan du køre manuelt via Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

## Post-Deployment

### 4. Initial Data Import

Når sitet er deployed, kør initial import:

```bash
curl -X POST https://boernespilguiden.dk/api/admin/import \
  -H "Authorization: Bearer DIN_ADMIN_SECRET"
```

Dette importerer:
- ~42 danske DR serier
- 50 børnefilm fra TMDB
- 50 børneserier fra TMDB

**Forventet svar:**
```json
{
  "success": true,
  "stats": {
    "drSeries": 42,
    "tmdbMovies": 50,
    "tmdbSeries": 50,
    "errors": []
  },
  "timestamp": "2026-01-10T..."
}
```

### 5. Verificer Cron Job

Vercel cron jobbet kører automatisk hver dag kl. 06:00.

Test det manuelt:
```bash
curl https://boernespilguiden.dk/api/cron/daily-update \
  -H "Authorization: Bearer DIN_CRON_SECRET"
```

**Forventet svar:**
```json
{
  "success": true,
  "stats": {
    "drRefreshed": true,
    "tmdbUpdated": 30,
    "reviewsGenerated": 3
  },
  "timestamp": "2026-01-10T..."
}
```

### 6. Verificer Sider

Tjek at følgende sider virker:

- [ ] https://boernespilguiden.dk/film-serier
- [ ] https://boernespilguiden.dk/film-serier?type=film
- [ ] https://boernespilguiden.dk/film-serier?type=serier
- [ ] https://boernespilguiden.dk/film-serier?streaming=drtv
- [ ] https://boernespilguiden.dk/film-serier/[slug] (vælg en konkret)

### 7. Verificer Billeder

Tjek at:
- [ ] TMDB billeder vises (poster + backdrop)
- [ ] DR billeder vises
- [ ] Billeder er responsive
- [ ] Billeder loader korrekt på mobile

### 8. Verificer Attribution

Tjek at følgende attribution vises i footer:
- [ ] "Streaming-data fra JustWatch"
- [ ] "This product uses the TMDB API but is not endorsed or certified by TMDB"

## Monitoring

### Logs at Holde Øje Med

I Vercel dashboard under "Deployments" → "Functions":

1. **Cron Job Logs** (`/api/cron/daily-update`)
   - Kører hver dag kl. 06:00
   - Skal fuldføre på under 60 sekunder
   - Tjek for errors

2. **Import Errors**
   - TMDB rate limiting (max 40 requests/10 sekunder)
   - Missing API keys
   - Database connection issues

### Performance

- [ ] Tjek loading time for `/film-serier` (skal være < 2 sekunder)
- [ ] Tjek loading time for detail pages (skal være < 1 sekund)
- [ ] Verificer image optimization virker

## Vedligeholdelse

### Ugentligt
- [ ] Tjek cron job logs for errors
- [ ] Verificer streaming data er opdateret

### Månedligt
- [ ] Tilføj nye danske DR serier til `lib/dr-data.ts`
- [ ] Kør import igen: `POST /api/admin/import`
- [ ] Generer reviews for nye titler (sker automatisk via cron)

### Ved Behov
- [ ] Opdater TMDB movie/series limits i import funktioner
- [ ] Tilføj nye streaming providers til `StreamingBadges.tsx`
- [ ] Juster aldersanbefalinger i DR data

## Troubleshooting

### Problem: Ingen data vises
**Løsning**: Kør initial import igen

### Problem: Billeder vises ikke
**Løsning**:
1. Tjek `next.config.mjs` har image domains
2. Verificer at Vercel har deployed med seneste config

### Problem: Cron job fejler
**Løsning**:
1. Tjek `CRON_SECRET` er sat korrekt i Vercel
2. Verificer at endpoint er tilgængelig
3. Tjek function timeout (max 60 sek på Pro plan)

### Problem: TMDB API rate limiting
**Løsning**:
1. Reducer antal sider i `discoverKidsMovies`/`discoverKidsSeries`
2. Øg sleep tid mellem requests
3. Kør import i mindre batches

### Problem: Reviews genereres ikke
**Løsning**:
1. Tjek `ANTHROPIC_API_KEY` er sat
2. Verificer API key har credits
3. Tjek cron job logs for errors

## Success Metrics

Efter deployment, du bør have:

- [ ] **42+ danske serier** i databasen
- [ ] **100+ internationale film/serier** i databasen
- [ ] **Streaming info** for de fleste titler
- [ ] **Auto-genererede reviews** starter indenfor 24 timer
- [ ] **Daglige opdateringer** via cron job

## Næste Skridt

1. **Tilføj til navigation**: Link til `/film-serier` i header
2. **SEO**: Tilføj sitemap entries for film/serier
3. **Analytics**: Track populære film/serier
4. **Social sharing**: Tilføj Open Graph metadata
5. **Newsletter**: Integrer nye film/serier i nyhedsbrev

## Support

Ved problemer:
- Se `FILM-SERIER-SETUP.md` for detaljeret dokumentation
- Tjek blueprint: `boernespilguiden-film-serier-blueprint-v3.docx`
- TMDB API docs: https://developers.themoviedb.org/3
