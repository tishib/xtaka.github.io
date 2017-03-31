var CACHE = 'cache-and-update';

self.addEventListener('install', (evt) => {
  console.log('SW is being installed.');
  evt.waitUntil(precache());
});

self.addEventListener('fetch', (evt) => {
  console.log('SW is serving the asset.');
  evt.respondWith(fromCache(evt.request));
  evt.waitUntill(update(evt.request));
});

function precache() {
  return caches.open(CACHE).then((cache) => {
    return cache.addAll([
      '/sw/cache-only/index.html',
      '/sw/cache-only/index.js',
      '/sw/cache-only/controlled/controlled.html',
      '/sw/cache-only/controlled/sample.PNG'
    ]);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then((cache) => {
    return cache.match(request).then((matching) => {
      return matching || Promise.reject('no match');
    });
  });
}

function update(request) {
  return caches.open(CACHE).then((cache) => {
    return fetch(request).then((response) => {
      return cache.put(request, response);
    });
  });
}
