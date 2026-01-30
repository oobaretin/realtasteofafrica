/**
 * Data integrity: duplicates (same name + city), standardize names, type/region.
 * Does NOT modify CSV by default; use --fix to apply name standardization and region.
 *
 * Run from project root: node scripts/data-integrity.mjs [--fix]
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const fix = process.argv.includes("--fix")

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

function standardizeName(name) {
  if (!name || typeof name !== "string") return name
  let s = name.trim()
  s = s.replace(/\s*,\s*LLC\s*$/i, "")
  s = s.replace(/\s*,\s*Inc\.?\s*$/i, "")
  s = s.replace(/\s+LLC\s*$/i, "")
  s = s.replace(/\s+Inc\.?\s*$/i, "")
  s = s.replace(/\s*\.\s*$/, "")
  return s.trim()
}

function getTypeFromNameOrHighlights(row) {
  const name = String(row.name ?? "").toLowerCase()
  const highlights = String(row.highlights ?? "").toLowerCase()
  if (name.includes("ghost") || highlights.includes("ghost kitchen")) return "Ghost Kitchen"
  if (name.includes("food truck") || highlights.includes("food truck")) return "Food Truck"
  return null
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const headers = rows.length ? Object.keys(rows[0]) : []

  // Normalize name for duplicate key: strip LLC/Inc, lowercase, remove spaces/punctuation so "Abula Hot Pot" ≈ "Abula HotPot"
  function norm(s) {
    const t = standardizeName(String(s ?? "").toLowerCase()).replace(/\s+/g, " ").trim()
    return t.replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
  }
  console.log("=== 1. Duplicates (same name + same city) ===\n")
  const byKey = new Map()
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const name = String(r.name ?? "").trim()
    const city = String(r.city ?? "").trim()
    const key = `${norm(name)}|${city.toLowerCase()}`
    if (!byKey.has(key)) byKey.set(key, [])
    byKey.get(key).push({ index: i + 2, ...r })
  }
  let dupCount = 0
  for (const [key, list] of byKey) {
    if (list.length < 2) continue
    dupCount++
    const city = list[0].city
    console.log(`Same name in ${city} (${list.length} entries):`)
    list.forEach((x) => console.log(`  - "${x.name}"  ${x.addressLine ?? "(no address)"}  slug: ${x.slug}  line ~${x.index}`))
    console.log("  -> If same address, merge. If different addresses, keep both.\n")
  }
  if (dupCount === 0) console.log("None found.\n")

  console.log("=== 2. Name standardization (LLC, Inc., trailing punctuation) ===\n")
  const nameChanges = []
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const before = String(r.name ?? "").trim()
    const after = standardizeName(before)
    if (after !== before) nameChanges.push({ index: i + 2, before, after, slug: r.slug })
  }
  nameChanges.forEach((x) => console.log(`  "${x.before}" -> "${x.after}"  (slug: ${x.slug})`))
  if (nameChanges.length === 0) console.log("  None needed.\n")
  else console.log("")

  console.log("=== 3. Type flag (name/highlights say Ghost or Food Truck) ===\n")
  const typeFlags = []
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const suggested = getTypeFromNameOrHighlights(r)
    if (!suggested) continue
    const current = String(r.category ?? "").trim()
    if (current !== suggested)
      typeFlags.push({ index: i + 2, name: r.name, slug: r.slug, current: current || "(empty)", suggested })
  }
  typeFlags.forEach((x) => console.log(`  ${x.name}  current: ${x.current}  -> set to: ${x.suggested}  (slug: ${x.slug})`))
  if (typeFlags.length === 0) console.log("  All already match.\n")
  else console.log("")

  console.log("=== 4. Region (from areaSlug) ===\n")
  const missingRegion = rows.filter((r) => !AREA_TO_REGION[r.areaSlug?.trim()])
  if (missingRegion.length) {
    console.log(`  Entries with unknown areaSlug: ${missingRegion.length}`)
    missingRegion.slice(0, 10).forEach((r) => console.log(`    ${r.name}  areaSlug: "${r.areaSlug}"`))
    if (missingRegion.length > 10) console.log(`    ... and ${missingRegion.length - 10} more`)
  } else console.log("  All areaSlugs map to a region.\n")

  if (fix) {
    if (!headers.includes("region")) headers.push("region")
    const out = rows.map((row) => {
      const newRow = { ...row }
      newRow.name = standardizeName(row.name) ?? row.name
      newRow.region = AREA_TO_REGION[String(row.areaSlug ?? "").trim()] ?? ""
      const suggestedType = getTypeFromNameOrHighlights(row)
      if (suggestedType && VALID_TYPES.includes(suggestedType)) newRow.category = suggestedType
      return newRow
    })
    const csvOut = stringify(out, { header: true, columns: headers })
    await fs.writeFile(CSV_PATH, csvOut, "utf8")
    console.log("=== Applied --fix: standardized names, set region column, aligned Ghost/Food Truck type. ===\n")
    console.log(`Wrote ${path.relative(ROOT, CSV_PATH)}`)
  } else {
    console.log("Run with --fix to apply name standardization, add region column, and align type for Ghost/Food Truck.")
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
