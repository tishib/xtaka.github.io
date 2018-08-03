const CACHE_NAME = 'cache-img-v1';
const CACHE_URLS = [
  'index.html',
];
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
  console.log(event)
});