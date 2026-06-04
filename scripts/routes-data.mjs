/**
 * RideYeah · Route landing-page data
 * ----------------------------------
 * Single source of truth for the LAX ⇄ City route pages. Consumed by
 * scripts/gen-routes.mjs (writes the EN + ES HTML) and used to keep the home
 * routes grid, the /popular-routes hub and the sitemap in sync.
 *
 * Prices are fixed one-way estimates (USD) and may change without notice.
 */
export const ROUTES = [
  {
    slug: "santa-barbara", city: "Santa Barbara", price: 400,
    min: 110, miles: "~95 mi", driveShort: "about 1 hour 50 minutes",
    driveLong: "Roughly 1 hour 50 minutes in typical traffic (about 95 miles)",
    driveLongEs: "Alrededor de 1 hora 50 minutos con tráfico normal (unas 95 millas)",
    landmarks: "Montecito, the harbor, downtown hotels and the wine country",
    landmarksEs: "Montecito, el puerto, los hoteles del centro y la zona vinícola",
    hero: "band_highway", media: "escalade-luxury-suv-exterior-front",
  },
  {
    slug: "simi-valley", city: "Simi Valley", price: 250,
    min: 55, miles: "~45 mi", driveShort: "about 55 minutes",
    driveLong: "Roughly 55 minutes in typical traffic (about 45 miles)",
    driveLongEs: "Alrededor de 55 minutos con tráfico normal (unas 45 millas)",
    landmarks: "the Ronald Reagan Library, Simi Valley Town Center and local studios",
    landmarksEs: "la Biblioteca Ronald Reagan, el Town Center de Simi Valley y los estudios locales",
    hero: "hero_suburban", media: "escalade-luxury-suv-exterior-rear",
  },
  {
    slug: "thousand-oaks", city: "Thousand Oaks", price: 250,
    min: 55, miles: "~45 mi", driveShort: "about 55 minutes",
    driveLong: "Roughly 55 minutes in typical traffic (about 45 miles)",
    driveLongEs: "Alrededor de 55 minutos con tráfico normal (unas 45 millas)",
    landmarks: "Westlake Village, The Oaks and the Conejo Valley",
    landmarksEs: "Westlake Village, The Oaks y el valle de Conejo",
    hero: "chauffeur", media: "escalade-luxury-suv-second-row-seats",
  },
  {
    slug: "camarillo", city: "Camarillo", price: 300,
    min: 65, miles: "~55 mi", driveShort: "about 1 hour 5 minutes",
    driveLong: "Roughly 1 hour 5 minutes in typical traffic (about 55 miles)",
    driveLongEs: "Alrededor de 1 hora 5 minutos con tráfico normal (unas 55 millas)",
    landmarks: "Camarillo Premium Outlets, the airport and nearby hotels",
    landmarksEs: "Camarillo Premium Outlets, el aeropuerto y los hoteles cercanos",
    hero: "airport_pickup", media: "escalade-luxury-suv-front-seats",
  },
  {
    slug: "anaheim", city: "Anaheim", price: 250,
    min: 40, miles: "~35 mi", driveShort: "about 40 minutes",
    driveLong: "Roughly 40 minutes in typical traffic (about 35 miles)",
    driveLongEs: "Alrededor de 40 minutos con tráfico normal (unas 35 millas)",
    landmarks: "the Disneyland Resort, the Convention Center and Honda Center",
    landmarksEs: "el Disneyland Resort, el Convention Center y el Honda Center",
    hero: "band_highway", media: "escalade-luxury-suv-dashboard",
  },
  {
    slug: "long-beach", city: "Long Beach", price: 200,
    min: 30, miles: "~22 mi", driveShort: "about 30 minutes",
    driveLong: "Roughly 30 minutes in typical traffic (about 22 miles)",
    driveLongEs: "Alrededor de 30 minutos con tráfico normal (unas 22 millas)",
    landmarks: "the Queen Mary, the Convention Center, the port and the marina",
    landmarksEs: "el Queen Mary, el Convention Center, el puerto y la marina",
    hero: "hero_suburban", media: "fleet_suburban",
  },
  {
    slug: "pasadena", city: "Pasadena", price: 200,
    min: 40, miles: "~28 mi", driveShort: "about 40 minutes",
    driveLong: "Roughly 40 minutes in typical traffic (about 28 miles)",
    driveLongEs: "Alrededor de 40 minutos con tráfico normal (unas 28 millas)",
    landmarks: "Old Town, the Rose Bowl and the Langham Huntington",
    landmarksEs: "Old Town, el Rose Bowl y el Langham Huntington",
    hero: "chauffeur", media: "escalade-luxury-suv-exterior-front",
  },
  {
    slug: "calabasas", city: "Calabasas", price: 200,
    min: 40, miles: "~30 mi", driveShort: "about 40 minutes",
    driveLong: "Roughly 40 minutes in typical traffic (about 30 miles)",
    driveLongEs: "Alrededor de 40 minutos con tráfico normal (unas 30 millas)",
    landmarks: "The Commons, Calabasas hotels and gated communities",
    landmarksEs: "The Commons, los hoteles de Calabasas y las comunidades privadas",
    hero: "airport_pickup", media: "escalade-luxury-suv-second-row-seats",
  },
];

// Disclaimer shown under prices everywhere.
export const DISCLAIMER_EN =
  "Fares shown are estimates and may change without notice. For an exact price and availability, enter your trip in the booking search above for an instant quote.";
export const DISCLAIMER_ES =
  "Las tarifas mostradas son estimadas y pueden cambiar sin previo aviso. Para un precio exacto y disponibilidad, ingresa tu viaje en el buscador y obtén una cotización al instante.";
