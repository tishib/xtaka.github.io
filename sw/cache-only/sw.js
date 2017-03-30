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
 return caches.open(CACHE).then((cache) => {
  return cache.addAll([
   './index.html',
   './index.js',
   './controlled/controlled.html',
   './controlled/whale-flat.PNG'
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
