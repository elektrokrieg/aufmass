// Aufmaß-Generator Service Worker – Elektro Krieg Meiningen
const CACHE = 'aufmass-v1.3.0';
const VERSION = '1.3.0';

// Alle Dateien die gecacht werden sollen
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './version.json',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Install: alle Dateien cachen
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES.filter(f => !f.startsWith('https')))
        .then(() => cache.addAll(
          FILES.filter(f => f.startsWith('https'))
        ).catch(() => {}));  // CDN-Fehler ignorieren
    }).then(() => self.skipWaiting())
  );
});

// Activate: alte Caches löschen
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first, dann Netzwerk
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        // Erfolgreiche Antworten cachen
        if (response && response.status === 200 && response.type === 'basic') {
          var clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});

// Version-Check: alle 60 Minuten prüfen
self.addEventListener('message', function(e) {
  if (e.data === 'CHECK_VERSION') {
    fetch('./version.json?t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        if (data.version !== VERSION) {
          self.clients.matchAll().then(clients => {
            clients.forEach(c => c.postMessage({type:'UPDATE', version: data.version}));
          });
        }
      }).catch(() => {});
  }
});
