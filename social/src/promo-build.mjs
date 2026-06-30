// 6 "reasons / business" promo posts for RideYeah IG + FB (feed 1080x1350, 4:5).
// On-brand statement cards: photo + eyebrow + serif headline + 3 proof bullets +
// logo/CTA. Also writes per-post captions (+ hashtags). Rendered via Chrome + sharp.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const OUT_HTML = path.join(HERE, 'out');
const OUT_DIR = path.join(ROOT, 'social', 'promo');
const DL_DIR = 'C:/Users/reyna/Downloads/RideYeah_Promo';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await mkdir(OUT_HTML, { recursive: true });
await mkdir(OUT_DIR, { recursive: true });
await mkdir(path.join(DL_DIR, 'feed'), { recursive: true });
await mkdir(path.join(DL_DIR, 'captions'), { recursive: true });

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
const dataImg = async (rel) => `data:image/jpeg;base64,${(await readFile(path.join(ROOT, 'images', rel))).toString('base64')}`;

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

const POSTS = [
  {
    slug: 'airport', img: 'airport_pickup.jpg', pos: '50% 42%',
    eyebrow: 'Airport Transfers',
    headline: 'Your airport ride,<br>handled.',
    bullets: ['Fixed, all-in fare — no surge', 'Flight tracking + meet-and-greet', 'One premium black SUV, every time'],
    caption: `From wheels-down to your door, RideYeah takes the airport out of your travel day. ✈️

One fixed, all-in fare — no surge, no surprises. We track your flight, meet you at the curb, and get you there in a spotless black SUV with a professional chauffeur.

LAX · SNA · BUR · LGB — to and from the airport.
📲 Book in under a minute at rideyeah.com`,
    tags: '#RideYeah #LAXairport #AirportTransfer #LuxuryTravel #BlackCarService #PrivateChauffeur #LosAngeles #OrangeCounty',
  },
  {
    slug: 'private', img: 'interior_leather.jpg', pos: '50% 50%',
    eyebrow: 'Private Car Service',
    headline: 'Private has its<br>privileges.',
    bullets: ['The SUV is yours — no pooling', 'Take calls & email in peace', 'Consistent, discreet, on time'],
    caption: `Rideshare roulette, or a ride that's yours alone? 🚙

With RideYeah the SUV is yours — no pooling, no strangers, no surprise stops. Take your calls, answer email, or just breathe. Same premium vehicle, same professional standard, every single time.

This is private travel, done right.
📲 rideyeah.com`,
    tags: '#RideYeah #PrivateCarService #ExecutiveTravel #LuxuryTravel #Chauffeur #TravelInStyle #LosAngeles #OrangeCounty',
  },
  {
    slug: 'business-plans', img: 'chauffeur.jpg', pos: '50% 30%',
    eyebrow: 'RideYeah for Business',
    headline: 'Corporate travel,<br>tailored.',
    bullets: ['A plan built around your team', 'One account, consolidated billing', 'Priority booking, 24/7'],
    caption: `RideYeah for Business. 💼

Whether it's one executive or a whole team, we build a corporate plan around how your company actually travels — one account, consolidated monthly billing, and priority booking around the clock.

Less expense-report headache. More on-time arrivals.
📲 Set up your account: rideyeah.com`,
    tags: '#RideYeah #CorporateTravel #BusinessTravel #ExecutiveTransport #GroundTransportation #B2B #LosAngeles #OrangeCounty',
  },
  {
    slug: 'corporate-accounts', img: 'fleet_suburban.jpg', pos: '50% 46%',
    eyebrow: 'Corporate Accounts',
    headline: 'One account.<br>One invoice.',
    bullets: ['Centralized billing & reporting', 'Traveler safety & duty of care', 'Licensed, insured, 24/7'],
    caption: `Simplify every business trip. 🧾

A RideYeah corporate account means centralized billing, clean monthly reporting, and no more chasing receipts. Your travelers ride with licensed, insured, professional chauffeurs — and you get real duty-of-care peace of mind.

24/7 across LA & Orange County.
📲 rideyeah.com`,
    tags: '#RideYeah #CorporateAccounts #BusinessTravel #DutyOfCare #ExpenseManagement #ExecutiveTravel #LosAngeles #OrangeCounty',
  },
  {
    slug: 'executive-vip', img: 'hero_suburban.jpg', pos: 'center 42%',
    eyebrow: 'Executive & VIP',
    headline: 'Make the right<br>first impression.',
    bullets: ['Airport pickups for your clients', 'Discreet, professional chauffeurs', 'Roadshows & multi-stop days'],
    caption: `The car says a lot before the meeting starts. 🤝

Greet visiting clients and executives with a spotless black SUV and a discreet, professional chauffeur. From airport pickups to multi-stop roadshow days, RideYeah keeps your VIPs on time and impressed.

📲 rideyeah.com`,
    tags: '#RideYeah #VIPTransport #ClientExperience #ExecutiveTravel #CorporateTravel #Roadshow #BlackCarService #LosAngeles',
  },
  {
    slug: 'open-account', img: 'band_highway.jpg', pos: '50% 50%',
    eyebrow: 'Open an Account',
    headline: 'Ready when<br>your team is.',
    bullets: ['Recurring & last-minute rides', 'Dedicated corporate support', 'Tailored to how you move'],
    caption: `Your team's travel, on autopilot. 🔁

Recurring rides, last-minute pickups, airport runs — a RideYeah corporate account flexes to your needs with dedicated support and priority 24/7 booking. Tell us how your company moves; we'll build the plan around it.

📲 Start today: rideyeah.com · (805) 285-1570`,
    tags: '#RideYeah #CorporateTravel #BusinessTravel #ExecutiveTransport #FleetForBusiness #B2B #LosAngeles #OrangeCounty',
  },
];

const W = 1080, H = 1350;
const bulletRow = (t) => `
  <div style="display:flex;align-items:flex-start;gap:16px;padding:9px 0">
    <svg viewBox="0 0 24 24" width="27" height="27" style="flex:none;margin-top:1px"><circle cx="12" cy="12" r="11" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity=".75"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="${GOLD}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span style="font-size:31px;font-weight:600;color:${BONE};line-height:1.25">${t}</span>
  </div>`;

const cardHtml = (p, photo) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontsCss}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${INK}}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:"Manrope",system-ui,sans-serif;color:${BONE};-webkit-font-smoothing:antialiased}
.serif{font-family:"Fraunces",Georgia,serif}
.wm{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.14em;line-height:1;white-space:nowrap}
.eyebrow{font-weight:700;text-transform:uppercase;color:${GOLDSOFT};letter-spacing:.30em}
</style></head><body>
<div class="stage">
  <div style="position:absolute;inset:0;background:url('${photo}') ${p.pos} / cover no-repeat"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,11,.62) 0%,rgba(10,10,11,.18) 26%,rgba(10,10,11,.55) 56%,${INK} 90%)"></div>

  <!-- top brand -->
  <div style="position:absolute;top:54px;left:64px;display:flex;align-items:center;gap:18px">
    ${badge(70)}${wordmark(40)}
  </div>

  <!-- bottom content -->
  <div style="position:absolute;left:64px;right:64px;bottom:64px">
    <div class="eyebrow" style="font-size:23px">${p.eyebrow}</div>
    <div class="serif" style="font-size:74px;line-height:1.02;font-weight:600;letter-spacing:-.02em;color:${BONE};margin-top:18px;text-shadow:0 3px 22px rgba(0,0,0,.55)">${p.headline}</div>
    <div style="width:96px;height:2px;background:linear-gradient(90deg,${GOLD},transparent);margin:26px 0 22px"></div>
    <div>${p.bullets.map(bulletRow).join('')}</div>
    <div style="margin-top:26px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <span style="font-size:29px;font-weight:800;color:${BONE};letter-spacing:.01em">Book at rideyeah.com</span>
      <span style="color:rgba(201,168,106,.6)">&#9670;</span>
      <span style="font-size:27px;font-weight:700;color:${GOLDSOFT}">(805) 285-1570</span>
    </div>
  </div>

  <div style="position:absolute;inset:24px;border:1.5px solid rgba(201,168,106,.26);border-radius:6px;pointer-events:none"></div>
</div></body></html>`;

const idx = (n) => String(n).padStart(2, '0');
let i = 0;
for (const p of POSTS) {
  i++;
  const photo = await dataImg(p.img);
  const htmlPath = path.join(OUT_HTML, `_promo_${p.slug}.html`);
  const pngTmp = path.join(OUT_HTML, `_promo_${p.slug}.png`);
  await writeFile(htmlPath, cardHtml(p, photo));
  spawnSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=2', `--window-size=${W},${H}`,
    '--virtual-time-budget=4000', `--screenshot=${pngTmp}`, pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' });

  const name = `${idx(i)}_${p.slug}`;
  const outPng = path.join(OUT_DIR, `${name}.png`);
  const dlPng = path.join(DL_DIR, 'feed', `${name}.png`);
  await sharp(pngTmp).resize(W, H).png().toFile(outPng);
  await sharp(pngTmp).resize(W, H).png().toFile(dlPng);

  const caption = `${p.caption}\n\n${p.tags}\n`;
  await writeFile(path.join(OUT_DIR, `${name}.txt`), caption);
  await writeFile(path.join(DL_DIR, 'captions', `${name}.txt`), caption);
  console.log('WROTE', name);
}
console.log('\nDone. Images in', OUT_DIR, 'and', DL_DIR);
