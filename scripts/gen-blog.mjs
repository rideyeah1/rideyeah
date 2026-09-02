/**
 * RideYeah · Blog generator (EN)
 * ------------------------------
 * Writes the blog from scripts/blog-data.mjs:
 *   blog/index.html         → /blog/        (hub, newest first)
 *   blog/<slug>.html        → /blog/<slug>  (article)
 *   blog/feed.xml           → /blog/feed.xml (RSS 2.0)
 *
 * Blog pages live in a /blog/ subdir, so every asset + internal link is
 * root-absolute ("/assets/…", "/images/…", "/lax-to-…​.html"). The build's
 * clean-URL pass strips ".html" in dist/. Imported by scripts/build.mjs.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { POSTS, SITE, REDIRIGIDOS } from "./blog-data.mjs";
import { ROUTES } from "./routes-data.mjs";

const LOGO = `<svg class="brand-logo" viewBox="0 0 100 100" fill="none" aria-hidden="true"><rect x="8" y="8" width="84" height="84" rx="22" stroke="var(--bone)" stroke-width="4"/><rect x="18" y="18" width="64" height="64" rx="14" fill="var(--bone)"/><path d="M 37 68 V 50 H 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 L 63 68" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const WORD = `<span style="display:flex;align-items:center;text-transform:none;letter-spacing:0.18em;"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="height:16px;width:16px;margin-right:2px;stroke-width:2.5;"><path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>ideYeah</span>`;
const A = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const MENU = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
const CLOSE = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const FLOGO = `<svg class="brand-logo" viewBox="0 0 100 100" fill="none" width="34" height="34" aria-hidden="true"><rect x="8" y="8" width="84" height="84" rx="22" stroke="var(--bone)" stroke-width="4"/><rect x="18" y="18" width="64" height="64" rx="14" fill="var(--bone)"/><path d="M 37 68 V 50 H 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 L 63 68" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span style="display:flex;align-items:center;text-transform:none;letter-spacing:0.18em;font-size:15px;"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="height:14px;width:14px;margin-right:2px;stroke-width:2.5;"><path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>ideYeah</span>`;
const IG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`;
const TT = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>`;
const FB = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>`;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const rfc822 = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[dt.getUTCDay()]}, ${String(d).padStart(2, "0")} ${mon[m - 1]} ${y} 12:00:00 GMT`;
};
const imgset = (name) =>
  `image-set(url('/images/${name}.webp') type('image/webp'), url('/images/${name}.jpg') type('image/jpeg'))`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const nav = `<nav class="nav-links" aria-label="Primary">
      <a href="/airport-transfers.html">Airport</a>
      <a href="/black-car-service.html">Black car</a>
      <a href="/fleet.html">Fleet</a>
      <a href="/popular-routes.html">Routes</a>
      <a href="/blog/">Blog</a>
      <a href="/#book" class="btn btn-gold">Book now ${A}</a>
    </nav>`;
const menu = `<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu">
  <button class="mm-close" id="mmClose" aria-label="Close menu">${CLOSE}</button>
  <a href="/airport-transfers.html">Airport transfers</a>
  <a href="/black-car-service.html">Black car service</a>
  <a href="/corporate-transportation.html">Corporate travel</a>
  <a href="/popular-routes.html">Popular routes</a>
  <a href="/fleet.html">Fleet</a>
  <a href="/travel/">Travel guides</a><a href="/faq.html">FAQ</a>
  <a href="/blog/">Blog</a>
  <a href="/#book" class="btn btn-gold">Book your ride</a>
</div>`;
const footer = `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <div class="brand">${FLOGO}</div>
        <p>Luxury ground transportation across Los Angeles &amp; Orange County. Arrive relaxed, always on time.</p>
      </div>
      <div class="foot-col"><h3>Services</h3><a href="/airport-transfers.html">Airport transfers</a><a href="/hourly-chauffeur.html">By the hour</a><a href="/black-car-service.html">Black car service</a><a href="/corporate-transportation.html">Corporate travel</a><a href="/popular-routes.html">Popular routes</a></div>
      <div class="foot-col"><h3>Company</h3><a href="/about.html">About us</a><a href="/fleet.html">Our fleet</a><a href="/blog/">Blog</a><a href="/travel/">Travel guides</a><a href="/faq.html">FAQ</a><a href="/#contact">Contact</a></div>
      <div class="foot-col"><h3>Contact</h3><a href="tel:+18052851570">+1 (805) 285-1570</a><a href="mailto:info@rideyeah.com">info@rideyeah.com</a><a href="https://maps.google.com/?q=Los+Angeles,+CA" target="_blank" rel="noopener">Los Angeles, CA</a><div class="socials" style="margin-top:16px">
        <a href="https://www.facebook.com/RideYeah.LA" target="_blank" rel="noopener me" aria-label="RideYeah on Facebook">${FB}</a>
        <a href="https://www.instagram.com/rideyeah/" target="_blank" rel="noopener me" aria-label="RideYeah on Instagram">${IG}</a>
        <a href="https://www.tiktok.com/@rideyeah" target="_blank" rel="noopener me" aria-label="RideYeah on TikTok">${TT}</a>
      </div></div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 RideYeah. All rights reserved.</span>
    </div>
  </div>
</footer>
<script src="/assets/site.js"></script>`;

const head = (o) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<meta name="theme-color" content="#0A0A0B">
${o.keywords ? `<meta name="keywords" content="${o.keywords}">\n` : ""}<link rel="canonical" href="${o.canonical}">
<meta property="og:type" content="${o.ogType || "website"}">
<meta property="og:site_name" content="RideYeah">
<meta property="og:title" content="${o.title}">
<meta property="og:description" content="${o.desc}">
<meta property="og:url" content="${o.canonical}">
<meta property="og:image" content="${o.ogImage || SITE + "/images/og-image.jpg"}">
<link rel="alternate" type="application/rss+xml" title="RideYeah Blog" href="/blog/feed.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${o.ld.map((j) => `<script type="application/ld+json">\n${JSON.stringify(j, null, 2)}\n</script>`).join("\n")}
</head>
<body>
<a href="#main" class="skip">Skip to content</a>

<header class="nav" id="nav">
  <div class="wrap nav-inner">
    <a href="/" class="brand" aria-label="RideYeah — home">
      ${LOGO}
      ${WORD}
    </a>
    ${nav}
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">${MENU}</button>
  </div>
</header>
${menu}
`;

// ---- article body blocks → HTML ----
function renderBlocks(blocks) {
  return blocks
    .map((b) => {
      if (b.h2) return `<h2>${b.h2}</h2>`;
      if (b.h3) return `<h3>${b.h3}</h3>`;
      if (b.p) return `<p>${b.p}</p>`;
      if (b.ul) return `<ul>${b.ul.map((li) => `<li>${li}</li>`).join("")}</ul>`;
      if (b.ol) return `<ol>${b.ol.map((li) => `<li>${li}</li>`).join("")}</ol>`;
      if (b.quote) return `<blockquote>${b.quote}</blockquote>`;
      if (b.cta)
        return `<p class="art-cta"><a href="${b.cta.href}" class="btn btn-gold">${b.cta.label} ${A}</a></p>`;
      return "";
    })
    .join("\n");
}

function relatedRoutesHtml(post) {
  const cards = (post.related || [])
    .map((slug) => ROUTES.find((r) => r.slug === slug))
    .filter(Boolean)
    .map(
      (r) =>
        `<a class="card" href="/lax-to-${r.slug}.html"><h3 style="font-family:var(--serif);font-weight:400;font-size:20px;margin-bottom:6px">LAX ⇄ ${r.city}</h3><div style="color:var(--gold);font-family:var(--serif);font-size:24px;margin:4px 0 10px">$${r.price}</div><p>~${r.min} min · Luxury Black SUV · fixed fare.</p><span style="display:inline-block;margin-top:10px;color:var(--gold);font-size:13px;font-weight:600;letter-spacing:.04em">View route &rarr;</span></a>`,
    )
    .join("\n");
  if (!cards) return "";
  return `  <section class="sec-pad">
    <div class="wrap">
      <div class="sec-head reveal"><span class="eyebrow">Book this trip</span><h2>Fixed-fare routes.</h2></div>
      <div class="grid-3">
${cards}
      </div>
    </div>
  </section>`;
}

function article(post) {
  const url = `${SITE}/blog/${post.slug}`;
  const ogImage = `${SITE}/images/${post.hero}.jpg`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      image: ogImage,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      author: { "@type": "Organization", name: "RideYeah", url: SITE + "/" },
      publisher: {
        "@type": "Organization",
        name: "RideYeah",
        logo: { "@type": "ImageObject", url: SITE + "/apple-touch-icon.png" },
      },
      mainEntityOfPage: url,
      keywords: post.keyword,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: SITE + "/blog/" },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const faqHtml = post.faq
    .map(
      (f) =>
        `<details class="faq reveal"><summary>${f.q}<span class="ico" aria-hidden="true"></span></summary><div class="ans">${f.a}</div></details>`,
    )
    .join("\n        ");

  return (
    head({
      title: post.metaTitle,
      desc: post.metaDescription,
      keywords: post.keyword,
      canonical: url,
      ogType: "article",
      ogImage,
      ld,
    }) +
    `
<main id="main">
  <section class="page-hero art-hero">
    <div class="page-hero-photo" style="background-image:${imgset(post.hero)}"></div>
    <div class="page-hero-tint"></div>
    <div class="wrap inner">
      <div class="crumb"><a href="/">Home</a> · <a href="/blog/">Blog</a> · ${post.category}</div>
      <h1>${post.title}</h1>
      <div class="art-meta">${post.category} · ${fmtDate(post.date)} · ${post.readMin} min read</div>
    </div>
  </section>

  <section class="sec-pad">
    <div class="wrap">
      <article class="art-body reveal">
${renderBlocks(post.body)}
      </article>
    </div>
  </section>

  <section class="sec-pad alt">
    <div class="wrap">
      <div class="sec-head reveal"><span class="eyebrow">Good to know</span><h2>Frequently asked.</h2></div>
      <div class="faq-wrap">
        ${faqHtml}
      </div>
    </div>
  </section>

${relatedRoutesHtml(post)}

  <section class="sec-pad alt">
    <div class="wrap">
      <div class="cta-box reveal">
        <span class="eyebrow">Ready when you are</span>
        <h2>Book your luxury ride.</h2>
        <p>Fixed price, flight tracking and a professional chauffeur in a private luxury black SUV.</p>
        <a href="/#book" class="btn btn-gold" style="padding:16px 38px;font-size:15px">Get your fixed quote ${A}</a>
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
  const url = `${SITE}/blog/`;
  const sorted = [...POSTS].filter((p) => !REDIRIGIDOS.has(p.slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "RideYeah Blog — Luxury Transportation Guides",
      description:
        "Guides to luxury airport transfers, executive black-car service and fixed-fare routes across Los Angeles and Orange County.",
      url,
      publisher: { "@type": "Organization", name: "RideYeah", url: SITE + "/" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: url },
      ],
    },
  ];
  const cards = sorted
    .map(
      (p) => `        <a class="card art-card reveal" href="/blog/${p.slug}.html">
          <div class="art-card-img" style="background-image:${imgset(p.hero)}"></div>
          <div class="art-card-body">
            <span class="art-card-cat">${p.category}</span>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
            <span class="art-card-meta">${fmtDate(p.date)} · ${p.readMin} min read</span>
          </div>
        </a>`,
    )
    .join("\n");

  return (
    head({
      title: "Blog — Luxury Transportation Guides for LA & OC | RideYeah",
      desc: "Guides to LAX airport transfers, executive black-car service and fixed-fare luxury routes across Los Angeles and Orange County.",
      keywords: "los angeles luxury transportation blog, lax car service guide, executive car service la",
      canonical: url,
      ld,
    }) +
    `
<main id="main">
  <section class="page-hero art-hub-hero">
    <div class="page-hero-photo" style="background-image:${imgset("band_highway")}"></div>
    <div class="page-hero-tint"></div>
    <div class="wrap inner">
      <div class="crumb"><a href="/">Home</a> · Blog</div>
      <div class="eyebrow"><span class="ln"></span><span>Guides &amp; insights</span></div>
      <h1>The RideYeah<br><span class="em">journal.</span></h1>
      <p class="lead">Practical guides to luxury airport transfers, executive black-car service and fixed-fare routes across Los Angeles and Orange County.</p>
    </div>
  </section>

  <section class="sec-pad">
    <div class="wrap">
      <div class="grid-3 art-grid">
${cards}
      </div>
    </div>
  </section>

  <section class="sec-pad alt">
    <div class="wrap">
      <div class="cta-box reveal">
        <span class="eyebrow">Anywhere in Southern California</span>
        <h2>Get your fixed fare.</h2>
        <p>Enter your pickup and destination for an instant, all-in price — no surge, no surprises.</p>
        <a href="/#book" class="btn btn-gold" style="padding:16px 38px;font-size:15px">See prices &amp; book ${A}</a>
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

function rss() {
  const sorted = [...POSTS].filter((p) => !REDIRIGIDOS.has(p.slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const items = sorted
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <category>${esc(p.category)}</category>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(p.excerpt)}</description>
    </item>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>RideYeah Blog — Luxury Transportation Guides</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>LAX airport transfers, executive black-car service and fixed-fare luxury routes across Los Angeles &amp; Orange County.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
}

mkdirSync("blog", { recursive: true });
for (const p of POSTS) writeFileSync(`blog/${p.slug}.html`, article(p), "utf8");
writeFileSync("blog/index.html", hub(), "utf8");
writeFileSync("blog/feed.xml", rss(), "utf8");
console.log(`✓ Generated ${POSTS.length} blog posts + hub + RSS`);
