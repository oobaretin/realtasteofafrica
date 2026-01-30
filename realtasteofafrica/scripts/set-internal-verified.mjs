/**
 * Sets internal_verified = true for given restaurant slugs (audit tracking).
 * Usage:
 *   node scripts/set-internal-verified.mjs slug1 slug2 slug3
 *   node scripts/set-internal-verified.mjs --file slugs.txt
 *
 * Run from project root. Then run npm run import:restaurants to regenerate data.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")

function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

async function main() {
  let slugs = []
  const fileIdx = process.argv.indexOf("--file")
  if (fileIdx !== -1 && process.argv[fileIdx + 1]) {
    const filePath = path.resolve(ROOT, process.argv[fileIdx + 1])
    const content = await fs.readFile(filePath, "utf8")
    slugs = content
      .split(/\n/)
      .map((s) => slugify(s.trim()))
      .filter(Boolean)
  } else {
    slugs = process.argv.slice(2).map(slugify).filter(Boolean)
  }

  if (slugs.length === 0) {
    console.log("Usage: node scripts/set-internal-verified.mjs slug1 slug2 ...")
    console.log("   or: node scripts/set-internal-verified.mjs --file slugs.txt")
    process.exit(1)
  }

  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const headers = rows.length ? Object.keys(rows[0]) : []
  if (!headers.includes("internal_verified")) headers.push("internal_verified")

  const slugSet = new Set(slugs)
  let updated = 0
  const out = rows.map((row) => {
    const newRow = { ...row }
    const rowSlug = slugify(row.slug || row.name + "-" + (row.city || ""))
    if (slugSet.has(rowSlug) || slugSet.has(String(row.slug ?? "").trim())) {
      if (newRow.internal_verified !== "true") {
        newRow.internal_verified = "true"
        updated++
      }
    }
    if (newRow.internal_verified === undefined) newRow.internal_verified = ""
    return newRow
  })

  const csvOut = stringify(out, { header: true, columns: headers })
  await fs.writeFile(CSV_PATH, csvOut, "utf8")
  console.log(`Set internal_verified=true for ${updated} row(s). Wrote ${path.relative(ROOT, CSV_PATH)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
