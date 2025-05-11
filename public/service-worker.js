// Install event: caching critical assets during the installation of the service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('outflow-cache').then((cache) => {
      return cache.addAll([
        '/',                  // Home page
        '/index.html',        // HTML file
        '/manifest.json',     // Manifest file
        '/favicon.ico',       // Favicon
        '/logo192.png',       // Logo for Android/iOS
        '/logo512.png',       // Larger logo for higher resolution screens
        '/styles.css',        // CSS styles
        '/app.js',            // Main JavaScript file
        '/service-worker.js'  // Include the service worker script itself (optional but recommended for updates)
        // Add any other assets you want to cache here
      ]);
    })
  );
});

// Fetch event: intercepting requests and serving cached assets or fetching from network if not cached
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If there's a cached response, return it
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from the network and cache the response
      return fetch(event.request).then((networkResponse) => {
        // Check if the response is valid
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the response and cache it for future requests
        const responseToCache = networkResponse.clone();
        caches.open('outflow-cache').then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});

// Activate event: clean up old caches when the service worker is activated
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['outflow-cache']; // Add your cache names here
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches that are not in the whitelist
          }
        })
      );
    })
  );
});

