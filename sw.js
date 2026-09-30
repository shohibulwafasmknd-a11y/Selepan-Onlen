const C = 'giling-padi-v31';

const A = [
  './',
  './index.html',
  './manifest.json',
  './icon-192-3.png',
  './icon-512-2.png',
  './header-padi.png',
  './pelanggan.png'
];

// Install service worker baru
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(C).then(cache => cache.addAll(A))
  );

  self.skipWaiting();
});

// Hapus cache versi lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== C)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Online: ambil file terbaru dari server.
// Offline: gunakan cache yang tersedia.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();

          caches.open(C).then(cache => {
            cache.put(event.request, copy);
          });
        }

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
