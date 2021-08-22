const CACHE_NAME = 'cache-img-v1';
const CACHE_URLS = [
  'index.html',
];
const RUNTIME = 'runtime';
self.addEventListener('install', event => {
  console.log('installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .then(self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  console.log('activating...');
});
self.addEventListener('fetch', event => {
  console.log('intercept for fetch request');
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            })
          })
        })
      })
    );
  }
});