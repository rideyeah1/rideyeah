# SEO local — qué hay y qué falta

Auditado contra `sitemap.xml`, `scripts/routes-data.mjs` y
`scripts/cities-data.mjs` el 2026-08-15.

## Lo que ya existe (mejor base de la que parecía)

**Páginas de ruta LAX ⇄ ciudad** — 9, todas con precio fijo, tiempo, millas y
contenido propio, generadas desde `routes-data.mjs`:

| Ruta | Precio | Ventura County |
|---|---:|:---:|
| `/lax-to-simi-valley` | $250 | ✅ |
| `/lax-to-thousand-oaks` | $250 | ✅ |
| `/lax-to-camarillo` | $300 | ✅ |
| `/lax-to-santa-barbara` | $400 | (más allá) |
| `/lax-to-calabasas` | $200 | (frontera) |
| `/lax-to-downtown-la`, `-long-beach`, `-pasadena`, `-anaheim` | $150–$250 | — |

**Páginas de ciudad** — 9, desde `cities-data.mjs`, con barrios, landmarks y
casos de uso reales. De Ventura County solo hay una: **Thousand Oaks**.

**Blog** — 5 artículos, uno específicamente sobre LAX → Thousand Oaks.

**Español** — versión `/es/` completa de rutas y páginas principales. Es un
activo real en este mercado y hoy no lo está aprovechando ningún competidor
local de forma seria.

## Los huecos, en orden de importancia

### 1. Falta la página de ciudad de Simi Valley 🔴

Es el hueco más caro. La campaña A apunta a Simi Valley, hay ruta con precio,
pero **no existe `/simi-valley-chauffeur-service`**, mientras que Beverly Hills,
Santa Monica y Newport Beach sí la tienen. El mercado prioritario es el peor
cubierto.

**Arreglo:** una entrada en `scripts/cities-data.mjs`. La estructura ya
funciona; falta el contenido local — barrios (Wood Ranch, Big Sky, Texas
Tract), landmarks (Reagan Library, Simi Valley Town Center), aeropuertos
cercanos (LAX, BUR, Van Nuys).

### 2. Faltan 6 ciudades de Ventura County 🟡

Sin página propia: **Camarillo** (tiene ruta y precio, pero no página de
ciudad), **Oxnard**, **Ventura**, **Moorpark**, **Westlake Village**,
**Newbury Park**, **Agoura Hills**.

Orden sugerido: Simi Valley → Camarillo → Westlake Village → Moorpark →
Oxnard → Ventura → Newbury Park → Agoura Hills.

**Solo con contenido local real.** Ocho páginas clonadas con el nombre cambiado
son ocho páginas que Google ignora, y de paso diluyen las que sí funcionan.
Mejor tres páginas buenas que ocho vacías.

### 3. Faltan precios para Oxnard, Ventura, Moorpark, Westlake, Newbury Park 🔴

No están en `scripts/fares-data.mjs`. Es un bloqueo doble: no se puede anunciar
con precio fijo (la ventaja principal) ni crear la página de ruta. **El dueño
tiene que fijar estos precios antes de la fase 2.**

### 4. No hay hub de Ventura County 🟡

Hay `/service-areas` general, pero no una página que diga "RIDEYEAH sirve
Ventura County" y enlace a todas las ciudades y rutas del condado. Sirve para
dos cosas: capturar búsquedas de condado sin ciudad ("ventura county airport
transportation") y repartir autoridad interna hacia las páginas de ciudad.

## Una corrección al plan original

El plan proponía crear **dos** páginas por ciudad: `/simi-valley` y
`/simi-valley-to-lax`.

No lo haría. Las páginas de ruta existentes ya están tituladas
**"LAX ⇄ Simi Valley Car Service"** — el símbolo ⇄ cubre las dos direcciones
en una sola URL. Crear `/simi-valley-to-lax` como página aparte produciría dos
páginas casi idénticas compitiendo por la misma búsqueda: Google elige una,
degrada la otra, y el trabajo se paga dos veces.

**En su lugar**, reforzar la dirección de salida *dentro* de la página que ya
existe:

- Un H2 dedicado: "Simi Valley to LAX — what to expect"
- Contenido que solo aplica a la salida: a qué hora salir para un vuelo de las
  7 AM, la 118 contra la 101 en hora pico, cuánto colchón dejar
- FAQ con la pregunta real que la gente escribe: *"How early should I leave
  Simi Valley for a 7 AM flight at LAX?"*
- Un `<title>` que mencione las dos direcciones

Eso captura la búsqueda de salida sin partir la autoridad de la página.

**Destino de los anuncios:** las páginas de ruta que ya existen —
`/lax-to-simi-valley`, `/lax-to-thousand-oaks`, `/lax-to-camarillo`. No hay que
esperar páginas nuevas para lanzar las campañas A y B.

## Artículos que valen la pena

Basados en preguntas reales, no en "10 razones para viajar con estilo":

1. **"How early should you leave Ventura County for a flight at LAX?"** — la
   pregunta que todo el mercado se hace. Con tabla por ciudad y por hora.
2. **"Simi Valley to LAX: the 118 vs. the 101"** — utilidad local pura, del
   tipo que ningún operador nacional puede escribir.
3. **"LAX terminal guide for Ventura County travelers"** — se puede apoyar en
   el contenido de `travel-static/` que ya tiene mapas de terminales.
4. **"Private airport transportation vs. rideshare: the real cost of a 5 AM
   pickup"** — el cálculo de surge en horas raras.
5. **"Corporate transportation in Ventura County"** — para búsquedas B2B.

## Google Business Profile

Detalle en `gbp.md`. Es la pieza de SEO local con mejor relación
esfuerzo/resultado y hoy no está trabajada.
