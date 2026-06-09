/**
 * RideYeah · Route landing-page generator
 * ----------------------------------------
 * Writes the EN + ES "LAX ⇄ City" route pages from scripts/routes-data.mjs,
 * keeping both languages perfectly in sync. Imported by scripts/build.mjs.
 *
 *   lax-to-<slug>.html        (EN, repo root → copied to dist/)
 *   es/lax-a-<slug>.html      (ES, copied to dist/es/)
 */
import { writeFileSync } from "node:fs";
import { ROUTES, DISCLAIMER_EN, DISCLAIMER_ES } from "./routes-data.mjs";

const LOGO = `<svg class="brand-logo" viewBox="0 0 100 100" fill="none" aria-hidden="true"><rect x="8" y="8" width="84" height="84" rx="22" stroke="var(--bone)" stroke-width="4"/><rect x="18" y="18" width="64" height="64" rx="14" fill="var(--bone)"/><path d="M 37 68 V 50 H 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 L 63 68" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const WORD = `<span style="display:flex;align-items:center;text-transform:none;letter-spacing:0.18em;"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="height:16px;width:16px;margin-right:2px;stroke-width:2.5;"><path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>ideYeah</span>`;
const A = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const CK = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const MENU = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
const CLOSE = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const FLOGO = `<svg class="brand-logo" viewBox="0 0 100 100" fill="none" width="34" height="34" aria-hidden="true"><rect x="8" y="8" width="84" height="84" rx="22" stroke="var(--bone)" stroke-width="4"/><rect x="18" y="18" width="64" height="64" rx="14" fill="var(--bone)"/><path d="M 37 68 V 50 H 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 L 63 68" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 37 32 H 52 C 61 32 64 38 64 45 C 64 52 58 50 50 50" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span style="display:flex;align-items:center;text-transform:none;letter-spacing:0.18em;font-size:15px;"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="height:14px;width:14px;margin-right:2px;stroke-width:2.5;"><path d="M 6 22 V 12 H 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 L 18 22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M 6 2 H 12 C 17 2 19 5 19 8 C 19 11 16 12 12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>ideYeah</span>`;
const IG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`;
const TT = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>`;

function imgset(name, es) {
  const p = es ? "/images/" : "images/";
  return `image-set(url('${p}${name}.webp') type('image/webp'), url('${p}${name}.jpg') type('image/jpeg'))`;
}

function page(r, lang) {
  const es = lang === "es";
  const enUrl = `https://rideyeah.com/lax-to-${r.slug}.html`;
  const esUrl = `https://rideyeah.com/es/lax-a-${r.slug}`;
  const book = es ? "/es/#book" : "index.html#book";
  const home = es ? "/es/" : "index.html";
  const routesHub = es ? "/es/rutas-populares.html" : "popular-routes.html";
  const asset = (p) => (es ? "/" : "") + p;
  const route = `LAX ⇄ ${r.city}`;

  const nav = es
    ? `<nav class="nav-links" aria-label="Primary">
      <a href="/es/traslados-aeropuerto-lax.html">Aeropuerto</a>
      <a href="/es/servicio-black-car.html">Black car</a>
      <a href="/es/flota.html">Flota</a>
      <a href="/es/rutas-populares.html">Rutas</a>
      <a href="${enUrl.replace("https://rideyeah.com", "")}" class="lang-pill" onclick="try{localStorage.setItem('ry_lang','en')}catch(e){}" aria-label="View in English">EN</a>
      <a href="/es/#book" class="btn btn-gold">Reservar ${A}</a>
    </nav>`
    : `<nav class="nav-links" aria-label="Primary">
      <a href="airport-transfers.html">Airport</a>
      <a href="black-car-service.html">Black car</a>
      <a href="fleet.html">Fleet</a>
      <a href="popular-routes.html">Routes</a>
      <a href="es/lax-a-${r.slug}.html" class="lang-pill" onclick="try{localStorage.setItem('ry_lang','es')}catch(e){}" aria-label="Ver en español">ES</a>
      <a href="index.html#book" class="btn btn-gold">Book now ${A}</a>
    </nav>`;

  const menu = es
    ? `<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu">
  <button class="mm-close" id="mmClose" aria-label="Cerrar menú">${CLOSE}</button>
  <a href="/es/traslados-aeropuerto-lax.html">Traslados al aeropuerto</a>
  <a href="/es/servicio-black-car.html">Servicio black car</a>
  <a href="/es/rutas-populares.html">Rutas populares</a>
  <a href="/es/flota.html">Flota</a>
  <a href="${enUrl.replace("https://rideyeah.com", "")}" class="lang-pill" onclick="try{localStorage.setItem('ry_lang','en')}catch(e){}">EN · English</a>
  <a href="/es/#book" class="btn btn-gold">Reserva tu viaje</a>
</div>`
    : `<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu">
  <button class="mm-close" id="mmClose" aria-label="Close menu">${CLOSE}</button>
  <a href="airport-transfers.html">Airport transfers</a>
  <a href="black-car-service.html">Black car service</a>
  <a href="corporate-transportation.html">Corporate travel</a>
  <a href="popular-routes.html">Popular routes</a>
  <a href="fleet.html">Fleet</a>
  <a href="faq.html">FAQ</a>
  <a href="es/lax-a-${r.slug}.html" class="lang-pill" onclick="try{localStorage.setItem('ry_lang','es')}catch(e){}">ES · Español</a>
  <a href="index.html#book" class="btn btn-gold">Book your ride</a>
</div>`;

  const footer = es
    ? `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <div class="brand">${FLOGO}</div>
        <p>Transporte terrestre de lujo en Los Ángeles y Orange County. Llega relajado, siempre puntual.</p>
      </div>
      <div class="foot-col"><h3>Servicios</h3><a href="/es/traslados-aeropuerto-lax.html">Traslados al aeropuerto</a><a href="/es/chofer-por-horas.html">Por horas</a><a href="/es/servicio-black-car.html">Servicio black car</a><a href="/es/rutas-populares.html">Rutas populares</a></div>
      <div class="foot-col"><h3>Empresa</h3><a href="/es/nosotros.html">Nosotros</a><a href="/es/flota.html">Nuestra flota</a><a href="/es/empleo.html">Empleo</a><a href="/es/#contact">Contacto</a></div>
      <div class="foot-col"><h3>Contacto</h3><a href="tel:+18052851570">+1 (805) 285-1570</a><a href="mailto:info@rideyeah.com">info@rideyeah.com</a><a href="https://maps.google.com/?q=Los+Angeles,+CA" target="_blank" rel="noopener">Los Ángeles, CA</a><div class="socials" style="margin-top:16px">
        <a href="https://www.instagram.com/rideyeah/" target="_blank" rel="noopener me" aria-label="RideYeah en Instagram">${IG}</a>
        <a href="https://www.tiktok.com/@rideyeah" target="_blank" rel="noopener me" aria-label="RideYeah en TikTok">${TT}</a>
      </div></div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 RideYeah. Todos los derechos reservados.</span>
    </div>
  </div>
</footer>
<script src="/assets/site.js"></script>`
    : `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <div class="brand">${FLOGO}</div>
        <p>Luxury ground transportation across Los Angeles &amp; Orange County. Arrive relaxed, always on time.</p>
      </div>
      <div class="foot-col"><h3>Services</h3><a href="airport-transfers.html">Airport transfers</a><a href="hourly-chauffeur.html">By the hour</a><a href="black-car-service.html">Black car service</a><a href="corporate-transportation.html">Corporate travel</a><a href="popular-routes.html">Popular routes</a></div>
      <div class="foot-col"><h3>Company</h3><a href="about.html">About us</a><a href="fleet.html">Our fleet</a><a href="careers.html">Careers</a><a href="faq.html">FAQ</a><a href="index.html#contact">Contact</a></div>
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
<script src="/assets/site.js"></script>`.replace('src="/assets', 'src="assets');

  // ---- localized content ----
  const t = es
    ? {
        title: `Servicio de Auto LAX ⇄ ${r.city} | SUV Negra de Lujo Privada | RideYeah`,
        desc: `Servicio de auto privado LAX ⇄ ${r.city} en una SUV negra de lujo. Seguimiento de vuelos, recibimiento personal y tarifa fija desde $${r.price} — ${r.miles.replace("~", "~")}, puerta a puerta.`,
        keywords: `servicio de auto LAX a ${r.city}, traslado al aeropuerto ${r.city}, chofer LAX ${r.city}, servicio black car ${r.city}`,
        ogt: `Servicio de Auto LAX ⇄ ${r.city} | RideYeah`,
        ogd: `Servicio privado LAX ⇄ ${r.city} en SUV negra de lujo. Seguimiento de vuelos, recibimiento, tarifa fija desde $${r.price}.`,
        svcType: `Servicio de auto al aeropuerto — LAX ⇄ ${r.city}`,
        svcName: `Servicio de Auto LAX ⇄ ${r.city}`,
        svcDesc: `Servicio de auto privado de lujo entre Los Ángeles Internacional (LAX) y ${r.city} en una SUV negra de lujo con chofer, con seguimiento de vuelos, recibimiento personal y tarifas fijas.`,
        q1: `¿Cuánto dura el trayecto entre LAX y ${r.city}?`,
        a1: `${r.driveLongEs}. Tu chofer monitorea las condiciones en vivo y elige la ruta más rápida.`,
        q2: `¿Cuánto cuesta un auto entre LAX y ${r.city}?`,
        a2: `Nuestra tarifa fija comienza en $${r.price} en una SUV negra de lujo — todo incluido, con peajes y propina, sin recargos por demanda. Las tarifas pueden cambiar sin previo aviso; usa el buscador de viajes para una cotización exacta al instante.`,
        q3: `¿Ofrecen recibimiento personal en LAX?`,
        a3: `Sí. Tu chofer sigue tu vuelo y te recibe en la acera o en llegadas, te ayuda con el equipaje y te acompaña a la SUV negra de lujo.`,
        crumbHome: "Inicio", crumbRoutes: "Rutas",
        eyebrow: `~${r.min} min · desde $${r.price} · SUV negra de lujo`,
        h1a: `LAX ⇄ ${r.city},`, h1b: "en silencioso lujo.",
        lead: `Puerta a puerta entre LAX y ${r.city} — ya sea que aterrices o tomes un vuelo, viajas en una SUV negra de lujo privada. Vuelo monitoreado, precio fijo, siempre puntual.`,
        cta: "Obtén tu tarifa fija",
        st1: "Tiempo de viaje habitual", st2: "Tarifa fija, todo incluido",
        disc: DISCLAIMER_ES,
        secEyebrow: "La llegada que mereces", secH2: `Hecho para ${r.city}.`,
        tick1: `Directo a ${r.landmarksEs}`,
        tick2: `Chofer profesional y discreto y <span>una SUV negra de lujo impecable</span>`,
        tick3: `Seguimiento de vuelo en vivo y <span>tiempo de espera de cortesía en llegadas</span>`,
        tick4: `Precio fijo, todo incluido <span>· sin recargos, sin taxímetro</span>`,
        reserve: "Reserva esta ruta",
        faqEyebrow: "Bueno saberlo", faqH2: `Preguntas frecuentes: LAX ⇄ ${r.city}.`,
        ctaEyebrow: `${r.city}, sin complicaciones`, ctaH2: `Reserva LAX ⇄ ${r.city}.`,
        ctaP: `Precio fijo, seguimiento de vuelo y chofer profesional en una SUV negra de lujo privada.`,
      }
    : {
        title: `LAX ⇄ ${r.city} Car Service | Private Luxury Black SUV | RideYeah`,
        desc: `Private LAX ⇄ ${r.city} car service in a luxury black SUV. Flight tracking, meet-and-greet and a fixed fare from $${r.price} — ${r.driveShort}, door to door.`,
        keywords: `LAX to ${r.city} car service, ${r.city} airport transfer, LAX ${r.city} chauffeur, ${r.city} black car service`,
        ogt: `LAX ⇄ ${r.city} Car Service | RideYeah`,
        ogd: `Private LAX ⇄ ${r.city} luxury black SUV service. Flight tracking, meet-and-greet, fixed fare from $${r.price}.`,
        svcType: `Airport car service — LAX ⇄ ${r.city}`,
        svcName: `LAX ⇄ ${r.city} Car Service`,
        svcDesc: `Private luxury car service between Los Angeles International (LAX) and ${r.city} in a chauffeured luxury black SUV, with flight tracking, meet-and-greet and fixed pricing.`,
        q1: `How long is the drive between LAX and ${r.city}?`,
        a1: `${r.driveLong}. Your chauffeur monitors live conditions and chooses the fastest route.`,
        q2: `How much is a car between LAX and ${r.city}?`,
        a2: `Our fixed fare starts at $${r.price} in a luxury black SUV — all-in, with tolls and gratuity included and no surge pricing. Fares may change without notice; use the booking search for an exact, instant quote.`,
        q3: `Do you offer meet-and-greet at LAX?`,
        a3: `Yes. Your chauffeur tracks your flight and meets you at the curb or in arrivals, helps with luggage and walks you to the luxury black SUV.`,
        crumbHome: "Home", crumbRoutes: "Routes",
        eyebrow: `~${r.min} min · from $${r.price} · Luxury Black SUV`,
        h1a: `LAX ⇄ ${r.city},`, h1b: "in quiet luxury.",
        lead: `Private door-to-door between LAX and ${r.city} — landing or catching a flight, you ride in a luxury black SUV. Flight tracked, fixed price, always on time.`,
        cta: "Get your fixed quote",
        st1: "Typical drive time", st2: "Fixed fare, all-in",
        disc: DISCLAIMER_EN,
        secEyebrow: "The arrival you deserve", secH2: `Made for ${r.city}.`,
        tick1: `Direct to ${r.landmarks}`,
        tick2: `Discreet, professional chauffeur &amp; <span>an immaculate luxury black SUV</span>`,
        tick3: `Live flight tracking &amp; <span>complimentary wait time on arrivals</span>`,
        tick4: `Fixed, all-in price <span>· no surge, no meter</span>`,
        reserve: "Reserve this route",
        faqEyebrow: "Good to know", faqH2: `LAX ⇄ ${r.city} FAQ.`,
        ctaEyebrow: `${r.city}, the easy way`, ctaH2: `Book LAX ⇄ ${r.city}.`,
        ctaP: `Fixed price, flight tracking, professional chauffeur in a private luxury black SUV.`,
      };

  const ld = (o) => JSON.stringify(o, null, 2);
  const serviceLd = ld({
    "@context": "https://schema.org", "@type": "Service",
    serviceType: t.svcType, name: t.svcName, description: t.svcDesc,
    provider: { "@type": "LimousineService", "@id": "https://rideyeah.com/#business" },
    areaServed: { "@type": "City", name: r.city },
    url: es ? esUrl : enUrl,
  });
  const faqLd = ld({
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: t.q1, acceptedAnswer: { "@type": "Answer", text: t.a1 } },
      { "@type": "Question", name: t.q2, acceptedAnswer: { "@type": "Answer", text: t.a2 } },
      { "@type": "Question", name: t.q3, acceptedAnswer: { "@type": "Answer", text: t.a3 } },
    ],
  });

  return `<!DOCTYPE html>
<html lang="${es ? "es" : "en"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${t.title}</title>
<meta name="description" content="${t.desc}">
<meta name="theme-color" content="#0A0A0B">
<meta name="keywords" content="${t.keywords}">
<link rel="canonical" href="${es ? esUrl : enUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="es" href="${esUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RideYeah">
<meta property="og:title" content="${t.ogt}">
<meta property="og:description" content="${t.ogd}">
<meta property="og:url" content="${es ? esUrl : enUrl}">
<meta property="og:image" content="https://rideyeah.com/images/og-image.jpg">
<link rel="icon" href="${asset("favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset("apple-touch-icon.png")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset("assets/site.css")}">
<script type="application/ld+json">
${serviceLd}
</script>
<script type="application/ld+json">
${faqLd}
</script>
</head>
<body>
<a href="#main" class="skip">${es ? "Saltar al contenido" : "Skip to content"}</a>

<header class="nav" id="nav">
  <div class="wrap nav-inner">
    <a href="${home}" class="brand" aria-label="RideYeah — ${es ? "inicio" : "home"}">
      ${LOGO}
      ${WORD}
    </a>
    ${nav}
    <button class="nav-toggle" id="navToggle" aria-label="${es ? "Abrir menú" : "Open menu"}" aria-expanded="false" aria-controls="mobileMenu">${MENU}</button>
  </div>
</header>
${menu}

<main id="main">
  <section class="page-hero">
    <div class="page-hero-photo" style="background-image:${imgset(r.hero, es)}"></div>
    <div class="page-hero-tint"></div>
    <div class="wrap inner">
      <div class="crumb"><a href="${home}">${t.crumbHome}</a> · <a href="${routesHub}">${t.crumbRoutes}</a> · ${route}</div>
      <div class="eyebrow"><span class="ln"></span><span>${t.eyebrow}</span></div>
      <h1>${t.h1a}<br><span class="em">${t.h1b}</span></h1>
      <p class="lead">${t.lead}</p>
      <div style="margin-top:28px"><a href="${book}" class="btn btn-gold" style="padding:15px 32px;font-size:14px">${t.cta} ${A}</a></div>
    </div>
  </section>

  <section class="sec-pad">
    <div class="wrap">
      <div class="stats">
        <div class="stat reveal"><div class="n">~${r.min}<span style="font-size:.5em"> min</span></div><div class="l">${t.st1}</div></div>
        <div class="stat reveal"><div class="n">$${r.price}</div><div class="l">${t.st2}</div></div>
        <div class="stat reveal"><div class="n">${r.miles}</div><div class="l">${route}</div></div>
      </div>
      <p style="text-align:center;font-size:12px;color:var(--mute-2);max-width:680px;margin:22px auto 0;line-height:1.5">${t.disc}</p>
    </div>
  </section>

  <section class="sec-pad alt">
    <div class="wrap grid-2">
      <div class="reveal media">
        <div class="media-photo" style="background-image:${imgset(r.media, es)}"></div>
      </div>
      <div class="reveal">
        <span class="eyebrow">${t.secEyebrow}</span>
        <h2 class="serif" style="font-family:var(--serif);font-weight:300;font-size:clamp(28px,3.6vw,42px);line-height:1.1;letter-spacing:-.02em;margin:14px 0 22px">${t.secH2}</h2>
        <ul class="ticks">
          <li>${CK}<div>${t.tick1}</div></li>
          <li>${CK}<div>${t.tick2}</div></li>
          <li>${CK}<div>${t.tick3}</div></li>
          <li>${CK}<div>${t.tick4}</div></li>
        </ul>
        <a href="${book}" class="btn btn-gold" style="margin-top:30px">${t.reserve} ${A}</a>
      </div>
    </div>
  </section>

  <section class="sec-pad">
    <div class="wrap">
      <div class="sec-head reveal"><span class="eyebrow">${t.faqEyebrow}</span><h2>${t.faqH2}</h2></div>
      <div class="faq-wrap">
        <details class="faq reveal"><summary>${t.q1}<span class="ico" aria-hidden="true"></span></summary><div class="ans">${t.a1}</div></details>
        <details class="faq reveal"><summary>${t.q2}<span class="ico" aria-hidden="true"></span></summary><div class="ans">${t.a2}</div></details>
        <details class="faq reveal"><summary>${t.q3}<span class="ico" aria-hidden="true"></span></summary><div class="ans">${t.a3}</div></details>
      </div>
    </div>
  </section>

  <section class="sec-pad alt">
    <div class="wrap">
      <div class="cta-box reveal">
        <span class="eyebrow">${t.ctaEyebrow}</span>
        <h2>${t.ctaH2}</h2>
        <p>${t.ctaP}</p>
        <a href="${book}" class="btn btn-gold" style="padding:16px 38px;font-size:15px">${t.cta} ${A}</a>
      </div>
    </div>
  </section>
</main>

${footer}
</body>
</html>
`;
}

function footerHtml(es) {
  const cols = es
    ? `<p>Transporte terrestre de lujo en Los Ángeles y Orange County. Llega relajado, siempre puntual.</p>
      </div>
      <div class="foot-col"><h3>Servicios</h3><a href="/es/traslados-aeropuerto-lax.html">Traslados al aeropuerto</a><a href="/es/chofer-por-horas.html">Por horas</a><a href="/es/servicio-black-car.html">Servicio black car</a><a href="/es/rutas-populares.html">Rutas populares</a></div>
      <div class="foot-col"><h3>Empresa</h3><a href="/es/nosotros.html">Nosotros</a><a href="/es/flota.html">Nuestra flota</a><a href="/es/empleo.html">Empleo</a><a href="/es/#contact">Contacto</a></div>
      <div class="foot-col"><h3>Contacto</h3><a href="tel:+18052851570">+1 (805) 285-1570</a><a href="mailto:info@rideyeah.com">info@rideyeah.com</a><a href="https://maps.google.com/?q=Los+Angeles,+CA" target="_blank" rel="noopener">Los Ángeles, CA</a><div class="socials" style="margin-top:16px">
        <a href="https://www.instagram.com/rideyeah/" target="_blank" rel="noopener me" aria-label="RideYeah en Instagram">${IG}</a>
        <a href="https://www.tiktok.com/@rideyeah" target="_blank" rel="noopener me" aria-label="RideYeah en TikTok">${TT}</a>
      </div></div>`
    : `<p>Luxury ground transportation across Los Angeles &amp; Orange County. Arrive relaxed, always on time.</p>
      </div>
      <div class="foot-col"><h3>Services</h3><a href="airport-transfers.html">Airport transfers</a><a href="hourly-chauffeur.html">By the hour</a><a href="black-car-service.html">Black car service</a><a href="corporate-transportation.html">Corporate travel</a><a href="popular-routes.html">Popular routes</a></div>
      <div class="foot-col"><h3>Company</h3><a href="about.html">About us</a><a href="fleet.html">Our fleet</a><a href="careers.html">Careers</a><a href="faq.html">FAQ</a><a href="index.html#contact">Contact</a></div>
      <div class="foot-col"><h3>Contact</h3><a href="tel:+18052851570">+1 (805) 285-1570</a><a href="mailto:info@rideyeah.com">info@rideyeah.com</a><a href="https://maps.google.com/?q=Los+Angeles,+CA" target="_blank" rel="noopener">Los Angeles, CA</a><div class="socials" style="margin-top:16px">
        <a href="https://www.instagram.com/rideyeah/" target="_blank" rel="noopener me" aria-label="RideYeah on Instagram">${IG}</a>
        <a href="https://www.tiktok.com/@rideyeah" target="_blank" rel="noopener me" aria-label="RideYeah on TikTok">${TT}</a>
      </div></div>`;
  const rights = es ? "Todos los derechos reservados." : "All rights reserved.";
  return `<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <div class="brand">${FLOGO}</div>
        ${cols}
    </div>
    <div class="foot-bottom">
      <span>© 2026 RideYeah. ${rights}</span>
    </div>
  </div>
</footer>
<script src="${es ? "/assets" : "assets"}/site.js"></script>`;
}

function hub(lang) {
  const es = lang === "es";
  const enUrl = "https://rideyeah.com/popular-routes.html";
  const esUrl = "https://rideyeah.com/es/rutas-populares";
  const home = es ? "/es/" : "index.html";
  const book = es ? "/es/#book" : "index.html#book";
  const asset = (p) => (es ? "/" : "") + p;
  const cities = ROUTES.map((r) => r.city).join(", ");

  const nav = es
    ? `<nav class="nav-links" aria-label="Primary">
      <a href="/es/traslados-aeropuerto-lax.html">Aeropuerto</a>
      <a href="/es/servicio-black-car.html">Black car</a>
      <a href="/es/flota.html">Flota</a>
      <a href="/es/nosotros.html">Nosotros</a>
      <a href="/popular-routes.html" class="lang-pill" onclick="try{localStorage.setItem('ry_lang','en')}catch(e){}" aria-label="View in English">EN</a>
      <a href="/es/#book" class="btn btn-gold">Reservar ${A}</a>
    </nav>`
    : `<nav class="nav-links" aria-label="Primary">
      <a href="airport-transfers.html">Airport</a>
      <a href="black-car-service.html">Black car</a>
      <a href="fleet.html">Fleet</a>
      <a href="about.html">About</a>
      <a href="es/rutas-populares.html" class="lang-pill" onclick="try{localStorage.setItem('ry_lang','es')}catch(e){}" aria-label="Ver en español">ES</a>
      <a href="index.html#book" class="btn btn-gold">Book now ${A}</a>
    </nav>`;

  const menu = es
    ? `<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu">
  <button class="mm-close" id="mmClose" aria-label="Cerrar menú">${CLOSE}</button>
  <a href="/es/traslados-aeropuerto-lax.html">Traslados al aeropuerto</a>
  <a href="/es/servicio-black-car.html">Servicio black car</a>
  <a href="/es/chofer-por-horas.html">Por horas</a>
  <a href="/es/flota.html">Flota</a>
  <a href="/popular-routes.html" class="lang-pill" onclick="try{localStorage.setItem('ry_lang','en')}catch(e){}">EN · English</a>
  <a href="/es/#book" class="btn btn-gold">Reserva tu viaje</a>
</div>`
    : `<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu">
  <button class="mm-close" id="mmClose" aria-label="Close menu">${CLOSE}</button>
  <a href="airport-transfers.html">Airport transfers</a>
  <a href="black-car-service.html">Black car service</a>
  <a href="hourly-chauffeur.html">By the hour</a>
  <a href="fleet.html">Fleet</a>
  <a href="es/rutas-populares.html" class="lang-pill" onclick="try{localStorage.setItem('ry_lang','es')}catch(e){}">ES · Español</a>
  <a href="index.html#book" class="btn btn-gold">Book your ride</a>
</div>`;

  const t = es
    ? {
        title: "Rutas de Lujo Populares y Tarifas Fijas | Servicio SUV Negra de Lujo LAX | RideYeah",
        desc: `Traslados al aeropuerto LAX a precio fijo en SUV negra de lujo en las mejores rutas: LAX ⇄ ${cities}.`,
        ogt: "Rutas Populares y Tarifas Fijas | RideYeah",
        ogd: "Servicio de auto de lujo a precio fijo en las rutas más populares del sur de California, desde y hacia LAX.",
        svcName: "Rutas Populares — Tarifas Fijas",
        svcDesc: `Traslados al aeropuerto de lujo a precio fijo entre LAX y las principales ciudades del sur de California: ${cities}.`,
        crumbHome: "Inicio", crumb: "Rutas populares",
        eyebrow: "Tarifas fijas · Sur de California",
        h1a: "Rutas populares,", h1b: "tarifas fijas.",
        lead: "Los traslados al aeropuerto LAX que más hacemos — desde Santa Barbara y el valle de Conejo hasta Anaheim, Long Beach y Pasadena. Un precio transparente, cotizado antes de reservar.",
        view: "Ver ruta →",
        disc: `${DISCLAIMER_ES} ¿No ves tu ruta? <a href="${book}" style="color:var(--gold)">Cotiza aquí</a>.`,
        ctaEyebrow: "En cualquier punto del sur de California", ctaH2: "Obtén tu tarifa fija.",
        ctaP: "Ingresa tu lugar de recogida y destino para un precio total al instante — sin recargos, sin sorpresas.",
        cta: "Ver precios y reservar",
      }
    : {
        title: "Popular Luxury Routes & Fixed Fares | LAX Luxury Black SUV Service | RideYeah",
        desc: `Fixed-price luxury black SUV airport transfers on Southern California's top routes: LAX ⇄ ${cities}.`,
        ogt: "Popular Routes & Fixed Fares | RideYeah",
        ogd: "Fixed-price luxury car service on Southern California's most popular routes, to and from LAX.",
        svcName: "Popular Routes — Fixed Fares",
        svcDesc: `Fixed-price luxury airport transfers between LAX and Southern California's top cities: ${cities}.`,
        crumbHome: "Home", crumb: "Popular routes",
        eyebrow: "Fixed fares · Southern California",
        h1a: "Popular routes,", h1b: "fixed fares.",
        lead: "The LAX airport transfers we run most — from Santa Barbara and the Conejo Valley to Anaheim, Long Beach and Pasadena. One transparent price, quoted before you book.",
        view: "View route →",
        disc: `${DISCLAIMER_EN} Don't see your route? <a href="${book}" style="color:var(--gold)">Get a quote</a>.`,
        ctaEyebrow: "Anywhere in Southern California", ctaH2: "Get your fixed fare.",
        ctaP: "Enter your pickup and destination for an instant, all-in price — no surge, no surprises.",
        cta: "See prices & book",
      };

  const cards = ROUTES.map((r) => {
    const href = es ? `/es/lax-a-${r.slug}.html` : `lax-to-${r.slug}.html`;
    const vehicle = es ? "SUV negra de lujo" : "Luxury Black SUV";
    const lead = es
      ? `~${r.min} min · ${vehicle}. Puerta a puerta entre LAX y ${r.city} — ${r.landmarksEs}.`
      : `~${r.min} min · ${vehicle}. Door-to-door between LAX and ${r.city} — ${r.landmarks}.`;
    return `        <div class="card reveal"><h3 style="font-family:var(--serif);font-weight:400;font-size:22px;margin-bottom:6px">LAX ⇄ ${r.city}</h3><div style="color:var(--gold);font-family:var(--serif);font-size:26px;margin:6px 0 12px">$${r.price}</div><p>${lead}</p><a href="${href}" style="display:inline-block;margin-top:12px;color:var(--gold);font-size:13px;font-weight:600;letter-spacing:.04em">${t.view}</a></div>`;
  }).join("\n");

  const svcLd = JSON.stringify({
    "@context": "https://schema.org", "@type": "Service",
    serviceType: "Point-to-point car service", name: t.svcName, description: t.svcDesc,
    provider: { "@type": "LimousineService", "@id": "https://rideyeah.com/#business" },
    areaServed: { "@type": "State", name: "California" },
    url: es ? esUrl : enUrl,
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="${es ? "es" : "en"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${t.title}</title>
<meta name="description" content="${t.desc}">
<meta name="theme-color" content="#0A0A0B">
<meta name="keywords" content="LAX to Santa Barbara car service, LAX to Camarillo, LAX to Simi Valley, LAX to Thousand Oaks, LAX to Anaheim car service, LAX to Long Beach, LAX to Pasadena, LAX to Calabasas">
<link rel="canonical" href="${es ? esUrl : enUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="es" href="${esUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RideYeah">
<meta property="og:title" content="${t.ogt}">
<meta property="og:description" content="${t.ogd}">
<meta property="og:url" content="${es ? esUrl : enUrl}">
<meta property="og:image" content="https://rideyeah.com/images/og-image.jpg">
<link rel="icon" href="${asset("favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset("apple-touch-icon.png")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,400&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset("assets/site.css")}">
<script type="application/ld+json">
${svcLd}
</script>
</head>
<body>
<a href="#main" class="skip">${es ? "Saltar al contenido" : "Skip to content"}</a>

<header class="nav" id="nav">
  <div class="wrap nav-inner">
    <a href="${home}" class="brand" aria-label="RideYeah — ${es ? "inicio" : "home"}">
      ${LOGO}
      ${WORD}
    </a>
    ${nav}
    <button class="nav-toggle" id="navToggle" aria-label="${es ? "Abrir menú" : "Open menu"}" aria-expanded="false" aria-controls="mobileMenu">${MENU}</button>
  </div>
</header>
${menu}

<main id="main">
  <section class="page-hero">
    <div class="page-hero-photo" style="background-image:${imgset("band_highway", es)}"></div>
    <div class="page-hero-tint"></div>
    <div class="wrap inner">
      <div class="crumb"><a href="${home}">${t.crumbHome}</a> · ${t.crumb}</div>
      <div class="eyebrow"><span class="ln"></span><span>${t.eyebrow}</span></div>
      <h1>${t.h1a}<br><span class="em">${t.h1b}</span></h1>
      <p class="lead">${t.lead}</p>
    </div>
  </section>

  <section class="sec-pad">
    <div class="wrap">
      <div class="grid-3">
${cards}
      </div>
      <p style="font-size:12px;color:var(--mute-2);margin-top:22px;line-height:1.5">${t.disc}</p>
    </div>
  </section>

  <section class="sec-pad alt">
    <div class="wrap">
      <div class="cta-box reveal">
        <span class="eyebrow">${t.ctaEyebrow}</span>
        <h2>${t.ctaH2}</h2>
        <p>${t.ctaP}</p>
        <a href="${book}" class="btn btn-gold" style="padding:16px 38px;font-size:15px">${t.cta} ${A}</a>
      </div>
    </div>
  </section>
</main>

${footerHtml(es)}
</body>
</html>
`;
}

for (const r of ROUTES) {
  writeFileSync(`lax-to-${r.slug}.html`, page(r, "en"), "utf8");
  writeFileSync(`es/lax-a-${r.slug}.html`, page(r, "es"), "utf8");
}
writeFileSync("popular-routes.html", hub("en"), "utf8");
writeFileSync("es/rutas-populares.html", hub("es"), "utf8");
console.log(`✓ Generated ${ROUTES.length} route pages + hub (EN + ES)`);
