import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
function parseArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

const INPUT = path.resolve(ROOT, parseArg("--input") || path.join("data", "restaurants.csv"))
const OUTPUT = path.resolve(
  ROOT,
  parseArg("--output") || path.join("src", "data", "restaurants.generated.ts")
)

const REQUIRED_HEADERS = [
  "name",
  "cuisines",
  "areaSlug",
  "city",
  "state",
  "addressLine",
  "highlights",
]

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function splitPipes(value) {
  const raw = String(value ?? "").trim()
  if (!raw) return []
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
}

function asOptionalString(value) {
  const s = String(value ?? "").trim()
  return s ? s : undefined
}

function toOsmSearchUrl(query) {
  const q = String(query ?? "").trim()
  if (!q) return undefined
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`
}

function isLikelyStreetAddress(addressLine) {
  const s = String(addressLine ?? "").trim()
  if (!s) return false
  // Heuristic: "real" addresses almost always have a number or common street tokens.
  return (
    /\d/.test(s) ||
    /\b(street|st|road|rd|avenue|ave|boulevard|blvd|drive|dr|lane|ln|pkwy|parkway|hwy|highway|suite|ste|unit|#)\b/i.test(
      s
    )
  )
}

function normalizeAddressLine(addressLine, city, state) {
  const addr = String(addressLine ?? "").trim()
  if (!addr) return addr

  const cityNorm = String(city ?? "").trim()
  const stateNorm = String(state ?? "").trim()

  // If the address is only a city/state placeholder, make it explicit for UX.
  const isCityOnly =
    (cityNorm &&
      (addr === `${cityNorm}, ${stateNorm}` ||
        (stateNorm === "TX" && addr === `${cityNorm}, TX`))) ||
    (stateNorm === "TX" && /,\s*TX\s*$/i.test(addr) && !isLikelyStreetAddress(addr))

  if (isCityOnly && !/\(check maps\)/i.test(addr)) {
    return `${addr} (check maps)`
  }

  return addr
}

function normalizeWriteUp(value) {
  const raw = String(value ?? "").trim()
  if (!raw) return undefined
  // Allow users to type "\n" in Sheets and keep it readable in UI
  const withNewlines = raw.replace(/\\n/g, "\n")
  return withNewlines.trim() || undefined
}

function asOptionalPriceLevel(value) {
  const s = String(value ?? "").trim()
  if (!s) return undefined
  const n = Number(s)
  if (![1, 2, 3, 4].includes(n)) {
    throw new Error(`Invalid priceLevel "${s}" (expected 1-4)`)
  }
  return n
}

function assertHeaders(headers) {
  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h))
  if (missing.length) {
    throw new Error(
      `Missing required CSV headers: ${missing.join(", ")}. ` +
        `Found: ${headers.join(", ")}`
    )
  }
}

function toRestaurantRecord(row, idx) {
  const name = String(row.name ?? "").trim()
  const city = String(row.city ?? "").trim()
  const state = String(row.state ?? "").trim()

  if (!name) throw new Error(`Row ${idx}: name is required`)
  if (!row.areaSlug?.trim()) throw new Error(`Row ${idx}: areaSlug is required`)
  if (!city) throw new Error(`Row ${idx}: city is required`)
  if (!state) throw new Error(`Row ${idx}: state is required`)
  if (!row.addressLine?.trim())
    throw new Error(`Row ${idx}: addressLine is required`)

  const cuisines = splitPipes(row.cuisines)
  if (cuisines.length === 0)
    throw new Error(`Row ${idx}: cuisines is required (use "A|B|C")`)

  // highlights is recommended for UX, but may be missing for auto-imported sources.
  // Fallback: reuse cuisines as highlights so the UI stays populated.
  const highlights = splitPipes(row.highlights)
  const finalHighlights = highlights.length ? highlights : cuisines.slice(0, 3)

  const slugFromCsv = String(row.slug ?? "").trim()
  const slug = slugFromCsv ? slugify(slugFromCsv) : slugify(`${name}-${city}`)
  if (!slug) throw new Error(`Row ${idx}: slug could not be generated`)

  const addressLine = normalizeAddressLine(row.addressLine, city, state)
  const mapsQuery = isLikelyStreetAddress(addressLine)
    ? `${addressLine}, ${city}, ${state}`
    : `${name} ${city} ${state}`

  return {
    slug,
    name,
    cuisines,
    areaSlug: String(row.areaSlug).trim(),
    city,
    state,
    addressLine,
    phone: asOptionalString(row.phone),
    websiteUrl: asOptionalString(row.websiteUrl),
    mapsUrl: asOptionalString(row.mapsUrl) ?? toOsmSearchUrl(mapsQuery),
    priceLevel: asOptionalPriceLevel(row.priceLevel),
    highlights: finalHighlights,
    writeUp: normalizeWriteUp(row.writeUp),
  }
}

function formatTs(restaurants) {
  const lines = []
  lines.push("/**")
  lines.push(" * AUTO-GENERATED FILE — DO NOT EDIT.")
  lines.push(' * Run: `npm run import:restaurants`')
  lines.push(" */")
  lines.push("")
  lines.push('import type { Restaurant } from "@/lib/restaurants"')
  lines.push("")
  lines.push("export const RESTAURANTS: Restaurant[] = [")
  for (const r of restaurants) {
    lines.push(`  ${JSON.stringify(r, null, 2).replace(/\n/g, "\n  ")},`)
  }
  lines.push("]")
  lines.push("")
  return lines.join("\n")
}

async function main() {
  const csv = await fs.readFile(INPUT, "utf8")
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const headers = records.length ? Object.keys(records[0]) : []
  assertHeaders(headers)

  const restaurants = records.map((row, i) => toRestaurantRecord(row, i + 2))

  const slugs = new Set()
  for (const r of restaurants) {
    if (slugs.has(r.slug)) throw new Error(`Duplicate slug: "${r.slug}"`)
    slugs.add(r.slug)
  }

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true })
  await fs.writeFile(OUTPUT, formatTs(restaurants), "utf8")

  console.log(`Imported ${restaurants.length} restaurants -> ${path.relative(ROOT, OUTPUT)}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

