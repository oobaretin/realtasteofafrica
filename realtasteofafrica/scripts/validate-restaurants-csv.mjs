import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

/**
 * Validate `data/restaurants.csv` for potential duplicates.
 * This is stricter than slug-only checks:
 * - Flags duplicates by normalized (name + city + state)
 * - Flags duplicates by normalized (addressLine + city + state)
 *
 * Usage:
 *   node scripts/validate-restaurants-csv.mjs
 *   node scripts/validate-restaurants-csv.mjs --input data/restaurants.csv
 */

const ROOT = process.cwd()

function parseArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
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

/**
 * Address-based duplicate checks are intentionally strict, but there are rare cases where
 * two different restaurants share the same address (e.g., shared kitchen / co-located businesses).
 *
 * Key format: `${norm(addressLine)}|${norm(city)}|${norm(state)}`
 * Value: set of slugs allowed to share that exact key.
 */
const ALLOWED_ADDRESS_DUPES = new Map([
  [
    "2022 wilcrest dr houston tx 77042|houston|tx",
    new Set(["native-pot-houston-tx", "aria-suya-wilcrest-ghost-houston-tx"]),
  ],
  [
    "2616 blodgett st houston tx 77004|houston|tx",
    new Set(["dakar-street-food-ghost-kitchen-houston-tx", "dupsys-kitchen-ghost-houston-tx"]),
  ],
  [
    "9400 richmond ave houston tx 77063|houston|tx",
    new Set(["blue-nile-ethiopian-houston-tx", "abula-hot-pot-richmond-ave-houston-tx"]),
  ],
  [
    "4460 w walnut st garland tx 75042|garland|tx",
    new Set(["salt-n-pepper-garland-tx", "southwest-farmers-kitchen-garland-tx"]),
  ],
])

function groupBy(rows, keyFn) {
  const m = new Map()
  rows.forEach((r, idx) => {
    const k = keyFn(r)
    if (!k) return
    const arr = m.get(k) ?? []
    arr.push({
      line: idx + 2, // header is line 1
      slug: r.slug,
      name: r.name,
      city: r.city,
      state: r.state,
      addressLine: r.addressLine,
    })
    m.set(k, arr)
  })
  return m
}

function isAllowedDuplicateAddressGroup(key, group) {
  const allowedSlugs = ALLOWED_ADDRESS_DUPES.get(key)
  if (!allowedSlugs) return false
  return group.every((r) => allowedSlugs.has(r.slug))
}

async function main() {
  const input = path.resolve(ROOT, parseArg("--input") || path.join("data", "restaurants.csv"))
  const csv = await fs.readFile(input, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  const dupNameCity = Array.from(
    groupBy(rows, (r) => `${norm(r.name)}|${norm(r.city)}|${norm(r.state)}`).values()
  ).filter((arr) => arr.length > 1)

  const addrGroups = groupBy(
    rows,
    (r) => `${norm(r.addressLine)}|${norm(r.city)}|${norm(r.state)}`
  )
  const dupAddr = Array.from(addrGroups.entries())
    .filter(([, arr]) => arr.length > 1)
    .filter(([key, arr]) => !isAllowedDuplicateAddressGroup(key, arr))
    .map(([, arr]) => arr)

  if (!dupNameCity.length && !dupAddr.length) {
    console.log(`OK: no duplicates found in ${path.relative(ROOT, input)} (${rows.length} rows)`)
    return
  }

  const printGroup = (label, groups) => {
    console.log(`\\n${label}: ${groups.length}`)
    for (const g of groups.slice(0, 20)) {
      console.log("-".repeat(60))
      for (const r of g) {
        console.log(
          `line ${r.line}: ${r.name} (${r.city}, ${r.state}) | ${r.addressLine} | slug=${r.slug}`
        )
      }
    }
    if (groups.length > 20) console.log(`...and ${groups.length - 20} more groups`)
  }

  printGroup("Duplicates by (name+city+state)", dupNameCity)
  printGroup("Duplicates by (addressLine+city+state)", dupAddr)

  process.exit(1)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

