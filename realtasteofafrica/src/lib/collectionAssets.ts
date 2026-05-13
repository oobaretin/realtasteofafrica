import fs from "node:fs"
import path from "node:path"

/** True if `public{urlPath}` exists (urlPath like `/collections/foo.jpg`). */
export function publicFileExists(urlPath: string): boolean {
  if (!urlPath.startsWith("/")) return false
  const relative = urlPath.slice(1)
  const full = path.join(process.cwd(), "public", relative)
  try {
    return fs.existsSync(full) && fs.statSync(full).isFile()
  } catch {
    return false
  }
}
