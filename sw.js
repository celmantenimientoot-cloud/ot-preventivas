// Guarda la app en la tablet para que abra sin internet. Al cambiar algÃºn archivo, subir el nÃºmero de VERSION.
const VERSION = 'otprev-37';
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icono.svg', 'icono-192.png', 'icono-512.png', 'planos/cel-4ss-cocheras.jpg', 'planos/cel-1ss-cocheras.jpg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // los envÃ­os al mini ERP no pasan por acÃ¡
  // Primero la red (para recibir versiones nuevas); sin seÃ±al, lo guardado
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
