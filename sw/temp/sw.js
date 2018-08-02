'use strict';
const CACHE_NAME = 'cache-v1';

const CACHE_URLS = [
  'index.html',
];

self.addEventListener('install', () => {
  console.log('on install');
});
self.addEventListener('activate', () => {
  console.log('on activate');
})
self.addEventListener('fetch', () => {
  console.log('on fetch');
});