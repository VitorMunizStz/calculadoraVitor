// Service Worker - Calculadora Científica Floresta Lunar
const CACHE_NAME = 'calculadora-lunar-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache criado e arquivos adicionados');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Erro ao fazer cache:', err))
  );
  self.skipWaiting(); // Forçar a ativação imediata
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Cache antigo removido:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Assumir controle de clientes imediatamente
});

// Estratégia de cache: Cache First, Fall Back to Network
self.addEventListener('fetch', event => {
  // Apenas GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrou no cache, retorna
        if (response) {
          console.log('Retornado do cache:', event.request.url);
          return response;
        }

        // Se não encontrou, tenta fazer a requisição
        return fetch(event.request)
          .then(response => {
            // Se não é uma resposta válida, retorna
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clona a resposta para adicionar ao cache
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
                console.log('Adicionado ao cache:', event.request.url);
              });

            return response;
          })
          .catch(err => {
            console.log('Erro na requisição, usando cache:', err);
            // Retorna uma página offline se necessário
            return caches.match('/index.html');
          });
      })
  );
});

// Tratamento de mensagens do cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
