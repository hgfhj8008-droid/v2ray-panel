const CACHE_NAME = "v2ray-mohammed-v10";

self.addEventListener("install", function(event) {
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
        .filter(function(key) {
          return key !== CACHE_NAME;
        })
        .map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {

  if(event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)
      .then(function(response) {

        const copy=response.clone();

        caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.put(event.request,copy);
          });

        return response;

      })
      .catch(function() {

        return caches.match(event.request);

      })

  );

});
