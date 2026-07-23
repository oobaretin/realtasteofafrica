#!/usr/bin/env node
/**
 * Add Google Maps search URLs for listings missing websiteUrl.
 * Run: node scripts/backfill-website-urls-csv.mjs --limit=50
 *      node scripts/backfill-website-urls-csv.mjs --dryRun --limit=50
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")

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

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function parseLimitArg() {
  const raw = process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1]
  if (!raw) return 50
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 50
}

function isTruthy(v) {
  return String(v ?? "").toLowerCase() === "true" || String(v ?? "").trim() === "1"
}

function score(row) {
  let s = 0
  if (isTruthy(row.isFeatured)) s += 100
  if (COLLECTION_SLUGS.has(String(row.slug ?? "").trim())) s += 80
  if (["houston", "katy", "sugar-land"].includes(String(row.areaSlug ?? ""))) s += 30
  if (row.areaSlug === "dfw") s += 25
  if (["austin", "central-texas"].includes(String(row.areaSlug ?? ""))) s += 20
  return s
}

function toGoogleMapsUrl(name, city) {
  const q = encodeURIComponent(`${String(name ?? "").trim()} ${String(city ?? "").trim()} TX`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

async function main() {
  const dryRun = hasFlag("--dryRun")
  const limit = parseLimitArg()
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  const targets = rows
    .filter((row) => !String(row.websiteUrl ?? "").trim())
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit)

  let updated = 0
  for (const row of targets) {
    const url = toGoogleMapsUrl(row.name, row.city)
    if (dryRun) {
      console.log(`[dry-run] ${row.slug}: ${url}`)
      continue
    }
    row.websiteUrl = url
    updated++
    console.log(`Updated websiteUrl: ${row.slug}`)
  }

  if (dryRun) return

  const columns = Object.keys(rows[0])
  const output = stringify(rows, { header: true, columns, quoted_empty: false, quoted_string: true })
  await fs.writeFile(CSV_PATH, output, "utf8")
  console.log(`Done. Added ${updated} website URL(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
