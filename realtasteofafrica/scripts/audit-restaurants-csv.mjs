import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

/**
 * Audit `data/restaurants.csv` for common data quality issues.
 *
 * This does NOT try to prove correctness (that requires external verification),
 * but it catches many mistakes early and produces a short review checklist.
 *
 * Usage:
 *   node scripts/audit-restaurants-csv.mjs
 *   node scripts/audit-restaurants-csv.mjs --input data/restaurants.csv
 */

const ROOT = process.cwd()

function parseArg(flag) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1) return undefined
  return process.argv[idx + 1]
}

async function loadAreaSlugs() {
  // We intentionally avoid importing TS modules from this .mjs script.
  // Instead, we read the source file and extract `slug: "..."` values.
  const areasTsPath = path.resolve(ROOT, "src", "lib", "areas.ts")
  const src = await fs.readFile(areasTsPath, "utf8")
  const slugs = []
  const re = /\bslug:\s*"([^"]+)"\s*,?/g
  for (;;) {
    const m = re.exec(src)
    if (!m) break
    slugs.push(m[1])
  }
  return new Set(slugs)
}

function isEmpty(v) {
  return String(v ?? "").trim() === ""
}

function isPlaceholder(v) {
  const s = String(v ?? "").trim().toLowerCase()
  return s === "n/a" || s === "na" || s === "none" || s === "null" || s === "0"
}

function looksLikeUrl(v) {
  const s = String(v ?? "").trim()
  if (!s) return false
  try {
    const u = new URL(s)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

function looksLikePhone(v) {
  const s = String(v ?? "").trim()
  if (!s) return false
  if (isPlaceholder(s)) return false
  // Allow common formats:
  // - (832) 771-8778
  // - +18327718778
  // - 832-771-8778
  // - 8327718778
  const digits = s.replace(/\D/g, "")
  if (digits.length === 10) return true
  if (digits.length === 11 && digits.startsWith("1")) return true
  return false
}

function hasZip(addressLine) {
  const s = String(addressLine ?? "")
  return /\b\d{5}\b/.test(s)
}

function maybeBadUnicodePhone(v) {
  // catches common copy/paste: U+2011 non-breaking hyphen, U+2013 en dash, etc.
  const s = String(v ?? "")
  return /[\u2010-\u2015\u2212]/.test(s)
}

function splitPipes(v) {
  const raw = String(v ?? "").trim()
  if (!raw) return []
  return raw
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean)
}

function pad(n) {
  return String(n).padStart(3, " ")
}

async function main() {
  const VALID_AREA_SLUGS = await loadAreaSlugs()
  const input = path.resolve(ROOT, parseArg("--input") || path.join("data", "restaurants.csv"))
  const csv = await fs.readFile(input, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  /** @type {Array<{level:"error"|"warn", code:string, line:number, slug?:string, message:string}>} */
  const findings = []

  rows.forEach((r, idx) => {
    const line = idx + 2
    const slug = String(r.slug ?? "").trim()

    // --- Required-ish sanity checks (beyond import script) ---
    if (!VALID_AREA_SLUGS.has(String(r.areaSlug ?? "").trim())) {
      findings.push({
        level: "error",
        code: "bad_area_slug",
        line,
        slug,
        message: `Unknown areaSlug "${r.areaSlug}"`,
      })
    }

    if (!String(r.state ?? "").trim()) {
      findings.push({
        level: "error",
        code: "missing_state",
        line,
        slug,
        message: "Missing state",
      })
    } else if (String(r.state).trim() !== "TX") {
      findings.push({
        level: "warn",
        code: "non_tx_state",
        line,
        slug,
        message: `State is "${String(r.state).trim()}" (directory is TX-focused)`,
      })
    }

    // --- Placeholders ---
    ;["phone", "websiteUrl", "addressLine", "mapsUrl"].forEach((k) => {
      if (isPlaceholder(r[k])) {
        findings.push({
          level: "warn",
          code: "placeholder_value",
          line,
          slug,
          message: `${k} is a placeholder ("${String(r[k]).trim()}") — prefer empty instead`,
        })
      }
    })

    // --- Phone ---
    if (!isEmpty(r.phone)) {
      if (!looksLikePhone(r.phone)) {
        findings.push({
          level: "warn",
          code: "bad_phone_format",
          line,
          slug,
          message: `Phone looks unusual: "${String(r.phone).trim()}"`,
        })
      }
      if (maybeBadUnicodePhone(r.phone)) {
        findings.push({
          level: "warn",
          code: "unicode_dash_in_phone",
          line,
          slug,
          message: `Phone contains a non-standard dash character: "${String(r.phone).trim()}"`,
        })
      }
    } else if (!isEmpty(r.websiteUrl)) {
      findings.push({
        level: "warn",
        code: "missing_phone_has_website",
        line,
        slug,
        message: "Missing phone but has websiteUrl (good candidate for enrichment)",
      })
    }

    // --- Website URL ---
    if (!isEmpty(r.websiteUrl)) {
      if (!looksLikeUrl(r.websiteUrl)) {
        findings.push({
          level: "warn",
          code: "bad_website_url",
          line,
          slug,
          message: `websiteUrl is not a valid http(s) URL: "${String(r.websiteUrl).trim()}"`,
        })
      }
    }

    // --- Address / ZIP ---
    if (!isEmpty(r.addressLine) && !hasZip(r.addressLine)) {
      findings.push({
        level: "warn",
        code: "missing_zip",
        line,
        slug,
        message: `Address is missing a ZIP: "${String(r.addressLine).trim()}"`,
      })
    }

    // --- Highlights ---
    const highlights = splitPipes(r.highlights)
    if (highlights.length === 0) {
      findings.push({
        level: "warn",
        code: "missing_highlights",
        line,
        slug,
        message: "Missing highlights (UI looks better with 1-3 quick tags)",
      })
    }
    if (highlights.length > 6) {
      findings.push({
        level: "warn",
        code: "too_many_highlights",
        line,
        slug,
        message: `Highlights has ${highlights.length} items; consider keeping it <= 6`,
      })
    }
  })

  const errors = findings.filter((f) => f.level === "error")
  const warns = findings.filter((f) => f.level === "warn")

  const byCode = findings.reduce((acc, f) => {
    acc.set(f.code, (acc.get(f.code) ?? 0) + 1)
    return acc
  }, new Map())

  const topCodes = Array.from(byCode.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  console.log(`Audit: ${path.relative(ROOT, input)} (${rows.length} rows)`)
  console.log(`Errors: ${errors.length}, Warnings: ${warns.length}`)
  if (topCodes.length) {
    console.log("\nTop issue types:")
    for (const [code, count] of topCodes) {
      console.log(`- ${code}: ${count}`)
    }
  }

  const sample = findings.slice(0, 30)
  if (sample.length) {
    console.log("\nSample findings (first 30):")
    for (const f of sample) {
      const where = `line ${pad(f.line)}${f.slug ? ` slug=${f.slug}` : ""}`
      console.log(`- [${f.level.toUpperCase()}] ${f.code} @ ${where}: ${f.message}`)
    }
    if (findings.length > sample.length) console.log(`...and ${findings.length - sample.length} more`)
  }

  // Exit non-zero only on errors (warnings are informational)
  if (errors.length) process.exit(1)
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})

