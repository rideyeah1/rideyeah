/**
 * RideYeah · Static build
 * -----------------------
 * Assembles a clean dist/ for Cloudflare Pages containing ONLY what ships:
 *   - index.html        (copied from rideyeah-home.html)
 *   - favicon + icons, robots.txt, sitemap.xml
 *   - images/*.webp, *.jpg   (NOT images/source/ masters)
 *
 * Run with:  npm run build
 */
import {
  rmSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { ROUTES } from "./routes-data.mjs";
import { CITIES } from "./cities-data.mjs";

// Guard: fail fast if any displayed fare drifted from the single source of truth
// (scripts/fares-data.mjs) before we build anything.
await import("./check-fares.mjs");

// Regenerate the LAX ⇄ City route pages (EN + ES) from routes-data, then the
// other Spanish pages from their EN sources so /es/ is always in sync.
await import("./gen-routes.mjs");
await import("./gen-cities.mjs");
await import("./gen-blog.mjs");
await import("./gen-sitemap.mjs");
await import("./generate-es.mjs");
await import("./generate-es-pages.mjs");

const DIST = "dist";

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, "images"), { recursive: true });
mkdirSync(join(DIST, "assets"), { recursive: true });

// Homepage → index.html
copyFileSync("rideyeah-home.html", join(DIST, "index.html"));

// Standalone pages (copied as-is)
for (const page of [
  "about.html",
  "fleet.html",
  "careers.html",
  "airport-transfers.html",
  "black-car-service.html",
  "hourly-chauffeur.html",
  "corporate-transportation.html",
  "popular-routes.html",
  "service-areas.html",
  "faq.html",
  // Legales. Van enlazadas desde el pie y desde el registro A2P 10DLC de
  // Twilio: si dejan de publicarse, esas URLs se caen y la campana de SMS
  // queda apuntando a un 404.
  "privacy.html",
  "terms.html",
  ...ROUTES.map((r) => `lax-to-${r.slug}.html`),
  ...CITIES.map((c) => `${c.slug}.html`),
]) {
  if (existsSync(page)) copyFileSync(page, join(DIST, page));
}

// Spanish pages (es/)
if (existsSync("es")) {
  mkdirSync(join(DIST, "es"), { recursive: true });
  for (const file of readdirSync("es")) {
    const src = join("es", file);
    if (!statSync(src).isDirectory() && file.endsWith(".html")) {
      copyFileSync(src, join(DIST, "es", file));
    }
  }
}

// Blog (blog/*.html + feed.xml)
if (existsSync("blog")) {
  mkdirSync(join(DIST, "blog"), { recursive: true });
  for (const file of readdirSync("blog")) {
    const src = join("blog", file);
    if (!statSync(src).isDirectory()) copyFileSync(src, join(DIST, "blog", file));
  }
}

// Shared assets (CSS/JS for subpages)
if (existsSync("assets")) {
  for (const file of readdirSync("assets")) {
    const src = join("assets", file);
    if (!statSync(src).isDirectory()) copyFileSync(src, join(DIST, "assets", file));
  }
}

// Root static assets (copy when present)
for (const file of ["404.html", "favicon.svg", "apple-touch-icon.png", "robots.txt", "sitemap.xml"]) {
  if (existsSync(file)) copyFileSync(file, join(DIST, file));
}

// Cloudflare Pages Functions (serverless) — must ship inside the deployed dir.
// Copies functions/** → dist/functions/** so `/api/*` routes are built on deploy.
if (existsSync("functions")) {
  const copyDir = (from, to) => {
    mkdirSync(to, { recursive: true });
    for (const entry of readdirSync(from)) {
      const s = join(from, entry), d = join(to, entry);
      if (statSync(s).isDirectory()) copyDir(s, d);
      else copyFileSync(s, d);
    }
  };
  copyDir("functions", join(DIST, "functions"));
}

// Optimized images only (skip the source/ masters folder)
let imgCount = 0;
for (const file of readdirSync("images")) {
  const src = join("images", file);
  if (statSync(src).isDirectory()) continue; // skips images/source
  if (!/\.(webp|jpe?g|png|svg|avif)$/i.test(file)) continue;
  copyFileSync(src, join(DIST, "images", file));
  imgCount++;
}

// --- Clean URLs ---------------------------------------------------------
// Cloudflare Pages serves extension-less URLs (and 308-redirects *.html → it).
// Strip `.html` from internal links + SEO tags in the BUILT output so the live
// site, its canonicals, hreflang and sitemap all use the same clean URLs Google
// indexes — no redirect hops, no "Page with redirect" noise in Search Console.
// Sources keep `.html` (simpler to author); this pass only rewrites dist/.
const cleanHtml = (s) => {
  s = s.split('href="index.html#').join('href="/#');
  s = s.split('href="index.html"').join('href="/"');
  s = s.split("es/index.html").join("es/"); // home language pill + auto-detect
  s = s.replace(/href="([^"#]*?)\.html(#[^"]*)?"/g, 'href="$1$2"');
  s = s.replace(/content="(https:\/\/rideyeah\.com\/[a-z0-9-]+)\.html"/g, 'content="$1"');
  s = s.replace(/"url": "(https:\/\/rideyeah\.com\/[a-z0-9-]+)\.html"/g, '"url": "$1"');
  // Make the render-blocking Google Fonts stylesheet load asynchronously — the
  // biggest mobile FCP/LCP win. Swap it to a print-media link that flips to "all"
  // on load (non-blocking), with a <noscript> fallback. The URL already carries
  // &display=swap so text paints immediately in the fallback then swaps in.
  s = s.replace(/<link\b[^>]*fonts\.googleapis\.com\/css2[^>]*rel="stylesheet"[^>]*>/, (tag) => {
    const href = (tag.match(/href="([^"]+)"/) || [])[1];
    if (!href) return tag;
    return (
      `<link rel="stylesheet" media="print" onload="this.media='all'" href="${href}">` +
      `<noscript><link rel="stylesheet" href="${href}"></noscript>`
    );
  });
  return s;
};
const cleanDir = (dir) => {
  for (const file of readdirSync(dir)) {
    const p = join(dir, file);
    if (statSync(p).isDirectory() || !file.endsWith(".html")) continue;
    writeFileSync(p, cleanHtml(readFileSync(p, "utf8")), "utf8");
  }
};
cleanDir(DIST);
if (existsSync(join(DIST, "es"))) cleanDir(join(DIST, "es"));
if (existsSync(join(DIST, "blog"))) cleanDir(join(DIST, "blog"));

// --- Cache-busting -------------------------------------------------------
// Version assets/site.css + assets/site.js by content hash so a CSS/JS change
// is never served stale from a browser or CDN cache. Rewrites every reference
// (e.g. `assets/site.css"` → `assets/site.css?v=ab12cd34"`) across built HTML.
const hashOf = (p) => createHash("sha1").update(readFileSync(p)).digest("hex").slice(0, 8);
const cssPath = join(DIST, "assets", "site.css");
const jsPath = join(DIST, "assets", "site.js");
const cssV = existsSync(cssPath) ? hashOf(cssPath) : "";
const jsV = existsSync(jsPath) ? hashOf(jsPath) : "";
const bust = (s) => {
  if (cssV) s = s.split('assets/site.css"').join(`assets/site.css?v=${cssV}"`);
  if (jsV) s = s.split('assets/site.js"').join(`assets/site.js?v=${jsV}"`);
  return s;
};
const bustDir = (dir) => {
  for (const file of readdirSync(dir)) {
    const p = join(dir, file);
    if (statSync(p).isDirectory() || !file.endsWith(".html")) continue;
    writeFileSync(p, bust(readFileSync(p, "utf8")), "utf8");
  }
};
bustDir(DIST);
if (existsSync(join(DIST, "es"))) bustDir(join(DIST, "es"));
if (existsSync(join(DIST, "blog"))) bustDir(join(DIST, "blog"));

const smPath = join(DIST, "sitemap.xml");
if (existsSync(smPath)) {
  writeFileSync(
    smPath,
    readFileSync(smPath, "utf8").replace(/(https:\/\/rideyeah\.com\/[a-z0-9-]+)\.html/g, "$1"),
    "utf8",
  );
}

// --- Travel Hub (rideyeah.com/travel) -----------------------------------
// Drop the pre-built static export into dist/travel/ verbatim. travel-static/ is
// the committed output of the separate Next.js Travel Hub project, refreshed with
// `node scripts/sync-travel-hub.mjs`. Its HTML already carries final, clean
// /travel-prefixed links and its own content-hashed _next assets, so it must NOT
// go through the clean-URL or cache-bust passes above — it's copied last and
// untouched. One Cloudflare deploy then serves both the main site and /travel.
let travelCount = 0;
if (existsSync("travel-static")) {
  const copyTravel = (from, to) => {
    mkdirSync(to, { recursive: true });
    for (const entry of readdirSync(from)) {
      if (entry === "README.txt") continue; // internal marker, don't publish
      const s = join(from, entry), d = join(to, entry);
      if (statSync(s).isDirectory()) copyTravel(s, d);
      else { copyFileSync(s, d); travelCount++; }
    }
  };
  copyTravel("travel-static", join(DIST, "travel"));
}

const travelNote = travelCount ? `  ·  /travel (${travelCount} files)` : "";
console.log(
  `✓ Built dist/  ·  index.html + ${imgCount} images + icons/SEO files + clean URLs${travelNote}`,
);
