import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "csv-parse/sync"

const ROOT = process.cwd()
const INPUT = path.resolve(ROOT, "data", "restaurants.csv")
const OUTPUT = path.resolve(ROOT, "data", "restaurants.json")

function splitPipes(value) {
  const raw = String(value ?? "").trim()
  if (!raw) return []
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
}

function asOptionalString(value) {
  const s = String(value ?? "").trim()
  return s || undefined
}

/** Map highlights to category: Food Truck, Ghost Kitchen, Market, Market + Kitchen, or Restaurant */
function getCategory(highlights) {
  const h = Array.isArray(highlights) ? highlights : splitPipes(highlights)
  const lower = (s) => s.toLowerCase()

  if (h.some((x) => lower(x).includes("food truck"))) return "Food Truck"
  if (h.some((x) => lower(x).includes("ghost kitchen"))) return "Ghost Kitchen"
  if (
    h.some((x) => lower(x).includes("market-kitchen")) ||
    h.some((x) => lower(x).includes("restaurant + market")) ||
    (h.some((x) => lower(x).includes("market")) && h.some((x) => lower(x).includes("kitchen")))
  )
    return "Market + Kitchen"
  if (h.some((x) => lower(x).includes("market"))) return "Market"
  return "Restaurant"
}

async function main() {
  const csv = await fs.readFile(INPUT, "utf8")
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const validCategories = ["Food Truck", "Ghost Kitchen", "Market", "Market + Kitchen", "Restaurant"]
  const out = records.map((row) => {
    const highlights = splitPipes(row.highlights)
    const categoryFromColumn = asOptionalString(row.category)
    const category =
      categoryFromColumn && validCategories.includes(categoryFromColumn)
        ? categoryFromColumn
        : getCategory(highlights)
    const city = String(row.city ?? "").trim()
    return {
      name: String(row.name ?? "").trim(),
      city,
      state: String(row.state ?? "").trim(),
      addressLine: String(row.addressLine ?? "").trim(),
      phone: asOptionalString(row.phone),
      websiteUrl: asOptionalString(row.websiteUrl),
      category,
      cuisines: splitPipes(row.cuisines),
      slug: String(row.slug ?? "").trim() || null,
      areaSlug: String(row.areaSlug ?? "").trim(),
      ...(asOptionalString(row.priceLevel) && {
        priceLevel: Number(row.priceLevel),
      }),
      ...(asOptionalString(row.writeUp) && { writeUp: row.writeUp.trim() }),
    }
  })

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true })
  await fs.writeFile(OUTPUT, JSON.stringify(out, null, 2), "utf8")

  console.log(
    `Exported ${out.length} restaurants -> ${path.relative(ROOT, OUTPUT)}`
  )
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
