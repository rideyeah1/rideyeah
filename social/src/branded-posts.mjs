// CANONICAL Instagram post format for RideYeah.
// Branded social posts — ALL output 1:1 (1080x1080) so they upload PERFECTLY in
// Instagram's default square crop (no cutting of the SUV, logo or text; no need
// to tap the expand icon). FB uses the same square.
//  - Landscape (16:9) sources -> framed: full photo on top + headline band below
//    (so the SUV is never cropped and IG never cuts the logo/text).
//  - Portrait sources -> full-bleed 1:1 with bottom gradient + safe margins.
// Logo top-left + themed headline (from the creating prompt) + url/phone.
// To reuse for a new image set: edit SRC (source folder) + the T map (per-image
// eyebrow/headline/crop-focus), then `node social/src/branded-posts.mjs`.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = 'C:/Users/reyna/Downloads/imagenes y videos de rideyeah 0628';
const OUT_HTML = path.join(HERE, 'out');
const DL = 'C:/Users/reyna/Downloads/RideYeah_Posts';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await mkdir(OUT_HTML, { recursive: true });
await mkdir(path.join(DL, 'IG'), { recursive: true });
await mkdir(path.join(DL, 'FB'), { recursive: true });

const INK = '#0a0a0b', BONE = '#f7f6f3', GOLD = '#c9a86a', GOLDSOFT = '#d9c193';

let fontsCss = await readFile(path.join(HERE, 'fonts.css'), 'utf8');
{
  const refs = [...new Set([...fontsCss.matchAll(/\.\/fonts\/(f\d+\.woff2)/g)].map((m) => m[1]))];
  for (const f of refs) {
    const b64 = (await readFile(path.join(HERE, 'fonts', f))).toString('base64');
    fontsCss = fontsCss.split(`./fonts/${f}`).join(`data:font/woff2;base64,${b64}`);
  }
  fontsCss = fontsCss.replace(/font-display:\s*swap/g, 'font-display:block');
}
const dataImg = async (abs) => `data:image/jpeg;base64,${(await readFile(abs)).toString('base64')}`;

const badge = (s) => `<svg viewBox="0 0 100 100" fill="none" width="${s}" height="${s}" style="filter:drop-shadow(0 3px 12px rgba(0,0,0,.55))">
  <rect x="5" y="5" width="90" height="90" rx="25" fill="#0a0a0b"/><rect x="6.25" y="6.25" width="87.5" height="87.5" rx="23.75" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".7"/>
  <rect x="18" y="18" width="64" height="64" rx="14" fill="${GOLD}"/>
  <path d="M 37 68 V 50 H 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 L 63 68" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const wordmark = (fontPx) => `<span class="wm" style="font-size:${fontPx}px;color:${BONE}">
<svg viewBox="0 0 24 24" fill="none" style="height:${fontPx * 0.92}px;width:${fontPx * 0.7}px;margin-right:.04em">
  <path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg><span>ideYeah</span></span>`;

const T = {
  '1': { eyebrow: 'Airport Transfers', headline: 'Your airport ride,<br>handled.', pos: 'center center' },
  '2': { eyebrow: 'Executive Travel', headline: 'The city, on<br>your schedule.', pos: 'center center' },
  '3': { eyebrow: 'Private Car Service', headline: 'Above it all.', pos: 'center bottom' },
  '4': { eyebrow: 'Luxury On Demand', headline: 'Beverly Hills,<br>on your terms.', pos: 'center bottom' },
  '5': { eyebrow: 'Escapes & Day Trips', headline: 'Beyond the<br>city limits.', pos: 'center center' },
  '6': { eyebrow: 'Coastal Drives', headline: 'The coast, in<br>quiet luxury.', pos: 'center center' },
  '7': { eyebrow: 'Iconic Los Angeles', headline: 'This is<br>your LA.', pos: 'center bottom' },
  '8': { eyebrow: 'RideYeah for Business', headline: 'Arrive like<br>it matters.', pos: 'center 40%' },
};

const W = 1080, H = 1080;       // 1:1 — Instagram default-safe (uploads perfect, no crop)
const PHOTO_H = 600;            // 16:9 photo window for framed (landscape) posts

const textBlock = (t, leftPad, bottom, headPx, eyebrowPx, urlPx) => `
  <div style="position:absolute;left:${leftPad}px;right:${leftPad}px;bottom:${bottom}px">
    <div class="eyebrow" style="font-size:${eyebrowPx}px">${t.eyebrow}</div>
    <div class="serif" style="font-size:${headPx}px;line-height:1.02;font-weight:600;letter-spacing:-.02em;margin-top:${Math.round(headPx*0.22)}px;text-shadow:0 3px 22px rgba(0,0,0,.45)">${t.headline}</div>
    <div style="width:${Math.round(headPx*1.3)}px;height:2px;background:linear-gradient(90deg,${GOLD},transparent);margin:${Math.round(headPx*0.3)}px 0 ${Math.round(headPx*0.22)}px"></div>
    <div style="font-size:${urlPx}px;font-weight:800;letter-spacing:.01em;color:${BONE}">rideyeah.com<span style="color:rgba(201,168,106,.7);margin:0 14px">&#9670;</span><span style="color:${GOLDSOFT}">(805) 285-1570</span></div>
  </div>`;

const head = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${INK}}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:"Manrope",system-ui,sans-serif;color:${BONE};-webkit-font-smoothing:antialiased}
.serif{font-family:"Fraunces",Georgia,serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.eyebrow{font-weight:700;text-transform:uppercase;color:${GOLDSOFT};letter-spacing:.30em}
</style></head><body><div class="stage">`;

const fullBleed = (bg, pos, t) => `${head}
  <div style="position:absolute;inset:0;background:url('${bg}') ${pos} / cover no-repeat"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:30%;background:linear-gradient(180deg,rgba(10,10,11,.5),transparent)"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:60%;background:linear-gradient(0deg,${INK} 3%,rgba(10,10,11,.72) 32%,transparent)"></div>
  <div style="position:absolute;top:56px;left:64px;display:flex;align-items:center;gap:18px">${badge(76)}${wordmark(45)}</div>
  ${textBlock(t, 64, 84, 72, 26, 30)}
</div></body></html>`;

const framed = (bg, pos, t) => `${head}
  <div style="position:absolute;top:0;left:0;width:${W}px;height:${PHOTO_H}px;background:url('${bg}') ${pos} / cover no-repeat"></div>
  <div style="position:absolute;top:0;left:0;width:${W}px;height:130px;background:linear-gradient(180deg,rgba(10,10,11,.55),transparent)"></div>
  <div style="position:absolute;top:${PHOTO_H - 90}px;left:0;width:${W}px;height:90px;background:linear-gradient(0deg,${INK},transparent)"></div>
  <div style="position:absolute;top:${PHOTO_H}px;left:0;width:${W}px;height:${H - PHOTO_H}px;background:${INK}"></div>
  <div style="position:absolute;top:44px;left:64px;display:flex;align-items:center;gap:18px">${badge(72)}${wordmark(43)}</div>
  ${textBlock(t, 64, 96, 74, 27, 31)}
</div></body></html>`;

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));
for (const f of files) {
  const num = (f.match(/^(\d)/) || [])[1];
  const t = T[num];
  if (!t) { console.log('skip', f); continue; }
  const meta = await sharp(path.join(SRC, f)).metadata();
  const land = meta.width >= meta.height;
  const bg = await dataImg(path.join(SRC, f));
  const variant = /\b2\b/.test(f.replace(/^\d/, '')) ? '-alt' : '';
  const name = `${num}_${t.eyebrow.replace(/[^a-z0-9]+/gi, '-')}${variant}`;

  const htmlPath = path.join(OUT_HTML, `_bp_${name}.html`);
  const pngPath = path.join(OUT_HTML, `_bp_${name}.png`);
  await writeFile(htmlPath, land ? framed(bg, t.pos, t) : fullBleed(bg, t.pos, t));
  spawnSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
    `--window-size=${W},${H}`, '--virtual-time-budget=4000', `--screenshot=${pngPath}`, pathToFileURL(htmlPath).href], { stdio: 'ignore' });

  await sharp(pngPath).resize(1080, 1080).jpeg({ quality: 90 }).toFile(path.join(DL, 'IG', `${name}.jpg`));
  await sharp(pngPath).resize(1080, 1080).jpeg({ quality: 90 }).toFile(path.join(DL, 'FB', `${name}.jpg`));
  console.log('OK', name, land ? 'framed-1:1' : 'fullbleed-1:1');
}
console.log('\nDone ->', DL, '(all 1080x1080 square)');
