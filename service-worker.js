// 노무길잡이(labor) 서비스워커 — 정리용
//
// 왜 정리용인가
// - 지금 labor 화면(index.html)은 서비스워커를 등록하지 않음(앱 설치·오프라인 기능 없음)
// - 그런데 예전 데모 파일(lawon_demo·lawdemo·onedemo.html, 현재 삭제)이 이 파일을 등록해 둔 휴대폰이 있음
// - 예전 버전(nomugil-v3)은 업데이트될 때 자기 것이 아닌 캐시까지 전부 지워서
//   같은 주소(yeonskimm.github.io)를 쓰는 법ON(lawon-)·오늘의안전(onul-safety-)·사고현장앱(onestop-) 저장본을 지웠음
//
// 이 파일이 하는 일(그 휴대폰에서 labor 주소가 다시 열릴 때 한 번 실행)
// ① 내 캐시(nomugil-로 시작하는 것)만 지움  ② 스스로 등록을 해제함  ③ 요청은 가로채지 않음(전부 그대로 인터넷으로)
// 다른 앱의 캐시·저장공간(localStorage 등)은 건드리지 않음
//
// 나중에 새 이름으로 앱을 만들면: 별도 저장소에서 새 접두어로 서비스워커를 새로 작성할 것
const CACHE_PREFIX = 'nomugil-';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX)).map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
      .catch(() => {})
  );
});
// fetch 처리기 없음 → 화면·파일 요청을 가로채지 않음
