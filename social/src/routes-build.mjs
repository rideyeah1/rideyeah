// RideYeah "Routes" social series — 9 published LAX routes, bidirectional (⇄).
// For each route: a 1:1 feed post (1080×1080) + a 9:16 story (1080×1920),
// plus an English caption + hashtags. Cohesive brand template, real logo & fonts.
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

// output folders (repo + Downloads)
const REPO_DIR = path.join(ROOT, 'social', 'routes');
const DL_DIR = 'C:/Users/reyna/Downloads/RideYeah_Routes';
for (const base of [REPO_DIR, DL_DIR]) {
  for (const sub of ['feed', 'story', 'captions']) await mkdir(path.join(base, sub), { recursive: true });
}

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

// two-way (round-trip) arrow: top arrow → , bottom arrow ←
const twoWay = (w) => `
<svg viewBox="0 0 88 40" width="${w}" height="${w * 40 / 88}" fill="none" style="flex:none">
  <path d="M6 14 H78 M68 7 L80 14 L68 21" stroke="${GOLD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M82 30 H10 M20 23 L8 30 L20 37" stroke="${GOLD}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
</svg>`;

// 3 brand backgrounds (all black Suburban → cohesive) for visual variety across the grid.
const BG = {
  hero:    { img: await dataImg(path.join(ROOT, 'images', 'hero_suburban.jpg')),  feed: 'center 42%', story: 'center 46%' },
  airport: { img: await dataImg(path.join(ROOT, 'images', 'airport_pickup.jpg')), feed: '50% 45%',     story: '50% 48%' },
  fleet:   { img: await dataImg(path.join(ROOT, 'images', 'fleet_suburban.jpg')), feed: 'center 46%',  story: 'center 44%' },
};

const ROUTES = [
  { slug: 'downtown-la', dest: 'Downtown LA', fare: 150, time: '25 min', miles: '18 mi', bg: 'hero' },
  { slug: 'long-beach', dest: 'Long Beach', fare: 200, time: '30 min', miles: '22 mi', bg: 'hero' },
  { slug: 'pasadena', dest: 'Pasadena', fare: 200, time: '40 min', miles: '28 mi', bg: 'hero' },
  { slug: 'calabasas', dest: 'Calabasas', fare: 200, time: '40 min', miles: '30 mi', bg: 'airport' },
  { slug: 'anaheim', dest: 'Anaheim', fare: 250, time: '40 min', miles: '35 mi', bg: 'airport' },
  { slug: 'simi-valley', dest: 'Simi Valley', fare: 250, time: '55 min', miles: '45 mi', bg: 'airport' },
  { slug: 'thousand-oaks', dest: 'Thousand Oaks', fare: 250, time: '55 min', miles: '45 mi', bg: 'fleet' },
  { slug: 'camarillo', dest: 'Camarillo', fare: 300, time: '1 hr 5 min', miles: '55 mi', bg: 'fleet' },
  { slug: 'santa-barbara', dest: 'Santa Barbara', fare: 400, time: '1 hr 50 min', miles: '95 mi', bg: 'fleet' },
];

// destination font size by length (keeps long names on one line)
const destSize = (dest, big) => {
  const n = dest.length;
  if (n >= 13) return Math.round(big * 0.74);
  if (n >= 11) return Math.round(big * 0.85);
  return big;
};

const tpl = (r, isStory) => {
  const W = 1080, H = isStory ? 1920 : 1080;
  const big = isStory ? 112 : 96;
  const dPx = destSize(r.dest, big);
  const pad = isStory ? 78 : 64;
  const logoTop = isStory
    ? `<div style="position:absolute;top:120px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:20px">${badge(80)}${wordmark(44)}</div>`
    : `<div style="position:absolute;top:50px;left:60px;display:flex;align-items:center;gap:18px">${badge(78)}${wordmark(42)}</div>
       <div style="position:absolute;top:66px;right:60px;font-size:21px;font-weight:700;letter-spacing:.20em;text-transform:uppercase;color:${GOLDSOFT};text-shadow:0 1px 8px rgba(0,0,0,.7)">Fixed fare</div>`;
  const block = isStory ? 'bottom:300px' : 'bottom:60px';
  const eyebrowPx = isStory ? 27 : 24;
  const lax = isStory ? 52 : 46;
  const farePx = isStory ? 76 : 66;
  const metaPx = isStory ? 30 : 27;
  const ctaPx = isStory ? 31 : 28;
  const bg = BG[r.bg] || BG.hero;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${INK}}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:"Manrope",system-ui,sans-serif;color:${BONE};-webkit-font-smoothing:antialiased}
.serif{font-family:"Fraunces",Georgia,serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.eyebrow{font-weight:700;text-transform:uppercase;color:${GOLDSOFT};text-shadow:0 1px 8px rgba(0,0,0,.7)}
</style></head><body>
<div class="stage">
  <div style="position:absolute;inset:0;background:url('${bg.img}') ${isStory ? bg.story : bg.feed} / cover no-repeat"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:${isStory ? 26 : 30}%;background:linear-gradient(180deg,rgba(8,8,9,.82),rgba(8,8,9,.25) 55%,transparent)"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:${isStory ? 60 : 66}%;background:linear-gradient(0deg,rgba(8,8,9,.96) 0%,rgba(8,8,9,.9) 20%,rgba(8,8,9,.55) 50%,transparent)"></div>
  <div style="position:absolute;inset:22px;border:2px solid rgba(201,168,106,.32);border-radius:12px;pointer-events:none"></div>

  ${logoTop}

  <div style="position:absolute;left:${pad}px;right:${pad}px;${block}">
    <div class="eyebrow" style="font-size:${eyebrowPx}px;letter-spacing:.28em;margin-bottom:16px">Private Airport Transfer</div>
    <div style="display:flex;align-items:center;gap:22px">
      <span class="serif" style="font-size:${lax}px;font-weight:600;color:${GOLDSOFT}">LAX</span>
      ${twoWay(isStory ? 96 : 84)}
    </div>
    <div class="serif" style="font-size:${dPx}px;line-height:.98;font-weight:600;letter-spacing:-.015em;color:${BONE};text-shadow:0 3px 22px rgba(0,0,0,.6);margin-top:4px">${r.dest}</div>

    <div style="display:flex;align-items:baseline;gap:18px;margin-top:${isStory ? 30 : 24}px;flex-wrap:wrap">
      <span style="font-size:${farePx}px;font-weight:800;color:${GOLD};letter-spacing:-.01em;text-shadow:0 2px 14px rgba(0,0,0,.5)">from $${r.fare}</span>
      <span style="font-size:${metaPx - 2}px;color:${MUTE};font-weight:600">all-in &middot; door to door</span>
    </div>
    <div style="font-size:${metaPx}px;line-height:1.35;color:${BONE};font-weight:500;margin-top:12px;text-shadow:0 2px 12px rgba(0,0,0,.7)">
      &asymp; ${r.time} &middot; ${r.miles} &middot; to &amp; from the airport
    </div>

    <div style="height:2px;width:120px;background:linear-gradient(90deg,${GOLD},rgba(201,168,106,0));margin:${isStory ? 30 : 24}px 0 ${isStory ? 26 : 22}px"></div>

    <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
      <span style="display:inline-flex;align-items:center;background:${GOLD};color:#15110a;font-weight:800;font-size:${ctaPx}px;padding:${isStory ? 18 : 16}px ${isStory ? 36 : 32}px;border-radius:999px;box-shadow:0 8px 26px rgba(0,0,0,.4)">Book at rideyeah.com</span>
      <span style="font-size:${ctaPx}px;font-weight:700;color:${BONE};text-shadow:0 1px 10px rgba(0,0,0,.8)">(805) 285-1570</span>
    </div>
    <div style="margin-top:${isStory ? 24 : 18}px;font-size:${isStory ? 22 : 21}px;font-weight:600;letter-spacing:.04em;color:${MUTE};text-shadow:0 1px 8px rgba(0,0,0,.8)">
      Licensed &amp; insured <span style="color:rgba(201,168,106,.7);margin:0 10px">&#9670;</span> Flight tracking <span style="color:rgba(201,168,106,.7);margin:0 10px">&#9670;</span> 24/7
    </div>
  </div>
</div></body></html>`;
};

// ---- captions (English) ----
const flavor = {
  'downtown-la': 'Skyline views, the Convention Center, Crypto.com Arena or a DTLA boardroom',
  'long-beach': 'The cruise terminal, the Convention Center, the Queen Mary or the waterfront',
  'pasadena': 'The Rose Bowl, Old Town or a quiet stay under the San Gabriel mountains',
  'calabasas': 'The Commons, the hills and the gateway to Malibu',
  'anaheim': 'Disneyland, the Convention Center, Angel Stadium and Honda Center',
  'simi-valley': 'The Reagan Library and the heart of Ventura County',
  'thousand-oaks': 'The Conejo Valley, corporate campuses and wine-country escapes',
  'camarillo': 'The Premium Outlets and the Ventura County coast',
  'santa-barbara': "The American Riviera — wine country, State Street and the coast",
};
const caption = (r) => {
  const url = `https://rideyeah.com/lax-to-${r.slug}`;
  return `LAX ⇄ ${r.dest} — done right. 🖤

${flavor[r.slug]} — we’ll get you there (or back to your flight) in a private black SUV. One flat, all-in fare. No surge pricing, no surprises.

✦ Fixed fare from $${r.fare} — all-in, door to door
✦ To OR from LAX — one-way or round-trip
✦ ≈ ${r.time} · ${r.miles}
✦ Live flight tracking + meet-and-greet
✦ Professional chauffeur · licensed & insured · 24/7

Book in seconds 👉 ${url}
Or call/text (805) 285-1570`;
};
const TAGS = {
  'downtown-la': '#DowntownLA #DTLA',
  'long-beach': '#LongBeach #LBC',
  'pasadena': '#Pasadena #RoseBowl',
  'calabasas': '#Calabasas #Malibu',
  'anaheim': '#Anaheim #Disneyland #OrangeCounty',
  'simi-valley': '#SimiValley #VenturaCounty',
  'thousand-oaks': '#ThousandOaks #ConejoValley',
  'camarillo': '#Camarillo #VenturaCounty',
  'santa-barbara': '#SantaBarbara #Montecito #WineCountry',
};
const coreTags = '#RideYeah #LAX #LAXairport #AirportTransfer #BlackCarService #LuxurySUV #PrivateCarService #Chauffeur #LosAngeles #LATravel #AirportPickup #TravelInStyle #FlightTracking #VIPtransfer';
const hashtags = (r) => `${TAGS[r.slug]} ${coreTags}`;

// ---- render + write ----
for (let i = 0; i < ROUTES.length; i++) {
  const r = ROUTES[i];
  const num = String(i + 1).padStart(2, '0');
  for (const fmt of [{ k: 'feed', story: false, w: 1080, h: 1080 }, { k: 'story', story: true, w: 1080, h: 1920 }]) {
    const html = tpl(r, fmt.story);
    const hp = path.join(OUT_HTML, `_route_${r.slug}_${fmt.k}.html`);
    const pp = path.join(OUT_HTML, `_route_${r.slug}_${fmt.k}.png`);
    await writeFile(hp, html);
    spawnSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=2', `--window-size=${fmt.w},${fmt.h}`,
      '--virtual-time-budget=4000', `--screenshot=${pp}`, pathToFileURL(hp).href,
    ], { stdio: 'ignore' });
    const fname = `${num}_LAX-${r.slug}_${fmt.k}.png`;
    for (const base of [REPO_DIR, DL_DIR]) {
      await sharp(pp).resize(fmt.w, fmt.h).png().toFile(path.join(base, fmt.k, fname));
    }
  }
  // caption file
  const capTxt = `${caption(r)}\n\n— — — — — — — — — —\n${hashtags(r)}\n`;
  const cfname = `${num}_LAX-${r.slug}.txt`;
  for (const base of [REPO_DIR, DL_DIR]) await writeFile(path.join(base, 'captions', cfname), capTxt, 'utf8');
  console.log('OK', num, 'LAX ⇄', r.dest);
}
console.log('\nDONE → social/routes/  +  Downloads/RideYeah_Routes/');
