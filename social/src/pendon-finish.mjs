// Finish the NB2 pendón: replace the AI logo with the REAL brand logo
// (favicon badge + Fraunces wordmark) and drop in a REAL scannable QR → rideyeah.com.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import QRCode from 'qrcode';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const OUT_HTML = path.join(HERE, 'out');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await mkdir(OUT_HTML, { recursive: true });

const BASE = 'C:/Users/reyna/Downloads/Keep_this_exact_image_identical_202606091554.jpeg';
const QR_URL = 'https://rideyeah.com';

const INK = '#0a0a0b', BONE = '#f7f6f3', GOLD = '#c9a86a';

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

// favicon badge (real monogram), no glow for a crisp composite
const badge = (s) => `
<svg viewBox="0 0 100 100" fill="none" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="90" height="90" rx="25" fill="#0a0a0b"/>
  <rect x="6.25" y="6.25" width="87.5" height="87.5" rx="23.75" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".6"/>
  <rect x="18" y="18" width="64" height="64" rx="14" fill="${GOLD}"/>
  <path d="M 37 68 V 50 H 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 L 63 68" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const wordmark = (fontPx) => `
<span class="wm" style="font-size:${fontPx}px;color:${BONE};">
<svg viewBox="0 0 24 24" fill="none" style="height:${fontPx * 0.92}px;width:${fontPx * 0.7}px;margin-right:.04em">
  <path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg><span>ideYeah</span></span>`;

// ---- render the logo lockup on transparent bg via Chrome ----
const BADGE = 300, WM = 300, GAP = 70;
const lockHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:transparent}
.row{display:inline-flex;align-items:center;gap:${GAP}px;padding:40px;font-family:"Manrope",sans-serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.wm svg{display:inline-block}
</style></head><body>
<div class="row">${badge(BADGE)}${wordmark(WM)}</div>
</body></html>`;
const lockHtmlPath = path.join(OUT_HTML, '_lockup.html');
const lockPngPath = path.join(OUT_HTML, '_lockup.png');
await writeFile(lockHtmlPath, lockHtml);
const r = spawnSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=2', '--default-background-color=00000000',
  '--window-size=2200,700', '--virtual-time-budget=3000',
  `--screenshot=${lockPngPath}`, pathToFileURL(lockHtmlPath).href,
], { stdio: 'ignore' });
if (!r.status === 0) console.log('chrome status', r.status);

// trim transparent margins → tight lockup
const lockTrim = await sharp(lockPngPath).trim().toBuffer({ resolveWithObject: true });
console.log('lockup trimmed', lockTrim.info.width + 'x' + lockTrim.info.height);

// ---- generate the REAL QR ----
const QR_PX = 169;
const qrBuf = await QRCode.toBuffer(QR_URL, {
  errorCorrectionLevel: 'Q', type: 'png', margin: 2, width: QR_PX * 3,
  color: { dark: '#0a0a0bff', light: '#ffffffff' },
});
// round the outer corners to match the placeholder box
const qrRounded = await sharp(qrBuf)
  .resize(QR_PX, QR_PX)
  .composite([{ input: Buffer.from(`<svg width="${QR_PX}" height="${QR_PX}"><rect x="0" y="0" width="${QR_PX}" height="${QR_PX}" rx="18" ry="18" fill="#fff"/></svg>`), blend: 'dest-in' }])
  .png().toBuffer();

// ---- composite onto the base ----
const meta = await sharp(BASE).metadata();
const W = meta.width, H = meta.height;

// 1) wipe the full top bar (flat ink rect) to remove the AI logo (bar is ~372px; photo starts ~376)
const BAR_H = 370;
const inkBar = await sharp({ create: { width: W, height: BAR_H, channels: 3, background: { r: 10, g: 12, b: 11 } } }).png().toBuffer();

// 2) scale real lockup to match the original (~120 tall, centered at cy196)
const LOCK_H = 122;
const CY = 196;
const lockScaled = await sharp(lockTrim.data).resize({ height: LOCK_H }).png().toBuffer();
const lockMeta = await sharp(lockScaled).metadata();
const lockX = Math.round((W - lockMeta.width) / 2);
const lockY = Math.round(CY - LOCK_H / 2);

// 3) QR position (detected placeholder box)
const QR_X = 1257, QR_Y = 2483;

const outPng = path.join(ROOT, 'social', 'pendon-rideyeah-final.png');
const outJpg = 'C:/Users/reyna/Downloads/RideYeah_Pendon_FINAL.jpg';

const composited = await sharp(BASE)
  .composite([
    { input: inkBar, top: 0, left: 0 },
    { input: lockScaled, top: lockY, left: lockX },
    { input: qrRounded, top: QR_Y, left: QR_X },
  ])
  .toBuffer();

await sharp(composited).png().toFile(outPng);
await sharp(composited).jpeg({ quality: 95 }).toFile(outJpg);

const fm = await sharp(outPng).metadata();
console.log('WROTE', outPng, fm.width + 'x' + fm.height);
console.log('WROTE', outJpg);
console.log('logo @', lockX + ',' + lockY, lockMeta.width + 'x' + lockMeta.height, '| QR @', QR_X + ',' + QR_Y, QR_PX);
