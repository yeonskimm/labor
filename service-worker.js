const CACHE_NAME = 'nomugil-v3';
const FILES_TO_CACHE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => Promise.allSettled(FILES_TO_CACHE.map(f => cache.add(f)))));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (event.request.method !== 'GET' || url.includes('googleapis.com') || url.includes('unpkg.com') || url.includes('fonts.gstatic.com') || !url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const net = fetch(event.request).then(r => { if(r?.status===200&&r.type==='basic') cache.put(event.request,r.clone()); return r; }).catch(()=>cached);
        return cached || net;
      })
    )
  );
});
