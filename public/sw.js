// Build version hash injected by Vite during production build.
// In dev mode, defaults to 'dev'.
const BUILD_HASH = '__BUILD_HASH__';
const CACHE_NAME = (BUILD_HASH === '__BUILD_HASH__') ? 'multibook-mim-dev' : ('multibook-mim-' + BUILD_HASH);

// Critical core assets required for shell offline boot.
// Precached strictly via cache.addAll() during install; failure aborts SW installation.
const CORE_ASSETS = /* __CORE_ASSETS_START__ */ [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
] /* __CORE_ASSETS_END__ */;

// Secondary curriculum chunks, vendor libraries, and modular components.
// Precached best-effort with Promise.allSettled and per-file error tolerance.
const CONTENT_ASSETS = /* __CONTENT_ASSETS_START__ */ [
] /* __CONTENT_ASSETS_END__ */;

// On Service Worker installation:
// 1. Core assets must succeed via cache.addAll() - if any fails, installation fails and self.skipWaiting() is NOT called.
// 2. Content assets are loaded best-effort with Promise.allSettled and per-file catch.
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1. Cache critical core assets strictly; failure aborts SW installation
      await cache.addAll(CORE_ASSETS);

      // Only skip waiting if critical core assets successfully cached
      self.skipWaiting();

      // 2. Cache remaining content/vendor chunks best-effort
      if (CONTENT_ASSETS.length > 0) {
        await Promise.allSettled(
          CONTENT_ASSETS.map((asset) =>
            cache.add(asset).catch((err) => {
              console.warn('[SW] Non-critical asset cache warning:', asset, err);
            })
          )
        );
      }
    })()
  );
});

// Clean up older caches when a new Service Worker is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Delete all obsolete caches from previous builds
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removing old cache store:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );

      // 2. Claim clients immediately
      await self.clients.claim();
    })()
  );
});

// High-performance Stale-While-Revalidate and caching retrieval logic
self.addEventListener('fetch', (event) => {
  // Only handle standard GET requests (excluding non-GET, websockets, etc.)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // We cache assets on our same platform origin, Google Fonts, and external Unsplash photos
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFont = url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com');
  const isUnsplashImg = url.origin.includes('images.unsplash.com');

  if (isSameOrigin || isGoogleFont || isUnsplashImg) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Stale-While-Revalidate: fetch a fresh copy in the background to update the cache
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // When offline, network errors are expected; cached asset is returned
            return cachedResponse;
          });

          // Serve cached asset immediately, fall back to network fetch
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
