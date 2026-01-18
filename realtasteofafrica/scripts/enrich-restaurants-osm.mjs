import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

/**
 * Enrich `data/restaurants.csv` from OpenStreetMap (Overpass):
 * - Fill missing phone / websiteUrl / mapsUrl (only when those fields are empty)
 * - Optionally add delivery/takeout highlights if OSM tags indicate it
 *
 * Usage:
 *   node scripts/enrich-restaurants-osm.mjs
 *   node scripts/enrich-restaurants-osm.mjs --area houston
 *   node scripts/enrich-restaurants-osm.mjs --onlyMissing phone,websiteUrl
 *   node scripts/enrich-restaurants-osm.mjs --dryRun
 */

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

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function norm(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function asCleanString(value) {
  const s = String(value ?? "").trim()
  return s ? s : ""
}

function getTag(tags, keys) {
  for (const k of keys) {
    const v = tags?.[k]
    if (typeof v === "string" && v.trim()) return v.trim()
  }
  return ""
}

function csvEscape(value) {
  const s = String(value ?? "")
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsvRow(values) {
  return values.map(csvEscape).join(",")
}

function toOsmMapUrl(el) {
  const lat = el.lat ?? el.center?.lat
  const lon = el.lon ?? el.center?.lon
  if (typeof lat !== "number" || typeof lon !== "number") return ""
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`
}

function toOverpassQueryByNames(bbox, nameRegex) {
  // nwr = nodes/ways/relations, "out center" gives lat/lon for ways/relations
  return `
[out:json][timeout:40];
(
  nwr["amenity"="restaurant"]["name"~"${nameRegex}",i](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
);
out tags center 250;
`.trim()
}

function escapeRegexLiteral(value) {
  return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function chunkArray(arr, chunkSize) {
  const out = []
  for (let i = 0; i < arr.length; i += chunkSize) out.push(arr.slice(i, i + chunkSize))
  return out
}

async function postOverpass(query) {
  const urls = [
    // Community instances (often faster/less overloaded than the default)
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.nchc.org.tw/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
    "https://overpass-api.de/api/interpreter",
  ]

  let lastErr
  for (const url of urls) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
          body: new URLSearchParams({ data: query }).toString(),
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          const err = new Error(
            `Overpass ${url} error ${res.status}: ${text.slice(0, 200)}`
          )
          // Retry-able statuses on overloaded instances
          if ([429, 502, 503, 504].includes(res.status) && attempt < 3) {
            lastErr = err
            await new Promise((r) => setTimeout(r, 800 * attempt))
            continue
          }
          throw err
        }

        return await res.json()
      } catch (err) {
        lastErr = err
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 800 * attempt))
          continue
        }
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error("Overpass request failed")
}

function parseBoolTag(v) {
  const s = String(v ?? "").trim().toLowerCase()
  if (!s) return undefined
  if (["yes", "true", "1"].includes(s)) return true
  if (["no", "false", "0"].includes(s)) return false
  return undefined
}

function mergeHighlights(existingPipeString, add) {
  const existing = String(existingPipeString ?? "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
  const set = new Set(existing)
  for (const v of add) if (v) set.add(v)
  return Array.from(set).join("|")
}

function tokens(value) {
  const stop = new Set([
    "the",
    "and",
    "of",
    "restaurant",
    "cafe",
    "kitchen",
    "bar",
    "grill",
    "lounge",
    "spot",
    "inc",
    "llc",
  ])
  return new Set(
    norm(value)
      .split(/\s+/)
      .filter(Boolean)
      .filter((t) => !stop.has(t))
  )
}

function jaccard(a, b) {
  const A = tokens(a)
  const B = tokens(b)
  let inter = 0
  for (const t of A) if (B.has(t)) inter++
  const union = A.size + B.size - inter
  return union ? inter / union : 0
}

function guessHouseNumber(addressLine) {
  const m = String(addressLine ?? "").match(/\b(\d{3,6})\b/)
  return m?.[1] ?? ""
}

async function main() {
  const inputPath = path.resolve(ROOT, parseArg("--input") || path.join("data", "restaurants.csv"))
  const outPath = path.resolve(ROOT, parseArg("--output") || path.join("data", "restaurants.csv"))
  const areaFilter = asCleanString(parseArg("--area")) // e.g. houston
  const dryRun = hasFlag("--dryRun")
  const onlyMissing = asCleanString(parseArg("--onlyMissing")) // e.g. phone,websiteUrl
  const slugFilterArg = asCleanString(parseArg("--slugs")) // comma-separated
  const slugFilter = slugFilterArg
    ? new Set(
        slugFilterArg
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    : undefined

  const onlyMissingFields = onlyMissing
    ? onlyMissing
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const csv = await fs.readFile(inputPath, "utf8")
  const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const headers = records.length ? Object.keys(records[0]) : []

  const shouldFill = (field, row) => {
    if (onlyMissingFields.length && !onlyMissingFields.includes(field)) return false
    return !String(row[field] ?? "").trim()
  }

  const candidateRows = records.filter((r) => {
    if (areaFilter && String(r.areaSlug).trim() !== areaFilter) return false
    if (slugFilter && !slugFilter.has(String(r.slug ?? "").trim())) return false
    return shouldFill("phone", r) || shouldFill("websiteUrl", r) || shouldFill("mapsUrl", r)
  })

  if (candidateRows.length === 0) {
    console.log("No rows need enrichment for the given filters.")
    return
  }

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

  // Build a lookup from normalized name -> candidate row indices
  const byNormName = new Map()
  for (let i = 0; i < records.length; i++) {
    const r = records[i]
    if (!candidateRows.includes(r)) continue
    const key = norm(r.name)
    if (!key) continue
    const arr = byNormName.get(key) ?? []
    arr.push(i)
    byNormName.set(key, arr)
  }

  const names = Array.from(new Set(candidateRows.map((r) => asCleanString(r.name)).filter(Boolean)))
  const chunks = chunkArray(names, 6) // smaller batches reduce Overpass load

  let updated = 0
  let foundMatches = 0

  for (const chunk of chunks) {
    // Intentionally *not* anchored (no ^...$) to allow minor OSM name variants.
    const nameRegex = `(${chunk.map(escapeRegexLiteral).join("|")})`
    const query = toOverpassQueryByNames(bbox, nameRegex)
    const json = await postOverpass(query)

    for (const el of json.elements ?? []) {
      const tags = el.tags ?? {}
      const osmName = getTag(tags, ["name", "brand"])
      if (!osmName) continue

      // Find the best candidate row (fuzzy match by name, then validate by house number when possible)
      let bestIdx = undefined
      let bestScore = 0

      for (const [key, idxs] of byNormName.entries()) {
        // quick prefilter: if the key doesn't contain any token from osmName, skip
        const score = jaccard(osmName, key)
        if (score > bestScore) {
          bestScore = score
          bestIdx = idxs[0]
        }
      }

      if (bestIdx === undefined || bestScore < 0.6) continue

      const row = records[bestIdx]
      const rowHouse = guessHouseNumber(row.addressLine)
      const osmHouse = getTag(tags, ["addr:housenumber"])
      if (rowHouse && osmHouse && rowHouse !== osmHouse) continue

      foundMatches++

      const phone = getTag(tags, ["contact:phone", "phone"])
      const websiteUrl = getTag(tags, ["contact:website", "website"])
      const mapsUrl = toOsmMapUrl(el)

      const deliveryTag = parseBoolTag(getTag(tags, ["delivery"]))
      const takeawayTag = parseBoolTag(getTag(tags, ["takeaway"]))

      const addHighlights = []
      if (deliveryTag === true) addHighlights.push("Delivery")
      if (takeawayTag === true) addHighlights.push("Takeout")

      let changed = false

      if (phone && shouldFill("phone", row)) {
        row.phone = phone
        changed = true
      }

      if (websiteUrl && shouldFill("websiteUrl", row)) {
        row.websiteUrl = websiteUrl
        changed = true
      }

      if (mapsUrl && shouldFill("mapsUrl", row)) {
        row.mapsUrl = mapsUrl
        changed = true
      }

      if (addHighlights.length) {
        const before = asCleanString(row.highlights)
        const after = mergeHighlights(before, addHighlights)
        if (after !== before) {
          row.highlights = after
          changed = true
        }
      }

      if (changed) updated++
    }
  }

  const outLines = [toCsvRow(headers)]
  for (const r of records) outLines.push(toCsvRow(headers.map((h) => r[h] ?? "")))

  console.log(`Candidates: ${candidateRows.length}`)
  console.log(`OSM matches: ${foundMatches}`)
  console.log(`Updated fields (row-level): ${updated}`)

  if (dryRun) {
    console.log("Dry run: no file written.")
    return
  }

  await fs.writeFile(outPath, outLines.join("\n") + "\n", "utf8")
  console.log(`Wrote enriched CSV -> ${path.relative(ROOT, outPath)}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

