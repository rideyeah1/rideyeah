# Palabras clave propias — rideyeah.com

*26 ago 2026. Este archivo NO repite la lista de competencia
(`palabras-clave-v1.md`: aeropuertos, rutas A→B, ciudades, ocasiones).
Aquí va lo que un barrido de competidores no revela: autocompletado real de
Google, preguntas de la gente, entidades locales y objeciones de compra.*

**Sobre la columna "Verificación":**

- **Verificado** = lo vi con mis propios ojos en la fuente que se indica.
- **Inferencia** = lo construí por lógica de mercado. No lo vi escrito en
  Google. Úsalo, pero sabiendo que es apuesta.

**No hay volúmenes de búsqueda en este archivo.** Requieren Keyword Planner con
cuenta de Google Ads activa. No invento números.

---

## 1. Inventario del sitio actual

*Verificado el 26 ago 2026 leyendo `https://rideyeah.com/sitemap.xml`, los
enlaces del menú y pie de la home, y el `<title>` y `<h1>` de cada página.*

### 1.1 Hallazgo importante antes de la tabla

El sitio es **mucho más grande de lo que dice el sitemap**. Existe una sección
completa, `/travel/`, con 32 páginas (aeropuertos, atracciones, centros de
convenciones y guías de hoteles) que **NO está en `sitemap.xml`**. Está enlazada
desde el pie de la home, así que Google puede llegar, pero no se está declarando.

También faltan del sitemap `/privacy` y `/terms`.

> **Acción concreta y barata:** meter las 34 URLs faltantes al `sitemap.xml`.
> Es la mejora de mayor retorno por minuto invertido de todo este documento.

Segundo hallazgo: **el sitio tiene versión en español completa** (`/es/`, 20
páginas) con hreflang bien puesto. El brief dice que el mercado es inglés —
conviene decidir si esa mitad del sitio se mantiene o se recorta, porque hoy
duplica el esfuerzo de contenido.

### 1.2 Páginas principales (en el sitemap)

| URL | `<title>` | `<h1>` |
|---|---|---|
| `/` | Luxury Car Service & LAX Airport Transfers · Los Angeles \| RideYeah | Arrive relaxed. Always on time. |
| `/airport-transfers` | LAX Airport Transfers & Car Service \| RideYeah Los Angeles | LAX airport transfers, done right. |
| `/black-car-service` | Black Car Service Los Angeles \| Executive Car Hire \| RideYeah | Black car service, Los Angeles. |
| `/hourly-chauffeur` | Hourly Chauffeur & Car Service by the Hour \| RideYeah Los Angeles | Your chauffeur, by the hour. |
| `/popular-routes` | Popular Luxury Routes & Fixed Fares \| LAX Luxury Black SUV Service \| RideYeah | Popular routes, fixed fares. |
| `/fleet` | Our Fleet · Luxury Black SUV Chauffeur Service \| RideYeah | Luxury Black SUVs. Every ride. |
| `/about` | About us · RideYeah — Luxury Ground Transportation | Luxury, measured in calm. |
| `/careers` | Careers · Drive with RideYeah — Chauffeur Jobs in Los Angeles | Drive with RideYeah. |
| `/corporate-transportation` | Corporate Transportation Los Angeles \| Executive Car Service \| RideYeah | Corporate & executive transportation. |
| `/service-areas` | Service Areas \| Chauffeur Service Across LA & OC \| RideYeah | Where we drive. |
| `/faq` | FAQ \| Luxury Chauffeur & Airport Transfer Questions \| RideYeah | Frequently asked questions. |
| `/blog/` | Blog — Luxury Transportation Guides for LA & OC \| RideYeah | The RideYeah journal. |

### 1.3 Páginas de ruta LAX → destino (12, en el sitemap)

Todas comparten el mismo patrón de `<title>` y `<h1>`:
`LAX ⇄ {Ciudad} Car Service | Private Luxury Black SUV | RideYeah`
y `LAX ⇄ {Ciudad}, in quiet luxury.`

| URL | Ciudad |
|---|---|
| `/lax-to-downtown-la` | Downtown LA |
| `/lax-to-long-beach` | Long Beach |
| `/lax-to-pasadena` | Pasadena |
| `/lax-to-calabasas` | Calabasas |
| `/lax-to-glendale` | Glendale |
| `/lax-to-anaheim` | Anaheim |
| `/lax-to-huntington-beach` | Huntington Beach |
| `/lax-to-simi-valley` | Simi Valley |
| `/lax-to-thousand-oaks` | Thousand Oaks |
| `/lax-to-laguna-beach` | Laguna Beach |
| `/lax-to-camarillo` | Camarillo |
| `/lax-to-santa-barbara` | Santa Barbara |

**Ojo:** todas son **LAX → ciudad**. No existe ninguna **ciudad → LAX**, ni
ninguna ruta desde BUR, VNY, SNA u ONT. Eso es hueco puro.

### 1.4 Páginas de ciudad (10, en el sitemap)

Patrón: `Chauffeur Service in {Ciudad} | Luxury Black SUV | RideYeah`
y `Chauffeur service in {Ciudad}.`

| URL | Ciudad |
|---|---|
| `/beverly-hills-chauffeur-service` | Beverly Hills |
| `/santa-monica-chauffeur-service` | Santa Monica |
| `/calabasas-chauffeur-service` | Calabasas |
| `/pasadena-chauffeur-service` | Pasadena |
| `/newport-beach-chauffeur-service` | Newport Beach |
| `/thousand-oaks-chauffeur-service` | Thousand Oaks |
| `/malibu-chauffeur-service` | Malibu |
| `/west-hollywood-chauffeur-service` | West Hollywood |
| `/long-beach-chauffeur-service` | Long Beach |

**Ojo grande:** hay página de ciudad para Beverly Hills y Malibu, pero **no para
Simi Valley**, que es la base del negocio. Tampoco para Westlake Village,
Moorpark, Woodland Hills, Oxnard ni Ventura.

### 1.5 Blog (5 artículos)

| URL | `<title>` |
|---|---|
| `/blog/best-lax-airport-transportation-to-thousand-oaks` | Best LAX Airport Transportation to Thousand Oaks \| RideYeah |
| `/blog/lax-to-calabasas-luxury-transportation` | LAX to Calabasas Luxury Transportation \| Private SUV \| RideYeah |
| `/blog/executive-suv-service-los-angeles` | Executive SUV Service in Los Angeles \| Chauffeured \| RideYeah |
| `/blog/private-chauffeur-service-for-business-travelers` | Private Chauffeur Service for Business Travelers \| LA \| RideYeah |
| `/blog/corporate-transportation-services-los-angeles` | Corporate Transportation Services in Los Angeles \| RideYeah |

Los dos primeros **canibalizan** a `/lax-to-thousand-oaks` y
`/lax-to-calabasas`: misma palabra clave, dos URLs. Hay que fusionar o
redireccionar.

### 1.6 Sección `/travel/` — 32 páginas FUERA del sitemap

| URL | `<title>` |
|---|---|
| `/travel/` | RideYeah Travel Hub — Southern California Airport & Travel Guides |
| `/travel/airports/` | Southern California Airports — Guides, Terminals & Rideshare |
| `/travel/airports/lax/` | LAX Airport Guide: Terminals, Rideshare Pickup & Tips |
| `/travel/airports/bur/` | Hollywood Burbank (BUR) Airport Guide & Rideshare Tips |
| `/travel/airports/ont/` | Ontario Airport (ONT) Guide: Terminals & Rideshare |
| `/travel/airports/sna/` | John Wayne Airport (SNA) Guide: Disneyland & Rideshare |
| `/travel/airports/lgb/` | Long Beach Airport (LGB) Guide, Terminals & Rideshare |
| `/travel/airports/psp/` | Palm Springs Airport (PSP) Guide: Terminals, Pickup & Coachella |
| `/travel/airports/sba/` | Santa Barbara Airport (SBA) Guide & Ground Transportation |
| `/travel/airports/vny/` | Van Nuys Airport (VNY) Guide: Private Jets & Transfers |
| `/travel/attractions/` | Southern California Attractions — Visitor Guides & Transport |
| `/travel/attractions/disneyland/` | Disneyland Resort Guide: Getting There & Tips |
| `/travel/attractions/getty-center/` | The Getty Center Guide: Getting There & Tips |
| `/travel/attractions/hollywood-sign/` | Hollywood Sign Guide: Best Views & Getting There |
| `/travel/attractions/malibu/` | Malibu Travel Guide: Beaches & Getting There |
| `/travel/attractions/rodeo-drive/` | Rodeo Drive Guide: Getting There & Visitor Tips |
| `/travel/attractions/santa-monica-pier/` | Santa Monica Pier Guide: Getting There & Tips |
| `/travel/attractions/sofi-stadium/` | SoFi Stadium Guide: Getting There & Event Tips |
| `/travel/attractions/universal-studios-hollywood/` | Universal Studios Hollywood: Getting There & Tips |
| `/travel/convention-centers/` | Southern California Convention Centers & Event Transport |
| `/travel/convention-centers/anaheim-convention-center/` | Anaheim Convention Center: Airports, Parking & Transport |
| `/travel/convention-centers/long-beach-convention-center/` | Long Beach Convention Center: Airports, Parking & Transport |
| `/travel/convention-centers/los-angeles-convention-center/` | Los Angeles Convention Center: Airport, Parking & Transport |
| `/travel/convention-centers/oxnard-performing-arts-center/` | Oxnard Performing Arts Center: Airports, Parking & Transport |
| `/travel/convention-centers/pasadena-convention-center/` | Pasadena Convention Center: Airports, Parking & Transport |
| `/travel/convention-centers/ventura-county-fairgrounds/` | Ventura County Fairgrounds: Airports, Parking & Transport |
| `/travel/guides/` | Southern California Travel Guides — Hotels & Tips |
| `/travel/guides/best-hotels-near-lax/` | Best Hotels Near LAX Airport: Top Picks & Transfers |
| `/travel/guides/hotels-near-disneyland/` | Hotels Near Disneyland: Best Anaheim Stays & SNA Transfers |
| `/travel/guides/hotels-near-universal-studios/` | Hotels Near Universal Studios Hollywood + BUR Transfers |
| `/travel/guides/luxury-hotels-in-beverly-hills/` | Luxury Hotels in Beverly Hills: 5-Star Picks & LAX Transfers |
| `/travel/guides/luxury-hotels-in-santa-monica/` | Luxury Hotels in Santa Monica: Beachfront Picks & LAX Transfers |

Estos títulos están escritos para **intención informativa** ("guide", "getting
there", "tips"), no para intención de reserva. Ver punto 3: hay que añadirles la
frase transaccional o crear la página hermana.

### 1.7 Resumen de qué está cubierto y qué no

| Cubierto hoy | Hueco |
|---|---|
| LAX → 12 ciudades | Ciudad → LAX (0 páginas) |
| Servicio en 9 ciudades | Simi Valley, Westlake Village, Moorpark, Oxnard, Ventura, Woodland Hills |
| Guía informativa de 8 aeropuertos | Página de reserva por aeropuerto no-LAX (BUR, VNY, SNA, ONT) |
| Guía informativa de POIs y hoteles | Página de reserva hacia esos POIs |
| FAQ (una sola página) | Preguntas de precio/propina/espera como páginas propias |
| Corporativo | Cuentas corporativas, facturación, roadshow |
| Por hora | Bodas, cruceros, viñedos, conciertos, médico |

---

## 2. Autocompletado y búsquedas relacionadas

### 2.0 Qué pude y qué no pude verificar — léelo antes de la tabla

- **Autocompletado de Google: SÍ.** Verificado el 26 ago 2026 contra el endpoint
  oficial de sugerencias de Google (`suggestqueries.google.com`, `hl=en`,
  `gl=us`). Las frases de abajo son **literales, tal cual las devolvió Google**.
- **Bloque "People Also Ask" de Google: NO.** Google respondió con una
  verificación anti-robot (CAPTCHA) al intentar cargar la página de resultados.
  **No resuelvo CAPTCHAs**, así que no tengo el bloque PAA literal. No lo invento.
- **Búsquedas relacionadas del pie: sustituidas.** Como Google bloqueó, capturé
  el bloque **"Búsquedas relacionadas" de DuckDuckGo** y el
  **"People also search for" de Bing**. Son señal real de demanda, pero **no son
  el bloque de Google**. Están etiquetadas como tal.

> **Cómo conseguir el PAA de verdad:** desde un navegador con IP de EE. UU.,
> buscar cada semilla y copiar el bloque. O usar Search Console una vez tenga
> tráfico. Es media hora de trabajo manual y vale la pena.

### 2.1 Semilla `LAX car service` — autocompletado de Google (literal)

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| lax car service pick up | `/lax-pickup-instructions/` (nueva) | Verificado — autocompletado Google |
| lax car service meet and greet | `/lax-meet-and-greet/` (nueva) | Verificado — autocompletado Google |
| lax car service with car seat | `/car-service-with-car-seat-lax/` (nueva) | Verificado — autocompletado Google |
| lax car service reviews | `/about` (bloque de reseñas) | Verificado — autocompletado Google |
| lax car service reddit | contenido/foro, no página | Verificado — autocompletado Google |
| lax car service orange county | `/lax-to-orange-county/` (nueva) | Verificado — autocompletado Google |
| lax car service to disneyland | `/lax-to-disneyland/` (nueva) | Verificado — autocompletado Google |
| lax car service to anaheim | `/lax-to-anaheim` (ya existe) | Verificado — autocompletado Google |
| lax car service cheap | `/airport-transfers` (bloque de tarifas) | Verificado — autocompletado Google |
| cheapest lax car service | idem | Verificado — autocompletado Google |
| lax private car service | `/black-car-service` | Verificado — autocompletado Google |
| lax airport private car service | idem | Verificado — autocompletado Google |
| lax black car service | `/black-car-service` | Verificado — autocompletado Google |
| best lax car service | `/airport-transfers` | Verificado — autocompletado Google |
| best lax car service reddit | contenido | Verificado — autocompletado Google |
| lax town car service | `/black-car-service` | Verificado — autocompletado Google |
| lax town car service reviews | idem | Verificado — autocompletado Google |
| car service to lax near me | `/airport-transfers` | Verificado — autocompletado Google |
| car service to lax cost | `/lax-car-service-cost/` (nueva) | Verificado — autocompletado Google |
| executive car service lax cancellation policy | `/faq` | Verificado — autocompletado Google |
| executive car service lax promo code | no perseguir (marca ajena) | Verificado — autocompletado Google |

**Lectura:** los tres modificadores que más aparecen son **`pick up`**,
**`meet and greet`** y **`car seat`**. Ninguno de los tres existe hoy en el
sitio. Esa es demanda de reserva pura que se está regalando.

### 2.2 `LAX car service` + destino — autocompletado de Google (literal)

Google completa `car service lax to …` con estos destinos:

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| car service lax to hollywood | `/lax-to-hollywood/` (nueva) | Verificado — autocompletado Google |
| car service lax to west hollywood | `/lax-to-west-hollywood/` (nueva) | Verificado — autocompletado Google |
| car service lax to huntington beach | `/lax-to-huntington-beach` (existe) | Verificado — autocompletado Google |
| car service lax to hotel | `/travel/guides/best-hotels-near-lax/` | Verificado — autocompletado Google |
| car service lax to disneyland hotel | `/lax-to-disneyland/` (nueva) | Verificado — autocompletado Google |
| car service lax to beverly hills | `/lax-to-beverly-hills/` (nueva) | Verificado — autocompletado Google |
| car service lax to pasadena | `/lax-to-pasadena` (existe) | Verificado — autocompletado Google |
| car service lax to burbank | `/lax-to-burbank/` (nueva) | Verificado — autocompletado Google |
| car service lax to palm springs | `/lax-to-palm-springs/` (nueva) | Verificado — autocompletado Google |
| car service lax to psp | (misma, como variante en el cuerpo) | Verificado — autocompletado Google |

Y con `car service to lax from …`:

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| car service to lax from orange county | `/orange-county-to-lax/` (nueva) | Verificado — autocompletado Google |
| best car service to lax from orange county | idem | Verificado — autocompletado Google |
| car service to lax from thousand oaks | `/thousand-oaks-to-lax/` (nueva) | Verificado — autocompletado Google |
| car service to lax from santa barbara | `/santa-barbara-to-lax/` (nueva) | Verificado — autocompletado Google |
| car service to lax from santa clarita | `/santa-clarita-to-lax/` (nueva) | Verificado — autocompletado Google |
| car service to lax from san diego | `/san-diego-to-lax/` (nueva) | Verificado — autocompletado Google |
| car service to lax from palm springs | `/palm-springs-to-lax/` (nueva) | Verificado — autocompletado Google |
| car service to and from lax | `/airport-transfers` | Verificado — autocompletado Google |
| car service camarillo to lax | `/camarillo-to-lax/` (nueva) | Verificado — autocompletado Google |
| car service carlsbad to lax | `/carlsbad-to-lax/` (nueva) | Verificado — autocompletado Google |
| car service bakersfield to lax | `/bakersfield-to-lax/` (nueva) | Verificado — autocompletado Google |

> **Este es el hallazgo más grande del punto 2.** Google autocompleta el sentido
> **ciudad → LAX** con al menos 11 origenes distintos, y el sitio tiene **cero**
> páginas en ese sentido. Las 12 páginas existentes son todas LAX → ciudad.
> La gente que va *hacia* el aeropuerto es la que reserva con antelación, la que
> paga, y la que repite. Duplicar las 12 rutas en sentido inverso es el trabajo
> de mayor retorno del documento.

### 2.3 Semilla `Simi Valley car service` — autocompletado de Google (literal)

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| simi valley car service | `/simi-valley-chauffeur-service/` (nueva) | Verificado — autocompletado Google |
| simi valley black car service | idem | Verificado — autocompletado Google |
| simi valley to lax car service | `/simi-valley-to-lax/` (nueva) | Verificado — autocompletado Google |
| simi valley cab service | idem (mencionar en cuerpo) | Verificado — autocompletado Google |

**Aviso serio sobre esta semilla.** El autocompletado de Google para
"Simi Valley car service" está **dominado por talleres mecánicos y
concesionarios**: `simi valley car repair`, `simi valley car detailing services`,
`first kia simi valley car service`, `first nissan simi valley car service`,
`simi valley full service car wash`, `simi valley auto repair shops`.

Lo mismo confirma DuckDuckGo: sus diez búsquedas relacionadas para esa semilla
son **todas de concesionarios** (`simi valley honda`, `ford simi valley`,
`simi valley chrysler dodge jeep`, etc.).

> **Consecuencia práctica:** en Simi Valley, la frase que separa al cliente
> correcto del que busca taller es **`black car`**, **`chauffeur`** o
> **`to LAX`**. Optimizar la página por "Simi Valley car service" a secas trae
> tráfico de gente que quiere cambiar el aceite. Usar
> **`Simi Valley black car service`** y **`Simi Valley to LAX car service`**.

### 2.4 Semilla `black car service Los Angeles` — autocompletado de Google (literal)

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| black car service los angeles airport | `/black-car-service` | Verificado — autocompletado Google |
| black suv car service los angeles | `/fleet` | Verificado — autocompletado Google |
| best black car service los angeles | `/black-car-service` | Verificado — autocompletado Google |
| elite black car service los angeles | idem | Verificado — autocompletado Google |
| black car limo los angeles | idem | Verificado — autocompletado Google |
| how much does black car service cost | `/black-car-service-cost/` (nueva) | Verificado — autocompletado Google |
| what is black car service | `/blog/what-is-black-car-service/` (nueva) | Verificado — autocompletado Google |
| black car service vs uber | `/blog/black-car-service-vs-uber/` (nueva) | Verificado — autocompletado Google |

`black owned car service los angeles` y `black tie car service los angeles`
también salen, pero son otra intención (empresa de propiedad afroamericana y una
marca llamada Black Tie). **No perseguirlas.**

### 2.5 Semilla `airport transfer Ventura County` — el hallazgo raro

**`airport transfer Ventura County` devolvió CERO sugerencias de Google.**
La respuesta literal del endpoint fue `["airport transfer Ventura County",[]]`.
Es decir: **nadie escribe esa frase.** Es vocabulario de la industria, no del
cliente.

Lo que la gente sí escribe en esa zona, según autocompletado de Google:

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| ventura county airport shuttle to lax | `/ventura-county-to-lax/` (nueva) | Verificado — autocompletado Google |
| airport shuttle ventura county to lax | idem | Verificado — autocompletado Google |
| ventura county airport shuttle service | idem | Verificado — autocompletado Google |
| ventura county airport shuttle schedule | idem (bloque de horarios) | Verificado — autocompletado Google |
| airport shuttle ventura ca | `/ventura-chauffeur-service/` (nueva) | Verificado — autocompletado Google |
| shuttle to lax from camarillo | `/camarillo-to-lax/` (nueva) | Verificado — autocompletado Google |
| camarillo to burbank airport shuttle | `/camarillo-to-burbank-airport/` (nueva) | Verificado — autocompletado Google |
| closest airport to ventura | `/travel/guides/` (nueva guía) | Verificado — autocompletado Google |
| ventura county car service | `/ventura-county-chauffeur-service/` (nueva) | Verificado — autocompletado Google |

Y de DuckDuckGo (búsquedas relacionadas, no Google):

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| shuttles to lax from ventura | `/ventura-county-to-lax/` | Verificado — relacionadas DuckDuckGo |
| shuttles to lax ventura county | idem | Verificado — relacionadas DuckDuckGo |
| airport shuttle service ventura county | idem | Verificado — relacionadas DuckDuckGo |
| bus from ventura to lax | contenido comparativo | Verificado — relacionadas DuckDuckGo |
| lax to ventura direct bus | contenido comparativo | Verificado — relacionadas DuckDuckGo |
| ventura airport shuttle schedule | `/ventura-county-to-lax/` | Verificado — relacionadas DuckDuckGo |

> **Dos cosas importantes de aquí.**
>
> **Una:** en Ventura County la palabra del cliente es **`shuttle`**, no
> `transfer` ni `car service`. Aunque Rideyeah venda un servicio privado y
> superior, la página tiene que **usar la palabra `shuttle` en el cuerpo** para
> que Google la conecte con esas búsquedas, y luego posicionarse como
> "private alternative to the shared shuttle".
>
> **Dos:** el competidor real ahí **no es una empresa de black car**. Es
> **Ventura County Airporter** (`venturashuttle.com`), un shuttle compartido con
> 13 salidas diarias a LAX, más Roadrunner Shuttle y Smart Shuttle. Todos
> aparecen en el pack local de Bing. Un barrido de competencia de black car
> nunca los habría mostrado. **Ese es el negocio a robarle**: el pasajero que
> hoy comparte una van y quiere ir solo.

### 2.6 Semilla `chauffeur service Thousand Oaks` — autocompletado de Google (literal)

Google **reescribe la semilla**: casi ninguna sugerencia usa la palabra
"chauffeur". Devuelve "car service" y "limo service".

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| car service thousand oaks | `/thousand-oaks-chauffeur-service` (existe) | Verificado — autocompletado Google |
| car service thousand oaks to lax | `/thousand-oaks-to-lax/` (nueva) | Verificado — autocompletado Google |
| limo service from thousand oaks to lax | idem | Verificado — autocompletado Google |
| executive car service thousand oaks | `/thousand-oaks-chauffeur-service` | Verificado — autocompletado Google |
| limo service thousand oaks | idem (variante en cuerpo) | Verificado — autocompletado Google |
| limousine service thousand oaks ca | idem | Verificado — autocompletado Google |
| car hire thousand oaks | idem | Verificado — autocompletado Google |

> **Consecuencia:** el título actual de la página es
> "Chauffeur Service in Thousand Oaks". Google dice que la gente escribe
> **"car service"** y **"limo service"**, no "chauffeur service". Conviene que
> el `<title>` diga **`Thousand Oaks Car Service`** y que "chauffeur" y "limo"
> vayan en el H2 y el cuerpo. Lo mismo aplica a las otras 8 páginas de ciudad,
> que usan todas el mismo patrón "Chauffeur Service in …".

### 2.7 Otras relacionadas verificadas (no-Google)

Bing, "People also search for" sobre `LAX car service`:

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| executive car service lax | `/black-car-service` | Verificado — Bing PASF |
| car service to lax | `/airport-transfers` | Verificado — Bing PASF |
| lax airport shuttle | contenido comparativo | Verificado — Bing PASF |
| lax transportation service | `/airport-transfers` | Verificado — Bing PASF |
| lax airport transportation | idem | Verificado — Bing PASF |
| lax shuttle service from home | `/ventura-county-to-lax/` | Verificado — Bing PASF |

DuckDuckGo, búsquedas relacionadas:

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| private car pickup from lax | `/lax-meet-and-greet/` | Verificado — relacionadas DuckDuckGo |
| lax car service flat rates | `/popular-routes` | Verificado — relacionadas DuckDuckGo |
| reliable car service lax airport | `/airport-transfers` | Verificado — relacionadas DuckDuckGo |
| car service pick up lax | `/lax-pickup-instructions/` | Verificado — relacionadas DuckDuckGo |
| cheap car service to lax | `/lax-car-service-cost/` | Verificado — relacionadas DuckDuckGo |
| executive airport car service near me | `/black-car-service` | Verificado — relacionadas DuckDuckGo |
| black car service prices | `/black-car-service-cost/` | Verificado — relacionadas DuckDuckGo |
| black car services near me | `/service-areas` | Verificado — relacionadas DuckDuckGo |
| private driver los angeles | `/hourly-chauffeur` | Verificado — relacionadas DuckDuckGo |
| chauffeur service los angeles ca | `/black-car-service` | Verificado — relacionadas DuckDuckGo |
| executive car service los angeles | idem | Verificado — relacionadas DuckDuckGo |
| los angeles airport car service | `/airport-transfers` | Verificado — relacionadas DuckDuckGo |
| exclusive sedan service los angeles | `/fleet` | Verificado — relacionadas DuckDuckGo |
| los angeles limousine services | variante en cuerpo | Verificado — relacionadas DuckDuckGo |

---

## 3. Términos locales y de entidad

*Cada fila es la frase con la que alguien busca transporte hacia ese sitio.
Verifiqué con autocompletado de Google (26 ago 2026) cuáles frases Google
completa de verdad. Donde no completó, lo marco como inferencia — no invento.*

**Recordatorio del punto 1:** el sitio ya tiene guías informativas en `/travel/`
de SoFi Stadium, Disneyland, Universal, Getty, Rodeo Drive, Santa Monica Pier,
Hollywood Sign, Malibu y 6 centros de convenciones. **Están escritas para
informar, no para reservar.** Para la mayoría de estas filas no hay que crear
página nueva: hay que **añadirle a la guía existente un bloque de reserva** con
la frase transaccional en un H2.

### 3.1 Estadios y recintos

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| car service to sofi stadium | `/travel/attractions/sofi-stadium/` (añadir bloque de reserva) | Verificado — autocompletado Google |
| private car service to sofi stadium | idem | Verificado — autocompletado Google |
| limo service to sofi stadium | idem | Verificado — autocompletado Google |
| shuttle service to sofi stadium | idem | Verificado — autocompletado Google |
| sofi stadium transportation options | idem | Verificado — autocompletado Google |
| what airport is closest to sofi stadium | idem (bloque FAQ) | Verificado — autocompletado Google |
| car service to hollywood bowl | `/travel/attractions/hollywood-bowl/` (crear) | Verificado — autocompletado Google |
| limo service to hollywood bowl | idem | Verificado — autocompletado Google |
| shuttle service to hollywood bowl | idem | Verificado — autocompletado Google |
| hollywood bowl transportation options | idem | Verificado — autocompletado Google |
| is there a shuttle to the hollywood bowl | idem (bloque FAQ) | Verificado — autocompletado Google |
| car service to dodger stadium | `/travel/attractions/dodger-stadium/` (crear) | Verificado — autocompletado Google |
| limo service to dodger stadium | idem | Verificado — autocompletado Google |
| shuttle service to dodger stadium | idem | Verificado — autocompletado Google |
| car service to crypto arena | `/travel/attractions/crypto-com-arena/` (crear) | Verificado — autocompletado Google |
| rose bowl shuttle service | `/travel/attractions/rose-bowl/` (crear) | Verificado — autocompletado Google |
| rose bowl transportation | idem | Verificado — autocompletado Google |
| rose parade transportation | idem (bloque estacional) | Verificado — autocompletado Google |
| car service to rose bowl | idem | Inferencia (Google no la completó) |
| car service to intuit dome | `/travel/attractions/intuit-dome/` (crear) | Inferencia |
| car service to the greek theatre | guía a crear | Inferencia |

> **Nota sobre SoFi Stadium:** el autocompletado devuelve
> `sofi stadium transportation world cup` y `sofi stadium shuttle world cup`.
> Hay demanda estacional activa ligada al Mundial. Vale la pena un H2 dedicado
> en esa página. **No verifiqué fechas ni sedes del torneo**, sólo que la gente
> lo busca así.

> **Nota sobre Hollywood Bowl:** casi todas las sugerencias giran alrededor de
> `parking` y `park and ride`. El ángulo que convierte no es "somos lujo", es
> **"no busques estacionamiento"**. Escribir la página desde ahí.

### 3.2 Puertos de crucero — el hueco más limpio del documento

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| lax to long beach cruise terminal transportation | `/lax-to-long-beach-cruise-terminal/` (crear) | Verificado — autocompletado Google |
| long beach cruise terminal shuttle to lax | `/long-beach-cruise-terminal-to-lax/` (crear) | Verificado — autocompletado Google |
| long beach cruise terminal transportation | `/long-beach-cruise-terminal-car-service/` (crear) | Verificado — autocompletado Google |
| long beach cruise terminal taxi | idem (variante en cuerpo) | Verificado — autocompletado Google |
| long beach cruise port shuttle | idem | Verificado — autocompletado Google |
| long beach airport to cruise terminal shuttle | `/lgb-to-long-beach-cruise-terminal/` (crear) | Verificado — autocompletado Google |
| los angeles cruise port transportation | `/san-pedro-cruise-terminal-car-service/` (crear) | Verificado — autocompletado Google |
| where do cruise ships dock in los angeles | idem (bloque FAQ) | Verificado — autocompletado Google |
| lax to san pedro cruise terminal car service | idem | Inferencia |
| car service to world cruise center san pedro | idem | Inferencia |

> **Por qué esto importa más de lo que parece.** El pasajero de crucero reserva
> **con meses de antelación**, viaja con **mucho equipaje**, va **en grupo** y
> tiene **hora fija de embarque** — es exactamente el cliente de un SUV privado
> y no el de un Uber. El sitio hoy no tiene **ni una sola** página de crucero.
> Los competidores de black car analizados tampoco. Es hueco limpio.
>
> Además, `/travel/airports/lgb/` ya existe: la página de terminal de crucero
> enlaza natural desde ahí.

### 3.3 Hoteles y centros de convenciones

Las 6 páginas de centros de convenciones y las 5 guías de hoteles **ya existen**
en `/travel/`. Falta la frase transaccional.

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| car service to anaheim convention center | `/travel/convention-centers/anaheim-convention-center/` | Inferencia |
| car service to los angeles convention center | `/travel/convention-centers/los-angeles-convention-center/` | Inferencia |
| lax to los angeles convention center car service | idem | Inferencia |
| sna to anaheim convention center car service | idem (Anaheim) | Inferencia |
| car service to long beach convention center | `/travel/convention-centers/long-beach-convention-center/` | Inferencia |
| car service to pasadena convention center | `/travel/convention-centers/pasadena-convention-center/` | Inferencia |
| car service to ventura county fairgrounds | `/travel/convention-centers/ventura-county-fairgrounds/` | Inferencia |
| hotel car service los angeles | `/travel/guides/best-hotels-near-lax/` | Inferencia |
| car service lax to hotel | idem | **Verificado** — autocompletado Google |
| lax to beverly hills hotel car service | `/travel/guides/luxury-hotels-in-beverly-hills/` | Inferencia |
| conference transportation los angeles | `/corporate-transportation` | Inferencia |
| trade show transportation los angeles | idem | Inferencia |

Todo este bloque es **inferencia** salvo la fila marcada. Google no autocompleta
"car service to X convention center". Sigue teniendo sentido crearlo — la
intención es obvia y la competencia nula — pero **no prometas volumen**.

### 3.4 Viñedos y tours de vino

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| santa barbara wine tour transportation | `/santa-barbara-wine-tour-transportation/` (crear) | Verificado — autocompletado Google |
| santa barbara wine tour driver | idem | Verificado — autocompletado Google |
| santa barbara wine tour from los angeles | idem | Verificado — autocompletado Google |
| santa barbara wine tours and hotel packages | idem (bloque) | Verificado — autocompletado Google |
| wine tours with transportation near me | idem | Verificado — autocompletado Google |
| malibu wine tours | `/malibu-wine-tour-transportation/` (crear) | Verificado — autocompletado Google |
| malibu wine tour transportation | idem | Inferencia |
| private wine tour chauffeur santa ynez | idem | Inferencia |
| napa-style wine tour car service los angeles | no perseguir | Inferencia |

> **Muy buen encaje con `/hourly-chauffeur`.** Un tour de vino es exactamente
> una reserva por horas. `santa barbara wine tour driver` es literalmente la
> gente buscando un chofer, y el sitio ya tiene página de chofer por horas sin
> mencionar vino ni una vez. Añadir un caso de uso "wine tour" ahí, y la página
> dedicada aparte.
>
> Ojo con Malibu: el autocompletado está copado por **Malibu Wine Safaris**
> (`giraffe`, `vw bus`, `4x4`, `safari`). Es una marca concreta con su propio
> transporte. Ahí Rideyeah compite por el traslado *hasta* el viñedo, no por el
> tour. Escribir la página desde ese ángulo.

### 3.5 Estudios de cine

Señal **débil**. Lo único que Google completó fue
`shuttle to warner bros studio`. No hay demanda visible de "car service to
{estudio}".

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| shuttle to warner bros studio | `/travel/attractions/warner-bros-studio-tour/` (crear) | Verificado — autocompletado Google |
| car service to universal studios hollywood | `/travel/attractions/universal-studios-hollywood/` (existe) | Inferencia |
| bur to universal studios car service | idem | Inferencia |
| production transportation los angeles | `/corporate-transportation` | Inferencia |
| talent transportation los angeles | idem | Inferencia |
| studio car service burbank | `/burbank-chauffeur-service/` (crear) | Inferencia |

> **Recomendación honesta:** el bloque de estudios es el más flojo de los cinco.
> No lo pongas en la primera tanda. La excepción es el ángulo B2B
> (`production transportation`, `talent transportation`), que no es SEO de
> volumen sino de venta directa a productoras — y para eso la página sirve como
> respaldo, no como captación.

### 3.6 Hospitales

**Aquí el dato dice que no.** `car service to hospital Los Angeles` devolvió
**cero sugerencias**. Lo que sí existe es demanda alrededor de **Cedars-Sinai**,
pero es de su **shuttle interno gratuito** (`cedars sinai shuttle schedule`,
`cedars sinai shuttle tracker`, `cedars sinai transportation services`) — gente
buscando el servicio del propio hospital, no contratando un chofer.

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| medical appointment transportation los angeles | `/medical-appointment-car-service/` (crear, baja prioridad) | Inferencia |
| non emergency medical transportation los angeles | idem | Inferencia |
| car service to cedars sinai | idem | Inferencia — Google **no** la completó |

> **Recomendación:** saltar el bloque de hospitales por ahora. La búsqueda que
> existe la absorbe el propio hospital con su shuttle gratis, y el segmento de
> transporte médico no urgente es otro negocio (seguros, sillas de ruedas,
> licencias distintas). No es donde está el dinero de Rideyeah.

---

## 4. Preguntas de objeción y precio

*Lo que la gente escribe **antes** de contratar. Verifiqué cada frase contra el
autocompletado de Google el 26 ago 2026. Las que Google no completó van como
inferencia — siguen sirviendo para el FAQ, pero no traerán tráfico por sí solas.*

**Destino recomendado para casi todo este punto:** el sitio ya tiene `/faq`,
pero es **una sola página**. Una página no puede posicionar por veinte
preguntas. La estructura que funciona es: `/faq` como índice, y las 5 o 6
preguntas con demanda verificada como **página propia o artículo de blog**.

### 4.1 Precio — la objeción número uno

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| how much does black car service cost | `/black-car-service-cost/` (crear) | Verificado — autocompletado Google |
| black car service prices | idem | Verificado — relacionadas DuckDuckGo |
| how much is a black car service | idem | Verificado — autocompletado Google |
| car service to lax cost | `/lax-car-service-cost/` (crear) | Verificado — autocompletado Google |
| how much is a car service to lax | idem | Verificado — autocompletado Google |
| how much is car service from lax to palm springs | `/lax-to-palm-springs/` | Verificado — autocompletado Google |
| lax car service cheap | `/lax-car-service-cost/` | Verificado — autocompletado Google |
| cheapest lax car service | idem | Verificado — autocompletado Google |
| cheap car service to lax | idem | Verificado — relacionadas DuckDuckGo |
| lax car service flat rates | `/popular-routes` | Verificado — relacionadas DuckDuckGo |
| is car service cheaper than uber | `/blog/black-car-service-vs-uber/` (crear) | Verificado — autocompletado Google |
| is car service more expensive than uber | idem | Verificado — autocompletado Google |
| is there a car service cheaper than uber | idem | Verificado — autocompletado Google |
| black car service vs uber | idem | Verificado — autocompletado Google |
| what is black car service | `/blog/what-is-black-car-service/` (crear) | Verificado — autocompletado Google |

> **La página de precio es obligatoria.** Cinco de las quince frases de arriba
> tienen la palabra "cost", "price" o "cheap". Hoy `/popular-routes` promete
> "fixed fares" en el `<title>` — hay que asegurarse de que la cifra esté
> visible en la página y no detrás del formulario de Moovs. Si el número no se
> ve, el usuario vuelve a Google.

### 4.2 Propina

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| how much to tip a chauffeur | `/blog/how-much-to-tip-a-chauffeur/` (crear) | Verificado — autocompletado Google |
| how much to tip a car service driver | idem | Verificado — autocompletado Google |
| how much to tip airport car service driver | idem | Verificado — autocompletado Google |
| how much to tip private car service driver | idem | Verificado — autocompletado Google |
| how much to tip a limo driver | idem | Verificado — autocompletado Google |
| how much to tip a limo driver per hour | idem | Verificado — autocompletado Google |
| how much to tip a limo driver for 3 hours | idem | Verificado — autocompletado Google |
| how much to tip a limo driver for 4 hours | idem | Verificado — autocompletado Google |
| how much to tip a limo driver for 6 hours | idem | Verificado — autocompletado Google |
| do i need to tip if gratuity is included | idem (bloque) | Verificado — autocompletado Google |
| should i tip if gratuity is included | idem | Verificado — autocompletado Google |
| do you tip if gratuity is included reddit | idem | Verificado — autocompletado Google |
| is tip included in blacklane car service | idem (comparativa) | Verificado — autocompletado Google |
| how much to tip a chauffeur california | idem | Inferencia — Google **no** la completó |

> **Fíjate en el patrón por horas** (`for 3 hours`, `for 4 hours`, `for 6 hours`,
> `per hour`). Esa gente ya reservó por horas y está calculando la propina. Un
> artículo con una **tabla de propina por duración** captura las cinco variantes
> de golpe y enlaza directo a `/hourly-chauffeur`.
>
> **Ojo:** la variante con "california" no la completa Google. Es una de las
> ideas del archivo v1 (`how much to tip a chauffeur California`). Sigue estando
> bien como sección dentro del artículo, pero **no como página propia**.

### 4.3 Sillas de bebé — demanda verificada y sin cubrir

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| lax car service with car seat | `/car-service-with-car-seat-lax/` (crear) | Verificado — autocompletado Google |
| car service with car seat lax | idem | Verificado — autocompletado Google |
| car service with car seats los angeles | idem | Verificado — autocompletado Google |
| car service with car seats near me | idem | Verificado — autocompletado Google |
| do car services provide car seats | idem (bloque FAQ) | Verificado — autocompletado Google |
| do any car services have car seats | idem | Verificado — autocompletado Google |
| does uber have car seats in los angeles | idem (comparativa) | Verificado — autocompletado Google |
| does uber have car seats in california | idem | Verificado — autocompletado Google |
| does uber have car seats in anaheim | idem | Verificado — autocompletado Google |
| california uber car seat requirements | idem | Verificado — autocompletado Google |
| car seat law california uber | idem | Verificado — autocompletado Google |
| california taxi car seat law | idem | Verificado — autocompletado Google |

> **Este es el segundo hueco más grande del documento, después de ciudad→LAX.**
> Doce frases verificadas, todas con intención de reserva, y el sitio no
> menciona sillas de bebé en ninguna parte. Es además una búsqueda de familia
> que llega a LAX con niños: viaje largo, equipaje, sin auto propio. Cliente
> perfecto.
>
> El ángulo que convierte está en las filas de Uber: la gente busca esto
> **porque Uber no se lo resuelve**. La página tiene que decirlo con todas sus
> letras y confirmar que la silla va instalada al llegar.
>
> **Antes de publicarla hay que confirmar dos cosas con Reynaldo:** (a) que
> Rideyeah realmente ofrece sillas y de qué tipos, y (b) si cobra extra. **No
> publicar la página sin eso.** Y ojo con la regulación de California sobre
> sillas infantiles — **yo no la verifiqué**, hay que revisarla antes de
> afirmar nada legal en la página.

### 4.4 Tiempo de espera y recogida en el aeropuerto

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| lax car service pick up | `/lax-pickup-instructions/` (crear) | Verificado — autocompletado Google |
| car service pick up lax | idem | Verificado — relacionadas DuckDuckGo |
| lax car service meet and greet | `/lax-meet-and-greet/` (crear) | Verificado — autocompletado Google |
| private car pickup from lax | idem | Verificado — relacionadas DuckDuckGo |
| executive car service lax cancellation policy | `/faq` | Verificado — autocompletado Google |
| how far in advance should i book a car service | `/faq` | Verificado — autocompletado Google |
| how far in advance can i book a car service | idem | Verificado — autocompletado Google |
| when to book a car service | idem | Verificado — autocompletado Google |
| how long will a car service wait at the airport | idem | Inferencia — Google **no** la completó |
| what happens if my flight is delayed car service | idem | Inferencia — Google **no** la completó |
| free wait time lax car service | idem | Inferencia |

> **`meet and greet` y `pick up` son señal de oro.** Son las dos primeras
> sugerencias que Google da para "LAX car service" — antes que precio, antes que
> reseñas. La gente que llega a LAX **no sabe dónde encontrar a su chofer** y le
> da ansiedad. Una página que explique el punto exacto de encuentro por terminal
> responde a la primera duda del mercado y no existe en ningún competidor.
>
> `/travel/airports/lax/` ya tiene contenido de "rideshare pickup". Es el sitio
> natural para esto, pero necesita el bloque de reserva.

### 4.5 Equipaje

Señal **débil**. Google no completa "how much luggage car service". Lo único
cercano es sobre capacidad de vehículos.

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| how much luggage can fit in a chevy suburban | `/fleet` (bloque de capacidad) | Verificado — autocompletado Google |
| how many people fit in a suburban | idem | Verificado — autocompletado Google |
| how many suitcases fit in a suburban | idem | Inferencia |
| car service for large luggage los angeles | idem | Inferencia |
| oversized luggage car service lax | idem | Inferencia |

> **Recomendación:** no hacer página. Poner en `/fleet` una tabla simple de
> **pasajeros y maletas por vehículo**. Es lo que la gente quiere ver y hoy la
> página no lo dice. Cuesta una hora y resuelve la objeción.

### 4.6 Mascotas

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| pet friendly car service los angeles | `/pet-friendly-car-service/` (crear) | Verificado — autocompletado Google |
| pet friendly car service near me | idem | Verificado — autocompletado Google |
| dog friendly car service | idem | Verificado — autocompletado Google |
| does uber have pet friendly cars | idem (comparativa) | Verificado — autocompletado Google |
| pet friendly long distance car service | idem | Verificado — autocompletado Google |
| car service with dog | idem | Verificado — autocompletado Google |
| pet friendly car service to lax | idem | Inferencia |

> Cinco frases verificadas y el mismo patrón que las sillas: la gente busca
> porque **Uber le falla**. Prioridad media — menos volumen aparente que las
> sillas, pero misma facilidad. Igual que antes: **confirmar con Reynaldo si
> aceptan mascotas** antes de publicar.

### 4.7 Cuentas corporativas

**El bloque con menos señal de búsqueda de todo el documento.** Ni
`corporate account car service`, ni `car service for business travel expense`
devolvieron una sola sugerencia.

| Palabra clave | Página propuesta | Verificación |
|---|---|---|
| corporate car service account los angeles | `/corporate-transportation` (existe) | Inferencia |
| business account car service los angeles | idem | Inferencia |
| monthly invoicing car service los angeles | idem | Inferencia |
| duty of care ground transportation los angeles | idem | Inferencia |
| executive car service los angeles | idem | **Verificado** — relacionadas DuckDuckGo |
| private driver los angeles | `/hourly-chauffeur` | **Verificado** — relacionadas DuckDuckGo |

> **Lectura honesta:** las cuentas corporativas **no se ganan por SEO**. No hay
> búsqueda. Se ganan por venta directa, LinkedIn y referidos de asistentes
> ejecutivas. La página `/corporate-transportation` ya existe y sirve como
> respaldo de credibilidad cuando alguien la revisa después de una reunión —
> ese es su trabajo, y está bien que exista. Pero **no le pongas expectativa de
> tráfico** ni inviertas más horas en ella que en las páginas de ruta.

---

## 5. Qué haría yo primero

Ordenado por retorno, no por gusto. Todo esto sale de lo verificado arriba.

| # | Acción | Por qué |
|---|---|---|
| 1 | Meter al `sitemap.xml` las 34 URLs de `/travel/`, `/privacy` y `/terms` | 32 páginas ya escritas que Google no tiene declaradas. Cero contenido nuevo. |
| 2 | Crear las 12 páginas **ciudad → LAX** | Google autocompleta 11 orígenes distintos. El sitio tiene 0. |
| 3 | Crear `/simi-valley-black-car-service/` | Es la base del negocio y no tiene página de ciudad. Con "black car", no "car service" a secas. |
| 4 | Crear `/car-service-with-car-seat-lax/` | 12 frases verificadas, cero cobertura, cero competencia. |
| 5 | Crear `/lax-meet-and-greet/` y `/lax-pickup-instructions/` | Son las dos primeras sugerencias de Google para la semilla principal. |
| 6 | Crear las páginas de terminal de crucero (Long Beach y San Pedro) | Cliente de alto ticket, reserva anticipada, hueco limpio. |
| 7 | Cambiar el `<title>` de las 9 páginas de ciudad: "Chauffeur Service in X" → "X Car Service" | Google dice que la gente escribe "car service", no "chauffeur service". |
| 8 | Crear `/black-car-service-cost/` y `/blog/how-much-to-tip-a-chauffeur/` | Las dos objeciones con más demanda verificada. |
| 9 | Añadir tabla de pasajeros y maletas a `/fleet` | Una hora de trabajo, resuelve una objeción real. |
| 10 | Resolver la canibalización de los 2 artículos de blog vs. las páginas de ruta | Dos URLs peleando por la misma palabra clave se hunden mutuamente. |

**Lo que NO haría todavía:** hospitales (la demanda la absorbe el shuttle propio
del hospital), estudios de cine (señal casi nula) y más horas en corporativo
(no se gana por búsqueda).

---

## Límites de este documento

Para que nadie lo lea como más de lo que es:

1. **No hay volúmenes de búsqueda.** Ninguno. Requieren Google Keyword Planner
   con cuenta de Ads activa. Todo el orden de prioridad de arriba es por
   **presencia y posición en el autocompletado**, que es señal de demanda
   relativa, no una cifra.
2. **No tengo el bloque "People Also Ask" literal de Google.** Google me sirvió
   una verificación anti-robot y no resuelvo CAPTCHAs. Sustituí con
   autocompletado de Google (que sí es Google y sí es literal) y con relacionadas
   de DuckDuckGo y Bing, todo etiquetado.
3. **Las consultas salieron desde una IP fuera de EE. UU.** Usé `hl=en` y
   `gl=us`, y los resultados se ven claramente estadounidenses, pero un par de
   sugerencias sueltas mostraron sesgo local. Repetir desde IP de EE. UU. daría
   una lista algo más limpia.
4. **No verifiqué qué ofrece Rideyeah realmente.** Sillas de bebé, mascotas,
   tiempo de espera gratis, política de cancelación: todo eso hay que
   confirmarlo con Reynaldo antes de publicar la página correspondiente.
5. **No verifiqué normativa de California** sobre sillas infantiles ni licencias
   de transporte. Antes de afirmar algo legal en una página, revisarlo.
6. **Fecha de captura: 26 de agosto de 2026.** El autocompletado cambia. A los
   seis meses esto se revisa.
