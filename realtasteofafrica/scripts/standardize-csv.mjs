/**
 * Standardizes restaurant CSV data:
 * - Phone numbers -> (XXX) XXX-XXXX
 * - City names -> Title Case
 * - Ensures every row has a category (default: Restaurant)
 *
 * Run from project root: node scripts/standardize-csv.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")

const VALID_CATEGORIES = ["Food Truck", "Ghost Kitchen", "Market", "Market + Kitchen", "Restaurant"]
const DEFAULT_CATEGORY = "Restaurant"

function formatPhone(phone) {
  if (!phone || typeof phone !== "string") return ""
  const digits = phone.replace(/\D/g, "")
  if (digits.length >= 10) {
    const area = digits.slice(-10, -7)
    const mid = digits.slice(-7, -4)
    const last = digits.slice(-4)
    return `(${area}) ${mid}-${last}`
  }
  return phone.trim()
}

function titleCaseCity(city) {
  if (!city || typeof city !== "string") return ""
  return city
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
}

function escapeCsvField(value) {
  const s = String(value ?? "").trim()
  if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const headers = rows.length ? Object.keys(rows[0]) : []

  let phoneCount = 0
  let cityCount = 0
  let categoryCount = 0

  // Ensure internal_verified column exists for audit tracking
  if (rows.length && !Object.prototype.hasOwnProperty.call(rows[0], "internal_verified")) {
    headers.push("internal_verified")
  }

  const out = rows.map((row) => {
    const newRow = { ...row }
    if (newRow.internal_verified === undefined && newRow.internalVerified === undefined) {
      newRow.internal_verified = ""
    }

    if (row.phone) {
      const formatted = formatPhone(row.phone)
      if (formatted && formatted !== row.phone) {
        newRow.phone = formatted
        phoneCount++
      }
    }

    if (row.city) {
      const titled = titleCaseCity(row.city)
      if (titled && titled !== row.city) {
        newRow.city = titled
        cityCount++
      }
    }

    const cat = String(row.category ?? "").trim()
    if (!cat || !VALID_CATEGORIES.includes(cat)) {
      newRow.category = DEFAULT_CATEGORY
      categoryCount++
    }

    return newRow
  })

  const csvOut = stringify(out, { header: true, columns: headers })
  await fs.writeFile(CSV_PATH, csvOut, "utf8")

  console.log("Standardized:")
  console.log(`  Phones formatted: ${phoneCount}`)
  console.log(`  Cities title-cased: ${cityCount}`)
  console.log(`  Category set to "${DEFAULT_CATEGORY}": ${categoryCount}`)
  console.log(`  Wrote ${path.relative(ROOT, CSV_PATH)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
