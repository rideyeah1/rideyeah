/**
 * RideYeah · City service-area data
 * ---------------------------------
 * Single source of truth for the "Chauffeur Service in <City>" landing pages.
 * Consumed by scripts/gen-cities.mjs (writes EN HTML) and gen-sitemap.mjs.
 *
 * Each city carries genuinely local detail (neighborhoods, landmarks, venues,
 * nearby airports, and the matching LAX route slug + price where one exists) so
 * every page is distinct — not a thin doorway page.
 */
export const CITIES = [
  {
    slug: "beverly-hills-chauffeur-service",
    city: "Beverly Hills",
    area: "Los Angeles",
    keyword: "beverly hills chauffeur service",
    hero: "chauffeur",
    laxRoute: null,
    laxMin: 35,
    intro:
      "From the Golden Triangle to the estates above Sunset, Beverly Hills expects arrivals handled with discretion. RideYeah provides chauffeured luxury black SUV service across Beverly Hills — airport transfers, hourly hire, dinners on Rodeo and quiet, professional door-to-door rides.",
    neighborhoods: ["the Golden Triangle &amp; Rodeo Drive", "Trousdale Estates", "the Flats", "Beverly Hills Gateway", "Benedict &amp; Coldwater Canyon"],
    landmarks: "Rodeo Drive, the Beverly Hills Hotel, the Waldorf Astoria, Montage Beverly Hills and the Golden Triangle",
    useCase:
      "a board meeting, a shopping day on Rodeo, a hotel transfer or a discreet evening out",
    airports: "LAX, Burbank (BUR) and Van Nuys private terminals",
  },
  {
    slug: "santa-monica-chauffeur-service",
    city: "Santa Monica",
    area: "Los Angeles",
    keyword: "santa monica car service",
    hero: "hero_suburban",
    laxRoute: null,
    laxMin: 25,
    intro:
      "Just up the coast from LAX, Santa Monica blends beachfront hotels, tech offices and Montana Avenue style. RideYeah covers it all with chauffeured luxury black SUV service — quick airport runs, hourly hire and smooth point-to-point rides along the Westside.",
    neighborhoods: ["Ocean Avenue &amp; the beachfront hotels", "Montana Avenue", "Wilshire-Montana", "Ocean Park", "Sunset Park"],
    landmarks: "the Santa Monica Pier, Third Street Promenade, Shutters on the Beach, Casa del Mar and the Fairmont Miramar",
    useCase:
      "a quick LAX transfer, a Silicon-Beach meeting, a beachfront hotel pickup or dinner downtown",
    airports: "LAX (about 25 minutes) and Van Nuys private terminals",
  },
  {
    slug: "calabasas-chauffeur-service",
    city: "Calabasas",
    area: "Los Angeles",
    keyword: "calabasas chauffeur service",
    hero: "escalade-luxury-suv-exterior-front",
    laxRoute: "calabasas",
    laxMin: 40,
    intro:
      "Calabasas runs on privacy — gated communities, hillside estates and a low-key luxury that a random rideshare can't match. RideYeah provides discreet chauffeured luxury black SUV service across Calabasas, with drivers prepared for gate and guard-house access.",
    neighborhoods: ["The Commons", "the gated communities off Mulholland &amp; Las Virgenes", "the hillside estates", "Hidden Hills (nearby)", "Old Town Calabasas"],
    landmarks: "The Commons at Calabasas, the Saddle Peak hills, Calabasas hotels and the surrounding gated communities",
    useCase:
      "an airport transfer, a studio meeting, dinner at The Commons or a discreet evening pickup",
    airports: "LAX, Burbank (BUR) and Van Nuys private terminals",
  },
  {
    slug: "pasadena-chauffeur-service",
    city: "Pasadena",
    area: "Los Angeles",
    keyword: "pasadena car service",
    hero: "escalade-luxury-suv-exterior-rear",
    laxRoute: "pasadena",
    laxMin: 40,
    intro:
      "From Old Town to the estates of San Marino, Pasadena pairs old-California elegance with a busy events calendar. RideYeah provides chauffeured luxury black SUV service across Pasadena — airport runs, Rose Bowl event nights, weddings and professional point-to-point rides.",
    neighborhoods: ["Old Town Pasadena", "South Lake &amp; the Playhouse District", "San Marino", "Bungalow Heaven", "Linda Vista"],
    landmarks: "Old Town, the Rose Bowl, the Langham Huntington, the Norton Simon and Caltech",
    useCase:
      "a Rose Bowl event, a wedding at the Langham, an airport transfer or a day across the San Gabriel Valley",
    airports: "LAX, Burbank (BUR) and Hollywood Burbank for quick hops",
  },
  {
    slug: "newport-beach-chauffeur-service",
    city: "Newport Beach",
    area: "Orange County",
    keyword: "newport beach car service",
    hero: "hero_suburban",
    laxRoute: null,
    laxMin: 55,
    intro:
      "On the Orange County coast, Newport Beach moves between harbor-front estates, Fashion Island boardrooms and Newport Coast resorts. RideYeah provides chauffeured luxury black SUV service across Newport Beach — airport transfers to both LAX and John Wayne, hourly hire and coastal point-to-point rides.",
    neighborhoods: ["Balboa Island &amp; the Peninsula", "Newport Coast", "Corona del Mar", "Fashion Island &amp; Newport Center", "Lido Isle"],
    landmarks: "Fashion Island, Balboa Island, the harbor, Pelican Hill and the Newport Coast resorts",
    useCase:
      "a John Wayne or LAX transfer, a Fashion Island meeting, a harbor dinner or a resort pickup",
    airports: "John Wayne (SNA) nearby, plus LAX and Long Beach (LGB)",
  },
  {
    slug: "thousand-oaks-chauffeur-service",
    city: "Thousand Oaks",
    area: "Conejo Valley",
    keyword: "thousand oaks car service",
    hero: "band_highway",
    laxRoute: "thousand-oaks",
    laxMin: 55,
    intro:
      "In the Conejo Valley, Thousand Oaks and Westlake Village run on corporate campuses, family neighborhoods and a quiet, gated kind of luxury. RideYeah provides chauffeured luxury black SUV service across Thousand Oaks — airport transfers, executive travel, hourly hire and point-to-point rides.",
    neighborhoods: ["Westlake Village", "Newbury Park", "Dos Vientos", "North Ranch", "Lynn Ranch"],
    landmarks: "The Oaks, Westlake Village, the Conejo Valley corporate campuses and local studios",
    useCase:
      "an LAX transfer, an executive meeting at a corporate campus, a family pickup or a night out",
    airports: "LAX, Burbank (BUR) and Camarillo for regional flights",
  },
  {
    slug: "malibu-chauffeur-service",
    city: "Malibu",
    area: "Los Angeles",
    keyword: "malibu car service",
    hero: "escalade-luxury-suv-exterior-rear",
    laxRoute: null,
    laxMin: 50,
    intro:
      "Twenty-one miles of coastline, gated beachfront estates and a single highway in and out — Malibu rewards a driver who knows the PCH. RideYeah provides chauffeured luxury black SUV service across Malibu, from airport transfers to dinners on the coast and discreet estate pickups.",
    neighborhoods: ["Point Dume", "Malibu Colony", "Carbon Beach", "Zuma &amp; Broad Beach", "the Malibu Country Mart area"],
    landmarks: "the Pacific Coast Highway, Nobu Malibu, Soho House Little Beach House, the Malibu Pier and the Getty Villa",
    useCase:
      "an LAX transfer down the coast, a beachfront wedding, a Nobu dinner or a discreet estate pickup",
    airports: "LAX, Burbank (BUR) and Van Nuys private terminals",
  },
  {
    slug: "west-hollywood-chauffeur-service",
    city: "West Hollywood",
    area: "Los Angeles",
    keyword: "west hollywood car service",
    hero: "chauffeur",
    laxRoute: null,
    laxMin: 35,
    intro:
      "From the Sunset Strip to the Design District, West Hollywood runs late and expects to be moved in style. RideYeah provides chauffeured luxury black SUV service across WeHo — airport transfers, nights out on the Strip, hourly hire and smooth, discreet point-to-point rides.",
    neighborhoods: ["the Sunset Strip", "Santa Monica Boulevard", "Melrose &amp; the Design District", "Norma Triangle", "West Hollywood West"],
    landmarks: "the Sunset Strip, Chateau Marmont, the Comedy Store, the Pacific Design Center and The Abbey",
    useCase:
      "a night out on the Strip, an awards event, an airport transfer or a hotel pickup",
    airports: "LAX, Burbank (BUR) and Van Nuys private terminals",
  },
  {
    slug: "long-beach-chauffeur-service",
    city: "Long Beach",
    area: "Los Angeles",
    keyword: "long beach car service",
    hero: "hero_suburban",
    laxRoute: "long-beach",
    laxMin: 30,
    intro:
      "Between the waterfront, the convention district and the neighborhoods around Naples and Belmont Shore, Long Beach keeps its own pace. RideYeah provides chauffeured luxury black SUV service across Long Beach — airport transfers to LAX and Long Beach (LGB), hourly hire and door-to-door rides.",
    neighborhoods: ["Belmont Shore", "Naples Island", "Downtown &amp; Pine Avenue", "Bixby Knolls", "the East Village Arts District"],
    landmarks: "the Queen Mary, the Convention Center, the port, the marina and the Aquarium of the Pacific",
    useCase:
      "an LAX or Long Beach airport transfer, a convention pickup, a waterfront dinner or a cruise-terminal drop-off",
    airports: "Long Beach (LGB) nearby, plus LAX and John Wayne (SNA)",
  },
];
