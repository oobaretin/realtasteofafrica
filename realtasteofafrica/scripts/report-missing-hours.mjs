/**
 * Report restaurants without verified hours.
 * Use this list to manually look up hours (Google Maps, website) or for future enrichment.
 *
 * Run: node scripts/report-missing-hours.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const withoutHours = rows.filter((r) => !r.hours || r.hours.trim().length < 20)

  console.log(`Restaurants without verified hours: ${withoutHours.length} of ${rows.length}\n`)
  console.log("Name | City | Phone | Website")
  console.log("-".repeat(80))
  for (const r of withoutHours) {
    const website = r.websiteUrl ? "✓" : "—"
    console.log(`${r.name} | ${r.city} | ${r.phone || "—"} | ${website}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
