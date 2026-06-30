// Office roll-up banner (pendón) for RideYeah — for Google Business Profile
// verification video. REAL logo + services + service area (work zones) + real QR.
// Vertical 85×200cm roll-up ratio (0.425). Rendered with brand fonts via Chrome.
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

const INK = '#0a0a0b', BONE = '#f7f6f3', GOLD = '#c9a86a', GOLDSOFT = '#d9c193', MUTE = '#a9a7a0';
const QR_URL = 'https://rideyeah.com';

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

// ---- real QR → rideyeah.com ----
const QR_PX = 300;
const qrBuf = await QRCode.toBuffer(QR_URL, {
  errorCorrectionLevel: 'Q', type: 'png', margin: 2, width: QR_PX * 3,
  color: { dark: '#0a0a0bff', light: '#ffffffff' },
});
const qrRounded = await sharp(qrBuf)
  .resize(QR_PX, QR_PX)
  .composite([{ input: Buffer.from(`<svg width="${QR_PX}" height="${QR_PX}"><rect width="${QR_PX}" height="${QR_PX}" rx="26" ry="26" fill="#fff"/></svg>`), blend: 'dest-in' }])
  .png().toBuffer();
const qrDataUri = `data:image/png;base64,${qrRounded.toString('base64')}`;

const HERO = await dataImg(path.join(ROOT, 'images', 'hero_suburban.jpg'));

const W = 1200, H = 2824; // 85×200 cm roll-up ratio
const sep = `<span style="color:rgba(201,168,106,.55);margin:0 16px">&#9670;</span>`;

const services = [
  ['Airport Transfers', 'LAX &middot; SNA &middot; BUR &middot; LGB &middot; flight tracking'],
  ['Black-Car Service', 'Point-to-point, on demand'],
  ['Hourly &amp; As-Directed', 'Chauffeur by the hour'],
  ['Corporate Travel', 'Executive &amp; roadshow accounts'],
  ['City-to-City Routes', 'Fixed, all-inclusive fares'],
  ['Events &amp; Group Travel', 'Weddings, nights out, VIP'],
];
const zones = ['Beverly Hills', 'Santa Monica', 'Malibu', 'West Hollywood', 'Pasadena', 'Long Beach', 'Newport Beach', 'Anaheim', 'Irvine', 'Disneyland'];

const serviceRow = ([t, d]) => `
  <div style="display:flex;align-items:flex-start;gap:22px;padding:22px 0;border-bottom:1px solid rgba(201,168,106,.16)">
    <svg viewBox="0 0 24 24" width="34" height="34" style="flex:none;margin-top:2px"><circle cx="12" cy="12" r="11" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity=".7"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="${GOLD}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div>
      <div style="font-size:38px;font-weight:700;color:${BONE};letter-spacing:.005em;line-height:1.1">${t}</div>
      <div style="font-size:26px;color:${MUTE};font-weight:500;margin-top:6px">${d}</div>
    </div>
  </div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${INK}}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:"Manrope",system-ui,sans-serif;color:${BONE};-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}
.serif{font-family:"Fraunces",Georgia,serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.eyebrow{font-weight:700;text-transform:uppercase;color:${GOLDSOFT};letter-spacing:.34em}
.pad{padding-left:90px;padding-right:90px}
</style></head><body>
<div class="stage">

  <!-- ===== HEADER ===== -->
  <div class="pad" style="padding-top:80px;padding-bottom:46px;text-align:center">
    <div style="display:flex;align-items:center;justify-content:center;gap:26px">
      ${badge(118)}${wordmark(70)}
    </div>
    <div style="margin:34px auto 0;width:120px;height:2px;background:linear-gradient(90deg,transparent,${GOLD},transparent)"></div>
    <div class="eyebrow" style="font-size:25px;margin-top:30px">Luxury Black-SUV Chauffeur Service</div>
  </div>

  <!-- ===== HERO PHOTO ===== -->
  <div style="position:relative;width:100%;height:760px;flex:none">
    <div style="position:absolute;inset:0;background:url('${HERO}') center 42% / cover no-repeat"></div>
    <div style="position:absolute;left:0;right:0;top:0;height:30%;background:linear-gradient(180deg,${INK},transparent)"></div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:48%;background:linear-gradient(0deg,${INK} 4%,rgba(10,10,11,.5) 45%,transparent)"></div>
    <div class="pad" style="position:absolute;left:0;right:0;bottom:42px">
      <div class="serif" style="font-size:60px;line-height:1.0;font-weight:600;letter-spacing:-.015em;color:${BONE};text-shadow:0 3px 22px rgba(0,0,0,.6)">Arrive in quiet luxury.</div>
    </div>
  </div>

  <!-- ===== SERVICES ===== -->
  <div class="pad" style="padding-top:50px;padding-bottom:40px">
    <div class="eyebrow" style="font-size:24px">Our Services</div>
    <div style="margin-top:20px">
      ${services.map(serviceRow).join('')}
    </div>
  </div>

  <!-- ===== SERVICE AREA (work zones) ===== -->
  <div class="pad" style="padding-top:14px;padding-bottom:36px">
    <div class="eyebrow" style="font-size:24px">Service Area</div>
    <div class="serif" style="font-size:54px;font-weight:600;letter-spacing:-.01em;margin-top:14px;color:${BONE}">Los Angeles &amp; Orange County</div>
    <div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:14px 14px">
      ${zones.map((z) => `<span style="display:inline-block;border:1px solid rgba(201,168,106,.32);border-radius:999px;padding:11px 22px;font-size:25px;font-weight:600;color:${BONE};background:rgba(201,168,106,.05)">${z}</span>`).join('')}
    </div>
  </div>

  <!-- ===== FOOTER ===== -->
  <div style="margin-top:auto">
    <div class="pad" style="background:linear-gradient(180deg,transparent,rgba(201,168,106,.06));border-top:1px solid rgba(201,168,106,.22);padding-top:44px;padding-bottom:64px;display:flex;align-items:center;gap:40px">
      <img src="${qrDataUri}" width="220" height="220" style="display:block;border-radius:20px;flex:none"/>
      <div style="flex:1">
        <div style="font-size:24px;font-weight:700;color:${GOLDSOFT};letter-spacing:.04em">Book your ride</div>
        <div class="serif" style="font-size:50px;font-weight:600;color:${BONE};margin-top:8px">rideyeah.com</div>
        <div style="font-size:42px;font-weight:800;color:${BONE};margin-top:14px;letter-spacing:.01em">(805) 285-1570</div>
        <div style="font-size:23px;color:${MUTE};font-weight:600;margin-top:18px">Licensed &amp; Insured ${sep} Professional Chauffeurs ${sep} 24/7</div>
      </div>
    </div>
    <div style="text-align:center;padding:18px 90px 26px;font-size:19px;color:rgba(169,167,160,.7);letter-spacing:.06em">R Y Quiroz Luxury LLC ${sep} Los Angeles, California</div>
  </div>

  <!-- gold inset frame -->
  <div style="position:absolute;inset:26px;border:1.5px solid rgba(201,168,106,.30);border-radius:8px;pointer-events:none"></div>
</div></body></html>`;

const htmlPath = path.join(OUT_HTML, '_pendon-oficina.html');
const pngPath = path.join(OUT_HTML, '_pendon-oficina.png');
await writeFile(htmlPath, html);
spawnSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=2', `--window-size=${W},${H}`,
  '--virtual-time-budget=4000', `--screenshot=${pngPath}`, pathToFileURL(htmlPath).href,
], { stdio: 'ignore' });

const outPng = path.join(ROOT, 'social', 'pendon-oficina.png');
const outJpg = 'C:/Users/reyna/Downloads/RideYeah_Pendon_Oficina.jpg';
// keep the full 2× render for print crispness (2400×5648)
await sharp(pngPath).png().toFile(outPng);
await sharp(pngPath).jpeg({ quality: 95 }).toFile(outJpg);
const m = await sharp(outPng).metadata();
console.log('WROTE', outPng, m.width + 'x' + m.height);
console.log('WROTE', outJpg);
