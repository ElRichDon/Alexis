const CACHE_NAME = "alexis-princess-wellness-final-moods";
const FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./assets/icon.svg",
  "./assets/alexis-avatar.png",
  "./assets/moods/amazing.png",
  "./assets/moods/good.png",
  "./assets/moods/okay.png",
  "./assets/moods/struggling.png",
  "./assets/moods/anxious.png",
  "./assets/moods/support.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
