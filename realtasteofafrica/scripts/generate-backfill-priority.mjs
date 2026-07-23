#!/usr/bin/env node
/**
 * Build data/backfill-priority.json — ranked list of listings needing data work.
 * Run: node scripts/generate-backfill-priority.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const OUT_PATH = path.resolve(ROOT, "data", "backfill-priority.json")

const COLLECTION_SLUGS = new Set([
  "chopnblok-montrose-houston-tx",
  "chopnblok-post-houston-tx",
  "aria-suya-kitchen-houston-tx",
  "taste-of-nigeria-houston-tx",
  "sarabell-calabar-restaurant-and-buffet-houston-tx",
  "glozi-calabar-restaurant-and-african-cuisine-houston-tx",
  "amala-zone-houston-tx",
  "makola-marketplace-houston-tx",
  "african-farms-houston",
  "sunrise-african-supermarket-houston",
  "motherland-african-food-market-houston",
  "g-and-j-african-market-houston",
  "royalminds-african-market-katy",
  "blessliz-african-market-mckinney-tx",
  "megenagna-mart-and-cafe-austin",
  "blessing-african-food-store-san-antonio",
])

function isTruthy(v) {
  return String(v ?? "").toLowerCase() === "true" || String(v ?? "").trim() === "1"
}

function gaps(row) {
  const missing = []
  if (!String(row.phone ?? "").trim()) missing.push("phone")
  if (!String(row.websiteUrl ?? "").trim()) missing.push("website")
  if (!String(row.latitude ?? "").trim() || !String(row.longitude ?? "").trim()) missing.push("coords")
  if (!String(row.writeUp ?? "").trim()) missing.push("writeUp")
  return missing
}

function score(row) {
  let s = 0
  if (isTruthy(row.isFeatured)) s += 100
  if (COLLECTION_SLUGS.has(String(row.slug ?? "").trim())) s += 80
  if (["houston", "katy", "sugar-land"].includes(String(row.areaSlug ?? ""))) s += 30
  if (row.areaSlug === "dfw") s += 25
  if (["austin", "central-texas"].includes(String(row.areaSlug ?? ""))) s += 20
  s += gaps(row).length * 8
  return s
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  const ranked = rows
    .map((row) => ({
      slug: row.slug,
      name: row.name,
      city: row.city,
      areaSlug: row.areaSlug,
      isFeatured: isTruthy(row.isFeatured),
      inCollection: COLLECTION_SLUGS.has(String(row.slug ?? "").trim()),
      missing: gaps(row),
      score: score(row),
    }))
    .filter((r) => r.missing.length > 0)
    .sort((a, b) => b.score - a.score)

  const summary = {
    generatedAt: new Date().toISOString(),
    totalListings: rows.length,
    needsWork: ranked.length,
    missingPhone: rows.filter((r) => !String(r.phone ?? "").trim()).length,
    missingWebsite: rows.filter((r) => !String(r.websiteUrl ?? "").trim()).length,
    missingCoords: rows.filter(
      (r) => !String(r.latitude ?? "").trim() || !String(r.longitude ?? "").trim()
    ).length,
    missingWriteUp: rows.filter((r) => !String(r.writeUp ?? "").trim()).length,
  }

  const payload = { summary, priority: ranked.slice(0, 100) }
  await fs.writeFile(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
  console.log(`Wrote ${path.relative(ROOT, OUT_PATH)} (${ranked.length} listings need work)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
