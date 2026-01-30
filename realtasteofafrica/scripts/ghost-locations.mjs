/**
 * Finds addresses that have 5+ restaurants (possible ghost kitchen hubs or duplicates).
 * Review these to ensure they're different businesses, not the same place with multiple names.
 *
 * Run from project root: node scripts/ghost-locations.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const MIN_AT_SAME_ADDRESS = 5

function normalizeAddress(addr) {
  if (!addr || typeof addr !== "string") return ""
  return addr
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/,/g, " ")
    .trim()
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  const byAddress = new Map()
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const name = String(r.name ?? "").trim()
    const slug = String(r.slug ?? "").trim() || name
    const city = String(r.city ?? "").trim()
    const addr = normalizeAddress(r.addressLine)
    if (!addr) continue
    if (!byAddress.has(addr)) byAddress.set(addr, [])
    byAddress.get(addr).push({ index: i + 2, name, slug, city, addressLine: r.addressLine })
  }

  const hubs = []
  for (const [addr, list] of byAddress) {
    if (list.length >= MIN_AT_SAME_ADDRESS) hubs.push({ addr, list })
  }

  if (hubs.length === 0) {
    console.log(`No address has ${MIN_AT_SAME_ADDRESS}+ restaurants.`)
    return
  }

  console.log(`=== Addresses with ${MIN_AT_SAME_ADDRESS}+ restaurants (review for ghost kitchens / duplicates) ===\n`)
  for (const { addr, list } of hubs) {
    console.log(`Address (${list.length}): ${list[0].addressLine ?? addr}`)
    list.forEach((x) => console.log(`  - ${x.name} (${x.city}) slug: ${x.slug}, line ~${x.index}`))
    console.log("")
  }
  console.log("Done. If these are the same business with different delivery names, consider merging. If they're separate concepts at a shared kitchen, leave as-is.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
