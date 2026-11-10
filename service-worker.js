// Keep Blue Box usable as a GitHub Pages project site.
// Cache only files that exist; keep HTML network-first so Firebase fixes propagate.
const CACHE_NAME = 'blue-box-cache-v2';
const SITE_FILES = ['./index.html', './main.html', './manifest.json'];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SITE_FILES))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(
        keys.filter(key => key.startsWith('blue-box-cache-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )),
      self.clients.claim()
    ])
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
