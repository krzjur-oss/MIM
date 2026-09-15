// Build version hash injected by Vite during production build.
// In dev mode, defaults to 'dev'.
const BUILD_HASH = '__BUILD_HASH__';
const CACHE_NAME = (BUILD_HASH === '__BUILD_HASH__') ? 'multibook-mim-dev' : ('multibook-mim-' + BUILD_HASH);

// Static assets to fetch during Service Worker installation.
// In production builds, this array is automatically populated by Vite's pwaPrecachePlugin
// with the complete manifest of compiled JS/CSS bundles and assets.
const PRECACHE_ASSETS = /* __PRECACHE_ASSETS_START__ */ [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
] /* __PRECACHE_ASSETS_END__ */;

// On Service Worker installation, precache all critical assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        PRECACHE_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn('[SW] Pre-caching warning for asset:', asset, err);
          });
        })
      );
    })
  );
});

// Clean up older caches when a new Service Worker is activated,
// and purge obsolete hashed asset entries within the cache so old assets/*.js/*.css do not linger.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Delete all completely outdated caches (different CACHE_NAME)
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removing old cache store:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );

      // 2. Open current cache and purge obsolete hashed assets within it
      //    (e.g., stale assets/*.js or assets/*.css from previous builds)
      try {
        const currentCache = await caches.open(CACHE_NAME);
        const cachedRequests = await currentCache.keys();

        // Normalize valid asset names for matching
        const validAssetSet = new Set(
          PRECACHE_ASSETS.map((asset) => asset.replace(/^\.\//, '').replace(/^\//, ''))
        );

        await Promise.all(
          cachedRequests.map(async (request) => {
            const url = new URL(request.url);
            // Only inspect same-origin hashed build assets
            if (url.origin === self.location.origin && url.pathname.includes('/assets/')) {
              const isStillCurrent = Array.from(validAssetSet).some((validAsset) => {
                return url.pathname.endsWith(validAsset);
              });

              if (!isStillCurrent) {
                console.log('[SW] Deleting obsolete cached asset entry:', url.pathname);
                await currentCache.delete(request);
              }
            }
          })
        );
      } catch (err) {
        console.warn('[SW] Error during intra-cache stale asset pruning:', err);
      }

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
