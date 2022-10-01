/* eslint-disable no-restricted-globals */
self.addEventListener('install', (_) => self.skipWaiting());

self.addEventListener('activate', (event) => {
  const cacheAllowlist = ['v2'];

  event.waitUntil(
    caches.forEach((_cache, cacheName) => {
      if (!cacheAllowlist.includes(cacheName)) {
        return caches.delete(cacheName);
      }
    })
  );
});

self.addEventListener('fetch', (_) => {});
