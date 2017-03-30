var CACHE = 'cache-and-update';

self.addEventListener('install', (evt) => {
  console.log('SW is being installed.');
  evt.waitUntil(precache());
});

function precache() {}
