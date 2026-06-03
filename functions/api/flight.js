/**
 * RideYeah · Flight lookup (Cloudflare Pages Function)
 * ----------------------------------------------------
 * GET /api/flight?flight=AA327&date=2026-06-12
 *
 * Confirms a flight number exists on the given date and returns the airline +
 * route + scheduled times, so the booking form can validate the number before
 * it reaches Moovs and prefill the airline for the driver.
 *
 * The provider key lives ONLY here, as a Cloudflare Pages environment variable
 * (AERODATABOX_KEY) — never in the client. If the key is not configured the
 * function reports { configured:false } and the form silently falls back to the
 * client-side format check, so the site never breaks.
 *
 * Provider: AeroDataBox via RapidAPI (generous free tier).
 *   https://rapidapi.com/aedbx-aedbx/api/aerodatabox
 */
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const reply = (obj, maxAge = 0) =>
  new Response(JSON.stringify(obj), {
    status: 200,
    headers: maxAge
      ? { ...JSON_HEADERS, "cache-control": `public, max-age=${maxAge}` }
      : JSON_HEADERS,
  });

// IATA flight designator: airline code (letter first) + 1–4 digit number.
const FLIGHT_RE = /^[A-Z][A-Z0-9]\d{1,4}$/;

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const flight = (url.searchParams.get("flight") || "").toUpperCase().replace(/\s+/g, "");
  const date = (url.searchParams.get("date") || "").trim(); // YYYY-MM-DD (optional)

  // No key set yet → tell the client to use its own format check.
  if (!env.AERODATABOX_KEY) return reply({ configured: false });

  // Reject obviously malformed input before spending a quota call.
  if (!FLIGHT_RE.test(flight)) return reply({ configured: true, valid: false, reason: "format" });

  const path = `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(flight)}` +
    (/^\d{4}-\d{2}-\d{2}$/.test(date) ? `/${date}` : "");

  let res;
  try {
    res = await fetch(path, {
      headers: {
        "X-RapidAPI-Key": env.AERODATABOX_KEY,
        "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
      },
    });
  } catch {
    return reply({ configured: true, error: "network" });
  }

  // No flight on that date (or date outside the provider's data window).
  if (res.status === 404) return reply({ configured: true, valid: false, reason: "not_found" }, 600);
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
  if (!leg) return reply({ configured: true, valid: false, reason: "not_found" }, 600);

  const airport = (x) => x?.airport?.iata || x?.airport?.icao || x?.airport?.name || "";
  const time = (x) => x?.scheduledTime?.local || x?.scheduledTimeLocal || x?.scheduledTime?.utc || "";

  return reply(
    {
      configured: true,
      valid: true,
      flight,
      airline: leg.airline?.name || "",
      departure: airport(leg.departure),
      arrival: airport(leg.arrival),
      scheduledDeparture: time(leg.departure),
      scheduledArrival: time(leg.arrival),
    },
    600,
  );
}
