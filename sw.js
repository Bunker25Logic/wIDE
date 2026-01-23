const CACHE_NAME = "wIDE-v2-rel";

// Assets fundamentais para o app funcionar offline
const CORE_ASSETS = [
  "./",
  "./index.html",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&family=Inter:wght@300;400;600;800&display=swap",
];

// Instalação
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
});

// Ativação e Limpeza
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      ),
    ),
  );
  self.clients.claim();
});

// Fetch com estratégia Network First para HTML (evita tela preta)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // HTML: Network First
  if (req.mode === "navigate" || url.pathname.endsWith(".html")) {
    event.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }

  // Outros: Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((res) => {
        cache.put(req, res.clone());
        return res;
      });
      return cached || fetchPromise;
    }),
  );
});
