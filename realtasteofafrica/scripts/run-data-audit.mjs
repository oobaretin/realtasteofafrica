#!/usr/bin/env node
/**
 * Consolidated data quality audit for restaurants.csv.
 * Run: npm run audit:data
 * Live website check (slow): npm run audit:data -- --live
 */
import fs from "node:fs/promises"
import path from "node:path"
import { spawn } from "node:child_process"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const WEBSITE_AUDIT_PATH = path.resolve(ROOT, "data", "website-audit.json")
const OUT_PATH = path.resolve(ROOT, "data", "data-audit-summary.json")

function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""
    child.stdout.on("data", (d) => {
      stdout += d
    })
    child.stderr.on("data", (d) => {
      stderr += d
    })
    child.on("close", (code) => {
      if (code === 0) resolve(stdout)
      else reject(new Error(stderr || stdout || `Exit ${code}`))
    })
  })
}

async function countMissingHours(rows) {
  return rows.filter((r) => !r.hours || String(r.hours).trim().length < 20).length
}

async function main() {
  const live = process.argv.includes("--live")
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  let duplicateStatus = "ok"
  try {
    await runNodeScript(path.resolve(ROOT, "scripts", "validate-restaurants-csv.mjs"))
  } catch {
    duplicateStatus = "failed"
  }

  if (live) {
    console.log("Running live website URL check (this may take several minutes)…")
    await runNodeScript(path.resolve(ROOT, "scripts", "check-website-urls.mjs"))
  }

  let websiteAudit = null
  try {
    websiteAudit = JSON.parse(await fs.readFile(WEBSITE_AUDIT_PATH, "utf8"))
  } catch {
    websiteAudit = null
  }

  const missingHours = await countMissingHours(rows)
  const withWebsite = rows.filter((r) => String(r.websiteUrl ?? "").trim()).length
  const withCoords = rows.filter(
    (r) => String(r.latitude ?? "").trim() && String(r.longitude ?? "").trim()
  ).length

  const summary = {
    generatedAt: new Date().toISOString(),
    totalListings: rows.length,
    missingHours,
    withWebsite,
    withCoords,
    duplicateCheck: duplicateStatus,
    websiteAudit: websiteAudit
      ? {
          generatedAt: websiteAudit.generatedAt,
          checked: websiteAudit.checked,
          brokenCount: websiteAudit.brokenCount ?? websiteAudit.broken?.length ?? 0,
          brokenSlugs: (websiteAudit.broken ?? []).map((b) => b.slug).filter(Boolean),
        }
      : null,
  }

  await fs.writeFile(OUT_PATH, `${JSON.stringify(summary, null, 2)}\n`, "utf8")

  console.log("Data audit summary")
  console.log("-".repeat(40))
  console.log(`Listings:          ${summary.totalListings}`)
  console.log(`Missing hours:     ${summary.missingHours}`)
  console.log(`With website:      ${summary.withWebsite}`)
  console.log(`With coordinates:  ${summary.withCoords}`)
  console.log(`Duplicate check:   ${summary.duplicateCheck}`)
  if (summary.websiteAudit) {
    console.log(`Broken websites:   ${summary.websiteAudit.brokenCount} (audit ${summary.websiteAudit.generatedAt})`)
  } else {
    console.log("Broken websites:   (run with --live to refresh website-audit.json)")
  }
  console.log(`\nWrote ${path.relative(ROOT, OUT_PATH)}`)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
