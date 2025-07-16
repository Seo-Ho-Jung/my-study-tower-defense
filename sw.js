// 캐시할 파일 목록
const CACHE_NAME = 'lane-guardians-cache-v1';
const urlsToCache = [
  './', // index.html
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap',
  'https://fonts.gstatic.com/s/notosanskr/v27/PbykFmXiEBPT4ITbgNA5Cgms3O97-My2x-E.woff2' // 폰트 파일 등
];

// 서비스 워커 설치 이벤트
self.addEventListener('install', (event) => {
  // 설치 단계를 수행합니다.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시가 열렸습니다.');
        // 필수 리소스를 캐시에 추가합니다.
        return cache.addAll(urlsToCache);
      })
  );
});

// 서비스 워커 fetch 이벤트 (요청 가로채기)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 응답이 있으면 캐시된 값을 반환합니다.
        if (response) {
          return response;
        }

        // 캐시에 없으면 네트워크에서 가져옵니다.
        return fetch(event.request).then(
          (response) => {
            // 응답이 유효하지 않으면 그대로 반환합니다.
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 복제하여 하나는 브라우저에, 다른 하나는 캐시에 저장합니다.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// 서비스 워커 활성화 및 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
