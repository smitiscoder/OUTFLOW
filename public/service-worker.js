// Cache name and assets to cache
const CACHE_NAME = 'outflow-cache-v6'; // Increment version
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-48x48.png',
  '/favicon-64x64.png',
  '/favicon-96x96.png',
  '/favicon-128x128.png',
  '/favicon-144x144.png',
  '/favicon-180x180.png',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/screenshot-wide.png',
  '/screenshot-narrow.png',
  // Add external resources (if applicable)
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap', // Example: Replace with your fonts
  // Add build assets (update after `npm run build`)
  '/static/js/main.chunk.js',
  '/static/js/vendors.chunk.js',
  '/static/css/main.chunk.css',
];

// Dynamic cache for non-critical resources (e.g., fonts, images)
const DYNAMIC_CACHE_NAME = 'outflow-dynamic-cache-v1';

// Install event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.error('Failed to cache some assets:', err);
        // Allow installation to proceed even if some assets fail
      });
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

// Fetch event: handle requests
self.addEventListener('fetch', (event) => {
  // Bypass Firestore requests (Firebase handles its own offline persistence)
  if (
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('firebase') ||
    event.request.mode === 'no-cors'
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Handle navigation requests (e.g., HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cachedResponse) => {
        return cachedResponse || fetch(event.request).catch(() => {
          return caches.match('/offline.html');
        });
      })
    );
    return;
  }

  // Handle other resources (JS, CSS, images, fonts, etc.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network and cache dynamically
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache only successful responses
          if (networkResponse && networkResponse.status === 200) {
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallbacks for specific resource types
          if (event.request.destination === 'image') {
            return new Response('Image not available offline', { status: 503 });
          }
          if (event.request.url.includes('fonts.googleapis.com')) {
            // Fallback CSS for fonts
            return new Response(
              `
              @font-face {
                font-family: 'Roboto';
                src: local('Arial'), local('Helvetica'), local('sans-serif');
              }
              `,
              { headers: { 'Content-Type': 'text/css' } }
            );
          }
          return new Response('Resource not available offline', { status: 503 });
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-expenses') {
    event.waitUntil(syncExpenses());
  }
});

// Function to sync queued expenses
async function syncExpenses() {
  try {
    // Notify clients (UI) to trigger sync
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SYNC_REQUEST' });
      });
    });
    // Wait for a client to confirm sync completion (optional)
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Fallback timeout
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
    throw error; // Retry sync on next trigger
  }
}
