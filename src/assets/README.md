# Assets

Artwork, logo, fonts and video links for the Grand Theft Developer portfolio. All artwork is our own (AI-generated); nothing here is Rockstar's.

`site/` holds the prepared AVIF artwork for the planned page sections. `source/` and `brand/` hold the originals, and `hosted-media.json` points at the videos on Cloudinary. The current placeholder imports the footer logo and registers the three fonts. The section images and videos are for the full portfolio.

```
assets/
├── brand/
│   ├── logo-poster.png       full logo (gradient VI + "grand theft developer"); the hero logo layers and the footer logo are cut from it
│   └── loader-logo.svg       the loading screen's shape: the wordmark's letters in one colour
├── fonts/                    Outfit (variable) + Barlow Condensed 700/900, SIL Open Font License, latin subset
├── hosted-media.json         Cloudinary links to the two scroll-scrubbed videos (services, city)
├── source/                   originals, before they were cut to size
│   ├── posters/      941×1672   full-stack-developer, off-the-clock, sunset-codeposter, the-heist-case-study
│   ├── squares/      ~1254²     achievements, beachfront-classic-car, performance-speedboat, supercar-projects-tower, supercar-tech-stack
│   ├── scenes/       ~16:9      after-hours-nightclub (1024×572), code-master-supercar, projects-developer-supercar, rooftop-full-stack, site-glow-hotel-sign (2:1), sportbike-rider
│   ├── banners/      ~5:2       alligator-float (2:1), sunset-coast, vault-heist
│   ├── projects/     1254²      3d-basketball-website, ai-book-assistant, react-native-language-app
│   ├── clients/      1254²      happy-clients-key-rack, miami-postcard-testimonial
│   ├── blog/         1672×941   agentic-engineering-2026, ai-agents-escaped, system-design-architecture
│   └── hero-masks/   desktop/ and mobile/: the outline of each of the hero intro's 10 pieces
└── site/                     prepared section images
    ├── hero/                 desktop/ and mobile/: shard-01…10, poster, logo-vi, logo-gta, poster-logo
    ├── meet-the-developer/   scene, featured-desktop, featured-mobile, card-1…3
    ├── services/             card-tall-desktop, card-tall-mobile, card-short
    ├── highlights/           open-to-work, after-hours, the-heist, off-the-clock (the four wide cards under Miami, USA.)
    ├── clients/              clients, testimonial
    ├── blog/                 post-1…3
    └── footer/               logo
```

## Branding, fonts and hosted video

| File | Purpose |
|---|---|
| `brand/loader-logo.svg` | Solid Grand Theft Developer wordmark for the loader. The favicon uses the same wordmark. |
| `brand/logo-poster.png` | Transparent master of the full VI and wordmark, used to prepare the hero and footer logos. |
| `fonts/outfit-variable.woff2` | Outfit variable sans-serif for body text. |
| `fonts/barlow-condensed-700.woff2` | Barlow Condensed bold (700) for display text. |
| `fonts/barlow-condensed-900.woff2` | Barlow Condensed black (900) for display text. |
| `hosted-media.json` | Cloudinary video manifest. The `services` clip shows the beachfront developer turning his head and goes behind the Services cards. The `city` clip pulls back from the sportbike into the street for Miami, USA. |

## Hero

Each of these four files exists in both `site/hero/desktop/` and `site/hero/mobile/`.

| File | Purpose |
|---|---|
| `poster.avif` | Assembled collage background for the static hero. The desktop version is 2560 × 1440 and the mobile version is 640 × 640. |
| `poster-logo.avif` | Combined transparent logo to place over the static collage. |
| `logo-vi.avif` | Illustrated VI layer for the animated intro. |
| `logo-gta.avif` | White Grand Theft Developer wordmark layer for the animated intro. |

Each row covers one numbered AVIF in each `site/hero/` layout folder and its PNG mask in the corresponding `source/hero-masks/` layout folder. The AVIF is a transparent artwork layer for the animated intro. The PNG is the black-and-white shape used to cut that layer. Desktop shards and masks are 2560 × 1440. Mobile shards and masks are 1366 × 1366.

| File stem | Desktop artwork source | Mobile artwork source |
|---|---|---|
| `shard-01` | `source/posters/off-the-clock.png` | `source/squares/beachfront-classic-car.png` |
| `shard-02` | `source/squares/beachfront-classic-car.png` | `source/scenes/code-master-supercar.png` |
| `shard-03` | `source/scenes/code-master-supercar.png` | `source/squares/supercar-tech-stack.png` |
| `shard-04` | `source/posters/the-heist-case-study.png` | `source/posters/off-the-clock.png` |
| `shard-05` | `source/posters/sunset-codeposter.png` | `source/posters/the-heist-case-study.png` |
| `shard-06` | `source/squares/supercar-tech-stack.png` | `source/scenes/rooftop-full-stack.png` |
| `shard-07` | `source/squares/performance-speedboat.png` | `source/scenes/sportbike-rider.png` |
| `shard-08` | `source/posters/full-stack-developer.png` | `source/squares/performance-speedboat.png` |
| `shard-09` | `source/squares/achievements.png` | `source/squares/supercar-projects-tower.png` |
| `shard-10` | `source/scenes/rooftop-full-stack.png` | `source/squares/achievements.png` |

## Section images

| Prepared file | Page slot | Original |
|---|---|---|
| `site/meet-the-developer/scene.avif` | Meet the Developer pinned supercar scene. | `source/scenes/projects-developer-supercar.png` |
| `site/meet-the-developer/featured-desktop.avif` | Ride Along featured card, wide crop. | `source/scenes/sportbike-rider.png` |
| `site/meet-the-developer/featured-mobile.avif` | Ride Along featured card, portrait crop. | `source/scenes/sportbike-rider.png` |
| `site/meet-the-developer/card-1.avif` | AI Book Assistant project card. | `source/projects/ai-book-assistant.png` |
| `site/meet-the-developer/card-2.avif` | 3D Basketball Website project card. | `source/projects/3d-basketball-website.png` |
| `site/meet-the-developer/card-3.avif` | React Native Language App project card. | `source/projects/react-native-language-app.png` |
| `site/services/card-tall-desktop.avif` | Code Rescue neon hotel-sign card, desktop crop. | `source/scenes/site-glow-hotel-sign.png` |
| `site/services/card-tall-mobile.avif` | Code Rescue neon hotel-sign card, portrait crop. | `source/scenes/site-glow-hotel-sign.png` |
| `site/services/card-short.avif` | Full-Stack / Builds rooftop card. | `source/scenes/rooftop-full-stack.png` |
| `site/highlights/open-to-work.avif` | Open to Work highlight, sunset coast. | `source/banners/sunset-coast.png` |
| `site/highlights/after-hours.avif` | After Hours highlight, nightclub scene. | `source/scenes/after-hours-nightclub.png` |
| `site/highlights/the-heist.avif` | The Heist case study highlight, vault scene. | `source/banners/vault-heist.png` |
| `site/highlights/off-the-clock.avif` | Off the Clock highlight, alligator pool float. | `source/banners/alligator-float.png` |
| `site/clients/clients.avif` | Sample Clients card, key rack. | `source/clients/happy-clients-key-rack.png` |
| `site/clients/testimonial.avif` | Sample Review card, Miami postcard. | `source/clients/miami-postcard-testimonial.png` |
| `site/blog/post-1.avif` | 700 AI Agents Escaped and Became Hackers cover. | `source/blog/ai-agents-escaped.png` |
| `site/blog/post-2.avif` | Agentic Engineering in 2026 cover. | `source/blog/agentic-engineering-2026.png` |
| `site/blog/post-3.avif` | Think System Design & Architecture cover. | `source/blog/system-design-architecture.png` |
| `site/footer/logo.avif` | Transparent footer logo, also used by the placeholder page. | `brand/logo-poster.png` |

## Folder metadata

This `README.md` documents the inventory. `.DS_Store`, `site/.DS_Store` and `source/.DS_Store` are macOS Finder metadata with no app role.

## Notes

- `site/` images are cut to the live site's slot sizes. Square art that fills a wide or tall slot is placed whole, with the rest of the slot filled by a blurred extension of it, so titles baked into the art stay readable. Nothing is upscaled.
- To change a picture, replace its original in `source/` and re-cut it to the same size and name in `site/`.
- To change a video, put its Cloudinary URL in `hosted-media.json`.
- Some artwork shows real company logos (the clients key rack, "certified" badges, product names). Label that content as sample, or replace the art, before publishing a real portfolio.
