#!/usr/bin/env node
/**
 * Generate favicons from public/favicon.png with padding trimmed so the logo
 * fills the browser tab frame instead of appearing tiny.
 *
 * Output:
 *   src/app/icon.png (48x48)
 *   src/app/apple-icon.png (180x180)
 *   public/favicon-32.png
 *   public/favicon-192.png
 *   public/web-app-manifest-512x512.png
 */
import sharp from "sharp"
import path from "node:path"
import fs from "node:fs/promises"

const ROOT = process.cwd()
const input = path.join(ROOT, "public", "favicon.png")

const OUTPUTS = [
  { size: 32, path: path.join(ROOT, "public", "favicon-32.png") },
  { size: 48, path: path.join(ROOT, "src", "app", "icon.png") },
  { size: 180, path: path.join(ROOT, "src", "app", "apple-icon.png") },
  { size: 192, path: path.join(ROOT, "public", "favicon-192.png") },
  { size: 512, path: path.join(ROOT, "public", "web-app-manifest-512x512.png") },
]

/** Trim uniform black/near-black borders, then fit logo into square with small margin. */
async function buildFaviconPipeline(source, size) {
  const trimmed = await sharp(source).trim({ threshold: 12 }).toBuffer()
  const margin = Math.max(1, Math.round(size * 0.06))
  const inner = size - margin * 2
  return sharp(trimmed)
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false })
    .extend({
      top: margin,
      bottom: margin,
      left: margin,
      right: margin,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .resize(size, size)
    .png()
}

async function main() {
  const buf = await fs.readFile(input)
  await fs.mkdir(path.join(ROOT, "src", "app"), { recursive: true })

  for (const { size, path: outPath } of OUTPUTS) {
    await buildFaviconPipeline(buf, size).toFile(outPath)
    console.log(`Wrote ${path.relative(ROOT, outPath)} (${size}x${size})`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
