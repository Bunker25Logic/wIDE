const CACHE_NAME = "wellinton-ide-pro-v14";

// Arquivos Core que devem ser pré-carregados
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./404.html",
  "https://cdn.tailwindcss.com",
];

// Instalação: Pré-carrega assets essenciais
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Força ativação imediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)),
  );
});

// Ativação: Limpeza agressiva de caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Limpando cache antigo:", cache);
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  self.clients.claim(); // Controla a página imediatamente
});

// Fetch: Estratégia Híbrida Inteligente
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isHTML =
    event.request.mode === "navigate" || url.pathname.endsWith(".html");
  const isManifest = url.pathname.endsWith("manifest.json");

  // 1. Estratégia NETWORK FIRST para HTML e Manifesto (Evita tela preta após update)
  if (isHTML || isManifest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Se deu certo na rede, atualiza o cache e retorna
          const clone = networkResponse.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(() => {
          // Se falhou (offline), usa o cache ou fallback
          return caches.match(event.request).then((cached) => {
            return cached || caches.match("./index.html"); // Fallback offline
          });
        }),
    );
    return;
  }

  // 2. Estratégia CACHE FIRST ou STALE-WHILE-REVALIDATE para outros assets (JS, CSS, Imagens)
  // Assets do Vite com hash no nome são seguros para Cache First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // Se não está no cache, busca na rede e cacheia
      return fetch(event.request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }
        const clone = networkResponse.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request, clone));
        return networkResponse;
      });
    }),
  );
});
