#!/usr/bin/env node
/**
 * Mark listings as internally audited (editorial QA — not owner isVerified).
 * Sets internal_verified=true and last_audit_date for rows with complete core fields.
 *
 * Run: node scripts/mark-directory-audited.mjs
 *      node scripts/mark-directory-audited.mjs --dryRun
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"
import { stringify } from "csv-stringify/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const AUDIT_DATE = process.argv.find((a) => a.startsWith("--date="))?.split("=")[1] ?? "2026-07-23"

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function isComplete(row) {
  return (
    String(row.phone ?? "").trim() &&
    String(row.latitude ?? "").trim() &&
    String(row.longitude ?? "").trim() &&
    String(row.websiteUrl ?? "").trim() &&
    String(row.writeUp ?? "").trim()
  )
}

async function main() {
  const dryRun = hasFlag("--dryRun")
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
  if (rows.length === 0) {
    console.error("No rows in CSV")
    process.exit(1)
  }

  const headers = Object.keys(rows[0])
  if (!headers.includes("last_audit_date")) headers.push("last_audit_date")
  if (!headers.includes("internal_verified")) headers.push("internal_verified")

  let updated = 0
  for (const row of rows) {
    if (!isComplete(row)) continue
    const already =
      String(row.internal_verified ?? "").toLowerCase() === "true" &&
      String(row.last_audit_date ?? row.lastAuditDate ?? "").startsWith("2026")
    if (already) continue

    if (dryRun) {
      console.log(`[dry-run] would audit: ${row.slug}`)
      updated++
      continue
    }

    row.internal_verified = "true"
    row.last_audit_date = AUDIT_DATE
    updated++
  }

  if (dryRun) {
    console.log(`Dry run: ${updated} listing(s) would be marked audited.`)
    return
  }

  const output = stringify(rows, { header: true, columns: headers, quoted_empty: false, quoted_string: true })
  await fs.writeFile(CSV_PATH, output, "utf8")
  console.log(`Marked ${updated} listing(s) internal_verified=true (audit date ${AUDIT_DATE}).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
