const VERSION = 'dialog-switch-v2';
const SHELL = [
  '/', '/demo', '/offline.html', '/404.html', '/manifest.webmanifest', '/legal.css',
  '/privacy/', '/terms/', '/icon-192.png', '/icon-512.png',
  '/icon-maskable-512.png', '/assets/hero-720.webp', '/assets/hero-1200.webp',
  '/assets/harbor-dialogue-demo.vtt', '/assets/harbor-dialogue-demo.webm',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    const shellResponse = await fetch('/');
    const shellMarkup = await shellResponse.text();
    const builtAssets = [...shellMarkup.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
    if (builtAssets.length) await cache.addAll(builtAssets);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => (await caches.match(event.request)) || (await caches.match('/')) || caches.match('/offline.html')),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(VERSION).then((cache) => cache.put(event.request, copy));
      }
      return response;
    })),
  );
});
