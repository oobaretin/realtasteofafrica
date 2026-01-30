/**
 * Adds an 'isVerified' column to restaurants.csv.
 * Set true for verified/claimed listings; run after payment + proof.
 * Run from repo root: node scripts/assign-verified-csv.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const INPUT = path.resolve(ROOT, "data", "restaurants.csv")
const OUTPUT = path.resolve(ROOT, "data", "restaurants.csv")

// Add slugs here when owners have paid and been verified
const VERIFIED_SLUGS = new Set([])

function normalizeSlug(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
}

async function main() {
  const csv = await fs.readFile(INPUT, "utf8")
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const existingHeaders = records.length ? Object.keys(records[0]) : []
  const hasIsVerified = existingHeaders.includes("isVerified")
  const cols = hasIsVerified ? existingHeaders : [...existingHeaders, "isVerified"]

  const out = records.map((row) => {
    const slug = normalizeSlug(row.slug)
    return {
      ...row,
      isVerified: VERIFIED_SLUGS.has(slug) ? "true" : "false",
    }
  })

  const escapeCsvField = (value) => {
    const s = String(value ?? "").trim()
    if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }
  const lines = [cols.join(",")]
  for (const row of out) {
    lines.push(cols.map((h) => escapeCsvField(row[h])).join(","))
  }

  await fs.writeFile(OUTPUT, lines.join("\n"), "utf8")
  const count = out.filter((r) => r.isVerified === "true").length
  console.log(`Set isVerified=true for ${count} restaurants -> ${path.relative(ROOT, OUTPUT)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
