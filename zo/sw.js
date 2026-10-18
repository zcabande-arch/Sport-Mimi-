/* ZO Studio — service worker : l'appli et tous les visuels marchent hors connexion */
const VERSION = "zo-v2";
const EXT = "zo-ext";   // polices : gardées d'une version à l'autre
const CORE = [
  "./",
  "./index.html",
  "./posts.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];
const IMAGES = [
  "./img/2026-10-14-1.jpg",
  "./img/2026-10-14-2.jpg",
  "./img/2026-10-14-3.jpg",
  "./img/2026-10-14-4.jpg",
  "./img/2026-10-15-1.jpg",
  "./img/2026-10-15-2.jpg",
  "./img/2026-10-15-3.jpg",
  "./img/2026-10-15-4.jpg",
  "./img/2026-10-15-5.jpg",
  "./img/2026-10-15-6.jpg",
  "./img/2026-10-15-7.jpg",
  "./img/2026-10-15-8.jpg",
  "./img/2026-10-17-1.jpg",
  "./img/2026-10-17-2.jpg",
  "./img/2026-10-17-3.jpg",
  "./img/2026-10-17-4.jpg",
  "./img/2026-10-17-5.jpg",
  "./img/2026-10-17-6.jpg",
  "./img/2026-10-17-7.jpg",
  "./img/2026-10-19-1.jpg",
  "./img/2026-10-19-2.jpg",
  "./img/2026-10-19-3.jpg",
  "./img/2026-10-19-4.jpg",
  "./img/2026-10-20-1.jpg",
  "./img/2026-10-20-2.jpg",
  "./img/2026-10-20-3.jpg",
  "./img/2026-10-20-4.jpg",
  "./img/2026-10-22-1.jpg",
  "./img/2026-10-22-2.jpg",
  "./img/2026-10-24-2.jpg",
  "./img/2026-10-24-3.jpg",
  "./img/2026-10-24-4.jpg",
  "./img/2026-10-24-5.jpg",
  "./img/2026-10-26-1.jpg",
  "./img/2026-10-26-2.jpg",
  "./img/2026-10-27-1.jpg",
  "./img/2026-10-27-2.jpg",
  "./img/2026-10-27-3.jpg",
  "./img/2026-10-27-4.jpg",
  "./img/2026-10-29-1.jpg",
  "./img/2026-10-29-2.jpg",
  "./img/2026-10-31-1.jpg",
  "./img/2026-10-31-2.jpg",
  "./img/2026-10-31-3.jpg",
  "./img/2026-10-31-4.jpg",
  "./img/2026-10-31-5.jpg",
  "./img/2026-10-31-6.jpg",
  "./img/2026-11-02-1.jpg",
  "./img/2026-11-03-1.jpg",
  "./img/2026-11-03-2.jpg",
  "./img/2026-11-03-3.jpg",
  "./img/2026-11-03-4.jpg",
  "./img/2026-11-03-5.jpg",
  "./img/2026-11-05-1.jpg",
  "./img/2026-11-05-2.jpg",
  "./img/2026-11-07-1.jpg",
  "./img/2026-11-07-2.jpg",
  "./img/2026-11-07-3.jpg",
  "./img/2026-11-07-4.jpg",
  "./img/2026-11-07-5.jpg",
  "./img/2026-11-07-6.jpg",
  "./img/2026-11-07-7.jpg",
  "./img/2026-11-10-1.jpg",
  "./img/2026-11-10-2.jpg",
  "./img/2026-11-10-3.jpg",
  "./img/2026-11-12-1.jpg",
  "./img/2026-11-12-2.jpg",
  "./img/2026-11-12-3.jpg",
  "./img/2026-11-14-1.jpg",
  "./img/2026-11-14-2.jpg",
  "./img/2026-11-14-3.jpg"
];
const LIB_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.concat(IMAGES))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("zo-") && k !== VERSION && k !== EXT).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const keep = (cache, req, res) => {
  if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(cache).then(c => c.put(req, copy)); }
  return res;
};
const orError = r => r || Response.error();

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Pages : réseau d'abord (pour recevoir les mises à jour), cache en secours
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put("./index.html", copy)); } return res; })
        .catch(() => caches.match("./index.html").then(orError))
    );
    return;
  }

  // Annonces Etsy : réseau d'abord (mises à jour chaque jour), copie en secours
  if (url.origin === self.location.origin && url.pathname.endsWith("/shop.json")) {
    e.respondWith(
      fetch(req).then(res => keep(VERSION, req, res)).catch(() => caches.match(req, { ignoreSearch: true }).then(orError))
    );
    return;
  }

  // Polices : cache d'abord
  if (LIB_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => keep(EXT, req, res)).catch(() => Response.error()))
    );
    return;
  }

  // Fichiers de l'appli : cache d'abord, mise à jour en arrière-plan
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => keep(VERSION, req, res)).catch(() => hit || Response.error());
      return hit || net;
    })
  );
});
