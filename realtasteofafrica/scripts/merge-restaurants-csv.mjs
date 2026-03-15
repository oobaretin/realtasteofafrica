/**
 * Merge Merged_African_Food_Texas.csv into restaurants.csv without duplicates.
 * Matches by name + city; enriches existing records with Hours, phone, website, etc.
 * Adds new restaurants from Merged that don't exist in current data.
 *
 * Run from project root: node scripts/merge-restaurants-csv.mjs [--merged path/to/Merged.csv]
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CURRENT_CSV = path.resolve(ROOT, "data", "restaurants.csv")
const mergedArg = process.argv.find((a) => a.startsWith("--merged="))?.split("=")[1]
const MERGED_CSV = mergedArg
  ? path.resolve(ROOT, mergedArg)
  : path.resolve(process.env.HOME || "", "Downloads", "Merged_African_Food_Texas.csv")

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// City -> areaSlug mapping (Texas cities)
const CITY_TO_AREA = {
  houston: "houston",
  cypress: "katy",
  spring: "houston",
  pearland: "houston",
  "missouri city": "houston",
  "sugar land": "sugar-land",
  richmond: "sugar-land",
  rosenberg: "sugar-land",
  "texas city": "houston",
  beaumont: "houston",
  "meadows place": "sugar-land",
  katy: "katy",
  dallas: "dfw",
  "fort worth": "dfw",
  arlington: "dfw",
  irving: "dfw",
  plano: "dfw",
  "grand prairie": "dfw",
  mckinney: "dfw",
  frisco: "dfw",
  richardson: "dfw",
  lewisville: "dfw",
  allen: "dfw",
  euless: "dfw",
  garland: "dfw",
  "haltom city": "dfw",
  "richland hills": "dfw",
  mesquite: "dfw",
  roanoke: "dfw",
  austin: "austin",
  pflugerville: "austin",
  leander: "austin",
  "cedar park": "austin",
  georgetown: "central-texas",
  "round rock": "central-texas",
  killeen: "central-texas",
  "san antonio": "san-antonio",
  "leon valley": "san-antonio",
  "el paso": "el-paso",
  amarillo: "west-texas",
  abilene: "west-texas",
  lubbock: "west-texas",
  mcallen: "south-texas",
}

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

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normName(s) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "")
}

/** Format phone as (XXX) XXX-XXXX for US numbers. */
function formatPhone(phone) {
  const raw = String(phone ?? "").trim()
  if (!raw) return ""
  const digits = raw.replace(/\D/g, "")
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  if (digits.length === 11 && digits.startsWith("1")) return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  if (digits.length >= 10) {
    const last10 = digits.slice(-10)
    return `(${last10.slice(0, 3)}) ${last10.slice(3, 6)}-${last10.slice(6)}`
  }
  return raw
}

function cityToAreaSlug(city) {
  const c = String(city ?? "").trim().toLowerCase()
  return CITY_TO_AREA[c] ?? "houston"
}

/** Parse Merged Hours string into { Monday: "11:00 AM - 10:00 PM", ... } */
function parseHours(hoursStr) {
  const raw = String(hoursStr ?? "").trim()
  if (!raw) return null

  const result = {}
  for (const d of DAYS) result[d] = ""

  // Normalize separators: ; or , -> split
  const segments = raw.split(/[;,]/).map((s) => s.trim()).filter(Boolean)

  function expandDays(daySpec) {
    const full = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const abbrev = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 }
    const m = daySpec.match(/^(\w+)(?:\s*-\s*(\w+))?$/i)
    if (!m) return []
    const first = m[1]
    const second = m[2]
    let start = full.findIndex((d) => d.toLowerCase().startsWith(first.toLowerCase().slice(0, 3)))
    if (start === -1) start = abbrev[first.toLowerCase().slice(0, 3)]
    let end = second
      ? full.findIndex((d) => d.toLowerCase().startsWith(second.toLowerCase().slice(0, 3)))
      : start
    if (end === -1 && second) end = abbrev[second.toLowerCase().slice(0, 3)]
    if (start == null || start < 0) return []
    const endIdx = end != null && end >= 0 ? end : start
    const out = []
    for (let i = start; i <= endIdx; i++) out.push(full[i])
    return out
  }

  function normalizeTime(t) {
    // "11:00 am – 9:00 pm" or "11:00 AM - 10:00 PM"
    return String(t ?? "")
      .trim()
      .replace(/–/g, "-")
      .replace(/\s+/g, " ")
  }

  for (const seg of segments) {
    const colonIdx = seg.indexOf(":")
    if (colonIdx === -1) continue
    const dayPart = seg.slice(0, colonIdx).trim()
    let timePart = seg.slice(colonIdx + 1).trim()
    // Strip "(Closed Monday)" etc from time part - handle separately below
    const closedInParen = timePart.match(/\(([^)]*closed[^)]*)\)/i)
    if (closedInParen) {
      timePart = timePart.replace(closedInParen[0], "").trim()
      const closedDay = closedInParen[1].match(/(\w+)/)
      if (closedDay) {
        for (const d of DAYS) {
          if (d.toLowerCase().startsWith(closedDay[1].toLowerCase().slice(0, 3))) {
            result[d] = "Closed"
            break
          }
        }
      }
    }
    const timeNorm = normalizeTime(timePart)
    const closed = /^closed$/i.test(timeNorm) || !timeNorm
    const value = closed ? "Closed" : timeNorm

    const days = expandDays(dayPart)
    if (days.length === 0) {
      // Try "Monday" etc
      for (const d of DAYS) {
        if (dayPart.toLowerCase().includes(d.toLowerCase().slice(0, 3))) {
          result[d] = value
          break
        }
      }
    } else {
      for (const d of days) result[d] = value
    }
  }

  // Handle "Closed Monday" style
  const closedMatch = raw.match(/closed\s+(\w+)/i)
  if (closedMatch) {
    const d = closedMatch[1]
    for (const day of DAYS) {
      if (day.toLowerCase().startsWith(d.toLowerCase().slice(0, 3))) {
        result[day] = "Closed"
        break
      }
    }
  }

  const filled = Object.values(result).filter(Boolean).length
  if (filled === 0) return null

  // Convert to format expected by businessHours: "11:00 AM - 10:00 PM"
  const out = {}
  for (const d of DAYS) {
    if (result[d]) out[d] = result[d]
  }
  return Object.keys(out).length ? out : null
}

/** Serialize hours object to CSV-safe string (JSON) */
function serializeHours(hours) {
  if (!hours || typeof hours !== "object") return ""
  const obj = {}
  for (const d of DAYS) {
    if (hours[d]) obj[d] = hours[d]
  }
  return Object.keys(obj).length ? JSON.stringify(obj) : ""
}

function mapMergedCuisineToCurrent(cuisine) {
  const c = String(cuisine ?? "").trim()
  if (!c) return "West African"
  // Normalize: "Calabar (Nigerian)" -> "West African|Nigerian"
  if (/calabar|nigerian/i.test(c)) return c.replace(/\(.*\)/, "").trim() + "|Nigerian"
  if (/pan-?african/i.test(c)) return "African"
  if (/ethiopian|eritrean/i.test(c)) return "Ethiopian|African"
  if (/ghanaian/i.test(c)) return "Ghanaian|West African"
  if (/senegalese/i.test(c)) return "Senegalese|West African"
  if (/west african/i.test(c)) return "West African"
  if (/african/i.test(c)) return "African"
  return c
}

function mapMergedTypeToCategory(type) {
  const t = String(type ?? "").toLowerCase()
  if (t.includes("food truck")) return "Food Truck"
  if (t.includes("ghost")) return "Ghost Kitchen"
  if (t.includes("market") || t.includes("kitchen market")) return "Market + Kitchen"
  if (t.includes("bakery") || t.includes("cafe")) return "Restaurant"
  return "Restaurant"
}

function cleanAddress(addr) {
  if (!addr) return ""
  return String(addr)
    .replace(/,?\s*USA\s*$/i, "")
    .replace(/\s*,\s*$/g, "")
    .trim()
}

async function main() {
  console.log("Merge Restaurants CSV")
  console.log("  Current:", CURRENT_CSV)
  console.log("  Merged:", MERGED_CSV)

  let currentCsv
  try {
    currentCsv = await fs.readFile(CURRENT_CSV, "utf8")
  } catch (e) {
    throw new Error(`Cannot read current CSV: ${e.message}`)
  }

  let mergedCsv
  try {
    mergedCsv = await fs.readFile(MERGED_CSV, "utf8")
  } catch (e) {
    throw new Error(`Cannot read Merged CSV: ${e.message}. Place Merged_African_Food_Texas.csv in Downloads or use --merged=path`)
  }

  const currentRows = parse(currentCsv, { columns: true, skip_empty_lines: true, trim: true })
  const mergedRows = parse(mergedCsv, { columns: true, skip_empty_lines: true, trim: true })

  const currentHeaders = currentRows.length ? Object.keys(currentRows[0]) : []
  const hasHours = currentHeaders.includes("hours")

  // Build lookup: normName|city -> current row index (multiple keys per row for fuzzy match)
  const lookup = new Map()
  for (let i = 0; i < currentRows.length; i++) {
    const r = currentRows[i]
    const city = String(r.city ?? "").toLowerCase()
    const keys = [
      `${normName(r.name)}|${city}`,
      `${normName(r.name.replace(/\s*\([^)]*\)\s*$/, "").trim())}|${city}`,
      `${normName(r.name.replace(/\s*[-–—]\s*[^\-]+$/, "").trim())}|${city}`,
    ]
    for (const key of keys) {
      if (!lookup.has(key)) lookup.set(key, i)
    }
  }

  function findMatch(mergedRow, preferNoHours = false) {
    const name = String(mergedRow.Name ?? "").trim()
    const city = String(mergedRow.City ?? "").trim().toLowerCase()
    const mergedNorm = normName(name)
    const mergedNormNoParen = normName(name.replace(/\s*\([^)]*\)\s*$/, "").trim())
    const mergedNormNoSuffix = normName(name.replace(/\s*[-–—]\s*[^\-]+$/, "").trim())

    const candidates = []

    const keys = [
      `${mergedNorm}|${city}`,
      `${mergedNormNoParen}|${city}`,
      `${mergedNormNoSuffix}|${city}`,
    ]
    for (const key of keys) {
      if (lookup.has(key)) candidates.push(lookup.get(key))
    }

    // Substring match: "Finger Licking" should match "Finger Licking Restaurant"
    for (let i = 0; i < currentRows.length; i++) {
      const r = currentRows[i]
      if (String(r.city ?? "").toLowerCase() !== city) continue
      const currNorm = normName(r.name)
      const currNormNoParen = normName(r.name.replace(/\s*\([^)]*\)\s*$/, "").trim())
      if (
        (mergedNorm.length >= 8 && currNorm.includes(mergedNorm)) ||
        (mergedNorm.length >= 8 && mergedNorm.includes(currNorm)) ||
        (currNormNoParen.length >= 8 && mergedNorm.includes(currNormNoParen)) ||
        (currNormNoParen.length >= 8 && currNormNoParen.includes(mergedNorm))
      ) {
        if (!candidates.includes(i)) candidates.push(i)
      }
    }

    if (candidates.length === 0) return -1
    if (candidates.length === 1) return candidates[0]
    // Prefer row that needs hours (so we enrich rather than skip)
    if (preferNoHours) {
      const withoutHours = candidates.filter((i) => !currentRows[i].hours || currentRows[i].hours.length < 20)
      return withoutHours[0] ?? candidates[0]
    }
    return candidates[0]
  }

  const usedMerged = new Set()
  let enriched = 0
  let added = 0

  for (const m of mergedRows) {
    const hasHours = parseHours(m.Hours)
    const idx = findMatch(m, !!hasHours)
    const name = String(m.Name ?? "").trim()
    const city = String(m.City ?? "").trim()
    if (!name || !city) continue

    const areaSlug = cityToAreaSlug(city)
    const region = AREA_TO_REGION[areaSlug] ?? "Gulf Coast"
    const slug = slugify(`${name}-${city}`)
    const cuisines = mapMergedCuisineToCurrent(m.Cuisine)
    const category = mapMergedTypeToCategory(m.Type)
    const address = cleanAddress(m.Address) || `${city}, TX`
    const phoneRaw = String(m.Phone ?? "").trim() || undefined
    const phone = phoneRaw ? formatPhone(phoneRaw) : undefined
    const website = String(m.Website ?? "").trim() || undefined
    const hours = parseHours(m.Hours)
    const verificationSource = String(m["Verification Source"] ?? "").trim() || undefined

    if (idx >= 0) {
      usedMerged.add(idx)
      const row = currentRows[idx]
      // Enrich: add hours, update phone/website/address if current is empty
      if (hours && !row.hours) {
        row.hours = serializeHours(hours)
        enriched++
      }
      if (phone && !row.phone) row.phone = phone
      if (website && !row.websiteUrl) row.websiteUrl = website
      if (address && (!row.addressLine || row.addressLine.length < address.length)) {
        row.addressLine = address
      }
      if (verificationSource && !row.verificationSource) row.verificationSource = verificationSource
    } else {
      // New restaurant - add row
      const newRow = {
        name,
        cuisines,
        cuisine: cuisines.split("|")[0] || "West African",
        areaSlug,
        city,
        state: "TX",
        addressLine: address,
        phone: phone || "",
        websiteUrl: website || "",
        mapsUrl: "",
        priceLevel: "",
        highlights: cuisines,
        category,
        writeUp: "",
        slug,
        isFeatured: "false",
        isVerified: "false",
        region,
        hours: serializeHours(hours),
        verificationSource: verificationSource || "",
      }
      currentRows.push(newRow)
      lookup.set(`${normName(name)}|${city.toLowerCase()}`, currentRows.length - 1)
      added++
    }
  }

  // Ensure all rows have required fields and hours column
  const allHeaders = new Set(currentHeaders)
  allHeaders.add("hours")
  allHeaders.add("verificationSource")
  const headers = [
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
    "isFeatured",
    "isVerified",
    "region",
    "hours",
    "verificationSource",
  ]

  // Deduplicate: merge rows where one name contains the other (same city)
  const toRemove = new Set()
  for (let i = 0; i < currentRows.length; i++) {
    if (toRemove.has(i)) continue
    const a = currentRows[i]
    const aNorm = normName(a.name)
    const aCity = String(a.city ?? "").toLowerCase()
    for (let j = i + 1; j < currentRows.length; j++) {
      if (toRemove.has(j)) continue
      const b = currentRows[j]
      if (String(b.city ?? "").toLowerCase() !== aCity) continue
      const bNorm = normName(b.name)
      const isDuplicate =
        (aNorm.length >= 8 && bNorm.length >= 8) &&
        (aNorm.includes(bNorm) || bNorm.includes(aNorm))
      if (!isDuplicate) continue
      // Merge: keep the one with hours or longer name; merge in missing data
      const aHasHours = a.hours && a.hours.length > 20
      const bHasHours = b.hours && b.hours.length > 20
      // Prefer longer name (more specific) and merge in hours from the other
      const keep = aNorm.length >= bNorm.length ? i : j
      const drop = keep === i ? j : i
      const keepRow = currentRows[keep]
      const dropRow = currentRows[drop]
      if (!keepRow.hours && dropRow.hours) keepRow.hours = dropRow.hours
      if (!keepRow.phone && dropRow.phone) keepRow.phone = dropRow.phone
      if (!keepRow.websiteUrl && dropRow.websiteUrl) keepRow.websiteUrl = dropRow.websiteUrl
      if (!keepRow.addressLine && dropRow.addressLine) keepRow.addressLine = dropRow.addressLine
      toRemove.add(drop)
    }
  }
  const dedupedRows = currentRows.filter((_, i) => !toRemove.has(i))

  const outputRows = dedupedRows.map((r) => {
    const out = {}
    for (const h of headers) {
      out[h] = r[h] ?? ""
    }
    return out
  })

  const removedCount = currentRows.length - dedupedRows.length

  const csvOut = stringify(outputRows, {
    header: true,
    columns: headers,
    quoted: true,
    quoted_empty: true,
  })

  await fs.writeFile(CURRENT_CSV, csvOut, "utf8")

  console.log(`\nDone: ${outputRows.length} total rows`)
  console.log(`  Enriched ${enriched} existing with hours`)
  console.log(`  Added ${added} new restaurants`)
  if (removedCount > 0) console.log(`  Removed ${removedCount} duplicates`)
  console.log(`  Wrote ${CURRENT_CSV}`)
  console.log("\nNext: npm run import:restaurants")
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
