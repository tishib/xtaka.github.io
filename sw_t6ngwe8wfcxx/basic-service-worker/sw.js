'use strict';
const CACHE_NAME = 'cache-v1';
const RUNTIME = 'runtime'; // for URLs that is not defined in CACHE_URLS
const CACHE_URLS = [
  'index.html',
  'index.js'
];

// inistall event run only once
self.addEventListener('install', event => {
  console.log('SW installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(CACHE_URLS))
    .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('SW activating...');

  const currentCaches = [CACHE_NAME, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    })
    .then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    })
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  console.log('SW intercept for fetch request!');
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(RUNTIME)
        .then(cache => {
          return fetch(event.request)
          .then(response => {
            return cache.put(event.request, response.clone())
            .then(() => {
              return response;
            })
          })
        })
      })
      .catch(err => {
        console.log(err + ' after fetching')
      })
    );
  }
});