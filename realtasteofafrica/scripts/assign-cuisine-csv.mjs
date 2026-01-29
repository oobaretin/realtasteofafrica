/**
 * Adds a 'cuisine' column to restaurants.csv derived from restaurant name.
 * Rules: Ethiopian (Ethiopian, Blue Nile, Lalibela, Addis) → Ghanaian (Afrikiko) → Nigerian (Suya, Lagos, Abula, Nigeria, ChòpnBlọk) → default West African.
 * Run from repo root: node scripts/assign-cuisine-csv.mjs
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
  "cuisine",
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

function normalizeForMatch(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
}

function nameContains(name, needles) {
  const n = normalizeForMatch(name)
  return needles.some((needle) => n.includes(normalizeForMatch(needle)))
}

function getCuisineFromName(name) {
  const n = String(name ?? "").trim()
  if (nameContains(n, ["Ethiopian", "Blue Nile", "Lalibela", "Addis"])) return "Ethiopian"
  if (nameContains(n, ["Afrikiko"])) return "Ghanaian"
  if (
    nameContains(n, ["Suya", "Lagos", "Abula", "Nigeria"]) ||
    name.includes("ChòpnBlọk") ||
    name.includes("ChopnBlok")
  )
    return "Nigerian"
  return "West African"
}

async function main() {
  const csv = await fs.readFile(INPUT, "utf8")
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const withCuisine = records.map((row) => ({
    ...row,
    cuisine: getCuisineFromName(row.name),
  }))

  const lines = [HEADERS.join(",")]
  for (const row of withCuisine) {
    const values = HEADERS.map((h) => escapeCsvField(row[h]))
    lines.push(values.join(","))
  }

  await fs.writeFile(OUTPUT, lines.join("\n"), "utf8")

  const counts = {}
  withCuisine.forEach((r) => {
    counts[r.cuisine] = (counts[r.cuisine] || 0) + 1
  })
  console.log("Cuisine counts:", counts)
  console.log(`Wrote cuisine column to ${path.relative(ROOT, OUTPUT)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
