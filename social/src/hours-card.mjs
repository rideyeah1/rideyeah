// "Hours of Operation" card for RideYeah — to satisfy Google Business Profile's
// "add a close-up photo of this place's hours" verification prompt.
// RideYeah operates 24/7 (by reservation). On-brand, rendered via Chrome + sharp.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const OUT_HTML = path.join(HERE, 'out');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await mkdir(OUT_HTML, { recursive: true });

const INK = '#0a0a0b', BONE = '#f7f6f3', GOLD = '#c9a86a', GOLDSOFT = '#d9c193', MUTE = '#a9a7a0';

// ---- inline brand fonts ----
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

const badge = (s) => `
<svg viewBox="0 0 100 100" fill="none" width="${s}" height="${s}" style="filter:drop-shadow(0 3px 14px rgba(0,0,0,.5))">
  <rect x="5" y="5" width="90" height="90" rx="25" fill="#0a0a0b"/>
  <rect x="6.25" y="6.25" width="87.5" height="87.5" rx="23.75" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".6"/>
  <rect x="18" y="18" width="64" height="64" rx="14" fill="${GOLD}"/>
  <path d="M 37 68 V 50 H 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 L 63 68" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const wordmark = (fontPx) => `
<span class="wm" style="font-size:${fontPx}px;color:${BONE}">
<svg viewBox="0 0 24 24" fill="none" style="height:${fontPx * 0.92}px;width:${fontPx * 0.7}px;margin-right:.04em">
  <path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg><span>ideYeah</span></span>`;

const HERO = await dataImg(path.join(ROOT, 'images', 'hero_suburban.jpg'));
const sep = `<span style="color:rgba(201,168,106,.55);margin:0 14px">&#9670;</span>`;

const W = 1200, H = 1620;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dayRow = (d) => `
  <div style="display:flex;justify-content:space-between;align-items:baseline;padding:19px 0;border-bottom:1px solid rgba(201,168,106,.16)">
    <span style="font-size:38px;font-weight:600;color:${BONE};letter-spacing:.005em">${d}</span>
    <span style="display:flex;align-items:center;gap:14px">
      <span style="width:9px;height:9px;border-radius:50%;background:${GOLD};box-shadow:0 0 10px rgba(201,168,106,.7)"></span>
      <span style="font-size:34px;font-weight:700;color:${GOLDSOFT}">Open 24 hours</span>
    </span>
  </div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${INK}}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:"Manrope",system-ui,sans-serif;color:${BONE};-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}
.serif{font-family:"Fraunces",Georgia,serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.eyebrow{font-weight:700;text-transform:uppercase;color:${GOLDSOFT};letter-spacing:.34em}
.pad{padding-left:96px;padding-right:96px}
</style></head><body>
<div class="stage">

  <!-- ===== HERO BANNER ===== -->
  <div style="position:relative;width:100%;height:430px;flex:none">
    <div style="position:absolute;inset:0;background:url('${HERO}') center 40% / cover no-repeat"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,11,.55) 0%,rgba(10,10,11,.35) 40%,${INK} 96%)"></div>
    <div class="pad" style="position:absolute;left:0;right:0;top:60px;text-align:center">
      <div style="display:flex;align-items:center;justify-content:center;gap:24px">
        ${badge(104)}${wordmark(62)}
      </div>
      <div class="eyebrow" style="font-size:22px;margin-top:26px;text-shadow:0 2px 12px rgba(0,0,0,.6)">Luxury Black-SUV Chauffeur Service</div>
    </div>
  </div>

  <!-- ===== TITLE ===== -->
  <div class="pad" style="text-align:center;padding-top:30px">
    <div class="serif" style="font-size:78px;font-weight:600;letter-spacing:-.02em;color:${BONE};line-height:1">Hours of Operation</div>
    <div style="margin:26px auto 0;width:130px;height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent)"></div>
  </div>

  <!-- ===== HOURS LIST ===== -->
  <div class="pad" style="padding-top:30px">
    ${days.map(dayRow).join('')}
  </div>

  <!-- ===== 24/7 BANNER + FOOTER ===== -->
  <div style="margin-top:auto">
    <div class="pad" style="text-align:center;padding-bottom:30px">
      <div style="display:inline-flex;align-items:center;gap:16px;border:1.5px solid rgba(201,168,106,.4);background:rgba(201,168,106,.08);border-radius:999px;padding:18px 40px">
        <span style="width:11px;height:11px;border-radius:50%;background:${GOLD};box-shadow:0 0 12px rgba(201,168,106,.9)"></span>
        <span style="font-size:34px;font-weight:800;color:${BONE};letter-spacing:.03em">OPEN 24 HOURS &middot; 7 DAYS A WEEK</span>
      </div>
    </div>
    <div class="pad" style="background:linear-gradient(180deg,transparent,rgba(201,168,106,.06));border-top:1px solid rgba(201,168,106,.22);padding-top:34px;padding-bottom:40px;text-align:center">
      <div style="font-size:40px;font-weight:800;color:${BONE};letter-spacing:.01em">(805) 285-1570</div>
      <div class="serif" style="font-size:36px;font-weight:600;color:${GOLDSOFT};margin-top:8px">rideyeah.com</div>
      <div style="font-size:22px;color:${MUTE};font-weight:600;margin-top:16px">By Reservation ${sep} Licensed &amp; Insured ${sep} Los Angeles &amp; Orange County</div>
    </div>
  </div>

  <!-- gold inset frame -->
  <div style="position:absolute;inset:26px;border:1.5px solid rgba(201,168,106,.30);border-radius:8px;pointer-events:none"></div>
</div></body></html>`;

const htmlPath = path.join(OUT_HTML, '_hours-card.html');
const pngPath = path.join(OUT_HTML, '_hours-card.png');
await writeFile(htmlPath, html);
spawnSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=2', `--window-size=${W},${H}`,
  '--virtual-time-budget=4000', `--screenshot=${pngPath}`, pathToFileURL(htmlPath).href,
], { stdio: 'ignore' });

const outPng = path.join(ROOT, 'social', 'hours-card.png');
const outJpg = 'C:/Users/reyna/Downloads/RideYeah_Hours.jpg';
await sharp(pngPath).resize(1200, 1620).png().toFile(outPng);
await sharp(pngPath).resize(1200, 1620).jpeg({ quality: 95 }).toFile(outJpg);
const m = await sharp(outPng).metadata();
console.log('WROTE', outPng, m.width + 'x' + m.height);
console.log('WROTE', outJpg);
