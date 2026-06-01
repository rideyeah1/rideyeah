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
  existsSync,
  statSync,
} from "node:fs";
import { join } from "node:path";

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

// Optimized images only (skip the source/ masters folder)
let imgCount = 0;
for (const file of readdirSync("images")) {
  const src = join("images", file);
  if (statSync(src).isDirectory()) continue; // skips images/source
  if (!/\.(webp|jpe?g|png|svg|avif)$/i.test(file)) continue;
  copyFileSync(src, join(DIST, "images", file));
  imgCount++;
}

console.log(`✓ Built dist/  ·  index.html + ${imgCount} images + icons/SEO files`);
