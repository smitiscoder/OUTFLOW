// Cache name and assets to cache
const CACHE_NAME = 'outflow-cache-v8'; // Increment version to force update
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
  '/static/js/main.chunk.js', // Replace with actual path, e.g., /static/js/main.[hash].js
  '/static/js/vendors.chunk.js', // Replace with actual path
  '/static/css/main.chunk.css', // Replace with actual path
];

// Dynamic cache for non-critical resources (e.g., fonts, images)
const DYNAMIC_CACHE_NAME = 'outflow-dynamic-cache-v1';

// Install event: cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching assets...');
      return Promise.all(
        urlsToCache.map((url) => {
          return cache.add(url).catch((err) => {
            console.error(`Failed to cache ${url}:`, err);
          });
        })
      ).then(() => {
        console.log('Service Worker: All assets cached successfully');
      });
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache:', cacheName);
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
  console.log('Service Worker: Fetching:', event.request.url);

  // Bypass Firestore requests (Firebase handles its own offline persistence)
  if (
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('firebase') ||
    event.request.mode === 'no-cors'
  ) {
    console.log('Service Worker: Bypassing Firestore request');
    event.respondWith(fetch(event.request));
    return;
  }

  // Handle navigation requests (e.g., HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Service Worker: Serving cached index.html for navigation');
          return cachedResponse;
        }
        console.log('Service Worker: index.html not cached, attempting network fetch');
        return fetch(event.request).catch(() => {
          console.log('Service Worker: Network failed, serving offline.html');
          return caches.match('/offline.html').then((offlineResponse) => {
            if (offlineResponse) {
              return offlineResponse;
            }
            // Ultimate fallback if offline.html isn't cached
            console.error('Service Worker: offline.html not cached, returning error');
            return new Response(
              '<h1>Offline</h1><p>Please connect to the internet to access this page.</p>',
              {
                headers: { 'Content-Type': 'text/html' },
                status: 503,
              }
            );
          });
        });
      })
    );
    return;
  }

  // Handle other resources (JS, CSS, images, fonts, etc.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('Service Worker: Serving cached resource:', event.request.url);
        return cachedResponse;
      }

      console.log('Service Worker: Resource not cached, attempting network fetch:', event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              console.log('Service Worker: Cached dynamically:', event.request.url);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('Service Worker: Fetch failed for:', event.request.url);
          // Fallbacks for specific resource types
          if (event.request.destination === 'image') {
            return new Response('Image not available offline', { status: 503 });
          }
          if (event.request.url.includes('fonts.googleapis.com')) {
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
          // Generic fallback for uncached resources
          return new Response('Resource not available offline', { status: 503 });
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-expenses') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(syncExpenses());
  }
});

// Function to sync queued expenses
async function syncExpenses() {
  try {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SYNC_REQUEST' });
      });
    });
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Fallback timeout
    console.log('Service Worker: Background sync completed');
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
    throw error; // Retry sync on next trigger
  }
}