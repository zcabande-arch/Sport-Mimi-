/* Récupère les annonces actives de la boutique Etsy et écrit zo/shop.json + les photos dans zo/shop/.
   Lancé chaque jour par .github/workflows/etsy.yml. Clés : secrets ETSY_API_KEY et ETSY_SHARED_SECRET. */
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";

const SHOP = process.env.ETSY_SHOP || "zoestudioapp";
const KEY = process.env.ETSY_API_KEY, SECRET = process.env.ETSY_SHARED_SECRET;
const DIR = new URL("..", import.meta.url).pathname;           // zo/
const OUT = DIR + "shop.json", IMG = DIR + "shop/";
const MAX_IMAGES = 6;

if (!KEY) { console.log("Pas de clé ETSY_API_KEY : rien à faire."); process.exit(0); }
// Etsy demande « keystring:shared_secret » dans x-api-key (la clé seule pour les anciennes applis)
const headers = { "x-api-key": SECRET ? KEY + ":" + SECRET : KEY, "accept": "application/json" };

async function api(path){
  const res = await fetch("https://openapi.etsy.com/v3/application" + path, { headers });
  if (!res.ok) throw new Error(res.status + " sur " + path + " : " + (await res.text()).slice(0, 300));
  return res.json();
}

const old = existsSync(OUT) ? JSON.parse(await readFile(OUT, "utf8")) : { listings: [] };
const firstSeen = Object.fromEntries((old.listings || []).map(l => [l.id, l.firstSeen]));

const found = await api("/shops?shop_name=" + encodeURIComponent(SHOP));
const shop = (found.results || []).find(s => s.shop_name.toLowerCase() === SHOP.toLowerCase()) || (found.results || [])[0];
if (!shop) throw new Error("Boutique " + SHOP + " introuvable");

const raw = [];
for (let offset = 0; ; offset += 100) {
  const page = await api("/shops/" + shop.shop_id + "/listings/active?limit=100&offset=" + offset + "&includes=Images");
  raw.push(...page.results);
  if (page.results.length < 100) break;
}

await mkdir(IMG, { recursive: true });
const keep = new Set();
const now = new Date().toISOString();
const listings = [];
for (const l of raw) {
  let images = l.images;
  if (!images) images = (await api("/listings/" + l.listing_id + "/images")).results;
  const files = [];
  for (const im of (images || []).sort((a, b) => a.rank - b.rank).slice(0, MAX_IMAGES)) {
    const name = l.listing_id + "-" + im.listing_image_id + ".jpg";
    keep.add(name);
    if (!existsSync(IMG + name)) {
      const r = await fetch(im.url_570xN || im.url_fullxfull);
      if (!r.ok) continue;
      await writeFile(IMG + name, Buffer.from(await r.arrayBuffer()));
    }
    files.push({ src: "shop/" + name, w: im.full_width ? 570 : undefined, h: im.full_width ? Math.round(570 * im.full_height / im.full_width) : undefined });
  }
  listings.push({
    id: l.listing_id,
    title: l.title,
    url: l.url,
    price: l.price ? l.price.amount / l.price.divisor : null,
    currency: l.price ? l.price.currency_code : "EUR",
    description: (l.description || "").slice(0, 700),
    tags: l.tags || [],
    favorites: l.num_favorers || 0,
    views: l.views ?? null,
    created: new Date((l.original_creation_timestamp || l.created_timestamp) * 1000).toISOString(),
    firstSeen: firstSeen[l.listing_id] || now,
    images: files
  });
}
listings.sort((a, b) => b.created.localeCompare(a.created));

// photos des annonces retirées
for (const f of await readdir(IMG)) if (f.endsWith(".jpg") && !keep.has(f)) await unlink(IMG + f);

const data = {
  updated: now,
  shop: {
    name: shop.shop_name, title: shop.title || "", url: shop.url,
    active: shop.listing_active_count ?? listings.length,
    sales: shop.transaction_sold_count ?? null,
    favorites: shop.num_favorers ?? null,
    reviews: shop.review_count ?? null, rating: shop.review_average ?? null
  },
  listings
};
// ne réécrit le fichier que si quelque chose a changé (sinon un commit par jour pour rien)
const strip = d => JSON.stringify({ ...d, updated: null });
if (strip(old) === strip(data)) { console.log("Rien de nouveau sur la boutique."); process.exit(0); }
await writeFile(OUT, JSON.stringify(data, null, 1) + "\n");
console.log(listings.length + " annonces actives enregistrées.");
