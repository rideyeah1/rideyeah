// RideYeah social-media asset generator.
// Renders self-contained HTML (brand fonts + photos inlined as data URIs)
// with headless Chrome at 2x, then exports exact-size PNGs via sharp.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..'); // repo root
const OUT_HTML = path.join(HERE, 'out');
const OUT_PNG = path.join(ROOT, 'social');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

await mkdir(OUT_HTML, { recursive: true });
await mkdir(OUT_PNG, { recursive: true });

// ---- brand fonts: inline woff2 as base64 data URIs, force block display ----
let fontsCss = await readFile(path.join(HERE, 'fonts.css'), 'utf8');
{
  const refs = [...new Set([...fontsCss.matchAll(/\.\/fonts\/(f\d+\.woff2)/g)].map((m) => m[1]))];
  for (const f of refs) {
    const b64 = (await readFile(path.join(HERE, 'fonts', f))).toString('base64');
    fontsCss = fontsCss.split(`./fonts/${f}`).join(`data:font/woff2;base64,${b64}`);
  }
  fontsCss = fontsCss.replace(/font-display:\s*swap/g, 'font-display:block');
}

const dataImg = async (rel) => {
  const buf = await readFile(path.join(ROOT, rel));
  const ext = path.extname(rel).slice(1).replace('jpg', 'jpeg');
  return `data:image/${ext};base64,${buf.toString('base64')}`;
};
const HERO = await dataImg('images/hero_suburban.jpg');
const CHAUFFEUR = await dataImg('images/chauffeur.jpg');
// Nano-Banana generated post backgrounds (provided by owner)
const P_AIRPORT = await dataImg(
  'images/social/Cinematic_photorealistic_luxury_advertising_photo,_202606061121.jpeg',
);
const P_ROUTES = await dataImg(
  'images/social/Cinematic_photorealistic_luxury_advertising_photo._202606061130.jpeg',
);
const P_BOOK = await dataImg(
  'images/social/Cinematic_photorealistic_luxury_lifestyle_photo_202606061128.jpeg',
);
const P_FLEET = await dataImg('images/social/crea_una_imagen_1_1_para_202606061144.jpeg');

// ---------- brand bits ----------
const INK = '#0a0a0b',
  BONE = '#f7f6f3',
  GOLD = '#c9a86a',
  GOLDSOFT = '#d9c193',
  MUTE = '#a9a7a0';

// favicon-style badge mark; `s` = pixel size
const badge = (s, glow = true) => `
<div class="badgeWrap" style="width:${s}px;height:${s}px;${
  glow ? `filter:drop-shadow(0 0 ${s * 0.14}px rgba(201,168,106,.45));` : ''
}">
<svg viewBox="0 0 100 100" fill="none" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="90" height="90" rx="25" fill="#0a0a0b"/>
  <rect x="6.25" y="6.25" width="87.5" height="87.5" rx="23.75" fill="none" stroke="${GOLD}" stroke-width="1.4" opacity=".6"/>
  <rect x="18" y="18" width="64" height="64" rx="14" fill="${GOLD}"/>
  <path d="M 37 68 V 50 H 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 L 63 68" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="#0a0a0b" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>`;

// "RideYeah" wordmark: custom R-glyph + "ideYeah"
const wordmark = (fontPx, color = BONE) => `
<span class="wm" style="font-size:${fontPx}px;color:${color};">
<svg class="rglyph" viewBox="0 0 24 24" fill="none" style="height:${fontPx * 0.92}px;width:${
  fontPx * 0.7
}px;">
  <path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg><span>ideYeah</span></span>`;

const head = (w, h) => `<!doctype html><html><head><meta charset="utf-8">
<style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:${INK}}
.stage{position:relative;width:${w}px;height:${h}px;overflow:hidden;
  font-family:"Manrope",system-ui,sans-serif;color:${BONE};-webkit-font-smoothing:antialiased}
.serif{font-family:"Fraunces",Georgia,serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.wm .rglyph{margin-right:.04em;display:inline-block}
.badgeWrap{display:flex;align-items:center;justify-content:center}
.eyebrow{font-weight:600;text-transform:uppercase;color:${GOLD}}
.rule{background:linear-gradient(90deg,${GOLD},rgba(201,168,106,0));height:2px;border-radius:2px}
</style></head><body>`;
const foot = `</body></html>`;

// ===================== TEMPLATES =====================

// ---- PROFILE (square, circle-safe) ----
const tplProfile = (w) => {
  const h = w;
  const mark = Math.round(w * 0.34);
  const wmPx = Math.round(w * 0.082);
  const eyePx = Math.round(w * 0.0235);
  return (
    head(w, h) +
    `<div class="stage" style="display:flex;align-items:center;justify-content:center">
  <div style="position:absolute;inset:0;background:
     radial-gradient(58% 50% at 50% 33%, rgba(201,168,106,.16), transparent 70%),
     radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,.65)),
     ${INK};"></div>
  <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:${Math.round(
    w * 0.05,
  )}px">
    ${badge(mark)}
    <div style="display:flex;flex-direction:column;align-items:center;gap:${Math.round(w * 0.022)}px">
      ${wordmark(wmPx)}
      <div class="rule" style="width:${Math.round(w * 0.14)}px;background:linear-gradient(90deg,rgba(201,168,106,0),${GOLD},rgba(201,168,106,0))"></div>
      <div class="eyebrow" style="font-size:${eyePx}px;letter-spacing:.46em;text-indent:.46em">Los Angeles</div>
    </div>
  </div>
</div>` +
    foot
  );
};

// ---- COVER: shared left text block (vertically centred, lifted to clear avatar) ----
const coverText = (cfg) => `
  <div style="position:relative;z-index:3;height:100%;display:flex;flex-direction:column;justify-content:center;
       padding:0 0 ${cfg.liftPB}px ${cfg.padL}px;max-width:${cfg.textMax}px">
    <div style="display:flex;align-items:center;gap:${cfg.lockGap}px;margin-bottom:${cfg.gap1}px">
      ${badge(cfg.markPx)}
      ${wordmark(cfg.wmPx)}
    </div>
    <div class="eyebrow" style="font-size:${cfg.eyePx}px;letter-spacing:.4em;margin-bottom:${cfg.gap2}px">${cfg.eyebrow}</div>
    <div class="serif" style="font-size:${cfg.h1Px}px;line-height:1.02;font-weight:600;letter-spacing:-.01em;color:${BONE}">${cfg.h1}</div>
    <div class="rule" style="width:${cfg.rule}px;margin:${cfg.gap3}px 0 ${cfg.gap3}px"></div>
    <div style="font-size:${cfg.subPx}px;color:${MUTE};font-weight:500;letter-spacing:.01em">${cfg.sub}</div>
  </div>`;

// contact line pinned bottom-RIGHT (clears the bottom-left avatar on both platforms)
const contactCorner = (cfg) => `
  <div style="position:absolute;right:${cfg.padR}px;bottom:${cfg.padB}px;z-index:4;
       display:flex;align-items:center;gap:${cfg.chipGap}px;
       font-size:${cfg.chipPx}px;font-weight:600;letter-spacing:.02em;text-shadow:0 1px 10px rgba(0,0,0,.65)">
    <span style="color:${GOLDSOFT}">${cfg.site}</span>
    <span style="color:rgba(201,168,106,.6)">•</span>
    <span style="color:${BONE}">${cfg.phone}</span>
  </div>`;

// ---- COVER (photo) ----
const tplCoverPhoto = (cfg) =>
  head(cfg.w, cfg.h) +
  `<div class="stage">
  <div style="position:absolute;inset:0;background:#000 url('${HERO}') ${cfg.imgPos}/cover no-repeat"></div>
  <div style="position:absolute;inset:0;background:
     linear-gradient(90deg, ${INK} ${cfg.scrim1}%, rgba(10,10,11,.86) ${cfg.scrim2}%, rgba(10,10,11,.30) ${cfg.scrim3}%, rgba(10,10,11,.05) 100%),
     linear-gradient(0deg, rgba(10,10,11,.55), transparent 45%)"></div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 0 ${cfg.border}px rgba(201,168,106,.16)"></div>
  ${coverText(cfg)}
  ${contactCorner(cfg)}
</div>` +
  foot;

// ---- COVER (clean / no photo) ----
const tplCoverClean = (cfg) =>
  head(cfg.w, cfg.h) +
  `<div class="stage">
  <div style="position:absolute;inset:0;background:
     radial-gradient(75% 130% at 100% 0%, rgba(201,168,106,.16), transparent 58%),
     radial-gradient(60% 120% at 92% 100%, rgba(201,168,106,.10), transparent 60%),
     linear-gradient(115deg, #0c0b0a 0%, #131210 48%, #0a0a0b 100%)"></div>
  <div style="position:absolute;right:${-cfg.h * 0.18}px;top:50%;transform:translateY(-50%);opacity:.06">
    <svg viewBox="0 0 100 100" width="${cfg.h * 1.25}" height="${cfg.h * 1.25}" fill="none">
      <rect x="10" y="10" width="80" height="80" rx="20" fill="none" stroke="${GOLD}" stroke-width="2.5"/>
      <path d="M 37 68 V 50 H 50" stroke="${GOLD}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 37 32 L 63 68" stroke="${GOLD}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="${GOLD}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 0 ${cfg.border}px rgba(201,168,106,.22)"></div>
  ${coverText(cfg)}
  ${contactCorner(cfg)}
</div>` +
  foot;

// ---- COMPANY LOGO (square, badge mark on ink) ----
const tplCompanyLogo = (w) =>
  head(w, w) +
  `<div class="stage" style="display:flex;align-items:center;justify-content:center">
    <div style="position:absolute;inset:0;background:
       radial-gradient(58% 58% at 50% 44%, rgba(201,168,106,.18), transparent 70%),
       radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,.55)), ${INK}"></div>
    <div style="position:relative">${badge(Math.round(w * 0.62))}</div>
  </div>` +
  foot;

// ---- STORY HIGHLIGHT ICONS (gold line icon on ink, circle-safe) ----
const ICONS = {
  plane:
    '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  car:
    '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  route:
    '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  calendar:
    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  star:
    '<path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  briefcase:
    '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
};

const tplHighlight = (cfg) => {
  const px = cfg.iconPx || 360;
  return (
    head(1080, 1080) +
    `<div class="stage" style="display:flex;align-items:center;justify-content:center">
    <div style="position:absolute;inset:0;background:
       radial-gradient(50% 50% at 50% 46%, rgba(201,168,106,.18), transparent 70%),
       radial-gradient(120% 120% at 50% 50%, transparent 50%, rgba(0,0,0,.62)), ${INK}"></div>
    <div style="position:absolute;width:${cfg.ringD || 620}px;height:${cfg.ringD || 620}px;border-radius:50%;
       border:3px solid rgba(201,168,106,.4)"></div>
    <svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${GOLD}" stroke-width="${
      cfg.sw || 1.6
    }" stroke-linecap="round" stroke-linejoin="round" style="position:relative;filter:drop-shadow(0 0 ${
      px * 0.05
    }px rgba(201,168,106,.4))">${ICONS[cfg.icon]}</svg>
  </div>` +
    foot
  );
};

// ---- AD / PROMO POST (full-bleed photo, editorial) ----
const tplAd = (cfg) =>
  head(cfg.w, cfg.h) +
  `<div class="stage">
  <div style="position:absolute;inset:0;background:#000 url('${cfg.img}') ${cfg.imgPos}/cover no-repeat"></div>
  <div style="position:absolute;inset:0;background:
     linear-gradient(180deg, rgba(10,10,11,.6) 0%, rgba(10,10,11,.14) 18%, rgba(10,10,11,0) 34%, rgba(10,10,11,.5) 56%, rgba(10,10,11,.93) 82%, ${INK} 100%)"></div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 0 ${cfg.frame}px rgba(201,168,106,.28)"></div>

  <!-- top bar -->
  <div style="position:absolute;top:${cfg.pad}px;left:${cfg.pad}px;right:${cfg.pad}px;z-index:3;
       display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:${cfg.lockGap}px">
      ${badge(cfg.markPx)}
      ${wordmark(cfg.wmPx)}
    </div>
    <div class="eyebrow" style="font-size:${cfg.topEyePx}px;letter-spacing:.34em;text-shadow:0 1px 8px rgba(0,0,0,.7)">Los Angeles &middot; OC</div>
  </div>

  <!-- bottom content -->
  <div style="position:absolute;left:${cfg.pad}px;right:${cfg.pad}px;bottom:${cfg.pad}px;z-index:3">
    <div class="eyebrow" style="font-size:${cfg.eyePx}px;letter-spacing:.36em;margin-bottom:${cfg.g1}px">${cfg.eyebrow}</div>
    <div class="serif" style="font-size:${cfg.h1Px}px;line-height:1.0;font-weight:600;letter-spacing:-.015em;color:${BONE};text-shadow:0 2px 24px rgba(0,0,0,.5)">${cfg.h1}</div>
    <div style="font-size:${cfg.subPx}px;color:#cfccc4;font-weight:500;line-height:1.45;margin-top:${cfg.g2}px;max-width:${cfg.subMax}px">${cfg.sub}</div>
    <div style="display:flex;align-items:center;gap:${cfg.ctaGap}px;flex-wrap:wrap;margin-top:${cfg.g3}px">
      <span style="display:inline-flex;align-items:center;gap:10px;background:${GOLD};color:${INK};
           font-weight:800;letter-spacing:.02em;font-size:${cfg.ctaPx}px;padding:${cfg.ctaPy}px ${cfg.ctaPx_}px;border-radius:${cfg.ctaR}px">
        ${cfg.cta}
        <svg viewBox="0 0 24 24" width="${cfg.ctaPx}" height="${cfg.ctaPx}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </span>
      <span style="font-size:${cfg.phonePx}px;font-weight:700;color:${BONE};letter-spacing:.01em;text-shadow:0 1px 8px rgba(0,0,0,.7)">${cfg.phone}</span>
    </div>
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:${cfg.trustGap}px;margin-top:${cfg.g4}px;font-size:${cfg.trustPx}px;
         font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${MUTE};text-shadow:0 1px 8px rgba(0,0,0,.7)">
      ${cfg.trust
        .map(
          (t, i) =>
            (i ? `<span style="color:rgba(201,168,106,.55)">&#9670;</span>` : '') +
            `<span>${t}</span>`,
        )
        .join('')}
    </div>
  </div>
</div>` +
  foot;

const adBase = (extra) => ({
  img: CHAUFFEUR,
  imgPos: '60% 28%',
  frame: 3,
  pad: 74,
  lockGap: 18,
  markPx: 60,
  wmPx: 33,
  topEyePx: 19,
  eyePx: 21,
  eyebrow: 'Real people &middot; Real care &middot; Los Angeles',
  h1Px: 96,
  h1: "You're in<br>good hands.",
  subPx: 27,
  subMax: 740,
  sub: 'A friendly, professional chauffeur greets you, handles the bags, and gets you there relaxed &mdash; every single time.',
  cta: 'Reserve your ride',
  ctaPx: 27,
  ctaPx_: 36,
  ctaPy: 19,
  ctaR: 999,
  ctaGap: 26,
  phonePx: 27,
  phone: '(805) 285-1570',
  trust: ['Trusted by LA families', 'Licensed &amp; insured', '24/7'],
  trustPx: 18,
  trustGap: 14,
  g1: 20,
  g2: 18,
  g3: 34,
  g4: 26,
  ...extra,
});

// luxury / editorial variant (hero SUV, premium tone)
const adLuxury = (extra) =>
  adBase({
    img: HERO,
    imgPos: '70% 38%',
    eyebrow: 'LAX &amp; airport transfers &middot; Los Angeles',
    h1: 'Arrive in<br>quiet luxury.',
    h1Px: 92,
    sub: 'Private chauffeured black-SUV service. Flight monitoring, fixed fares, and a professional driver &mdash; every time.',
    cta: 'Reserve at rideyeah.com',
    trust: ['Licensed &amp; insured', 'Flight monitoring', '24/7'],
    ...extra,
  });

// post-sequence builder (owner's Nano-Banana photos + RideYeah overlay)
const postBase = (extra) =>
  adBase({
    cta: 'Reserve your ride',
    trust: ['Licensed &amp; insured', 'Fixed fares', '24/7'],
    imgPos: '50% 45%',
    ...extra,
  });

// ---- REEL OVERLAY (transparent PNG to composite onto video) ----
const tplReelOverlay = (cfg) => {
  const { w, h } = cfg;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:transparent}
.stage{position:relative;width:${w}px;height:${h}px;overflow:hidden;font-family:"Manrope",system-ui,sans-serif;color:${BONE};-webkit-font-smoothing:antialiased}
.serif{font-family:"Fraunces",Georgia,serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.wm .rglyph{margin-right:.04em;display:inline-block}
.eyebrow{font-weight:600;text-transform:uppercase;color:${GOLD}}
</style></head><body><div class="stage">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(8,8,9,.74) 0%, rgba(8,8,9,.22) 12%, transparent 22%)"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(0deg, rgba(8,8,9,.94) 0%, rgba(8,8,9,.76) 22%, rgba(8,8,9,.32) 42%, transparent 58%)"></div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 0 4px rgba(201,168,106,.30)"></div>
  <div style="position:absolute;top:${cfg.pad}px;left:${cfg.pad}px;right:${cfg.pad}px;display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:18px">${badge(64)}${wordmark(36)}</div>
    <div class="eyebrow" style="font-size:20px;letter-spacing:.34em;text-shadow:0 1px 8px rgba(0,0,0,.7)">Los Angeles &middot; OC</div>
  </div>
  <div style="position:absolute;left:${cfg.pad}px;right:${cfg.pad}px;bottom:${cfg.padB}px">
    <div class="eyebrow" style="font-size:24px;letter-spacing:.36em;margin-bottom:22px">${cfg.eyebrow}</div>
    <div class="serif" style="font-size:${cfg.h1Px}px;line-height:1.0;font-weight:600;letter-spacing:-.015em;text-shadow:0 2px 24px rgba(0,0,0,.55)">${cfg.h1}</div>
    <div style="font-size:30px;color:#d8d5cd;font-weight:500;line-height:1.42;margin-top:22px;max-width:840px">${cfg.sub}</div>
    <div style="display:flex;align-items:center;gap:26px;flex-wrap:wrap;margin-top:40px">
      <span style="display:inline-flex;align-items:center;gap:12px;background:${GOLD};color:${INK};font-weight:800;letter-spacing:.02em;font-size:30px;padding:22px 40px;border-radius:999px">${cfg.cta}
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      <span style="font-size:30px;font-weight:700;color:${BONE};text-shadow:0 1px 8px rgba(0,0,0,.7)">${cfg.phone}</span>
    </div>
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:14px;margin-top:30px;font-size:20px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${MUTE};text-shadow:0 1px 8px rgba(0,0,0,.7)">
      <span>Licensed &amp; insured</span><span style="color:rgba(201,168,106,.55)">&#9670;</span><span>Fixed fares</span><span style="color:rgba(201,168,106,.55)">&#9670;</span><span>24/7</span>
    </div>
  </div>
</div></body></html>`;
};

// ---------- cover config builders ----------
const fbBase = (extra) => ({
  w: 1702,
  h: 630,
  padL: 132,
  textMax: 1040,
  markPx: 92,
  lockGap: 22,
  wmPx: 50,
  eyePx: 22,
  h1Px: 78,
  subPx: 27,
  chipPx: 25,
  chipGap: 16,
  rule: 230,
  gap1: 30,
  gap2: 26,
  gap3: 24,
  liftPB: 64,
  padR: 64,
  padB: 46,
  border: 0,
  imgPos: '76% 42%',
  scrim1: 30,
  scrim2: 50,
  scrim3: 74,
  eyebrow: 'Los Angeles &middot; Orange County',
  h1: 'Luxury Airport<br>Transfers',
  sub: 'Black-SUV chauffeur service &middot; Licensed &amp; insured &middot; Flight monitoring &middot; 24/7',
  site: 'rideyeah.com',
  phone: '(805) 285-1570',
  ...extra,
});
const liBase = (extra) => ({
  w: 1584,
  h: 396,
  padL: 96,
  textMax: 1000,
  markPx: 70,
  lockGap: 18,
  wmPx: 38,
  eyePx: 17,
  h1Px: 52,
  subPx: 20,
  chipPx: 18,
  chipGap: 13,
  rule: 170,
  gap1: 18,
  gap2: 16,
  gap3: 15,
  liftPB: 50,
  padR: 56,
  padB: 30,
  border: 0,
  imgPos: '78% 40%',
  scrim1: 34,
  scrim2: 56,
  scrim3: 80,
  eyebrow: 'Luxury Ground Transportation',
  h1: 'Effortless travel, elevated.',
  sub: 'LAX transfers &amp; executive black-SUV service across Southern California',
  site: 'rideyeah.com',
  phone: '(805) 285-1570',
  ...extra,
});

// LinkedIn Company Page cover (very wide, short)
const liCompanyBase = (extra) =>
  liBase({
    w: 2256,
    h: 382,
    padL: 130,
    textMax: 1520,
    markPx: 88,
    lockGap: 22,
    wmPx: 48,
    eyePx: 20,
    h1Px: 64,
    h1: 'Arrive in quiet luxury.',
    subPx: 25,
    rule: 240,
    gap1: 22,
    gap2: 16,
    gap3: 16,
    liftPB: 0,
    padR: 72,
    padB: 40,
    imgPos: '72% 36%',
    eyebrow: 'Luxury ground transportation &middot; Los Angeles &amp; OC',
    sub: 'LAX airport transfers &middot; Black-SUV chauffeur service &middot; Licensed &amp; insured &middot; 24/7',
    ...extra,
  });

// ---- MOOVS BOOKING HEADER (wide banner; Moovs overlays the dark logo on the
//      left, so keep the left clean/bone for legibility; SUV + gold on the right) ----
const tplBookingHeader = (cfg) => {
  const { w, h } = cfg;
  return (
    head(w, h) +
    `<div class="stage">
    <div style="position:absolute;inset:0;background:#0a0a0b url('${HERO}') ${cfg.imgPos}/cover no-repeat"></div>
    <div style="position:absolute;inset:0;background:
       linear-gradient(90deg, ${BONE} 0%, ${BONE} ${cfg.clean1}%, rgba(247,246,243,.92) ${cfg.clean2}%,
         rgba(28,24,20,.30) 50%, rgba(10,10,11,.56) 72%, rgba(10,10,11,.74) 100%)"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(62% 135% at 90% 4%, rgba(201,168,106,.22), transparent 60%)"></div>
    <div style="position:absolute;right:${cfg.padR}px;top:50%;transform:translateY(-50%);text-align:right;z-index:3">
      <div class="eyebrow" style="font-size:${cfg.eyePx}px;letter-spacing:.34em;margin-bottom:${cfg.gap}px;text-shadow:0 1px 10px rgba(0,0,0,.6)">${cfg.eyebrow}</div>
      <div class="serif" style="font-size:${cfg.h1Px}px;font-weight:600;letter-spacing:-.01em;color:${BONE};line-height:1;text-shadow:0 2px 18px rgba(0,0,0,.55)">${cfg.h1}</div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:${cfg.line}px;background:
       linear-gradient(90deg, rgba(201,168,106,0) 0%, rgba(201,168,106,0) 28%, rgba(201,168,106,.45) 55%, ${GOLD} 80%, ${GOLDSOFT} 100%)"></div>
  </div>` +
    foot
  );
};

// ---- LOGO LOCKUP (transparent PNG: badge + wordmark, for overlay on the
//      booking header's light-left zone, and for standalone use on light bg) ----
const tplLogoLockup = (cfg) => {
  const { w, h } = cfg;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:transparent}
.stage{position:relative;width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;gap:${cfg.gap}px;
  font-family:"Manrope",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.wm .rglyph{margin-right:.04em;display:inline-block}
.badgeWrap{display:flex;align-items:center;justify-content:center}
</style></head><body><div class="stage">
  ${badge(cfg.markPx, cfg.glow)}
  ${wordmark(cfg.wmPx, cfg.wmColor)}
</div></body></html>`;
};

// ===================== RENDER =====================
const TARGETS = [
  // Moovs booking-modal header banner (logo overlaid left)
  {
    name: 'moovs-booking-header',
    html: tplBookingHeader({
      w: 1400,
      h: 200,
      imgPos: '72% 40%',
      clean1: 26,
      clean2: 34,
      padR: 60,
      eyePx: 15,
      gap: 9,
      h1Px: 26,
      line: 3,
      eyebrow: 'Luxury chauffeur service',
      h1: 'Los Angeles &middot; Orange County',
    }),
    w: 1400,
    h: 200,
  },
  // Transparent logo lockup for the Moovs header (dark wordmark for light bg)
  {
    name: 'moovs-logo-lockup',
    html: tplLogoLockup({ w: 500, h: 200, gap: 24, markPx: 104, wmPx: 44, wmColor: INK, glow: false }),
    w: 500,
    h: 200,
  },
  // Same lockup with bone wordmark, for placing on a dark background
  {
    name: 'moovs-logo-lockup-light',
    html: tplLogoLockup({ w: 500, h: 200, gap: 24, markPx: 104, wmPx: 44, wmColor: BONE, glow: false }),
    w: 500,
    h: 200,
  },
  { name: 'facebook-profile', html: tplProfile(1080), w: 1080, h: 1080 },
  { name: 'instagram-profile', html: tplProfile(1080), w: 1080, h: 1080 },
  { name: 'linkedin-profile', html: tplProfile(1080), w: 1080, h: 1080 },
  { name: 'facebook-cover-photo', html: tplCoverPhoto(fbBase()), w: 1702, h: 630 },
  { name: 'facebook-cover-clean', html: tplCoverClean(fbBase()), w: 1702, h: 630 },
  { name: 'linkedin-banner-photo', html: tplCoverPhoto(liBase()), w: 1584, h: 396 },
  { name: 'linkedin-banner-clean', html: tplCoverClean(liBase()), w: 1584, h: 396 },
  // promo post for IG / FB / LinkedIn feed
  { name: 'ad-square', html: tplAd(adBase({ w: 1080, h: 1080 })), w: 1080, h: 1080 },
  {
    name: 'ad-portrait',
    html: tplAd(
      adBase({ w: 1080, h: 1350, imgPos: '57% 22%', h1Px: 104, pad: 80, subPx: 28, subMax: 820 }),
    ),
    w: 1080,
    h: 1350,
  },
  // post sequence (Airport / Fleet / Routes / Book) — owner photos + RideYeah overlay
  {
    name: 'post-airport',
    html: tplAd(
      postBase({
        w: 1080,
        h: 1080,
        img: P_AIRPORT,
        imgPos: '50% 38%',
        eyebrow: 'LAX &amp; airport transfers',
        h1: "We're already<br>there.",
        sub: 'Private LAX pickups with live flight monitoring &mdash; step off the plane and into the car.',
      }),
    ),
    w: 1080,
    h: 1080,
  },
  {
    name: 'post-fleet',
    html: tplAd(
      postBase({
        w: 1080,
        h: 1080,
        img: P_FLEET,
        imgPos: '50% 50%',
        eyebrow: 'The RideYeah fleet',
        h1: 'Impeccable,<br>every ride.',
        sub: 'Spotless, blacked-out luxury SUVs &mdash; quiet, climate-set, and ready before you are.',
      }),
    ),
    w: 1080,
    h: 1080,
  },
  {
    name: 'post-routes',
    html: tplAd(
      postBase({
        w: 1080,
        h: 1080,
        img: P_ROUTES,
        imgPos: '50% 60%',
        eyebrow: 'Across Los Angeles &amp; OC',
        h1: 'Wherever LA<br>takes you.',
        sub: 'LAX to Santa Barbara, Disneyland to downtown &mdash; fixed fares, no surprises.',
      }),
    ),
    w: 1080,
    h: 1080,
  },
  {
    name: 'post-book',
    html: tplAd(
      postBase({
        w: 1080,
        h: 1080,
        img: P_BOOK,
        imgPos: '50% 45%',
        eyebrow: 'Book in seconds',
        h1: 'Reserved &amp;<br>waiting.',
        sub: 'Thirty-second booking. Door-to-door calm, every single time.',
      }),
    ),
    w: 1080,
    h: 1080,
  },
  // Reel overlay (transparent) — composited onto the video by ffmpeg
  {
    name: 'reel-fleet-overlay',
    html: tplReelOverlay({
      w: 1080,
      h: 1920,
      pad: 70,
      padB: 96,
      eyebrow: 'The RideYeah fleet',
      h1: 'Impeccable,<br>every ride.',
      h1Px: 104,
      sub: 'Spotless, blacked-out luxury SUVs &mdash; quiet, climate-set, and ready before you are.',
      cta: 'Reserve your ride',
      phone: '(805) 285-1570',
    }),
    w: 1080,
    h: 1920,
  },
  {
    name: 'reel-airport-overlay',
    html: tplReelOverlay({
      w: 1080,
      h: 1920,
      pad: 70,
      padB: 96,
      eyebrow: 'LAX &amp; airport transfers',
      h1: "We're already<br>there.",
      h1Px: 104,
      sub: 'Private LAX pickups with live flight monitoring &mdash; step off the plane and into the car.',
      cta: 'Reserve your ride',
      phone: '(805) 285-1570',
    }),
    w: 1080,
    h: 1920,
  },
  // LinkedIn Company Page assets
  { name: 'linkedin-company-logo', html: tplCompanyLogo(400), w: 400, h: 400 },
  { name: 'linkedin-company-cover-photo', html: tplCoverPhoto(liCompanyBase()), w: 2256, h: 382 },
  { name: 'linkedin-company-cover-clean', html: tplCoverClean(liCompanyBase()), w: 2256, h: 382 },
  // story highlight icons (1:1, circle-cropped by IG)
  { name: 'highlight-airport', html: tplHighlight({ icon: 'plane', iconPx: 360 }), w: 1080, h: 1080 },
  { name: 'highlight-fleet', html: tplHighlight({ icon: 'car', iconPx: 380, sw: 1.5 }), w: 1080, h: 1080 },
  { name: 'highlight-routes', html: tplHighlight({ icon: 'route', iconPx: 340 }), w: 1080, h: 1080 },
  { name: 'highlight-book', html: tplHighlight({ icon: 'calendar', iconPx: 330 }), w: 1080, h: 1080 },
  // luxury/editorial promo (hero SUV) — kept alongside the warm version
  { name: 'ad-luxury-square', html: tplAd(adLuxury({ w: 1080, h: 1080 })), w: 1080, h: 1080 },
  {
    name: 'ad-luxury-portrait',
    html: tplAd(
      adLuxury({ w: 1080, h: 1350, imgPos: '68% 34%', h1Px: 100, pad: 80, subPx: 28, subMax: 820 }),
    ),
    w: 1080,
    h: 1350,
  },
];

const only = process.argv[2]; // optional substring filter
for (const t of TARGETS) {
  if (only && !t.name.includes(only)) continue;
  const htmlPath = path.join(OUT_HTML, t.name + '.html');
  const rawPng = path.join(OUT_HTML, t.name + '.raw.png');
  const finalPng = path.join(OUT_PNG, t.name + '.png');
  await writeFile(htmlPath, t.html);

  const r = spawnSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-sandbox',
      '--force-device-scale-factor=2',
      `--window-size=${t.w},${t.h}`,
      '--default-background-color=00000000',
      '--virtual-time-budget=6000',
      '--run-all-compositor-stages-before-draw',
      `--user-data-dir=${path.join(OUT_HTML, '.cud-' + t.name)}`,
      `--screenshot=${rawPng}`,
      pathToFileURL(htmlPath).href,
    ],
    { stdio: 'pipe', encoding: 'utf8' },
  );
  if (!existsSync(rawPng)) {
    console.error('FAILED', t.name, r.stderr?.slice(-400));
    continue;
  }
  await sharp(rawPng).resize(t.w, t.h, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(finalPng);
  const meta = await sharp(finalPng).metadata();
  console.log('OK', t.name, `${meta.width}x${meta.height}`, `${(meta.size / 1024).toFixed(0)}kb`);
}
console.log('done');
