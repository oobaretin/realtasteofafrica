import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

/**
 * Best-effort phone enrichment from each restaurant's own website.
 *
 * We only fill `phone` when it's currently empty and `websiteUrl` is present.
 * We try (in order):
 * - `tel:` links
 * - JSON-LD: LocalBusiness/Restaurant telephone
 * - Common phone patterns in page text
 *
 * Usage:
 *   node scripts/enrich-restaurants-from-websites.mjs --dryRun
 *   node scripts/enrich-restaurants-from-websites.mjs --limit 10 --dryRun
 *   node scripts/enrich-restaurants-from-websites.mjs --concurrency 3
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

function csvEscape(value) {
  const s = String(value ?? "")
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsvRow(values) {
  return values.map(csvEscape).join(",")
}

function normalizePhone(raw) {
  const s = String(raw ?? "").trim()
  if (!s) return undefined

  // keep digits only (and leading +)
  const plus = s.trim().startsWith("+") ? "+" : ""
  const digits = s.replace(/[^\d]/g, "")
  if (!digits) return undefined

  // US-format 10 digits
  const d = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits
  if (d.length === 10) return `${plus}(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`

  // fallback: return digits (still better than empty)
  return `${plus}${digits}`
}

function extractPhonesFromTelLinks(html) {
  const out = new Set()
  const re = /href\s*=\s*["']\s*tel:([^"'>\s]+)\s*["']/gi
  let m
  while ((m = re.exec(html))) {
    const decoded = decodeURIComponent(m[1]).replace(/\s+/g, " ").trim()
    const phone = normalizePhone(decoded)
    if (phone) out.add(phone)
  }
  return Array.from(out)
}

function extractPhonesFromJsonLd(html) {
  const out = new Set()
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html))) {
    const jsonText = m[1].trim()
    if (!jsonText) continue
    try {
      const parsed = JSON.parse(jsonText)
      const candidates = Array.isArray(parsed) ? parsed : [parsed]
      for (const obj of candidates) {
        const tel = obj?.telephone ?? obj?.tel
        const phone = normalizePhone(tel)
        if (phone) out.add(phone)
      }
    } catch {
      // ignore invalid JSON-LD blocks
    }
  }
  return Array.from(out)
}

function extractPhonesByPattern(html) {
  const out = new Set()
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")

  // Common US phone patterns. Avoid capturing years/prices by requiring separators.
  const re =
    /\b(?:\+?1[\s.-]?)?(?:\(\s*\d{3}\s*\)|\d{3})[\s.-]\d{3}[\s.-]\d{4}\b/g
  const matches = text.match(re) ?? []
  for (const raw of matches) {
    const phone = normalizePhone(raw)
    if (phone) out.add(phone)
  }
  return Array.from(out)
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "RealTasteOfAfricaBot/1.0 (phone enrichment; contact via site owner)",
      accept: "text/html,application/xhtml+xml",
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const ct = res.headers.get("content-type") ?? ""
  if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
    // Some ordering platforms return JSON; skip.
    throw new Error(`Non-HTML content-type: ${ct}`)
  }
  return await res.text()
}

async function main() {
  const inputPath = path.resolve(ROOT, parseArg("--input") || path.join("data", "restaurants.csv"))
  const outPath = path.resolve(ROOT, parseArg("--output") || path.join("data", "restaurants.csv"))
  const dryRun = hasFlag("--dryRun")
  const limit = Number(parseArg("--limit") || "0") || undefined
  const concurrency = Number(parseArg("--concurrency") || "3") || 3

  const csv = await fs.readFile(inputPath, "utf8")
  const records = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  const headers = records.length ? Object.keys(records[0]) : []

  const candidates = records.filter((r) => {
    const phoneEmpty = !String(r.phone ?? "").trim()
    const website = String(r.websiteUrl ?? "").trim()
    return phoneEmpty && website && website.toLowerCase() !== "n/a"
  })

  const work = limit ? candidates.slice(0, limit) : candidates

  let updated = 0
  let attempted = 0
  const failures = []

  async function processOne(row) {
    attempted++
    const url = String(row.websiteUrl).trim()
    try {
      const html = await fetchHtml(url)
      const phones = [
        ...extractPhonesFromTelLinks(html),
        ...extractPhonesFromJsonLd(html),
        ...extractPhonesByPattern(html),
      ]
      const phone = phones[0]
      if (phone) {
        row.phone = phone
        updated++
      }
    } catch (e) {
      failures.push({ name: row.name, url, error: e instanceof Error ? e.message : String(e) })
    }
  }

  // Simple concurrency pool
  const queue = work.slice()
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const row = queue.shift()
      if (!row) break
      // eslint-disable-next-line no-await-in-loop
      await processOne(row)
    }
  })
  await Promise.all(workers)

  console.log(`Candidates (missing phone + has website): ${candidates.length}`)
  console.log(`Attempted: ${attempted}`)
  console.log(`Updated phones: ${updated}`)
  console.log(`Failures: ${failures.length}`)
  if (failures.length) console.log(failures.slice(0, 10))

  if (dryRun) {
    console.log("Dry run: no file written.")
    return
  }

  const outLines = [toCsvRow(headers)]
  for (const r of records) outLines.push(toCsvRow(headers.map((h) => r[h] ?? "")))
  await fs.writeFile(outPath, outLines.join("\n") + "\n", "utf8")
  console.log(`Wrote enriched CSV -> ${path.relative(ROOT, outPath)}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

