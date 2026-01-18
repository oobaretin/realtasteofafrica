import fs from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()

const DEFAULT_BBOX = {
  // Houston metro-ish bounding box (minLat, minLon, maxLat, maxLon)
  minLat: 29.35,
  minLon: -95.95,
  maxLat: 30.25,
  maxLon: -94.95,
}

function parseArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function splitCuisine(rawCuisine) {
  const raw = String(rawCuisine ?? "").trim()
  if (!raw) return []
  // OSM cuisine tag often uses ; separated values
  const parts = raw
    .split(/[;,]/g)
    .map((s) => s.trim())
    .filter(Boolean)

  // Normalize common OSM tags to nicer display
  return parts.map((p) =>
    p
      .replace(/_/g, " ")
      .replace(/\bwest african\b/i, "West African")
      .replace(/\beast african\b/i, "East African")
      .replace(/\bnorth african\b/i, "North African")
      .replace(/\bsouth african\b/i, "South African")
  )
}

function asOptionalString(v) {
  const s = String(v ?? "").trim()
  return s ? s : ""
}

function csvEscape(value) {
  const s = String(value ?? "")
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsvRow(values) {
  return values.map(csvEscape).join(",")
}

function getTag(tags, keys) {
  for (const k of keys) {
    const v = tags?.[k]
    if (typeof v === "string" && v.trim()) return v.trim()
  }
  return ""
}

function buildOverpassQuery(bbox) {
  const cuisineRegex =
    "african|west_african|east_african|north_african|south_african|ethiopian|eritrean|nigerian|ghanaian|somali|kenyan|senegalese|moroccan|algerian|tunisian|cameroonian"

  // nwr = nodes/ways/relations
  // out center gives lat/lon for ways/relations
  return `
[out:json][timeout:40];
(
  nwr["amenity"="restaurant"]["cuisine"~"${cuisineRegex}",i](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
);
out tags center 250;
`.trim()
}

async function postOverpass(query) {
  const url = "https://overpass-api.de/api/interpreter"
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body: new URLSearchParams({ data: query }).toString(),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Overpass error ${res.status}: ${text.slice(0, 200)}`)
  }
  return await res.json()
}

function toRecord(el) {
  const tags = el.tags ?? {}
  const name = getTag(tags, ["name", "brand"])
  if (!name) return null

  const cuisines = splitCuisine(tags.cuisine)
  if (cuisines.length === 0) return null

  const city = getTag(tags, ["addr:city"])
  const state = getTag(tags, ["addr:state"]) || "TX"
  const street = getTag(tags, ["addr:street"])
  const house = getTag(tags, ["addr:housenumber"])
  const postcode = getTag(tags, ["addr:postcode"])
  const addressLine = [house, street].filter(Boolean).join(" ").trim() || getTag(tags, ["addr:full"]) || ""

  // If we can't form a usable address line, fall back to city/state
  const addressOut = addressLine || [city, state].filter(Boolean).join(", ")

  const phone = getTag(tags, ["contact:phone", "phone"])
  const websiteUrl = getTag(tags, ["contact:website", "website"])

  const lat = el.lat ?? el.center?.lat
  const lon = el.lon ?? el.center?.lon
  const mapsUrl =
    typeof lat === "number" && typeof lon === "number"
      ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`
      : ""

  // Map city to an areaSlug when possible; default to houston region
  const citySlug = slugify(city)
  const areaSlug =
    citySlug === "katy" || citySlug === "sugar-land" || citySlug === "pasadena"
      ? citySlug
      : "houston"

  const slug = slugify(`${name}-${city || "houston"}-${state}`)

  return {
    name,
    cuisines: cuisines.join("|"),
    areaSlug,
    city: city || "Houston",
    state,
    addressLine: addressOut,
    phone,
    websiteUrl,
    mapsUrl,
    priceLevel: "",
    highlights: "",
    writeUp: "",
    slug,
  }
}

async function main() {
  const outPath =
    parseArg("--out") || path.join(ROOT, "data", "restaurants.osm.csv")
  const bboxArg = parseArg("--bbox") // minLat,minLon,maxLat,maxLon

  const bbox = bboxArg
    ? (() => {
        const parts = bboxArg.split(",").map((n) => Number(n.trim()))
        if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
          throw new Error('Invalid --bbox. Expected "minLat,minLon,maxLat,maxLon"')
        }
        return { minLat: parts[0], minLon: parts[1], maxLat: parts[2], maxLon: parts[3] }
      })()
    : DEFAULT_BBOX

  const query = buildOverpassQuery(bbox)
  const json = await postOverpass(query)

  const rows = []
  const seen = new Set()

  for (const el of json.elements ?? []) {
    const r = toRecord(el)
    if (!r) continue
    if (seen.has(r.slug)) continue
    seen.add(r.slug)
    rows.push(r)
  }

  rows.sort((a, b) => a.name.localeCompare(b.name))

  const header = [
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
    "writeUp",
    "slug",
  ]

  const lines = [toCsvRow(header), ...rows.map((r) => toCsvRow(header.map((h) => r[h] ?? "")))]

  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, lines.join("\n") + "\n", "utf8")

  console.log(`OSM export: wrote ${rows.length} rows -> ${path.relative(ROOT, outPath)}`)
  console.log("Next: review the CSV (cleanup/correct), then run `npm run import:restaurants`.")
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

