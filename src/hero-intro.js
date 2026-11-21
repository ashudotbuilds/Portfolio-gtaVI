import gsap from 'gsap'

// Each row maps a shard to its entrance time and projected depth. The desktop
// values were fitted to the recording, whose first visible movement is at 4.8s.
const desktopFlight = [
  [2, 0, 2.17],
  [1, 0.04, 1.77],
  [3, 0.07, 2.18],
  [4, 0.14, 2.61],
  [5, 0.19, 3.72],
  [6, 0.23, 3.74],
  [7, 0.27, 3.81],
  [8, 0.30, 7.83],
  [9, 0.33, 6.28],
  [10, 0.84, 0],
]

const mobileFlight = [
  [2, 0, 2.17],
  [7, 0.04, 1.77],
  [5, 0.07, 2.18],
  [4, 0.14, 2.61],
  [3, 0.19, 3.72],
  [1, 0.23, 3.74],
  [10, 0.27, 3.81],
  [8, 0.30, 7.83],
  [9, 0.33, 6.28],
  [6, 0.84, 0],
]

export async function waitForHero(site, loader, includeIntro) {
  const selector = includeIntro ? '.hero-artwork img' : '.hero-poster img, .hero-brand img'
  const images = [...site.querySelectorAll(selector), loader.querySelector('img')]
  const fonts = [
    '600 1rem Outfit',
    '700 1rem "Barlow Condensed"',
    '900 1rem "Barlow Condensed"',
  ]

  const [decoded] = await Promise.all([
    Promise.all(images.map(async (image) => {
      try {
        await image.decode()
        return true
      } catch {
        return image.complete && image.naturalWidth > 0
      }
    })),
    Promise.allSettled(fonts.map((font) => document.fonts.load(font))),
  ])
  // A missing loader mark can use the overlay background while the hero loads.
  return decoded.slice(0, -1).every(Boolean)
}

export function playHeroIntro(site, loader, compact, onComplete) {
  const artwork = site.querySelector('.hero-artwork')
  const intro = artwork.querySelector('.hero-intro')
  const poster = artwork.querySelector('.hero-poster')
  const wordmark = artwork.querySelector('.hero-brand-name')
  const mark = artwork.querySelector('.hero-brand-mark')
  const shade = artwork.querySelector('.hero-brand-shade')
  const header = site.querySelector('.site-header')
  const cta = site.querySelector('.hero-details .hire-link')
  const details = site.querySelectorAll('.hero-details > :not(.hire-link)')
  const flight = compact ? mobileFlight : desktopFlight
  const layers = flight.map(([id, entrance, depth]) => ({
    element: intro.querySelector(`[data-layer="shard-${String(id).padStart(2, '0')}"]`),
    entrance,
    depth,
  }))
  const projected = [...layers, { element: mark, depth: 4.5 }, { element: wordmark, depth: 4.9 }]
  const cameraEase = gsap.parseEase('power2.inOut')
  const depthEase = gsap.parseEase('power3.inOut')
  const clock = { time: 0 }
  const origin = `50% ${window.innerHeight / 2 - artwork.getBoundingClientRect().top}px`

  function project() {
    // The recording first exposes the artwork while the camera is already pulling back.
    const camera = 1 + 0.462 * (1 - cameraEase(Math.min(1, (clock.time + 1.438) / 3.571)))
    const remainingDepth = 1 - depthEase(Math.min(1, (clock.time + 1.909) / 3.133))
    for (const { element, depth } of projected) {
      const scale = camera / Math.max(0.42, 1 - depth * remainingDepth)
      element.style.transform = `scale(${scale})`
    }
  }

  return gsap.context(() => {
    gsap.set(projected.map(({ element }) => element), { opacity: 0, transformOrigin: origin })
    gsap.set(intro, { visibility: 'visible', opacity: 0 })
    gsap.set([poster, shade, header, cta, ...details], { opacity: 0 })
    gsap.set(wordmark, { '--wordmark-reveal': '0%' })
    gsap.set(layers[0].element, { opacity: 0.12 })
    project()

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      paused: document.hidden,
      onComplete: () => {
        document.removeEventListener('visibilitychange', syncVisibility)
        onComplete()
      },
    })
    function syncVisibility() {
      timeline.paused(document.hidden)
    }
    document.addEventListener('visibilitychange', syncVisibility)

    timeline.to(clock, { time: 2.15, duration: 2.15, onUpdate: project }, 0)
    timeline.to(loader, { autoAlpha: 0, duration: 0.55, ease: 'sine.inOut' }, 0)
    // The reference exposes the shards in shadow, then lifts the whole collage
    // as the camera settles. Keep this exposure change on the intro layers.
    timeline.to(intro, { opacity: 0.38, duration: 0.75, ease: 'sine.out' }, 0)
    timeline.to(intro, { opacity: 1, duration: 1.4, ease: 'sine.inOut' }, 0.75)

    for (const { element, entrance } of layers) {
      timeline.to(element, { opacity: 1, duration: 0.56, ease: 'sine.inOut' }, entrance)
    }

    timeline.to(mark, { opacity: 0.8, duration: 0.67, ease: 'sine.inOut' }, 0.19)
    timeline.to(shade, { opacity: 1, duration: 0.72, ease: 'sine.inOut' }, 0.46)
    timeline.to(wordmark, { opacity: 1, duration: 0.36, ease: 'sine.inOut' }, 1.05)
    timeline.to(wordmark, { '--wordmark-reveal': '114%', duration: 0.76, ease: 'sine.inOut' }, 1.05)
    timeline.to(cta, { opacity: 1, duration: 0.76, ease: 'sine.inOut' }, 1.42)
    timeline.to([header, ...details], { opacity: 1, duration: 0.78, ease: 'sine.inOut' }, 1.56)
    timeline.set([mark, wordmark], { clearProps: 'transform,transformOrigin' }, 2.15)
    timeline.to(poster, { opacity: 1, duration: 0.17, ease: 'sine.inOut' }, 2.15)
    timeline.to(intro, { opacity: 0, duration: 0.16, ease: 'sine.inOut' }, 2.25)
    return () => document.removeEventListener('visibilitychange', syncVisibility)
  }, site)
}
