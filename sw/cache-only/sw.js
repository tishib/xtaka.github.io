const CACHE = 'cache-only';

self.addEventListener('install', (evt) => {
 console.log('Service worker of this page is being installed.');
 evt.waitUntil(precache());
});

self.addEventListener('fetch', (evt) => {
  console.log('Service worker of this page is serving the asset.');
  evt.respondWith(fromCache(evt.request));
});

function precache() {
  return caches.open()
}

function fromCache() {}
