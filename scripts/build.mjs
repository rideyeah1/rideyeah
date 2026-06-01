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

// Homepage → index.html
copyFileSync("rideyeah-home.html", join(DIST, "index.html"));

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
