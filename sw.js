
const CACHE_NAME = 'wellinton-ide-pro-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.tsx',
  './manifest.json',
  './components/Editor.tsx',
  './components/Preview.tsx',
  './components/Sidebar.tsx',
  './components/SettingsModal.tsx',
  './components/ProjectsModal.tsx',
  './components/SaveModal.tsx',
  './components/HomeMenu.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&family=Inter:wght@300;400;600;800&display=swap',
  'https://esm.sh/react@^19.2.3',
  'https://esm.sh/react-dom@^19.2.3',
  'https://esm.sh/prettier@3.5.2/standalone',
  'https://esm.sh/prettier@3.5.2/plugins/html',
  'https://esm.sh/prettier@3.5.2/plugins/postcss',
  'https://esm.sh/prettier@3.5.2/plugins/babel',
  'https://esm.sh/prettier@3.5.2/plugins/estree'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
      return cachedResponse || fetchPromise;
    })
  );
});
