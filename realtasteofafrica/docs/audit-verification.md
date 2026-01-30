# Audit Checklist & Manual Verification

## Known potential duplicates (review manually)

- **Aria Suya:** "Aria Suya Kitchen," "Aria Nigerian Suya Kitchen," "Aria Suya (Wilcrest Ghost)" — may be 2–3 locations or same brand; confirm if Wilcrest is prep site only.
- **Abula HotPot:** Listed twice (one at Richmond Ave); confirm if same business or two locations.
- **Lady T Kitchen:** Austin and Pflugerville — two locations; keep both.
- **Southwest Farmers Market:** 8+ entries by city (Arlington, Austin, San Antonio, Houston, Frisco, Garland, etc.); confirm each location’s kitchen is still operating.

Use `node scripts/find-duplicates.mjs` for same-address, same-phone, and name-similarity flags. Use `node scripts/data-integrity.mjs` for same-name+city (including normalized names like "Abula Hot Pot" vs "Abula HotPot").

---

# Manual "Strictly Statewide" Verification (No-API Method)

Use these steps to reduce "Out of Business" listings and keep the directory accurate.

## 1. Search by city (Facebook)

African restaurants in Texas often update **Facebook** more than their websites.

- **Search:** `site:facebook.com "African Restaurant" [City Name]`
- **Rule of thumb:** If a page hasn’t posted since 2022, the business may be closed. Note for removal or follow-up.

## 2. Verify "Market + Kitchen" spots

Markets with a kitchen (e.g. Southwest Farmers Market) change often.

- Call **2–3** Southwest Farmers Market locations and confirm the kitchen side is still operating.
- Update or remove listings if a location no longer serves food.

## 3. Check ghost kitchens

Ghost kitchens (e.g. Blodgett St in Houston) rotate brands every 6 months.

- Search the **address** (e.g. 2616 Blodgett St, Houston) to see current tenants.
- Confirm brands like **Dakar Street Food** are still active at that address before keeping the listing.

## 4. After manual checks

- Remove or mark closed listings in `data/restaurants.csv`.
- Set `internal_verified: true` (or use `scripts/set-internal-verified.mjs`) for listings you’ve confirmed.
- Re-run `npm run import:restaurants` and regenerate `data/audit_list.json` with `node scripts/generate-audit-list.mjs` if needed.
