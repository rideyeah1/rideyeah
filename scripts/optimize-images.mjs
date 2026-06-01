/**
 * RideYeah · Static image optimizer
 * -----------------------------------
 * Converts the source masters in images/ into web-optimized assets:
 *   - <name>.webp  → primary (modern browsers, ~80% smaller)
 *   - <name>.jpg   → universal fallback (mozjpeg-grade compression)
 *
 * Source masters are expected in images/source/ (kept out of deploy).
 * Run with:  npm run optimize:images
 */
import sharp from "sharp";
import { readdirSync, statSync, mkdirSync, existsSync } from "node:fs";
import { join, parse } from "node:path";

const SRC_DIR = "images/source";
const OUT_DIR = "images";

// Per-asset target width (px). Square masters are 1024; we keep heroes large
// for full-bleed backgrounds and downscale fleet cards (they render small).
const WIDTHS = {
  hero_suburban: 1600,
  band_highway: 1600,
  interior_leather: 1280,
  fleet_sedan: 900,
  fleet_suv: 900,
  fleet_van: 900,
};
const DEFAULT_WIDTH = 1280;

const WEBP_QUALITY = 80;
const JPG_QUALITY = 80;

if (!existsSync(SRC_DIR)) {
  console.error(`✖ Source folder not found: ${SRC_DIR}`);
  console.error("  Move your original masters into images/source/ first.");
  process.exit(1);
}
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
if (files.length === 0) {
  console.error(`✖ No source images found in ${SRC_DIR}`);
  process.exit(1);
}

let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const { name } = parse(file);
  const srcPath = join(SRC_DIR, file);
  const inSize = statSync(srcPath).size;
  totalIn += inSize;

  const width = WIDTHS[name] ?? DEFAULT_WIDTH;
  const base = sharp(srcPath).resize({ width, withoutEnlargement: true });

  const webpPath = join(OUT_DIR, `${name}.webp`);
  const jpgPath = join(OUT_DIR, `${name}.jpg`);

  await base.clone().webp({ quality: WEBP_QUALITY, effort: 5 }).toFile(webpPath);
  await base
    .clone()
    .jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true })
    .toFile(jpgPath);

  const webpSize = statSync(webpPath).size;
  const jpgSize = statSync(jpgPath).size;
  totalOut += webpSize;

  const kb = (n) => (n / 1024).toFixed(0).padStart(4);
  console.log(
    `✓ ${name.padEnd(18)} ${kb(inSize)}KB → webp ${kb(webpSize)}KB · jpg ${kb(jpgSize)}KB  (@${width}px)`
  );
}

const pct = (1 - totalOut / totalIn) * 100;
console.log(
  `\nDone. WebP payload ${(totalOut / 1024).toFixed(0)}KB vs source ${(totalIn / 1024).toFixed(0)}KB — ${pct.toFixed(0)}% smaller.`
);
