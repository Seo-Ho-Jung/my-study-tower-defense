// 캐시 이름 정의
const CACHE_NAME = 'self-improvement-td-cache-v1';

// 캐시할 파일 목록
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js',
  'https://fonts.googleapis.com/css2?family=Jua&display=swap'
];

// 서비스 워커 설치 이벤트
self.addEventListener('install', event => {
  // 캐시 스토리지에 정적 자원 추가
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 서비스 워커 fetch 이벤트
// 네트워크 요청을 가로채서 캐시된 자원이 있으면 캐시에서 제공
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 응답이 있으면 그것을 반환
        if (response) {
          return response;
        }
        // 캐시에 없으면 네트워크에서 가져옴
        return fetch(event.request);
      }
    )
  );
});

// 서비스 워커 활성화 이벤트 (오래된 캐시 정리)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
