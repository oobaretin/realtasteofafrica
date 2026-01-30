#!/usr/bin/env node
/**
 * Resize public/favicon.png to 32x32 (tab) and 180x180 (apple-touch)
 * so the logo fills the frame and fits correctly in the browser.
 * Output: src/app/icon.png, src/app/apple-icon.png
 */
import sharp from "sharp"
import path from "node:path"
import fs from "node:fs/promises"

const ROOT = process.cwd()
const input = path.join(ROOT, "public", "favicon.png")
const appDir = path.join(ROOT, "src", "app")

async function main() {
  const buf = await fs.readFile(input)
  await fs.mkdir(appDir, { recursive: true })

  await sharp(buf)
    .resize(32, 32)
    .png()
    .toFile(path.join(appDir, "icon.png"))
  console.log("Wrote src/app/icon.png (32x32)")

  await sharp(buf)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, "apple-icon.png"))
  console.log("Wrote src/app/apple-icon.png (180x180)")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
