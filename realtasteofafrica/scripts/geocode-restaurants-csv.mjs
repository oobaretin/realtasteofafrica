/**
 * Fill latitude/longitude on data/restaurants.csv using Nominatim (OpenStreetMap).
 * Respects usage policy: one request per second, descriptive User-Agent.
 *
 * Usage:
 *   node scripts/geocode-restaurants-csv.mjs
 *   node scripts/geocode-restaurants-csv.mjs --dryRun
 *   node scripts/geocode-restaurants-csv.mjs --input data/restaurants.csv
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()

function hasFlag(flag) {
  return process.argv.includes(flag)
}

const INPUT = path.resolve(
  ROOT,
  process.argv.find((a) => a.startsWith("--input="))?.split("=")[1] || "data/restaurants.csv"
)

const DELAY_MS = 1100
const USER_AGENT =
  "RealTasteOfAfrica-directory/1.0 (+https://github.com/realtasteofafrica; contact: directory@local)"

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function buildQuery(row) {
  const city = String(row.city ?? "").trim()
  const state = String(row.state ?? "").trim()
  const addr = String(row.addressLine ?? "").trim()
  const name = String(row.name ?? "").trim()
  if (addr && !/check maps/i.test(addr)) {
    return `${addr}, ${city}, ${state}`
  }
  return `${name}, ${city}, ${state}`
}

async function nominatimSearch(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("format", "json")
  url.searchParams.set("limit", "1")
  url.searchParams.set("q", query)
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  })
  if (!res.ok) {
    throw new Error(`Nominatim HTTP ${res.status}`)
  }
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return null
  const first = data[0]
  const lat = Number(first.lat)
  const lon = Number(first.lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return { lat, lon }
}

async function main() {
  const dryRun = hasFlag("--dryRun")
  const csv = await fs.readFile(INPUT, "utf8")
  const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  if (records.length === 0) {
    console.error("No rows in CSV")
    process.exit(1)
  }

  for (const r of records) {
    if (r.latitude === undefined) r.latitude = ""
    if (r.longitude === undefined) r.longitude = ""
  }

  let updated = 0
  let skipped = 0
  for (let i = 0; i < records.length; i++) {
    const row = records[i]
    const lat = String(row.latitude ?? "").trim()
    const lon = String(row.longitude ?? "").trim()
    if (lat && lon && Number.isFinite(Number(lat)) && Number.isFinite(Number(lon))) {
      skipped++
      continue
    }

    const query = buildQuery(row)
    if (!query.trim()) {
      console.warn(`Row ${i + 2}: empty query, skip`)
      skipped++
      continue
    }

    if (dryRun) {
      console.log(`[dry-run] would geocode: ${query}`)
      continue
    }

    await sleep(i === 0 ? 0 : DELAY_MS)
    let coords
    try {
      coords = await nominatimSearch(query)
    } catch (e) {
      console.error(`Row ${i + 2} (${query}):`, e instanceof Error ? e.message : e)
      continue
    }

    if (coords) {
      row.latitude = String(coords.lat)
      row.longitude = String(coords.lon)
      updated++
      console.log(`OK ${row.slug || row.name}: ${coords.lat}, ${coords.lon}`)
    } else {
      console.warn(`No result: ${query}`)
    }
  }

  if (dryRun) {
    console.log(`Dry run complete. ${records.length} rows.`)
    return
  }

  const baseKeys = Object.keys(records[0]).filter((k) => k !== "latitude" && k !== "longitude")
  const columns = [...baseKeys, "latitude", "longitude"]

  const output = stringify(records, {
    header: true,
    columns,
    quoted_empty: false,
    quoted_string: true,
  })

  await fs.writeFile(INPUT, output, "utf8")
  console.log(`Done. Updated ${updated} rows, skipped ${skipped} (already had coords).`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
