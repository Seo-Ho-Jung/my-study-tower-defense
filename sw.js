// 서비스 워커 파일 (sw.js)

const CACHE_NAME = 'tower-defense-cache-v1';
// 캐싱할 파일 목록
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com/',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js',
  'https://fonts.googleapis.com/css2?family=Jua&display=swap'
];

// 서비스 워커 설치 이벤트
self.addEventListener('install', event => {
  // 캐시를 열고 파일들을 추가합니다.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 서비스 워커 활성화 이벤트
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 오래된 캐시를 삭제합니다.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetch 이벤트: 네트워크 요청을 가로채서 캐시된 응답을 반환합니다.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 응답이 있으면 그것을 반환합니다.
        if (response) {
          return response;
        }
        // 캐시에 없으면 네트워크로 요청을 보냅니다.
        return fetch(event.request);
      }
    )
  );
});
