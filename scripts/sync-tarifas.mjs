/**
 * RideYeah · Sincronizar los precios del sitio con el SISTEMA (9-sep-2026)
 * ------------------------------------------------------------------------
 * El dueño: "necesito que eso esté siempre actualizado a lo que tenemos en
 * nuestro sistema". La fuente de verdad de los precios es el panel
 * (rysistema.com → Despacho RideYeah → Tarifas), que los publica en
 * `https://rysistema.com/api/publico/tarifas`. Este script los lee y reescribe
 * TODOS los sitios del repo donde hay un precio:
 *
 *   1. scripts/routes-data.mjs   (precio de cada página LAX ⇄ ciudad; de ahí
 *      salen las páginas EN + ES, las páginas de ciudad y el sitemap)
 *   2. scripts/fares-data.mjs    (EXTRA: ciudades sin página propia)
 *   4. rideyeah-home.html        (viñetas del asistente EN+ES y la rejilla de rutas)
 *   5. popular-routes.html       (la rejilla)
 *   6. faq.html                  (la respuesta de Malibu)
 *   7. airport-transfers.html + es/traslados-aeropuerto-lax.html (las 3 tarjetas)
 *   8. blog/*.html               (las entradas que nombran una tarifa de ruta)
 *
 * Lo corre el workflow de deploy (cada día y cuando el panel avisa) y se puede
 * correr a mano: `node scripts/sync-tarifas.mjs`. Si el sistema no contesta,
 * NO toca nada y sale bien: un sitio con los precios de ayer es mejor que un
 * build roto. Con `--estricto` sí falla (para saberlo en CI).
 *
 * Después de esto, `node scripts/build.mjs` regenera las páginas y
 * `check-fares.mjs` comprueba que no quedó ningún precio suelto.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const URL_TARIFAS = process.env.TARIFAS_URL || "https://rysistema.com/api/publico/tarifas";
const estricto = process.argv.includes("--estricto");

// Qué ZONA del sistema le corresponde a cada página de ruta del sitio.
const ZONA_DE_RUTA = {
  "downtown-la": "Downtown LA",
  "long-beach": "Long Beach",
  pasadena: "Pasadena",
  calabasas: "West Valley",
  glendale: "Glendale",
  anaheim: "Anaheim / Disney",
  "huntington-beach": "Huntington Beach",
  "simi-valley": "Simi / TO / Moorpark",
  "thousand-oaks": "Simi / TO / Moorpark",
  "laguna-beach": "Laguna Beach",
  camarillo: "Oxnard / Camarillo",
  "santa-barbara": "Santa Barbara",
};
// Y a cada ciudad EXTRA (sin página propia).
const ZONA_DE_EXTRA = {
  "Beverly Hills": "Beverly Hills",
  "Santa Monica": "Santa Monica",
  Disneyland: "Anaheim / Disney",
  Malibu: "Malibu",
  "Newport Beach": "Newport Beach",
  Irvine: "Irvine",
};
// Las tres tarjetas de airport-transfers (EN y ES): rótulo → zona.
const TARJETAS_AEROPUERTO = [
  { rotulo: "LAX → Downtown LA", zona: "Downtown LA" },
  { rotulo: "LAX → Centro de LA", zona: "Downtown LA" },
  { rotulo: "LAX → Long Beach", zona: "Long Beach" },
  { rotulo: "LAX → Anaheim / Disneyland", zona: "Anaheim / Disney" },
];

const read = (p) => readFileSync(p, "utf8");
const cambios = [];
function write(p, antes, despues) {
  if (antes === despues) return;
  writeFileSync(p, despues);
  cambios.push(p);
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const dolar = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

// ── 1. Leer el sistema ───────────────────────────────────────────────────────
let datos;
try {
  const r = await fetch(URL_TARIFAS, { signal: AbortSignal.timeout(20_000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  datos = await r.json();
  if (!Array.isArray(datos.rutas) || !datos.porHora) throw new Error("respuesta sin rutas");
} catch (e) {
  const msg = `sync-tarifas: no se pudo leer ${URL_TARIFAS} (${e instanceof Error ? e.message : e}).`;
  if (estricto) { console.error("✗ " + msg); process.exit(1); }
  console.warn("⚠ " + msg + " Se dejan los precios como están.");
  process.exit(0);
}

function precioDeZona(zona) {
  const r = datos.rutas.find((x) => (x.origen === "LAX" && x.destino === zona) || (x.destino === "LAX" && x.origen === zona));
  return r ? Number(r.precio) : null;
}

// Lo que dice el repo HOY (antes de tocar nada), para reemplazar lo viejo.
const { ROUTES } = await import("./routes-data.mjs");
const { EXTRA, faresSemicolon, faresBullets, FARE_OF } = await import("./fares-data.mjs");
const viejoSemicolon = faresSemicolon();
const viejoBullets = faresBullets().replace(/\n/g, "\\n");
const viejoMalibu = FARE_OF["Malibu"];

// ── 2. routes-data.mjs ───────────────────────────────────────────────────────
const nuevoPrecioRuta = {};
{
  const p = "scripts/routes-data.mjs";
  let s = read(p);
  const antes = s;
  for (const r of ROUTES) {
    const zona = ZONA_DE_RUTA[r.slug];
    const precio = zona ? precioDeZona(zona) : null;
    if (precio == null) { console.warn(`  ⚠ ${r.slug}: sin precio en el sistema (zona ${zona ?? "?"}); se deja $${r.price}`); nuevoPrecioRuta[r.slug] = r.price; continue; }
    nuevoPrecioRuta[r.slug] = precio;
    if (precio !== r.price) {
      s = s.replace(new RegExp(`(slug: "${esc(r.slug)}",[^\\n]*?price: )${esc(String(r.price))}`), `$1${precio}`);
      console.log(`  ${r.city}: $${r.price} → $${precio}`);
    }
  }
  write(p, antes, s);
}

// ── 3. fares-data.mjs (EXTRA) ────────────────────────────────────────────────
const nuevoExtra = { ...EXTRA };
{
  const p = "scripts/fares-data.mjs";
  let s = read(p);
  const antes = s;
  for (const [ciudad, viejo] of Object.entries(EXTRA)) {
    const precio = precioDeZona(ZONA_DE_EXTRA[ciudad]);
    if (precio == null) { console.warn(`  ⚠ ${ciudad}: sin precio en el sistema; se deja $${viejo}`); continue; }
    nuevoExtra[ciudad] = precio;
    if (precio !== viejo) {
      const clave = /^[A-Za-z]+$/.test(ciudad) ? ciudad : `"${ciudad}"`;
      s = s.replace(new RegExp(`(\\n\\s*${esc(clave)}: )${esc(String(viejo))}(,?)`), `$1${precio}$2`);
      console.log(`  ${ciudad}: $${viejo} → $${precio}`);
    }
  }
  write(p, antes, s);
}

// Las listas NUEVAS, con la misma forma que fares-data (para chat.js y el home).
const rp = (slug) => nuevoPrecioRuta[slug];
const CHAT_NUEVO = [
  { city: "Santa Monica", price: nuevoExtra["Santa Monica"] },
  { city: "Beverly Hills", price: nuevoExtra["Beverly Hills"] },
  { city: "Downtown LA", price: rp("downtown-la") },
  { city: "Calabasas", price: rp("calabasas") },
  { city: "Glendale", price: rp("glendale") },
  { city: "Anaheim", price: rp("anaheim") },
  { city: "Disneyland", price: nuevoExtra["Disneyland"] },
  { city: "Huntington Beach", price: rp("huntington-beach") },
  { city: "Long Beach", price: rp("long-beach") },
  { city: "Pasadena", price: rp("pasadena") },
  { city: "Malibu", price: nuevoExtra["Malibu"] },
  { city: "Newport Beach", price: nuevoExtra["Newport Beach"] },
  { city: "Irvine", price: nuevoExtra["Irvine"] },
  { city: "Simi Valley", price: rp("simi-valley") },
  { city: "Thousand Oaks", price: rp("thousand-oaks") },
  { city: "Laguna Beach", price: rp("laguna-beach") },
  { city: "Camarillo", price: rp("camarillo") },
  { city: "Santa Barbara", price: rp("santa-barbara") },
];
const nuevoSemicolon = CHAT_NUEVO.map((f) => `${f.city} $${f.price}`).join("; ");
const nuevoBullets = CHAT_NUEVO.map((f) => `\\n• ${f.city} — $${f.price}`).join("");
const horasMin = Number(datos.porHora.horasMinimas) || 2;

// ── 4. (el chat ya no lleva precios: Sofia cotiza con el sistema, 12-sep-2026) ──

// ── 5. rideyeah-home.html: viñetas del asistente (EN + ES) y la rejilla ─────
function reemplazarRejilla(html) {
  let s = html;
  for (const r of ROUTES) {
    const precio = nuevoPrecioRuta[r.slug];
    s = s.replace(new RegExp(`(LAX ⇄ ${esc(r.city)}[^$]{0,200}?\\$)(\\d+(?:\\.\\d+)?)`, "g"), (m, a, n) => (Number(n) === precio ? m : `${a}${precio}`));
  }
  return s;
}
{
  const p = "rideyeah-home.html";
  let s = read(p);
  const antes = s;
  s = reemplazarRejilla(s);
  write(p, antes, s);
}
{
  const p = "popular-routes.html";
  const antes = read(p);
  write(p, antes, reemplazarRejilla(antes));
}

// ── 6. faq.html (Malibu) ─────────────────────────────────────────────────────
{
  const p = "faq.html";
  const antes = read(p);
  write(p, antes, antes.split(`fixed, all-in fare from $${viejoMalibu}`).join(`fixed, all-in fare from $${nuevoExtra["Malibu"]}`));
}

// ── 7. Las tarjetas de aeropuerto (EN + ES) ──────────────────────────────────
for (const p of ["airport-transfers.html", "es/traslados-aeropuerto-lax.html"]) {
  let s;
  try { s = read(p); } catch { continue; }
  const antes = s;
  for (const t of TARJETAS_AEROPUERTO) {
    const precio = precioDeZona(t.zona);
    if (precio == null) continue;
    s = s.replace(new RegExp(`(${esc(t.rotulo)}</div>[\\s\\S]{0,400}?>\\$)(\\d+(?:\\.\\d+)?)(</div>)`), (m, a, n, b) => (Number(n) === precio ? m : `${a}${dolar(precio)}${b}`));
  }
  write(p, antes, s);
}

// ── 8. Blog: la FUENTE (scripts/blog-data.mjs), no el HTML generado ─────────
// El build regenera blog/*.html desde blog-data.mjs, así que corregir el HTML
// no dura ni un build. Se corrige cada entrada cuyo slug nombra la ruta.
{
  const p = "scripts/blog-data.mjs";
  let s;
  try { s = read(p); } catch { s = null; }
  if (s) {
    const antes = s;
    // Cada entrada va desde su `slug: "..."` hasta el siguiente.
    const partes = s.split(/(?=\n\s*slug: ")/);
    const arregladas = partes.map((parte) => {
      const m = parte.match(/^\n\s*slug: "([^"]+)"/);
      if (!m) return parte;
      const ruta = ROUTES.find((r) => m[1].includes(r.slug));
      if (!ruta) return parte;
      const precio = nuevoPrecioRuta[ruta.slug];
      return parte
        .replace(/(fixed \$)(\d+(?:\.\d{2})?)( fare)/g, (x, aa, n, bb) => (Number(n) === precio ? x : `${aa}${precio}${bb}`))
        .replace(/(starts at \$)(\d+(?:\.\d{2})?)/g, (x, aa, n) => (Number(n) === precio ? x : `${aa}${precio}`));
    });
    s = arregladas.join("");
    write(p, antes, s);
  }
}

if (cambios.length) {
  console.log(`✔ sync-tarifas: ${cambios.length} archivo(s) actualizados desde ${URL_TARIFAS}:\n  - ` + [...new Set(cambios)].join("\n  - "));
} else {
  console.log(`✔ sync-tarifas: el sitio ya coincide con el sistema (${URL_TARIFAS}).`);
}
