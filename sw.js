/* Service Worker: cache-first, versioned cache.
   Relative URLs stay valid under the GitHub Pages project subpath
   /AnFoVO-Lernkompendium/ and under the Android asset-loader origin.
   VERSION/BUILD change when the cached shell changes. */
var VERSION = '2.9.4';
var BUILD = 'web-pwa-2.9.4';
var CACHE = 'anfoevo_v2_cache_' + VERSION + '-' + BUILD;
/* Kern: muss vollständig sein (addAll) */
var ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];
/* Hintergrundbilder: einzeln, ein fehlendes Bild kippt die Offline-Installation nicht (B-02) */
var EXTRA = [];
/* Hintergrund-Bildsequenz (Buch): beide Größen offline verfügbar */
var FRAMES = ["r00.webp", "w00.webp", "w01.webp", "w02.webp", "w03.webp", "w04.webp", "w05.webp", "w06.webp", "w07.webp", "w08.webp", "w09.webp", "w10.webp", "w11.webp", "w12.webp", "w13.webp", "z00.webp", "z01.webp", "z02.webp", "z03.webp", "z04.webp", "z05.webp", "z06.webp", "z07.webp", "z08.webp", "z09.webp", "z10.webp", "z11.webp", "z12.webp", "z13.webp"];
FRAMES.forEach(function (f) { EXTRA.push('./bg/d/' + f, './bg/m/' + f); });
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS).then(function () { return Promise.all(EXTRA.map(function (u) { return c.add(u).catch(function () {}); })); }); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('anfoevo_v2_cache_') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(e.request).then(function (res) {
      if (res && res.ok && res.type === 'basic') { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
      return res;
    }).catch(function () { return e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error(); });
  }));
});
