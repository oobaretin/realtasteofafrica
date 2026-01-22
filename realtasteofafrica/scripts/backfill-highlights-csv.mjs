import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

/**
 * Backfill missing `highlights` in `data/restaurants.csv` using cuisines (first 1-3 tags).
 *
 * This keeps semantics consistent with the importer fallback logic, but makes the CSV itself
 * more complete for UX and future tooling.
 *
 * Usage:
 *   node scripts/backfill-highlights-csv.mjs --write
 *   node scripts/backfill-highlights-csv.mjs --input data/restaurants.csv --output data/restaurants.csv
 */

const ROOT = process.cwd()

function parseArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function splitPipes(value) {
  const raw = String(value ?? "").trim()
  if (!raw) return []
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
}

function csvEscape(value) {
  const s = String(value ?? "")
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function toCsv(headers, rows) {
  const out = []
  out.push(headers.join(","))
  for (const r of rows) {
    out.push(headers.map((h) => csvEscape(r[h] ?? "")).join(","))
  }
  out.push("") // trailing newline
  return out.join("\n")
}

async function main() {
  const input = path.resolve(ROOT, parseArg("--input") || path.join("data", "restaurants.csv"))
  const output = path.resolve(ROOT, parseArg("--output") || input)
  const writeInPlace = hasFlag("--write") || output !== input

  const csv = await fs.readFile(input, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const headers = rows.length ? Object.keys(rows[0]) : []

  let changed = 0
  for (const r of rows) {
    const existing = splitPipes(r.highlights)
    if (existing.length) continue
    const cuisines = splitPipes(r.cuisines).slice(0, 3)
    if (!cuisines.length) continue
    r.highlights = cuisines.join("|")
    changed++
  }

  const nextCsv = toCsv(headers, rows)
  if (writeInPlace) {
    await fs.writeFile(output, nextCsv, "utf8")
  }

  console.log(
    `Backfilled highlights: ${changed} rows ${writeInPlace ? `-> ${path.relative(ROOT, output)}` : "(dry)"}`
  )
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

