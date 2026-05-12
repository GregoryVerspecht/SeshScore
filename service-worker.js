const CACHE_NAME = "seshscore-cache-v13";
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
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                )
            )
            .then(() => self.clients.claim())
            .then(() =>
                self.clients.matchAll({ type: "window" }).then((clients) =>
                    clients.forEach((client) => {
                        if ("navigate" in client) client.navigate(client.url);
                    })
                )
            )
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Network-first for HTML — users always get the latest version
    if (request.mode === "navigate" || url.pathname.endsWith(".html")) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Cache-first for static assets (images, versioned CSS, etc.)
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                return response;
            });
        })
    );
});
