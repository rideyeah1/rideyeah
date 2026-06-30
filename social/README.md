# RideYeah · Social media brand assets

On-brand graphics for RideYeah's social profiles. Palette: ink `#0a0a0b`,
bone `#f7f6f3`, champagne gold `#c9a86a`. Fonts: Fraunces (serif headings) +
Manrope (sans). All generated from `src/build.mjs` (real fonts + the site's
`hero_suburban.jpg`, rendered with headless Chrome at 2× → exact-size PNG).

## Files

| File | Platform / use | Size (px) |
|---|---|---|
| `facebook-profile.png` | Facebook profile photo | 1080×1080 |
| `instagram-profile.png` | Instagram profile photo | 1080×1080 |
| `linkedin-profile.png` | LinkedIn profile photo (personal) | 1080×1080 |
| `facebook-cover-photo.png` | Facebook cover — **photo** style | 1702×630 |
| `facebook-cover-clean.png` | Facebook cover — **clean** style | 1702×630 |
| `linkedin-banner-photo.png` | LinkedIn banner (personal) — **photo** | 1584×396 |
| `linkedin-banner-clean.png` | LinkedIn banner (personal) — **clean** | 1584×396 |
| `ad-square.png` | Promo post — **warm/human** (chauffeur) — universal | 1080×1080 |
| `ad-portrait.png` | Promo post — **warm/human** (chauffeur) — IG/FB | 1080×1350 |
| `ad-luxury-square.png` | Promo post — **luxury/editorial** (hero SUV) — universal | 1080×1080 |
| `ad-luxury-portrait.png` | Promo post — **luxury/editorial** (hero SUV) — IG/FB | 1080×1350 |
| `highlight-airport.png` | IG story-highlight cover — Airport (plane) | 1080×1080 |
| `highlight-fleet.png` | IG story-highlight cover — Fleet (vehicle) | 1080×1080 |
| `highlight-routes.png` | IG story-highlight cover — Routes (route) | 1080×1080 |
| `highlight-book.png` | IG story-highlight cover — Book (calendar) | 1080×1080 |
| `linkedin-company-logo.png` | LinkedIn **Company Page** logo (square) | 400×400 |
| `linkedin-company-cover-photo.png` | LinkedIn Company Page cover — **photo** | 2256×382 |
| `linkedin-company-cover-clean.png` | LinkedIn Company Page cover — **clean** | 2256×382 |
| `post-airport.png` | Sequence post — Airport (owner photo + overlay) | 1080×1080 |
| `post-fleet.png` | Sequence post — Fleet (owner photo + overlay) | 1080×1080 |
| `post-routes.png` | Sequence post — Routes (owner photo + overlay) | 1080×1080 |
| `post-book.png` | Sequence post — Book (owner photo + overlay) | 1080×1080 |

The profile photo is one consistent design (monogram on ink) reused across all
three networks. For each cover there are two styles — pick one per network.

## Usage notes / safe zones

- **Profile photos** are circle-cropped by every platform; the design is centred
  so nothing is clipped. Upload at 1080×1080; platforms downscale cleanly.
- **Facebook cover:** shown ~820×312 on desktop. On mobile FB crops the sides a
  bit — the logo + headline sit in the left-centre and stay readable, but keep an
  eye on it. Contact line is bottom-right (clears the page avatar at bottom-left).
- **LinkedIn banner (personal):** the avatar sits bottom-left, so the text block
  is lifted and the contact line is bottom-right to stay clear.

## Regenerate / tweak

```sh
node social/src/get-fonts.mjs      # one-time: fetch brand fonts → fonts.css
node social/src/build.mjs          # render all 7 PNGs into social/
node social/src/build.mjs cover    # render only matching names (substring filter)
```

Taglines, photo, sizes and layout are all config in `src/build.mjs`
(`fbBase` / `liBase` / `tplProfile`).
