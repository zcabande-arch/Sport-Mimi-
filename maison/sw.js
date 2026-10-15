/* Maison Reconnue — service worker : fonctionne hors connexion (modèle et bibliothèques compris) */
const VERSION = "maison-v5";
const EXT = "maison-ext";   // bibliothèques, polices et modèle : gardés d'une version à l'autre
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];
const MODEL_HOSTS = ["teachablemachine.withgoogle.com", "storage.googleapis.com"];
const LIB_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("maison-") && k !== VERSION && k !== EXT).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const keep = (cache, req, res) => {
  if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(cache).then(c => c.put(req, copy)); }
  return res;
};
// Ne jamais laisser une requête sans réponse : sinon le navigateur la fait échouer
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

  // Modèle Teachable Machine : réseau d'abord (un modèle ré-entraîné arrive tout de suite), copie en secours
  if (MODEL_HOSTS.includes(url.hostname)) {
    e.respondWith(
      fetch(req).then(res => keep(EXT, req, res))
        .catch(() => caches.match(req, {cacheName: EXT}).then(orError))
    );
    return;
  }

  // Bibliothèques et polices (versions figées) : cache d'abord
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
