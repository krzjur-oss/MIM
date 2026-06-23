const CACHE_NAME = 'multibook-offline-v1';

// Static assets to fetch during the Service Worker installation
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// On Service Worker installation, cache critical assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((error) => {
        console.warn('Pre-caching warning during install:', error);
      });
    })
  );
});

// Clean up older caches when a new Service Worker is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removing old service worker cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// High-performance Stale-While-Revalidate and caching retrieval logic
self.addEventListener('fetch', (event) => {
  // Only handle standard GET requests (excluding API calls, drawing overlays, etc.)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // We only cache assets on our same platform origin, Google Fonts, and external Unsplash photos
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFont = url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com');
  const isUnsplashImg = url.origin.includes('images.unsplash.com');

  if (isSameOrigin || isGoogleFont || isUnsplashImg) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Stale-While-Revalidate: fetch a fresh copy in the background to update the cache
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch((err) => {
            // When completely offline, standard errors are expected and handled gracefully of course
            console.log('App is offline. Using cached asset for:', url.pathname);
          });

          // Serve cached asset immediately, fell back to network on cache miss
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
