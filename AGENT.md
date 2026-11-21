# Grand Theft Developer: a GTA VI-style developer portfolio

A developer portfolio built on the layout and motion of the GTA VI website (https://www.rockstargames.com/VI). Fan-made, not affiliated with Rockstar Games.

- **Layout and motion** match the live site exactly: layout, type scale, colours, timing and easing.
- **Content and artwork** are ours: the text in `CONTENT.md`, and the illustrations, logo and videos in `src/assets/`.

## Inputs

1. The user's prompts.
2. This file, and `CONTENT.md` for every word on the page.
3. `src/assets/` (artwork, logo, fonts, `hosted-media.json`) and the screen recordings in `src/references/`.
4. The live site: the source for layout, sizes, timing and motion only.

There is no earlier code, notes or known values. Never assume a value from memory or from how similar sites usually work; find it on the live site.

## Stack

React + Vite, Tailwind CSS, GSAP (ScrollTrigger), Lenis for smooth scrolling. Plain JavaScript, no TypeScript.

## Method: Record → Measure → Extract → Rebuild → Diff

1. **Record:** `src/references/` holds one screen recording per section of the live site. They are the reference for motion and never ship.
2. **Measure:** with playwright-core and headless Chrome, dump computed styles and bounding boxes from the live site, sampling every 50px of scroll at 375, 768, 1024, 1440, 1920 and 2560px wide, plus phone landscape.
3. **Extract:** read the live site's front-end code for exact triggers, durations, eases and values. Prefer these to values fitted from recordings.
4. **Rebuild:** build from the numbers.
5. **Diff:** run the same measurement on localhost and compare.

Rules:
- Measure before building. When something looks off, measure both sites; never adjust by eye.
- Before trusting live-site numbers, check that headless Chrome received the same page a real browser does (compare with the recordings).
- When a value breaks the pattern found so far, measure it at every width instead of forcing it into the pattern.

## Definition of done

A section is done only when:
- its diff is within 1px / 1% at every width above. Mobile is part of the section, never a follow-up;
- its motion matches its recording, checked frame by frame;
- its handoffs work: what happens to the previous section as it arrives, pins, navbar changes, and the cursor glow (a soft light behind the page that follows the pointer: match its size, colour, blur, layering, and when it fades or returns);
- its text fits its artwork;
- `prefers-reduced-motion: reduce` gives a readable, static version, and everything clickable works by keyboard with a visible focus outline;
- nothing earlier broke: re-run earlier sections' checks after changing shared code.

Report what was checked and what still doesn't match.

## Tools

- Measuring and diff scripts live in `tools/` and stay reusable: they take a URL, a viewport width and selectors.
- Measurement output and temporary files go in `.measure/`, which is git-ignored.

## Assets

```
src/assets/
  brand/              the logo poster (VI + wordmark) and the loader logo
  fonts/              Outfit and Barlow Condensed (free, Google Fonts)
  site/               every image the page loads, already cut to size
    hero/             collage pieces + logo layers, desktop + mobile
    meet-the-developer/  services/  highlights/  experience/  blog/  footer/
  source/             the original artwork, grouped by shape, and the hero piece outlines
  hosted-media.json   Archive of the original hosted backdrop sources
```

- Use `site/` as delivered and never edit it by hand. If a slot needs a different crop, re-cut it from `source/` with a script in `tools/`.
- On the first pass through the assets, record which file belongs to which section under Findings, and keep that map current.

## Artwork

Our own artwork only. Never download, hotlink or trace Rockstar's images, video, logos or fonts.

- Measure each artwork slot on the live site (box size, aspect ratio, crop, focal point) at every width and fit our art to it. Never upscale past the original size. When square art fills a wide or tall slot, place it whole and fill the rest with a blurred extension, so text baked into the art stays readable.
- Check every crop at desktop and phone widths: the subject stays in view and clear of the text over it. Put a card's text on the side where the art leaves room.
- **Hero:** match the live site's layer count, canvas size and positions so the intro lines up; measure them first. The poster shown after the intro must match the intro's last frame pixel for pixel, or the logo flickers at the swap. All logo layers come from the same source, so they stack exactly.
- If no asset fits a slot, use a plain placeholder of the right size and list it under Open differences.

## Scroll-scrubbed videos

- Build the local renditions from the layered illustrations in `src/assets/source/backdrops/` with `tools/build_backdrop_videos.py`. The site imports the prepared files in `src/scroll-scenes.js`.
- Keep every frame, use a keyframe for each frame, drop the audio, and give portrait phones a 9:16 crop that follows the subject. Use the first frame of the same crop for the poster.
- Check each video's real length and frame count before mapping it to scroll, and how many pixels of scroll each frame gets. If a short clip would step, play it over part of the scroll range and hold the first and last frames either side.

## Page map

| Live section | Our section |
|---|---|
| Loader | Loader, with our loader logo as the shape |
| Navbar | AL monogram, menu icon, and a "Hire Me" pill that appears as the hero scrolls away |
| Hero (layered intro) | Our collage and logo, tagline, "Hire Me" button, tech tags |
| Launch Trailer | Meet the Developer: pinned scene, a wide featured card, and three project cards |
| Ultimate Edition | Services: scroll-scrubbed video backdrop and two service cards |
| Vice City, USA. | Indore, India: bio over the scroll-scrubbed city video |
| Feature cards | Four wide cards: Open to Work, After Hours, Case Study, Off the Clock |
| Shop | Work Experience: Codeshor Technologies and CSTEP |
| Featured News | Blog: three posts |
| Footer | Shared AL monogram, project inquiry panel, socials, links, "Rated D for Developer" badge |

Keep our own titles whatever the live site's headings say, and don't build promo strips or banners above the page. When the live page has something this page map doesn't, ask the user before building it.

## Content

Use the content from `CONTENT.md`, next to this file: it holds every word on the page, section by section. Put it in one content file, `src/content.js`, with one object per section, and have components read from it. `CONTENT.md` is the source of truth: when it changes, update `src/content.js` to match. A viewer makes the site theirs by editing `CONTENT.md` and swapping the artwork. Several images have titles painted into them; the copy in `CONTENT.md` matches them, so if you change one, change the other.

- **Voice:** first person ("I build…"). The developer's name appears only in the page title, the meta description and the bio.
- **Samples:** the name, projects, clients, numbers and links are samples for viewers to replace. Keep every link in one `LINKS` object. Follow the individual card labels in `CONTENT.md`. Keep the hero artwork free of extra labels.

## Project memory

This file is the only context that carries between prompts and sessions. Keep it current so a new session can pick up exactly where the last one stopped.

- **Progress:** update it at the end of every task, before replying: done, in progress, next, and open differences from the live site. Write it for someone with no other context.
- **Findings:** add facts as they're established (asset map, how sizes scale, breakpoints, colours, fonts, code layout, non-obvious problems) with where each was measured.
- Keep both short. Delete anything proven wrong, and collapse finished work into one line.

## Git

- Commits are authored by the user. **Never add an AI co-author or attribution line** to commits or PRs.
- Commit only when asked. Never force-push.

## Progress

**Done:** Personalized both Services cards from Ashutosh portrait references and added generative AI and mobile app development to the build offering. Whole-page desktop and phone audit. Working section menu, swipeable mobile projects, cursor glow behind the pinned scenes, and locally served videos for Services and Miami. Personalized AshuLabs homepage art, including 20 intro shards, two matching posters and six brand exports. Added illustrated cards linking to Monster App, Book My Ticket and Portfolio Website in Meet the Developer. Updated the Indore about section with Ashutosh's current bio. Personalized the four highlights with portrait illustrations, January 2027 remote availability, Indore and Bhopal interests, and the Tech Tambola case study. Replaced the Ride Along feature with a portrait-led showcase linking to the three projects. Connected the footer socials, contact email, and public resume and added a project inquiry panel. Replaced the Vite README with portfolio documentation and four desktop and mobile screenshots.

**Contact:** Hire Me and Start a Project lead to the footer. The form submits to FormSubmit's AJAX endpoint and displays its result in place. Book a Call embeds the Cal.com profile and its event calendars in the footer.

**Hero:** The homepage tagline reads “Software Engineer.” The navbar AL mark renders at 1.95rem wide.

**Next:** Replace the existing public resume when a newer PDF is supplied.

**Motion and color:** The hero now reveals the collage and wordmark over 2.41 seconds after decoding. Desktop wheel input uses Lenis with the reference's 0.07 interpolation and 1.2 wheel multiplier. CSS keeps native fragment navigation and the phone keeps native touch scrolling. The shell, loader, and overlays use the dark navy sampled from the user's screenshot (`#131424`, with a `#171829` center and `#0f101d` edge). The artwork files are unchanged.

**Open differences:** The reference gains an outer purple frame near 7.8s, which the portfolio clips. Mobile uses its own shard order and card layouts. The live desktop loader stalled in automated Chrome with full motion enabled. The motion pass uses the six saved recordings, with aligned desktop hero captures and scroll-scene checks at seven viewport sizes.

## Findings

- The motion pass decoded 4,212 reference frames. Aligned hero captures, per-frame recording metrics, and local scroll traces are in `.measure/motion-pass/`. The screenshot comparison measured a mean RGB error of 0.61 out of 255 in a clear background region.

- The illustrated Services and Indore backdrops use layered art and camera moves. The Services camera moves toward Ashutosh and the gold coupe. The Indore camera pulls back from Ashutosh on the motorcycle to reveal Rajwada. Each composition has its own desktop and portrait camera settings.

- Work Experience presents the Codeshor Technologies full-stack role and the CSTEP automation internship as two illustrated cards, with navigation at `#experience`.

- The Blog cards link to Ashutosh's three posts and display their dates. The LLM card also displays “10 min read.”

- The Meet the Developer banner is a static image with a title. It uses a wide illustration and a dedicated portrait illustration at viewport aspect ratios of 4:5 or narrower. Both show Ashutosh with an ASUS Zenbook, a gold coupe and Rajwada Palace. The source and export paths are in the asset inventory.

- The desktop and mobile vehicle panels and their assembled posters show Ashutosh seated on the motorcycle and standing in front of the sports coupe.

- The live phone site presents the projects in a swipeable row and keeps the feature copy on the art. The portfolio now shares native scroll snapping and pagination across its phone project, client and blog rows. Full-page captures and presentation timings are under `.measure/full-audit/`. With the bundled, independently decodable frames, scripted Miami scrubs recorded maximum frame gaps of 50 ms at 1440 × 900 and 33 ms at 390 × 844.

- All 734 frames of `03-launch-trailer.mov` were decoded. The reference hero CTA fades out around 1.6s, the scene is mostly settled around 3.0s, the navbar CTA appears around 3.7s, and the featured card enters around 4.8s. These timestamps describe the recorded scroll. The portfolio uses separate scroll ranges for these beats, darkens its pinned artwork as the featured project showcase enters, and uses a right-weighted crop in phone portrait. Before-and-after Chrome captures and frame measurements are under `.measure/meet-review/`.

- The three lower-page recordings contain 2,392 frames total (654 Services, 950 city, 788 features through footer). The incoming pinned scenes fade in behind the outgoing cards, then the video darkens as the next cards or bio scroll over it. The lower cards stay sharp while the surrounding field softens. Before-and-after Chrome captures, reference luminance and edge measurements, and scroll-state samples are under `.measure/lower-review/`.

- `src/scroll-scenes.js` drives the hero handoff, backdrop lighting and video seek with ScrollTrigger. Both Services renditions contain 34 frames at 24 fps and both Indore renditions contain 149, with matching first-frame posters. Work Experience and Blog share a swipeable carousel on narrow screens and show the full row on desktop.

- The settled hero in `src/references/01-hero-intro.mp4` is visible around 7–9 seconds. The static portfolio uses its inset-poster composition and places desktop details below the artwork with the CTA centered. The navigation controls sit near the viewport edges.

- In the recorded desktop run, the collage first becomes visible near 4.8s, the VI near 5.0s, the wordmark near 5.8s and the details near 6.2s. `src/hero-intro.js` uses those offsets and fits the camera and depth easing to tracked frames. The preload hold varies with asset readiness. The animation crossfades into the decoded, combined poster to absorb encoding and edge differences between the separate layers.

- The desktop frame review at 1494 × 833 uses all 735 recording frames and 322 Chrome captures aligned at 4.800s. See `.measure/hero-frame-review/hero-frame-comparison.html`. The poster pixels match immediately before and after the animated layers are removed. A separate check at 375 × 812 showed no horizontal overflow, and reduced-motion mode displayed the static poster.

- The user's 1918 × 946 recording jumps directly from loader to poster. Chrome reproduces that path with `prefers-reduced-motion: reduce`; the sequence plays at the same viewport with `no-preference`. The local Windows client animation setting was off when checked via `SPI_GETCLIENTAREAANIMATION`.

- CSS clips the frame baked into the poster AVIFs. The home brand uses the AL mark from `public/favicon.svg` and the text “Ashutosh Singh” in a single layer shared by the intro and static hero. The timeline pauses while the tab is hidden.

- Keep the Meet backdrop hidden while the intro runs. Its scroll state is initialized after the intro completes, and the backdrop otherwise shows through the collage as the loader fades.

- The [asset inventory](src/assets/README.md) maps the AVIFs to their originals and intended page slots. `tools/build_hero_art.py` cuts the numbered layers from the personalized artwork with the existing PNG masks and composites those crops into the corresponding posters. It also exports the favicon monogram and name in the three AVIF logo slots per layout. The static hero uses the responsive `poster.avif` backgrounds with the shared AshuLabs brand layer.
- `src/index.css` registers the bundled Outfit variable font for body text and Barlow Condensed 700/900 for display type.
