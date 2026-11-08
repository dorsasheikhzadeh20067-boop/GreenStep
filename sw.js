const CACHE = "greenstep-v2.3.2";
const ASSETS = ["./", "./index.html", "./style.css", "./script.js", "./firebase-config.js", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png"];
const EXTERNAL = /^(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com)$/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  // Firebase Auth/Firestore API calls go straight to the network
  if (url.origin !== location.origin && !EXTERNAL.test(url.host)) return;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => req.mode === "navigate" ? caches.match("./index.html") : undefined))
  );
});