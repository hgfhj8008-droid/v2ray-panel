
const CACHE_NAME="v2ray-mohammed-v7";

const CORE_FILES=[
    "/",
    "/index.html",
    "/manifest.json",
    "/icon.svg"
];


self.addEventListener(
    "install",
    event=>{

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(cache=>
                    cache.addAll(CORE_FILES)
                )
                .then(()=>
                    self.skipWaiting()
                )

        );

    }
);


self.addEventListener(
    "activate",
    event=>{

        event.waitUntil(

            caches.keys().then(keys=>

                Promise.all(

                    keys
                        .filter(key=>
                            key.startsWith(
                                "v2ray-mohammed-"
                            ) &&
                            key!==CACHE_NAME
                        )
                        .map(key=>
                            caches.delete(key)
                        )

                )

            ).then(()=>
                self.clients.claim()
            )

        );

    }
);


/*
   Network First
*/

self.addEventListener(
    "fetch",
    event=>{

        if(event.request.method!=="GET"){
            return;
        }


        event.respondWith(

            fetch(event.request)
                .then(response=>{

                    const copy=
                        response.clone();

                    caches
                        .open(CACHE_NAME)
                        .then(cache=>
                            cache.put(
                                event.request,
                                copy
                            )
                        );

                    return response;

                })
                .catch(()=>{

                    return caches
                        .match(event.request)
                        .then(response=>
                            response ||
                            caches.match(
                                "/index.html"
                            )
                        );

                })

        );

    }
);

