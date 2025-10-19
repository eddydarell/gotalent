// Service Worker disabled - PWA functionality removed
// This file is kept to unregister any previously registered service workers

self.addEventListener('install', () => {
    console.log('Service worker disabled - no caching');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated - clearing all caches');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    // No caching - always fetch from network
    event.respondWith(fetch(event.request));
});
