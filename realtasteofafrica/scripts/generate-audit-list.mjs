/**
 * Generates audit_list.json from restaurants.csv for manual audit tracking.
 * Structure: name, city, type, status, verified, region, slug (for reference).
 *
 * Run from project root: node scripts/generate-audit-list.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const OUTPUT_PATH = path.resolve(ROOT, "data", "audit_list.json")

const AREA_TO_REGION = {
  houston: "Gulf Coast",
  katy: "Gulf Coast",
  "sugar-land": "Gulf Coast",
  dfw: "North Texas",
  austin: "Central Texas",
  "central-texas": "Central Texas",
  "san-antonio": "South Central",
  "west-texas": "West Texas",
  "el-paso": "West Texas",
  "south-texas": "South Texas",
}

const VALID_TYPES = ["Restaurant", "Food Truck", "Market", "Market + Kitchen", "Ghost Kitchen"]
const DEFAULT_TYPE = "Restaurant"

function getType(row) {
  const cat = String(row.category ?? "").trim()
  if (VALID_TYPES.includes(cat)) return cat
  const name = String(row.name ?? "").toLowerCase()
  const highlights = String(row.highlights ?? "").toLowerCase()
  if (name.includes("ghost") || highlights.includes("ghost")) return "Ghost Kitchen"
  if (name.includes("food truck") || highlights.includes("food truck")) return "Food Truck"
  return DEFAULT_TYPE
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  const list = rows.map((row) => {
    const city = String(row.city ?? "").trim()
    const areaSlug = String(row.areaSlug ?? "").trim()
    const verified =
      String(row.internal_verified ?? row.internalVerified ?? "").toLowerCase() === "true" ||
      String(row.internal_verified ?? row.internalVerified ?? "").trim() === "1"
    return {
      name: String(row.name ?? "").trim(),
      city,
      type: getType(row),
      status: "active",
      verified,
      region: AREA_TO_REGION[areaSlug] ?? (areaSlug || "—"),
      slug: String(row.slug ?? "").trim(),
    }
  })

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(list, null, 2), "utf8")
  console.log(`Wrote ${list.length} entries -> ${path.relative(ROOT, OUTPUT_PATH)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
