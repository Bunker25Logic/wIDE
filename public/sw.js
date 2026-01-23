const CACHE_NAME = "wellinton-ide-pro-v13";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./404.html",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&family=Inter:wght@300;400;600;800&display=swap",
  "https://esm.sh/react@^19.2.3",
  "https://esm.sh/react-dom@^19.2.3",
  "https://esm.sh/prettier@3.5.2/standalone",
  "https://esm.sh/prettier@3.5.2/plugins/html",
  "https://esm.sh/prettier@3.5.2/plugins/postcss",
  "https://esm.sh/prettier@3.5.2/plugins/babel",
  "https://esm.sh/prettier@3.5.2/plugins/estree",
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Força a ativação imediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Deleta qualquer cache antigo sem piedade
          if (cache !== CACHE_NAME) {
            console.log("Deletando cache antigo:", cache);
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  self.clients.claim(); // Controla a página imediatamente
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Skip cross-origin requests that might fail
  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Only cache successful responses
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const cacheCopy = networkResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, cacheCopy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Return cached index.html for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
      return cachedResponse || fetchPromise;
    }),
  );
});
