// Renders transparent-PNG brand overlay assets for compositing onto the new
// RideYeah photos/videos: logo lockup (top-left), url tag (bottom-right images),
// and a brand chip (bottom-right videos — covers the Gemini ✦ watermark).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT_HTML = path.join(HERE, 'out');
const OUT = path.join(HERE, '..', 'overlay');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await mkdir(OUT_HTML, { recursive: true });
await mkdir(OUT, { recursive: true });

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

const badge = (s) => `
<svg viewBox="0 0 100 100" fill="none" width="${s}" height="${s}">
  <rect x="5" y="5" width="90" height="90" rx="25" fill="#0a0a0b"/>
  <rect x="6.25" y="6.25" width="87.5" height="87.5" rx="23.75" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".7"/>
  <rect x="18" y="18" width="64" height="64" rx="14" fill="${GOLD}"/>
  <path d="M 37 68 V 50 H 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 L 63 68" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const wordmark = (fontPx, color = BONE) => `
<span class="wm" style="font-size:${fontPx}px;color:${color}">
<svg viewBox="0 0 24 24" fill="none" style="height:${fontPx * 0.92}px;width:${fontPx * 0.7}px;margin-right:.04em">
  <path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg><span>ideYeah</span></span>`;

const base = (W, H, inner) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:transparent}
.stage{width:${W}px;height:${H}px;display:flex;align-items:center;justify-content:center;font-family:"Manrope",system-ui,sans-serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.shadow{filter:drop-shadow(0 2px 10px rgba(0,0,0,.7)) drop-shadow(0 1px 2px rgba(0,0,0,.6))}
</style></head><body><div class="stage">${inner}</div></body></html>`;

// A) logo lockup (top-left) — bone, soft shadow, transparent
const logoHtml = base(1040, 250, `
  <div class="shadow" style="display:flex;align-items:center;gap:26px">
    ${badge(150)}${wordmark(96)}
  </div>`);

// B) url tag (bottom-right on images) — bone, soft shadow, transparent
const urlHtml = base(720, 130, `
  <div class="shadow" style="font-size:60px;font-weight:800;letter-spacing:.02em;color:${BONE}">rideyeah<span style="color:${GOLDSOFT}">.com</span></div>`);

// C) brand chip (bottom-right on videos) — covers the ✦ watermark
const chipHtml = base(760, 540, `
  <div style="background:rgba(10,10,11,.90);border:2px solid rgba(201,168,106,.55);border-radius:42px;padding:46px 54px;display:flex;flex-direction:column;align-items:center;gap:22px;box-shadow:0 8px 30px rgba(0,0,0,.45)">
    <div style="display:flex;align-items:center;gap:22px">${badge(118)}${wordmark(78)}</div>
    <div style="width:78%;height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent)"></div>
    <div style="font-size:46px;font-weight:800;letter-spacing:.02em;color:${BONE}">rideyeah<span style="color:${GOLDSOFT}">.com</span></div>
  </div>`);

const jobs = [
  ['brand-logo', 1040, 250, logoHtml],
  ['brand-url', 720, 130, urlHtml],
  ['brand-chip', 760, 540, chipHtml],
];
for (const [name, W, H, html] of jobs) {
  const htmlPath = path.join(OUT_HTML, `_${name}.html`);
  const pngPath = path.join(OUT, `${name}.png`);
  await writeFile(htmlPath, html);
  spawnSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=2', `--window-size=${W},${H}`,
    '--default-background-color=00000000',
    '--virtual-time-budget=3000', `--screenshot=${pngPath}`, pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' });
  const m = await sharp(pngPath).metadata();
  console.log('WROTE', pngPath, `${m.width}x${m.height} alpha=${m.hasAlpha}`);
}
