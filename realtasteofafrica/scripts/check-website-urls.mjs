#!/usr/bin/env node
/**
 * Check which restaurant website URLs are reachable.
 * Run: node scripts/check-website-urls.mjs
 * Writes data/website-audit.json and prints a summary.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const CSV_PATH = path.join(process.cwd(), "data", "restaurants.csv")
const OUT_PATH = path.join(process.cwd(), "data", "website-audit.json")
const TIMEOUT_MS = 12000
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

async function fetchStatus(url) {
  for (const method of ["GET", "HEAD"]) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
      })
      clearTimeout(timeout)
      const status = res.status
      if (status === 403) {
        return { ok: true, status, note: "bot_blocked", finalUrl: res.url, method }
      }
      return { ok: res.ok, status, finalUrl: res.url, method }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (method === "HEAD" && !msg.includes("abort")) continue
      if (msg.includes("fetch failed") || msg.includes("ENOTFOUND") || msg.includes("NXDOMAIN")) {
        return { ok: false, error: "DNS_FAILED", method }
      }
      if (msg.includes("abort") || msg.includes("timeout")) {
        return { ok: false, error: "TIMEOUT", method }
      }
      return { ok: false, error: msg.slice(0, 120), method }
    }
  }
  return { ok: false, error: "UNREACHABLE" }
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf-8")
  const rows = parse(csv, { columns: true, relax_column_count: true })
  const withUrls = rows.filter((r) => r.websiteUrl && String(r.websiteUrl).trim())
  const seen = new Set()
  const toCheck = []
  for (const r of withUrls) {
    const url = String(r.websiteUrl).trim()
    if (seen.has(url)) continue
    seen.add(url)
    toCheck.push({ name: r.name, city: r.city, url })
  }

  console.log(`Checking ${toCheck.length} unique website URLs...\n`)

  const allUniqueUrls = []
  const broken = []
  for (let i = 0; i < toCheck.length; i++) {
    const { name, city, url } = toCheck[i]
    process.stdout.write(`[${i + 1}/${toCheck.length}] ${name.substring(0, 40).padEnd(40)} `)
    const result = await fetchStatus(url)
    allUniqueUrls.push({ url, ...result })
    if (result.ok) {
      console.log(result.note === "bot_blocked" ? "✓ (403 bot block — likely fine)" : "✓")
    } else {
      const err = result.error || `HTTP ${result.status}`
      console.log(`✗ ${err}`)
      broken.push({ name, city, url, ...result })
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    checked: toCheck.length,
    brokenCount: broken.length,
    broken,
    allUniqueUrls,
  }
  await fs.writeFile(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8")

  if (broken.length > 0) {
    console.log("\n--- BROKEN URLs ---\n")
    broken.forEach((b) => {
      console.log(`${b.name} (${b.city})`)
      console.log(`  ${b.url}`)
      console.log(`  Error: ${b.error || b.status}\n`)
    })
  }
  console.log(`\nWrote ${path.relative(process.cwd(), OUT_PATH)}`)
  console.log(`Total: ${broken.length} broken of ${toCheck.length} checked`)
}

main().catch(console.error)
