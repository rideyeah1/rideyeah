/**
 * RideYeah · Blog content data
 * ----------------------------
 * Single source of truth for the /blog articles. Consumed by
 * scripts/gen-blog.mjs (writes the HTML article pages + /blog hub + RSS) and by
 * gen-sitemap.mjs. EN-only for now.
 *
 * Each post body is an array of typed blocks so the layout stays consistent and
 * the weekly publishing agent can append new posts safely:
 *   { h2: "…" } | { h3: "…" } | { p: "…" } | { ul: [..] } | { ol: [..] }
 *   { quote: "…" } | { cta: { label, href } }
 * `p` strings may contain inline HTML (<a>, <strong>, <em>). Internal links use
 * root-absolute ".html" paths; the build's clean-URL pass strips the extension.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const SITE = "https://rideyeah.com";
export const PHONE = "+1 (805) 285-1570";

// Hand-written articles live here. The weekly agent never edits these — it only
// appends to content/blog-generated.json (merged into POSTS below), so authored
// content is always safe.
const AUTHORED = [
  // ───────────────────────── 1 · Thousand Oaks ─────────────────────────
  {
    slug: "best-lax-airport-transportation-to-thousand-oaks",
    category: "Airport Transfers",
    date: "2026-06-08",
    readMin: 6,
    hero: "band_highway",
    heroAlt:
      "Luxury black SUV on the 101 freeway toward Thousand Oaks — RideYeah LAX airport transportation",
    related: ["thousand-oaks"],
    title: "Best LAX Airport Transportation to Thousand Oaks",
    metaTitle: "Best LAX Airport Transportation to Thousand Oaks | RideYeah",
    metaDescription:
      "The calm, reliable way to get from LAX to Thousand Oaks: a private luxury black SUV with flight tracking, meet-and-greet and a fixed $250 fare. Compare your options.",
    keyword: "lax to thousand oaks car service",
    excerpt:
      "Shuttle, rideshare or private chauffeur? Here's the honest comparison for the 45-mile LAX → Thousand Oaks run — and why a fixed-fare luxury SUV wins for families and executives.",
    body: [
      {
        p: "Getting from <strong>LAX to Thousand Oaks</strong> looks simple on a map — a straight shot up the 405 and 101 — but anyone who has done it during rush hour knows the 45-mile drive can swing from 50 minutes to nearly two hours. The transportation you choose decides whether you arrive in the Conejo Valley relaxed or wrung out. Here's a clear comparison of your options, and why a private chauffeured SUV is the choice most executives and families make.",
      },
      { h2: "Your options from LAX to Thousand Oaks" },
      {
        p: "There are really four ways to cover the route, and they're not equal once luggage, traffic and a late-night flight enter the picture:",
      },
      {
        ul: [
          "<strong>Shared shuttle / van</strong> — the cheapest, but it stops for multiple passengers, runs on its own schedule and can add an hour to your trip.",
          "<strong>Rideshare (Uber/Lyft)</strong> — convenient for short hops, but surge pricing on the LAX–Conejo Valley run is unpredictable, and you're matched with whatever vehicle and driver happen to be nearby.",
          "<strong>Taxi</strong> — metered, so a long freeway crawl directly inflates the fare with no ceiling.",
          "<strong>Private chauffeured SUV</strong> — a professional driver tracks your flight, meets you at the curb and quotes one fixed, all-in price before you book.",
        ],
      },
      {
        p: 'For a 45-mile trip with bags, the gap between "cheapest" and "calmest" is wide. That\'s exactly the gap RideYeah is built to close.',
      },
      { h2: "How long is the drive — and which route?" },
      {
        p: "Plan on <strong>about 55 minutes</strong> in normal conditions for the roughly 45-mile run. Your chauffeur typically takes the 405 North to the 101 North through the Conejo Pass, but watches live traffic and will reroute when the 101 backs up near Calabasas or Agoura Hills. Early-morning departures and mid-evening arrivals are the smoothest; weekday afternoons are the heaviest.",
      },
      {
        quote:
          "The difference isn't just comfort — it's predictability. A tracked flight and a fixed route mean your driver is already waiting when you land, even if you're early or delayed.",
      },
      { h2: "What it costs — and what's included" },
      {
        p: 'RideYeah runs <strong>LAX ⇄ Thousand Oaks as a fixed $250 fare</strong> in a full-size luxury black SUV. "Fixed" means all-in: tolls and gratuity are already included, and there\'s no surge pricing if your flight lands at 6 p.m. on a Friday. You see the total before you reserve — never a metered surprise at the curb.',
      },
      {
        p: 'See the full route details and lock your price on the <a href="/lax-to-thousand-oaks.html">LAX ⇄ Thousand Oaks page</a>, or compare every Southern California route on our <a href="/popular-routes.html">fixed-fare routes</a> overview.',
      },
      { cta: { label: "Get your fixed Thousand Oaks fare", href: "/#book" } },
      { h2: "Meet-and-greet and flight tracking" },
      {
        p: "The part travelers underestimate is the airport pickup itself. RideYeah monitors your flight in real time, so if you land early or sit on the tarmac, your chauffeur adjusts — no frantic calls, no watching the meter run. Your driver greets you, handles the luggage and walks you to the SUV. <strong>Wait time on arrivals is complimentary</strong>, which matters on long-haul flights into LAX that rarely land on schedule. See how it works on our <a href=\"/airport-transfers.html\">LAX airport transfers</a> page.",
      },
      { h2: "Neighborhoods we serve in the Conejo Valley" },
      {
        p: "Thousand Oaks blends into a cluster of communities that all share the LAX corridor — and we cover the whole area door-to-door:",
      },
      {
        ul: [
          "Westlake Village &amp; the Four Seasons / hotel corridor",
          "Newbury Park and Dos Vientos",
          "Agoura Hills and Oak Park",
          "The Oaks shopping district and nearby corporate campuses",
        ],
      },
      {
        p: "Whether it's a family landing after vacation or an executive arriving for a meeting at one of the Conejo Valley's corporate campuses, the brief is the same: a quiet, professional ride with room for everyone and their bags.",
      },
      { h2: "Why business travelers choose a private SUV" },
      {
        p: "For corporate trips, a chauffeured SUV doubles as a mobile office — Wi-Fi, quiet, and time to prep before a meeting instead of negotiating a rideshare. It's also one clean, predictable line item rather than a variable rideshare receipt. If you fly the route often, our <a href=\"/hourly-chauffeur.html\">hourly chauffeur</a> and <a href=\"/black-car-service.html\">black-car service</a> cover meetings and multi-stop days once you've landed.",
      },
      { h2: "Booking your LAX → Thousand Oaks ride" },
      {
        p: "Reserving takes about a minute: enter your pickup, destination and flight details, and you'll get an instant all-in quote. Your chauffeur and vehicle are confirmed in advance — no last-minute matching, no surge. Arrive relaxed, always on time.",
      },
      { cta: { label: "Book LAX ⇄ Thousand Oaks", href: "/#book" } },
    ],
    faq: [
      {
        q: "How much is a car from LAX to Thousand Oaks?",
        a: "RideYeah's fixed fare for LAX ⇄ Thousand Oaks starts at $250 in a luxury black SUV — all-inclusive, with tolls and gratuity included and no surge pricing. Fares may change without notice; use the booking search for an exact, instant quote.",
      },
      {
        q: "How long does it take to drive from LAX to Thousand Oaks?",
        a: "Roughly 55 minutes in typical traffic for the ~45-mile drive via the 405 and 101. Your chauffeur monitors live conditions and chooses the fastest route, and because we track your flight, your driver is ready whether you land early or late.",
      },
      {
        q: "Do you offer meet-and-greet at LAX for Thousand Oaks trips?",
        a: "Yes. Your chauffeur tracks your flight and meets you at the curb or in arrivals, helps with luggage and walks you to the luxury black SUV. Wait time on arrivals is complimentary.",
      },
    ],
  },

  // ───────────────────────── 2 · Calabasas ─────────────────────────
  {
    slug: "lax-to-calabasas-luxury-transportation",
    category: "Airport Transfers",
    date: "2026-06-08",
    readMin: 6,
    hero: "airport_pickup",
    heroAlt:
      "Chauffeur with a luxury black SUV for a private LAX to Calabasas transfer — RideYeah",
    related: ["calabasas"],
    title: "LAX to Calabasas Luxury Transportation",
    metaTitle: "LAX to Calabasas Luxury Transportation | Private SUV | RideYeah",
    metaDescription:
      "Private, discreet LAX to Calabasas transportation in a luxury black SUV. Flight tracking, meet-and-greet and a fixed $200 fare — door to door in about 40 minutes.",
    keyword: "lax to calabasas car service",
    excerpt:
      "Calabasas runs on discretion. Here's how a private luxury black SUV makes the 30-mile LAX transfer quiet, gated-community-friendly and entirely predictable.",
    body: [
      {
        p: "Calabasas is one of the easiest Los Angeles communities to reach from LAX — about <strong>30 miles and 40 minutes</strong> up the 405 and 101 — and one of the most particular about how its residents and guests arrive. Privacy, punctuality and a low-key presence matter here. This guide covers the smartest way to handle <strong>LAX to Calabasas transportation</strong>, what it costs, and what to expect from a private chauffeured SUV.",
      },
      { h2: "Why Calabasas calls for a private chauffeur" },
      {
        p: "Between The Commons, the hillside estates and the gated communities off Mulholland and Las Virgenes, Calabasas is built around discretion. A shared shuttle or a random rideshare doesn't fit that brief. A private chauffeur does:",
      },
      {
        ul: [
          "<strong>Discretion</strong> — one vetted, professional driver in an unmarked luxury black SUV, not a rotating cast of rideshare cars.",
          "<strong>Gated-community access</strong> — your chauffeur has the address, gate and guard-house details in advance for a smooth arrival.",
          "<strong>Predictability</strong> — a fixed price and a tracked flight, so nothing about the trip is improvised.",
          "<strong>Space</strong> — room for up to 7 passengers and a weekend's worth of luggage.",
        ],
      },
      { cta: { label: "Get your fixed Calabasas fare", href: "/#book" } },
      { h2: "The route and drive time" },
      {
        p: "Most LAX → Calabasas trips run the 405 North to the 101 North, exiting around Las Virgenes or Lost Hills — <strong>about 40 minutes</strong> in normal traffic for the ~30-mile drive. It's a short, scenic run once you clear the airport, and your chauffeur watches live conditions to avoid the 101's known choke points through the Sepulveda Pass and Woodland Hills.",
      },
      {
        p: 'Full route details and live pricing live on the <a href="/lax-to-calabasas.html">LAX ⇄ Calabasas page</a>.',
      },
      { h2: "What LAX to Calabasas costs" },
      {
        p: 'RideYeah runs <strong>LAX ⇄ Calabasas as a fixed $200 fare</strong> in a full-size luxury black SUV — all-in, tolls and gratuity included, with no surge. You approve the total before you book, so there\'s never a metered surprise after a long flight. Compare it with every other route on our <a href="/popular-routes.html">fixed-fare routes</a> page.',
      },
      {
        quote:
          "All-in pricing is the point. The number you're quoted is the number you pay — even if your flight lands at the worst possible hour for traffic.",
      },
      { h2: "Flight tracking and a seamless pickup" },
      {
        p: "We track your inbound flight in real time. Land early or get delayed, and your chauffeur is already adjusting — meeting you at the curb or in arrivals, taking the bags and walking you to the SUV. <strong>Arrival wait time is complimentary.</strong> For the full airport playbook — terminals, meet-and-greet, private-jet pickups at Van Nuys — see our <a href=\"/airport-transfers.html\">airport transfers</a> page.",
      },
      { h2: "Beyond the airport run" },
      {
        p: "Plenty of Calabasas trips don't end at the front gate. For studio meetings, dinners at The Commons, or a full day across the Westside, our <a href=\"/hourly-chauffeur.html\">hourly chauffeur</a> service keeps the same SUV and driver with you. For executives and production teams, <a href=\"/black-car-service.html\">black-car service</a> handles the standing, repeat trips that Calabasas schedules tend to need.",
      },
      { h2: "Booking your LAX → Calabasas transfer" },
      {
        p: "Enter your pickup, destination and flight number for an instant, all-in quote. Your chauffeur and vehicle are locked in ahead of time — discreet, on time, and ready the moment you land.",
      },
      { cta: { label: "Book LAX ⇄ Calabasas", href: "/#book" } },
    ],
    faq: [
      {
        q: "How much is a car service from LAX to Calabasas?",
        a: "RideYeah's fixed fare for LAX ⇄ Calabasas starts at $200 in a luxury black SUV — all-inclusive, with tolls and gratuity included and no surge pricing. Fares may change without notice; use the booking search for an exact, instant quote.",
      },
      {
        q: "How long is the drive from LAX to Calabasas?",
        a: "About 40 minutes in typical traffic for the ~30-mile drive via the 405 and 101. Your chauffeur monitors live conditions for the fastest route, and we track your flight so your driver is ready whether you're early or delayed.",
      },
      {
        q: "Can the chauffeur access gated communities in Calabasas?",
        a: "Yes. Provide the address and any gate or guard-house details when you book and your chauffeur will arrive prepared for a smooth, discreet drop-off or pickup.",
      },
    ],
  },

  // ───────────────────────── 3 · Executive SUV Service ─────────────────────────
  {
    slug: "executive-suv-service-los-angeles",
    category: "Executive Travel",
    date: "2026-06-08",
    readMin: 6,
    hero: "escalade-luxury-suv-exterior-front",
    heroAlt: "Executive luxury black SUV with chauffeur in Los Angeles — RideYeah",
    related: ["downtown-la"],
    title: "Executive SUV Service in Los Angeles",
    metaTitle: "Executive SUV Service in Los Angeles | Chauffeured | RideYeah",
    metaDescription:
      "Executive SUV service in Los Angeles: a chauffeured luxury black SUV for airport runs, client pickups and roadshows. Professional drivers, fixed pricing, Wi-Fi.",
    keyword: "executive suv service los angeles",
    excerpt:
      "What executive SUV service really means in LA — the vehicle standard, the chauffeur, and why it beats a town car or rideshare for client-facing days.",
    body: [
      {
        p: "In a city where a meeting can start in Century City and end in Pasadena, how you move matters. <strong>Executive SUV service</strong> in Los Angeles pairs a chauffeured, full-size luxury black SUV with a professional driver — the standard for executives, client pickups and anyone whose schedule can't absorb a missed connection or a surprise surge fare. Here's what it includes and when it's the right call.",
      },
      { h2: "What \"executive SUV service\" actually means" },
      {
        p: "It's more than a nicer car. Executive service is a complete standard: a vetted, professional chauffeur; an immaculate, late-model luxury black SUV; punctuality built around your calendar; and one predictable, all-in price. With <a href=\"/black-car-service.html\">black-car service</a>, the experience is consistent every time — not whoever happens to accept a rideshare ping.",
      },
      {
        ul: [
          "<strong>The vehicle</strong> — a full-size luxury black SUV, detailed before every job, seating up to 7 with room for luggage and roller bags.",
          "<strong>The chauffeur</strong> — licensed, insured, discreet and trained to handle doors, bags and the route so you can work or decompress.",
          "<strong>The standard</strong> — Wi-Fi, chilled water, climate set to preference, and a quiet cabin that doubles as a mobile office.",
          "<strong>The price</strong> — fixed and all-in, approved before the trip, with no surge.",
        ],
      },
      { cta: { label: "Reserve an executive SUV", href: "/#book" } },
      { h2: "Why an SUV over a sedan" },
      {
        p: "A town car is fine for a solo rider with a carry-on. An SUV earns its place the moment there's a second executive, a client, presentation materials or checked luggage. The extra space, the higher seating position and the understated presence of a black SUV all read as <em>arrived</em> — without being ostentatious. For Los Angeles, where image and discretion sit side by side, that balance is the point.",
      },
      { h2: "When executives use it" },
      {
        p: "The same SUV and chauffeur flex across a workday:",
      },
      {
        ul: [
          "<strong>Airport runs</strong> — LAX, Burbank (BUR) and private terminals, with flight tracking and meet-and-greet. See <a href=\"/airport-transfers.html\">airport transfers</a>.",
          "<strong>Client pickups</strong> — collect a visiting partner from their hotel and deliver them to dinner or the office, on time, every time.",
          "<strong>Roadshows &amp; multi-stop days</strong> — keep the same driver on call by the hour with <a href=\"/hourly-chauffeur.html\">hourly chauffeur</a> service.",
        ],
      },
      { h2: "Billing built for business" },
      {
        p: "Executive travel should be one clean line item, not a stack of variable rideshare receipts. Fixed quotes make trips easy to approve and expense, and for repeat travel we can set up standing arrangements so booking is a formality. Compare the most-requested point-to-point runs and their fixed fares on our <a href=\"/popular-routes.html\">routes</a> page.",
      },
      {
        quote:
          "The value of executive service isn't luxury for its own sake — it's reclaimed time and zero uncertainty on a day that can't afford either.",
      },
      { h2: "Coverage across Los Angeles" },
      {
        p: "We cover the corporate map: Downtown LA and the Financial District, Century City, Beverly Hills, Santa Monica, Burbank and the studios, Pasadena and out into Orange County. Wherever the day takes you, it's the same vehicle standard and the same professional chauffeur.",
      },
      { h2: "Booking executive SUV service" },
      {
        p: "Enter your pickup, destination and timing for an instant all-in quote, and your chauffeur and SUV are confirmed in advance. For frequent travel, ask about a standing arrangement so every trip is one tap.",
      },
      { cta: { label: "Book executive SUV service", href: "/#book" } },
    ],
    faq: [
      {
        q: "What is executive SUV service?",
        a: "A chauffeured, full-size luxury black SUV with a professional driver, used for airport transfers, client pickups, roadshows and executive travel. It includes Wi-Fi, chilled water, flight tracking on airport runs and one fixed, all-in price.",
      },
      {
        q: "How many passengers fit in an executive SUV?",
        a: "Up to 7 passengers with room for luggage — comfortable for a single executive, a small team or a client pickup with bags.",
      },
      {
        q: "Can I set up an account for repeat executive travel?",
        a: "Yes. For frequent or company travel we can arrange standing bookings and consolidated billing so trips are simple to schedule, approve and expense. Contact us at info@rideyeah.com or (805) 285-1570.",
      },
    ],
  },

  // ───────────────────────── 4 · Business Travelers ─────────────────────────
  {
    slug: "private-chauffeur-service-for-business-travelers",
    category: "Executive Travel",
    date: "2026-06-08",
    readMin: 6,
    hero: "chauffeur",
    heroAlt: "Private chauffeur greeting a business traveler beside a luxury black SUV — RideYeah",
    related: ["downtown-la"],
    title: "Private Chauffeur Service for Business Travelers",
    metaTitle: "Private Chauffeur Service for Business Travelers | LA | RideYeah",
    metaDescription:
      "Private chauffeur service for business travelers in Los Angeles: reliable airport pickups, a mobile office on wheels, fixed pricing and simple billing. No surge.",
    keyword: "private chauffeur service business travelers",
    excerpt:
      "Rideshare is fine until the day it isn't. Here's why business travelers in LA switch to a private chauffeur — and where it quietly pays for itself.",
    body: [
      {
        p: "For a business traveler, ground transportation is rarely the trip's biggest expense — but it's often the one most likely to derail the day. A surge-priced rideshare, a no-show at the curb, a driver who can't find arrivals: small failures with outsized cost when a meeting is on the line. <strong>Private chauffeur service</strong> removes that variable. Here's what business travelers in Los Angeles gain by switching.",
      },
      { h2: "The hidden cost of rideshare for business travel" },
      {
        p: "Rideshare optimizes for cheap and frequent, not reliable and professional. On a business trip that trade-off shows up as: unpredictable surge pricing into and out of LAX, a rotating cast of vehicles and drivers, no flight tracking, and an expense report full of mismatched receipts. None of that is catastrophic on its own — but it's friction on a day where your attention belongs on the meeting, not the curb.",
      },
      { h2: "What a private chauffeur adds" },
      {
        ul: [
          "<strong>Reliability</strong> — a confirmed chauffeur and vehicle, booked in advance, ready when you land. With <a href=\"/airport-transfers.html\">flight tracking</a>, your driver adjusts to delays automatically.",
          "<strong>Productivity</strong> — a quiet cabin with Wi-Fi turns the ride into a mobile office: prep, calls or simply a moment to reset before you walk in.",
          "<strong>Professionalism</strong> — a discreet, suited chauffeur and a clean luxury black SUV that reflects well when you're collecting a client.",
          "<strong>Predictable cost</strong> — a fixed, all-in fare with no surge, quoted before you book.",
        ],
      },
      { cta: { label: "Book your airport chauffeur", href: "/#book" } },
      { h2: "From the airport to the last meeting" },
      {
        p: "A business day is rarely one ride. RideYeah covers the whole arc: a tracked LAX or Burbank pickup, a transfer to your hotel or first meeting, and — when the day runs long — the same chauffeur on call by the hour. Our <a href=\"/hourly-chauffeur.html\">hourly chauffeur</a> service is built for multi-stop days and client roadshows, while <a href=\"/black-car-service.html\">black-car service</a> handles the standing, repeat trips frequent travelers need.",
      },
      {
        quote:
          "The math is simple: if a reliable ride protects one important meeting, it has already paid for the trip.",
      },
      { h2: "Billing and expensing made simple" },
      {
        p: "Every trip is a single, fixed line item — easy to approve and drop into an expense report without deciphering surge multipliers. For travelers who fly the LA corridor often, standing arrangements and consolidated billing make the whole process a non-event.",
      },
      { h2: "Who it's for" },
      {
        p: "Executives and founders, consultants living out of a carry-on, sales teams running client meetings across the Westside, and assistants booking travel for a principal who expects it to simply work. If your time is the scarce resource, a private chauffeur is the upgrade that protects it.",
      },
      { h2: "Booking your chauffeur" },
      {
        p: "Enter your flight and destination for an instant all-in quote. Your chauffeur is confirmed ahead of time and tracking your arrival — so the only thing waiting on you is the car.",
      },
      { cta: { label: "Reserve a private chauffeur", href: "/#book" } },
    ],
    faq: [
      {
        q: "Is a private chauffeur worth it for business travel?",
        a: "For time-sensitive trips, yes. You get a confirmed vehicle and driver, flight tracking, a quiet cabin to work in and a fixed price with no surge — which protects the meetings your trip is built around and keeps expensing simple.",
      },
      {
        q: "Do you track my flight for airport pickups?",
        a: "Yes. We monitor your inbound flight in real time, so your chauffeur is ready whether you land early or late, and wait time on arrivals is complimentary.",
      },
      {
        q: "Can one chauffeur stay with me for multiple meetings?",
        a: "Yes. Our hourly chauffeur service keeps the same driver and SUV with you across a multi-stop day or client roadshow. See the hourly chauffeur page or contact us to set it up.",
      },
    ],
  },

  // ───────────────────────── 5 · Corporate Transportation ─────────────────────────
  {
    slug: "corporate-transportation-services-los-angeles",
    category: "Corporate",
    date: "2026-06-08",
    readMin: 7,
    hero: "hero_suburban",
    heroAlt: "Fleet of luxury black SUVs for corporate transportation in Los Angeles — RideYeah",
    related: ["downtown-la"],
    title: "Corporate Transportation Services in Los Angeles",
    metaTitle: "Corporate Transportation Services in Los Angeles | RideYeah",
    metaDescription:
      "Corporate transportation services in Los Angeles: executive airport transfers, roadshows, event and group travel in chauffeured luxury black SUVs, with simple account billing.",
    keyword: "corporate transportation services los angeles",
    excerpt:
      "What companies should look for in an LA corporate transportation partner — coverage, vehicle standard, duty of care and billing that doesn't create work.",
    body: [
      {
        p: "When a company moves executives, clients or whole teams around Los Angeles, ad-hoc rideshare stops scaling fast. <strong>Corporate transportation services</strong> give a business one reliable provider, one vehicle standard and one clean invoice — for everything from a single executive airport run to a multi-vehicle event. Here's what good corporate transportation looks like in LA, how our <a href=\"/corporate-transportation.html\">corporate &amp; executive transportation</a> service works, and how to set it up.",
      },
      { h2: "What corporate transportation covers" },
      {
        p: "It's an umbrella over several recurring needs, all handled by the same provider so quality stays consistent:",
      },
      {
        ul: [
          "<strong>Executive airport transfers</strong> — LAX, Burbank and private terminals with flight tracking and meet-and-greet. See <a href=\"/airport-transfers.html\">airport transfers</a>.",
          "<strong>Client &amp; VIP pickups</strong> — collect visiting partners and deliver them on time, in a vehicle that reflects the company.",
          "<strong>Roadshows &amp; multi-stop days</strong> — a dedicated chauffeur by the hour for investor days and packed itineraries via <a href=\"/hourly-chauffeur.html\">hourly chauffeur</a> service.",
          "<strong>Events &amp; group travel</strong> — coordinated luxury black SUVs for conferences, off-sites and team movements.",
        ],
      },
      { cta: { label: "Set up corporate transportation", href: "/#book" } },
      { h2: "Why companies standardize on one provider" },
      {
        p: "Letting each traveler book their own rideshare seems flexible, but it scatters quality, safety and spend. Standardizing on a single chauffeured provider gives leadership a consistent experience for every guest, predictable costs, and one point of contact when plans change at the last minute — which, in Los Angeles, they will.",
      },
      { h2: "The vehicle and chauffeur standard" },
      {
        p: "Every corporate trip runs in an immaculate, full-size <a href=\"/black-car-service.html\">luxury black SUV</a> with a licensed, insured, professional chauffeur. Cabins come with Wi-Fi, chilled water and climate control, and seat up to 7 with luggage — equally suited to a solo executive or a client team moving together.",
      },
      {
        quote:
          "Duty of care matters: when a company books travel for its people and guests, vetted drivers and properly insured, well-maintained vehicles aren't a luxury — they're the baseline.",
      },
      { h2: "Billing and accounts that don't create work" },
      {
        p: "The administrative side is where corporate transportation either saves time or wastes it. RideYeah keeps it simple: fixed, all-in quotes approved before each trip, standing arrangements for frequent routes and consolidated billing so finance sees clean, predictable line items instead of a pile of personal rideshare receipts. Browse the most-requested fixed-fare runs on our <a href=\"/popular-routes.html\">routes</a> page.",
      },
      { h2: "Coverage across LA & Orange County" },
      {
        p: "From Downtown LA and Century City to Santa Monica, Burbank, Pasadena and across Orange County, we cover the corporate map with the same standard everywhere — so a guest landing for a board meeting and a team heading to an off-site get the identical experience.",
      },
      { h2: "Setting up corporate transportation" },
      {
        p: "Start a single booking online for an instant quote, or reach out to arrange an account for recurring travel, events and consolidated billing. Email info@rideyeah.com or call (805) 285-1570 and we'll tailor it to how your company travels.",
      },
      { cta: { label: "Get a corporate quote", href: "/#book" } },
    ],
    faq: [
      {
        q: "What do corporate transportation services include?",
        a: "Executive airport transfers, client and VIP pickups, roadshows and multi-stop days, and event or group travel — all in chauffeured luxury black SUVs with professional drivers, fixed pricing and consolidated billing.",
      },
      {
        q: "Can we set up a company account with consolidated billing?",
        a: "Yes. We arrange standing bookings, recurring routes and consolidated invoicing so corporate travel is easy to schedule, approve and expense. Contact info@rideyeah.com or (805) 285-1570 to set it up.",
      },
      {
        q: "Do you handle group and event transportation in Los Angeles?",
        a: "Yes. We coordinate multiple luxury black SUVs for conferences, off-sites, investor roadshows and team movements across Los Angeles and Orange County, with one point of contact.",
      },
    ],
  },
];

// ---- Merge agent-generated posts (content/blog-generated.json) -------------
// The weekly publishing agent appends validated post objects to that file via a
// Pull Request; authored content above is never touched. Missing/invalid file
// → just the authored posts.
let generated = [];
try {
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(here, "..", "content", "blog-generated.json"), "utf8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) generated = parsed;
} catch {
  /* no generated posts yet */
}

const seen = new Set();
export const POSTS = [...AUTHORED, ...generated].filter((p) => {
  if (!p || !p.slug || seen.has(p.slug)) return false;
  seen.add(p.slug);
  return true;
});

// ---- Backlog the weekly agent draws from ----------------------------------
// The agent picks the first QUEUE item whose slug is not already published,
// drafts it (see scripts/blog-agent/), and opens a PR. Keep briefs specific —
// they steer the angle and the local detail.
export const QUEUE = [
  {
    slug: "how-much-is-a-car-from-lax-2026-price-guide",
    title: "How Much Is a Car From LAX? (2026 Price Guide)",
    keyword: "lax car service cost",
    category: "Airport Transfers",
    related: ["downtown-la", "long-beach"],
    hero: "airport_pickup",
    brief:
      "A transparent price guide for private car service from LAX to popular SoCal destinations. Explain fixed all-in fares vs. metered/surge, list example routes with prices from our routes data, and what 'all-in' includes (tolls, gratuity, wait time). Funnel to /popular-routes.",
  },
  {
    slug: "lax-meet-and-greet-how-airport-pickups-work",
    title: "LAX Meet & Greet: How Airport Pickups Really Work",
    keyword: "lax meet and greet service",
    category: "Airport Transfers",
    related: ["downtown-la"],
    hero: "airport_pickup",
    brief:
      "Explain how a private meet-and-greet pickup at LAX works step by step: flight tracking, where the chauffeur meets you (curbside vs. arrivals), luggage help, complimentary wait time, and private-terminal/Van Nuys options. Funnel to /airport-transfers.",
  },
  {
    slug: "lax-to-santa-barbara-private-car-vs-shuttle",
    title: "LAX to Santa Barbara: Private Car vs. Shuttle",
    keyword: "lax to santa barbara car service",
    category: "Airport Transfers",
    related: ["santa-barbara"],
    hero: "band_highway",
    brief:
      "Compare a private luxury SUV against the Santa Barbara airbus/shuttle and rideshare for the ~95-mile LAX run: time, comfort, door-to-door vs. fixed stops, cost. Use the $400 fixed fare and ~1h50m drive. Funnel to /lax-to-santa-barbara.",
  },
  {
    slug: "lax-to-anaheim-disneyland-private-transfer",
    title: "LAX to Anaheim & Disneyland Private Transfer",
    keyword: "lax to disneyland car service",
    category: "Airport Transfers",
    related: ["anaheim"],
    hero: "band_highway",
    brief:
      "Family-focused guide to a private LAX → Anaheim/Disneyland transfer: car seats by request, space for luggage and strollers, fixed $250 fare, ~40 min drive, no surge after a long flight. Funnel to /lax-to-anaheim.",
  },
  {
    slug: "black-car-service-for-weddings-los-angeles",
    title: "Black-Car Service for Weddings in Los Angeles",
    keyword: "wedding car service los angeles",
    category: "Luxury Travel",
    related: ["calabasas"],
    hero: "escalade-luxury-suv-exterior-rear",
    brief:
      "Guide to booking luxury black-SUV transportation for an LA wedding: couple and guest transport, hourly coverage for the day, professional chauffeurs, on-time guarantees. Funnel to /hourly-chauffeur and /black-car-service.",
  },
];
