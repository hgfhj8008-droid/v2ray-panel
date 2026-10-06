const CACHE_NAME = 'v2ray-mohammed-v4';

const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', function(event) {

  event.waitUntil(

    caches.open(CACHE_NAME)
    .then(function(cache) {

      return cache.addAll(CORE_FILES);

    })
    .then(function() {

      return self.skipWaiting();

    })

  );

});


self.addEventListener('activate', function(event) {

  event.waitUntil(

    caches.keys()
    .then(function(keys) {

      return Promise.all(

        keys.map(function(key) {

          if(
            key !== CACHE_NAME &&
            key.startsWith('v2ray-mohammed-')
          ){

            return caches.delete(key);

          }

        })

      );

    })
    .then(function(){

      return self.clients.claim();

    })

  );

});


self.addEventListener('fetch', function(event) {

  if(event.request.method !== 'GET')
    return;

  event.respondWith(

    fetch(event.request)
    .then(function(response){

      const copy=response.clone();

      caches.open(CACHE_NAME)
      .then(function(cache){

        cache.put(
          event.request,
          copy
        );

      });

      return response;

    })
    .catch(function(){

      return caches.match(
        event.request
      );

    })

  );

});
