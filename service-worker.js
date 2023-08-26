const cacheName = 'cache-v1';
const files = [
  '/',
  'index.html',
  'css/style.css',
  'js/zoodoku.js',
  'images/animals/bear.svg',
  'images/animals/boar.svg',
  'images/animals/cat.svg',
  'images/animals/cow.svg',
  'images/animals/dog.svg',
  'images/animals/fox.svg',
  'images/animals/frog.svg',
  'images/animals/hamster.svg',
  'images/animals/koala.svg',
  'images/animals/lion.svg',
  'images/animals/monkey.svg',
  'images/animals/mouse.svg',
  'images/animals/panda.svg',
  'images/animals/pig.svg',
  'images/animals/polar-bear.svg',
  'images/animals/rabbit.svg',
  'images/animals/raccoon.svg',
  'images/animals/tiger.svg',
  'images/animals/wolf.svg',
  'fonts/roboto-regular.woff',
  'fonts/roboto-bold.woff'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(files))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
 });