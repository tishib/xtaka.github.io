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
 return caches.open(CACHE).then((cache) => { // open my cache and throw a getting my cache
  return cache.addAll([ // put only URL stying
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
