/**
 * Real Taste of Africa - Data Integrity Script
 * Finds red-flag keywords and duplicates (same name + same city).
 * Reads from data/audit_list.json (or data/restaurants.csv via --csv).
 *
 * Run from project root: node scripts/audit-directory.mjs
 * Or with CSV (checks name + writeUp for red flags): node scripts/audit-directory.mjs --csv
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const AUDIT_LIST_PATH = path.resolve(ROOT, "data", "audit_list.json")
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const useCsv = process.argv.includes("--csv")

const redFlagKeywords = ["closed", "permanently", "inactive", "shut", "moved", "defunct"]

function auditDirectory(data, options = {}) {
  const { checkNotes = false, getNotes = () => "" } = options
  const flagged = []
  const duplicates = []

  data.forEach((item, index) => {
    const nameLower = (item.name || "").toLowerCase()
    const notesLower = checkNotes ? (getNotes(item) || "").toLowerCase() : ""

    // 1. Red-flag keywords in name or notes
    if (redFlagKeywords.some((keyword) => nameLower.includes(keyword) || notesLower.includes(keyword))) {
      flagged.push({
        name: item.name,
        city: item.city,
        slug: item.slug,
        reason: "Red flag keyword detected",
      })
    }

    // 2. Duplicate: same name + same city
    for (let i = index + 1; i < data.length; i++) {
      const other = data[i]
      if (
        (item.name || "").toLowerCase() === (other.name || "").toLowerCase() &&
        (item.city || "") === (other.city || "")
      ) {
        duplicates.push(`Duplicate: "${item.name}" in ${item.city} (slugs: ${item.slug}, ${other.slug})`)
      }
    }
  })

  console.log("RED FLAGS FOR REMOVAL:", flagged.length)
  if (flagged.length) flagged.forEach((f) => console.log("  -", f.name, "|", f.city, "|", f.reason))
  else console.log("  (none)")

  console.log("\nPOTENTIAL DUPLICATES:", duplicates.length)
  if (duplicates.length) duplicates.forEach((d) => console.log("  -", d))
  else console.log("  (none)")
}

async function main() {
  if (useCsv) {
    const csv = await fs.readFile(CSV_PATH, "utf8")
    const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
    const data = rows.map((r) => ({
      name: r.name,
      city: r.city,
      slug: r.slug,
      writeUp: r.writeUp,
    }))
    auditDirectory(data, { checkNotes: true, getNotes: (item) => item.writeUp })
  } else {
    const json = await fs.readFile(AUDIT_LIST_PATH, "utf8")
    const data = JSON.parse(json)
    auditDirectory(data)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
