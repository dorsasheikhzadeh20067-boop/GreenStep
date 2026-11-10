const CACHE = "greenstep-v3.3.0";
const ASSETS = ["./", "./index.html", "./style.css", "./script.js", "./games.js", "./sabzak.jpg", "./firebase-config.js", "./manifest.json"];
const EXTERNAL = /^(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com)$/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  if (url.origin !== location.origin && !EXTERNAL.test(url.host)) return; // Firebase مستقیم از شبکه
  const fresh = () => fetch(req).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  });
  const sameOrigin = url.origin === location.origin;
  e.respondWith(sameOrigin
    ? fresh().catch(() => caches.match(req).then(h => h || (req.mode === "navigate" ? caches.match("./index.html") : undefined)))
    : caches.match(req).then(h => h || fresh()));
});