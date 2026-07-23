#!/usr/bin/env node
/**
 * Add short writeUp text for listings when missing.
 * Run: node scripts/backfill-writeups-csv.mjs
 *      node scripts/backfill-writeups-csv.mjs --dryRun
 *      node scripts/backfill-writeups-csv.mjs --fromPriority --limit=50
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const PRIORITY_PATH = path.resolve(ROOT, "data", "backfill-priority.json")

const COLLECTION_SLUGS = new Set([
  "chopnblok-montrose-houston-tx",
  "chopnblok-post-houston-tx",
  "aria-suya-kitchen-houston-tx",
  "red-sea-kitchen-ethiopian-food-truck-austin-tx",
  "wazobia-african-market-and-kitchen-houston-tx",
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
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null
}

async function loadTargetSlugs() {
  if (hasFlag("--fromPriority")) {
    const limit = parseLimitArg() ?? 50
    const json = JSON.parse(await fs.readFile(PRIORITY_PATH, "utf8"))
    const slugs = []
    for (const item of json.priority ?? []) {
      if (!item?.slug) continue
      if (Array.isArray(item.missing) && !item.missing.includes("writeUp")) continue
      slugs.push(String(item.slug).trim())
      if (slugs.length >= limit) break
    }
    return new Set(slugs)
  }
  return COLLECTION_SLUGS
}

function splitPipes(value) {
  return String(value ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildWriteUp(row) {
  const city = String(row.city ?? "").trim()
  const cuisine =
    String(row.cuisine ?? "").trim() ||
    splitPipes(row.cuisines)[0] ||
    "African"
  const category = String(row.category ?? "Restaurant").trim()
  const highlights = splitPipes(row.highlights).slice(0, 3)
  const hasWebsite = Boolean(String(row.websiteUrl ?? "").trim())
  const isMarket = /market/i.test(category) || /market/i.test(row.name ?? "")

  const lead = isMarket
    ? `${cuisine} market and grocery in ${city}, Texas — pantry staples, spices, and often ready-to-eat plates.`
    : `${cuisine} ${category.toLowerCase()} in ${city}, Texas.`

  const parts = [lead]
  if (highlights.length) {
    parts.push(`Highlights include ${highlights.join(", ")}.`)
  }
  parts.push(
    hasWebsite
      ? "Check their website for menus, hours, and ordering options."
      : "Call ahead to confirm hours and availability."
  )
  return parts.join(" ")
}

async function main() {
  const dryRun = hasFlag("--dryRun")
  const targetSlugs = await loadTargetSlugs()
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  let updated = 0

  for (const row of rows) {
    const slug = String(row.slug ?? "").trim()
    if (!targetSlugs.has(slug)) continue
    if (String(row.writeUp ?? "").trim()) continue

    const writeUp = buildWriteUp(row)
    if (dryRun) {
      console.log(`[dry-run] ${slug}:\n  ${writeUp}\n`)
      continue
    }
    row.writeUp = writeUp
    updated++
    console.log(`Updated writeUp: ${slug}`)
  }

  if (dryRun) return

  const columns = Object.keys(rows[0])
  const output = stringify(rows, { header: true, columns, quoted_empty: false, quoted_string: true })
  await fs.writeFile(CSV_PATH, output, "utf8")
  console.log(`Done. Added ${updated} writeUp(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
