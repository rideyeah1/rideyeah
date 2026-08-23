/**
 * RideYeah · Fixed-fare single source of truth
 * --------------------------------------------
 * THE one place to edit fixed one-way LAX fares. Every fare shown on the site
 * traces back here:
 *   - The 9 LAX ⇄ city ROUTE pages keep their price in scripts/routes-data.mjs
 *     (rich per-route content lives there); this module re-uses those numbers so
 *     they are never duplicated.
 *   - The 7 EXTRA popular cities below are quoted by the chat assistant but do
 *     not have a dedicated route page.
 *
 * Consumers (chat assistant KB in functions/api/chat.js + the inline copy in
 * rideyeah-home.html, the home "Popular routes" grid, popular-routes.html and
 * faq.html) must match this list. scripts/check-fares.mjs runs inside the build
 * and FAILS the build if any of them drift — so a price change here is caught
 * everywhere instead of silently going stale.
 *
 * To change a price:
 *   - Route city (Downtown LA … Santa Barbara) → edit scripts/routes-data.mjs.
 *   - Extra city (Beverly Hills, Santa Monica, Malibu, …) → edit EXTRA below.
 *   Then run `npm run build`; the validator tells you exactly what to update.
 */
import { ROUTES } from "./routes-data.mjs";

const rp = (slug) => {
  const r = ROUTES.find((x) => x.slug === slug);
  if (!r) throw new Error(`fares-data: unknown route slug "${slug}"`);
  return r.price;
};

// Fixed one-way LAX fares for popular cities WITHOUT a dedicated route page.
// (Confirmed by the owner, 2026-06-09, on the same scale as the route pages.)
export const EXTRA = {
  "Beverly Hills": 119.99,
  "Santa Monica": 119.99,
  Glendale: 179.99,
  Disneyland: 179.99,
  "Huntington Beach": 189.99,
  Malibu: 199.99,
  "Newport Beach": 209.99,
  Irvine: 219.99,
  "Laguna Beach": 249.99,
};

// Ordered list the assistant quotes (cheapest/closest first). Prices are pulled
// from routes-data (route cities) or EXTRA (everything else) — defined once.
export const CHAT_FARES = [
  { city: "Santa Monica", price: EXTRA["Santa Monica"] },
  { city: "Beverly Hills", price: EXTRA["Beverly Hills"] },
  { city: "Downtown LA", price: rp("downtown-la") },
  { city: "Calabasas", price: rp("calabasas") },
  { city: "Glendale", price: EXTRA["Glendale"] },
  { city: "Anaheim", price: rp("anaheim") },
  { city: "Disneyland", price: EXTRA["Disneyland"] },
  { city: "Huntington Beach", price: EXTRA["Huntington Beach"] },
  { city: "Long Beach", price: rp("long-beach") },
  { city: "Pasadena", price: rp("pasadena") },
  { city: "Malibu", price: EXTRA["Malibu"] },
  { city: "Newport Beach", price: EXTRA["Newport Beach"] },
  { city: "Irvine", price: EXTRA["Irvine"] },
  { city: "Simi Valley", price: rp("simi-valley") },
  { city: "Thousand Oaks", price: rp("thousand-oaks") },
  { city: "Laguna Beach", price: EXTRA["Laguna Beach"] },
  { city: "Camarillo", price: rp("camarillo") },
  { city: "Santa Barbara", price: rp("santa-barbara") },
];

// Quick lookup: city name → price.
export const FARE_OF = Object.fromEntries(CHAT_FARES.map((f) => [f.city, f.price]));

// "Beverly Hills $150; Santa Monica $150; …"  (chat.js PRICING line format)
export const faresSemicolon = () => CHAT_FARES.map((f) => `${f.city} $${f.price}`).join("; ");

// "\n• Beverly Hills — $150\n• Santa Monica — $150 …"  (home inline chat KB bullets)
export const faresBullets = () => CHAT_FARES.map((f) => `\n• ${f.city} — $${f.price}`).join("");
