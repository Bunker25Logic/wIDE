// SW KAMIKAZE: Feito para destruir qualquer SW anterior e limpar tudo.

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  self.registration
    .unregister()
    .then(function () {
      return self.clients.matchAll();
    })
    .then(function (clients) {
      clients.forEach((client) => client.navigate(client.url));
    });
});

self.addEventListener("fetch", function (event) {
  // Não faz nada, deixa passar direto para a rede
});
