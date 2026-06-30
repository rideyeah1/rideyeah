// Brand the two World Cup 2026 photos for RideYeah social posts.
// Full-bleed photo + scrims + real logo + headline/CTA/contact, rendered with brand fonts.
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

const INK = '#0a0a0b', BONE = '#f7f6f3', GOLD = '#c9a86a', GOLDSOFT = '#d9c193', MUTE = '#cfcdc6';

// inline brand fonts
let fontsCss = await readFile(path.join(HERE, 'fonts.css'), 'utf8');
{
  const refs = [...new Set([...fontsCss.matchAll(/\.\/fonts\/(f\d+\.woff2)/g)].map((m) => m[1]))];
  for (const f of refs) {
    const b64 = (await readFile(path.join(HERE, 'fonts', f))).toString('base64');
    fontsCss = fontsCss.split(`./fonts/${f}`).join(`data:font/woff2;base64,${b64}`);
  }
  fontsCss = fontsCss.replace(/font-display:\s*swap/g, 'font-display:block');
}
const dataImg = async (abs) => {
  const buf = await readFile(abs);
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
};

const badge = (s) => `
<svg viewBox="0 0 100 100" fill="none" width="${s}" height="${s}" style="filter:drop-shadow(0 2px 10px rgba(0,0,0,.5))">
  <rect x="5" y="5" width="90" height="90" rx="25" fill="#0a0a0b"/>
  <rect x="6.25" y="6.25" width="87.5" height="87.5" rx="23.75" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".6"/>
  <rect x="18" y="18" width="64" height="64" rx="14" fill="${GOLD}"/>
  <path d="M 37 68 V 50 H 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 L 63 68" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const wordmark = (fontPx) => `
<span class="wm" style="font-size:${fontPx}px;color:${BONE};text-shadow:0 2px 12px rgba(0,0,0,.6)">
<svg viewBox="0 0 24 24" fill="none" style="height:${fontPx * 0.92}px;width:${fontPx * 0.7}px;margin-right:.04em">
  <path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg><span>ideYeah</span></span>`;

const W = 1080;
const tpl = (cfg) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${W}px;overflow:hidden;background:${INK}}
.stage{position:relative;width:${W}px;height:${W}px;overflow:hidden;font-family:"Manrope",system-ui,sans-serif;color:${BONE};-webkit-font-smoothing:antialiased}
.serif{font-family:"Fraunces",Georgia,serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.eyebrow{font-weight:700;text-transform:uppercase;color:${GOLDSOFT};text-shadow:0 1px 8px rgba(0,0,0,.7)}
</style></head><body>
<div class="stage">
  <div style="position:absolute;inset:0;background:url('${cfg.img}') center/cover no-repeat"></div>
  <!-- top scrim -->
  <div style="position:absolute;left:0;right:0;top:0;height:32%;background:linear-gradient(180deg,rgba(8,8,9,.80),rgba(8,8,9,.30) 45%,transparent)"></div>
  <!-- bottom scrim -->
  <div style="position:absolute;left:0;right:0;bottom:0;height:62%;background:linear-gradient(0deg,rgba(8,8,9,.95) 0%,rgba(8,8,9,.88) 18%,rgba(8,8,9,.55) 45%,transparent)"></div>
  <!-- gold inset frame -->
  <div style="position:absolute;inset:22px;border:2px solid rgba(201,168,106,.34);border-radius:10px;pointer-events:none"></div>

  <!-- top: logo lockup -->
  <div style="position:absolute;top:50px;left:60px;display:flex;align-items:center;gap:20px">
    ${badge(84)}${wordmark(46)}
  </div>
  <div style="position:absolute;top:70px;right:64px;font-size:22px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${GOLDSOFT};text-shadow:0 1px 8px rgba(0,0,0,.7)">Los Angeles · OC</div>

  <!-- bottom content -->
  <div style="position:absolute;left:62px;right:62px;bottom:64px">
    <div class="eyebrow" style="font-size:25px;letter-spacing:.30em;margin-bottom:18px">${cfg.eyebrow}</div>
    <div class="serif" style="font-size:${cfg.h1Px}px;line-height:.99;font-weight:600;letter-spacing:-.015em;color:${BONE};text-shadow:0 3px 22px rgba(0,0,0,.6)">${cfg.h1}</div>
    <div style="height:2px;width:120px;background:linear-gradient(90deg,${GOLD},rgba(201,168,106,0));margin:26px 0 22px"></div>
    <div style="font-size:30px;line-height:1.32;color:${BONE};font-weight:500;max-width:780px;text-shadow:0 2px 14px rgba(0,0,0,.75)">${cfg.sub}</div>
    <div style="display:flex;align-items:center;gap:26px;margin-top:34px;flex-wrap:wrap">
      <span style="display:inline-flex;align-items:center;background:${GOLD};color:#15110a;font-weight:800;font-size:29px;letter-spacing:.01em;padding:17px 34px;border-radius:999px;box-shadow:0 8px 26px rgba(0,0,0,.4)">${cfg.cta}</span>
      <span style="font-size:30px;font-weight:700;color:${BONE};text-shadow:0 1px 10px rgba(0,0,0,.8)">${cfg.phone}</span>
    </div>
    <div style="margin-top:26px;font-size:22px;font-weight:600;letter-spacing:.05em;color:${MUTE};text-shadow:0 1px 8px rgba(0,0,0,.8)">
      ${cfg.site}<span style="color:rgba(201,168,106,.7);margin:0 12px">&#9670;</span>Licensed &amp; insured<span style="color:rgba(201,168,106,.7);margin:0 12px">&#9670;</span>24/7
    </div>
  </div>
</div></body></html>`;

const IMG1 = await dataImg('C:/Users/reyna/Downloads/Stadium_Arrival_VIP_Experience_Create_202606101205.jpeg');
const IMG2 = await dataImg('C:/Users/reyna/Downloads/Luxury_World_Cup_Airport_Transfer_202606101205.jpeg');

const JOBS = [
  {
    name: 'post-worldcup-stadium', img: IMG1,
    eyebrow: 'Match day &middot; Los Angeles 2026', h1Px: 80,
    h1: 'Get to every<br>game in style.',
    sub: 'Skip the traffic and parking chaos &mdash; your private black SUV drops you right at the gate.',
    cta: 'Reserve your ride', phone: '(805) 285-1570', site: 'rideyeah.com',
  },
  {
    name: 'post-worldcup-arrival', img: IMG2,
    eyebrow: 'Summer 2026 &middot; Los Angeles', h1Px: 80,
    h1: 'Travel like<br>the home team.',
    sub: 'Door-to-door chauffeur service for fans, families &amp; VIPs &mdash; LAX, hotels and stadiums.',
    cta: 'Reserve your ride', phone: '(805) 285-1570', site: 'rideyeah.com',
  },
];

for (const j of JOBS) {
  const htmlPath = path.join(OUT_HTML, `_${j.name}.html`);
  const pngPath = path.join(OUT_HTML, `_${j.name}.png`);
  await writeFile(htmlPath, tpl(j));
  spawnSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=2', `--window-size=${W},${W}`,
    '--virtual-time-budget=4000', `--screenshot=${pngPath}`, pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' });
  const outPng = path.join(ROOT, 'social', `${j.name}.png`);
  const outJpg = `C:/Users/reyna/Downloads/RideYeah_${j.name.replace('post-worldcup-', 'WorldCup_')}.jpg`;
  await sharp(pngPath).resize(W, W).png().toFile(outPng);
  await sharp(pngPath).resize(W, W).jpeg({ quality: 92 }).toFile(outJpg);
  const m = await sharp(outPng).metadata();
  console.log('WROTE', j.name, m.width + 'x' + m.height, '->', outJpg);
}
