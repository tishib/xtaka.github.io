var CACHE = 'network-or-cache';

self.addEventListener('install', (evt) => {
  console.log('The SW is being installed.');
  evt.waitUntil(precache()); // waitUntil: 引数からresolveが返るまで待機
}); // self: window.self

self.addEventListener('fetch', (evt) => {
  console.log('The SW is serving the asset.');
  evt.respondWith(fromNetwork(evt.request, 400).catch(() => {
    return fromCache(evt.request);
  })); // respondWith: 何か返るまで待機
});

function precache() {
  return caches.open(CACHE).then((cache) => {
    return cache.addAll([
      './controlled.html',
      './asset'
    ]);
  });
}

function fromNetwork(request, timeout) {
  return new Promise((fulfill, reject) => {
    var timeoutId = setTimeout(reject, timeout);

    fetch(request).then((response) => {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then((cache) => {
    return cache.match(request).then((matching) => {
      return matching || Promise.reject('no-match');
    });
  });
}
