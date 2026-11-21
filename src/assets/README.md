# Assets

Artwork, logo, fonts and video links for the Grand Theft Developer portfolio. All artwork is our own (AI-generated); nothing here is Rockstar's.

`site/` holds the prepared artwork and backdrop videos. `source/` and `brand/` hold the originals, and `hosted-media.json` records the earlier Cloudinary sources.

```
assets/
├── brand/
│   ├── logo-poster.png       original gradient VI and Grand Theft Developer wordmark
│   └── loader-logo.svg       the loading screen's shape: the wordmark's letters in one colour
├── fonts/                    Outfit (variable) + Barlow Condensed 700/900, SIL Open Font License, latin subset
├── hosted-media.json         Archive of the earlier Cloudinary sources
├── source/                   originals, before they were cut to size
│   ├── posters/      941×1672   full-stack-developer, off-the-clock, sunset-codeposter, the-heist-case-study
│   ├── squares/      ~1254²     achievements, beachfront-classic-car, performance-speedboat, supercar-projects-tower, supercar-tech-stack
│   ├── scenes/       ~16:9      after-hours-nightclub (1024×572), code-master-supercar, projects-developer-supercar, rooftop-full-stack, site-glow-hotel-sign (2:1), sportbike-rider
│   ├── banners/      ~5:2       alligator-float (2:1), sunset-coast, vault-heist
│   ├── projects/     1254²      monster-app, book-my-ticket, portfolio-website, plus the original sample posters
│   ├── clients/      1254²      happy-clients-key-rack, miami-postcard-testimonial
│   ├── experience/   1254²      Codeshor and CSTEP illustrations
│   ├── backdrops/               Layered foreground and background illustrations for Services and Indore
│   ├── blog/         1672×941   agentic-engineering-2026, ai-agents-escaped, system-design-architecture
│   ├── hero-illustrations/   AshuLabs portrait and scene masters for the homepage collage
│   └── hero-masks/   desktop/ and mobile/: the outline of each of the hero intro's 10 pieces
└── site/                     prepared section images
    ├── hero/                 desktop/ and mobile/: shard-01…10, poster, logo-vi, logo-gta, poster-logo
    ├── meet-the-developer/   scene, project-showcase-desktop, project-showcase-mobile, card-1…3
    ├── services/             card-tall-desktop, card-tall-mobile, card-short
    ├── highlights/           remote-work, dev-community, tech-tambola, movie-night (the four wide cards under Indore, India)
    ├── clients/              clients, testimonial
    ├── experience/           codeshor, cstep
    ├── blog/                 post-1…3
    └── footer/               logo
```

## Branding, fonts and hosted video

| File | Purpose |
|---|---|
| `public/favicon.svg` | Shared AL monogram used by the AshuLabs favicon, loader, navbar, hero and footer. |
| `brand/loader-logo.svg` | Original Grand Theft Developer loader asset. |
| `brand/logo-poster.png` | Transparent master of the original VI and wordmark. |
| `fonts/outfit-variable.woff2` | Outfit variable sans-serif for body text. |
| `fonts/barlow-condensed-700.woff2` | Barlow Condensed bold (700) for display text. |
| `fonts/barlow-condensed-900.woff2` | Barlow Condensed black (900) for display text. |
| `hosted-media.json` | Archive of the earlier Cloudinary backdrop sources. |

## Hero

Each of these four files exists in both `site/hero/desktop/` and `site/hero/mobile/`.

| File | Purpose |
|---|---|
| `poster.avif` | Assembled collage background for the static hero. The desktop version is 2560 × 1440 and the mobile version is 640 × 640. |
| `poster-logo.avif` | Transparent export of the AshuLabs monogram and the Ashutosh Singh wordmark together. |
| `logo-vi.avif` | Transparent export of the AshuLabs AL monogram. |
| `logo-gta.avif` | Transparent export of the Ashutosh Singh wordmark. |

The hero renders the shared AL SVG and a live heading. The AVIF logo exports retain their existing filenames. To rebuild both sets from the WebP illustrations, PNG masks, and brand assets, run `python tools/build_hero_art.py` from the project root with Pillow 12.3+ and Playwright Chromium installed.

Run `python tools/build_project_art.py` with Pillow 12.3+ to export the square project cards and the responsive project showcase banner.

Run `python tools/build_highlight_art.py` with Pillow 12.3+ to export the illustrated highlight banners.

Each row covers one numbered AVIF in each `site/hero/` layout folder and its PNG mask in the corresponding `source/hero-masks/` layout folder. The AVIF is a transparent artwork layer for the animated intro. The PNG is the black-and-white shape used to cut that layer. Desktop shards and masks are 2560 × 1440. Mobile shards and masks are 1366 × 1366.

| File stem | Desktop artwork source | Mobile artwork source |
|---|---|---|
| `shard-01` | `coffee.webp` | `coupe.webp` |
| `shard-02` | `builder.webp` | `builder.webp` |
| `shard-03` | `rooftop.webp` | `city.webp` |
| `shard-04` | `city.webp` | `coffee.webp` |
| `shard-05` | `sketches.webp` | `rooftop.webp` |
| `shard-06` | `systems.webp` | `skyline.webp` |
| `shard-07` | `keyboard.webp` | `keyboard.webp` |
| `shard-08` | `motorbike.webp` | `sketches.webp` |
| `shard-09` | `coupe.webp` | `systems.webp` |
| `shard-10` | `skyline.webp` | `motorbike.webp` |

The motorcycle panel shows Ashutosh seated on the bike. The sports coupe panel shows him standing in front of the car.

## Section images

| Prepared file | Page slot | Original |
|---|---|---|
| `site/meet-the-developer/scene.avif` | Meet the Developer pinned Indore scene. | `source/scenes/meet-indore-desktop.webp` |
| `site/meet-the-developer/scene-portrait.avif` | Portrait composition for the pinned Indore scene. | `source/scenes/meet-indore-portrait.webp` |
| `site/meet-the-developer/project-showcase-desktop.avif` | Project showcase, wide crop. | `source/banners/project-showcase.png` |
| `site/meet-the-developer/project-showcase-mobile.avif` | Project showcase, portrait crop. | `source/banners/project-showcase.png` |
| `site/meet-the-developer/monster-app.avif` | Monster App project card. | `source/projects/monster-app.png` |
| `site/meet-the-developer/book-my-ticket.avif` | Book My Ticket project card. | `source/projects/book-my-ticket.png` |
| `site/meet-the-developer/portfolio-website.avif` | Portfolio Website project card. | `source/projects/portfolio-website.png` |
| `site/services/card-tall-desktop.avif` | Personalized Code Rescue neon hotel-sign card, desktop crop. | `source/scenes/site-glow-hotel-sign.png` |
| `site/services/card-tall-mobile.avif` | Personalized Code Rescue neon hotel-sign card, portrait crop. | `source/scenes/site-glow-hotel-sign.png` |
| `site/services/card-short.avif` | Personalized Full-Stack / Builds rooftop card. | `source/scenes/rooftop-full-stack.png` |
| `site/highlights/remote-work.avif` | Open to Work highlight, sunset rooftop workspace. | `source/banners/remote-work.png` |
| `site/highlights/dev-community.avif` | After Hours highlight, developer meetup. | `source/banners/dev-community.png` |
| `site/highlights/tech-tambola.avif` | Tech Tambola case study highlight, event control desk. | `source/banners/tech-tambola.png` |
| `site/highlights/movie-night.avif` | Off the Clock highlight, cinema scene. | `source/banners/movie-night.png` |
| `site/experience/codeshor.avif` | Codeshor Technologies work experience card. | `source/experience/codeshor.webp` |
| `site/experience/cstep.avif` | CSTEP work experience card. | `source/experience/cstep.webp` |
| `site/blog/post-1.avif` | In Love With the Machine, Not the Race cover. | `source/blog/in-love-with-the-machine-not-the-race.png` |
| `site/blog/post-2.avif` | Are Certificates Dead? cover. | `source/blog/are-certificates-dead.png` |
| `site/blog/post-3.avif` | Understanding Large Language Models cover. | `source/blog/understanding-large-language-models-llms.png` |
| `site/footer/logo.avif` | Archived VI and Grand Theft Developer footer logo. | `brand/logo-poster.png` |

Run `python tools/build_meet_backdrop.py` to export both Meet the Developer backdrop AVIFs.
Run `python tools/build_blog_art.py` to export the Blog card covers.
Run `python tools/build_experience_art.py` to export the Work Experience card art.

## Folder metadata

This `README.md` documents the inventory. `.DS_Store`, `site/.DS_Store` and `source/.DS_Store` are macOS Finder metadata with no app role.

## Notes

- `site/` images are cut to the live site's slot sizes. Square art that fills a wide or tall slot is placed whole, with the rest of the slot filled by a blurred extension of it, so titles baked into the art stay readable. Nothing is upscaled.
- To change a picture, replace its original in `source/` and re-cut it to the same size and name in `site/`.
- Run `python tools/build_backdrop_videos.py` with Pillow and FFmpeg available to render the Services and Indore videos from `source/backdrops/`. Use `--ffmpeg` to provide the executable path when FFmpeg is outside PATH. The renderer exports silent 24 fps MP4s with independently decodable frames and AVIF posters from their first decoded frames.
- Some artwork shows real company logos (the clients key rack, "certified" badges, product names). Label that content as sample, or replace the art, before publishing a real portfolio.
