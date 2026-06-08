/**
 * RideYeah · City landing-page generator (EN)
 * -------------------------------------------
 * Writes "Chauffeur Service in <City>" pages + a /service-areas hub from
 * scripts/cities-data.mjs. Pages sit at the repo root (like the route pages),
 * so links/assets are relative and the build's clean-URL pass strips ".html".
 * Imported by scripts/build.mjs.
 */
import { writeFileSync } from "node:fs";
import { CITIES } from "./cities-data.mjs";
import { ROUTES } from "./routes-data.mjs";

const LOGO = `<svg class="brand-logo" viewBox="0 0 100 100" fill="none" aria-hidden="true"><rect x="8" y="8" width="84" height="84" rx="22" stroke="var(--bone)" stroke-width="4"/><rect x="18" y="18" width="64" height="64" rx="14" fill="var(--bone)"/><path d="M 37 68 V 50 H 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 L 63 68" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const WORD = `<span style="display:flex;align-items:center;text-transform:none;letter-spacing:0.18em;"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="height:16px;width:16px;margin-right:2px;stroke-width:2.5;"><path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>ideYeah</span>`;
const A = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const CK = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const MENU = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
const CLOSE = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const FLOGO = `<svg class="brand-logo" viewBox="0 0 100 100" fill="none" width="34" height="34" aria-hidden="true"><rect x="8" y="8" width="84" height="84" rx="22" stroke="var(--bone)" stroke-width="4"/><rect x="18" y="18" width="64" height="64" rx="14" fill="var(--bone)"/><path d="M 37 68 V 50 H 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 L 63 68" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span style="display:flex;align-items:center;text-transform:none;letter-spacing:0.18em;font-size:15px;"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="height:14px;width:14px;margin-right:2px;stroke-width:2.5;"><path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>ideYeah</span>`;
const IG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`;
const TT = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>`;

const imgset = (name) =>
  `image-set(url('images/${name}.webp') type('image/webp'), url('images/${name}.jpg') type('image/jpeg'))`;

const nav = `<nav class="nav-links" aria-label="Primary">
      <a href="airport-transfers.html">Airport</a>
      <a href="black-car-service.html">Black car</a>
      <a href="fleet.html">Fleet</a>
      <a href="service-areas.html">Areas</a>
      <a href="blog/">Blog</a>
      <a href="index.html#book" class="btn btn-gold">Book now ${A}</a>
    </nav>`;
const menu = `<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu">
  <button class="mm-close" id="mmClose" aria-label="Close menu">${CLOSE}</button>
  <a href="airport-transfers.html">Airport transfers</a>
  <a href="black-car-service.html">Black car service</a>
  <a href="service-areas.html">Service areas</a>
  <a href="popular-routes.html">Popular routes</a>
  <a href="blog/">Blog</a>
  <a href="index.html#book" class="btn btn-gold">Book your ride</a>
</div>`;
const footer = `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <div class="brand">${FLOGO}</div>
        <p>Luxury ground transportation across Los Angeles &amp; Orange County. Arrive relaxed, always on time.</p>
      </div>
      <div class="foot-col"><h3>Services</h3><a href="airport-transfers.html">Airport transfers</a><a href="hourly-chauffeur.html">By the hour</a><a href="black-car-service.html">Black car service</a><a href="service-areas.html">Service areas</a></div>
      <div class="foot-col"><h3>Company</h3><a href="about.html">About us</a><a href="fleet.html">Our fleet</a><a href="blog/">Blog</a><a href="index.html#contact">Contact</a></div>
      <div class="foot-col"><h3>Contact</h3><a href="tel:+18052851570">+1 (805) 285-1570</a><a href="mailto:info@rideyeah.com">info@rideyeah.com</a><a href="https://maps.google.com/?q=Los+Angeles,+CA" target="_blank" rel="noopener">Los Angeles, CA</a><div class="socials" style="margin-top:16px">
        <a href="https://www.instagram.com/rideyeah/" target="_blank" rel="noopener me" aria-label="RideYeah on Instagram">${IG}</a>
        <a href="https://www.tiktok.com/@rideyeah" target="_blank" rel="noopener me" aria-label="RideYeah on TikTok">${TT}</a>
      </div></div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 RideYeah. All rights reserved.</span>
    </div>
  </div>
</footer>
<script src="assets/site.js"></script>`;

const headHtml = (o) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<meta name="theme-color" content="#0A0A0B">
${o.keywords ? `<meta name="keywords" content="${o.keywords}">\n` : ""}<link rel="canonical" href="${o.canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RideYeah">
<meta property="og:title" content="${o.title}">
<meta property="og:description" content="${o.desc}">
<meta property="og:url" content="${o.canonical}">
<meta property="og:image" content="https://rideyeah.com/images/og-image.jpg">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
${o.ld.map((j) => `<script type="application/ld+json">\n${JSON.stringify(j, null, 2)}\n</script>`).join("\n")}
</head>
<body>
<a href="#main" class="skip">Skip to content</a>

<header class="nav" id="nav">
  <div class="wrap nav-inner">
    <a href="index.html" class="brand" aria-label="RideYeah — home">
      ${LOGO}
      ${WORD}
    </a>
    ${nav}
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">${MENU}</button>
  </div>
</header>
${menu}
`;

function page(c) {
  const url = `https://rideyeah.com/${c.slug}`;
  const route = c.laxRoute ? ROUTES.find((r) => r.slug === c.laxRoute) : null;

  const title = `Chauffeur Service in ${c.city} | Luxury Black SUV | RideYeah`;
  const desc = `Private chauffeur & luxury black SUV service in ${c.city}: airport transfers, hourly hire and door-to-door rides with professional drivers and fixed, all-in pricing.`;

  const airportLine = route
    ? `Flying in or out? Our fixed <a href="lax-to-${route.slug}.html">LAX ⇄ ${c.city}</a> fare starts at $${route.price}, door to door in about ${route.min} minutes.`
    : `For flights, we run private <a href="airport-transfers.html">airport transfers</a> to and from ${c.airports}, with live flight tracking and meet-and-greet.`;

  const q1a = route
    ? `Pricing is fixed and all-in (tolls and gratuity included, no surge). Point-to-point rides are quoted before you book, and the fixed LAX ⇄ ${c.city} airport fare starts at $${route.price}. Fares may change without notice — use the booking search for an exact, instant quote.`
    : `Pricing is fixed and all-in — tolls and gratuity included, with no surge. You approve the total before you book; enter your trip in the booking search for an exact, instant quote.`;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Chauffeur service",
      name: `Chauffeur service in ${c.city}`,
      description: desc,
      provider: { "@type": "LimousineService", name: "RideYeah", url: "https://rideyeah.com/", telephone: "+1-805-285-1570" },
      areaServed: { "@type": "City", name: c.city },
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://rideyeah.com/" },
        { "@type": "ListItem", position: 2, name: "Service areas", item: "https://rideyeah.com/service-areas" },
        { "@type": "ListItem", position: 3, name: c.city, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: `How much is a chauffeur in ${c.city}?`, acceptedAnswer: { "@type": "Answer", text: q1a } },
        { "@type": "Question", name: `Do you provide airport transfers in ${c.city}?`, acceptedAnswer: { "@type": "Answer", text: `Yes. We provide private airport transfers to and from ${c.airports}, with real-time flight tracking, meet-and-greet and complimentary wait time on arrivals.` } },
        { "@type": "Question", name: `Can I book an hourly chauffeur in ${c.city}?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Our hourly chauffeur keeps the same driver and luxury black SUV with you across ${c.city} for events, meetings, nights out and multi-stop days.` } },
      ],
    },
  ];

  return (
    headHtml({ title, desc, keywords: `${c.keyword}, ${c.city} chauffeur, ${c.city} black car service, ${c.city} airport transfer`, canonical: url, ld }) +
    `
<main id="main">
  <section class="page-hero">
    <div class="page-hero-photo" style="background-image:${imgset(c.hero)}"></div>
    <div class="page-hero-tint"></div>
    <div class="wrap inner">
      <div class="crumb"><a href="index.html">Home</a> · <a href="service-areas.html">Service areas</a> · ${c.city}</div>
      <div class="eyebrow"><span class="ln"></span><span>${c.area} · 24/7 · Luxury Black SUV</span></div>
      <h1>Chauffeur service<br><span class="em">in ${c.city}.</span></h1>
      <p class="lead">${c.intro}</p>
      <div style="margin-top:28px"><a href="index.html#book" class="btn btn-gold" style="padding:15px 32px;font-size:14px">Get your quote ${A}</a></div>
    </div>
  </section>

  <section class="sec-pad">
    <div class="wrap">
      <div class="sec-head reveal"><span class="eyebrow">In ${c.city}</span><h2>How we drive ${c.city}.</h2></div>
      <ul class="ticks reveal" style="max-width:760px">
        <li>${CK}<div><strong>Airport transfers</strong> — ${c.airports}, with flight tracking &amp; meet-and-greet. <a href="airport-transfers.html">Learn more</a>.</div></li>
        <li>${CK}<div><strong>Hourly chauffeur</strong> — keep one driver &amp; SUV for events, meetings and nights out. <a href="hourly-chauffeur.html">By the hour</a>.</div></li>
        <li>${CK}<div><strong>Black-car service</strong> — executive and standing trips in an immaculate <a href="black-car-service.html">luxury black SUV</a>.</div></li>
        <li>${CK}<div><strong>Point-to-point</strong> — fixed, all-in pricing for ${c.useCase}.</div></li>
      </ul>
      <p style="margin-top:22px;color:var(--mute);max-width:760px">${airportLine}</p>
    </div>
  </section>

  <section class="sec-pad alt">
    <div class="wrap grid-2">
      <div class="reveal media">
        <div class="media-photo" style="background-image:${imgset(c.hero)}"></div>
      </div>
      <div class="reveal">
        <span class="eyebrow">Across ${c.city}</span>
        <h2 class="serif" style="font-family:var(--serif);font-weight:300;font-size:clamp(28px,3.6vw,42px);line-height:1.1;letter-spacing:-.02em;margin:14px 0 18px">Door-to-door, anywhere in ${c.city}.</h2>
        <p style="color:var(--mute);margin-bottom:18px">We pick up across ${c.neighborhoods.slice(0, -1).join(", ")} and ${c.neighborhoods.slice(-1)} — close to ${c.landmarks}.</p>
        <ul class="ticks">
          <li>${CK}<div>Discreet, professional chauffeur &amp; <span>an immaculate luxury black SUV</span></div></li>
          <li>${CK}<div>Up to 7 passengers <span>· room for luggage, Wi-Fi &amp; chilled water</span></div></li>
          <li>${CK}<div>Fixed, all-in pricing <span>· no surge, no meter</span></div></li>
        </ul>
        <a href="index.html#book" class="btn btn-gold" style="margin-top:28px">Book in ${c.city} ${A}</a>
      </div>
    </div>
  </section>

  <section class="sec-pad">
    <div class="wrap">
      <div class="sec-head reveal"><span class="eyebrow">Good to know</span><h2>${c.city} FAQ.</h2></div>
      <div class="faq-wrap">
        <details class="faq reveal"><summary>How much is a chauffeur in ${c.city}?<span class="ico" aria-hidden="true"></span></summary><div class="ans">${q1a}</div></details>
        <details class="faq reveal"><summary>Do you provide airport transfers in ${c.city}?<span class="ico" aria-hidden="true"></span></summary><div class="ans">Yes. We provide private airport transfers to and from ${c.airports}, with real-time flight tracking, meet-and-greet and complimentary wait time on arrivals.</div></details>
        <details class="faq reveal"><summary>Can I book an hourly chauffeur in ${c.city}?<span class="ico" aria-hidden="true"></span></summary><div class="ans">Yes. Our hourly chauffeur keeps the same driver and luxury black SUV with you across ${c.city} for events, meetings, nights out and multi-stop days.</div></details>
      </div>
    </div>
  </section>

  <section class="sec-pad alt">
    <div class="wrap">
      <div class="cta-box reveal">
        <span class="eyebrow">${c.city}, the easy way</span>
        <h2>Book a chauffeur in ${c.city}.</h2>
        <p>Fixed price, professional chauffeur and a private luxury black SUV — door to door, on time.</p>
        <a href="index.html#book" class="btn btn-gold" style="padding:16px 38px;font-size:15px">Get your quote ${A}</a>
      </div>
    </div>
  </section>
</main>

${footer}
</body>
</html>
`
  );
}

function hub() {
  const url = "https://rideyeah.com/service-areas";
  const cityNames = CITIES.map((c) => c.city).join(", ");
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Service areas — RideYeah",
      description: `Cities RideYeah serves with chauffeured luxury black SUV service across Los Angeles and Orange County: ${cityNames}.`,
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://rideyeah.com/" },
        { "@type": "ListItem", position: 2, name: "Service areas", item: url },
      ],
    },
  ];
  const cards = CITIES.map(
    (c) =>
      `        <a class="card reveal" href="${c.slug}.html"><h3 style="font-family:var(--serif);font-weight:400;font-size:22px;margin-bottom:6px">${c.city}</h3><div style="color:var(--gold);font-size:12px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px">${c.area}</div><p>Chauffeur &amp; luxury black SUV service across ${c.city} — airport transfers, hourly hire and door-to-door rides.</p><span style="display:inline-block;margin-top:12px;color:var(--gold);font-size:13px;font-weight:600;letter-spacing:.04em">View ${c.city} →</span></a>`,
  ).join("\n");

  return (
    headHtml({
      title: "Service Areas | Chauffeur Service Across LA & OC | RideYeah",
      desc: `RideYeah serves Los Angeles and Orange County with chauffeured luxury black SUV service: ${cityNames} and beyond.`,
      keywords: "los angeles chauffeur service, orange county car service, beverly hills, santa monica, calabasas, pasadena, newport beach, thousand oaks",
      canonical: url,
      ld,
    }) +
    `
<main id="main">
  <section class="page-hero">
    <div class="page-hero-photo" style="background-image:${imgset("band_highway")}"></div>
    <div class="page-hero-tint"></div>
    <div class="wrap inner">
      <div class="crumb"><a href="index.html">Home</a> · Service areas</div>
      <div class="eyebrow"><span class="ln"></span><span>Los Angeles &amp; Orange County</span></div>
      <h1>Where we<br><span class="em">drive.</span></h1>
      <p class="lead">Chauffeured luxury black SUV service across Southern California — from Beverly Hills and Santa Monica to the Conejo Valley and the Orange County coast. Choose your city for local detail and pricing.</p>
    </div>
  </section>

  <section class="sec-pad">
    <div class="wrap">
      <div class="grid-3">
${cards}
      </div>
      <p style="font-size:13px;color:var(--mute);margin-top:24px">Don't see your city? We cover all of LA &amp; OC — <a href="index.html#book" style="color:var(--gold)">get a quote</a> or see <a href="popular-routes.html" style="color:var(--gold)">fixed-fare LAX routes</a>.</p>
    </div>
  </section>

  <section class="sec-pad alt">
    <div class="wrap">
      <div class="cta-box reveal">
        <span class="eyebrow">Anywhere in Southern California</span>
        <h2>Get your fixed quote.</h2>
        <p>Enter your pickup and destination for an instant, all-in price — no surge, no surprises.</p>
        <a href="index.html#book" class="btn btn-gold" style="padding:16px 38px;font-size:15px">See prices &amp; book ${A}</a>
      </div>
    </div>
  </section>
</main>

${footer}
</body>
</html>
`
  );
}

for (const c of CITIES) writeFileSync(`${c.slug}.html`, page(c), "utf8");
writeFileSync("service-areas.html", hub(), "utf8");
console.log(`✓ Generated ${CITIES.length} city pages + service-areas hub`);
