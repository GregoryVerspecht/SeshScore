const CACHE_NAME = "seshscore-cache-v11";
const urlsToCache = [
    "/app.html",
    "/manifest.json",
    "/static/style.css",
    "/static/image/seshscore-icon.svg",
    "/static/image/seshscore-icon-512x512.png",
    "/static/image/seshscore-icon-192x192.png",
    "/static/image/seshscore-icon-180x180.png",
    "/static/image/seshscore-icon-128x128.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});
