const CACHE_NAME = "alexis-wellness-v2";
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./assets/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
