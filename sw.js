const CACHE_NAME = 'image-resizer-cache-v7';
const urlsToCache = [
    '/',
    '/index.html',
    '/resize.html',
    '/manifest.json',
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(err => console.error('Error caching resources:', err))
    );
    // Forçar ativação imediata do novo Service Worker
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Garantir que o Service Worker assuma o controle da página imediatamente
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(err => console.error('Fetch error:', err))
    );
});
