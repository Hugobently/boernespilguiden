# End-to-End Tests

This directory contains Playwright E2E tests for Børnespilguiden.

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/homepage.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed
```

## Test Coverage

### Homepage Tests (`homepage.spec.ts`)
- Homepage loads correctly
- Search bar works
- Featured games display
- Mobile responsive navigation

### Search Tests (`search.spec.ts`)
- Basic search functionality
- Search suggestions
- Age group filtering
- Category filtering

### Game Detail Tests (`game-detail.spec.ts`)
- Game detail pages load
- Game information sections display
- Download/play links work
- Board game pages load

### UI and Mobile Tests (`ui-and-mobile.spec.ts`)
- Mobile viewport (375px)
- Tablet viewport (768px)
- Desktop viewport (1920px)
- Cookie consent handling
- TV & Film section

## CI/CD Integration

These tests can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

## Notes

- Tests use `localhost:3000` as base URL
- Dev server starts automatically before tests
- Tests are designed to be resilient to UI changes
- Some tests may need adjustment based on actual data
