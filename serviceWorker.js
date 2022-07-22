//Asignar nombre y versión al cache.
const cacheCadimu = 'CADIMU-site-v1',
    assets = [
    './',
    'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
    "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    "https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    './public/playground_assets',
    './index.js',
    './icons/CADIMU_Icon0.png'
  ]

//Instalación, generalmente se almacenan en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheCadimu)
      .then(cache => {
        return cache.addAll(assets)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

// Activa el SW y busca los recursos para hacer que funcione sin conexión.
self.addEventListener('activate', e => {
  const cacheWhitelist = [assets]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al Service Worker que debe activar el cache actual.
      .then(() => self.clients.claim())
  )
})

//Recuperar objeto de URL o caché
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //Recuperar del caché
          return res
        }
        //Recuperar de URL
        return fetch(e.request)
      })
  )
})