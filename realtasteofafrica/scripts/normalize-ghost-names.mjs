/**
 * Normalizes Ghost Kitchen names: strip "(Wilcrest Ghost)", "(Ghost)", etc. and set category to Ghost Kitchen.
 * Run from project root: node scripts/normalize-ghost-names.mjs [--fix]
 * Without --fix, only prints what would change.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const fix = process.argv.includes("--fix")

const GHOST_NAME_PATTERNS = [
  /\s*\([^)]*[Ww]ilcrest[^)]*[Gg]host[^)]*\)\s*$/,
  /\s*\([^)]*[Gg]host\s*[Kk]itchen[^)]*\)\s*$/,
  /\s*\([^)]*[Gg]host[^)]*\)\s*$/,
]

function normalizeGhostName(name) {
  if (!name || typeof name !== "string") return name
  let s = name.trim()
  for (const re of GHOST_NAME_PATTERNS) {
    s = s.replace(re, "").trim()
  }
  return s
}

function isGhostName(name) {
  if (!name || typeof name !== "string") return false
  const lower = name.toLowerCase()
  return lower.includes("ghost") || GHOST_NAME_PATTERNS.some((re) => re.test(name))
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const headers = rows.length ? Object.keys(rows[0]) : []

  const changes = []
  const out = rows.map((row) => {
    const newRow = { ...row }
    const name = String(row.name ?? "").trim()
    const newName = normalizeGhostName(name)
    let nameChange = false
    let categoryChange = false
    if (newName !== name) {
      newRow.name = newName
      nameChange = true
    }
    if (isGhostName(name) || isGhostName(newName)) {
      const currentCat = String(row.category ?? "").trim()
      if (currentCat !== "Ghost Kitchen") {
        newRow.category = "Ghost Kitchen"
        categoryChange = true
      }
    }
    if (nameChange || categoryChange) {
      changes.push({
        slug: row.slug,
        nameBefore: nameChange ? name : undefined,
        nameAfter: nameChange ? newName : undefined,
        setCategory: categoryChange || undefined,
      })
    }
    return newRow
  })

  if (changes.length === 0) {
    console.log("No ghost name / category changes needed.")
    return
  }

  console.log("Changes:")
  changes.forEach((c) => {
    const parts = []
    if (c.nameBefore != null) parts.push(`"${c.nameBefore}" → "${c.nameAfter}"`)
    if (c.setCategory) parts.push("category → Ghost Kitchen")
    console.log("  ", c.slug, "|", parts.join(" | "))
  })

  if (fix) {
    const csvOut = stringify(out, { header: true, columns: headers })
    await fs.writeFile(CSV_PATH, csvOut, "utf8")
    console.log(`Applied ${changes.length} change(s). Wrote ${path.relative(ROOT, CSV_PATH)}`)
    console.log("Run: npm run import:restaurants")
  } else {
    console.log("Run with --fix to apply.")
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
