# Google Maps Audit Guide

Use this guide to verify restaurant status (open, temporarily closed, permanently closed) and find new listings.

## 1. Audit existing listings for "Temporarily Closed"

### Quick start

```bash
node scripts/audit-batch-html.mjs
```

Then open `data/audit-batch.html` in your browser. Open DevTools Console (Cmd+Option+J or F12) and run:

```javascript
auditBatch(0, 10)   // Opens first 10 restaurants in Google Maps
auditBatch(10, 10)  // Next 10
auditBatch(20, 10)  // etc.
```

Scan each tab — Google Maps shows "Temporarily closed" or "Permanently closed" when applicable.

**If a place is closed:** Remove it from `data/restaurants.csv`, then run `npm run import:restaurants`.

### Research findings (2025)

| Restaurant | City | Status | Action |
|------------|------|--------|--------|
| **Vizo's African Bar & Restaurant** | Lubbock | Temporarily closed through early 2025 | Verify on Google Maps; consider adding note or removing if extended |
| **Eko African Kitchen** | Houston | Permanently closed | Not in directory ✓ |
| **Wasota African Cuisine** | Austin | Permanently closed | Not in directory ✓ |
| **Dimba's Chicken and Seafood** | Lubbock | Closed through 2025 (major repairs) | Not in directory ✓ |

---

## 2. Find new African restaurants

### Google search queries (run in incognito for fresh results)

**By city:**
- `site:google.com/maps "African restaurant" Houston Texas`
- `site:google.com/maps "Nigerian" OR "Ethiopian" OR "West African" Dallas Texas`
- `site:google.com/maps "African" Austin Texas`

**By platform:**
- `site:yelp.com "African" "Houston"`
- `site:yelp.com "Nigerian" "Dallas"`
- `site:instagram.com "African restaurant" "San Antonio"`

**Recently opened:**
- `"Grand Opening" African Restaurant Texas 2025`
- `"New" Nigerian restaurant Houston 2025`

### Potential new additions (2025 research)

| Restaurant | Location | Notes |
|------------|----------|-------|
| **Osuma Suya (Euless)** | 918 E Harwood Rd #B, Euless | ✓ Already in directory |
| **Osuma Suya (Austin – Tech Ridge)** | Austin | Coming soon — add when open |

---

## 3. Workflow

1. **Audit closed:** Run `audit-batch-html.mjs`, verify in batches, remove closed listings.
2. **Find new:** Use search queries above; add matches to `data/restaurants.csv`.
3. **Regenerate:** Run `npm run import:restaurants`.
4. **Deploy:** Push changes to trigger Vercel deploy.
