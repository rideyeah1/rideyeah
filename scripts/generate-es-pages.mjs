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
  "about.html": "es/nosotros.html",
  "careers.html": "es/empleo.html",
  "hourly-chauffeur.html": "es/chofer-por-horas.html",
  "popular-routes.html": "es/rutas-populares.html",
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
  [">Routes</a>", ">Rutas</a>"],
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
  /* route-card vehicle label */
  ["· Luxury Black SUV</div>", "· SUV negra de lujo</div>"],
];

/* ---- strings shared by the 4 LAX→ route landing pages ---- */
const ROUTE_COMMON = [
  [">Good to know</span>", ">Bueno saberlo</span>"],
  ['<div class="l">Typical drive time</div>', '<div class="l">Tiempo de viaje habitual</div>'],
  ['<div class="l">Fixed fare, all-in</div>', '<div class="l">Tarifa fija, todo incluido</div>'],
  [">Get your fixed quote <svg", ">Obtén tu tarifa fija <svg"],
  [">Reserve this route <svg", ">Reserva esta ruta <svg"],
  ["Fixed price, flight tracking, professional chauffeur in a private luxury black SUV.",
   "Precio fijo, seguimiento de vuelo y chofer profesional en una SUV negra de lujo privada."],
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
      ["Private LAX & SNA airport transfers with flight tracking, meet-and-greet and fixed pricing — in a premium luxury black SUV fleet across Los Angeles & Orange County.",
       "Traslados privados a los aeropuertos LAX y SNA con seguimiento de vuelos, recibimiento personal y tarifas fijas — en una flota premium de SUV negras de lujo por Los Ángeles y Orange County."],
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
      ["Premium black car service in Los Angeles & Orange County — executive luxury black SUVs with professional chauffeurs, fixed pricing and total discretion.",
       "Servicio black car premium en Los Ángeles y Orange County — SUV negras de lujo ejecutivas con choferes profesionales, tarifas fijas y total discreción."],
      ["black car service Los Angeles, luxury car service LA, executive car service, town car service, chauffeured car service Orange County",
       "servicio black car Los Ángeles, servicio de auto de lujo LA, servicio de auto ejecutivo, servicio de town car, servicio de auto con chofer Orange County"],
      ["Black Car Service Los Angeles | RideYeah", "Servicio Black Car en Los Ángeles | RideYeah"],
      ["Executive black car service across LA & Orange County — professional chauffeurs, premium vehicles, fixed pricing.",
       "Servicio black car ejecutivo en LA y Orange County — choferes profesionales, vehículos premium, tarifas fijas."],
      /* JSON-LD */
      ['"serviceType": "Black car & executive chauffeur service"',
       '"serviceType": "Servicio black car y chofer ejecutivo"'],
      ['"name": "Black Car Service Los Angeles"', '"name": "Servicio Black Car en Los Ángeles"'],
      ["Executive black car service with professional chauffeurs and premium luxury black SUVs across Los Angeles and Orange County, with fixed, transparent pricing.",
       "Servicio black car ejecutivo con choferes profesionales y SUV negras de lujo premium en Los Ángeles y Orange County, con tarifas fijas y transparentes."],
      /* breadcrumb + eyebrow */
      [" · Black car service</div>", " · Servicio black car</div>"],
      [">Executive · Los Angeles &amp; Orange County</span>", ">Ejecutivo · Los Ángeles y Orange County</span>"],
      /* hero */
      ['Black car service,<br><span class="em">Los Angeles.</span>',
       'Servicio black car,<br><span class="em">Los Ángeles.</span>'],
      ["A professional chauffeur and an immaculate executive luxury black SUV — for boardrooms, events, dinners and nights out. Discreet, punctual and priced upfront.",
       "Un chofer profesional y una impecable SUV negra de lujo ejecutiva — para reuniones, eventos, cenas y noches fuera. Discreto, puntual y con precio por adelantado."],
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
      ["Late-model luxury black SUVs <span>· detailed before every ride</span>",
       "SUV negra de lujo de último modelo <span>· detalladas antes de cada viaje</span>"],
      ["Fixed, transparent pricing <span>· no surge, no meter</span>",
       "Tarifas fijas y transparentes <span>· sin recargos, sin taxímetro</span>"],
      ["On-time guarantee on every booking", "Garantía de puntualidad en cada reserva"],
      [">View the fleet</a>", ">Ver la flota</a>"],
      /* CTA */
      [">Ready when you are</span>", ">Cuando tú quieras</span>"],
      ["Book your black car.", "Reserva tu black car."],
      ["Executive luxury black SUV, professional chauffeur, fixed price. Reserve in under a minute.",
       "SUV negra de lujo ejecutiva, chofer profesional, precio fijo. Reserva en menos de un minuto."],
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
      ["Our Fleet · Luxury Black SUV Chauffeur Service | RideYeah",
       "Nuestra Flota · Servicio de Chofer en SUV Negra de Lujo | RideYeah"],
      ["RideYeah operates a fleet of 20+ premium full-size luxury black SUVs with spacious executive comfort, premium leather, onboard Wi-Fi and professional chauffeurs across Los Angeles & Orange County.",
       "RideYeah opera una flota de más de 20 SUV negras de lujo premium de tamaño completo con amplio confort ejecutivo, piel premium, Wi-Fi a bordo y choferes profesionales en Los Ángeles y Orange County."],
      ["luxury black SUV chauffeur service Los Angeles, executive SUV service, Cadillac Escalade chauffeur, full-size luxury black SUV service, private SUV service LAX",
       "servicio de chofer en SUV negra de lujo Los Ángeles, servicio SUV ejecutivo, chofer Cadillac Escalade, servicio SUV negra de lujo de tamaño completo, servicio SUV privado LAX"],
      ["Our Fleet · Luxury Black SUVs | RideYeah", "Nuestra Flota · SUV Negras de Lujo | RideYeah"],
      ["A fleet of premium full-size luxury black SUVs — one consistent, executive standard for every ride.",
       "Una flota de SUV negras de lujo premium de tamaño completo — un estándar ejecutivo y consistente en cada viaje."],
      /* JSON-LD */
      ['"serviceType": "Luxury Black SUV transportation"',
       '"serviceType": "Transporte en SUV negra de lujo"'],
      ['"name": "Luxury Black SUV Chauffeur Service"', '"name": "Servicio de Chofer en SUV Negra de Lujo"'],
      ["A fleet of 20+ premium full-size luxury black SUVs with professional chauffeurs, offering a consistent executive transportation experience across Los Angeles and Orange County.",
       "Una flota de más de 20 SUV negras de lujo premium de tamaño completo con choferes profesionales, que ofrece una experiencia de transporte ejecutivo consistente en Los Ángeles y Orange County."],
      /* breadcrumb + eyebrow */
      [" · Fleet</div>", " · Flota</div>"],
      [">Our fleet · Luxury Black SUVs</span>", ">Nuestra flota · SUV negra de lujo</span>"],
      /* hero */
      ['Luxury Black SUVs.<br><span class="em">Every ride.</span>',
       'SUV negras de lujo.<br><span class="em">En cada viaje.</span>'],
      ["We run a fleet of 20+ premium full-size luxury black SUVs, held to one standard of space, comfort and discretion, every time, across Los Angeles &amp; Orange County.",
       "Operamos una flota de más de 20 SUV negras de lujo premium de tamaño completo con un mismo estándar de espacio, confort y discreción, siempre, en Los Ángeles y Orange County."],
      /* why RideYeah */
      [">Why RideYeah</span>", ">Por qué RideYeah</span>"],
      ["Every SUV, held to<br>one exacting standard.",
       "Cada SUV, con un<br>mismo estándar exigente."],
      ["<h3>Total consistency</h3>", "<h3>Consistencia total</h3>"],
      ["Every booking is a premium full-size SUV, maintained to one exacting standard — so your experience never depends on which car shows up.",
       "Cada reserva es un SUV premium de tamaño completo, mantenido con un mismo estándar exigente — para que tu experiencia nunca dependa de qué auto aparezca."],
      ["<h3>Room for everyone</h3>", "<h3>Espacio para todos</h3>"],
      ["Seats up to 7 with luggage to spare — ideal for executives, families and airport runs with bags.",
       "Hasta 7 pasajeros con espacio de sobra para el equipaje — ideal para ejecutivos, familias y viajes al aeropuerto con maletas."],
      ["<h3>Reliability at scale</h3>", "<h3>Fiabilidad a escala</h3>"],
      ["A managed fleet of 20+ luxury black SUVs and professional chauffeurs means availability whenever you need it.",
       "Una flota gestionada de más de 20 SUV negras de lujo y choferes profesionales significa disponibilidad cuando la necesites."],
      /* inside every SUV */
      [">Inside every SUV</span>", ">Dentro de cada SUV</span>"],
      ["Executive comfort, as standard.", "Confort ejecutivo, de serie."],
      ["Up to 7 passengers &amp; <span>6+ large bags</span>",
       "Hasta 7 pasajeros y <span>6+ maletas grandes</span>"],
      ["Hand-finished leather &amp; <span>climate dialed to your preference</span>",
       "Piel de acabado fino y <span>clima a tu preferencia</span>"],
      ["Onboard Wi-Fi, phone chargers &amp; <span>complimentary chilled water</span>",
       "Wi-Fi a bordo, cargadores y <span>agua fría de cortesía</span>"],
      ["Detailed before every ride &amp; <span>operated by a licensed, vetted chauffeur</span>",
       "Detallada antes de cada viaje y <span>operada por un chofer con licencia y verificado</span>"],
      [">Reserve your ride <svg", ">Reserva tu viaje <svg"],
      /* CTA */
      [">One standard, every ride</span>", ">Un estándar, cada viaje</span>"],
      ["Reserve your luxury black SUV.", "Reserva tu SUV negra de lujo."],
      ["Spacious, executive, immaculate — with a professional chauffeur and a fixed price quoted upfront.",
       "Espaciosa, ejecutiva, impecable — con un chofer profesional y un precio fijo cotizado por adelantado."],
      [">Get your fixed quote <svg", ">Obtén tu tarifa fija <svg"],
    ],
  },
  {
    src: "about.html",
    out: "es/nosotros.html",
    enUrl: "https://rideyeah.com/about.html",
    esCanonical: "https://rideyeah.com/es/nosotros",
    map: [
      /* head */
      ["About us · RideYeah — Luxury Ground Transportation",
       "Nosotros · RideYeah — Transporte Terrestre de Lujo"],
      ["RideYeah is a luxury ground-transportation company serving Los Angeles and Orange County. Discreet, punctual chauffeur service with fixed, transparent pricing.",
       "RideYeah es una empresa de transporte terrestre de lujo en Los Ángeles y Orange County. Servicio de chofer discreto y puntual con tarifas fijas y transparentes."],
      ["About RideYeah · Luxury Ground Transportation", "Sobre RideYeah · Transporte Terrestre de Lujo"],
      ["Discreet, punctual chauffeur service across LA & Orange County, with fixed transparent pricing.",
       "Servicio de chofer discreto y puntual en LA y Orange County, con tarifas fijas y transparentes."],
      /* breadcrumb + eyebrow */
      [" · About</div>", " · Nosotros</div>"],
      [">About RideYeah</span>", ">Sobre RideYeah</span>"],
      /* hero */
      ['Luxury, measured<br>in <span class="em">calm.</span>',
       'Lujo, medido<br>en <span class="em">calma.</span>'],
      ["We move executives, families and visitors across Los Angeles and Orange County with the discretion, punctuality and quiet comfort the moment deserves.",
       "Movemos a ejecutivos, familias y visitantes por Los Ángeles y Orange County con la discreción, la puntualidad y el confort silencioso que el momento merece."],
      /* story */
      [">Our story</span>", ">Nuestra historia</span>"],
      ["Built for the ride that matters.", "Hecho para el viaje que importa."],
      ["RideYeah began with a simple belief: getting there should feel as considered as the destination. No surge pricing, no uncertainty at the curb — just a professional chauffeur, a spotless car and a fixed price quoted upfront.",
       "RideYeah nació de una idea simple: llegar debería sentirse tan cuidado como el destino. Sin recargos por demanda, sin incertidumbre en la acera — solo un chofer profesional, un auto impecable y un precio fijo cotizado por adelantado."],
      ["From <strong>LAX</strong> and <strong>John Wayne (SNA)</strong> to downtown boardrooms and weekend getaways in Santa Barbara or Palm Springs, every detail is handled so you can simply step in and let the city move around you.",
       "Desde <strong>LAX</strong> y <strong>John Wayne (SNA)</strong> hasta salas de juntas en el centro y escapadas de fin de semana a Santa Bárbara o Palm Springs, cada detalle está resuelto para que solo subas y dejes que la ciudad se mueva a tu alrededor."],
      /* values */
      [">What we stand for</span>", ">En lo que creemos</span>"],
      ["Principles, not promises.", "Principios, no promesas."],
      ["<h3>Punctuality</h3>", "<h3>Puntualidad</h3>"],
      ["On-time guarantee with live flight tracking. If we're late, the wait is on us.",
       "Garantía de puntualidad con seguimiento de vuelos en vivo. Si llegamos tarde, la espera corre por nuestra cuenta."],
      ["<h3>Discretion</h3>", "<h3>Discreción</h3>"],
      ["Vetted, licensed and insured chauffeurs who value your privacy and your time.",
       "Choferes verificados, con licencia y asegurados que valoran tu privacidad y tu tiempo."],
      ["<h3>Transparency</h3>", "<h3>Transparencia</h3>"],
      ["Fixed fares quoted upfront. No surge, no surprises — ever.",
       "Tarifas fijas cotizadas por adelantado. Sin recargos, sin sorpresas — nunca."],
      /* stats */
      ['<div class="l">Booking &amp; support</div>', '<div class="l">Reservas y soporte</div>'],
      ['<div class="l">Airports &amp; private terminals</div>', '<div class="l">Aeropuertos y terminales privadas</div>'],
      ['<div class="l">Licensed &amp; insured chauffeurs</div>', '<div class="l">Choferes con licencia y seguro</div>'],
      /* CTA */
      [">Ready when you are</span>", ">Cuando tú quieras</span>"],
      ["Experience the difference.", "Vive la diferencia."],
      ["Book in under a minute. Fixed price, professional chauffeur, on time — every time.",
       "Reserva en menos de un minuto. Precio fijo, chofer profesional, puntual — siempre."],
      [">Reserve your ride <svg", ">Reserva tu viaje <svg"],
    ],
  },
  {
    src: "careers.html",
    out: "es/empleo.html",
    enUrl: "https://rideyeah.com/careers.html",
    esCanonical: "https://rideyeah.com/es/empleo",
    map: [
      /* head */
      ["Careers · Drive with RideYeah — Chauffeur Jobs in Los Angeles",
       "Empleo · Conduce con RideYeah — Trabajo de Chofer en Los Ángeles"],
      ["RideYeah is hiring professional chauffeurs (drivers) across Los Angeles & Orange County. Competitive pay, flexible schedule, premium vehicles. Apply today.",
       "RideYeah busca choferes profesionales (drivers) en Los Ángeles y Orange County. Pago competitivo, horario flexible, vehículos premium. Postúlate hoy."],
      ["Drive with RideYeah · Chauffeur Jobs in Los Angeles", "Conduce con RideYeah · Trabajo de Chofer en Los Ángeles"],
      ["We're hiring professional drivers across LA & Orange County. Competitive pay, flexible schedule, premium vehicles.",
       "Buscamos choferes profesionales en LA y Orange County. Pago competitivo, horario flexible, vehículos premium."],
      /* JSON-LD */
      ['"title": "Professional Chauffeur / Driver"', '"title": "Chofer profesional / Driver"'],
      ["RideYeah is hiring professional, licensed chauffeurs to provide luxury ground transportation across Los Angeles and Orange County. Drivers operate our fleet of late-model luxury black SUVs, providing airport transfers and private chauffeur service with discretion and punctuality.",
       "RideYeah busca choferes profesionales y con licencia para brindar transporte terrestre de lujo en Los Ángeles y Orange County. Los choferes operan nuestra flota de SUV negras de lujo de último modelo, ofreciendo traslados al aeropuerto y servicio de chofer privado con discreción y puntualidad."],
      /* breadcrumb + eyebrow */
      [" · Careers</div>", " · Empleo</div>"],
      [">We're hiring drivers</span>", ">Buscamos choferes</span>"],
      /* hero */
      ['Drive with <span class="em">RideYeah.</span>', 'Conduce con <span class="em">RideYeah.</span>'],
      ["We're looking for professional, courteous chauffeurs across Los Angeles &amp; Orange County. Premium cars, real respect and pay that reflects the standard we hold.",
       "Buscamos choferes profesionales y atentos en Los Ángeles y Orange County. Autos premium, respeto de verdad y un pago a la altura del estándar que mantenemos."],
      [">Apply now <svg", ">Postúlate ahora <svg"],
      /* why */
      [">Why drive with us</span>", ">Por qué conducir con nosotros</span>"],
      ["A driver's seat worth taking.", "Un asiento que vale la pena tomar."],
      ["<h3>Competitive pay</h3>", "<h3>Pago competitivo</h3>"],
      ["Strong base rates plus tips. You're paid for your professionalism, not squeezed by an algorithm.",
       "Tarifas base sólidas más propinas. Te pagamos por tu profesionalismo, no te exprime un algoritmo."],
      ["<h3>Flexible schedule</h3>", "<h3>Horario flexible</h3>"],
      ["Full-time or part-time shifts that fit your life. Pick up airport runs, corporate days or evenings.",
       "Turnos de tiempo completo o parcial que se adaptan a tu vida. Toma traslados al aeropuerto, días corporativos o noches."],
      ["<h3>Premium fleet &amp; respect</h3>", "<h3>Flota premium y respeto</h3>"],
      ["Drive immaculate, late-model vehicles and represent a brand that values its chauffeurs.",
       "Conduce vehículos impecables de último modelo y representa una marca que valora a sus choferes."],
      /* role */
      [">The role</span>", ">El puesto</span>"],
      [">Professional chauffeur</h2>", ">Chofer profesional</h2>"],
      ["You'll provide airport transfers and private chauffeur service across LA &amp; Orange County — greeting guests, handling luggage and delivering a calm, on-time, five-star ride every time.",
       "Brindarás traslados al aeropuerto y servicio de chofer privado en LA y Orange County — recibiendo a los pasajeros, gestionando el equipaje y ofreciendo un viaje tranquilo, puntual y de cinco estrellas cada vez."],
      ["Valid California driver's license &amp; <span>clean driving record</span>",
       "Licencia de conducir de California vigente y <span>historial de manejo limpio</span>"],
      ["21+ years old &amp; <span>eligible to work in the US</span>",
       "Mayor de 21 años y <span>con permiso para trabajar en EE. UU.</span>"],
      ["Professional appearance &amp; <span>excellent customer service</span>",
       "Presentación profesional y <span>excelente servicio al cliente</span>"],
      ["Knowledge of LA / OC routes &amp; <span>smartphone comfortable</span>",
       "Conocimiento de las rutas de LA / OC y <span>buen manejo del smartphone</span>"],
      ["Livery / TCP or chauffeur experience <span>— a plus, not required</span>",
       "Experiencia de livery / TCP o como chofer <span>— un plus, no un requisito</span>"],
      /* how to apply */
      [">How to apply</span>", ">Cómo postularte</span>"],
      ["Three steps to the wheel.", "Tres pasos al volante."],
      ["<h3>Send your details</h3>", "<h3>Envía tus datos</h3>"],
      ["Email us your info using the button below — it pre-fills everything we need.",
       "Escríbenos tu información con el botón de abajo — ya viene con todo lo que necesitamos."],
      ["<h3>Quick interview</h3>", "<h3>Entrevista rápida</h3>"],
      ["A short call and a check of your license and driving record.",
       "Una llamada corta y una verificación de tu licencia e historial de manejo."],
      ["<h3>Onboard &amp; drive</h3>", "<h3>Súbete y conduce</h3>"],
      ["Get set up with the app and your schedule, then hit the road.",
       "Te configuramos la app y tu horario, y a la carretera."],
      /* apply CTA */
      [">Join the team</span>", ">Únete al equipo</span>"],
      ["Ready to drive with us?", "¿Listo para conducir con nosotros?"],
      ['Tap below to email your application — or write us directly at <a href="mailto:info@rideyeah.com" style="color:var(--gold)">info@rideyeah.com</a> / call <a href="tel:+18052851570" style="color:var(--gold)">+1 (805) 285-1570</a>.',
       'Toca abajo para enviar tu solicitud por correo — o escríbenos directamente a <a href="mailto:info@rideyeah.com" style="color:var(--gold)">info@rideyeah.com</a> / llama al <a href="tel:+18052851570" style="color:var(--gold)">+1 (805) 285-1570</a>.'],
      ["subject=Driver%20Application%20-%20RideYeah&body=Hi%20RideYeah%20team%2C%0D%0A%0D%0AI%27d%20like%20to%20apply%20for%20the%20chauffeur%20%2F%20driver%20position.%0D%0A%0D%0AFull%20name%3A%0D%0APhone%3A%0D%0ACity%3A%0D%0ADriver%27s%20license%20%23%3A%0D%0AYears%20of%20driving%20experience%3A%0D%0ALivery%2FTCP%20experience%20(if%20any)%3A%0D%0AAvailability%20(full%2Fpart-time)%3A%0D%0A%0D%0AThank%20you.",
       "subject=Solicitud%20de%20Driver%20-%20RideYeah&body=Hola%20equipo%20RideYeah%2C%0D%0A%0D%0AMe%20gustar%C3%ADa%20postularme%20para%20el%20puesto%20de%20chofer%20%2F%20driver.%0D%0A%0D%0ANombre%20completo%3A%0D%0ATel%C3%A9fono%3A%0D%0ACiudad%3A%0D%0AN%C3%BAmero%20de%20licencia%20de%20conducir%3A%0D%0AA%C3%B1os%20de%20experiencia%20conduciendo%3A%0D%0AExperiencia%20Livery%2FTCP%20(si%20tienes)%3A%0D%0ADisponibilidad%20(tiempo%20completo%2Fparcial)%3A%0D%0A%0D%0AGracias."],
      ["Apply by email <svg", "Postúlate por correo <svg"],
    ],
  },
  {
    src: "hourly-chauffeur.html",
    out: "es/chofer-por-horas.html",
    enUrl: "https://rideyeah.com/hourly-chauffeur.html",
    esCanonical: "https://rideyeah.com/es/chofer-por-horas",
    map: [
      /* head */
      ["Hourly Chauffeur & Car Service by the Hour | RideYeah Los Angeles",
       "Chofer por Horas y Servicio de Auto por Hora | RideYeah Los Ángeles"],
      ["Hire a chauffeur by the hour in Los Angeles & Orange County. A dedicated luxury car and driver for meetings, events, shopping or a night out — fixed hourly rates.",
       "Contrata un chofer por horas en Los Ángeles y Orange County. Un auto de lujo y chofer a tu disposición para reuniones, eventos, compras o una noche fuera — tarifas por hora fijas."],
      ["hourly chauffeur Los Angeles, car service by the hour, chauffeur hire LA, hourly car service, as-directed chauffeur Orange County",
       "chofer por horas Los Ángeles, servicio de auto por hora, contratar chofer LA, servicio de auto por horas, chofer a disposición Orange County"],
      ["Hourly Chauffeur & Car Service by the Hour | RideYeah", "Chofer por Horas y Servicio de Auto por Hora | RideYeah"],
      ["A dedicated luxury car and chauffeur by the hour across LA & Orange County. Fixed hourly rates.",
       "Un auto de lujo y chofer por horas en LA y Orange County. Tarifas por hora fijas."],
      /* JSON-LD */
      ['"serviceType": "Hourly chauffeur hire"', '"serviceType": "Contratación de chofer por horas"'],
      ['"name": "Car Service by the Hour"', '"name": "Servicio de Auto por Hora"'],
      ["Hire a professional chauffeur and luxury vehicle by the hour across Los Angeles and Orange County, charged at a fixed hourly rate.",
       "Contrata un chofer profesional y un vehículo de lujo por horas en Los Ángeles y Orange County, con una tarifa por hora fija."],
      /* breadcrumb + eyebrow */
      [" · By the hour</div>", " · Por horas</div>"],
      [">As-directed · hourly hire</span>", ">A disposición · por horas</span>"],
      /* hero */
      ['Your chauffeur,<br><span class="em">by the hour.</span>',
       'Tu chofer,<br><span class="em">por horas.</span>'],
      ["A dedicated luxury car and professional driver at your disposal — for back-to-back meetings, shopping, events or a night out. Pay only for the time you reserve.",
       "Un auto de lujo y un chofer profesional a tu disposición — para reuniones seguidas, compras, eventos o una noche fuera. Pagas solo el tiempo que reservas."],
      [">Reserve hourly <svg", ">Reservar por horas <svg"],
      /* perfect for */
      [">Perfect for</span>", ">Ideal para</span>"],
      ["A car that waits, so you<br>never have to.", "Un auto que espera, para que tú<br>nunca lo hagas."],
      ["<h3>Meetings &amp; roadshows</h3>", "<h3>Reuniones y roadshows</h3>"],
      ["Multiple stops across the city with a chauffeur who waits between each — no re-booking, no surge, no waiting on the curb.",
       "Varias paradas por la ciudad con un chofer que espera entre cada una — sin volver a reservar, sin recargos, sin esperar en la acera."],
      ["<h3>Shopping &amp; leisure</h3>", "<h3>Compras y ocio</h3>"],
      ["Rodeo Drive, South Coast Plaza or a day at the coast. Your driver handles parking and bags while you enjoy the day.",
       "Rodeo Drive, South Coast Plaza o un día en la costa. Tu chofer se encarga del estacionamiento y las bolsas mientras disfrutas el día."],
      ["<h3>Events &amp; nights out</h3>", "<h3>Eventos y noches fuera</h3>"],
      ["Dinner, a show and drinks — all on one reservation. Arrive and leave on your schedule, with the same car all night.",
       "Cena, un show y unas copas — todo en una sola reserva. Llega y vete según tu horario, con el mismo auto toda la noche."],
      /* how hourly works */
      [">How hourly works</span>", ">Cómo funciona por horas</span>"],
      ["Simple, by design.", "Simple, por diseño."],
      ["Reserve a block of hours <span>· a typical minimum is 3 hours</span>",
       "Reserva un bloque de horas <span>· el mínimo habitual es 3 horas</span>"],
      ["Your chauffeur stays with you <span>· as-directed, stop to stop</span>",
       "Tu chofer se queda contigo <span>· a tu disposición, parada tras parada</span>"],
      ["Fixed hourly rate <span>· quoted before you book, gratuity included</span>",
       "Tarifa por hora fija <span>· cotizada antes de reservar, propina incluida</span>"],
      ["Spacious luxury black SUV <span>· seats up to 6 with luggage</span>",
       "Espaciosa SUV negra de lujo <span>· hasta 6 pasajeros con equipaje</span>"],
      [">Reserve by the hour <svg", ">Reservar por horas <svg"],
      /* CTA */
      [">Ready when you are</span>", ">Cuando tú quieras</span>"],
      ["Book a chauffeur by the hour.", "Reserva un chofer por horas."],
      ["One car, one driver, your whole day. Reserve in under a minute with a fixed hourly rate.",
       "Un auto, un chofer, todo tu día. Reserva en menos de un minuto con una tarifa por hora fija."],
      [">Reserve your ride <svg", ">Reserva tu viaje <svg"],
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
  rep('href="about.html"', 'href="/es/nosotros.html"');
  rep('href="careers.html"', 'href="/es/empleo.html"');
  rep('href="hourly-chauffeur.html"', 'href="/es/chofer-por-horas.html"');
  rep('href="popular-routes.html"', 'href="/es/rutas-populares.html"');
  /* remaining EN .html links -> root-absolute */
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
