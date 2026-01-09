# Børnespilguiden - Forbedringsforslag

Dette dokument indeholder idéer og forbedringsforslag til fremtidig udvikling.

---

## Prioritet: Høj

### 1. Brugeranmeldelser & Ratings
**Status:** Ikke startet
**Kræver:** Brugerlogin, database-udvidelse

Lad forældre rate spil og tilføje kommentarer.
- Tilføj `UserRating` model til Prisma schema
- Implementer OAuth login (Google, Facebook)
- Vis gennemsnitlig brugerrating ved siden af redaktørens rating
- Moderation af kommentarer

### 2. Favorit/Ønskeliste
**Status:** Ikke startet
**Kræver:** Brugerlogin eller localStorage

Lad brugere gemme spil de vil huske.
- Gem i localStorage for anonyme brugere
- Synkroniser med database for logged-in brugere
- "Gem til senere" knap på hver spilkort
- Dedikeret ønskeliste-side

### 3. Filter for "Dansk Sprog"
**Status:** Ikke startet
**Kræver:** Database-felt, UI-opdatering

Mange forældre søger spil med dansk tekst/tale.
- Tilføj `supportsDanish` felt til Game/BoardGame models
- Opdater seed data med sprog-info
- Tilføj filter i søgning og kategori-sider

---

## Prioritet: Medium

### 4. "Spil af Ugen" Feature
**Status:** Ikke startet

Fremhæv et nyt spil hver uge på forsiden.
- Tilføj `featuredWeek` dato-felt
- Admin-interface til at vælge ugens spil
- Automatisk rotation eller manuel udvælgelse

### 5. Sammenlign-funktion
**Status:** Ikke startet

Lad brugere sammenligne 2-3 spil side-by-side.
- "Tilføj til sammenligning" knap
- Sammenligningstabel med alle specs
- Max 3 spil ad gangen

### 6. Aldersberegner
**Status:** Ikke startet

"Mit barn er født [dato]" → vis passende spil.
- Input-felt til fødselsdato
- Beregn alder og vis relevante spil
- Gem præference i localStorage

### 7. Print-venlig Version
**Status:** Ikke startet

Til forældre der vil printe anmeldelser.
- CSS print stylesheet
- Skjul navigation og unødvendige elementer
- Inkluder QR-kode til online version

### 8. Udvidet Forældreguide
**Status:** Ikke startet

Artikler om skærmtid, spilafhængighed, etc.
- Blog/artikel-sektion
- Kategoriserede guides
- SEO-optimerede artikler

---

## Prioritet: Lav

### 9. Push Notifikationer
**Status:** Ikke startet
**Kræver:** Service Worker, brugersamtykke

Notificer brugere om nye spil eller opdateringer.

### 10. Mørk Tilstand
**Status:** Ikke startet

Dark mode for nattelæsning.

### 11. Spil-Quiz
**Status:** Ikke startet

"Find det perfekte spil" quiz baseret på præferencer.

### 12. Community Forum
**Status:** Ikke startet
**Kræver:** Brugerlogin, moderation

Lad forældre diskutere og dele erfaringer.

---

## Tekniske Forbedringer

### Performance
- [ ] Implementer ISR (Incremental Static Regeneration) for spilsider
- [ ] Lazy-load billeder under fold
- [ ] Reducer animationer på mobil
- [ ] Implementer service worker for offline support

### SEO
- [ ] Tilføj FAQ schema markup på flere sider
- [ ] Implementer hreflang tags for flersprogede sider
- [ ] Opret XML sitemap for billeder

### Accessibility
- [ ] Tilføj flere aria-labels
- [ ] Forbedre keyboard navigation
- [ ] Tilføj skip-to-content link
- [ ] Test med skærmlæser

### Analytics
- [ ] Implementer event tracking for affiliate clicks
- [ ] Track søgeord der ikke giver resultater
- [ ] A/B test forskellige layouts

---

## Affiliate & Monetisering

### Potentielle Affiliate-partnere
- **Apple App Store:** Apple Services Performance Partners
- **Google Play:** Google Play Affiliate Program
- **Amazon.de:** Amazon Associates (brætspil)
- **Coolshop.dk:** Dansk affiliate program
- **Proshop.dk:** Dansk affiliate program
- **Saxo.com:** Bog og spil affiliate

### Implementering
Database-felter til affiliate links er allerede på plads:
- `affiliateUrl` - Primært affiliate link
- `affiliateProvider` - Hvilken partner (apple, google, amazon, etc.)
- `appStoreUrl` - Kan konverteres til affiliate
- `playStoreUrl` - Kan konverteres til affiliate
- `amazonUrl` - Til brætspil

### Næste Skridt
1. Ansøg hos affiliate-partnere
2. Opdater seed data med affiliate links
3. Implementer click tracking
4. Tilføj "Køb her" sektion på spilsider

---

## Changelog

| Dato | Ændring |
|------|---------|
| 2026-01-09 | Oprettet dokument med alle forbedringsforslag |

