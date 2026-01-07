# Børnespilguiden - Launch Checklist

## Overview

This document outlines everything needed to take Børnespilguiden from development to production.

---

## 1. Domain & DNS Setup

### Choose and Register Domain
- [ ] Register domain (e.g., `boernespilguiden.dk`, `børnespilguiden.dk`)
- [ ] Recommended registrars for .dk domains:
  - [Punktum.dk](https://punktum.dk) (official Danish registry)
  - [Simply.com](https://simply.com)
  - [One.com](https://one.com)

### DNS Configuration
After choosing a hosting provider:
- [ ] Point domain A record to hosting IP
- [ ] Set up CNAME for `www` subdomain
- [ ] Configure SPF/DKIM records if using email

---

## 2. Hosting Options

### Option A: Vercel (Recommended for Next.js)
**Pros:** Zero config, automatic deployments, free tier, edge network
**Cons:** Database not included

**Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Link to production domain
vercel domains add boernespilguiden.dk
```

**Environment variables to set in Vercel dashboard:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SITE_URL` - https://boernespilguiden.dk

### Option B: Railway
**Pros:** Includes PostgreSQL, simple setup, good pricing
**Cons:** Less edge network coverage

**Setup:**
1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL database
4. Deploy

### Option C: Render
**Pros:** PostgreSQL included, European servers available
**Cons:** Slower cold starts on free tier

---

## 3. Database Setup (PostgreSQL)

### Option A: Neon (Recommended - Free tier)
1. Sign up at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Set as `DATABASE_URL` in hosting provider

### Option B: Supabase (Free tier)
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string (use "Connection pooling" URL)

### Option C: Railway PostgreSQL
Included if using Railway for hosting

### Database Migration Steps:
```bash
# 1. Copy PostgreSQL schema
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# 2. Set production DATABASE_URL
export DATABASE_URL="postgresql://..."

# 3. Push schema to production database
npx prisma db push

# 4. Seed production database
npx tsx prisma/seed-production.ts

# 5. Verify
npx prisma studio
```

---

## 4. Pre-Deployment Checklist

### Code Quality
- [x] Build compiles without errors (`npm run build`)
- [x] No TypeScript errors
- [x] ESLint passes (`npm run lint`)
- [x] All pages render correctly

### SEO & Metadata
- [x] `<title>` tags on all pages
- [x] Meta descriptions on all pages
- [x] Open Graph images (og-image.png)
- [x] Apple touch icon (apple-touch-icon.png)
- [x] Favicon (icon.svg)
- [x] robots.txt configured
- [x] sitemap.xml working
- [x] manifest.webmanifest for PWA

### Security
- [x] Security headers in middleware.ts
- [x] No sensitive data in client code
- [x] Environment variables not exposed
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] Cookie consent banner (if using analytics)

### Performance
- [x] Images optimized
- [x] Code splitting (automatic with Next.js)
- [ ] Test Core Web Vitals after deployment
- [ ] Enable caching headers

---

## 5. Post-Deployment Tasks

### Verify Deployment
- [ ] Homepage loads correctly
- [ ] All game pages accessible
- [ ] Search functionality works
- [ ] Filters work on category pages
- [ ] Mobile responsive
- [ ] Images load correctly

### Set Up Monitoring
- [ ] Error tracking (Sentry free tier)
- [ ] Uptime monitoring (UptimeRobot free tier)

### Analytics (Optional)
Choose one:
- [ ] Google Analytics 4
- [ ] Plausible Analytics (privacy-friendly, paid)
- [ ] Simple Analytics (privacy-friendly, paid)

For Google Analytics:
1. Create GA4 property
2. Add `NEXT_PUBLIC_GA_ID` to environment
3. Implement tracking component (see below)

### Cookie Consent (Required if using analytics in EU)
- [ ] Implement cookie consent banner
- [ ] Only load analytics after consent

---

## 6. Legal Requirements (Denmark/EU)

### Privacy Policy Page
- [ ] Create `/privatlivspolitik` page with:
  - What data you collect
  - How you use cookies (if any)
  - Third-party services used
  - Contact information
  - GDPR rights

### Cookie Policy (if using cookies)
- [ ] Create `/cookiepolitik` page
- [ ] List all cookies used
- [ ] Explain purpose of each

### Terms of Service (Optional but recommended)
- [ ] Create `/vilkaar` page

### Contact Information
- [ ] Add contact email
- [ ] Consider adding a contact form

---

## 7. Content Review

### Game Data Quality
- [x] All games have descriptions
- [x] All games have age ratings
- [x] All games have ratings
- [x] Board games have real images
- [ ] Review all game descriptions for accuracy
- [ ] Verify app store links still work

### Images
- [x] All board games have images
- [x] Most digital games have icons
- [ ] Check image quality on high-DPI screens
- [ ] Ensure no copyright issues with images

---

## 8. Launch Day

### Pre-Launch (1 hour before)
- [ ] Final database backup
- [ ] Verify all environment variables set
- [ ] Test production URL

### Launch
- [ ] Deploy to production
- [ ] Point domain to hosting
- [ ] Verify SSL certificate active
- [ ] Test all critical paths

### Post-Launch (same day)
- [ ] Monitor error logs
- [ ] Check analytics working
- [ ] Test on multiple devices
- [ ] Share on social media

---

## 9. Quick Start Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start

# Database commands
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema changes
npx tsx prisma/seed.ts     # Seed database

# For PostgreSQL production
cp prisma/schema.postgresql.prisma prisma/schema.prisma
npx prisma generate
npx prisma db push
npx tsx prisma/seed-production.ts
```

---

## 10. Environment Variables Reference

```env
# Required
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://boernespilguiden.dk"

# Optional - Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Optional - Email
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@boernespilguiden.dk"
SMTP_PASSWORD="password"
CONTACT_EMAIL="kontakt@boernespilguiden.dk"

# Optional - Affiliate
AMAZON_ASSOCIATE_TAG="your-tag-20"
```

---

## Cost Estimates (Monthly)

### Free Tier Stack
- Vercel Hobby: Free
- Neon PostgreSQL: Free (0.5GB)
- Domain (.dk): ~80 DKK/year
- **Total: ~7 DKK/month**

### Production Stack
- Vercel Pro: $20/month
- Neon Pro: $19/month
- Domain: ~80 DKK/year
- **Total: ~$39/month + domain**

---

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs

---

Last updated: 2026-01-06
