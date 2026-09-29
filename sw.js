const C = 'giling-padi-v20';

const A = [
  './',
  './index.html',
  './manifest.json',
  './icon-192-3.png',
  './icon-512-2.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C).then(c => c.addAll(A))
  );

  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(a =>
      Promise.all(
        a
          .filter(x => x !== C)
          .map(x => caches.delete(x))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', e =>
  e.respondWith(
    caches.match(e.request).then(r =>
      r || fetch(e.request)
    )
  )
);
