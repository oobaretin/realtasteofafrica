/**
 * Analyzes restaurant data for potential duplicates:
 * - Same address (normalized)
 * - Same phone (normalized)
 * - Names more than 70% similar (Jaccard-like on words)
 *
 * Run from project root: node scripts/find-duplicates.mjs
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")

function normalizePhone(phone) {
  if (!phone || typeof phone !== "string") return ""
  return phone.replace(/\D/g, "").slice(-10) // last 10 digits
}

function normalizeAddress(addr) {
  if (!addr || typeof addr !== "string") return ""
  return addr
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/,/g, " ")
    .trim()
}

function wordSet(str) {
  if (!str || typeof str !== "string") return new Set()
  return new Set(
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  )
}

function nameSimilarity(a, b) {
  const setA = wordSet(a)
  const setB = wordSet(b)
  if (setA.size === 0 && setB.size === 0) return 1
  if (setA.size === 0 || setB.size === 0) return 0
  let intersection = 0
  for (const w of setA) {
    if (setB.has(w)) intersection++
  }
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  const byAddress = new Map()
  const byPhone = new Map()
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    const name = String(r.name ?? "").trim()
    const slug = String(r.slug ?? "").trim() || name
    const addr = normalizeAddress(r.addressLine)
    const phone = normalizePhone(r.phone)
    if (addr) {
      if (!byAddress.has(addr)) byAddress.set(addr, [])
      byAddress.get(addr).push({ index: i + 2, name, slug, addressLine: r.addressLine })
    }
    if (phone && phone.length >= 10) {
      if (!byPhone.has(phone)) byPhone.set(phone, [])
      byPhone.get(phone).push({ index: i + 2, name, slug, phone: r.phone })
    }
  }

  console.log("=== Same address (possible duplicates or ghost kitchen hub) ===\n")
  for (const [addr, list] of byAddress) {
    if (list.length < 2) continue
    console.log(`Address (${list.length}): ${addr}`)
    list.forEach((x) => console.log(`  - ${x.name} (slug: ${x.slug}, line ~${x.index})`))
    console.log("")
  }

  console.log("=== Same phone number ===\n")
  for (const [phone, list] of byPhone) {
    if (list.length < 2) continue
    console.log(`Phone (${list.length}): ${list[0].phone ?? phone}`)
    list.forEach((x) => console.log(`  - ${x.name} (slug: ${x.slug}, line ~${x.index})`))
    console.log("")
  }

  console.log("=== Names >70% similar ===\n")
  const SIM_THRESHOLD = 0.7
  const seen = new Set()
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = String(rows[i].name ?? "").trim()
      const b = String(rows[j].name ?? "").trim()
      if (!a || !b) continue
      const sim = nameSimilarity(a, b)
      if (sim >= SIM_THRESHOLD) {
        const key = [a, b].sort().join("|")
        if (seen.has(key)) continue
        seen.add(key)
        console.log(`Similarity ${(sim * 100).toFixed(0)}%: "${a}" vs "${b}"`)
        console.log(`  slugs: ${rows[i].slug ?? ""} | ${rows[j].slug ?? ""}`)
        console.log("")
      }
    }
  }

  console.log("Done. Review the list above and merge or remove duplicates in restaurants.csv.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
