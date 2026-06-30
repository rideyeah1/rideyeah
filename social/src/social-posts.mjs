// Builds IG + FB feed-sized versions of the new RideYeah photos + per-image
// English captions (written from each image's scene/perspective).
//  Instagram: 1080x1350 (4:5)   ·   Facebook: 1200x1500 (4:5)
// Smart crop (attention) keeps the SUV. Source = the clean photo folder.
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'C:/Users/reyna/Downloads/imagenes y videos de rideyeah 0628';
const OUT = 'C:/Users/reyna/Downloads/RideYeah_Social';
mkdirSync(path.join(OUT, 'IG'), { recursive: true });
mkdirSync(path.join(OUT, 'FB'), { recursive: true });
mkdirSync(path.join(OUT, 'captions'), { recursive: true });

const POSTS = {
  '1': { slug: 'LAX-Arrival',
    ig: `Touchdown, handled. ✈️\nStep off your flight and straight into a private black Escalade waiting at the curb — flight tracked, no surge, no rideshare line. This is how Los Angeles should welcome you. 🖤\n\n#RideYeah #LAXairport #AirportTransfer #LuxuryTravel #BlackCarService #PrivateChauffeur #LosAngeles #VIPtransport`,
    fb: `Your flight lands; your ride is already there.\nRideYeah meets you at LAX with a private black SUV, a professional chauffeur and one fixed, all-in fare — flight tracking and meet-and-greet included. Arrive relaxed, every time.\n\n📲 Book at rideyeah.com · (805) 285-1570\n#RideYeah #LAXairport #AirportTransfer` },
  '2': { slug: 'Downtown-LA-Skyline',
    ig: `The city is the office. 🌆\nGlide through Downtown LA in a private black Escalade while the skyline does the talking. Discreet, on time, unmistakably premium.\n\n#RideYeah #DowntownLA #ExecutiveTravel #BusinessTravel #LuxuryCarService #BlackCarService #LosAngeles #CorporateTravel`,
    fb: `Meetings across Downtown LA? Let your chauffeur handle the traffic while you handle business.\nRideYeah keeps executives moving on schedule in a private, immaculate black SUV — 24/7.\n\n📲 Set up a corporate account at rideyeah.com\n#RideYeah #BusinessTravel #LosAngeles` },
  '3': { slug: 'Mulholland-Overlook',
    ig: `Above it all. ✨\nSome evenings deserve a view — and a ride that matches it. Private, quiet, yours alone, with the lights of LA at your feet. 🖤\n\n#RideYeah #MulhollandDrive #LosAngelesNights #LuxuryTravel #PrivateCarService #VIP #BlackCarService #ExploreLA`,
    fb: `From dinner reservations to evening events, RideYeah makes the night effortless — a private black SUV and a professional chauffeur, so you can simply enjoy the view.\n\n📲 rideyeah.com · (805) 285-1570\n#RideYeah #LosAngeles #LuxuryTravel` },
  '4': { slug: 'Beverly-Hills-Palms',
    ig: `Beverly Hills, on your terms. 🌴\nRodeo Drive, fine dining, the after-party — arrive in a private black Escalade and skip the parking, the surge and the wait.\n\n#RideYeah #BeverlyHills #RodeoDrive #LuxuryLifestyle #BlackCarService #PrivateChauffeur #LosAngeles #VIP`,
    fb: `Shopping, dining, or a night out in Beverly Hills? RideYeah is your private driver for the day — no parking, no surge, just a spotless black SUV ready when you are.\n\n📲 Book at rideyeah.com\n#RideYeah #BeverlyHills #LosAngeles` },
  '5': { slug: 'San-Gabriel-Mountain-Road',
    ig: `Beyond the city limits. 🏔️\nMountains, wine country, the weekend escape — RideYeah takes you there in quiet luxury, mile after mile. 🖤\n\n#RideYeah #SanGabrielMountains #RoadTrip #LuxuryTravel #PrivateCarService #BlackCarService #ExploreCalifornia #ChauffeurService`,
    fb: `Heading out of town? Skip the rental and the driving.\nRideYeah handles long-distance and getaway trips across Southern California in a private, comfortable black SUV — door to door.\n\n📲 Get a fixed quote at rideyeah.com · (805) 285-1570\n#RideYeah #LuxuryTravel` },
  '6': { slug: 'Malibu-PCH-Sunset',
    ig: `Golden hour on the PCH. 🌅\nThe coast hits different from the back seat of a private black Escalade. Malibu, Santa Monica, the long way home — yours to enjoy.\n\n#RideYeah #Malibu #PCH #PacificCoastHighway #LuxuryTravel #BlackCarService #LosAngeles #SunsetDrive`,
    fb: `Malibu calls. Let RideYeah drive the coast while you take in the view — a private black SUV, a professional chauffeur, and no traffic to think about.\n\n📲 rideyeah.com\n#RideYeah #Malibu #LosAngeles` },
  '7': { slug: 'Griffith-Hollywood-Hills',
    ig: `This is your LA. 🌃\nIconic views, a private black Escalade and a chauffeur who knows every road. From the Hills to the Observatory, ride like the city belongs to you. 🖤\n\n#RideYeah #GriffithObservatory #HollywoodHills #LosAngeles #LuxuryTravel #BlackCarService #VIP #ExploreLA`,
    fb: `Showing visiting clients or family the real Los Angeles? RideYeah turns the city into a private tour — Griffith, the Hills, the landmarks — in a comfortable black SUV with a local chauffeur.\n\n📲 Book at rideyeah.com · (805) 285-1570\n#RideYeah #LosAngeles #Tourism` },
  '8': { slug: 'Corporate-Tower',
    ig: `Arrive like it matters. 🏙️\nBecause it does. RideYeah delivers executives and clients to the door in a discreet black Escalade — on time, every time.\n\n#RideYeah #CorporateTravel #ExecutiveTransport #BusinessClass #BlackCarService #LosAngeles #VIPtransport #B2B`,
    fb: `First impressions start at the curb.\nRideYeah for Business gives your team and clients a polished arrival every time — corporate accounts, consolidated billing, priority 24/7 booking.\n\n📲 Open an account at rideyeah.com · (805) 285-1570\n#RideYeah #CorporateTravel #BusinessTravel` },
};

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));
for (const f of files) {
  const num = (f.match(/^(\d)/) || [])[1];
  const p = POSTS[num];
  if (!p) { console.log('SKIP (no caption)', f); continue; }
  const variant = /\b2\b/.test(f.replace(/^\d/, '')) ? '-alt' : '';
  const name = `${num}_${p.slug}${variant}`;

  await sharp(path.join(SRC, f)).resize(1080, 1350, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 90 }).toFile(path.join(OUT, 'IG', `${name}.jpg`));
  await sharp(path.join(SRC, f)).resize(1200, 1500, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 90 }).toFile(path.join(OUT, 'FB', `${name}.jpg`));

  const cap = `=== ${num} · ${p.slug.replace(/-/g, ' ')} ===\n\n--- INSTAGRAM (1080x1350) ---\n${p.ig}\n\n--- FACEBOOK (1200x1500) ---\n${p.fb}\n`;
  writeFileSync(path.join(OUT, 'captions', `${name}.txt`), cap, 'utf8');
  console.log('OK', name);
}
console.log('\nDone ->', OUT);
