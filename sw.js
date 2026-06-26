/* التوأم الرقمى — شبكة الإسماعيلية | Service Worker */
const VERSION = 'irrdt-v7';
const CACHE = VERSION;
const CORE = ['./', './index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).catch(()=>{}).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  if (url.indexOf('script.google') >= 0 || url.indexOf('firebaseio') >= 0 ||
      url.indexOf('gstatic') >= 0 || url.indexOf('googleapis') >= 0) {
    return;
  }
  e.respondWith(
    fetch(req).then((res) => {
      try { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(()=>{}); } catch (_) {}
      return res;
    }).catch(() => caches.match(req).then((m) => m || caches.match('./index.html')))
  );
});
