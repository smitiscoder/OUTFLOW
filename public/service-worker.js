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
