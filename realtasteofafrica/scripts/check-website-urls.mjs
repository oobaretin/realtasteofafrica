#!/usr/bin/env node
/**
 * Check which restaurant website URLs are reachable.
 * Run: node scripts/check-website-urls.mjs
 * Outputs broken URLs for manual fixing.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const CSV_PATH = path.join(process.cwd(), "data", "restaurants.csv")
const TIMEOUT_MS = 10000

async function fetchStatus(url) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RealTasteOfAfrica/1.0)" },
    })
    clearTimeout(timeout)
    return { ok: res.ok, status: res.status, url: res.url }
  } catch (err) {
    const msg = err.message || ""
    if (msg.includes("fetch failed") || msg.includes("ENOTFOUND") || msg.includes("NXDOMAIN")) {
      return { ok: false, error: "DNS_FAILED" }
    }
    if (msg.includes("abort") || msg.includes("timeout")) {
      return { ok: false, error: "TIMEOUT" }
    }
    return { ok: false, error: msg.slice(0, 80) }
  }
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

  const broken = []
  for (let i = 0; i < toCheck.length; i++) {
    const { name, city, url } = toCheck[i]
    process.stdout.write(`[${i + 1}/${toCheck.length}] ${name.substring(0, 40).padEnd(40)} `)
    const result = await fetchStatus(url)
    if (result.ok) {
      console.log("✓")
    } else {
      const err = result.error || `HTTP ${result.status}`
      console.log(`✗ ${err}`)
      broken.push({ name, city, url, error: err })
    }
  }

  if (broken.length > 0) {
    console.log("\n--- BROKEN URLs ---\n")
    broken.forEach((b) => {
      console.log(`${b.name} (${b.city})`)
      console.log(`  ${b.url}`)
      console.log(`  Error: ${b.error}\n`)
    })
  }
  console.log(`\nTotal: ${broken.length} broken of ${toCheck.length} checked`)
}

main().catch(console.error)
