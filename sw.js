//وب اپلیکیشن گرین استپ سرویس ورکر
//نسخه 4

const CACHE_VERSION = "greenstep-v4.1.1";
const CACHE_PREFIX = "greenstep-";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./games.js",
  "./firebase-config.js",
  "./manifest.json",
  "./icon.svg",
  "./icon-192.png",
  "./sabzak.jpg"
];

const FONT_HOSTS = new Set([
  "fonts.googleapis.com",
  "fonts.gstatic.com"
]);

// نصب و اینستال
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);

    await Promise.allSettled(
      APP_FILES.map(async file => {
        const response = await fetch(file, {
          cache: "no-store"
        });

        if (response.ok) {
          await cache.put(file, response);
        }
      })
    );

    await self.skipWaiting();
  })());
});

//فعال سازی
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();

    await Promise.all(
      cacheNames
        .filter(name =>
          name.startsWith(CACHE_PREFIX) &&
          name !== CACHE_VERSION
        )
        .map(name => caches.delete(name))
    );

    await self.clients.claim();
  })());
});

//دریافت
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin =
    url.origin === self.location.origin;

  //درخواستهای فایربیس و مابقی را کش نکنید
  if (!sameOrigin) {
    if (!FONT_HOSTS.has(url.hostname)) return;

    event.respondWith((async () => {
      const cached = await caches.match(request);

      if (cached) return cached;

      const response = await fetch(request);

      if (response.ok || response.type === "opaque") {
        const cache = await caches.open(CACHE_VERSION);
        await cache.put(request, response.clone());
      }

      return response;
    })());

    return;
  }

  //فایل سرویس ورکر را رهگیری نکن
  if (url.pathname.endsWith("/sw.js")) return;

  //دریاف فایلهای فعلی در گیت هاب
  event.respondWith((async () => {
    try {
      const response = await fetch(request, {
        cache: "no-store"
      });

      if (response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_VERSION);
        await cache.put(request, response.clone());
      }

      return response;

    } catch (error) {
      const cached = await caches.match(request);

      if (cached) return cached;

      if (request.mode === "navigate") {
        return (
          await caches.match("./index.html")
        ) || new Response(
          "GreenStep is offline. Please reconnect.",
          {
            status: 503,
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          }
        );
      }

      return new Response("", {
        status: 503,
        statusText: "Offline"
      });
    }
  })());
});