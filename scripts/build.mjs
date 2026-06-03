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

// Regenerate Spanish pages from their EN sources so /es/ is always in sync
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
  "popular-routes.html",
  "lax-to-beverly-hills.html",
  "lax-to-disneyland.html",
  "lax-to-newport-beach.html",
  "lax-to-anaheim.html",
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

const smPath = join(DIST, "sitemap.xml");
if (existsSync(smPath)) {
  writeFileSync(
    smPath,
    readFileSync(smPath, "utf8").replace(/(https:\/\/rideyeah\.com\/[a-z0-9-]+)\.html/g, "$1"),
    "utf8",
  );
}

console.log(`✓ Built dist/  ·  index.html + ${imgCount} images + icons/SEO files + clean URLs`);
