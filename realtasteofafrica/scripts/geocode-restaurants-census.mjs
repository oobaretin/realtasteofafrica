#!/usr/bin/env node
/**
 * Fill latitude/longitude on data/restaurants.csv using the US Census geocoder
 * (reliable for US street addresses; no API key required).
 *
 * Falls back to Nominatim (OSM) when Census returns no match.
 *
 * Usage:
 *   node scripts/geocode-restaurants-census.mjs
 *   node scripts/geocode-restaurants-census.mjs --dryRun
 *   node scripts/geocode-restaurants-census.mjs --slugs slug-one,slug-two
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const INPUT = path.resolve(ROOT, "data", "restaurants.csv")
const NOMINATIM_DELAY_MS = 1100
const USER_AGENT =
  "RealTasteOfAfrica-directory/1.0 (+https://www.realtasteofafrica.com; contact: admin@realtasteofafrica.com)"

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function parseSlugsArg() {
  const raw = process.argv.find((a) => a.startsWith("--slugs="))?.split("=")[1]
  if (!raw) return null
  return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function buildQuery(row) {
  const city = String(row.city ?? "").trim()
  const state = String(row.state ?? "").trim()
  const addr = String(row.addressLine ?? "").trim()
  const name = String(row.name ?? "").trim()
  if (addr && !/check maps/i.test(addr)) {
    if (city && state && addr.toLowerCase().includes(city.toLowerCase())) {
      return addr
    }
    return `${addr}, ${city}, ${state}`
  }
  return `${name}, ${city}, ${state}`
}

function hasCoords(row) {
  const lat = String(row.latitude ?? "").trim()
  const lon = String(row.longitude ?? "").trim()
  return lat && lon && Number.isFinite(Number(lat)) && Number.isFinite(Number(lon))
}

async function censusGeocode(query) {
  const url = new URL("https://geocoding.geo.census.gov/geocoder/locations/onelineaddress")
  url.searchParams.set("address", query)
  url.searchParams.set("benchmark", "2020")
  url.searchParams.set("format", "json")
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Census HTTP ${res.status}`)
  const data = await res.json()
  const match = data?.result?.addressMatches?.[0]
  if (!match?.coordinates) return null
  const { y: lat, x: lon } = match.coordinates
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return { lat, lon, source: "census" }
}

async function nominatimGeocode(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("format", "json")
  url.searchParams.set("limit", "1")
  url.searchParams.set("countrycodes", "us")
  url.searchParams.set("q", query)
  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": USER_AGENT },
  })
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return null
  const lat = Number(data[0].lat)
  const lon = Number(data[0].lon)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  return { lat, lon, source: "nominatim" }
}

async function geocodeRow(row) {
  const query = buildQuery(row)
  if (!query.trim()) return null

  try {
    const census = await censusGeocode(query)
    if (census) return census
  } catch (e) {
    console.warn(`Census failed (${query}):`, e instanceof Error ? e.message : e)
  }

  await sleep(NOMINATIM_DELAY_MS)
  try {
    const osm = await nominatimGeocode(query)
    if (osm) return osm
  } catch (e) {
    console.warn(`Nominatim failed (${query}):`, e instanceof Error ? e.message : e)
  }

  const name = String(row.name ?? "").trim()
  const city = String(row.city ?? "").trim()
  const state = String(row.state ?? "TX").trim()
  if (name && city) {
    await sleep(NOMINATIM_DELAY_MS)
    try {
      return await nominatimGeocode(`${name}, ${city}, ${state}`)
    } catch {
      return null
    }
  }
  return null
}

async function main() {
  const dryRun = hasFlag("--dryRun")
  const slugFilter = parseSlugsArg()
  const csv = await fs.readFile(INPUT, "utf8")
  const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  let updated = 0
  let skipped = 0
  for (let i = 0; i < records.length; i++) {
    const row = records[i]
    if (slugFilter && !slugFilter.has(String(row.slug ?? "").trim())) continue
    if (hasCoords(row)) {
      skipped++
      continue
    }

    const query = buildQuery(row)
    if (dryRun) {
      console.log(`[dry-run] would geocode: ${row.slug || row.name} — ${query}`)
      continue
    }

    const coords = await geocodeRow(row)
    if (coords) {
      row.latitude = String(coords.lat)
      row.longitude = String(coords.lon)
      updated++
      console.log(`OK [${coords.source}] ${row.slug}: ${coords.lat}, ${coords.lon}`)
    } else {
      console.warn(`No result: ${row.slug} — ${query}`)
    }

    await sleep(200)
  }

  if (dryRun) {
    console.log(`Dry run complete (${records.length} rows).`)
    return
  }

  const baseKeys = Object.keys(records[0]).filter((k) => k !== "latitude" && k !== "longitude")
  const columns = [...baseKeys, "latitude", "longitude"]
  const output = stringify(records, { header: true, columns, quoted_empty: false, quoted_string: true })
  await fs.writeFile(INPUT, output, "utf8")
  console.log(`Done. Updated ${updated} rows, skipped ${skipped} (already had coords).`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
