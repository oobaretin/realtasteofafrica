#!/usr/bin/env node
/**
 * Replace broken restaurant website URLs with Google Maps search links.
 * Run: node scripts/fix-broken-website-urls.mjs
 * Run check first: npm run check:website-urls
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const CSV_PATH = path.join(process.cwd(), "data", "restaurants.csv")

// Domain patterns that fail (DNS, 404, 502, 503)
const BROKEN_DOMAINS = [
  "lagosbuka.com",
  "dhutafrican.com",
  "kofoshi.com",
  "westafricanway.com",
  "rhosabjal.com",
  "amen.cafe",
  "blessliz.com",
  "suyapowerhouse.us",
  "cravesuyahouston.com",
  "ekobistro.org",
  "theiconkitchen.com",
  "gidibarandgrill.com",
  "bluenilehouston.com",
  "kesspicy9jasuyaspot.com",
  "shuriafricanrestaurant.com",
  "aggiesrestaurant.com",
  "afrochowhtx.com",
  "aatfoodmarket.com",
  "jollofxpress.com",
  "soulsweetandbakes.com",
  "sweetadmirerbakery.com",
  "alieffoodstore.com",
  "bahelethiopianmartandkitchen.com",
  "ultrakitchenandcatering.com",
  "astersethiopiankitchen.com",
  "oloriafricancuisine.com",
  // HTTP 404, 502, 503
  "anointedatasteofafrica.com",
  "africanvillagerestauranttx.com",
  "safoodaffair.com",
  "mgbeke.com",
  "grainsandsolids.com",
  "visitsanantonio.com", // listing page 404
  "joslat-african-foods.business.site", // 404
  "murphysmansion.com", // redirects to Facebook; bot checks fail
]

function isBroken(url) {
  if (!url) return false
  try {
    const host = new URL(url).hostname.replace(/^www\./, "")
    return BROKEN_DOMAINS.some((d) => host === d || host.endsWith("." + d))
  } catch {
    return false
  }
}

function toGoogleMapsUrl(name, city) {
  const q = encodeURIComponent(`${name} ${city} TX`)
  return `https://www.google.com/maps/search/${q}`
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf-8")
  const rows = parse(csv, { columns: true, relax_column_count: true })
  const headers = Object.keys(rows[0] || {})

  let fixed = 0
  for (const row of rows) {
    const url = String(row.websiteUrl || "").trim()
    if (!url) continue
    if (isBroken(url)) {
      row.websiteUrl = toGoogleMapsUrl(row.name, row.city)
      fixed++
      console.log(`Fixed: ${row.name} -> Google Maps`)
    }
  }

  const output = stringify(rows, { header: true, columns: headers, quoted: true, quoted_empty: true })
  await fs.writeFile(CSV_PATH, output)
  console.log(`\nFixed ${fixed} restaurant website URLs`)
}

main().catch(console.error)
