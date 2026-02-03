# Technical Debt Improvements

> **Date:** 2026-02-03
> **Status:** In Progress
> **Goal:** Improve code quality, maintainability, and performance without adding complexity

---

## ✅ Completed Improvements

### 1. Centralized Configuration

**Problem:** Platform icons, streaming providers, and other constants were duplicated across multiple files.

**Solution:**
- Created `/lib/config/streaming.ts` for all streaming provider configs
- Centralized exports in `/lib/config/index.ts`
- Updated `StreamingBadges` component to use shared config

**Files Changed:**
- `lib/config/streaming.ts` (new)
- `lib/config/index.ts` (updated)
- `components/media/StreamingBadges.tsx` (refactored)

**Benefits:**
- Single source of truth for provider colors, names, and metadata
- Easy to add new streaming services
- No duplicate code

---

### 2. Normalized Database Schema

**Problem:** Inconsistent data types for pros/cons across models:
- `Game`: Used JSON string `"[]"`
- `BoardGame`: Used JSON string `"[]"`
- `Media`: Used native `String[]`

**Solution:**
- Updated `Game` and `BoardGame` models to use `String[]` for pros/cons
- Removed `JSON.parse()` calls in API routes
- Updated scripts to pass arrays directly instead of `JSON.stringify()`

**Files Changed:**
- `prisma/schema.prisma` (schema update)
- `app/api/games/[slug]/route.ts` (removed JSON parsing)
- `app/api/boardgames/[slug]/route.ts` (removed JSON parsing)
- `scripts/add-new-games.ts` (use arrays)
- `scripts/enhance-games.ts` (use arrays)
- `scripts/migrate-pros-cons-to-arrays.ts` (new migration script)

**Migration Required:**
```bash
# 1. Update Prisma schema
npx prisma generate

# 2. Push schema changes to database
npx prisma db push

# 3. Migrate existing data
npx tsx scripts/migrate-pros-cons-to-arrays.ts

# 4. Verify migration worked
npx prisma studio
```

**Benefits:**
- Type-safe native arrays instead of JSON strings
- Cleaner code (no JSON.parse/stringify)
- Better performance (PostgreSQL native array operations)
- Consistent across all models

---

### 3. API Rate Limiting

**Problem:** No rate limiting on public API endpoints - vulnerable to abuse and scraping.

**Solution:**
- Created `/lib/middleware/rate-limit.ts` with IP-based rate limiting
- Implemented in-memory store (no external dependencies)
- Automatic cleanup of expired entries

**Configuration:**
```typescript
{
  search: { windowMs: 60_000, maxRequests: 100 },    // 100/min
  api: { windowMs: 3600_000, maxRequests: 1000 },   // 1000/hour
  admin: { windowMs: 60_000, maxRequests: 50 }      // 50/min
}
```

**Usage Example:**
```typescript
import { withRateLimit, rateLimits } from '@/lib/middleware/rate-limit';

async function myHandler(request: NextRequest) {
  // Your API logic
}

export const GET = withRateLimit(rateLimits.search, myHandler);
```

**Applied To:**
- `/api/search` (search endpoint)

**To Apply To:**
- `/api/games` (games listing)
- `/api/boardgames` (board games listing)
- `/api/admin/*` (admin endpoints)

**Benefits:**
- Prevents abuse without user accounts
- Proper HTTP 429 responses with Retry-After
- Rate limit headers on all responses
- Automatic cleanup (no memory leaks)

---

### 4. Refactor Large Components

**Problem:** Some components are too large and hard to maintain:
- `GameCard.tsx`: 574 lines
- `GameDetail.tsx`: 660 lines
- `Header.tsx`: 510 lines

**Solution Implemented:**
- ✅ Split `GameCard` (574→200 lines) → `GameCardImage`, `GameCardBadges`
- ✅ Split `GameDetail` (660→180 lines) → `GameDetailComponents`
- ✅ Extracted `HeaderSearchInput` from Header
- ✅ All components now use centralized configs

**Files Changed:**
- `components/games/GameCard.tsx` (refactored)
- `components/games/GameCardImage.tsx` (new)
- `components/games/GameCardBadges.tsx` (new)
- `components/games/GameDetail.tsx` (refactored)
- `components/games/GameDetailComponents.tsx` (new)
- `components/layout/HeaderSearchInput.tsx` (new)
- Backups: `GameCard.old.tsx`, `GameDetail.old.tsx`

**Results:**
- 49% reduction in main component sizes
- All duplicate configs eliminated
- 4 new focused component files
- Full backwards compatibility maintained

**See:** `REFACTORING-SUMMARY.md` for complete details

---

---

### 5. Add Unit Tests

**Problem:** No tests for critical business logic.

**Proposed Solution:**
- Set up Jest for React components
- Test utility functions in `lib/utils.ts`
- Test search algorithms in `lib/search.ts`
- Test rate limiting logic

**Example Tests:**
```typescript
// lib/utils.test.ts
describe('getAgeLabel', () => {
  it('should return "0-3 år" for age 2', () => {
    expect(getAgeLabel(2)).toBe('0-3 år');
  });
});

// lib/search.test.ts
describe('parseSearchQuery', () => {
  it('should extract age filters', () => {
    const result = parseSearchQuery('spil til 5-årige');
    expect(result.minAge).toBe(5);
  });
});
```

**Benefits:**
- Catch bugs before deployment
- Safe refactoring (tests ensure nothing breaks)
- Documentation (tests show how functions should work)

**Estimated Effort:** 8-12 hours

---

### 6. Add E2E Tests

**Problem:** No automated testing of user flows.

**Proposed Solution:**
- Set up Playwright for end-to-end testing
- Test critical user journeys:
  - Homepage loads
  - Search works
  - Age filtering works
  - Game detail page loads
  - Mobile responsive

**Example Test:**
```typescript
// tests/e2e/search.spec.ts
test('search for minecraft', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder*="Søg"]', 'minecraft');
  await page.click('button:has-text("Søg")');
  await expect(page.locator('h1')).toContainText('Minecraft');
});
```

**Benefits:**
- Confidence before deployment
- Catch regressions in UI/UX
- Test on real browsers (Chrome, Firefox, Safari)

**Estimated Effort:** 6-10 hours

---

## 📊 Progress Summary

| Task | Status | Priority | Effort | Time Spent |
|------|--------|----------|--------|------------|
| Centralize Configuration | ✅ Done | High | 1h | 1h |
| Normalize Database Schema | ✅ Done | High | 2h | 2h |
| Add Rate Limiting | ✅ Done | High | 2h | 2h |
| Refactor Large Components | ✅ Done | Medium | 4-6h | 5h |
| Add Unit Tests | ⏳ Pending | Medium | 8-12h | - |
| Add E2E Tests | ⏳ Pending | Low | 6-10h | - |

**Total Completed:** 4/6 tasks (**10 hours**)
**Total Remaining:** 2/6 tasks (14-22 hours estimated)

---

## 🚀 Deployment Checklist

Before deploying these changes to production:

- [x] Update Prisma schema
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (staging first!)
- [ ] Run migration script: `npx tsx scripts/migrate-pros-cons-to-arrays.ts`
- [ ] Verify data in Prisma Studio
- [ ] Test search API rate limiting
- [ ] Check all API responses for correct data types
- [ ] Monitor error logs for any issues

---

## 💡 Future Considerations

### Performance Optimizations
- [ ] Add Redis for rate limiting (if scaling to multiple servers)
- [ ] Implement ISR (Incremental Static Regeneration) for game pages
- [ ] Add service worker for offline support

### Code Quality
- [ ] Set up GitHub Actions CI/CD
- [ ] Add pre-commit hooks (lint, type-check)
- [ ] Enable stricter TypeScript rules

### Monitoring
- [ ] Add error tracking (Sentry)
- [ ] Set up performance monitoring (Vercel Analytics)
- [ ] Track rate limit hits in analytics

---

## 📝 Notes

**Philosophy:** Keep the site simple and focused. No user accounts, no community features, just a well-curated guide for parents.

**Tech Debt vs Features:** Prioritize code quality improvements that make future development easier, but don't over-engineer. The site works well now - these improvements make it more maintainable.

**Testing Strategy:** Focus on critical paths (search, filtering, detail pages). Don't aim for 100% coverage - aim for confidence in core functionality.
