/**
 * Adds a 'category' column to restaurants.csv per the provided assignments.
 * Run from repo root: node scripts/assign-category-csv.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const INPUT = path.resolve(ROOT, "data", "restaurants.csv")
const OUTPUT = path.resolve(ROOT, "data", "restaurants.csv")

const HEADERS = [
  "name",
  "cuisines",
  "areaSlug",
  "city",
  "state",
  "addressLine",
  "phone",
  "websiteUrl",
  "mapsUrl",
  "priceLevel",
  "highlights",
  "category",
  "writeUp",
  "slug",
]

function escapeCsvField(value) {
  const s = String(value ?? "").trim()
  if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function normalizeName(name) {
  return String(name ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

function nameMatches(rowName, patterns) {
  const n = normalizeName(rowName)
  return patterns.some((p) => n.includes(normalizeName(p)) || normalizeName(p).includes(n))
}

const FOOD_TRUCK_PATTERNS = [
  "Rhosabjal Cuisine",
  "South African Food Affair",
  "Red Sea Kitchen",
  "Freshnez Kitchen",
]

const GHOST_KITCHEN_PATTERNS = [
  "Dakar Street Food",
  "Aria Suya (Wilcrest",
  "Wilcrest Ghost",
  "Dupsy's Kitchen",
]

const MARKET_PATTERNS = [
  "God Grace African Market",
  "God Grace",
  "JC African",
  "Nigerian Restaurant / African Market",
]

const MARKET_PLUS_KITCHEN_PATTERNS = [
  "Marhaba Eritrean",
  "Marhaba",
  "Wazobia African Market & Kitchen",
  "Bodija Foods",
  "Blessliz African Market",
  "Southwest Farmers Market & Kitchen",
  "Southwest Farmers Kitchen",
  "Aso Rock Market",
  "Makola Marketplace",
  "Holyland Halal",
  "Anointed Cuisine A Taste of Africa",
  "Anointed Cuisine",
]

function getCategory(row) {
  const name = String(row.name ?? "").trim()
  if (nameMatches(name, FOOD_TRUCK_PATTERNS)) return "Food Truck"
  if (nameMatches(name, GHOST_KITCHEN_PATTERNS)) return "Ghost Kitchen"
  if (nameMatches(name, MARKET_PATTERNS)) return "Market"
  if (nameMatches(name, MARKET_PLUS_KITCHEN_PATTERNS)) return "Market + Kitchen"
  return "Restaurant"
}

async function main() {
  const csv = await fs.readFile(INPUT, "utf8")
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const withCategory = records.map((row) => ({
    ...row,
    category: getCategory(row),
  }))

  const lines = [HEADERS.join(",")]
  for (const row of withCategory) {
    const values = HEADERS.map((h) => escapeCsvField(row[h]))
    lines.push(values.join(","))
  }

  await fs.writeFile(OUTPUT, lines.join("\n"), "utf8")

  const counts = { "Food Truck": 0, "Ghost Kitchen": 0, Market: 0, "Market + Kitchen": 0, Restaurant: 0 }
  withCategory.forEach((r) => {
    counts[r.category] = (counts[r.category] || 0) + 1
  })
  console.log("Category counts:", counts)
  console.log(`Wrote category column to ${path.relative(ROOT, OUTPUT)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
