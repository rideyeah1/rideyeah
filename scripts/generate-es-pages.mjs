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
  "lax-to-beverly-hills.html": "es/lax-a-beverly-hills.html",
  "lax-to-disneyland.html": "es/lax-a-disneyland.html",
  "lax-to-newport-beach.html": "es/lax-a-newport-beach.html",
  "lax-to-anaheim.html": "es/lax-a-anaheim.html",
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
];

/* ---- strings shared by the 4 LAX→ route landing pages ---- */
const ROUTE_COMMON = [
  [">Good to know</span>", ">Bueno saberlo</span>"],
  ['<div class="l">Typical drive time</div>', '<div class="l">Tiempo de viaje habitual</div>'],
  ['<div class="l">Fixed fare, all-in</div>', '<div class="l">Tarifa fija, todo incluido</div>'],
  [">Get your fixed quote <svg", ">Obtén tu tarifa fija <svg"],
  [">Reserve this route <svg", ">Reserva esta ruta <svg"],
  ["Fixed price, flight tracking, professional chauffeur in a private Suburban.",
   "Precio fijo, seguimiento de vuelo y chofer profesional en una Suburban privada."],
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
      ["RideYeah is hiring professional, licensed chauffeurs to provide luxury ground transportation across Los Angeles and Orange County. Drivers operate our fleet of late-model Chevrolet Suburban SUVs, providing airport transfers and private chauffeur service with discretion and punctuality.",
       "RideYeah busca choferes profesionales y con licencia para brindar transporte terrestre de lujo en Los Ángeles y Orange County. Los choferes operan nuestra flota de SUV Chevrolet Suburban de último modelo, ofreciendo traslados al aeropuerto y servicio de chofer privado con discreción y puntualidad."],
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
      ["Spacious Chevrolet Suburban <span>· seats up to 6 with luggage</span>",
       "Espaciosa Chevrolet Suburban <span>· hasta 6 pasajeros con equipaje</span>"],
      [">Reserve by the hour <svg", ">Reservar por horas <svg"],
      /* CTA */
      [">Ready when you are</span>", ">Cuando tú quieras</span>"],
      ["Book a chauffeur by the hour.", "Reserva un chofer por horas."],
      ["One car, one driver, your whole day. Reserve in under a minute with a fixed hourly rate.",
       "Un auto, un chofer, todo tu día. Reserva en menos de un minuto con una tarifa por hora fija."],
      [">Reserve your ride <svg", ">Reserva tu viaje <svg"],
    ],
  },
  {
    src: "popular-routes.html",
    out: "es/rutas-populares.html",
    enUrl: "https://rideyeah.com/popular-routes.html",
    esCanonical: "https://rideyeah.com/es/rutas-populares",
    map: [
      /* head */
      ["Popular Luxury Routes & Fixed Fares | LAX Suburban Service | RideYeah",
       "Rutas de Lujo Populares y Tarifas Fijas | Servicio Suburban LAX | RideYeah"],
      ["Fixed-price luxury Suburban car service on LA & Orange County's top routes: LAX to Beverly Hills, Newport Beach, Anaheim, Disneyland, Santa Monica, Malibu & more.",
       "Servicio de auto Suburban de lujo a precio fijo en las mejores rutas de LA y Orange County: LAX a Beverly Hills, Newport Beach, Anaheim, Disneyland, Santa Mónica, Malibú y más."],
      ["LAX to Orange County car service, LAX to Disneyland car service, LA to San Diego car service, LAX to Santa Barbara, car service to Palm Springs",
       "servicio de auto LAX a Orange County, servicio de auto LAX a Disneyland, servicio de auto LA a San Diego, LAX a Santa Bárbara, servicio de auto a Palm Springs"],
      ["Popular Routes & Fixed Fares | RideYeah", "Rutas Populares y Tarifas Fijas | RideYeah"],
      ["Fixed-price luxury car service on Southern California's most popular routes — LAX, Disneyland, San Diego, Santa Barbara, Palm Springs.",
       "Servicio de auto de lujo a precio fijo en las rutas más populares del sur de California — LAX, Disneyland, San Diego, Santa Bárbara, Palm Springs."],
      /* JSON-LD */
      ['"serviceType": "Point-to-point car service"', '"serviceType": "Servicio de auto punto a punto"'],
      ['"name": "Popular Routes — Fixed Fares"', '"name": "Rutas Populares — Tarifas Fijas"'],
      ["Fixed-price luxury car service on popular Southern California routes including LAX to Orange County, LAX to Disneyland, LA to San Diego, Santa Barbara and Palm Springs.",
       "Servicio de auto de lujo a precio fijo en rutas populares del sur de California, incluyendo LAX a Orange County, LAX a Disneyland, LA a San Diego, Santa Bárbara y Palm Springs."],
      /* breadcrumb + eyebrow */
      [" · Popular routes</div>", " · Rutas populares</div>"],
      [">Fixed fares · Southern California</span>", ">Tarifas fijas · Sur de California</span>"],
      /* hero */
      ['Popular routes,<br><span class="em">fixed fares.</span>',
       'Rutas populares,<br><span class="em">tarifas fijas.</span>'],
      ["The rides we run most — LAX to Orange County, LAX to Disneyland, LA to San Diego and beyond. One transparent price, quoted before you book.",
       "Los viajes que más hacemos — LAX a Orange County, LAX a Disneyland, LA a San Diego y más allá. Un precio transparente, cotizado antes de reservar."],
      /* route cards */
      ["~30 min · Suburban. Door-to-door to Beverly Hills hotels, residences and Rodeo Drive.",
       "~30 min · Suburban. Puerta a puerta a hoteles, residencias y Rodeo Drive en Beverly Hills."],
      ["~50 min · Suburban. To Newport Beach, Fashion Island, Balboa and the Orange County coast.",
       "~50 min · Suburban. A Newport Beach, Fashion Island, Balboa y la costa de Orange County."],
      ["~40 min · Suburban. Convention Center, hotels, Honda Center and the Disneyland Resort.",
       "~40 min · Suburban. Convention Center, hoteles, Honda Center y el Disneyland Resort."],
      ["~40 min · Suburban. Spacious for families and luggage; child seats on request.",
       "~40 min · Suburban. Espaciosa para familias y equipaje; sillas para niños a pedido."],
      ["~25 min · Suburban. To Santa Monica, Venice and the Westside beaches, door to door.",
       "~25 min · Suburban. A Santa Mónica, Venice y las playas del Westside, puerta a puerta."],
      ["~50 min · Suburban. A scenic coast run up to Malibu along the Pacific.",
       "~50 min · Suburban. Un recorrido escénico por la costa del Pacífico hasta Malibú."],
      ["~35 min · Suburban. To Pasadena, Old Town and the San Gabriel Valley.",
       "~35 min · Suburban. A Pasadena, Old Town y el Valle de San Gabriel."],
      ["~45 min · Suburban. Business travel to Irvine, the Spectrum and South Orange County.",
       "~45 min · Suburban. Viajes de negocios a Irvine, el Spectrum y el sur de Orange County."],
      [">View route →</a>", ">Ver ruta →</a>"],
      ['Indicative fares for illustration. Your exact, all-in price is shown at booking. Don\'t see your route? <a href="index.html#book" style="color:var(--gold)">Get a quote</a>.',
       'Tarifas indicativas a modo de ejemplo. Tu precio exacto y total se muestra al reservar. ¿No ves tu ruta? <a href="index.html#book" style="color:var(--gold)">Pide una cotización</a>.'],
      /* CTA */
      [">Anywhere in Southern California</span>", ">En cualquier lugar del sur de California</span>"],
      ["Get your fixed fare.", "Obtén tu tarifa fija."],
      ["Enter your pickup and destination for an instant, all-in price — no surge, no surprises.",
       "Ingresa tu lugar de recogida y destino para un precio total al instante — sin recargos, sin sorpresas."],
      [">See prices &amp; book <svg", ">Ver precios y reservar <svg"],
    ],
  },
  {
    src: "lax-to-beverly-hills.html",
    out: "es/lax-a-beverly-hills.html",
    enUrl: "https://rideyeah.com/lax-to-beverly-hills.html",
    esCanonical: "https://rideyeah.com/es/lax-a-beverly-hills",
    map: [
      ...ROUTE_COMMON,
      ["LAX to Beverly Hills Car Service | Private Suburban | RideYeah",
       "Servicio de Auto LAX a Beverly Hills | Suburban Privada | RideYeah"],
      ["Private LAX to Beverly Hills car service in a luxury Chevrolet Suburban. Flight tracking, meet-and-greet and a fixed fare from $95 — about 30 minutes, door to door.",
       "Servicio de auto privado de LAX a Beverly Hills en una Chevrolet Suburban de lujo. Seguimiento de vuelos, recibimiento personal y una tarifa fija desde $95 — unos 30 minutos, puerta a puerta."],
      ["LAX to Beverly Hills car service, Beverly Hills airport transfer, LAX Beverly Hills chauffeur, Beverly Hills black car service",
       "servicio de auto LAX a Beverly Hills, traslado al aeropuerto Beverly Hills, chofer LAX Beverly Hills, servicio black car Beverly Hills"],
      ["LAX to Beverly Hills Car Service | RideYeah", "Servicio de Auto LAX a Beverly Hills | RideYeah"],
      ["Private LAX → Beverly Hills luxury Suburban service. Flight tracking, meet-and-greet, fixed fare from $95.",
       "Servicio privado LAX → Beverly Hills en Suburban de lujo. Seguimiento de vuelos, recibimiento, tarifa fija desde $95."],
      ['"serviceType": "Airport car service — LAX to Beverly Hills"',
       '"serviceType": "Servicio de auto al aeropuerto — LAX a Beverly Hills"'],
      ['"name": "LAX to Beverly Hills Car Service"', '"name": "Servicio de Auto LAX a Beverly Hills"'],
      ["Private luxury car service from Los Angeles International (LAX) to Beverly Hills in a chauffeured Chevrolet Suburban, with flight tracking, meet-and-greet and fixed pricing.",
       "Servicio de auto privado de lujo desde Los Ángeles Internacional (LAX) a Beverly Hills en una Chevrolet Suburban con chofer, con seguimiento de vuelos, recibimiento personal y tarifas fijas."],
      ["How long is the drive from LAX to Beverly Hills?", "¿Cuánto dura el trayecto de LAX a Beverly Hills?"],
      ["It is roughly 30 minutes in typical traffic, about 14 miles. Your chauffeur monitors live conditions and chooses the fastest route.",
       "Unos 30 minutos con tráfico normal, alrededor de 14 millas. Tu chofer monitorea las condiciones en vivo y elige la ruta más rápida."],
      ["Roughly 30 minutes in typical traffic (about 14 miles). Your chauffeur monitors live conditions and chooses the fastest route.",
       "Unos 30 minutos con tráfico normal (alrededor de 14 millas). Tu chofer monitorea las condiciones en vivo y elige la ruta más rápida."],
      ["How much is a car from LAX to Beverly Hills?", "¿Cuánto cuesta un auto de LAX a Beverly Hills?"],
      ["Our fixed fare starts at $95 in a luxury Chevrolet Suburban — all-in, with tolls and gratuity included and no surge pricing.",
       "Nuestra tarifa fija comienza en $95 en una Chevrolet Suburban de lujo — todo incluido, con peajes y propina, sin recargos por demanda."],
      ["Do you offer meet-and-greet at LAX?", "¿Ofrecen recibimiento personal en LAX?"],
      ["Yes. Your chauffeur tracks your flight and meets you at the curb or in arrivals, helps with luggage and walks you to the Suburban.",
       "Sí. Tu chofer sigue tu vuelo y te recibe en la acera o en llegadas, te ayuda con el equipaje y te acompaña a la Suburban."],
      [">~30 min · from $95 · Suburban</span>", ">~30 min · desde $95 · Suburban</span>"],
      ['LAX to Beverly Hills,<br><span class="em">in quiet luxury.</span>',
       'LAX a Beverly Hills,<br><span class="em">en silencioso lujo.</span>'],
      ["Step off your flight and into a private Chevrolet Suburban. Door-to-door from LAX to Beverly Hills hotels, residences and Rodeo Drive — flight tracked, fixed price, always on time.",
       "Baja del avión y sube a una Chevrolet Suburban privada. Puerta a puerta desde LAX a hoteles, residencias y Rodeo Drive en Beverly Hills — vuelo monitoreado, precio fijo, siempre puntual."],
      [">The arrival you deserve</span>", ">La llegada que mereces</span>"],
      [">Made for Beverly Hills.</h2>", ">Hecho para Beverly Hills.</h2>"],
      ["Direct to The Beverly Hills Hotel, Beverly Wilshire, Waldorf Astoria &amp; <span>private residences</span>",
       "Directo a The Beverly Hills Hotel, Beverly Wilshire, Waldorf Astoria y <span>residencias privadas</span>"],
      ["Discreet, professional chauffeur &amp; <span>an immaculate Suburban</span>",
       "Chofer profesional y discreto y <span>una Suburban impecable</span>"],
      ["Live flight tracking &amp; <span>complimentary wait time on arrivals</span>",
       "Seguimiento de vuelo en vivo y <span>tiempo de espera de cortesía en llegadas</span>"],
      ["Fixed, all-in price <span>· no surge, no meter</span>",
       "Precio fijo, todo incluido <span>· sin recargos, sin taxímetro</span>"],
      ["LAX → Beverly Hills FAQ.", "Preguntas frecuentes: LAX → Beverly Hills."],
      [">Beverly Hills, the easy way</span>", ">Beverly Hills, sin complicaciones</span>"],
      ["Book LAX → Beverly Hills.", "Reserva LAX → Beverly Hills."],
    ],
  },
  {
    src: "lax-to-disneyland.html",
    out: "es/lax-a-disneyland.html",
    enUrl: "https://rideyeah.com/lax-to-disneyland.html",
    esCanonical: "https://rideyeah.com/es/lax-a-disneyland",
    map: [
      ...ROUTE_COMMON,
      ["LAX to Disneyland Car Service | Private Suburban | RideYeah",
       "Servicio de Auto LAX a Disneyland | Suburban Privada | RideYeah"],
      ["Private LAX to Disneyland car service in a spacious Chevrolet Suburban. Room for families and luggage, child seats on request, flight tracking and a fixed fare from $125.",
       "Servicio de auto privado de LAX a Disneyland en una espaciosa Chevrolet Suburban. Espacio para familias y equipaje, sillas para niños a pedido, seguimiento de vuelos y una tarifa fija desde $125."],
      ["LAX to Disneyland car service, LAX to Anaheim, Disneyland airport transfer, private car LAX Disneyland, family car service Disneyland",
       "servicio de auto LAX a Disneyland, LAX a Anaheim, traslado al aeropuerto Disneyland, auto privado LAX Disneyland, servicio de auto familiar Disneyland"],
      ["LAX to Disneyland Car Service | RideYeah", "Servicio de Auto LAX a Disneyland | RideYeah"],
      ["Spacious LAX → Disneyland Suburban service for families. Child seats on request, luggage room, fixed fare from $125.",
       "Servicio LAX → Disneyland en Suburban espaciosa para familias. Sillas para niños a pedido, espacio para equipaje, tarifa fija desde $125."],
      ['"serviceType": "Airport car service — LAX to Disneyland"',
       '"serviceType": "Servicio de auto al aeropuerto — LAX a Disneyland"'],
      ['"name": "LAX to Disneyland Car Service"', '"name": "Servicio de Auto LAX a Disneyland"'],
      ["Private luxury car service from LAX to the Disneyland Resort in Anaheim, in a spacious chauffeured Chevrolet Suburban with room for families and luggage, child seats on request and fixed pricing.",
       "Servicio de auto privado de lujo desde LAX al Disneyland Resort en Anaheim, en una espaciosa Chevrolet Suburban con chofer, con espacio para familias y equipaje, sillas para niños a pedido y tarifas fijas."],
      ["How long is the drive from LAX to Disneyland?", "¿Cuánto dura el trayecto de LAX a Disneyland?"],
      ["About 40 minutes in normal traffic, roughly 35 miles to the Disneyland Resort in Anaheim. Times vary with traffic; your chauffeur tracks conditions live.",
       "Unos 40 minutos con tráfico normal, alrededor de 35 millas hasta el Disneyland Resort en Anaheim. Los tiempos varían con el tráfico; tu chofer sigue las condiciones en vivo."],
      ["About 40 minutes in normal traffic, roughly 35 miles to the Disneyland Resort in Anaheim. Your chauffeur tracks conditions and chooses the best route.",
       "Unos 40 minutos con tráfico normal, alrededor de 35 millas hasta el Disneyland Resort en Anaheim. Tu chofer sigue las condiciones y elige la mejor ruta."],
      ["How much is a car from LAX to Disneyland?", "¿Cuánto cuesta un auto de LAX a Disneyland?"],
      ["Our fixed fare starts at $125 in a spacious Chevrolet Suburban — all-in, with tolls and gratuity included and no surge pricing.",
       "Nuestra tarifa fija comienza en $125 en una espaciosa Chevrolet Suburban — todo incluido, con peajes y propina, sin recargos por demanda."],
      ["Do you provide child seats for the Disneyland trip?", "¿Ofrecen sillas para niños en el viaje a Disneyland?"],
      ["Yes. Add a note when you book and we will fit infant or booster seats. The Suburban seats up to 6 with plenty of room for strollers and luggage.",
       "Sí. Añade una nota al reservar y colocamos sillas para bebés o booster. La Suburban acomoda hasta 6 con espacio de sobra para coches de bebé y equipaje."],
      ["Yes. Add a note when you book and we'll fit infant or booster seats. The Suburban seats up to 6 with plenty of room for strollers and luggage.",
       "Sí. Añade una nota al reservar y colocamos sillas para bebés o booster. La Suburban acomoda hasta 6 con espacio de sobra para coches de bebé y equipaje."],
      [">~40 min · from $125 · Suburban</span>", ">~40 min · desde $125 · Suburban</span>"],
      ['LAX to Disneyland,<br><span class="em">the magic starts early.</span>',
       'LAX a Disneyland,<br><span class="em">la magia empieza temprano.</span>'],
      ["Start the trip relaxed. A spacious Chevrolet Suburban takes the whole family — and the luggage — from LAX straight to the Disneyland Resort and Anaheim hotels. Child seats on request, fixed price upfront.",
       "Empieza el viaje relajado. Una espaciosa Chevrolet Suburban lleva a toda la familia — y el equipaje — desde LAX directo al Disneyland Resort y los hoteles de Anaheim. Sillas para niños a pedido, precio fijo por adelantado."],
      ['<div class="l">Seats + luggage room</div>', '<div class="l">Asientos + espacio de equipaje</div>'],
      [">Built for families</span>", ">Hecho para familias</span>"],
      ["Room for everyone &amp; everything.", "Espacio para todos y para todo."],
      ["Seats up to 6 with space for <span>strollers, car seats &amp; luggage</span>",
       "Hasta 6 pasajeros con espacio para <span>coches de bebé, sillas y equipaje</span>"],
      ["Infant &amp; booster seats <span>on request — just add a note</span>",
       "Sillas para bebés y booster <span>a pedido — solo añade una nota</span>"],
      ["Direct to the Disneyland Resort &amp; <span>Anaheim hotels, door to door</span>",
       "Directo al Disneyland Resort y <span>hoteles de Anaheim, puerta a puerta</span>"],
      ["Flight tracking, complimentary wait time &amp; <span>one fixed price</span>",
       "Seguimiento de vuelo, tiempo de espera de cortesía y <span>un precio fijo</span>"],
      ["LAX → Disneyland FAQ.", "Preguntas frecuentes: LAX → Disneyland."],
      [">Start the trip relaxed</span>", ">Empieza el viaje relajado</span>"],
      ["Book LAX → Disneyland.", "Reserva LAX → Disneyland."],
      ["Spacious Suburban, child seats on request, fixed price — door to door for the whole family.",
       "Suburban espaciosa, sillas para niños a pedido, precio fijo — puerta a puerta para toda la familia."],
    ],
  },
  {
    src: "lax-to-newport-beach.html",
    out: "es/lax-a-newport-beach.html",
    enUrl: "https://rideyeah.com/lax-to-newport-beach.html",
    esCanonical: "https://rideyeah.com/es/lax-a-newport-beach",
    map: [
      ...ROUTE_COMMON,
      ["LAX to Newport Beach Car Service | Private Suburban | RideYeah",
       "Servicio de Auto LAX a Newport Beach | Suburban Privada | RideYeah"],
      ["Private LAX to Newport Beach car service in a luxury Chevrolet Suburban. Flight tracking, meet-and-greet and a fixed fare from $135 — about 50 minutes to Orange County's coast.",
       "Servicio de auto privado de LAX a Newport Beach en una Chevrolet Suburban de lujo. Seguimiento de vuelos, recibimiento personal y una tarifa fija desde $135 — unos 50 minutos a la costa de Orange County."],
      ["LAX to Newport Beach car service, Newport Beach airport transfer, Orange County car service LAX, Newport Beach chauffeur, LAX to Orange County",
       "servicio de auto LAX a Newport Beach, traslado al aeropuerto Newport Beach, servicio de auto Orange County LAX, chofer Newport Beach, LAX a Orange County"],
      ["LAX to Newport Beach Car Service | RideYeah", "Servicio de Auto LAX a Newport Beach | RideYeah"],
      ["Private LAX → Newport Beach luxury Suburban service. Flight tracking, meet-and-greet, fixed fare from $135.",
       "Servicio privado LAX → Newport Beach en Suburban de lujo. Seguimiento de vuelos, recibimiento, tarifa fija desde $135."],
      ['"serviceType": "Airport car service — LAX to Newport Beach"',
       '"serviceType": "Servicio de auto al aeropuerto — LAX a Newport Beach"'],
      ['"name": "LAX to Newport Beach Car Service"', '"name": "Servicio de Auto LAX a Newport Beach"'],
      ["Private luxury car service from LAX to Newport Beach and Orange County's coast in a chauffeured Chevrolet Suburban, with flight tracking, meet-and-greet and fixed pricing.",
       "Servicio de auto privado de lujo desde LAX a Newport Beach y la costa de Orange County en una Chevrolet Suburban con chofer, con seguimiento de vuelos, recibimiento personal y tarifas fijas."],
      ["How long is the drive from LAX to Newport Beach?", "¿Cuánto dura el trayecto de LAX a Newport Beach?"],
      ["Around 50 minutes in typical traffic, roughly 45 miles down to the Orange County coast. Times depend on traffic; your chauffeur monitors it live.",
       "Unos 50 minutos con tráfico normal, alrededor de 45 millas hasta la costa de Orange County. Los tiempos dependen del tráfico; tu chofer lo monitorea en vivo."],
      ["Around 50 minutes in typical traffic (roughly 45 miles). Your chauffeur monitors live conditions and chooses the fastest route.",
       "Unos 50 minutos con tráfico normal (alrededor de 45 millas). Tu chofer monitorea las condiciones en vivo y elige la ruta más rápida."],
      ["How much is a car from LAX to Newport Beach?", "¿Cuánto cuesta un auto de LAX a Newport Beach?"],
      ["Our fixed fare starts at $135 in a luxury Chevrolet Suburban — all-in, with tolls and gratuity included and no surge pricing.",
       "Nuestra tarifa fija comienza en $135 en una Chevrolet Suburban de lujo — todo incluido, con peajes y propina, sin recargos por demanda."],
      ["Which Orange County areas do you serve?", "¿Qué zonas de Orange County cubren?"],
      ["Newport Beach, Fashion Island, Balboa, Corona del Mar, Irvine, Costa Mesa and the wider Orange County area — door to door.",
       "Newport Beach, Fashion Island, Balboa, Corona del Mar, Irvine, Costa Mesa y el resto de Orange County — puerta a puerta."],
      [">~50 min · from $135 · Suburban</span>", ">~50 min · desde $135 · Suburban</span>"],
      ['LAX to Newport Beach,<br><span class="em">coast in comfort.</span>',
       'LAX a Newport Beach,<br><span class="em">la costa con confort.</span>'],
      ["Glide from the terminal to the Orange County coast in a private Chevrolet Suburban — Newport Beach, Fashion Island, Balboa and beyond. Flight tracked, fixed price, door to door.",
       "Desliza desde la terminal hasta la costa de Orange County en una Chevrolet Suburban privada — Newport Beach, Fashion Island, Balboa y más allá. Vuelo monitoreado, precio fijo, puerta a puerta."],
      [">Down to the coast</span>", ">Rumbo a la costa</span>"],
      ["Orange County, the smooth way.", "Orange County, sin sobresaltos."],
      ["Newport Beach, Fashion Island, Balboa, Corona del Mar &amp; <span>Irvine</span>",
       "Newport Beach, Fashion Island, Balboa, Corona del Mar e <span>Irvine</span>"],
      ["Spacious Suburban for <span>luggage, golf clubs &amp; gear</span>",
       "Suburban espaciosa para <span>equipaje, palos de golf y equipo</span>"],
      ["Live flight tracking &amp; <span>complimentary wait time</span>",
       "Seguimiento de vuelo en vivo y <span>tiempo de espera de cortesía</span>"],
      ["Fixed, all-in fare <span>· no surge, no meter</span>",
       "Tarifa fija, todo incluido <span>· sin recargos, sin taxímetro</span>"],
      ["LAX → Newport Beach FAQ.", "Preguntas frecuentes: LAX → Newport Beach."],
      [">Orange County, the easy way</span>", ">Orange County, sin complicaciones</span>"],
      ["Book LAX → Newport Beach.", "Reserva LAX → Newport Beach."],
    ],
  },
  {
    src: "lax-to-anaheim.html",
    out: "es/lax-a-anaheim.html",
    enUrl: "https://rideyeah.com/lax-to-anaheim.html",
    esCanonical: "https://rideyeah.com/es/lax-a-anaheim",
    map: [
      ...ROUTE_COMMON,
      ["LAX to Anaheim Car Service | Private Suburban | RideYeah",
       "Servicio de Auto LAX a Anaheim | Suburban Privada | RideYeah"],
      ["Private LAX to Anaheim car service in a luxury Chevrolet Suburban — Convention Center, hotels, Honda Center and Disneyland. Flight tracking and a fixed fare from $119.",
       "Servicio de auto privado de LAX a Anaheim en una Chevrolet Suburban de lujo — Convention Center, hoteles, Honda Center y Disneyland. Seguimiento de vuelos y una tarifa fija desde $119."],
      ["LAX to Anaheim car service, Anaheim airport transfer, Anaheim Convention Center transportation, LAX Anaheim chauffeur, Honda Center car service",
       "servicio de auto LAX a Anaheim, traslado al aeropuerto Anaheim, transporte Anaheim Convention Center, chofer LAX Anaheim, servicio de auto Honda Center"],
      ["LAX to Anaheim Car Service | RideYeah", "Servicio de Auto LAX a Anaheim | RideYeah"],
      ["Private LAX → Anaheim luxury Suburban service for the Convention Center, hotels and events. Fixed fare from $119.",
       "Servicio privado LAX → Anaheim en Suburban de lujo para el Convention Center, hoteles y eventos. Tarifa fija desde $119."],
      ['"serviceType": "Airport car service — LAX to Anaheim"',
       '"serviceType": "Servicio de auto al aeropuerto — LAX a Anaheim"'],
      ['"name": "LAX to Anaheim Car Service"', '"name": "Servicio de Auto LAX a Anaheim"'],
      ["Private luxury car service from LAX to Anaheim in a chauffeured Chevrolet Suburban — for the Convention Center, hotels, Honda Center and the Disneyland Resort, with flight tracking and fixed pricing.",
       "Servicio de auto privado de lujo desde LAX a Anaheim en una Chevrolet Suburban con chofer — para el Convention Center, hoteles, Honda Center y el Disneyland Resort, con seguimiento de vuelos y tarifas fijas."],
      ["How long is the drive from LAX to Anaheim?", "¿Cuánto dura el trayecto de LAX a Anaheim?"],
      ["About 40 minutes in typical traffic, roughly 35 miles. Your chauffeur tracks live conditions and chooses the fastest route.",
       "Unos 40 minutos con tráfico normal, alrededor de 35 millas. Tu chofer sigue las condiciones en vivo y elige la ruta más rápida."],
      ["About 40 minutes in typical traffic (roughly 35 miles). Your chauffeur tracks live conditions and chooses the fastest route.",
       "Unos 40 minutos con tráfico normal (alrededor de 35 millas). Tu chofer sigue las condiciones en vivo y elige la ruta más rápida."],
      ["How much is a car from LAX to Anaheim?", "¿Cuánto cuesta un auto de LAX a Anaheim?"],
      ["Our fixed fare starts at $119 in a luxury Chevrolet Suburban — all-in, with tolls and gratuity included and no surge pricing.",
       "Nuestra tarifa fija comienza en $119 en una Chevrolet Suburban de lujo — todo incluido, con peajes y propina, sin recargos por demanda."],
      ["Do you serve the Anaheim Convention Center and hotels?", "¿Dan servicio al Anaheim Convention Center y los hoteles?"],
      ["Yes — the Anaheim Convention Center, surrounding hotels, Honda Center, Angel Stadium and the Disneyland Resort, door to door.",
       "Sí — el Anaheim Convention Center, los hoteles cercanos, Honda Center, Angel Stadium y el Disneyland Resort, puerta a puerta."],
      [">~40 min · from $119 · Suburban</span>", ">~40 min · desde $119 · Suburban</span>"],
      ['LAX to Anaheim,<br><span class="em">business or pleasure.</span>',
       'LAX a Anaheim,<br><span class="em">negocios o placer.</span>'],
      ["For the Convention Center, a conference hotel, a game at Honda Center or the Disneyland Resort — a private Chevrolet Suburban from LAX, flight tracked and fixed price, door to door.",
       "Para el Convention Center, un hotel de conferencias, un partido en el Honda Center o el Disneyland Resort — una Chevrolet Suburban privada desde LAX, vuelo monitoreado y precio fijo, puerta a puerta."],
      [">Conferences, events &amp; stays</span>", ">Conferencias, eventos y estadías</span>"],
      ["Anaheim, handled.", "Anaheim, resuelto."],
      ["Anaheim Convention Center, hotels, Honda Center &amp; <span>Angel Stadium</span>",
       "Anaheim Convention Center, hoteles, Honda Center y <span>Angel Stadium</span>"],
      ["Ideal for executives, teams &amp; <span>conference groups with luggage</span>",
       "Ideal para ejecutivos, equipos y <span>grupos de conferencias con equipaje</span>"],
      ["Live flight tracking &amp; <span>complimentary wait time on arrivals</span>",
       "Seguimiento de vuelo en vivo y <span>tiempo de espera de cortesía en llegadas</span>"],
      ["Fixed, all-in fare &amp; <span>consolidated billing for business</span>",
       "Tarifa fija, todo incluido y <span>facturación consolidada para empresas</span>"],
      ["LAX → Anaheim FAQ.", "Preguntas frecuentes: LAX → Anaheim."],
      [">Anaheim, the easy way</span>", ">Anaheim, sin complicaciones</span>"],
      ["Book LAX → Anaheim.", "Reserva LAX → Anaheim."],
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
  rep('href="lax-to-beverly-hills.html"', 'href="/es/lax-a-beverly-hills.html"');
  rep('href="lax-to-disneyland.html"', 'href="/es/lax-a-disneyland.html"');
  rep('href="lax-to-newport-beach.html"', 'href="/es/lax-a-newport-beach.html"');
  rep('href="lax-to-anaheim.html"', 'href="/es/lax-a-anaheim.html"');
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
