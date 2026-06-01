/**
 * RideYeah · Spanish subpage generator
 * ------------------------------------
 * Reads the EN key pages and produces localized Spanish versions under es/
 * with translated copy + root-absolute asset paths + ES slug cross-links +
 * canonical/og:url/lang flips + language-switcher flipped to EN.
 *
 *   airport-transfers.html   -> es/traslados-aeropuerto-lax.html
 *   black-car-service.html   -> es/servicio-black-car.html
 *   fleet.html               -> es/flota.html
 *
 * Run with:  node scripts/generate-es-pages.mjs
 * Re-run whenever an EN source page changes, then `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

/* ---- ES slug map (EN file -> ES slug file) ---- */
const SLUG = {
  "airport-transfers.html": "es/traslados-aeropuerto-lax.html",
  "black-car-service.html": "es/servicio-black-car.html",
  "fleet.html": "es/flota.html",
};

/* ---- shared nav / footer / chrome translations (apply to every page) ---- */
const SHARED = [
  [">Skip to content</a>", ">Saltar al contenido</a>"],
  ['aria-label="RideYeah — home"', 'aria-label="RideYeah — inicio"'],
  ['aria-label="Open menu"', 'aria-label="Abrir menú"'],
  ['aria-label="Close menu"', 'aria-label="Cerrar menú"'],
  /* nav links */
  [">Airport</a>", ">Aeropuerto</a>"],
  [">Fleet</a>", ">Flota</a>"],
  [">About</a>", ">Nosotros</a>"],
  [">Services</a>", ">Servicios</a>"],
  [">Careers</a>", ">Empleo</a>"],
  [">Book now <svg", ">Reservar <svg"],
  /* mobile menu */
  [">Airport transfers</a>", ">Traslados al aeropuerto</a>"],
  [">Black car service</a>", ">Servicio black car</a>"],
  [">By the hour</a>", ">Por horas</a>"],
  [">Book your ride</a>", ">Reserva tu viaje</a>"],
  /* breadcrumb */
  [">Home</a>", ">Inicio</a>"],
  /* footer */
  ["Luxury ground transportation across Los Angeles &amp; Orange County. Arrive relaxed, always on time.",
   "Transporte terrestre de lujo en Los Ángeles y Orange County. Llega relajado, siempre puntual."],
  ["<h3>Services</h3>", "<h3>Servicios</h3>"],
  ["<h3>Company</h3>", "<h3>Empresa</h3>"],
  ["<h3>Contact</h3>", "<h3>Contacto</h3>"],
  [">Popular routes</a>", ">Rutas populares</a>"],
  [">About us</a>", ">Nosotros</a>"],
  [">Our fleet</a>", ">Nuestra flota</a>"],
  [">Contact</a>", ">Contacto</a>"],
  [">Los Angeles, CA</a>", ">Los Ángeles, CA</a>"],
  ["All rights reserved.", "Todos los derechos reservados."],
  ['aria-label="RideYeah on Instagram"', 'aria-label="RideYeah en Instagram"'],
  ['aria-label="RideYeah on TikTok"', 'aria-label="RideYeah en TikTok"'],
];

/* ---- per-page configuration ---- */
const PAGES = [
  {
    src: "airport-transfers.html",
    out: "es/traslados-aeropuerto-lax.html",
    enUrl: "https://rideyeah.com/airport-transfers.html",
    esCanonical: "https://rideyeah.com/es/traslados-aeropuerto-lax",
    map: [
      /* head */
      ["LAX Airport Transfers & Car Service | RideYeah Los Angeles",
       "Traslados al Aeropuerto LAX y Servicio de Auto | RideYeah Los Ángeles"],
      ["Private LAX & SNA airport transfers with flight tracking, meet-and-greet and fixed pricing — in a premium Chevrolet Suburban fleet across Los Angeles & Orange County.",
       "Traslados privados a los aeropuertos LAX y SNA con seguimiento de vuelos, recibimiento personal y tarifas fijas — en una flota premium de Chevrolet Suburban por Los Ángeles y Orange County."],
      ["LAX airport transfer, LAX car service, airport car service Los Angeles, SNA airport transportation, private airport transfer LAX, LAX limo service",
       "traslado aeropuerto LAX, servicio de auto LAX, servicio de auto al aeropuerto Los Ángeles, transporte aeropuerto SNA, traslado privado aeropuerto LAX, servicio de limusina LAX"],
      ["LAX Airport Transfers & Car Service | RideYeah",
       "Traslados al Aeropuerto LAX y Servicio de Auto | RideYeah"],
      ["Private LAX & SNA airport transfers with flight tracking, meet-and-greet and fixed, transparent pricing.",
       "Traslados privados a los aeropuertos LAX y SNA con seguimiento de vuelos, recibimiento personal y tarifas fijas y transparentes."],
      /* JSON-LD */
      ['"serviceType": "Airport transfer & car service"',
       '"serviceType": "Traslado al aeropuerto y servicio de auto"'],
      ['"name": "LAX Airport Transfers"', '"name": "Traslados al Aeropuerto LAX"'],
      ["Private airport transfers to and from LAX, John Wayne (SNA) and Southern California airports, with flight tracking, meet-and-greet and fixed pricing.",
       "Traslados privados desde y hacia LAX, John Wayne (SNA) y los aeropuertos del sur de California, con seguimiento de vuelos, recibimiento personal y tarifas fijas."],
      /* breadcrumb + eyebrow */
      [" · Airport transfers</div>", " · Traslados al aeropuerto</div>"],
      [">LAX · SNA · Private terminals</span>", ">LAX · SNA · Terminales privadas</span>"],
      /* hero */
      ['LAX airport transfers,<br><span class="em">done right.</span>',
       'Traslados al aeropuerto LAX,<br><span class="em">bien hechos.</span>'],
      ["Private car service to and from Los Angeles International (LAX), John Wayne (SNA) and every Southern California airport — with live flight tracking, meet-and-greet and a fixed price quoted upfront.",
       "Servicio de auto privado desde y hacia Los Ángeles Internacional (LAX), John Wayne (SNA) y todos los aeropuertos del sur de California — con seguimiento de vuelos en vivo, recibimiento personal y un precio fijo cotizado por adelantado."],
      [">Book your transfer <svg", ">Reserva tu traslado <svg"],
      /* how it works */
      [">How it works</span>", ">Cómo funciona</span>"],
      ["Curb to cabin, without the stress.", "De la acera a la cabina, sin estrés."],
      ["<h3>We track your flight</h3>", "<h3>Seguimos tu vuelo</h3>"],
      ["Early or delayed, we adjust your pickup automatically. Complimentary wait time is included on every airport arrival.",
       "Temprano o con retraso, ajustamos tu recogida automáticamente. El tiempo de espera de cortesía está incluido en cada llegada al aeropuerto."],
      ["<h3>Meet &amp; greet</h3>", "<h3>Recibimiento personal</h3>"],
      ["Your chauffeur meets you at the curb or in arrivals with a name sign, helps with luggage and walks you to the car.",
       "Tu chofer te recibe en la acera o en llegadas con un cartel con tu nombre, te ayuda con el equipaje y te acompaña al auto."],
      ["<h3>One fixed price</h3>", "<h3>Un precio fijo</h3>"],
      ["See your all-in fare before you book — tolls and gratuity included. No surge, no meter, no surprises.",
       "Mira tu tarifa total antes de reservar — peajes y propina incluidos. Sin recargos, sin taxímetro, sin sorpresas."],
      /* airports we serve */
      [">Airports we serve</span>", ">Aeropuertos que cubrimos</span>"],
      ["Every Southern California gateway.", "Cada puerta de entrada al sur de California."],
      ["<strong>LAX</strong> — Los Angeles International <span>· all terminals &amp; private aviation (Signature, Atlantic)</span>",
       "<strong>LAX</strong> — Los Ángeles Internacional <span>· todas las terminales y aviación privada (Signature, Atlantic)</span>"],
      ["<strong>BUR</strong> — Hollywood Burbank &amp; <strong>LGB</strong> — Long Beach",
       "<strong>BUR</strong> — Hollywood Burbank y <strong>LGB</strong> — Long Beach"],
      ["Hotel, residence or office <span>· door-to-door anywhere in LA &amp; OC</span>",
       "Hotel, residencia u oficina <span>· puerta a puerta en todo LA y OC</span>"],
      [">See prices &amp; book <svg", ">Ver precios y reservar <svg"],
      /* fares */
      [">Popular LAX fares</span>", ">Tarifas LAX populares</span>"],
      ["Fixed airport prices.", "Precios fijos al aeropuerto."],
      ["LAX → Downtown LA", "LAX → Centro de LA"],
      ['Indicative fares. See all <a href="popular-routes.html" style="color:var(--gold)">popular routes</a> or get your exact quote at booking.',
       'Tarifas indicativas. Ve todas las <a href="popular-routes.html" style="color:var(--gold)">rutas populares</a> u obtén tu tarifa exacta al reservar.'],
      /* CTA */
      [">Ready when you land</span>", ">Listos cuando aterrices</span>"],
      ["Book your LAX transfer.", "Reserva tu traslado LAX."],
      ["Fixed price, flight tracking, professional chauffeur. The easiest part of your trip.",
       "Precio fijo, seguimiento de vuelo, chofer profesional. La parte más fácil de tu viaje."],
      [">Reserve your ride <svg", ">Reserva tu viaje <svg"],
    ],
  },
  {
    src: "black-car-service.html",
    out: "es/servicio-black-car.html",
    enUrl: "https://rideyeah.com/black-car-service.html",
    esCanonical: "https://rideyeah.com/es/servicio-black-car",
    map: [
      /* head */
      ["Black Car Service Los Angeles | Executive Car Hire | RideYeah",
       "Servicio Black Car en Los Ángeles | Chofer Ejecutivo | RideYeah"],
      ["Premium black car service in Los Angeles & Orange County — executive Chevrolet Suburban SUVs with professional chauffeurs, fixed pricing and total discretion.",
       "Servicio black car premium en Los Ángeles y Orange County — SUV ejecutivas Chevrolet Suburban con choferes profesionales, tarifas fijas y total discreción."],
      ["black car service Los Angeles, luxury car service LA, executive car service, town car service, chauffeured car service Orange County",
       "servicio black car Los Ángeles, servicio de auto de lujo LA, servicio de auto ejecutivo, servicio de town car, servicio de auto con chofer Orange County"],
      ["Black Car Service Los Angeles | RideYeah", "Servicio Black Car en Los Ángeles | RideYeah"],
      ["Executive black car service across LA & Orange County — professional chauffeurs, premium vehicles, fixed pricing.",
       "Servicio black car ejecutivo en LA y Orange County — choferes profesionales, vehículos premium, tarifas fijas."],
      /* JSON-LD */
      ['"serviceType": "Black car & executive chauffeur service"',
       '"serviceType": "Servicio black car y chofer ejecutivo"'],
      ['"name": "Black Car Service Los Angeles"', '"name": "Servicio Black Car en Los Ángeles"'],
      ["Executive black car service with professional chauffeurs and premium Chevrolet Suburban SUVs across Los Angeles and Orange County, with fixed, transparent pricing.",
       "Servicio black car ejecutivo con choferes profesionales y SUV premium Chevrolet Suburban en Los Ángeles y Orange County, con tarifas fijas y transparentes."],
      /* breadcrumb + eyebrow */
      [" · Black car service</div>", " · Servicio black car</div>"],
      [">Executive · Los Angeles &amp; Orange County</span>", ">Ejecutivo · Los Ángeles y Orange County</span>"],
      /* hero */
      ['Black car service,<br><span class="em">Los Angeles.</span>',
       'Servicio black car,<br><span class="em">Los Ángeles.</span>'],
      ["A professional chauffeur and an immaculate executive Chevrolet Suburban — for boardrooms, events, dinners and nights out. Discreet, punctual and priced upfront.",
       "Un chofer profesional y una impecable Chevrolet Suburban ejecutiva — para reuniones, eventos, cenas y noches fuera. Discreto, puntual y con precio por adelantado."],
      [">Book a black car <svg", ">Reserva un black car <svg"],
      /* when to book */
      [">When to book</span>", ">Cuándo reservar</span>"],
      ["For every occasion that<br>deserves more than a rideshare.",
       "Para cada ocasión que<br>merece más que un viaje compartido."],
      ["<h3>Corporate &amp; business</h3>", "<h3>Corporativo y negocios</h3>"],
      ["Client pickups, roadshows and board meetings. Consolidated billing and account management for teams that move often.",
       "Recogidas de clientes, roadshows y reuniones de directorio. Facturación consolidada y gestión de cuenta para equipos que viajan a menudo."],
      ["<h3>Events &amp; nights out</h3>", "<h3>Eventos y noches fuera</h3>"],
      ["Galas, premieres, weddings and dinners. Arrive composed and let your chauffeur handle the parking and the traffic.",
       "Galas, estrenos, bodas y cenas. Llega sereno y deja que tu chofer se encargue del estacionamiento y el tráfico."],
      ["<h3>VIP &amp; private</h3>", "<h3>VIP y privado</h3>"],
      ["Discreet service for visiting executives and guests who value privacy, reliability and a familiar standard every time.",
       "Servicio discreto para ejecutivos de visita e invitados que valoran la privacidad, la fiabilidad y un estándar familiar cada vez."],
      /* why RideYeah */
      [">Why RideYeah</span>", ">Por qué RideYeah</span>"],
      ["The standard, every single ride.", "El mismo estándar, en cada viaje."],
      ["Licensed, insured, professionally trained chauffeurs",
       "Choferes con licencia, asegurados y capacitados profesionalmente"],
      ["Late-model Chevrolet Suburban SUVs <span>· detailed before every ride</span>",
       "SUV Chevrolet Suburban de último modelo <span>· detalladas antes de cada viaje</span>"],
      ["Fixed, transparent pricing <span>· no surge, no meter</span>",
       "Tarifas fijas y transparentes <span>· sin recargos, sin taxímetro</span>"],
      ["On-time guarantee on every booking", "Garantía de puntualidad en cada reserva"],
      [">View the fleet</a>", ">Ver la flota</a>"],
      /* CTA */
      [">Ready when you are</span>", ">Cuando tú quieras</span>"],
      ["Book your black car.", "Reserva tu black car."],
      ["Executive Chevrolet Suburban, professional chauffeur, fixed price. Reserve in under a minute.",
       "Chevrolet Suburban ejecutiva, chofer profesional, precio fijo. Reserva en menos de un minuto."],
      [">Reserve your ride <svg", ">Reserva tu viaje <svg"],
    ],
  },
  {
    src: "fleet.html",
    out: "es/flota.html",
    enUrl: "https://rideyeah.com/fleet.html",
    esCanonical: "https://rideyeah.com/es/flota",
    map: [
      /* head */
      ["Our Fleet · Chevrolet Suburban Chauffeur Service | RideYeah",
       "Nuestra Flota · Servicio de Chofer Chevrolet Suburban | RideYeah"],
      ["RideYeah operates a dedicated fleet of 20+ Chevrolet Suburban SUVs — spacious executive comfort, premium leather, onboard Wi-Fi and professional chauffeurs across Los Angeles & Orange County.",
       "RideYeah opera una flota dedicada de más de 20 SUV Chevrolet Suburban — amplio confort ejecutivo, piel premium, Wi-Fi a bordo y choferes profesionales en Los Ángeles y Orange County."],
      ["Chevrolet Suburban chauffeur service, luxury SUV transportation Los Angeles, executive SUV service, private SUV service LAX",
       "servicio de chofer Chevrolet Suburban, transporte SUV de lujo Los Ángeles, servicio SUV ejecutivo, servicio SUV privado LAX"],
      ["Our Fleet · The Chevrolet Suburban | RideYeah", "Nuestra Flota · La Chevrolet Suburban | RideYeah"],
      ["A dedicated fleet of premium Chevrolet Suburban SUVs — one consistent, executive standard for every ride.",
       "Una flota dedicada de SUV premium Chevrolet Suburban — un estándar ejecutivo y consistente en cada viaje."],
      /* JSON-LD */
      ['"serviceType": "Luxury SUV transportation (Chevrolet Suburban)"',
       '"serviceType": "Transporte SUV de lujo (Chevrolet Suburban)"'],
      ['"name": "Chevrolet Suburban Chauffeur Service"', '"name": "Servicio de Chofer Chevrolet Suburban"'],
      ["A dedicated fleet of 20+ full-size Chevrolet Suburban SUVs with professional chauffeurs, offering a consistent executive transportation experience across Los Angeles and Orange County.",
       "Una flota dedicada de más de 20 SUV Chevrolet Suburban de tamaño completo con choferes profesionales, que ofrece una experiencia de transporte ejecutivo consistente en Los Ángeles y Orange County."],
      /* breadcrumb + eyebrow */
      [" · Fleet</div>", " · Flota</div>"],
      [">Our fleet · Chevrolet Suburban 2026</span>", ">Nuestra flota · Chevrolet Suburban 2026</span>"],
      /* hero */
      ['The Chevrolet Suburban.<br><span class="em">Every ride.</span>',
       'La Chevrolet Suburban.<br><span class="em">En cada viaje.</span>'],
      ["We operate one vehicle, deliberately: a fleet of 20+ full-size Chevrolet Suburban SUVs. One standard of space, comfort and discretion — every time, across Los Angeles &amp; Orange County.",
       "Operamos un solo vehículo, a propósito: una flota de más de 20 SUV Chevrolet Suburban de tamaño completo. Un mismo estándar de espacio, confort y discreción — siempre, en Los Ángeles y Orange County."],
      [">Reserve your Suburban <svg", ">Reserva tu Suburban <svg"],
      /* why one vehicle */
      [">Why one vehicle</span>", ">Por qué un solo vehículo</span>"],
      ["Standardized luxury is a<br>feature — not a limit.",
       "El lujo estandarizado es una<br>ventaja — no un límite."],
      ["<h3>Total consistency</h3>", "<h3>Consistencia total</h3>"],
      ["Every booking is the same premium Suburban — the experience never depends on which car happens to show up.",
       "Cada reserva es la misma Suburban premium — la experiencia nunca depende de qué auto aparezca."],
      ["<h3>Room for everyone</h3>", "<h3>Espacio para todos</h3>"],
      ["Seats up to 6 with luggage to spare — ideal for executives, families and airport runs with bags.",
       "Hasta 6 pasajeros con espacio de sobra para el equipaje — ideal para ejecutivos, familias y viajes al aeropuerto con maletas."],
      ["<h3>Reliability at scale</h3>", "<h3>Fiabilidad a escala</h3>"],
      ["A managed fleet of 20+ vehicles and professional chauffeurs means availability whenever you need it.",
       "Una flota gestionada de más de 20 vehículos y choferes profesionales significa disponibilidad cuando la necesites."],
      /* inside every Suburban */
      [">Inside every Suburban</span>", ">Dentro de cada Suburban</span>"],
      ["Executive comfort, as standard.", "Confort ejecutivo, de serie."],
      ["Up to 6 passengers &amp; <span>6+ large bags</span>",
       "Hasta 6 pasajeros y <span>6+ maletas grandes</span>"],
      ["Hand-finished leather &amp; <span>climate dialed to your preference</span>",
       "Piel de acabado fino y <span>clima a tu preferencia</span>"],
      ["Onboard Wi-Fi, phone chargers &amp; <span>complimentary chilled water</span>",
       "Wi-Fi a bordo, cargadores y <span>agua fría de cortesía</span>"],
      ["Detailed before every ride &amp; <span>operated by a licensed, vetted chauffeur</span>",
       "Detallada antes de cada viaje y <span>operada por un chofer con licencia y verificado</span>"],
      [">Reserve your ride <svg", ">Reserva tu viaje <svg"],
      /* CTA */
      [">One standard, every ride</span>", ">Un estándar, cada viaje</span>"],
      ["Reserve your Suburban.", "Reserva tu Suburban."],
      ["Spacious, executive, immaculate — with a professional chauffeur and a fixed price quoted upfront.",
       "Espaciosa, ejecutiva, impecable — con un chofer profesional y un precio fijo cotizado por adelantado."],
      [">Get your fixed quote <svg", ">Obtén tu tarifa fija <svg"],
    ],
  },
];

mkdirSync("es", { recursive: true });

for (const page of PAGES) {
  let h = readFileSync(page.src, "utf8");
  const rep = (a, b) => { h = h.split(a).join(b); };

  /* 1 · content translations (page-specific then shared chrome) */
  for (const [a, b] of page.map) rep(a, b);
  for (const [a, b] of SHARED) rep(a, b);

  /* 2 · lang + canonical + og:url */
  rep('<html lang="en">', '<html lang="es">');
  rep('rel="canonical" href="' + page.enUrl + '"', 'rel="canonical" href="' + page.esCanonical + '"');
  rep('property="og:url" content="' + page.enUrl + '"', 'property="og:url" content="' + page.esCanonical + '"');
  rep('"url": "' + page.enUrl + '"', '"url": "' + page.esCanonical + '"');

  /* 3 · language switcher: flip ES pill -> EN pill (back to the EN equivalent) */
  const esSlug = SLUG[page.src];
  rep('<a href="' + esSlug + '" class="lang-pill" onclick="try{localStorage.setItem(\'ry_lang\',\'es\')}catch(e){}" aria-label="Ver en español">ES</a>',
      '<a href="/' + page.src + '" class="lang-pill" onclick="try{localStorage.setItem(\'ry_lang\',\'en\')}catch(e){}" aria-label="View in English">EN</a>');
  rep('<a href="' + esSlug + '" class="lang-pill" onclick="try{localStorage.setItem(\'ry_lang\',\'es\')}catch(e){}">ES · Español</a>',
      '<a href="/' + page.src + '" class="lang-pill" onclick="try{localStorage.setItem(\'ry_lang\',\'en\')}catch(e){}">EN · English</a>');

  /* 4 · internal links -> ES slugs where they exist, else root-absolute EN */
  rep('href="index.html#book"', 'href="/es/#book"');
  rep('href="index.html#services"', 'href="/es/#services"');
  rep('href="index.html#contact"', 'href="/es/#contact"');
  rep('href="index.html"', 'href="/es/"');
  rep('href="airport-transfers.html"', 'href="/es/traslados-aeropuerto-lax.html"');
  rep('href="black-car-service.html"', 'href="/es/servicio-black-car.html"');
  rep('href="fleet.html"', 'href="/es/flota.html"');
  /* remaining EN .html links (about, careers, hourly, popular-routes) -> root-absolute */
  h = h.replace(/href="([a-z0-9-]+\.html)"/g, 'href="/$1"');

  /* 5 · asset paths -> root-absolute (so they resolve from /es/) */
  rep('href="assets/', 'href="/assets/');
  rep('src="assets/', 'src="/assets/');
  rep('href="favicon.svg"', 'href="/favicon.svg"');
  rep('href="apple-touch-icon.png"', 'href="/apple-touch-icon.png"');
  h = h.replace(/url\('images\//g, "url('/images/");
  h = h.replace(/url\("images\//g, 'url("/images/');

  writeFileSync(page.out, h, "utf8");
  console.log("✓ " + page.out + "  (" + (h.length / 1024).toFixed(0) + " KB)");
}
