// ═══════════════════════════════════════
//  노무길잡이 Service Worker v1
//  업데이트 방법: CACHE_NAME 숫자만 올리기
//  예) 'nomugil-v1' → 'nomugil-v2'
// ═══════════════════════════════════════
const CACHE_NAME = 'nomugil-v1';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// 설치: 핵심 파일 캐시 (allSettled: 일부 파일 없어도 설치 실패 방지)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(FILES_TO_CACHE.map(f => cache.add(f)))
    )
  );
});

// 활성화: 이전 캐시 삭제 후 즉시 제어
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// 메시지: 업데이트 배너에서 즉시 활성화 요청
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 요청 처리: Stale-While-Revalidate
// 캐시 즉시 응답 + 백그라운드에서 새 버전 갱신
self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (
    event.request.method !== 'GET' ||
    url.includes('googleapis.com') ||
    url.includes('anthropic.com') ||
    url.includes('unpkg.com') ||
    url.includes('fonts.gstatic.com') ||
    !url.startsWith(self.location.origin)
  ) {
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(response => {
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});
