/**
 * Moves a restaurant from restaurants.csv to deleted_restaurants.json (closure pruning).
 * Usage: node scripts/move-to-deleted.mjs <slug> [reason]
 * Example: node scripts/move-to-deleted.mjs aria-suya-wilcrest-ghost-houston-tx "Permanently closed"
 *
 * Run from project root. Then run npm run import:restaurants.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const DELETED_PATH = path.resolve(ROOT, "data", "deleted_restaurants.json")

async function main() {
  const slug = process.argv[2]?.trim()
  const reason = process.argv[3]?.trim() || "Moved to deleted (closure or pruning)"

  if (!slug) {
    console.log("Usage: node scripts/move-to-deleted.mjs <slug> [reason]")
    process.exit(1)
  }

  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const headers = rows.length ? Object.keys(rows[0]) : []

  const index = rows.findIndex((r) => (r.slug || "").trim() === slug)
  if (index === -1) {
    console.error(`Slug not found: ${slug}`)
    process.exit(1)
  }

  const [removed] = rows.splice(index, 1)
  const deletedEntry = {
    ...removed,
    deletedAt: new Date().toISOString().slice(0, 10),
    reason,
  }

  let existing = []
  try {
    const raw = await fs.readFile(DELETED_PATH, "utf8")
    existing = JSON.parse(raw)
  } catch {
    // file missing or invalid
  }
  if (!Array.isArray(existing)) existing = []
  existing.push(deletedEntry)
  await fs.writeFile(DELETED_PATH, JSON.stringify(existing, null, 2), "utf8")

  const csvOut = stringify(rows, { header: true, columns: headers })
  await fs.writeFile(CSV_PATH, csvOut, "utf8")

  console.log(`Moved "${removed.name}" (${slug}) to ${path.relative(ROOT, DELETED_PATH)}. Reason: ${reason}`)
  console.log("Run: npm run import:restaurants")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
