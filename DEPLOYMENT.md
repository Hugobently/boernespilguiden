# Deployment Guide - Film & Serier with AI Enhancement

## 🚀 Opdater Produktion

Følg disse trin for at deploye de nye parent info og AI enhancement features:

### 1. Kør Database Migration

De nye kolonner skal tilføjes til din produktionsdatabase:

```bash
curl -X POST \
  -H "Authorization: Bearer film-serier-admin-secret-2026" \
  https://boernespilguiden.vercel.app/api/admin/migrate-media
```

**Forventet output:**
```json
{
  "success": true,
  "message": "Media table migrated successfully",
  "timestamp": "2026-01-10T..."
}
```

Denne kommando er **sikker at køre flere gange** - den tilføjer kun kolonner der ikke allerede eksisterer.

### 2. Tilføj Environment Variable i Vercel

Gå til Vercel dashboard → dit projekt → Settings → Environment Variables

Tilføj:
```
ANTHROPIC_API_KEY=sk-ant-...din-nøgle-her...
```

**Note:** Brug den API nøgle du allerede har i din lokale .env fil.

**VIGTIGT:** Husk at redeploy efter du har tilføjet environment variablen:
- Gå til "Deployments" tab
- Klik på "..." på latest deployment
- Vælg "Redeploy"

### 3. Test Parent Info Display

Besøg en film/serie side, fx:
```
https://boernespilguiden.vercel.app/film-serier/[slug]
```

Du burde se ParentInfo komponenten, men den vil være tom fordi vi ikke har kørt AI enhancement endnu.

### 4. Kør AI Enhancement (valgfrit antal)

**Start med 5 for at teste:**
```bash
curl -X POST \
  -H "Authorization: Bearer film-serier-admin-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"limit": 5, "force": false}' \
  https://boernespilguiden.vercel.app/api/admin/enhance-media
```

**Tjek status:**
```bash
curl -H "Authorization: Bearer film-serier-admin-secret-2026" \
  https://boernespilguiden.vercel.app/api/admin/enhance-media
```

**Forventet output:**
```json
{
  "total": 200,
  "withParentInfo": 5,
  "withPros": 5,
  "needsEnhancement": 195,
  "percentComplete": 2
}
```

### 5. Kør Fuld Enhancement

Når du er tilfreds med de første 5, kør resten:

```bash
# 50 ad gangen
curl -X POST \
  -H "Authorization: Bearer film-serier-admin-secret-2026" \
  -H "Content-Type: application/json" \
  -d '{"limit": 50, "force": false}' \
  https://boernespilguiden.vercel.app/api/admin/enhance-media
```

**Gentag** indtil alle er enhanced (tjek med GET endpoint).

## 💰 Omkostninger

- ~$0.01 per film/serie
- 200 medier ≈ $2.00
- Dette er en **engangsomkostning** per medie
- Nye medier kan enhances løbende

## 🔍 Tjek At Alt Virker

1. **Database kolonner:**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer film-serier-admin-secret-2026" \
     https://boernespilguiden.vercel.app/api/admin/migrate-media
   ```
   Skulle returnere success.

2. **Environment variables:**
   Vercel dashboard → Settings → Environment Variables
   - ✅ TMDB_API_KEY
   - ✅ ADMIN_SECRET
   - ✅ CRON_SECRET
   - ✅ ANTHROPIC_API_KEY (NY!)
   - ✅ DATABASE_URL

3. **ParentInfo component:**
   Besøg en film side - komponenten skal være synlig (kan være tom)

4. **AI Enhancement:**
   Kør 1 test enhancement og tjek resultatet på siden

## 🐛 Troubleshooting

**"Unauthorized" fejl:**
- Tjek at Authorization header matcher ADMIN_SECRET

**"ANTHROPIC_API_KEY not configured":**
- Tilføj environment variable i Vercel
- Redeploy efter tilføjelse

**"Column already exists" i migration:**
- Dette er forventet hvis du kører migration igen
- Migration er idempotent (sikker at køre flere gange)

**Enhancement timeout:**
- Reducer batch size til 10-20
- API'et har 2 sekunders delay mellem requests for at undgå rate limits

## 📋 Deployment Checklist

- [ ] Kør database migration
- [ ] Tilføj ANTHROPIC_API_KEY i Vercel
- [ ] Redeploy Vercel app
- [ ] Test ParentInfo component vises
- [ ] Enhance 5 test medier
- [ ] Gennemgå kvalitet
- [ ] Enhance alle medier (batch af 50)
- [ ] Verificer completion med GET endpoint

## 🎉 Færdig!

Når alle steps er gennemført har du:
- ✅ ParentInfo bokse på alle film/serie sider
- ✅ AI-genererede beskrivelser på dansk
- ✅ Pros/cons og parent tips
- ✅ Content warnings (vold, skræmmende, osv.)
- ✅ Automatisk system klar til nye medier
