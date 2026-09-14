/**
 * RideYeah · Flight lookup (Cloudflare Pages Function)
 * ----------------------------------------------------
 * GET /api/flight?flight=AA327&date=2026-06-12
 *
 * Confirms a flight number exists on the given date and returns the airline +
 * route + scheduled times, so the booking form can validate the number before
 * the hand-off to the booking portal (rysistema.com/book) and prefill the
 * airline for the driver.
 *
 * ── Endurecido tras la auditoría 13-sep-2026, RY-159 ─────────────────────────
 * Antes era un proxy ABIERTO y SIN FRENO a AeroDataBox con la MISMA llave que
 * usa el panel para seguir los vuelos de las recogidas reales: cualquiera podía
 * quemarle la cuota (o la factura) al panel desde aquí. Lo que cambió:
 *
 *   1. LLAVE PROPIA. Se lee `AERODATABOX_KEY_SITIO`, NUNCA `AERODATABOX_KEY`
 *      (la del panel). Si la variable no está creada en Cloudflare Pages, la
 *      función contesta { configured:false } y el formulario cae en silencio a
 *      la comprobación de formato: el sitio no se rompe, y la llave del panel
 *      deja de estar expuesta desde hoy aunque el dueño tarde en crear la nueva.
 *   2. ORIGEN. Solo contesta a peticiones que salen del propio sitio
 *      (Sec-Fetch-Site same-origin, u Origin/Referer de rideyeah.com, de las
 *      vistas previas *.rideyeah.pages.dev o de localhost con `wrangler pages
 *      dev`). Un `curl` suelto recibe 403.
 *   3. ENTRADA ESTRICTA. Vuelo `^[A-Z][A-Z0-9]{1,2}\d{1,4}$` (designador IATA
 *      de 2 letras o ICAO de 3, letra primero + 1–4 dígitos) y fecha
 *      OBLIGATORIA dentro de una ventana corta (ver VENTANA_DIAS): fuera de eso
 *      no se gasta una consulta.
 *   4. CACHÉ de 10 min por vuelo+fecha (caches.default): mil clics al mismo
 *      vuelo son UNA consulta al proveedor.
 *   5. FRENO POR IP: 20 consultas al proveedor por hora y dirección. Con el KV
 *      `RY_LIMITES` enlazado, el contador es global; sin KV, se lleva en la
 *      caché del centro de datos (mejor esfuerzo, pero corta el bucle tonto).
 *      Si algún día existe un binding de Rate Limiting (`LIMITE_VUELOS`), se
 *      usa primero.
 *
 * Lo que el dueño tiene que hacer en Cloudflare (Pages → rideyeah → Settings →
 * Variables and Secrets, en Production Y Preview): crear `AERODATABOX_KEY_SITIO`
 * con una llave NUEVA de RapidAPI/AeroDataBox (otra app o suscripción, no la
 * del VPS). Opcional: crear un KV namespace y enlazarlo como `RY_LIMITES`.
 *
 * Provider: AeroDataBox via RapidAPI.
 *   https://rapidapi.com/aedbx-aedbx/api/aerodatabox
 */
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const reply = (obj, { maxAge = 0, status = 200 } = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: maxAge
      ? { ...JSON_HEADERS, "cache-control": `public, max-age=${maxAge}` }
      : { ...JSON_HEADERS, "cache-control": "no-store" },
  });

// Designador IATA (AA, B6, DL) o ICAO (AAL, DAL): letra primero, 2–3 caracteres,
// y 1–4 dígitos. Mismo espíritu que el cliente, un poco más amplio (ICAO).
const FLIGHT_RE = /^[A-Z][A-Z0-9]{1,2}\d{1,4}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Ventana de fechas que se acepta, en días respecto a hoy (UTC). Se aparta del
// "±3 días" de la auditoría A PROPÓSITO: un traslado al aeropuerto se reserva
// con días de anticipación, y con ±3 la verificación no serviría casi nunca.
// Hacia atrás basta 1 día (nadie reserva un vuelo que ya pasó); hacia adelante
// 7, que es lo que cubre el plan básico del proveedor.
const VENTANA_DIAS = { atras: 1, adelante: 7 };

const CACHE_SEGUNDOS = 600; // 10 min por vuelo+fecha
const LIMITE_POR_HORA = 20; // consultas al PROVEEDOR por IP y hora (la caché no cuenta)

const ORIGENES_PERMITIDOS =
  /^(?:(?:www\.)?rideyeah\.com|[a-z0-9-]+\.rideyeah\.pages\.dev|rideyeah\.pages\.dev|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)$/i;

/** ¿La petición sale del propio sitio? Mira Sec-Fetch-Site y, si no, Origin/Referer. */
function esDelSitio(request) {
  const sfs = request.headers.get("sec-fetch-site");
  if (sfs === "same-origin") return true;
  for (const nombre of ["origin", "referer"]) {
    const v = request.headers.get(nombre);
    if (!v) continue;
    try {
      return ORIGENES_PERMITIDOS.test(new URL(v).host);
    } catch {
      return false;
    }
  }
  return false;
}

/** ¿La fecha YYYY-MM-DD cae dentro de la ventana? (días enteros en UTC) */
function fechaEnVentana(date) {
  if (!DATE_RE.test(date)) return false;
  const t = Date.parse(date + "T00:00:00Z");
  if (Number.isNaN(t)) return false;
  const hoy = Math.floor(Date.now() / 86400000);
  const dia = Math.floor(t / 86400000);
  return dia >= hoy - VENTANA_DIAS.atras && dia <= hoy + VENTANA_DIAS.adelante;
}

/**
 * Freno por IP. Devuelve true si esta petición PUEDE ir al proveedor.
 * Orden: binding de Rate Limiting (si existe) → KV `RY_LIMITES` → caché local.
 */
async function permitido(env, ip, esperar) {
  if (env.LIMITE_VUELOS && typeof env.LIMITE_VUELOS.limit === "function") {
    try {
      const { success } = await env.LIMITE_VUELOS.limit({ key: ip });
      return !!success;
    } catch {
      /* si el binding falla, se cae al siguiente método */
    }
  }
  const bucket = Math.floor(Date.now() / 3600000); // hora UTC en curso
  const clave = `flight:ip:${ip}:${bucket}`;
  if (env.RY_LIMITES && typeof env.RY_LIMITES.get === "function") {
    try {
      const n = Number((await env.RY_LIMITES.get(clave)) || 0);
      if (n >= LIMITE_POR_HORA) return false;
      // KV es de consistencia eventual: dos peticiones simultáneas pueden contar
      // como una. Para un freno de abuso alcanza; no es un contador exacto.
      esperar(env.RY_LIMITES.put(clave, String(n + 1), { expirationTtl: 3600 }));
      return true;
    } catch {
      /* si KV falla, se cae a la caché local */
    }
  }
  // Sin KV: contador en la caché del centro de datos. Cada colo de Cloudflare
  // lleva el suyo, así que es MEJOR ESFUERZO — pero un bucle desde un solo
  // cliente pega siempre al mismo colo y aquí se corta.
  try {
    const cache = caches.default;
    const req = new Request("https://rideyeah.com/__limite/" + encodeURIComponent(clave));
    const hit = await cache.match(req);
    const n = hit ? Number((await hit.text()) || 0) : 0;
    if (n >= LIMITE_POR_HORA) return false;
    esperar(
      cache.put(req, new Response(String(n + 1), { headers: { "cache-control": "public, max-age=3600" } })),
    );
  } catch {
    /* sin caché no hay freno local; siguen valiendo origen, formato y ventana */
  }
  return true;
}

export async function onRequestGet({ request, env, waitUntil }) {
  const esperar = typeof waitUntil === "function" ? waitUntil : (p) => p;
  const url = new URL(request.url);
  const flight = (url.searchParams.get("flight") || "").toUpperCase().replace(/\s+/g, "");
  const date = (url.searchParams.get("date") || "").trim(); // YYYY-MM-DD (OBLIGATORIA)

  // Fuera del sitio no se contesta (RY-159). El cliente trata cualquier !ok
  // como "sin verificación" y cae al chequeo de formato.
  if (!esDelSitio(request)) return reply({ error: "forbidden" }, { status: 403 });

  // Sin llave PROPIA → el cliente usa su comprobación de formato. Nunca se usa
  // la llave del panel (AERODATABOX_KEY) desde aquí.
  if (!env.AERODATABOX_KEY_SITIO) return reply({ configured: false });

  // Reject obviously malformed input before spending a quota call.
  if (!FLIGHT_RE.test(flight)) return reply({ configured: true, valid: false, reason: "format" });
  if (!fechaEnVentana(date)) return reply({ configured: true, valid: false, reason: "date" });

  // Caché por vuelo+fecha: la clave es una URL canónica (sin lo que sobre).
  const claveCache = new Request(`https://rideyeah.com/api/flight?flight=${flight}&date=${date}`);
  let cache = null;
  try {
    cache = caches.default;
    const hit = await cache.match(claveCache);
    if (hit) return hit;
  } catch {
    cache = null;
  }

  const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";
  if (!(await permitido(env, ip, esperar))) {
    return reply({ configured: true, error: "rate_limited" }, { status: 429 });
  }

  const path = `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(flight)}/${date}`;

  let res;
  try {
    res = await fetch(path, {
      headers: {
        "X-RapidAPI-Key": env.AERODATABOX_KEY_SITIO,
        "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
      },
    });
  } catch {
    return reply({ configured: true, error: "network" });
  }

  const guardar = (obj) => {
    const r = reply(obj, { maxAge: CACHE_SEGUNDOS });
    if (cache) esperar(cache.put(claveCache, r.clone()));
    return r;
  };

  // No flight on that date (or date outside the provider's data window).
  if (res.status === 404) return guardar({ configured: true, valid: false, reason: "not_found" });
  if (!res.ok) return reply({ configured: true, error: "upstream", status: res.status });

  let data;
  try {
    data = await res.json();
  } catch {
    return reply({ configured: true, error: "parse" });
  }

  // AeroDataBox returns an array of legs (or { flights:[...] } on some plans).
  const legs = Array.isArray(data) ? data : Array.isArray(data?.flights) ? data.flights : [];
  const leg = legs[0];
  if (!leg) return guardar({ configured: true, valid: false, reason: "not_found" });

  const airport = (x) => x?.airport?.iata || x?.airport?.icao || x?.airport?.name || "";
  const time = (x) => x?.scheduledTime?.local || x?.scheduledTimeLocal || x?.scheduledTime?.utc || "";

  return guardar({
    configured: true,
    valid: true,
    flight,
    airline: leg.airline?.name || "",
    departure: airport(leg.departure),
    arrival: airport(leg.arrival),
    scheduledDeparture: time(leg.departure),
    scheduledArrival: time(leg.arrival),
  });
}
