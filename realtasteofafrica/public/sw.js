const CACHE = "rtofa-shell-v2"
const PRECACHE = [
  "/manifest.webmanifest",
  "/favicon-192.png",
  "/web-app-manifest-512x512.png",
  "/realtasteofafrica.png",
  "/offline.html",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    /\.(png|jpg|jpeg|webp|svg|ico|woff2?|html)$/i.test(url.pathname)

  const isNavigation = event.request.mode === "navigate"

  if (!isStaticAsset && !PRECACHE.includes(url.pathname) && !isNavigation) return

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      if (isNavigation) {
        try {
          const response = await fetch(event.request)
          return response
        } catch {
          return (await cache.match("/offline.html")) ?? Response.error()
        }
      }

      const cached = await cache.match(event.request)
      if (cached) return cached

      try {
        const response = await fetch(event.request)
        if (response.ok) {
          cache.put(event.request, response.clone())
        }
        return response
      } catch {
        return cached ?? (await cache.match("/offline.html")) ?? Response.error()
      }
    })
  )
})
