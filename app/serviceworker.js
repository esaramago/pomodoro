// Credits: https://airhorner.com

const version = "1.0.3";
const cacheName = `thepomodorotimer-${version}`;
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                `/`,
                `/audio/end.mp3`,
                `/css/main.css`,
                `/css/mobile-select.css`,
                `/app/data.js`,
                `/app/mobileSelect.js`,
                `/app/noSleep.min.js`,
                `/app/main.js`
            ])
            .then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName)
            .then(cache => cache.match(event.request, { ignoreSearch: true }))
            .then(response => {
                return response || fetch(event.request);
            })
    );
});