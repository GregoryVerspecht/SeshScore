const CACHE_NAME = "seshscore-cache-v5";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/static/style.css?v=20260503-3",
    "/static/image/seshscore_icon_512x512.png",
    "/static/image/seshscore_icon_192x192.png",
    "/static/image/seshscore_icon_144x144.png",
    "/static/image/seshscore_icon_96x96.png",
    "/static/image/seshscore_icon_72x72.png",
    "/static/image/seshscore_icon_48x48.png"
];

// Install Service Worker en cache bestanden
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch verzoeken uit cache halen
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Verwijder oude caches bij een update
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
