/**
 * Generates an HTML file you can open in the browser to audit restaurants in batches.
 * Run from project root: node scripts/audit-batch-html.mjs
 * Then open data/audit-batch.html in your browser, open DevTools Console, and run:
 *   auditBatch(0, 10)   // opens first 10
 *   auditBatch(10, 10) // next 10
 *   auditBatch(20, 10) // etc.
 *
 * If a place is closed, delete it from restaurants.csv and re-run this script.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const CSV_PATH = path.resolve(ROOT, "data", "restaurants.csv")
const OUTPUT_PATH = path.resolve(ROOT, "data", "audit-batch.html")

function isGoogleMapsUrl(url) {
  if (!url || typeof url !== "string") return false
  const u = url.trim().toLowerCase()
  return u.includes("google.com/maps") || u.includes("goo.gl/maps")
}

async function main() {
  const csv = await fs.readFile(CSV_PATH, "utf8")
  const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })

  const restaurants = rows.map((r) => {
    const name = String(r.name ?? "").trim()
    const city = String(r.city ?? "").trim()
    const address = String(r.addressLine ?? "").trim()
    const mapsUrl = String(r.mapsUrl ?? "").trim()
    // Use Google Maps search — shows "Temporarily closed" / "Permanently closed" when applicable
    const query = address ? `${name} ${address}` : `${name} ${city} Texas`
    const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    const url = mapsUrl && isGoogleMapsUrl(mapsUrl) ? mapsUrl : mapsSearchUrl
    return { name, city, googleMapsUrl: url }
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Audit restaurants (10 at a time)</title>
</head>
<body>
  <h1>Audit restaurants</h1>
  <p>Open DevTools Console (Cmd+Option+J or F12), then run:</p>
  <pre>auditBatch(0, 10)   // first 10
auditBatch(10, 10)  // next 10
auditBatch(20, 10)  // etc.</pre>
  <p>Total: ${restaurants.length} restaurants. Each tab opens <strong>Google Maps</strong> — look for "Temporarily closed" or "Permanently closed". If closed, remove from <code>data/restaurants.csv</code> and re-run <code>node scripts/audit-batch-html.mjs</code>.</p>
  <p>See <code>docs/google-maps-audit.md</code> for search queries to find new restaurants.</p>
  <script>
    const restaurants = ${JSON.stringify(restaurants)};
    function auditBatch(startIndex, count) {
      const batch = restaurants.slice(startIndex, startIndex + count);
      batch.forEach(function(res) {
        const url = res.googleMapsUrl || "https://www.google.com/search?q=" + encodeURIComponent(res.name + " " + res.city);
        window.open(url, "_blank");
      });
      console.log("Opened " + batch.length + " tabs (indices " + startIndex + "–" + (startIndex + batch.length - 1) + ")");
    }
  </script>
</body>
</html>
`

  await fs.writeFile(OUTPUT_PATH, html, "utf8")
  console.log(`Wrote ${restaurants.length} restaurants -> ${path.relative(ROOT, OUTPUT_PATH)}`)
  console.log("Open that file in your browser, then run auditBatch(0, 10) in the console.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
