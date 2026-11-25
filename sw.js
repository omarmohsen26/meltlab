const CACHE = 'meltlab-v33';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './inter-400.woff', './inter-600.woff', './inter-800.woff', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './icon-192-maskable.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).then(() => Promise.all(['./lib/xlsx.mini.min.js','./lib/auth.js'].map(u => c.add(u).catch(() => {}))))));self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Network first so a new deploy always wins; cache is only the offline fallback.
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((res) => {
        if (res && res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
