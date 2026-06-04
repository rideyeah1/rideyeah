/**
 * RideYeah · Spanish home generator
 * ----------------------------------
 * Reads rideyeah-home.html (EN) and produces es/index.html (ES) by applying a
 * curated premium-Spanish translation map + path fixes + ES-specific transforms
 * (lang, canonical, hreflang, language switcher flip, auto-detect script).
 *
 * Run with:  node scripts/generate-es.mjs
 * Re-run whenever the EN home changes. Verify with a grep for leftover English.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

let h = readFileSync("rideyeah-home.html", "utf8");

const rep = (a, b) => { h = h.split(a).join(b); };

/* ---------- lang ---------- */
rep('<html lang="en">', '<html lang="es">');

/* ---------- meta / social ---------- */
rep("Luxury Car Service & LAX Airport Transfers · Los Angeles | RideYeah",
    "Servicio de Auto de Lujo y Traslados al Aeropuerto LAX · Los Ángeles | RideYeah");
rep("Premium black car service, LAX & SNA airport transfers and private chauffeur hire across Los Angeles & Orange County. Fixed pricing, flight tracking — always on time.",
    "Servicio black car premium, traslados a los aeropuertos LAX y SNA y chofer privado en Los Ángeles y Orange County. Tarifas fijas y seguimiento de vuelos — siempre puntuales.");
rep("RideYeah · Luxury Car Service & Airport Transfers in Los Angeles",
    "RideYeah · Servicio de Auto de Lujo y Traslados al Aeropuerto en Los Ángeles");
rep("Luxury airport transfers & private chauffeur service across LA and Orange County. Fixed pricing. Always on time.",
    "Traslados al aeropuerto de lujo y chofer privado en LA y Orange County. Tarifas fijas. Siempre puntuales.");
rep("RideYeah — luxury black SUV at dusk in Los Angeles",
    "RideYeah — SUV negra de lujo al atardecer en Los Ángeles");
rep("Luxury airport transfers and private chauffeur service across Los Angeles and Orange County.",
    "Traslados al aeropuerto de lujo y servicio de chofer privado en Los Ángeles y Orange County.");
rep('"knowsAbout": ["Airport transfers", "LAX car service", "Black car service", "Chauffeur service", "Limousine service", "Hourly chauffeur hire", "Corporate travel", "City to city rides"]',
    '"knowsAbout": ["Traslados al aeropuerto", "Servicio de auto a LAX", "Servicio black car", "Servicio de chofer", "Servicio de limusina", "Chofer por horas", "Viajes corporativos", "Viajes entre ciudades"]');

/* ---------- nav / mobile ---------- */
rep(">Skip to content</a>", ">Saltar al contenido</a>");
rep(">Services</a>", ">Servicios</a>");
rep(">Fleet</a>", ">Flota</a>");
rep(">About</a>", ">Nosotros</a>");
rep(">Careers</a>", ">Empleo</a>");
rep(">Contact</a>", ">Contacto</a>");
rep(">Book now <svg", ">Reservar <svg");
rep(">Book your ride</a>", ">Reserva tu viaje</a>");

/* ---------- hero ---------- */
rep(">Los Angeles · Orange County</span>", ">Los Ángeles · Orange County</span>");
rep('Arrive <span class="em">relaxed.</span>', 'Llega <span class="em">relajado.</span>');
rep('<span class="l">Always on time.</span>', '<span class="l">Siempre puntual.</span>');
rep("Luxury airport transfers and private chauffeur service across Los Angeles and Orange County — with fixed, transparent pricing.",
    "Traslados al aeropuerto de lujo y servicio de chofer privado en Los Ángeles y Orange County — con tarifas fijas y transparentes.");
rep("LAX • SNA • Beverly Hills • Anaheim • Newport Beach • Private Airports",
    "LAX • SNA • Beverly Hills • Anaheim • Newport Beach • Aeropuertos privados");
rep(">Book Your Luxury Ride <svg", ">Reserva tu viaje de lujo <svg");
rep(">Explore the fleet</a>", ">Ver la flota</a>");
rep(" Trusted by executives, families &amp; VIP travelers across Southern California.",
    " La eligen ejecutivos, familias y viajeros VIP en todo el sur de California.");

/* ---------- booking form ---------- */
rep('data-trip="ONE_WAY" role="tab" aria-selected="true">One way</button>', 'data-trip="ONE_WAY" role="tab" aria-selected="true">Solo ida</button>');
rep('data-trip="ROUND_TRIP" role="tab" aria-selected="false">Round trip</button>', 'data-trip="ROUND_TRIP" role="tab" aria-selected="false">Ida y vuelta</button>');
rep('data-trip="HOURLY" role="tab" aria-selected="false">Hourly</button>', 'data-trip="HOURLY" role="tab" aria-selected="false">Por horas</button>');
rep('aria-label="Pickup location" placeholder="Pickup location · LAX, hotel, address"', 'aria-label="Lugar de recogida" placeholder="Lugar de recogida · LAX, hotel, dirección"');
rep('aria-label="Drop-off destination" placeholder="Drop-off destination"', 'aria-label="Destino" placeholder="Destino"');
rep('aria-label="Duration"><option value="" disabled selected>Duration</option>', 'aria-label="Duración"><option value="" disabled selected>Duración</option>');
rep(" hours</option>", " horas</option>");
rep('aria-label="Date" placeholder="Date"', 'aria-label="Fecha" placeholder="Fecha"');
rep('aria-label="Time" placeholder="Time"', 'aria-label="Hora" placeholder="Hora"');
rep('aria-label="Return date" placeholder="Return date"', 'aria-label="Fecha de regreso" placeholder="Fecha de regreso"');
rep('aria-label="Return time" placeholder="Return time"', 'aria-label="Hora de regreso" placeholder="Hora de regreso"');
rep('aria-label="Airline" placeholder="Airline (e.g. American)"', 'aria-label="Aerolínea" placeholder="Aerolínea (ej. American)"');
rep('aria-label="Flight number" placeholder="Flight no. (e.g. AA327)"', 'aria-label="Número de vuelo" placeholder="N° de vuelo (ej. AA327)"');
rep('aria-label="Passengers" placeholder="Passengers"', 'aria-label="Pasajeros" placeholder="Pasajeros"');
rep(" Secure booking ", " Reserva segura ");
rep("powered by Moovs", "con tecnología Moovs");

/* ---------- trust badges ---------- */
rep('<div class="tt">Licensed &amp; Insured</div><div class="ts">Fully covered fleet</div>',
    '<div class="tt">Con licencia y seguro</div><div class="ts">Flota totalmente asegurada</div>');
rep('<div class="tt">Professional Chauffeurs</div><div class="ts">Trained &amp; vetted</div>',
    '<div class="tt">Choferes profesionales</div><div class="ts">Capacitados y verificados</div>');
rep('<div class="tt">Flight Monitoring</div><div class="ts">Included on airport rides</div>',
    '<div class="tt">Seguimiento de vuelos</div><div class="ts">Incluido en traslados</div>');
rep('<div class="tt">24/7 Availability</div><div class="ts">Day or night, on time</div>',
    '<div class="tt">Disponibilidad 24/7</div><div class="ts">De día o de noche, puntuales</div>');

/* ---------- services ---------- */
rep(">Our services</span>", ">Nuestros servicios</span>");
rep("Every journey,<br>handled with care.", "Cada viaje,<br>con total cuidado.");
rep("<h3>Airport transfers</h3>", "<h3>Traslados al aeropuerto</h3>");
rep("Seamless pickups and drop-offs at LAX, John Wayne (SNA) and private terminals. We track your flight and meet you at the curb or in arrivals.",
    "Recogidas y entregas sin contratiempos en LAX, John Wayne (SNA) y terminales privadas. Monitoreamos tu vuelo y te recibimos en la acera o en llegadas.");
rep(">Book a transfer <svg", ">Reservar traslado <svg");
rep("<h3>By the hour</h3>", "<h3>Por horas</h3>");
rep("A dedicated chauffeur at your disposal — for meetings, events, shopping or a night out. Pay only for the time you reserve.",
    "Un chofer a tu disposición — para reuniones, eventos, compras o una noche fuera. Pagas solo el tiempo que reservas.");
rep(">Reserve hourly <svg", ">Reservar por horas <svg");
rep("<h3>Corporate travel</h3>", "<h3>Viajes corporativos</h3>");
rep("Priority booking, consolidated billing and dedicated account management for teams and executives who move often.",
    "Reservas prioritarias, facturación consolidada y gestión de cuenta dedicada para equipos y ejecutivos que viajan a menudo.");
rep(">Learn more <svg", ">Saber más <svg");
rep("<h3>City to city</h3>", "<h3>Entre ciudades</h3>");
rep("Comfortable long-distance rides between Los Angeles, San Diego, Santa Barbara and Palm Springs — door to door.",
    "Trayectos cómodos de larga distancia entre Los Ángeles, San Diego, Santa Bárbara y Palm Springs — puerta a puerta.");
rep(">Plan a trip <svg", ">Planear un viaje <svg");

/* ---------- band ---------- */
rep(">The RideYeah difference</span>", ">La diferencia RideYeah</span>");
rep("It's not a ride.<br>It's how you<br>", "No es un viaje.<br>Es cómo<br>");
rep(">arrive.</span>", ">llegas.</span>");
rep("Every detail is considered — the silence of the cabin, the chilled water waiting, a chauffeur who knows the fastest way and the quietest route. You simply step in and let the city move around you.",
    "Cada detalle está cuidado — el silencio de la cabina, el agua fría esperando, un chofer que conoce la ruta más rápida y la más tranquila. Solo subes y dejas que la ciudad se mueva a tu alrededor.");

/* ---------- experience ---------- */
rep(">Inside the cabin</span>", ">Dentro de la cabina</span>");
rep("A quiet world,<br>tailored to you.", "Un mundo en calma,<br>hecho a tu medida.");
rep("Hand-stitched leather, climate dialed to your preference and a calm that begins the moment the door closes. Every car is detailed before it reaches you.",
    "Piel cosida a mano, clima a tu gusto y una calma que empieza en cuanto se cierra la puerta. Cada auto se detalla antes de llegar a ti.");
rep(">Onboard Wi-Fi</li>", ">Wi-Fi a bordo</li>");
rep(">Complimentary water</li>", ">Agua de cortesía</li>");
rep(">Phone chargers</li>", ">Cargadores</li>");
rep(">Climate control</li>", ">Clima controlado</li>");

/* ---------- cabin carousel (interior only — region, alt text, captions) ---------- */
rep('aria-label="Luxury SUV cabin — interior gallery"', 'aria-label="Cabina de SUV de lujo — galería interior"');
rep('aria-label="Choose a slide"', 'aria-label="Elige una imagen"');
rep("Spacious second-row leather seats in a high-end SUV — RideYeah passenger cabin",
    "Amplios asientos de piel de segunda fila en una SUV de alta gama — cabina de pasajeros RideYeah");
rep("Premium black leather front seats with contrast stitching — luxury SUV interior",
    "Asientos delanteros de piel negra premium con pespunte — interior de SUV de lujo");
rep("Luxury SUV cockpit with curved digital displays and wood trim — RideYeah",
    "Cockpit de SUV de lujo con pantallas digitales curvas y vetas de madera — RideYeah");
rep(">Room to exhale<", ">Espacio para respirar<");
rep(">Crafted in leather<", ">Tapizada en piel<");
rep(">A cockpit of calm<", ">Un cockpit de calma<");

/* ---------- fleet showcase (luxury SUV fleet + exterior carousel) ---------- */
rep(">Our fleet</span>", ">Nuestra flota</span>");
rep("A fleet of<br>luxury SUVs.", "Una flota de<br>SUV de lujo.");
rep("Black-car luxury, in every SUV.", "Lujo black-car, en cada SUV.");
rep("RideYeah is a luxury chauffeur service with a fleet of premium full-size luxury SUVs, each impeccably maintained and detailed. Whether it's an airport transfer, a board meeting or a family pickup, you ride with a professional chauffeur in spacious, first-class comfort.",
    "RideYeah es un servicio de chofer de lujo con una flota de SUV de lujo premium de tamaño completo, cada una impecablemente mantenida y detallada. Ya sea un traslado al aeropuerto, una reunión de negocios o la recogida de la familia, viajas con un chofer profesional en un amplio confort de primera clase.");
// fleet carousel — region, exterior alts, captions
rep('aria-label="Luxury SUV fleet — exterior gallery"', 'aria-label="Flota de SUV de lujo — galería exterior"');
rep("Black Cadillac Escalade luxury SUV, front view — RideYeah chauffeured fleet in Los Angeles",
    "Cadillac Escalade negra de lujo, vista frontal — flota con chofer de RideYeah en Los Ángeles");
rep("Black Cadillac Escalade rear view — luxury airport transfers across Los Angeles and Orange County",
    "Cadillac Escalade negra, vista trasera — traslados de lujo al aeropuerto en Los Ángeles y Orange County");
rep("Black full-size luxury SUV — RideYeah chauffeured fleet across Southern California",
    "SUV de lujo negra — flota con chofer de RideYeah en el sur de California");
rep(">Full-size luxury SUV<", ">SUV de lujo de tamaño completo<");
rep(">Presence on every arrival<", ">Presencia en cada llegada<");
rep(">Room for the whole party<", ">Espacio para todo el grupo<");
rep("<li>Up to 7 passengers</li>", "<li>Hasta 7 pasajeros</li>");
rep("<li>6+ large bags</li>", "<li>6+ maletas grandes</li>");
rep("<li>Hand-finished leather</li>", "<li>Piel de acabado fino</li>");
rep("<li>Climate &amp; chilled water</li>", "<li>Clima y agua fría</li>");
rep("<li>Meet &amp; greet included</li>", "<li>Recibimiento incluido</li>");
rep(">Meet our luxury fleet <svg", ">Conoce nuestra flota de lujo <svg");
rep('<span class="l">Luxury SUVs in service</span>', '<span class="l">SUV de lujo en servicio</span>');
rep('<span class="l">Licensed, vetted chauffeurs</span>', '<span class="l">Choferes con licencia</span>');
rep('<span class="l">Across Southern California</span>', '<span class="l">En el sur de California</span>');

/* ---------- routes ---------- */
rep(">Popular luxury routes</span>", ">Rutas de lujo populares</span>");
rep("Fixed fares you<br>can count on.", "Tarifas fijas en las<br>que puedes confiar.");
rep("Indicative fares for illustration. Final quote shown at booking via Moovs.",
    "Tarifas indicativas. La tarifa final se muestra al reservar con Moovs.");
rep("· Luxury SUV</div>", "· SUV de lujo</div>"); // route cards vehicle label

/* ---------- testimonials ---------- */
rep(">What guests say</span>", ">Lo que dicen los clientes</span>");
rep("Trusted for the<br>rides that matter.", "La confianza para los<br>viajes que importan.");
rep('"My flight landed early and the car was already waiting. Spotless, quiet and exactly the price I was quoted. This is how airport pickups should feel."',
    "«Mi vuelo aterrizó temprano y el auto ya estaba esperando. Impecable, silencioso y exactamente al precio cotizado. Así deberían sentirse las recogidas en el aeropuerto.»");
rep('<div class="rl">Corporate traveler · LAX</div>', '<div class="rl">Viajero corporativo · LAX</div>');
rep('"I book RideYeah for every client I bring into the city. Always on time, always professional. They make me look good — and that\'s worth everything."',
    "«Reservo RideYeah para cada cliente que traigo a la ciudad. Siempre puntuales, siempre profesionales. Me hacen quedar bien — y eso lo vale todo.»");
rep('<div class="rl">Executive assistant · Newport Beach</div>', '<div class="rl">Asistente ejecutiva · Newport Beach</div>');
rep('"We took the SUV from LAX to Santa Barbara for our anniversary. Chilled water, smooth ride, a chauffeur who knew every shortcut. Felt like first class on wheels."',
    "«Tomamos la SUV de LAX a Santa Bárbara por nuestro aniversario. Agua fría, un trayecto suave y un chofer que conocía cada atajo. Se sintió como primera clase sobre ruedas.»");
rep('<div class="rl">City-to-city · Santa Barbara</div>', '<div class="rl">Entre ciudades · Santa Bárbara</div>');

/* ---------- FAQ (visible + JSON-LD) ---------- */
rep("How does pricing work?", "¿Cómo funcionan las tarifas?");
rep("Every ride is a fixed, all-in price quoted before you book — no surge pricing, no meter, no surprises. Tolls and standard gratuity are included in the quote you see at checkout.",
    "Cada viaje tiene una tarifa fija y total cotizada antes de reservar — sin recargos por demanda, sin taxímetro, sin sorpresas. Peajes y propina estándar van incluidos en la tarifa que ves al reservar.");
rep("What happens if my flight is delayed?", "¿Qué pasa si mi vuelo se retrasa?");
rep("We track your flight in real time and adjust the pickup automatically. For delays, your chauffeur will be there when you land — at no extra charge. Complimentary wait time is included on airport pickups.",
    "Monitoreamos tu vuelo en tiempo real y ajustamos la recogida automáticamente. Si hay retraso, tu chofer estará ahí cuando aterrices — sin cargo extra. El tiempo de espera de cortesía está incluido en las recogidas de aeropuerto.");
rep("We track your flight in real time and adjust the pickup automatically. For delays, your chauffeur will be there when you land at no extra charge. Complimentary wait time is included on airport pickups.",
    "Monitoreamos tu vuelo en tiempo real y ajustamos la recogida automáticamente. Si hay retraso, tu chofer estará ahí cuando aterrices sin cargo extra. El tiempo de espera de cortesía está incluido en las recogidas de aeropuerto.");
rep("Which airports and areas do you serve?", "¿A qué aeropuertos y zonas dan servicio?");
rep("We cover LAX, John Wayne (SNA) and private terminals, plus door-to-door service across Los Angeles and Orange County. We also handle long-distance rides to San Diego, Santa Barbara and Palm Springs.",
    "Cubrimos LAX, John Wayne (SNA) y terminales privadas, además de servicio puerta a puerta en Los Ángeles y Orange County. También hacemos trayectos de larga distancia a San Diego, Santa Bárbara y Palm Springs.");
rep("We cover LAX, John Wayne (SNA) and private terminals, plus door-to-door service across Los Angeles and Orange County, and long-distance rides to San Diego, Santa Barbara and Palm Springs.",
    "Cubrimos LAX, John Wayne (SNA) y terminales privadas, además de servicio puerta a puerta en Los Ángeles y Orange County, y trayectos de larga distancia a San Diego, Santa Bárbara y Palm Springs.");
rep("How do I pay, and is it secure?", "¿Cómo pago y es seguro?");
rep("Booking and payment are handled securely through our booking partner, Moovs. All major credit and debit cards are accepted, and your price is locked in at the time of booking.",
    "La reserva y el pago se gestionan de forma segura con nuestro socio de reservas, Moovs. Se aceptan las principales tarjetas de crédito y débito, y tu precio queda fijado al momento de reservar.");
rep("Can I request a child seat or extra luggage space?", "¿Puedo pedir silla para niños o espacio extra de equipaje?");
rep("Yes. Add a note when you book, or contact us, and we'll arrange child seats — our spacious luxury SUVs seat up to 7 guests with room for luggage.",
    "Sí. Añade una nota al reservar, o contáctanos, y disponemos sillas para niños — nuestras espaciosas SUV de lujo acomodan hasta 7 pasajeros con espacio para equipaje.");
rep("Yes. Add a note when you book, or contact us, and we'll arrange child seats. Our spacious luxury SUV seats up to 6 guests with room for luggage.",
    "Sí. Añade una nota al reservar, o contáctanos, y disponemos sillas para niños. Nuestras espaciosas SUV de lujo acomodan hasta 7 pasajeros con espacio para equipaje.");
rep("What is your cancellation policy?", "¿Cuál es la política de cancelación?");
rep("Plans change — we get it. Cancellations made well in advance are free. For specific timing on your reservation, see your booking confirmation or reach us at info@rideyeah.com.",
    "Los planes cambian — lo entendemos. Las cancelaciones con suficiente antelación son gratuitas. Para los tiempos específicos de tu reserva, consulta tu confirmación o escríbenos a info@rideyeah.com.");
rep("Cancellations made well in advance are free. For specific timing on your reservation, see your booking confirmation or reach us at info@rideyeah.com.",
    "Las cancelaciones con suficiente antelación son gratuitas. Para los tiempos específicos de tu reserva, consulta tu confirmación o escríbenos a info@rideyeah.com.");
rep("Frequently asked<br>questions.", "Preguntas<br>frecuentes.");
rep(">Good to know</span>", ">Bueno saberlo</span>");

/* ---------- CTA ---------- */
rep(">Ready when you are</span>", ">Cuando tú quieras</span>");
rep("Your car is one<br>tap away.", "Tu auto está a<br>un toque.");
rep("Book in under a minute. Fixed price, professional chauffeur, on time — every time.",
    "Reserva en menos de un minuto. Precio fijo, chofer profesional, puntual — siempre.");
rep(">Reserve your ride <svg", ">Reserva tu viaje <svg");

/* ---------- footer ---------- */
rep("Luxury ground transportation across Los Angeles &amp; Orange County. Arrive relaxed, always on time.",
    "Transporte terrestre de lujo en Los Ángeles y Orange County. Llega relajado, siempre puntual.");
rep("<h3>Services</h3>", "<h3>Servicios</h3>");
rep("<h3>Company</h3>", "<h3>Empresa</h3>");
rep("<h3>Contact</h3>", "<h3>Contacto</h3>");
rep(">Airport transfers</a>", ">Traslados al aeropuerto</a>");
rep(">By the hour</a>", ">Por horas</a>");
rep(">Black car service</a>", ">Servicio black car</a>");
rep(">Popular routes</a>", ">Rutas populares</a>");
rep(">About us</a>", ">Nosotros</a>");
rep(">Our fleet</a>", ">Nuestra flota</a>");
rep("All rights reserved.", "Todos los derechos reservados.");
rep(" Message</a>", " Mensaje</a>");
rep('class="sc-book">Get Your Fixed Quote</button>', 'class="sc-book">Obtén tu tarifa fija</button>');

/* ---------- aria labels (polish) ---------- */
rep('aria-label="Open menu"', 'aria-label="Abrir menú"');
rep('aria-label="Close menu"', 'aria-label="Cerrar menú"');

/* ============ ES-specific transforms ============ */
/* canonical + og:url -> /es/ */
rep('rel="canonical" href="https://rideyeah.com/"', 'rel="canonical" href="https://rideyeah.com/es/"');
rep('property="og:url" content="https://rideyeah.com/"', 'property="og:url" content="https://rideyeah.com/es/"');

/* auto-detect: ES page only redirects users who chose English */
rep("(function(){try{var s=localStorage.getItem('ry_lang');if(s==='es'){location.replace('es/index.html');}else if(!s&&(navigator.language||'').toLowerCase().slice(0,2)==='es'){location.replace('es/index.html');}}catch(e){}})();",
    "(function(){try{var s=localStorage.getItem('ry_lang');if(s==='en'){location.replace('/');}}catch(e){}})();");

/* language switcher: flip ES pill -> EN pill */
rep('<a href="es/index.html" class="lang-pill" onclick="try{localStorage.setItem(\'ry_lang\',\'es\')}catch(e){}" aria-label="Ver en español">ES</a>',
    '<a href="/" class="lang-pill" onclick="try{localStorage.setItem(\'ry_lang\',\'en\')}catch(e){}" aria-label="View in English">EN</a>');
rep('<a href="es/index.html" class="lang-pill" onclick="try{localStorage.setItem(\'ry_lang\',\'es\')}catch(e){}">ES · Español</a>',
    '<a href="/" class="lang-pill" onclick="try{localStorage.setItem(\'ry_lang\',\'en\')}catch(e){}">EN · English</a>');

/* ============ path fixes (root-absolute so assets resolve from /es/) ============ */
h = h.replace(/url\("images\//g, 'url("/images/');
h = h.replace(/url\('images\//g, "url('/images/");
h = h.replace(/data-webp="images\//g, 'data-webp="/images/');
h = h.replace(/data-jpg="images\//g, 'data-jpg="/images/');
h = h.replace(/href="images\//g, 'href="/images/');
h = h.replace(/href="favicon\.svg"/g, 'href="/favicon.svg"');
h = h.replace(/href="apple-touch-icon\.png"/g, 'href="/apple-touch-icon.png"');
/* cross-page links -> ES slugs where they exist, else root-absolute EN */
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
/* remaining .html links -> root-absolute (EN pages until ES versions exist) */
h = h.replace(/href="([a-z0-9-]+\.html)"/g, 'href="/$1"');

mkdirSync("es", { recursive: true });
writeFileSync("es/index.html", h, "utf8");
console.log("✓ Generated es/index.html (" + (h.length / 1024).toFixed(0) + " KB)");
