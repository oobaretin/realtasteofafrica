# Real Taste of Africa — Houston-first

Modern, UX-first web app for an **African restaurant directory**. Starting with **Houston, Texas + neighboring cities**, built to expand nationwide over time.

## Tech

- Next.js (App Router) + TypeScript
- Tailwind CSS
- ESLint (Next.js config)

## Run locally

```bash
cd realtasteofafrica
npm install
npm run import:restaurants
npm run dev
```

Then open `http://localhost:3000`.

## Project structure

- `src/app/`: routes (Home, Browse, Area pages, Restaurant detail, Submit, Contact)
- `src/components/`: UI building blocks + header/footer
- `src/lib/`: areas + directory logic

## Real data (no paid APIs)

We seed real restaurant listings from a CSV (Google Sheets friendly):

1. Update `data/restaurants.csv` (you can export from Google Sheets as CSV).
2. Generate app data:

```bash
npm run import:restaurants
```

This generates `src/data/restaurants.generated.ts`, which the app uses at runtime.

## Optional: bootstrap listings from OpenStreetMap (free)

You can pull an initial set of African-cuisine restaurants from OSM (Overpass API) and export to CSV:

```bash
npm run fetch:restaurants:osm
```

This writes `data/restaurants.osm.csv`. Review/clean it (OSM data can be incomplete), then copy the rows you want into `data/restaurants.csv` and run:

```bash
npm run import:restaurants
```

To use a custom bounding box:

```bash
npm run fetch:restaurants:osm -- --bbox "29.35,-95.95,30.25,-94.95"
```

