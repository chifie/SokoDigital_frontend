/**
 * SokoDigital Service Worker
 *
 * Pre-caches hero banner images and static assets so repeat visits
 * load instantly — even on slow/flaky connections.
 *
 * Strategy: Cache-first for images (no network needed after first visit),
 * network-first for everything else.
 */

const CACHE_NAME = "sokodigital-v1";

// Hero banner images to pre-cache (AVIF + WebP variants for the first banner)
const PRECACHE_URLS = [
  // Banner 1 — HD + AVIF variants
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80&fm=avif&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=100&fm=webp&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fm=avif&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=100&fm=webp&fit=crop",
];

// ─── Install: pre-cache critical assets ───
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Best-effort cache — don't block install on failures
      for (const url of PRECACHE_URLS) {
        try {
          const response = await fetch(url, { mode: "cors" });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch {
          // Network might not be available during install — skip
        }
      }
    })()
  );
  self.skipWaiting();
});

// ─── Activate: clean old caches ───
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })()
  );
  self.clients.claim();
});

// ─── Fetch: cache-first for images, network-first for everything else ───
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle http(s) requests
  if (!url.protocol.startsWith("http")) return;

  // Images: cache-first strategy
  if (request.destination === "image" || /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)(\?|$)/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Static assets (fonts, CSS, JS from the same origin): cache-first
  if (
    url.origin === self.location.origin &&
    /\.(woff2?|ttf|eot|css|js)(\?|$)/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else: network-first (falls back to cache if offline)
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      // Don't wait for cache put to return the response
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // If we're offline and nothing is cached, return a fallback
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503 });
  }
}
